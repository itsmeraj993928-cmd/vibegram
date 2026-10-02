import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  MapPin,
  Calendar,
  Globe,
  Settings,
  Shield,
  Grid,
  Flame,
  Bookmark,
  Edit3,
  Check,
} from 'lucide-react';
import { PostCard } from '../feed/PostCard';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    posts,
    vibes,
    language,
    role,
    setActiveTab,
    setIsSettingsModalOpen,
    setIsEditProfileOpen,
    t,
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'vibes' | 'saved'>('posts');

  const userPosts = posts.filter((p) => p.userId === currentUser.id);
  const userVibes = vibes.filter((v) => v.userId === currentUser.id);
  const savedPosts = posts.filter((p) => p.isSaved);

  return (
    <div className="w-full pb-20 sm:pb-24 animate-in fade-in duration-200">
      {/* Banner & Avatar Header */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 mb-6">
        <div className="h-32 sm:h-44 relative bg-slate-900">
          <img
            src={currentUser.banner}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="px-4 sm:px-6 pb-5 pt-0 -mt-12 sm:-mt-14 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-3.5">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl object-cover ring-4 ring-slate-950 shadow-2xl"
                />
                {currentUser.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 text-amber-400 shadow-md ring-2 ring-slate-950"
                    title={t('verifiedCreator')}
                  >
                    <Sparkles className="w-4 h-4 fill-amber-400" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black text-white">
                    {language === 'hi' && currentUser.hindiName
                      ? currentUser.hindiName
                      : currentUser.name}
                  </h1>
                  {currentUser.role === 'superadmin' && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.5 rounded">
                      SUPER ADMIN
                    </span>
                  )}
                  {currentUser.role === 'moderator' && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                      MODERATOR
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">@{currentUser.username}</p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t('editProfile')}</span>
              </button>

              {(currentUser.role === 'superadmin' || currentUser.role === 'moderator') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-all shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('navAdmin')}</span>
                </button>
              )}

              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors"
                title={t('navSettings')}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="mt-4 space-y-2">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {language === 'hi' && currentUser.hindiBio
                ? currentUser.hindiBio
                : currentUser.bio}
            </p>

            <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentUser.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined {currentUser.joinedDate}</span>
              </div>
              {currentUser.website && (
                <a
                  href={currentUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-rose-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentUser.website.replace('https://', '')}</span>
                </a>
              )}
            </div>
          </div>

          {/* Stats Bar (Followers, Following, Posts, Vibes) */}
          <div className="grid grid-cols-4 gap-2 mt-5 p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
            <div>
              <p className="text-sm sm:text-base font-black text-white">
                {currentUser.postsCount}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('posts')}</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">
                {currentUser.vibesCount}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('vibesTab')}</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">
                {currentUser.followersCount.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('followers')}</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">
                {currentUser.followingCount}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('following')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs (Grid Posts, Vibes Reels, Saved) */}
      <div className="flex items-center justify-around border-b border-white/10 mb-4 bg-slate-900/60 rounded-2xl p-1">
        <button
          onClick={() => setActiveProfileTab('posts')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeProfileTab === 'posts'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{t('posts')}</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('vibes')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeProfileTab === 'vibes'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>{t('vibesTab')}</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('saved')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeProfileTab === 'saved'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span>{t('savedTab')}</span>
        </button>
      </div>

      {/* Tab Content Stream */}
      {activeProfileTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="glass-panel rounded-2xl p-8 text-center border border-white/10">
              <p className="text-sm font-semibold text-white mb-1">No posts shared yet</p>
              <p className="text-xs text-slate-400">Share your first photograph or experience!</p>
            </div>
          )}
        </div>
      )}

      {activeProfileTab === 'vibes' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userVibes.length > 0 ? (
            userVibes.map((vibe) => (
              <div
                key={vibe.id}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden glass-panel border border-white/10 group cursor-pointer"
              >
                <img
                  src={vibe.thumbnailUrl}
                  alt={vibe.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                  <p className="text-xs font-semibold line-clamp-1">{vibe.caption}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                    <span>❤️ {vibe.likesCount.toLocaleString('en-IN')}</span>
                    <span>👁️ {vibe.viewsCount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full glass-panel rounded-2xl p-8 text-center border border-white/10">
              <p className="text-sm font-semibold text-white mb-1">No vertical vibes uploaded</p>
              <p className="text-xs text-slate-400">Capture short video moments across Bharat.</p>
            </div>
          )}
        </div>
      )}

      {activeProfileTab === 'saved' && (
        <div className="space-y-4">
          {savedPosts.length > 0 ? (
            savedPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="glass-panel rounded-2xl p-8 text-center border border-white/10">
              <p className="text-sm font-semibold text-white mb-1">No saved posts</p>
              <p className="text-xs text-slate-400">
                Tap the bookmark icon on any post to save it for later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
