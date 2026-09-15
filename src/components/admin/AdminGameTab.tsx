/**
 * Game Management (Levels & Worlds) Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  Gamepad2,
  Search,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldAlert,
} from 'lucide-react';

interface AdminGameTabProps {
  adminEmail: string;
  onRefresh: () => void;
}

interface LevelConfigItem {
  levelId: number;
  worldId: number;
  worldName: string;
  movesAllowed: number;
  targetMatches: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';
  iceBlockersEnabled: boolean;
  stoneBlockersEnabled: boolean;
  rewardCoins: number;
  rewardGems: number;
}

const SAMPLE_LEVELS: LevelConfigItem[] = [
  { levelId: 1, worldId: 1, worldName: 'Lotus Springs', movesAllowed: 30, targetMatches: 18, difficulty: 'EASY', iceBlockersEnabled: false, stoneBlockersEnabled: false, rewardCoins: 100, rewardGems: 5 },
  { levelId: 8, worldId: 1, worldName: 'Lotus Springs', movesAllowed: 28, targetMatches: 24, difficulty: 'MEDIUM', iceBlockersEnabled: true, stoneBlockersEnabled: false, rewardCoins: 120, rewardGems: 5 },
  { levelId: 14, worldId: 1, worldName: 'Lotus Springs', movesAllowed: 26, targetMatches: 30, difficulty: 'HARD', iceBlockersEnabled: true, stoneBlockersEnabled: false, rewardCoins: 150, rewardGems: 10 },
  { levelId: 19, worldId: 1, worldName: 'Lotus Springs', movesAllowed: 24, targetMatches: 36, difficulty: 'HARD', iceBlockersEnabled: true, stoneBlockersEnabled: true, rewardCoins: 180, rewardGems: 10 },
  { levelId: 20, worldId: 1, worldName: 'Lotus Springs (Finale)', movesAllowed: 32, targetMatches: 45, difficulty: 'BOSS', iceBlockersEnabled: true, stoneBlockersEnabled: true, rewardCoins: 300, rewardGems: 25 },
  { levelId: 21, worldId: 2, worldName: 'Bamboo Grove', movesAllowed: 28, targetMatches: 24, difficulty: 'EASY', iceBlockersEnabled: false, stoneBlockersEnabled: false, rewardCoins: 120, rewardGems: 5 },
  { levelId: 50, worldId: 2, worldName: 'Bamboo Grove (Boss)', movesAllowed: 34, targetMatches: 54, difficulty: 'BOSS', iceBlockersEnabled: true, stoneBlockersEnabled: true, rewardCoins: 350, rewardGems: 30 },
  { levelId: 100, worldId: 1, worldName: 'Sanctuary Summit', movesAllowed: 40, targetMatches: 60, difficulty: 'BOSS', iceBlockersEnabled: true, stoneBlockersEnabled: true, rewardCoins: 500, rewardGems: 50 },
];

export const AdminGameTab: React.FC<AdminGameTabProps> = ({ adminEmail, onRefresh }) => {
  const [levelList, setLevelList] = useState<LevelConfigItem[]>(SAMPLE_LEVELS);
  const [searchLevel, setSearchLevel] = useState<string>('');
  const [editingLevel, setEditingLevel] = useState<LevelConfigItem | null>(null);
  const [movesInput, setMovesInput] = useState<number>(28);
  const [coinsRewardInput, setCoinsRewardInput] = useState<number>(100);
  const [difficultyInput, setDifficultyInput] = useState<LevelConfigItem['difficulty']>('MEDIUM');
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = (levelList || []).filter((l) => {
    if (!l) return false;
    if (!searchLevel.trim()) return true;
    const num = parseInt(searchLevel.trim());
    if (!isNaN(num)) return l.levelId === num;
    return (
      (l.worldName && l.worldName.toLowerCase().includes(searchLevel.toLowerCase())) ||
      (l.difficulty && l.difficulty.toLowerCase().includes(searchLevel.toLowerCase()))
    );
  });

  const handleEditClick = (lvl: LevelConfigItem) => {
    setEditingLevel(lvl);
    setMovesInput(lvl.movesAllowed);
    setCoinsRewardInput(lvl.rewardCoins);
    setDifficultyInput(lvl.difficulty);
  };

  const handleSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;

    if (movesInput < 10 || movesInput > 100) {
      alert('Moves allowed must be between 10 and 100 to maintain balance.');
      return;
    }

    const prevMoves = editingLevel.movesAllowed;
    const updated = levelList.map((l) => {
      if (l.levelId === editingLevel.levelId) {
        return {
          ...l,
          movesAllowed: movesInput,
          rewardCoins: coinsRewardInput,
          difficulty: difficultyInput,
        };
      }
      return l;
    });

    setLevelList(updated);

    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Adjusted Level ${editingLevel.levelId} Balance`,
      category: 'GAME_CONFIG',
      targetId: `level_${editingLevel.levelId}`,
      reason: 'Balance adjustment to address player drop-off telemetry',
      previousValue: `${prevMoves} moves, ${editingLevel.difficulty}`,
      newValue: `${movesInput} moves, ${difficultyInput}`,
    });

    setNotice(`Level ${editingLevel.levelId} balance updated successfully.`);
    setEditingLevel(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-teal-400" />
            <span>Game Management (Levels & Worlds Architecture)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Authoritative tuning for 100 Worlds, 9,999 Levels, difficulty pacing, moves constraints, and completion payouts.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Total Worlds:</span> <strong className="text-white">100</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Total Levels:</span> <strong className="text-teal-400">9,999</strong>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-teal-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Search & List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white">Configured Levels Registry</h3>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchLevel}
              onChange={(e) => setSearchLevel(e.target.value)}
              placeholder="Search level number, world, difficulty..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">World</th>
                <th className="py-2.5 px-3">Moves</th>
                <th className="py-2.5 px-3">Target Matches</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Blockers</th>
                <th className="py-2.5 px-3">Coins Reward</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((lvl) => (
                <tr key={lvl.levelId} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    Level {lvl.levelId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-200">{lvl.worldName}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">World {lvl.worldId}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-300">
                    {lvl.movesAllowed} moves
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">
                    {lvl.targetMatches} matches
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        lvl.difficulty === 'BOSS'
                          ? 'bg-purple-500/20 text-purple-300'
                          : lvl.difficulty === 'HARD'
                          ? 'bg-rose-500/20 text-rose-300'
                          : lvl.difficulty === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {lvl.difficulty}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-400">
                    {lvl.iceBlockersEnabled && <span className="mr-1 text-cyan-300 font-bold">Ice</span>}
                    {lvl.stoneBlockersEnabled && <span className="text-slate-300 font-bold">Stone</span>}
                    {!lvl.iceBlockersEnabled && !lvl.stoneBlockersEnabled && <span>None</span>}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-300">
                    +{lvl.rewardCoins}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleEditClick(lvl)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700"
                    >
                      Tune Level
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tune Level Modal */}
      {editingLevel && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                Tune Balance: Level {editingLevel.levelId}
              </h3>
              <button onClick={() => setEditingLevel(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLevel} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>Allowed Moves</span>
                  <span className="font-mono text-teal-400 font-bold">{movesInput} moves</span>
                </label>
                <input
                  type="range"
                  min={15}
                  max={60}
                  value={movesInput}
                  onChange={(e) => setMovesInput(parseInt(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Difficulty Grade</label>
                <select
                  value={difficultyInput}
                  onChange={(e) => setDifficultyInput(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                  <option value="BOSS">BOSS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>Completion Coin Reward</span>
                  <span className="font-mono text-amber-300 font-bold">+{coinsRewardInput} Coins</span>
                </label>
                <input
                  type="number"
                  min={50}
                  max={1000}
                  value={coinsRewardInput}
                  onChange={(e) => setCoinsRewardInput(parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                Any changes made here are immediately logged into the immutable audit trail and will apply to all subsequent puzzle sessions.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLevel(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black"
                >
                  Save Level Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
