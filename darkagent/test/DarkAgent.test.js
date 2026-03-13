const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DarkAgent Protocol — Full End to End", function () {
    let darkAgent, ensResolver, agentRegistry, simulationEngine;
    let owner, agent1, agent2, user, newOwner;

    beforeEach(async function () {
        [owner, agent1, agent2, user, newOwner] = await ethers.getSigners();

        // 1. Deploy ENS Agent Resolver
        const Resolver = await ethers.getContractFactory("ENSAgentResolver");
        ensResolver = await Resolver.deploy();

        // 2. Deploy Agent Registry
        const Registry = await ethers.getContractFactory("AgentRegistry");
        agentRegistry = await Registry.deploy();

        // 3. Deploy Simulation Engine
        const SimEngine = await ethers.getContractFactory("SimulationEngine");
        simulationEngine = await SimEngine.deploy();

        // 4. Deploy DarkAgent with all dependencies
        const DarkAgent = await ethers.getContractFactory("DarkAgent");
        darkAgent = await DarkAgent.deploy(
            await ensResolver.getAddress(),
            await agentRegistry.getAddress(),
            await simulationEngine.getAddress()
        );

        // Setup ENS permissions for user
        await ensResolver.syncPermissions(
            user.address,
            ethers.parseEther("100"),  // maxSpend
            86400,                      // dailyLimit
            50,                         // slippageBps (0.5%)
            [],                         // tokens
            [],                         // protocols
            0,                          // expiry
            true                        // active
        );
    });

    // ═══════════════════════════════════════════════════════════
    //  FEATURE 1: ENS SUBDOMAINS AS AGENT LICENSES
    // ═══════════════════════════════════════════════════════════

    describe("Agent Registry — ENS Subdomain Licenses", function () {

        it("should create an agent license (subdomain)", async function () {
            const tx = await agentRegistry.connect(user).createAgent(
                "trading",
                agent1.address,
                ethers.parseEther("500"),
                86400,
                50,
                ["uniswap", "aave"],
                0
            );
            const receipt = await tx.wait();

            const event = receipt.logs.find(l => {
                try { return agentRegistry.interface.parseLog(l)?.name === 'AgentCreated'; }
                catch { return false; }
            });
            expect(event).to.not.be.undefined;

            const node = agentRegistry.interface.parseLog(event).args.node;
            const agent = await agentRegistry.getAgent(node);
            expect(agent.label).to.equal("trading");
            expect(agent.owner).to.equal(user.address);
            expect(agent.agentWallet).to.equal(agent1.address);
            expect(agent.active).to.be.true;
        });

        it("should verify agent wallet is authorized", async function () {
            await agentRegistry.connect(user).createAgent(
                "yield", agent1.address,
                ethers.parseEther("5000"), 86400, 50, ["aave", "compound"], 0
            );

            const isAuth = await agentRegistry.isAgentWalletAuthorized(agent1.address);
            expect(isAuth).to.be.true;

            const isAuth2 = await agentRegistry.isAgentWalletAuthorized(agent2.address);
            expect(isAuth2).to.be.false;
        });

        it("should support multiple agents per owner", async function () {
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, ["uniswap"], 0
            );
            await agentRegistry.connect(user).createAgent(
                "yield", agent2.address,
                ethers.parseEther("5000"), 86400, 25, ["aave"], 0
            );

            const count = await agentRegistry.getAgentCount(user.address);
            expect(Number(count)).to.equal(2);

            const nodes = await agentRegistry.getOwnerAgents(user.address);
            expect(nodes.length).to.equal(2);
        });

        it("should revoke (kill) an agent license", async function () {
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, [], 0
            );

            const node = await agentRegistry.computeNode(user.address, "trading");
            await agentRegistry.connect(user).revokeAgent(node);

            const agent = await agentRegistry.getAgent(node);
            expect(agent.active).to.be.false;

            const isAuth = await agentRegistry.isAgentWalletAuthorized(agent1.address);
            expect(isAuth).to.be.false;
        });

        it("should transfer an agent license to new owner", async function () {
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, [], 0
            );

            const node = await agentRegistry.computeNode(user.address, "trading");
            await agentRegistry.connect(user).transferAgent(node, newOwner.address);

            const agent = await agentRegistry.getAgent(node);
            expect(agent.owner).to.equal(newOwner.address);

            const newOwnerAgents = await agentRegistry.getOwnerAgents(newOwner.address);
            expect(newOwnerAgents.length).to.equal(1);
        });

        it("should prevent non-owner from revoking", async function () {
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, [], 0
            );

            const node = await agentRegistry.computeNode(user.address, "trading");
            
            // Should revert for non-owner
            let reverted = false;
            try {
                await agentRegistry.connect(agent1).revokeAgent(node);
            } catch (err) {
                reverted = true;
                expect(err.message).to.include("NotOwner");
            }
            expect(reverted).to.be.true;
        });
    });

    // ═══════════════════════════════════════════════════════════
    //  FEATURE 2: DEFI TRANSACTION SIMULATION
    // ═══════════════════════════════════════════════════════════

    describe("Simulation Engine — DeFi Risk Analysis", function () {

        it("should simulate a safe transaction", async function () {
            const tx = await simulationEngine.simulate(
                agent1.address,
                user.address,
                agent2.address, // mock protocol address
                ethers.parseEther("1"),
                ethers.toUtf8Bytes("swap 1 ETH"),
                ethers.parseEther("1"), // 1:1 expected
                ethers.parseEther("100"), // maxSpend
                50, // maxSlippage
                []  // no allowlist = permissive
            );
            const receipt = await tx.wait();

            const event = receipt.logs.find(l => {
                try { return simulationEngine.interface.parseLog(l)?.name === 'SimulationExecuted'; }
                catch { return false; }
            });
            expect(event).to.not.be.undefined;

            const parsed = simulationEngine.interface.parseLog(event);
            expect(parsed.args.passed).to.be.true;
        });

        it("should fail simulation when spend exceeds limit", async function () {
            const tx = await simulationEngine.simulate(
                agent1.address,
                user.address,
                agent2.address,
                ethers.parseEther("200"),  // way over limit
                ethers.toUtf8Bytes("swap 200 ETH"),
                ethers.parseEther("200"),
                ethers.parseEther("100"),  // maxSpend = 100
                50,
                []
            );
            const receipt = await tx.wait();
            const event = receipt.logs.find(l => {
                try { return simulationEngine.interface.parseLog(l)?.name === 'SimulationExecuted'; }
                catch { return false; }
            });
            const parsed = simulationEngine.interface.parseLog(event);
            expect(parsed.args.passed).to.be.false;

            const simId = parsed.args.simId;
            const result = await simulationEngine.getSimulation(simId);
            expect(result.spendLimitOk).to.be.false;
        });

        it("should detect risk for unverified protocol", async function () {
            const allowedProtocol = agent2.address;
            const unknownProtocol = owner.address; // not in allowlist

            const tx = await simulationEngine.simulate(
                agent1.address,
                user.address,
                unknownProtocol,
                ethers.parseEther("1"),
                ethers.toUtf8Bytes("swap"),
                ethers.parseEther("1"),
                ethers.parseEther("100"),
                50,
                [allowedProtocol] // only agent2 is allowed
            );
            const receipt = await tx.wait();
            const event = receipt.logs.find(l => {
                try { return simulationEngine.interface.parseLog(l)?.name === 'SimulationExecuted'; }
                catch { return false; }
            });
            const parsed = simulationEngine.interface.parseLog(event);
            
            // Should fail because target is not in allowlist
            // Risk score should be >= 400 (protocol penalty)
            const simId = parsed.args.simId;
            const result = await simulationEngine.getSimulation(simId);
            expect(result.protocolVerified).to.be.false;
            expect(result.failReason).to.equal("Target protocol not in allowlist");
            expect(Number(result.riskScore)).to.be.greaterThanOrEqual(400);
        });

        it("should track user simulation history", async function () {
            // Run 2 simulations
            await simulationEngine.simulate(
                agent1.address, user.address, agent2.address,
                ethers.parseEther("1"), ethers.toUtf8Bytes("tx1"),
                ethers.parseEther("1"), ethers.parseEther("100"), 50, []
            );
            await simulationEngine.simulate(
                agent1.address, user.address, agent2.address,
                ethers.parseEther("2"), ethers.toUtf8Bytes("tx2"),
                ethers.parseEther("2"), ethers.parseEther("100"), 50, []
            );

            const history = await simulationEngine.getUserSimulations(user.address);
            expect(history.length).to.equal(2);
        });
    });

    // ═══════════════════════════════════════════════════════════
    //  INTEGRATED FLOW: Agent License + Simulation + Verification
    // ═══════════════════════════════════════════════════════════

    describe("Full Integrated Pipeline", function () {

        it("should complete: create agent → propose → simulate → verify → execute", async function () {
            // 1. Create agent license
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, ["uniswap"], 0
            );

            // 2. Agent proposes action
            const action = ethers.toUtf8Bytes("swap 1 ETH to USDC");
            const proposeTx = await darkAgent.propose(agent1.address, user.address, action);
            const proposeReceipt = await proposeTx.wait();
            const proposeEvent = proposeReceipt.logs.find(l => {
                try { return darkAgent.interface.parseLog(l)?.name === 'ActionProposed'; }
                catch { return false; }
            });
            const proposalId = darkAgent.interface.parseLog(proposeEvent).args.proposalId;

            // 3. Simulate the transaction
            const simTx = await darkAgent.simulateProposal(
                proposalId,
                agent2.address, // mock protocol
                ethers.parseEther("1"),
                ethers.parseEther("1")
            );
            await simTx.wait();

            // 4. Verify (checks agent license + ENS rules + simulation)
            await darkAgent.verify(proposalId);
            const isVerified = await darkAgent.isVerified(proposalId);
            expect(isVerified).to.be.true;

            // 5. Execute
            await darkAgent.execute(proposalId);
            const proposal = await darkAgent.getProposal(proposalId);
            expect(proposal.executed).to.be.true;
        });

        it("should reject execution if agent license is revoked", async function () {
            // Create and then revoke agent
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, [], 0
            );
            const node = await agentRegistry.computeNode(user.address, "trading");
            await agentRegistry.connect(user).revokeAgent(node);

            // Try to verify — should fail because agent is not licensed
            const action = ethers.toUtf8Bytes("malicious swap");
            const tx = await darkAgent.propose(agent1.address, user.address, action);
            const receipt = await tx.wait();
            const event = receipt.logs.find(l => {
                try { return darkAgent.interface.parseLog(l)?.name === 'ActionProposed'; }
                catch { return false; }
            });
            const proposalId = darkAgent.interface.parseLog(event).args.proposalId;

            let reverted = false;
            try {
                await darkAgent.verify(proposalId);
            } catch (err) {
                reverted = true;
                expect(err.message).to.include("AgentNotLicensed");
            }
            expect(reverted).to.be.true;
        });

        it("should reject verification if ENS master switch is false", async function () {
            // Create agent license
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, [], 0
            );

            // Deactivate ENS
            await ensResolver.syncPermissions(
                user.address, 0, 0, 0, [], [], 0, false
            );

            const action = ethers.toUtf8Bytes("swap");
            const tx = await darkAgent.propose(agent1.address, user.address, action);
            const receipt = await tx.wait();
            const event = receipt.logs.find(l => {
                try { return darkAgent.interface.parseLog(l)?.name === 'ActionProposed'; }
                catch { return false; }
            });
            const proposalId = darkAgent.interface.parseLog(event).args.proposalId;

            let reverted = false;
            try {
                await darkAgent.verify(proposalId);
            } catch (err) {
                reverted = true;
                expect(err.message).to.include("Agent permissions inactive in ENS");
            }
            expect(reverted).to.be.true;
        });

        it("should reject if simulation failed", async function () {
            // Create agent license
            await agentRegistry.connect(user).createAgent(
                "trading", agent1.address,
                ethers.parseEther("500"), 86400, 50, [], 0
            );

            // Set strict ENS rules with low maxSpend
            await ensResolver.syncPermissions(
                user.address,
                ethers.parseEther("1"), // only 1 ETH max
                86400, 50, [], [], 0, true
            );

            // Propose
            const action = ethers.toUtf8Bytes("swap 100 ETH");
            const tx = await darkAgent.propose(agent1.address, user.address, action);
            const receipt = await tx.wait();
            const event = receipt.logs.find(l => {
                try { return darkAgent.interface.parseLog(l)?.name === 'ActionProposed'; }
                catch { return false; }
            });
            const proposalId = darkAgent.interface.parseLog(event).args.proposalId;

            // Simulate with value exceeding limit
            await darkAgent.simulateProposal(
                proposalId,
                agent2.address,
                ethers.parseEther("100"), // way over 1 ETH limit
                ethers.parseEther("100")
            );

            // Verify should fail because simulation failed
            let reverted = false;
            try {
                await darkAgent.verify(proposalId);
            } catch (err) {
                reverted = true;
                expect(err.message).to.include("SimulationFailed");
            }
            expect(reverted).to.be.true;
        });
    });
});
