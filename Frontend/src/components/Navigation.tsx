import { Home, Bot, User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: any) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100/50 z-50 pb-safe-area-bottom">
      <div className="flex items-center justify-around h-[80px] px-2 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group flex flex-col items-center justify-center w-full h-full active:scale-95 transition-transform"
            >
              <div className={`
                mb-1.5 p-1.5 rounded-xl transition-all duration-300
                ${isActive ? 'bg-[#0A1F44] text-white shadow-lg shadow-[#0A1F44]/20' : 'text-gray-400 group-hover:text-gray-600'}
              `}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-[#0A1F44]' : 'text-gray-400'
                }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}