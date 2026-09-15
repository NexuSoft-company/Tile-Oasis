import { FeatureItem, ScreenItem, SystemItem, DatabaseEntity, UnityFolderNode } from '../types/game';

export const SYSTEM_LIST: SystemItem[] = [
  { id: 1, name: "Game Core System", description: "State machine managing game loops, pause, victory, defeat, and restart.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 2, name: "Tile System", description: "Tile entity definition, states (blocked/unblocked), skin renderers, and pooling.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 3, name: "Board System", description: "3D layered coordinate grid, tile overlap calculation, and layer occlusion physics.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 4, name: "Match System", description: "Detects 3 matching tiles in tray, triggers vanish animations, and handles score multipliers.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 5, name: "Tray System", description: "Capacity slots (default 7), insertion sorting, slide animations, and overflow detection.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 6, name: "Level System", description: "Data-driven level loader, JSON configuration parser, star rating evaluation, and objectives.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 7, name: "Level Generation System", description: "Algorithmic layout generator producing guaranteed-solvable 3D tile stacks.", scopeCategory: "Core Engine", priority: "P1" },
  { id: 8, name: "Difficulty System", description: "Dynamic difficulty tuning based on tile set diversity, layer occlusion, and player fail rate.", scopeCategory: "Core Engine", priority: "P1" },
  { id: 9, name: "Booster System", description: "In-game power-ups: Undo last move, Shuffle board, Magnet match 3, and Extra tray slot.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 10, name: "Objective System", description: "Clear specific tile patterns, time-attack challenges, or star thresholds per level.", scopeCategory: "Core Engine", priority: "P1" },
  { id: 11, name: "Progression System", description: "Main saga map progression, world unlocking, star milestones, and chapter rewards.", scopeCategory: "Meta & Progression", priority: "P0" },
  { id: 12, name: "World/Map System", description: "Visual map view with custom biome art, node paths, level badges, and chest checkpoints.", scopeCategory: "Meta & Progression", priority: "P0" },
  { id: 13, name: "Tile Collection System", description: "Customizable tile themes (Fruits, Mahjong, Nature, Travel) unlocked via progression/chests.", scopeCategory: "Meta & Progression", priority: "P1" },
  { id: 14, name: "Player Profile System", description: "Avatar selection, player stats (levels cleared, stars, win streak), and trophy showcase.", scopeCategory: "Meta & Progression", priority: "P1" },
  { id: 15, name: "Currency System", description: "Soft currency (Coins), Premium currency (Gems), and Lives/Energy stamina system.", scopeCategory: "Meta & Progression", priority: "P0" },
  { id: 16, name: "Reward System", description: "Chest opening animations, claim mechanics, duplicate tile conversion, and double reward ads.", scopeCategory: "Meta & Progression", priority: "P0" },
  { id: 17, name: "Shop System", description: "Catalog of coin packs, gem bundles, booster kits, unlimited energy, and customized skin sets.", scopeCategory: "Economy & Shop" as any, priority: "P0" },
  { id: 18, name: "Daily Reward System", description: "7-day calendar streak login bonuses, mystery boxes, and milestone big rewards.", scopeCategory: "Meta & Progression", priority: "P0" },
  { id: 19, name: "Event System", description: "Time-limited events: Treasure Hunt, Win Streak Race, Tile Collector, and Seasonal Passes.", scopeCategory: "Social & LiveOps", priority: "P1" },
  { id: 20, name: "Seasonal System", description: "Monthly Battle Pass with Free/Premium tiers, exclusive tile skins, and dynamic themes.", scopeCategory: "Social & LiveOps", priority: "P2" },
  { id: 21, name: "Club System", description: "Guild/Club creation, search, joining, help request (send/receive lives), and club level perks.", scopeCategory: "Social & LiveOps", priority: "P1" },
  { id: 22, name: "Chat System", description: "Real-time socket chat for club members with bad-words filter, reporting, and animated emojis.", scopeCategory: "Social & LiveOps", priority: "P1" },
  { id: 23, name: "Tournament System", description: "Bracketed 100-player weekly competitions, star leaderboards, and tiered prize pools.", scopeCategory: "Social & LiveOps", priority: "P1" },
  { id: 24, name: "Leaderboard System", description: "Global, Regional, Club, and Friends leaderboards updated in real time via server.", scopeCategory: "Social & LiveOps", priority: "P1" },
  { id: 25, name: "Advertisement System", description: "Rewarded video ads (continue level, extra booster, 2x coins) & optional interstitial ads.", scopeCategory: "Social & LiveOps", priority: "P0" },
  { id: 26, name: "In-App Purchase System", description: "Google Play / Apple App Store receipt validation, bundle purchasing, and anti-fraud.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 27, name: "Account System", description: "Guest login, Apple Sign-In, Google Play Games, Facebook login, and Auth token refresh.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 28, name: "Cloud Save System", description: "Conflict resolution, atomic progress sync between device local storage and cloud database.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 29, name: "Backend System", description: "Microservices for Auth, Economy, Social, LiveOps, and Validation built with Node.js/C#.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 30, name: "Database System", description: "PostgreSQL for relational persistent storage, Redis for fast caching and leaderboards.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 31, name: "Notification System", description: "Local push notifications (Energy full, Daily claim) and Remote FCM notifications.", scopeCategory: "Platform & Infrastructure", priority: "P1" },
  { id: 32, name: "Analytics System", description: "Telemetry tracking for funnel conversion, level retention, fail spots, and monetization.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 33, name: "Anti-Cheat System", description: "Server-side move sequence verification, currency transaction signing, and speedhack checks.", scopeCategory: "Platform & Infrastructure", priority: "P1" },
  { id: 34, name: "Admin Panel", description: "Web console for live operations, player lookup, inventory adjustments, and ban triggers.", scopeCategory: "Platform & Infrastructure", priority: "P1" },
  { id: 35, name: "Content Management System", description: "JSON level publishing pipeline, remote asset bundles, and tile skin catalogue editor.", scopeCategory: "Platform & Infrastructure", priority: "P1" },
  { id: 36, name: "Remote Configuration System", description: "A/B testing, economy pricing toggles, booster costs, and dynamic feature flag controls.", scopeCategory: "Platform & Infrastructure", priority: "P1" },
  { id: 37, name: "Audio System", description: "Spatial SFX, pitch-increasing combo match sounds, background ambient music, and haptics.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 38, name: "Animation System", description: "Juicy tweening (DOTween), tile fly-to-tray arcs, match burst particle effects, and UI motion.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 39, name: "UI/UX System", description: "Responsive mobile UI layouts, safe area handling, modal queues, and dark/light palettes.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 40, name: "Tutorial System", description: "Interactive step-by-step onboarding, highlighted tile gestures, and booster guides.", scopeCategory: "Core Engine", priority: "P0" },
  { id: 41, name: "Localization System", description: "Multi-language support (18 languages) with RTL layout handling and font asset management.", scopeCategory: "Platform & Infrastructure", priority: "P1" },
  { id: 42, name: "Accessibility System", description: "High contrast tile mode, colorblind friendly iconography, and haptic feedback options.", scopeCategory: "Platform & Infrastructure", priority: "P2" },
  { id: 43, name: "Performance System", description: "Object pooling for tiles/particles, texture atlas management, memory management under 200MB.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 44, name: "Save/Recovery System", description: "Atomic local SQLite save with fallback corruption recovery and cloud sync trigger.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 45, name: "Customer Support System", description: "In-app ticket creation, diagnostic logs uploader, and automated FAQ knowledgebase.", scopeCategory: "Platform & Infrastructure", priority: "P2" },
  { id: 46, name: "Privacy/Security System", description: "GDPR/CCPA consent banner, data deletion API, AES-256 data encryption at rest.", scopeCategory: "Platform & Infrastructure", priority: "P0" },
  { id: 47, name: "QA/Testing System", description: "Automated bot puzzle solver for solvability validation, regression smoke test suite.", scopeCategory: "Platform & Infrastructure", priority: "P1" },
  { id: 48, name: "Live Operations System", description: "Flash sales engine, dynamic daily events scheduler, and player segmentation targeting.", scopeCategory: "Social & LiveOps", priority: "P1" },
  { id: 49, name: "Google Play / App Store Release System", description: "CI/CD automated build pipelines (Fastlane), app store submission metadata, and obb assets.", scopeCategory: "Platform & Infrastructure", priority: "P1" }
];

export const SCREEN_INVENTORY: ScreenItem[] = [
  { id: "S01", name: "Splash / Loading Screen", category: "Platform & Infrastructure" as any, description: "Displays game logo, asset download progress, remote config sync, and auth initialization.", keyComponents: ["Brand Logo", "Loading Bar", "Version Text", "Status Label"], priority: "P0" },
  { id: "S02", name: "Main Home / Saga World Map", category: "Meta & Progression", description: "Interactive map with level nodes, world biomes, chest milestones, top bar currency counters, and bottom navigation tabs.", keyComponents: ["Saga Path", "World Selector", "Currency Bar", "Navigation Dock", "Daily Claim Banner"], priority: "P0" },
  { id: "S03", name: "Level Start / Pre-Game Modal", category: "Core Gameplay", description: "Displays level objectives, target stars, top score, and selectable pre-game boosters.", keyComponents: ["Level Title", "Objectives List", "Equipped Boosters", "Play Button (1 Energy)"], priority: "P0" },
  { id: "S04", name: "Core Puzzle Gameplay Canvas", category: "Core Gameplay", description: "Primary gameplay screen containing 3D layered tile stack, 7-capacity bottom tray, booster action bar, pause button, and progress stats.", keyComponents: ["Tile Stack Canvas", "Tray Dock", "In-Game Boosters (Undo, Shuffle, Magnet)", "Pause Button", "Star Progress Bar"], priority: "P0" },
  { id: "S05", name: "Level Complete / Victory Screen", category: "Core Gameplay", description: "Celebratory popup showing stars earned, level score, coin rewards, and 2x reward ad button.", keyComponents: ["Star Animation", "Coin Reward Counter", "2x Ad Button", "Next Level Button"], priority: "P0" },
  { id: "S06", name: "Level Defeat / Out of Tray Slots Modal", category: "Core Gameplay", description: "Failed level popup offering Revive via Gems or Rewarded Ad to clear 3 tray tiles, or Quit level.", keyComponents: ["Tray Full Warning", "Revive with Gems", "Watch Ad Revive", "Give Up Button"], priority: "P0" },
  { id: "S07", name: "In-Game Store / Shop Screen", category: "Economy & Shop", description: "Catalog for Coin packs, Gem packs, Unlimited Energy timers, Special Starter Bundles, and Tile Theme cosmetics.", keyComponents: ["Featured Banner", "Coin Packs Grid", "Gem Bundles", "Tile Skin Showroom", "IAP Buy Buttons"], priority: "P0" },
  { id: "S08", name: "Tile Collection / Customization Studio", category: "Meta & Progression", description: "3D gallery showcasing unlocked tile sets (Fruits, Vegetables, Symbols, Nature) with preview board and equip toggles.", keyComponents: ["Tile Skin Cards", "Unlock Criteria", "3D Preview Stage", "Equip Button"], priority: "P1" },
  { id: "S09", name: "Clubs / Guild Main Hub", category: "Social & Clubs", description: "Club search, member roster, club chat feed, life request button, and club tournament standings.", keyComponents: ["Club Banner", "Live Chat Window", "Request Energy Button", "Member List", "Club Level Badges"], priority: "P1" },
  { id: "S10", name: "Global & Event Leaderboards Screen", category: "Social & Clubs", description: "Tabbed rankings showing Global Top 100, Regional rankings, Friends, and active Tournament standings.", keyComponents: ["Rankings Table", "Player Avatar Rows", "Current User Rank Bar", "Reward Tiers Info"], priority: "P1" },
  { id: "S11", name: "Events & Seasonal Pass Hub", category: "Social & LiveOps" as any, description: "Active time-limited events, progression track for Season Pass (Free vs Premium), and claimable rewards.", keyComponents: ["Event Countdown Banner", "Pass Tier Milestone Track", "Claim Reward Nodes", "Activate Pass Button"], priority: "P1" },
  { id: "S12", name: "Player Profile & Achievements Screen", category: "Meta & Progression", description: "Displays player stats, avatar customization, unlocked achievements, and connected account settings.", keyComponents: ["Avatar & Frame Picker", "Level & Win Streak Stats", "Achievement Badges", "Cloud Account Link Status"], priority: "P1" },
  { id: "S13", name: "Settings & Help Center", category: "Admin & System", description: "Audio volume sliders, language picker, graphics quality, privacy/GDPR toggles, support ticketing, and user ID info.", keyComponents: ["SFX/Music Sliders", "Language Dropdown", "Account Linking", "Support Contact", "Terms & Privacy"], priority: "P0" }
];

export const DETAILED_FEATURE_INVENTORY: FeatureItem[] = [
  {
    id: "F001",
    system: "Game Core System",
    screen: "Core Puzzle Gameplay Canvas",
    featureName: "3D Layered Tile Selection & Tray Movement",
    purpose: "Allow the player to tap an accessible unblocked tile on the board, animating its smooth movement into the tray.",
    playerAction: "Tap an unblocked tile on the puzzle canvas.",
    expectedResult: "The tapped tile lifts with sound/haptics, animates along a smooth bezier curve into an empty slot in the bottom tray.",
    gameLogic: "Verify tile layer occlusion (is top-most tile). If blocked, play error shake. If free, detach from stack, slide to tray, update occlusion map for underneath tiles.",
    requiredUI: "3D Tile renderers, Bezier trajectory path overlay, highlight outline on tap.",
    requiredAssets: "Tile mesh/textures, Tap SFX, Fly-to-tray animation curve.",
    requiredData: "Tile ID, Position (X,Y,Layer), Occlusion List, Tray Index.",
    backendRequirement: "None for local calculation; move sequence recorded for post-level validation.",
    databaseRequirement: "None (client-side state).",
    monetizationRequirement: "None directly.",
    analyticsEvents: ["tile_tapped", "move_executed"],
    securityConsiderations: "Validate move timestamp to prevent illegal speed-taps.",
    dependencies: ["Board System", "Tray System", "Audio System", "Animation System"],
    priority: "P0"
  },
  {
    id: "F002",
    system: "Match System",
    screen: "Core Puzzle Gameplay Canvas",
    featureName: "Triple-Tile Automatic Matching & Vanish",
    purpose: "Detect when 3 tiles of the exact same type occupy the tray, instantly clearing them and awarding score/combo.",
    playerAction: "Move a 3rd identical tile into the tray.",
    expectedResult: "The 3 matching tiles glow, shrink/burst with particle particles and pitch-escalating combo SFX, and collapse the tray slots inward.",
    gameLogic: "On tray update, group tiles by type. If count(type) >= 3, extract 3 tiles, trigger match animation, play combo audio, shift remaining tray tiles left, check win condition.",
    requiredUI: "Match sparkle particles, score popups (+100 Combo x2), tray collapse animation.",
    requiredAssets: "Match Particle Prefab, Match SFX, Combo Voiceover SFX.",
    requiredData: "Tray tile array, match type ID, current combo multiplier.",
    backendRequirement: "Validated at level submission.",
    databaseRequirement: "None.",
    monetizationRequirement: "None.",
    analyticsEvents: ["triple_match_cleared", "combo_achieved"],
    securityConsiderations: "Verify match count logic against legitimate tile pool.",
    dependencies: ["Tray System", "Audio System", "Animation System"],
    priority: "P0"
  },
  {
    id: "F003",
    system: "Tray System",
    screen: "Core Puzzle Gameplay Canvas",
    featureName: "Tray Capacity Overflow & Game Over Check",
    purpose: "Monitor tray capacity (7 slots). If full without 3 matches available, trigger defeat condition.",
    playerAction: "Fill the 7th tray slot without forming a 3-tile match.",
    expectedResult: "Tray slots shake red, defeat banner triggers, Defeat/Revive modal opens.",
    gameLogic: "After tile insertion and match processing, if tray.length === trayCapacity (7) AND no match formed, set GameState = Defeat.",
    requiredUI: "Red flashing tray border, defeat popup dialog, revive options.",
    requiredAssets: "Defeat SFX, Full Tray animation, Red warning overlay.",
    requiredData: "Tray capacity, current tile count.",
    backendRequirement: "Record level fail analytics event with remaining board tiles.",
    databaseRequirement: "Update player fail statistics in user progress table.",
    monetizationRequirement: "Prompts Revive purchase (Gems or Rewarded Ad).",
    analyticsEvents: ["level_failed", "tray_overflow"],
    securityConsiderations: "Ensure tray size cannot be manipulated via local memory hacks.",
    dependencies: ["Core Puzzle Gameplay Canvas", "Booster System"],
    priority: "P0"
  },
  {
    id: "F004",
    system: "Booster System",
    screen: "Core Puzzle Gameplay Canvas",
    featureName: "Undo Last Move Booster",
    purpose: "Revert the most recent tile placed in the tray back to its original stack location and layer.",
    playerAction: "Tap the Undo booster icon in the bottom gameplay bar.",
    expectedResult: "The last inserted tile flies out of the tray back to its exact original board coordinates and layer.",
    gameLogic: "Pop last move from moveHistory stack. Re-insert tile into board model, recalculate tile occlusion, remove tile from tray, deduct 1 Undo count or 50 Coins.",
    requiredUI: "Undo booster button with count badge, reverse fly animation trajectory.",
    requiredAssets: "Whoosh reverse SFX, Undo particle trail.",
    requiredData: "Move history stack (Tile ID, Original X/Y/Layer, Original Occlusion State), Booster inventory.",
    backendRequirement: "Deduct booster / coin inventory on server if online.",
    databaseRequirement: "Sync updated booster inventory.",
    monetizationRequirement: "Coin sink / IAP booster packs.",
    analyticsEvents: ["booster_used_undo"],
    securityConsiderations: "Server verifies booster balance before applying in online levels.",
    dependencies: ["Board System", "Tray System", "Currency System"],
    priority: "P0"
  },
  {
    id: "F005",
    system: "Booster System",
    screen: "Core Puzzle Gameplay Canvas",
    featureName: "Board Shuffle Booster",
    purpose: "Randomly reorder all remaining unblocked and blocked tiles on the board to unlock stuck situations.",
    playerAction: "Tap the Shuffle booster icon.",
    expectedResult: "All remaining board tiles swirl in a magic spiral animation and land in newly randomized tile positions.",
    gameLogic: "Collect all un-cleared board tiles. Re-shuffle tile types across existing coordinate positions while maintaining layer solvability.",
    requiredUI: "Spiral magic particle effect, tile shuffle animation.",
    requiredAssets: "Shuffle card-fan SFX, magic swirl visual effect.",
    requiredData: "Board tile coordinate array, tile type list.",
    backendRequirement: "None.",
    databaseRequirement: "Sync booster count.",
    monetizationRequirement: "Coin sink / IAP bundle purchase.",
    analyticsEvents: ["booster_used_shuffle"],
    securityConsiderations: "Guarantee shuffle output contains valid move combinations.",
    dependencies: ["Board System", "Level Generation System"],
    priority: "P0"
  },
  {
    id: "F006",
    system: "Booster System",
    screen: "Core Puzzle Gameplay Canvas",
    featureName: "Magnet Auto-Match Booster",
    purpose: "Instantly find 3 matching tiles on the board or in tray and clear them automatically.",
    playerAction: "Tap the Magnet booster icon.",
    expectedResult: "3 matching tiles are magnetically drawn out from the board directly into the match zone and cleared instantly.",
    gameLogic: "Scan board for tile type with highest count. Extract 3 tiles of that type (prioritizing tiles in tray then top layers), play magnet beam, clear match.",
    requiredUI: "Electrical magnet beam animation, match burst particle.",
    requiredAssets: "Magnet zap SFX, electrical beam texture.",
    requiredData: "Board tile pool, tray contents.",
    backendRequirement: "Deduct Magnet inventory.",
    databaseRequirement: "Sync inventory.",
    monetizationRequirement: "High-value booster IAP item.",
    analyticsEvents: ["booster_used_magnet"],
    securityConsiderations: "Verify availability of at least 3 tiles of any type.",
    dependencies: ["Board System", "Match System"],
    priority: "P0"
  },
  {
    id: "F007",
    system: "Level Generation System",
    screen: "Admin / Offline Content Generator",
    featureName: "Algorithmic Solvable 3D Tile Stack Generator",
    purpose: "Automatically generate thousands of balanced, 100% solvable 3D tile stacks with customizable difficulty parameters.",
    playerAction: "Initiated by content builder or dynamic level pipeline.",
    expectedResult: "Generates JSON level structure containing total tiles (multiple of 3), layer occlusion topology, and tile set distribution.",
    gameLogic: "Build level backward from solved state. Place triplets in layers ensuring every layer has valid top-down removal paths.",
    requiredUI: "Level Editor GUI / Generator Console view.",
    requiredAssets: "3D Stack preset templates (Pyramid, Turtle, Fortress, Ring).",
    requiredData: "Target Tile Count, Tile Set Palette Size, Overlap Ratio, Layer Depth.",
    backendRequirement: "Level validation pipeline runs automated solver bot against generated JSON.",
    databaseRequirement: "Stores level JSON configurations in `levels` database table.",
    monetizationRequirement: "Powers infinite replayability and live event levels.",
    analyticsEvents: ["level_generated", "level_validated"],
    securityConsiderations: "Ensure generator seed matches deterministic server validator.",
    dependencies: ["Level System", "QA/Testing System"],
    priority: "P1"
  },
  {
    id: "F008",
    system: "Club System",
    screen: "Clubs / Guild Main Hub",
    featureName: "Club Search, Join, and Real-Time Chat",
    purpose: "Enable social interaction, guild bonding, life sharing, and group tournament participation.",
    playerAction: "Search for club by name, join club, send messages in club chat window.",
    expectedResult: "Player is added to club roster, gains access to club chat stream and free energy request button.",
    gameLogic: "Join club request validated via backend. Socket room connection initialized. Chat messages filtered for profanity and pushed via WebSocket.",
    requiredUI: "Club directory list, live chat stream with bubble items, energy request badge.",
    requiredAssets: "Club crest icons, Chat bubble UI, Heart gift icon.",
    requiredData: "Club ID, Member List, Chat Log, Life Request Timestamps.",
    backendRequirement: "Club Microservice with WebSockets (Socket.io or SignalR), Redis chat buffer.",
    databaseRequirement: "PostgreSQL tables: `clubs`, `club_members`, `club_chat_messages`.",
    monetizationRequirement: "Increases 7-day retention and social monetization conversion.",
    analyticsEvents: ["club_joined", "club_message_sent", "club_life_requested"],
    securityConsiderations: "Profanity filter engine, rate-limit chat messages (1 per sec) to prevent spam.",
    dependencies: ["Backend System", "Database System", "Chat System"],
    priority: "P1"
  },
  {
    id: "F009",
    system: "Tournament System",
    screen: "Global & Event Leaderboards Screen",
    featureName: "100-Player Weekly Star Tournament",
    purpose: "Group 100 players of similar skill into a weekly leaderboard competition based on stars earned in puzzle levels.",
    playerAction: "Automatically enrolled upon completing Level 10. Clear levels to earn stars and climb rank.",
    expectedResult: "Live ranking updates showing player position among 100 competitors with real-time score updates and end-of-week reward claim.",
    gameLogic: "Server groups players into tournament leaderboard instances. Every completed level adds earned stars to Redis sorted set (`zadd`). On expiration, payout rewards.",
    requiredUI: "Leaderboard leaderboard list, podium animation for top 3, reward chest indicators.",
    requiredAssets: "Golden trophy icons, Crown badges, Podium graphics.",
    requiredData: "Tournament Instance ID, Player Scores, Time Remaining, Reward Tier Map.",
    backendRequirement: "Tournament Microservice cron job for bucket matchmaking and prize distribution.",
    databaseRequirement: "PostgreSQL `tournaments` & `tournament_participants` tables; Redis leaderboard cache.",
    monetizationRequirement: "Drives competitive urge to buy boosters/energy to gain stars.",
    analyticsEvents: ["tournament_entered", "tournament_rank_up", "tournament_reward_claimed"],
    securityConsiderations: "Server-side verification of star gain from verified level complete events.",
    dependencies: ["Leaderboard System", "Backend System", "Reward System"],
    priority: "P1"
  },
  {
    id: "F010",
    system: "In-App Purchase System",
    screen: "In-Game Store / Shop Screen",
    featureName: "Secure IAP Purchase & Server Receipt Validation",
    purpose: "Allow players to buy Coin packs, Gem bundles, and Starter kits safely with anti-fraud receipt checks.",
    playerAction: "Tap purchase button on a shop pack ($1.99 - $99.99).",
    expectedResult: "Native Google Play / Apple App Store billing modal opens. Upon confirmation, items are granted instantly with celebratory animation.",
    gameLogic: "Client receives purchase token from native store API, sends token to backend `/api/v1/purchase/verify`. Server verifies token with Apple/Google servers, grants items atomically in DB.",
    requiredUI: "Shop item cards, purchase processing spinner, purchase success dialog.",
    requiredAssets: "Coin bundle illustrations, Gem chest graphics, Sparkling shine particle.",
    requiredData: "Product ID, Store SKU, Purchase Token, Transaction ID, Item Grants.",
    backendRequirement: "IAP Verification endpoint communicating with Google Play Developer API & Apple App Store Server API.",
    databaseRequirement: "PostgreSQL `purchases` table logging full transaction history and receipts.",
    monetizationRequirement: "Core revenue generation system.",
    analyticsEvents: ["iap_initiated", "iap_completed", "iap_failed"],
    securityConsiderations: "Never grant items based solely on client-side confirmation. Require cryptographically validated server receipt verification.",
    dependencies: ["Backend System", "Database System", "Currency System"],
    priority: "P0"
  }
];

export const DATABASE_ENTITIES: DatabaseEntity[] = [
  {
    tableName: "users",
    description: "Core account and authentication data for players.",
    fields: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Unique player account identifier" },
      { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE, NULLABLE", description: "Email for auth" },
      { name: "guest_id", type: "VARCHAR(128)", constraints: "UNIQUE, NOT NULL", description: "Device installation ID for guest accounts" },
      { name: "display_name", type: "VARCHAR(64)", constraints: "NOT NULL", description: "In-game nickname" },
      { name: "avatar_id", type: "VARCHAR(32)", constraints: "DEFAULT 'avatar_01'", description: "Selected profile avatar" },
      { name: "coins", type: "BIGINT", constraints: "DEFAULT 500", description: "Soft currency balance" },
      { name: "gems", type: "INTEGER", constraints: "DEFAULT 50", description: "Premium currency balance" },
      { name: "energy", type: "INTEGER", constraints: "DEFAULT 5", description: "Current stamina count (Max 5)" },
      { name: "energy_refill_at", type: "TIMESTAMPTZ", constraints: "NULLABLE", description: "Timestamp for next energy tick" },
      { name: "current_level", type: "INTEGER", constraints: "DEFAULT 1", description: "Furthest completed saga level" },
      { name: "total_stars", type: "INTEGER", constraints: "DEFAULT 0", description: "Cumulative stars earned" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Account creation timestamp" }
    ],
    indexes: ["idx_users_guest_id", "idx_users_current_level", "idx_users_total_stars"]
  },
  {
    tableName: "levels",
    description: "Data-driven definitions for game levels.",
    fields: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY", description: "Level number" },
      { name: "world_id", type: "INTEGER", constraints: "NOT NULL", description: "Associated world chapter" },
      { name: "difficulty", type: "VARCHAR(16)", constraints: "NOT NULL", description: "Easy, Medium, Hard, Expert" },
      { name: "tray_capacity", type: "INTEGER", constraints: "DEFAULT 7", description: "Tray slots available" },
      { name: "config_json", type: "JSONB", constraints: "NOT NULL", description: "Complete 3D tile coordinates and stack structure" },
      { name: "version", type: "INTEGER", constraints: "DEFAULT 1", description: "Level revision number" },
      { name: "is_active", type: "BOOLEAN", constraints: "DEFAULT TRUE", description: "Remote publishing toggle" }
    ],
    indexes: ["idx_levels_world_id"]
  },
  {
    tableName: "player_progress",
    description: "Per-level performance and star tracking per user.",
    fields: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Progress record ID" },
      { name: "user_id", type: "UUID", constraints: "REFERENCES users(id)", description: "Player reference" },
      { name: "level_id", type: "INTEGER", constraints: "NOT NULL", description: "Level completed" },
      { name: "stars_earned", type: "INTEGER", constraints: "CHECK (stars_earned BETWEEN 1 AND 3)", description: "Stars achieved" },
      { name: "high_score", type: "INTEGER", constraints: "NOT NULL", description: "Best score on level" },
      { name: "moves_count", type: "INTEGER", constraints: "NOT NULL", description: "Total moves taken" },
      { name: "duration_seconds", type: "INTEGER", constraints: "NOT NULL", description: "Time to complete level" },
      { name: "completed_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Completion timestamp" }
    ],
    indexes: ["idx_progress_user_level", "idx_progress_user_stars"]
  },
  {
    tableName: "clubs",
    description: "Social guilds/clubs created by players.",
    fields: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Club ID" },
      { name: "name", type: "VARCHAR(32)", constraints: "UNIQUE, NOT NULL", description: "Club name" },
      { name: "description", type: "TEXT", constraints: "DEFAULT ''", description: "Club manifesto" },
      { name: "badge_id", type: "VARCHAR(32)", constraints: "NOT NULL", description: "Club emblem ID" },
      { name: "leader_id", type: "UUID", constraints: "REFERENCES users(id)", description: "Guild leader ID" },
      { name: "min_level_req", type: "INTEGER", constraints: "DEFAULT 1", description: "Minimum level required to join" },
      { name: "club_type", type: "VARCHAR(16)", constraints: "DEFAULT 'Open'", description: "Open vs Request-Only vs Private" },
      { name: "member_count", type: "INTEGER", constraints: "DEFAULT 1", description: "Current member tally" },
      { name: "total_stars", type: "INTEGER", constraints: "DEFAULT 0", description: "Combined stars of all members" }
    ],
    indexes: ["idx_clubs_name", "idx_clubs_total_stars"]
  },
  {
    tableName: "purchases",
    description: "Audit table for IAP receipts and financial validation.",
    fields: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Purchase record ID" },
      { name: "user_id", type: "UUID", constraints: "REFERENCES users(id)", description: "Buyer user ID" },
      { name: "store_type", type: "VARCHAR(16)", constraints: "NOT NULL", description: "google_play or apple_appstore" },
      { name: "product_id", type: "VARCHAR(128)", constraints: "NOT NULL", description: "IAP product SKU" },
      { name: "purchase_token", type: "TEXT", constraints: "NOT NULL", description: "Store receipt validation token" },
      { name: "price_usd", type: "NUMERIC(10,2)", constraints: "NOT NULL", description: "USD price value" },
      { name: "status", type: "VARCHAR(16)", constraints: "DEFAULT 'COMPLETED'", description: "PENDING, COMPLETED, REFUNDED" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Timestamp" }
    ],
    indexes: ["idx_purchases_user_id", "idx_purchases_token"]
  }
];

export const UNITY_PROJECT_STRUCTURE: UnityFolderNode = {
  name: "Assets",
  type: "folder",
  children: [
    {
      name: "_Project",
      type: "folder",
      description: "Root directory for custom project assets, keeping third-party packages isolated.",
      children: [
        {
          name: "Scripts",
          type: "folder",
          description: "All C# game scripts organized clean by system domain.",
          children: [
            {
              name: "Core",
              type: "folder",
              description: "Core puzzle loop mechanics.",
              children: [
                { name: "GameManager.cs", type: "file", description: "Central state machine (Init, Playing, Paused, Win, Loss)." },
                { name: "BoardController.cs", type: "file", description: "3D tile stack manager, layer occlusion, coordinate mapping." },
                { name: "TileView.cs", type: "file", description: "Monobehaviour for tile presentation, input handling, shadow depth." },
                { name: "TrayController.cs", type: "file", description: "Tray slot management, sorting, insertion slide curves." },
                { name: "MatchProcessor.cs", type: "file", description: "Triple match detection, cascade collapse, combo calculator." },
                { name: "LevelLoader.cs", type: "file", description: "Parses Level JSON configs and instantiates pooled tile views." }
              ]
            },
            {
              name: "Boosters",
              type: "folder",
              description: "In-game booster execution logic.",
              children: [
                { name: "BoosterBase.cs", type: "file", description: "Abstract class for booster mechanics." },
                { name: "UndoBooster.cs", type: "file", description: "Move stack popping and tile trajectory restoration." },
                { name: "ShuffleBooster.cs", type: "file", description: "Randomized re-placement of remaining tiles." },
                { name: "MagnetBooster.cs", type: "file", description: "Automated 3-tile match extraction logic." }
              ]
            },
            {
              name: "Services",
              type: "folder",
              description: "Singletons & Service Locators for global infrastructure.",
              children: [
                { name: "AudioService.cs", type: "file", description: "AudioClip pooling, pitch stepping, BGM crossfading." },
                { name: "SaveService.cs", type: "file", description: "AES-encrypted local SQLite save & cloud sync trigger." },
                { name: "NetworkService.cs", type: "file", description: "HTTP Client & WebSocket manager with jwt auth headers." },
                { name: "AnalyticsService.cs", type: "file", description: "Event batcher for Firebase & custom server telemetry." }
              ]
            },
            {
              name: "UI",
              type: "folder",
              description: "View controllers for screens and dialog modals.",
              children: [
                { name: "SagaMapView.cs", type: "file", description: "World map scroll controller, node rendering." },
                { name: "ShopView.cs", type: "file", description: "Store catalog grid & native IAP trigger." },
                { name: "ClubChatView.cs", type: "file", description: "WebSocket chat stream UI & message sending." }
              ]
            }
          ]
        },
        {
          name: "Prefabs",
          type: "folder",
          description: "Reusable Unity prefabs.",
          children: [
            { name: "TilePrefab.prefab", type: "file", description: "Base 3D tile entity with shadow sprite, renderers, collider." },
            { name: "TraySlot.prefab", type: "file", description: "Tray slot background frame." },
            { name: "Particle_MatchBurst.prefab", type: "file", description: "Juicy burst sparkle effect." }
          ]
        },
        {
          name: "ScriptableObjects",
          type: "folder",
          description: "Data assets for configuration without code recompilation.",
          children: [
            { name: "TileThemeCatalog.asset", type: "file", description: "Definitions for unlocked tile graphic sets." },
            { name: "EconomyConfig.asset", type: "file", description: "Booster costs, coin rewards, energy timers." }
          ]
        }
      ]
    }
  ]
};

export const BACKEND_ARCHITECTURE_SUMMARY = {
  architectureStyle: "Microservices Architecture with API Gateway (Node.js/Express + C# .NET Core)",
  gateways: ["Nginx / Cloud Run Load Balancer with Rate Limiting & SSL Termination"],
  services: [
    { name: "Auth & User Service", description: "Manages OAuth tokens, guest account generation, Apple/Google Sign-In, and user profile metadata." },
    { name: "Level & Content Service", description: "Delivers level JSON configurations, dynamic level difficulty balancing, and remote config flags." },
    { name: "Economy & IAP Service", description: "Validates Google/Apple purchase receipts, manages virtual currency transactions atomically, prevents coin exploits." },
    { name: "Social & Club Service", description: "Handles club creation, member rosters, energy gifting, and WebSocket real-time chat rooms." },
    { name: "Tournament & Leaderboard Service", description: "Manages 100-player weekly tournament matchmaking buckets and high-performance Redis sorted sets (`ZADD`/`ZREVRANGE`)." },
    { name: "Anti-Cheat & Validation Service", description: "Replays client move logs to verify level completion validity before granting rewards." },
    { name: "LiveOps & Remote Config Service", description: "Pushes dynamic events, seasonal battle pass schedules, and segmented flash sale offers." }
  ],
  databases: [
    { type: "PostgreSQL 16", purpose: "Persistent relational storage for users, levels, progress, clubs, tournaments, purchases, and audit logs." },
    { type: "Redis Cluster 7.0", purpose: "High-speed caching for user sessions, active WebSocket chat rooms, and real-time leaderboards." }
  ]
};

export const ROADMAP_PHASES = [
  {
    phase: "Phase 01",
    title: "Project Discovery & Architecture Baseline",
    status: "CURRENT",
    description: "Complete feature matrix, technical discovery, system inventories, data schemas, Unity folder structure, and playable proof-of-concept prototype engine.",
    duration: "Week 1 - 2"
  },
  {
    phase: "Phase 02",
    title: "Game Core & Physics Framework",
    status: "PLANNED",
    description: "Full Unity tile stack rendering, 3D layer occlusion math, smooth bezier tray animations, match-3 logic, and combo audio synthesis.",
    duration: "Week 3 - 5"
  },
  {
    phase: "Phase 03",
    title: "Level Generation & Level Editor Pipeline",
    status: "PLANNED",
    description: "Algorithmic 3D stack generator, level solver bot for automated solvability testing, JSON serialization format, and 100 starter level layouts.",
    duration: "Week 6 - 8"
  },
  {
    phase: "Phase 04",
    title: "Booster System & In-Game Utilities",
    status: "PLANNED",
    description: "Undo, Shuffle, Magnet, and Slot Expansion boosters with particle VFX, sound effects, and inventory deduction framework.",
    duration: "Week 9 - 10"
  },
  {
    phase: "Phase 05",
    title: "Saga Map, Progression & Tile Collections",
    status: "PLANNED",
    description: "Interactive saga world map with biome stages, level start modals, star ratings, and customizable 3D tile themes (Fruits, Mahjong, Nature).",
    duration: "Week 11 - 13"
  },
  {
    phase: "Phase 06",
    title: "Economy, Currency & Shop System",
    status: "PLANNED",
    description: "Coins, Gems, Energy stamina timers, 7-day daily login calendar, in-game store catalog, and double-reward ads.",
    duration: "Week 14 - 16"
  },
  {
    phase: "Phase 07",
    title: "Backend Services & Cloud Infrastructure",
    status: "PLANNED",
    description: "Node.js / Express microservices, PostgreSQL database schemas, Redis cache layer, Auth tokens, and Cloud Save sync.",
    duration: "Week 17 - 20"
  },
  {
    phase: "Phase 08",
    title: "Social, Clubs, Chat & Tournaments",
    status: "PLANNED",
    description: "Club creation, energy sharing, WebSocket real-time club chat, 100-player weekly star tournaments, and global leaderboards.",
    duration: "Week 21 - 24"
  },
  {
    phase: "Phase 09",
    title: "LiveOps, Monetization & Anti-Cheat",
    status: "PLANNED",
    description: "Google Play / Apple Store receipt validation, Ads SDK integration, server-side move verification, admin console, and remote config.",
    duration: "Week 25 - 28"
  },
  {
    phase: "Phase 10",
    title: "QA, Mobile Optimization & Store Launch",
    status: "PLANNED",
    description: "Performance profiling (<200MB RAM, 60fps on budget Android devices), localization in 18 languages, closed beta testing, and store submission.",
    duration: "Week 29 - 32"
  }
];

export const SCOPE_COMPARISON = {
  mvp: [
    "Core Triple-Tile gameplay with 3D layer stack physics & occlusion",
    "7-capacity tray with automatic match-3 detection and collapse",
    "Essential Boosters: Undo, Shuffle, Magnet",
    "50 handcrafted levels across 2 World Biomes",
    "Saga Map progression with level node unlocking & stars",
    "Local Save system with JSON progress serialization",
    "Basic economy: Coins, Energy Stamina system",
    "Basic Shop UI with coin booster packs",
    "3 Tile cosmetic themes (Fruits, Symbols, Nature)",
    "Sound FX and Combo audio synthesis"
  ],
  fullProduction: [
    "1,000+ Algorithmic Solvable Levels across 15+ World Biomes",
    "Level Generation Pipeline & Automated Solver Bot for QA",
    "Club Guild system with real-time WebSocket Chat & Energy sharing",
    "100-Player Weekly Star Tournaments with Redis Leaderboards",
    "Seasonal Battle Pass with Free & Premium tracks",
    "Full Microservices Backend with PostgreSQL & Redis",
    "Cloud Sync with multi-device conflict resolution",
    "Google Play & Apple App Store Server Receipt Verification",
    "Rewarded Video Ads & Interstitial Ad waterfall integration",
    "Server-side Anti-cheat move sequence validator",
    "Admin Web Console for LiveOps, player support, and remote config",
    "Multi-language support (18 languages) & Accessibility modes"
  ]
};
