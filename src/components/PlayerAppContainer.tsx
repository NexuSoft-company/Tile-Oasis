import React, { useState, useEffect } from 'react';
import { PlayerMainMenu } from './PlayerMainMenu';
import { WorldMapView } from './WorldMapView';
import { PlayerGameMode } from './PlayerGameMode';
import { CollectionView } from './CollectionView';
import { ShopView } from './ShopView';
import { globalSaveService } from '../services/SaveService';
import { LocalEconomyService } from '../services/EconomyService';
import { globalAudioService } from '../services/AudioService';
import { globalAdMobService } from '../services/AdMobService';
import { AdSimulationModal } from './AdSimulationModal';
import { AdminAdDashboard } from './AdminAdDashboard';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import {
  WORLD_DEFINITIONS,
  WorldDefinition,
  getWorldForLevel,
  MAX_CAMPAIGN_LEVEL,
} from '../data/worldDefinitions';
import {
  Sliders,
  Palmtree,
  ArrowLeft,
  Coins,
  Gem,
  Settings,
  Volume2,
  Vibrate,
  X,
  Trophy,
  Award,
  Star,
  CheckCircle2,
  Store,
  Feather,
  Calendar,
  Tv,
  ShieldCheck,
} from 'lucide-react';

export type PlayerScreen =
  | 'SPLASH'
  | 'MAIN_MENU'
  | 'LEVEL_MAP'
  | 'GAMEPLAY'
  | 'COLLECTION'
  | 'EVENTS'
  | 'SHOP';

interface PlayerAppContainerProps {
  initialDevMode?: boolean;
  onOpenDevMode?: () => void;
  onOpenAdmin?: () => void;
}

