import React, { useState } from 'react';
import { PlayerProfile } from '../types/metaProgression';
import { globalAudioService } from '../services/AudioService';
import { globalRankingService } from '../services/RankingService';
import { globalProfileService } from '../services/PlayerProfileService';
import {
  X,
  User,
  Star,
  Coins,
  Gem,
  Trophy,
  Zap,
  Target,
  Shield,
  Clock,
  Crown,
  Edit2,
  Check
} from 'lucide-react';

interface PlayerProfileModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ profile: initialProfile, onClose }) => {
  const [profile, setProfile] = useState<PlayerProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.displayName || 'Sanctuary Explorer');
  const [tempUsername, setTempUsername] = useState(profile.username || profile.playerId);

  const handleSaveProfile = () => {
    globalAudioService.emit('ButtonPressed');
    const updated = globalProfileService.updateProfileDetails(tempName.trim() || 'Sanctuary Explorer', tempUsername.trim() || profile.playerId);
    setProfile(updated);
    setIsEditing(false);
  };

  const stats = profile.lifetimeStatistics;
  const tier = globalRankingService.getPlayerTier(profile.currentLevel, profile.starsTotal);
  const globalRank = globalRankingService.calculateGlobalRank(profile.currentLevel, profile.starsTotal);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-slate-100 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-500 to-indigo-600 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-teal-300 text-sm">
                <User className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            
            {isEditing ? (
              <div className="flex flex-col text-left space-y-1.5 flex-grow pr-2 w-full max-w-[180px]">
                <input
                  type="text"
                  maxLength={20}
                  placeholder="Display Name"
                  className="bg-slate-800 border border-slate-700 text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-teal-500"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                />
                <div className="flex items-center space-x-1">
                  <span className="text-slate-500 text-xs">@</span>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Username/ID"
                    className="bg-slate-800 border border-slate-700 text-teal-400 text-xs px-2 py-1 rounded focus:outline-none focus:border-teal-500 flex-grow min-w-0"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col text-left max-w-[180px] pr-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-white truncate">{profile.displayName || 'Sanctuary Explorer'}</h3>
                  <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-teal-400 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-teal-400 font-extrabold tracking-wider truncate">
                  @{profile.username || profile.playerId} · v{profile.profileVersion}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isEditing && (
              <button
                onClick={handleSaveProfile}
                className="p-1.5 rounded-full bg-teal-500/20 text-teal-400 hover:text-white hover:bg-teal-500/40 transition-colors"
              >
                <Check className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => {
                globalAudioService.emit('ButtonPressed');
                onClose();
              }}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Core Stats Overview Cards */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Level</span>
            <span className="text-lg font-black text-teal-300">{profile.currentLevel}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stars</span>
            <div className="flex items-center space-x-1 text-amber-400 font-black text-lg">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{profile.starsTotal}</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coins</span>
            <div className="flex items-center space-x-1 text-amber-300 font-black text-lg">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{profile.coins}</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gems</span>
            <div className="flex items-center space-x-1 text-teal-300 font-black text-lg">
              <Gem className="w-4 h-4 text-teal-400" />
              <span>{profile.gems}</span>
            </div>
          </div>
        </div>

        {/* Sanctuary Rank & Tier Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-950 to-indigo-500/15 p-3 rounded-2xl border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-300">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-white">{tier.name}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-bold border border-amber-500/30">
                  Rank #{globalRank}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Sanctuary League Standing</span>
            </div>
          </div>
        </div>

        {/* Lifetime Statistics Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Lifetime Statistics</span>
          </h4>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Levels Completed:</span>
              <span className="font-bold text-white">{stats.levelsCompleted}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-2">
              <span className="font-semibold">Total Moves Made:</span>
              <span className="font-bold text-white">{stats.totalMoves}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-2">
              <span className="font-semibold">Tiles Matched:</span>
              <span className="font-bold text-teal-300">{stats.totalTilesMatched}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-2">
              <span className="font-semibold">Boosters Activated:</span>
              <span className="font-bold text-amber-300">{stats.totalBoostersUsed}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-2">
              <span className="font-semibold">Best Score:</span>
              <span className="font-bold text-emerald-400">{stats.bestScore}</span>
            </div>
          </div>
        </div>

        {/* Booster Inventory Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span>Booster Vault</span>
          </h4>

          <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center text-xs">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400">Undo</span>
              <span className="font-black text-teal-300">{profile.boosterInventory.undo || 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400">Shuffle</span>
              <span className="font-black text-teal-300">{profile.boosterInventory.shuffle || 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400">Magnet</span>
              <span className="font-black text-teal-300">{profile.boosterInventory.magnet || 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400">Extra Slot</span>
              <span className="font-black text-teal-300">{profile.boosterInventory.extra_slot || 0}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            globalAudioService.emit('ButtonPressed');
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-colors"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
