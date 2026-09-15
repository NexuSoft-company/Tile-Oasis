/**
 * Master Admin & Super Admin Dashboard Types
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'CONTENT_MANAGER';

export type AdminPermission =
  | 'manage_admins'
  | 'manage_users'
  | 'manage_content'
  | 'manage_banners'
  | 'manage_game_config'
  | 'manage_rewards'
  | 'manage_shop'
  | 'manage_ads'
  | 'manage_support'
  | 'manage_announcements'
  | 'view_analytics'
  | 'manage_roles'
  | 'view_audit_logs';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  status: 'ACTIVE' | 'DISABLED';
  createdAt: number;
  lastLogin: number;
  avatarUrl?: string;
}

export interface AdminSession {
  token: string;
  adminId: string;
  email: string;
  name?: string;
  role: AdminRole;
  permissions: AdminPermission[];
  loginTimestamp: number;
  expiresAt: number;
}

export interface ManagedUser {
  id: string;
  displayName: string;
  email?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'VIP';
  currentLevel: number;
  highestLevelUnlocked: number;
  starsTotal: number;
  coins: number;
  gems: number;
  boosterInventory: {
    undo: number;
    shuffle: number;
    magnet: number;
    extra_slot: number;
    freeze: number;
    hint: number;
    auto_match: number;
    [key: string]: number;
  };
  dailyRewardStreak: number;
  dailyRewardClaimedToday: boolean;
  missionsCompletedCount: number;
  lifetimePlaytimeMinutes: number;
  createdAt: number;
  lastActive: number;
  isRealPlayer?: boolean;
}

export type RewardType =
  | 'Coins'
  | 'Gems'
  | 'Energy'
  | 'Undo'
  | 'Shuffle'
  | 'Magnet'
  | 'Extra Slot'
  | 'Freeze'
  | 'Hint'
  | 'Auto-Match';

export interface RewardTransaction {
  id: string;
  adminId: string;
  adminEmail: string;
  userId: string;
  userName: string;
  rewardType: RewardType;
  amount: number;
  reason: string;
  timestamp: number;
  status: 'COMPLETED' | 'CANCELLED';
}

export interface UserMessageAnnouncement {
  id: string;
  targetUserId: string; // 'ALL' or specific userId
  title: string;
  message: string;
  optionalReward?: {
    type: RewardType;
    amount: number;
  };
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  senderAdminEmail: string;
  timestamp: number;
  read: boolean;
}

export type SupportCategory =
  | 'BUG_REPORT'
  | 'GAMEPLAY_HELP'
  | 'MISSING_ITEMS'
  | 'FEEDBACK'
  | 'ACCOUNT';

export type SupportTicketStatus = 'OPEN' | 'PENDING' | 'RESOLVED';

export interface SupportTicketMessage {
  id: string;
  sender: 'USER' | 'ADMIN';
  senderName: string;
  senderEmail?: string;
  message: string;
  timestamp: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  screenshotUrl?: string;
  levelNumber?: number;
  status: SupportTicketStatus;
  createdAt: number;
  updatedAt: number;
  internalNotes?: string[];
  conversation: SupportTicketMessage[];
}

export type ContentAssetType =
  | 'BANNERS'
  | 'PROMOTIONAL'
  | 'TILE_ARTWORK'
  | 'BACKGROUNDS'
  | 'ICONS'
  | 'EVENT_ARTWORK'
  | 'REWARD_ARTWORK'
  | 'WORLD_ARTWORK';

export interface ContentAssetItem {
  id: string;
  name: string;
  type: ContentAssetType;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export type BannerType =
  | 'HOME'
  | 'EVENT'
  | 'REWARD'
  | 'SHOP'
  | 'ANNOUNCEMENT'
  | 'SEASONAL'
  | 'CROSS_PROMO';

export interface CrossPromoApp {
  id: string;
  appName: string;
  packageName?: string;
  developerName?: string;
  category: string;
  iconUrl: string;
  bannerUrl: string;
  storeUrl: string;
  shortDescription: string;
  badgeText?: string; // e.g. "NEW", "HOT", "4.9 ★", "PLAY FREE"
  callToAction: string; // e.g. "Install Now", "Play on Play Store", "Get Free"
  status: 'ACTIVE' | 'INACTIVE';
  priority: number; // 1 (highest) to 10
  rating?: number; // e.g. 4.8
  clickCount?: number;
  rewardCoins?: number; // optional coins player gets for opening
  createdAt: number;
  updatedAt: number;
}

export interface PromotionalBanner {
  id: string;
  name: string;
  type: BannerType;
  imageUrl: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED';
  priority: number; // 1 (highest) to 10
  actionUrl?: string;
}

export interface EconomyConfigSetting {
  id: string;
  category: 'COINS' | 'GEMS' | 'BOOSTERS' | 'DAILY_REWARDS' | 'MISSIONS' | 'SHOP' | 'ADS';
  name: string;
  description: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
}

export interface ShopItemAdminConfig {
  id: string;
  name: string;
  category: 'COIN_PACK' | 'GEM_PACK' | 'BOOSTER_PACK' | 'FREE_REWARD' | 'DAILY_OFFER' | 'PROMO_OFFER';
  icon: string;
  rewardDescription: string;
  priceUsd: number;
  coinPrice?: number;
  gemPrice?: number;
  status: 'ACTIVE' | 'INACTIVE';
  startDate?: string;
  endDate?: string;
}

export type AuditLogCategory =
  | 'REWARD'
  | 'ECONOMY'
  | 'ROLE'
  | 'USER_STATUS'
  | 'USER_MOD'
  | 'CONTENT'
  | 'BANNER'
  | 'ADS'
  | 'ADMOB'
  | 'GAME_CONFIG'
  | 'AUTH'
  | 'SUPPORT';

export interface AdminAuditLogEntry {
  id: string;
  adminEmail: string;
  action: string;
  category: AuditLogCategory;
  targetId?: string;
  reason?: string;
  previousValue?: string;
  newValue?: string;
  timestamp: number;
}

export type AuditLogEntry = AdminAuditLogEntry;

export interface SystemAlertNotification {
  id: string;
  type: 'SUPPORT' | 'USER' | 'ECONOMY' | 'ADS' | 'SYSTEM' | 'CONTENT';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  targetTab?: string;
}
