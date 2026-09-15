import React from 'react';
import { Crown, Star, Award, Coins, Gem, ArrowRight, MapPin, Layers } from 'lucide-react';
import { globalAudioService } from '../services/AudioService';

interface WorldCompletionModalProps {
  worldId: number;
  worldName: string;
  totalStarsEarned: number;
  levelsCompleted: number;
  coinsReward?: number;
  gemsReward?: number;
  onContinue: () => void;
}

export const WorldCompletionModal: React.FC<WorldCompletionModalProps> = ({
  worldId,
  worldName,
  totalStarsEarned,
  levelsCompleted = 100,
  coinsReward = 2000,
  gemsReward = 100,
  onContinue,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5 relative overflow-hidden text-slate-100">
        {/* Glow Flares */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Crown Emblem */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/40 border-2 border-amber-200">
            <Crown className="w-11 h-11 text-slate-950 stroke-[2.5] animate-pulse" />
          </div>
          <Star className="w-7 h-7 text-yellow-300 fill-yellow-300 absolute -top-2 -right-2 animate-bounce" />
        </div>

        {/* World Title & Subtitle */}
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase text-amber-400 tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30">
            WORLD {worldId} FULLY RESTORED
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">{worldName} Mastered!</h2>
          <p className="text-xs text-slate-300">
            All {levelsCompleted} levels complete. Sanctuary Memory Shard unlocked!
          </p>
        </div>

        {/* World Performance Stats */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/90 p-3 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center p-2 bg-slate-900/60 rounded-xl border border-slate-800">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Stars Earned</span>
            <span className="text-sm font-black text-white font-mono">{totalStarsEarned} / 300</span>
          </div>

          <div className="flex flex-col items-center p-2 bg-slate-900/60 rounded-xl border border-slate-800">
            <Layers className="w-5 h-5 text-teal-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Levels Cleared</span>
            <span className="text-sm font-black text-teal-300 font-mono">100 / 100</span>
          </div>
        </div>

        {/* World Mastery Grand Reward */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
            World Restoration Grand Bounty
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

        {/* Continue to Next World */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onContinue();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center space-x-2 border border-yellow-200"
        >
          <MapPin className="w-4 h-4 text-slate-950" />
          <span>JOURNEY TO WORLD {worldId + 1}</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
