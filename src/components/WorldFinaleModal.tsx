import React from 'react';
import { Crown, Trophy, Star, Award, Layers, Globe, ArrowRight } from 'lucide-react';
import { globalAudioService } from '../services/AudioService';

interface WorldFinaleModalProps {
  totalStars: number;
  totalLevelsCompleted: number;
  onViewAchievements: () => void;
}

export const WorldFinaleModal: React.FC<WorldFinaleModalProps> = ({
  totalStars,
  totalLevelsCompleted = 9999,
  onViewAchievements,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950 border-2 border-yellow-400/80 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl space-y-5 relative overflow-hidden text-slate-100">
        {/* Stellar Cosmic Glow Flares */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Grand Crown */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/50 border-2 border-yellow-100">
            <Crown className="w-14 h-14 text-slate-950 stroke-[2.5] animate-pulse" />
          </div>
          <Star className="w-8 h-8 text-yellow-300 fill-yellow-300 absolute -top-2 -right-3 animate-bounce" />
        </div>

        {/* Campaign Header */}
        <div className="space-y-1.5">
          <span className="text-xs font-black uppercase text-yellow-400 tracking-widest bg-yellow-500/15 px-4 py-1 rounded-full border border-yellow-500/40">
            SUPREME CAMPAIGN CONQUEST
          </span>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 tracking-tight">
            MASTER OF THE COSMOS!
          </h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            You have conquered all 100 Worlds, 400 Packs, and 9,999 Levels of Tile Oasis: Sanctuary Match!
          </p>
        </div>

        {/* Hall of Fame Summary */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-3 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <Globe className="w-5 h-5 text-teal-400 mb-1" />
            <span className="text-[9px] text-slate-400 uppercase font-bold">Worlds</span>
            <span className="text-sm font-black text-white font-mono">100 / 100</span>
          </div>

          <div className="flex flex-col items-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <Layers className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[9px] text-slate-400 uppercase font-bold">Levels</span>
            <span className="text-sm font-black text-amber-300 font-mono">9,999</span>
          </div>

          <div className="flex flex-col items-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mb-1" />
            <span className="text-[9px] text-slate-400 uppercase font-bold">Stars</span>
            <span className="text-sm font-black text-white font-mono">{totalStars}</span>
          </div>
        </div>

        {/* Supreme Rewards */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider block">
            Celestial Sovereign Trophy & Frame Awarded
          </span>
          <p className="text-xs text-slate-400">
            Unlocked exclusive Legendary "Celestial Sovereign" Avatar Frame & Master of Cosmos Crest!
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onViewAchievements();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-sm shadow-xl shadow-yellow-500/30 transition-all flex items-center justify-center space-x-2 border border-yellow-200"
        >
          <Trophy className="w-5 h-5 text-slate-950" />
          <span>VIEW COLLECTION & TROPHIES</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
