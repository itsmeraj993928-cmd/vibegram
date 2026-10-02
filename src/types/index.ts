export type UserRole = 'user' | 'creator' | 'moderator' | 'superadmin';

export interface User {
  id: string;
  username: string;
  name: string;
  hindiName?: string;
  avatar: string;
  banner: string;
  bio: string;
  hindiBio?: string;
  location: string; // e.g. "Mumbai, Maharashtra"
  city: string;
  state: string;
  isVerified: boolean;
  role: UserRole;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  vibesCount: number;
  website?: string;
  joinedDate: string;
  isPrivate?: boolean;
}

export interface CommentReply {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: CommentReply[];
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'photo' | 'carousel' | 'video';
  mediaUrls: string[];
  caption: string;
  hindiCaption?: string;
  location: string;
  audioTrack?: {
    title: string;
    artist: string;
  };
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  timestamp: string;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  communityId?: string;
  communityName?: string;
}

export interface Vibe {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTrack: {
    title: string;
    artist: string;
  };
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  watchTimeHours: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  type: 'image' | 'video';
  timestamp: string;
  caption?: string;
  isViewed: boolean;
}

export interface Community {
  id: string;
  name: string;
  hindiName: string;
  slug: string;
  avatar: string;
  banner: string;
  description: string;
  hindiDescription?: string;
  membersCount: number;
  category: 'Food' | 'Tech' | 'Cricket' | 'Cinema' | 'Music' | 'Travel' | 'Culture' | 'Careers';
  isJoined?: boolean;
  rules: string[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'community';
  actor: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  targetText?: string;
  mediaPreview?: string;
  timestamp: string;
  isRead: boolean;
  linkId?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  imageUrl?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: DirectMessage;
  unreadCount: number;
  isTyping?: boolean;
}

export interface ModerationReport {
  id: string;
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  reportedEntityName: string;
  reportedEntityPreview?: string;
  reportedBy: string;
  reason: 'Hate Speech' | 'Harassment' | 'Misinformation' | 'Spam' | 'Copyright' | 'Inappropriate Media';
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
  actionTaken?: 'warned' | 'content_removed' | 'user_banned' | 'dismissed';
}

export interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: 'today' | 'this_week' | 'this_month';
}

export interface AppSettings {
  language: 'en' | 'hi';
  lowDataMode: boolean;
  isPrivateAccount: boolean;
  allowDMs: 'everyone' | 'following' | 'none';
  pushNotifications: boolean;
  autoPlayVibes: boolean;
  soundOnByDefault: boolean;
  theme: 'dark' | 'light';
}
