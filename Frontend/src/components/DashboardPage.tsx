import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, AlertCircle, TrendingUp, Upload } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const earningsSources = [
  { name: 'Swiggy', amount: 12300, verified: true, color: '#F7931E' },
  { name: 'Zomato', amount: 9800, verified: true, color: '#3B82F6' },
  { name: 'Freelance / Fiverr', amount: 15000, verified: true, color: '#1E7F5C' },
  { name: 'Cash Jobs', amount: 6500, verified: false, color: '#F59E0B' },
  { name: 'UPI Transfers', amount: 5150, verified: true, color: '#0A1F44' },
];

const monthlyData = [
  { month: 'Jul', amount: 42000 },
  { month: 'Aug', amount: 45500 },
  { month: 'Sep', amount: 48200 },
  { month: 'Oct', amount: 46800 },
  { month: 'Nov', amount: 51300 },
  { month: 'Dec', amount: 48750 },
];

export function DashboardPage() {
  const totalEarnings = earningsSources.reduce((sum, source) => sum + source.amount, 0);

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
              Aggregated from {earningsSources.length} income sources
            </p>
          </div>
          <Button 
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
          {earningsSources.map((source) => (
            <Card key={source.name} className="p-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: source.color }}
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
          ))}
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
            {earningsSources.filter(s => s.verified).length}
          </p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#3B82F6]">
          <p className="text-sm text-gray-600 mb-1">Monthly Average</p>
          <p className="text-3xl text-[#0A1F44]">₹47,592</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#F7931E]">
          <p className="text-sm text-gray-600 mb-1">Growth (vs Last Month)</p>
          <p className="text-3xl text-[#1E7F5C]">+5.2%</p>
        </Card>
      </div>
    </div>
  );
}
