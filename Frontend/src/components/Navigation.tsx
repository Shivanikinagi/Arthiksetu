import { Building2, FileText, Gift, BarChart3, User, Bot } from 'lucide-react';

interface NavigationProps {
  currentPage: 'dashboard' | 'tax' | 'schemes' | 'reports' | 'profile' | 'ai-assistant';
  onNavigate: (page: 'dashboard' | 'tax' | 'schemes' | 'reports' | 'profile' | 'ai-assistant') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Building2 },
    { id: 'tax' as const, label: 'Tax & ITR', icon: FileText },
    { id: 'schemes' as const, label: 'Govt Schemes', icon: Gift },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'ai-assistant' as const, label: 'AI Assistant', icon: Bot },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#0A1F44] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AS</span>
            </div>
            <div>
              <h1 className="text-[#0A1F44] tracking-tight">ArthikSetu</h1>
              <p className="text-xs text-gray-500">Empowering Gig Workers</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${isActive
                      ? 'bg-[#0A1F44] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Items */}
        <div className="md:hidden pb-4 pt-2 flex space-x-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${isActive
                    ? 'bg-[#0A1F44] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}