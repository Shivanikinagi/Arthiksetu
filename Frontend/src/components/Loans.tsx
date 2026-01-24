import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronRight, Percent, Clock, ShieldCheck, Banknote, Sparkles, Building2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export function Loans() {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userIncome, setUserIncome] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/loans`)
            .then(res => res.json())
            .then(data => {
                setLoans(data.loans || []);
                setUserIncome(data.user_monthly_income || 0);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch loans", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* Header with Income Badge */}
                <div className="animate-fade-in-up flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full mb-3 border border-blue-200">
                            <Banknote className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">Fair Financial Access</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">Pre-Approved Loans</h1>
                        <p className="text-gray-600 text-lg">Curated offers based on your verified financial profile</p>
                    </div>
                    <Card className="px-6 py-4 bg-white border border-green-100 shadow-lg flex items-center gap-4 hover-lift">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Verified Monthly Income</p>
                            <p className="text-2xl font-black text-gray-900 heading-display">₹{userIncome.toLocaleString('en-IN')}</p>
                        </div>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 py-20 text-center animate-pulse">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500 font-medium">Analyzing your profile with lenders...</p>
                        </div>
                    ) : loans.length === 0 ? (
                        <div className="col-span-3 py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building2 className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Offers Currently Available</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                We couldn't find any pre-approved offers for your current income level.
                                Try increasing your verified income sources or check back later.
                            </p>
                        </div>
                    ) : (
                        loans.map((loan, idx) => (
                            <div key={loan.id} className="stagger-item group h-full">
                                <Card className="h-full p-8 bg-white hover:shadow-2xl transition-all hover:-translate-y-2 border-0 ring-1 ring-gray-100 relative overflow-hidden flex flex-col">
                                    {/* Top decorative gradient bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{loan.lender}</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                Personal Loan
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                            <Building2 className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6 mb-8">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                {loan.notes || "High approval chance based on your profile."}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <ShieldCheck className="w-5 h-5 text-green-700" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Min Income Required</p>
                                                <p className="text-lg font-bold text-gray-900">₹{loan.min_income.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all group-hover:scale-[1.02]"
                                        onClick={() => {
                                            if (loan.link) {
                                                window.open(loan.link, '_blank');
                                            } else {
                                                alert(`Application for ${loan.lender} Submitted Successfully!`);
                                            }
                                        }}
                                    >
                                        Apply Now <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>

                                    {/* Verification Badge */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-green-100 p-1.5 rounded-full">
                                            <Sparkles className="w-4 h-4 text-green-600" />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}