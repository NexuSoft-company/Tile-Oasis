import React, { useState } from 'react';
import { globalMilestoneService } from '../services/MilestoneService';
import { globalAudioService } from '../services/AudioService';
import {
  X,
  Award,
  CheckCircle2,
  Coins,
  Gem,
  Zap,
} from 'lucide-react';

interface MilestonePanelProps {
  onClose: () => void;
  onClaimed?: () => void;
}

export const MilestonePanel: React.FC<MilestonePanelProps> = ({ onClose, onClaimed }) => {
  const [milestones, setMilestones] = useState(() =>
    globalMilestoneService.getMilestones()
  );
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleClaim = (msId: string) => {
    globalAudioService.emit('ButtonPressed');
    const res = globalMilestoneService.claimMilestoneReward(msId);
    if (res.success) {
      globalAudioService.emit('RewardReceived');
      setStatusMsg('Milestone reward claimed!');
      setMilestones(globalMilestoneService.getMilestones());
      if (onClaimed) onClaimed();
    } else {
      setStatusMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-slate-100 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 text-left pr-6">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>MILESTONES</span>
          </div>
          <h3 className="text-xl font-black text-white">Progression Milestones</h3>
          <p className="text-xs text-slate-400 font-medium">Reach major campaign milestones to claim rewards!</p>
        </div>

        {statusMsg && (
          <div className="bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold p-2.5 rounded-xl text-center">
            {statusMsg}
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-2.5">
          {milestones.map(({ definition: def, state }) => {
            const pct = Math.min(100, Math.round((state.currentProgress / def.targetProgress) * 100));

            return (
              <div
                key={def.id}
                className={`p-3.5 rounded-2xl border flex flex-col space-y-2 transition-all ${
                  state.isClaimed
                    ? 'bg-slate-950/50 border-slate-800/80 opacity-60'
                    : state.isCompleted
                    ? 'bg-slate-950 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-white">{def.title}</span>
                    <span className="text-[11px] text-slate-400">{def.description}</span>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center space-x-2 text-xs font-extrabold shrink-0">
                    <span className="flex items-center space-x-0.5 text-amber-300">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>+{def.rewardCoins}</span>
                    </span>
                    <span className="flex items-center space-x-0.5 text-teal-300">
                      <Gem className="w-3.5 h-3.5 text-teal-400" />
                      <span>+{def.rewardGems}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Claim Button */}
                <div className="flex items-center justify-between space-x-3 pt-1">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Progress</span>
                      <span>
                        {state.currentProgress} / {def.targetProgress} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {state.isClaimed ? (
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      CLAIMED
                    </span>
                  ) : state.isCompleted ? (
                    <button
                      onClick={() => handleClaim(def.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 active:scale-95 text-white font-black text-xs shadow-md shadow-indigo-500/20 transition-all border border-indigo-300/30 animate-pulse"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                      IN PROGRESS
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
