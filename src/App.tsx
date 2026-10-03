import React, { useState, useEffect } from 'react';
import Auth from './Auth';

interface Post {
  id: number;
  user: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  comments: string[];
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'add' | 'profile'>('home');
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: 'alex_tech',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      caption: 'Exploring new AI vibes ✨ #Vibegram #Tech',
      likes: 124,
      isLiked: false,
      comments: ['Awesome shot!', 'Looks super cool 🔥']
    },
    {
      id: 2,
      user: 'nature_lover',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      caption: 'Sunset peace 🌅 #ChillVibes',
      likes: 89,
      isLiked: false,
      comments: ['Where is this spot? 😍']
    }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('vibegram_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vibegram_user');
    setUser(null);
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: number) => {
    const commentText = newComment[postId];
    if (!commentText || !commentText.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, `${user.username}: ${commentText}`]
        };
      }
      return post;
    }));

    setNewComment({ ...newComment, [postId]: '' });
  };

  if (!user) {
    return <Auth onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Vibegram</h1>
      </header>

      {/* Main Content View */}
      <main style={styles.main}>
        {activeTab === 'home' && (
          <div style={styles.feedContainer}>
            {/* Stories Row */}
            <div style={styles.storyRow}>
              <div style={styles.storyItem}>
                <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Your story" style={styles.storyRing} />
                <span style={styles.storyText}>Your story</span>
              </div>
              <div style={styles.storyItem}>
                <img src="https://i.pravatar.cc/150?img=1" alt="Story" style={styles.storyRing} />
                <span style={styles.storyText}>rohit_99</span>
              </div>
              <div style={styles.storyItem}>
                <img src="https://i.pravatar.cc/150?img=5" alt="Story" style={styles.storyRing} />
                <span style={styles.storyText}>priya_vibe</span>
              </div>
            </div>

            {/* Posts List */}
            {posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <img src={post.avatar} alt="User" style={styles.postAvatar} />
                  <span style={styles.postUsername}>{post.user}</span>
                </div>
                
                <img src={post.image} alt="Post content" style={styles.postImage} />

                <div style={styles.postActions}>
                  <button onClick={() => handleLike(post.id)} style={styles.actionBtn}>
                    {post.isLiked ? '❤️' : '🤍'}
                  </button>
                  <span style={styles.likesCount}>{post.likes} likes</span>
                </div>

                <div style={styles.captionSection}>
                  <strong style={{ marginRight: '8px' }}>{post.user}</strong>
                  <span>{post.caption}</span>
                </div>

                {/* Comments */}
                <div style={styles.commentsSection}>
                  {post.comments.map((c, i) => (
                    <p key={i} style={styles.commentText}>{c}</p>
                  ))}
                </div>

                <div style={styles.addCommentBox}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                    style={styles.commentInput}
                  />
                  <button onClick={() => handleAddComment(post.id)} style={styles.postCommentBtn}>Post</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'search' && (
          <div style={styles.tabContent}>
            <h3>Explore</h3>
            <input type="text" placeholder="Search users or hashtags..." style={styles.searchInput} />
            <p style={{ color: '#8e8e8e', marginTop: '20px' }}>Discover trending posts & creators here!</p>
          </div>
        )}

        {activeTab === 'add' && (
          <div style={styles.tabContent}>
            <h3>Create New Post</h3>
            <p style={{ color: '#8e8e8e' }}>Select photo or video from your device</p>
            <button style={styles.uploadBtn}>Upload Media</button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={styles.profileView}>
            <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Profile" style={styles.profileAvatar} />
            <h2>{user.name || user.username}</h2>
            <p style={styles.profileUsername}>@{user.username}</p>
            <p style={styles.profileBio}>{user.bio || 'Vibegram Explorer ✨'}</p>

            {/* Default Stats for New User */}
            <div style={styles.statsRow}>
              <div><strong>{user.postsCount || 0}</strong><br/><span style={styles.statLabel}>Posts</span></div>
              <div><strong>{user.followersCount || 0}</strong><br/><span style={styles.statLabel}>Followers</span></div>
              <div><strong>{user.followingCount || 0}</strong><br/><span style={styles.statLabel}>Following</span></div>
            </div>

            <button onClick={handleLogout} style={styles.logoutBtnProfile}>Logout Account</button>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav style={styles.bottomNav}>
        <button onClick={() => setActiveTab('home')} style={styles.navBtn}>
          {activeTab === 'home' ? '🏠' : '🏚️'}
        </button>
        <button onClick={() => setActiveTab('search')} style={styles.navBtn}>
          🔍
        </button>
        <button onClick={() => setActiveTab('add')} style={styles.navBtn}>
          ➕
        </button>
        <button onClick={() => setActiveTab('profile')} style={styles.navBtn}>
          👤
        </button>
      </nav>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    paddingBottom: '60px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #262626',
    backgroundColor: '#000000',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  logoutBtnProfile: {
    backgroundColor: '#262626',
    color: '#ed4956',
    border: '1px solid #363636',
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '25px',
    width: '100%'
  },
  main: {
    maxWidth: '480px',
    margin: '0 auto'
  },
  feedContainer: {
    paddingBottom: '20px'
  },
  storyRow: {
    display: 'flex',
    gap: '15px',
    padding: '12px 16px',
    borderBottom: '1px solid #262626',
    overflowX: 'auto'
  },
  storyItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '11px',
    color: '#a8a8a8'
  },
  storyRing: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    padding: '2px',
    border: '2px solid #e1306c',
    objectFit: 'cover'
  },
  storyText: { marginTop: '4px' },
  postCard: {
    borderBottom: '1px solid #262626',
    marginBottom: '15px'
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    gap: '10px'
  },
  postAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  postUsername: { fontWeight: 'bold', fontSize: '14px' },
  postImage: {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'cover'
  },
  postActions: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    gap: '10px'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer'
  },
  likesCount: { fontWeight: 'bold', fontSize: '14px' },
  captionSection: { padding: '0 14px', fontSize: '14px' },
  commentsSection: { padding: '5px 14px', fontSize: '13px', color: '#a8a8a8' },
  commentText: { margin: '2px 0' },
  addCommentBox: {
    display: 'flex',
    padding: '10px 14px',
    borderTop: '1px solid #1a1a1a',
    marginTop: '8px'
  },
  commentInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    outline: 'none',
    fontSize: '13px'
  },
  postCommentBtn: {
    background: 'none',
    border: 'none',
    color: '#0095f6',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  tabContent: {
    padding: '20px',
    textAlign: 'center'
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #262626',
    backgroundColor: '#121212',
    color: '#fff',
    outline: 'none'
  },
  uploadBtn: {
    padding: '10px 20px',
    backgroundColor: '#0095f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    marginTop: '15px',
    cursor: 'pointer'
  },
  profileView: {
    textAlign: 'center',
    padding: '30px 20px'
  },
  profileAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '10px'
  },
  profileUsername: { color: '#8e8e8e', margin: '4px 0' },
  profileBio: { fontSize: '14px', marginBottom: '20px' },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '15px 0',
    borderTop: '1px solid #262626',
    borderBottom: '1px solid #262626'
  },
  statLabel: { fontSize: '12px', color: '#8e8e8e' },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTop: '1px solid #262626',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    zIndex: 100
  },
  navBtn: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#fff'
  }
};
      
