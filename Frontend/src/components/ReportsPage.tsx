import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, FileText, TrendingUp, Calendar } from 'lucide-react';

export function ReportsPage() {
  const reports = [
    { name: 'Annual Income Report 2024', date: 'Dec 30, 2024', type: 'PDF', size: '245 KB' },
    { name: 'Monthly Earnings - December', date: 'Dec 30, 2024', type: 'PDF', size: '128 KB' },
    { name: 'Tax Statement FY 2024-25', date: 'Dec 15, 2024', type: 'PDF', size: '198 KB' },
    { name: 'Income Passport (Verified)', date: 'Dec 1, 2024', type: 'PDF', size: '312 KB' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-[#0A1F44] mb-2">Reports & Documents</h1>
        <p className="text-gray-600">
          Download your verified income reports and tax documents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-l-4 border-l-[#3B82F6]">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-8 h-8 text-[#3B82F6]" />
            <p className="text-sm text-gray-600">Total Reports</p>
          </div>
          <p className="text-3xl text-[#0A1F44]">12</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#1E7F5C]">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8 text-[#1E7F5C]" />
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          <p className="text-3xl text-[#0A1F44]">3</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#F7931E]">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-8 h-8 text-[#F7931E]" />
            <p className="text-sm text-gray-600">Last Generated</p>
          </div>
          <p className="text-lg text-[#0A1F44]">Today</p>
        </Card>
      </div>

      <Card className="p-6 bg-white">
        <h3 className="text-[#0A1F44] mb-6">Available Reports</h3>
        <div className="space-y-3">
          {reports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0A1F44] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[#0A1F44] mb-1">{report.name}</h4>
                  <p className="text-sm text-gray-600">
                    {report.date} • {report.type} • {report.size}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white"
                onClick={() => {
                  const fileName = report.name.replace(/\s+/g, '_').toLowerCase();
                  alert(`Downloading ${fileName}.pdf...`);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
