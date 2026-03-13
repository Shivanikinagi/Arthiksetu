import React, { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import { ethers } from 'ethers';

const Permissions = () => {
    const { contracts, connected, account } = useContracts();
    const [ensName, setEnsName] = useState('alice.eth');
    const [maxSpend, setMaxSpend] = useState('100');
    const [slippage, setSlippage] = useState('0.5');
    const [status, setStatus] = useState('');

    const handleSave = async () => {
        if (!connected || !contracts?.permissionsContract || !account) {
            setStatus("Please connect wallet first.");
            return;
        }

        try {
            setStatus("Syncing permissions to ENS Resolver (Proposed ENSIP-XX)...");
            
            const slippageBps = parseFloat(slippage) * 100;
            const amountWei = ethers.parseEther(maxSpend);
            
            // Syncs to ENSAgentResolver.syncPermissions
            // address user, uint256 maxSpend, uint256 dailyLimit, uint256 slippageBps, address[] tokens, address[] protocols, uint256 expiry, bool active
            const tx = await contracts.permissionsContract.syncPermissions(
                account,
                amountWei,
                86400, // dailyLimit
                slippageBps,
                [], // allowedTokens
                [], // allowedProtocols
                0, // expiry
                true // active
            );
            
            setStatus(`Waiting for transaction: ${tx.hash}`);
            await tx.wait();
            setStatus(`Permissions successfully saved via ENS Resolver and synced for BitGo adapter!`);

        } catch (error) {
            console.error("Permissions save error:", error);
            setStatus(`Error: ${error.reason || error.message}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold mb-8 mt-4 text-gray-900">Define ENS Agent Policy</h2>
            <div className="bg-white shadow sm:rounded-lg mb-8 border border-gray-100">
                <div className="px-6 py-6 sm:p-8 space-y-6">
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                        <p className="text-indigo-800 font-medium">ENSIP-XX Simulator</p>
                        <p className="text-gray-600 mt-1 text-sm">
                            This panel updates the <code>agent.permissions</code> configuration mapped 
                            to your ENS identity. Below, you are defining the exact financial boundaries 
                            that the DarkAgent contract and BitGo institutional adapter will enforce.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700">ENS Name / Target Identity</label>
                        <input
                            type="text"
                            value={ensName}
                            onChange={e => setEnsName(e.target.value)}
                            className="mt-2 text-gray-600 bg-gray-50 font-mono block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-3 border"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Max Spend Limit (ETH)</label>
                        <p className="text-xs text-gray-500 mb-2">Mapped to BitGo velocity policy: <code>agent.max_spend</code></p>
                        <input
                            type="number"
                            value={maxSpend}
                            onChange={e => setMaxSpend(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Max Slippage Tolerance (%)</label>
                        <p className="text-xs text-gray-500 mb-2">Protocol cutoff for AMM execution: <code>agent.slippage</code></p>
                        <input
                            type="number"
                            step="0.1"
                            value={slippage}
                            onChange={e => setSlippage(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border font-mono"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 w-full font-bold shadow-md transition-colors"
                    >
                        Sync Preferences to ENS Resolver
                    </button>
                    {status && (
                        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-800 break-all">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Permissions;