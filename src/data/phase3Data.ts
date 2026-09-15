export interface GameStateSpec {
  name: string;
  entryCondition: string;
  availableActions: string;
  exitConditions: string;
  dataRequired: string;
  uiRequired: string;
  saveRequirements: string;
  networkRequirements: string;
}

export interface BoosterSpec {
  id: string;
  name: string;
  description: string;
  icon: string;
  costCoins: number;
  effect: string;
  target: string;
  activationMethod: string;
  cooldownOrLimit: string;
}

export interface MilestoneSpec {
  id: number;
  title: string;
  features: string[];
  dependencies: string[];
  deliverables: string[];
  testing: string[];
  exitCriteria: string[];
}

export interface RiskSpec {
  id: string;
  risk: string;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: 'Low' | 'Medium' | 'High';
  prevention: string;
  backupPlan: string;
}

export interface ApiContract {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  endpoint: string;
  description: string;
  requestBody?: string;
  responseBody: string;
  authRequired: boolean;
}

export const GDD_VISION = {
  gameTitle: "Tile Oasis: Sanctuary Match",
  tagline: "Restore Sacred Havens, Three Tiles at a Time",
  genre: "3D Stacked Triple-Tile Matching & Habitat Restoration Engine",
  targetAudience: "Casual-to-Midcore Puzzle Enthusiasts (Ages 18–55), fans of Tile Master, Zen Match, Triple Match 3D, and Triple Tile.",
  coreConcept: "A rich, tactile 3D tile-matching puzzle where players uncover layers of serene tiles to restore forgotten ancient sanctuaries, unlock rare tile collections, and bond with guildmates across global events.",
  playerExperience: "Relaxing visual and acoustic feedback combined with escalating strategic decision-making in deep layer stacks. Tactile tile clicks, serene aquatic ambiance, and high-satisfaction combo clearing.",
  keyDifferentiators: [
    "Dynamic 3D Occlusion Stack with realistic depth and shadow sorting",
    "Sanctuary Restoration Meta-game with interactive 3D dioramas",
    "100% Solvability Guarantee via BFS Backtracking Level Solver",
    "Real-time Guild & Co-Op Club Chests with live chat and life sharing",
    "Algorithmic Difficulty Scaling based on Bottleneck Ratios, non-predatory monetization"
  ]
};

export const CORE_GAMEPLAY_LOOP_STEPS = [
  { step: 1, title: "Boot & Level Launch", description: "Player opens game, views Map, selects Level 42. Server validates energy/hearts and loads level configuration." },
  { step: 2, title: "Board Generation & Rendering", description: "3D tile stack rendered with depth occlusion, shadow sorting, and physics-based hitboxes." },
  { step: 3, title: "Player Tile Selection", description: "Player taps an unblocked (top-most) tile. Tile animates along a smooth bezier curve into the 7-slot tray." },
  { step: 4, title: "Tray Sorting & Insertion", description: "Tray automatically sorts tiles by Type ID, shifting adjacent tiles right to insert the new tile next to identical matches." },
  { step: 5, title: "Match Detection", description: "System checks for 3 identical tiles in tray. If found, triggers match chime, particle burst, and clears all 3 tiles." },
  { step: 6, title: "Board Occlusion Update", description: "Clearing tiles unblocks underlying board tiles, updating raycast hitboxes and revealing hidden items." },
  { step: 7, title: "Objective Check", description: "If all board tiles or objective tiles are cleared: Victory state triggered! Stars calculated based on time/moves." },
  { step: 8, title: "Failure / Tray Full State", description: "If tray reaches 7 tiles with no match-3: Game pauses in 'Tray Full' state. Player offered Undo, Magnet, or Revival Extra Slot." },
  { step: 9, title: "Progression & Rewards", description: "On win: Player earns Stars, Oasis Water Drops, Coins, and Chest progress. Advances on World Map." }
];

