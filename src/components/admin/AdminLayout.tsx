/**
 * Master Admin & Super Admin Dashboard Layout
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState, useEffect } from 'react';
import {
  AdminSession,
  ManagedUser,
  SupportTicket,
  ContentAssetItem,
  PromotionalBanner,
  AuditLogEntry,
} from '../../types/adminDashboard';
import { globalAdminAuthService } from '../../services/admin/AdminAuthService';
import { globalAdminService } from '../../services/admin/AdminService';
import { globalSupportService } from '../../services/admin/SupportService';
import { globalContentManagerService } from '../../services/admin/ContentManagerService';
import { globalAdminAnalyticsService } from '../../services/admin/AdminAnalyticsService';
import { AdminHomeTab } from './AdminHomeTab';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminBannerTab } from './AdminBannerTab';
import { AdminSupportTab } from './AdminSupportTab';
import { AdminGameTab } from './AdminGameTab';
import { AdminEconomyTab } from './AdminEconomyTab';
import { AdminShopTab } from './AdminShopTab';
import { AdminAdsTab } from './AdminAdsTab';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminAiAssistantTab } from './AdminAiAssistantTab';
import { AdminManagementTab } from './AdminManagementTab';
import { AdminAuditLogTab } from './AdminAuditLogTab';
import { AdminNotificationCenter } from './AdminNotificationCenter';
import { AdminSendRewardModal } from './AdminSendRewardModal';
import { AdminMessageUserModal } from './AdminMessageUserModal';
import {
  LayoutDashboard,
  Users,
  Layers,
  Flag,
  MessageSquare,
  Gamepad2,
  Coins,
  ShoppingBag,
  Tv,
  BarChart3,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ArrowLeft,
  Gift,
  Mail,
  Bell,
  Menu,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  session: AdminSession;
  onLogout: () => void;
  onExitToGame: () => void;
}

export type AdminTabId =
  | 'home'
  | 'users'
  | 'content'
  | 'banners'
  | 'support'
  | 'game'
  | 'economy'
  | 'shop'
  | 'ads'
  | 'analytics'
  | 'ai'
  | 'admins'
  | 'audit';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  session,
  onLogout,
  onExitToGame,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>('home');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Global datasets
  const [users, setUsers] = useState<ManagedUser[]>(globalAdminService.getUsers());
  const [tickets, setTickets] = useState<SupportTicket[]>(globalSupportService.getAllTickets());
  const [assets, setAssets] = useState<ContentAssetItem[]>(globalContentManagerService.getAllAssets());
  const [banners, setBanners] = useState<PromotionalBanner[]>(globalContentManagerService.getAllBanners());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(globalAdminService.getAuditLogs());

  // Modals state
  const [rewardModalUser, setRewardModalUser] = useState<ManagedUser | null>(null);
  const [messageModalUser, setMessageModalUser] = useState<ManagedUser | null>(null);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);

  const isSuperAdmin = session.role === 'SUPER_ADMIN';
  const openTicketCount = (tickets || []).filter((t) => t && t.status === 'OPEN').length;

  const refreshAllData = () => {
    setUsers(globalAdminService.getUsers());
    setTickets(globalSupportService.getAllTickets());
    setAssets(globalContentManagerService.getAllAssets());
    setBanners(globalContentManagerService.getAllBanners());
    setAuditLogs(globalAdminService.getAuditLogs());
  };

  const navItems: Array<{ id: AdminTabId; label: string; icon: React.ReactNode; badge?: number; superAdminOnly?: boolean }> = [
    { id: 'home', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
    { id: 'content', label: 'Content & Assets', icon: <Layers className="w-4 h-4" /> },
    { id: 'banners', label: 'Promotional Banners', icon: <Flag className="w-4 h-4" /> },
    { id: 'support', label: 'Support & Tickets', icon: <MessageSquare className="w-4 h-4" />, badge: openTicketCount },
    { id: 'game', label: 'Game & Worlds', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'economy', label: 'Economy Calibration', icon: <Coins className="w-4 h-4" /> },
    { id: 'shop', label: 'Shop Packages', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'ads', label: 'AdMob Monetization', icon: <Tv className="w-4 h-4" /> },
    { id: 'analytics', label: 'Telemetry & Insights', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai', label: 'Live-Ops Diagnostics', icon: <Sliders className="w-4 h-4" /> },
    { id: 'admins', label: 'Admin Accounts & RBAC', icon: <ShieldCheck className="w-4 h-4" />, superAdminOnly: true },
    { id: 'audit', label: 'Audit Log & History', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 flex items-center justify-between shadow-md">
        {/* Left: Branding & App Package */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-black text-white tracking-tight">Tile Oasis</h1>
                <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider">
                  Master Admin
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                com.tileoasis.sanctuarymatch • v1.0.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-400">System Live & Healthy</span>
        </div>

        {/* Right: Quick Actions, Notification, Current Super Admin & Logout */}
        <div className="flex items-center space-x-2">
          {/* Quick Action: Send Reward */}
          <button
            onClick={() => setRewardModalUser(users[0] || null)}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold items-center space-x-1 transition-all"
            title="Quick Send Reward"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Send Reward</span>
          </button>

          {/* Quick Action: Send Message */}
          <button
            onClick={() => setMessageModalUser(users[0] || null)}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold items-center space-x-1 transition-all"
            title="Quick Broadcast Message"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Message</span>
          </button>

          {/* Notification Center Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white relative border border-slate-700 transition-all"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {openTicketCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {openTicketCount}
                </span>
              )}
            </button>

            {showNotificationCenter && (
              <AdminNotificationCenter
                openTicketsCount={openTicketCount}
                onClose={() => setShowNotificationCenter(false)}
                onNavigateToSupport={() => {
                  setActiveTab('support');
                  setShowNotificationCenter(false);
                }}
              />
            )}
          </div>

          {/* Admin Identity Badge */}
          <div className="hidden xl:flex items-center space-x-2 pl-2 border-l border-slate-800 text-left">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-teal-400 font-bold flex items-center justify-center text-xs">
              {(session?.name || session?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center space-x-1">
                <span>{session?.name || session?.email || 'Admin'}</span>
                {isSuperAdmin && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-black">
                    SUPER
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[140px]">
                {session?.email}
              </span>
            </div>
          </div>

          {/* Return to Game */}
          <button
            onClick={onExitToGame}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-all"
            title="Switch back to Tile Oasis Game"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Play Game</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-all"
            title="Terminate Admin Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 pt-16 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Navigation Links */}
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            <span className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider block py-2">
              Management Modules
            </span>

            {navItems.map((item) => {
              if (item.superAdminOnly && !isSuperAdmin) return null;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-slate-950 text-teal-300' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-black block">Session Active</span>
              <div className="font-mono text-[11px] text-teal-400 font-bold truncate">
                {session.email}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Role: <strong>{session.role}</strong></span>
                <span className="text-emerald-400 font-bold">Secure</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'home' && (
              <AdminHomeTab
                metrics={globalAdminAnalyticsService.getMetrics()}
                recentRewards={globalAdminService.getRewardTransactions().slice(0, 5)}
                recentTickets={tickets.slice(0, 5)}
                recentLogs={auditLogs.slice(0, 8)}
                notifications={globalAdminService.getNotifications()}
                onNavigateTab={(tab) => {
                  const targetMap: Record<string, AdminTabId> = {
                    SUPPORT: 'support',
                    USERS: 'users',
                    CONTENT: 'content',
                    BANNERS: 'banners',
                    GAME: 'game',
                    ECONOMY: 'economy',
                    SHOP: 'shop',
                    ADS: 'ads',
                    ANALYTICS: 'analytics',
                    AI: 'ai',
                    ADMINS: 'admins',
                    AUDIT: 'audit',
                    HOME: 'home',
                  };
                  setActiveTab(targetMap[tab.toUpperCase()] || 'home');
                }}
                onOpenSendRewardModal={() => setRewardModalUser(users[0] || null)}
                onOpenBroadcastModal={() => setMessageModalUser(null)}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsersTab
                users={users}
                adminEmail={session.email}
                onRefresh={refreshAllData}
                onOpenSendRewardModal={(u) => setRewardModalUser(u)}
                onOpenMessageModal={(u) => setMessageModalUser(u)}
              />
            )}

            {activeTab === 'content' && (
              <AdminContentTab assets={assets} onRefresh={refreshAllData} />
            )}

            {activeTab === 'banners' && (
              <AdminBannerTab banners={banners} onRefresh={refreshAllData} />
            )}

            {activeTab === 'support' && (
              <AdminSupportTab
                tickets={tickets}
                adminEmail={session.email}
                onRefresh={refreshAllData}
                onOpenSendRewardModal={(userId, userName) => {
                  const found = users.find((u) => u.id === userId);
                  if (found) setRewardModalUser(found);
                  else if (users[0]) setRewardModalUser(users[0]);
                }}
              />
            )}

            {activeTab === 'game' && (
              <AdminGameTab adminEmail={session.email} onRefresh={refreshAllData} />
            )}

            {activeTab === 'economy' && (
              <AdminEconomyTab adminEmail={session.email} onRefresh={refreshAllData} />
            )}

            {activeTab === 'shop' && (
              <AdminShopTab adminEmail={session.email} onRefresh={refreshAllData} />
            )}

            {activeTab === 'ads' && (
              <AdminAdsTab adminEmail={session.email} onRefresh={refreshAllData} />
            )}

            {activeTab === 'analytics' && <AdminAnalyticsTab />}

            {activeTab === 'ai' && (
              <AdminAiAssistantTab onNavigateTab={(tab) => setActiveTab(tab as AdminTabId)} />
            )}

            {activeTab === 'admins' && isSuperAdmin && (
              <AdminManagementTab currentSession={session} onRefresh={refreshAllData} />
            )}

            {activeTab === 'audit' && <AdminAuditLogTab logs={auditLogs} />}
          </div>
        </main>
      </div>

      {/* Global Send Reward Modal */}
      {rewardModalUser && (
        <AdminSendRewardModal
          user={rewardModalUser}
          adminEmail={session.email}
          adminId={session.adminId}
          onClose={() => setRewardModalUser(null)}
          onRewardSent={() => {
            setRewardModalUser(null);
            refreshAllData();
          }}
        />
      )}

      {/* Global Message / Announcement Modal */}
      {messageModalUser && (
        <AdminMessageUserModal
          user={messageModalUser}
          adminEmail={session.email}
          onClose={() => setMessageModalUser(null)}
          onMessageSent={() => {
            setMessageModalUser(null);
            refreshAllData();
          }}
        />
      )}
    </div>
  );
};
