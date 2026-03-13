// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgentRegistry — ENS Subdomains as Agent Licenses
 * @author DarkAgent
 * @notice Each user (alice.eth) can create agent subdomains (trading.alice.eth)
 *         as revocable, transferable, scoped agent licenses.
 * @dev Simulates ENS subdomain ownership with per-agent permission records.
 *
 *  Primitives:
 *    Subdomain = Agent License
 *    Create subdomain = Hire new agent
 *    Burn subdomain   = Kill agent
 *    Transfer subdomain = Transfer agent
 */
contract AgentRegistry {

    // ═══════════════════════════════════════════════════════════
    //                        STRUCTS
    // ═══════════════════════════════════════════════════════════

    struct AgentLicense {
        string label;              // e.g. "trading", "yield", "dca"
        address owner;             // alice.eth wallet
        address agentWallet;       // the actual agent EOA/contract
        uint256 maxSpend;          // agent-specific spend limit (wei)
        uint256 dailyLimit;        // rolling 24h cap
        uint256 slippageBps;       // max slippage in basis points
        string[] allowedProtocols; // e.g. ["uniswap","aave"]
        uint256 expiry;            // 0 = no expiry, else unix timestamp
        bool active;               // master switch for this agent
        uint256 createdAt;
    }

    // ════════════════════════════════════════════════��══════════
    //                        STATE
    // ═══════════════════════════════════════════════════════════

    /// @dev node => AgentLicense   (node = keccak256(owner, label))
    mapping(bytes32 => AgentLicense) public agents;

    /// @dev owner => list of agent nodes they control
    mapping(address => bytes32[]) public ownerAgents;

    /// @dev Reverse lookup: agentWallet => node
    mapping(address => bytes32) public agentToNode;

    uint256 public totalAgents;

    // ═══════════════════════════════════════════════════════════
    //                        EVENTS
    // ═══════════════════════════════════════════════════════════

    event AgentCreated(
        bytes32 indexed node,
        address indexed owner,
        string label,
        address agentWallet
    );
    event AgentPermissionsUpdated(bytes32 indexed node);
    event AgentRevoked(bytes32 indexed node, address indexed owner);
    event AgentTransferred(bytes32 indexed node, address indexed from, address indexed to);

    // ═══════════════════════════════════════════════════════════
    //                        ERRORS
    // ═══════════════════════════════════════════════════════════

    error NotOwner();
    error AgentAlreadyExists(bytes32 node);
    error AgentNotFound(bytes32 node);
    error AgentExpired(bytes32 node);
    error AgentInactive(bytes32 node);

    // ════════════════════════════════���══════════════════════════
    //                    CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════

    /**
     * @notice Compute the node (subdomain hash) for an owner + label pair.
     * @dev Simulates ENS namehash: keccak256(owner, label)
     */
    function computeNode(address owner, string calldata label) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(owner, label));
    }

    /**
     * @notice Create a new agent subdomain (license).
     *         e.g. alice creates "trading" → trading.alice.eth
     */
    function createAgent(
        string calldata label,
        address agentWallet,
        uint256 maxSpend,
        uint256 dailyLimit,
        uint256 slippageBps,
        string[] calldata allowedProtocols,
        uint256 expiry
    ) external returns (bytes32 node) {
        node = computeNode(msg.sender, label);
        if (agents[node].owner != address(0)) revert AgentAlreadyExists(node);

        agents[node] = AgentLicense({
            label: label,
            owner: msg.sender,
            agentWallet: agentWallet,
            maxSpend: maxSpend,
            dailyLimit: dailyLimit,
            slippageBps: slippageBps,
            allowedProtocols: allowedProtocols,
            expiry: expiry,
            active: true,
            createdAt: block.timestamp
        });

        ownerAgents[msg.sender].push(node);
        agentToNode[agentWallet] = node;
        totalAgents++;

        emit AgentCreated(node, msg.sender, label, agentWallet);
        return node;
    }

    /**
     * @notice Update the permissions of an existing agent license.
     *         Only the license owner can modify.
     */
    function updateAgentPermissions(
        bytes32 node,
        uint256 maxSpend,
        uint256 dailyLimit,
        uint256 slippageBps,
        string[] calldata allowedProtocols,
        uint256 expiry,
        bool active
    ) external {
        AgentLicense storage agent = agents[node];
        if (agent.owner == address(0)) revert AgentNotFound(node);
        if (agent.owner != msg.sender) revert NotOwner();

        agent.maxSpend = maxSpend;
        agent.dailyLimit = dailyLimit;
        agent.slippageBps = slippageBps;
        agent.allowedProtocols = allowedProtocols;
        agent.expiry = expiry;
        agent.active = active;

        emit AgentPermissionsUpdated(node);
    }

    /**
     * @notice Revoke (burn) an agent license. Equivalent to killing the agent.
     *         The subdomain is permanently deactivated.
     */
    function revokeAgent(bytes32 node) external {
        AgentLicense storage agent = agents[node];
        if (agent.owner == address(0)) revert AgentNotFound(node);
        if (agent.owner != msg.sender) revert NotOwner();

        agent.active = false;
        // Clear the agent wallet reverse lookup
        delete agentToNode[agent.agentWallet];

        emit AgentRevoked(node, msg.sender);
    }

    /**
     * @notice Transfer an agent license to a new owner.
     *         All permissions and history transfer with it.
     */
    function transferAgent(bytes32 node, address newOwner) external {
        AgentLicense storage agent = agents[node];
        if (agent.owner == address(0)) revert AgentNotFound(node);
        if (agent.owner != msg.sender) revert NotOwner();

        address previousOwner = agent.owner;
        agent.owner = newOwner;

        // Add to new owner's list
        ownerAgents[newOwner].push(node);

        // Remove from old owner's list
        bytes32[] storage oldList = ownerAgents[previousOwner];
        for (uint i = 0; i < oldList.length; i++) {
            if (oldList[i] == node) {
                oldList[i] = oldList[oldList.length - 1];
                oldList.pop();
                break;
            }
        }

        emit AgentTransferred(node, previousOwner, newOwner);
    }

    // ═══════════════════════════════════════════════════════════
    //                    VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════

    /**
     * @notice Get full agent license details.
     */
    function getAgent(bytes32 node) external view returns (AgentLicense memory) {
        return agents[node];
    }

    /**
     * @notice Look up an agent license by its wallet address.
     */
    function getAgentByWallet(address agentWallet) external view returns (AgentLicense memory) {
        bytes32 node = agentToNode[agentWallet];
        return agents[node];
    }

    /**
     * @notice Get all agent nodes owned by an address.
     */
    function getOwnerAgents(address owner) external view returns (bytes32[] memory) {
        return ownerAgents[owner];
    }

    /**
     * @notice Verify that an agent is currently authorized.
     *         Checks: exists, active, not expired.
     */
    function isAuthorized(bytes32 node) public view returns (bool) {
        AgentLicense storage agent = agents[node];
        if (agent.owner == address(0)) return false;
        if (!agent.active) return false;
        if (agent.expiry != 0 && block.timestamp > agent.expiry) return false;
        return true;
    }

    /**
     * @notice Verify that an agent wallet is authorized by checking its node.
     */
    function isAgentWalletAuthorized(address agentWallet) external view returns (bool) {
        bytes32 node = agentToNode[agentWallet];
        return isAuthorized(node);
    }

    /**
     * @notice Get agent count for an owner.
     */
    function getAgentCount(address owner) external view returns (uint256) {
        return ownerAgents[owner].length;
    }
}
