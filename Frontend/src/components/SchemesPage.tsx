import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Gift, ArrowRight, TrendingUp, Shield, Heart, Menu, RefreshCw } from 'lucide-react';

// Icon mapping since we can't send components from backend
const ICON_MAP: any = {
  'Gift': Gift,
  'TrendingUp': TrendingUp,
  'Shield': Shield,
  'Heart': Heart
};

interface SchemesPageProps {
  onNavigate: (page: string) => void;
  onToggleSidebar: () => void;
}

export function SchemesPage({ onNavigate, onToggleSidebar }: SchemesPageProps) {
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

        // 2. Fetch schemes based on real income (and simplify them)
        return fetch('http://localhost:8000/api/simplify_scheme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userProfile)
        });
      })
      .then(res => res.json())
      .then(data => {
        const formatted = data.schemes?.map((s: any) => ({
          ...s,
          icon: ICON_MAP[s.category === 'Loan' ? 'Gift' : s.category === 'Insurance' ? 'Shield' : 'TrendingUp'] || Gift,
          color: s.category === 'Loan' ? '#1E7F5C' : '#3B82F6'
        })) || [];
        setSchemes(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch schemes", err);
        setLoading(false);
      });
  }, []);

  const refreshSchemes = () => {
    setLoading(true);
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

        return fetch('http://localhost:8000/api/simplify_scheme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userProfile)
        });
      })
      .then(res => res.json())
      .then(data => {
        const formatted = data.schemes?.map((s: any) => ({
          ...s,
          icon: ICON_MAP[s.category === 'Loan' ? 'Gift' : s.category === 'Insurance' ? 'Shield' : 'TrendingUp'] || Gift,
          color: s.category === 'Loan' ? '#1E7F5C' : '#3B82F6'
        })) || [];
        formatted.sort((a: any, b: any) => (a.status === 'eligible' ? -1 : 1));
        setSchemes(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch schemes", err);
        setLoading(false);
      });
  };

  const eligibleSchemes = schemes.filter(s => s.status === 'eligible');
  const totalBenefits = eligibleSchemes.reduce((sum, s) => sum + s.eligibleAmount, 0);
  const yearlyRecurringBenefits = 18000;

  return (
    <div className="bg-[#0A1F44] min-h-screen font-sans">

      {/* Mobile Header with Sidebar Trigger */}
      <div className="px-6 pt-12 pb-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold">Govt Schemes</h1>
        </div>
        <button
          onClick={refreshSchemes}
          className="p-2 bg-white/10 rounded-full active:scale-95 transition-transform"
        >
          <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content Sheet */}
      <div className="bg-[#F8F9FA] rounded-t-[32px] px-6 pt-8 pb-32 min-h-[calc(100vh-100px)] animate-in slide-in-from-bottom-10 duration-500">

        {/* Highlight Banner */}
        <Card className="p-6 bg-gradient-to-br from-[#F7931E] to-[#e07d0a] text-white rounded-[24px] border-0 mb-6 shadow-lg shadow-orange-500/20">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-lg mb-1">Total Benefits</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">₹{yearlyRecurringBenefits.toLocaleString()}</span>
                <span className="text-sm opacity-90">/ year</span>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-3 backdrop-blur-sm self-start">
              <p className="text-xs font-medium">Eligible Schemes: {eligibleSchemes.length}</p>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xl font-bold text-[#0A1F44] leading-none mb-1">2</p>
            <p className="text-[10px] text-gray-500 font-medium">Active</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-[#0A1F44] leading-none mb-1">2</p>
            <p className="text-[10px] text-gray-500 font-medium">Pending</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center mb-2">
              <Gift className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xl font-bold text-[#0A1F44] leading-none mb-1">₹12k</p>
            <p className="text-[10px] text-gray-500 font-medium">Received</p>
          </div>
        </div>

        {/* Scheme List */}
        <div>
          <h3 className="text-[#0A1F44] font-bold mb-4 ml-1">Available Schemes</h3>
          <div className="space-y-4">
            {schemes.map((scheme) => {
              const Icon = scheme.icon || Gift;
              const isEligible = scheme.status === 'eligible';

              return (
                <Card
                  key={scheme.id}
                  className={`p-5 bg-white rounded-[24px] border-none shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${isEligible ? 'ring-2 ring-inset ring-[#1E7F5C]/10' : ''}`}
                >
                  <div className="flex gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${scheme.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: scheme.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[#0A1F44] font-bold text-sm leading-tight mb-1">{scheme.name}</h4>
                        {isEligible && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{scheme.simple_explanation || scheme.description}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Benefits</p>
                      <p className="text-lg font-bold text-[#0A1F44]">{scheme.benefit}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => scheme.url && window.open(scheme.url, '_blank')}
                    className={`w-full h-12 rounded-xl text-sm font-semibold ${isEligible
                      ? 'bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {isEligible ? 'Apply Now' : 'View Details'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}