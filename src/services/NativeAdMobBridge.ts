/**
 * Native AdMob Bridge for Tile Oasis: Sanctuary Match
 * 
 * Provides production-grade native Android Google Mobile Ads SDK bindings
 * using @capacitor-community/admob and @capacitor/core.
 * 
 * Security & Reliability Architecture:
 * - Real Google Mobile Ads SDK lifecycle initialization
 * - Separate Test vs Production Unit IDs (Official Google Test IDs)
 * - Single-flight ad request locking (prevents double-tap race conditions)
 * - Single-use transaction tokens (idempotent reward fulfillment)
 * - Graceful offline & load error recovery without freezing gameplay
 */

import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import {
  AdMob,
  RewardAdPluginEvents,
  InterstitialAdPluginEvents,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  AdMobRewardItem,
  AdMobError,
  AdLoadInfo,
} from '@capacitor-community/admob';
import { globalErrorMonitoring } from './ErrorMonitoringService';

export interface NativeAdConfig {
  appIdAndroid: string;
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
  appOpenId?: string;
  nativeAdvancedId?: string;
  testMode: boolean;
  bannerEnabled: boolean;
  interstitialIntervalSeconds: number;
}

// Official Google AdMob Test Ad Unit IDs for Android
export const GOOGLE_TEST_AD_UNITS = {
  appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
  bannerId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedId: 'ca-app-pub-3940256099942544/5224354917',
  appOpenId: 'ca-app-pub-3940256099942544/3419835294',
};

// Verified Production Google AdMob Unit IDs for Tile Oasis: Sanctuary Match
export const PRODUCTION_AD_UNITS = {
  appIdAndroid: 'ca-app-pub-1492562421327050~8440514175',
  bannerId: 'ca-app-pub-1492562421327050/5814350835',
  interstitialId: 'ca-app-pub-1492562421327050/8227198084',
  rewardedId: 'ca-app-pub-1492562421327050/7457041893',
  nativeAdvancedId: 'ca-app-pub-1492562421327050/4901432250',
  appOpenId: 'ca-app-pub-1492562421327050/3819802376',
};

export type NativeAdInitStatus = 'NOT_INITIALIZED' | 'INITIALIZING' | 'INITIALIZED' | 'FAILED';

export class NativeAdMobBridge {
  private initStatus: NativeAdInitStatus = 'NOT_INITIALIZED';
  private activeTxId: string | null = null;
  private isAdInFlight: boolean = false;
  private activeListeners: PluginListenerHandle[] = [];
  private lastInterstitialTimestamp: number = 0;
  private bannerShowing: boolean = false;

  public isNative(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  }

  public getInitStatus(): NativeAdInitStatus {
    return this.initStatus;
  }

  /**
   * Asynchronously initialize Google Mobile Ads SDK on Android
   */
  public async initialize(config: NativeAdConfig): Promise<boolean> {
    if (!this.isNative()) {
      return false;
    }

    if (this.initStatus === 'INITIALIZED' || this.initStatus === 'INITIALIZING') {
      return true;
    }

    this.initStatus = 'INITIALIZING';

    try {
      await AdMob.initialize({
        initializeForTesting: config.testMode,
        testingDevices: config.testMode ? ['EMULATOR'] : [],
      });

      this.initStatus = 'INITIALIZED';
      console.log('[NativeAdMobBridge] Google Mobile Ads SDK initialized successfully.');

      // Setup banner if enabled
      if (config.bannerEnabled) {
        this.showBanner(config).catch((err) => {
          console.warn('[NativeAdMobBridge] Initial banner load deferred:', err);
        });
      }

      this.preloadAppOpenAd(config).catch(console.warn);

      return true;
    } catch (error: any) {
      this.initStatus = 'FAILED';
      globalErrorMonitoring.logError(
        'ANALYTICS_ERROR',
        `Native AdMob initialization failed: ${error?.message || error}`,
        { error }
      );
      return false;
    }
  }

  private appOpenLoaded: boolean = false;

  public async preloadAppOpenAd(config: NativeAdConfig): Promise<void> {
    if (!this.isNative()) return;
    try {
      const adId = this.getEffectiveAdUnitId('APP_OPEN', config);
      if ((AdMob as any).prepareAppOpen) {
         // Experimental API
         await (AdMob as any).prepareAppOpen({ adId, isTesting: config.testMode });
         this.appOpenLoaded = true;
      }
    } catch (e) {
      console.warn('[NativeAdMobBridge] Failed to preload App Open Ad:', e);
    }
  }

