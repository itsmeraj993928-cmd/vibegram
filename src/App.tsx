import React, { useEffect, useState } from 'react';
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

interface Reel {
  id: number;
  user: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
}

type Tab = 'home' | 'search' | 'reels' | 'add' | 'profile';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: 'alex_tech',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900',
      caption: 'Exploring new AI vibes ✨ #Vibegram #Tech',
      likes: 124,
      isLiked: false,
      comments: ['Awesome shot!', 'Looks super cool 🔥'],
    },
    {
      id: 2,
      user: 'nature_lover',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900',
      caption: 'Beautiful nature 🌊 #ChillVibes',
      likes: 89,
      isLiked: false,
      comments: ['Amazing place 😍'],
    },
  ]);

  const [reels, setReels] = useState<Reel[]>([
    {
      id: 1,
      user: 'vibe_creator',
      avatar: 'https://i.pravatar.cc/150?img=12',
      video:
        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      caption: 'Beautiful vibes ✨ #Vibegram #Reels',
      likes: 2450,
      comments: 126,
      shares: 54,
    },
    {
      id: 2,
      user: 'travel_vibes',
      avatar: 'https://i.pravatar.cc/150?img=32',
      video:
        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
      caption: 'Nature vibes 🌿🔥',
      likes: 1890,
      comments: 84,
      shares: 31,
    },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('vibegram_user');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('vibegram_user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vibegram_user');
    setUser(null);
  };

  const handleLike = (id: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== id) {
          return post;
        }

        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked,
        };
      })
    );
  };

  const handleAddComment = (postId: number) => {
    const text = newComment[postId]?.trim();

    if (!text) {
      return;
    }

    const username = user?.username || 'you';

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          comments: [...post.comments, `${username}: ${text}`],
        };
      })
    );

    setNewComment((current) => ({
      ...current,
      [postId]: '',
    }));
  };

  const handleReelLike = (id: number) => {
    setReels((currentReels) =>
      currentReels.map((reel) =>
        reel.id === id
          ? { ...reel, likes: reel.likes + 1 }
          : reel
      )
    );
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    setSelectedFile(url);

    if (file.type.startsWith('video/')) {
      setSelectedFileType('video');
    } else {
      setSelectedFileType('image');
    }
  };

  const publishPost = () => {
    if (!selectedFile) {
      alert('Please select a photo or video first.');
      return;
    }

    const username = user?.username || 'new_user';

    if (selectedFileType === 'video') {
      const newReel: Reel = {
        id: Date.now(),
        user: username,
        avatar: user?.avatar || 'https://i.pravatar.cc/150',
        video: selectedFile,
        caption: newPostCaption || 'New Vibegram Reel ✨',
        likes: 0,
        comments: 0,
        shares: 0,
      };

      setReels((current) => [newReel, ...current]);
    } else {
      const newPost: Post = {
        id: Date.now(),
        user: username,
        avatar: user?.avatar || 'https://i.pravatar.cc/150',
        image: selectedFile,
        caption: newPostCaption || 'New Vibegram post ✨',
        likes: 0,
        isLiked: false,
        comments: [],
      };

      setPosts((current) => [newPost, ...current]);
    }

    setSelectedFile(null);
    setSelectedFileType(null);
    setNewPostCaption('');
    setActiveTab(selectedFileType === 'video' ? 'reels' : 'home');
  };

  if (!user) {
    return (
      <Auth
        onLogin={(userData) => {
          setUser(userData);
          localStorage.setItem(
            'vibegram_user',
            JSON.stringify(userData)
          );
        }}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <button
          style={styles.headerButton}
          onClick={() => alert('Vibegram camera')}
        >
          📷
        </button>

        <h1 style={styles.logo}>Vibegram</h1>

        <button
          style={styles.headerButton}
          onClick={() => setActiveTab('reels')}
        >
          🎬
        </button>
      </header>

      {/* MAIN */}
      <main style={styles.main}>
        {/* HOME */}
        {activeTab === 'home' && (
          <div>
            {/* STORIES */}
            <div style={styles.storyRow}>
              <div style={styles.storyItem}>
                <div style={styles.storyRing}>
                  <img
                    src={user.avatar || 'https://i.pravatar.cc/150'}
                    alt="Your story"
                    style={styles.storyImage}
                  />
                </div>
                <span>Your story</span>
              </div>

              <div style={styles.storyItem}>
                <div style={styles.storyRing}>
                  <img
                    src="https://i.pravatar.cc/150?img=1"
                    alt="Story"
                    style={styles.storyImage}
                  />
                </div>
                <span>rohit_99</span>
              </div>

              <div style={styles.storyItem}>
                <div style={styles.storyRing}>
                  <img
                    src="https://i.pravatar.cc/150?img=5"
                    alt="Story"
                    style={styles.storyImage}
                  />
                </div>
                <span>priya_vibe</span>
              </div>

              <div style={styles.storyItem}>
                <div style={styles.storyRing}>
                  <img
                    src="https://i.pravatar.cc/150?img=8"
                    alt="Story"
                    style={styles.storyImage}
                  />
                </div>
                <span>tech_guy</span>
              </div>
            </div>

            {/* POSTS */}
            {posts.map((post) => (
              <article key={post.id} style={styles.post}>
                <div style={styles.postHeader}>
                  <img
                    src={post.avatar}
                    alt={post.user}
                    style={styles.postAvatar}
                  />

                  <div style={styles.userInfo}>
                    <strong>{post.user}</strong>
                    <span>Vibegram</span>
                  </div>

                  {/* THREE DOT MENU */}
                  <button
                    style={styles.moreButton}
                    onClick={() =>
                      setOpenMenu(
                        openMenu === post.id ? null : post.id
                      )
                    }
                  >
                    ⋮
                  </button>
                </div>

                {openMenu === post.id && (
                  <div style={styles.postMenu}>
                    <button>Save</button>
                    <button>Share</button>
                    <button>Report</button>
                  </div>
                )}

                <img
                  src={post.image}
                  alt="Post"
                  style={styles.postImage}
                />

                <div style={styles.actionRow}>
                  <button
                    style={styles.iconButton}
                    onClick={() => handleLike(post.id)}
                  >
                    {post.isLiked ? '❤️' : '🤍'}
                  </button>

                  <button
                    style={styles.iconButton}
                    onClick={() => {
                      const input = document.getElementById(
                        `comment-${post.id}`
                      );

                      input?.focus();
                    }}
                  >
                    💬
                  </button>

                  <button style={styles.iconButton}>➤</button>

                  <button
                    style={styles.saveButton}
                    onClick={() => alert('Post saved')}
                  >
                    🔖
                  </button>
                </div>

                <div style={styles.likes}>
                  {post.likes} likes
                </div>

                <div style={styles.caption}>
                  <strong>{post.user}</strong>{' '}
                  {post.caption}
                </div>

                <div style={styles.comments}>
                  {post.comments.slice(-3).map((comment, index) => (
                    <div key={index}>{comment}</div>
                  ))}
                </div>

                <div style={styles.commentBox}>
                  <input
                    id={`comment-${post.id}`}
                    value={newComment[post.id] || ''}
                    onChange={(event) =>
                      setNewComment({
                        ...newComment,
                        [post.id]: event.target.value,
                      })
                    }
                    placeholder="Add a comment..."
                    style={styles.commentInput}
                  />

                  <button
                    style={styles.postButton}
                    onClick={() => handleAddComment(post.id)}
                  >
                    Post
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* SEARCH */}
        {activeTab === 'search' && (
          <div style={styles.page}>
            <h2>Search</h2>

            <input
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search users, hashtags..."
              style={styles.searchInput}
            />

            <div style={styles.searchResult}>
              {searchText ? (
                <>
                  <div>🔎 Searching for</div>
                  <strong>{searchText}</strong>
                </>
              ) : (
                <div>Discover people and trending content</div>
              )}
            </div>
          </div>
        )}

        {/* REELS */}
        {activeTab === 'reels' && (
          <div style={styles.reelsContainer}>
            {reels.map((reel) => (
              <div key={reel.id} style={styles.reel}>
                <video
                  src={reel.video}
                  controls
                  loop
                  playsInline
                  style={styles.reelVideo}
                />

                <div style={styles.reelOverlay}>
                  <div style={styles.reelUser}>
                    <img
                      src={reel.avatar}
                      alt={reel.user}
                      style={styles.reelAvatar}
                    />

                    <strong>@{reel.user}</strong>
                  </div>

                  <div style={styles.reelCaption}>
                    {reel.caption}
                  </div>
                </div>

                <div style={styles.reelActions}>
                  <button
                    onClick={() => handleReelLike(reel.id)}
                    style={styles.reelButton}
                  >
                    ❤️
                    <span>{reel.likes}</span>
                  </button>

                  <button
                    style={styles.reelButton}
                    onClick={() =>
                      alert(`${reel.comments} comments`)
                    }
                  >
                    💬
                    <span>{reel.comments}</span>
                  </button>

                  <button style={styles.reelButton}>
                    ➤
                    <span>{reel.shares}</span>
                  </button>

                  <button style={styles.reelButton}>
                    🔖
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD */}
        {activeTab === 'add' && (
          <div style={styles.page}>
            <h2>Create</h2>

            <label style={styles.uploadArea}>
              <div style={{ fontSize: '50px' }}>＋</div>
              <div>Select Photo or Video</div>

              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            {selectedFile && (
              <div style={styles.previewBox}>
                {selectedFileType === 'video' ? (
                  <video
                    src={selectedFile}
                    controls
                    style={styles.preview}
                  />
                ) : (
                  <img
                    src={selectedFile}
                    alt="Preview"
                    style={styles.preview}
                  />
                )}

                <textarea
                  value={newPostCaption}
                  onChange={(event) =>
                    setNewPostCaption(event.target.value)
                  }
                  placeholder="Write a caption..."
                  style={styles.captionInput}
                />

                <button
                  onClick={publishPost}
                  style={styles.publishButton}
                >
                  Share
                </button>
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div style={styles.profile}>
            <img
              src={user.avatar || 'https://i.pravatar.cc/150'}
              alt="Profile"
              style={styles.profileAvatar}
            />

            <h2>{user.name || user.username}</h2>

            <div style={styles.username}>
              @{user.username}
            </div>

            <p>
              {user.bio || 'Vibegram Explorer ✨'}
            </p>

            <div style={styles.stats}>
              <div>
                <strong>{posts.filter(
                  (p) => p.user === user.username
                ).length}</strong>
                <span>Posts</span>
              </div>

              <div>
                <strong>{user.followersCount || 0}</strong>
                <span>Followers</span>
              </div>

              <div>
                <strong>{user.followingCount || 0}</strong>
                <span>Following</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={styles.logout}
            >
              Logout
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav style={styles.bottomNav}>
        <button
          onClick={() => setActiveTab('home')}
          style={styles.navButton}
        >
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          style={styles.navButton}
        >
          <span>⌕</span>
          <small>Search</small>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          style={styles.navButton}
        >
          <span>▶</span>
          <small>Reels</small>
        </button>

        <button
          onClick={() => setActiveTab('add')}
          style={styles.navButton}
        >
          <span style={styles.plus}>＋</span>
          <small>Create</small>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={styles.navButton}
        >
          <span>●</span>
          <small>Profile</small>
        </button>
      </nav>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    paddingBottom: '72px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  header: {
    height: '58px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 15px',
    borderBottom: '1px solid #262626',
    position: 'sticky',
    top: 0,
    backgroundColor: '#000',
    zIndex: 50,
  },

  logo: {
    margin: 0,
    fontSize: '25px',
    fontFamily: 'Georgia, serif',
    background:
      'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  headerButton: {
    background: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: '23px',
    cursor: 'pointer',
  },

  main: {
    width: '100%',
    maxWidth: '520px',
    margin: '0 auto',
  },

  storyRow: {
    display: 'flex',
    gap: '17px',
    padding: '13px 15px',
    overflowX: 'auto',
    borderBottom: '1px solid #262626',
  },

  storyItem: {
    minWidth: '65px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    color: '#bbb',
    fontSize: '11px',
  },

  storyRing: {
    width: '57px',
    height: '57px',
    padding: '2px',
    borderRadius: '50%',
    border: '2px solid #e1306c',
  },

  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },

  post: {
    borderBottom: '1px solid #262626',
    position: 'relative',
  },

  postHeader: {
    height: '55px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 13px',
    gap: '10px',
  },

  postAvatar: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    objectFit: 'cover',
  },

  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
  },

  moreButton: {
    marginLeft: 'auto',
    background: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: '25px',
    cursor: 'pointer',
  },

  postMenu: {
    position: 'absolute',
    right: '12px',
    top: '48px',
    backgroundColor: '#262626',
    borderRadius: '10px',
    zIndex: 20,
    overflow: 'hidden',
    minWidth: '130px',
  },

  postMenuButton: {
  
