import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameStateMachine } from '../engine/GameStateMachine';
import { MatchSystem } from '../engine/MatchSystem';
import { BoardAutoFitSystem } from '../engine/BoardAutoFitSystem';
import { LevelValidator } from '../engine/LevelValidator';
import { DifficultySystem } from '../engine/DifficultySystem';
import { ScoreSystem } from '../engine/ScoreSystem';
import { RewardSystem } from '../engine/RewardSystem';
import { ObjectiveEngine } from '../engine/ObjectiveEngine';
import { UndoBooster, ShuffleBooster, MagnetBooster } from '../engine/BoosterEngine';
import { isTileOccluded } from '../engine/TileOcclusion';
import { globalAudioService } from '../services/AudioService';
import { LocalEconomyService } from '../services/EconomyService';
import { globalSaveService } from '../services/SaveService';
import { globalAdMobService } from '../services/AdMobService';
import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';
import { LevelPrefetcher } from '../engine/LevelPrefetcher';
import { CoreGameplayEngine } from '../engine/CoreGameplayEngine';
import { BoosterButton } from './BoosterButton';
import { BoosterShopModal } from './BoosterShopModal';
import { LevelResultModal } from './LevelResultModal';
import { MechanicTutorialModal } from './MechanicTutorialModal';
import { LevelResult } from '../types/runtimeContract';
import { ProgressionUpdateReport } from '../engine/ProgressionIntegration';
import { generateLevelDefinition, TILE_TYPE_MAP, ALL_TILE_TYPES } from '../data/levelDefinitions';
import {
  BoardTile,
  TrayTileItem,
  LevelDefinition,
  GameState,
  TrayConfiguration,
  ViewportDimensions,
  BoosterType
} from '../types/gameEngine';
import {
  Pause,
  RotateCcw,
  Shuffle,
  Zap,
  Gift,
  Trophy,
  Play,
  RotateCw,
  Volume2,
  VolumeX,
  ShieldAlert,
  Award,
  Star,
  Settings,
  X,
  Coins,
  Gem,
  Flame,
  ChevronRight,
  HelpCircle,
  Vibrate,
  Home,
  CheckCircle2,
  Flag,
  Calendar,
  Swords,
  Lock,
  ArrowLeft,
  MapPin,
  AlertTriangle,
  Timer,
  Target,
  Snowflake,
  Link2,
  Key,
  Crown,
  Tv,
} from 'lucide-react';

export type GameModeType = 'STANDARD' | 'EVENT' | 'TOURNAMENT';

interface PlayerGameModeProps {
  initialLevelId?: number;
  onOpenDevTools?: () => void;
  onExitToMap?: () => void;
  onExitToMenu?: () => void;
  onLevelComplete?: (levelId: number, stars: number, score: number) => void;
}

interface ScorePopupItem {
  id: string;
  text: string;
  combo: number;
}

