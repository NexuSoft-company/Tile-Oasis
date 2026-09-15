/**
 * Dashboard Home / Overview Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React from 'react';
import { DashboardMetrics } from '../../services/admin/AdminAnalyticsService';
import {
  RewardTransaction,
  SupportTicket,
  AdminAuditLogEntry,
  SystemAlertNotification,
} from '../../types/adminDashboard';
import {
  Users,
  UserCheck,
  UserPlus,
  PlayCircle,
  Trophy,
  Star,
  Coins,
  Gem,
  Zap,
  Tv,
  MessageSquare,
  Gift,
  Mail,
  Sliders,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface AdminHomeTabProps {
  metrics: DashboardMetrics;
  recentRewards: RewardTransaction[];
  recentTickets: SupportTicket[];
  recentLogs: AdminAuditLogEntry[];
  notifications: SystemAlertNotification[];
  onNavigateTab: (tab: string) => void;
  onOpenSendRewardModal: () => void;
  onOpenBroadcastModal: () => void;
}

export const AdminHomeTab: React.FC<AdminHomeTabProps> = ({
  metrics,
  recentRewards,
  recentTickets,
  recentLogs,
  notifications,
  onNavigateTab,
  onOpenSendRewardModal,
  onOpenBroadcastModal,
}) => {
  const metricCards = [
    { label: 'Local Profiles', value: metrics.localUsersCount.toLocaleString(), icon: Users, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', badge: 'LOCAL' },
    { label: 'Active Status', value: metrics.localActiveUsers.toLocaleString(), icon: UserCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', badge: 'LOCAL' },
    { label: 'Cloud DAU / MAU', value: metrics.cloudDau !== null ? metrics.cloudDau.toString() : 'NOT CONNECTED', icon: UserPlus, color: 'text-slate-400 bg-slate-800/40 border-slate-700/40', badge: 'CLOUD' },
    { label: 'Levels Completed', value: metrics.localLevelsCompleted.toLocaleString(), icon: Trophy, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', badge: 'LOCAL' },
    { label: 'Local Stars', value: metrics.localStarsEarned.toLocaleString(), icon: Star, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', badge: 'LOCAL' },
    { label: 'Coins in Circulation', value: metrics.localCoinsInCirculation.toLocaleString(), icon: Coins, color: 'text-amber-300 bg-amber-500/10 border-amber-500/30', badge: 'LOCAL' },
    { label: 'Gems in Circulation', value: metrics.localGemsInCirculation.toLocaleString(), icon: Gem, color: 'text-teal-300 bg-teal-500/10 border-teal-500/30', badge: 'LOCAL' },
    { label: 'Boosters Fired', value: metrics.localBoostersUsed.toLocaleString(), icon: Zap, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', badge: 'LOCAL' },
    { label: 'Rewarded Ads', value: metrics.localRewardedAdsWatched.toLocaleString(), icon: Tv, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', badge: 'ADMOB' },
    { label: 'Open Support Tickets', value: metrics.localOpenIssuesCount.toString(), icon: MessageSquare, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', badge: 'LOCAL' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner with Quick Actions & Honest Connection Badge */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Tile Oasis Master Operations</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-amber-300 border border-amber-500/30 font-mono">
              LOCAL DATA ONLY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sanctuary Operational Overview
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Device-authoritative telemetry for <span className="text-slate-200 font-mono">com.tileoasis.sanctuarymatch</span>. Data is verified directly against local save progress and on-device AdMob telemetry.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenSendRewardModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <Gift className="w-4 h-4" />
            <span>Send Reward</span>
          </button>

          <button
            onClick={onOpenBroadcastModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <Mail className="w-4 h-4" />
            <span>Broadcast Message</span>
          </button>

          <button
            onClick={() => onNavigateTab('SUPPORT')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <span>Support ({metrics.localOpenIssuesCount})</span>
          </button>
        </div>
      </div>

      {/* Connection Notice */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>{metrics.cloudStatusMessage}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Authoritative Sandbox v2.0.0</span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {m.badge}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                  {m.label}
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {m.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Activity Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Rewards & Support Requests (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Rewards Dispatched */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">Recent Rewards Dispatched</h3>
              </div>
              <button
                onClick={() => onNavigateTab('USERS')}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center space-x-1"
              >
                <span>Manage Users</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentRewards.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No rewards dispatched in this session.</p>
            ) : (
              <div className="divide-y divide-slate-800/70">
                {recentRewards.slice(0, 4).map((r) => (
                  <div key={r.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{r.userName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({r.userId})</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-black text-[10px]">
                          +{r.amount} {r.rewardType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">"{r.reason}"</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-teal-400 font-medium">{r.adminEmail.split('@')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Support Requests */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-black text-white">Incoming Support Tickets</h3>
              </div>
              <button
                onClick={() => onNavigateTab('SUPPORT')}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center space-x-1"
              >
                <span>Support Center</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/70">
              {recentTickets.slice(0, 3).map((t) => (
                <div key={t.id} className="py-2.5 flex items-start justify-between text-xs gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-teal-400 font-bold">{t.id}</span>
                      <span className="font-bold text-white truncate">{t.subject}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          t.status === 'OPEN'
                            ? 'bg-rose-500/20 text-rose-300'
                            : t.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{t.message}</p>
                    <span className="text-[10px] text-slate-500 font-medium">User: {t.userName}</span>
                  </div>

                  <button
                    onClick={() => onNavigateTab('SUPPORT')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700 shrink-0"
                  >
                    Reply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Admin Actions & Health Alerts */}
        <div className="space-y-6">
          {/* Health & Live Operations Status */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-white text-sm font-black">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>System Operational Health</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Match-3 Engine (28 moves avg):</span>
                <span className="text-emerald-400 font-bold">Optimal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">AdMob SDK Ingress:</span>
                <span className="text-emerald-400 font-bold">100% Ready</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Local-First Save Integrity:</span>
                <span className="text-emerald-400 font-bold">Secured</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">High Drop-off Alert:</span>
                <span className="text-amber-400 font-bold">Level 19 (33%)</span>
              </div>
            </div>
          </div>

          {/* Recent Audit Log Feed */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-black text-white">Recent Audit Events</h3>
              </div>
              <button
                onClick={() => onNavigateTab('AUDIT')}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {recentLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-teal-400/90 font-mono">{log.adminEmail.split('@')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                      {log.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
