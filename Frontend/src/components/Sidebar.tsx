import {
    Home,
    FileText,
    Building2,
    Gift,
    Calculator,
    ScrollText,
    User,
    LogOut,
    X,
    ScanFace,
    Bot,
    LayoutDashboard
} from 'lucide-react';
import { Button } from './ui/button'; // Keeping import though not used in original, maybe needed later or for consistency

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    onNavigate: (page: string) => void;
    currentPage: string;
    variant?: 'drawer' | 'sidebar';
}

export function Sidebar({ isOpen = false, onClose, onNavigate, currentPage, variant = 'drawer' }: SidebarProps) {
    const menuItems = [
        { label: 'Home', id: 'dashboard', icon: Home },
        { label: 'Verify', id: 'document-verification', icon: ScanFace },
        { label: 'Analyzer', id: 'ai-assistant', icon: FileText },
        { label: 'Decoder', id: 'message-decoder', icon: Building2 },
        { label: 'Schemes', id: 'schemes', icon: Gift },
        { label: 'Tax & ITR', id: 'tax', icon: Calculator },
        { label: 'Reports', id: 'reports', icon: ScrollText },
        { label: 'AI Chatbot', id: 'chatbot', icon: Bot },
        { label: 'Unified View', id: 'unified-dashboard', icon: LayoutDashboard },
        { label: 'Profile', id: 'profile', icon: User },
    ];

    if (variant === 'sidebar') {
        return (
            <div className="w-[280px] h-full bg-[#0A1F44] flex flex-col border-r border-white/10 shadow-xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">ArthikSetu</h2>
                        <p className="text-[10px] text-blue-200 uppercase tracking-widest mt-1">Gig Economy Platform</p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-white text-[#0A1F44] font-bold shadow-lg'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <Icon
                                    className={`w-5 h-5 ${isActive ? 'text-[#0A1F44]' : 'text-white group-hover:text-white'}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className="text-sm tracking-wide font-medium">{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-[#0A1F44] rounded-full" />}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#06142e]">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                    <p className="text-[10px] text-center text-gray-600 mt-4">Version 1.2.0 • Build 8452</p>
                </div>
            </div>
        );
    }

    // Drawer Variant (Mobile - Material Design)
    return (
        <>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 z-[60] transition-opacity duration-300 backdrop-blur-sm ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`absolute top-0 left-0 bottom-0 w-[75%] max-w-[300px] bg-white z-[70] transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header (User Profile) */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#0A1F44] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            RS
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Rahul Sharma</h2>
                            <p className="text-xs text-blue-600 font-medium cursor-pointer" onClick={() => onNavigate('profile')}>View Profile</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-2 px-0 space-y-0.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    if (onClose) onClose();
                                }}
                                className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 ${isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                                    : 'border-transparent text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon
                                    className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                    <div className="text-[10px] text-center text-gray-400 mt-4 flex flex-col gap-1">
                        <span className="font-semibold text-gray-500">ArthikSetu App</span>
                        <span>v1.2.0 • Build 8452</span>
                    </div>
                </div>
            </div>
        </>
    );
}
