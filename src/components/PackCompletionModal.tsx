import React from 'react';
import { Trophy, Star, Award, Coins, Gem, ArrowRight, ShieldCheck } from 'lucide-react';
import { globalAudioService } from '../services/AudioService';

interface PackCompletionModalProps {
  worldId: number;
  packId: string | number;
  packName: string;
  starsEarned: number;
  maxPackStars?: number;
  coinsReward?: number;
  gemsReward?: number;
  onContinue: () => void;
}

export const PackCompletionModal: React.FC<PackCompletionModalProps> = ({
  worldId,
  packId,
  packName,
  starsEarned,
  maxPackStars = 75,
  coinsReward = 500,
  gemsReward = 25,
  onContinue,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-teal-500/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5 relative overflow-hidden text-slate-100">
        {/* Glow Flares */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy Emblem */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-teal-600 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/30 border border-teal-200">
            <Trophy className="w-10 h-10 text-slate-950 stroke-[2.5] animate-bounce" />
          </div>
          <Star className="w-6 h-6 text-amber-400 fill-amber-400 absolute -top-1 -right-2 animate-pulse" />
        </div>

        {/* Title Header */}
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase text-teal-400 tracking-widest bg-teal-500/10 px-3 py-0.5 rounded-full border border-teal-500/30">
            WORLD {worldId} • PACK {packId} CONQUERED
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">{packName} Complete!</h2>
          <p className="text-xs text-slate-400">All 25 levels and the Pack Boss have been mastered.</p>
        </div>

        {/* Stars Earned in Pack */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-around">
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Pack Stars</div>
              <div className="text-base font-black text-white font-mono">
                {starsEarned} / {maxPackStars}
              </div>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Boss Result</div>
              <div className="text-base font-black text-teal-300">DEFEATED</div>
            </div>
          </div>
        </div>

        {/* Pack Completion Rewards */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
            Pack Mastery Bounty
          </span>
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 font-black text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>+{coinsReward}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-teal-500/10 px-3.5 py-1.5 rounded-xl border border-teal-500/30 text-teal-300 font-black text-sm">
              <Gem className="w-4 h-4 text-teal-400" />
              <span>+{gemsReward}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onContinue();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-400 active:scale-95 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center space-x-2 border border-teal-300/40"
        >
          <span>CONTINUE TO NEXT PACK</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