export const META_LOOP_STEPS = [
  { title: "Play Tile Levels", detail: "Solve 3D stack puzzles to earn Oasis Water Drops and Stars." },
  { title: "Restore Sanctuaries", detail: "Use Water Drops to clean, build, and decorate ancient Oasis sanctuaries (Lotus Temple, Coral Haven, Sky Shrine)." },
  { title: "Collect Rare Tile Sets", detail: "Open Star Chests and Chapter Crates to unlock animated, seasonal tile designs (Celestial Flora, Mythic Gems, Ancient Artifacts)." },
  { title: "Join Clubs & Social Events", detail: "Compete in Weekly Guild Cup, exchange free lives, and chat with team members." },
  { title: "Compete in Tournaments", detail: "Enter 50-player bracket tournaments (Oasis Blitz) for leaderboard glory and exclusive cosmetics." }
];

export const GAME_STATES_SPEC: GameStateSpec[] = [
  {
    name: "BootState",
    entryCondition: "Application launch",
    availableActions: "None (Auto-proceed)",
    exitConditions: "Assets & config initialized",
    dataRequired: "Local cache, Version manifest",
    uiRequired: "Splash Screen, Progress Bar",
    saveRequirements: "None",
    networkRequirements: "Version check ping"
  },
  {
    name: "LoadingState",
    entryCondition: "Transition between major states",
    availableActions: "Cancel (if network request)",
    exitConditions: "Target state assets loaded",
    dataRequired: "Bundle addresses",
    uiRequired: "Animated Spinner, Tips",
    saveRequirements: "None",
    networkRequirements: "Addressables download"
  },
  {
    name: "MainMenuState",
    entryCondition: "Boot complete or exit gameplay",
    availableActions: "Navigate Map, Open Shop, Open Club, Play Level",
    exitConditions: "User taps action button",
    dataRequired: "Player Profile, Currencies, Level Progress",
    uiRequired: "Header Bar, Navigation Dock, World View",
    saveRequirements: "Local cache update",
    networkRequirements: "Sync player profile"
  },
  {
    name: "LevelPrepState",
    entryCondition: "Tap level node on Map",
    availableActions: "Equip Pre-game Boosters, Start Level, Close",
    exitConditions: "Tap Play or Close",
    dataRequired: "Level Config ID, Inventory Boosters",
    uiRequired: "Level Modal, Target Objectives, Booster Toggles",
    saveRequirements: "Deduct Heart / Energy",
    networkRequirements: "Level Auth Token"
  },
  {
    name: "GameplayState",
    entryCondition: "Level Prep complete",
    availableActions: "Select Tile, Use In-Game Booster, Pause",
    exitConditions: "Level Win, Level Lose, Exit to Menu",
    dataRequired: "Level Tile Stack, Tray State, Objective Tracker",
    uiRequired: "3D Game Canvas, Tray Dock, Booster Bar, Score/Moves HUD",
    saveRequirements: "Local move history for Undo",
    networkRequirements: "Offline capable (sync on finish)"
  },
  {
    name: "PausedState",
    entryCondition: "Tap Pause button in Gameplay",
    availableActions: "Resume, Sound Toggle, Quit Level",
    exitConditions: "Resume or Confirm Quit",
    dataRequired: "Frozen gameplay snapshot",
    uiRequired: "Pause Modal, Volume Sliders, Quit Warning",
    saveRequirements: "None",
    networkRequirements: "None"
  },
  {
    name: "WinState",
    entryCondition: "All level objectives satisfied",
    availableActions: "Claim Rewards, Continue to Map, Replay",
    exitConditions: "Tap Continue",
    dataRequired: "Score, Time taken, Stars earned, Loot drops",
    uiRequired: "3-Star Victory Banner, Reward Chest Opening, Claim Button",
    saveRequirements: "Save level completion, update currency",
    networkRequirements: "Post score & level result to server"
  },
  {
    name: "LoseState",
    entryCondition: "Tray full & no recovery boosters used",
    availableActions: "Buy Revival Extra Slot, Use Magnet, Retry, Exit",
    exitConditions: "Revive or Confirm Defeat",
    dataRequired: "Current level failure reason, revival cost",
    uiRequired: "Defeat Modal, Revival Countdown timer, Shop shortcut",
    saveRequirements: "Save failed attempt counter",
    networkRequirements: "Log level failed event"
  },
  {
    name: "ClubState",
    entryCondition: "Tap Club tab from Main Menu",
    availableActions: "Chat, Request Lives, Donate Lives, View Guild Chest",
    exitConditions: "Navigate away",
    dataRequired: "Club Info, Member List, Chat History",
    uiRequired: "Guild Roster, Live Chat Feed, Chest Progress Bar",
    saveRequirements: "Cache chat message IDs",
    networkRequirements: "WebSocket connection to Chat/Club Service"
  },
  {
    name: "TournamentState",
    entryCondition: "Tap Tournament icon during active event",
    availableActions: "View Bracket, Claim Rank Chest, Play Tournament Level",
    exitConditions: "Navigate away",
    dataRequired: "Leaderboard rankings, Time remaining",
    uiRequired: "50-Player Leaderboard Table, Tier Badges, Prize Showcase",
    saveRequirements: "None",
    networkRequirements: "Fetch active leaderboard ranking"
  }
];