  public async showAppOpenAd(): Promise<boolean> {
    if (!this.isNative() || !this.appOpenLoaded || !(AdMob as any).showAppOpenAd) return false;
    try {
      await (AdMob as any).showAppOpenAd();
      this.appOpenLoaded = false;
      return true;
    } catch (e) {
      console.warn('[NativeAdMobBridge] Failed to show App Open Ad:', e);
      return false;
    }
  }

  /**
   * Resolves the correct Ad Unit ID based on Test Mode vs Production Config
   */
  public getEffectiveAdUnitId(
    type: 'BANNER' | 'INTERSTITIAL' | 'REWARDED' | 'APP_OPEN' | 'NATIVE_ADVANCED',
    config: NativeAdConfig
  ): string {
    if (config.testMode) {
      if (type === 'BANNER') return GOOGLE_TEST_AD_UNITS.bannerId;
      if (type === 'INTERSTITIAL') return GOOGLE_TEST_AD_UNITS.interstitialId;
      if (type === 'REWARDED') return GOOGLE_TEST_AD_UNITS.rewardedId;
      if (type === 'APP_OPEN') return GOOGLE_TEST_AD_UNITS.appOpenId;
      if (type === 'NATIVE_ADVANCED') return GOOGLE_TEST_AD_UNITS.bannerId;
    }

    if (type === 'BANNER') return config.bannerId || PRODUCTION_AD_UNITS.bannerId;
    if (type === 'INTERSTITIAL') return config.interstitialId || PRODUCTION_AD_UNITS.interstitialId;
    if (type === 'REWARDED') return config.rewardedId || PRODUCTION_AD_UNITS.rewardedId;
    if (type === 'APP_OPEN') return config.appOpenId || PRODUCTION_AD_UNITS.appOpenId;
    if (type === 'NATIVE_ADVANCED') return config.nativeAdvancedId || PRODUCTION_AD_UNITS.nativeAdvancedId;

    return PRODUCTION_AD_UNITS.rewardedId;
  }

  /**
   * Cleans up all active plugin event listeners
   */
  private async clearActiveListeners(): Promise<void> {
    for (const handle of this.activeListeners) {
      try {
        await handle.remove();
      } catch {
        // Ignore listener removal errors
      }
    }
    this.activeListeners = [];
  }

  /**
   * Shows a Native Rewarded Ad with strict idempotency and verified reward callbacks
   */
  public async showNativeRewarded(
    placement: string,
    config: NativeAdConfig,
    onVerifiedReward: () => void,
    onAdClosed?: () => void,
    onAdUnavailable?: (reason: string) => void
  ): Promise<boolean> {
    if (!this.isNative()) {
      return false;
    }

    // Check if another ad request is currently in-flight (prevent multi-tap)
    if (this.isAdInFlight) {
      console.warn('[NativeAdMobBridge] Rewarded ad already in flight. Request rejected.');
      return false;
    }

    this.isAdInFlight = true;
    const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    this.activeTxId = txId;
    let rewardGrantedForTx = false;

    // Ensure SDK is initialized
    if (this.initStatus !== 'INITIALIZED') {
      const ok = await this.initialize(config);
      if (!ok) {
        this.isAdInFlight = false;
        this.activeTxId = null;
        if (onAdUnavailable) onAdUnavailable('AdMob SDK initialization failed');
        if (onAdClosed) onAdClosed();
        return false;
      }
    }

    const adUnitId = this.getEffectiveAdUnitId('REWARDED', config);

    try {
      await this.clearActiveListeners();

      // 1. Listen for Verified Reward Event
      const rewardListener = await AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        (rewardItem: AdMobRewardItem) => {
          if (this.activeTxId === txId && !rewardGrantedForTx) {
            rewardGrantedForTx = true;
            console.log(
              `[NativeAdMobBridge] Verified Native Reward Callback received for ${placement}:`,
              rewardItem
            );
            try {
              onVerifiedReward();
            } catch (err: any) {
              globalErrorMonitoring.logError(
                'REWARD_ERROR',
                `Failed to apply verified native reward: ${err?.message}`,
                { placement, txId, error: err }
              );
            }
          } else {
            console.warn('[NativeAdMobBridge] Duplicate or stale reward event discarded for tx:', txId);
          }
        }
      );
      this.activeListeners.push(rewardListener);

      // 2. Listen for Ad Dismissal
      const dismissListener = await AdMob.addListener(
        RewardAdPluginEvents.Dismissed,
        () => {
          console.log(`[NativeAdMobBridge] Rewarded ad dismissed for ${placement}, txId: ${txId}`);
          this.isAdInFlight = false;
          this.activeTxId = null;
          this.clearActiveListeners();
          if (onAdClosed) onAdClosed();
        }
      );
      this.activeListeners.push(dismissListener);

      // 3. Listen for Load Failure
      const failLoadListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToLoad,
        (error: AdMobError) => {
          console.warn('[NativeAdMobBridge] Rewarded ad failed to load:', error);
          this.isAdInFlight = false;
          this.activeTxId = null;
          this.clearActiveListeners();
          if (onAdUnavailable) onAdUnavailable(error.message || 'Ad failed to load');
          if (onAdClosed) onAdClosed();
        }
      );
      this.activeListeners.push(failLoadListener);

