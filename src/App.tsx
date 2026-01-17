import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { DashboardPage } from './components/DashboardPage';
import { TaxPage } from './components/TaxPage';
import { SchemesPage } from './components/SchemesPage';
import { ReportsPage } from './components/ReportsPage';
import { ProfilePage } from './components/ProfilePage';

type PageType = 'dashboard' | 'tax' | 'schemes' | 'reports' | 'profile';

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
      case 'reports':
        return <ReportsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-['Inter',sans-serif]">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
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
                <li><a href="#" className="hover:text-[#0A1F44]">About Us</a></li>
                <li><a href="#" className="hover:text-[#0A1F44]">How It Works</a></li>
                <li><a href="#" className="hover:text-[#0A1F44]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#0A1F44]">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[#0A1F44] mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#0A1F44]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#0A1F44]">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#0A1F44]">FAQs</a></li>
                <li className="flex items-center gap-2">
                  <span>Helpline:</span>
                  <span className="text-[#0A1F44] font-medium">1800-XXX-XXXX</span>
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