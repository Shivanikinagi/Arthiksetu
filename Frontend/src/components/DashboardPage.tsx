import { useRef, useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, AlertCircle, TrendingUp, Upload, Loader2, MessageSquare, Bot, FileSearch, ShieldCheck, Gift, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../config';

export function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [incomeSources, setIncomeSources] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error('Backend not responding');
        return res.json();
      })
      .then(data => {
        console.log('Dashboard data:', data);
        setIncomeSources(data.incomeSources || []);
        setMonthlyData(data.earningsData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data", err);
        setError('Unable to connect to backend. Please ensure the backend server is running on port 8000.');
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
        const response = await fetch(`${API_BASE_URL}/api/verify_document`, {
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="text-white shadow-md mb-8" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0A1F44 100%)', borderRadius: '0 0 24px 24px' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white mb-2 uppercase tracking-wide" style={{ opacity: 0.9 }}>Total Monthly Earnings</p>
              <h1 className="text-6xl font-bold mb-2 tracking-tight text-white">
                ₹{totalEarnings.toLocaleString('en-IN')}
              </h1>
              <p className="text-sm text-white flex items-center gap-1 font-light opacity-90">
                <TrendingUp className="w-4 h-4" />
                Aggregated from {incomeSources.length} income sources
              </p>
            </div>
            <div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="text-white px-8 py-3.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ backgroundColor: '#ff8c42' }}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Add Income Proof
                  </>
                )}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
              />
            </div>
            {uploadMessage && (
              <p className="mt-4 text-sm text-gray-600">{uploadMessage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Income Sources */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Income Sources</h2>
          {incomeSources.length === 0 ? (
            <Card className="p-12 bg-gradient-to-br from-gray-50 to-gray-100 text-center border-2 border-dashed border-gray-300">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1F44]">No Income Sources Yet</h3>
                <p className="text-gray-600 max-w-md">
                  Upload your income proof or use SMS Analyzer to start tracking
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {incomeSources.map((source, idx) => (
                <Card key={idx} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${source.verified ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                      <h3 className="text-sm font-medium text-gray-700">{source.name || source.source}</h3>
                    </div>
                    {source.verified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    ₹{source.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {source.verified ? 'Verified' : 'Verified'}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Earnings Chart */}
        <Card className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-gray-700" />
            Earnings Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => `₹${(value / 1000)}k`} />
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Features */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Unified Dashboard</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                View earnings across all platforms in one place
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">SMS Analyzer</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automatically extract earnings from SMS messages
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Chat for personalized financial advice
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Message Decoder</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Decode confusing bank and platform messages
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Document Verification</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Verify Aadhaar, PAN, License with AI OCR
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Government Schemes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get personalized scheme recommendations
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
