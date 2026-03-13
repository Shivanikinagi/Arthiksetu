/**
 * DarkAgent Frontend — Contract ABIs
 * Includes: DarkAgent Protocol, ENS Resolver (Permissions), Agent Registry, Simulation Engine
 */

export const DARKAGENT_PROTOCOL_ABI = [
  "function propose(address agent, address user, bytes calldata action) external returns (bytes32)",
  "function simulateProposal(bytes32 proposalId, address targetProtocol, uint256 value, uint256 expectedOutput) external returns (bytes32 simId)",
  "function verify(bytes32 proposalId) external returns (bool)",
  "function execute(bytes32 proposalId) external",
  "function isVerified(bytes32 proposalId) external view returns (bool)",
  "function getProposal(bytes32 proposalId) external view returns (tuple(address agent, address user, bytes action, bool verified, bool executed, uint256 timestamp))",
  "function getProposalSimulation(bytes32 proposalId) external view returns (bytes32)",
  "function totalProposals() external view returns (uint256)",
  "event ActionProposed(bytes32 indexed proposalId, address indexed agent, address indexed user)",
  "event ActionSimulated(bytes32 indexed proposalId, bytes32 indexed simId, bool passed, uint256 riskScore)",
  "event ActionVerified(bytes32 indexed proposalId)",
  "event ActionExecuted(bytes32 indexed proposalId)"
];

export const PERMISSIONS_ABI = [
  "function syncPermissions(address user, uint256 maxSpend, uint256 dailyLimit, uint256 slippageBps, address[] calldata tokens, address[] calldata protocols, uint256 expiry, bool active) external",
  "function getPermissions(address user) external view returns (tuple(uint256 maxSpend, uint256 dailyLimit, uint256 slippageBps, address[] tokens, address[] protocols, uint256 expiry, bool active))",
  "function setTextRecord(address user, string memory key, string memory value) external",
  "function readENSRecord(address user, string memory key) public view returns (string memory)"
];

export const AGENT_REGISTRY_ABI = [
  "function computeNode(address owner, string calldata label) public pure returns (bytes32)",
  "function createAgent(string calldata label, address agentWallet, uint256 maxSpend, uint256 dailyLimit, uint256 slippageBps, string[] calldata allowedProtocols, uint256 expiry) external returns (bytes32 node)",
  "function updateAgentPermissions(bytes32 node, uint256 maxSpend, uint256 dailyLimit, uint256 slippageBps, string[] calldata allowedProtocols, uint256 expiry, bool active) external",
  "function revokeAgent(bytes32 node) external",
  "function transferAgent(bytes32 node, address newOwner) external",
  "function getAgent(bytes32 node) external view returns (tuple(string label, address owner, address agentWallet, uint256 maxSpend, uint256 dailyLimit, uint256 slippageBps, string[] allowedProtocols, uint256 expiry, bool active, uint256 createdAt))",
  "function getAgentByWallet(address agentWallet) external view returns (tuple(string label, address owner, address agentWallet, uint256 maxSpend, uint256 dailyLimit, uint256 slippageBps, string[] allowedProtocols, uint256 expiry, bool active, uint256 createdAt))",
  "function getOwnerAgents(address owner) external view returns (bytes32[])",
  "function isAuthorized(bytes32 node) public view returns (bool)",
  "function isAgentWalletAuthorized(address agentWallet) external view returns (bool)",
  "function getAgentCount(address owner) external view returns (uint256)",
  "function totalAgents() external view returns (uint256)",
  "event AgentCreated(bytes32 indexed node, address indexed owner, string label, address agentWallet)",
  "event AgentPermissionsUpdated(bytes32 indexed node)",
  "event AgentRevoked(bytes32 indexed node, address indexed owner)",
  "event AgentTransferred(bytes32 indexed node, address indexed from, address indexed to)"
];

export const SIMULATION_ENGINE_ABI = [
  "function simulate(address agent, address user, address targetProtocol, uint256 value, bytes calldata callData, uint256 expectedOutput, uint256 maxSpendAllowed, uint256 maxSlippageBps, address[] calldata allowedProtocols) external returns (bytes32 simId)",
  "function getSimulation(bytes32 simId) external view returns (tuple(bytes32 simId, bool passed, uint256 riskScore, uint256 estimatedSlippage, uint256 estimatedGas, bool protocolVerified, bool spendLimitOk, bool slippageOk, bool liquidationRisk, string failReason, uint256 simulatedAt))",
  "function getUserSimulations(address user) external view returns (bytes32[])",
  "function didSimulationPass(bytes32 simId) external view returns (bool)",
  "function totalSimulations() external view returns (uint256)",
  "function riskThreshold() external view returns (uint256)",
  "event SimulationExecuted(bytes32 indexed simId, address indexed agent, address indexed user, bool passed, uint256 riskScore)"
];
