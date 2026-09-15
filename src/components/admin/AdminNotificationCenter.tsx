/**
 * Admin Notification Center Dropdown Popover
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React from 'react';
import { SystemAlertNotification } from '../../types/adminDashboard';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  Bell,
  Check,
  Trash2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Coins,
  Shield,
  Layers,
  X,
} from 'lucide-react';

interface AdminNotificationCenterProps {
  notifications: SystemAlertNotification[];
  onSelectTab: (tab: string) => void;
  onRefresh: () => void;
  onClose: () => void;
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({
  notifications,
  onSelectTab,
  onRefresh,
  onClose,
}) => {
  const unreadCount = (notifications || []).filter((n) => n && !n.read).length;

  const handleMarkRead = (id: string) => {
    globalAdminService.markNotificationAsRead(id);
    onRefresh();
  };

  const handleMarkAllRead = () => {
    globalAdminService.markAllNotificationsRead();
    onRefresh();
  };

  const handleClearAll = () => {
    globalAdminService.clearAllNotifications();
    onRefresh();
  };

  const getIcon = (type: SystemAlertNotification['type']) => {
    switch (type) {
      case 'SUPPORT':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'ECONOMY':
        return <Coins className="w-4 h-4 text-amber-400" />;
      case 'ADS':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'CONTENT':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      default:
        return <Shield className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 text-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
      {/* Header */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-black text-white">System Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-bold">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="p-1 text-slate-400 hover:text-teal-300 rounded"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleClearAll}
            title="Clear all"
            className="p-1 text-slate-400 hover:text-rose-400 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No system notifications or alerts at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 transition-colors ${
                n.read ? 'bg-slate-900/50 opacity-75' : 'bg-slate-800/40'
              } hover:bg-slate-800 flex items-start space-x-2.5`}
            >
              <div className="p-1.5 rounded-xl bg-slate-950 shrink-0 border border-slate-800">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white truncate">{n.title}</h5>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight line-clamp-2">{n.message}</p>

                {n.targetTab && (
                  <button
                    onClick={() => {
                      handleMarkRead(n.id);
                      onSelectTab(n.targetTab!);
                      onClose();
                    }}
                    className="inline-flex items-center space-x-1 text-[10px] text-teal-400 hover:text-teal-300 font-bold pt-1"
                  >
                    <span>Inspect {n.targetTab}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  title="Mark as read"
                  className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1.5"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
