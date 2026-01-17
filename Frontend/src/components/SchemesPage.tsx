import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Gift, ArrowRight, TrendingUp, Shield, Heart } from 'lucide-react';

// Icon mapping since we can't send components from backend
const ICON_MAP: any = {
  'Gift': Gift,
  'TrendingUp': TrendingUp,
  'Shield': Shield,
  'Heart': Heart
};

export function SchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch real income first
    fetch('http://localhost:8000/api/dashboard')
      .then(res => res.json())
      .then(dashboardData => {
        const sources = dashboardData.incomeSources || [];
        const monthlyTotal = sources.reduce((sum: number, s: any) => sum + s.amount, 0);
        const annualIncome = monthlyTotal * 12;

        const userProfile = {
          age: 28, // Still static for now as we don't have a profile form
          income: annualIncome,
          occupation: "food delivery",
          category: "General"
        };

        // 2. Fetch schemes based on real income
        return fetch('http://localhost:8000/api/recommend_schemes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userProfile)
        });
      })
      .then(res => res.json())
      .then(data => {
        const formatted = data.schemes.map((s: any) => ({
          ...s,
          icon: ICON_MAP[s.category === 'Loan' ? 'Gift' : s.category === 'Insurance' ? 'Shield' : 'TrendingUp'] || Gift,
          color: s.category === 'Loan' ? '#1E7F5C' : '#3B82F6'
        }));
        setSchemes(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch schemes", err);
        setLoading(false);
      });
  }, []);

  const eligibleSchemes = schemes.filter(s => s.status === 'eligible');
  const totalBenefits = eligibleSchemes.reduce((sum, s) => sum + s.eligibleAmount, 0);
  const yearlyRecurringBenefits = 18000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[#0A1F44] mb-2">Government Benefits You Qualify For</h1>
            <p className="text-gray-600">
              Based on your verified income and profile, you're eligible for these government schemes
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              // Re-run the fetch logic
              fetch('http://localhost:8000/api/dashboard')
                .then(res => res.json())
                .then(dashboardData => {
                  const sources = dashboardData.incomeSources || [];
                  const monthlyTotal = sources.reduce((sum: number, s: any) => sum + s.amount, 0);
                  const annualIncome = monthlyTotal * 12;

                  const userProfile = {
                    age: 28,
                    income: annualIncome,
                    occupation: "food delivery",
                    category: "General"
                  };

                  return fetch('http://localhost:8000/api/recommend_schemes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userProfile)
                  });
                })
                .then(res => res.json())
                .then(data => {
                  const formatted = data.schemes.map((s: any) => ({
                    ...s,
                    icon: ICON_MAP[s.category === 'Loan' ? 'Gift' : s.category === 'Insurance' ? 'Shield' : 'TrendingUp'] || Gift,
                    color: s.category === 'Loan' ? '#1E7F5C' : '#3B82F6'
                  }));
                  formatted.sort((a: any, b: any) => (a.status === 'eligible' ? -1 : 1));
                  setSchemes(formatted);
                  setLoading(false);
                })
                .catch(err => {
                  console.error("Failed to fetch schemes", err);
                  setLoading(false);
                });
            }}
          >
            Refresh Schemes
          </Button>
        </div>
      </div>

      {/* Highlight Banner */}
      <Card className="p-6 bg-gradient-to-br from-[#F7931E] to-[#e07d0a] text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="mb-2">Don't Leave Money on the Table!</h2>
            <p className="text-lg opacity-95">
              You are missing ₹{yearlyRecurringBenefits.toLocaleString('en-IN')}+ in yearly benefits
            </p>
            <p className="text-sm opacity-90 mt-2">
              Plus one-time benefits worth ₹{(totalBenefits / 1000).toFixed(0)}L+ available
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-6 py-4 text-center backdrop-blur-sm">
            <p className="text-sm opacity-90 mb-1">Eligible Schemes</p>
            <p className="text-4xl">{eligibleSchemes.length}</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-l-4 border-l-[#1E7F5C]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#1E7F5C]/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#1E7F5C]" />
            </div>
            <p className="text-sm text-gray-600">Active Applications</p>
          </div>
          <p className="text-3xl text-[#0A1F44]">2</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#3B82F6]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
          <p className="text-3xl text-[#0A1F44]">2</p>
        </Card>
        <Card className="p-6 bg-white border-l-4 border-l-[#F7931E]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#F7931E]/10 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#F7931E]" />
            </div>
            <p className="text-sm text-gray-600">Benefits Received</p>
          </div>
          <p className="text-3xl text-[#0A1F44]">₹12,436</p>
        </Card>
      </div>

      {/* Scheme Cards */}
      <div>
        <h3 className="text-[#0A1F44] mb-6">Available Schemes</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schemes.map((scheme) => {
            const Icon = scheme.icon;
            const isEligible = scheme.status === 'eligible';

            return (
              <Card
                key={scheme.id}
                className={`p-6 bg-white hover:shadow-xl transition-all ${isEligible ? 'border-2 border-[#1E7F5C]' : ''
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${scheme.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: scheme.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-[#0A1F44]">{scheme.name}</h4>
                        {isEligible && (
                          <span className="px-2 py-1 bg-[#1E7F5C] text-white text-xs rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Eligible
                          </span>
                        )}
                        {!isEligible && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Benefit Amount</p>
                  <p className="text-2xl text-[#0A1F44] mb-3">{scheme.benefit}</p>
                  <p className="text-sm text-gray-700 mb-2">{scheme.details}</p>
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200">
                    <CheckCircle className="w-4 h-4 text-[#1E7F5C] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">
                      {typeof scheme.criteria === 'object'
                        ? Object.entries(scheme.criteria).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
                        : scheme.criteria}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => scheme.url && window.open(scheme.url, '_blank')}
                  className={`w-full ${isEligible
                    ? 'bg-[#F7931E] hover:bg-[#e07d0a] text-white border-0'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-0'
                    }`}
                >
                  {isEligible ? (
                    <>
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'View Details'
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Information Banner */}
      <Card className="p-6 bg-gradient-to-r from-[#0A1F44] to-[#1a3a6b] text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">Government Compliance & Privacy</h3>
            <p className="text-sm opacity-90 mb-3">
              ArthikSetu is a privacy-first platform. Your data is encrypted, stored securely,
              and only shared with government portals with your explicit consent.
            </p>
            <p className="text-xs opacity-75">
              All scheme applications are processed through official government channels.
              We do not charge any fees for scheme discovery or application assistance.
            </p>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="text-[#0A1F44] mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600">
              Our support team can help you with scheme applications and eligibility questions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="border-[#0A1F44] text-[#0A1F44]"
              onClick={() => window.location.href = 'mailto:support@arthiksetu.gov.in'}
            >
              Contact Support
            </Button>
            <Button
              className="bg-[#3B82F6] hover:bg-[#2563eb] text-white border-0"
              onClick={() => window.open('https://calendly.com/', '_blank')}
            >
              Schedule Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}