// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IDarkAgent.sol";

interface IENSAgentResolver {
    struct AgentPermissions {
        uint256 maxSpend;
        uint256 dailyLimit;
        uint256 slippageBps;
        address[] tokens;
        address[] protocols;
        uint256 expiry;
        bool active;
    }
    function getPermissions(address user) external view returns (AgentPermissions memory);
}

interface IAgentRegistry {
    struct AgentLicense {
        string label;
        address owner;
        address agentWallet;
        uint256 maxSpend;
        uint256 dailyLimit;
        uint256 slippageBps;
        string[] allowedProtocols;
        uint256 expiry;
        bool active;
        uint256 createdAt;
    }
    function isAgentWalletAuthorized(address agentWallet) external view returns (bool);
    function getAgentByWallet(address agentWallet) external view returns (AgentLicense memory);
}

interface ISimulationEngine {
    struct SimulationResult {
        bytes32 simId;
        bool passed;
        uint256 riskScore;
        uint256 estimatedSlippage;
        uint256 estimatedGas;
        bool protocolVerified;
        bool spendLimitOk;
        bool slippageOk;
        bool liquidationRisk;
        string failReason;
        uint256 simulatedAt;
    }
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
    ) external returns (bytes32 simId);
    function getSimulation(bytes32 simId) external view returns (SimulationResult memory);
    function didSimulationPass(bytes32 simId) external view returns (bool);
}

/**
 * @title DarkAgent Core Protocol
 * @author DarkAgent
 * @notice The core verification infrastructure for AI agents in DeFi.
 * @dev Integrates:
 *      1. ENS Agent Resolver — reads user permission records
 *      2. Agent Registry — ENS subdomain-based agent licenses
 *      3. Simulation Engine — fork-simulates DeFi txs before execution
 *      4. BitGo Adapter — executes via stealth addresses (off-chain SDK)
 *
 *  Flow:
 *    Agent proposes → Simulation → ENS + Registry verification → Execute via BitGo
 */
