/**
 * Send Message / Announcement to User Modal
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { ManagedUser, RewardType } from '../../types/adminDashboard';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  Mail,
  Send,
  X,
  AlertTriangle,
  Gift,
  CheckCircle2,
} from 'lucide-react';

interface AdminMessageUserModalProps {
  user?: ManagedUser; // if undefined, targets ALL users
  adminEmail: string;
  onClose: () => void;
  onMessageSent: () => void;
}

export const AdminMessageUserModal: React.FC<AdminMessageUserModalProps> = ({
  user,
  adminEmail,
  onClose,
  onMessageSent,
}) => {
  const [title, setTitle] = useState<string>(
    user ? `Sanctuary Gift for ${user.displayName}` : 'Sanctuary Community Update'
  );
  const [message, setMessage] = useState<string>(
    'Thank you for being part of Tile Oasis! Here is a small token of our appreciation to assist you on your matching journey.'
  );
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [attachReward, setAttachReward] = useState<boolean>(true);
  const [rewardType, setRewardType] = useState<RewardType>('Coins');
  const [rewardAmount, setRewardAmount] = useState<number>(300);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      globalAdminService.sendMessage({
        targetUserId: user ? user.id : 'ALL',
        title,
        message,
        priority,
        adminEmail,
        optionalReward: attachReward ? { type: rewardType, amount: rewardAmount } : undefined,
      });

      // If attached reward to a specific real player, credit it!
      if (attachReward && user) {
        globalAdminService.sendReward({
          adminId: 'msg_flow',
          adminEmail,
          userId: user.id,
          rewardType,
          amount: rewardAmount,
          reason: `Attached to message: ${title}`,
        });
      }

      setIsSending(false);
      setSuccess(true);
      onMessageSent();

      setTimeout(() => {
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              {user ? `Message ${user.displayName}` : 'Broadcast Announcement to All Users'}
            </h3>
            <p className="text-xs text-slate-400">
              Target: <span className="text-teal-300 font-bold">{user ? `${user.displayName} (${user.id})` : 'All Active Sanctuary Players'}</span>
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Message Dispatched!</h4>
            <p className="text-xs text-slate-400">Announcement recorded in player inboxes and audit log.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Message Subject / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Message Content</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Priority Picker */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-slate-300">Priority Level:</span>
              <div className="flex items-center space-x-1">
                {(['NORMAL', 'HIGH', 'URGENT'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      priority === p
                        ? p === 'URGENT'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : p === 'HIGH'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Attach Reward Toggle */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">Attach In-Game Gift</span>
                </div>
                <input
                  type="checkbox"
                  checked={attachReward}
                  onChange={(e) => setAttachReward(e.target.checked)}
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                />
              </div>

              {attachReward && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <select
                    value={rewardType}
                    onChange={(e) => setRewardType(e.target.value as RewardType)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Coins">Coins</option>
                    <option value="Gems">Gems</option>
                    <option value="Undo">Undo Booster</option>
                    <option value="Shuffle">Shuffle Booster</option>
                    <option value="Magnet">Magnet Booster</option>
                  </select>

                  <input
                    type="number"
                    min={1}
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(parseInt(e.target.value) || 1)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Sending...' : 'Send Announcement'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
