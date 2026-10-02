import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Community } from '../../types';
import { Users, Plus, ShieldCheck, ArrowRight, Sparkles, Check, MessageSquare } from 'lucide-react';
import { PostCard } from '../feed/PostCard';

export const CommunitiesView: React.FC = () => {
  const {
    communities,
    posts,
    language,
    selectedCommunity,
    setSelectedCommunity,
    toggleJoinCommunity,
    setIsCreateModalOpen,
    t,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Food', 'Tech', 'Cricket', 'Cinema', 'Music', 'Travel'];

  const filteredCommunities = communities.filter((c) => {
    if (activeCategory === 'All') return true;
    return c.category === activeCategory;
  });

  // If viewing a single community Adda:
  if (selectedCommunity) {
    const communityPosts = posts.filter((p) => p.communityId === selectedCommunity.id);

    return (
      <div className="w-full pb-20 sm:pb-24 animate-in fade-in duration-200">
        {/* Back navigation */}
        <button
          onClick={() => setSelectedCommunity(null)}
          className="mb-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          ← Back to All Addas
        </button>

        {/* Community Hero Header */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 mb-6">
          <div className="h-36 sm:h-48 relative">
            <img
              src={selectedCommunity.banner}
              alt={selectedCommunity.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <div className="px-5 pb-5 pt-0 -mt-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-3.5">
                <img
                  src={selectedCommunity.avatar}
                  alt={selectedCommunity.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-950 shadow-xl"
                />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
                    {language === 'hi' ? selectedCommunity.hindiName : selectedCommunity.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedCommunity.membersCount.toLocaleString('en-IN')} {t('membersCount')} · Adda #{selectedCommunity.slug}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleJoinCommunity(selectedCommunity.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCommunity.isJoined
                      ? 'bg-slate-800 text-slate-200 border border-white/10'
                      : 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md'
                  }`}
                >
                  {selectedCommunity.isJoined ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {t('joinedAdda')}
                    </span>
                  ) : (
                    t('joinAdda')
                  )}
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-white/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Post in Adda
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
              {language === 'hi' && selectedCommunity.hindiDescription
                ? selectedCommunity.hindiDescription
                : selectedCommunity.description}
            </p>

            {/* Rules */}
            <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-white/5">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Adda Maryada & Guidelines
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
                {selectedCommunity.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Posts within this Community */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-400" />
            <span>Community Threads & Shares</span>
          </h3>

          {communityPosts.length > 0 ? (
            communityPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="glass-panel rounded-2xl p-8 text-center border border-white/10">
              <p className="text-sm font-semibold text-white mb-1">No posts yet in this Adda</p>
              <p className="text-xs text-slate-400 mb-4">
                Be the first member to kick off an engaging discussion!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Create Community Post
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // All Addas List View:
  return (
    <div className="w-full pb-20 sm:pb-24">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-400" />
          <span>{t('addasTitle')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">{t('addasSubtitle')}</p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-5 pb-1">
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

      {/* Communities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-rose-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Banner with gradient */}
              <div className="h-24 relative overflow-hidden">
                <img
                  src={community.banner}
                  alt={community.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/10 text-rose-300">
                  {community.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 pt-0 -mt-6 relative">
                <div className="flex items-end gap-3 mb-2.5">
                  <img
                    src={community.avatar}
                    alt={community.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-950 shadow-md"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white truncate">
                      {language === 'hi' ? community.hindiName : community.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {community.membersCount.toLocaleString('en-IN')} {t('membersCount')}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {language === 'hi' && community.hindiDescription
                    ? community.hindiDescription
                    : community.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCommunity(community)}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <span>View Discussions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => toggleJoinCommunity(community.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  community.isJoined
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                }`}
              >
                {community.isJoined ? t('joinedAdda') : t('joinAdda')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
