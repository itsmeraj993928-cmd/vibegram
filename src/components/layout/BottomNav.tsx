import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Flame,
  Plus,
  Users,
  Compass,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, setIsCreateModalOpen, t } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav pb-safe border-t border-white/10 select-none">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {/* Home Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'feed'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t('navHome')}</span>
        </button>

        {/* Short Videos (Vibes) */}
        <button
          onClick={() => setActiveTab('vibes')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'vibes'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-[10px] tracking-tight">{t('navVibes')}</span>
        </button>

        {/* Create (+) Action Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="relative -top-2 flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 p-[1.5px] shadow-lg shadow-rose-600/30 active:scale-95 transition-transform"
          aria-label={t('navCreate')}
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center hover:bg-slate-900 transition-colors">
            <Plus className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
        </button>

        {/* Addas / Communities */}
        <button
          onClick={() => setActiveTab('addas')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'addas'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t('navAddas')}</span>
        </button>

        {/* Explore & Search */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'explore'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t('navExplore')}</span>
        </button>

        {/* User Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'profile'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full p-[1px] ${
              activeTab === 'profile'
                ? 'bg-gradient-to-tr from-rose-500 to-orange-400'
                : 'bg-transparent'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="text-[10px] tracking-tight">{t('navProfile')}</span>
        </button>
      </div>
    </nav>
  );
};
