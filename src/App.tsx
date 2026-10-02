/**
 * Vibegram - Modern Indian Mobile-First Social Platform
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';

import { FeedView } from './components/feed/FeedView';
import { VibesView } from './components/vibes/VibesView';
import { ExploreView } from './components/explore/ExploreView';
import { CommunitiesView } from './components/communities/CommunitiesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { MessagesView } from './components/messages/MessagesView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import Auth from './Auth';

function MainApp() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vibegram_user');
    return saved ? JSON.parse(saved) : null;
  });

  const { activeTab } = useApp();

  if (!currentUser) {
    return <Auth onLogin={(user: any) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <Navbar />
      <PWAInstallBanner />
      
      <main className="max-w-md mx-auto pt-14 px-2">
        {activeTab === 'home' && <FeedView />}
        {activeTab === 'vibes' && <VibesView />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'addas' && <CommunitiesView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
