import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Gift, ArrowRight, TrendingUp, Shield, Heart, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

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

  const fetchSchemes = () => {
    setLoading(true);
    // 1. Fetch real income first
    fetch(`${API_BASE_URL}/api/dashboard`)
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
        return fetch(`${API_BASE_URL}/api/recommend_schemes`, {
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
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const eligibleSchemes = schemes.filter(s => s.status === 'eligible');
  const totalBenefits = eligibleSchemes.reduce((sum, s) => sum + s.eligibleAmount, 0);
  const yearlyRecurringBenefits = 18000;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="relative">
          <RefreshCw className="w-16 h-16 animate-spin text-blue-600 mb-4" />
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Loading schemes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full mb-3 border border-orange-200">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">Government Benefits</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">Benefits You Qualify For</h1>
              <p className="text-gray-600 text-lg">
                Based on your verified income and profile
              </p>
            </div>
            <Button
              variant="outline"
              onClick={fetchSchemes}
              className="group px-6 py-3 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh Schemes
            </Button>
          </div>
        </div>

        {/* Highlight Banner */}
        <Card className="animate-fade-in-up p-8 text-white rounded-2xl shadow-2xl border-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)' }}>
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-3xl font-black heading-display">Don't Leave Money on the Table!</h2>
              </div>
              <p className="text-xl font-semibold mb-2 opacity-95">
                You are missing ₹{yearlyRecurringBenefits.toLocaleString('en-IN')}+ in yearly benefits
              </p>
              <p className="text-sm opacity-90">
                Plus one-time benefits worth ₹{(totalBenefits / 1000).toFixed(0)}L+ available
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 text-center border border-white/30 shadow-xl">
              <p className="text-sm opacity-90 mb-2 font-medium">Eligible Schemes</p>
              <p className="text-6xl font-black heading-display">{eligibleSchemes.length}</p>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up">
          {[
            { icon: CheckCircle, label: 'Active Applications', value: '2', color: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200' },
            { icon: Clock, label: 'Pending Review', value: '2', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
            { icon: Gift, label: 'Benefits Received', value: '₹12,436', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
          ].map((stat, idx) => (
            <Card key={idx} className={`stagger-item p-6 bg-white border-2 ${stat.border} rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              </div>
              <p className="text-4xl font-black text-gray-900 heading-display">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Scheme Cards */}
        <div className="animate-fade-in-up">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 heading-primary">Available Schemes</h3>
            <p className="text-gray-500 mt-1">Personalized recommendations based on your profile</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {schemes.map((scheme, idx) => {
              const Icon = scheme.icon;
              const isEligible = scheme.status === 'eligible';

              return (
                <Card
                  key={scheme.id}
                  className={`stagger-item group p-8 bg-white rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden ${isEligible ? 'border-2 border-green-400 shadow-lg' : 'border border-gray-200'
                    }`}
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${isEligible ? 'from-green-500/5 to-blue-500/5' : 'from-gray-500/5 to-gray-500/5'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                  {/* Eligible Badge */}
                  {isEligible && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      ELIGIBLE
                    </div>
                  )}

                  <div className="relative">
                    <div className="flex items-start gap-5 mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all"
                        style={{ background: `linear-gradient(135deg, ${scheme.color}, ${scheme.color}dd)` }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2 heading-primary group-hover:text-blue-600 transition-colors">{scheme.name}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{scheme.description}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 mb-6 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Benefit Amount</p>
                      <p className="text-4xl font-black text-gray-900 mb-4 heading-display">{scheme.benefit}</p>
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{scheme.details}</p>
                      <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {typeof scheme.criteria === 'object'
                            ? Object.entries(scheme.criteria).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
                            : scheme.criteria}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => scheme.url && window.open(scheme.url, '_blank')}
                      className={`w-full py-4 rounded-xl font-bold text-base transition-all group/btn ${isEligible
                        ? 'bg-gradient-to-r from-[#F7931E] to-[#ff9f3a] hover:from-[#ff9f3a] hover:to-[#ffb366] text-white shadow-lg hover:shadow-xl border-0'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                        }`}
                    >
                      {isEligible ? (
                        <>
                          Apply Now
                          <ExternalLink className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          View Details
                          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Information Banner */}
        <Card className="animate-fade-in-up p-8 bg-gradient-to-br from-[#0A1F44] via-[#1a3a6b] to-[#2a4a7f] text-white rounded-2xl shadow-2xl border-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          </div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3 heading-primary">Government Compliance & Privacy</h3>
              <p className="text-sm opacity-90 mb-3 leading-relaxed">
                ArthikSetu is a privacy-first platform. Your data is encrypted, stored securely,
                and only shared with government portals with your explicit consent.
              </p>
              <p className="text-xs opacity-75 leading-relaxed">
                All scheme applications are processed through official government channels.
                We do not charge any fees for scheme discovery or application assistance.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="animate-fade-in-up bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2 heading-primary">Need Help?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our support team can help you with scheme applications and eligibility questions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all"
                onClick={() => window.location.href = 'mailto:support@arthiksetu.gov.in'}
              >
                Contact Support
              </Button>
              <Button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all border-0"
                onClick={() => window.open('https://calendly.com/', '_blank')}
              >
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}