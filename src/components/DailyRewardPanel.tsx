import React, { useState } from 'react';
import { DailyRewardStatusReport } from '../services/DailyRewardService';
import { globalDailyRewardService } from '../services/DailyRewardService';
import { globalAudioService } from '../services/AudioService';
import {
  X,
  Calendar,
  Flame,
  CheckCircle2,
  Lock,
  Gift,
  Coins,
  Gem,
  Star,
} from 'lucide-react';

interface DailyRewardPanelProps {
  onClose: () => void;
  onClaimed?: () => void;
}

export const DailyRewardPanel: React.FC<DailyRewardPanelProps> = ({ onClose, onClaimed }) => {
  const [status, setStatus] = useState<DailyRewardStatusReport>(() =>
    globalDailyRewardService.getStatus()
  );
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const handleClaim = () => {
    globalAudioService.emit('ButtonPressed');
    const res = globalDailyRewardService.claimTodayReward();
    if (res.success) {
      globalAudioService.emit('RewardReceived');
      setClaimMessage(`Claimed! Received reward for Day ${status.currentDay}.`);
      setStatus(globalDailyRewardService.getStatus());
      if (onClaimed) onClaimed();
    } else {
      setClaimMessage(res.message);
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

        {/* Header Title */}
        <div className="text-center space-y-1.5 pr-8">
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md border border-amber-300/30">
            <Flame className="w-3.5 h-3.5 drop-shadow-md" />
            <span className="drop-shadow-md">Streak: {status.currentStreak} Days</span>
          </div>
          <h3 className="text-2xl font-black text-white drop-shadow-sm">DAILY REWARDS</h3>
          <p className="text-xs text-slate-300 font-medium">Log in daily to claim escalating rewards!</p>
        </div>

        {/* 7-Day Reward Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {status.allDays.map((dayConfig) => {
            const isToday = dayConfig.day === status.currentDay;
            const isClaimed = Boolean(status.claimedDays[dayConfig.day]);
            const isPast = dayConfig.day < status.currentDay;
            const isFuture = dayConfig.day > status.currentDay;

            return (
              <div
                key={dayConfig.day}
                className={`p-3 rounded-2xl border-b-[4px] flex flex-col items-center justify-between text-center relative transition-all backdrop-blur-sm ${
                  isToday
                    ? 'bg-gradient-to-b from-teal-500/20 to-emerald-600/20 border-emerald-600/80 shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/30 transform scale-105'
                    : isClaimed || isPast
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-80'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:bg-slate-800/90'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider ${isToday ? 'text-teal-300 drop-shadow-sm' : 'text-slate-400'}`}>
                  Day {dayConfig.day}
                </span>

                <div className="my-2 flex flex-col items-center space-y-1">
                  {dayConfig.day === 7 ? (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 p-[2px] shadow-lg">
                       <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                          <Gift className="w-6 h-6 text-amber-400 drop-shadow-md animate-bounce" />
                       </div>
                    </div>
                  ) : (
                    <Star className={`w-6 h-6 drop-shadow-sm ${isToday ? 'text-teal-300 fill-teal-300' : 'text-slate-500'}`} />
                  )}
                  <div className="flex items-center space-x-1 text-xs font-black text-white mt-2 bg-slate-950/50 px-2 py-0.5 rounded-md border border-slate-700 shadow-inner">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>+{dayConfig.coins}</span>
                  </div>
                </div>

                {isClaimed ? (
                  <div className="flex items-center space-x-1 text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 shadow-sm mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 drop-shadow-sm" />
                    <span>Claimed</span>
                  </div>
                ) : isToday && status.isEligible ? (
                  <div className="text-[10px] font-black text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 px-3 py-1 rounded-md shadow-md animate-pulse border border-emerald-300 mt-1">
                    READY
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-[10px] font-black text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800 mt-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Message Toast */}
        {claimMessage && (
          <div className="bg-emerald-900/60 border-b-[3px] border-emerald-500 text-emerald-300 text-xs font-black p-3 rounded-2xl text-center shadow-lg backdrop-blur-sm">
            {claimMessage}
          </div>
        )}

        {/* Primary Action Button */}
        {status.isEligible ? (
          <button
            onClick={handleClaim}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 active:translate-y-1 active:border-b-0 text-slate-950 font-black text-sm shadow-lg border-b-[4px] border-emerald-700 transition-all flex items-center justify-center space-x-2 drop-shadow-md animate-bounce"
          >
            <Gift className="w-5 h-5 drop-shadow-sm" />
            <span>CLAIM DAY {status.currentDay} REWARD</span>
          </button>
        ) : (
          <div className="w-full py-3 rounded-2xl bg-slate-800/80 text-slate-400 font-black text-xs text-center border-b-[3px] border-slate-900 shadow-inner">
            Next Reward Ready Tomorrow
          </div>
        )}
      </div>
    </div>
  );
};
