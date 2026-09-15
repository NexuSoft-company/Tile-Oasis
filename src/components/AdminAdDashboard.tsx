import React, { useState, useEffect } from 'react';
import {
  globalAdMobService,
  AdUnitConfig,
  AdTelemetryStats,
} from '../services/AdMobService';
import {
  PRODUCTION_AD_UNITS,
  GOOGLE_TEST_AD_UNITS,
} from '../services/NativeAdMobBridge';
import { LocalEconomyService } from '../services/EconomyService';
import { globalSaveService } from '../services/SaveService';
import { SaveValidationService } from '../services/SaveValidationService';
import { globalAudioService } from '../services/AudioService';
import {
  Settings,
  Tv,
  Coins,
  Gem,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  DollarSign,
  BarChart3,
  RefreshCw,
  X,
  Shield,
  Smartphone,
  Sliders,
} from 'lucide-react';

interface AdminAdDashboardProps {
  onClose: () => void;
  onRefreshAppState?: () => void;
}

export const AdminAdDashboard: React.FC<AdminAdDashboardProps> = ({
  onClose,
  onRefreshAppState,
}) => {
  const [config, setConfig] = useState<AdUnitConfig>(() => globalAdMobService.getConfig());
  const [stats, setStats] = useState<AdTelemetryStats>(() => globalAdMobService.getStats());
  const [activeTab, setActiveTab] = useState<'ADS' | 'ECONOMY' | 'SAVE_RECOVERY' | 'TELEMETRY'>('ADS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const economy = new LocalEconomyService();

  const handleSaveConfig = () => {
    globalAdMobService.saveConfig(config);
    setToastMessage('AdMob Configuration saved successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestRewarded = (placement: 'SHOP_DAILY_COINS' | 'DOUBLE_LEVEL_COINS' | 'GAMEPLAY_REVIVE') => {
    globalAdMobService.showRewardedVideo(placement, () => {
      if (placement === 'SHOP_DAILY_COINS') {
        economy.addCoins(config.rewardedCoinsAmount);
      }
      setStats(globalAdMobService.getStats());
      setToastMessage(`Rewarded Video completed! Reward granted for ${placement}.`);
      if (onRefreshAppState) onRefreshAppState();
      setTimeout(() => setToastMessage(null), 4000);
    });
  };

  const handleTestInterstitial = () => {
    const shown = globalAdMobService.showInterstitial(() => {
      setStats(globalAdMobService.getStats());
      setToastMessage('Interstitial Ad closed.');
      setTimeout(() => setToastMessage(null), 3000);
    });
    if (!shown) {
      setToastMessage('Interstitial cooldown active! Wait before showing next.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleGrantResources = () => {
    economy.addCoins(1000);
    economy.addGems(50);
    economy.addBooster('undo', 3);
    economy.addBooster('shuffle', 3);
    economy.addBooster('magnet', 3);
    economy.addBooster('extra_slot', 2);
    economy.addBooster('freeze', 2);
    economy.addBooster('hint', 3);
    economy.addBooster('auto_match', 2);
    setToastMessage('Granted +1,000 Coins, +50 Gems, and +3 of all Boosters!');
    if (onRefreshAppState) onRefreshAppState();
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSetLevel = (levelId: number) => {
    globalSaveService.saveData({
      currentLevel: levelId,
      highestLevelUnlocked: Math.max(globalSaveService.loadSave().highestLevelUnlocked, levelId),
    });
    setToastMessage(`Jumped player to Level ${levelId}!`);
    if (onRefreshAppState) onRefreshAppState();
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateCorruptSave = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Inject out-of-range corrupt record
      const corruptData = {
        currentLevel: 'INVALID_STRING',
        highestLevelUnlocked: -999,
        coins: 'NOT_A_NUMBER',
        gems: -50,
        starsTotal: 999999,
        completedLevels: {
          '99999': { stars: 5, highScore: 'corrupt' },
        },
      };
      localStorage.setItem('tile_oasis_player_save_v1', JSON.stringify(corruptData));
      setToastMessage('Simulated corrupted save in localStorage!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleVerifyAndRepairSave = () => {
    const repaired = globalSaveService.loadSave();
    setToastMessage(`Save verified & sanitized! Level: ${repaired.currentLevel}, Coins: ${repaired.coins}`);
    if (onRefreshAppState) onRefreshAppState();
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-sans select-none animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xl w-full shadow-2xl text-slate-100 flex flex-col space-y-4 max-h-[92vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">LiveOps & AdMob Admin Console</h2>
              <p className="text-[11px] text-slate-400">Ad mediation, LiveOps monetization & QA diagnostic tools</p>
            </div>
          </div>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold text-center animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-black">
          <button
            onClick={() => setActiveTab('ADS')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeTab === 'ADS'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>AdMob Config</span>
          </button>

          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeTab === 'TELEMETRY'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('ECONOMY')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeTab === 'ECONOMY'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Economy QA</span>
          </button>

          <button
            onClick={() => setActiveTab('SAVE_RECOVERY')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeTab === 'SAVE_RECOVERY'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Save Healing</span>
          </button>
        </div>

        {/* TAB 1: ADMOB CONFIGURATION */}
        {activeTab === 'ADS' && (
          <div className="space-y-4 text-xs">
            {/* Test Mode & Banner Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">AdMob Test Mode</span>
                  <span className="text-[10px] text-slate-400">Uses official Google Test Unit IDs</span>
                </div>
                <button
                  onClick={() => setConfig({ ...config, testMode: !config.testMode })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    config.testMode ? 'bg-teal-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      config.testMode ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Banner Ad Enabled</span>
                  <span className="text-[10px] text-slate-400">Display banner at bottom</span>
                </div>
                <button
                  onClick={() => setConfig({ ...config, bannerEnabled: !config.bannerEnabled })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    config.bannerEnabled ? 'bg-teal-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      config.bannerEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Preset Switcher */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-300">Active Profile:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfig({
                      ...config,
                      appIdAndroid: PRODUCTION_AD_UNITS.appIdAndroid,
                      bannerId: PRODUCTION_AD_UNITS.bannerId,
                      interstitialId: PRODUCTION_AD_UNITS.interstitialId,
                      rewardedId: PRODUCTION_AD_UNITS.rewardedId,
                      appOpenId: PRODUCTION_AD_UNITS.appOpenId,
                      nativeAdvancedId: PRODUCTION_AD_UNITS.nativeAdvancedId,
                      testMode: false,
                    });
                    setToastMessage('Loaded Verified Production AdMob IDs (Live Mode)');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    !config.testMode && config.appIdAndroid === PRODUCTION_AD_UNITS.appIdAndroid
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  Production Live Ads
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfig({
                      ...config,
                      appIdAndroid: GOOGLE_TEST_AD_UNITS.appIdAndroid,
                      bannerId: GOOGLE_TEST_AD_UNITS.bannerId,
                      interstitialId: GOOGLE_TEST_AD_UNITS.interstitialId,
                      rewardedId: GOOGLE_TEST_AD_UNITS.rewardedId,
                      appOpenId: GOOGLE_TEST_AD_UNITS.appOpenId,
                      testMode: true,
                    });
                    setToastMessage('Loaded Google Sample Test IDs (Test Mode)');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    config.testMode
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  Google Test Mode
                </button>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-2.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Android App ID
                </label>
                <input
                  type="text"
                  value={config.appIdAndroid}
                  onChange={(e) => setConfig({ ...config, appIdAndroid: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Banner Ad Unit ID
                </label>
                <input
                  type="text"
                  value={config.bannerId}
                  onChange={(e) => setConfig({ ...config, bannerId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Interstitial Ad Unit ID
                </label>
                <input
                  type="text"
                  value={config.interstitialId}
                  onChange={(e) => setConfig({ ...config, interstitialId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Rewarded Video Ad Unit ID
                </label>
                <input
                  type="text"
                  value={config.rewardedId}
                  onChange={(e) => setConfig({ ...config, rewardedId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  App Open Ad Unit ID
                </label>
                <input
                  type="text"
                  value={config.appOpenId}
                  onChange={(e) => setConfig({ ...config, appOpenId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Native Advanced Ad Unit ID
                </label>
                <input
                  type="text"
                  value={config.nativeAdvancedId || ''}
                  onChange={(e) => setConfig({ ...config, nativeAdvancedId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Interstitial Cooldown (sec)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="600"
                    value={config.interstitialIntervalSeconds}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        interstitialIntervalSeconds: Number(e.target.value) || 120,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Rewarded Coins Amount
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    value={config.rewardedCoinsAmount}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        rewardedCoinsAmount: Number(e.target.value) || 150,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-xs focus:border-teal-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>SAVE ADMOB CONFIGURATION</span>
            </button>

            {/* Quick Live Ad Testers */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Interactive Ad Simulation Testers
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTestRewarded('SHOP_DAILY_COINS')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Rewarded (+Coins)</span>
                </button>

                <button
                  onClick={() => handleTestRewarded('DOUBLE_LEVEL_COINS')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  <span>Test Rewarded (2X Multiplier)</span>
                </button>

                <button
                  onClick={() => handleTestRewarded('GAMEPLAY_REVIVE')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-indigo-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Test Rewarded (Revive)</span>
                </button>

                <button
                  onClick={handleTestInterstitial}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Tv className="w-3.5 h-3.5 text-slate-400" />
                  <span>Test Interstitial Ad</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TELEMETRY & METRICS */}
        {activeTab === 'TELEMETRY' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Impressions</span>
                <p className="text-lg font-black text-white">{stats.impressionsTotal}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-teal-400 font-bold uppercase">Rewarded Video Cleared</span>
                <p className="text-lg font-black text-teal-300">{stats.rewardedCompletedTotal}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Estimated Ad Rev ($)</span>
                <p className="text-lg font-black text-amber-300">${stats.estimatedRevenueUsd.toFixed(2)}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Avg eCPM (USD)</span>
                <p className="text-lg font-black text-white">${stats.averageEcpmUsd.toFixed(2)}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Fill Rate</span>
                <p className="text-lg font-black text-emerald-400">{stats.fillRatePct}%</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Ad Clicks</span>
                <p className="text-lg font-black text-white">{stats.clicksTotal}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Capacitor / Native AdMob Integration Note</span>
              <p className="text-[11px] text-slate-300">
                Ready for Android APK/AAB build with <code className="text-amber-300">@capacitor-community/admob</code>. When compiled on mobile devices, AdMob native banner, interstitial, and rewarded handlers bind automatically.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: ECONOMY & LEVEL JUMP QA */}
        {activeTab === 'ECONOMY' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-white text-sm block">Economy Balance Overrides</span>
              <button
                onClick={handleGrantResources}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
              >
                <Coins className="w-4 h-4 text-slate-950" />
                <span>GRANT +1,000 COINS, +50 GEMS & +3 ALL BOOSTERS</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-white text-sm block">Instant Level Jump (1 → 9,999)</span>
              <div className="grid grid-cols-4 gap-2">
                {[1, 25, 50, 100, 250, 500, 1000, 9999].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSetLevel(lvl)}
                    className="py-2 px-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-extrabold text-xs text-center transition-all hover:border-teal-500"
                  >
                    Lvl {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SAVE INTEGRITY & RECOVERY */}
        {activeTab === 'SAVE_RECOVERY' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-white text-sm block">Save Corruption Stress Test</span>
              <p className="text-[11px] text-slate-400">
                Test how the game handles corrupted JSON or broken numbers in local storage.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleSimulateCorruptSave}
                  className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-black text-xs transition-all active:scale-95"
                >
                  Simulate Corrupt Save
                </button>
                <button
                  onClick={handleVerifyAndRepairSave}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-black text-xs transition-all active:scale-95"
                >
                  Verify & Heal Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
