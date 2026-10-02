/**
 * Vibegram - Modern Indian Mobile-First Social Media Platform
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { PWAInstallBanner } from './components/layout/PWAInstallBanner';

import { FeedView } from './components/feed/FeedView';
import { VibesView } from './components/vibes/VibesView';
import { ExploreView } from './components/explore/ExploreView';
import { CommunitiesView } from './components/communities/CommunitiesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { MessagesView } from './components/chat/MessagesView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { CreatePostModal } from './components/create/CreatePostModal';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { ShareModal } from './components/modals/ShareModal';
import { ReportModal } from './components/modals/ReportModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { AndroidApkModal } from './components/admin/AndroidApkModal';

const MainShell: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileFramed, setIsMobileFramed] = useState<boolean>(false);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedView />;
      case 'vibes':
        return <VibesView />;
      case 'explore':
        return <ExploreView />;
      case 'addas':
        return <CommunitiesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'messages':
        return <MessagesView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start overflow-x-hidden selection:bg-rose-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Container (responsive: supports phone frame simulation or full responsive width) */}
      <div
        className={`w-full relative z-10 transition-all duration-300 ${
          isMobileFramed
            ? 'max-w-md my-4 sm:my-8 rounded-[44px] border-4 border-slate-700/80 shadow-2xl shadow-rose-950/40 overflow-hidden bg-slate-950 min-h-[850px] ring-1 ring-white/10'
            : 'max-w-xl mx-auto min-h-screen flex flex-col'
        }`}
      >
        {/* Mobile Speaker & Camera Notch Simulator if framed */}
        {isMobileFramed && (
          <div className="w-full bg-slate-950 pt-3 pb-1 flex justify-center items-center">
            <div className="w-24 h-4 bg-slate-900 rounded-full border border-white/5 flex items-center justify-end px-2">
              <span className="w-2 h-2 rounded-full bg-slate-800 ring-1 ring-white/10" />
            </div>
          </div>
        )}

        {/* PWA Install Notification Bar */}
        <PWAInstallBanner />

        {/* Top Navigation Bar */}
        <Navbar
          isMobileFramed={isMobileFramed}
          setIsMobileFramed={setIsMobileFramed}
        />

        {/* Main Dynamic Viewport */}
        <main className="flex-1 w-full px-3 sm:px-4 pt-3 sm:pt-4">
          {renderActiveScreen()}
        </main>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Global Interactive Modals */}
      <CreatePostModal />
      <EditProfileModal />
      <ShareModal />
      <ReportModal />
      <SettingsModal />
      <AndroidApkModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
