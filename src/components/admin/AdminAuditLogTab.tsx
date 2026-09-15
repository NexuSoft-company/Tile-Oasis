/**
 * Audit Log & Governance Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState, useMemo } from 'react';
import { AuditLogEntry, AuditLogCategory } from '../../types/adminDashboard';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Clock,
  FileText,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface AdminAuditLogTabProps {
  logs: AuditLogEntry[];
}

export const AdminAuditLogTab: React.FC<AdminAuditLogTabProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<AuditLogCategory | 'ALL'>('ALL');

  const filteredLogs = useMemo(() => {
    return (logs || []).filter((log) => {
      if (!log) return false;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (log.adminEmail && log.adminEmail.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.targetId && log.targetId.toLowerCase().includes(q)) ||
        (log.reason && log.reason.toLowerCase().includes(q));

      const matchesCat = categoryFilter === 'ALL' || log.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [logs, searchQuery, categoryFilter]);

  const handleExportJson = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tile_oasis_audit_log_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Admin Email', 'Action', 'Category', 'Target ID', 'Reason', 'Previous Value', 'New Value'];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.timestamp).toISOString()}"`,
      `"${l.adminEmail}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${(l.targetId || '').replace(/"/g, '""')}"`,
      `"${(l.reason || '').replace(/"/g, '""')}"`,
      `"${(l.previousValue || '').replace(/"/g, '""')}"`,
      `"${(l.newValue || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tile_oasis_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const categories: Array<AuditLogCategory | 'ALL'> = [
    'ALL',
    'REWARD',
    'USER_MOD',
    'ECONOMY',
    'CONTENT',
    'ADMOB',
    'ROLE',
    'GAME_CONFIG',
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-teal-400" />
            <span>Immutable Governance Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400">
            Every administrative intervention, economy shift, reward compensation, and credential change is permanently recorded.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center space-x-1 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by admin, action keywords, target ID, or reason..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-bold"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action & Target</th>
                <th className="py-3 px-4">Reason / Details</th>
                <th className="py-3 px-4">Value Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No audit records matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    {/* Admin */}
                    <td className="py-3 px-4 font-mono text-white whitespace-nowrap">
                      {entry.adminEmail}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          entry.category === 'ROLE'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : entry.category === 'ECONOMY'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : entry.category === 'REWARD'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        {entry.category}
                      </span>
                    </td>

                    {/* Action & Target */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{entry.action}</div>
                      {entry.targetId && (
                        <div className="text-[10px] text-teal-400 font-mono">
                          Target: {entry.targetId}
                        </div>
                      )}
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 text-slate-300 max-w-xs">
                      {entry.reason || <span className="text-slate-600 italic">None logged</span>}
                    </td>

                    {/* Value Shift */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {entry.previousValue || entry.newValue ? (
                        <div className="space-y-0.5">
                          {entry.previousValue && (
                            <div className="text-rose-400 line-through text-[10px]">
                              {entry.previousValue}
                            </div>
                          )}
                          {entry.newValue && (
                            <div className="text-emerald-300 font-bold">
                              {entry.newValue}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
