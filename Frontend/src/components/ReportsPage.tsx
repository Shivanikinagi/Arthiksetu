import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, FileText, TrendingUp, Calendar, FileCheck, Shield, Clock } from 'lucide-react';

export function ReportsPage() {
  const reports = [
    { id: 'annual_2024', name: 'Annual Income Report 2024', date: 'Dec 30, 2024', type: 'PDF', size: '245 KB', category: 'Annual' },
    { id: 'monthly_dec_2024', name: 'Monthly Earnings - December', date: 'Dec 30, 2024', type: 'PDF', size: '128 KB', category: 'Monthly' },
    { id: 'tax_statement_24_25', name: 'Tax Statement FY 2024-25', date: 'Dec 15, 2024', type: 'PDF', size: '198 KB', category: 'Tax' },
    { id: 'income_proof_verified', name: 'Income Passport (Verified)', date: 'Dec 1, 2024', type: 'PDF', size: '312 KB', category: 'Verification', verified: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/20 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full mb-3 border border-blue-200">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Document Center</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">Reports & Documents</h1>
            <p className="text-gray-600 text-lg">Securely download your verified income reports and legitimate tax documents.</p>
          </div>
          <Button className="bg-[#0A1F44] hover:bg-[#152c57] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
            <Calendar className="w-5 h-5 mr-2" />
            Generate Custom Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-start gap-4 relative">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Reports</p>
                <p className="text-4xl font-black text-gray-900 heading-display mt-1">12</p>
                <p className="text-sm text-gray-500 mt-2">stored securely</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-start gap-4 relative">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">New This Month</p>
                <p className="text-4xl font-black text-gray-900 heading-display mt-1">3</p>
                <p className="text-sm text-green-600 font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2 from last month
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-start gap-4 relative">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Last Generated</p>
                <p className="text-2xl font-black text-gray-900 heading-display mt-1">Today</p>
                <p className="text-sm text-gray-500 mt-1">10:45 AM</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Reports List */}
        <Card className="animate-fade-in-up p-8 bg-white rounded-3xl shadow-lg border border-gray-100" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#0A1F44] heading-primary">Available Reports</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg text-xs font-semibold">Filter by Date</Button>
              <Button variant="outline" size="sm" className="rounded-lg text-xs font-semibold">Filter by Type</Button>
            </div>
          </div>

          <div className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="stagger-item group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all hover:shadow-md cursor-pointer"
              >
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 transition-colors ${report.category === 'Tax' ? 'bg-orange-100 text-orange-600' :
                      report.category === 'Verification' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {report.verified ? <Shield className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{report.name}</h4>
                      {report.verified && (
                        <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-md">Verified</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {report.date}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs uppercase tracking-wide text-gray-600">
                        {report.type}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center justify-end">
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 group-hover:bg-white transition-all font-semibold rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (report.id === 'annual_2024') {
                        window.open('http://localhost:8000/api/generate_report', '_blank');
                      } else {
                        window.open(`http://localhost:8000/api/download_report/${report.id}`, '_blank');
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
