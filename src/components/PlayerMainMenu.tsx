import React, { useState, useMemo } from 'react';
import { PlayerSaveData } from '../types/gameEngine';
import { getWorldForLevel } from '../data/worldDefinitions';
import { globalAudioService } from '../services/AudioService';
import { globalProfileService } from '../services/PlayerProfileService';
import { globalPlayerProgressionService } from '../services/PlayerProgressionService';
import { globalCollectionService } from '../services/CollectionService';
import { globalDailyRewardService } from '../services/DailyRewardService';
import { PlayerProfileModal } from './PlayerProfileModal';
import { DailyRewardPanel } from './DailyRewardPanel';
import { MissionPanel } from './MissionPanel';
import { AchievementPanel } from './AchievementPanel';
import { MilestonePanel } from './MilestonePanel';
import { NotificationBanner } from './NotificationBanner';
import { LiveOpsEventBanner } from './LiveOpsEventBanner';
import { RankingModal } from './RankingModal';
import { OtherAppsModal } from './OtherAppsModal';
import { PlayerSupportModal } from './PlayerSupportModal';
import {
  Play,
  Coins,
  Gem,
  Settings,
  Star,
  MapPin,
  Store,
  Calendar,
  Feather,
  Palmtree,
  Trophy,
  Crown,
  ChevronRight,
  Flame,
  MessageSquare,
  Award,
  Target,
  User,
  Shield,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Gamepad2,
} from 'lucide-react';

interface PlayerMainMenuProps {
  saveData: PlayerSaveData;
  coins: number;
  gems: number;
  onPlayLevel: (levelId: number) => void;
  onNavigateScreen: (screen: 'LEVEL_MAP' | 'COLLECTION' | 'EVENTS' | 'SHOP') => void;
  onOpenSettings: () => void;
  onWalletUpdate?: () => void;
  onOpenAdmin?: () => void;
}

