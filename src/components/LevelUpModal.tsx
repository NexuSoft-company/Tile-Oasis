import React from 'react';
import { Star, Award, Coins, Gem, ArrowRight, Zap } from 'lucide-react';
import { LevelUpReward } from '../services/PlayerProgressionService';
import { globalAudioService } from '../services/AudioService';

interface LevelUpModalProps {
  reward: LevelUpReward;
  onClaim: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ reward, onClaim }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border-b-[6px] border-amber-600/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5 relative overflow-hidden text-slate-100"
           style={{
             backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.95)), url(/feature-graphic.png)',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}>
        {/* Glow Flare */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Level Badge Emblem */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 border-b-[4px] border-amber-700">
            <span className="text-4xl font-black text-slate-950 font-mono drop-shadow-sm">
              {reward.level}
            </span>
          </div>
          <Star className="w-8 h-8 text-amber-400 fill-amber-400 absolute -top-2 -right-3 animate-bounce drop-shadow-md" />
        </div>

        {/* Title & Rank Subtitle */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase text-amber-300 tracking-widest bg-amber-500/20 px-3 py-1 rounded-md border border-amber-500/30 shadow-sm drop-shadow-sm">
            PLAYER RANK ADVANCEMENT
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">PLAYER LEVEL {reward.level}!</h2>
          <p className="text-sm text-amber-300 font-black drop-shadow-sm">{reward.unlockedTitle}</p>
        </div>

        {/* Level Up Rewards */}
        <div className="bg-slate-950/80 p-5 rounded-3xl border-b-[4px] border-slate-800 space-y-4 shadow-inner backdrop-blur-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block drop-shadow-sm">
            Rank Promotion Rewards Granted
          </span>
          <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/40 text-amber-300 font-black text-sm shadow-sm">
              <Coins className="w-5 h-5 text-amber-400 drop-shadow-sm" />
              <span className="drop-shadow-sm">+{reward.coins}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-teal-500/20 px-4 py-2 rounded-xl border border-teal-500/40 text-teal-300 font-black text-sm shadow-sm">
              <Gem className="w-5 h-5 text-teal-400 drop-shadow-sm" />
              <span className="drop-shadow-sm">+{reward.gems}</span>
            </div>
            {Object.entries(reward.boosters).map(([bType, count]) =>
              typeof count === 'number' && count > 0 ? (
                <div
                  key={bType}
                  className="flex items-center space-x-1.5 bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-500/40 text-indigo-300 font-black text-sm shadow-sm"
                >
                  <Zap className="w-4 h-4 text-indigo-400 drop-shadow-sm" />
                  <span className="capitalize drop-shadow-sm">+{count} {bType}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onClaim();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:translate-y-1 active:border-b-0 text-slate-950 font-black text-base shadow-xl border-b-[5px] border-orange-700 transition-all flex items-center justify-center space-x-2 drop-shadow-md animate-bounce"
        >
          <span className="tracking-wide">CLAIM & CONTINUE</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
