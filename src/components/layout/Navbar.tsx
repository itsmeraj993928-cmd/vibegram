import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MessageCircle,
  Shield,
  Sparkles,
  Wifi,
  ChevronDown,
  UserCheck,
  Globe,
  Smartphone,
  Maximize2,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  isMobileFramed: boolean;
  setIsMobileFramed: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMobileFramed, setIsMobileFramed }) => {
  const {
    currentUser,
    users,
    role,
    language,
    lowDataMode,
    dataSavedMB,
    notifications,
    conversations,
    setLanguage,
    setLowDataMode,
    switchUser,
    setActiveTab,
    setIsSettingsModalOpen,
    t,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'superadmin':
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded">OWNER</span>;
      case 'moderator':
        return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">MOD</span>;
      case 'creator':
        return <span className="text-[10px] font-bold text-purple-400 bg-purple-950/80 border border-purple-500/30 px-1.5 py-0.5 rounded">CREATOR</span>;
      default:
        return <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">USER</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-3 sm:px-4 py-2.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Original Vibegram Wave Emblem */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 p-[2px] shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-6 h-6 fill-none stroke-current text-white">
                <path
                  d="M24 30 Q 50 85 76 30"
                  stroke="url(#navVibeGrad)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="42" r="6" fill="#FFAE19" />
                <defs>
                  <linearGradient id="navVibeGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF3366" />
                    <stop offset="50%" stopColor="#FF7A00" />
                    <stop offset="100%" stopColor="#FFAE19" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-200 bg-clip-text text-transparent">
                {language === 'hi' ? 'वाइबग्राम' : 'Vibegram'}
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-rose-400 bg-rose-950/60 border border-rose-500/30 px-1 rounded-sm">
                IN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block leading-none">
              {t('regionalPulse')}
            </p>
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Low-Data Mode Toggle */}
          <button
            onClick={() => setLowDataMode(!lowDataMode)}
            title={lowDataMode ? 'Low-Data Mode ON' : 'Turn on Low-Data Mode'}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              lowDataMode
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wifi className={`w-3.5 h-3.5 ${lowDataMode ? 'text-emerald-400 animate-pulse' : ''}`} />
            <span className="hidden md:inline">
              {lowDataMode ? `Data Saver: ${dataSavedMB}MB` : 'Low-Data'}
            </span>
          </button>

          {/* Language Switcher (EN / हिन्दी) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 transition-colors"
            title="Toggle Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Desktop/Mobile Device Frame Toggle */}
          <button
            onClick={() => setIsMobileFramed(!isMobileFramed)}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title={isMobileFramed ? 'Switch to Full Screen Desktop Layout' : 'Simulate Mobile Device Shell'}
          >
            {isMobileFramed ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Owner Dashboard Shortcut (Always visible to SuperAdmin/Owner & Moderator) */}
          {(role === 'superadmin' || role === 'moderator') && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                currentUser.role === 'superadmin'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
              }`}
              title="Access Admin / Owner Command Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {currentUser.role === 'superadmin' ? 'Owner Portal' : 'Mod Queue'}
              </span>
            </button>
          )}

          {/* Notifications Icon */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {/* Messages Icon */}
          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Direct Messages"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadMessages > 0 && (
              <span className="absolute top-1.5 right-1.5 px-1 min-w-3.5 h-3.5 text-[9px] font-bold rounded-full bg-rose-500 text-white flex items-center justify-center ring-2 ring-slate-950">
                {unreadMessages}
              </span>
            )}
          </button>

          {/* User Profile Switcher Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 pl-1.5 rounded-full bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 transition-colors"
              title="Switch user role or view profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-rose-500/50"
              />
              <ChevronDown className="w-3 h-3 text-slate-400 mr-0.5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Active User Card */}
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {currentUser.name}
                        </p>
                        {currentUser.isVerified && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">@{currentUser.username}</p>
                      <div className="mt-1">{getRoleBadge(currentUser.role)}</div>
                    </div>
                  </div>
                </div>

                {/* Role Switcher Section (Demo requirement for reviewing roles) */}
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t('switchRole')}
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-white/5">
                  {users.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate capitalize">
                            {u.role === 'superadmin' ? 'Super Admin / Owner' : u.role}
                          </p>
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <Check className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Bottom Quick Links */}
                <div className="border-t border-white/10 mt-1 pt-1 px-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800/80 rounded-md transition-colors"
                  >
                    {t('navProfile')}
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800/80 rounded-md transition-colors"
                  >
                    {t('navSettings')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
