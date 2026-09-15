/**
 * Support Center / Ticketing System Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { SupportTicket, SupportTicketStatus, SupportCategory } from '../../types/adminDashboard';
import { globalSupportService } from '../../services/admin/SupportService';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  StickyNote,
  Gift,
  X,
  User,
  ExternalLink,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface AdminSupportTabProps {
  tickets: SupportTicket[];
  adminEmail: string;
  onRefresh: () => void;
  onOpenSendRewardModal: (userId: string, userName: string) => void;
}

export const AdminSupportTab: React.FC<AdminSupportTabProps> = ({
  tickets,
  adminEmail,
  onRefresh,
  onOpenSendRewardModal,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'PENDING' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [internalNoteText, setInternalNoteText] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  const selectedTicket = (tickets || []).find((t) => t && t.id === selectedTicketId) || (tickets || [])[0] || null;

  const filteredTickets = (tickets || []).filter((t) => {
    if (!t) return false;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (t.id && t.id.toLowerCase().includes(q)) ||
      (t.userName && t.userName.toLowerCase().includes(q)) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    globalSupportService.replyToTicket(
      selectedTicket.id,
      adminEmail.split('@')[0],
      replyText
    );
    setReplyText('');
    onRefresh();
  };

  const handleStatusChange = (newStatus: SupportTicketStatus) => {
    if (!selectedTicket) return;
    globalSupportService.updateStatus(selectedTicket.id, newStatus);
    onRefresh();
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !internalNoteText.trim()) return;

    globalSupportService.addInternalNote(selectedTicket.id, internalNoteText);
    setInternalNoteText('');
    setShowNoteInput(false);
    onRefresh();
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-sky-400" />
            <span>Customer Support & Ticket Center</span>
          </h2>
          <p className="text-xs text-slate-400">
            Local-first player communication queue. Manage bug reports, missing ad items, and gameplay inquiries.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'OPEN', 'PENDING', 'RESOLVED'] as const).map((st) => {
            const count = st === 'ALL' ? (tickets || []).length : (tickets || []).filter((t) => t && t.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{st}</span>
                <span className="ml-1 text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Ticket List (Left) + Ticket Conversation Detail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        {/* Left Column: List (5 columns) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl flex flex-col overflow-hidden">
          {/* Search bar inside list */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets by ID, user, or subject..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Ticket items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No tickets matching this status filter.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket && selectedTicket.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full p-3.5 text-left transition-colors flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-slate-800/90 border-l-4 border-l-teal-400'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-teal-400">{t.id}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
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

                      <h4 className="text-xs font-bold text-white truncate">{t.subject}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{t.message}</p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>{t.userName}</span>
                        <span>{new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Actions (7 columns) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Detail Header */}
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-teal-400">{selectedTicket.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold">
                      {selectedTicket.category.replace('_', ' ')}
                    </span>
                    {selectedTicket.levelNumber && (
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                        Level {selectedTicket.levelNumber}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-white">{selectedTicket.subject}</h3>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                    <span>User: <strong className="text-slate-200">{selectedTicket.userName}</strong> ({selectedTicket.userId})</span>
                    <span>•</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {/* Status Switcher & Compensation Button */}
                <div className="flex flex-col items-end space-y-1.5 shrink-0">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStatusChange('OPEN')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        selectedTicket.status === 'OPEN'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleStatusChange('PENDING')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        selectedTicket.status === 'PENDING'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange('RESOLVED')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        selectedTicket.status === 'RESOLVED'
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Resolved
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenSendRewardModal(selectedTicket.userId, selectedTicket.userName)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-black border border-amber-500/30 flex items-center space-x-1"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Send Compensation</span>
                  </button>
                </div>
              </div>

              {/* Internal Notes Section (Admin only) */}
              {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 && (
                <div className="p-3 bg-amber-950/20 border-b border-amber-500/20 text-xs text-amber-200 space-y-1">
                  <div className="flex items-center space-x-1 text-[10px] uppercase font-black tracking-wider text-amber-400">
                    <StickyNote className="w-3.5 h-3.5" />
                    <span>Staff Internal Notes</span>
                  </div>
                  {selectedTicket.internalNotes.map((note, idx) => (
                    <p key={idx} className="text-[11px] italic bg-slate-950/40 p-1.5 rounded-lg border border-amber-500/20">
                      • {note}
                    </p>
                  ))}
                </div>
              )}

              {/* Conversation Messages View */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/30">
                {selectedTicket.conversation.map((msg) => {
                  const isAdmin = msg.sender === 'ADMIN';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
                {showNoteInput && (
                  <form onSubmit={handleAddInternalNote} className="flex items-center space-x-2 pb-1">
                    <input
                      type="text"
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      placeholder="Add private staff note (only admins see this)..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-xs text-amber-200 placeholder-amber-400/50"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black"
                    >
                      Save Note
                    </button>
                  </form>
                )}

                <form onSubmit={handleSendReply} className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    title="Toggle Internal Staff Note"
                    className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                      showNoteInput
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                    }`}
                  >
                    <StickyNote className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official reply to player..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
              Select a support ticket to view conversation details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
