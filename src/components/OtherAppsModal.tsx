/**
 * Other Apps & Cross-Promotion Showcase Modal
 * Allows players to discover other games/apps published by the studio.
 * Synchronized live with Admin Content & Banner Manager.
 */

import React, { useState } from 'react';
import { globalContentManagerService } from '../services/admin/ContentManagerService';
import { CrossPromoApp } from '../types/adminDashboard';
import { globalSaveService } from '../services/SaveService';
import { globalAudioService } from '../services/AudioService';
import {
  Gamepad2,
  X,
  ExternalLink,
  Star,
  Coins,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface OtherAppsModalProps {
  onClose: () => void;
  onWalletUpdate?: () => void;
}

export const OtherAppsModal: React.FC<OtherAppsModalProps> = ({ onClose, onWalletUpdate }) => {
  const [apps] = useState<CrossPromoApp[]>(() => {
    try {
      return globalContentManagerService.getActiveCrossPromoApps() || [];
    } catch {
      return [];
    }
  });
  const [claimedAppIds, setClaimedAppIds] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('tile_oasis_claimed_cross_promo_rewards');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const handleOpenApp = (app: CrossPromoApp) => {
    globalAudioService.emit('ButtonPressed');
    globalContentManagerService.recordCrossPromoClick(app.id);

    // If app offers reward coins and not yet claimed, grant reward
    if (app.rewardCoins && !claimedAppIds[app.id]) {
      const save = globalSaveService.loadSave();
      globalSaveService.saveData({
        coins: (save.coins || 0) + app.rewardCoins,
      });
      const updatedClaimed = { ...claimedAppIds, [app.id]: true };
      setClaimedAppIds(updatedClaimed);
      try {
        localStorage.setItem(
          'tile_oasis_claimed_cross_promo_rewards',
          JSON.stringify(updatedClaimed)
        );
      } catch (e) {
        console.warn(e);
      }
      if (onWalletUpdate) {
        onWalletUpdate();
      }
    }

    // Open target store link
    if (app.storeUrl) {
      window.open(app.storeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight flex items-center space-x-1.5">
                <span>Our Other Games & Apps</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Explore relaxing titles by Oasis Game Studio
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apps List */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {apps.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No cross-promotion apps active</p>
              <p className="text-xs text-slate-500">Check back soon for new game releases!</p>
            </div>
          ) : (
            apps.map((app) => {
              const isClaimed = claimedAppIds[app.id];
              return (
                <div
                  key={app.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col"
                >
                  {/* Promo Banner Header if available */}
                  {app.bannerUrl && (
                    <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={app.bannerUrl}
                        alt={app.appName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      {app.badgeText && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md">
                          {app.badgeText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* App Details */}
                  <div className="p-3.5 space-y-3">
                    <div className="flex items-start space-x-3">
                      <img
                        src={app.iconUrl}
                        alt={app.appName}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0 bg-slate-900"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm font-black text-white truncate">{app.appName}</h4>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium pt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {app.category}
                          </span>
                          {app.rating && (
                            <span className="flex items-center space-x-0.5 text-amber-300 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{app.rating.toFixed(1)}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 pt-1.5 font-normal">
                          {app.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar & Bonus Coin Incentive */}
                    <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      {app.rewardCoins && app.rewardCoins > 0 ? (
                        <div className="flex items-center space-x-1 text-[11px] font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {isClaimed ? 'Reward Claimed' : `+${app.rewardCoins} Free Coins`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Free to Play</span>
                      )}

                      <button
                        onClick={() => handleOpenApp(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-md shadow-teal-500/20 flex items-center space-x-1.5 active:scale-95 transition-all"
                      >
                        <span>{app.callToAction || 'Play Now'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Safe & verified Google Play Store links</span>
          <span className="text-teal-400 font-bold">Oasis Studio Hub</span>
        </div>
      </div>
    </div>
  );
};
