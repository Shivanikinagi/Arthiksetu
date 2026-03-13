// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimulationEngine — DeFi Transaction Simulation & Risk Engine
 * @author DarkAgent
 * @notice Simulates DeFi transactions before execution.
 *         Analyzes slippage, protocol validity, liquidation risk,
 *         and spend limits BEFORE any on-chain execution.
 *
 *  Flow:
 *    AI Action → Fork Simulation → Risk Engine → Pass/Fail
 *
 *  Risk Factors:
 *    - Slippage analysis
 *    - Protocol verification (is target on allowlist?)
 *    - Spend limit enforcement
 *    - Liquidation risk scoring
 *    - Anomaly detection (sudden large transfers)
 */
contract SimulationEngine {

    // ═══════════════════════════════════════════════════════════
    //                        STRUCTS
    // ═══════════════════════════════════════════════════════════

    struct SimulationRequest {
        address agent;
        address user;
        address targetProtocol;
        uint256 value;
        bytes callData;
        uint256 expectedOutput;   // expected output in target token
        uint256 timestamp;
    }

    struct SimulationResult {
        bytes32 simId;
        bool passed;
        uint256 riskScore;        // 0-1000 (0 = no risk, 1000 = max risk)
        uint256 estimatedSlippage; // in basis points
        uint256 estimatedGas;
        bool protocolVerified;
        bool spendLimitOk;
        bool slippageOk;
        bool liquidationRisk;
        string failReason;
        uint256 simulatedAt;
    }

    // ═══════════════════════════════════════════════════════════
    //                        STATE
    // ═══════════════════════════════════════════════════════════

    mapping(bytes32 => SimulationResult) public simulations;
    mapping(address => bytes32[]) public userSimulations;
    uint256 public totalSimulations;

    /// @dev Risk threshold. Proposals with riskScore > this are rejected.
    uint256 public riskThreshold = 400; // 0.4 * 1000

    // ═══════════════════════════════════════════════════════════
    //                        EVENTS
    // ═══════════════════════════════════════════════════════════

    event SimulationExecuted(
        bytes32 indexed simId,
        address indexed agent,
        address indexed user,
        bool passed,
        uint256 riskScore
    );

    event RiskThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);

    // ═══════════════════════════════════════════════════════════
    //                        ERRORS
    // ═══════════════════════════════════════════════════════════

    error SimulationNotFound(bytes32 simId);

    // ═══════════════════════════════════════════════════════════
    //                    CORE SIMULATION
    // ═══════════════════════════════════════════════════════════

    /**
     * @notice Simulate a DeFi transaction and compute risk score.
     * @param agent The agent wallet requesting execution
     * @param user  The user who owns the agent (alice.eth)
     * @param targetProtocol The DeFi protocol address being called
     * @param value  ETH value of the transaction
     * @param callData The calldata for the DeFi interaction
     * @param expectedOutput Expected output amount
     * @param maxSpendAllowed The user's max spend limit from ENS/AgentRegistry
     * @param maxSlippageBps  The user's max slippage from ENS/AgentRegistry
     * @param allowedProtocols Array of protocol addresses user has whitelisted
     * @return simId The simulation ID for tracking
     */
    function simulate(
        address agent,
        address user,
        address targetProtocol,
        uint256 value,
        bytes calldata callData,
        uint256 expectedOutput,
        uint256 maxSpendAllowed,
        uint256 maxSlippageBps,
        address[] calldata allowedProtocols
    ) external returns (bytes32 simId) {
        simId = keccak256(abi.encodePacked(
            agent, user, targetProtocol, value, block.timestamp, totalSimulations
        ));

        // ─── Risk Analysis ───────────────────────────────────
        uint256 riskScore = 0;
        bool protocolVerified = false;
        bool spendLimitOk = true;
        bool slippageOk = true;
        bool liquidationRisk = false;
        string memory failReason = "";

        // 1. Protocol Verification — is target on the allowlist?
        if (allowedProtocols.length > 0) {
            for (uint i = 0; i < allowedProtocols.length; i++) {
                if (allowedProtocols[i] == targetProtocol) {
                    protocolVerified = true;
                    break;
                }
            }
            if (!protocolVerified) {
                riskScore += 400; // huge risk penalty for unverified protocol
                failReason = "Target protocol not in allowlist";
            }
        } else {
            // No allowlist configured — moderate risk
            protocolVerified = true; // permissive mode
            riskScore += 100;
        }

        // 2. Spend Limit Check
        if (maxSpendAllowed > 0 && value > maxSpendAllowed) {
            spendLimitOk = false;
            riskScore += 300;
            if (bytes(failReason).length == 0) failReason = "Transaction exceeds spend limit";
        }

        // 3. Slippage Analysis (simulated)
        uint256 estimatedSlippage = _estimateSlippage(value, expectedOutput, callData);
        if (maxSlippageBps > 0 && estimatedSlippage > maxSlippageBps) {
            slippageOk = false;
            riskScore += 200;
            if (bytes(failReason).length == 0) failReason = "Estimated slippage exceeds tolerance";
        }

        // 4. Liquidation Risk Detection
        liquidationRisk = _checkLiquidationRisk(value, callData);
        if (liquidationRisk) {
            riskScore += 150;
            if (bytes(failReason).length == 0) failReason = "High liquidation risk detected";
        }

        // 5. Anomaly Detection — large single transfer
        if (maxSpendAllowed > 0 && value > (maxSpendAllowed * 80) / 100) {
            riskScore += 100; // spending >80% of daily limit in one tx is suspicious
        }

        // Cap risk score
        if (riskScore > 1000) riskScore = 1000;

        bool passed = riskScore <= riskThreshold;

        // ─── Gas Estimation (simulated) ──────────────────────
        uint256 estimatedGas = 21000 + (callData.length * 16) + 50000;

        // ─── Store Result ────────────────────────────────────
        simulations[simId] = SimulationResult({
            simId: simId,
            passed: passed,
            riskScore: riskScore,
            estimatedSlippage: estimatedSlippage,
            estimatedGas: estimatedGas,
            protocolVerified: protocolVerified,
            spendLimitOk: spendLimitOk,
            slippageOk: slippageOk,
            liquidationRisk: liquidationRisk,
            failReason: failReason,
            simulatedAt: block.timestamp
        });

        userSimulations[user].push(simId);
        totalSimulations++;

        emit SimulationExecuted(simId, agent, user, passed, riskScore);
        return simId;
    }

    // ═══════════════════════════════════════════════════════════
    //                    VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════

    function getSimulation(bytes32 simId) external view returns (SimulationResult memory) {
        if (simulations[simId].simulatedAt == 0) revert SimulationNotFound(simId);
        return simulations[simId];
    }

    function getUserSimulations(address user) external view returns (bytes32[] memory) {
        return userSimulations[user];
    }

    function didSimulationPass(bytes32 simId) external view returns (bool) {
        return simulations[simId].passed;
    }

    // ═══════════════════════════════════════════════════════════
    //                    INTERNAL HELPERS
    // ═══════════════════════════════════════════════════════════

    /**
     * @dev Estimate slippage based on value and expected output.
     *      In production, this would use a fork simulation via Tenderly / Alchemy.
     *      Here we compute a deterministic estimate from calldata characteristics.
     */
    function _estimateSlippage(
        uint256 value,
        uint256 expectedOutput,
        bytes calldata callData
    ) internal pure returns (uint256 slippageBps) {
        if (expectedOutput == 0 || value == 0) return 100; // 1% default

        // Simulate: larger values have higher slippage potential
        // This is a simplified model — production would fork-simulate
        uint256 ratio = (expectedOutput * 10000) / value;
        
        if (ratio > 10000) {
            slippageBps = 0; // favorable rate
        } else {
            slippageBps = 10000 - ratio; // difference from 1:1
        }

        // Add complexity premium based on calldata length (more complex = more risk)
        slippageBps += callData.length / 10;

        return slippageBps;
    }

    /**
     * @dev Check for liquidation risk patterns in the calldata.
     *      In production, this checks the DeFi position health factor.
     */
    function _checkLiquidationRisk(
        uint256 value,
        bytes calldata callData
    ) internal pure returns (bool) {
        // Heuristic: if the calldata contains a leverage/borrow selector pattern
        // and the value is very high, flag as risky
        if (callData.length >= 4) {
            bytes4 selector = bytes4(callData[:4]);
            // Common borrow/leverage selectors (simulated)
            if (
                selector == bytes4(keccak256("borrow(address,uint256,uint256,uint16,address)")) ||
                selector == bytes4(keccak256("flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)"))
            ) {
                return true;
            }
        }
        return false;
    }
}
