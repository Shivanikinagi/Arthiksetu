import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Menu,
  Upload,
  CheckCircle2,
  TrendingUp,
  ScanFace,
  FileText,
  Lock,
  Bot,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Mock Data
const MOCK_INCOME_SOURCES = [
  { name: 'Swiggy', amount: 12500, date: 'Today, 2:30 PM', verified: true },
  { name: 'Zomato', amount: 8400, date: 'Yesterday, 6:15 PM', verified: true },
  { name: 'Uber', amount: 15200, date: '12 Mar, 2024', verified: false },
];

const MOCK_MONTHLY_DATA = [
  { month: 'Oct', amount: 32000 },
  { month: 'Nov', amount: 38000 },
  { month: 'Dec', amount: 42000 },
  { month: 'Jan', amount: 35000 },
  { month: 'Feb', amount: 45000 },
  { month: 'Mar', amount: 42600 },
];

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
  onToggleSidebar?: () => void;
}

export function DashboardPage({ onNavigate, onToggleSidebar }: DashboardPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [incomeSources, setIncomeSources] = useState<any[]>(MOCK_INCOME_SOURCES);
  const [monthlyData, setMonthlyData] = useState<any[]>(MOCK_MONTHLY_DATA);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.incomeSources?.length > 0) setIncomeSources(data.incomeSources);
        if (data.earningsData?.length > 0) setMonthlyData(data.earningsData);
      })
      .catch(() => console.log("Using static data"));
  }, []);

  const totalEarnings = incomeSources.reduce((sum, source) => sum + source.amount, 0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadMessage(`Uploaded: ${file.name}`);
      setTimeout(() => setUploadMessage(null), 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#0A1F44] min-h-screen font-sans">

      {/* Top Section (Blue) */}
      <div className="px-6 pt-12 pb-8 text-white">
        {/* Header Bar */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <button
              className="p-1 -ml-1 active:scale-90 transition-transform"
              onClick={onToggleSidebar}
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold leading-none">ArthikSetu</h1>
              <p className="text-[10px] text-blue-200 mt-0.5 opacity-80 uppercase tracking-widest">Gig Economy Platform</p>
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold border border-white/10 active:scale-95 transition-transform"
            onClick={() => onNavigate && onNavigate('profile')}
          >
            RS
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <p className="text-blue-200 text-xs font-medium mb-1 opacity-90">Total Monthly Earnings</p>
          <h2 className="text-5xl font-bold tracking-tight">₹{totalEarnings.toLocaleString('en-IN')}</h2>
        </div>

        {/* Action Button (White Bar - Fake Input Style) */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-white text-[#0A1F44] h-12 rounded-xl px-4 flex items-center justify-between shadow-lg cursor-pointer active:scale-95 transition-transform mt-4"
        >
          <span className="text-gray-400 text-sm font-medium">Upload Document for Verification...</span>
          <div className="flex items-center gap-2 text-[#0A1F44] font-semibold text-sm">
            <Upload className="w-4 h-4" />
            <span>Add Proof</span>
          </div>
        </div>
        {uploadMessage && <p className="text-center text-xs text-green-400 mt-2">{uploadMessage}</p>}

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
      </div>

      {/* Bottom Sheet (White Content) */}
      <div className="bg-[#F8F9FA] rounded-t-[32px] px-6 pt-8 pb-32 min-h-[calc(100vh-300px)] animate-in slide-in-from-bottom-10 duration-500">

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Analyzer', id: 'ai-assistant', icon: FileText },
            { label: 'Decoder', id: 'message-decoder', icon: FileText }, // Distinct icon if available
            { label: 'Schemes', id: 'schemes', icon: Lock }, // Or Gift
            { label: 'Verify', id: 'document-verification', icon: ScanFace },
            { label: 'Tax', id: 'tax', icon: CheckCircle2 }, // Placeholder
            { label: 'Chatbot', id: 'chatbot', icon: Bot }, // Placeholder
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-28 active:scale-95 transition-transform"
            >
              <item.icon className="w-8 h-8 text-[#0A1F44] mb-3" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-[#0A1F44] tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="space-y-4 mb-8">
          <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-1">Verified Sources</p>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-bold text-[#0A1F44]">{incomeSources.filter(i => i.verified).length}</p>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-1">Growth</p>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-bold text-green-600">+1.5%</p>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            {/* Mini Chart Area */}
            <div className="h-12 mt-2 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <Area type="monotone" dataKey="amount" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
