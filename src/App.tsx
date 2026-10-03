import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import CreatePost from './CreatePost';
import ReelsView from './ReelsView';
import Auth from './Auth';

export default function App() {
  // Default tab hamesha 'home' rahega
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 1. Auth State Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Feed Posts Fetch
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setActiveTab('home');
    alert('Logged out successfully!');
  };

  return (
    <div className="bg-black min-h-screen text-white pb-16">
      {/* Header - Logo par click karne se Home Tab khulega */}
      <header className="app-header flex justify-between items-center p-3 border-b border-gray-800 sticky top-0 bg-black z-40">
        <h1
          className="logo-text text-2xl font-bold cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          Vibegram
        </h1>
        <div className="flex gap-4 text-xl items-center">
          <button
            onClick={() => user ? setShowCreateModal(true) : setShowAuthModal(true)}
            className="text-2xl font-bold"
          >
            ➕
          </button>
          <button onClick={() => setActiveTab('notifications')}>❤️</button>
          <button onClick={() => setActiveTab('messages')}>💬</button>
        </div>
      </header>

      {/* Modals */}
      {showCreateModal && <CreatePost onClose={() => setShowCreateModal(false)} />}
      {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}

      {/* Main Content Screens */}
      <main className="max-w-md mx-auto">
        {/* 1. HOME FEED TAB */}
        {activeTab === 'home' && (
          <div className="feed-container p-2">
            {posts.length === 0 ? (
              <div className="text-center text-gray-500 my-10">
                <p className="mb-2">Abhi koi post nahi hai.</p>
                <button
                  onClick={() => user ? setShowCreateModal(true) : setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  Pehla Post Share Karein
                </button>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card my-4 border-b border-gray-800 pb-4">
                  <div className="post-header flex items-center gap-2 mb-2">
                    <img src={post.userImage || "https://via.placeholder.com/40"} className="w-8 h-8 rounded-full" alt="avatar" />
                    <span className="font-bold text-sm">{post.username}</span>
                  </div>
                  {post.type === 'reel' ? (
                    <video src={post.mediaUrl} controls className="w-full rounded max-h-96 object-cover" />
                  ) : (
                    <img src={post.mediaUrl} className="w-full rounded" alt="post" />
                  )}
                  <div className="post-actions flex gap-4 my-2 text-xl">
                    <button>❤️ {post.likes?.length || 0}</button>
                    <button>💬 {post.comments?.length || 0}</button>
                  </div>
                  <p className="text-sm"><b>{post.username}</b> {post.caption}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. REELS TAB */}
        {activeTab === 'reels' && <ReelsView />}

        {/* 3. SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="p-4 text-center my-10 text-gray-400">
            🔍 Search Users & Posts
          </div>
        )}

        {/* 4. MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="p-4 text-center my-10 text-gray-400">
            💬 Direct Messages
          </div>
        )}

        {/* 5. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="p-4 text-center my-10 text-gray-400">
            ❤️ Notifications & Activity
          </div>
        )}

        {/* 6. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="p-4 text-center my-10">
            {user ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={user.photoURL || "https://via.placeholder.com/100"}
                  className="w-20 h-20 rounded-full border-2 border-pink-500"
                  alt="profile"
                />
                <h2 className="text-xl font-bold">{user.displayName || user.email}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-6 py-2 rounded-lg text-sm font-bold mt-4"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-400">Profile dekhne ke liye login karein</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 px-6 py-2 rounded-lg text-sm font-bold"
                >
                  Log In / Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>🏠</button>
        <button className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>🔍</button>
        <button className={`nav-btn ${activeTab === 'reels' ? 'active' : ''}`} onClick={() => setActiveTab('reels')}>🎬</button>
        <button className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>💬</button>
        <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>👤</button>
      </div>
    </div>
  );
}
