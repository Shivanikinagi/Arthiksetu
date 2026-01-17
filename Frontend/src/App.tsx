import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { DashboardPage } from './components/DashboardPage';
import { TaxPage } from './components/TaxPage';
import { SchemesPage } from './components/SchemesPage';
import { ReportsPage } from './components/ReportsPage';
import { ProfilePage } from './components/ProfilePage';
import { AIAssistantPage } from './components/AIAssistantPage';
import { Loans } from './components/Loans';

type PageType = 'dashboard' | 'tax' | 'schemes' | 'loans' | 'reports' | 'profile' | 'ai-assistant' | 'about' | 'how-it-works' | 'privacy' | 'terms' | 'help' | 'contact' | 'faq';

const StaticPage = ({ title, content }: { title: string; content: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-[#0A1F44] mb-6">{title}</h1>
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-gray-600 leading-relaxed">
      {content}
    </div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tax':
        return <TaxPage />;
      case 'schemes':
        return <SchemesPage />;
      case 'loans':
        return <Loans />;
      case 'reports':
        return <ReportsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'about':
        return <StaticPage title="About Us" content="ArthikSetu is a pioneering platform dedicated to empowering India's gig economy workers. We bridge the gap between hard work and financial stability by providing a unified interface for earnings tracking, tax management, and access to government benefits. Our mission is to financial inclusion for every independent worker." />;
      case 'how-it-works':
        return <StaticPage title="How It Works" content={
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Connect Accounts:</strong> Securely link your gig platform accounts (Zomato, Swiggy, Uber, etc.).</li>
            <li><strong>Track Earnings:</strong> View all your income in one unified dashboard.</li>
            <li><strong>Get Recommendations:</strong> Our AI analyzes your profile to suggest relevant government schemes.</li>
            <li><strong>Manage Taxes:</strong> Generated audit-safe reports and file ITR directly through the portal.</li>
          </ul>
        } />;
      case 'privacy':
        return <StaticPage title="Privacy Policy" content="At ArthikSetu, we take your privacy seriously. Your data is encrypted and stored locally on your device wherever possible. We strictly adhere to India's Digital Personal Data Protection Act, 2023. We do not sell your personal information to third parties." />;
      case 'terms':
        return <StaticPage title="Terms of Service" content="By using ArthikSetu, you agree to our standard terms of service. The platform is provided 'as is' to assist gig workers in managing their finances. Users are responsible for the accuracy of the data they manually input." />;
      case 'help':
        return <StaticPage title="Help Center" content="Need assistance? Our support team is available 24/7. Browse our tutorials or chat with our AI assistant for immediate help with platform features." />;
      case 'contact':
        return <StaticPage title="Contact Us" content={
          <div>
            <p className="mb-4">We'd love to hear from you. Reach out to us through any of the following channels:</p>
            <p><strong>Email:</strong> support@arthiksetu.in</p>
            <p><strong>Phone:</strong> xxxx-xxx-xxx</p>
            <p><strong>Address:</strong> ArthikSetu HQ, Baner Road, Pune, Maharashtra 411045</p>
          </div>
        } />;
      case 'faq':
        return <StaticPage title="Frequently Asked Questions" content={
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-[#0A1F44]">Is ArthikSetu free to use?</p>
              <p>Yes, the core features of tracking earnings and viewing schemes are completely free for gig workers.</p>
            </div>
            <div>
              <p className="font-semibold text-[#0A1F44]">Is my data safe?</p>
              <p>Absolutely. We use bank-grade encryption and do not share your financial data without explicit consent.</p>
            </div>
          </div>
        } />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-['Inter',sans-serif]">
      <Navigation currentPage={currentPage === 'dashboard' || currentPage === 'tax' || currentPage === 'schemes' || currentPage === 'loans' || currentPage === 'reports' || currentPage === 'profile' || currentPage === 'ai-assistant' ? currentPage : 'dashboard'} onNavigate={(page: any) => setCurrentPage(page)} />
      <main className="pb-12">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-[#0A1F44] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AS</span>
                </div>
                <h3 className="text-[#0A1F44]">ArthikSetu</h3>
              </div>
              <p className="text-sm text-gray-600">
                Empowering India's gig workers with unified earnings tracking,
                tax assistance, and government benefit access.
              </p>
            </div>

            <div>
              <h4 className="text-[#0A1F44] mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-[#0A1F44]">About Us</button></li>
                <li><button onClick={() => setCurrentPage('how-it-works')} className="hover:text-[#0A1F44]">How It Works</button></li>
                <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-[#0A1F44]">Privacy Policy</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="hover:text-[#0A1F44]">Terms of Service</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#0A1F44] mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => setCurrentPage('help')} className="hover:text-[#0A1F44]">Help Center</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-[#0A1F44]">Contact Us</button></li>
                <li><button onClick={() => setCurrentPage('faq')} className="hover:text-[#0A1F44]">FAQs</button></li>
                <li className="flex items-center gap-2">
                  <span>Helpline:</span>
                  <a href="tel:18001234567" className="text-[#0A1F44] font-medium hover:underline">xxxx-xxx-xxxx</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2024 ArthikSetu. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">🔒 Privacy-first, user-owned data</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Government compliant platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}