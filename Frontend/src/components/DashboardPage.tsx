import { useRef, useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  CheckCircle2,
  TrendingUp,
  Upload,
  Loader2,
  Wallet,
  ArrowUpRight,
  FileText,
  ScanFace,
  Building2,
  Gift
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock Data for "Always On" feel
const MOCK_INCOME_SOURCES = [
  { name: 'Swiggy', amount: 12500, date: '2024-03-10', verified: true, color: '#F7931E' },
  { name: 'Zomato', amount: 8400, date: '2024-03-12', verified: true, color: '#E23744' },
  { name: 'Uber', amount: 15200, date: '2024-03-15', verified: false, color: '#000000' },
  { name: 'Urban Co', amount: 6500, date: '2024-03-08', verified: true, color: '#333333' },
];

const MOCK_MONTHLY_DATA = [
  { month: 'Oct', amount: 32000 },
  { month: 'Nov', amount: 38000 },
  { month: 'Dec', amount: 42000 },
  { month: 'Jan', amount: 35000 },
  { month: 'Feb', amount: 45000 },
  { month: 'Mar', amount: 42600 },
];

export function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [incomeSources, setIncomeSources] = useState<any[]>(MOCK_INCOME_SOURCES);
  const [monthlyData, setMonthlyData] = useState<any[]>(MOCK_MONTHLY_DATA);
  const [loading, setLoading] = useState(false); // Default to false to show data immediately
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Still try to fetch real data, but don't clear mock data if it fails immediately
  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.incomeSources && data.incomeSources.length > 0) {
          setIncomeSources(data.incomeSources);
        }
        if (data.earningsData && data.earningsData.length > 0) {
          setMonthlyData(data.earningsData);
        }
      })
      .catch(err => console.log("Using static data"));
  }, []);

  const totalEarnings = incomeSources.reduce((sum, source) => sum + source.amount, 0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      setUploadMessage(null);

      // Simulate upload delay for realism
      setTimeout(() => {
        setUploading(false);
        setUploadMessage(`Uploaded: ${file.name}`);
        setTimeout(() => setUploadMessage(null), 3000);
      }, 1500);

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const QuickAction = ({ icon: Icon, label, color, bg }: any) => (
    <button className="flex flex-col items-center gap-2 p-2 active:scale-95 transition-transform">
      <div className={`p-4 rounded-2xl ${bg} ${color} shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </button>
  );

  return (
    <div className="pb-32 bg-slate-50 min-h-screen">
      {/* Top Header Section */}
      <div className="bg-white px-5 pt-8 pb-4 sticky top-0 z-10 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Welcome Back</p>
            <h1 className="text-xl font-bold text-slate-900">Rahul Sharma</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">RS</div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 mt-4">
        {/* Total Balance Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0A1F44] p-6 text-white shadow-xl shadow-indigo-900/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>

          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-1">Total Monthly Earnings</p>
            <h2 className="text-4xl font-bold tracking-tight mb-6">₹{totalEarnings.toLocaleString('en-IN')}</h2>

            <div className="flex gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white text-[#0A1F44] hover:bg-slate-100 border-0 rounded-xl h-12 font-semibold text-sm shadow-none"
              >
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Add Proof
              </Button>
              <Button className="flex-1 bg-white/10 text-white hover:bg-white/20 border-0 rounded-xl h-12 font-semibold text-sm backdrop-blur-md">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
            {uploadMessage && <p className="mt-3 text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {uploadMessage}</p>}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            <QuickAction icon={ScanFace} label="Verify" color="text-blue-600" bg="bg-blue-50" />
            <QuickAction icon={FileText} label="Analyzer" color="text-purple-600" bg="bg-purple-50" />
            <QuickAction icon={Building2} label="Decoder" color="text-orange-600" bg="bg-orange-50" />
            <QuickAction icon={Gift} label="Schemes" color="text-green-600" bg="bg-green-50" />
          </div>
        </div>

        {/* Earnings Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-medium mb-1">Verified Sources</p>
            <p className="text-2xl font-bold text-slate-900">{incomeSources.filter(s => s.verified).length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-medium mb-1">Growth</p>
            <p className="text-2xl font-bold text-green-600">+12.5%</p>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Earnings Trend</h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">6 Months</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 4, 4]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#0A1F44' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-base font-bold text-slate-900">Recent Earnings</h3>
            <button className="text-xs font-medium text-indigo-600">See All</button>
          </div>
          <div className="space-y-3">
            {incomeSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm" style={{ backgroundColor: source.color || '#3B82F6' }}>
                    {source.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{source.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400">{source.date}</span>
                      {source.verified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-600">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">₹{source.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
