import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, AlertTriangle, RefreshCw, BarChart2, PieChart as PieChartIcon, LayoutDashboard, Sparkles, ArrowRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const COLORS = ['#F7931E', '#0A1F44', '#1E7F5C', '#3B82F6', '#F59E0B', '#8B5CF6'];

export function UnifiedDashboard() {
    const [platformData, setPlatformData] = useState({
        'Swiggy': 15000,
        'Zomato': 12000,
        'Uber': 18000,
        'Ola': 8000,
        'UrbanCompany': 10000,
    });
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [riskPrediction, setRiskPrediction] = useState<any>(null);

    const totalEarnings = Object.values(platformData).reduce((sum, val) => sum + val, 0);

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/unified_dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform_data: platformData,
                    total_earnings: totalEarnings
                })
            });
            const data = await response.json();
            setAnalysis(data);

            // Also fetch risk prediction
            const earningsHistory = [
                { date: '2025-01', amount: 45000 },
                { date: '2025-02', amount: 48000 },
                { date: '2025-03', amount: 42000 },
                { date: '2025-04', amount: 51000 },
                { date: '2025-05', amount: totalEarnings },
            ];

            const riskResponse = await fetch('http://localhost:8000/api/predict_risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: earningsHistory })
            });
            const riskData = await riskResponse.json();
            setRiskPrediction(riskData);
        } catch (error) {
            console.error('Error fetching analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const chartData = Object.entries(platformData).map(([name, value]) => ({
        name,
        earnings: value
    }));

    const pieData = Object.entries(platformData).map(([name, value]) => ({
        name,
        value
    }));

    const getRiskColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'low': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-600' };
            case 'medium': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-600' };
            case 'high': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: 'text-gray-600' };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-blue-50/20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Header */}
                <div className="animate-fade-in-up flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-full mb-3 border border-indigo-200">
                            <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-semibold text-indigo-700">Platform Analytics</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">Unified Earnings Dashboard</h1>
                        <p className="text-gray-600 text-lg">Aggregated income analysis across all your gig platforms</p>
                    </div>
                    <Button
                        onClick={fetchAnalysis}
                        disabled={loading}
                        className="group bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md px-6 py-3 rounded-xl transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        Refresh Data
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                    <Card className="p-8 text-white rounded-2xl shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1E3A5F 100%)' }}>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                            <TrendingUp className="w-32 h-32 text-white" />
                        </div>
                        <div className="relative">
                            <p className="text-blue-200 font-medium mb-1">Total Verified Earnings</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-black heading-display">₹{totalEarnings.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-green-300">
                                <Activity className="w-4 h-4" />
                                <span className="text-sm font-semibold">From {analysis?.platform_count || 5} active platforms</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
                        <div className="relative">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 font-medium mb-1">Top Performing Platform</p>
                            <h3 className="text-2xl font-bold text-[#0A1F44] mb-2 heading-primary">
                                {analysis?.top_platform || Object.entries(platformData).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600">
                                    ₹{(analysis?.top_platform && platformData[analysis.top_platform as keyof typeof platformData]
                                        ? platformData[analysis.top_platform as keyof typeof platformData]
                                        : Object.values(platformData).reduce((a, b) => Math.max(a, b), 0)).toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">/ month</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-100 to-transparent rounded-tl-full -mr-10 -mb-10 opacity-50"></div>
                        <div className="relative">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                                <PieChartIcon className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 font-medium mb-1">Diversification Score</p>
                            <div className="flex items-end gap-2 mb-2">
                                <h3 className="text-4xl font-black text-[#F7931E] heading-display leading-none">
                                    {analysis?.diversification_score || 0}
                                </h3>
                                <span className="text-gray-400 font-semibold mb-1">/ 100</span>
                            </div>
                            <p className={`text-sm font-medium ${analysis?.diversification_score > 40 ? 'text-green-600' : 'text-orange-600'}`}>
                                {analysis?.diversification_score > 40 ? '✨ Well diversified portfolio' : '⚠️ Consider adding more platforms'}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Risk Prediction Card */}
                {riskPrediction && (
                    <Card className={`animate-fade-in-up p-8 border-l-4 rounded-2xl shadow-lg ${getRiskColor(riskPrediction.risk_level).bg} ${getRiskColor(riskPrediction.risk_level).border} border-l-[6px]`}>
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className={`p-4 rounded-2xl bg-white shadow-sm shrink-0 ${getRiskColor(riskPrediction.risk_level).icon}`}>
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className={`text-2xl font-bold heading-primary ${getRiskColor(riskPrediction.risk_level).text}`}>
                                                Income Risk Analysis
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white border ${getRiskColor(riskPrediction.risk_level).border} ${getRiskColor(riskPrediction.risk_level).text}`}>
                                                {riskPrediction.risk_level} Risk
                                            </span>
                                        </div>
                                        <p className="text-gray-600 font-medium opacity-80">
                                            AI-powered prediction based on your earning history
                                        </p>
                                    </div>
                                    <div className="bg-white/60 px-5 py-3 rounded-xl border border-white/50">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Risk Score</p>
                                        <p className={`text-2xl font-black heading-display ${getRiskColor(riskPrediction.risk_level).text}`}>{riskPrediction.risk_score}/100</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 rounded-xl p-6 border border-white/50">
                                    {riskPrediction.predicted_low_months?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-gray-500" />
                                                Potential Low Earning Months
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {riskPrediction.predicted_low_months.map((month: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm font-medium">
                                                        {month}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {riskPrediction.suggestions?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                                AI Suggestions
                                            </p>
                                            <ul className="space-y-2">
                                                {riskPrediction.suggestions.map((suggestion: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                                        <span className="leading-tight">{suggestion}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                    {/* Bar Chart */}
                    <Card className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-[#0A1F44] heading-primary flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-blue-600" />
                                    Platform Earnings
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Comparative view of income sources</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#F7931E" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#F7931E" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="earnings" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-[#0A1F44] heading-primary flex items-center gap-2">
                                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                                    Income Distribution
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Percentage share of each platform</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 h-[350px]">
                            <div className="flex-1 h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full md:w-48 space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                                {Object.entries(platformData).map(([platform, amount], idx) => (
                                    <div key={platform} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[80px]">{platform}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">
                                            {((amount / totalEarnings) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Detailed Breakdown */}
                <Card className="animate-fade-in-up p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-[#0A1F44] heading-primary mb-6">Detailed Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(platformData).map(([platform, amount], idx) => (
                            <div
                                key={platform}
                                className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all hover:shadow-md cursor-default"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm text-white font-bold text-lg" style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                                        {platform.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{platform}</p>
                                        <p className="text-xs text-gray-500 font-medium">Gig Platform</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-black text-[#0A1F44]">
                                        ₹{amount.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                                        {((amount / totalEarnings) * 100).toFixed(1)}% Share
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
