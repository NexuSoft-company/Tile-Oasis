import React, { useState } from 'react';
import { globalAchievementService } from '../services/AchievementService';
import { globalAudioService } from '../services/AudioService';
import {
  X,
  Trophy,
  CheckCircle2,
  Coins,
  Gem,
  Award,
  Star,
  Zap,
} from 'lucide-react';

interface AchievementPanelProps {
  onClose: () => void;
  onClaimed?: () => void;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ onClose, onClaimed }) => {
  const [achievements, setAchievements] = useState(() =>
    globalAchievementService.getAchievements()
  );
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleClaim = (achId: string) => {
    globalAudioService.emit('ButtonPressed');
    const res = globalAchievementService.claimAchievementReward(achId);
    if (res.success) {
      globalAudioService.emit('RewardReceived');
      setStatusMsg('Achievement reward claimed!');
      setAchievements(globalAchievementService.getAchievements());
      if (onClaimed) onClaimed();
    } else {
      setStatusMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in">
      <div className="bg-slate-900 border-b-[6px] border-amber-600/50 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-slate-100 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto relative"
           style={{
             backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.95)), url(/feature-graphic.png)',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors border-b-[3px] border-slate-900 active:translate-y-0.5 active:border-b-0 shadow-lg"
        >
          <X className="w-5 h-5 drop-shadow-md" />
        </button>

        {/* Title */}
        <div className="space-y-1.5 text-left pr-8">
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md border border-amber-300/30">
            <Trophy className="w-3.5 h-3.5 drop-shadow-md" />
            <span className="drop-shadow-md">ACHIEVEMENTS</span>
          </div>
          <h3 className="text-2xl font-black text-white drop-shadow-sm">Honor & Trophies</h3>
          <p className="text-xs text-slate-300 font-medium">Unlock lifetime milestones for massive rewards!</p>
        </div>

        {statusMsg && (
          <div className="bg-emerald-900/60 border-b-[3px] border-emerald-500 text-emerald-300 text-xs font-black p-3 rounded-2xl text-center shadow-lg backdrop-blur-sm">
            {statusMsg}
          </div>
        )}

        {/* Achievements List */}
        <div className="space-y-3">
          {achievements.map(({ definition: def, state }) => {
            const pct = Math.min(100, Math.round((state.currentProgress / def.targetProgress) * 100));

            return (
              <div
                key={def.id}
                className={`p-4 rounded-2xl border-b-[4px] flex flex-col space-y-3 transition-all backdrop-blur-sm shadow-lg ${
                  state.isClaimed
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : state.isCompleted
                    ? 'bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-amber-900/20 border-amber-600/60 shadow-amber-900/20'
                    : 'bg-slate-900/80 border-slate-700/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col text-left">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-sm font-black text-white drop-shadow-sm">{def.title}</span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 uppercase shadow-inner border border-slate-700">
                        {def.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300 font-medium mt-1 leading-tight">{def.description}</span>
                  </div>

                  {/* Rewards */}
                  <div className="flex flex-col items-end space-y-1 text-xs font-black shrink-0">
                    <span className="flex items-center space-x-1 text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/40 shadow-sm">
                      <Coins className="w-4 h-4 fill-amber-400/20" />
                      <span>+{def.rewardCoins}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded-lg border border-teal-500/40 shadow-sm">
                      <Gem className="w-4 h-4 fill-teal-400/20" />
                      <span>+{def.rewardGems}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Claim Button */}
                <div className="flex items-center justify-between space-x-3 pt-2">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black text-slate-300">
                      <span>Progress</span>
                      <span className="text-amber-400">
                        {state.currentProgress} / {def.targetProgress} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {state.isClaimed ? (
                    <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/40 shadow-sm flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CLAIMED</span>
                    </span>
                  ) : state.isCompleted ? (
                    <button
                      onClick={() => handleClaim(def.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md border-b-[3px] border-orange-700 active:translate-y-1 active:border-b-0 transition-all animate-pulse drop-shadow-md"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <span className="text-[11px] font-black text-slate-500 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 shadow-inner">
                      LOCKED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
