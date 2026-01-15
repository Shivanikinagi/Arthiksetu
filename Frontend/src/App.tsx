import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/DashboardPage';
import { TaxPage } from './components/TaxPage';
import { SchemesPage } from './components/SchemesPage';
import { ReportsPage } from './components/ReportsPage';
import { ProfilePage } from './components/ProfilePage';
import { AIAssistantPage } from './components/AIAssistantPage';
import { Loans } from './components/Loans';
import { UnifiedDashboard } from './components/UnifiedDashboard';
import { AIChatbot } from './components/AIChatbot';
import { MessageDecoder } from './components/MessageDecoder';
import { DocumentVerification } from './components/DocumentVerification';

type PageType = 'dashboard' | 'tax' | 'schemes' | 'loans' | 'reports' | 'profile' | 'ai-assistant' | 'about' | 'how-it-works' | 'privacy' | 'terms' | 'help' | 'contact' | 'faq' | 'unified-dashboard' | 'chatbot' | 'message-decoder' | 'document-verification';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={handleNavigate} onToggleSidebar={() => setIsSidebarOpen(true)} />;
      case 'unified-dashboard': return <UnifiedDashboard />;
      case 'chatbot': return <AIChatbot />;
      case 'message-decoder': return <MessageDecoder />;
      case 'document-verification': return <DocumentVerification />;
      case 'profile': return <ProfilePage onToggleSidebar={() => setIsSidebarOpen(true)} />;
      case 'ai-assistant': return <AIAssistantPage />;

      case 'schemes': return <SchemesPage onNavigate={handleNavigate} onToggleSidebar={() => setIsSidebarOpen(true)} />;
      case 'tax': return <TaxPage onNavigate={handleNavigate} onToggleSidebar={() => setIsSidebarOpen(true)} />;
      case 'reports': return <ReportsPage onNavigate={handleNavigate} onToggleSidebar={() => setIsSidebarOpen(true)} />;

      default: return <DashboardPage onNavigate={handleNavigate} onToggleSidebar={() => setIsSidebarOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-['Inter',sans-serif] overflow-hidden">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Mobile Header (optional, usually pages have their own headers, but we might want a consistent one if pages don't cover it) */}
        {/* We assume pages handle their header visuals, but we ensure the container allows scrolling */}

        <main className="flex-1 overflow-y-auto scroll-smooth pb-20">
          {renderPage()}
        </main>

        {/* Mobile Sidebar Drawer (Overlay) */}
        <div>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onNavigate={(id) => handleNavigate(id as PageType)}
            currentPage={currentPage}
            variant="drawer"
          />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 px-6 z-40 safe-area-bottom shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'dashboard' ? 'text-[#0A1F44]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={currentPage === 'dashboard' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => handleNavigate('unified-dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'unified-dashboard' ? 'text-[#0A1F44]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={currentPage === 'unified-dashboard' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
            <span className="text-[10px] font-medium">Services</span>
          </button>

          <button
            onClick={() => handleNavigate('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'profile' ? 'text-[#0A1F44]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={currentPage === 'profile' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
