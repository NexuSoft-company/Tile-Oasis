import React from 'react';
import { Swords, AlertTriangle, Shield, Trophy, Play, X } from 'lucide-react';
import { globalAudioService } from '../services/AudioService';

interface BossIntroModalProps {
  levelId: number;
  bossName?: string;
  archetype?: string;
  onStart: () => void;
  onCancel: () => void;
}

export const BossIntroModal: React.FC<BossIntroModalProps> = ({
  levelId,
  bossName,
  archetype = 'Layered Fortress & Obstacles',
  onStart,
  onCancel,
}) => {
  const packNumber = Math.ceil(levelId / 25);
  const derivedBossName =
    bossName ||
    (levelId === 25
      ? 'Verdant Forest Golem'
      : levelId === 50
      ? 'Emerald Canopy Serpent'
      : levelId === 75
      ? 'Cascading Storm Leviathan'
      : levelId === 100
      ? 'World 1 Sanctuary Colossus'
      : levelId === 9999
      ? 'The Celestial Sovereign'
      : `Pack ${packNumber} Boss Titan`);

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border-b-[6px] border-rose-700/80 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5 relative overflow-hidden text-slate-100"
           style={{
             backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(67, 20, 34, 0.9)), url(/feature-graphic.png)',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}>
        {/* Glow Flare */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all border-b-[3px] border-slate-900 active:translate-y-0.5 active:border-b-0 shadow-lg"
        >
          <X className="w-5 h-5 drop-shadow-md" />
        </button>

        {/* Boss Emblem */}
        <div className="relative inline-block mt-4">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-rose-600 via-red-500 to-rose-700 flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/40 border-b-[4px] border-rose-900">
            <Swords className="w-12 h-12 text-white stroke-[2.5] animate-pulse drop-shadow-md" />
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-400 fill-amber-500/20 absolute -top-2 -right-3 animate-bounce drop-shadow-md" />
        </div>

        {/* Boss Title */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase text-rose-300 tracking-widest bg-rose-500/20 px-4 py-1 rounded-md border border-rose-500/30 shadow-sm drop-shadow-sm">
            PACK BOSS CLASH • LEVEL {levelId}
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{derivedBossName}</h2>
          <p className="text-sm text-rose-300 font-black drop-shadow-sm">Special Challenge: {archetype}</p>
        </div>

        {/* Mechanics & Objective */}
        <div className="bg-slate-950/80 p-4 rounded-3xl border-b-[4px] border-slate-800 space-y-3 text-left shadow-inner backdrop-blur-sm">
          <div className="flex items-start space-x-3 bg-slate-900/50 p-2.5 rounded-2xl border border-slate-800/80">
            <Shield className="w-5 h-5 text-rose-400 mt-0.5 shrink-0 drop-shadow-sm" />
            <div className="text-xs text-slate-300 space-y-0.5">
              <span className="font-black text-white block tracking-wide">Boss Guard Mechanics:</span>
              <span className="leading-tight block">Deep multi-layer layout with covered anchor tiles. Plan your matches carefully!</span>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-slate-900/50 p-2.5 rounded-2xl border border-slate-800/80">
            <Trophy className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 drop-shadow-sm" />
            <div className="text-xs text-slate-300 space-y-0.5">
              <span className="font-black text-amber-300 block tracking-wide">Victory Bounty:</span>
              <span className="leading-tight block font-bold text-emerald-300">Pack Complete Trophy, +500 Bonus XP, +25 Gems & Exclusive Badges!</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onStart();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 active:translate-y-1 active:border-b-0 text-white font-black text-base shadow-xl border-b-[5px] border-rose-800 transition-all flex items-center justify-center space-x-2 drop-shadow-md"
        >
          <Play className="w-5 h-5 fill-white" />
          <span className="tracking-wide">START BOSS CHALLENGE</span>
        </button>
      </div>
    </div>
  );
};
