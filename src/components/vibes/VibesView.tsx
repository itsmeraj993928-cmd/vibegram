import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Send,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const VibesView: React.FC = () => {
  const {
    vibes,
    currentUser,
    lowDataMode,
    likeVibe,
    addVibeComment,
    toggleFollowUser,
    openShareModal,
    t,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVibe = vibes[currentIndex] || vibes[0];

  useEffect(() => {
    if (lowDataMode) {
      // In low data mode, pause auto-play to conserve Indian mobile bandwidth
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [currentIndex, lowDataMode]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < vibes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addVibeComment(currentVibe.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] max-h-[840px] rounded-3xl overflow-hidden glass-panel border border-white/10 flex items-center justify-center bg-black select-none">
      {/* Video Content */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={currentVibe.videoUrl}
          poster={currentVibe.thumbnailUrl}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
        />

        {/* Play/Pause Center Indicator */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white z-20 hover:scale-110 transition-transform"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 fill-white ml-1" />
          </button>
        )}

        {/* Low Data Mode Warning Ribbon */}
        {lowDataMode && !isPlaying && (
          <div className="absolute top-4 left-4 right-4 z-20 px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
            <span>{t('lowDataVideoPaused')}</span>
            <button
              onClick={togglePlay}
              className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[11px]"
            >
              Stream
            </button>
          </div>
        )}

        {/* Mute / Unmute Button in Top Right */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/20 hover:bg-black/70 transition-colors"
          title={isMuted ? t('tapToUnmute') : t('tapToMute')}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Vertical Reel Steppers (for mouse / non-touch navigation) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2">
          <button
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white disabled:opacity-30 border border-white/10"
            title="Previous Vibe"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            disabled={currentIndex === vibes.length - 1}
            onClick={handleNext}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white disabled:opacity-30 border border-white/10"
            title="Next Vibe"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side Social Floating Stack */}
        <div className="absolute bottom-16 right-3 sm:right-4 z-20 flex flex-col items-center gap-4">
          {/* Like */}
          <button
            onClick={() => likeVibe(currentVibe.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform ${
                currentVibe.isLiked ? 'text-rose-500 bg-rose-950/40 border-rose-500/30' : 'text-white'
              }`}
            >
              <Heart
                className={`w-6 h-6 ${currentVibe.isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`}
              />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentVibe.likesCount.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentVibe.commentsCount.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() =>
              openShareModal({
                ...currentVibe,
                type: 'video',
                mediaUrls: [currentVibe.thumbnailUrl],
                location: currentVibe.user.location,
                timestamp: 'Recently',
              })
            }
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentVibe.sharesCount.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Music Audio Disc with Spinning Animation */}
          <div className="pt-2">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-amber-400 animate-disc">
              <img
                src={currentVibe.user.avatar}
                alt="Audio cover"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Metadata Overlay */}
        <div className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10 text-white">
          {/* Creator Details */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={currentVibe.user.avatar}
              alt={currentVibe.user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-white truncate">
                  {currentVibe.user.name}
                </span>
                {currentVibe.user.isVerified && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-300">@{currentVibe.user.username}</p>
            </div>

            {currentUser.id !== currentVibe.userId && (
              <button
                onClick={() => toggleFollowUser(currentVibe.userId)}
                className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                {t('follow')}
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 mb-2">
            {currentVibe.caption}
          </p>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {currentVibe.hashtags.map((h, i) => (
              <span key={i} className="text-xs font-medium text-rose-300">
                {h}
              </span>
            ))}
          </div>

          {/* Audio Track marquee ticker */}
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full w-fit max-w-[280px]">
            <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">
              {currentVibe.audioTrack.title} · {currentVibe.audioTrack.artist}
            </span>
          </div>
        </div>
      </div>

      {/* Slide-Up Comments Drawer */}
      {showComments && (
        <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-30 p-4 rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{t('comments')}</span>
              <span className="text-xs text-slate-400">({currentVibe.comments.length})</span>
            </h4>
            <button
              onClick={() => setShowComments(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {currentVibe.comments.length > 0 ? (
              currentVibe.comments.map((comm) => (
                <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comm.avatar}
                    alt={comm.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <span className="font-bold text-white mr-1.5">@{comm.username}</span>
                    <span className="text-slate-300">{comm.text}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{comm.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-6">
                No comments yet. Share your vibe!
              </p>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Drop a thought (Hinglish/English)..."
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
