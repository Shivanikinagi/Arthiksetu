import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { DashboardPage } from './components/DashboardPage';
import { TaxPage } from './components/TaxPage';
import { SchemesPage } from './components/SchemesPage';
import { ReportsPage } from './components/ReportsPage';
import { ProfilePage } from './components/ProfilePage';
import { AIAssistantPage } from './components/AIAssistantPage';
import { Loans } from './components/Loans';
import { UnifiedDashboard } from './components/UnifiedDashboard';
import { SMSAnalyzer } from './components/SMSAnalyzer';
import { MessageDecoder } from './components/MessageDecoder';
import { DocumentVerification } from './components/DocumentVerification';

type PageType = 'dashboard' | 'unified-dashboard' | 'sms-analyzer' | 'tax' | 'schemes' | 'loans' | 'reports' | 'profile' | 'ai-assistant' | 'message-decoder' | 'document-verify' | 'about' | 'how-it-works' | 'privacy' | 'terms' | 'help' | 'contact' | 'faq';

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
      case 'unified-dashboard':
        return <UnifiedDashboard />;
      case 'sms-analyzer':
        return <SMSAnalyzer />;
      case 'message-decoder':
        return <MessageDecoder />;
      case 'document-verify':
        return <DocumentVerification />;
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
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <Navigation currentPage={currentPage === 'dashboard' || currentPage === 'unified-dashboard' || currentPage === 'sms-analyzer' || currentPage === 'tax' || currentPage === 'schemes' || currentPage === 'loans' || currentPage === 'reports' || currentPage === 'profile' || currentPage === 'ai-assistant' || currentPage === 'message-decoder' || currentPage === 'document-verify' ? currentPage : 'dashboard'} onNavigate={(page: any) => setCurrentPage(page)} />
      <main>
        {renderPage()}
      </main>

      {/* Footer - Enhanced */}
      <footer className="bg-gradient-to-br from-gray-900 via-[#0A1F44] to-[#1e3a5f] border-t border-gray-800 mt-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-black text-xl">AS</span>
                </div>
                <span className="text-2xl font-black text-white heading-display">ArthikSetu</span>
              </div>
              <p className="text-gray-300 text-sm max-w-md leading-relaxed mb-6">
                Empowering India's gig workers with AI-powered financial tools for earnings tracking, tax management, and government benefits access.
              </p>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <span className="text-green-400 font-semibold text-sm">🔒 Privacy-first</span>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <span className="text-blue-400 font-semibold text-sm">✓ Govt Compliant</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg heading-primary">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">→ About Us</button></li>
                <li><button onClick={() => setCurrentPage('how-it-works')} className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">→ How It Works</button></li>
                <li><button onClick={() => setCurrentPage('faq')} className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">→ FAQ</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">→ Contact</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg heading-primary">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => setCurrentPage('privacy')} className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">→ Privacy Policy</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">→ Terms of Service</button></li>
                <li><button onClick={() => setCurrentPage('help')} className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">→ Help Center</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2026 ArthikSetu. All rights reserved. Made with ❤️ for India's gig workers.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-3 py-1.5 bg-white/5 rounded-lg">v1.0.0</span>
                <span>•</span>
                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg font-semibold">● Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}