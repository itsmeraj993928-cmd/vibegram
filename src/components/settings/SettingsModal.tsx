import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Settings,
  Lock,
  Wifi,
  Globe,
  MessageSquare,
  UserX,
  Smartphone,
  Shield,
  Download,
  Check,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { UserRole } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    setIsAndroidApkModalOpen,
    settings,
    lowDataMode,
    dataSavedMB,
    language,
    role,
    blockedUserIds,
    users,
    setLanguage,
    setLowDataMode,
    switchRole,
    unblockUser,
    t,
  } = useApp();

  const { isInstallable, install } = usePWAInstall();

  if (!isSettingsModalOpen) return null;

  const blockedUsersList = users.filter((u) => blockedUserIds.includes(u.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-sm text-white">{t('settingsTitle')}</h3>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          {/* Low-Data Saver Mode */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">{t('lowDataModeTitle')}</span>
              </div>
              <button
                type="button"
                onClick={() => setLowDataMode(!lowDataMode)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  lowDataMode ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    lowDataMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t('lowDataModeDesc')}
            </p>
            {lowDataMode && (
              <div className="pt-1 flex items-center justify-between text-[11px] font-semibold text-emerald-300">
                <span>{t('dataSavedSoFar')}:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30">
                  {dataSavedMB} MB
                </span>
              </div>
            )}
          </div>

          {/* Language Setting */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-white">{t('languageSetting')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  language === 'en'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  language === 'hi'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {language === 'hi' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Role Switching */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">{t('switchRole')}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['user', 'moderator', 'superadmin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-colors capitalize ${
                    role === r
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r === 'superadmin' ? 'Owner' : r === 'moderator' ? 'Mod' : 'User'}
                </button>
              ))}
            </div>
          </div>

          {/* Android APK & PWA Packaging Architecture */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-slate-950 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">{t('androidApkTitle')}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Vibegram is engineered with Capacitor and PWA standards ready to export directly into an Android Studio project or APK package.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsAndroidApkModalOpen(true);
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
              >
                View APK Build Architecture
              </button>
              {isInstallable && (
                <button
                  type="button"
                  onClick={install}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install App
                </button>
              )}
            </div>
          </div>

          {/* Blocked Accounts Management */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-white">{t('blockedUsersTitle')}</span>
            </div>
            {blockedUsersList.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                {blockedUsersList.map((bu) => (
                  <div key={bu.id} className="flex items-center justify-between text-xs text-slate-300">
                    <span>@{bu.username}</span>
                    <button
                      onClick={() => unblockUser(bu.id)}
                      className="text-rose-400 hover:underline text-[11px]"
                    >
                      {t('unblock')}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">No blocked accounts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
