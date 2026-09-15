import React, { useState, useEffect, useMemo } from 'react';
import { LevelResult } from '../types/runtimeContract';
import { ProgressionUpdateReport } from '../engine/ProgressionIntegration';
import { LevelPerformanceCalculator, LevelPerformanceProfile } from '../engine/LevelPerformanceProfile';
import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';
import { generateLevelDefinition } from '../data/levelDefinitions';
import { globalAudioService } from '../services/AudioService';
import { globalSaveService } from '../services/SaveService';
import { globalAdMobService } from '../services/AdMobService';
import { LocalEconomyService } from '../services/EconomyService';
import { globalRankingService } from '../services/RankingService';
import { PackCompletionModal } from './PackCompletionModal';
import { WorldCompletionModal } from './WorldCompletionModal';
import { LevelUpModal } from './LevelUpModal';
import { WorldFinaleModal } from './WorldFinaleModal';
import {
  Trophy,
  Star,
  Play,
  RotateCw,
  MapPin,
  Coins,
  Gem,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Crown,
  Palette,
  Target,
  ArrowRight,
  Flame,
  Check,
  Tv,
} from 'lucide-react';

interface LevelResultModalProps {
  result: LevelResult;
  progressionReport?: ProgressionUpdateReport | null;
  previousHighScore?: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onExitToMap: () => void;
}

