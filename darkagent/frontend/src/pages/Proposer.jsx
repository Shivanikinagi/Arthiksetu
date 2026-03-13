import React, { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import { ethers } from 'ethers';

const Proposer = () => {
    const { contracts, connected, account } = useContracts();
    const [actionData, setActionData] = useState('0xdeadbeef'); 
    const [status, setStatus] = useState('');
    const [proposalId, setProposalId] = useState(null);
    const [agentAddress, setAgentAddress] = useState('0x1111111111111111111111111111111111111111');

    const handlePropose = async () => {
        if (!connected || !contracts?.darkAgent || !account) {
            setStatus("Please connect wallet first.");
            return;
        }

        try {
            setStatus("Proposing execution on-chain...");
            const tx = await contracts.darkAgent.propose(
                agentAddress,
                account,
                ethers.getBytes(actionData)
            );
            setStatus(`Waiting for transaction: ${tx.hash}`);
            
            const receipt = await tx.wait();
            
            // Extract Proposal ID from event
            const event = receipt.logs.find(
                log => {
                    try {
                        const parsed = contracts.darkAgent.interface.parseLog(log);
                        return parsed && parsed.name === 'ActionProposed';
                    } catch (e) {
                        return false;
                    }
                }
            );

            if (event) {
                const parsedLog = contracts.darkAgent.interface.parseLog(event);
                const pid = parsedLog.args.proposalId;
                setProposalId(pid);
                setStatus(`Proposed successfully! Proposal ID: ${pid.toString()}`);
            } else {
                setStatus("Proposal successful, but couldn't find event ID.");
            }

        } catch (error) {
            console.error("Propose error:", error);
            setStatus(`Error: ${error.reason || error.message}`);
        }
    };

    const handleVerifyAndExecute = async () => {
        if (!connected || !contracts?.darkAgent || proposalId === null) {
            setStatus("Need a valid proposal ID first.");
            return;
        }

        try {
            // Step 1: Verify (checks Agent License + ENS + Simulation)
            setStatus(`Verifying proposal via DarkAgent Protocol...`);
            const verifyTx = await contracts.darkAgent.verify(proposalId);
            setStatus(`Waiting for verification tx: ${verifyTx.hash}`);
            await verifyTx.wait();

            // Step 2: Execute
            setStatus(`Verification complete! Executing...`);
            const execTx = await contracts.darkAgent.execute(proposalId);
            setStatus(`Waiting for execution tx: ${execTx.hash}`);
            await execTx.wait();

            setStatus("Successfully verified and executed! Agent action completed via DarkAgent Protocol.");
            
        } catch (error) {
            console.error("Execute error:", error);
            setStatus(`Error: ${error.reason || error.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Execute Agent Action</h2>
                <p className="mt-2 text-gray-600">
                    Propose an action, verify against ENS rules + Agent License + Simulation, then execute via BitGo.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg border border-gray-100">
                <div className="px-6 py-6 sm:p-8">
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-md mb-6">
                        <p className="text-emerald-800 font-bold text-sm">DarkAgent Verification Pipeline</p>
                        <p className="text-gray-600 text-sm mt-1">
                            Agent Proposes → Simulation Engine → ENS Policy Check → Agent License Check → BitGo Execution
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Agent Wallet Address</label>
                            <p className="text-xs text-gray-500 mb-1">Must be a licensed agent (ENS subdomain)</p>
                            <input
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border font-mono"
                                value={agentAddress}
                                onChange={(e) => setAgentAddress(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Action Calldata (Hex)</label>
                            <p className="text-xs text-gray-500 mb-1">The DeFi interaction payload</p>
                            <input
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border font-mono"
                                value={actionData}
                                onChange={(e) => setActionData(e.target.value)}
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={handlePropose}
                                className="flex-1 px-4 py-3 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                                1. Submit Proposal
                            </button>
                            <button
                                onClick={handleVerifyAndExecute}
                                disabled={proposalId === null}
                                className={`flex-1 px-4 py-3 border border-transparent shadow-sm text-sm font-bold rounded-md text-white transition-colors ${proposalId === null ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                2. Verify & Execute
                            </button>
                        </div>
                    </div>

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

export default Proposer;
