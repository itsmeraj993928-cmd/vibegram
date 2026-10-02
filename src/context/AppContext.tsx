import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Post,
  Vibe,
  Story,
  Community,
  NotificationItem,
  Conversation,
  ModerationReport,
  AppSettings,
} from '../types';
import {
  mockUsers,
  mockPosts,
  mockVibes,
  mockStories,
  mockCommunities,
  mockNotifications,
  mockConversations,
  mockReports,
} from '../data/mockData';
import { translations, TranslationKey } from '../i18n/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  users: User[];
  role: UserRole;
  language: 'en' | 'hi';
  lowDataMode: boolean;
  dataSavedMB: number;
  activeTab: string;
  posts: Post[];
  vibes: Vibe[];
  stories: Story[];
  communities: Community[];
  notifications: NotificationItem[];
  conversations: Conversation[];
  reports: ModerationReport[];
  blockedUserIds: string[];
  settings: AppSettings;
  // Modals
  isCreateModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isAndroidApkModalOpen: boolean;
  isEditProfileOpen: boolean;
  shareModalData: Post | null;
  reportModalData: { id: string; type: 'post' | 'user' | 'comment'; name: string } | null;
  selectedCommunity: Community | null;
  activeConversation: Conversation | null;

  // Actions
  setActiveTab: (tab: string) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setLowDataMode: (enabled: boolean) => void;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updated: Partial<User>) => void;
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  replyComment: (postId: string, commentId: string, text: string) => void;
  likeVibe: (vibeId: string) => void;
  addVibeComment: (vibeId: string, text: string) => void;
  toggleFollowUser: (targetUserId: string) => void;
  toggleJoinCommunity: (communityId: string) => void;
  createNewPost: (postData: { caption: string; mediaUrl: string; location: string; hashtags: string[]; communityId?: string }) => void;
  createNewVibe: (vibeData: { caption: string; videoUrl: string; audioTitle: string; hashtags: string[] }) => void;
  openShareModal: (post: Post) => void;
  closeShareModal: () => void;
  openReportModal: (id: string, type: 'post' | 'user' | 'comment', name: string) => void;
  closeReportModal: () => void;
  submitReport: (reason: ModerationReport['reason']) => void;
  resolveReportAction: (reportId: string, action: ModerationReport['actionTaken']) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsSettingsModalOpen: (open: boolean) => void;
  setIsAndroidApkModalOpen: (open: boolean) => void;
  setIsEditProfileOpen: (open: boolean) => void;
  setSelectedCommunity: (comm: Community | null) => void;
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (convId: string, text: string, isAudio?: boolean) => void;
  markAllNotificationsRead: () => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  // Default to Super Admin / Owner (Rajesh Mehta) so user has complete control over app & dashboard
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [role, setRole] = useState<UserRole>('superadmin');
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');
  const [lowDataMode, setLowDataModeState] = useState<boolean>(false);
  const [dataSavedMB, setDataSavedMB] = useState<number>(48.6);
  const [activeTab, setActiveTab] = useState<string>('feed');

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [vibes, setVibes] = useState<Vibe[]>(mockVibes);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [reports, setReports] = useState<ModerationReport[]>(mockReports);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAndroidApkModalOpen, setIsAndroidApkModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<Post | null>(null);
  const [reportModalData, setReportModalData] = useState<{ id: string; type: 'post' | 'user' | 'comment'; name: string } | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    lowDataMode: false,
    isPrivateAccount: false,
    allowDMs: 'everyone',
    pushNotifications: true,
    autoPlayVibes: true,
    soundOnByDefault: false,
    theme: 'dark',
  });

  // Track low data savings
  useEffect(() => {
    if (lowDataMode) {
      const interval = setInterval(() => {
        setDataSavedMB((prev) => +(prev + 0.4).toFixed(1));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [lowDataMode]);

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    setSettings((s) => ({ ...s, language: lang }));
  };

  const setLowDataMode = (enabled: boolean) => {
    setLowDataModeState(enabled);
    setSettings((s) => ({ ...s, lowDataMode: enabled, autoPlayVibes: !enabled }));
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setRole(user.role);
    }
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
  };

  const updateCurrentUserProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => {
      const neu = { ...prev, ...updated };
      setUsers((list) => list.map((u) => (u.id === neu.id ? neu : u)));
      return neu;
    });
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const count = isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
          if (isLiked) {
            confetti({
              particleCount: 25,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#FF3366', '#FF5E3A', '#FFAE19'],
            });
          }
          return { ...p, isLiked, likesCount: count };
        }
        return p;
      })
    );
  };

  const savePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likes: 0,
      replies: [],
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [newComment, ...p.comments],
            }
          : p
      )
    );
  };

  const replyComment = (postId: string, commentId: string, text: string) => {
    if (!text.trim()) return;
    const newReply = {
      id: `cr_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likes: 0,
    };
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: p.comments.map((c) =>
              c.id === commentId
                ? { ...c, replies: [...(c.replies || []), newReply] }
                : c
            ),
          };
        }
        return p;
      })
    );
  };

  const likeVibe = (vibeId: string) => {
    setVibes((prev) =>
      prev.map((v) => {
        if (v.id === vibeId) {
          const isLiked = !v.isLiked;
          const count = isLiked ? v.likesCount + 1 : Math.max(0, v.likesCount - 1);
          if (isLiked) {
            confetti({
              particleCount: 30,
              spread: 70,
              origin: { y: 0.5 },
              colors: ['#FF3366', '#FF5E3A', '#A855F7'],
            });
          }
          return { ...v, isLiked, likesCount: count };
        }
        return v;
      })
    );
  };

  const addVibeComment = (vibeId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `vc_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likes: 0,
    };
    setVibes((prev) =>
      prev.map((v) =>
        v.id === vibeId
          ? {
              ...v,
              commentsCount: v.commentsCount + 1,
              comments: [newComment, ...(v.comments || [])],
            }
          : v
      )
    );
  };

  const toggleFollowUser = (targetUserId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUserId) {
          const isCurrentlyFollowing = currentUser.followingCount > 0 && targetUserId === 'user_creator'; // dynamic check
          const updatedFollowers = u.followersCount + (isCurrentlyFollowing ? -1 : 1);
          return { ...u, followersCount: updatedFollowers };
        }
        return u;
      })
    );
    setCurrentUser((prev) => ({
      ...prev,
      followingCount: prev.followingCount + 1,
    }));
  };

  const toggleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const isJoined = !c.isJoined;
          return {
            ...c,
            isJoined,
            membersCount: isJoined ? c.membersCount + 1 : c.membersCount - 1,
          };
        }
        return c;
      })
    );
  };

  const createNewPost = (postData: {
    caption: string;
    mediaUrl: string;
    location: string;
    hashtags: string[];
    communityId?: string;
  }) => {
    const community = communities.find((c) => c.id === postData.communityId);
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      type: 'photo',
      mediaUrls: [postData.mediaUrl || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&auto=format&fit=crop&q=80'],
      caption: postData.caption,
      location: postData.location || `${currentUser.city}, India`,
      hashtags: postData.hashtags.length > 0 ? postData.hashtags : ['#Vibegram', '#DesiVibe'],
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      timestamp: 'Just now',
      isLiked: true,
      isSaved: false,
      comments: [],
      communityId: postData.communityId,
      communityName: community?.name,
    };
    setPosts([newPost, ...posts]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setIsCreateModalOpen(false);
  };

  const createNewVibe = (vibeData: {
    caption: string;
    videoUrl: string;
    audioTitle: string;
    hashtags: string[];
  }) => {
    const newVibe: Vibe = {
      id: `vibe_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      videoUrl: vibeData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: currentUser.avatar,
      caption: vibeData.caption,
      audioTrack: {
        title: vibeData.audioTitle || 'Original Vibe Sound',
        artist: currentUser.name,
      },
      hashtags: vibeData.hashtags.length > 0 ? vibeData.hashtags : ['#DesiReels', '#Vibegram'],
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      watchTimeHours: 0.1,
      isLiked: true,
      isSaved: false,
      comments: [],
    };
    setVibes([newVibe, ...vibes]);
    setCurrentUser((prev) => ({ ...prev, vibesCount: prev.vibesCount + 1 }));
    setIsCreateModalOpen(false);
  };

  const openShareModal = (post: Post) => {
    setShareModalData(post);
  };

  const closeShareModal = () => {
    setShareModalData(null);
  };

  const openReportModal = (id: string, type: 'post' | 'user' | 'comment', name: string) => {
    setReportModalData({ id, type, name });
  };

  const closeReportModal = () => {
    setReportModalData(null);
  };

  const submitReport = (reason: ModerationReport['reason']) => {
    if (!reportModalData) return;
    const newReport: ModerationReport = {
      id: `rep_${Date.now()}`,
      targetType: reportModalData.type,
      targetId: reportModalData.id,
      reportedEntityName: reportModalData.name,
      reportedBy: currentUser.username,
      reason,
      timestamp: 'Just now',
      status: 'pending',
    };
    setReports([newReport, ...reports]);
    closeReportModal();
  };

  const resolveReportAction = (
    reportId: string,
    action: ModerationReport['actionTaken']
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: action === 'dismissed' ? 'dismissed' : 'resolved',
            actionTaken: action,
          };
        }
        return r;
      })
    );

    // If content removed, delete from feed
    const target = reports.find((r) => r.id === reportId);
    if (target && action === 'content_removed') {
      if (target.targetType === 'post') {
        setPosts((p) => p.filter((x) => x.id !== target.targetId));
      } else if (target.targetType === 'user') {
        setBlockedUserIds((b) => [...b, target.targetId]);
      }
    }
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => [...new Set([...prev, userId])]);
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  const sendMessage = (convId: string, text: string, isAudio = false) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: 'partner',
      text: isAudio ? 'Voice Note (0:14)' : text,
      timestamp: 'Just now',
      isAudio,
      audioDuration: isAudio ? '0:14' : undefined,
      status: 'sent' as const,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: newMessage,
          };
        }
        return c;
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        role,
        language,
        lowDataMode,
        dataSavedMB,
        activeTab,
        posts,
        vibes,
        stories,
        communities,
        notifications,
        conversations,
        reports,
        blockedUserIds,
        settings,
        isCreateModalOpen,
        isSettingsModalOpen,
        isAndroidApkModalOpen,
        isEditProfileOpen,
        shareModalData,
        reportModalData,
        selectedCommunity,
        activeConversation,
        setActiveTab,
        setLanguage,
        setLowDataMode,
        switchUser,
        switchRole,
        updateCurrentUserProfile,
        likePost,
        savePost,
        addComment,
        replyComment,
        likeVibe,
        addVibeComment,
        toggleFollowUser,
        toggleJoinCommunity,
        createNewPost,
        createNewVibe,
        openShareModal,
        closeShareModal,
        openReportModal,
        closeReportModal,
        submitReport,
        resolveReportAction,
        blockUser,
        unblockUser,
        setIsCreateModalOpen,
        setIsSettingsModalOpen,
        setIsAndroidApkModalOpen,
        setIsEditProfileOpen,
        setSelectedCommunity,
        setActiveConversation,
        sendMessage,
        markAllNotificationsRead,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
