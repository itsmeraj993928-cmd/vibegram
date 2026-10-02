import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Flame, Sparkles, TrendingUp, MapPin, Hash, UserPlus, Check } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { posts, users, currentUser, toggleFollowUser, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const trendingTopics = [
    { tag: '#ChaiPeCharcha', posts: '48.2K posts', category: 'Culture' },
    { tag: '#MumbaiMonsoon', posts: '124K posts', category: 'City' },
    { tag: '#TechBharat', posts: '32.1K posts', category: 'Tech' },
    { tag: '#CricketFever', posts: '89.4K posts', category: 'Sports' },
    { tag: '#IncredibleIndia', posts: '210K posts', category: 'Travel' },
    { tag: '#DesiFoodies', posts: '76.8K posts', category: 'Food' },
  ];

  const categories = ['All', 'Travel', 'Food', 'Tech', 'Music', 'Cricket', 'Culture'];

  const filteredPosts = posts.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inCaption = p.caption.toLowerCase().includes(q);
      const inLocation = p.location.toLowerCase().includes(q);
      const inUser = p.user.name.toLowerCase().includes(q) || p.user.username.toLowerCase().includes(q);
      const inHashtags = p.hashtags.some((h) => h.toLowerCase().includes(q));
      return inCaption || inLocation || inUser || inHashtags;
    }
    if (activeCategory !== 'All') {
      if (activeCategory === 'Food') return p.communityId === 'comm_food' || p.caption.includes('food') || p.caption.includes('chai');
      if (activeCategory === 'Travel') return p.communityId === 'comm_travel' || p.caption.includes('Kashi') || p.caption.includes('travel');
      if (activeCategory === 'Tech') return p.communityId === 'comm_tech' || p.caption.includes('tech');
      if (activeCategory === 'Music') return p.communityId === 'comm_music' || p.caption.includes('music');
      if (activeCategory === 'Cricket') return p.communityId === 'comm_cricket' || p.caption.includes('cricket');
    }
    return true;
  });

  const matchingUsers = users.filter((u) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.city.toLowerCase().includes(q);
  });

  return (
    <div className="w-full pb-20 sm:pb-24">
      {/* Search Input Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 text-sm shadow-md transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Matching Users when searching */}
      {searchQuery && matchingUsers.length > 0 && (
        <div className="mb-6 glass-panel rounded-2xl p-4 border border-white/10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Matching Creators
          </h3>
          <div className="space-y-3">
            {matchingUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-rose-500"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white truncate flex items-center gap-1">
                      {u.name}
                      {u.isVerified && <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />}
                    </p>
                    <p className="text-xs text-slate-400 truncate">@{u.username} · {u.location}</p>
                  </div>
                </div>
                {u.id !== currentUser.id && (
                  <button
                    onClick={() => toggleFollowUser(u.id)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                  >
                    {t('follow')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending in India Hashtags Carousel */}
      {!searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{t('trendingInIndia')}</span>
            </h3>
            <span className="text-[11px] text-rose-400 font-medium cursor-pointer">Live Updates</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {trendingTopics.map((item) => (
              <div
                key={item.tag}
                onClick={() => setSearchQuery(item.tag)}
                className="glass-panel p-3 rounded-xl border border-white/10 hover:border-rose-500/40 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-white truncate">{item.tag}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.posts}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Desi Creators Horizontal Reel */}
      {!searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('popularCreators')}</span>
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {users.slice(1, 6).map((creator) => (
              <div
                key={creator.id}
                className="min-w-[150px] sm:min-w-[160px] glass-panel p-3 rounded-2xl border border-white/10 flex flex-col items-center text-center shrink-0"
              >
                <div className="relative mb-2">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/40"
                  />
                  {creator.isVerified && (
                    <div className="absolute bottom-0 right-0 p-0.5 rounded-full bg-slate-950 text-amber-400">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                  )}
                </div>

                <p className="font-bold text-xs text-white truncate max-w-[130px]">{creator.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px] mb-2">{creator.city}</p>

                <button
                  onClick={() => toggleFollowUser(creator.id)}
                  className="w-full py-1 px-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  {t('follow')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Visual Media Explore Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-square rounded-xl overflow-hidden glass-panel border border-white/10 cursor-pointer"
          >
            <img
              src={post.mediaUrls[0]}
              alt={post.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
              <p className="text-xs font-semibold line-clamp-1">{post.caption}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-1">
                <span>❤️ {post.likesCount.toLocaleString('en-IN')}</span>
                <span>💬 {post.commentsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
