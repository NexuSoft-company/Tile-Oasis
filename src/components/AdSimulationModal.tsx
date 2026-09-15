import React, { useState, useEffect } from 'react';
import { globalAdMobService, ActiveAdRequest } from '../services/AdMobService';
import { globalAudioService } from '../services/AudioService';
import {
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  Star,
  Gift,
  CheckCircle2,
  Tv,
  Coins,
  ShieldCheck
} from 'lucide-react';

export const AdSimulationModal: React.FC = () => {
  const [activeAd, setActiveAd] = useState<ActiveAdRequest | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [rewardGranted, setRewardGranted] = useState<boolean>(false);

  useEffect(() => {
    const unsub = globalAdMobService.subscribe((ad) => {
      setActiveAd(ad);
      if (ad) {
        setSecondsRemaining(ad.durationSeconds || 5);
        setRewardGranted(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!activeAd) return;

    if (secondsRemaining <= 0) {
      if (!rewardGranted) {
        setRewardGranted(true);
        if (activeAd.type === 'REWARDED') {
          globalAudioService.emit('RewardReceived');
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeAd, secondsRemaining, rewardGranted]);

  if (globalAdMobService.isNative() || !activeAd) return null;

  const handleClaimAndClose = () => {
    globalAudioService.emit('ButtonPressed');
    globalAdMobService.closeActiveAd(true);
  };

  const handleCancelEarly = () => {
    globalAudioService.emit('ButtonPressed');
    // Explicitly do not grant reward when user cancels early
    globalAdMobService.closeActiveAd(false);
  };

  const handleAdClick = () => {
    globalAudioService.emit('ButtonPressed');
    globalAdMobService.recordAdClick();
    // Simulate opening sponsor
    window.open('https://play.google.com/store', '_blank');
  };

  const config = globalAdMobService.getConfig();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 font-sans select-none animate-in fade-in">
      {/* Top Ad Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-2xl">
          <Tv className="w-4 h-4 text-teal-400" />
          <span className="text-[11px] font-black text-white tracking-wide">
            {activeAd.type === 'REWARDED' ? 'REWARDED SPONSOR' : 'SPONSORED SHOWCASE'}
          </span>
          {config.testMode && (
            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-md">
              AdMob Test Mode
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Close or Countdown Timer */}
          {secondsRemaining > 0 ? (
            <div className="flex items-center space-x-1.5">
              <div className="h-8 px-3 rounded-xl bg-slate-900 border border-teal-500/40 text-teal-300 font-mono font-black text-xs flex items-center justify-center space-x-1 shadow-md">
                <span>Reward in</span>
                <span className="text-white text-sm font-black">{secondsRemaining}s</span>
              </div>
              <button
                onClick={handleCancelEarly}
                className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center justify-center transition-all"
                title="Cancel & Forfeit Reward"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleClaimAndClose}
              className="h-8 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 animate-bounce"
            >
              <span>CLAIM & CLOSE</span>
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* Main Video / Showcase Interactive Card */}
      <div className="my-auto w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center space-y-5 shadow-2xl relative overflow-hidden">
        {/* Animated Background Rays */}
        <div className="absolute inset-0 bg-radial from-teal-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Sponsor Icon / Graphic */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-400 via-emerald-500 to-indigo-600 p-1 shadow-2xl shadow-teal-500/30 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Gift className="w-10 h-10 text-teal-400" />
            </div>
          </div>
          <Star className="w-5 h-5 text-amber-400 fill-amber-400 absolute -top-2 -right-2 animate-bounce" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1 z-10">
          <h2 className="text-xl font-black text-white">{activeAd.title}</h2>
          <p className="text-xs text-slate-300 max-w-xs">{activeAd.description}</p>
        </div>

        {/* Reward Value Preview Pill */}
        {activeAd.rewardDesc && (
          <div className="z-10 bg-amber-500/15 border border-amber-500/40 px-4 py-2 rounded-2xl flex items-center space-x-2 text-amber-300 text-xs font-black shadow-inner">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Reward Value: {activeAd.rewardDesc}</span>
            {rewardGranted && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />}
          </div>
        )}

        {/* Interactive Install/Visit Action */}
        <div className="w-full space-y-2 z-10 pt-2">
          <button
            onClick={handleAdClick}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
          >
            <span>LEARN MORE / INSTALL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md flex items-center justify-between text-[10px] text-slate-500 px-2">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Google AdMob Verified Partner</span>
        </div>
        <span>Tile Oasis Ad Network v2.0</span>
      </div>
    </div>
  );
};
