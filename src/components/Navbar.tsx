import { Menu } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tax', label: 'Tax & ITR' },
    { id: 'schemes', label: 'Govt Schemes' },
    { id: 'reports', label: 'Reports' },
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A1F44] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AS</span>
            </div>
            <div>
              <h3 className="text-[#0A1F44] m-0 p-0 leading-tight">ArthiSetu</h3>
              <p className="text-xs text-[#4B5563] m-0 p-0 leading-tight">Empowering Gig Workers</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#0A1F44] text-white'
                    : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md text-[#4B5563] hover:bg-[#F3F4F6]">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
