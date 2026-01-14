import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, FileText, TrendingUp, Calendar, Menu, ChevronLeft } from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (page: string) => void;
  onToggleSidebar: () => void;
}

export function ReportsPage({ onNavigate, onToggleSidebar }: ReportsPageProps) {
  const reports = [
    { id: 'annual_2024', name: 'Annual Income Report 2024', date: 'Dec 30, 2024', type: 'PDF', size: '245 KB' },
    { id: 'monthly_dec_2024', name: 'Monthly Earnings - December', date: 'Dec 30, 2024', type: 'PDF', size: '128 KB' },
    { id: 'tax_statement_24_25', name: 'Tax Statement FY 2024-25', date: 'Dec 15, 2024', type: 'PDF', size: '198 KB' },
    { id: 'income_proof_verified', name: 'Income Passport (Verified)', date: 'Dec 1, 2024', type: 'PDF', size: '312 KB' },
  ];

  return (
    <div className="bg-[#0A1F44] min-h-screen font-sans">

      {/* Mobile Header */}
      <div className="px-6 pt-12 pb-8 text-white flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold">Reports</h1>
      </div>

      {/* Content Sheet */}
      <div className="bg-[#F8F9FA] rounded-t-[32px] px-6 pt-8 pb-32 min-h-[calc(100vh-100px)] animate-in slide-in-from-bottom-10 duration-500">

        {/* Horizontal Stats Scroll */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 mb-8">
          <div className="min-w-[140px] p-4 bg-white rounded-2xl border border-gray-100 flex flex-col justify-between h-32 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A1F44]">12</p>
              <p className="text-xs text-gray-500 font-medium">Total Reports</p>
            </div>
          </div>
          <div className="min-w-[140px] p-4 bg-white rounded-2xl border border-gray-100 flex flex-col justify-between h-32 shadow-sm">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A1F44]">3</p>
              <p className="text-xs text-gray-500 font-medium">This Month</p>
            </div>
          </div>
          <div className="min-w-[140px] p-4 bg-white rounded-2xl border border-gray-100 flex flex-col justify-between h-32 shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#0A1F44]">Today</p>
              <p className="text-xs text-gray-500 font-medium">Generated</p>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div>
          <h3 className="text-[#0A1F44] font-bold mb-4">Available Reports</h3>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 p-5 bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0A1F44]/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#0A1F44]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0A1F44] text-sm leading-tight mb-1">{report.name}</h4>
                    <p className="text-xs text-gray-400">{report.date} • {report.size}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-[#0A1F44]/20 text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white h-11 text-xs font-semibold"
                  onClick={() => {
                    // Simulate navigation
                    const url = report.id === 'annual_2024'
                      ? 'http://localhost:8000/api/generate_report'
                      : `http://localhost:8000/api/download_report/${report.id}`;
                    window.open(url, '_blank');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
