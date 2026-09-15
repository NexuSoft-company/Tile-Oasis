import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Zap,
  Gift,
  Boxes,
  Crown,
  Palette,
  Coins,
  Gem,
  CheckCircle2,
  AlertCircle,
  X,
  PlusSquare,
  RotateCcw,
  Shuffle,
  Magnet,
  Snowflake,
  Lightbulb,
} from 'lucide-react';
import { ShopService, globalShopService, ShopPurchaseResult } from '../services/ShopService';
import { LocalEconomyService } from '../services/EconomyService';
import { BoosterType } from '../types/gameEngine';
import { globalAudioService } from '../services/AudioService';
import { globalAdMobService } from '../services/AdMobService';
import { CollectionView } from './CollectionView';
import { Tv, Play } from 'lucide-react';

interface ShopViewProps {
  onClose?: () => void;
  onCurrencyUpdate?: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ onClose, onCurrencyUpdate }) => {
  const shopService = globalShopService;
  const economyService = new LocalEconomyService();

  const [activeTab, setActiveTab] = useState<'boosters' | 'bundles' | 'themes' | 'special'>('boosters');
  const [feedback, setFeedback] = useState<{ text: string; isError?: boolean } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBooster, setSelectedBooster] = useState<any>(null);

  const coins = economyService.getCoins();
  const gems = economyService.getGems();
  const canClaimFreeGift = shopService.canClaimDailyFreeGift();

  const catalog = useMemo(() => {
    return shopService.getCatalog();
  }, [refreshKey]);

  const boosters = (catalog || []).filter((i) => i && i.category === 'boosters');
  const bundles = (catalog || []).filter((i) => i && i.category === 'bundles');
  const specialOffers = (catalog || []).filter((i) => i && i.category === 'special');

  const handlePurchase = (itemId: string, currency: 'coins' | 'gems') => {
    const res = shopService.purchaseItem(itemId, currency);
    if (res.success) {
      globalAudioService.emit('RewardReceived');
      setFeedback({ text: res.message });
      setRefreshKey((k) => k + 1);
      if (onCurrencyUpdate) onCurrencyUpdate();
    } else {
      setFeedback({ text: res.message, isError: true });
    }
  };

  const getBoosterIcon = (bType: string) => {
    switch (bType) {
      case 'undo':
        return RotateCcw;
      case 'shuffle':
        return Shuffle;
      case 'magnet':
        return Magnet;
      case 'extra_slot':
        return PlusSquare;
      case 'freeze':
        return Snowflake;
      case 'hint':
        return Lightbulb;
      default:
        return Zap;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full text-slate-100 sm:rounded-3xl rounded-none shadow-2xl relative select-none font-sans overflow-hidden border border-amber-600/30"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(2, 6, 23, 0.98)), url(/feature-graphic.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#020617', // fallback
      }}
    >
      {/* Header Bar */}
      <div className="bg-slate-950/80 border-b-2 border-amber-600/50 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0 z-10 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border-b-[4px] border-rose-800">
            <ShoppingBag className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <div className="drop-shadow-md">
            <h1 className="text-xl font-black text-white tracking-tight">Marketplace</h1>
            <p className="text-xs text-amber-200/80 font-black tracking-wide">SUPPLIES & BOOSTERS</p>
          </div>
        </div>

        {/* Currency Pill */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border-b-2 border-slate-700 px-3 py-1.5 rounded-2xl shadow-inner">
          <div className="flex items-center space-x-1.5 text-amber-400 font-black text-sm drop-shadow-md">
            <Coins className="w-4 h-4 fill-amber-400/20" />
            <span>{coins}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-400 font-black text-sm drop-shadow-md">
            <Gem className="w-4 h-4 fill-emerald-400/20" />
            <span>{gems}</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border-b-2 border-rose-500/30 active:translate-y-0.5 active:border-b-0 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-all ml-2"
            >
              <X className="w-5 h-5 drop-shadow-md" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area with Padding */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs font-black text-center border-2 animate-in fade-in shadow-lg ${
              feedback.isError
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-950/60 backdrop-blur-sm rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('boosters');
              setFeedback(null);
            }}
            className={`py-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-1.5 border-b-[3px] active:translate-y-0.5 active:border-b-0 shadow-sm ${
              activeTab === 'boosters'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-orange-700 shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className={`w-4 h-4 ${activeTab === 'boosters' ? 'drop-shadow-sm' : ''}`} />
            <span className={activeTab === 'boosters' ? 'tracking-wide' : ''}>Boosters</span>
          </button>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('bundles');
              setFeedback(null);
            }}
            className={`py-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-1.5 border-b-[3px] active:translate-y-0.5 active:border-b-0 shadow-sm ${
              activeTab === 'bundles'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-orange-700 shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Boxes className={`w-4 h-4 ${activeTab === 'bundles' ? 'drop-shadow-sm' : ''}`} />
            <span className={activeTab === 'bundles' ? 'tracking-wide' : ''}>Bundles</span>
          </button>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('themes');
              setFeedback(null);
            }}
            className={`py-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-1.5 border-b-[3px] active:translate-y-0.5 active:border-b-0 shadow-sm ${
              activeTab === 'themes'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-orange-700 shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Palette className={`w-4 h-4 ${activeTab === 'themes' ? 'drop-shadow-sm' : ''}`} />
            <span className={activeTab === 'themes' ? 'tracking-wide' : ''}>Cosmetics</span>
          </button>

          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('special');
              setFeedback(null);
            }}
            className={`py-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-1.5 relative border-b-[3px] active:translate-y-0.5 active:border-b-0 shadow-sm ${
              activeTab === 'special'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-800 shadow-md'
                : 'bg-slate-800 border-slate-700 text-rose-300 hover:bg-slate-700'
            }`}
          >
            <Gift className={`w-4 h-4 ${activeTab === 'special' ? 'drop-shadow-md' : ''}`} />
            <span className={activeTab === 'special' ? 'tracking-wide drop-shadow-md' : ''}>Free Gifts</span>
            {canClaimFreeGift && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-1 right-1 sm:top-1.5 sm:right-1.5 animate-ping shadow-lg border border-white" />
            )}
          </button>
        </div>

        {/* TAB CONTENT: BOOSTERS */}
        {activeTab === 'boosters' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto max-h-[60vh] pb-4 px-1 scrollbar-none">
            {boosters.map((b) => {
              const bKey = Object.keys(b.boosterGrant || {})[0] as BoosterType;
              const currentQty = economyService.getBoosterCount(bKey);
              const Icon = getBoosterIcon(bKey);

              return (
                <button
                  key={b.id}
                  onClick={() => {
                    globalAudioService.emit('ButtonPressed');
                    setSelectedBooster({ ...b, bKey, currentQty, Icon });
                  }}
                  className="bg-slate-900/90 backdrop-blur-sm border-b-[4px] border-slate-700/80 p-3 rounded-2xl flex flex-col relative overflow-hidden transition-all shadow-lg hover:bg-slate-800/90 active:translate-y-1 active:border-b-0"
                >
                  <div className="flex flex-col h-full space-y-2 w-full">
                    {/* Item Preview (Square Card Layout) */}
                    <div className="relative w-full aspect-square rounded-xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border-b-[3px] border-amber-600/30 flex flex-col items-center justify-center shadow-inner shrink-0 overflow-hidden">
                      <Icon className="w-10 h-10 text-amber-400 drop-shadow-md z-10" />
                      
                      {/* Owned Badge */}
                      <div className="absolute bottom-1 right-1 bg-slate-950/80 rounded-lg px-2 py-0.5 border border-amber-500/30 shadow-md z-10">
                        <span className="text-[10px] font-black text-amber-300">
                          {currentQty}
                        </span>
                      </div>
                    </div>

                    {/* Title overlay */}
                    <div className="bg-slate-950/80 w-full py-1.5 px-2 z-10 border-t border-white/5 mt-1 rounded">
                      <span className="font-black text-[11px] text-white drop-shadow-sm leading-tight line-clamp-1 w-full text-center">
                        {b.name}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

      {/* TAB CONTENT: BUNDLES */}
      {activeTab === 'bundles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] pr-1 pb-4">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className={`p-4 rounded-3xl border-b-[6px] transition-all flex flex-col items-center text-center justify-between gap-3 relative overflow-hidden backdrop-blur-sm shadow-xl ${
                bundle.isBestValue
                  ? 'bg-gradient-to-b from-amber-500/20 via-orange-900/40 to-rose-900/60 border-orange-500/50 border-b-rose-700 shadow-rose-900/30'
                  : 'bg-slate-900/90 border-slate-700/80 border-b-slate-800'
              }`}
            >
              {/* Highlight Ribbon */}
              {bundle.badge && (
                <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-black uppercase py-1 shadow-md">
                  {bundle.badge}
                </div>
              )}

              {/* Bundle Icon Area */}
              <div className={`w-20 h-20 mt-4 rounded-2xl flex items-center justify-center shadow-inner border-b-[4px] ${bundle.isBestValue ? 'bg-gradient-to-br from-orange-500 to-rose-600 border-rose-800' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-purple-800'}`}>
                 <Boxes className="w-10 h-10 text-white drop-shadow-md" />
              </div>

              <div className="space-y-1.5 w-full flex flex-col items-center">
                <span className="font-black text-lg text-white drop-shadow-md leading-tight">{bundle.name}</span>
                <p className="text-[11px] text-slate-300 font-medium leading-tight px-2">{bundle.description}</p>
                
                {/* Rewards Container */}
                <div className="flex justify-center flex-wrap gap-1.5 pt-2 w-full">
                  {Object.entries(bundle.boosterGrant || {}).map(([bType, count]) => (
                    <span
                      key={bType}
                      className="text-[10px] font-black bg-slate-950/80 px-2 py-1 rounded-lg text-slate-200 border-b-2 border-slate-700 capitalize shadow-inner"
                    >
                      +{count} {bType}
                    </span>
                  ))}
                  {bundle.coinsGrant && (
                    <span className="text-[10px] font-black bg-amber-500/20 px-2 py-1 rounded-lg text-amber-300 border-b-2 border-amber-600/40 shadow-inner">
                      +{bundle.coinsGrant} Coins
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 w-full border-t border-white/10 flex flex-col gap-2">
                {bundle.coinPrice && (
                  <button
                    onClick={() => handlePurchase(bundle.id, 'coins')}
                    className="w-full flex justify-center items-center space-x-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-b-[4px] border-orange-700 active:translate-y-1 active:border-b-0 font-black text-sm shadow-md transition-all"
                  >
                    <Coins className="w-4 h-4 fill-amber-200 drop-shadow-md" />
                    <span className="drop-shadow-md">{bundle.coinPrice} Coins</span>
                  </button>
                )}
                {bundle.gemPrice && (
                  <button
                    onClick={() => handlePurchase(bundle.id, 'gems')}
                    className="w-full flex justify-center items-center space-x-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 border-b-[4px] border-emerald-700 active:translate-y-1 active:border-b-0 font-black text-sm shadow-md transition-all"
                  >
                    <Gem className="w-4 h-4 fill-emerald-200 drop-shadow-md" />
                    <span className="drop-shadow-md">{bundle.gemPrice} Gems</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: THEMES / COSMETICS (Direct integration of CollectionView) */}
      {activeTab === 'themes' && (
        <div className="overflow-y-auto max-h-[60vh]">
          <CollectionView onCoinsChange={onCurrencyUpdate} />
        </div>
      )}

      {/* TAB CONTENT: SPECIAL / FREE GIFTS */}
      {activeTab === 'special' && (
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1 pb-4">
          <div className="bg-slate-900/80 backdrop-blur-sm border-b-[4px] border-emerald-700 p-5 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border-b-[3px] border-emerald-600/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Gift className="w-7 h-7 animate-bounce drop-shadow-md" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-sm">
                  DAILY SANCTUARY BLESSING
                </span>
                <h3 className="text-base font-black text-white mt-1 drop-shadow-sm">Free Daily Gift Pack</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Return every 24 hours to claim 150 Free Coins & 1 Free Undo Power-up!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center space-x-2 text-xs font-black text-slate-400 drop-shadow-sm">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Status: {canClaimFreeGift ? 'Ready to Claim!' : 'Claimed for today'}</span>
              </div>

              <button
                disabled={!canClaimFreeGift}
                onClick={() => handlePurchase('shop_daily_free_gift', 'coins')}
                className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 shadow-md border-b-[4px] active:translate-y-1 active:border-b-0 ${
                  canClaimFreeGift
                    ? 'bg-emerald-500 text-slate-950 border-emerald-700 hover:bg-emerald-400'
                    : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 drop-shadow-sm" />
                <span className="drop-shadow-sm">{canClaimFreeGift ? 'CLAIM FREE GIFT' : 'CLAIMED'}</span>
              </button>
            </div>
          </div>

          {/* SPONSOR REWARDED VIDEO ADS */}
          <div className="bg-slate-900/80 backdrop-blur-sm border-b-[4px] border-amber-700 p-5 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border-b-[3px] border-amber-600/40 flex items-center justify-center text-amber-400 shadow-inner">
                <Tv className="w-7 h-7 drop-shadow-md" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-sm">
                  ADMOB SPONSOR REWARD
                </span>
                <h3 className="text-base font-black text-white mt-1 drop-shadow-sm">Watch Video for +150 Coins</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Watch a short sponsor video to earn instant sanctuary coins!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center space-x-1 text-xs font-black text-amber-300 drop-shadow-sm">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>+150 Free Coins</span>
              </div>

              <button
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  globalAdMobService.showRewardedVideo('SHOP_DAILY_COINS', () => {
                    economyService.addCoins(150);
                    setFeedback({ text: 'Earned +150 Coins from Sponsor Video!' });
                    setRefreshKey((k) => k + 1);
                    if (onCurrencyUpdate) onCurrencyUpdate();
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 shadow-md border-b-[4px] border-orange-700 active:translate-y-1 active:border-b-0"
              >
                <Play className="w-4 h-4 fill-slate-950 drop-shadow-sm" />
                <span className="drop-shadow-sm">WATCH AD</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border-b-[4px] border-indigo-700 p-5 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border-b-[3px] border-indigo-600/40 flex items-center justify-center text-indigo-400 shadow-inner">
                <Zap className="w-7 h-7 drop-shadow-md" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/40 shadow-sm">
                  TACTICAL AIRDROP
                </span>
                <h3 className="text-base font-black text-white mt-1 drop-shadow-sm">Watch Video for Free Booster</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Watch a sponsor video to claim a random tactical power-up!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center space-x-1 text-xs font-black text-indigo-300 drop-shadow-sm">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>+1 Random Booster</span>
              </div>

              <button
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  globalAdMobService.showRewardedVideo('SHOP_FREE_BOOSTER', () => {
                    const boosters: BoosterType[] = ['undo', 'shuffle', 'magnet', 'freeze', 'hint'];
                    const picked = boosters[Math.floor(Math.random() * boosters.length)];
                    economyService.addBooster(picked, 1);
                    setFeedback({ text: `Unlocked 1 Free ${picked.toUpperCase()} Booster!` });
                    setRefreshKey((k) => k + 1);
                    if (onCurrencyUpdate) onCurrencyUpdate();
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-black text-xs transition-all flex items-center space-x-1.5 shadow-md border-b-[4px] border-purple-700 active:translate-y-1 active:border-b-0"
              >
                <Play className="w-4 h-4 fill-white drop-shadow-sm" />
                <span className="drop-shadow-sm">WATCH AD</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Booster Details Popup */}
      {selectedBooster && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-t-[4px] sm:border-[4px] border-slate-700 shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800 relative z-10">
               <h3 className="font-black text-lg text-white">Booster Details</h3>
               <button 
                 onClick={() => setSelectedBooster(null)}
                 className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
               >
                 <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center overflow-y-auto space-y-5 scrollbar-none">
               {/* Big Preview */}
               <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border-[4px] border-amber-600/30 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                  <selectedBooster.Icon className="w-16 h-16 text-amber-400 drop-shadow-md z-10" />
                  <div className="absolute bottom-2 right-2 bg-slate-950/80 rounded-lg px-2 py-0.5 border border-amber-500/30 shadow-md z-10">
                    <span className="text-xs font-black text-amber-300">
                      Owned: {selectedBooster.currentQty}
                    </span>
                  </div>
               </div>

               {/* Title */}
               <div className="text-center space-y-1">
                 <h2 className="text-2xl font-black text-white drop-shadow-md">{selectedBooster.name}</h2>
                 <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                   Gameplay Booster
                 </span>
               </div>

               <p className="text-sm text-slate-300 font-medium text-center px-4 leading-relaxed">
                 {selectedBooster.description}
               </p>

               {/* Action Buttons */}
               <div className="w-full pt-4 border-t border-slate-800 flex flex-col gap-2">
                 <span className="text-center text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">Purchase Booster</span>
                 <div className="flex gap-2 w-full">
                   {selectedBooster.coinPrice && (
                     <button
                       onClick={() => {
                         handlePurchase(selectedBooster.id, 'coins');
                         setSelectedBooster(null);
                       }}
                       className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 border-b-[4px] border-amber-700 active:translate-y-1 active:border-b-0 text-slate-900 font-black text-sm transition-all shadow-md"
                     >
                       <Coins className="w-4 h-4 fill-amber-200" />
                       <span>{selectedBooster.coinPrice}</span>
                     </button>
                   )}
                   {selectedBooster.gemPrice && (
                     <button
                       onClick={() => {
                         handlePurchase(selectedBooster.id, 'gems');
                         setSelectedBooster(null);
                       }}
                       className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 border-b-[4px] border-teal-700 active:translate-y-1 active:border-b-0 text-white font-black text-sm transition-all shadow-md"
                     >
                       <Gem className="w-4 h-4 fill-emerald-200" />
                       <span>{selectedBooster.gemPrice}</span>
                     </button>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
