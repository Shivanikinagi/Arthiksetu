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

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
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
    // Presentation Mode: Laptop/Desktop sees a "Phone" in the center
    <div className="flex items-center justify-center min-h-screen bg-[#1e293b] p-4 lg:p-8 font-['Inter',sans-serif]">

      {/* Device Frame */}
      <div className="relative w-full max-w-[400px] h-[850px] bg-white rounded-[40px] shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-[8px] border-[#0f172a] ring-4 ring-[#334155]">

        {/* Dynamic Notch / Status Bar Area */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-[#0A1F44] z-50 flex justify-between items-center px-6">
          <span className="text-[10px] font-semibold text-white tracking-wider">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-white/20 rounded-[2px]" />
            <div className="w-4 h-2.5 bg-white/20 rounded-[2px]" />
            <div className="w-6 h-2.5 bg-white rounded-[2px]" />
          </div>
        </div>

        {/* Sidebar Drawer (Overlay) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={(id) => handleNavigate(id as PageType)}
          currentPage={currentPage}
        />

        {/* Scrollable Content Area */}
        <div className="h-full overflow-y-auto overflow-x-hidden pt-6 pb-6 bg-[#0A1F44] no-scrollbar">
          {renderPage()}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-[60] pointer-events-none" />
      </div>
    </div>
  );
}