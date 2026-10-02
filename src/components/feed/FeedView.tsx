import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostCard } from './PostCard';
import { Sparkles, TrendingUp, Users, MapPin, Plus, Flame } from 'lucide-react';
import { Story } from '../../types';

export const FeedView: React.FC = () => {
  const { posts, stories, currentUser, blockedUserIds, setActiveTab, setIsCreateModalOpen, t } = useApp();
  const [activeFilter, setActiveFilter] = useState<'for_you' | 'following' | 'trending' | 'cities'>('for_you');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  const indianCities = ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Jaipur', 'Kolkata', 'Hyderabad', 'Pune'];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Hide blocked users
    if (blockedUserIds.includes(post.userId)) return false;

    if (activeFilter === 'following') {
      return post.userId === 'user_creator' || post.userId === 'user_priya'; // demo following
    }
    if (activeFilter === 'trending') {
      return post.likesCount > 10000;
    }
    if (activeFilter === 'cities') {
      if (selectedCity === 'All') return true;
      return post.location.toLowerCase().includes(selectedCity.toLowerCase()) || post.user.city.toLowerCase() === selectedCity.toLowerCase();
    }
    return true;
  });

  return (
    <div className="w-full pb-20 sm:pb-24">
      {/* 24-hr Vibes / Stories Bar */}
      <div className="mb-4 sm:mb-6 overflow-x-auto no-scrollbar py-2 px-1">
        <div className="flex items-center gap-3">
          {/* Current User Add Story */}
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-15 h-15 rounded-full p-[2px] bg-slate-800 group-hover:bg-slate-700 transition-colors">
              <img
                src={currentUser.avatar}
                alt="My Story"
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center ring-2 ring-slate-950">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] text-slate-300 max-w-[64px] truncate">
              Your Vibe
            </span>
          </div>

          {/* Active Stories */}
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setViewingStory(story)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
            >
              <div
                className={`w-15 h-15 rounded-full p-[2.5px] transition-transform group-hover:scale-105 ${
                  story.isViewed
                    ? 'bg-slate-700'
                    : 'bg-gradient-to-tr from-rose-500 via-orange-400 to-amber-300 shadow-md shadow-rose-500/20'
                }`}
              >
                <div className="w-full h-full rounded-full p-[1.5px] bg-slate-950">
                  <img
                    src={story.user.avatar}
                    alt={story.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] text-slate-300 max-w-[64px] truncate">
                {story.user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Filter Segmented Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-white/10 mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveFilter('for_you')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeFilter === 'for_you'
              ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('tabForYou')}</span>
        </button>

        <button
          onClick={() => setActiveFilter('following')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeFilter === 'following'
              ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t('tabFollowing')}</span>
        </button>

        <button
          onClick={() => setActiveFilter('trending')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeFilter === 'trending'
              ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>{t('tabTrendingIndia')}</span>
        </button>

        <button
          onClick={() => setActiveFilter('cities')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeFilter === 'cities'
              ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t('tabNearby')}</span>
        </button>
      </div>

      {/* City Sub-selector if cities filter active */}
      {activeFilter === 'cities' && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {indianCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCity === city
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Post Cards Feed Stream */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="glass-panel rounded-2xl p-8 text-center border border-white/10">
            <p className="text-sm font-semibold text-white mb-1">No posts found in this feed</p>
            <p className="text-xs text-slate-400 mb-4">
              Be the first creator to share a moment or explore other Indian cities.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md"
            >
              {t('createPostTitle')}
            </button>
          </div>
        )}
      </div>

      {/* Story View Modal */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden glass-panel border border-white/20 aspect-[9/16] flex flex-col justify-between">
            {/* Story Top Bar */}
            <div className="p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-2">
                <img
                  src={viewingStory.user.avatar}
                  alt={viewingStory.user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500"
                />
                <div>
                  <p className="text-xs font-bold text-white">{viewingStory.user.name}</p>
                  <p className="text-[10px] text-slate-300">{viewingStory.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingStory(null)}
                className="text-white hover:text-rose-400 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Story Background Media */}
            <img
              src={viewingStory.mediaUrl}
              alt="Story"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Story Caption */}
            {viewingStory.caption && (
              <div className="p-4 bg-gradient-to-t from-black/80 to-transparent text-white z-10">
                <p className="text-xs sm:text-sm font-medium">{viewingStory.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
