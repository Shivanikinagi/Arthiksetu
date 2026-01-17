import { useRef, useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, AlertCircle, TrendingUp, Upload, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [incomeSources, setIncomeSources] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        // Map backend fields to frontend expected format if necessary
        // Assuming backend returns matching keys or we adapt here.
        // If DB is empty, we might want to show empty state or fallback?
        // For now, simple set.
        setIncomeSources(data.incomeSources || []);
        setMonthlyData(data.earningsData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      });
  }, []);

  const totalEarnings = incomeSources.reduce((sum, source) => sum + source.amount, 0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Income proof uploaded successfully: ${file.name}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Summary Section */}
      <div className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] rounded-2xl p-8 sm:p-12 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm opacity-90 mb-2">Total Monthly Earnings</p>
            <h1 className="text-5xl sm:text-6xl mb-3">₹{totalEarnings.toLocaleString('en-IN')}</h1>
            <p className="text-sm opacity-80 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Aggregated from {incomeSources.length} income sources
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#F7931E] hover:bg-[#e07d0a] text-white border-0 px-6 py-6"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Income Proof
          </Button>
        </div>
      </div>

      {/* Income Source Cards */}
      <div>
        <h2 className="mb-6 text-[#0A1F44]">Income Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeSources.length === 0 ? (
            <p className="text-gray-500 col-span-3">No income sources found.</p>
          ) : (
            incomeSources.map((source, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color || '#3B82F6' }}
                    />
                    <h4 className="text-gray-900">{source.name}</h4>
                  </div>
                  {source.verified ? (
                    <CheckCircle2 className="w-5 h-5 text-[#1E7F5C]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-3xl text-[#0A1F44]">
                    ₹{source.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {source.verified ? (
                      <span className="text-[#1E7F5C]">Verified</span>
                    ) : (
                      <span className="text-[#F59E0B]">Needs proof</span>
                    )}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Earnings Trend Graph */}
      <Card className="p-6 bg-white">
        <h3 className="mb-6 text-[#0A1F44]">Earnings Trend (6 Months)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) => `₹${(value / 1000)}k`}
              />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-l-4 border-l-[#1E7F5C]">
          <p className="text-sm text-gray-600 mb-1">Verified Sources</p>
          <p className="text-3xl text-[#0A1F44]">
            {incomeSources.filter(s => s.verified).length}
          </p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#3B82F6]">
          <p className="text-sm text-gray-600 mb-1">Monthly Average</p>
          <p className="text-3xl text-[#0A1F44]">
            {monthlyData.length > 0
              ? `₹${Math.round(monthlyData.reduce((a, b) => a + b.amount, 0) / monthlyData.length).toLocaleString('en-IN')}`
              : '₹0'}
          </p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#F7931E]">
          <p className="text-sm text-gray-600 mb-1">Growth (vs Last Month)</p>
          <p className="text-3xl text-[#1E7F5C]">+5.2%</p>
        </Card>
      </div>
    </div>
  );
}