export const BOOSTERS_CATALOG: BoosterSpec[] = [
  {
    id: "booster_undo",
    name: "Undo Move",
    description: "Reverses the last selected tile from the tray back to its exact board layer position.",
    icon: "RotateCcw",
    costCoins: 100,
    effect: "Pop last tray item, restore to original stack coordinate, unblock tray slot.",
    target: "Last tapped tile",
    activationMethod: "Tap in-game bottom bar",
    cooldownOrLimit: "Instant, unlimited usage per level"
  },
  {
    id: "booster_shuffle",
    name: "Board Shuffle",
    description: "Randomly reshuffles all currently unblocked tiles on the board into guaranteed matchable positions.",
    icon: "Shuffle",
    costCoins: 150,
    effect: "Recalculate positions of remaining active tiles, maintaining layer counts.",
    target: "All active board tiles",
    activationMethod: "Tap in-game bottom bar",
    cooldownOrLimit: "Instant, re-verifies solvability"
  },
  {
    id: "booster_magnet",
    name: "Tile Magnet",
    description: "Instantly pulls 3 matching tiles (or completes a pair in tray) directly into match removal.",
    icon: "Zap",
    costCoins: 250,
    effect: "Search tray for highest count tile type, pull remaining required tiles from board, clear immediately.",
    target: "Board + Tray match",
    activationMethod: "Tap in-game bottom bar",
    cooldownOrLimit: "Instant"
  },
  {
    id: "booster_extra_slot",
    name: "Extra Tray Slot",
    description: "Permanently adds an 8th slot to the tray for the remainder of the current level.",
    icon: "PlusCircle",
    costCoins: 200,
    effect: "Expands tray capacity from 7 to 8 slots with animated ui expansion.",
    target: "Tray dock UI",
    activationMethod: "Tap during gameplay or on Tray Full modal",
    cooldownOrLimit: "Once per level max"
  },
  {
    id: "booster_freeze",
    name: "Time Freeze",
    description: "Freezes the level timer for 30 seconds on timed levels.",
    icon: "Snowflake",
    costCoins: 120,
    effect: "Pause countdown clock, apply frosty UI effect on HUD.",
    target: "Level Timer Manager",
    activationMethod: "Tap during gameplay",
    cooldownOrLimit: "30s duration"
  }
];

