/**
 * DarkAgent SDK — DeFi Transaction Simulation Engine
 * ====================================================
 * 
 * Simulates DeFi transactions before execution.
 * Analyzes: slippage, protocol verification, liquidation risk, spend limits.
 *
 * Flow:
 *   AI Action → Fork Simulation → Risk Engine → Pass/Fail → BitGo Execute
 *
 * Usage:
 *   const sim = new SimulationSDK(engineAddress, signer);
 *   const result = await sim.simulateSwap(agent, user, uniswapAddr, "1.0", "1800");
 *   if (result.passed) { // safe to execute }
 */

const { ethers } = require('ethers');

const SIMULATION_ENGINE_ABI = [
    "function simulate(address agent, address user, address targetProtocol, uint256 value, bytes calldata callData, uint256 expectedOutput, uint256 maxSpendAllowed, uint256 maxSlippageBps, address[] calldata allowedProtocols) external returns (bytes32 simId)",
    "function getSimulation(bytes32 simId) external view returns (tuple(bytes32 simId, bool passed, uint256 riskScore, uint256 estimatedSlippage, uint256 estimatedGas, bool protocolVerified, bool spendLimitOk, bool slippageOk, bool liquidationRisk, string failReason, uint256 simulatedAt))",
    "function getUserSimulations(address user) external view returns (bytes32[])",
    "function didSimulationPass(bytes32 simId) external view returns (bool)",
    "function totalSimulations() external view returns (uint256)",
    "function riskThreshold() external view returns (uint256)",
    "event SimulationExecuted(bytes32 indexed simId, address indexed agent, address indexed user, bool passed, uint256 riskScore)"
];

class SimulationSDK {
    /**
     * @param {string} engineAddress - Address of SimulationEngine contract
     * @param {ethers.Signer} signer - Connected signer
     */
    constructor(engineAddress, signer) {
        this.contract = new ethers.Contract(engineAddress, SIMULATION_ENGINE_ABI, signer);
        this.signer = signer;
    }

    /**
     * Run a full DeFi transaction simulation.
     *
     * @param {string} agent - Agent wallet address
     * @param {string} user - User address (alice.eth owner)
     * @param {string} targetProtocol - DeFi protocol address being called
     * @param {string} valueEth - Transaction value in ETH (e.g. "1.5")
     * @param {string} expectedOutputEth - Expected output in ETH equivalent
     * @param {string} callData - Hex calldata for the DeFi interaction
     * @param {string} maxSpendEth - User's max spend limit in ETH
     * @param {number} maxSlippageBps - User's max slippage in basis points
     * @param {string[]} allowedProtocols - Protocol addresses on allowlist
     * @returns {object} Simulation result
     */
    async simulate(
        agent,
        user,
        targetProtocol,
        valueEth,
        expectedOutputEth,
        callData = "0x",
        maxSpendEth = "0",
        maxSlippageBps = 0,
        allowedProtocols = []
    ) {
        const value = ethers.parseEther(valueEth);
        const expectedOutput = ethers.parseEther(expectedOutputEth);
        const maxSpend = ethers.parseEther(maxSpendEth);

        console.log(`\n[SimulationEngine] ═══════════════════════════════════`);
        console.log(`[SimulationEngine] DeFi Transaction Simulation`);
        console.log(`[SimulationEngine] ═══════════════════════════════════`);
        console.log(`  Agent:    ${agent}`);
        console.log(`  User:     ${user}`);
        console.log(`  Protocol: ${targetProtocol}`);
        console.log(`  Value:    ${valueEth} ETH`);
        console.log(`  Expected: ${expectedOutputEth} ETH`);
        console.log(`  Max Spend: ${maxSpendEth} ETH`);
        console.log(`  Max Slip: ${maxSlippageBps} bps`);

        const tx = await this.contract.simulate(
            agent,
            user,
            targetProtocol,
            value,
            ethers.getBytes(callData),
            expectedOutput,
            maxSpend,
            maxSlippageBps,
            allowedProtocols
        );
        const receipt = await tx.wait();

        // Parse event to get simId
        const event = receipt.logs.find(log => {
            try {
                const parsed = this.contract.interface.parseLog(log);
                return parsed && parsed.name === 'SimulationExecuted';
            } catch { return false; }
        });

        let simId;
        if (event) {
            const parsed = this.contract.interface.parseLog(event);
            simId = parsed.args.simId;
        }

        // Fetch full result
        const result = await this.contract.getSimulation(simId);

        const formattedResult = {
            simId: result.simId,
            passed: result.passed,
            riskScore: Number(result.riskScore),
            riskScoreNormalized: Number(result.riskScore) / 1000,
            estimatedSlippage: Number(result.estimatedSlippage),
            estimatedSlippagePercent: Number(result.estimatedSlippage) / 100,
            estimatedGas: Number(result.estimatedGas),
            protocolVerified: result.protocolVerified,
            spendLimitOk: result.spendLimitOk,
            slippageOk: result.slippageOk,
            liquidationRisk: result.liquidationRisk,
            failReason: result.failReason,
            simulatedAt: Number(result.simulatedAt)
        };

        this._printResult(formattedResult);
        return formattedResult;
    }

