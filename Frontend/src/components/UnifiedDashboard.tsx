import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
            case 'low': return 'text-green-600 bg-green-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'high': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A1F44]">Unified Earnings Dashboard</h1>
                    <p className="text-gray-500 mt-1">Aggregated income across all platforms</p>
                </div>
                <Button onClick={fetchAnalysis} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-gradient-to-br from-[#0A1F44] to-[#1E3A5F] text-white">
                    <p className="text-sm opacity-80 mb-2">Total Earnings</p>
                    <h2 className="text-4xl font-bold mb-2">₹{totalEarnings.toLocaleString('en-IN')}</h2>
                    <div className="flex items-center gap-2 text-green-400">
                        <TrendingUp size={18} />
                        <span className="text-sm">From {analysis?.platform_count || 5} platforms</span>
                    </div>
                </Card>

                <Card className="p-6">
                    <p className="text-sm text-gray-600 mb-2">Top Platform</p>
                    <h3 className="text-2xl font-bold text-[#0A1F44] mb-2">
                        {analysis?.top_platform || 'Loading...'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        ₹{platformData[analysis?.top_platform] ? platformData[analysis.top_platform].toLocaleString('en-IN') : '0'}
                    </p>
                </Card>

                <Card className="p-6">
                    <p className="text-sm text-gray-600 mb-2">Diversification Score</p>
                    <h3 className="text-2xl font-bold text-[#F7931E] mb-2">
                        {analysis?.diversification_score || 0}/100
                    </h3>
                    <p className="text-sm text-gray-500">
                        {analysis?.diversification_score > 40 ? 'Well diversified' : 'Consider more platforms'}
                    </p>
                </Card>
            </div>

            {/* Risk Prediction Card */}
            {riskPrediction && (
                <Card className="p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${getRiskColor(riskPrediction.risk_level)}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-[#0A1F44] mb-2">
                                Income Risk Prediction: {riskPrediction.risk_level}
                            </h3>
                            <p className="text-gray-600 mb-3">
                                Risk Score: {riskPrediction.risk_score}/100 | Trend: {riskPrediction.trend}
                            </p>
                            {riskPrediction.predicted_low_months?.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Potential Low Earning Months:</p>
                                    <p className="text-sm text-gray-600">
                                        {riskPrediction.predicted_low_months.join(', ')}
                                    </p>
                                </div>
                            )}
                            {riskPrediction.suggestions?.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Suggestions:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {riskPrediction.suggestions.map((suggestion: string, idx: number) => (
                                            <li key={idx}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-[#0A1F44] mb-4">Platform-wise Earnings</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="earnings" fill="#F7931E" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Pie Chart */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-[#0A1F44] mb-4">Income Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Platform Details */}
            <Card className="p-6">
                <h3 className="text-xl font-semibold text-[#0A1F44] mb-4">Platform Breakdown</h3>
                <div className="space-y-3">
                    {Object.entries(platformData).map(([platform, amount]) => (
                        <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[Object.keys(platformData).indexOf(platform) % COLORS.length] }}></div>
                                <span className="font-medium text-[#0A1F44]">{platform}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-semibold text-[#0A1F44]">
                                    ₹{amount.toLocaleString('en-IN')}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {((amount / totalEarnings) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
