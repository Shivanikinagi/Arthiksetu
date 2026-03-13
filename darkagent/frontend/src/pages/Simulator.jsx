import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { ethers } from 'ethers';

const Simulator = () => {
    const { contracts, connected, account } = useContracts();
    const [status, setStatus] = useState('');
    const [simResult, setSimResult] = useState(null);
    const [simHistory, setSimHistory] = useState([]);

    // Simulation form
    const [agentAddr, setAgentAddr] = useState('0x1111111111111111111111111111111111111111');
    const [targetProtocol, setTargetProtocol] = useState('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'); // Uniswap Router
    const [valueEth, setValueEth] = useState('1.0');
    const [expectedOutput, setExpectedOutput] = useState('1800');
    const [callData, setCallData] = useState('0xdeadbeef');

    useEffect(() => {
        if (connected && contracts?.simulationEngine) {
            loadHistory();
        }
    }, [connected, contracts]);

    const loadHistory = async () => {
        if (!contracts?.simulationEngine) return;
        try {
            const simIds = await contracts.simulationEngine.getUserSimulations(account);
            const results = [];
            for (const simId of simIds.slice(-5)) { // last 5
                try {
                    const r = await contracts.simulationEngine.getSimulation(simId);
                    results.push({
                        simId: r.simId,
                        passed: r.passed,
                        riskScore: Number(r.riskScore),
                        estimatedSlippage: Number(r.estimatedSlippage),
                        protocolVerified: r.protocolVerified,
                        spendLimitOk: r.spendLimitOk,
                        slippageOk: r.slippageOk,
                        liquidationRisk: r.liquidationRisk,
                        failReason: r.failReason,
                        simulatedAt: Number(r.simulatedAt)
                    });
                } catch (e) { /* skip invalid */ }
            }
            setSimHistory(results.reverse());
        } catch (err) {
            console.error("Load sim history error:", err);
        }
    };

    const handleSimulate = async () => {
        if (!connected || !contracts?.simulationEngine) {
            setStatus("Connect wallet first.");
            return;
        }

        try {
            setStatus("Running DeFi transaction simulation...");
            setSimResult(null);

            const value = ethers.parseEther(valueEth);
            const expected = ethers.parseEther(expectedOutput);

            // Get user's ENS permissions for simulation context
            let maxSpend = ethers.parseEther("1000"); // default
            let maxSlippage = 50; // default 0.5%
            let allowedProtocols = [];

            if (contracts.permissionsContract) {
                try {
                    const perms = await contracts.permissionsContract.getPermissions(account);
                    if (perms.maxSpend > 0) maxSpend = perms.maxSpend;
                    if (perms.slippageBps > 0) maxSlippage = Number(perms.slippageBps);
                    if (perms.protocols?.length > 0) allowedProtocols = perms.protocols;
                } catch (e) { /* use defaults */ }
            }

            const tx = await contracts.simulationEngine.simulate(
                agentAddr,
                account,
                targetProtocol,
                value,
                ethers.getBytes(callData),
                expected,
                maxSpend,
                maxSlippage,
                allowedProtocols
            );
            setStatus(`Simulation tx submitted: ${tx.hash}`);
            const receipt = await tx.wait();

            // Parse event
            const event = receipt.logs.find(log => {
                try {
                    const parsed = contracts.simulationEngine.interface.parseLog(log);
                    return parsed && parsed.name === 'SimulationExecuted';
                } catch { return false; }
            });

            if (event) {
                const parsed = contracts.simulationEngine.interface.parseLog(event);
                const simId = parsed.args.simId;
                const result = await contracts.simulationEngine.getSimulation(simId);

                const formatted = {
                    simId: result.simId,
                    passed: result.passed,
                    riskScore: Number(result.riskScore),
                    estimatedSlippage: Number(result.estimatedSlippage),
                    estimatedGas: Number(result.estimatedGas),
                    protocolVerified: result.protocolVerified,
                    spendLimitOk: result.spendLimitOk,
                    slippageOk: result.slippageOk,
                    liquidationRisk: result.liquidationRisk,
                    failReason: result.failReason
                };

                setSimResult(formatted);
                setStatus(formatted.passed ? "Simulation PASSED — safe to execute" : `Simulation FAILED — ${formatted.failReason}`);
            }

            loadHistory();
        } catch (err) {
            console.error("Simulation error:", err);
            setStatus(`Error: ${err.reason || err.message}`);
        }
    };

    const riskColor = (score) => {
        if (score <= 200) return 'text-green-600';
        if (score <= 400) return 'text-yellow-600';
        return 'text-red-600';
    };

    const riskBg = (score) => {
        if (score <= 200) return 'bg-green-50 border-green-200';
        if (score <= 400) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">DeFi Simulation Engine</h2>
                <p className="mt-2 text-gray-600">
                    Simulate DeFi transactions before execution. Analyze slippage, protocol risk, spend limits, and liquidation exposure.
                </p>
            </div>

            {/* Simulation Form */}
            <div className="bg-white shadow rounded-lg mb-8 border border-gray-100">
                <div className="px-6 py-6 sm:p-8">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md mb-6">
                        <p className="text-blue-800 font-bold text-sm">Fork Simulation</p>
                        <p className="text-gray-600 text-sm mt-1">
                            Simulates the transaction against your ENS permission rules before any on-chain execution.
                            Risk score &lt; 0.4 = safe to execute.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Agent Address</label>
                            <input type="text" value={agentAddr} onChange={e => setAgentAddr(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Target Protocol</label>
                            <p className="text-xs text-gray-500 mb-1">DeFi contract address (Uniswap, Aave, etc.)</p>
                            <input type="text" value={targetProtocol} onChange={e => setTargetProtocol(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Value (ETH)</label>
                            <input type="number" step="0.1" value={valueEth} onChange={e => setValueEth(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Expected Output (ETH equivalent)</label>
                            <input type="number" value={expectedOutput} onChange={e => setExpectedOutput(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Calldata (hex)</label>
                            <input type="text" value={callData} onChange={e => setCallData(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-3 font-mono text-sm border-gray-300" />
                        </div>
                    </div>

                    <button onClick={handleSimulate}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full font-bold shadow-md transition-colors">
                        Run Simulation
                    </button>
                </div>
            </div>

            {/* Simulation Result */}
            {simResult && (
                <div className={`mb-8 rounded-lg border-2 p-6 ${riskBg(simResult.riskScore)}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            {simResult.passed ? '✅ Simulation Passed' : '❌ Simulation Failed'}
                        </h3>
                        <span className={`text-3xl font-black ${riskColor(simResult.riskScore)}`}>
                            {(simResult.riskScore / 1000).toFixed(2)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white rounded-md p-3 shadow-sm">
                            <div className="text-xs text-gray-500 font-medium">Risk Score</div>
                            <div className={`text-lg font-bold ${riskColor(simResult.riskScore)}`}>{simResult.riskScore}/1000</div>
                        </div>
                        <div className="bg-white rounded-md p-3 shadow-sm">
                            <div className="text-xs text-gray-500 font-medium">Est. Slippage</div>
                            <div className="text-lg font-bold text-gray-900">{(simResult.estimatedSlippage / 100).toFixed(2)}%</div>
                        </div>
                        <div className="bg-white rounded-md p-3 shadow-sm">
                            <div className="text-xs text-gray-500 font-medium">Est. Gas</div>
                            <div className="text-lg font-bold text-gray-900">{simResult.estimatedGas.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded-md p-3 shadow-sm">
                            <div className="text-xs text-gray-500 font-medium">Liquidation Risk</div>
                            <div className={`text-lg font-bold ${simResult.liquidationRisk ? 'text-red-600' : 'text-green-600'}`}>
                                {simResult.liquidationRisk ? 'YES' : 'No'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className={`p-2 rounded text-center text-sm font-medium ${simResult.protocolVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            Protocol {simResult.protocolVerified ? '✓' : '✗'}
                        </div>
                        <div className={`p-2 rounded text-center text-sm font-medium ${simResult.spendLimitOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            Spend Limit {simResult.spendLimitOk ? '✓' : '✗'}
                        </div>
                        <div className={`p-2 rounded text-center text-sm font-medium ${simResult.slippageOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            Slippage {simResult.slippageOk ? '✓' : '✗'}
                        </div>
                    </div>

                    {simResult.failReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 font-mono">
                            Reason: {simResult.failReason}
                        </div>
                    )}
                </div>
            )}

            {/* History */}
            {simHistory.length > 0 && (
                <div className="bg-white shadow rounded-lg border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Recent Simulations</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {simHistory.map((sim, i) => (
                            <div key={i} className="px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className={`h-2.5 w-2.5 rounded-full ${sim.passed ? 'bg-green-500' : 'bg-red-400'}`}></span>
                                    <span className="font-mono text-sm text-gray-600">{sim.simId?.toString().slice(0,16)}...</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`text-sm font-bold ${riskColor(sim.riskScore)}`}>
                                        {(sim.riskScore / 1000).toFixed(2)}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sim.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {sim.passed ? 'PASSED' : 'FAILED'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status */}
            {status && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-800 break-all">
                    {status}
                </div>
            )}
        </div>
    );
};

export default Simulator;