export const DATABASE_ENTITIES = [
  {
    tableName: "players",
    description: "Master account profile and global player metadata",
    fields: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Unique player ID" },
      { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE, NULLABLE", description: "Linked user email" },
      { name: "display_name", type: "VARCHAR(64)", constraints: "NOT NULL", description: "Public username" },
      { name: "avatar_id", type: "VARCHAR(32)", constraints: "DEFAULT 'default_1'", description: "Equipped avatar" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Account registration date" },
      { name: "last_login", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Last session timestamp" }
    ],
    indexes: ["CREATE INDEX idx_players_email ON players(email);"]
  },
  {
    tableName: "player_progress",
    description: "Level progression, stars, and sanctuary world state",
    fields: [
      { name: "player_id", type: "UUID", constraints: "PRIMARY KEY, FK(players.id)", description: "Owner player ID" },
      { name: "current_level", type: "INTEGER", constraints: "DEFAULT 1", description: "Highest unlocked level" },
      { name: "total_stars", type: "INTEGER", constraints: "DEFAULT 0", description: "Total accumulated stars" },
      { name: "sanctuary_id", type: "INTEGER", constraints: "DEFAULT 1", description: "Current active oasis world" },
      { name: "restoration_progress", type: "JSONB", constraints: "DEFAULT '{}'", description: "Unlocked sanctuary decors" },
      { name: "updated_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Last sync timestamp" }
    ],
    indexes: ["CREATE INDEX idx_progress_stars ON player_progress(total_stars DESC);"]
  },
  {
    tableName: "wallets",
    description: "Authoritative virtual currency balances",
    fields: [
      { name: "player_id", type: "UUID", constraints: "PRIMARY KEY, FK(players.id)", description: "Owner player ID" },
      { name: "coins", type: "BIGINT", constraints: "CHECK (coins >= 0)", description: "Soft currency balance" },
      { name: "gems", type: "INTEGER", constraints: "CHECK (gems >= 0)", description: "Hard currency balance" },
      { name: "water_drops", type: "INTEGER", constraints: "CHECK (water_drops >= 0)", description: "Sanctuary restoration drops" },
      { name: "lives", type: "INTEGER", constraints: "CHECK (lives BETWEEN 0 AND 5)", description: "Energy/lives count" },
      { name: "lives_updated_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Next life regen calculation point" }
    ],
    indexes: []
  },
  {
    tableName: "inventories",
    description: "Item quantities for boosters, collectibles, and cosmetic tile skins",
    fields: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Inventory record ID" },
      { name: "player_id", type: "UUID", constraints: "FK(players.id)", description: "Owner player ID" },
      { name: "item_id", type: "VARCHAR(64)", constraints: "NOT NULL", description: "Booster or Skin Item ID" },
      { name: "quantity", type: "INTEGER", constraints: "CHECK (quantity >= 0)", description: "Stock count" },
      { name: "item_type", type: "VARCHAR(32)", constraints: "NOT NULL", description: "'BOOSTER', 'TILE_SKIN', 'AVATAR_FRAME'" }
    ],
    indexes: ["CREATE UNIQUE INDEX idx_player_item ON inventories(player_id, item_id);"]
  },
  {
    tableName: "clubs",
    description: "Guilds/Clubs for social life sharing and club tournaments",
    fields: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Club ID" },
      { name: "name", type: "VARCHAR(64)", constraints: "UNIQUE, NOT NULL", description: "Club name" },
      { name: "description", type: "TEXT", constraints: "NULLABLE", description: "Club bio" },
      { name: "badge_icon", type: "VARCHAR(32)", constraints: "DEFAULT 'shield_1'", description: "Club icon" },
      { name: "min_level", type: "INTEGER", constraints: "DEFAULT 10", description: "Entry level requirement" },
      { name: "is_private", type: "BOOLEAN", constraints: "DEFAULT FALSE", description: "Invite only toggle" },
      { name: "member_count", type: "INTEGER", constraints: "DEFAULT 1", description: "Current members (max 30)" }
    ],
    indexes: ["CREATE INDEX idx_clubs_members ON clubs(member_count DESC);"]
  }
];

