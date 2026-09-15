/**
 * Send Reward to User Modal
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { ManagedUser, RewardType } from '../../types/adminDashboard';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  Gift,
  Coins,
  Gem,
  Zap,
  RotateCcw,
  Shuffle,
  Magnet,
  PlusSquare,
  Snowflake,
  HelpCircle,
  Target,
  X,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface AdminSendRewardModalProps {
  user: ManagedUser;
  adminEmail: string;
  adminId: string;
  onClose: () => void;
  onRewardSent: () => void;
}

const REWARD_TYPES: Array<{ type: RewardType; icon: any; color: string }> = [
  { type: 'Coins', icon: Coins, color: 'text-amber-400 bg-amber-500/20' },
  { type: 'Gems', icon: Gem, color: 'text-teal-400 bg-teal-500/20' },
  { type: 'Undo', icon: RotateCcw, color: 'text-indigo-400 bg-indigo-500/20' },
  { type: 'Shuffle', icon: Shuffle, color: 'text-blue-400 bg-blue-500/20' },
  { type: 'Magnet', icon: Magnet, color: 'text-emerald-400 bg-emerald-500/20' },
  { type: 'Extra Slot', icon: PlusSquare, color: 'text-purple-400 bg-purple-500/20' },
  { type: 'Freeze', icon: Snowflake, color: 'text-cyan-400 bg-cyan-500/20' },
  { type: 'Hint', icon: HelpCircle, color: 'text-amber-300 bg-amber-400/20' },
  { type: 'Auto-Match', icon: Target, color: 'text-pink-400 bg-pink-500/20' },
  { type: 'Energy', icon: Zap, color: 'text-yellow-400 bg-yellow-500/20' },
];

export const AdminSendRewardModal: React.FC<AdminSendRewardModalProps> = ({
  user,
  adminEmail,
  adminId,
  onClose,
  onRewardSent,
}) => {
  const [selectedType, setSelectedType] = useState<RewardType>('Coins');
  const [amount, setAmount] = useState<number>(250);
  const [reason, setReason] = useState<string>('Customer Support compensation for ad timeout');
  const [showConfirmStep, setShowConfirmStep] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<string | null>(null);
  const [errorResult, setErrorResult] = useState<string | null>(null);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorResult('Please specify an amount greater than zero.');
      return;
    }
    if (!reason.trim()) {
      setErrorResult('Please provide a reason for this audit transaction.');
      return;
    }
    setErrorResult(null);
    setShowConfirmStep(true);
  };

  const handleExecuteSend = () => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    setErrorResult(null);

    setTimeout(() => {
      const res = globalAdminService.sendReward({
        adminId,
        adminEmail,
        userId: user.id,
        rewardType: selectedType,
        amount,
        reason,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setErrorResult(res.message);
        setShowConfirmStep(false);
        return;
      }

      setSuccessResult(res.message);
      onRewardSent();

      setTimeout(() => {
        onClose();
      }, 1400);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Send Reward to User</h3>
            <p className="text-xs text-slate-400">
              Recipient: <span className="text-teal-300 font-bold">{user.displayName}</span> ({user.id})
            </p>
          </div>
        </div>

        {errorResult && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-2xl flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorResult}</span>
          </div>
        )}

        {successResult && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successResult}</span>
          </div>
        )}

        {/* Confirmation Overlay Step */}
        {showConfirmStep ? (
          <div className="p-5 bg-slate-950/90 border border-amber-500/40 rounded-2xl space-y-4 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                TRANSACTION CONFIRMATION
              </span>
              <h4 className="text-sm font-extrabold text-white">
                You are about to send <span className="text-amber-300 font-black">{amount} {selectedType}</span> to <span className="text-teal-300 font-black">{user.displayName}</span>.
              </h4>
              <p className="text-xs text-slate-400 italic">"{reason}"</p>
            </div>

            <div className="text-[11px] text-slate-400 p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-left space-y-1">
              <div className="flex justify-between">
                <span>Auditing Administrator:</span>
                <span className="font-mono text-slate-200">{adminEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Save Sync:</span>
                <span className="text-emerald-400 font-bold">{user.isRealPlayer ? 'Live Player Wallet' : 'Managed User DB'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmStep(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-all"
              >
                CANCEL
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteSend}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONFIRM SEND</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Main Reward Form */
          <form onSubmit={handleOpenConfirm} className="space-y-4">
            {/* Reward Type Selection Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Select Reward Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {REWARD_TYPES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedType === r.type;
                  return (
                    <button
                      key={r.type}
                      type="button"
                      onClick={() => {
                        setSelectedType(r.type);
                        if (r.type === 'Coins') setAmount(250);
                        else if (r.type === 'Gems') setAmount(25);
                        else setAmount(2);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-teal-400 text-white shadow-md ring-1 ring-teal-400'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${r.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] truncate">{r.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Reward Amount</span>
                <span className="text-[11px] text-teal-400 font-mono font-bold">
                  {amount} {selectedType}
                </span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  max={selectedType === 'Coins' ? 50000 : selectedType === 'Gems' ? 5000 : 50}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-teal-400"
                />
                {/* Quick amount presets */}
                <div className="flex items-center space-x-1">
                  {(selectedType === 'Coins' ? [100, 500, 1500] : selectedType === 'Gems' ? [10, 50, 100] : [1, 3, 5]).map(
                    (val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700"
                      >
                        +{val}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Reason (Audit Mandate) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Reason / Audit Justification <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Level 14 frozen tile support compensation or bug bounty..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Actions */}
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <Gift className="w-4 h-4" />
                <span>Review Reward</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
