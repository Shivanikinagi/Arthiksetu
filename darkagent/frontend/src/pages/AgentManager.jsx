import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { ethers } from 'ethers';

const AgentManager = () => {
    const { contracts, connected, account } = useContracts();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    // Create agent form
    const [label, setLabel] = useState('trading');
    const [agentWallet, setAgentWallet] = useState('');
    const [maxSpend, setMaxSpend] = useState('500');
    const [slippage, setSlippage] = useState('0.5');
    const [protocols, setProtocols] = useState('uniswap,aave');
    const [expiry, setExpiry] = useState('0');

    useEffect(() => {
        if (connected && contracts?.agentRegistry) {
            loadAgents();
        }
    }, [connected, contracts]);

    const loadAgents = async () => {
        if (!contracts?.agentRegistry) return;
        setLoading(true);
        try {
            const nodes = await contracts.agentRegistry.getOwnerAgents(account);
            const agentList = [];
            for (const node of nodes) {
                const agent = await contracts.agentRegistry.getAgent(node);
                agentList.push({
                    node,
                    label: agent.label,
                    owner: agent.owner,
                    agentWallet: agent.agentWallet,
                    maxSpend: ethers.formatEther(agent.maxSpend),
                    slippageBps: Number(agent.slippageBps),
                    allowedProtocols: agent.allowedProtocols,
                    expiry: Number(agent.expiry),
                    active: agent.active,
                    createdAt: Number(agent.createdAt),
                    isAuthorized: await contracts.agentRegistry.isAuthorized(node)
                });
            }
            setAgents(agentList);
        } catch (err) {
            console.error("Load agents error:", err);
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!connected || !contracts?.agentRegistry) {
            setStatus("Please connect wallet first.");
            return;
        }
        if (!agentWallet) {
            setStatus("Please enter an agent wallet address.");
            return;
        }

        try {
            setStatus(`Creating agent license: ${label}.${account.slice(0, 8)}...eth`);
            const maxSpendWei = ethers.parseEther(maxSpend);
            const slippageBps = Math.round(parseFloat(slippage) * 100);
            const protocolList = protocols.split(',').map(p => p.trim()).filter(Boolean);
            const expiryTs = parseInt(expiry) || 0;

            const tx = await contracts.agentRegistry.createAgent(
                label,
                agentWallet,
                maxSpendWei,
                86400,
                slippageBps,
                protocolList,
                expiryTs
            );
            setStatus(`Waiting for tx: ${tx.hash}`);
            await tx.wait();
            setStatus(`Agent "${label}" license created successfully!`);
            loadAgents();
        } catch (err) {
            console.error("Create agent error:", err);
            setStatus(`Error: ${err.reason || err.message}`);
        }
    };

    const handleRevoke = async (node, agentLabel) => {
        try {
            setStatus(`Revoking agent "${agentLabel}"...`);
            const tx = await contracts.agentRegistry.revokeAgent(node);
            await tx.wait();
            setStatus(`Agent "${agentLabel}" has been killed.`);
            loadAgents();
        } catch (err) {
            console.error("Revoke error:", err);
            setStatus(`Error: ${err.reason || err.message}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Agent Licenses</h2>
                <p className="mt-2 text-gray-600">
                    ENS subdomains as revocable agent identities. Create, manage, and kill AI agent licenses.
                </p>
            </div>

            {/* Create Agent */}
            <div className="bg-white shadow rounded-lg mb-8 border border-gray-100">
                <div className="px-6 py-6 sm:p-8">
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-md mb-6">
                        <p className="text-purple-800 font-bold text-sm">Create Agent Subdomain</p>
                        <p className="text-gray-600 text-sm mt-1">
                            Each agent you create becomes a licensed ENS subdomain: <code className="font-mono bg-purple-100 px-1 rounded">{label}.{account ? `${account.slice(0,6)}...` : 'you'}.eth</code>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Agent Label</label>
                            <p className="text-xs text-gray-500 mb-1">Subdomain name (e.g. "trading", "yield", "dca")</p>
                            <input type="text" value={label} onChange={e => setLabel(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" 
                                placeholder="trading" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Agent Wallet Address</label>
                            <p className="text-xs text-gray-500 mb-1">The agent's EOA or contract address</p>
                            <input type="text" value={agentWallet} onChange={e => setAgentWallet(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" 
                                placeholder="0x..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Max Spend (ETH)</label>
                            <p className="text-xs text-gray-500 mb-1">ENS: <code>agent.max_spend</code></p>
                            <input type="number" value={maxSpend} onChange={e => setMaxSpend(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Max Slippage (%)</label>
                            <p className="text-xs text-gray-500 mb-1">ENS: <code>agent.slippage</code></p>
                            <input type="number" step="0.1" value={slippage} onChange={e => setSlippage(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Allowed Protocols</label>
                            <p className="text-xs text-gray-500 mb-1">Comma-separated: <code>agent.protocols</code></p>
                            <input type="text" value={protocols} onChange={e => setProtocols(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" 
                                placeholder="uniswap,aave,compound" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Expiry (Unix timestamp)</label>
                            <p className="text-xs text-gray-500 mb-1">0 = no expiry</p>
                            <input type="number" value={expiry} onChange={e => setExpiry(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                    </div>

                    <button onClick={handleCreate}
                        className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 w-full font-bold shadow-md transition-colors">
                        Create Agent License
                    </button>
                </div>
            </div>

            {/* Agent List */}
            <div className="bg-white shadow rounded-lg border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Your Agent Licenses</h3>
                        <button onClick={loadAgents} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            Refresh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400 animate-pulse">Loading agents...</div>
                ) : agents.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        No agent licenses created yet. Create your first agent above.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {agents.map((agent, i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <span className={`h-3 w-3 rounded-full ${agent.active && agent.isAuthorized ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-400'}`}></span>
                                        <span className="font-bold text-gray-900 font-mono text-lg">
                                            {agent.label}.<span className="text-gray-500">{account?.slice(0,6)}...eth</span>
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {agent.active ? 'ACTIVE' : 'REVOKED'}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                                        <div>Wallet: <span className="font-mono">{agent.agentWallet?.slice(0,10)}...{agent.agentWallet?.slice(-6)}</span></div>
                                        <div>Max Spend: <span className="font-bold text-gray-700">{agent.maxSpend} ETH</span> · Slippage: {agent.slippageBps / 100}%</div>
                                        <div>Protocols: {agent.allowedProtocols?.length > 0 ? agent.allowedProtocols.join(', ') : 'any'}</div>
                                    </div>
                                </div>
                                {agent.active && (
                                    <button onClick={() => handleRevoke(agent.node, agent.label)}
                                        className="ml-4 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md text-sm font-bold hover:bg-red-100 transition-colors">
                                        Kill Agent
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status */}
            {status && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-800 break-all">
                    {status}
                </div>
            )}
        </div>
    );
};

export default AgentManager;