      // 4. Listen for Show Failure
      const failShowListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToShow,
        (error: AdMobError) => {
          console.warn('[NativeAdMobBridge] Rewarded ad failed to show:', error);
          this.isAdInFlight = false;
          this.activeTxId = null;
          this.clearActiveListeners();
          if (onAdUnavailable) onAdUnavailable(error.message || 'Ad failed to show');
          if (onAdClosed) onAdClosed();
        }
      );
      this.activeListeners.push(failShowListener);

      // Prepare & Present Rewarded Ad
      await AdMob.prepareRewardVideoAd({
        adId: adUnitId,
        isTesting: config.testMode,
      });

      await AdMob.showRewardVideoAd();
      return true;
    } catch (error: any) {
      console.warn('[NativeAdMobBridge] Exception during rewarded ad flow:', error);
      this.isAdInFlight = false;
      this.activeTxId = null;
      await this.clearActiveListeners();
      if (onAdUnavailable) onAdUnavailable(error?.message || 'Ad unavailable');
      if (onAdClosed) onAdClosed();
      return false;
    }
  }

  /**
   * Shows a Native Interstitial Ad
   */
  public async showNativeInterstitial(
    config: NativeAdConfig,
    onAdClosed?: () => void,
    onAdUnavailable?: (reason: string) => void
  ): Promise<boolean> {
    if (!this.isNative()) {
      return false;
    }

    const now = Date.now();
    const elapsed = (now - this.lastInterstitialTimestamp) / 1000;
    if (elapsed < config.interstitialIntervalSeconds) {
      console.log('[NativeAdMobBridge] Interstitial cooldown active.');
      if (onAdClosed) onAdClosed();
      return false;
    }

    if (this.isAdInFlight) {
      return false;
    }

    this.isAdInFlight = true;
    this.lastInterstitialTimestamp = now;

    if (this.initStatus !== 'INITIALIZED') {
      const ok = await this.initialize(config);
      if (!ok) {
        this.isAdInFlight = false;
        if (onAdClosed) onAdClosed();
        return false;
      }
    }

    const adUnitId = this.getEffectiveAdUnitId('INTERSTITIAL', config);

    try {
      await this.clearActiveListeners();

      const dismissListener = await AdMob.addListener(
        InterstitialAdPluginEvents.Dismissed,
        () => {
          this.isAdInFlight = false;
          this.clearActiveListeners();
          if (onAdClosed) onAdClosed();
        }
      );
      this.activeListeners.push(dismissListener);

      const failListener = await AdMob.addListener(
        InterstitialAdPluginEvents.FailedToLoad,
        (error: AdMobError) => {
          this.isAdInFlight = false;
          this.clearActiveListeners();
          if (onAdUnavailable) onAdUnavailable(error.message);
          if (onAdClosed) onAdClosed();
        }
      );
      this.activeListeners.push(failListener);

      await AdMob.prepareInterstitial({
        adId: adUnitId,
        isTesting: config.testMode,
      });

      await AdMob.showInterstitial();
      return true;
    } catch (error: any) {
      this.isAdInFlight = false;
      await this.clearActiveListeners();
      if (onAdUnavailable) onAdUnavailable(error?.message || 'Interstitial unavailable');
      if (onAdClosed) onAdClosed();
      return false;
    }
  }

  /**
   * Shows persistent bottom banner ad
   */
  public async showBanner(config: NativeAdConfig): Promise<void> {
    if (!this.isNative() || this.bannerShowing || !config.bannerEnabled) {
      return;
    }

    const adUnitId = this.getEffectiveAdUnitId('BANNER', config);

    try {
      await AdMob.showBanner({
        adId: adUnitId,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        isTesting: config.testMode,
      });
      this.bannerShowing = true;
    } catch (e) {
      console.warn('[NativeAdMobBridge] Failed to display native banner:', e);
    }
  }

  /**
   * Hides bottom banner ad
   */
  public async hideBanner(): Promise<void> {
    if (!this.isNative() || !this.bannerShowing) {
      return;
    }

    try {
      await AdMob.hideBanner();
      this.bannerShowing = false;
    } catch (e) {
      console.warn('[NativeAdMobBridge] Failed to hide native banner:', e);
    }
  }
}

export const globalNativeAdMobBridge = new NativeAdMobBridge();
