/**
 * DarkAgent SDK — Agent Registry (ENS Subdomains as Agent Licenses)
 * ==================================================================
 * 
 * Manages ENS subdomain-based agent licenses.
 * 
 * Primitives:
 *   Create subdomain = Hire new agent
 *   Burn subdomain   = Kill agent  
 *   Transfer subdomain = Transfer agent
 *   Update subdomain = Change agent permissions
 *
 * Usage:
 *   const registry = new AgentRegistrySDK(registryAddress, signer);
 *   await registry.createAgent("trading", agentWallet, { maxSpend: "500", ... });
 *   await registry.revokeAgent("trading");
 */

const { ethers } = require('ethers');

const AGENT_REGISTRY_ABI = [
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

class AgentRegistrySDK {
    /**
     * @param {string} registryAddress - Address of AgentRegistry contract
     * @param {ethers.Signer} signer - Connected signer
     */
    constructor(registryAddress, signer) {
        this.contract = new ethers.Contract(registryAddress, AGENT_REGISTRY_ABI, signer);
        this.signer = signer;
    }

    /**
     * Create a new agent license (ENS subdomain).
     * e.g. alice creates "trading" → trading.alice.eth
     *
     * @param {string} label - Subdomain label (e.g. "trading", "yield", "dca")
     * @param {string} agentWallet - The agent's wallet address
     * @param {object} permissions - Agent permissions
     * @param {string} permissions.maxSpend - Max spend in ETH (e.g. "500")
     * @param {number} permissions.dailyLimit - Daily limit in seconds window (default 86400)
     * @param {number} permissions.slippageBps - Max slippage in basis points (e.g. 50 = 0.5%)
     * @param {string[]} permissions.allowedProtocols - Protocol names (e.g. ["uniswap", "aave"])
     * @param {number} permissions.expiry - Unix timestamp, 0 for no expiry
     * @returns {object} { node, txHash }
     */
    async createAgent(label, agentWallet, permissions = {}) {
        const maxSpend = ethers.parseEther(permissions.maxSpend || "0");
        const dailyLimit = permissions.dailyLimit || 86400;
        const slippageBps = permissions.slippageBps || 50;
        const allowedProtocols = permissions.allowedProtocols || [];
        const expiry = permissions.expiry || 0;

        console.log(`[AgentRegistry] Creating agent license: ${label}`);
        console.log(`  Agent Wallet: ${agentWallet}`);
        console.log(`  Max Spend: ${permissions.maxSpend || "0"} ETH`);
        console.log(`  Protocols: ${allowedProtocols.join(", ") || "any"}`);

        const tx = await this.contract.createAgent(
            label,
            agentWallet,
            maxSpend,
            dailyLimit,
            slippageBps,
            allowedProtocols,
            expiry
        );
        const receipt = await tx.wait();

        // Parse the AgentCreated event
        const event = receipt.logs.find(log => {
            try {
                const parsed = this.contract.interface.parseLog(log);
                return parsed && parsed.name === 'AgentCreated';
            } catch { return false; }
        });

        const node = event 
            ? this.contract.interface.parseLog(event).args.node 
            : null;

        console.log(`[AgentRegistry] Agent "${label}" created. Node: ${node}`);
        return { node, txHash: receipt.hash };
    }

    /**
     * Update an existing agent's permissions.
     * @param {string} label - The agent label
     * @param {object} permissions - New permissions
     */
    async updatePermissions(label, permissions) {
        const ownerAddress = await this.signer.getAddress();
        const node = await this.contract.computeNode(ownerAddress, label);

        console.log(`[AgentRegistry] Updating permissions for: ${label}`);

        const tx = await this.contract.updateAgentPermissions(
            node,
            ethers.parseEther(permissions.maxSpend || "0"),
            permissions.dailyLimit || 86400,
            permissions.slippageBps || 50,
            permissions.allowedProtocols || [],
            permissions.expiry || 0,
            permissions.active !== undefined ? permissions.active : true
        );
        await tx.wait();

        console.log(`[AgentRegistry] Permissions updated for "${label}"`);
        return { node, txHash: tx.hash };
    }

    /**
     * Revoke (kill) an agent. Burns the subdomain license.
     * @param {string} label - The agent label to revoke
     */
    async revokeAgent(label) {
        const ownerAddress = await this.signer.getAddress();
        const node = await this.contract.computeNode(ownerAddress, label);

        console.log(`[AgentRegistry] REVOKING agent: ${label}`);
        const tx = await this.contract.revokeAgent(node);
        await tx.wait();

        console.log(`[AgentRegistry] Agent "${label}" has been killed.`);
        return { node, txHash: tx.hash };
    }

    /**
     * Transfer an agent license to a new owner.
     * @param {string} label - The agent label
     * @param {string} newOwner - New owner address
     */
    async transferAgent(label, newOwner) {
        const ownerAddress = await this.signer.getAddress();
        const node = await this.contract.computeNode(ownerAddress, label);

        console.log(`[AgentRegistry] Transferring "${label}" to ${newOwner}`);
        const tx = await this.contract.transferAgent(node, newOwner);
        await tx.wait();

        console.log(`[AgentRegistry] Agent "${label}" transferred.`);
        return { node, txHash: tx.hash };
    }

    /**
     * Get all agents owned by the connected signer.
     * @returns {object[]} Array of agent license details
     */
    async getMyAgents() {
        const ownerAddress = await this.signer.getAddress();
        const nodes = await this.contract.getOwnerAgents(ownerAddress);

        const agents = [];
        for (const node of nodes) {
            const agent = await this.contract.getAgent(node);
            agents.push({
                node,
                label: agent.label,
                owner: agent.owner,
                agentWallet: agent.agentWallet,
                maxSpend: ethers.formatEther(agent.maxSpend),
                dailyLimit: Number(agent.dailyLimit),
                slippageBps: Number(agent.slippageBps),
                allowedProtocols: agent.allowedProtocols,
                expiry: Number(agent.expiry),
                active: agent.active,
                createdAt: Number(agent.createdAt)
            });
        }

        return agents;
    }

    /**
     * Check if an agent wallet is authorized.
     * @param {string} agentWallet - The agent wallet to check
     * @returns {boolean}
     */
    async isAuthorized(agentWallet) {
        return this.contract.isAgentWalletAuthorized(agentWallet);
    }

    /**
     * Get agent details by wallet address.
     * @param {string} agentWallet - Agent wallet address
     */
    async getAgentByWallet(agentWallet) {
        const agent = await this.contract.getAgentByWallet(agentWallet);
        return {
            label: agent.label,
            owner: agent.owner,
            agentWallet: agent.agentWallet,
            maxSpend: ethers.formatEther(agent.maxSpend),
            active: agent.active
        };
    }
}

module.exports = { AgentRegistrySDK, AGENT_REGISTRY_ABI };
