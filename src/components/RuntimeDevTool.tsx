import React, { useState, useEffect } from 'react';
import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';
import { LevelLoader } from '../engine/LevelLoader';
import { LevelSession } from '../engine/LevelSession';
import { globalSaveService } from '../services/SaveService';
import {
  Play,
  RotateCcw,
  FastForward,
  Trash2,
  Layers,
  Database,
  Info,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

interface RuntimeDevToolProps {
  currentLevelId?: number;
  onSelectLevelToPlay?: (levelId: number) => void;
  activeSession?: LevelSession | null;
}

export const RuntimeDevTool: React.FC<RuntimeDevToolProps> = ({
  currentLevelId = 1,
  onSelectLevelToPlay,
  activeSession,
}) => {
  const [selectedLvlInput, setSelectedLvlInput] = useState<number>(currentLevelId);
  const [inspectedLevel, setInspectedLevel] = useState<any | null>(null);
  const [loaderLog, setLoaderLog] = useState<string[]>([]);
  const [saveData, setSaveData] = useState(() => globalSaveService.loadSave());

  useEffect(() => {
    fetchLevelData(selectedLvlInput);
  }, [selectedLvlInput]);

  const fetchLevelData = (lvlId: number) => {
    const lvl = RuntimeLevelRegistry.getLevel(lvlId);
    setInspectedLevel(lvl);
  };

  const handleTestLoad = async () => {
    const loader = new LevelLoader();
    const res = await loader.loadLevel(selectedLvlInput);
    setLoaderLog(res.developerLog || []);
    if (res.session) {
      setInspectedLevel(res.session.levelDef);
    }
  };

  const handleResetSave = () => {
    if (confirm('Reset player save data for development?')) {
      globalSaveService.resetSave();
      setSaveData(globalSaveService.loadSave());
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 p-6 overflow-y-auto font-sans">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wide text-white">Runtime Level Delivery & Inspection</h2>
            <p className="text-xs text-slate-400">Phase 09 Runtime Registry & Session Inspector</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetSave}
            className="px-3 py-1.5 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 text-rose-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Save</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Level Selector & Loader */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Level Lookup & Loader</span>
          </h3>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-medium">Target Level ID:</label>
            <input
              type="number"
              min={1}
              max={100}
              value={selectedLvlInput}
              onChange={(e) => setSelectedLvlInput(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => fetchLevelData(selectedLvlInput)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all"
            >
              Inspect
            </button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleTestLoad}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Test Runtime Load</span>
            </button>
            {onSelectLevelToPlay && (
              <button
                onClick={() => onSelectLevelToPlay(selectedLvlInput)}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-1"
              >
                <Play className="w-4 h-4" />
                <span>Play Level</span>
              </button>
            )}
          </div>

          {/* Loader Pipeline Log Output */}
          {loaderLog.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                Loader Execution Trace:
              </span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-48 overflow-y-auto font-mono text-[11px] text-emerald-400 space-y-1">
                {loaderLog.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Column: Inspected Level Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Level Metadata & Contract</span>
          </h3>

          {inspectedLevel ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Level ID / World:</span>
                <span className="font-mono text-white font-bold">
                  Level {inspectedLevel.id} (World {inspectedLevel.worldId})
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Pack ID:</span>
                <span className="font-mono text-cyan-400 font-bold">{inspectedLevel.packId || 'World Default'}</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Version:</span>
                <span className="font-mono text-emerald-400 font-bold">{inspectedLevel.version || 'v1.0'}</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Approval Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  {inspectedLevel.metadata?.approvalStatus || 'APPROVED'}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Difficulty Score:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {inspectedLevel.numericalDifficulty || 50} / 100 ({inspectedLevel.difficulty})
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Tiles Count / Triplets:</span>
                <span className="font-mono text-indigo-400 font-bold">
                  {inspectedLevel.tiles?.length || 0} tiles ({((inspectedLevel.tiles?.length || 0) / 3)} triplets)
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Tray Capacity:</span>
                <span className="font-mono text-slate-200 font-bold">{inspectedLevel.trayCapacity || 7} slots</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">No level inspected yet.</div>
          )}
        </div>

        {/* Right Column: Player Progression State & Phase 10 Gameplay Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Active Progression & Phase 10 Controls</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Highest Unlocked Level:</span>
              <span className="font-mono text-amber-400 font-bold">Level {saveData.highestLevelUnlocked}</span>
            </div>

            <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Total Stars Collected:</span>
              <span className="font-mono text-amber-400 font-bold">{saveData.starsTotal} ★</span>
            </div>

            <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Coins / Gems:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {saveData.coins} Coins | {saveData.gems} Gems
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Completed Levels Count:</span>
              <span className="font-mono text-indigo-400 font-bold">
                {Object.keys(saveData.completedLevels).length} levels
              </span>
            </div>

            {/* Active Session Gameplay Inspection */}
            {activeSession && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Live Session Telemetry:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block">Moves Used:</span>
                    <span className="text-white font-bold">{activeSession.state.movesUsed}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block">Score / Combo:</span>
                    <span className="text-amber-400 font-bold">{activeSession.state.score} (x{activeSession.state.combo})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 11 & Phase 12 Meta Dev Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Phase 11 & 12 Meta & Booster Control Panel:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['undo', 'shuffle', 'magnet', 'extra_slot'] as const).map((bType) => {
                  const qty = saveData.boosterInventory[bType] || 0;
                  return (
                    <div key={bType} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-200 capitalize">{bType}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">Count: {qty}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            const newInv = { ...saveData.boosterInventory, [bType]: qty + 1 };
                            globalSaveService.saveData({ boosterInventory: newInv });
                            setSaveData(globalSaveService.loadSave());
                          }}
                          className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px]"
                          title="Add 1 booster"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => {
                            const newInv = { ...saveData.boosterInventory, [bType]: Math.max(0, qty - 1) };
                            globalSaveService.saveData({ boosterInventory: newInv });
                            setSaveData(globalSaveService.loadSave());
                          }}
                          className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[10px]"
                          title="Remove 1 booster"
                        >
                          -1
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      globalSaveService.saveData({ coins: saveData.coins + 500, gems: saveData.gems + 50 });
                      setSaveData(globalSaveService.loadSave());
                    }}
                    className="flex-1 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 font-bold text-[11px] rounded-lg transition-all"
                  >
                    +500 Coins & +50 Gems
                  </button>

                  <button
                    onClick={() => {
                      const nextLvl = Math.max(1, saveData.highestLevelUnlocked + 5);
                      globalSaveService.saveData({ highestLevelUnlocked: nextLvl, currentLevel: nextLvl });
                      setSaveData(globalSaveService.loadSave());
                    }}
                    className="flex-1 py-1.5 bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-300 font-bold text-[11px] rounded-lg transition-all"
                  >
                    Unlock +5 Levels
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const currentMeta = (saveData as any).metaProfile || {};
                      const updatedMeta = {
                        ...currentMeta,
                        dailyRewardState: {
                          lastClaimTimestamp: 0,
                          currentStreak: 1,
                          currentDay: 1,
                          claimedDays: {},
                        },
                      };
                      globalSaveService.saveData({ metaProfile: updatedMeta } as any);
                      setSaveData(globalSaveService.loadSave());
                      alert('Daily reward reset for instant developer claim testing!');
                    }}
                    className="flex-1 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-bold text-[11px] rounded-lg transition-all"
                  >
                    Reset Daily Reward
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
