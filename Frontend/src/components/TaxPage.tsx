import { Card } from './ui/card';
import { Button } from './ui/button';
import { Shield, FileText, Download, CheckCircle, Info } from 'lucide-react';

const taxDeductions = [
  { 
    section: 'Section 80C', 
    description: 'EPF, PPF, Life Insurance premiums', 
    currentAmount: 45000,
    maxAmount: 150000,
    savings: 13500 
  },
  { 
    section: 'Section 80D', 
    description: 'Health Insurance Premium', 
    currentAmount: 12000,
    maxAmount: 25000,
    savings: 3600 
  },
  { 
    section: 'Section 80E', 
    description: 'Education Loan Interest', 
    currentAmount: 0,
    maxAmount: 0,
    savings: 0 
  },
];

export function TaxPage() {
  const annualIncome = 585000; // 48,750 * 12
  const taxPayable = 0;
  const refundEligible = 8500;
  const totalDeductions = taxDeductions.reduce((sum, d) => sum + d.currentAmount, 0);
  const totalSavings = taxDeductions.reduce((sum, d) => sum + d.savings, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[#0A1F44] mb-2">Your Tax Summary</h1>
        <p className="text-gray-600">
          Simple, transparent tax calculation based on your verified income
        </p>
      </div>

      {/* Safety Banner */}
      <Card className="p-6 bg-gradient-to-r from-[#1E7F5C]/10 to-[#1E7F5C]/5 border-[#1E7F5C]/30">
        <div className="flex items-start gap-4">
          <div className="bg-[#1E7F5C] rounded-full p-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#0A1F44] mb-1">Audit-Safe Income Reporting</h3>
            <p className="text-sm text-gray-600">
              All calculations are based on verified income sources with proper documentation. 
              Your data is secure and compliant with IT Department guidelines.
            </p>
          </div>
        </div>
      </Card>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <h4 className="text-gray-700">Estimated Annual Income</h4>
          </div>
          <p className="text-4xl text-[#0A1F44] mb-2">
            ₹{annualIncome.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-gray-500">Based on current monthly earnings</p>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow border-l-4 border-l-[#0A1F44]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#0A1F44]/10 rounded-lg flex items-center justify-center">
              <Info className="w-6 h-6 text-[#0A1F44]" />
            </div>
            <h4 className="text-gray-700">Tax Payable</h4>
          </div>
          <p className="text-4xl text-[#0A1F44] mb-2">
            ₹{taxPayable.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-[#1E7F5C] flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Income below taxable limit
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#1E7F5C] to-[#16654a] text-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4>Refund Eligible</h4>
          </div>
          <p className="text-4xl mb-2">
            ₹{refundEligible.toLocaleString('en-IN')}
          </p>
          <p className="text-sm opacity-90">TDS already deducted from sources</p>
        </Card>
      </div>

      {/* Deductions Panel */}
      <Card className="p-6 bg-white">
        <h3 className="text-[#0A1F44] mb-6">Tax Deductions & Savings</h3>
        <div className="space-y-4">
          {taxDeductions.map((deduction) => (
            <div 
              key={deduction.section}
              className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#3B82F6] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[#0A1F44]">{deduction.section}</h4>
                    {deduction.currentAmount > 0 && (
                      <span className="px-2 py-1 bg-[#1E7F5C] text-white text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{deduction.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Current</p>
                    <p className="text-lg text-[#0A1F44]">
                      ₹{deduction.currentAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  {deduction.maxAmount > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Max Limit</p>
                      <p className="text-lg text-gray-400">
                        ₹{deduction.maxAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Tax Saved</p>
                    <p className="text-lg text-[#1E7F5C]">
                      ₹{deduction.savings.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
              {deduction.maxAmount > 0 && deduction.currentAmount < deduction.maxAmount && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-[#F7931E]">
                    💡 You can save ₹{((deduction.maxAmount - deduction.currentAmount) * 0.3).toLocaleString('en-IN')} 
                    more by utilizing the remaining ₹{(deduction.maxAmount - deduction.currentAmount).toLocaleString('en-IN')} limit
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Deductions</p>
              <p className="text-2xl text-[#0A1F44]">₹{totalDeductions.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Tax Saved</p>
              <p className="text-2xl text-[#1E7F5C]">₹{totalSavings.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="flex-1 bg-[#F7931E] hover:bg-[#e07d0a] text-white border-0 py-6"
        >
          <FileText className="w-5 h-5 mr-2" />
          File ITR Now
        </Button>
        <Button 
          variant="outline"
          className="flex-1 border-2 border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white py-6"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Income Passport (PDF)
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="p-6 bg-[#3B82F6]/10 border-[#3B82F6]/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              Your Income Passport is a verified document that consolidates all your earnings. 
              Use it for loan applications, visa processing, or government benefit eligibility.
            </p>
            <p className="text-xs text-gray-600">
              Valid for: Bank Loans • Credit Cards • Visa Applications • Government Schemes
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
