const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("===============================================================");
    console.log("     DarkAgent — Full Protocol Deployment to Base Sepolia");
    console.log("===============================================================\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH\n");

    // 1. Deploy ENS Agent Resolver (ENSIP-XX standard)
    console.log("--- [1/4] Deploying ENS Agent Resolver (ENSIP-XX) ---");
    const Resolver = await ethers.getContractFactory("ENSAgentResolver");
    const resolver = await Resolver.deploy();
    await resolver.waitForDeployment();
    const resolverAddress = await resolver.getAddress();
    console.log("ENSAgentResolver deployed at:", resolverAddress);

    // 2. Deploy Agent Registry (ENS Subdomains as Agent Licenses)
    console.log("\n--- [2/4] Deploying Agent Registry (Subdomain Licenses) ---");
    const Registry = await ethers.getContractFactory("AgentRegistry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("AgentRegistry deployed at:", registryAddress);

    // 3. Deploy Simulation Engine (DeFi Transaction Simulation)
    console.log("\n--- [3/4] Deploying Simulation Engine (DeFi Risk Analysis) ---");
    const SimEngine = await ethers.getContractFactory("SimulationEngine");
    const simEngine = await SimEngine.deploy();
    await simEngine.waitForDeployment();
    const simEngineAddress = await simEngine.getAddress();
    console.log("SimulationEngine deployed at:", simEngineAddress);

    // 4. Deploy DarkAgent Core Protocol (integrates all three)
    console.log("\n--- [4/4] Deploying DarkAgent Core Protocol ---");
    const DarkAgent = await ethers.getContractFactory("DarkAgent");
    const darkAgent = await DarkAgent.deploy(resolverAddress, registryAddress, simEngineAddress);
    await darkAgent.waitForDeployment();
    const darkAgentAddress = await darkAgent.getAddress();
    console.log("DarkAgent Protocol deployed at:", darkAgentAddress);

    // Save deployment info for frontend
    const deployment = {
        network: "base-sepolia",
        chainId: 84532,
        deployer: deployer.address,
        contracts: {
            Permissions: resolverAddress,
            AgentRegistry: registryAddress,
            SimulationEngine: simEngineAddress,
            DarkAgent: darkAgentAddress
        },
        agents: {
            demoAgent: {
                address: "0x1111111111111111111111111111111111111111",
                ensName: "voting-agent.eth"
            }
        },
        deployedAt: new Date().toISOString()
    };

    const configPath = path.join(__dirname, "..", "frontend", "src", "contracts");
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath, { recursive: true });
    }
    fs.writeFileSync(
        path.join(configPath, "deployment.json"),
        JSON.stringify(deployment, null, 2)
    );
    console.log("\nDeployment info saved to frontend/src/contracts/deployment.json\n");

    console.log("===============================================================");
    console.log("  DEPLOYMENT COMPLETE");
    console.log("===============================================================");
    console.log(`  ENSAgentResolver:   ${resolverAddress}`);
    console.log(`  AgentRegistry:      ${registryAddress}`);
    console.log(`  SimulationEngine:   ${simEngineAddress}`);
    console.log(`  DarkAgent Protocol: ${darkAgentAddress}`);
    console.log("===============================================================\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });
