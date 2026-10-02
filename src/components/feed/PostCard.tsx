import React, { useState } from 'react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  MapPin,
  MoreHorizontal,
  Send,
  Sparkles,
  Check,
  UserPlus,
  Flag,
  UserX,
  Volume2,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    currentUser,
    language,
    lowDataMode,
    likePost,
    savePost,
    addComment,
    toggleFollowUser,
    openShareModal,
    openReportModal,
    blockUser,
    t,
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const isAuthor = currentUser.id === post.userId;
  const isFollowing = currentUser.followingCount > 0 && post.user.role === 'creator';

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      likePost(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  const quickEmojis = ['🔥', '❤️', '🇮🇳', '🙌', '☕', '✨'];

  return (
    <article className="glass-panel rounded-2xl border border-white/10 overflow-hidden mb-4 sm:mb-6 shadow-xl transition-all">
      {/* Header */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-orange-400 to-amber-300">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-white truncate hover:underline cursor-pointer">
                {language === 'hi' && post.user.hindiName ? post.user.hindiName : post.user.name}
              </span>
              {post.user.isVerified && (
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              {post.communityName && (
                <span className="text-[10px] text-rose-400 bg-rose-950/60 border border-rose-500/20 px-1.5 py-0.5 rounded-full">
                  in {post.communityName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">{post.location}</span>
              <span>·</span>
              <span className="shrink-0">{post.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-1.5">
          {!isAuthor && (
            <button
              onClick={() => toggleFollowUser(post.userId)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors"
            >
              {isFollowing ? t('unfollow') : t('follow')}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              aria-label="Post options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-900 border border-white/10 shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    openShareModal(post);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  {t('share')}
                </button>
                <button
                  onClick={() => {
                    openReportModal(post.id, 'post', `Post by ${post.user.name}`);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  {t('reportPost')}
                </button>
                {!isAuthor && (
                  <button
                    onClick={() => {
                      blockUser(post.userId);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <UserX className="w-3.5 h-3.5 text-rose-400" />
                    {t('blockUser')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Content with Double-Tap detection */}
      <div
        className="relative bg-slate-950 aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.mediaUrls[activeImageIndex]}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
          loading={lowDataMode ? 'lazy' : 'eager'}
        />

        {/* Heart Burst Animation on Double Tap */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-200">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-pulse" />
          </div>
        )}

        {/* Multiple Images Carousel Dots */}
        {post.mediaUrls.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {post.mediaUrls.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeImageIndex === i
                    ? 'w-5 bg-white shadow'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Low Data Mode watermark pill */}
        {lowDataMode && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-sm border border-emerald-500/30 text-[10px] text-emerald-400 flex items-center gap-1">
            <span>Low-Data Saved</span>
          </div>
        )}
      </div>

      {/* Audio Track Badge if attached */}
      {post.audioTrack && (
        <div className="px-3.5 py-1.5 bg-slate-900/50 border-t border-b border-white/5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">
              <strong>{post.audioTrack.title}</strong> · {post.audioTrack.artist}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0">
            Original Desi Track
          </span>
        </div>
      )}

      {/* Action Row */}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={() => likePost(post.id)}
              className={`flex items-center gap-1.5 transition-transform active:scale-125 ${
                post.isLiked ? 'text-rose-500' : 'text-slate-300 hover:text-white'
              }`}
              aria-label={t('like')}
            >
              <Heart
                className={`w-6 h-6 ${post.isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`}
              />
              <span className="text-xs font-semibold">
                {post.likesCount.toLocaleString('en-IN')}
              </span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              aria-label={t('comment')}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-semibold">
                {post.commentsCount.toLocaleString('en-IN')}
              </span>
            </button>

            {/* Share to WhatsApp & Vibegram */}
            <button
              onClick={() => openShareModal(post)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              aria-label={t('share')}
            >
              <Share2 className="w-6 h-6" />
              <span className="text-xs font-semibold">
                {post.sharesCount.toLocaleString('en-IN')}
              </span>
            </button>
          </div>

          {/* Bookmark / Save */}
          <button
            onClick={() => savePost(post.id)}
            className={`transition-colors ${
              post.isSaved ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-white'
            }`}
            aria-label={t('save')}
          >
            <Bookmark
              className={`w-6 h-6 ${post.isSaved ? 'fill-amber-400 stroke-amber-400' : ''}`}
            />
          </button>
        </div>

        {/* Likes Count & View Count (Quiet typography) */}
        <div className="text-xs font-semibold text-white mb-1.5">
          {post.likesCount.toLocaleString('en-IN')} {t('likes')} ·{' '}
          <span className="text-slate-400 font-normal">
            {post.viewsCount.toLocaleString('en-IN')} {t('views')}
          </span>
        </div>

        {/* Caption */}
        <div className="text-xs sm:text-sm text-slate-200 mb-2 leading-relaxed">
          <span className="font-bold text-white mr-2">
            {language === 'hi' && post.user.hindiName ? post.user.hindiName : post.user.name}
          </span>
          <span>
            {language === 'hi' && post.hindiCaption ? post.hindiCaption : post.caption}
          </span>
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {post.hashtags.map((tag, i) => (
              <span
                key={i}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* View all comments toggle */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-slate-400 hover:text-slate-300 block mb-2"
          >
            {showComments
              ? 'Hide comments'
              : `${t('viewAllComments')} (${post.comments.length})`}
          </button>
        )}

        {/* Inline Comments Drawer */}
        {showComments && (
          <div className="space-y-2 pt-2 border-t border-white/10 mb-3 max-h-56 overflow-y-auto pr-1">
            {post.comments.map((comm) => (
              <div key={comm.id} className="text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <img
                    src={comm.avatar}
                    alt={comm.username}
                    className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white mr-1.5">@{comm.username}</span>
                    <span>{comm.text}</span>
                    <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-400">
                      <span>{comm.timestamp}</span>
                      <span>{comm.likes} likes</span>
                      <button
                        onClick={() => setCommentText(`@${comm.username} `)}
                        className="hover:underline text-rose-400"
                      >
                        {t('reply')}
                      </button>
                    </div>

                    {/* Replies */}
                    {comm.replies && comm.replies.length > 0 && (
                      <div className="mt-1 pl-3 border-l border-white/10 space-y-1">
                        {comm.replies.map((rep) => (
                          <div key={rep.id} className="flex items-start gap-1.5 text-[11px]">
                            <span className="font-bold text-white">@{rep.username}</span>
                            <span>{rep.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Emojis strip */}
        <div className="flex items-center gap-2 mb-2 pt-1 overflow-x-auto no-scrollbar">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setCommentText((prev) => prev + emoji)}
              className="text-sm px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('addCommentPlaceholder')}
            className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl transition-all"
            aria-label={t('postComment')}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </article>
  );
};
