/**
 * Content & Promotional Banner Management Service
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import {
  ContentAssetItem,
  ContentAssetType,
  PromotionalBanner,
  BannerType,
  CrossPromoApp,
} from '../../types/adminDashboard';
import { globalAdminService } from './AdminService';

const CONTENT_ASSETS_KEY = 'tile_oasis_content_assets_v1';
const BANNERS_KEY = 'tile_oasis_banners_v1';
const CROSS_PROMO_APPS_KEY = 'tile_oasis_cross_promo_apps_v1';

const INITIAL_CROSS_PROMO_APPS: CrossPromoApp[] = [
  {
    id: 'app_solitaire_sanctuary',
    appName: 'Solitaire Sanctuary: Zen Cards',
    packageName: 'com.tileoasis.solitairesanctuary',
    developerName: 'Oasis Game Studio',
    category: 'Card & Casual',
    iconUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.tileoasis.solitairesanctuary',
    shortDescription: 'Relaxing TriPeaks solitaire puzzles surrounded by soothing zen gardens and wildlife.',
    badgeText: '4.9 ★ RATED',
    callToAction: 'Get on Google Play',
    status: 'ACTIVE',
    priority: 1,
    rating: 4.9,
    clickCount: 142,
    rewardCoins: 250,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'app_word_oasis',
    appName: 'Word Oasis: Mindful Connect',
    packageName: 'com.tileoasis.wordoasis',
    developerName: 'Oasis Game Studio',
    category: 'Word Puzzle',
    iconUrl: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.tileoasis.wordoasis',
    shortDescription: 'Expand vocabulary with calming anagram crosswords and tranquil soundscapes.',
    badgeText: 'FEATURED',
    callToAction: 'Install Free',
    status: 'ACTIVE',
    priority: 2,
    rating: 4.8,
    clickCount: 89,
    rewardCoins: 200,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'app_block_oasis',
    appName: 'Block Oasis: Wood Drop Puzzle',
    packageName: 'com.tileoasis.blockoasis',
    developerName: 'Oasis Game Studio',
    category: 'Block Puzzle',
    iconUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.tileoasis.blockoasis',
    shortDescription: 'Classic wooden block blast puzzle with calming tactile effects and no time limits.',
    badgeText: 'POPULAR',
    callToAction: 'Play Now',
    status: 'ACTIVE',
    priority: 3,
    rating: 4.7,
    clickCount: 64,
    rewardCoins: 150,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

const INITIAL_CONTENT_ASSETS: ContentAssetItem[] = [
  {
    id: 'asset_tile_cherry_blossom',
    name: 'Cherry Blossom Bloom Tile',
    type: 'TILE_ARTWORK',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    tags: ['flower', 'world_1', 'triple_match'],
  },
  {
    id: 'asset_tile_golden_lotus',
    name: 'Sacred Golden Lotus Tile',
    type: 'TILE_ARTWORK',
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=400&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    tags: ['lotus', 'zen', 'rare'],
  },
  {
    id: 'asset_bg_bamboo_falls',
    name: 'Bamboo Falls Ambient Backdrop',
    type: 'BACKGROUNDS',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    tags: ['zen', 'forest', 'world_2'],
  },
  {
    id: 'asset_promo_summer_zen',
    name: 'Zen Sanctuary Festival Hero',
    type: 'PROMOTIONAL',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    tags: ['event', 'promo', 'hero'],
  },
  {
    id: 'asset_icon_magnet_booster',
    name: 'Emerald Magnet Booster Icon',
    type: 'ICONS',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    tags: ['booster', 'magnet', 'shop'],
  },
];

const INITIAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'ban_home_oasis_bloom',
    name: 'Oasis Bloom Festival Celebration',
    type: 'EVENT',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    title: 'Oasis Bloom Festival',
    description: 'Double Star rewards on all World 1 through 10 levels this weekend!',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    status: 'ACTIVE',
    priority: 1,
  },
  {
    id: 'ban_shop_gem_bundle',
    name: 'Master Sanctuary Gem Cache',
    type: 'SHOP',
    imageUrl: 'https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=800&auto=format&fit=crop&q=80',
    title: 'Sanctuary Gem Cache (3x Value)',
    description: 'Special weekend offering: 500 Gems + 10 Free Magnet Boosters.',
    startDate: '2026-09-02',
    endDate: '2026-09-10',
    status: 'ACTIVE',
    priority: 2,
  },
  {
    id: 'ban_announcement_world_100',
    name: 'New World Unveiling: Celestial Lagoon',
    type: 'ANNOUNCEMENT',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    title: 'World 100: Celestial Lagoon',
    description: 'Embark on the pinnacle sanctuary journey with 100 unique levels.',
    startDate: '2026-09-01',
    endDate: '2026-10-01',
    status: 'ACTIVE',
    priority: 3,
  },
];

export class ContentManagerService {
  private static instance: ContentManagerService;

  private constructor() {
    this.initStorage();
  }

  public static getInstance(): ContentManagerService {
    if (!ContentManagerService.instance) {
      ContentManagerService.instance = new ContentManagerService();
    }
    return ContentManagerService.instance;
  }

  private initStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (!localStorage.getItem(CONTENT_ASSETS_KEY)) {
      localStorage.setItem(CONTENT_ASSETS_KEY, JSON.stringify(INITIAL_CONTENT_ASSETS));
    }
    if (!localStorage.getItem(BANNERS_KEY)) {
      localStorage.setItem(BANNERS_KEY, JSON.stringify(INITIAL_BANNERS));
    }
  }

  // --- Content Assets ---
  public getAllAssets(): ContentAssetItem[] {
    if (typeof window === 'undefined' || !window.localStorage) return [...INITIAL_CONTENT_ASSETS];
    try {
      const raw = localStorage.getItem(CONTENT_ASSETS_KEY);
      if (!raw) return [...INITIAL_CONTENT_ASSETS];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...INITIAL_CONTENT_ASSETS];
    } catch {
      return [...INITIAL_CONTENT_ASSETS];
    }
  }

  public saveAssets(assets: ContentAssetItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(CONTENT_ASSETS_KEY, JSON.stringify(assets || []));
    }
  }

  public addAsset(item: Omit<ContentAssetItem, 'id' | 'createdAt' | 'updatedAt'>, adminEmail: string = 'admin'): ContentAssetItem {
    const assets = this.getAllAssets();
    const created: ContentAssetItem = {
      ...item,
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    assets.unshift(created);
    this.saveAssets(assets);

    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Created Content Asset: ${created.name}`,
      category: 'CONTENT',
      targetId: created.id,
      newValue: `Type: ${created.type}, Status: ${created.status}`,
    });

    return created;
  }

  public updateAsset(id: string, updates: Partial<ContentAssetItem>, adminEmail: string = 'admin'): boolean {
    const assets = this.getAllAssets();
    const index = assets.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const previous = assets[index];
    assets[index] = {
      ...assets[index],
      ...updates,
      updatedAt: Date.now(),
    };
    this.saveAssets(assets);

    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Updated Content Asset: ${previous.name}`,
      category: 'CONTENT',
      targetId: id,
      previousValue: `Status: ${previous.status}`,
      newValue: `Status: ${updates.status || previous.status}`,
    });

    return true;
  }

  public deleteAsset(id: string, adminEmail: string = 'admin'): boolean {
    const assets = this.getAllAssets();
    const target = assets.find((a) => a.id === id);
    const filtered = assets.filter((a) => a.id !== id);
    if (filtered.length === assets.length) return false;
    this.saveAssets(filtered);

    if (target) {
      globalAdminService.recordAuditLog({
        adminEmail,
        action: `Deleted Content Asset: ${target.name}`,
        category: 'CONTENT',
        targetId: id,
      });
    }

    return true;
  }

  // --- Promotional Banners ---
  public getAllBanners(): PromotionalBanner[] {
    if (typeof window === 'undefined' || !window.localStorage) return [...INITIAL_BANNERS];
    try {
      const raw = localStorage.getItem(BANNERS_KEY);
      if (!raw) return [...INITIAL_BANNERS];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...INITIAL_BANNERS];
    } catch {
      return [...INITIAL_BANNERS];
    }
  }

  public saveBanners(banners: PromotionalBanner[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(BANNERS_KEY, JSON.stringify(banners || []));
    }
  }

  public addBanner(item: Omit<PromotionalBanner, 'id'>, adminEmail: string = 'admin'): PromotionalBanner {
    const banners = this.getAllBanners();
    const created: PromotionalBanner = {
      ...item,
      id: `ban_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    banners.unshift(created);
    this.saveBanners(banners);

    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Created Promotional Banner: ${created.title}`,
      category: 'BANNER',
      targetId: created.id,
      newValue: `Type: ${created.type}, Status: ${created.status}`,
    });

    return created;
  }

  public updateBanner(id: string, updates: Partial<PromotionalBanner>, adminEmail: string = 'admin'): boolean {
    const banners = this.getAllBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) return false;

    const previous = banners[index];
    banners[index] = { ...banners[index], ...updates };
    this.saveBanners(banners);

    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Updated Promotional Banner: ${previous.title}`,
      category: 'BANNER',
      targetId: id,
      previousValue: `Status: ${previous.status}, Priority: ${previous.priority}`,
      newValue: `Status: ${updates.status || previous.status}, Priority: ${updates.priority || previous.priority}`,
    });

    return true;
  }

  public deleteBanner(id: string, adminEmail: string = 'admin'): boolean {
    const banners = this.getAllBanners();
    const target = banners.find((b) => b.id === id);
    const filtered = banners.filter((b) => b.id !== id);
    if (filtered.length === banners.length) return false;
    this.saveBanners(filtered);

    if (target) {
      globalAdminService.recordAuditLog({
        adminEmail,
        action: `Deleted Promotional Banner: ${target.title}`,
        category: 'BANNER',
        targetId: id,
      });
    }

    return true;
  }

  // =========================================================================
  // OTHER APPS & CROSS-PROMOTION PORTFOLIO MANAGEMENT
  // =========================================================================

  public getAllCrossPromoApps(): CrossPromoApp[] {
    try {
      const raw = localStorage.getItem(CROSS_PROMO_APPS_KEY);
      if (!raw) {
        this.saveCrossPromoApps(INITIAL_CROSS_PROMO_APPS);
        return [...INITIAL_CROSS_PROMO_APPS];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        this.saveCrossPromoApps(INITIAL_CROSS_PROMO_APPS);
        return [...INITIAL_CROSS_PROMO_APPS];
      }
      return parsed;
    } catch {
      return [...INITIAL_CROSS_PROMO_APPS];
    }
  }

  public getActiveCrossPromoApps(): CrossPromoApp[] {
    const list = this.getAllCrossPromoApps();
    return (Array.isArray(list) ? list : [...INITIAL_CROSS_PROMO_APPS])
      .filter((app) => app && app.status === 'ACTIVE')
      .sort((a, b) => (a?.priority || 0) - (b?.priority || 0));
  }

  private saveCrossPromoApps(apps: CrossPromoApp[]): void {
    try {
      localStorage.setItem(CROSS_PROMO_APPS_KEY, JSON.stringify(apps || []));
    } catch (e) {
      console.warn('Failed to persist cross promo apps to localStorage', e);
    }
  }

  public addCrossPromoApp(
    item: Omit<CrossPromoApp, 'id' | 'createdAt' | 'updatedAt' | 'clickCount'>,
    adminEmail: string = 'admin'
  ): CrossPromoApp {
    const apps = this.getAllCrossPromoApps();
    const created: CrossPromoApp = {
      ...item,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clickCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    apps.unshift(created);
    this.saveCrossPromoApps(apps);

    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Added Cross-Promotion App: ${created.appName}`,
      category: 'CONTENT',
      targetId: created.id,
      newValue: `Store URL: ${created.storeUrl}, Status: ${created.status}, Priority: ${created.priority}`,
    });

    return created;
  }

  public updateCrossPromoApp(
    id: string,
    updates: Partial<CrossPromoApp>,
    adminEmail: string = 'admin'
  ): boolean {
    const apps = this.getAllCrossPromoApps();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const previous = apps[index];
    apps[index] = {
      ...apps[index],
      ...updates,
      updatedAt: Date.now(),
    };
    this.saveCrossPromoApps(apps);

    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Updated Cross-Promotion App: ${previous.appName}`,
      category: 'CONTENT',
      targetId: id,
      previousValue: `Status: ${previous.status}, Priority: ${previous.priority}`,
      newValue: `Status: ${updates.status || previous.status}, Priority: ${updates.priority || previous.priority}`,
    });

    return true;
  }

  public deleteCrossPromoApp(id: string, adminEmail: string = 'admin'): boolean {
    const apps = this.getAllCrossPromoApps();
    const target = apps.find((a) => a.id === id);
    const filtered = apps.filter((a) => a.id !== id);
    if (filtered.length === apps.length) return false;
    this.saveCrossPromoApps(filtered);

    if (target) {
      globalAdminService.recordAuditLog({
        adminEmail,
        action: `Deleted Cross-Promotion App: ${target.appName}`,
        category: 'CONTENT',
        targetId: id,
      });
    }

    return true;
  }

  public recordCrossPromoClick(id: string): void {
    const apps = this.getAllCrossPromoApps();
    const index = apps.findIndex((a) => a.id === id);
    if (index !== -1) {
      apps[index].clickCount = (apps[index].clickCount || 0) + 1;
      this.saveCrossPromoApps(apps);
    }
  }
}

export const globalContentManagerService = ContentManagerService.getInstance();
