import React, { useState } from 'react';
import { 
  GDD_VISION, 
  CORE_GAMEPLAY_LOOP_STEPS, 
  META_LOOP_STEPS, 
  GAME_STATES_SPEC, 
  BOOSTERS_CATALOG, 
  DATABASE_ENTITIES, 
  DEVELOPMENT_MILESTONES, 
  TECHNICAL_RISKS, 
  API_CONTRACTS 
} from '../data/phase3Data';
import { 
  BookOpen, 
  Layers, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  Database, 
  FolderTree, 
  Zap, 
  Trophy, 
  Users, 
  Coins, 
  Map, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Sliders, 
  RotateCcw, 
  Shuffle, 
  Snowflake, 
  PlusCircle, 
  Compass, 
  Gem,
  Star,
  Server, 
  Code2, 
  Lock, 
  Activity, 
  ListChecks 
} from 'lucide-react';

export function GddAndArchitectureView() {
  const [activeSection, setActiveSection] = useState<
    'VISION' | 'CORE_LOOP' | 'RULES' | 'SOLVABILITY' | 'BOOSTERS' | 'ECONOMY' | 'SOCIAL' | 'TECH' | 'DATABASE' | 'APIS' | 'ROADMAP'
  >('VISION');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Star className="w-3.5 h-3.5" />
                <span>PHASE 03 SPECIFICATION</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
                ARCHITECTURE & GDD READY
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>{GDD_VISION.gameTitle}</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              Master Game Design Document (GDD) & Full-Stack Technical Architecture for our 3D Triple-Tile matching puzzle and sanctuary restoration game.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <div className="bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">DOCUMENT SECTIONS</span>
              <span className="text-indigo-400 font-bold text-sm">46 Technical Sections</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">DELIVERABLES</span>
              <span className="text-emerald-400 font-bold text-sm">A through AU</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'VISION', label: '1. GDD Vision', icon: BookOpen },
            { id: 'CORE_LOOP', label: '2. Gameplay & States', icon: Workflow },
            { id: 'RULES', label: '3. Tile & Board Rules', icon: Layers },
            { id: 'SOLVABILITY', label: '4. Level Solvability Engine', icon: Cpu },
            { id: 'BOOSTERS', label: '5. Boosters & Objectives', icon: Zap },
            { id: 'ECONOMY', label: '6. Economy & Rewards', icon: Coins },
            { id: 'SOCIAL', label: '7. Clubs & LiveOps', icon: Users },
            { id: 'TECH', label: '8. Unity & Code Arch', icon: FolderTree },
            { id: 'DATABASE', label: '9. Database ERD', icon: Database },
            { id: 'APIS', label: '10. REST/WS APIs', icon: Terminal },
            { id: 'ROADMAP', label: '11. Roadmap & Risks', icon: ListChecks }
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeSection === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveSection(nav.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: VISION & CONCEPT */}
      {activeSection === 'VISION' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                <Compass className="w-4 h-4" />
                <span>Core Concept & Tagline</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                "{GDD_VISION.tagline}"
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {GDD_VISION.coreConcept}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Target Audience & Market</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {GDD_VISION.targetAudience}
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <strong>Player Motivation:</strong> Tactile satisfaction, spatial problem solving, habitat customization, and relaxed social connection.
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Star className="w-4 h-4" />
                <span>Player Experience</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {GDD_VISION.playerExperience}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Key Pillars & Market Differentiators</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GDD_VISION.keyDifferentiators.map((diff, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="text-xs text-slate-300 leading-relaxed">{diff}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CORE LOOP & GAME STATES */}
      {activeSection === 'CORE_LOOP' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Workflow className="w-4 h-4 text-emerald-400" />
              <span>Core Gameplay Loop (Step-by-Step State Flow)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CORE_GAMEPLAY_LOOP_STEPS.map((s) => (
                <div key={s.step} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      STEP {s.step}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Loop */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Long-Term Player Meta Loop</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {META_LOOP_STEPS.map((m, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">0{idx + 1}. {m.title}</span>
                  <p className="text-[11px] text-slate-400 leading-snug">{m.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Game States Specification Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Master Game States Specification Matrix (10 Core States)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">State Name</th>
                    <th className="p-3">Entry Condition</th>
                    <th className="p-3">Available Actions</th>
                    <th className="p-3">Exit Conditions</th>
                    <th className="p-3">UI Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {GAME_STATES_SPEC.map((gs, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-indigo-300">{gs.name}</td>
                      <td className="p-3 text-slate-400">{gs.entryCondition}</td>
                      <td className="p-3 text-slate-300">{gs.availableActions}</td>
                      <td className="p-3 text-emerald-400">{gs.exitConditions}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{gs.uiRequired}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TILE & BOARD RULES */}
      {activeSection === 'RULES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>3D Tile Occlusion & Selection Rules</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span><strong>Layer Stacking:</strong> Board tiles exist on discrete integer Z-layers (0 = ground tile, higher = stacked).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span><strong>Occlusion Hit Test:</strong> A tile at (x, y, layer) is BLOCKED if any tile at layer + 1 overlaps its bounding box (X±0.5, Y±0.5).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span><strong>Visual Indication:</strong> Blocked tiles render with 40% darker ambient tint and dropped drop-shadows.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span><strong>Selection:</strong> Tapping an unblocked tile triggers raycast hit, plays tile click audio chime, and moves it to the tray dock.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Workflow className="w-4 h-4 text-emerald-400" />
                <span>7-Capacity Tray Dock Mechanics</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Default Slots:</strong> 7 slots max. Tapping 8th tile when tray is full without match triggers Level Failed state.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Auto-Grouping:</strong> Newly inserted tiles slide automatically to group beside matching Type IDs already in tray.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Match-3 Evaluation:</strong> Once 3 matching tiles sit adjacent in tray, they freeze for 120ms, flash glow, and dissolve with particle effect.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Rapid Tap Queue:</strong> Taps during tile movement animations are buffered in an input queue to prevent race conditions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: LEVEL SOLVABILITY & GENERATION */}
      {activeSection === 'SOLVABILITY' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Level Generation & BFS Backtracking Solvability Pipeline</span>
            </h3>
            
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-3 font-mono">
              <div className="text-emerald-400 font-bold">// Solvability Pipeline Flowchart</div>
              <p className="text-slate-300">
                [Level Seed] → [Generate 3D Layer Stack] → [Enforce Triplet Tile Distribution] → [BFS Backtracking Solvability Check]
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] pt-2">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <strong className="text-indigo-400 block mb-1">1. Triplet Constraint</strong>
                  Total tile count MUST be a multiple of 3 (e.g. 45, 60, 75 tiles). Every tile type must exist in exact multiples of 3.
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <strong className="text-amber-400 block mb-1">2. Backtracking Solver</strong>
                  BFS simulation simulates all available unblocked tap sequences. If max tray size (7) is exceeded in all paths, layout is REJECTED.
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block mb-1">3. Difficulty Scoring</strong>
                  Scores levels based on Max Layer Depth, Bottleneck Ratios (tiles blocking multiple tiles), and Color Dispersion.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: BOOSTERS & OBJECTIVES */}
      {activeSection === 'BOOSTERS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Modular Boosters Catalog & Mechanics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BOOSTERS_CATALOG.map((b) => (
                <div key={b.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center space-x-2">
                      <span className="text-indigo-400">{b.name}</span>
                    </span>
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {b.costCoins} Coins
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{b.description}</p>
                  <div className="bg-slate-900 p-2 rounded text-[11px] text-slate-400 font-mono">
                    <strong>Effect:</strong> {b.effect}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: ECONOMY & REWARDS */}
      {activeSection === 'ECONOMY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <Coins className="w-4 h-4" />
                <span>Coins (Soft Currency)</span>
              </h3>
              <p className="text-xs text-slate-300">
                <strong>Sources:</strong> Level victory, Star Chests, Daily Login, Club Chests.
              </p>
              <p className="text-xs text-slate-300">
                <strong>Sinks:</strong> In-game boosters (Undo, Shuffle, Magnet), extra tray slot revival, sanctuarydecorations.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-purple-400 flex items-center space-x-2">
                <Gem className="w-4 h-4" />
                <span>Gems (Hard Currency)</span>
              </h3>
              <p className="text-xs text-slate-300">
                <strong>Sources:</strong> In-App Purchases (IAP), Tournament top ranks, milestone achievements.
              </p>
              <p className="text-xs text-slate-300">
                <strong>Sinks:</strong> VIP cosmetic skins, Instant energy refill, Premium Battle Pass unlock.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-blue-400 flex items-center space-x-2">
                <Compass className="w-4 h-4" />
                <span>Water Drops (Meta Currency)</span>
              </h3>
              <p className="text-xs text-slate-300">
                <strong>Sources:</strong> Earned 1:1 per level star earned.
              </p>
              <p className="text-xs text-slate-300">
                <strong>Sinks:</strong> Restoring 3D Oasis Sanctuaries (building temples, cleansing pools, planting sacred flora).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: CLUBS & LIVEOPS */}
      {activeSection === 'SOCIAL' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Clubs, Chat & Tournament Architecture</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-300">Guild / Club Architecture</h4>
                <p>Clubs support up to 30 members. Roles include Owner, Co-Leader, and Member. Members share free lives every 4 hours and collaborate on weekly 10,000-star Club Chests.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-300">Real-time WebSocket Chat & Moderation</h4>
                <p>Built with Redis Pub/Sub for sub-100ms message fan-out. Features regex profanity filters, spam rate-limiting (max 1 msg/2 sec), and user block/report systems.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: UNITY & CODE ARCHITECTURE */}
      {activeSection === 'TECH' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FolderTree className="w-4 h-4 text-purple-400" />
              <span>Unity Project Structure & Assembly Definitions</span>
            </h3>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div>Assets/</div>
              <div>├── Addressables/ (Remote Level Bundles & Tile Textures)</div>
              <div>├── Art/ (3D Meshes, Shaders, Particle Prefabs)</div>
              <div>├── Audio/ (Chimes, Ambiance, UI Sound Banks)</div>
              <div>├── Plugins/ (Native Android/iOS Bridge, Firebase)</div>
              <div>└── Scripts/</div>
              <div className="text-indigo-400 pl-4">├── Core/ (State Machine, App Bootstrapper)</div>
              <div className="text-indigo-400 pl-4">├── Gameplay/ (TileEngine, OcclusionRaycaster, TrayDock)</div>
              <div className="text-indigo-400 pl-4">├── Solver/ (BFSBacktrackingSolver, LevelScorer)</div>
              <div className="text-indigo-400 pl-4">├── Social/ (ClubManager, ChatWebSocketClient)</div>
              <div className="text-indigo-400 pl-4">└── Save/ (EncryptedLocalStore, CloudSyncService)</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: DATABASE ERD */}
      {activeSection === 'DATABASE' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL Relational Schema (Master Tables)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DATABASE_ENTITIES.map((ent) => (
                <div key={ent.tableName} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-indigo-400 text-xs">{ent.tableName}</span>
                    <span className="text-[10px] text-slate-500">{ent.description}</span>
                  </div>

                  <div className="space-y-1">
                    {ent.fields.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-300">{f.name}</span>
                        <span className="text-purple-400">{f.type}</span>
                        <span className="text-slate-500 text-[10px]">{f.constraints}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 10: API CONTRACTS */}
      {activeSection === 'APIS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Backend REST & WebSocket API Specification</span>
            </h3>

            <div className="space-y-3">
              {API_CONTRACTS.map((api, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {api.method}
                      </span>
                      <span className="text-white font-bold">{api.endpoint}</span>
                    </div>
                    {api.authRequired && (
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] px-2 py-0.5 rounded">
                        JWT Auth Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-sans">{api.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[10px]">
                    {api.requestBody && (
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-500 block mb-1">Request Body</span>
                        <pre className="text-indigo-300 whitespace-pre-wrap">{api.requestBody}</pre>
                      </div>
                    )}
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                      <span className="text-slate-500 block mb-1">Response Sample</span>
                      <pre className="text-emerald-300 whitespace-pre-wrap">{api.responseBody}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 11: ROADMAP & RISKS */}
      {activeSection === 'ROADMAP' && (
        <div className="space-y-6">
          {/* Milestones */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ListChecks className="w-4 h-4 text-emerald-400" />
              <span>Production Milestones (1 through 6)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEVELOPMENT_MILESTONES.map((m) => (
                <div key={m.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">{m.title}</span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    {m.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <div className="bg-slate-900 p-2 rounded text-[10px] text-emerald-400">
                    <strong>Exit Criteria:</strong> {m.exitCriteria.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Risk Register */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Technical Risk Register & Contingencies</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Risk ID</th>
                    <th className="p-3">Risk Scenario</th>
                    <th className="p-3">Impact</th>
                    <th className="p-3">Prevention Strategy</th>
                    <th className="p-3">Contingency Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {TECHNICAL_RISKS.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-indigo-400">{r.id}</td>
                      <td className="p-3 font-bold text-white">{r.risk}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.impact === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {r.impact}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 text-[11px]">{r.prevention}</td>
                      <td className="p-3 text-emerald-400 text-[11px]">{r.backupPlan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
