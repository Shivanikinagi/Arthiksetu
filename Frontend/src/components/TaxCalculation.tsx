import { Shield, Download, FileText, TrendingDown } from "lucide-react";

const taxData = {
  annualIncome: 585000,
  taxPayable: 0,
  refundEligible: 4200,
  deductions: [
    { name: 'Section 80C - PPF via UPI', amount: 12000, suggested: true },
    { name: 'Health Insurance (80D)', amount: 5000, suggested: true },
    { name: 'Education Loan Interest', amount: 0, suggested: true },
  ],
  standardDeduction: 50000,
};

export function TaxCalculation() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2">Your Tax Summary</h2>
        <p className="text-[#6B7280]">Simple, transparent tax calculation based on your verified income</p>
      </div>

      {/* Safety Banner */}
      <div className="bg-[#EFF6FF] border-l-4 border-[#3B82F6] p-4 mb-8 rounded-r-lg flex items-start gap-3">
        <Shield className="text-[#3B82F6] flex-shrink-0 mt-1" size={24} />
        <div>
          <h4 className="m-0 mb-1 text-[#1E40AF]">Audit-Safe Income Reporting</h4>
          <p className="m-0 text-[#1E40AF]">
            All calculations follow IT Department guidelines. Your income is verified and ready for ITR filing.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Annual Income */}
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#3B82F6]">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-[#3B82F6]" />
            <p className="m-0 text-[#6B7280]">Estimated Annual Income</p>
          </div>
          <h2 className="m-0 text-[#0A1F44]">₹{taxData.annualIncome.toLocaleString('en-IN')}</h2>
          <p className="m-0 mt-2 text-xs text-[#6B7280]">Based on 12-month projection</p>
        </div>

        {/* Tax Payable */}
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#1E7F5C]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-[#1E7F5C]" />
            <p className="m-0 text-[#6B7280]">Tax Payable</p>
          </div>
          <h2 className="m-0 text-[#1E7F5C]">₹{taxData.taxPayable.toLocaleString('en-IN')}</h2>
          <p className="m-0 mt-2 text-xs text-[#1E7F5C]">You're under the tax threshold!</p>
        </div>

        {/* Refund Eligible */}
        <div className="bg-gradient-to-br from-[#1E7F5C] to-[#15614A] text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Download size={20} />
            <p className="m-0 opacity-90">Refund Eligible</p>
          </div>
          <h2 className="m-0 text-white">₹{taxData.refundEligible.toLocaleString('en-IN')}</h2>
          <p className="m-0 mt-2 text-xs opacity-90">TDS already paid can be claimed!</p>
        </div>
      </div>

      {/* Deductions Panel */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <h3 className="mb-4">Smart Deduction Suggestions</h3>
        <p className="mb-6 text-[#6B7280]">
          Maximize your savings with these deductions based on your UPI transactions and profile
        </p>
        
        <div className="space-y-4">
          {taxData.deductions.map((deduction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
            >
              <div className="flex-1">
                <h4 className="m-0 mb-1">{deduction.name}</h4>
                {deduction.suggested && deduction.amount === 0 && (
                  <p className="m-0 text-xs text-[#F59E0B]">Suggested based on your spending</p>
                )}
                {deduction.amount > 0 && (
                  <p className="m-0 text-xs text-[#1E7F5C]">Added ₹{deduction.amount.toLocaleString('en-IN')}</p>
                )}
              </div>
              {deduction.amount > 0 ? (
                <span className="px-4 py-2 bg-[#D1FAE5] text-[#1E7F5C] rounded-md">
                  ₹{deduction.amount.toLocaleString('en-IN')}
                </span>
              ) : (
                <button className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md transition-colors">
                  Add Proof
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]">
          <p className="m-0 text-[#92400E]">
            <strong>Potential Savings:</strong> You could save up to ₹17,000 more by maximizing Section 80C deductions
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="flex-1 min-w-[200px] bg-[#F7931E] hover:bg-[#E8850D] text-white px-8 py-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2">
          <FileText size={20} />
          File ITR Now
        </button>
        <button className="flex-1 min-w-[200px] bg-white hover:bg-[#F9FAFB] text-[#0A1F44] border-2 border-[#0A1F44] px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Download size={20} />
          Download Income Passport (PDF)
        </button>
      </div>
    </div>
  );
}