export const LevelResultModal: React.FC<LevelResultModalProps> = ({
  result,
  progressionReport,
  previousHighScore = 0,
  onNextLevel,
  onReplay,
  onExitToMap,
}) => {
  const [revealedStars, setRevealedStars] = useState<number>(0);
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  const [animatedStarsTotal, setAnimatedStarsTotal] = useState<number>(
    progressionReport
      ? progressionReport.totalStars - (progressionReport.newStarsEarned || 0)
      : globalSaveService.loadSave().starsTotal
  );

  // Sub-modals
  const [showPackComplete, setShowPackComplete] = useState<boolean>(false);
  const [showWorldComplete, setShowWorldComplete] = useState<boolean>(false);
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [showFinale, setShowFinale] = useState<boolean>(false);
  const [doubledCoinsClaimed, setDoubledCoinsClaimed] = useState<boolean>(false);

  const isCampaignFinale = result.levelId === 9999;
  const isBossLevel = result.levelId % 25 === 0;

  // Retrieve Authoritative Performance Profile
  const levelProfile: LevelPerformanceProfile = useMemo(() => {
    const levelDef =
      RuntimeLevelRegistry.getLevel(result.levelId) || generateLevelDefinition(result.levelId);
    return LevelPerformanceCalculator.getProfile(levelDef);
  }, [result.levelId]);

  const currentTier = useMemo(
    () => globalRankingService.getPlayerTier(result.levelId, animatedStarsTotal),
    [result.levelId, animatedStarsTotal]
  );
  const globalRank = useMemo(
    () => globalRankingService.calculateGlobalRank(result.levelId, animatedStarsTotal),
    [result.levelId, animatedStarsTotal]
  );

  // Compute best stars recorded
  const savedData = globalSaveService.loadSave();
  const currentSavedStars = savedData.completedLevels[result.levelId]?.stars || result.stars;
  const bestStars = Math.max(currentSavedStars, result.stars);
  const isNewBest = progressionReport ? progressionReport.newStarsEarned > 0 : false;
  const previousStarsBeforeThisRun = isNewBest
    ? Math.max(0, result.stars - (progressionReport?.newStarsEarned || 0))
    : currentSavedStars;

  // Sequential Star Reveal & Audio/Haptics
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setRevealedStars(result.stars);
      setAnimatedScore(result.score);
      if (progressionReport) {
        setAnimatedStarsTotal(progressionReport.totalStars);
      }
      return;
    }

    const t1 = setTimeout(() => {
      setRevealedStars(1);
      if (result.stars >= 1) {
        globalAudioService.emit('RewardReceived', 1);
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
          try {
            window.navigator.vibrate(25);
          } catch (_) {}
        }
      }
    }, 180);

    const t2 = setTimeout(() => {
      if (result.stars >= 2) {
        setRevealedStars(2);
        globalAudioService.emit('RewardReceived', 2);
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
          try {
            window.navigator.vibrate(35);
          } catch (_) {}
        }
      }
    }, 500);

    const t3 = setTimeout(() => {
      if (result.stars >= 3) {
        setRevealedStars(3);
        globalAudioService.emit('RewardReceived', 3);
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
          try {
            window.navigator.vibrate([40, 30, 60]);
          } catch (_) {}
        }
      }
    }, 820);

    // Score Count-Up
    const targetScore = result.score;
    const duration = 900;
    const steps = 20;
    const increment = Math.ceil(targetScore / steps);
    let current = 0;

    const scoreTimer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(scoreTimer);
      } else {
        setAnimatedScore(current);
      }
    }, duration / steps);

    // Star Total Increment Animation
    if (progressionReport && progressionReport.newStarsEarned > 0) {
      const starTotalTimer = setTimeout(() => {
        setAnimatedStarsTotal(progressionReport.totalStars);
      }, 1000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(starTotalTimer);
        clearInterval(scoreTimer);
      };
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(scoreTimer);
    };
  }, [result, progressionReport]);

  const isNewHighScore = result.score > previousHighScore;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Next Milestone / Goal Calculation
  const getNextGoal = () => {
    const nextBossLevel = Math.ceil((result.levelId + 1) / 25) * 25;
    const nextWorldLevel = Math.ceil((result.levelId + 1) / 100) * 100;
    if (result.levelId < nextBossLevel) {
      const levelsUntilBoss = nextBossLevel - result.levelId;
      return `${levelsUntilBoss} Level${levelsUntilBoss > 1 ? 's' : ''} to Pack Boss (Level ${nextBossLevel})`;
    }
    return `Advance toward World Milestone (Level ${nextWorldLevel})`;
  };

  // Star Quality Headers and Messaging
  const getQualityData = () => {
    if (result.stars === 3) {
      return {
        badge: '3★ LEVEL MASTERED',
        title: 'LEVEL MASTERED!',
        subtitle: 'Perfect Performance!',
        description: 'Flawless clearance! You have earned all 3 stars on this level.',
        accentColor: 'from-amber-400 to-yellow-500',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-500/40',
        replayBtnLabel: 'PLAY AGAIN',
      };
    }
    if (result.stars === 2) {
      return {
        badge: '2★ GREAT PERFORMANCE',
        title: 'GREAT JOB!',
        subtitle: 'One more star to Master this level!',
        description: `Completed in ${result.movesUsed} moves. Finish in ≤ ${levelProfile.threeStarMoves} moves for 3★!`,
        accentColor: 'from-teal-400 to-emerald-500',
        textColor: 'text-teal-300',
        borderColor: 'border-teal-500/40',
        replayBtnLabel: 'TRY FOR 3★',
      };
    }
    return {
      badge: '1★ LEVEL COMPLETE',
      title: 'LEVEL COMPLETE',
      subtitle: 'Try again to earn 2★',
      description: `Completed in ${result.movesUsed} moves. Finish in ≤ ${levelProfile.twoStarMoves} moves for 2★!`,
      accentColor: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/30',
      replayBtnLabel: 'TRY FOR 2★',
    };
  };

  const quality = getQualityData();

  return (
    <div
      id="level-result-modal-backdrop"
      className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in select-none font-sans"
    >
      <div
        id="level-result-modal-container"
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-teal-500/30 rounded-3xl p-4 sm:p-5 max-w-sm w-full text-center shadow-2xl space-y-3 relative overflow-hidden text-slate-100 max-h-[94vh] overflow-y-auto"
      >
        {/* Subtle Ambient Background Flare */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* 1. HEADER EMBLEM & BADGE */}
        <div className="relative inline-block mt-0.5">
          <div
            id="result-header-emblem"
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg border transition-all duration-300 ${
              isCampaignFinale
                ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-amber-500/30 border-amber-200'
                : isBossLevel
                ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 text-white shadow-rose-500/30 border-rose-300'
                : result.stars === 3
                ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-amber-500/30 border-amber-200 animate-pulse'
                : result.stars === 2
                ? 'bg-gradient-to-tr from-teal-400 via-emerald-500 to-teal-600 text-white shadow-teal-500/30 border-teal-200'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20 border-emerald-300/50'
            }`}
          >
            {isCampaignFinale ? (
              <Crown className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5] text-slate-950 animate-pulse" />
            ) : isBossLevel ? (
              <Trophy className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5] text-white animate-bounce" />
            ) : result.stars === 3 ? (
              <Crown className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5] text-slate-950" />
            ) : result.stars === 2 ? (
              <Trophy className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5]" />
            ) : (
              <Award className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5]" />
            )}
          </div>
          {result.stars === 3 && (
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 absolute -top-1 -right-1 animate-bounce" />
          )}
        </div>

        {/* 2. TITLE & STAR QUALITY MESSAGING */}
        <div className="space-y-0.5">
          <span
            id="result-level-badge"
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border ${
              isBossLevel
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : result.stars === 3
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            {isCampaignFinale
              ? 'CAMPAIGN MASTERED'
              : isBossLevel
              ? `LEVEL ${result.levelId} • BOSS DEFEATED`
              : `LEVEL ${result.levelId} • ${quality.badge}`}
          </span>
          <h2
            id="result-main-title"
            className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1"
          >
            {isCampaignFinale
              ? 'GRAND MASTER OF MATCH 3!'
              : isBossLevel
              ? 'BOSS DEFEATED!'
              : quality.title}
          </h2>
          <p id="result-subtitle" className="text-xs text-amber-300 font-bold">
            {quality.subtitle}
          </p>
        </div>

        {/* 3. SEQUENTIAL STAR REVEAL ANIMATION */}
        <div
          id="result-stars-row"
          className="flex items-center justify-center space-x-2 py-0.5 min-h-[44px]"
        >
          {/* Star 1 */}
          <div className="relative">
            <Star
              id="result-star-1"
              className={`w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 ${
                revealedStars >= 1 && result.stars >= 1
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.7)] scale-110'
                  : 'text-slate-800 fill-slate-900 scale-90 opacity-40'
              }`}
            />
          </div>

          {/* Star 2 (Center - Slightly larger) */}
          <div className="relative">
            <Star
              id="result-star-2"
              className={`w-11 h-11 sm:w-12 sm:h-12 transition-all duration-300 ${
                revealedStars >= 2 && result.stars >= 2
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.9)] scale-125'
                  : 'text-slate-800 fill-slate-900 scale-90 opacity-40'
              }`}
            />
          </div>

          {/* Star 3 */}
          <div className="relative">
            <Star
              id="result-star-3"
              className={`w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 ${
                revealedStars >= 3 && result.stars >= 3
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.7)] scale-110'
                  : 'text-slate-800 fill-slate-900 scale-90 opacity-40'
              }`}
            />
          </div>
        </div>

        {/* 4. NEW BEST & MOTIVATIONAL FEEDBACK BANNER */}
        <div
          id="result-feedback-banner"
          className="bg-slate-950/80 px-4 py-3 rounded-2xl border-b-[3px] border-slate-800 text-center space-y-2 shadow-inner"
        >
          {/* New Best Star Improvement Banner */}
          {isNewBest && progressionReport ? (
            <div
              id="result-new-best-banner"
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-b-[3px] border-amber-600/60 flex items-center justify-between text-xs font-black text-amber-300 shadow-lg animate-pulse"
            >
              <span className="flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-amber-400 drop-shadow-sm" />
                <span className="drop-shadow-sm">NEW BEST!</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded-md shadow-inner border border-slate-700/50">
                  {previousStarsBeforeThisRun > 0 ? `${previousStarsBeforeThisRun}★` : '0★'}
                </span>
                <span className="text-slate-500 font-black">→</span>
                <span className="text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30 shadow-sm">{result.stars}★</span>
                <span className="text-emerald-400 font-black tracking-wide drop-shadow-sm">
                  +{progressionReport.newStarsEarned} STAR{progressionReport.newStarsEarned > 1 ? 'S' : ''}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] font-black text-slate-400 px-2 uppercase tracking-wide">
              <span>Best Result:</span>
              <span className="text-amber-400 font-black drop-shadow-sm flex items-center bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                {bestStars === 3 ? '⭐⭐⭐' : bestStars === 2 ? '⭐⭐' : '⭐'} <span className="ml-1 opacity-70">({bestStars}★)</span>
              </span>
            </div>
          )}

          {/* NEXT STAR TARGET MOTIVATION (Essential for 1★ and 2★) */}
          {result.stars < 3 ? (
            <div
              id="result-next-star-target"
              className="bg-slate-900/90 p-2.5 rounded-xl border-b-[3px] border-teal-600/50 flex items-center justify-between text-left shadow-inner"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border-b-[2px] border-teal-500/40 flex items-center justify-center text-teal-300 font-black text-xs shrink-0 shadow-sm">
                  <Target className="w-4.5 h-4.5 text-teal-400 drop-shadow-sm" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wide">
                    Next Target ({result.stars === 1 ? '⭐⭐' : '⭐⭐⭐'})
                  </span>
                  <span className="text-xs font-black text-white drop-shadow-sm">
                    Finish in ≤{' '}
                    <strong className="text-teal-400">
                      {result.stars === 1 ? levelProfile.twoStarMoves : levelProfile.threeStarMoves}
                    </strong>{' '}
                    moves
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-sm">
                {result.stars === 1 ? '+1★' : 'Mastery'}
              </span>
            </div>
          ) : (
            <div
              id="result-mastery-badge"
              className="bg-amber-500/10 p-2.5 rounded-xl border-b-[3px] border-amber-500/40 flex items-center justify-center space-x-2 text-xs font-black text-amber-400 shadow-inner"
            >
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
              <span className="drop-shadow-sm tracking-wide">MAX STARS ACHIEVED — LEVEL MASTERED!</span>
            </div>
          )}

          <div className="text-[11px] text-slate-300 font-bold px-2 pt-1">
            {quality.description}
          </div>
        </div>

        {/* 5. PERFORMANCE BREAKDOWN CARDS */}
        <div
          id="result-performance-breakdown"
          className="grid grid-cols-4 gap-2 text-center text-xs"
        >
          {/* Moves */}
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border-b-[3px] border-slate-700 flex flex-col items-center shadow-md backdrop-blur-sm">
            <Zap className="w-4 h-4 text-amber-400 mb-1 drop-shadow-sm" />
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Moves</span>
            <span className="text-sm font-black text-white font-mono drop-shadow-sm">{result.movesUsed}</span>
          </div>

          {/* Time */}
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border-b-[3px] border-slate-700 flex flex-col items-center shadow-md backdrop-blur-sm">
            <Clock className="w-4 h-4 text-teal-400 mb-1 drop-shadow-sm" />
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Time</span>
            <span className="text-sm font-black text-white font-mono drop-shadow-sm">
              {formatTime(result.timeUsedSeconds)}
            </span>
          </div>

          {/* Result Stars */}
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border-b-[3px] border-slate-700 flex flex-col items-center shadow-md backdrop-blur-sm">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 mb-1 drop-shadow-sm" />
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Result</span>
            <span className="text-sm font-black text-amber-300 font-mono drop-shadow-sm">
              {result.stars === 3 ? '⭐⭐⭐' : result.stars === 2 ? '⭐⭐' : '⭐'}
            </span>
          </div>

          {/* Best Stars */}
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border-b-[3px] border-slate-700 flex flex-col items-center shadow-md backdrop-blur-sm">
            <Trophy className="w-4 h-4 text-amber-400 mb-1 drop-shadow-sm" />
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Best</span>
            <span className="text-sm font-black text-amber-400 font-mono drop-shadow-sm">
              {bestStars === 3 ? '⭐⭐⭐' : bestStars === 2 ? '⭐⭐' : '⭐'}
            </span>
          </div>
        </div>

        {/* 6. STAR TOTAL & XP PROGRESSION */}
        <div
          id="result-progression-panel"
          className="bg-slate-950/80 p-3 rounded-3xl border-b-[4px] border-slate-800 space-y-3 text-left shadow-inner backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center space-x-2 text-amber-300">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-sm" />
              <span className="drop-shadow-sm tracking-wide">Total Sanctuary Stars:</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-white font-mono font-black text-base drop-shadow-md">{animatedStarsTotal}</span>
              {isNewBest && progressionReport && (
                <span className="text-emerald-400 font-mono font-black text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                  (+{progressionReport.newStarsEarned})
                </span>
              )}
            </div>
          </div>

          {progressionReport && (
            <div className="border-t-[2px] border-slate-800/80 pt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-black tracking-wide">
                <span className="text-indigo-300 flex items-center space-x-1.5 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20 shadow-sm">
                  <Crown className="w-4 h-4 text-indigo-400 drop-shadow-sm" />
                  <span>Rank {progressionReport.xpReport.currentLevel} · {currentTier.name}</span>
                </span>
                <span className="text-amber-400 font-mono font-black bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shadow-sm">Global #{globalRank}</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                  style={{ width: `${Math.max(5, progressionReport.xpReport.progressPercent)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 7. AUTHORITATIVE REWARDS DISPLAY */}
        <div
          id="result-rewards-section"
          className="bg-slate-900/80 p-3.5 rounded-3xl border-b-[4px] border-slate-800 space-y-3 shadow-md backdrop-blur-sm"
        >
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block text-left px-1 drop-shadow-sm">
            Rewards Earned
          </span>
          <div className="flex items-center justify-around gap-2">
            {/* Coins */}
            <div className="flex-1 flex items-center justify-center space-x-1.5 text-amber-300 font-black text-xs bg-amber-500/20 py-2 px-2 rounded-xl border border-amber-500/40 shadow-sm">
              <Coins className="w-4 h-4 text-amber-400 drop-shadow-sm" />
              <span className="drop-shadow-sm">+{result.rewardsEarned.coins}</span>
            </div>

            {/* Gems */}
            {result.rewardsEarned.gems > 0 ? (
              <div className="flex-1 flex items-center justify-center space-x-1.5 text-teal-300 font-black text-xs bg-teal-500/20 py-2 px-2 rounded-xl border border-teal-500/40 shadow-sm">
                <Gem className="w-4 h-4 text-teal-400 drop-shadow-sm" />
                <span className="drop-shadow-sm">+{result.rewardsEarned.gems}</span>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center space-x-1.5 text-slate-500 font-black text-xs bg-slate-900/80 py-2 px-2 rounded-xl border border-slate-800 shadow-inner">
                <Gem className="w-4 h-4 text-slate-600 drop-shadow-sm" />
                <span className="drop-shadow-sm">0</span>
              </div>
            )}

            {/* XP */}
            <div className="flex-1 flex items-center justify-center space-x-1.5 text-indigo-300 font-black text-xs bg-indigo-500/20 py-2 px-2 rounded-xl border border-indigo-500/40 shadow-sm">
              <Zap className="w-4 h-4 text-indigo-400 drop-shadow-sm" />
              <span className="drop-shadow-sm">+{result.rewardsEarned.expPoints || 100} XP</span>
            </div>
          </div>

          {/* AdMob 2X Rewarded Multiplier Button */}
          {result.rewardsEarned.coins > 0 && (
            <div className="pt-2">
              {!doubledCoinsClaimed ? (
                <button
                  onClick={() => {
                    globalAudioService.emit('ButtonPressed');
                    globalAdMobService.showRewardedVideo('DOUBLE_LEVEL_COINS', () => {
                      const economy = new LocalEconomyService();
                      economy.addCoins(result.rewardsEarned.coins);
                      setDoubledCoinsClaimed(true);
                      globalAudioService.emit('RewardReceived');
                    });
                  }}
                  className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg active:translate-y-1 active:border-b-0 border-b-[3px] border-orange-700 transition-all flex items-center justify-center space-x-2 drop-shadow-md"
                >
                  <Tv className="w-4 h-4 drop-shadow-sm" />
                  <span className="tracking-wide">2X COINS (+{result.rewardsEarned.coins} COINS WITH AD)</span>
                </button>
              ) : (
                <div className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border-b-[2px] border-emerald-600/50 text-emerald-300 text-[11px] font-black flex items-center justify-center space-x-2 shadow-inner">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-sm" />
                  <span className="tracking-wide drop-shadow-sm">2X REWARD MULTIPLIER APPLIED! (+{result.rewardsEarned.coins} EXTRA COINS)</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 8. SPECIAL CELEBRATIONS: PACK / WORLD / FINALE TRIGGERS */}
        {progressionReport?.isCampaignFinale && (
          <button
            onClick={() => setShowFinale(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg border-b-[4px] border-amber-600 active:translate-y-1 active:border-b-0 animate-bounce"
          >
            👑 VIEW CAMPAIGN FINALE CELEBRATION!
          </button>
        )}

        {progressionReport?.isWorldComplete && progressionReport.worldInfo && (
          <button
            onClick={() => setShowWorldComplete(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow-lg border-b-[4px] border-orange-700 active:translate-y-1 active:border-b-0 animate-pulse"
          >
            🌍 WORLD {progressionReport.worldInfo.worldId} RESTORED! VIEW WORLD BOUNTY
          </button>
        )}

        {progressionReport?.isPackComplete && progressionReport.packInfo && (
          <button
            onClick={() => setShowPackComplete(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg border-b-[4px] border-emerald-700 active:translate-y-1 active:border-b-0 animate-pulse"
          >
            🏆 PACK {progressionReport.packInfo.packId} COMPLETE! VIEW PACK TROPHY
          </button>
        )}

        {/* 9. PRIMARY ACTION BUTTONS */}
        <div id="result-actions-container" className="space-y-3 pt-1">
          {!isCampaignFinale ? (
            <button
              id="result-btn-next-level"
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                const adShown = globalAdMobService.showInterstitial(() => {
                  onNextLevel();
                });
                if (!adShown) onNextLevel();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 active:translate-y-1 active:border-b-0 text-slate-950 font-black text-base shadow-xl border-b-[5px] border-emerald-700 transition-all flex items-center justify-center space-x-2 cursor-pointer drop-shadow-md"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span className="tracking-wide drop-shadow-sm">NEXT LEVEL</span>
            </button>
          ) : (
            <button
              id="result-btn-finale-summary"
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setShowFinale(true);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:translate-y-1 active:border-b-0 text-slate-950 font-black text-sm shadow-xl border-b-[5px] border-orange-700 transition-all flex items-center justify-center space-x-2 cursor-pointer drop-shadow-md"
            >
              <Trophy className="w-5 h-5 fill-slate-950 drop-shadow-sm" />
              <span className="tracking-wide drop-shadow-sm">CAMPAIGN FINALE SUMMARY</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              id="result-btn-replay"
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                const adShown = globalAdMobService.showInterstitial(() => {
                  onReplay();
                });
                if (!adShown) onReplay();
              }}
              className={`py-3 rounded-xl border-b-[3px] text-xs font-black transition-all flex items-center justify-center space-x-1.5 active:translate-y-0.5 active:border-b-0 cursor-pointer shadow-md ${
                result.stars < 3
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-600/50 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-slate-900 text-slate-300 hover:text-white backdrop-blur-sm'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${result.stars < 3 ? 'text-amber-400' : 'text-slate-400'} drop-shadow-sm`} />
              <span className="drop-shadow-sm">{quality.replayBtnLabel}</span>
            </button>

            <button
              id="result-btn-map"
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                const adShown = globalAdMobService.showInterstitial(() => {
                  onExitToMap();
                });
                if (!adShown) onExitToMap();
              }}
              className="py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border-b-[3px] border-slate-900 text-slate-300 hover:text-white font-black text-xs transition-all flex items-center justify-center space-x-1.5 active:translate-y-0.5 active:border-b-0 cursor-pointer shadow-md backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-teal-400 drop-shadow-sm" />
              <span className="drop-shadow-sm">World Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-MODALS */}
      {showPackComplete && progressionReport?.packInfo && (
        <PackCompletionModal
          worldId={progressionReport.packInfo.worldId}
          packId={progressionReport.packInfo.packId}
          packName={progressionReport.packInfo.packName}
          starsEarned={progressionReport.packInfo.starsEarned}
          onContinue={() => {
            setShowPackComplete(false);
            onNextLevel();
          }}
        />
      )}

      {showWorldComplete && progressionReport?.worldInfo && (
        <WorldCompletionModal
          worldId={progressionReport.worldInfo.worldId}
          worldName={progressionReport.worldInfo.worldName}
          totalStarsEarned={progressionReport.worldInfo.totalStars}
          onContinue={() => {
            setShowWorldComplete(false);
            onNextLevel();
          }}
        />
      )}

      {showLevelUp && progressionReport?.xpReport.levelUpRewards[0] && (
        <LevelUpModal
          reward={progressionReport.xpReport.levelUpRewards[0]}
          onClaim={() => setShowLevelUp(false)}
        />
      )}

      {showFinale && (
        <WorldFinaleModal
          totalStars={progressionReport?.totalStars || 0}
          totalLevelsCompleted={9999}
          onViewAchievements={() => {
            setShowFinale(false);
            onExitToMap();
          }}
        />
      )}
    </div>
  );
};
