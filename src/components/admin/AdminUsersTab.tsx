/**
 * User Management Tab & User Profile Inspector
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState, useMemo } from 'react';
import { ManagedUser, SupportTicket, RewardTransaction } from '../../types/adminDashboard';
import { globalAdminService } from '../../services/admin/AdminService';
import { globalSupportService } from '../../services/admin/SupportService';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Star,
  Coins,
  Gem,
  Gift,
  Mail,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  X,
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface AdminUsersTabProps {
  users: ManagedUser[];
  adminEmail: string;
  onRefresh: () => void;
  onOpenSendRewardModal: (user: ManagedUser) => void;
  onOpenMessageModal: (user: ManagedUser) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  adminEmail,
  onRefresh,
  onOpenSendRewardModal,
  onOpenMessageModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'VIP'>('ALL');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetReason, setResetReason] = useState<string>('Player requested full save reset for fresh playthrough');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      if (!u) return false;
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (u.id && u.id.toLowerCase().includes(q)) ||
        (u.displayName && u.displayName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q));

      // Status
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Support tickets for inspect modal
  const userTickets = useMemo(() => {
    if (!selectedUser) return [];
    return globalSupportService.getTicketsForUser(selectedUser.id);
  }, [selectedUser]);

  // Reward history for inspect modal
  const userRewardHistory = useMemo(() => {
    if (!selectedUser) return [];
    return (globalAdminService.getRewardTransactions() || []).filter((r) => r && r.userId === selectedUser.id);
  }, [selectedUser]);

  const handleToggleSuspend = (user: ManagedUser) => {
    const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    const reason = newStatus === 'SUSPENDED' ? 'Flagged for investigation' : 'Reinstated by admin';
    globalAdminService.updateUserStatus(adminEmail, user.id, newStatus, reason);
    setActionNotice(`User status updated to ${newStatus}.`);
    onRefresh();
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  const handleExecuteResetProgress = () => {
    if (!selectedUser) return;
    globalAdminService.resetUserProgress(adminEmail, selectedUser.id, resetReason);
    setShowResetConfirm(false);
    setActionNotice(`User progress reset for ${selectedUser.displayName}.`);
    onRefresh();
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Action Banner */}
      {actionNotice && (
        <div className="p-3 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="p-1 text-teal-400 hover:text-teal-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>User & Player Management</span>
            </h2>
            <p className="text-xs text-slate-400">
              Inspect player saves, monitor level progression, distribute rewards, and enforce moderation.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">
              Showing <span className="text-white font-bold">{filteredUsers.length}</span> of {users.length} users
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by User ID, player name, or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="grid grid-cols-4 w-full gap-1">
              {(['ALL', 'ACTIVE', 'VIP', 'SUSPENDED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-teal-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Stars</th>
                <th className="py-3 px-4">Wallet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* User info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {(u?.displayName || u?.id || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white truncate">{u.displayName}</span>
                            {u.isRealPlayer && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                                Live
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block truncate">
                            {u.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-200">
                        Level <span className="font-bold text-white">{u.currentLevel}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Max: {u.highestLevelUnlocked}</span>
                    </td>

                    {/* Stars */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 text-amber-300 font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{u.starsTotal}</span>
                      </div>
                    </td>

                    {/* Wallet */}
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center space-x-1 text-amber-300 font-bold">
                        <Coins className="w-3 h-3 text-amber-400" />
                        <span>{u.coins.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-teal-300 font-bold text-[11px]">
                        <Gem className="w-3 h-3 text-teal-400" />
                        <span>{u.gems.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : u.status === 'VIP'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {new Date(u.lastActive).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 transition-all"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => onOpenSendRewardModal(u)}
                          title="Send Reward"
                          className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all"
                        >
                          <Gift className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenMessageModal(u)}
                          title="Send Message"
                          className="p-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* USER PROFILE INSPECTOR MODAL                              */}
      {/* ========================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 relative text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                {(selectedUser?.displayName || selectedUser?.id || 'U').charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-black text-white">{selectedUser.displayName}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedUser.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : selectedUser.status === 'VIP'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  ID: <span className="text-teal-400">{selectedUser.id}</span> • {selectedUser.email || 'No email attached'}
                </p>
              </div>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">CURRENT LEVEL</span>
                <span className="text-base font-black text-white font-mono">Level {selectedUser.currentLevel}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">STARS TOTAL</span>
                <span className="text-base font-black text-amber-300 font-mono flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedUser.starsTotal}</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">COIN WALLET</span>
                <span className="text-base font-black text-amber-300 font-mono flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{selectedUser.coins.toLocaleString()}</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">GEM CACHE</span>
                <span className="text-base font-black text-teal-300 font-mono flex items-center space-x-1">
                  <Gem className="w-4 h-4 text-teal-400" />
                  <span>{selectedUser.gems.toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* Inventory Overview */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Booster Inventory Breakdown</span>
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 text-center text-xs font-mono">
                {Object.entries(selectedUser.boosterInventory).map(([key, count]) => (
                  <div key={key} className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[9px] uppercase text-slate-400 block truncate">{key.replace('_', ' ')}</span>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progression & Retention Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block text-[11px]">Daily Streak Calendar</span>
                <p className="text-slate-200">
                  Day <span className="font-bold text-teal-300">{selectedUser.dailyRewardStreak}</span> streak •{' '}
                  {selectedUser.dailyRewardClaimedToday ? 'Claimed today' : 'Pending claim'}
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block text-[11px]">Missions & Engagement</span>
                <p className="text-slate-200">
                  <span className="font-bold text-white">{selectedUser.missionsCompletedCount}</span> completed •{' '}
                  {selectedUser.lifetimePlaytimeMinutes} mins total playtime
                </p>
              </div>
            </div>

            {/* User Support History */}
            {userTickets.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300">Support Tickets for this User ({userTickets.length})</span>
                <div className="divide-y divide-slate-800 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs">
                  {userTickets.map((t) => (
                    <div key={t.id} className="py-1.5 flex items-center justify-between">
                      <span className="text-teal-400 font-mono">{t.id}: {t.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    onOpenSendRewardModal(selectedUser);
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center space-x-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Send Reward</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedUser(null);
                    onOpenMessageModal(selectedUser);
                  }}
                  className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleSuspend(selectedUser)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedUser.status === 'SUSPENDED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  }`}
                >
                  {selectedUser.status === 'SUSPENDED' ? 'Unsuspend User' : 'Suspend Account'}
                </button>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold border border-slate-700"
                >
                  Reset Progress
                </button>
              </div>
            </div>

            {/* Reset Progress Confirmation Dialog */}
            {showResetConfirm && (
              <div className="p-4 bg-slate-950 border border-rose-500/40 rounded-2xl space-y-3 animate-in zoom-in-95">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>DANGEROUS ACTION: Confirm Reset Player Progress</span>
                </div>
                <p className="text-xs text-slate-400">
                  This will reset <span className="text-white font-bold">{selectedUser.displayName}</span> back to Level 1 and re-initialize their economy wallet.
                </p>
                <input
                  type="text"
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value)}
                  placeholder="Audit reason for progress reset..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteResetProgress}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-black"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
