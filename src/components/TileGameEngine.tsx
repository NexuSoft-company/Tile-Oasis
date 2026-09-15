import React, { useState, useEffect, useRef } from 'react';
import { TileData, TrayTile, LevelConfig } from '../types/game';
import { RotateCcw, Shuffle, Zap, Coins, Trophy, Play, RotateCw, Volume2, VolumeX, ShieldAlert, Award, Star } from 'lucide-react';

const TILE_THEMES = [
  { id: 'fruit_apple', name: 'Apple', icon: '🍎', color: 'from-red-500 to-rose-600' },
  { id: 'fruit_banana', name: 'Banana', icon: '🍌', color: 'from-amber-400 to-yellow-500' },
  { id: 'fruit_grape', name: 'Grapes', icon: '🍇', color: 'from-purple-500 to-indigo-600' },
  { id: 'fruit_orange', name: 'Orange', icon: '🍊', color: 'from-orange-400 to-amber-500' },
  { id: 'fruit_watermelon', name: 'Watermelon', icon: '🍉', color: 'from-emerald-500 to-green-600' },
  { id: 'fruit_strawberry', name: 'Strawberry', icon: '🍓', color: 'from-pink-500 to-rose-500' },
  { id: 'fruit_avocado', name: 'Avocado', icon: '🥑', color: 'from-green-600 to-emerald-700' },
  { id: 'fruit_cherry', name: 'Cherry', icon: '🍒', color: 'from-red-600 to-pink-600' }
];

// Audio synthesizer using Web Audio API
class GameAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playMatch(comboCount: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const baseFreq = 523.25 * Math.pow(1.05, Math.min(comboCount, 12)); // C5 pitch escalation
    const now = this.ctx.currentTime;
    [0, 0.06, 0.12].forEach((delay, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq * (1 + idx * 0.25), now + delay);
      gain.gain.setValueAtTime(0.2, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    });
  }

  playBooster() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.25, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.3);
    });
  }

  playDefeat() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [400, 350, 300, 250];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      gain.gain.setValueAtTime(0.2, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.25);
    });
  }
}

const audio = new GameAudio();

// Helper to generate solvable level data with guaranteed multiples of 3
const generateLevel = (levelId: number): LevelConfig => {
  const worldName = levelId <= 2 ? "Emerald Hills" : levelId <= 4 ? "Sunlit Valley" : "Crystal Caverns";
  const difficulty = levelId === 1 ? 'Easy' : levelId === 2 ? 'Easy' : levelId === 3 ? 'Medium' : levelId === 4 ? 'Hard' : 'Expert';

  // Number of triplets (3 tiles per set)
  const tripletCount = 4 + levelId * 2; // Level 1 = 6 triplets (18 tiles), Level 5 = 14 triplets (42 tiles)
  const tileTypesToUse = TILE_THEMES.slice(0, Math.min(3 + Math.floor(levelId * 0.8), TILE_THEMES.length));

  const tilesList: TileData[] = [];
  let tileIndex = 0;

  // Generate tile types list with exactly 3 of each type
  const typePool: string[] = [];
  for (let i = 0; i < tripletCount; i++) {
    const type = tileTypesToUse[i % tileTypesToUse.length].id;
    typePool.push(type, type, type);
  }

  // Shuffle type pool
  for (let i = typePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [typePool[i], typePool[j]] = [typePool[j], typePool[i]];
  }

  // Stack layouts
  const layersCount = levelId === 1 ? 2 : levelId <= 3 ? 3 : 4;
  
  // Arrange in grid layers
  let poolIdx = 0;
  for (let layer = 0; layer < layersCount; layer++) {
    const cols = Math.max(3, 6 - layer);
    const rows = Math.max(2, 5 - layer);
    const offsetX = (6 - cols) * 0.5;
    const offsetY = (5 - rows) * 0.5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (poolIdx < typePool.length) {
          tilesList.push({
            id: `tile_${levelId}_${tileIndex++}`,
            typeId: typePool[poolIdx++],
            x: c + offsetX + (layer % 2 === 1 ? 0.3 : 0),
            y: r + offsetY + (layer % 2 === 1 ? 0.3 : 0),
            layer: layer
          });
        }
      }
    }
  }

  // Fill any remaining if pool isn't exhausted
  while (poolIdx < typePool.length) {
    tilesList.push({
      id: `tile_${levelId}_${tileIndex++}`,
      typeId: typePool[poolIdx++],
      x: 2 + (poolIdx % 3) * 0.8,
      y: 2 + Math.floor(poolIdx / 3) * 0.8,
      layer: layersCount
    });
  }

  return {
    id: levelId,
    name: `Level ${levelId} - ${worldName}`,
    difficulty,
    worldName,
    trayCapacity: 7,
    tiles: tilesList,
    targetStars: 3
  };
};

