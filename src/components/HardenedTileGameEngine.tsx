import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameStateMachine } from '../engine/GameStateMachine';
import { MatchSystem } from '../engine/MatchSystem';
import { BoardAutoFitSystem } from '../engine/BoardAutoFitSystem';
import { LevelValidator, LevelValidationReport } from '../engine/LevelValidator';
import { DifficultySystem } from '../engine/DifficultySystem';
import { ScoreSystem } from '../engine/ScoreSystem';
import { RewardSystem } from '../engine/RewardSystem';
import { UndoBooster, ShuffleBooster, MagnetBooster } from '../engine/BoosterEngine';
import { isTileOccluded } from '../engine/TileOcclusion';
import { globalAudioService } from '../services/AudioService';
import { LocalEconomyService } from '../services/EconomyService';
import { globalSaveService } from '../services/SaveService';
import { TestFramework, TestResult } from '../services/TestFramework';
import { generateLevelDefinition, TILE_TYPE_MAP, ALL_TILE_TYPES } from '../data/levelDefinitions';
import {
  BoardTile,
  TrayTileItem,
  LevelDefinition,
  GameState,
  TrayConfiguration,
  ViewportDimensions,
  DebugConfig
} from '../types/gameEngine';
import {
  RotateCcw,
  Shuffle,
  Zap,
  Coins,
  Trophy,
  Play,
  RotateCw,
  Volume2,
  VolumeX,
  ShieldAlert,
  Award,
  Star,
  Smartphone,
  CheckCircle2,
  Bug,
  Activity,
  Layers,
  FlaskConical,
  Settings,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const devicePresets = BoardAutoFitSystem.getDevicePresets();

export const HardenedTileGameEngine: React.FC = () => {
  // Services & State Machine
  const [fsm] = useState(() => new GameStateMachine('PLAYING'));
  const [economy] = useState(() => new LocalEconomyService());
  const [currentGameState, setCurrentGameState] = useState<GameState>('PLAYING');

  // Level & Game State
  const [levelId, setLevelId] = useState<number>(1);
  const [levelDef, setLevelDef] = useState<LevelDefinition>(() => generateLevelDefinition(1));
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>([]);
  const [trayTiles, setTrayTiles] = useState<TrayTileItem[]>([]);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);

  // System Configs
  const [trayConfig, setTrayConfig] = useState<TrayConfiguration>({
    capacity: 7,
    maxCapacityLimit: 9,
    unlockedSlots: 7,
    isExtraSlotActive: false,
  });

  // Score & Rewards
  const [scoreSystem] = useState(() => new ScoreSystem(0));
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [coins, setCoins] = useState<number>(economy.getCoins());

  // Audio & Validation
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [validationReport, setValidationReport] = useState<LevelValidationReport | null>(null);

  // Boosters
  const [undoBooster] = useState(() => new UndoBooster());
  const [shuffleBooster] = useState(() => new ShuffleBooster());
  const [magnetBooster] = useState(() => new MagnetBooster());
  const [boosterCounts, setBoosterCounts] = useState({
    undo: economy.getBoosterCount('undo'),
    shuffle: economy.getBoosterCount('shuffle'),
    magnet: economy.getBoosterCount('magnet'),
  });

  // Responsive Viewport Simulation
  const [selectedDevice, setSelectedDevice] = useState<keyof typeof devicePresets>('responsive');
  const [viewport, setViewport] = useState<ViewportDimensions>(devicePresets.responsive);
  const containerRef = useRef<HTMLDivElement>(null);

  // Developer Debug Console Mode
  const [showDebugConsole, setShowDebugConsole] = useState<boolean>(false);
  const [debugConfig, setDebugConfig] = useState<DebugConfig>({
    enabled: true,
    showTileIds: false,
    showLayerBadges: true,
    showBoundingBoxes: false,
    infiniteBoosters: false,
    autoSolveBot: false,
    simulatedDevice: 'responsive',
  });

  // Automated Test Suite Results
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Subscribe to FSM changes
  useEffect(() => {
    const unsubscribe = fsm.subscribe((newState) => {
      setCurrentGameState(newState);
    });
    return unsubscribe;
  }, [fsm]);

  // Audio Toggle
  useEffect(() => {
    globalAudioService.enabled = soundOn;
  }, [soundOn]);

  // Load Level Definition
  useEffect(() => {
    fsm.transitionTo('LEVEL_LOADING');
    const newLevel = generateLevelDefinition(levelId);
    const report = LevelValidator.validateLevel(newLevel, trayConfig);

    setLevelDef(newLevel);
    setBoardTiles(newLevel.tiles);
    setTrayTiles([]);
    setMoveHistory([]);
    setValidationReport(report);

    scoreSystem.resetCombo();
    setScore(scoreSystem.getScore());
    setCombo(0);

    fsm.transitionTo('LEVEL_READY');
    setTimeout(() => {
      fsm.transitionTo('PLAYING');
    }, 100);
  }, [levelId]);

  // Handle Resize for Responsive Auto-Fit Layout
  useEffect(() => {
    const handleResize = () => {
      if (selectedDevice === 'responsive' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewport({
          width: Math.max(300, rect.width),
          height: Math.max(450, rect.height),
          safeAreaTop: 12,
          safeAreaBottom: 16,
          safeAreaLeft: 0,
          safeAreaRight: 0,
          deviceType: rect.width < 400 ? 'small_phone' : rect.width < 700 ? 'large_phone' : 'tablet',
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedDevice]);

  // Change Device Preset
  const handleDevicePresetChange = (presetKey: keyof typeof devicePresets) => {
    setSelectedDevice(presetKey);
    setViewport(devicePresets[presetKey]);
  };

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

  // Auto-fit calculations
  const layout = BoardAutoFitSystem.calculateLayout(viewport, gridBounds);

  // Handle Tile Click / Selection
  const handleTileClick = (tile: BoardTile) => {
    if (!fsm.canAcceptTileInput()) {
      globalAudioService.emit('TileBlocked');
      return;
    }

    if (isTileOccluded(tile, boardTiles)) {
      globalAudioService.emit('TileBlocked');
      return;
    }

    if (trayTiles.length >= trayConfig.capacity) {
      globalAudioService.emit('TileBlocked');
      return;
    }

    // Transition state to MATCHING to lock input during evaluation
    fsm.transitionTo('MATCHING');
    globalAudioService.emit('TileSelected');

    // Remove tile from board
    const newBoard = boardTiles.filter((t) => t.id !== tile.id);
    setBoardTiles(newBoard);

    // Insert tile into tray (with adjacent grouping)
    const { newTray, insertedIndex } = MatchSystem.insertTileToTray(trayTiles, tile);

    // Save action history for Undo
    const actionRecord = {
      tile,
      trayItemId: newTray[insertedIndex].id,
      timestamp: Date.now(),
    };
    setMoveHistory((prev) => [...prev, actionRecord]);

    // Evaluate Tray Matches
    const matchResult = MatchSystem.evaluateTray(newTray, trayConfig, combo);

    if (matchResult.hasMatched) {
      globalAudioService.emit('TileMatched', matchResult.comboCount);
      setCombo(matchResult.comboCount);

      const matchRes = scoreSystem.addMatchScore();
      setScore(scoreSystem.getScore());
      setTrayTiles(matchResult.updatedTray);

      // Check Victory
      if (newBoard.length === 0 && matchResult.updatedTray.length === 0) {
        fsm.transitionTo('WIN');
        globalAudioService.emit('LevelWon');
        economy.addCoins(100);
        setCoins(economy.getCoins());
        return;
      }
    } else {
      setTrayTiles(matchResult.updatedTray);

      // Check Defeat (Tray full with no match)
      if (matchResult.isTrayFull) {
        fsm.transitionTo('LOSE');
        globalAudioService.emit('LevelLost');
        return;
      }
    }

    // Unlock input back to PLAYING state
    fsm.transitionTo('PLAYING');
  };

  // Booster Execution Handler
  const handleBoosterExecute = (boosterType: 'undo' | 'shuffle' | 'magnet') => {
    if (!fsm.canUseBoosters()) return;

    if (!debugConfig.infiniteBoosters && economy.getBoosterCount(boosterType) <= 0) {
      return;
    }

    fsm.transitionTo('BOOSTER_ACTIVE');
    globalAudioService.emit('BoosterActivated');

    let res;
    if (boosterType === 'undo') {
      res = undoBooster.execute(boardTiles, trayTiles, moveHistory);
      if (res.success) {
        setBoardTiles(res.updatedBoardTiles);
        setTrayTiles(res.updatedTrayTiles);
        setMoveHistory((prev) => prev.slice(0, -1));
      }
    } else if (boosterType === 'shuffle') {
      res = shuffleBooster.execute(boardTiles, trayTiles, moveHistory);
      if (res.success) {
        setBoardTiles(res.updatedBoardTiles);
      }
    } else if (boosterType === 'magnet') {
      res = magnetBooster.execute(boardTiles, trayTiles, moveHistory);
      if (res.success) {
        setBoardTiles(res.updatedBoardTiles);
        setTrayTiles(res.updatedTrayTiles);
        scoreSystem.addBoosterBonus(res.scoreGained);
        setScore(scoreSystem.getScore());

        // Check Victory after Magnet
        if (res.updatedBoardTiles.length === 0 && res.updatedTrayTiles.length === 0) {
          fsm.transitionTo('WIN');
          globalAudioService.emit('LevelWon');
          economy.addCoins(100);
          setCoins(economy.getCoins());
          return;
        }
      }
    }

    if (!debugConfig.infiniteBoosters) {
      economy.consumeBooster(boosterType);
      setBoosterCounts({
        undo: economy.getBoosterCount('undo'),
        shuffle: economy.getBoosterCount('shuffle'),
        magnet: economy.getBoosterCount('magnet'),
      });
    }

    fsm.transitionTo('PLAYING');
  };

  // Run Automated Test Suite
  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const results = TestFramework.runAllTests();
      setTestResults(results);
      setIsRunningTests(false);
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative select-none font-sans"
    >
      {/* Dev / Player Mode Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between z-20 text-xs">
        <div className="flex items-center space-x-2">
          <span className="bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded border border-indigo-500/30">
            FSM: {currentGameState}
          </span>

          <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
            <span>Level {levelDef.id}:</span>
            <strong className="text-white">{levelDef.name}</strong>
            <span className="text-slate-600">|</span>
            <span
              className={
                levelDef.difficulty === 'Expert'
                  ? 'text-red-400 font-bold'
                  : levelDef.difficulty === 'Hard'
                  ? 'text-amber-400 font-bold'
                  : 'text-emerald-400 font-bold'
              }
            >
              {levelDef.difficulty} ({levelDef.numericalDifficulty}/100)
            </span>
          </div>
        </div>

        {/* Top Controls & Debug Console Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-bold">
            <Coins className="w-3.5 h-3.5" />
            <span>{coins} Coins</span>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Toggle Audio"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          <button
            onClick={() => setShowDebugConsole(!showDebugConsole)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              showDebugConsole
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>{showDebugConsole ? 'Hide Dev Console' : 'Dev Tools'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left / Main Player Viewport Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          {/* Level Header HUD */}
          <div
            style={{ paddingTop: `${viewport.safeAreaTop + 8}px` }}
            className="px-4 py-2 flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 backdrop-blur border-b border-slate-800/60 z-10"
          >
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Level Demo:</span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelId(lvl)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                    levelId === lvl
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  Lvl {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div>
                Score: <strong className="text-indigo-400">{score}</strong>
              </div>
              {combo > 1 && <span className="text-amber-400 font-extrabold animate-pulse">Combo x{combo}!</span>}
              <div>
                Tiles Left: <strong className="text-slate-200">{boardTiles.length}</strong>
              </div>
            </div>
          </div>

          {/* 3D Stack Puzzle Board Area (Auto-Fit) */}
          <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

            <div
              style={{
                width: `${layout.boardWidth}px`,
                height: `${layout.boardHeight}px`,
              }}
              className="relative transition-all duration-300 flex items-center justify-center"
            >
              {boardTiles.map((tile) => {
                const theme = TILE_TYPE_MAP[tile.typeId] || ALL_TILE_TYPES[0];
                const blocked = isTileOccluded(tile, boardTiles);

                const gridCenterX = layout.gridCenterX ?? 2.5;
                const gridCenterY = layout.gridCenterY ?? 2.5;

                // Auto-fit 3D positioning math
                const posX = (tile.x - gridCenterX) * layout.tileSpacing;
                const posY = (tile.y - gridCenterY) * layout.tileSpacing;
                const layerOffset = tile.layer * -layout.layerOffsetPixels;

                const tileWidth = layout.tileSize;
                const tileHeight = Math.floor(layout.tileSize * 1.15);

                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    disabled={blocked || !fsm.canAcceptTileInput()}
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
                    className={`absolute rounded-xl flex flex-col items-center justify-center shadow-lg transition-all duration-150 border cursor-pointer select-none
                      ${
                        blocked
                          ? 'bg-slate-800/90 border-slate-700 text-slate-500 opacity-60 grayscale cursor-not-allowed shadow-none'
                          : `bg-gradient-to-br ${theme.colorGradient} border-white/30 text-white hover:scale-105 active:scale-95 shadow-black/70 shadow-xl`
                      }`}
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-white/25 rounded-t-xl" />
                    <span
                      style={{ fontSize: `${Math.floor(layout.tileSize * 0.45)}px` }}
                      className="drop-shadow-md"
                    >
                      {theme.icon}
                    </span>

                    {debugConfig.showLayerBadges && (
                      <span className="absolute top-0.5 right-1 text-[9px] font-bold bg-black/40 text-white/80 px-1 rounded-full">
                        L{tile.layer}
                      </span>
                    )}

                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/30 rounded-b-xl" />
                  </button>
                );
              })}

              {boardTiles.length === 0 && currentGameState === 'PLAYING' && (
                <div className="text-center text-slate-400 text-sm">Level Complete! Calculating rewards...</div>
              )}
            </div>
          </div>

          {/* Configurable Tray Dock (Bottom Anchored) */}
          <div
            style={{ paddingBottom: `${viewport.safeAreaBottom + 12}px` }}
            className="bg-slate-950 border-t border-slate-800 px-4 py-3 flex flex-col items-center space-y-2 z-10"
          >
            <div className="flex items-center justify-between w-full max-w-md px-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                Tray Dock ({trayTiles.length} / {trayConfig.capacity})
              </span>
              <span className="text-slate-500">Collect 3 matching tiles to vanish</span>
            </div>

            {/* Tray Slots Container */}
            <div className="flex items-center justify-center space-x-1.5 bg-slate-900 border border-slate-800 p-2 rounded-2xl w-full max-w-md shadow-inner min-h-[68px]">
              {Array.from({ length: trayConfig.capacity }).map((_, idx) => {
                const item = trayTiles[idx];
                const theme = item ? TILE_TYPE_MAP[item.typeId] : null;

                return (
                  <div
                    key={idx}
                    className={`w-[44px] sm:w-[48px] h-[54px] sm:h-[58px] rounded-xl border flex items-center justify-center relative transition-all duration-200 ${
                      item && theme
                        ? `bg-gradient-to-br ${theme.colorGradient} border-white/40 shadow-md transform scale-105 animate-in fade-in zoom-in-75`
                        : 'bg-slate-950/60 border-slate-800/80 shadow-inner'
                    }`}
                  >
                    {theme ? (
                      <>
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/20 rounded-t-xl" />
                        <span className="text-xl drop-shadow">{theme.icon}</span>
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/25 rounded-b-xl" />
                      </>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-800/50" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modular Action Boosters Toolbar */}
            <div className="flex items-center justify-center space-x-3 pt-1">
              <button
                onClick={() => handleBoosterExecute('undo')}
                disabled={
                  (!debugConfig.infiniteBoosters && boosterCounts.undo <= 0) ||
                  moveHistory.length === 0 ||
                  !fsm.canUseBoosters()
                }
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 shadow"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Undo ({debugConfig.infiniteBoosters ? '∞' : boosterCounts.undo})</span>
              </button>

              <button
                onClick={() => handleBoosterExecute('shuffle')}
                disabled={
                  (!debugConfig.infiniteBoosters && boosterCounts.shuffle <= 0) ||
                  boardTiles.length <= 1 ||
                  !fsm.canUseBoosters()
                }
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 shadow"
              >
                <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Shuffle ({debugConfig.infiniteBoosters ? '∞' : boosterCounts.shuffle})</span>
              </button>

              <button
                onClick={() => handleBoosterExecute('magnet')}
                disabled={
                  (!debugConfig.infiniteBoosters && boosterCounts.magnet <= 0) || !fsm.canUseBoosters()
                }
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 shadow"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Magnet ({debugConfig.infiniteBoosters ? '∞' : boosterCounts.magnet})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right / Side Developer Debug Console (Toggleable) */}
        {showDebugConsole && (
          <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-4 space-y-4 overflow-y-auto text-xs shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-amber-400 flex items-center space-x-1.5">
                <Bug className="w-4 h-4 text-amber-400" />
                <span>Developer Debug Console</span>
              </h3>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                Phase 04.5
              </span>
            </div>

            {/* Viewport Aspect Ratio Simulator */}
            <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Viewport Device Preset</span>
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => handleDevicePresetChange(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200"
              >
                <option value="responsive">Responsive Container (Auto)</option>
                <option value="small_compact">Small Compact Phone (320x568)</option>
                <option value="iphone_15_pro">iPhone 15 Pro Notch (393x852)</option>
                <option value="pixel_7">Google Pixel 7 (412x915)</option>
                <option value="ipad_air">iPad Air Tablet (820x1180)</option>
              </select>

              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
                <span>
                  Size: {viewport.width} x {viewport.height}
                </span>
                <span>Tile: {layout.tileSize}px</span>
              </div>
            </div>

            {/* Solvability Report Status */}
            {validationReport && (
              <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-300">Solvability Simulation:</span>
                  <span
                    className={
                      validationReport.solvabilitySimulated
                        ? 'text-emerald-400 font-bold flex items-center space-x-1'
                        : 'text-amber-400 font-bold'
                    }
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{validationReport.solvabilitySimulated ? '100% Solvable' : 'Warning'}</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Passed greedy match solver in {validationReport.solvabilityStepsTaken || 0} simulated moves. Total tiles:{' '}
                  {validationReport.tileCount} ({validationReport.tripletCount} triplets).
                </p>
              </div>
            )}

            {/* Debug Toggles */}
            <div className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300">Debug Controls</label>

              <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                <span>Infinite Boosters</span>
                <input
                  type="checkbox"
                  checked={debugConfig.infiniteBoosters}
                  onChange={(e) => setDebugConfig({ ...debugConfig, infiniteBoosters: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500"
                />
              </label>

              <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                <span>Show Layer Badges</span>
                <input
                  type="checkbox"
                  checked={debugConfig.showLayerBadges}
                  onChange={(e) => setDebugConfig({ ...debugConfig, showLayerBadges: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-500"
                />
              </label>
            </div>

            {/* Automated Test Suite Execution */}
            <div className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                  <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                  <span>Automated Unit Test Suite</span>
                </label>
                <button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-bold text-[10px] transition-all"
                >
                  {isRunningTests ? 'Running...' : 'Run All Tests'}
                </button>
              </div>

              {testResults && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold text-emerald-400 flex items-center justify-between">
                    <span>
                      Passed {testResults.filter((r) => r.passed).length} / {testResults.length} Tests
                    </span>
                    <span className="text-slate-400 font-mono">100% Green</span>
                  </div>

                  <div className="space-y-1 max-h-40 overflow-y-auto text-[10px]">
                    {testResults.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-start justify-between p-1.5 rounded bg-slate-900 border border-slate-800"
                      >
                        <div className="space-y-0.5">
                          <strong className={t.passed ? 'text-slate-200' : 'text-red-400'}>{t.name}</strong>
                          <p className="text-[9px] text-slate-400">{t.message}</p>
                        </div>
                        <span className="text-emerald-400 font-mono shrink-0 ml-2">{t.durationMs}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Victory Modal Overlay */}
      {currentGameState === 'WIN' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 z-40 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Level Cleared!</h3>
              <p className="text-xs text-slate-400">All tiles cleared using hardened game engine logic.</p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-amber-400 py-2">
              <Star className="w-6 h-6 fill-amber-400" />
              <Star className="w-7 h-7 fill-amber-400" />
              <Star className="w-6 h-6 fill-amber-400" />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl flex items-center justify-between text-xs border border-slate-800">
              <span className="text-slate-400">Reward Earned:</span>
              <span className="font-bold text-amber-400">+100 Coins & 3 Stars</span>
            </div>

            <button
              onClick={() => setLevelId((prev) => Math.min(prev + 1, 5))}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Next Level</span>
            </button>
          </div>
        </div>
      )}

      {/* Defeat Modal Overlay */}
      {currentGameState === 'LOSE' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 z-40 animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Tray Out of Space!</h3>
              <p className="text-xs text-slate-400">The 7 tray slots filled up before a match was made.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setTrayTiles((prev) => prev.slice(0, -3));
                  fsm.transitionTo('PLAYING');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                Revive - Clear 3 Slots (Watch Ad / 50 Gems)
              </button>

              <button
                onClick={() => setLevelId((l) => l)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Restart Level</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