export const DEVELOPMENT_MILESTONES: MilestoneSpec[] = [
  {
    id: 1,
    title: "Milestone 1: Core Engine Prototype",
    features: [
      "3D Layer Occlusion Raycasting Engine",
      "7-Slot Tray Dock with Bezier Motion Curves",
      "Match-3 Evaluation & Instant Clears",
      "Basic Undo & Shuffle Boosters"
    ],
    dependencies: ["Unity 2022.3 LTS", "Addressables Setup"],
    deliverables: ["Playable WebGL & Android APK prototype with 5 test levels"],
    testing: ["Raycast hit precision tests", "Match-3 state machine unit tests"],
    exitCriteria: ["Zero tray desync bugs in 1,000 automated random tap simulations"]
  },
  {
    id: 2,
    title: "Milestone 2: Solvability & Level Generation Architecture",
    features: [
      "BFS Backtracking Solvability Verifier",
      "Automated Difficulty Scoring Calculator",
      "Level Config JSON Serializer & Editor Pipeline"
    ],
    dependencies: ["Milestone 1 Core Engine"],
    deliverables: ["100 Solvable Levels across 2 Worlds with automated validation logs"],
    testing: ["100% Solvability check on all 100 levels", "Difficulty score curve alignment"],
    exitCriteria: ["Generator produces 100% solvable level layouts in under 50ms execution time"]
  },
  {
    id: 3,
    title: "Milestone 3: Sanctuary Meta-Game & Restoration UI",
    features: [
      "Sanctuary World Map Navigation",
      "3D Island Restoration Decorator Engine",
      "Water Drops Currency & Star Chest Rewards"
    ],
    dependencies: ["Milestone 2 Level Pipeline"],
    deliverables: ["Fully decorated Sanctuary World 1 with 12 upgradeable nodes"],
    testing: ["Decor state save/restore tests", "UI animation performance on low-end mobile"],
    exitCriteria: ["Smooth 60 FPS transition between Map and Gameplay on target mobile devices"]
  },
  {
    id: 4,
    title: "Milestone 4: Backend Infrastructure & Cloud Sync",
    features: [
      "Node.js Express + PostgreSQL + Redis Microservices",
      "OAuth & Guest Account Linking Engine",
      "Server-Authoritative Save & Conflict Resolution"
    ],
    dependencies: ["Database Schemas", "Auth API"],
    deliverables: ["Backend API service deployed on Cloud Run with Swagger documentation"],
    testing: ["Concurrent user load tests (1,000 RPS)", "Offline-to-Online sync edge case tests"],
    exitCriteria: ["Zero data corruption on force-close during network latency simulation"]
  },
  {
    id: 5,
    title: "Milestone 5: Social Systems & Clubs Architecture",
    features: [
      "Guild/Club Creation & Search",
      "Real-time WebSocket Chat & Life Requests",
      "Weekly Guild Chest Co-Op Event"
    ],
    dependencies: ["Milestone 4 Backend"],
    deliverables: ["Live Club hub with working chat, life sending, and member management"],
    testing: ["WebSocket reconnection stress tests", "Profanity filter verification"],
    exitCriteria: ["Sub-100ms chat delivery latency across 30 concurrent club members"]
  },
  {
    id: 6,
    title: "Milestone 6: Monetization & LiveOps Framework",
    features: [
      "App Store & Google Play IAP Integration",
      "Server-Side Receipt Validation API",
      "Dynamic Shop, Battle Pass, and Starter Pack Bundles"
    ],
    dependencies: ["Milestone 4 Backend Services"],
    deliverables: ["Fully functional Shop with sandbox receipt validation and dynamic offers"],
    testing: ["IAP transaction security audit", "Receipt replay attack mitigation test"],
    exitCriteria: ["100% verified receipt processing with zero unfulfilled purchases in staging"]
  }
];