contract DarkAgent is IDarkAgent {
    // ===============================================================
    //                       CUSTOM ERRORS
    // ===============================================================
    error ProposalNotFound(bytes32 proposalId);
    error AlreadyVerified(bytes32 proposalId);
    error NotVerifiedYet(bytes32 proposalId);
    error AlreadyExecuted(bytes32 proposalId);
    error VerificationFailedReason(string reason);
    error SimulationFailed(bytes32 simId, string reason);
    error AgentNotLicensed(address agent);

    // ===============================================================
    //                        STATE VARIABLES
    // ===============================================================
    mapping(bytes32 => Proposal) public proposals;
    mapping(bytes32 => bytes32) public proposalSimulations; // proposalId => simId
    uint256 public totalProposals;
    
    IENSAgentResolver public ensResolver;
    IAgentRegistry public agentRegistry;
    ISimulationEngine public simulationEngine;

    // ===============================================================
    //                          EVENTS
    // ===============================================================
    event ActionProposed(bytes32 indexed proposalId, address indexed agent, address indexed user);
    event ActionSimulated(bytes32 indexed proposalId, bytes32 indexed simId, bool passed, uint256 riskScore);
    event ActionVerified(bytes32 indexed proposalId);
    event ActionExecuted(bytes32 indexed proposalId);
    
    constructor(address _ensResolver, address _agentRegistry, address _simulationEngine) {
        ensResolver = IENSAgentResolver(_ensResolver);
        agentRegistry = IAgentRegistry(_agentRegistry);
        simulationEngine = ISimulationEngine(_simulationEngine);
    }

    /**
     * @notice Agent proposes an action
     */
    function propose(
        address agent,
        address user,
        bytes calldata action
    ) external override returns (bytes32 proposalId) {
        proposalId = keccak256(abi.encodePacked(
            agent, user, action, block.timestamp, totalProposals
        ));

        proposals[proposalId] = Proposal({
            agent: agent,
            user: user,
            action: action,
            verified: false,
            executed: false,
            timestamp: block.timestamp
        });

        totalProposals++;
        
        emit ActionProposed(proposalId, agent, user);
        return proposalId;
    }

    /**
     * @notice Simulate a proposal's DeFi transaction before verification.
     * @dev Calls the SimulationEngine to analyze risk.
     * @param proposalId The proposal to simulate
     * @param targetProtocol The DeFi protocol being interacted with
     * @param value Transaction value
     * @param expectedOutput Expected output for slippage analysis
     */
    function simulateProposal(
        bytes32 proposalId,
        address targetProtocol,
        uint256 value,
        uint256 expectedOutput
    ) external returns (bytes32 simId) {
        Proposal storage p = proposals[proposalId];
        if (p.agent == address(0)) revert ProposalNotFound(proposalId);

        // Get user permissions from ENS resolver
        IENSAgentResolver.AgentPermissions memory rules = ensResolver.getPermissions(p.user);

        // Run simulation
        simId = simulationEngine.simulate(
            p.agent,
            p.user,
            targetProtocol,
            value,
            p.action,
            expectedOutput,
            rules.maxSpend,
            rules.slippageBps,
            rules.protocols
        );

        proposalSimulations[proposalId] = simId;

        // Get result
        ISimulationEngine.SimulationResult memory result = simulationEngine.getSimulation(simId);
        emit ActionSimulated(proposalId, simId, result.passed, result.riskScore);

        return simId;
    }

    /**
     * @notice DarkAgent verifies the proposal against ENS rules + Agent Registry + Simulation
     * @dev Full verification pipeline:
     *      1. Check agent is licensed in AgentRegistry
     *      2. Check ENS permissions are active
     *      3. Check simulation passed (if simulation was run)
     */
    function verify(
        bytes32 proposalId
    ) external override returns (bool) {
        Proposal storage p = proposals[proposalId];
        if (p.agent == address(0)) revert ProposalNotFound(proposalId);
        if (p.verified) revert AlreadyVerified(proposalId);
        if (p.executed) revert AlreadyExecuted(proposalId);

        // 1. Check Agent Registry — is this agent licensed via ENS subdomain?
        //    (Optional: if registry is not set, skip this check for backwards compat)
        if (address(agentRegistry) != address(0)) {
            bool isLicensed = agentRegistry.isAgentWalletAuthorized(p.agent);
            if (!isLicensed) revert AgentNotLicensed(p.agent);
        }

        // 2. Check ENS Resolver — user permissions
        IENSAgentResolver.AgentPermissions memory rules = ensResolver.getPermissions(p.user);
        
        if (!rules.active) revert VerificationFailedReason("Agent permissions inactive in ENS");
        if (rules.maxSpend == 0) revert VerificationFailedReason("ENS limit undefined");

        // 3. Check Simulation — if simulation was run, it must have passed
        bytes32 simId = proposalSimulations[proposalId];
        if (simId != bytes32(0)) {
            ISimulationEngine.SimulationResult memory simResult = simulationEngine.getSimulation(simId);
            if (!simResult.passed) {
                revert SimulationFailed(simId, simResult.failReason);
            }
        }

        p.verified = true;
        
        emit ActionVerified(proposalId);
        return true;
    }

    /**
     * @notice Executes the action (only if verified)
     */
    function execute(
        bytes32 proposalId
    ) external override {
        Proposal storage p = proposals[proposalId];
        if (p.agent == address(0)) revert ProposalNotFound(proposalId);
        if (!p.verified) revert NotVerifiedYet(proposalId);
        if (p.executed) revert AlreadyExecuted(proposalId);

        p.executed = true;

        emit ActionExecuted(proposalId);
    }

    function isVerified(
        bytes32 proposalId
    ) external view override returns (bool) {
        return proposals[proposalId].verified;
    }

    function getProposal(
        bytes32 proposalId
    ) external view override returns (Proposal memory) {
        return proposals[proposalId];
    }

    /**
     * @notice Get the simulation result linked to a proposal.
     */
    function getProposalSimulation(bytes32 proposalId) external view returns (bytes32) {
        return proposalSimulations[proposalId];
    }
}
