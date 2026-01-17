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
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard')
      .then(res => res.json())
      .then(data => {
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      setUploadMessage(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('doc_type', 'Income Proof');

      try {
        const response = await fetch('http://localhost:8000/api/verify_document', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setUploadMessage(`Uploaded: ${file.name}`);
          // Optionally refresh data here if verification adds a new source immediately
        } else {
          setUploadMessage(`Upload failed: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadMessage('Error uploading file. Please try again.');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm opacity-90 mb-2">Total Monthly Earnings</p>
            <h1 className="text-5xl sm:text-6xl mb-3">₹{totalEarnings.toLocaleString('en-IN')}</h1>
            <p className="text-sm opacity-80 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Aggregated from {incomeSources.length} income sources
            </p>
          </div>

          <div className="relative">
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
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? 'Uploading...' : 'Add Income Proof'}
            </Button>
            {uploadMessage && (
              <div className="absolute top-full right-0 mt-2 bg-white text-sm text-[#0A1F44] p-2 rounded shadow-lg border border-gray-200 z-10 w-full md:w-auto min-w-[200px]">
                {uploadMessage}
              </div>
            )}
          </div>
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
          <p className={`text-3xl ${(() => {
            if (monthlyData.length < 2) return 'text-gray-600';
            const lastMonth = monthlyData[monthlyData.length - 1].amount;
            const prevMonth = monthlyData[monthlyData.length - 2].amount;
            const growth = ((lastMonth - prevMonth) / prevMonth) * 100;
            return growth >= 0 ? 'text-[#1E7F5C]' : 'text-red-500';
          })()
            }`}>
            {(() => {
              if (monthlyData.length < 2) return 'N/A';
              const lastMonth = monthlyData[monthlyData.length - 1].amount;
              const prevMonth = monthlyData[monthlyData.length - 2].amount;
              const growth = ((lastMonth - prevMonth) / prevMonth) * 100;
              return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
            })()}
          </p>
        </Card>
      </div>
    </div>
  );
}
