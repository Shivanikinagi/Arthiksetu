import {
  Bank,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";

const loans = [
  {
    lender: "HDFC Bank",
    amount: "Up to ₹40,00,000",
    interest: "10.75% onwards",
    status: "Eligible",
  },
  {
    lender: "Axis Bank",
    amount: "Up to ₹40,00,000",
    interest: "10.49% onwards",
    status: "Eligible",
  },
  {
    lender: "Kotak Mahindra Bank",
    amount: "Up to ₹35,00,000",
    interest: "10.99% onwards",
    status: "Eligible",
  },
  {
    lender: "IDFC FIRST Bank",
    amount: "Up to ₹40,00,000",
    interest: "9.99% onwards",
    status: "Eligible",
  },
  {
    lender: "Bajaj Finserv",
    amount: "Up to ₹55,00,000",
    interest: "10.00% onwards",
    status: "Conditional",
  },
  {
    lender: "IDBI Bank",
    amount: "Up to ₹25,00,000",
    interest: "10.50% onwards",
    status: "Conditional",
  }
];

export default function Loans() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* ===== Hero Summary Card (like earnings card) ===== */}
      <div className="bg-gradient-to-r from-[#0A1F44] to-[#143A6B] rounded-2xl p-8 text-white shadow-lg mb-10 flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90 mb-1">
            Estimated Loan Eligibility
          </p>
          <h1 className="text-4xl font-bold mb-2">
            ₹20,00,000+
          </h1>
          <p className="text-sm opacity-90 flex items-center gap-1">
            <CheckCircle size={16} /> Based on verified income sources
          </p>
        </div>

        <button className="bg-[#F7931E] hover:bg-[#E8850D] px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2">
          Improve Eligibility
          <ExternalLink size={16} />
        </button>
      </div>

      {/* ===== Section Title ===== */}
      <h2 className="text-xl font-semibold mb-6">
        Available Loan Providers
      </h2>

      {/* ===== Loan Cards (like income source cards) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loans.map((loan, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Bank size={20} className="text-[#0A1F44]" />
                <h3 className="font-semibold">{loan.lender}</h3>
              </div>

              {loan.status === "Eligible" ? (
                <CheckCircle size={18} className="text-green-600" />
              ) : (
                <AlertCircle size={18} className="text-orange-500" />
              )}
            </div>

            {/* Amount */}
            <p className="text-2xl font-bold text-[#0A1F44] mb-1">
              {loan.amount}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Interest: {loan.interest}
            </p>

            {/* Status */}
            <span
              className={`text-sm font-medium ${
                loan.status === "Eligible"
                  ? "text-green-600"
                  : "text-orange-500"
              }`}
            >
              {loan.status === "Eligible" ? "Eligible" : "Needs more proof"}
            </span>

            {/* CTA */}
            <button className="mt-4 w-full border border-[#0A1F44] text-[#0A1F44] py-2 rounded-lg hover:bg-[#0A1F44] hover:text-white transition">
              Check Details
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
