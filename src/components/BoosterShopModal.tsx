import React, { useState } from 'react';
import { BoosterType } from '../types/gameEngine';
import { BoosterRegistry, BoosterDefinition } from '../engine/BoosterDefinition';
import { LocalEconomyService } from '../services/EconomyService';
import { BoosterService } from '../engine/BoosterService';
import { ShoppingBag, Coins, Gem, X, CheckCircle, AlertCircle, Tv } from 'lucide-react';
import { globalAdMobService } from '../services/AdMobService';

interface BoosterShopModalProps {
  initialBoosterId?: BoosterType;
  coins: number;
  gems: number;
  onClose: () => void;
  onPurchased: () => void;
}

export const BoosterShopModal: React.FC<BoosterShopModalProps> = ({
  initialBoosterId = 'undo',
  coins,
  gems,
  onClose,
  onPurchased,
}) => {
  const activeBoosters = BoosterRegistry.getActiveBoosters();
  const [selectedBoosterId, setSelectedBoosterId] = useState<BoosterType>(initialBoosterId);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const selectedDef: BoosterDefinition | null = BoosterRegistry.getDefinition(selectedBoosterId);
  const economy = new LocalEconomyService();
  const boosterService = new BoosterService(economy);

  const handlePurchase = (currency: 'coins' | 'gems') => {
    const res = boosterService.purchaseBooster(selectedBoosterId, currency);
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      onPurchased();
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  const handleFreeWithAd = () => {
    globalAdMobService.showRewardedVideo('SHOP_FREE_BOOSTER', () => {
      economy.addBooster(selectedBoosterId, 1);
      setMessage({ text: `+1 ${selectedDef?.name || 'Booster'} added to inventory!`, type: 'success' });
      onPurchased();
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-black tracking-tight text-white">Power-Up Store</h2>
        </div>

        {/* Currency Header */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2 text-amber-300 font-black text-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{coins} Coins</span>
          </div>
          <div className="flex items-center space-x-2 text-teal-300 font-black text-sm">
            <Gem className="w-4 h-4 text-teal-400" />
            <span>{gems} Gems</span>
          </div>
        </div>

        {/* Booster Selection Grid */}
        <div className="grid grid-cols-2 gap-2">
          {activeBoosters.map((b) => {
            const isSelected = b.id === selectedBoosterId;
            const currentQty = economy.getBoosterCount(b.id);
            return (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBoosterId(b.id);
                  setMessage(null);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500/20 to-teal-500/20 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{b.name}</span>
                  <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                    Owned: {currentQty}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">{b.description}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Booster Purchase Card */}
        {selectedDef && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div>
              <h3 className="font-bold text-sm text-white">{selectedDef.name}</h3>
              <p className="text-xs text-slate-400">{selectedDef.description}</p>
            </div>

            {message && (
              <div
                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-medium ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-300 border border-red-500/30'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={handleFreeWithAd}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-all active:scale-95"
              >
                <Tv className="w-4 h-4" />
                <span>GET 1 FREE (WATCH AD)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePurchase('coins')}
                  disabled={coins < selectedDef.coinCost}
                  className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all"
                >
                  <Coins className="w-4 h-4" />
                  <span>{selectedDef.coinCost} Coins</span>
                </button>

                <button
                  onClick={() => handlePurchase('gems')}
                  disabled={gems < selectedDef.gemCost}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-teal-300 border border-teal-500/30 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all"
                >
                  <Gem className="w-4 h-4 text-teal-400" />
                  <span>{selectedDef.gemCost} Gems</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