export const PlayerMainMenu: React.FC<PlayerMainMenuProps> = ({
  saveData,
  coins,
  gems,
  onPlayLevel,
  onNavigateScreen,
  onOpenSettings,
  onWalletUpdate,
  onOpenAdmin,
}) => {
  const [activeModal, setActiveModal] = useState<
    'PROFILE' | 'DAILY_REWARDS' | 'MISSIONS' | 'ACHIEVEMENTS' | 'MILESTONES' | 'RANKING' | 'OTHER_APPS' | 'SUPPORT' | null
  >(null);

  // Hidden / Secret Admin Access Controls (5 taps within 3s or 2.5s long-press on sanctuary logo/title)
  const [adminTapCount, setAdminTapCount] = useState<number>(0);
  const [adminTapTimer, setAdminTapTimer] = useState<NodeJS.Timeout | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSecretAdminTap = () => {
    if (!onOpenAdmin) return;
    if (adminTapTimer) clearTimeout(adminTapTimer);

    const nextCount = adminTapCount + 1;
    setAdminTapCount(nextCount);

    if (nextCount >= 5) {
      globalAudioService.emit('LevelWon');
      onOpenAdmin();
      setAdminTapCount(0);
      return;
    }

    const timer = setTimeout(() => {
      setAdminTapCount(0);
    }, 2500);
    setAdminTapTimer(timer);
  };

  const handleLongPressStart = () => {
    if (!onOpenAdmin) return;
    const timer = setTimeout(() => {
      globalAudioService.emit('LevelWon');
      onOpenAdmin();
    }, 2500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const currentWorld = getWorldForLevel(saveData.currentLevel);
  const profile = globalProfileService.getProfile();
  const playerLevelInfo = globalPlayerProgressionService.getPlayerLevelInfo();
  const customizations = globalCollectionService.getEquippedCustomizations();
  const dailyRewardStatus = globalDailyRewardService.getStatus();

  // Level progress percentage within world
  const [worldStart, worldEnd] = currentWorld.levelRange;
  const worldTotalLevels = worldEnd - worldStart + 1;
  const worldProgress = Math.min(
    100,
    Math.max(0, ((saveData.currentLevel - worldStart) / worldTotalLevels) * 100)
  );

  // Next Milestone Goal
  const nextBossLevel = Math.ceil(saveData.currentLevel / 25) * 25;
  const nextGoalText =
    saveData.currentLevel === nextBossLevel
      ? `Pack Boss Battle: Level ${nextBossLevel}`
      : `${nextBossLevel - saveData.currentLevel + 1} Levels to Pack Boss (Lvl ${nextBossLevel})`;

  const worldStarsEarned = useMemo(() => {
    let stars = 0;
    for (let lvl = worldStart; lvl <= worldEnd; lvl++) {
      if (saveData.completedLevels[lvl]) {
        stars += saveData.completedLevels[lvl].stars || 0;
      }
    }
    return stars;
  }, [saveData.completedLevels, worldStart, worldEnd]);
  const worldMaxStars = worldTotalLevels * 3;

  return (
    <div 
      className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto select-none font-sans relative bg-slate-950"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3), rgba(2, 6, 23, 0.95)), url(/feature-graphic.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <NotificationBanner />

      {/* ========================================================= */}
      {/* 1. PLAYER PROFILE & CURRENCIES HEADER                      */}
      {/* ========================================================= */}
      <div className="flex flex-col space-y-2 shrink-0 z-10">
        
        {/* ROW 1: Profile & Core Currencies + Settings */}
        <div className="flex items-start justify-between gap-2">
          {/* Player Profile */}
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveModal('PROFILE');
            }}
            className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md hover:bg-slate-900/90 border border-white/20 p-1.5 rounded-2xl shadow-lg transition-all text-left shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-400 p-0.5 shadow-sm shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                 <img src="/app-icon.png" alt="Avatar" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
            <div className="flex flex-col pr-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-white leading-tight drop-shadow-md">
                  Rank {playerLevelInfo.level}
                </span>
                <span className="text-[9px] bg-amber-500/90 text-slate-950 px-1.5 py-0.5 rounded-full font-black border border-amber-300 shadow-sm">
                  {Math.round(playerLevelInfo.progressRatio * 100)}%
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-[10px] text-emerald-400 font-bold drop-shadow-md">Lvl {saveData.currentLevel}</span>
              </div>
            </div>
          </button>

          {/* Currencies & Settings */}
          <div className="flex flex-col items-end space-y-1.5 shrink-0">
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center space-x-1 bg-amber-500/90 backdrop-blur-sm border-b-2 border-amber-600 px-2 py-1 rounded-full text-slate-950 text-xs font-black shadow-md min-w-[60px] justify-center">
                <Coins className="w-3.5 h-3.5" />
                <span>{coins}</span>
              </div>
              <div className="flex items-center space-x-1 bg-emerald-500/90 backdrop-blur-sm border-b-2 border-emerald-600 px-2 py-1 rounded-full text-slate-950 text-xs font-black shadow-md min-w-[60px] justify-center">
                <Gem className="w-3.5 h-3.5" />
                <span>{gems}</span>
              </div>
              <button
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  setActiveModal('SUPPORT');
                }}
                className="w-7 h-7 rounded-full bg-rose-500/90 hover:bg-rose-400 backdrop-blur-sm border-b-2 border-rose-700 flex items-center justify-center text-white active:scale-95 transition-all shadow-md shrink-0"
                title="Help & Support"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  onOpenSettings();
                }}
                className="w-7 h-7 rounded-full bg-slate-900/90 hover:bg-slate-800 backdrop-blur-sm border-b-2 border-slate-700 flex items-center justify-center text-white active:scale-95 transition-all shadow-md shrink-0"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Secondary Nav Buttons (Tournaments, Achievements, Milestones) */}
        <div className="flex items-center justify-start space-x-2">
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveModal('RANKING');
            }}
            className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 flex items-center justify-center text-slate-900 active:translate-y-1 active:border-b-0 transition-all shadow-lg"
          >
            <Crown className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveModal('ACHIEVEMENTS');
            }}
            className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700 flex items-center justify-center text-slate-900 active:translate-y-1 active:border-b-0 transition-all shadow-lg"
          >
            <Trophy className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveModal('MILESTONES');
            }}
            className="w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-400 border-b-4 border-indigo-700 flex items-center justify-center text-white active:translate-y-1 active:border-b-0 transition-all shadow-lg"
          >
            <Award className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveModal('OTHER_APPS');
            }}
            className="w-9 h-9 rounded-full bg-teal-500 hover:bg-teal-400 border-b-4 border-teal-700 flex items-center justify-center text-slate-900 active:translate-y-1 active:border-b-0 transition-all shadow-lg"
          >
            <Gamepad2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CENTER HERO PROGRESSION CARD & DOMINANT CTA            */}
      {/* ========================================================= */}
      <div className="my-auto py-3 flex flex-col items-center text-center space-y-4">
        {/* World Sanctuary Illustration Card (Hidden 5-Tap or Long-Press Secret Admin Trigger) */}
        <div
          className="relative cursor-pointer select-none active:scale-95 transition-transform"
          onClick={handleSecretAdminTap}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          title="Sanctuary Oasis"
        >
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[2rem] bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 p-1.5 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full bg-slate-950 rounded-[1.6rem] flex flex-col items-center justify-center relative overflow-hidden border border-white/20">
              <img src="/app-icon.png" alt="Tile Oasis Icon" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 text-[11px] font-black text-white uppercase tracking-widest px-3.5 py-1 bg-orange-500/90 backdrop-blur-md rounded-full border border-orange-300 shadow-md">
                {currentWorld.name}
              </span>
            </div>
          </div>
        </div>

        {/* Title & World Progress (Also supports 5-Tap Secret Admin Trigger) */}
        <div className="space-y-1.5 drop-shadow-xl">
          <h2
            onClick={handleSecretAdminTap}
            className="text-4xl font-black text-white tracking-tight cursor-pointer select-none"
            title="Tile Oasis: Sanctuary Match"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            Tile Oasis
          </h2>
          <p className="text-xs text-amber-300 font-black uppercase tracking-widest drop-shadow-md">
            {currentWorld.subtitle} — Level {saveData.currentLevel}
          </p>

          {/* World Progress Bar & Star Mastery */}
          <div className="w-60 mx-auto space-y-1.5 mt-3">
            <div className="bg-slate-900/80 backdrop-blur-sm h-3 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(8, worldProgress)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/90 font-bold px-1 drop-shadow-md">
              <span className="flex items-center space-x-1 text-amber-300">
                <Star className="w-3 h-3 fill-amber-300 drop-shadow-sm" />
                <span>{worldStarsEarned} / {worldMaxStars}★</span>
              </span>
              <span className="text-emerald-300">{Math.round(worldProgress)}% Cleared</span>
            </div>
          </div>
        </div>

        {/* DOMINANT PRIMARY CTA: CONTINUE LEVEL */}
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onPlayLevel(saveData.currentLevel);
          }}
          className="w-full max-w-xs py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-white font-black text-lg shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center space-x-3 border-2 border-orange-200/50 group animate-pulse mt-4"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-white/30">
            <Play className="w-5 h-5 fill-white text-white ml-0.5 drop-shadow-md" />
          </div>
          <span className="drop-shadow-md tracking-wide">CONTINUE LEVEL {saveData.currentLevel}</span>
        </button>

        {/* NEXT GOAL TICKER */}
        <div className="flex items-center space-x-1.5 text-xs text-orange-200 font-bold bg-slate-950/60 backdrop-blur-md border border-orange-500/30 px-4 py-1.5 rounded-full mt-4 shadow-lg">
          <Target className="w-4 h-4 text-orange-400" />
          <span>{nextGoalText}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2.5 LIVE-OPS EVENT BANNER (DYNAMIC)                       */}
      {/* ========================================================= */}
      <div className="mb-2">
        <LiveOpsEventBanner onNavigateToShop={() => onNavigateScreen('SHOP')} />
      </div>

      {/* ========================================================= */}
      {/* 3. DAILY REWARD & STREAK BANNER                           */}
      {/* ========================================================= */}
      <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/40 p-3 rounded-2xl flex items-center justify-between mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Flame className="w-6 h-6 drop-shadow-md" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider drop-shadow-md">
                Streak: {dailyRewardStatus.currentStreak} Days
              </span>
              {dailyRewardStatus.isEligible && (
                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full border border-emerald-300 animate-pulse shadow-md">
                  READY
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-white drop-shadow-md">Daily Blessing</span>
          </div>
        </div>

        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            setActiveModal('DAILY_REWARDS');
          }}
          className={`py-2 px-4 rounded-xl font-black text-xs shadow-lg transition-all flex items-center space-x-1 shrink-0 ${
            dailyRewardStatus.isEligible
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 animate-bounce border border-emerald-200'
              : 'bg-slate-800/80 text-white hover:bg-slate-700 border border-white/10'
          }`}
        >
          <span>{dailyRewardStatus.isEligible ? 'CLAIM' : 'VIEW'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 4. LOWER PLAYER NAVIGATION BAR                             */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2 pt-3 shrink-0">
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onNavigateScreen('LEVEL_MAP');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border-t-2 border-l-2 border-r-2 border-b-[6px] border-amber-600/80 hover:border-amber-500 text-white transition-all active:translate-y-1 active:border-b-2 space-y-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group"
        >
          <MapPin className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform drop-shadow-md" />
          <span className="text-[11px] font-black tracking-wide drop-shadow-md">Map</span>
        </button>

        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onNavigateScreen('COLLECTION');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border-t-2 border-l-2 border-r-2 border-b-[6px] border-emerald-600/80 hover:border-emerald-500 text-white transition-all active:translate-y-1 active:border-b-2 space-y-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group"
        >
          <Feather className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform drop-shadow-md" />
          <span className="text-[11px] font-black tracking-wide drop-shadow-md">Items</span>
        </button>

        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            setActiveModal('MISSIONS');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border-t-2 border-l-2 border-r-2 border-b-[6px] border-orange-600/80 hover:border-orange-500 text-white transition-all active:translate-y-1 active:border-b-2 space-y-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group"
        >
          <Target className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform drop-shadow-md" />
          <span className="text-[11px] font-black tracking-wide drop-shadow-md">Quests</span>
        </button>

        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onNavigateScreen('SHOP');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border-t-2 border-l-2 border-r-2 border-b-[6px] border-indigo-600/80 hover:border-indigo-500 text-white transition-all active:translate-y-1 active:border-b-2 space-y-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group"
        >
          <Store className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform drop-shadow-md" />
          <span className="text-[11px] font-black tracking-wide drop-shadow-md">Shop</span>
        </button>
      </div>

      {/* Meta Overlay Modals */}
      {activeModal === 'PROFILE' && (
        <PlayerProfileModal profile={profile} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'DAILY_REWARDS' && (
        <DailyRewardPanel onClose={() => setActiveModal(null)} onClaimed={onWalletUpdate} />
      )}
      {activeModal === 'MISSIONS' && (
        <MissionPanel onClose={() => setActiveModal(null)} onClaimed={onWalletUpdate} />
      )}
      {activeModal === 'ACHIEVEMENTS' && (
        <AchievementPanel onClose={() => setActiveModal(null)} onClaimed={onWalletUpdate} />
      )}
      {activeModal === 'MILESTONES' && (
        <MilestonePanel onClose={() => setActiveModal(null)} onClaimed={onWalletUpdate} />
      )}
      {activeModal === 'RANKING' && (
        <RankingModal saveData={saveData} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'SUPPORT' && <PlayerSupportModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'OTHER_APPS' && (
        <OtherAppsModal
          onClose={() => setActiveModal(null)}
          onWalletUpdate={onWalletUpdate}
        />
      )}
    </div>
  );
};
