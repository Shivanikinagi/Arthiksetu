import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { API_BASE_URL } from '../config';

import { Card } from './ui/card';
import { Button } from './ui/button';
import { Shield, FileText, Download, CheckCircle, Info, Calculator, TrendingUp, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';

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
  const [totalAnnualEarnings, setTotalAnnualEarnings] = useState(0);
  const [taxPayable, setTaxPayable] = useState(0);
  const [refundEligible, setRefundEligible] = useState(0);
  const [incomeSources, setIncomeSources] = useState<any[]>([]);

  useEffect(() => {
    // Fetch calculated tax data from backend
    fetch(`${API_BASE_URL}/api/tax_calculation`)
      .then(res => res.json())
      .then(data => {
        setTotalAnnualEarnings(data.annual_income);
        setTaxPayable(data.tax_payable);
        setRefundEligible(data.refund_eligible);
      })
      .catch(err => console.error("Failed to fetch tax calculations", err));

    // Fetch income sources for PDF
    fetch(`${API_BASE_URL}/api/dashboard`)
      .then(res => res.json())
      .then(data => {
        setIncomeSources(data.incomeSources || []);
      })
      .catch(err => console.error("Failed to fetch sources", err));
  }, []);

  const annualIncome = totalAnnualEarnings;
  const totalDeductions = taxDeductions.reduce((sum, d) => sum + d.currentAmount, 0);
  const totalSavings = taxDeductions.reduce((sum, d) => sum + d.savings, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header Color
    doc.setFillColor(10, 31, 68); // #0A1F44
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("ArthikSetu", 14, 20);

    doc.setFontSize(14);
    doc.text("Income Passport", 14, 28);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 160, 25);
    doc.text("Verified Document", 160, 30);

    // Reset Text Color
    doc.setTextColor(0, 0, 0);

    // Summary Section
    doc.setFontSize(16);
    doc.text("Financial Summary (Annual)", 14, 55);

    autoTable(doc, {
      startY: 60,
      head: [['Metric', 'Amount']],
      body: [
        ['Estimated Annual Earnings', `Rs. ${annualIncome.toLocaleString('en-IN')}`],
        ['Tax Payable', `Rs. ${taxPayable.toLocaleString('en-IN')}`],
        ['Refund Eligible', `Rs. ${refundEligible.toLocaleString('en-IN')}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [10, 31, 68] },
    });

    // Income Sources Detail
    const finalY = (doc as any).lastAutoTable.finalY || 100;

    doc.text("Verified Income Sources (Monthly)", 14, finalY + 15);

    const sourceRows = incomeSources.map(s => [
      s.name,
      `Rs. ${s.amount.toLocaleString('en-IN')}`,
      s.verified ? 'Verified' : 'Pending'
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Source', 'Monthly Amount', 'Status']],
      body: sourceRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 127, 92] }, // Greenish
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("ArthikSetu - Empowering Gig Workers", 14, pageHeight - 10);
    doc.text("This document is computer generated and valid for banking purposes.", 14, pageHeight - 5);

    doc.save("Income_Passport_Verified_2024.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full mb-3 border border-blue-200">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Financial Planning</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">Your Tax Summary</h1>
          <p className="text-gray-600 text-lg">
            Simple, transparent tax calculation based on your verified income
          </p>
        </div>

        {/* Safety Banner */}
        <Card className="animate-fade-in-up p-8 bg-gradient-to-br from-[#1E7F5C] to-[#16654a] border-0 text-white rounded-2xl shadow-xl relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          </div>

          <div className="relative flex items-start gap-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 heading-primary">Audit-Safe Income Reporting</h3>
              <p className="text-blue-50 leading-relaxed max-w-2xl">
                All calculations are based on verified income sources with proper documentation.
                Your data is secure and compliant with IT Department guidelines.
              </p>
            </div>
          </div>
        </Card>

        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
          <Card className="stagger-item p-8 bg-white hover:shadow-2xl transition-all hover:-translate-y-2 rounded-2xl border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>

            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-gray-600 font-medium">Estimated Annual Income</h4>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-2 heading-display">
                ₹{annualIncome.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Based on current monthly earnings
              </div>
            </div>
          </Card>

          <Card className="stagger-item p-8 bg-white hover:shadow-2xl transition-all hover:-translate-y-2 rounded-2xl border-l-4 border-l-[#0A1F44] relative overflow-hidden">
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#0A1F44]/10 rounded-xl flex items-center justify-center shadow-md">
                  <Info className="w-6 h-6 text-[#0A1F44]" />
                </div>
                <h4 className="text-gray-600 font-medium">Tax Payable</h4>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-2 heading-display">
                ₹{taxPayable.toLocaleString('en-IN')}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mt-2">
                <CheckCircle className="w-4 h-4" />
                Income below taxable limit
              </div>
            </div>
          </Card>

          <Card className="stagger-item p-8 bg-gradient-to-br from-[#1E7F5C] to-[#2a9d75] text-white hover:shadow-2xl transition-all hover:-translate-y-2 rounded-2xl border-0 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-green-50">Refund Eligible</h4>
              </div>
              <p className="text-4xl font-black mb-2 heading-display">
                ₹{refundEligible.toLocaleString('en-IN')}
              </p>
              <p className="text-sm opacity-90 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                TDS already deducted from sources
              </p>
            </div>
          </Card>
        </div>

        {/* Deductions Panel */}
        <Card className="animate-fade-in-up p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 heading-primary">Tax Deductions & Savings</h3>
              <p className="text-gray-500 mt-1">Optimize your tax savings with these sections</p>
            </div>
          </div>

          <div className="space-y-6">
            {taxDeductions.map((deduction) => (
              <div
                key={deduction.section}
                className="group p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-[#0A1F44] group-hover:text-blue-700 transition-colors">{deduction.section}</h4>
                      {deduction.currentAmount > 0 ? (
                        <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{deduction.description}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Current</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{deduction.currentAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    {deduction.maxAmount > 0 && (
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Max Limit</p>
                        <p className="text-xl font-bold text-gray-400">
                          ₹{deduction.maxAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Tax Saved</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{deduction.savings.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                {deduction.maxAmount > 0 && (
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(deduction.currentAmount / deduction.maxAmount) * 100}%` }}
                    ></div>
                  </div>
                )}

                {deduction.maxAmount > 0 && deduction.currentAmount < deduction.maxAmount && (
                  <div className="mt-4 pt-4 border-t border-gray-200/50 flex items-center gap-2 text-sm text-orange-600 font-medium">
                    <Sparkles className="w-4 h-4" />
                    <p>
                      You can save ₹{((deduction.maxAmount - deduction.currentAmount) * 0.3).toLocaleString('en-IN')}
                      more by utilizing the remaining ₹{(deduction.maxAmount - deduction.currentAmount).toLocaleString('en-IN')} limit
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Deductions Claimed</p>
                <p className="text-3xl font-black text-gray-900 heading-display">₹{totalDeductions.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Tax Saved</p>
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-100 rounded-full">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-3xl font-black text-green-600 heading-display">₹{totalSavings.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up">
          <Button
            onClick={() => window.open('https://www.incometax.gov.in/iec/foportal/', '_blank')}
            className="flex-1 bg-gradient-to-r from-[#F7931E] to-[#e07d0a] hover:from-[#ff9f3a] hover:to-[#ffb366] text-white border-0 py-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span>File ITR Now</span>
              <ArrowUpRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={downloadPDF}
            className="flex-1 border-2 border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white py-8 rounded-xl font-bold text-lg transition-all group"
          >
            <div className="flex items-center justify-center gap-3">
              <Download className="w-6 h-6 group-hover:animate-bounce" />
              <span>Download Income Passport (PDF)</span>
            </div>
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="animate-fade-in-up p-6 bg-blue-50 border border-blue-100 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Info className="w-32 h-32 text-blue-600" />
          </div>
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-gray-700">
              <h4 className="text-lg font-bold text-blue-900 mb-2">About Income Passport</h4>
              <p className="mb-2 leading-relaxed">
                Your Income Passport is a verified document that consolidates all your earnings.
                Use it for loan applications, visa processing, or government benefit eligibility.
              </p>
              <div className="flex items-center gap-3 mt-3 text-sm font-semibold text-blue-800">
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-blue-100">Bank Loans</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-blue-100">Credit Cards</span>
                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-blue-100">Visa Applications</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
