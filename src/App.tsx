import React, { useEffect, useState } from "react";
import Auth from "./Auth";

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

interface UserData {
  username: string;
  name?: string;
  avatar?: string;
  bio?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<
    "home" | "search" | "add" | "profile"
  >("home");

  const [searchText, setSearchText] = useState("");
  const [newComment, setNewComment] = useState<Record<number, string>>("");

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: "alex_tech",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900",
      caption: "Exploring new AI vibes ✨ #Vibegram #Tech",
      likes: 124,
      isLiked: false,
      comments: ["Awesome shot!", "Looks super cool 🔥"],
    },
    {
      id: 2,
      user: "nature_lover",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
      caption: "Sunset peace 🌅 #ChillVibes",
      likes: 89,
      isLiked: false,
      comments: ["Where is this spot? 😍"],
    },
    {
      id: 3,
      user: "travel_vibes",
      avatar: "https://i.pravatar.cc/150?img=12",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
      caption: "Beautiful place and beautiful vibes 🌍✨",
      likes: 201,
      isLiked: false,
      comments: ["Amazing!", "I want to visit this place ❤️"],
    },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem("vibegram_user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("vibegram_user");
      }
    }
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem("vibegram_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("vibegram_user");
    setUser(null);
    setActiveTab("home");
  };

  const handleLike = (id: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCommentChange = (postId: number, value: string) => {
    setNewComment((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  const handleAddComment = (postId: number) => {
    if (!user) return;

    const text = newComment[postId]?.trim();

    if (!text) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                `${user.username}: ${text}`,
              ],
            }
          : post
      )
    );

    setNewComment((current) => ({
      ...current,
      [postId]: "",
    }));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Vibegram</h1>
      </header>

      <main style={styles.main}>
        {activeTab === "home" && (
          <div>
            <div style={styles.storyRow}>
              <div style={styles.storyItem}>
                <img
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  alt="Your story"
                  style={styles.storyRing}
                />
                <span>Your story</span>
              </div>

              <div style={styles.storyItem}>
                <img
                  src="https://i.pravatar.cc/150?img=1"
                  alt="Story"
                  style={styles.storyRing}
                />
                <span>rohit_99</span>
              </div>

              <div style={styles.storyItem}>
                <img
                  src="https://i.pravatar.cc/150?img=5"
                  alt="Story"
                  style={styles.storyRing}
                />
                <span>priya_vibe</span>
              </div>

              <div style={styles.storyItem}>
                <img
                  src="https://i.pravatar.cc/150?img=8"
                  alt="Story"
                  style={styles.storyRing}
                />
                <span>rahul_01</span>
              </div>
            </div>

            {posts.map((post) => (
              <article key={post.id} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <img
                    src={post.avatar}
                    alt={post.user}
                    style={styles.postAvatar}
                  />

                  <strong>{post.user}</strong>
                </div>

                <img
                  src={post.image}
                  alt="Post"
                  style={styles.postImage}
                />

                <div style={styles.actionRow}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={styles.iconButton}
                  >
                    {post.isLiked ? "❤️" : "🤍"}
                  </button>

                  <button
                    onClick={() => setActiveTab("search")}
                    style={styles.iconButton}
                  >
                    💬
                  </button>

                  <button style={styles.iconButton}>↗️</button>
                </div>

                <div style={styles.likes}>
                  {post.likes} likes
                </div>

                <div style={styles.caption}>
                  <strong>{post.user}</strong>{" "}
                  {post.caption}
                </div>

                <div style={styles.comments}>
                  {post.comments.map((comment, index) => (
                    <div key={index} style={styles.comment}>
                      {comment}
                    </div>
                  ))}
                </div>

                <div style={styles.commentBox}>
                  <input
                    value={newComment[post.id] || ""}
                    onChange={(event) =>
                      handleCommentChange(
                        post.id,
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleAddComment(post.id);
                      }
                    }}
                    placeholder="Add a comment..."
                    style={styles.commentInput}
                  />

                  <button
                    onClick={() => handleAddComment(post.id)}
                    style={styles.postButton}
                  >
                    Post
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === "search" && (
          <div style={styles.page}>
            <h2>Search</h2>

            <input
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search users or hashtags..."
              style={styles.searchInput}
            />

            <div style={styles.searchResults}>
              {searchText ? (
                <>
                  <div style={styles.userResult}>
                    <img
                      src="https://i.pravatar.cc/150?img=12"
                      alt="User"
                      style={styles.resultAvatar}
                    />
                    <div>
                      <strong>{searchText}</strong>
                      <p style={styles.grayText}>
                        Vibegram user
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p style={styles.grayText}>
                  Search for users, creators and hashtags.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <div style={styles.page}>
            <div style={styles.addIcon}>＋</div>

            <h2>Create New Post</h2>

            <p style={styles.grayText}>
              Upload your photo or video and share it with
              Vibegram.
            </p>

            <button
              style={styles.uploadButton}
              onClick={() =>
                alert("Media upload will be connected soon.")
              }
            >
              📷 Select Media
            </button>

            <div style={styles.infoBox}>
              <p>✨ Add photos</p>
              <p>🎬 Add videos</p>
              <p>📝 Write captions</p>
              <p>❤️ Share with your followers</p>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div style={styles.profile}>
            <img
              src={user.avatar || "https://i.pravatar.cc/150"}
              alt="Profile"
              style={styles.profileAvatar}
            />

            <h2>{user.name || user.username}</h2>

            <p style={styles.username}>
              @{user.username}
            </p>

            <p style={styles.bio}>
              {user.bio || "Vibegram Explorer ✨"}
            </p>

            <div style={styles.stats}>
              <div>
                <strong>{user.postsCount || 0}</strong>
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
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        )}
      </main>

      <nav style={styles.bottomNav}>
        <button
          onClick={() => setActiveTab("home")}
          style={styles.navButton}
        >
          {activeTab === "home" ? "🏠" : "⌂"}
          <small>Home</small>
        </button>

        <button
          onClick={() => setActiveTab("search")}
          style={styles.navButton}
        >
          🔍
          <small>Search</small>
        </button>

        <button
          onClick={() => setActiveTab("add")}
          style={styles.navButton}
        >
          ➕
          <small>Create</small>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          style={styles.navButton}
        >
          👤
          <small>Profile</small>
        </button>
      </nav>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    paddingBottom: "75px",
  },

  header: {
    height: "58px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #262626",
    position: "sticky",
    top: 0,
    backgroundColor: "#000",
    zIndex: 10,
  },

  logo: {
    margin: 0,
    fontSize: "25px",
    fontWeight: 800,
    background:
      "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  main: {
    width: "100%",
    maxWidth: "520px",
    margin: "0 auto",
  },

  storyRow: {
    display: "flex",
    gap: "18px",
    overflowX: "auto",
    padding: "14px 12px",
    borderBottom: "1px solid #262626",
  },

  storyItem: {
    minWidth: "62px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "#bbb",
  },

  storyRing: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e1306c",
    padding: "2px",
  },

  postCard: {
    borderBottom: "1px solid #262626",
    paddingBottom: "15px",
    marginBottom: "10px",
  },

  postHeader: {
    height: "55px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 14px",
  },

  postAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  postImage: {
    display: "block",
    width: "100%",
    maxHeight: "520px",
    objectFit: "cover",
  },

  actionRow: {
    display: "flex",
    gap: "8px",
    padding: "8px 12px 3px",
  },

  iconButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    padding: "3px",
  },

  likes: {
    fontWeight: 700,
    fontSize: "14px",
    padding: "2px 14px",
  },

  caption: {
    fontSize: "14px",
    lineHeight: 1.5,
    padding: "5px 14px",
  },

  comments: {
    padding: "4px 14px",
    color: "#b5b5b5",
    fontSize: "13px",
  },

  comment: {
    marginBottom: "5px",
  },

  commentBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderTop: "1px solid #181818",
  },

  commentInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#fff",
    fontSize: "14px",
  },

  postButton: {
    border: "none",
    background: "transparent",
    color: "#0095f6",
    fontWeight: 700,
    cursor: "pointer",
  },

  page: {
    padding: "25px 18px",
    minHeight: "calc(100vh - 140px)",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #333",
    backgroundColor: "#181818",
    color: "#fff",
    outline: "none",
    fontSize: "15px",
  },

  searchResults: {
    marginTop: "25px",
  },

  userResult: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
  },

  resultAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
  },

  grayText: {
    color: "#999",
  },

  addIcon: {
    fontSize: "60px",
    textAlign: "center",
    marginTop: "30px",
  },

  uploadButton: {
    width: "100%",
    padding: "13px",
    marginTop: "20px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#0095f6",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  },

  infoBox: {
    marginTop: "30px",
    padding: "15px",
    border: "1px solid #292929",
    borderRadius: "12px",
    color: "#ccc",
  },

  profile: {
    textAlign: "center",
    padding: "35px 20px",
  },

  profileAvatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #e1306c",
  },

  username: {
    color: "#999",
    marginTop: "-5px",
  },

  bio: {
    color: "#ddd",
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "25px",
    padding: "18px 0",
    borderTop: "1px solid #292929",
    borderBottom: "1px solid #292929",
  },

  logoutButton: {
    width: "100%",
    marginTop: "25px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#1c1c1c",
    color: "#ff4d5a",
    fontWeight: 700,
    cursor: "pointer",
  },

  bottomNav: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    height: "65px",
    backgroundColor: "#000",
    borderTop: "1px solid #262626",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 100,
  },

  navButton: {
    width: "25%",
    height: "100%",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "21px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
  },
};