export const TileGameEngine: React.FC = () => {
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() => generateLevel(1));
  const [remainingTiles, setRemainingTiles] = useState<TileData[]>([]);
  const [trayTiles, setTrayTiles] = useState<TrayTile[]>([]);
  const [moveHistory, setMoveHistory] = useState<{ tile: TileData; trayIndex: number }[]>([]);
  const [trayCapacity, setTrayCapacity] = useState<number>(7);
  
  // Stats & States
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [coins, setCoins] = useState<number>(250);
  const [gameState, setGameState] = useState<'PLAYING' | 'VICTORY' | 'DEFEAT'>('PLAYING');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [activeParticle, setActiveParticle] = useState<{ x: number; y: number; text: string } | null>(null);

  // Boosters inventory
  const [boosters, setBoosters] = useState({ undo: 3, shuffle: 2, magnet: 2 });

  useEffect(() => {
    audio.enabled = soundOn;
  }, [soundOn]);

  // Load level
  useEffect(() => {
    const config = generateLevel(currentLevelId);
    setLevelConfig(config);
    setRemainingTiles(config.tiles);
    setTrayTiles([]);
    setMoveHistory([]);
    setTrayCapacity(config.trayCapacity);
    setGameState('PLAYING');
    setCombo(0);
  }, [currentLevelId]);

  // Check which tiles are blocked (a tile is blocked if any tile in a HIGHER layer overlaps its bounding box)
  const isTileBlocked = (tile: TileData, allTiles: TileData[]): boolean => {
    const TILE_WIDTH = 0.9;
    const TILE_HEIGHT = 0.9;

    return allTiles.some(other => {
      if (other.layer <= tile.layer) return false; // Must be strictly higher layer to block
      
      const overlapX = Math.abs(other.x - tile.x) < TILE_WIDTH;
      const overlapY = Math.abs(other.y - tile.y) < TILE_HEIGHT;

      return overlapX && overlapY;
    });
  };

  // Handle Tile Click
  const handleTileClick = (tile: TileData) => {
    if (gameState !== 'PLAYING') return;
    if (isTileBlocked(tile, remainingTiles)) {
      // Play blocked feedback
      return;
    }

    if (trayTiles.length >= trayCapacity) return;

    audio.playTap();

    // Remove tile from board stack
    const newRemaining = remainingTiles.filter(t => t.id !== tile.id);
    setRemainingTiles(newRemaining);

    // Insert tile into tray (group matching tiles together)
    const newTray = [...trayTiles];
    // Find last index of same type to insert next to it
    const lastSameTypeIdx = newTray.map(t => t.typeId).lastIndexOf(tile.typeId);
    
    let insertIndex = newTray.length;
    if (lastSameTypeIdx !== -1) {
      insertIndex = lastSameTypeIdx + 1;
    }

    const newTrayTile: TrayTile = { id: tile.id, typeId: tile.typeId };
    newTray.splice(insertIndex, 0, newTrayTile);

    // Save to move history for Undo
    setMoveHistory(prev => [...prev, { tile, trayIndex: insertIndex }]);

    // Process Match-3 Check
    processMatchesAndState(newTray, newRemaining);
  };

  // Match 3 Logic & Defeat/Victory checking
  const processMatchesAndState = (currentTray: TrayTile[], currentBoard: TileData[]) => {
    // Count occurrences of each type
    const counts: Record<string, number> = {};
    currentTray.forEach(t => {
      counts[t.typeId] = (counts[t.typeId] || 0) + 1;
    });

    let matchedType: string | null = null;
    for (const [type, count] of Object.entries(counts)) {
      if (count >= 3) {
        matchedType = type;
        break;
      }
    }

    if (matchedType) {
      // Match found!
      const newCombo = combo + 1;
      setCombo(newCombo);
      audio.playMatch(newCombo);

      // Remove 3 tiles of matchedType from tray
      let removedCount = 0;
      const filteredTray = currentTray.filter(t => {
        if (t.typeId === matchedType && removedCount < 3) {
          removedCount++;
          return false;
        }
        return true;
      });

      setTrayTiles(filteredTray);
      setScore(prev => prev + 150 * newCombo);

      // Check Victory
      if (currentBoard.length === 0 && filteredTray.length === 0) {
        setGameState('VICTORY');
        audio.playVictory();
        setCoins(c => c + 100);
      }
    } else {
      setTrayTiles(currentTray);
      
      // Check Defeat (Tray Full and No Match Available)
      if (currentTray.length >= trayCapacity) {
        setGameState('DEFEAT');
        audio.playDefeat();
      }
    }
  };

  // Booster: Undo
  const handleBoosterUndo = () => {
    if (gameState !== 'PLAYING') return;
    if (moveHistory.length === 0) return;
    if (boosters.undo <= 0) return;

    audio.playBooster();

    const lastMove = moveHistory[moveHistory.length - 1];
    setMoveHistory(prev => prev.slice(0, -1));

    // Remove from tray
    setTrayTiles(prev => prev.filter(t => t.id !== lastMove.tile.id));
    // Restore to board
    setRemainingTiles(prev => [...prev, lastMove.tile]);

    setBoosters(b => ({ ...b, undo: b.undo - 1 }));
  };

  // Booster: Shuffle
  const handleBoosterShuffle = () => {
    if (gameState !== 'PLAYING') return;
    if (remainingTiles.length === 0) return;
    if (boosters.shuffle <= 0) return;

    audio.playBooster();

    // Shuffle the typeIds of remaining tiles while keeping their positions/layers
    const typesPool = remainingTiles.map(t => t.typeId);
    for (let i = typesPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [typesPool[i], typesPool[j]] = [typesPool[j], typesPool[i]];
    }

    const shuffledBoard = remainingTiles.map((tile, idx) => ({
      ...tile,
      typeId: typesPool[idx]
    }));

    setRemainingTiles(shuffledBoard);
    setBoosters(b => ({ ...b, shuffle: b.shuffle - 1 }));
  };

  // Booster: Magnet Auto-Match
  const handleBoosterMagnet = () => {
    if (gameState !== 'PLAYING') return;
    if (boosters.magnet <= 0) return;

    audio.playBooster();

    // Find a tile type that exists on board/tray with at least 3 occurrences
    const allAvailable = [
      ...remainingTiles.map(t => t.typeId),
      ...trayTiles.map(t => t.typeId)
    ];

    const counts: Record<string, number> = {};
    allAvailable.forEach(t => counts[t] = (counts[t] || 0) + 1);

    const targetType = Object.keys(counts).find(type => counts[type] >= 3);
    if (!targetType) return;

    // Remove up to 3 tiles of targetType from board + tray
    let needed = 3;
    const newTray = [...trayTiles];
    let removedFromTray = 0;

    // Remove from tray first
    const updatedTray = newTray.filter(t => {
      if (t.typeId === targetType && needed > 0) {
        needed--;
        return false;
      }
      return true;
    });

    // Remove remaining needed from board (prioritize unblocked top layer)
    const boardCandidates = remainingTiles
      .filter(t => t.typeId === targetType)
      .sort((a, b) => b.layer - a.layer);

    const idsToRemove = boardCandidates.slice(0, needed).map(t => t.id);
    const updatedBoard = remainingTiles.filter(t => !idsToRemove.includes(t.id));

    setRemainingTiles(updatedBoard);
    setTrayTiles(updatedTray);
    setScore(prev => prev + 300);
    audio.playMatch(combo + 1);
    setBoosters(b => ({ ...b, magnet: b.magnet - 1 }));

    // Check Victory
    if (updatedBoard.length === 0 && updatedTray.length === 0) {
      setGameState('VICTORY');
      audio.playVictory();
      setCoins(c => c + 100);
    }
  };

  const currentThemeMap = Object.fromEntries(TILE_THEMES.map(t => [t.id, t]));

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Top Header Bar */}
      <div className="bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{levelConfig.name}</span>
          </div>

          <div className="text-xs px-2.5 py-1 bg-slate-800 rounded-full text-slate-300 font-medium">
            Diff: <span className={levelConfig.difficulty === 'Expert' ? 'text-red-400 font-bold' : levelConfig.difficulty === 'Hard' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{levelConfig.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 text-xs font-bold">
            <Coins className="w-3.5 h-3.5" />
            <span>{coins} Coins</span>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Toggle Audio"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Level Selector Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span>Select Level Demo:</span>
          {[1, 2, 3, 4, 5].map(lvl => (
            <button
              key={lvl}
              onClick={() => setCurrentLevelId(lvl)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${currentLevelId === lvl ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              Lvl {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span>Score: <strong className="text-indigo-400 font-bold">{score}</strong></span>
          {combo > 1 && (
            <span className="text-amber-400 font-extrabold animate-pulse">
              Combo x{combo}!
            </span>
          )}
          <span>Tiles Left: <strong className="text-slate-200">{remainingTiles.length}</strong></span>
        </div>
      </div>

      {/* Main 3D Stack Canvas Area */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex items-center justify-center p-4">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Puzzle Board Container */}
        <div className="relative w-full max-w-lg h-[380px] sm:h-[420px] flex items-center justify-center">
          {remainingTiles.map(tile => {
            const theme = currentThemeMap[tile.typeId] || TILE_THEMES[0];
            const blocked = isTileBlocked(tile, remainingTiles);

            // Compute isometric 3D offsets based on layer and grid X/Y
            const tileWidth = 56;
            const tileHeight = 64;
            const posX = tile.x * 48 - 120;
            const posY = tile.y * 52 - 100;
            const layerOffset = tile.layer * -6; // Stack vertical lift per layer

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={blocked || gameState !== 'PLAYING'}
                style={{
                  transform: `translate3d(${posX}px, ${posY + layerOffset}px, ${tile.layer * 10}px)`,
                  zIndex: tile.layer * 10 + Math.floor(tile.y)
                }}
                className={`absolute w-[54px] h-[64px] rounded-xl flex flex-col items-center justify-center shadow-lg transition-all duration-200 border cursor-pointer select-none
                  ${blocked 
                    ? 'bg-slate-800/90 border-slate-700 text-slate-500 opacity-60 grayscale cursor-not-allowed shadow-none' 
                    : `bg-gradient-to-br ${theme.color} border-white/30 text-white hover:scale-105 active:scale-95 shadow-black/60 shadow-xl`
                  }`}
              >
                {/* Top glossy edge effect */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-white/20 rounded-t-xl" />
                
                <span className="text-2xl drop-shadow-md">{theme.icon}</span>

                {/* 3D Depth bottom border */}
                <div className="absolute bottom-0 inset-x-0 h-2 bg-black/25 rounded-b-xl" />
              </button>
            );
          })}

          {remainingTiles.length === 0 && gameState === 'PLAYING' && (
            <div className="text-center text-slate-400 text-sm">
              Level Complete! Calculating victory...
            </div>
          )}
        </div>
      </div>

      {/* Tray Area (7 capacity default) */}
      <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-col items-center space-y-3">
        <div className="flex items-center justify-between w-full max-w-md px-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Tray Dock ({trayTiles.length} / {trayCapacity})</span>
          <span className="text-slate-500">Collect 3 matching tiles to vanish</span>
        </div>

        {/* Tray Slots Container */}
        <div className="flex items-center justify-center space-x-1.5 bg-slate-900 border border-slate-800 p-2 rounded-2xl w-full max-w-md shadow-inner min-h-[72px]">
          {Array.from({ length: trayCapacity }).map((_, idx) => {
            const tile = trayTiles[idx];
            const theme = tile ? currentThemeMap[tile.typeId] : null;

            return (
              <div
                key={idx}
                className={`w-[48px] h-[58px] rounded-xl border flex items-center justify-center relative transition-all duration-200 ${
                  tile && theme
                    ? `bg-gradient-to-br ${theme.color} border-white/40 shadow-md transform scale-105 animate-in fade-in zoom-in-75`
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

        {/* Action Boosters Toolbar */}
        <div className="flex items-center justify-center space-x-3 pt-1">
          <button
            onClick={handleBoosterUndo}
            disabled={boosters.undo <= 0 || moveHistory.length === 0 || gameState !== 'PLAYING'}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Undo ({boosters.undo})</span>
          </button>

          <button
            onClick={handleBoosterShuffle}
            disabled={boosters.shuffle <= 0 || remainingTiles.length === 0 || gameState !== 'PLAYING'}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 shadow"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shuffle ({boosters.shuffle})</span>
          </button>

          <button
            onClick={handleBoosterMagnet}
            disabled={boosters.magnet <= 0 || gameState !== 'PLAYING'}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 shadow"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Magnet ({boosters.magnet})</span>
          </button>
        </div>
      </div>

      {/* Victory Modal */}
      {gameState === 'VICTORY' && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-30 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Level Cleared!</h3>
              <p className="text-xs text-slate-400">Great job! You cleared all tiles cleanly.</p>
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
              onClick={() => setCurrentLevelId(prev => Math.min(prev + 1, 5))}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Next Level</span>
            </button>
          </div>
        </div>
      )}

      {/* Defeat Modal */}
      {gameState === 'DEFEAT' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 z-30 animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Tray Out of Space!</h3>
              <p className="text-xs text-slate-400">The 7 tray slots were filled before completing matches.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  // Revive option (clear 3 tray tiles)
                  setTrayTiles(prev => prev.slice(0, -3));
                  setGameState('PLAYING');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                Revive - Clear 3 Slots (Watch Ad / 50 Gems)
              </button>

              <button
                onClick={() => setCurrentLevelId(l => l)} // Restart
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
