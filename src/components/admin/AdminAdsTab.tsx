/**
 * AdMob Management & Monetization Telemetry Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { globalAdMobService } from '../../services/AdMobService';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  Tv,
  DollarSign,
  Play,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface AdminAdsTabProps {
  adminEmail: string;
  onRefresh: () => void;
}

export const AdminAdsTab: React.FC<AdminAdsTabProps> = ({ adminEmail, onRefresh }) => {
  const [config, setConfig] = useState(globalAdMobService.getConfig());
  const telemetry = globalAdMobService.getTelemetry();
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggle = (key: 'enabled' | 'testMode' | 'rewardedEnabled' | 'interstitialEnabled' | 'bannerEnabled' | 'appOpenEnabled') => {
    const updated = { ...config, [key]: !config[key] };
    setConfig(updated);
    globalAdMobService.saveConfig(updated);
    globalAdminService.recordAuditLog({
      adminEmail,
      action: `Toggled AdMob Setting: ${key}`,
      category: 'ADMOB',
      previousValue: `${key}: ${config[key]}`,
      newValue: `${key}: ${updated[key]}`,
    });
    setNotice(`Updated AdMob setting: ${key} = ${updated[key]}`);
    onRefresh();
  };

  const handleUpdateCooldown = (seconds: number) => {
    const updated = { ...config, cooldownSeconds: Math.max(10, seconds) };
    setConfig(updated);
    globalAdMobService.saveConfig(updated);
    globalAdminService.recordAuditLog({
      adminEmail,
      action: 'Updated AdMob Cooldown',
      category: 'ADMOB',
      previousValue: `${config.cooldownSeconds}s`,
      newValue: `${updated.cooldownSeconds}s`,
    });
    onRefresh();
  };

  const handleUpdateFrequency = (levels: number) => {
    const updated = { ...config, interstitialFrequencyLevels: Math.max(1, levels) };
    setConfig(updated);
    globalAdMobService.saveConfig(updated);
    globalAdminService.recordAuditLog({
      adminEmail,
      action: 'Updated Interstitial Frequency',
      category: 'ADMOB',
      previousValue: `Every ${config.interstitialFrequencyLevels} levels`,
      newValue: `Every ${updated.interstitialFrequencyLevels} levels`,
    });
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Tv className="w-5 h-5 text-blue-400" />
            <span>AdMob SDK Management & Monetization Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure rewarded video incentives, interstitial frequency caps, banner placements, and monitor eCPM telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggle('testMode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              config.testMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Test Mode: {config.testMode ? 'ENABLED' : 'DISABLED'}
          </button>
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

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Ad Requests</span>
          <span className="text-xl font-black text-white font-mono">{telemetry.requestsTotal.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Impressions Served</span>
          <span className="text-xl font-black text-blue-400 font-mono">{telemetry.impressionsTotal.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Rewarded Completions</span>
          <span className="text-xl font-black text-emerald-400 font-mono">{telemetry.rewardedCompletedTotal.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Revenue (eCPM ~$18)</span>
          <span className="text-xl font-black text-amber-300 font-mono">
            ${telemetry.estimatedRevenueUsd.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Ad Units Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rewarded Video */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black text-white">Rewarded Video Ads</h3>
            </div>
            <button
              onClick={() => handleToggle('rewardedEnabled')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                config.rewardedEnabled
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.rewardedEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Awards players with 2x coins at end of level, +1 free Undo booster, or extra slot when tray overflows.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            Reward: <span className="text-amber-300 font-bold">2x Level Coins</span> or <span className="text-teal-300 font-bold">+1 Tactical Booster</span>
          </div>
        </div>

        {/* Interstitial Ads */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-black text-white">Interstitial Ads</h3>
            </div>
            <button
              onClick={() => handleToggle('interstitialEnabled')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                config.interstitialEnabled
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.interstitialEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Frequency (every X levels):</span>
              <div className="flex items-center space-x-1">
                {[2, 3, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleUpdateFrequency(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      config.interstitialFrequencyLevels === lvl
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Cooldown Between Ads:</span>
              <div className="flex items-center space-x-1">
                {[30, 60, 90].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleUpdateCooldown(sec)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      config.cooldownSeconds === sec
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Banner Ads */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tv className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-black text-white">Banner Ads (Bottom Anchor)</h3>
            </div>
            <button
              onClick={() => handleToggle('bannerEnabled')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                config.bannerEnabled
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.bannerEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Renders a non-intrusive 320x50 adaptive banner at the bottom of the Level Map and Main Menu views.
          </p>
        </div>

        {/* App Open Ads */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white">App Open Ads</h3>
            </div>
            <button
              onClick={() => handleToggle('appOpenEnabled')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                config.appOpenEnabled
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.appOpenEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Displays a brief splash ad when player re-enters Tile Oasis from background state.
          </p>
        </div>
      </div>
    </div>
  );
};
