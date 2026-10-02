import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockAnalytics } from '../../data/mockData';
import {
  Shield,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Clock,
  HardDrive,
  Flag,
  Activity,
  CheckCircle,
  AlertTriangle,
  Server,
  Zap,
  UserCheck,
  UserX,
  Trash2,
  Check,
  Filter,
} from 'lucide-react';
import { UserRole } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    role,
    reports,
    switchRole,
    resolveReportAction,
    setActiveTab,
    t,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved'>('pending');

  const currentStats = mockAnalytics[timeFilter];

  const filteredReports = reports.filter((r) => {
    if (reportFilter === 'pending') return r.status === 'pending';
    if (reportFilter === 'resolved') return r.status !== 'pending';
    return true;
  });

  return (
    <div className="w-full pb-20 sm:pb-24 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white">
                  {t('adminDashboardTitle')}
                </h1>
                <p className="text-xs text-slate-400">{t('adminDashboardSubtitle')}</p>
              </div>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setTimeFilter('daily')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeFilter === 'daily'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('timeFilterDaily')}
            </button>
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeFilter === 'weekly'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('timeFilterWeekly')}
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeFilter === 'monthly'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('timeFilterMonthly')}
            </button>
          </div>
        </div>

        {/* Role Access Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{t('currentRole')}:</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {currentUser.role === 'superadmin' ? 'Super Admin / Owner' : currentUser.role}
            </span>
            <span className="text-slate-400">· Operator: {currentUser.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Test Role View:</span>
            {(['superadmin', 'moderator', 'user'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currentUser.role === r
                    ? 'bg-slate-200 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {r === 'superadmin' ? 'Owner' : r === 'moderator' ? 'Mod' : 'User'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Analytics KPI Cards Grid (12 core metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Total Users */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('totalUsers')}</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.totalUsers}</p>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +14.2% MoM across India
          </p>
        </div>

        {/* Active Users */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('activeUsers')}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.activeUsers}</p>
          <p className="text-[10px] text-slate-400 mt-1">60.3% DAU/MAU ratio</p>
        </div>

        {/* New Users Today */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('newUsersToday')}</span>
            <Zap className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.newUsers}</p>
          <p className="text-[10px] text-emerald-400 mt-1">Tier-2 cities leading signup wave</p>
        </div>

        {/* Posts & Videos */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('totalPosts')}</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.postsAndVideos}</p>
          <p className="text-[10px] text-slate-400 mt-1">68% Short Vibes, 32% Photos</p>
        </div>

        {/* Total Views */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('totalViews')}</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.views}</p>
          <p className="text-[10px] text-emerald-400 mt-1">+28% video view surge</p>
        </div>

        {/* Likes */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('totalLikes')}</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.likes}</p>
          <p className="text-[10px] text-slate-400 mt-1">Avg 24 likes/active session</p>
        </div>

        {/* Comments */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('totalComments')}</span>
            <MessageCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.comments}</p>
          <p className="text-[10px] text-slate-400 mt-1">Hinglish / Hindi & English</p>
        </div>

        {/* Shares */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('totalShares')}</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.shares}</p>
          <p className="text-[10px] text-emerald-400 mt-1">72% via WhatsApp direct</p>
        </div>

        {/* Engagement Rate */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('engagementRate')}</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.engagementRate}</p>
          <p className="text-[10px] text-emerald-400 mt-1">+1.2% higher than industry avg</p>
        </div>

        {/* Video Watch Time */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('videoWatchTime')}</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.watchTimeHours} hrs</p>
          <p className="text-[10px] text-slate-400 mt-1">Avg 28.4 mins/daily user</p>
        </div>

        {/* Storage Used */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('storageUsed')}</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{currentStats.storageUsageTB}</p>
          <p className="text-[10px] text-emerald-400 mt-1">WebP & AV1 compressed</p>
        </div>

        {/* Moderation Queue Alert */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{t('pendingReports')}</span>
            <Flag className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">
            {reports.filter((r) => r.status === 'pending').length}
          </p>
          <p className="text-[10px] text-amber-400 mt-1">Requires human review</p>
        </div>
      </div>

      {/* Visual Analytics: Watch Time & Follower Growth Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Watch Time & Engagement Trend Curve */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Video Watch Time & Retention Curve (India Peak Hours)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Peak traffic occurs 7:00 PM – 11:30 PM IST</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              99.98% Uptime
            </span>
          </div>

          {/* SVG Wave Chart */}
          <div className="h-44 w-full relative flex items-end">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3366" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF3366" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,130 C50,120 100,100 150,90 C200,80 250,110 300,50 C350,20 400,10 450,25 C475,32 500,40 500,40 L500,150 L0,150 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M0,130 C50,120 100,100 150,90 C200,80 250,110 300,50 C350,20 400,10 450,25 C475,32 500,40 500,40"
                fill="none"
                stroke="#FF3366"
                strokeWidth="3"
              />
              <circle cx="300" cy="50" r="4" fill="#FFAE19" />
              <circle cx="450" cy="25" r="4" fill="#FFAE19" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 border-t border-white/5 pt-2">
            <span>6 AM (Morning Chai)</span>
            <span>12 PM (Lunch)</span>
            <span>4 PM</span>
            <span>8 PM (Evening Prime)</span>
            <span>11 PM (Late Night Vibes)</span>
          </div>
        </div>

        {/* Indian Cities Geographical Distribution */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400" />
                <span>Geographical Reach across Indian Metros & Towns</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Rapid expansion into Maharashtra, Karnataka & NCR</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {mockAnalytics.topCities.map((item) => (
              <div key={item.city}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">{item.city}</span>
                  <span className="text-slate-400">{item.users} ({item.share})</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: item.share }}
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indian CDN Edge Nodes & Storage Health */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 mb-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>India CDN Edge Acceleration & Bandwidth Nodes</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockAnalytics.cdnNodes.map((node) => (
            <div key={node.location} className="p-3 bg-slate-900/80 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{node.location}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                <span>Latency: <strong className="text-emerald-300">{node.latency}</strong></span>
                <span>Load: {node.load}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation & User Reports Queue */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-400" />
              <span>{t('moderationQueue')}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Review flagged content and maintain safe Indian community guidelines
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setReportFilter('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                reportFilter === 'pending'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({reports.filter((r) => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setReportFilter('resolved')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                reportFilter === 'resolved'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Resolved ({reports.filter((r) => r.status !== 'pending').length})
            </button>
          </div>
        </div>

        {/* Reports Table/Cards */}
        <div className="space-y-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                      {report.reason}
                    </span>
                    <span className="text-xs text-slate-400">Target: {report.targetType}</span>
                    <span className="text-xs text-slate-500">· {report.timestamp}</span>
                    <span className="text-xs text-slate-400">by @{report.reportedBy}</span>
                  </div>

                  <p className="text-xs font-semibold text-white truncate">
                    {report.reportedEntityName}
                  </p>
                  {report.reportedEntityPreview && (
                    <p className="text-xs text-slate-400 line-clamp-1 italic">
                      "{report.reportedEntityPreview}"
                    </p>
                  )}
                  {report.actionTaken && (
                    <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Action taken: {report.actionTaken.replace('_', ' ').toUpperCase()}
                    </p>
                  )}
                </div>

                {/* Moderation Actions Stack */}
                {report.status === 'pending' ? (
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <button
                      onClick={() => resolveReportAction(report.id, 'warned')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                    >
                      {t('actionWarn')}
                    </button>
                    <button
                      onClick={() => resolveReportAction(report.id, 'content_removed')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-semibold"
                    >
                      {t('actionRemove')}
                    </button>
                    <button
                      onClick={() => resolveReportAction(report.id, 'user_banned')}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                    >
                      {t('actionBan')}
                    </button>
                    <button
                      onClick={() => resolveReportAction(report.id, 'dismissed')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      {t('actionDismiss')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Case Resolved</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No reports in this queue. Platform safety standards are all satisfied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
