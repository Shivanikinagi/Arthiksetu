import { Gift, TrendingUp, Shield, ExternalLink, AlertCircle } from "lucide-react";

const schemes = [
  {
    name: 'PM-SVANidhi',
    description: 'Working Capital Loan for Street Vendors',
    benefit: '₹10,000',
    benefitType: 'Loan Amount',
    eligible: true,
    category: 'Financial Support',
    icon: Gift,
    details: 'Low-interest loan with digital transaction incentives',
  },
  {
    name: 'Atal Pension Yojana',
    description: 'Guaranteed Pension for Unorganized Workers',
    benefit: '₹3,000/month',
    benefitType: 'Monthly Pension (at 60)',
    eligible: true,
    category: 'Pension',
    icon: TrendingUp,
    details: 'Secure your retirement with government-backed pension',
  },
  {
    name: 'PMJJBY',
    description: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    benefit: '₹2,00,000',
    benefitType: 'Life Insurance',
    eligible: true,
    category: 'Insurance',
    icon: Shield,
    details: 'Life insurance coverage at just ₹436/year premium',
  },
  {
    name: 'PMSBY',
    description: 'Pradhan Mantri Suraksha Bima Yojana',
    benefit: '₹2,00,000',
    benefitType: 'Accident Insurance',
    eligible: true,
    category: 'Insurance',
    icon: Shield,
    details: 'Accident disability coverage at ₹20/year premium',
  },
  {
    name: 'Skill India',
    description: 'Free Skill Development Training',
    benefit: 'Free Training',
    benefitType: 'Upskilling',
    eligible: true,
    category: 'Education',
    icon: TrendingUp,
    details: 'Government-certified skill courses with placement support',
  },
  {
    name: 'PM Mudra Yojana',
    description: 'Micro-Enterprise Business Loan',
    benefit: 'Up to ₹50,000',
    benefitType: 'Business Loan',
    eligible: true,
    category: 'Financial Support',
    icon: Gift,
    details: 'Collateral-free loans for small businesses',
  },
];

export function GovtSchemes() {
  const totalBenefits = 18000; // Yearly estimated benefits missed

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2">Benefits You Qualify For</h2>
        <p className="text-[#6B7280]">
          Based on your income and profile, you are eligible for these government schemes
        </p>
      </div>

      {/* Highlight Banner */}
      <div className="bg-gradient-to-r from-[#F7931E] to-[#EA8713] text-white rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-start gap-4">
          <AlertCircle size={32} className="flex-shrink-0" />
          <div>
            <h3 className="text-white m-0 mb-2">You're Missing Out!</h3>
            <p className="m-0 text-white opacity-95 mb-4">
              You are missing <strong>₹{totalBenefits.toLocaleString('en-IN')}+</strong> in yearly benefits. 
              These schemes are designed to support workers like you.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {schemes.length} schemes available
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                100% Government Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {schemes.map((scheme, index) => {
          const IconComponent = scheme.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-all hover:border-[#3B82F6]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent size={24} className="text-[#3B82F6]" />
                </div>
                <span className="px-3 py-1 bg-[#D1FAE5] text-[#1E7F5C] rounded-full text-xs">
                  Eligible
                </span>
              </div>

              {/* Content */}
              <h4 className="m-0 mb-2">{scheme.name}</h4>
              <p className="text-[#6B7280] text-xs mb-4">{scheme.description}</p>

              {/* Benefit Amount */}
              <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4">
                <p className="m-0 text-xs text-[#6B7280] mb-1">{scheme.benefitType}</p>
                <p className="m-0 text-[#0A1F44] text-xl font-bold">{scheme.benefit}</p>
              </div>

              {/* Details */}
              <p className="text-xs text-[#6B7280] mb-4">{scheme.details}</p>

              {/* CTA */}
              <button className="w-full bg-[#F7931E] hover:bg-[#E8850D] text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                Apply Now
                <ExternalLink size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#1E7F5C]">
        <div className="flex items-start gap-4">
          <Shield size={24} className="text-[#1E7F5C] flex-shrink-0" />
          <div>
            <h4 className="m-0 mb-2">Government Compliance & Privacy</h4>
            <p className="m-0 text-[#6B7280] mb-4">
              ArthiSetu is compliant with all government data protection regulations. Your data is user-owned, 
              encrypted, and never shared without your explicit consent. We follow DigiLocker security standards.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#" className="text-[#3B82F6] hover:underline flex items-center gap-1">
                Privacy Policy <ExternalLink size={14} />
              </a>
              <a href="#" className="text-[#3B82F6] hover:underline flex items-center gap-1">
                Contact Support <ExternalLink size={14} />
              </a>
              <a href="#" className="text-[#3B82F6] hover:underline flex items-center gap-1">
                Help Center <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
