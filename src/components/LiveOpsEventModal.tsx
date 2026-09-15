import React from 'react';
import { Flame, Zap, Coins, Clock, X, Gift, CheckCircle2, ChevronRight, Award, ShoppingBag } from 'lucide-react';
import { LiveOpsConfigService } from '../services/LiveOpsConfigService';
import { LiveOpsEventConfig } from '../types/liveOps';
import { globalAudioService } from '../services/AudioService';

interface LiveOpsEventModalProps {
  event: LiveOpsEventConfig;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToShop?: () => void;
}

export const LiveOpsEventModal: React.FC<LiveOpsEventModalProps> = ({
  event,
  isOpen,
  onClose,
  onNavigateToShop,
}) => {
  if (!isOpen) return null;

  const now = Date.now();
  const msRemaining = Math.max(0, event.endTime - now);
  const daysRemaining = Math.floor(msRemaining / (24 * 60 * 60 * 1000));
  const hoursRemaining = Math.floor((msRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  const formatRemaining = () => {
    if (daysRemaining > 0) return `${daysRemaining}d ${hoursRemaining}h left`;
    const minsRemaining = Math.floor((msRemaining % (60 * 60 * 1000)) / (60 * 1000));
    return `${hoursRemaining}h ${minsRemaining}m left`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-slate-900 border border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
            <Flame className="w-3.5 h-3.5" />
            <span>LIMITED-TIME SANCTUARY EVENT</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mt-1">{event.name}</h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">{event.description}</p>

          <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRemaining()}</span>
          </div>
        </div>

        {/* Active Multipliers & Event Perks */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {event.coinMultiplier > 1 && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400/80 block">Coin Boost</span>
                <span className="text-base font-black text-amber-300">{event.coinMultiplier}x Multiplier</span>
              </div>
            </div>
          )}

          {event.xpMultiplier > 1 && (
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400/80 block">XP Surge</span>
                <span className="text-base font-black text-purple-300">{event.xpMultiplier}x Player XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Reward Track */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-black text-white">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Event Milestone Goals</span>
            </div>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
              Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Complete 3 World Levels</span>
                <span className="text-[11px] text-slate-400">+250 Bonus Coins</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Achieve 3-Star Match</span>
                <span className="text-[11px] text-slate-400">+1 Free Undo Power-up</span>
              </div>
              <Gift className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Shop Discounts Promo */}
        {event.specialShopDiscounts && Object.keys(event.specialShopDiscounts).length > 0 && onNavigateToShop && (
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
              onNavigateToShop();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/20 hover:from-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-between transition-all active:scale-98"
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Special Event Marketplace Discounts Active!</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Primary Action Button */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>JOIN EVENT & PLAY</span>
        </button>
      </div>
    </div>
  );
};
