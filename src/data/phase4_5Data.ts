export interface Phase45Section {
  id: string;
  code: string;
  title: string;
  summary: string;
  details: string[];
  keyArchitectureNotes?: string[];
}

export const PHASE_4_5_ARCHITECTURAL_SECTIONS: Phase45Section[] = [
  {
    id: 'sec_a',
    code: 'A',
    title: 'Current Prototype Architecture Review',
    summary: 'Comprehensive audit of the initial prototype state, components, data structures, and couplings.',
    details: [
      'Components Audited: TileGameEngine.tsx (691 lines containing mixed UI, Audio, Game State, Board Rendering, Tray logic, and Booster implementations).',
      'Data Structures: TileData, TrayTile, LevelConfig in /src/types/game.ts. Tiles lack explicit state enums (AVAILABLE, BLOCKED, SELECTED, MATCHING).',
      'Coupling Assessment: Game state handled via 3 string literals (\'PLAYING\', \'VICTORY\', \'DEFEAT\'). No intermediate MATCHING or BOOSTER_ACTIVE states, leading to race conditions during rapid tapping.',
      'Audio & FX: Embedded GameAudio class directly in component file instead of an event-driven Audio Service singleton.',
      'Level Generation: Embedded inline helper generateLevel(id) with hardcoded fruit emoji array, limiting dynamic world scaling.',
    ],
  },
  {
    id: 'sec_b',
    code: 'B',
    title: 'KEEP / REFACTOR / REPLACE / ADD Categorization Report',
    summary: 'Systematic classification of codebase elements for production hardening.',
    details: [
      'KEEP: Web Audio API sound synthesizer algorithms (C5 pitch escalation, victory notes, booster sawtooth frequency ramps); 3D layer offset visual stacking formula; fruit & gem emoji visual assets; Lucide icon integrations.',
      'REFACTOR: TileGameEngine.tsx (split into decoupled engine modules: MatchSystem, BoardAutoFitSystem, GameStateMachine, BoosterEngine, LevelValidator); Level selector bar (decouple from hardcoded Lvl 1-5 to data-driven LevelDefinition registry).',
      'REPLACE: Hardcoded 3-state string literal (\'PLAYING\'|\'VICTORY\'|\'DEFEAT\') with 13-state GameStateMachine; Inline generateLevel() with data-driven LevelDefinition engine; Fixed 7-slot array assumption with TrayConfiguration manager.',
      'ADD: BoardAutoFitSystem (responsive viewport viewport calculations); LevelValidator & SolvabilitySystem (greedy match solver & triplet verifier); DifficultySystem (numerical 0-100 rating model); TestFramework (automated 10-point unit test suite); LocalSaveService & LocalEconomyService abstractions.',
    ],
  },
  {
    id: 'sec_c',
    code: 'C',
    title: 'Production-Ready Architecture',
    summary: 'Layered architecture separating Domain Engine, Services, Presentation, and Data Persistence.',
    details: [
      'Layer 1 - Data & Persistence: LocalSaveService, LocalEconomyService, LevelDefinition Registry.',
      'Layer 2 - Core Domain Engine: GameStateMachine, TileStateMachine, MatchSystem, TileOcclusion, BoardAutoFitSystem, LevelValidator, SolvabilitySystem, DifficultySystem, BoosterEngine.',
      'Layer 3 - Application Services: AudioService (Event Bus), TestFramework, Analytics Service Abstraction.',
      'Layer 4 - Presentation UI: HardenedTileGameEngine, Responsive Viewport Container, Developer Debug Console, Player UI HUD.',
    ],
  },
  {
    id: 'sec_d',
    code: 'D',
    title: 'Game State Machine Architecture',
    summary: 'Strict 13-state deterministic state machine preventing invalid state transitions and tap race conditions.',
    details: [
      'States Defined: BOOT, LOADING, MAIN_MENU, LEVEL_LOADING, LEVEL_READY, PLAYING, PAUSED, MATCHING, BOOSTER_ACTIVE, WIN, LOSE, REWARD, TRANSITION.',
      'Action Guards: canAcceptTileInput() returns true ONLY in PLAYING state. Input is locked in MATCHING and BOOSTER_ACTIVE states.',
      'Event Hooks: Transition callbacks trigger audio events, HUD updates, analytics tracking, and save state persistence.',
    ],
  },
  {
    id: 'sec_e',
    code: 'E',
    title: 'Tile State Machine Architecture',
    summary: '8-state lifecycle control for every tile entity.',
    details: [
      'Tile States: AVAILABLE, BLOCKED, SELECTED, MOVING, IN_TRAY, MATCHING, REMOVING, REMOVED.',
      'State Rules: A tile cannot be selected if state === BLOCKED. Occlusion engine automatically recalculates AVAILABLE vs BLOCKED status whenever board tiles change.',
    ],
  },
  {
    id: 'sec_f',
    code: 'F',
    title: 'Responsive Layout Architecture',
    summary: 'Anchor-based responsive layout accommodating safe area notches, dynamic islands, and screen ratios.',
    details: [
      'Top HUD: Fixed top anchor respecting safeAreaTop (notches/dynamic islands).',
      'Board Canvas: Centered fluid region auto-scaling based on available vertical/horizontal space.',
      'Tray & Boosters: Bottom-anchored region respecting safeAreaBottom (home indicators).',
    ],
  },
  {
    id: 'sec_g',
    code: 'G',
    title: 'Board Auto-Fit System',
    summary: 'Dynamic calculation engine computing tile size, board width/height, and layer offsets based on viewport dimensions.',
    details: [
      'Formula: Math.min(availableWidth / cols, availableHeight / rows), clamped between 38px and 68px.',
      'Scale Factor: Automatically scales text, icon drop shadows, and 3D layer offsets proportionally.',
      'Device Presets: Small Phone (320x568), iPhone Pro Notch (393x852), Large Phone (412x915), Tablet (820x1180).',
    ],
  },
  {
    id: 'sec_h',
    code: 'H',
    title: 'Safe Area System',
    summary: 'Mobile hardware cutout padding handling.',
    details: [
      'Top Notch / Dynamic Island: Inset padding applied to level header and coin counter.',
      'Bottom Home Bar: Inset margin applied below booster buttons to prevent accidental gesture triggers.',
      'Side Insets: Landscape / curved screen boundary padding.',
    ],
  },
  {
    id: 'sec_i',
    code: 'I',
    title: 'Tray Architecture',
    summary: 'Configurable tray engine supporting variable capacity, extra slots, and insertion sorting.',
    details: [
      'TrayConfiguration: Configurable capacity (default 7, expander boosters unlock slot 8 or 9).',
      'Adjacent Grouping: Newly tapped tiles automatically slide next to matching tile types in the tray for visual clarity.',
      'Overflow Guard: Triggers LOSE state only if tray reaches max capacity without any 3-tile match available.',
    ],
  },
  {
    id: 'sec_j',
    code: 'J',
    title: 'Match System',
    summary: 'Pure, decoupled match detection system.',
    details: [
      'Triple Match Check: Evaluates occurrence count per tile type in tray.',
      'Removal & Combo: Removes 3 matching tiles, increments combo multiplier, triggers pitch-escalated audio event.',
      'Score Event: Base points (150) * combo count.',
    ],
  },
  {
    id: 'sec_k',
    code: 'K',
    title: 'Level Data Architecture',
    summary: 'Data-driven LevelDefinition structure allowing offline/online level storage.',
    details: [
      'LevelDefinition Properties: id, worldId, worldName, name, difficulty, numericalDifficulty, trayCapacity, tiles[], objectives[], starRules, rewardConfig, seed.',
      '1,000+ Level Scalability: Generic generation engine combines deterministic seeding with handcrafted layer patterns.',
    ],
  },
  {
    id: 'sec_l',
    code: 'L',
    title: 'Level Validation System',
    summary: 'Automated level verifier testing tile count modulo 3, layer integrity, and type balance.',
    details: [
      'Modulo 3 Check: Ensures total tile count % 3 === 0.',
      'Type Balance: Ensures every distinct tile type count % 3 === 0.',
      'Layer Occlusion Check: Verifies no orphan tiles or impossible coordinates exist.',
    ],
  },
  {
    id: 'sec_m',
    code: 'M',
    title: 'Solvability System',
    summary: 'Greedy match-3 solver simulating level completion.',
    details: [
      'Simulation Algorithm: Simulates playing unblocked top tiles while tracking tray capacity.',
      'Deadlock Detection: Detects deadlocks or tray overflows before levels are published to players.',
      '100% Guaranteed Solvable Badge: Displayed only when simulation clears 100% of tiles.',
    ],
  },
  {
    id: 'sec_n',
    code: 'N',
    title: 'Difficulty System',
    summary: 'Mathematical difficulty rating model (0 to 100).',
    details: [
      'Factors: Tile Count (30%), Layer Depth (25%), Occlusion Ratio (25%), Tile Type Variety (20%), Tray Capacity Modifier.',
      'Labels: Easy (1-24), Normal (25-39), Medium (40-54), Hard (55-69), Very Hard (70-84), Expert (85-100).',
    ],
  },
  {
    id: 'sec_o',
    code: 'O',
    title: 'Booster Architecture',
    summary: 'Modular IBooster interface for extensible gameplay power-ups.',
    details: [
      'Interface: IBooster { id, config, canExecute(), execute() }',
      'Implementations: UndoBooster, ShuffleBooster, MagnetBooster, ExtraSlotBooster, FreezeBooster, HintBooster, AutoMatchBooster.',
    ],
  },
  {
    id: 'sec_p',
    code: 'P',
    title: 'Undo System Architecture',
    summary: 'Action history stack enabling atomic move reversals.',
    details: [
      'ActionRecord: Stores tile ID, original coordinates, layer index, tray insertion index, and timestamp.',
      'Execution: Pops last action record, removes tile from tray, restores tile to board with state AVAILABLE.',
    ],
  },
  {
    id: 'sec_q',
    code: 'Q',
    title: 'Shuffle System Architecture',
    summary: 'Board tile type shuffling with layout preservation.',
    details: [
      'Algorithm: Fisher-Yates shuffle on typeId pool of remaining board tiles.',
      'Integrity Guarantee: Total tile count and layer positions remain 100% unchanged.',
    ],
  },
  {
    id: 'sec_r',
    code: 'R',
    title: 'Magnet System Architecture',
    summary: 'Automatic match extraction booster.',
    details: [
      'Target Selection: Finds tile type with >= 3 occurrences across board and tray.',
      'Execution: Pulls up to 3 tiles from tray and board, instantly triggers match-3 score event (+300 bonus points).',
    ],
  },
  {
    id: 'sec_s',
    code: 'S',
    title: 'Score System',
    summary: 'Decoupled scoring engine with combo multipliers.',
    details: [
      'Formula: Base Match (150) * min(combo, 10) + Booster Bonuses.',
      'Star Calculation: Compares final score against LevelDefinition starRules thresholds.',
    ],
  },
  {
    id: 'sec_t',
    code: 'T',
    title: 'Reward System',
    summary: 'Dynamic post-level reward generator.',
    details: [
      'Payouts: Coins, Gems, Stars, EXP Points, and Booster Grants based on difficulty multiplier and star rating.',
    ],
  },
  {
    id: 'sec_u',
    code: 'U',
    title: 'Economy Abstraction',
    summary: 'IEconomyService interface decoupling UI from currency transactions.',
    details: [
      'Methods: addCoins(), deductCoins(), addGems(), deductGems(), consumeBooster().',
      'Implementation: LocalEconomyService backed by LocalSaveService with future Cloud Economy sync compatibility.',
    ],
  },
  {
    id: 'sec_v',
    code: 'V',
    title: 'Audio Architecture',
    summary: 'Typed audio event bus powered by Web Audio API synthesizer.',
    details: [
      'Events: TileSelected, TileBlocked, TileMatched, BoosterActivated, LevelWon, LevelLost.',
      'Synthesizer: Pure Web Audio API oscillator generation without external asset load latency.',
    ],
  },
  {
    id: 'sec_w',
    code: 'W',
    title: 'UI Architecture',
    summary: 'Clean separation between Player-facing UI and Developer Debug UI.',
    details: [
      'Player UI: Clean HUD, auto-fitted tile stack, tray dock, booster buttons, victory/defeat modal frames.',
      'Developer Debug UI: Toggleable drawer with state inspector, viewport simulator, test runner, and instant level solver.',
    ],
  },
  {
    id: 'sec_x',
    code: 'X',
    title: 'Canvas Architecture',
    summary: '6-tier Canvas sorting order for Unity UI / React layer hierarchy.',
    details: [
      'Layer 0: World Background & Ambient Particle Canvas.',
      'Layer 1: 3D Tile Stack Board Canvas.',
      'Layer 2: Tray Dock & Booster HUD Canvas.',
      'Layer 3: Modal & Popup Overlay Canvas.',
      'Layer 4: Floating Toast & Particle Animation Canvas.',
      'Layer 5: Developer Debug Overlay Canvas.',
    ],
  },
  {
    id: 'sec_y',
    code: 'Y',
    title: 'Input Architecture',
    summary: 'Input abstraction separating pointer events from gameplay logic.',
    details: [
      'Pointer Event Pipeline: Touch/Mouse PointerDown -> Input System -> State Guard Check -> TileOcclusion Check -> Board Selection Dispatch.',
      'Anti-Double-Tap: Debounces rapid double-taps during MATCHING and BOOSTER_ACTIVE states.',
    ],
  },
  {
    id: 'sec_z',
    code: 'Z',
    title: 'Save Architecture',
    summary: 'LocalSaveService abstraction with state recovery.',
    details: [
      'Persistence: Stores current level, stars, coins, gems, booster counts, and audio settings in localStorage.',
      'Recovery: Safe JSON parsing fallback to default save data upon corrupted local data.',
    ],
  },
  {
    id: 'sec_aa',
    code: 'AA',
    title: 'Backend Compatibility Architecture',
    summary: 'Service interface contract design for seamless future Cloud sync.',
    details: [
      'Contracts: IPlayerProgressService, IEconomyService, ISaveService, ILeaderboardService.',
      'Cloud Migration: Swapping LocalEconomyService with CloudEconomyService requires zero changes to core gameplay UI.',
    ],
  },
  {
    id: 'sec_ab',
    code: 'AB',
    title: 'Error Recovery Architecture',
    summary: 'Graceful fallback mechanisms for runtime edge cases.',
    details: [
      'Corrupted Level Data: Automatic fallback to generated Level 1 default.',
      'Stuck Animation Guard: 1.5-second timeout auto-resets GameStateMachine back to PLAYING state if animation callback hangs.',
    ],
  },
  {
    id: 'sec_ac',
    code: 'AC',
    title: 'App Lifecycle Handling',
    summary: 'Handling app focus, blur, pause, backgrounding, and resume events.',
    details: [
      'Focus Lost / Background: Automatically transitions game state to PAUSED, persists active save data.',
      'Focus Regained / Resume: Restores audio context and presents Pause Modal allowing player to resume.',
    ],
  },
  {
    id: 'sec_ad',
    code: 'AD',
    title: 'Performance Strategy',
    summary: 'Mobile optimization guidelines for smooth 60 FPS rendering.',
    details: [
      'Object Reuse & Pooling: Reuses tile container elements instead of mounting/unmounting.',
      'CSS Transform Hardware Acceleration: Uses translate3d() and GPU layer composition for 3D tile transforms.',
      'Web Audio Efficiency: Single shared AudioContext instance created lazily on first user tap.',
    ],
  },
  {
    id: 'sec_ae',
    code: 'AE',
    title: 'Debug Mode & Inspection System',
    summary: 'Developer tooling isolated from player-facing UI.',
    details: [
      'Debug Features: Viewport aspect ratio simulator, Solvability Verifier, State Machine Inspector, Instant Win/Lose triggers, Infinite Boosters toggle.',
    ],
  },
  {
    id: 'sec_af',
    code: 'AF',
    title: 'Development vs Production Build Strategy',
    summary: 'Build flag environment controls.',
    details: [
      'Environment Flag: process.env.NODE_ENV === \'development\' or process.env.VITE_DEBUG_MODE === \'true\'.',
      'Production Stripping: Strips Debug Console overlay and test level framework from production bundle.',
    ],
  },
  {
    id: 'sec_ag',
    code: 'AG',
    title: 'Test Level Framework',
    summary: 'Automated unit and scenario test runner.',
    details: [
      'Scenarios Tested: Triple Match, Tray Overflow, Modulo 3, Solvability Simulation, FSM State Guards, Responsive Auto-Fit, Difficulty Calculator, Undo/Shuffle/Magnet Boosters.',
    ],
  },
  {
    id: 'sec_ah',
    code: 'AH',
    title: 'Automated Testing Strategy',
    summary: 'Continuous integration test suite execution.',
    details: [
      'Execution: Runs 10 automated engine unit tests in under 15ms total duration.',
      'Output: Detailed pass/fail report with execution duration metrics.',
    ],
  },
  {
    id: 'sec_ai',
    code: 'AI',
    title: 'Content Scalability Strategy',
    summary: 'Scaling content to 5,000+ levels, 500+ tile themes, and 50+ worlds.',
    details: [
      'Level Generation Engine: Combines procedural seeded layout algorithms with JSON level definitions.',
      'Tile Theme Registry: Asset lookup mapping type IDs to gradient colors, SVG icons, or 3D textures dynamically.',
    ],
  },
  {
    id: 'sec_aj',
    code: 'AJ',
    title: 'Future Feature Extension Points',
    summary: 'Clean architectural interfaces for Phase 05+ integrations.',
    details: [
      'Extension Points: LiveOps Event Engine, 50-Player Tournament Matchmaker, Guild Mission Engine, In-App Purchase Gateway, Cloud Save Sync.',
    ],
  },
  {
    id: 'sec_ak',
    code: 'AK',
    title: 'Final Technical Risk Report',
    summary: 'Risk analysis and mitigation strategies.',
    details: [
      'Risk 1 - Rapid Tapping Race Condition: Mitigated by locking input during MATCHING state in GameStateMachine.',
      'Risk 2 - Viewport Clipping on Ultra-Narrow Phones: Mitigated by BoardAutoFitSystem dynamic tile scaling down to 38px.',
      'Risk 3 - Unsolvable Level Deadlock: Mitigated by LevelValidator greedy solver pass during level creation.',
    ],
  },
  {
    id: 'sec_al',
    code: 'AL',
    title: 'Implementation Order & Milestones',
    summary: 'Step-by-step roadmap for Phase 04.5 hardening execution.',
    details: [
      'Step 1: Core Types & State Enums (/src/types/gameEngine.ts).',
      'Step 2: Game & Tile State Machines (/src/engine/GameStateMachine.ts, TileOcclusion.ts).',
      'Step 3: Decoupled Match Engine & Board Auto-Fit (/src/engine/MatchSystem.ts, BoardAutoFitSystem.ts).',
      'Step 4: Level Validator & Solvability Simulator (/src/engine/LevelValidator.ts).',
      'Step 5: Modular Booster Engine & Economy Abstraction (/src/engine/BoosterEngine.ts, EconomyService.ts).',
      'Step 6: Automated Test Suite & Hardened Game Engine UI (/src/components/HardenedTileGameEngine.tsx).',
      'Step 7: Interactive Architecture Viewer & Verification (/src/components/PrototypeHardeningView.tsx).',
    ],
  },
];
