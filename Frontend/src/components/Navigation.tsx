import { Building2, FileText, Gift, BarChart3, User, Bot, Landmark, ScanFace, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: any) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Home', icon: BarChart3 },
    { id: 'unified-dashboard' as const, label: 'Unified', icon: TrendingUp },
    { id: 'ai-assistant' as const, label: 'Analyzer', icon: FileText },
    { id: 'chatbot' as const, label: 'Chatbot', icon: Bot },
    { id: 'message-decoder' as const, label: 'Decoder', icon: Building2 },
    { id: 'document-verification' as const, label: 'Verify', icon: ScanFace },
    { id: 'schemes' as const, label: 'Schemes', icon: Gift },
    { id: 'loans' as const, label: 'Loans', icon: Landmark },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation (Top Bar) */}
      <nav className="hidden lg:block bg-[#0A1F44] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-3 shrink-0 mr-8">
              <div className="leading-tight">
                <h1 className="text-white font-bold tracking-tight text-2xl">ArthikSetu</h1>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest opacity-80">Gig Economy Platform</p>
              </div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="flex items-center flex-1 gap-1 overflow-x-auto no-scrollbar scroll-smooth mask-gradient-dark">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative px-4 py-2 rounded-lg flex items-center gap-2.5 transition-all duration-200 whitespace-nowrap text-sm font-medium group
                      ${isActive
                        ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/20'
                        : 'text-blue-200/80 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-300' : 'text-blue-400/70 group-hover:text-blue-300'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-400 rounded-full opacity-60"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4 ml-4 shrink-0">
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-white">Guest User</p>
                  <p className="text-xs text-blue-300">Verified Member</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-[#0A1F44] ring-1 ring-white/30"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar (Logo Only) */}
      <div className="lg:hidden bg-[#0A1F44] text-white sticky top-0 z-40 px-4 py-3 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">ArthikSetu</h1>
          <p className="text-[9px] text-blue-200 uppercase tracking-widest opacity-80">Gig Economy Platform</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border border-white/20"></div>
      </div>

      {/* Mobile Bottom Navigation (Scrollable) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe-area-bottom">
        <div className="flex items-center h-16 px-2 overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center min-w-[4.5rem] h-full space-y-1 ${isActive ? 'text-[#0A1F44]' : 'text-gray-400'}`}
              >
                <div className={`p-1.5 rounded-full transition-all duration-200 ${isActive ? 'bg-[#0A1F44]/5' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                </div>
                <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-semibold' : ''} whitespace-nowrap`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}