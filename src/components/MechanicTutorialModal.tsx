import React from 'react';
import { ShieldAlert, Zap, Flame, Key, Lock, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { SpecialTileProperty } from '../types/gameEngine';

export interface MechanicTutorialInfo {
  type: SpecialTileProperty | 'special_level';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  tips: string[];
}

export const MECHANIC_TUTORIAL_DATA: Record<string, MechanicTutorialInfo> = {
  rainbow: {
    type: 'rainbow',
    title: 'Rainbow Wildcard Tile',
    subtitle: 'Universal Match Alchemy',
    badge: 'NEW MECHANIC',
    badgeColor: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white',
    icon: '🌈',
    description: 'Rainbow tiles act as universal wildcards! They match with ANY two identical tiles in your tray to complete a 3-tile match.',
    tips: [
      'Use rainbow tiles when you have two difficult or buried tiles in your tray.',
      'Matching a rainbow tile grants bonus combo score.',
    ],
  },
  golden: {
    type: 'golden',
    title: 'Golden Multiplier Tile',
    subtitle: 'Score Bounty Amplifier',
    badge: 'BONUS MULTIPLIER',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black',
    icon: '✨',
    description: 'Golden tiles radiate with fortune! Matching a golden tile doubles your match points (2x Score) and grants bonus coins.',
    tips: [
      'Chain golden tiles into high combos for massive high scores.',
      'Crucial for hitting 3-Star objectives in bonus and finale levels.',
    ],
  },
  frozen: {
    type: 'frozen',
    title: 'Frozen Ice Tiles',
    subtitle: 'Elemental Board Obstacle',
    badge: 'NEW OBSTACLE',
    badgeColor: 'bg-cyan-500 text-slate-950 font-black',
    icon: '❄️',
    description: 'Frozen tiles are locked in deep ice and cannot be picked directly. Make matches with normal tiles to radiate warmth and shatter the ice!',
    tips: [
      'Each match made anywhere on the board thaws unblocked frozen tiles.',
      'Plan your matches to thaw frozen tiles before your tray fills up.',
    ],
  },
  chained: {
    type: 'chained',
    title: 'Chained Iron Tiles',
    subtitle: 'Reinforced Board Obstacle',
    badge: 'NEW OBSTACLE',
    badgeColor: 'bg-slate-700 text-amber-300 font-bold border border-amber-500/30',
    icon: '⛓️',
    description: 'Chained tiles are bound by iron links. Tap directly on an unblocked chained tile to shatter its chains before taking it into your tray.',
    tips: [
      'Breaking a chain takes 1 move and awards 50 points.',
      'Clear surrounding obstacles to access chained key tiles.',
    ],
  },
  bomb: {
    type: 'bomb',
    title: 'Bomb Detonator Tile',
    subtitle: 'Explosive Tactical Power',
    badge: 'TACTICAL POWER',
    badgeColor: 'bg-rose-600 text-white font-black',
    icon: '💣',
    description: 'Matching a bomb triplet triggers a powerful blast that instantly clears 2 blocking tiles from the highest board layer!',
    tips: [
      'Detonations grant +300 bonus score.',
      'Clears deep roadblocks to reveal hidden triplets.',
    ],
  },
  key: {
    type: 'key',
    title: 'Skeleton Key Tile',
    subtitle: 'Master Unlocker',
    badge: 'KEY POWER',
    badgeColor: 'bg-amber-400 text-slate-950 font-black',
    icon: '🔑',
    description: 'Matching key tiles immediately shatters ALL chains and locks across the entire board!',
    tips: [
      'Saves dozens of moves in complex boss puzzles.',
    ],
  },
};

interface MechanicTutorialModalProps {
  mechanicKey: string;
  onDismiss: () => void;
}

export const MechanicTutorialModal: React.FC<MechanicTutorialModalProps> = ({
  mechanicKey,
  onDismiss,
}) => {
  const data = MECHANIC_TUTORIAL_DATA[mechanicKey];
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col space-y-5 animate-in zoom-in-95 duration-200 text-slate-100">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${data.badgeColor}`}>
            {data.badge}
          </span>
          <span className="text-slate-400 text-xs font-medium">Interactive Guide</span>
        </div>

        {/* Hero Visual Icon */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-4xl shadow-inner shadow-black/50 mb-3 animate-bounce">
            {data.icon}
          </div>
          <h2 className="text-2xl font-black text-white text-center tracking-tight">{data.title}</h2>
          <p className="text-xs font-semibold text-teal-400 text-center mt-0.5">{data.subtitle}</p>
        </div>

        {/* Description */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed">
          {data.description}
        </div>

        {/* Strategic Tips */}
        <div className="flex flex-col space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Strategy Tips:</span>
          {data.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer"
        >
          <span>Got it, let's play!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