    /**
     * Convenience: Simulate a token swap.
     */
    async simulateSwap(agent, user, dexAddress, amountEth, expectedOutputEth, maxSpendEth, maxSlippageBps, allowedProtocols = []) {
        // Encode a mock swap calldata
        const swapSelector = ethers.id("swapExactETHForTokens(uint256,address[],address,uint256)").slice(0, 10);
        const callData = swapSelector + "0".repeat(56); // padded mock

        return this.simulate(
            agent, user, dexAddress,
            amountEth, expectedOutputEth,
            callData, maxSpendEth, maxSlippageBps,
            allowedProtocols
        );
    }

    /**
     * Convenience: Simulate a lending/borrow operation.
     */
    async simulateBorrow(agent, user, lendingAddress, amountEth, expectedOutputEth, maxSpendEth, maxSlippageBps) {
        // Encode borrow calldata to trigger liquidation risk detection
        const borrowSelector = ethers.id("borrow(address,uint256,uint256,uint16,address)").slice(0, 10);
        const callData = borrowSelector + "0".repeat(56);

        return this.simulate(
            agent, user, lendingAddress,
            amountEth, expectedOutputEth,
            callData, maxSpendEth, maxSlippageBps,
            []
        );
    }

    /**
     * Get simulation history for a user.
     */
    async getUserHistory(user) {
        const simIds = await this.contract.getUserSimulations(user);
        const results = [];

        for (const simId of simIds) {
            const result = await this.contract.getSimulation(simId);
            results.push({
                simId: result.simId,
                passed: result.passed,
                riskScore: Number(result.riskScore),
                failReason: result.failReason,
                simulatedAt: Number(result.simulatedAt)
            });
        }

        return results;
    }

    /**
     * Check if a specific simulation passed.
     */
    async didPass(simId) {
        return this.contract.didSimulationPass(simId);
    }

    /**
     * Get the current risk threshold.
     */
    async getRiskThreshold() {
        const threshold = await this.contract.riskThreshold();
        return { raw: Number(threshold), normalized: Number(threshold) / 1000 };
    }

    // ═══════════════════════════════════════════════════════════
    //                    INTERNAL HELPERS
    // ═══════════════════════════════════════════════════════════

    _printResult(result) {
        console.log(`\n[SimulationEngine] ── RESULT ──────────────────────────`);
        console.log(`  Status:       ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`  Risk Score:   ${result.riskScore}/1000 (${(result.riskScoreNormalized).toFixed(2)})`);
        console.log(`  Slippage:     ${result.estimatedSlippagePercent.toFixed(2)}%`);
        console.log(`  Gas Est:      ${result.estimatedGas}`);
        console.log(`  Protocol OK:  ${result.protocolVerified ? 'Yes' : 'No'}`);
        console.log(`  Spend OK:     ${result.spendLimitOk ? 'Yes' : 'No'}`);
        console.log(`  Slippage OK:  ${result.slippageOk ? 'Yes' : 'No'}`);
        console.log(`  Liq Risk:     ${result.liquidationRisk ? 'YES ⚠️' : 'No'}`);
        if (!result.passed) {
            console.log(`  Fail Reason:  ${result.failReason}`);
        }
        console.log(`[SimulationEngine] ──────────────────────────────────────\n`);
    }
}

module.exports = { SimulationSDK, SIMULATION_ENGINE_ABI };
