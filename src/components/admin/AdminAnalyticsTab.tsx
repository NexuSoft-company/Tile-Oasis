/**
 * Analytics & Operational Insights Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 *
 * DATA HONESTY:
 * - Real local telemetry is calculated directly from on-device play session, inventory, and AdMob logs.
 * - Multi-device cloud network stats are honestly reported as "NOT CONNECTED".
 * - Level drop-off metrics are explicitly presented as the Level Design Benchmark Calibration Model.
 */

import React, { useState } from 'react';
import {
  globalAdminAnalyticsService,
  AnalyticsTimeRange,
} from '../../services/admin/AdminAnalyticsService';
import {
  BarChart3,
  TrendingUp,
  Zap,
  PlayCircle,
  Trophy,
  AlertTriangle,
  Coins,
  Gem,
  CheckCircle2,
  Clock,
  WifiOff,
  Database,
  Layers,
} from 'lucide-react';

export const AdminAnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('7_DAYS');

  const metrics = globalAdminAnalyticsService.getMetrics(timeRange);
  const boosters = globalAdminAnalyticsService.getBoosterUsage(timeRange);
  const highDropoff = globalAdminAnalyticsService.getHighFailureLevels();
  const rewardClaims = globalAdminAnalyticsService.getRewardClaimBreakdown();

  const totalBoosters =
    boosters.undo +
    boosters.shuffle +
    boosters.magnet +
    boosters.extra_slot +
    boosters.freeze +
    boosters.hint +
    boosters.auto_match;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Honest Source Tag */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              <span>Telemetry Analytics & Drop-Off Diagnostics</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[10px] text-amber-300 border border-amber-500/40 font-mono font-bold">
              LOCAL DATA ONLY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real device telemetry from active playthroughs and sandbox game engine verification.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['TODAY', '7_DAYS', '30_DAYS', 'ALL_TIME'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === r
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cloud Connectivity Status Alert */}
      <div className="p-4 bg-slate-900/70 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center space-x-2">
              <span>Cloud Telemetry Server: Disconnected</span>
              <span className="text-[10px] font-mono text-amber-400 font-semibold">[LOCAL DEVICE ONLY]</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Multi-device aggregated DAU, MAU, and cohort retention require a central Firestore or BigQuery telemetry sink.
            </p>
          </div>
        </div>
        <div className="text-right font-mono text-[10px] text-slate-400">
          Backend Status: <strong className="text-amber-300">STANDALONE OFFLINE</strong>
        </div>
      </div>

      {/* Real Local KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Local Profiles</span>
            <span className="text-[9px] font-mono text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-500/30">
              REAL
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{metrics.localUsersCount}</div>
          <span className="text-[11px] text-slate-400 font-medium">
            Active: <strong className="text-emerald-300">{metrics.localActiveUsers} profiles</strong>
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Levels Completed</span>
            <span className="text-[9px] font-mono text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-500/30">
              REAL
            </span>
          </div>
          <div className="text-2xl font-black text-teal-300 font-mono">
            {metrics.localLevelsCompleted}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Stars: <strong className="text-amber-300">{metrics.localStarsEarned}</strong>
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Ad Video Completions</span>
            <span className="text-[9px] font-mono text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-500/30">
              REAL
            </span>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            {metrics.localRewardedAdsWatched}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Impressions: <strong className="text-white">{metrics.localAdImpressions}</strong>
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Global DAU / MAU</span>
            <span className="text-[9px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30">
              NO DATA
            </span>
          </div>
          <div className="text-base font-black text-slate-400 font-mono pt-1">
            NOT CONNECTED
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Requires Central Analytics
          </span>
        </div>
      </div>

      {/* 2-Column Insights Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Local Booster Consumption */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white">Local Booster Inventory & Activations</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total Recorded: <strong className="text-white">{totalBoosters}</strong>
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Undo', count: boosters.undo },
              { name: 'Shuffle', count: boosters.shuffle },
              { name: 'Magnet', count: boosters.magnet },
              { name: 'Extra Slot', count: boosters.extra_slot },
              { name: 'Freeze', count: boosters.freeze },
              { name: 'Hint', count: boosters.hint },
              { name: 'Auto-Match', count: boosters.auto_match },
            ].map((item) => {
              const pct = Math.round((item.count / Math.max(1, totalBoosters)) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200 uppercase text-[11px]">
                      {item.name}
                    </span>
                    <span className="font-mono text-slate-400">
                      <strong className="text-white">{item.count}</strong> uses ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Difficulty Benchmark Calibration Model */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-black text-white">Level Difficulty Calibration Model</h3>
                <span className="text-[10px] text-amber-300 font-mono block">
                  [BENCHMARK ESTIMATE • DESIGN MODEL]
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              Balancing Spec
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Expected difficulty drop-off curves modeled during puzzle level design. Used by Admin AI Assistant to recommend tile density calibrations:
          </p>

          <div className="divide-y divide-slate-800/80">
            {highDropoff.map((lvl) => (
              <div key={lvl.levelId} className="py-2.5 flex items-start justify-between text-xs gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-white font-mono">Level {lvl.levelId}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({lvl.benchmarkDifficultyRating})</span>
                  </div>
                  <div className="text-[11px] text-teal-300/90">
                    💡 Tuning: {lvl.recommendedTuning}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-black font-mono text-xs">
                    {lvl.expectedFailureRatePct}% fail exp.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Claim Channels Breakdown */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-black text-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Reward Distribution Vector Breakdown</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Verified Local Sinks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {rewardClaims.map((item) => (
            <div key={item.name} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block truncate">{item.name}</span>
              <div className="text-sm font-black text-amber-300 font-mono">
                {item.count} claims
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {item.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
