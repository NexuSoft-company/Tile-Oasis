import React, { useState, useMemo } from 'react';
import {
  X,
  Trophy,
  Crown,
  Medal,
  Star,
  Flame,
  Award,
  Shield,
  ChevronRight,
  TrendingUp,
  Clock,
  Gem,
  Coins,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { globalRankingService, RANKING_TIERS, LeaderboardEntry, RankingTierInfo } from '../services/RankingService';
import { globalAudioService } from '../services/AudioService';
import { PlayerSaveData } from '../types/gameEngine';

interface RankingModalProps {
  saveData: PlayerSaveData;
  onClose: () => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({ saveData, onClose }) => {
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'TOURNAMENT' | 'TIERS'>('GLOBAL');

  const currentLevel = saveData.currentLevel || 1;
  const totalStars = saveData.starsTotal || 0;

  const currentTier = useMemo(
    () => globalRankingService.getPlayerTier(currentLevel, totalStars),
    [currentLevel, totalStars]
  );

  const tierProgress = useMemo(
    () => globalRankingService.getNextTierProgress(currentLevel, totalStars),
    [currentLevel, totalStars]
  );

  const globalData = useMemo(() => globalRankingService.getGlobalLeaderboard(), []);
  const tournamentData = useMemo(() => globalRankingService.getTournamentInfo(), []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans select-none animate-in fade-in">
      <div className="bg-slate-900 border-b-[6px] border-amber-600/50 rounded-3xl w-full max-w-md shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden"
           style={{
             backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.98)), url(/feature-graphic.png)',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}
      >
        {/* ========================================================= */}
        {/* 1. HEADER                                                 */}
        {/* ========================================================= */}
        <div className="bg-slate-950/80 border-b-[3px] border-amber-600/40 px-4 py-3 flex items-center justify-between shrink-0 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-lg border-b-[3px] border-amber-800">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black">
                <Trophy className="w-6 h-6 text-amber-400 drop-shadow-md" />
              </div>
            </div>
            <div className="flex flex-col text-left space-y-0.5">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white drop-shadow-sm">Sanctuary Rankings</h3>
                <span className="text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-md font-black border border-white/20 shadow-sm uppercase tracking-wider">
                  {currentTier.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Compete with Sanctuary Explorers worldwide</p>
            </div>
          </div>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border-b-[3px] border-slate-900 active:translate-y-0.5 active:border-b-0 shadow-lg"
          >
            <X className="w-5 h-5 drop-shadow-md" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. TAB SWITCHER                                           */}
        {/* ========================================================= */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 border-b border-white/10 shrink-0">
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('GLOBAL');
            }}
            className={`py-2 px-2 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1 border-b-[3px] active:translate-y-0.5 active:border-b-0 ${
              activeTab === 'GLOBAL'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 border-emerald-700 shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className={`w-3.5 h-3.5 ${activeTab === 'GLOBAL' ? 'drop-shadow-sm' : ''}`} />
            <span className={activeTab === 'GLOBAL' ? 'drop-shadow-sm' : ''}>Global</span>
          </button>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('TOURNAMENT');
            }}
            className={`py-2 px-2 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1 border-b-[3px] active:translate-y-0.5 active:border-b-0 ${
              activeTab === 'TOURNAMENT'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-orange-700 shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${activeTab === 'TOURNAMENT' ? 'drop-shadow-sm' : ''}`} />
            <span className={activeTab === 'TOURNAMENT' ? 'drop-shadow-sm' : ''}>Tournament</span>
          </button>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('TIERS');
            }}
            className={`py-2 px-2 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1 border-b-[3px] active:translate-y-0.5 active:border-b-0 ${
              activeTab === 'TIERS'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-purple-700 shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${activeTab === 'TIERS' ? 'drop-shadow-sm' : ''}`} />
            <span className={activeTab === 'TIERS' ? 'drop-shadow-sm tracking-wide' : ''}>Tiers & Perks</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 3. TAB CONTENT (SCROLLABLE)                                */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {/* ------------------------------------------------------- */}
          {/* TAB 1: GLOBAL RANKINGS                                  */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'GLOBAL' && (
            <div className="space-y-4">
              {/* TOP 3 PODIUM */}
              <div className="bg-slate-950/80 p-3 rounded-3xl border-b-[4px] border-slate-800 flex items-end justify-center space-x-2 pt-8 pb-3 shadow-inner">
                {/* #2 Silver */}
                {globalData.top3[1] && (
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-500 p-[3px] shadow-lg border-b-[3px] border-slate-600">
                        <div className="w-full h-full bg-slate-900 rounded-[8px] flex items-center justify-center font-black text-slate-200 text-sm shadow-inner">
                          {(globalData.top3[1]?.name || 'P').substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <span className="absolute -top-3 -right-2 text-xl drop-shadow-md">🥈</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-200 truncate max-w-[80px] drop-shadow-sm">
                      {globalData.top3[1].name}
                    </span>
                    <span className="text-[10px] text-amber-400 font-black flex items-center bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 mt-0.5 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5 drop-shadow-sm" />
                      {globalData.top3[1].stars}★
                    </span>
                    <div className="h-16 w-full bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-[3px] border-slate-500 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-300 text-sm shadow-inner">
                      #2
                    </div>
                  </div>
                )}

                {/* #1 Gold (Champion) */}
                {globalData.top3[0] && (
                  <div className="flex flex-col items-center flex-1 z-10 -mt-3">
                    <Crown className="w-6 h-6 text-amber-400 animate-bounce mb-1 drop-shadow-md" />
                    <div className="relative mb-2">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-[3px] shadow-lg shadow-amber-500/30 border-b-[3px] border-amber-600">
                        <div className="w-full h-full bg-slate-900 rounded-[8px] flex items-center justify-center font-black text-amber-300 text-base shadow-inner">
                          {(globalData.top3[0]?.name || 'P').substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <span className="absolute -top-3 -right-2 text-2xl drop-shadow-md">🥇</span>
                    </div>
                    <span className="text-sm font-black text-amber-300 truncate max-w-[90px] drop-shadow-sm">
                      {globalData.top3[0].name}
                    </span>
                    <span className="text-[11px] text-amber-400 font-black flex items-center bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 mt-0.5 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 mr-1 drop-shadow-sm" />
                      {globalData.top3[0].stars}★
                    </span>
                    <div className="h-20 w-full bg-gradient-to-b from-amber-500/40 to-amber-600/20 border-t-[3px] border-amber-400 rounded-t-xl mt-2 flex items-center justify-center font-black text-amber-300 text-base shadow-inner">
                      #1
                    </div>
                  </div>
                )}

                {/* #3 Bronze */}
                {globalData.top3[2] && (
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-900 p-[3px] shadow-md border-b-[3px] border-amber-950">
                        <div className="w-full h-full bg-slate-900 rounded-[8px] flex items-center justify-center font-black text-amber-600 text-sm shadow-inner">
                          {(globalData.top3[2]?.name || 'P').substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <span className="absolute -top-3 -right-2 text-xl drop-shadow-md">🥉</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-300 truncate max-w-[80px] drop-shadow-sm">
                      {globalData.top3[2].name}
                    </span>
                    <span className="text-[10px] text-amber-400 font-black flex items-center bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 mt-0.5 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5 drop-shadow-sm" />
                      {globalData.top3[2].stars}★
                    </span>
                    <div className="h-10 w-full bg-gradient-to-t from-slate-800 to-slate-800/80 border-t-[3px] border-slate-700 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-400 text-sm shadow-inner">
                      #3
                    </div>
                  </div>
                )}
              </div>

              {/* LEADERBOARD LIST */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-black px-4 uppercase tracking-wider">
                  <span>RANK & PLAYER</span>
                  <span>PROGRESSION</span>
                </div>

                {globalData.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border-b-[4px] transition-all backdrop-blur-sm shadow-sm ${
                      entry.isCurrentPlayer
                        ? 'bg-gradient-to-r from-teal-500/10 via-slate-900/80 to-teal-900/20 border-teal-600/60 shadow-teal-900/20'
                        : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`w-6 text-center font-black text-xs ${
                          entry.rank === 1
                            ? 'text-amber-400'
                            : entry.rank === 2
                            ? 'text-slate-300'
                            : entry.rank === 3
                            ? 'text-amber-600'
                            : entry.isCurrentPlayer
                            ? 'text-teal-400'
                            : 'text-slate-500'
                        }`}
                      >
                        #{entry.rank}
                      </span>

                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {(entry?.name || 'P').substring(0, 2).toUpperCase()}
                      </div>

                      <div className="flex flex-col text-left">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`text-xs font-bold truncate max-w-[120px] sm:max-w-[150px] ${
                              entry.isCurrentPlayer ? 'text-teal-300 font-black' : 'text-slate-200'
                            }`}
                          >
                            {entry.name}
                          </span>
                          {entry.isCurrentPlayer && (
                            <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 rounded-full font-extrabold border border-teal-500/30">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {entry.countryCode} · {entry.tier}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1 text-amber-400 font-black text-xs">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{entry.stars}</span>
                        </div>
                        <span className="text-[10px] text-teal-400 font-bold">Lvl {entry.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 2: WEEKLY TOURNAMENT                                */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'TOURNAMENT' && (
            <div className="space-y-4">
              {/* TOURNAMENT HERO BANNER */}
              <div className="bg-slate-900/80 border-b-[4px] border-amber-700 p-4 rounded-3xl space-y-3 text-left backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border-b-[3px] border-amber-600/40 flex items-center justify-center shadow-inner">
                      <Flame className="w-6 h-6 text-amber-400 drop-shadow-md animate-pulse" />
                    </div>
                    <h4 className="text-base font-black text-white drop-shadow-sm">{tournamentData.divisionName}</h4>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px] text-amber-300 font-black bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/40 shadow-sm">
                    <Clock className="w-3.5 h-3.5 drop-shadow-sm" />
                    <span className="drop-shadow-sm tracking-wide">Ends in {tournamentData.seasonEndsInHours}h</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-tight">
                  Top 5 promote to next League and win <span className="text-teal-300 font-black drop-shadow-sm">50 Gems</span> +{' '}
                  <span className="text-amber-300 font-black drop-shadow-sm">2,500 Coins</span>!
                </p>

                <div className="bg-slate-950/80 p-3 rounded-2xl border-b-[3px] border-slate-800 flex items-center justify-between text-xs shadow-inner">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-black">Your Standing:</span>
                    <span className="font-black text-amber-400 text-base drop-shadow-sm">#{tournamentData.playerRank}</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl shadow-sm ${
                      tournamentData.playerRank <= tournamentData.promotionThresholdRank
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tournamentData.playerRank <= tournamentData.promotionThresholdRank
                      ? '⚡ PROMOTION ZONE'
                      : 'SAFE ZONE'}
                  </span>
                </div>
              </div>

              {/* TOURNAMENT ROWS */}
              <div className="space-y-2">
                {tournamentData.entries.slice(0, 15).map((entry) => {
                  const isPromotion = entry.rank <= tournamentData.promotionThresholdRank;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border-b-[4px] transition-all backdrop-blur-sm shadow-sm ${
                        entry.isCurrentPlayer
                          ? 'bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-orange-500/10 border-orange-600/60 shadow-orange-900/20'
                          : isPromotion
                          ? 'bg-slate-900/90 border-emerald-600/40 border-b-emerald-700/60'
                          : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`w-6 text-center font-black text-xs ${
                            isPromotion ? 'text-emerald-400 font-black' : 'text-slate-500'
                          }`}
                        >
                          #{entry.rank}
                        </span>

                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                          {(entry?.name || 'P').substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex flex-col text-left">
                          <span
                            className={`text-xs font-bold truncate max-w-[130px] ${
                              entry.isCurrentPlayer ? 'text-amber-300 font-black' : 'text-slate-200'
                            }`}
                          >
                            {entry.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {isPromotion ? 'Promotes to Next League' : 'Division Contender'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 text-amber-400 font-black text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{entry.stars} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 3: TIERS & PERKS                                    */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'TIERS' && (
            <div className="space-y-4 text-left">
              {/* CURRENT TIER HERO */}
              <div className="bg-slate-900/80 border-b-[4px] border-indigo-700 p-4 rounded-3xl space-y-4 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 border-b-[3px] border-indigo-600/40 p-0.5 shadow-inner flex items-center justify-center">
                      <div className="w-full h-full bg-slate-900/80 rounded-[8px] flex items-center justify-center font-black">
                        <Crown className="w-6 h-6 text-indigo-400 drop-shadow-md" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-base font-black text-white drop-shadow-sm">{currentTier.name}</h4>
                      <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">Active Sanctuary Status</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end space-y-1">
                    <span className="text-xs font-black text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">Level {currentLevel}</span>
                    <div className="flex items-center text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span>{totalStars}★</span>
                    </div>
                  </div>
                </div>

                {/* Progress to Next Tier */}
                {tierProgress.nextTier && (
                  <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-2xl border-b-[3px] border-slate-800 shadow-inner">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-slate-300">Progress to <span className="text-white drop-shadow-sm">{tierProgress.nextTier.name}</span></span>
                      <span className="text-teal-400 font-black">{tierProgress.overallPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                        style={{ width: `${Math.max(6, tierProgress.overallPercent)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>Requires Level {tierProgress.nextTier.minLevel}</span>
                      <span>Or {tierProgress.nextTier.minStars} Total Stars</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ALL TIERS LIST */}
              <div className="space-y-2.5">
                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
                  League Ladder & Rewards
                </h5>

                {RANKING_TIERS.map((tier) => {
                  const isCurrent = tier.id === currentTier.id;
                  const isUnlocked = currentLevel >= tier.minLevel || totalStars >= tier.minStars;

                  return (
                    <div
                      key={tier.id}
                      className={`p-3 rounded-2xl border-b-[4px] transition-all backdrop-blur-sm ${
                        isCurrent
                          ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md shadow-indigo-900/20'
                          : isUnlocked
                          ? 'bg-slate-900/80 border-slate-700/80'
                          : 'bg-slate-900/40 border-slate-800/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border-b-[3px] ${
                              isCurrent
                                ? 'bg-indigo-500 text-white shadow-md border-indigo-700'
                                : isUnlocked
                                ? 'bg-slate-800 text-slate-300 border-slate-700'
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}
                          >
                            {isUnlocked ? <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-sm" /> : <Lock className="w-4 h-4 drop-shadow-sm" />}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h6 className={`text-xs font-black ${isCurrent ? 'text-indigo-300 drop-shadow-sm' : 'text-slate-200'}`}>
                                {tier.name}
                              </h6>
                              {isCurrent && (
                                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-black border border-indigo-500/40 shadow-sm uppercase">
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium leading-tight block mt-0.5">
                              Unlocks at Level {tier.minLevel} or {tier.minStars} Stars
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Perks */}
                      <div className="mt-3 pt-3 border-t-[2px] border-slate-800/80 flex flex-wrap gap-1.5">
                        {tier.perks.map((perk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-950/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 font-bold shadow-inner"
                          >
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 4. FOOTER                                                 */}
        {/* ========================================================= */}
        <div className="bg-slate-950/80 border-t-[3px] border-amber-600/40 p-4 shrink-0 backdrop-blur-md">
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:translate-y-1 active:border-b-0 text-slate-950 font-black text-sm shadow-lg border-b-[4px] border-orange-700 transition-all drop-shadow-md"
          >
            CONTINUE PLAYING
          </button>
        </div>
      </div>
    </div>
  );
};
