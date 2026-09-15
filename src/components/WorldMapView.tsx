import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PlayerSaveData } from '../types/gameEngine';
import {
  WORLD_DEFINITIONS,
  WorldDefinition,
  getWorldForLevel,
  isWorldUnlocked,
  generateWorldDefinition,
} from '../data/worldDefinitions';
import { DifficultyCurve } from '../engine/DifficultyCurve';
import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';
import { generateLevelDefinition } from '../data/levelDefinitions';
import { LevelPerformanceCalculator } from '../engine/LevelPerformanceProfile';
import { globalAudioService } from '../services/AudioService';
import {
  Star,
  Lock,
  Play,
  ArrowLeft,
  Crown,
  Gift,
  Zap,
  Flame,
  Timer,
  ChevronLeft,
  ChevronRight,
  Palmtree,
  Coins,
  Gem,
  Award,
  Compass,
  X,
  Target,
} from 'lucide-react';

interface WorldMapViewProps {
  saveData: PlayerSaveData;
  onSelectLevel: (levelId: number) => void;
  onBackToMainMenu: () => void;
  initialWorldId?: number;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  saveData,
  onSelectLevel,
  onBackToMainMenu,
  initialWorldId,
}) => {
  // Determine active world from highest unlocked level or initial prop
  const currentLevelWorld = getWorldForLevel(saveData.highestLevelUnlocked);
  const [selectedWorldId, setSelectedWorldId] = useState<number>(
    initialWorldId || currentLevelWorld.id
  );
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const [previewLevelId, setPreviewLevelId] = useState<number | null>(null);

  const activeWorld: WorldDefinition = useMemo(() => {
    return (
      WORLD_DEFINITIONS.find((w) => w.id === selectedWorldId) ||
      generateWorldDefinition(selectedWorldId)
    );
  }, [selectedWorldId]);

  const worldUnlockStatus = useMemo(() => {
    return isWorldUnlocked(activeWorld, saveData.highestLevelUnlocked, saveData.starsTotal);
  }, [activeWorld, saveData.highestLevelUnlocked, saveData.starsTotal]);

  const currentLevelRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to current level node on initial render or world switch
  useEffect(() => {
    if (currentLevelRef.current) {
      currentLevelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedWorldId, selectedPackIndex]);

  // Generate levels for the selected world / pack filter
  const [startLevel, endLevel] = activeWorld.levelRange;
  const levelList = useMemo(() => {
    const list: number[] = [];
    if (selectedPackIndex === 0) {
      for (let i = startLevel; i <= endLevel; i++) {
        list.push(i);
      }
    } else {
      const packStart = startLevel + (selectedPackIndex - 1) * 25;
      const packEnd = Math.min(endLevel, packStart + 24);
      for (let i = packStart; i <= packEnd; i++) {
        list.push(i);
      }
    }
    return list;
  }, [startLevel, endLevel, selectedPackIndex]);

  // Compute World Star Mastery
  const { worldStarsEarned, worldMaxStars, worldMasteredPercent } = useMemo(() => {
    let earned = 0;
    for (let lvl = startLevel; lvl <= endLevel; lvl++) {
      if (saveData.completedLevels[lvl]) {
        earned += saveData.completedLevels[lvl].stars || 0;
      }
    }
    const max = (endLevel - startLevel + 1) * 3;
    const pct = Math.round((earned / max) * 100);
    return { worldStarsEarned: earned, worldMaxStars: max, worldMasteredPercent: pct };
  }, [startLevel, endLevel, saveData.completedLevels]);

  const handleNodeClick = (lvlId: number) => {
    const isUnlocked = lvlId <= saveData.highestLevelUnlocked;
    if (!isUnlocked) {
      globalAudioService.emit('ButtonPressed');
      return;
    }
    globalAudioService.emit('ButtonPressed');
    setPreviewLevelId(lvlId);
  };

  const selectedLevelDef = previewLevelId
    ? RuntimeLevelRegistry.getLevel(previewLevelId) || generateLevelDefinition(previewLevelId)
    : null;
  const selectedLevelStars = previewLevelId
    ? (saveData.completedLevels[previewLevelId]?.stars || 0)
    : 0;
  const selectedLevelProfile = selectedLevelDef
    ? LevelPerformanceCalculator.getProfile(selectedLevelDef)
    : null;

  // Compute highest unlocked world ID
  const highestUnlockedWorld = getWorldForLevel(saveData.highestLevelUnlocked).id;
  // Generate list of worlds to display in tab bar (unlocked + 1 next world)
  const visibleWorldCount = Math.min(100, Math.max(5, highestUnlockedWorld + 1));
  const worldTabList = Array.from({ length: visibleWorldCount }, (_, idx) => {
    const wId = idx + 1;
    return WORLD_DEFINITIONS.find((w) => w.id === wId) || generateWorldDefinition(wId);
  });

  return (
    <div 
      className="w-full h-full flex flex-col text-slate-100 overflow-hidden relative font-sans select-none sm:rounded-3xl rounded-none shadow-2xl"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(2, 6, 23, 0.95)), url(/feature-graphic.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#020617', // fallback
      }}
    >
      {/* ========================================================= */}
      {/* 1. TOP HEADER BAR                                         */}
      {/* ========================================================= */}
      <div className="bg-slate-950/80 border-b-2 border-amber-600/50 px-4 py-3 flex items-center justify-between shrink-0 z-10 backdrop-blur-md shadow-lg">
        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onBackToMainMenu();
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-[4px] border-slate-600 hover:border-slate-500 text-amber-400 transition-all flex items-center space-x-1 shadow-md"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
          <span className="text-xs font-black tracking-wide drop-shadow-md">Menu</span>
        </button>

        <div className="flex flex-col items-center drop-shadow-md">
          <div className="flex items-center space-x-1.5">
            <Compass className="w-5 h-5 text-amber-400 drop-shadow-sm" />
            <h2 className="text-base font-black text-white tracking-tight">{activeWorld.name}</h2>
          </div>
          <span className="text-[10px] text-amber-300 font-black uppercase tracking-widest drop-shadow-md">
            {activeWorld.subtitle}
          </span>
        </div>

        {/* Total Stars Counter */}
        <div className="flex items-center space-x-1 text-xs font-black text-amber-300 bg-amber-500/90 backdrop-blur-sm border-b-2 border-amber-600 px-3 py-1.5 rounded-full shadow-md text-slate-950">
          <Star className="w-4 h-4 fill-slate-900 drop-shadow-sm" />
          <span>{saveData.starsTotal}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. WORLD SELECTOR TABS                                    */}
      {/* ========================================================= */}
      <div className="bg-slate-950/60 backdrop-blur-sm border-b border-white/10 px-2 py-2 flex items-center space-x-1 shrink-0 shadow-inner">
        <button
          onClick={() => {
            if (selectedWorldId > 1) {
              globalAudioService.emit('ButtonPressed');
              setSelectedWorldId((prev) => prev - 1);
            }
          }}
          disabled={selectedWorldId <= 1}
          className="p-1.5 rounded-xl bg-slate-800 border-b-[3px] border-slate-600 text-slate-300 hover:text-white active:translate-y-0.5 active:border-b disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center space-x-1.5 overflow-x-auto scrollbar-none px-1 py-1">
          {worldTabList.map((world) => {
            const status = isWorldUnlocked(
              world,
              saveData.highestLevelUnlocked,
              saveData.starsTotal
            );
            const isSelected = world.id === selectedWorldId;

            return (
              <button
                key={world.id}
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  setSelectedWorldId(world.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 shadow-md ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white border-t-2 border-orange-200 border-b-[4px] border-rose-700 active:translate-y-1 active:border-b-0'
                    : status.unlocked
                    ? 'bg-slate-800 text-slate-200 border-b-[4px] border-slate-700 hover:bg-slate-700 active:translate-y-1 active:border-b-0'
                    : 'bg-slate-900/80 text-slate-600 border-b-2 border-slate-800 opacity-60'
                }`}
              >
                {!status.unlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-500 drop-shadow-md" />
                ) : (
                  <Palmtree className="w-4 h-4 text-emerald-300 drop-shadow-md" />
                )}
                <span className="drop-shadow-md tracking-wide">{world.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (selectedWorldId < 100) {
              globalAudioService.emit('ButtonPressed');
              setSelectedWorldId((prev) => prev + 1);
            }
          }}
          disabled={selectedWorldId >= 100}
          className="p-1.5 rounded-xl bg-slate-800 border-b-[3px] border-slate-600 text-slate-300 hover:text-white active:translate-y-0.5 active:border-b disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2.2 WORLD MASTERY & STAR PROGRESSION BANNER               */}
      {/* ========================================================= */}
      {worldUnlockStatus.unlocked && (
        <div className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center justify-between shrink-0 text-[11px] shadow-sm">
          <div className="flex items-center space-x-1.5 text-amber-300 font-black drop-shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-300" />
            <span className="tracking-wide">WORLD MASTERY: {worldStarsEarned} / {worldMaxStars} ★</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-slate-950 h-3 rounded-full overflow-hidden border border-white/20 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(4, worldMasteredPercent)}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-slate-400">{worldMasteredPercent}%</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2.5. PACK / CHAPTER FILTER BAR                            */}
      {/* ========================================================= */}
      {worldUnlockStatus.unlocked && (
        <div className="bg-slate-950/60 backdrop-blur-sm border-b border-white/10 px-3 py-2 flex items-center justify-center space-x-2 shrink-0 overflow-x-auto scrollbar-none text-[11px] shadow-sm">
          {[
            { idx: 0, label: 'All Levels (1-100)' },
            { idx: 1, label: 'Pack 1 (1-25)' },
            { idx: 2, label: 'Pack 2 (26-50)' },
            { idx: 3, label: 'Pack 3 (51-75)' },
            { idx: 4, label: 'Pack 4 (76-100)' },
          ].map((pack) => (
            <button
              key={pack.idx}
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setSelectedPackIndex(pack.idx);
              }}
              className={`px-3 py-1.5 rounded-lg font-black transition-all whitespace-nowrap shadow-sm border-b-2 active:translate-y-0.5 active:border-b-0 ${
                selectedPackIndex === pack.idx
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-700 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
              }`}
            >
              {pack.label}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. INTERACTIVE LEVEL PATH CANVAS                          */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto p-6 relative flex flex-col-reverse items-center justify-start space-y-6 space-y-reverse bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
        {/* World Lock Warning Banner if world is locked */}
        {!worldUnlockStatus.unlocked && (
          <div className="w-full my-auto bg-slate-900/90 border border-amber-500/40 p-6 rounded-3xl text-center space-y-3 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">{activeWorld.name} Locked</h3>
              <p className="text-xs text-amber-300 font-bold">{worldUnlockStatus.reason}</p>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {activeWorld.description}
            </p>
          </div>
        )}

        {/* Level Nodes Path (Rendered when world is unlocked) */}
        {worldUnlockStatus.unlocked &&
          levelList.map((lvlId, index) => {
            const isUnlocked = lvlId <= saveData.highestLevelUnlocked;
            const isCurrent = lvlId === saveData.highestLevelUnlocked;
            const completedData = saveData.completedLevels[lvlId];
            const stars = completedData ? completedData.stars : 0;

            // Curved sine-wave X offsets for winding path effect
            const sineOffset = Math.sin(index * 1.2) * 48;

            return (
              <div
                key={lvlId}
                ref={isCurrent ? currentLevelRef : null}
                style={{ transform: `translateX(${sineOffset}px)` }}
                className="flex flex-col items-center relative my-2 z-10 transition-transform duration-300"
              >
                {/* Connecting Path Connector Line to next node */}
                {index < levelList.length - 1 && (
                  <div
                    className={`absolute bottom-14 w-1.5 h-10 rounded-full transition-colors ${
                      lvlId < saveData.highestLevelUnlocked
                        ? 'bg-teal-500/80 shadow-sm shadow-teal-500/30'
                        : 'bg-slate-800'
                    }`}
                  />
                )}

                {/* Level Node Tile Button */}
                {(() => {
                  const specialType = DifficultyCurve.getSpecialLevelType(lvlId);
                  const isBoss = specialType === 'PACK_BOSS' || specialType === 'WORLD_FINALE';
                  const isBonus = specialType === 'BONUS_REWARD';
                  const isChallenge = specialType === 'CHALLENGE';

                  return (
                    <button
                      onClick={() => handleNodeClick(lvlId)}
                      disabled={!isUnlocked}
                      className={`w-16 h-16 rounded-[1.2rem] flex flex-col items-center justify-center font-black text-lg shadow-[0_6px_15px_rgba(0,0,0,0.4)] transition-all relative border-t-2 border-l-2 border-r-2 border-b-[6px] active:translate-y-1 active:border-b-2 ${
                        isCurrent
                          ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white border-amber-200 border-b-rose-700 hover:border-amber-100 scale-110 z-20 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                          : isBoss
                          ? 'bg-gradient-to-tr from-rose-950 via-slate-900 to-amber-950 border-rose-500/60 border-b-rose-900 text-amber-300 hover:border-rose-400'
                          : isBonus
                          ? 'bg-gradient-to-tr from-amber-950 via-slate-900 to-yellow-900 border-amber-500/60 border-b-amber-800 text-amber-300 hover:border-amber-400'
                          : stars === 3
                          ? 'bg-slate-800 border-amber-400 border-b-amber-700 text-amber-300 hover:bg-slate-700'
                          : stars > 0
                          ? 'bg-slate-800 border-emerald-400 border-b-emerald-700 text-emerald-300 hover:bg-slate-700'
                          : isUnlocked
                          ? 'bg-slate-800 border-slate-600 border-b-slate-900 text-slate-200 hover:bg-slate-700'
                          : 'bg-slate-950 border-slate-800 border-b-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Special Level Icon Marker (Top-Right) */}
                      {specialType && isUnlocked && !isCurrent && (
                        <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-slate-950 border border-amber-500/60 shadow-md">
                          {isBoss && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          {isBonus && <Gift className="w-3 h-3 text-amber-400" />}
                          {isChallenge && <Zap className="w-3 h-3 text-amber-300" />}
                          {specialType === 'COMBO_FRENZY' && <Flame className="w-3 h-3 text-orange-400" />}
                          {specialType === 'TIME_ATTACK' && <Timer className="w-3 h-3 text-teal-300" />}
                        </div>
                      )}

                      {isUnlocked ? (
                        <>
                          <span className="leading-none mt-1 drop-shadow-md">{lvlId}</span>

                          {/* Stars Badge underneath level number */}
                          <div className="flex items-center space-x-0.5 text-[9px] text-amber-400 mt-1 drop-shadow-sm">
                            {Array.from({ length: 3 }).map((_, starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3 h-3 drop-shadow-sm ${
                                  starIdx < stars
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-700 fill-slate-800'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-600 drop-shadow-md" />
                      )}

                      {/* Current Level Pulsing Badge Banner */}
                      {isCurrent && (
                        <div className="absolute -top-3 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md animate-bounce border border-amber-200">
                          Current
                        </div>
                      )}
                    </button>
                  );
                })()}

                {/* Node Label */}
                <span
                  className={`text-[11px] font-black mt-2 drop-shadow-md tracking-wide ${
                    isCurrent ? 'text-amber-300 font-extrabold' : 'text-white'
                  }`}
                >
                  Level {lvlId}
                </span>
              </div>
            );
          })}
      </div>

      {/* ========================================================= */}
      {/* 4. LEVEL PREVIEW & SELECTION MODAL                        */}
      {/* ========================================================= */}
      {previewLevelId !== null && selectedLevelDef && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl space-y-4 relative">
            <button
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                setPreviewLevelId(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Level Title & World Badge */}
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                <Compass className="w-3 h-3 text-teal-400" />
                <span>{selectedLevelDef.worldName}</span>
              </div>

              {(() => {
                const specialType = DifficultyCurve.getSpecialLevelType(previewLevelId);
                if (!specialType) return null;
                const isBoss = specialType === 'PACK_BOSS' || specialType === 'WORLD_FINALE';
                return (
                  <div className="pt-1">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                        isBoss
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : specialType === 'BONUS_REWARD'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : specialType === 'CHALLENGE'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {isBoss ? <Crown className="w-3 h-3 text-amber-400" /> : <Star className="w-3 h-3" />}
                      <span>{specialType.replace('_', ' ')}</span>
                    </span>
                  </div>
                );
              })()}

              <h3 className="text-xl font-black text-white">LEVEL {previewLevelId}</h3>
              <p className="text-xs text-slate-400 font-medium">
                Difficulty: <strong className="text-teal-300">{selectedLevelDef.difficulty}</strong>
              </p>
            </div>

            {/* Star Record Display */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-center space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < selectedLevelStars
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'text-slate-800 fill-slate-900'
                  }`}
                />
              ))}
            </div>

            {/* Star Motivation Hint if not 3★ */}
            {selectedLevelProfile && selectedLevelStars < 3 && (
              <div className="bg-slate-950 p-2 rounded-xl border border-teal-500/20 flex items-center space-x-2 text-left">
                <Target className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-[11px] text-slate-300 font-bold">
                  {selectedLevelStars === 0
                    ? `Aim for ≤ ${selectedLevelProfile.threeStarMoves} moves for 3★ Mastery!`
                    : selectedLevelStars === 1
                    ? `Finish in ≤ ${selectedLevelProfile.twoStarMoves} moves for 2★`
                    : `Finish in ≤ ${selectedLevelProfile.threeStarMoves} moves for 3★`}
                </span>
              </div>
            )}

            {/* Objective & Rewards Summary */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Objective:</span>
                <span className="text-white font-bold">Clear All Tiles</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                <span className="text-slate-400 font-semibold">Tile Sets:</span>
                <span className="text-teal-300 font-bold">{selectedLevelDef.tiles.length} Tiles</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                <span className="text-slate-400 font-semibold">Reward:</span>
                <div className="flex items-center space-x-2 text-amber-300 font-bold">
                  <span className="flex items-center space-x-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>+{selectedLevelDef.rewardConfig.coins}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-teal-300">
                    <Gem className="w-3.5 h-3.5 text-teal-400" />
                    <span>+{selectedLevelDef.rewardConfig.gems}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                const targetLvl = previewLevelId;
                setPreviewLevelId(null);
                onSelectLevel(targetLvl);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-500 active:scale-95 text-white font-black text-base shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center space-x-2 border border-teal-300/30"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>PLAY LEVEL</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
