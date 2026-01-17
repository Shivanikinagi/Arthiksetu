import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronRight, Percent, Clock, ShieldCheck } from 'lucide-react';

export function Loans() {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userIncome, setUserIncome] = useState(0);

    useEffect(() => {
        fetch('http://localhost:8000/api/loans')
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
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0A1F44]">Loan Offers</h1>
                    <p className="text-gray-600">
                        Based on your monthly income of <span className="font-semibold text-[#1E7F5C]">₹{userIncome.toLocaleString('en-IN')}</span>
                    </p>
                </div>
                
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-3 text-center py-12 text-gray-500">Checking eligibility with lenders...</p>
                ) : loans.length === 0 ? (
                    <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 mb-2">No pre-approved offers found.</p>
                        <p className="text-sm text-gray-400">Increase your verified income to unlock offers.</p>
                    </div>
                ) : (
                    loans.map((loan) => (
                        <Card key={loan.id} className="p-6 hover:shadow-lg transition-all border-l-4 border-l-[#3B82F6]">
                            <div className="mb-4">
                                <h3 className="font-bold text-lg text-[#0A1F44]">{loan.lender}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Personal Loan</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {/* Notes usually contain the pitch */}
                                <p className="text-sm text-gray-700 h-10">{loan.notes}</p>

                                <div className="flex items-center gap-3 text-sm text-gray-700 pt-2 border-t border-gray-100">
                                    <ShieldCheck className="w-4 h-4 text-[#1E7F5C]" />
                                    <span>Min Income: ₹{loan.min_income.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-[#3B82F6] hover:bg-[#2563eb] text-white"
                                onClick={() => alert(`Application for ${loan.lender} Submitted Successfully!`)}
                            >
                                Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}