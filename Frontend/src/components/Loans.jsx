import React, { useState } from 'react';

const Loans = () => {
    const [loans] = useState([
        {
            id: 1,
            lender: "Kotak Mahindra Bank",
            min_income: "₹10,000 (salary account holders)",
            notes: "Offers Mid-Month Advance and assesses overall profile."
        },
        {
            id: 2,
            lender: "Axis Bank",
            min_income: "₹15,000",
            notes: "Offers competitive interest rates and low processing fees."
        },
        {
            id: 3,
            lender: "Bajaj Finserv",
            min_income: "Varies by profile",
            notes: "Offers up to ₹10 lakh with minimal documentation and instant approval in some cases."
        },
        {
            id: 4,
            lender: "IDFC FIRST Bank",
            min_income: "Varies by profile",
            notes: "Digital loans for salaried, self-employed, freelancers, and gig workers without traditional income proof."
        },
        {
            id: 5,
            lender: "HDFC Bank",
            min_income: "₹25,000",
            notes: "Quick digital processing for existing customers."
        },
        {
            id: 6,
            lender: "IDBI Bank",
            min_income: "Annual income up to ₹3,00,000",
            notes: "Microfinance loans for low-income households via Self-Help Groups (SHGs)."
        }
    ]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h2 className="text-2xl font-semibold mb-6">
                Available Loan Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loans.map((loan) => (
                    <div
                        key={loan.id}
                        className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-[#0A1F44] border-t border-r border-b border-gray-200 hover:shadow-md transition"
                    >
                        <h3 className="font-semibold mb-4">
                            {loan.lender}
                        </h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">
                                Min. Monthly Income
                            </p>
                            <p className="text-sm font-medium">
                                {loan.min_income}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">
                                Description
                            </p>
                            <p className="text-sm text-gray-600">
                                {loan.notes}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Eligibility Criteria
                            </p>
                            <p className="text-sm text-gray-600">
                                Based on minimum income requirements and profile assessment
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Loans;