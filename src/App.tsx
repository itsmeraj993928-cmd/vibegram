import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import CreatePost from './components/CreatePost';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <div className="bg-black min-h-screen text-white pb-16">
      {/* Header */}
      <header className="app-header flex justify-between items-center p-3 border-b border-gray-800 sticky top-0 bg-black z-40">
        <h1 className="logo-text text-2xl font-bold">Vibegram</h1>
        <div className="flex gap-4 text-xl items-center">
          <button onClick={() => setShowCreateModal(true)} className="text-2xl font-bold">➕</button>
          <button onClick={() => setActiveTab('notifications')}>❤️</button>
          <button onClick={() => setActiveTab('messages')}>💬</button>
        </div>
      </header>

      {/* Upload Modal */}
      {showCreateModal && <CreatePost onClose={() => setShowCreateModal(false)} />}

      {/* Main Content Screens */}
      <main className="max-w-md mx-auto">
        {activeTab === 'home' && (
          <div className="feed-container p-2">
            {posts.length === 0 ? (
              <div className="text-center text-gray-500 my-10">
                <p>Koi post nahi hai.</p>
                <button 
                  onClick={() => setShowCreateModal(true)} 
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
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

        {activeTab === 'reels' && <div className="p-4 text-center my-10">🎬 Reels View</div>}
        {activeTab === 'search' && <div className="p-4 text-center my-10">🔍 Search Users & Posts</div>}
        {activeTab === 'messages' && <div className="p-4 text-center my-10">💬 Direct Messages</div>}
        {activeTab === 'profile' && <div className="p-4 text-center my-10">👤 Profile & Settings</div>}
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