export const PlayerAppContainer: React.FC<PlayerAppContainerProps> = ({
  initialDevMode = false,
  onOpenDevMode,
  onOpenAdmin,
}) => {
  // Screen Flow State
  const [currentScreen, setCurrentScreen] = useState<PlayerScreen>('SPLASH');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  // Player Save Data & Economy
  const [saveData, setSaveData] = useState(() => globalSaveService.loadSave());
  const [economy] = useState(() => new LocalEconomyService());
  const [coins, setCoins] = useState<number>(economy.getCoins());
  const [gems, setGems] = useState<number>(economy.getGems());

  // Settings Modal State
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(saveData.soundEnabled);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(saveData.musicEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(saveData.hapticsEnabled);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);

  // World Unlock Celebration Modal
  const [unlockedWorldReward, setUnlockedWorldReward] = useState<WorldDefinition | null>(null);

  // Admin & AdMob Console Modal State
  const [showAdminAdDashboard, setShowAdminAdDashboard] = useState<boolean>(false);
  const [adConfig, setAdConfig] = useState(() => globalAdMobService.getConfig());

  // Dev Unlock Secret Counter (5 taps on version in Settings)
  const [versionTapCount, setVersionTapCount] = useState<number>(0);
  const [devUnlocked, setDevUnlocked] = useState<boolean>(initialDevMode);

  // Auto Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('MAIN_MENU');
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Sync Save Data & Wallet
  const refreshSave = () => {
    const loaded = globalSaveService.loadSave();
    setSaveData(loaded);
    setCoins(economy.getCoins());
    setGems(economy.getGems());
  };

  // Manage Native AdMob Banner Visibility
  useEffect(() => {
    if (currentScreen === 'GAMEPLAY' || currentScreen === 'SPLASH') {
      globalAdMobService.hideBanner();
    } else {
      globalAdMobService.showBanner();
    }
  }, [currentScreen]);

  // Sound Settings Handler
  const toggleSound = () => {
    const updated = !soundEnabled;
    setSoundEnabled(updated);
    globalAudioService.enabled = updated;
    globalSaveService.saveData({ soundEnabled: updated });
  };

  const toggleHaptics = () => {
    const updated = !hapticsEnabled;
    setHapticsEnabled(updated);
    globalSaveService.saveData({ hapticsEnabled: updated });
  };

  // Handle Version Tap for Secret Developer Mode Unlock
  const handleVersionTap = () => {
    const next = versionTapCount + 1;
    setVersionTapCount(next);
    if (next >= 5) {
      setDevUnlocked(true);
      if (onOpenAdmin) {
        setShowSettings(false);
        onOpenAdmin();
      } else if (onOpenDevMode) {
        onOpenDevMode();
      }
      setVersionTapCount(0);
    }
  };

  // Start Playing Level
  const launchLevel = (lvlId: number) => {
    setSelectedLevelId(lvlId);
    setCurrentScreen('GAMEPLAY');
  };

  // Level Win Callback from Game Engine
  const handleLevelComplete = (lvlId: number, starsEarned: number, score: number) => {
    const currentHighest = saveData.highestLevelUnlocked;
    const nextHighest = Math.min(MAX_CAMPAIGN_LEVEL, Math.max(currentHighest, lvlId + 1));
    const nextCurrent = Math.min(MAX_CAMPAIGN_LEVEL, lvlId + 1);

    const prevStars = saveData.completedLevels[lvlId]?.stars || 0;
    const prevHighScore = saveData.completedLevels[lvlId]?.highScore || 0;

    const updatedCompleted = {
      ...saveData.completedLevels,
      [lvlId]: {
        stars: Math.max(prevStars, starsEarned),
        highScore: Math.max(prevHighScore, score),
      },
    };

    const newTotalStars = (Object.values(updatedCompleted) as { stars: number; highScore: number }[]).reduce(
      (sum, item) => sum + (item.stars || 0),
      0
    );

    globalSaveService.saveData({
      currentLevel: nextCurrent,
      highestLevelUnlocked: nextHighest,
      completedLevels: updatedCompleted,
      starsTotal: newTotalStars,
    });

    refreshSave();

    // Check if level completion unlocks a new world (up to world 100)
    if (lvlId < MAX_CAMPAIGN_LEVEL) {
      const oldWorld = getWorldForLevel(lvlId);
      const newWorld = getWorldForLevel(lvlId + 1);
      if (newWorld.id > oldWorld.id) {
        // Grant World Unlock Reward
        economy.addCoins(newWorld.rewards.coins);
        economy.addGems(newWorld.rewards.gems);
        setUnlockedWorldReward(newWorld);
        refreshSave();
      }
    }
  };

  return (
    <div className="w-full h-full max-w-md mx-auto bg-slate-950 text-slate-100 sm:rounded-3xl rounded-none overflow-hidden sm:border border-slate-800 shadow-2xl flex flex-col relative font-sans select-none">
      {/* ========================================================= */}
      {/* 1. SPLASH / ASSET LOADING SCREEN                          */}
      {/* ========================================================= */}
      {currentScreen === 'SPLASH' && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-between p-8 z-50 animate-in fade-in"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgba(2, 6, 23, 1)), url(/feature-graphic.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="my-auto flex flex-col items-center space-y-8 text-center drop-shadow-2xl">
            {/* Animated Logo Emblem */}
            <div className="relative">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 p-1.5 shadow-[0_0_50px_rgba(245,158,11,0.6)] animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-[1.6rem] flex items-center justify-center overflow-hidden border border-white/20">
                  <img src="/app-icon.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(245,158,11,0.5)' }}>TILE OASIS</h1>
              <p className="text-xs font-black text-amber-300 uppercase tracking-widest drop-shadow-md">
                Sanctuary Match
              </p>
            </div>

            {/* Subtle Progress Loading Bar */}
            <div className="w-64 bg-slate-950/80 backdrop-blur-md h-3 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-inner mt-4">
              <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 h-full rounded-full animate-pulse w-3/4 shadow-sm" />
            </div>
          </div>

          <span className="text-[11px] text-white/60 font-bold tracking-wide uppercase">
            Loading Oasis Assets...
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MAIN MENU SCREEN                                       */}
      {/* ========================================================= */}
      {currentScreen === 'MAIN_MENU' && (
        <PlayerMainMenu
          saveData={saveData}
          coins={coins}
          gems={gems}
          onPlayLevel={launchLevel}
          onNavigateScreen={(screen) => setCurrentScreen(screen)}
          onOpenSettings={() => setShowSettings(true)}
          onWalletUpdate={() => refreshSave()}
          onOpenAdmin={onOpenAdmin}
        />
      )}

      {/* ========================================================= */}
      {/* 3. WORLD MAP / SELECTION SCREEN                           */}
      {/* ========================================================= */}
      {currentScreen === 'LEVEL_MAP' && (
        <WorldMapView
          saveData={saveData}
          onSelectLevel={launchLevel}
          onBackToMainMenu={() => setCurrentScreen('MAIN_MENU')}
        />
      )}

      {/* ========================================================= */}
      {/* 4. SANCTUARY COLLECTION SCREEN                            */}
      {/* ========================================================= */}
      {currentScreen === 'COLLECTION' && (
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setCurrentScreen('MAIN_MENU');
              }}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center space-x-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <h2 className="text-sm font-black text-white">Sanctuary Collection</h2>
            <div className="w-12" />
          </div>

          <div className="flex-1 overflow-hidden">
            <CollectionView
              onCoinsChange={() => refreshSave()}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. OASIS EVENTS SCREEN                                    */}
      {/* ========================================================= */}
      {currentScreen === 'EVENTS' && (
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setCurrentScreen('MAIN_MENU');
              }}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center space-x-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <h2 className="text-sm font-black text-white">Oasis Events</h2>
            <div className="w-12" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-gradient-to-r from-teal-900/60 to-emerald-900/60 border border-teal-500/30 rounded-2xl p-4 space-y-2 shadow-lg">
              <span className="text-[10px] font-black text-teal-300 uppercase tracking-widest">
                Daily Match Event
              </span>
              <h3 className="text-base font-black text-white">Clear 30 Fruit Tiles</h3>
              <p className="text-xs text-slate-300">Reward: +150 Coins & 1 Undo Booster</p>
              <button
                onClick={() => launchLevel(saveData.currentLevel)}
                className="mt-2 py-2 px-4 rounded-xl bg-teal-500 text-white font-bold text-xs shadow-md hover:bg-teal-400 transition-all"
              >
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. SANCTUARY SHOP SCREEN                                  */}
      {/* ========================================================= */}
      {currentScreen === 'SHOP' && (
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setCurrentScreen('MAIN_MENU');
              }}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center space-x-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <h2 className="text-sm font-black text-white">Sanctuary Shop</h2>
            <div className="w-12" />
          </div>

          <div className="flex-1 overflow-hidden">
            <ShopView
              onClose={() => setCurrentScreen('MAIN_MENU')}
              onCurrencyUpdate={() => refreshSave()}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. GAMEPLAY ENGINE VIEW                                   */}
      {/* ========================================================= */}
      {currentScreen === 'GAMEPLAY' && (
        <div className="w-full h-full relative">
          <PlayerGameMode
            initialLevelId={selectedLevelId}
            onOpenDevTools={devUnlocked && onOpenDevMode ? onOpenDevMode : undefined}
            onExitToMap={() => {
              refreshSave();
              setCurrentScreen('LEVEL_MAP');
            }}
            onExitToMenu={() => {
              refreshSave();
              setCurrentScreen('MAIN_MENU');
            }}
            onLevelComplete={(lvlId, stars, score) => {
              handleLevelComplete(lvlId, stars, score);
            }}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* WORLD UNLOCK CELEBRATION MODAL                             */}
      {/* ========================================================= */}
      {unlockedWorldReward && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl space-y-4 relative">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/50 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                NEW WORLD UNLOCKED!
              </span>
              <h3 className="text-xl font-black text-white">{unlockedWorldReward.name}</h3>
              <p className="text-xs text-slate-300 font-medium">{unlockedWorldReward.subtitle}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1 text-amber-300 font-extrabold text-sm">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>+{unlockedWorldReward.rewards.coins}</span>
              </div>
              <div className="flex items-center space-x-1 text-teal-300 font-extrabold text-sm">
                <Gem className="w-4 h-4 text-teal-400" />
                <span>+{unlockedWorldReward.rewards.gems}</span>
              </div>
            </div>

            <button
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setUnlockedWorldReward(null);
                setCurrentScreen('LEVEL_MAP');
              }}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-xl hover:from-amber-400 hover:to-yellow-400 transition-all active:scale-95"
            >
              EXPLORE WORLD
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SETTINGS MODAL (Includes Secret Dev Unlock option)         */}
      {/* ========================================================= */}
      {showSettings && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl space-y-5 relative">
            <button
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setShowSettings(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight">SANCTUARY SETTINGS</h3>

            {settingsMessage && (
              <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold animate-in fade-in">
                {settingsMessage}
              </div>
            )}

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span>Sound SFX</span>
                </span>
                <button
                  onClick={toggleSound}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    soundEnabled ? 'bg-teal-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      soundEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                <span className="text-slate-300 font-semibold flex items-center space-x-2">
                  <Vibrate className="w-4 h-4 text-indigo-400" />
                  <span>Haptics</span>
                </span>
                <button
                  onClick={toggleHaptics}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    hapticsEnabled ? 'bg-indigo-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      hapticsEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                <span className="text-slate-300 font-semibold flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  <span>Reduced Motion</span>
                </span>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    reducedMotion ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      reducedMotion ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Diagnostics, Privacy & Recovery */}
            <div className="space-y-2 pt-1">
              <button
                id="open-privacy-policy-btn"
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  setShowPrivacyPolicy(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Privacy Policy & Terms</span>
              </button>

              <button
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  refreshSave();
                  setSettingsMessage('Save data verified & sanitized successfully!');
                  setTimeout(() => setSettingsMessage(null), 3000);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Verify & Repair Save Data</span>
              </button>

              {!showResetConfirm ? (
                <button
                  onClick={() => {
                    globalAudioService.emit('ButtonPressed');
                    setShowResetConfirm(true);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl text-rose-400/80 hover:text-rose-300 text-[11px] font-semibold transition-all hover:bg-rose-500/10"
                >
                  Reset Local Sanctuary Save...
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2 animate-in fade-in">
                  <p className="text-[11px] text-rose-300 font-bold">
                    Are you sure? This resets level progress and coins!
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        globalSaveService.resetSave();
                        refreshSave();
                        setShowResetConfirm(false);
                        setShowSettings(false);
                        setCurrentScreen('MAIN_MENU');
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-1 px-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Secret Dev & Admin Console (Only shown when secretly unlocked by tapping version 5 times) */}
            {devUnlocked && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2 animate-in fade-in">
                <div className="text-[10px] text-teal-400 font-mono font-bold uppercase tracking-wider text-center">
                  Super Admin & Developer Tools Unlocked
                </div>

                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-teal-900/30 active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-200" />
                    <span>Open Admin & Super Admin Portal</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowAdminAdDashboard(true);
                  }}
                  className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  <span>LiveOps & AdMob Console</span>
                </button>

                {onOpenDevMode && (
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      onOpenDevMode();
                    }}
                    className="w-full py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Developer Inspector</span>
                  </button>
                )}
              </div>
            )}

            {/* Secret Dev Unlock Trigger (Tapping Version 5 times) */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
              <p
                onClick={handleVersionTap}
                className="cursor-pointer hover:text-slate-400 select-none transition-colors font-mono"
                title="Triple Oasis Build Info"
              >
                Tile Oasis: Sanctuary Match v2.0.0-rc1
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. ADMOB TEST / LIVE BANNER FOOTER (Non-gameplay screens) */}
      {/* ========================================================= */}
      {adConfig.bannerEnabled && currentScreen !== 'GAMEPLAY' && currentScreen !== 'SPLASH' && (
        <>
          {!globalAdMobService.isNative() ? (
            <div className="w-full bg-slate-950 border-t border-slate-800/80 px-3 py-1.5 flex items-center justify-between z-20 text-[10px] text-slate-400 shrink-0 min-h-[50px]">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  Ad
                </span>
                <span className="font-medium text-slate-300">Sanctuary Match • Explore New Worlds & Boosters</span>
              </div>
              <button
                onClick={() => globalAdMobService.recordAdClick()}
                className="text-teal-400 hover:text-teal-300 font-bold underline"
              >
                Learn More
              </button>
            </div>
          ) : (
            <div className="w-full h-[50px] bg-slate-950 shrink-0 pointer-events-none z-0 border-t border-slate-900" />
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* 9. INTERACTIVE ADMOB SIMULATOR MODAL                      */}
      {/* ========================================================= */}
      <AdSimulationModal />

      {/* ========================================================= */}
      {/* 10. ADMIN & LIVEOPS ADMOB CONSOLE MODAL                   */}
      {/* ========================================================= */}
      {showAdminAdDashboard && (
        <AdminAdDashboard
          onClose={() => setShowAdminAdDashboard(false)}
          onRefreshAppState={() => {
            refreshSave();
            setAdConfig(globalAdMobService.getConfig());
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 11. PRIVACY POLICY & TERMS MODAL                          */}
      {/* ========================================================= */}
      <PrivacyPolicyModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </div>
  );
};
