import React from 'react';
import { Play, Star, Trophy, Target, X, Compass, ShieldAlert, Gift, Flame, Crown, Clock, Footprints, Snowflake, Link2, Bomb, Key, Zap } from 'lucide-react';
import { LevelDefinition } from '../types/gameEngine';
import { getWorldForLevel } from '../data/worldDefinitions';
import { DifficultyCurve } from '../engine/DifficultyCurve';

interface LevelIntroModalProps {
  level: LevelDefinition;
  isOpen: boolean;
  starsEarned?: number;
  highScore?: number;
  onStart: () => void;
  onClose: () => void;
}

export const LevelIntroModal: React.FC<LevelIntroModalProps> = ({
  level,
  isOpen,
  starsEarned = 0,
  highScore = 0,
  onStart,
  onClose,
}) => {
  if (!isOpen) return null;

  const world = getWorldForLevel(level.id);
  const specialType = DifficultyCurve.getSpecialLevelType(level.id);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Expert':
      case 'Very Hard':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Hard':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Normal':
      case 'Easy':
      default:
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    }
  };

  const getSpecialBadge = () => {
    switch (specialType) {
      case 'WORLD_FINALE':
        return {
          label: 'WORLD FINALE',
          icon: Crown,
          style: 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-yellow-300 border-yellow-500/40 animate-pulse',
        };
      case 'PACK_BOSS': {
        const bossName = level.bossArchetype ? level.bossArchetype.replace('_', ' ') : 'PACK BOSS';
        return {
          label: bossName,
          icon: ShieldAlert,
          style: 'bg-rose-500/25 text-rose-400 border-rose-500/40 font-black',
        };
      }
      case 'COMBO_FRENZY':
        return {
          label: 'COMBO FRENZY',
          icon: Flame,
          style: 'bg-orange-500/20 text-orange-400 border-orange-500/30 font-bold',
        };
      case 'TIME_ATTACK':
        return {
          label: 'TIME ATTACK',
          icon: Clock,
          style: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold',
        };
      case 'MOVE_LIMIT':
        return {
          label: 'MOVE LIMIT',
          icon: Footprints,
          style: 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold',
        };
      case 'BONUS_REWARD':
        return {
          label: 'BONUS TREASURE',
          icon: Gift,
          style: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'CHALLENGE':
        return {
          label: 'CHALLENGE PUZZLE',
          icon: Zap,
          style: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        };
      default:
        return null;
    }
  };

  const specialBadge = getSpecialBadge();

  // Detect special tile mechanics present in this level
  const specialProps = new Set(
    ((level?.tiles) || []).map((t) => t?.specialProperty).filter(Boolean)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* World Theme & Level Identification */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>World {world.id}: {world.name}</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Level {level.id}
          </h2>

          <p className="text-xs text-slate-400 italic">
            "{world.subtitle}" • {world.theme}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getDifficultyBadge(
                level.difficulty
              )}`}
            >
              {level.difficulty}
            </span>

            {specialBadge && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-black rounded-full border ${specialBadge.style}`}>
                <specialBadge.icon className="w-3 h-3" />
                <span>{specialBadge.label}</span>
              </span>
            )}

            <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/50">
              Pattern: {level.layoutPattern || 'Pyramid'}
            </span>
          </div>
        </div>

        {/* Stars Earned Previously */}
        <div className="flex items-center justify-center gap-3 py-2 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-6 h-6 ${
                starIndex <= starsEarned
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700 fill-slate-800'
              } transition-transform`}
            />
          ))}
        </div>

        {/* Level Objectives & Special Modifiers */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-teal-400" /> Objectives & Modifiers
          </h3>
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-200 font-medium">Clear Board Tiles</span>
                <span className="text-[11px] text-slate-400">Tray Capacity: {level.trayCapacity} Slots</span>
              </div>
              <span className="text-teal-400 font-black text-sm">{level.tiles.length} Tiles</span>
            </div>

            {/* Special Tile Modifiers Tag List */}
            {specialProps.size > 0 && (
              <div className="pt-1.5 border-t border-slate-700/50 flex flex-wrap gap-1.5">
                {specialProps.has('frozen') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                    <Snowflake className="w-3 h-3 text-cyan-400" /> Frozen Ice
                  </span>
                )}
                {specialProps.has('chained') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-600/30 text-slate-300 border border-slate-500/40 text-[10px] font-bold">
                    <Link2 className="w-3 h-3 text-slate-400" /> Iron Chains
                  </span>
                )}
                {specialProps.has('bomb') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                    <Bomb className="w-3 h-3 text-red-400" /> Detonator Bomb
                  </span>
                )}
                {specialProps.has('key') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    <Key className="w-3 h-3 text-amber-400" /> Skeleton Key
                  </span>
                )}
                {specialProps.has('rainbow') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                    <Star className="w-3 h-3 text-purple-400" /> Wildcard
                  </span>
                )}
                {specialProps.has('golden') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-bold">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 2X Golden
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Level Target Rewards */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> Completion Rewards
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-2xl bg-slate-800/40 border border-slate-800/80 flex items-center gap-2">
              <span className="text-amber-400 font-bold">🪙 +{level.rewardConfig?.coins || 100}</span>
              <span className="text-slate-400">Coins</span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-800/40 border border-slate-800/80 flex items-center gap-2">
              <span className="text-teal-400 font-bold">💎 +{level.rewardConfig?.gems || 0}</span>
              <span className="text-slate-400">Gems</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>START LEVEL</span>
        </button>
      </div>
    </div>
  );
};