export const PlayerGameMode: React.FC<PlayerGameModeProps> = ({
  initialLevelId = 1,
  onOpenDevTools,
  onExitToMap,
  onExitToMenu,
  onLevelComplete,
}) => {
  // Services & Authoritative Core Engine
  const engineRef = useRef<CoreGameplayEngine | null>(null);
  const [economy] = useState(() => new LocalEconomyService());
  const [gameState, setGameState] = useState<GameState>('BOOT');

  // Game Mode Configuration (Standard, Event, Tournament)
  const [gameMode, setGameMode] = useState<GameModeType>('STANDARD');

  // Level & Game Engine State
  const [levelId, setLevelId] = useState<number>(initialLevelId);
  const [levelDef, setLevelDef] = useState<LevelDefinition>(
    () => RuntimeLevelRegistry.getLevel(initialLevelId) || generateLevelDefinition(initialLevelId)
  );
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>([]);
  const [trayTiles, setTrayTiles] = useState<TrayTileItem[]>([]);

  // Tray Config
  const [trayConfig, setTrayConfig] = useState<TrayConfiguration>({
    capacity: 7,
    maxCapacityLimit: 9,
    unlockedSlots: 7,
    isExtraSlotActive: false,
  });

  // Score & Rewards
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [movesUsed, setMovesUsed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(undefined);
  const [coins, setCoins] = useState<number>(economy.getCoins());
  const [gems, setGems] = useState<number>(economy.getGems());
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [completionOutput, setCompletionOutput] = useState<{
    result: LevelResult;
    progressionReport?: ProgressionUpdateReport | null;
  } | null>(null);
  const [previousHighScore, setPreviousHighScore] = useState<number>(0);

  // Audio & Settings State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  // Boosters
  const [boosterCounts, setBoosterCounts] = useState({
    undo: economy.getBoosterCount('undo'),
    shuffle: economy.getBoosterCount('shuffle'),
    magnet: economy.getBoosterCount('magnet'),
    extra_slot: economy.getBoosterCount('extra_slot'),
  });
  const [shopBoosterId, setShopBoosterId] = useState<BoosterType | null>(null);

  // UI Feedback States (Popups, Animations, Toasts)
  const [activeBoosterHint, setActiveBoosterHint] = useState<string | null>(null);
  const [scorePopups, setScorePopups] = useState<ScorePopupItem[]>([]);
  const [recentlyUnlockedIds, setRecentlyUnlockedIds] = useState<Set<string>>(new Set());
  const [matchedSlotIndices, setMatchedSlotIndices] = useState<number[]>([]);
  const [isBoardShuffling, setIsBoardShuffling] = useState<boolean>(false);
  const [revealedStars, setRevealedStars] = useState<number>(0);
  const [activeTutorialMechanic, setActiveTutorialMechanic] = useState<string | null>(null);
  const [shakingTileId, setShakingTileId] = useState<string | null>(null);
  const [defeatReason, setDefeatReason] = useState<string>('');

  // Mobile Safe Area & Auto-Fit Viewport
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<ViewportDimensions>({
    width: 390,
    height: 700,
    safeAreaTop: 20,
    safeAreaBottom: 24,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    deviceType: 'iphone_notch',
  });

  // Previous Board Tiles ref for tracking Layer Reveals
  const prevBoardTilesRef = useRef<BoardTile[]>([]);

  // Audio Settings Sync
  useEffect(() => {
    globalAudioService.enabled = soundEnabled;
  }, [soundEnabled]);

  // Authoritative Core Gameplay Engine Initialization
  useEffect(() => {
    // Load previous high score for current level
    const prevRec = globalSaveService.loadSave().completedLevels[levelId];
    setPreviousHighScore(prevRec ? prevRec.highScore : 0);
    setCompletionOutput(null);

    const engine = new CoreGameplayEngine({
      levelId,
      saveService: globalSaveService,
      economyService: economy,
      onStateChange: (newState) => {
        setGameState(newState);
      },
      onBoardChange: (newBoardTiles, newTrayTiles) => {
        setBoardTiles(newBoardTiles);
        setTrayTiles(newTrayTiles);
        if (engineRef.current) {
          setScore(engineRef.current.getScore());
          setCombo(engineRef.current.getCombo());
          setMovesUsed(engineRef.current.getSession().state.movesUsed || 0);
          setTimeRemaining(engineRef.current.getTimeRemainingSeconds());
        }
      },
      onWin: (output) => {
        setEarnedStars(output.result.stars);
        setCompletionOutput(output);
        setCoins(economy.getCoins());
        setGems(economy.getGems());
        if (onLevelComplete) {
          onLevelComplete(output.result.levelId, output.result.stars, output.result.score);
        }
        globalAudioService.emit('LevelWon');
        triggerHaptics([30, 60, 30, 60, 100]);
      },
      onLose: (output) => {
        setDefeatReason(output?.reason || 'Tray Full - No Moves Remaining');
        globalAudioService.emit('LevelLost');
        triggerHaptics([50, 100, 50]);
      },
    });

    engineRef.current = engine;
    const currentDef = engine.getLevelDefinition();
    setLevelDef(currentDef);
    setBoardTiles(engine.getBoardTiles());
    setTrayTiles(engine.getTrayTiles());
    setScore(engine.getScore());
    setCombo(engine.getCombo());
    setTrayConfig(engine.getTrayConfig());
    setGameState('LEVEL_READY');

    prevBoardTilesRef.current = engine.getBoardTiles();
    setRecentlyUnlockedIds(new Set());
    setMatchedSlotIndices([]);

    // Check if level introduces a special mechanic not seen yet
    try {
      const seenRaw = localStorage.getItem('zen_seen_mechanics') || '[]';
      const parsedSeen = JSON.parse(seenRaw);
      const seenMechanics: string[] = Array.isArray(parsedSeen) ? parsedSeen : [];
      const specialProps = (currentDef?.tiles || [])
        .map((t) => t?.specialProperty)
        .filter((p): p is NonNullable<typeof p> => Boolean(p));

      const unseen = specialProps.find((p) => !seenMechanics.includes(p));
      if (unseen) {
        setActiveTutorialMechanic(unseen);
        engine.pause();
        localStorage.setItem('zen_seen_mechanics', JSON.stringify([...seenMechanics, unseen]));
      }
    } catch (e) {
      // Safe fallback
    }

    // Prefetch next level in background
    LevelPrefetcher.prefetchCurrentAndNext(levelId);

    const unsub = engine.getStateMachine().subscribe((newState) => {
      setGameState(newState);
    });

    return () => {
      unsub();
    };
  }, [levelId]);

  // Synchronize timer for Time Attack levels
  useEffect(() => {
    const timer = setInterval(() => {
      if (engineRef.current) {
        const tr = engineRef.current.getTimeRemainingSeconds();
        if (tr !== undefined) {
          setTimeRemaining(tr);
        }
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);

  // Track Unlocked Tiles (Layer Reveal Effect)
  useEffect(() => {
    if (boardTiles.length === 0) return;
    const prevTiles = prevBoardTilesRef.current;
    if (prevTiles.length <= boardTiles.length) {
      prevBoardTilesRef.current = boardTiles;
      return;
    }

    const newlyAvailableIds = new Set<string>();
    boardTiles.forEach((tile) => {
      const wasOccluded = isTileOccluded(tile, prevTiles);
      const isNowOccluded = isTileOccluded(tile, boardTiles);
      if (wasOccluded && !isNowOccluded) {
        newlyAvailableIds.add(tile.id);
      }
    });

    if (newlyAvailableIds.size > 0) {
      setRecentlyUnlockedIds(newlyAvailableIds);
      const timer = setTimeout(() => {
        setRecentlyUnlockedIds(new Set());
      }, 650);
      prevBoardTilesRef.current = boardTiles;
      return () => clearTimeout(timer);
    }
    prevBoardTilesRef.current = boardTiles;
  }, [boardTiles]);

  // Sequential Star Reveal Animation for Win Modal
  useEffect(() => {
    if (gameState === 'WIN') {
      setRevealedStars(0);
      const t1 = setTimeout(() => setRevealedStars(1), 250);
      const t2 = setTimeout(() => setRevealedStars(2), 550);
      const t3 = setTimeout(() => setRevealedStars(earnedStars), 850);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [gameState, earnedStars]);

  // Handle Resize for Responsive Auto-Fit
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewport({
          width: Math.max(300, rect.width),
          height: Math.max(450, rect.height),
          safeAreaTop: 16,
          safeAreaBottom: 20,
          safeAreaLeft: 0,
          safeAreaRight: 0,
          deviceType: rect.width < 400 ? 'small_phone' : rect.width < 700 ? 'large_phone' : 'tablet',
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridBounds = useMemo(() => {
    if (!levelDef?.tiles || levelDef.tiles.length === 0) return undefined;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    levelDef.tiles.forEach((t) => {
      if (t.x < minX) minX = t.x;
      if (t.x > maxX) maxX = t.x;
      if (t.y < minY) minY = t.y;
      if (t.y > maxY) maxY = t.y;
    });
    return { minX, maxX, minY, maxY };
  }, [levelDef]);

  const layout = BoardAutoFitSystem.calculateLayout(viewport, gridBounds);

  // Trigger Haptics Helper
  const triggerHaptics = (pattern: number | number[]) => {
    if (hapticsEnabled && typeof window !== 'undefined' && window.navigator?.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Add Score Popup Helper
  const triggerScorePopup = (text: string, currentCombo: number) => {
    const newPopup: ScorePopupItem = {
      id: `popup_${Date.now()}_${Math.random()}`,
      text,
      combo: currentCombo,
    };
    setScorePopups((prev) => [...prev, newPopup]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== newPopup.id));
    }, 850);
  };

  // Start Level Action
  const handleStartGameplay = () => {
    if (engineRef.current) {
      engineRef.current.getStateMachine().transitionTo('PLAYING');
      engineRef.current.getStateMachine().transitionTo('PLAYER_INPUT');
      setGameState('PLAYER_INPUT');
      globalAudioService.emit('ButtonPressed');
      triggerHaptics(15);
    }
  };

  // Pause Level Action
  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
      globalAudioService.emit('ButtonPressed');
      triggerHaptics(10);
    }
  };

  // Resume Level Action
  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.resume();
      globalAudioService.emit('ButtonPressed');
      triggerHaptics(10);
    }
  };

  // Restart Level Action
  const handleRestart = () => {
    if (engineRef.current) {
      globalAudioService.emit('ButtonPressed');
      triggerHaptics(15);
      engineRef.current.restartLevel();
    }
  };

  // Exit Gameplay Action
  const handleExitGame = () => {
    globalAudioService.emit('ButtonPressed');
    triggerHaptics(10);
    if (onExitToMap) {
      onExitToMap();
    } else if (onExitToMenu) {
      onExitToMenu();
    }
  };

  // Tile Selection Handler (Delegates to Authoritative CoreGameplayEngine)
  const handleTileSelect = (tile: BoardTile) => {
    if (!engineRef.current) return;

    const res = engineRef.current.handleTileSelect(tile.id);
    if (!res.success) {
      setShakingTileId(tile.id);
      setTimeout(() => setShakingTileId((prev) => (prev === tile.id ? null : prev)), 350);
      globalAudioService.emit('TileBlocked');
      triggerHaptics([10, 40, 10]);
    } else {
      triggerHaptics(12);
    }
  };

  // Booster Execution Handler (Delegates to Authoritative CoreGameplayEngine)
  const handleBoosterClick = (boosterType: BoosterType) => {
    if (!engineRef.current) return;

    if (boosterCounts[boosterType as keyof typeof boosterCounts] <= 0) {
      setActiveBoosterHint(`Out of ${boosterType.toUpperCase()} boosters!`);
      triggerHaptics([10, 40, 10]);
      setTimeout(() => setActiveBoosterHint(null), 2000);
      return;
    }

    const res = engineRef.current.activateBooster(boosterType);
    if (res.success) {
      globalAudioService.emit('BoosterActivated');
      triggerHaptics([20, 40, 20]);
      setActiveBoosterHint(`Activated ${boosterType.toUpperCase()}`);
      setBoosterCounts({
        undo: economy.getBoosterCount('undo'),
        shuffle: economy.getBoosterCount('shuffle'),
        magnet: economy.getBoosterCount('magnet'),
        extra_slot: economy.getBoosterCount('extra_slot'),
      });
    } else {
      setActiveBoosterHint(res.message);
      triggerHaptics([10, 40, 10]);
    }

    setTimeout(() => setActiveBoosterHint(null), 1800);
  };

  // Revive Defeat Action
  const handleRevive = () => {
    if (economy.deductGems(5) || true) {
      if (engineRef.current) {
        const reviveRes = engineRef.current.revive(3);
        setBoardTiles(reviveRes.boardTiles);
        setTrayTiles(reviveRes.trayTiles);
      }
      setGameState('PLAYING');
      globalAudioService.emit('ButtonPressed');
      triggerHaptics(20);
      setGems(economy.getGems());
    }
  };

  // Rewarded Ad Revive
  const handleReviveWithAd = () => {
    globalAudioService.emit('ButtonPressed');
    globalAdMobService.showRewardedVideo('GAMEPLAY_REVIVE', () => {
      if (engineRef.current) {
        const reviveRes = engineRef.current.revive(3);
        setBoardTiles(reviveRes.boardTiles);
        setTrayTiles(reviveRes.trayTiles);
      }
      setGameState('PLAYING');
      globalAudioService.emit('RewardReceived');
      triggerHaptics(25);
    });
  };

  // Total initial tiles for objective progress bar
  const totalLevelTiles = levelDef.tiles.length;
  const currentRemainingTiles = boardTiles.length + trayTiles.length;
  const clearedTilesCount = totalLevelTiles - currentRemainingTiles;
  const progressPercent = totalLevelTiles > 0 ? Math.min(100, Math.round((clearedTilesCount / totalLevelTiles) * 100)) : 0;

  // Dynamic Tray Pressure Level based on actual tray capacity
  const occupiedSlots = trayTiles.length;
  const isTrayWarning = occupiedSlots >= trayConfig.capacity - 1;
  const isTrayFullState = occupiedSlots >= trayConfig.capacity;

  // Smart Match Assistance: Calculate types present in tray to visually guide the player
  const trayTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of trayTiles) {
      counts[t.typeId] = (counts[t.typeId] || 0) + 1;
    }
    return counts;
  }, [trayTiles]);

  // Types that have 2 tiles in tray (clicking the 3rd tile on the board immediately clears the triplet!)
  const immediateMatchTypes = useMemo(() => {
    const set = new Set<string>();
    for (const [typeId, count] of Object.entries(trayTypeCounts)) {
      if ((count as number) >= 2) set.add(typeId);
    }
    return set;
  }, [trayTypeCounts]);

  // Types that have at least 1 tile in tray
  const matchingTrayTypes = useMemo(() => {
    return new Set(Object.keys(trayTypeCounts));
  }, [trayTypeCounts]);

  // Free Zen Blessing Continue (Rescues player by clearing 3 tray slots for seamless play)
  const handleZenBlessing = () => {
    if (engineRef.current) {
      const reviveRes = engineRef.current.revive(3);
      setBoardTiles(reviveRes.boardTiles);
      setTrayTiles(reviveRes.trayTiles);
    }
    setGameState('PLAYING');
    globalAudioService.emit('RewardReceived');
    triggerHaptics([20, 60, 20]);
  };


  return (
    <div
      ref={containerRef}
      className="w-full h-full max-w-lg mx-auto text-slate-100 sm:rounded-3xl rounded-none overflow-hidden shadow-2xl flex flex-col relative select-none font-sans"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(2, 6, 23, 0.95)), url(/feature-graphic.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#020617', // fallback
      }}
    >
      {/* TOP GAME HUD */}
      <div
        style={{ paddingTop: `${viewport.safeAreaTop + 6}px` }}
        className="bg-slate-950/80 backdrop-blur-md px-3 sm:px-4 py-2 border-b-2 border-amber-600/50 flex items-center justify-between z-20 shrink-0 select-none shadow-lg"
      >
        {/* LEFT: Return to Map & Pause */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {(onExitToMap || onExitToMenu) && (
            <button
              onClick={handleExitGame}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-[4px] border-slate-600 hover:border-slate-500 flex items-center justify-center text-amber-400 transition-all shadow-md cursor-pointer"
              title="Return to Map"
              aria-label="Return to Map"
            >
              <ArrowLeft className="w-5 h-5 drop-shadow-md" />
            </button>
          )}

          <button
            onClick={handlePause}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-[4px] border-slate-600 hover:border-slate-500 flex items-center justify-center text-slate-200 transition-all shadow-md cursor-pointer"
            title="Pause Game"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4 drop-shadow-md" />
          </button>
        </div>

        {/* CENTER: Level Badge & Difficulty */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-950/80 to-indigo-950/80 border border-teal-500/40 px-3 py-0.5 rounded-full shadow-inner">
            <span className="text-xs font-black tracking-wide text-teal-300 uppercase">
              LEVEL {levelDef.id}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span
              className={`text-[11px] font-black ${
                levelDef.difficulty === 'Expert'
                  ? 'text-red-400'
                  : levelDef.difficulty === 'Hard' || levelDef.difficulty === 'Very Hard'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {levelDef.difficulty}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 mt-0.5 max-w-[140px] truncate text-center">
            {levelDef.worldName}
          </span>
        </div>

        {/* RIGHT: Economy Currencies */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full text-amber-300 text-xs font-extrabold shadow-sm">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold">{coins}</span>
          </div>

          <div className="flex items-center space-x-1 bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full text-teal-300 text-xs font-extrabold shadow-sm">
            <Gem className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono font-bold">{gems}</span>
          </div>
        </div>
      </div>

      {/* LEVEL OBJECTIVE BAR */}
      <div className="bg-slate-900/90 px-3 sm:px-4 py-2 border-b border-slate-800/80 flex flex-col space-y-1.5 z-10 shrink-0 select-none">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap gap-y-1">
            <div className="flex items-center space-x-1.5 bg-slate-950/70 px-2.5 py-0.5 rounded-lg border border-slate-800 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-bold text-slate-300 text-[11px]">TILES</span>
              <span className="text-teal-400 font-mono text-[11px] font-black">
                {clearedTilesCount}/{totalLevelTiles}
              </span>
            </div>

            {/* Time Attack Countdown Indicator */}
            {timeRemaining !== undefined && (
              <div
                className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-lg font-mono font-black text-[11px] border ${
                  timeRemaining <= 10
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 animate-pulse ring-1 ring-rose-500/50'
                    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                }`}
              >
                <Timer className="w-3.5 h-3.5 text-cyan-400" />
                <span>{timeRemaining}s</span>
              </div>
            )}

            {/* Move Limit Indicator */}
            {(() => {
              const moveLimitObj = levelDef.objectives?.find((o) => o.type === 'move_limit');
              const maxMoves = moveLimitObj?.targetValue || (levelDef.objectives as any)?.maxMoves;
              if (maxMoves) {
                const remainingMoves = Math.max(0, maxMoves - movesUsed);
                return (
                  <div
                    className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-lg font-mono font-black text-[11px] border ${
                      remainingMoves <= 3
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 animate-pulse ring-1 ring-rose-500/50'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>{remainingMoves} MOVES</span>
                  </div>
                );
              }
              return null;
            })()}

            {/* Frozen Obstacles Remaining Indicator */}
            {(() => {
              const frozenCount = (boardTiles || []).filter((t) => t && t.specialProperty === 'frozen').length;
              if (frozenCount > 0) {
                return (
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-cyan-950/60 text-cyan-200 border border-cyan-500/30 font-bold text-[10px]">
                    <Snowflake className="w-3 h-3 text-cyan-400" />
                    <span>{frozenCount} Ice</span>
                  </div>
                );
              }
              return null;
            })()}

            {/* Chained Obstacles Remaining Indicator */}
            {(() => {
              const chainCount = (boardTiles || []).filter((t) => t && t.specialProperty === 'chained').length;
              if (chainCount > 0) {
                return (
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-950/60 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                    <Link2 className="w-3 h-3 text-amber-400" />
                    <span>{chainCount} Chains</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div className="flex items-center space-x-2 text-xs shrink-0">
            <div>
              Score: <strong className="text-teal-400 font-mono font-black">{score}</strong>
            </div>
            {combo > 1 && (
              <span className="text-amber-400 font-black animate-bounce flex items-center space-x-0.5 bg-amber-500/15 px-1.5 py-0.5 rounded-full border border-amber-500/40">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>x{combo}</span>
              </span>
            )}
          </div>
        </div>

        {/* Level Progress Bar with 3-Star Milestone Notches */}
        <div className="relative w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            style={{ width: `${progressPercent}%` }}
            className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-500 h-full rounded-full transition-all duration-300"
          />
          {/* Milestone markers at 33%, 66%, 100% */}
          <div className="absolute inset-0 flex justify-between px-4 pointer-events-none items-center">
            <div className={`w-1.5 h-1.5 rounded-full ${progressPercent >= 33 ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'}`} />
            <div className={`w-1.5 h-1.5 rounded-full ${progressPercent >= 66 ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'}`} />
            <div className={`w-1.5 h-1.5 rounded-full ${progressPercent >= 100 ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'}`} />
          </div>
        </div>
      </div>

      {/* GAME BOARD (Primary Visual Focus) */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden z-10">
        
        {/* Active Booster Toast Hint */}
        {activeBoosterHint && (
          <div className="absolute top-0 inset-x-6 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold py-2 px-4 rounded-full shadow-xl text-center z-30 animate-in slide-in-from-top-4 border border-white/40 mx-auto max-w-xs">
            {activeBoosterHint}
          </div>
        )}

        {/* Floating Score Popups */}
        <div className="absolute inset-x-0 top-16 flex flex-col items-center pointer-events-none z-30 space-y-1">
          {scorePopups.map((popup) => (
            <div
              key={popup.id}
              className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg animate-float-score flex items-center space-x-1"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950" />
              <span>{popup.text}</span>
            </div>
          ))}
        </div>


        {/* Dynamic 3D Layered Tile Stack */}
        <div
          style={{
            width: `${layout.boardWidth}px`,
            height: `${layout.boardHeight}px`,
          }}
          className={`relative transition-all duration-300 flex items-center justify-center ${
            isBoardShuffling ? 'rotate-180 scale-90 opacity-80 duration-300' : ''
          }`}
        >
          {boardTiles.map((tile) => {
            const theme = TILE_TYPE_MAP[tile.typeId] || ALL_TILE_TYPES[0];
            const blocked = isTileOccluded(tile, boardTiles);
            const isNewlyRevealed = recentlyUnlockedIds.has(tile.id);

            const gridCenterX = layout.gridCenterX ?? 2.5;
            const gridCenterY = layout.gridCenterY ?? 2.5;

            const posX = (tile.x - gridCenterX) * layout.tileSpacing;
            const posY = (tile.y - gridCenterY) * layout.tileSpacing;
            const layerOffset = tile.layer * -layout.layerOffsetPixels;

            const tileWidth = layout.tileSize;
            const tileHeight = Math.floor(layout.tileSize * 1.16);

            return (
              <button
                key={tile.id}
                onClick={() => handleTileSelect(tile)}
                style={{
                  width: `${tileWidth}px`,
                  height: `${tileHeight}px`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${Math.floor(tileWidth / 2)}px`,
                  marginTop: `-${Math.floor(tileHeight / 2)}px`,
                  transform: `translate3d(${posX}px, ${posY + layerOffset}px, ${tile.layer * 10}px)`,
                  zIndex: tile.layer * 100 + Math.floor((tile.y + 10) * 10) + Math.floor(tile.x),
                }}
                className={`absolute rounded-[14px] sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-150 select-none active:scale-90
                  ${shakingTileId === tile.id ? 'animate-tile-blocked ring-2 ring-rose-500' : ''}
                  ${
                    blocked
                      ? 'bg-slate-200 border-slate-400 text-slate-400 opacity-90 cursor-not-allowed shadow-none grayscale-[50%]'
                      : `bg-white border-[#d1d5db] text-slate-800 cursor-pointer hover:scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${
                          isNewlyRevealed
                            ? 'animate-tile-reveal ring-4 ring-amber-400'
                            : immediateMatchTypes.has(tile.typeId)
                            ? 'ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]'
                            : isTrayWarning && matchingTrayTypes.has(tile.typeId)
                            ? 'ring-2 ring-teal-400/80 shadow-[0_0_8px_rgba(45,212,191,0.4)]'
                            : ''
                        }`
                  }`}
              >
                {/* 3D Bottom Depth Shadow */}
                {!blocked && (
                  <div className="absolute -bottom-[6px] inset-x-0 h-[6px] bg-[#9ca3af] rounded-b-[14px] sm:rounded-b-2xl pointer-events-none" />
                )}

                {/* 3D Glass Top Bevel Highlight */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-white/80 rounded-t-[14px] sm:rounded-t-2xl pointer-events-none" />

                {/* Match Hint Guide Badge */}
                {!blocked && immediateMatchTypes.has(tile.typeId) && !tile.specialProperty && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-[7px] sm:text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-md border border-white/80 flex items-center space-x-0.5 animate-pulse z-20">
                    <CheckCircle2 className="w-2 h-2 text-slate-950" />
                    <span>MATCH</span>
                  </div>
                )}

                {/* Special Tile Badges */}
                {tile.specialProperty === 'rainbow' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-white/60 flex items-center space-x-0.5 animate-pulse z-20">
                    <Star className="w-2.5 h-2.5 text-pink-200 fill-pink-200" />
                    <span>WILD</span>
                  </div>
                )}

                {tile.specialProperty === 'golden' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-yellow-200 flex items-center space-x-0.5 z-20">
                    <Star className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                    <span>2X</span>
                  </div>
                )}

                {tile.specialProperty === 'bomb' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-600 to-red-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-rose-300 flex items-center space-x-0.5 z-20 animate-bounce">
                    <Flame className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
                    <span>BOMB</span>
                  </div>
                )}

                {tile.specialProperty === 'key' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-amber-200 flex items-center space-x-0.5 z-20">
                    <Key className="w-2.5 h-2.5 text-slate-950" />
                    <span>KEY</span>
                  </div>
                )}

                {/* Icon Presentation */}
                <span
                  style={{ fontSize: `${Math.floor(layout.tileSize * 0.48)}px` }}
                  className="drop-shadow-md select-none pointer-events-none"
                >
                  {theme.icon}
                </span>

                {/* Frozen Tile Ice Overlay */}
                {tile.specialProperty === 'frozen' && (
                  <div className="absolute inset-0 bg-cyan-950/70 backdrop-blur-[1px] border-2 border-cyan-400/90 rounded-2xl flex flex-col items-center justify-center pointer-events-none z-10">
                    <div className="p-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 mb-0.5">
                      <Snowflake className="w-4 h-4 text-cyan-300 animate-spin-slow" />
                    </div>
                    <span className="text-[8px] font-black text-cyan-200 uppercase tracking-tight bg-cyan-950/90 px-1.5 py-0.2 rounded-full border border-cyan-400/40">
                      FROZEN {tile.freezeLevel && tile.freezeLevel > 1 ? `x${tile.freezeLevel}` : ''}
                    </span>
                  </div>
                )}

                {/* Chained Tile Iron Link Overlay */}
                {tile.specialProperty === 'chained' && (
                  <div className="absolute inset-0 bg-slate-950/75 border-2 border-amber-500/80 rounded-2xl flex flex-col items-center justify-center pointer-events-none z-10">
                    <div className="p-1 rounded-full bg-amber-500/20 border border-amber-500/50 mb-0.5">
                      <Link2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[8px] font-black text-amber-300 uppercase tracking-tight bg-slate-900/95 px-1.5 py-0.2 rounded-full border border-amber-500/50">
                      {tile.chainCount && tile.chainCount > 1 ? `${tile.chainCount} CHAINS` : 'CHAINED'}
                    </span>
                  </div>
                )}

                {/* Blocked Tile Lock Indicator Overlay */}
                {blocked && tile.specialProperty !== 'frozen' && tile.specialProperty !== 'chained' && (
                  <div className="absolute inset-0 bg-slate-950/40 rounded-2xl flex items-center justify-center">
                    <div className="p-1 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>




      {/* TRAY DOCK & BOOSTER BAR (Bottom Anchored) */}
      <div
        style={{ paddingBottom: `${viewport.safeAreaBottom + 8}px` }}
        className="bg-slate-950/80 backdrop-blur-md border-t border-white/20 px-4 py-3 flex flex-col items-center space-y-2.5 z-10 shrink-0"
      >
        {/* Tray Dock Header & Capacity Pressure */}
        <div className="flex items-center justify-between w-full text-xs font-medium px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-white font-bold drop-shadow-md">Storage Tray</span>
            {isTrayWarning && (
              <span className="bg-rose-500/90 text-white border border-rose-300 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse flex items-center space-x-1 shadow-md">
                <AlertTriangle className="w-3 h-3 text-white" />
                <span>CRITICAL DANGER</span>
              </span>
            )}
          </div>
          <span className={`font-mono font-bold drop-shadow-md ${isTrayWarning ? 'text-rose-400 font-black' : 'text-amber-300'}`}>
            {trayTiles.length} / {trayConfig.capacity} slots filled
          </span>
        </div>

        {/* Polished Tray Dock Slots */}
        <div
          className={`flex items-center justify-center space-x-1.5 bg-slate-950/95 p-2 rounded-2xl w-full shadow-inner min-h-[66px] transition-all border ${
            isTrayWarning
              ? 'border-rose-500 animate-tray-warning shadow-[0_0_20px_rgba(244,63,94,0.5)]'
              : occupiedSlots >= 4
              ? 'border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'border-white/20'
          }`}
        >
          {Array.from({ length: trayConfig.capacity }).map((_, idx) => {
            const item = trayTiles[idx];
            const theme = item ? TILE_TYPE_MAP[item.typeId] : null;
            const isMatchedSlot = matchedSlotIndices.includes(idx);

            return (
              <div
                key={idx}
                className={`flex-1 max-w-[48px] h-[54px] sm:h-[58px] rounded-xl border flex items-center justify-center relative transition-all duration-200 ${
                  item && theme
                    ? `bg-gradient-to-br ${theme.colorGradient} border-white/40 shadow-lg transform scale-105 ${
                        isMatchedSlot ? 'animate-match-burst ring-4 ring-amber-400 z-20' : 'animate-in fade-in zoom-in-75'
                      }`
                    : 'bg-slate-900/60 border-slate-800/80 shadow-inner'
                }`}
              >
                {theme ? (
                  <>
                    <div className="absolute top-0 inset-x-0 h-1 bg-white/25 rounded-t-xl" />
                    {item?.specialProperty === 'rainbow' && (
                      <span className="absolute -top-1 -right-1 text-[8px] bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-1 py-0.2 font-black shadow border border-white/50 flex items-center gap-0.5">
                        <Star className="w-2 h-2 text-pink-200 fill-pink-200" />
                      </span>
                    )}
                    {item?.specialProperty === 'golden' && (
                      <span className="absolute -top-1 -right-1 text-[8px] bg-amber-400 text-slate-950 rounded-full px-1 py-0.2 font-black shadow border border-yellow-200 flex items-center gap-0.5">
                        <Star className="w-2 h-2 fill-slate-950" />
                      </span>
                    )}
                    <span className="text-2xl drop-shadow select-none">{theme.icon}</span>
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/30 rounded-b-xl" />
                  </>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-800/60" />
                )}
              </div>
            );
          })}
        </div>

        {/* Player Booster Bar */}
        <div className="grid grid-cols-4 gap-2 w-full pt-1">
          <BoosterButton
            boosterId="undo"
            quantity={boosterCounts.undo}
            playerLevel={levelId}
            isEngineBusy={engineRef.current ? !engineRef.current.getStateMachine().canUseBoosters() : false}
            canUse={engineRef.current ? engineRef.current.getHistoryCount() > 0 : false}
            onActivate={(bId) => handleBoosterClick(bId)}
            onOpenShop={(bId) => setShopBoosterId(bId)}
          />
          <BoosterButton
            boosterId="shuffle"
            quantity={boosterCounts.shuffle}
            playerLevel={levelId}
            isEngineBusy={engineRef.current ? !engineRef.current.getStateMachine().canUseBoosters() : false}
            canUse={boardTiles.length > 1}
            onActivate={(bId) => handleBoosterClick(bId)}
            onOpenShop={(bId) => setShopBoosterId(bId)}
          />
          <BoosterButton
            boosterId="magnet"
            quantity={boosterCounts.magnet}
            playerLevel={levelId}
            isEngineBusy={engineRef.current ? !engineRef.current.getStateMachine().canUseBoosters() : false}
            canUse={true}
            onActivate={(bId) => handleBoosterClick(bId)}
            onOpenShop={(bId) => setShopBoosterId(bId)}
          />
          <BoosterButton
            boosterId="extra_slot"
            quantity={boosterCounts.extra_slot}
            playerLevel={levelId}
            isEngineBusy={engineRef.current ? !engineRef.current.getStateMachine().canUseBoosters() : false}
            canUse={trayConfig.capacity < trayConfig.maxCapacityLimit}
            onActivate={(bId) => handleBoosterClick(bId)}
            onOpenShop={(bId) => setShopBoosterId(bId)}
          />
        </div>
      </div>

      {/* BOOSTER SHOP MODAL */}
      {shopBoosterId && (
        <BoosterShopModal
          initialBoosterId={shopBoosterId}
          coins={coins}
          gems={gems}
          onClose={() => setShopBoosterId(null)}
          onPurchased={() => {
            setCoins(economy.getCoins());
            setGems(economy.getGems());
            setBoosterCounts({
              undo: economy.getBoosterCount('undo'),
              shuffle: economy.getBoosterCount('shuffle'),
              magnet: economy.getBoosterCount('magnet'),
              extra_slot: economy.getBoosterCount('extra_slot'),
            });
          }}
        />
      )}

      {/* =================================================== */}
      {/* IN-GAME OVERLAY MODALS (Start, Pause, Win, Lose)   */}
      {/* =================================================== */}

      {/* 1. LEVEL START EXPERIENCE MODAL */}
      {gameState === 'LEVEL_READY' && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-40 animate-in fade-in">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-teal-500/40 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5">
            <div className="w-20 h-20 bg-gradient-to-tr from-teal-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 text-white font-black text-2xl">
              {levelDef.id}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-teal-400 tracking-wider">
                {levelDef.worldName}
              </span>
              <h2 className="text-2xl font-black text-white">{levelDef.name}</h2>
              <span className="text-xs text-slate-400 block">
                Difficulty: <strong className="text-emerald-400">{levelDef.difficulty}</strong>
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">Level Objective</span>
              <div className="flex items-center justify-center space-x-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Match and clear all {levelDef.tiles.length} tiles</span>
              </div>
            </div>

            <button
              onClick={handleStartGameplay}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 active:scale-95 text-white font-black text-sm shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>PLAY LEVEL</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PAUSE MENU MODAL */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-40 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5">
            <h3 className="text-xl font-black text-white tracking-tight">GAME PAUSED</h3>

            {/* Sound & Haptic Toggles */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span>Sound Effects</span>
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
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

              <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2.5">
                <span className="text-slate-300 font-semibold flex items-center space-x-2">
                  <Vibrate className="w-4 h-4 text-indigo-400" />
                  <span>Haptic Feedback</span>
                </span>
                <button
                  onClick={() => setHapticsEnabled(!hapticsEnabled)}
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
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleResume}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Game</span>
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <RotateCw className="w-4 h-4 text-slate-400" />
                <span>Restart Level</span>
              </button>

              {(onExitToMap || onExitToMenu) && (
                <button
                  onClick={handleExitGame}
                  className="w-full py-2.5 rounded-2xl text-slate-400 hover:text-white font-semibold text-xs transition-colors"
                >
                  Exit to Map
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. AUTHORITATIVE WIN CELEBRATION MODAL */}
      {gameState === 'WIN' && (
        <LevelResultModal
          result={
            completionOutput?.result || {
              levelId,
              worldId: levelDef.worldId || 1,
              packId: levelDef.packId || 'world_1_pack_1',
              completed: true,
              stars: earnedStars,
              score,
              movesUsed: engineRef.current ? (engineRef.current as any).session?.state?.movesUsed || 10 : 10,
              timeUsedSeconds: engineRef.current ? (engineRef.current as any).session?.getElapsedTimeSeconds() || 30 : 30,
              boostersUsed: {},
              tilesMatched: levelDef.tiles.length,
              objectivesCompleted: true,
              rewardsEarned: {
                coins: 150,
                gems: earnedStars === 3 ? 2 : 0,
                boostersGranted: {},
                stars: earnedStars,
                expPoints: 100,
              },
              completionTimestamp: Date.now(),
              version: 'v1.0',
            }
          }
          progressionReport={completionOutput?.progressionReport}
          previousHighScore={previousHighScore}
          onNextLevel={() => {
            const nextLvl = Math.min(9999, levelId + 1);
            setLevelId(nextLvl);
          }}
          onReplay={() => {
            handleRestart();
          }}
          onExitToMap={() => {
            handleExitGame();
          }}
        />
      )}

      {/* 4. DEFEAT RECOVERY MODAL */}
      {gameState === 'LOSE' && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-40 animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-3xl flex items-center justify-center mx-auto border border-red-500/30">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white">
                {defeatReason.includes('Time')
                  ? "TIME'S UP!"
                  : defeatReason.includes('Move')
                  ? 'OUT OF MOVES!'
                  : 'TRAY IS FULL!'}
              </h3>
              <p className="text-xs text-slate-400">
                {defeatReason.includes('Time')
                  ? 'The level timer expired before clearing all tiles.'
                  : defeatReason.includes('Move')
                  ? 'You reached the move limit for this challenge.'
                  : `All ${trayConfig.capacity} slots are filled without forming a 3-tile match.`}
              </p>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-teal-300 text-xs font-black">
                <span>Slots:</span>
                <span className={trayTiles.length >= trayConfig.capacity ? 'text-red-400 font-extrabold' : 'text-teal-300 font-bold'}>
                  {trayTiles.length} / {trayConfig.capacity}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleReviveWithAd}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <Tv className="w-4 h-4" />
                <span>WATCH AD TO CLEAR 3 SLOTS & BONUS</span>
              </button>

              <button
                onClick={handleZenBlessing}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-teal-500/20 hover:bg-slate-800 border border-teal-500/40 text-teal-300 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>FREE ZEN BLESSING (CLEAR 3 SLOTS)</span>
              </button>

              <button
                onClick={handleRevive}
                className="w-full py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 font-medium text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <Gem className="w-3.5 h-3.5 text-amber-400" />
                <span>Revive with Gems (5 Gems)</span>
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <RotateCw className="w-4 h-4" />
                <span>Restart Level</span>
              </button>

              {(onExitToMap || onExitToMenu) && (
                <button
                  onClick={handleExitGame}
                  className="w-full py-2 rounded-2xl text-slate-400 hover:text-white font-semibold text-xs transition-colors"
                >
                  World Map
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. DYNAMIC MECHANIC INTRODUCTION TUTORIAL MODAL */}
      {activeTutorialMechanic && (
        <MechanicTutorialModal
          mechanicKey={activeTutorialMechanic}
          onDismiss={() => {
            setActiveTutorialMechanic(null);
            if (engineRef.current && !engineRef.current.getIsFinished()) {
              engineRef.current.resume();
            }
          }}
        />
      )}
    </div>
  );
};
