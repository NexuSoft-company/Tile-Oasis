import React from 'react';
import { Gift, Coins, Gem, Star, Zap, CheckCircle2 } from 'lucide-react';

interface RewardPresentationPopupProps {
  isOpen: boolean;
  title?: string;
  rewards: {
    coins?: number;
    gems?: number;
    boosters?: Record<string, number>;
  };
  onClaim: () => void;
}

export const RewardPresentationPopup: React.FC<RewardPresentationPopupProps> = ({
  isOpen,
  title = 'REWARD UNLOCKED!',
  rewards,
  onClaim,
}) => {
  if (!isOpen) return null;

  const boosterEntries = Object.entries(rewards.boosters || {}).filter(([_, qty]) => (qty as number) > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-6 shadow-2xl text-center space-y-5">
        {/* Glow & Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
          <Gift className="w-8 h-8 animate-bounce" />
          <Star className="w-4 h-4 fill-amber-300 text-amber-300 absolute top-1 right-1 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-amber-400 tracking-wide uppercase">
            {title}
          </h2>
          <p className="text-xs text-slate-400">Claim your rewards to boost your progression!</p>
        </div>

        {/* Rewards List */}
        <div className="grid grid-cols-1 gap-2 text-sm font-semibold">
          {rewards.coins && rewards.coins > 0 && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span className="text-slate-200">Coins</span>
              </div>
              <span className="text-amber-400 font-bold text-base">+{rewards.coins}</span>
            </div>
          )}

          {rewards.gems && rewards.gems > 0 && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-teal-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-teal-400" />
                <span className="text-slate-200">Gems</span>
              </div>
              <span className="text-teal-400 font-bold text-base">+{rewards.gems}</span>
            </div>
          )}

          {boosterEntries.map(([boosterType, count]) => (
            <div
              key={boosterType}
              className="p-3 rounded-xl bg-slate-800/60 border border-purple-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 capitalize">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-slate-200">{boosterType} Booster</span>
              </div>
              <span className="text-purple-400 font-bold text-base">+{count}</span>
            </div>
          ))}
        </div>

        {/* Claim Button */}
        <button
          onClick={onClaim}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>COLLECT REWARD</span>
        </button>
      </div>
    </div>
  );
};
