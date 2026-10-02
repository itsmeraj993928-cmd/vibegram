import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Heart, MessageCircle, UserPlus, Users, Check, Sparkles } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markAllNotificationsRead, setActiveTab, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'mentions' | 'follows'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'mentions') return n.type === 'comment' || n.type === 'mention';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-purple-400" />;
      case 'community':
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="w-full pb-20 sm:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400" />
            <span>{t('notificationsTitle')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Stay connected with your Indian community</p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{t('markAllRead')}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10 mb-4 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('allNotifications')}
        </button>
        <button
          onClick={() => setFilter('mentions')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'mentions'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('mentions')}
        </button>
        <button
          onClick={() => setFilter('follows')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'follows'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('follows')}
        </button>
      </div>

      {/* Notifications List */}
      <div className="glass-panel rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-800/60 ${
                !item.isRead ? 'bg-rose-950/20' : ''
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={item.actor.avatar}
                  alt={item.actor.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                />
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 ring-1 ring-white/10">
                  {getIcon(item.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 leading-snug">
                  <strong className="text-white font-semibold">@{item.actor.username}</strong>{' '}
                  {item.targetText}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">{item.timestamp}</p>
              </div>

              {item.mediaPreview && (
                <img
                  src={item.mediaPreview}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0 ring-1 ring-white/10"
                />
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No notifications in this filter.
          </div>
        )}
      </div>
    </div>
  );
};
