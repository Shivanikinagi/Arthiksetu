import { TrendingUp, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const earningsData = [
  { month: 'Jan', amount: 42000 },
  { month: 'Feb', amount: 38500 },
  { month: 'Mar', amount: 45200 },
  { month: 'Apr', amount: 48700 },
  { month: 'May', amount: 51300 },
  { month: 'Jun', amount: 48750 },
];

const incomeSources = [
  { name: 'Swiggy', amount: 12300, verified: true, status: 'verified' },
  { name: 'Zomato', amount: 9800, verified: true, status: 'verified' },
  { name: 'Freelance / Fiverr', amount: 15000, verified: true, status: 'verified' },
  { name: 'Cash Jobs', amount: 6500, verified: false, status: 'needs-proof' },
  { name: 'UPI Transfers', amount: 5150, verified: true, status: 'verified' },
  { name: 'Other', amount: 0, verified: false, status: 'add' },
];

export function Dashboard() {
  const totalEarnings = incomeSources.reduce((sum, source) => sum + source.amount, 0);
  const verifiedSources = incomeSources.filter(s => s.verified).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Summary Section */}
      <div className="bg-gradient-to-r from-[#0A1F44] to-[#1E3A5F] text-white rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[#E5E7EB] opacity-90 mb-2">Total Monthly Earnings</p>
            <h1 className="text-white m-0 mb-3">₹{totalEarnings.toLocaleString('en-IN')}</h1>
            <div className="flex items-center gap-2 text-[#10B981]">
              <TrendingUp size={20} />
              <span>Aggregated from {verifiedSources} verified income sources</span>
            </div>
          </div>
          <button className="bg-[#F7931E] hover:bg-[#E8850D] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md">
            <Plus size={20} />
            Add Income Proof
          </button>
        </div>
      </div>

      {/* Income Source Cards */}
      <div className="mb-8">
        <h2 className="mb-6">Income Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeSources.map((source, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                source.status === 'needs-proof'
                  ? 'border-[#F59E0B]'
                  : source.status === 'add'
                  ? 'border-dashed border-[#D1D5DB] hover:border-[#3B82F6]'
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="m-0">{source.name}</h4>
                {source.status === 'verified' && (
                  <CheckCircle size={20} className="text-[#1E7F5C]" />
                )}
                {source.status === 'needs-proof' && (
                  <AlertCircle size={20} className="text-[#F59E0B]" />
                )}
              </div>
              
              {source.amount > 0 ? (
                <>
                  <p className="text-[#0A1F44] text-2xl font-bold mb-2">
                    ₹{source.amount.toLocaleString('en-IN')}
                  </p>
                  {source.status === 'verified' && (
                    <span className="inline-block px-3 py-1 bg-[#D1FAE5] text-[#1E7F5C] rounded-full text-xs">
                      Verified
                    </span>
                  )}
                  {source.status === 'needs-proof' && (
                    <span className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs">
                      Needs Proof
                    </span>
                  )}
                </>
              ) : (
                <button className="text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-2 mt-2">
                  <Plus size={16} />
                  Add Source
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Trend Graph */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="mb-6">6-Month Earnings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
            />
            <Bar dataKey="amount" fill="#1E7F5C" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