export const TECHNICAL_RISKS: RiskSpec[] = [
  {
    id: "TR-01",
    risk: "Unsolvable Board Stack Generation",
    impact: "Critical",
    probability: "Medium",
    prevention: "Enforce mandatory BFS solver verification during level compilation before publishing to production CDN.",
    backupPlan: "Runtime fallback solver: If player gets stuck with 0 valid moves, auto-trigger a non-destructive board reshuffle."
  },
  {
    id: "TR-02",
    risk: "Tray Desynchronization During Rapid Taps",
    impact: "High",
    probability: "Medium",
    prevention: "Implement an input queue buffer that locks tray evaluation until current tile animation reaches target position.",
    backupPlan: "Hard snap tray tiles to logical array indices on state mismatch detection."
  },
  {
    id: "TR-03",
    risk: "Cloud Save Merge Conflicts (Multi-device play)",
    impact: "High",
    probability: "Low",
    prevention: "Use vector clocks + timestamped transaction logs with strict server-authoritative highest-level progression rules.",
    backupPlan: "Prompt user with visual conflict resolution dialog comparing local vs cloud progress."
  },
  {
    id: "TR-04",
    risk: "WebSocket Connection Drops in Low-Connectivity Mobile",
    impact: "Medium",
    probability: "High",
    prevention: "Implement heartbeats every 15s with exponential backoff reconnect and optimistic client chat rendering.",
    backupPlan: "Fallback to HTTP long-polling for chat and live event updates."
  },
  {
    id: "TR-05",
    risk: "IAP Receipt Fraud / Replay Attacks",
    impact: "Critical",
    probability: "Medium",
    prevention: "Mandatory server-to-server validation with Apple App Store Server API v2 and Google Play Developer API.",
    backupPlan: "Store transaction hashes in Redis bloom filter to block duplicate token claims instantly."
  }
];

export const API_CONTRACTS: ApiContract[] = [
  {
    method: "POST",
    endpoint: "/api/v1/auth/guest-login",
    description: "Authenticates or registers a guest device ID and returns JWT bearer tokens.",
    requestBody: "{\n  \"deviceId\": \"a1b2c3d4-5678\",\n  \"platform\": \"android\",\n  \"appVersion\": \"1.0.0\"\n}",
    responseBody: "{\n  \"status\": \"success\",\n  \"accessToken\": \"eyJhbGci...\",\n  \"refreshToken\": \"d98f12...\",\n  \"playerId\": \"usr_99812\"\n}",
    authRequired: false
  },
  {
    method: "GET",
    endpoint: "/api/v1/player/profile",
    description: "Fetches complete player state including progress, currencies, and equipped cosmetics.",
    responseBody: "{\n  \"playerId\": \"usr_99812\",\n  \"displayName\": \"ZenMaster\",\n  \"level\": 42,\n  \"stars\": 126,\n  \"wallet\": { \"coins\": 2450, \"gems\": 85, \"waterDrops\": 320, \"lives\": 5 }\n}",
    authRequired: true
  },
  {
    method: "POST",
    endpoint: "/api/v1/game/level-complete",
    description: "Submits verified level score and claims calculated rewards.",
    requestBody: "{\n  \"levelId\": 42,\n  \"timeSpentSeconds\": 78,\n  \"movesUsed\": 24,\n  \"boostersUsed\": [\"booster_undo\"],\n  \"validationHash\": \"sha256_hmac_proof\"\n}",
    responseBody: "{\n  \"success\": true,\n  \"starsEarned\": 3,\n  \"rewards\": [{ \"type\": \"COIN\", \"amount\": 150 }, { \"type\": \"WATER_DROP\", \"amount\": 25 }],\n  \"nextLevelUnlocked\": 43\n}",
    authRequired: true
  },
  {
    method: "POST",
    endpoint: "/api/v1/club/create",
    description: "Creates a new player Guild/Club with custom branding and rules.",
    requestBody: "{\n  \"name\": \"Oasis Explorers\",\n  \"description\": \"Daily active players welcome!\",\n  \"badgeIcon\": \"shield_gold\",\n  \"minLevel\": 15,\n  \"isPrivate\": false\n}",
    responseBody: "{\n  \"clubId\": \"clb_7712\",\n  \"name\": \"Oasis Explorers\",\n  \"memberCount\": 1\n}",
    authRequired: true
  }
];
