import React from 'react';
import { LevelPerformanceProfile } from '../engine/LevelPerformanceProfile';
import { Star, Zap, Clock, Activity } from 'lucide-react';

export interface DebugPerformancePanelProps {
  levelId: number;
  profile: LevelPerformanceProfile;
  actualMoves?: number;
  actualDurationSeconds?: number;
  resultStars?: number;
  compact?: boolean;
}

export const DebugPerformancePanel: React.FC<DebugPerformancePanelProps> = ({
  levelId,
  profile,
  actualMoves,
  actualDurationSeconds,
  resultStars,
  compact = false,
}) => {
  const starsString = resultStars !== undefined
    ? resultStars === 3
      ? '⭐⭐⭐'
      : resultStars === 2
      ? '⭐⭐'
      : resultStars === 1
      ? '⭐'
      : '0★'
    : undefined;

  return (
    <div
      id={`debug-performance-panel-${levelId}`}
      className={`bg-slate-950/95 border border-amber-500/40 rounded-2xl p-3.5 text-xs text-slate-200 font-mono shadow-xl ${
        compact ? 'max-w-xs' : 'w-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-2">
        <span className="font-extrabold text-amber-300 flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Diagnostic Performance (Level {levelId})</span>
        </span>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
          DEV / QA
        </span>
      </div>

      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between py-0.5 border-b border-slate-800/60">
          <span className="text-slate-400">Level:</span>
          <span className="font-bold text-white">{levelId}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-slate-800/60">
          <span className="text-slate-400">Minimum:</span>
          <span className="font-bold text-teal-300">{profile.minimumMoves}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-slate-800/60">
          <span className="text-slate-400">3★ Threshold:</span>
          <span className="font-bold text-amber-300">{profile.threeStarMoves}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-slate-800/60">
          <span className="text-slate-400">2★ Threshold:</span>
          <span className="font-bold text-amber-400">{profile.twoStarMoves}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-slate-800/60">
          <span className="text-slate-400">1★ Threshold:</span>
          <span className="font-bold text-slate-300">{profile.oneStarMoves}</span>
        </div>
        {actualMoves !== undefined && (
          <div className="flex justify-between py-0.5 border-b border-slate-800/60">
            <span className="text-slate-400">Actual:</span>
            <span className="font-bold text-emerald-400">{actualMoves}</span>
          </div>
        )}
        {starsString !== undefined && (
          <div className="flex justify-between py-0.5 font-bold">
            <span className="text-slate-400">Result:</span>
            <span className="text-amber-400">{starsString}</span>
          </div>
        )}
      </div>
    </div>
  );
};
