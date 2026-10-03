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

interface Reel {
  id: number;
  user: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

type Tab = 'home' | 'search' | 'reels' | 'add' | 'profile';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [reelIndex, setReelIndex] = useState(0);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: 'alex_tech',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
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
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      caption: 'Sunset peace 🌅 #ChillVibes',
      likes: 89,
      isLiked: false,
      comments: ['Where is this spot? 😍'],
    },
  ]);

  const [reels, setReels] = useState<Reel[]>([
    {
      id: 1,
      user: 'alex_tech',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      video:
        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      caption: 'Beautiful vibes 🌸✨ #Vibegram #Reels',
      likes: 1240,
      comments: 86,
      isLiked: false,
    },
    {
      id: 2,
      user: 'nature_lover',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      video:
        'https://www.w3schools.com/html/mov_bbb.mp4',
      caption: 'Nature vibes 🌿 #Nature #Vibegram',
      likes: 895,
      comments: 42,
      isLiked: false,
    },
    {
      id: 3,
      user: 'rohit_99',
      avatar: 'https://i.pravatar.cc/150?img=12',
      video:
        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      caption: 'Enjoy the moment 🔥 #Reels',
      likes: 532,
      comments: 31,
      isLiked: false,
    },
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
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleReelLike = (id: number) => {
    setReels((currentReels) =>
      currentReels.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
              isLiked: !reel.isLiked,
            }
          : reel
      )
    );
  };

  const handleAddComment = (postId: number) => {
    const commentText = newComment[postId];

    if (!commentText || !commentText.trim()) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                `${user?.username || 'user'}: ${commentText}`,
              ],
            }
          : post
      )
    );

    setNewComment((current) => ({
      ...current,
      [postId]: '',
    }));
  };

  const handleSavePost = (id: number) => {
    setSavedPosts((current) =>
      current.includes(id)
        ? current.filter((postId) => postId !== id)
        : [...current, id]
    );

    setOpenMenu(null);
  };

  const handleDeletePost = (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (!confirmed) return;

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== id)
    );

    setOpenMenu(null);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Vibegram',
          text: 'Check this out on Vibegram!',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
      }
    } catch (error) {
      console.log('Share cancelled');
    }

    setOpenMenu(null);
  };

  const changeReel = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      setReelIndex((current) =>
        Math.min(current + 1, reels.length - 1)
      );
    } else {
      setReelIndex((current) => Math.max(current - 1, 0));
    }
  };

  const currentReel = reels[reelIndex];

  if (!user) {
    return (
      <Auth
        onLogin={(userData) => {
          setUser(userData);
        }}
      />
    );
  }

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Vibegram</h1>

        {activeTab === 'reels' && (
          <span style={styles.reelsHeaderText}>Reels</span>
        )}
      </header>

      {/* MAIN */}
      <main style={styles.main}>

        {/* HOME */}
        {activeTab === 'home' && (
          <div style={styles.feedContainer}>

            {/* STORIES */}
            <div style={styles.storyRow}>

              <div style={styles.storyItem}>
                <img
                  src={
                    user.avatar ||
                    'https://i.pravatar.cc/150'
                  }
                  alt="Your story"
                  style={styles.storyRing}
                />
                <span style={styles.storyText}>
                  Your story
                </span>
              </div>

              <div style={styles.storyItem}>
                <img
                  src="https://i.pravatar.cc/150?img=1"
                  alt="Story"
                  style={styles.storyRing}
                />
                <span style={styles.storyText}>
                  rohit_99
                </span>
              </div>

              <div style={styles.storyItem}>
                <img
                  src="https://i.pravatar.cc/150?img=5"
                  alt="Story"
                  style={styles.storyRing}
                />
                <span style={styles.storyText}>
                  priya_vibe
                </span>
              </div>

            </div>

            {/* POSTS */}
            {posts.map((post) => (
              <div
                key={post.id}
                style={styles.postCard}
              >

                {/* POST HEADER */}
                <div style={styles.postHeader}>

                  <img
                    src={post.avatar}
                    alt="User"
                    style={styles.postAvatar}
                  />

                  <span style={styles.postUsername}>
                    {post.user}
                  </span>

                  {/* THREE DOT */}
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === post.id
                          ? null
                          : post.id
                      )
                    }
                    style={styles.moreButton}
                    aria-label="Post options"
                  >
                    ⋮
                  </button>

                </div>

                {/* MENU */}
                {openMenu === post.id && (
                  <div style={styles.menuOverlay}>
                    <div style={styles.postMenu}>

                      <button
                        style={styles.menuItem}
                        onClick={() =>
                          handleSavePost(post.id)
                        }
                      >
                        {savedPosts.includes(post.id)
                          ? '🔖 Remove from Saved'
                          : '🔖 Save'}
                      </button>

                      <button
                        style={styles.menuItem}
                        onClick={handleShare}
                      >
                        ↗️ Share
                      </button>

                      <button
                        style={styles.menuItem}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              window.location.href
                            );
                            alert('Link copied!');
                          } catch {
                            alert('Unable to copy link');
                          }
                          setOpenMenu(null);
                        }}
                      >
                        🔗 Copy link
                      </button>

                      <button
                        style={styles.menuItem}
                        onClick={() => {
                          alert(
                            'Notifications turned on for this account.'
                          );
                          setOpenMenu(null);
                        }}
                      >
                        🔔 Turn on notifications
                      </button>

                      <button
                        style={styles.menuItem}
                        onClick={() => {
                          alert('Thanks. Your report was received.');
                          setOpenMenu(null);
                        }}
                      >
                        🚩 Report
                      </button>

                      <button
                        style={styles.menuItem}
                        onClick={() => {
                          alert('You will see fewer posts like this.');
                          setOpenMenu(null);
                        }}
                      >
                        🚫 Not interested
                      </button>

                      <button
                        style={styles.menuCancel}
                        onClick={() => setOpenMenu(null)}
                      >
                        Cancel
                      </button>

                    </div>
                  </div>
                )}

                {/* POST IMAGE */}
                <img
                  src={post.image}
                  alt="Post content"
                  style={styles.postImage}
                />

                {/* ACTIONS */}
                <div style={styles.postActions}>

                  <button
                    onClick={() => handleLike(post.id)}
                    style={styles.actionBtn}
                  >
                    {post.isLiked ? '❤️' : '🤍'}
                  </button>

                  <button
                    style={styles.actionBtn}
                    onClick={() =>
                      document
                        .getElementById(
                          `comment-${post.id}`
                        )
                        ?.focus()
                    }
                  >
                    💬
                  </button>

                  <button
                    style={styles.actionBtn}
                    onClick={handleShare}
                  >
                    ➤
                  </button>

                  <button
                    style={{
                      ...styles.actionBtn,
                      marginLeft: 'auto',
                    }}
                    onClick={() =>
                      handleSavePost(post.id)
                    }
                  >
                    {savedPosts.includes(post.id)
                      ? '🔖'
                      : '🏷️'}
                  </button>

                </div>

                <div style={styles.likesCount}>
                  {post.likes} likes
                </div>

                {/* CAPTION */}
                <div style={styles.captionSection}>
                  <strong style={{ marginRight: '8px' }}>
                    {post.user}
                  </strong>

                  <span>{post.caption}</span>
                </div>

                {/* COMMENTS */}
                <div style={styles.commentsSection}>
                  {post.comments.map((comment, index) => (
                    <p
                      key={index}
                      style={styles.commentText}
                    >
                      {comment}
                    </p>
                  ))}
                </div>

                {/* ADD COMMENT */}
                <div style={styles.addCommentBox}>

                  <input
                    id={`comment-${post.id}`}
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[post.id] || ''}
                    onChange={(e) =>
                      setNewComment({
                        ...newComment,
                        [post.id]: e.target.value,
                      })
                    }
                    style={styles.commentInput}
                  />

                  <button
                    onClick={() =>
                      handleAddComment(post.id)
                    }
                    style={styles.postCommentBtn}
                  >
                    Post
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* SEARCH */}
        {activeTab === 'search' && (
          <div style={styles.tabContent}>

            <h2 style={styles.pageTitle}>
              Search & Explore
            </h2>

            <input
              type="text"
              placeholder="Search users, hashtags..."
              style={styles.searchInput}
            />

            <div style={styles.exploreGrid}>

              {posts.map((post) => (
                <img
                  key={post.id}
                  src={post.image}
                  alt="Explore"
                  style={styles.exploreImage}
                />
              ))}

              <img
                src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500"
                alt="Explore"
                style={styles.exploreImage}
              />

              <img
                src="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500"
                alt="Explore"
                style={styles.exploreImage}
              />

            </div>

          </div>
        )}

        {/* REELS */}
        {activeTab === 'reels' && (
          <div style={styles.reelsContainer}>

            <video
              key={currentReel.id}
              src={currentReel.video}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              style={styles.reelVideo}
              onClick={(e) => {
                const video =
                  e.currentTarget;

                if (video.paused) {
                  video.play();
                } else {
                  video.pause();
                }
              }}
            />

            {/* DARK GRADIENT */}
            <div style={styles.reelGradient} />

            {/* TOP */}
            <div style={styles.reelTopBar}>
              <span>Reels</span>

              <button
                style={styles.reelCameraButton}
                onClick={() =>
                  setActiveTab('add')
                }
              >
                ＋
              </button>
            </div>

            {/* RIGHT ACTIONS */}
            <div style={styles.reelActions}>

              <button
                style={styles.reelActionButton}
                onClick={() =>
                  handleReelLike(currentReel.id)
                }
              >
                <span style={styles.reelIcon}>
                  {currentReel.isLiked
                    ? '❤️'
                    : '🤍'}
                </span>

                <span>
                  {currentReel.likes}
                </span>
              </button>

              <button
                style={styles.reelActionButton}
                onClick={() =>
                  alert('Comments coming here.')
                }
              >
                <span style={styles.reelIcon}>
                  💬
                </span>

                <span>
                  {currentReel.comments}
                </span>
              </button>

              <button
                style={styles.reelActionButton}
                onClick={handleShare}
              >
                <span style={styles.reelIcon}>
                  ➤
                </span>

                <span>Share</span>
              </button>

              <button
                style={styles.reelActionButton}
                onClick={() => {
                  alert('Reel saved!');
                }}
              >
                <span style={styles.reelIcon}>
                  🔖
                </span>

                <span>Save</span>
              </button>

              <button
                style={styles.reelActionButton}
                onClick={() =>
                  alert(
                    'Reel options'
                  )
                }
              >
                <span style={styles.reelIcon}>
                  ⋮
                </span>
              </button>

            </div>

            {/* REEL INFO */}
            <div style={styles.reelInfo}>

              <div style={styles.reelUserRow}>

                <img
                  src={currentReel.avatar}
                  alt="Reel user"
                  style={styles.reelAvatar}
                />

                <strong>
                  {currentReel.user}
                </strong>

                <button
                  style={styles.followButton}
                >
                  Follow
                </button>

              </div>

              <p style={styles.reelCaption}>
                {currentReel.caption}
              </p>

              <div style={styles.musicRow}>
                🎵 Original audio · Vibegram
              </div>

            </div>

            {/* REEL SWIPE / BUTTONS */}
            <div style={styles.reelNavigation}>

              {reelIndex > 0 && (
                <button
                  style={styles.reelNavButton}
                  onClick={() =>
                    changeReel('previous')
                  }
                >
                  ↑
                </button>
              )}

              {reelIndex < reels.length - 1 && (
                <button
                  style={styles.reelNavButton}
                  onClick={() =>
                    changeReel('next')
                  }
                >
                  ↓
                </button>
              )}

            </div>

            {/* TOUCH SWIPE AREA */}
            <div
              style={styles.swipeArea}
              onWheel={(e) => {
                if (e.deltaY > 30) {
                  changeReel('next');
                }

                if
