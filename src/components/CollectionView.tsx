import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Award,
  Crown,
  Layers,
  Lock,
  Check,
  CheckCircle2,
  Coins,
  Gem,
  Palette,
  Shield,
  Bookmark,
  Compass,
  X,
} from 'lucide-react';
import { CollectibleCategory, CollectibleItem } from '../types/collection';
import { CollectionService, globalCollectionService } from '../services/CollectionService';
import { LocalEconomyService } from '../services/EconomyService';
import { globalAudioService } from '../services/AudioService';

interface CollectionViewProps {
  onClose?: () => void;
  onCoinsChange?: () => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({ onClose, onCoinsChange }) => {
  const collectionService = globalCollectionService;
  const economyService = new LocalEconomyService();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'catalog' | 'equipped'>('catalog');
  const [stateVersion, setStateVersion] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; isError?: boolean } | null>(null);
  const [selectedItem, setSelectedItem] = useState<CollectibleItem | null>(null);

  const collectionState = useMemo(() => {
    return collectionService.getCollectionState();
  }, [collectionService, stateVersion]);

  const allItems = useMemo(() => {
    return collectionService.getAllCollectibles();
  }, [collectionService]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return allItems || [];
    return (allItems || []).filter((i) => i && i.category === selectedCategory);
  }, [allItems, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tile_theme':
        return <Palette className="w-8 h-8 opacity-80 text-white drop-shadow-md" />;
      case 'tile_skin':
        return <Layers className="w-8 h-8 opacity-80 text-white drop-shadow-md" />;
      case 'board_theme':
        return <LayoutGrid className="w-8 h-8 opacity-80 text-white drop-shadow-md" />;
      case 'player_frame':
        return <Shield className="w-8 h-8 opacity-80 text-white drop-shadow-md" />;
      default:
        return <Award className="w-8 h-8 opacity-80 text-white drop-shadow-md" />;
    }
  };

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Items', icon: LayoutGrid },
    { id: 'tile_theme', label: 'Tile Sets', icon: Palette },
    { id: 'tile_skin', label: 'Tile Skins', icon: Layers },
    { id: 'board_theme', label: 'Board Realms', icon: Bookmark },
    { id: 'player_frame', label: 'Player Frames', icon: Compass },
    { id: 'special_badge', label: 'Badges', icon: Award },
    { id: 'world_memory', label: 'Memories', icon: Crown },
  ];

  const handleEquip = (itemId: string) => {
    const success = collectionService.equipItem(itemId);
    if (success) {
      globalAudioService.emit('ButtonPressed');
      setFeedback({ text: 'Customization equipped successfully!' });
      setStateVersion((v) => v + 1);
    } else {
      setFeedback({ text: 'Failed to equip item.', isError: true });
    }
  };

  const handlePurchase = (itemId: string, currency: 'coins' | 'gems') => {
    const result = collectionService.purchaseItem(itemId, currency);
    if (result.success) {
      globalAudioService.emit('RewardReceived');
      setFeedback({ text: result.message });
      setStateVersion((v) => v + 1);
      if (onCoinsChange) onCoinsChange();
    } else {
      setFeedback({ text: result.message, isError: true });
    }
  };

  const coins = economyService.getCoins();
  const gems = economyService.getGems();

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 border-amber-300';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-300';
      case 'rare':
        return 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 border-teal-300';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full text-slate-100 sm:rounded-3xl rounded-none shadow-2xl relative select-none font-sans overflow-hidden border border-emerald-600/30"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(2, 6, 23, 0.98)), url(/feature-graphic.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#020617', // fallback
      }}
    >
      {/* Header Bar */}
      <div className="bg-slate-950/80 border-b-2 border-emerald-600/50 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0 z-10 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 border-b-[4px] border-indigo-800">
            <Palette className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <div className="drop-shadow-md">
            <h1 className="text-xl font-black text-white tracking-tight">Collection Vault</h1>
            <p className="text-xs text-emerald-200/80 font-black tracking-wide">CUSTOMIZE YOUR SANCTUARY</p>
          </div>
        </div>

        {/* Currency Pill */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border-b-2 border-slate-700 px-3 py-1.5 rounded-2xl shadow-inner">
          <div className="flex items-center space-x-1.5 text-amber-400 font-black text-sm drop-shadow-md">
            <Coins className="w-4 h-4 fill-amber-400/20" />
            <span>{coins}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-teal-400 font-black text-sm drop-shadow-md">
            <Gem className="w-4 h-4 fill-teal-400/20" />
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

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-hidden">
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

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none px-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  setSelectedCategory(cat.id);
                  setFeedback(null);
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all shadow-md border-b-[4px] active:translate-y-1 active:border-b-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-indigo-700 text-white'
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'drop-shadow-sm' : ''}`} />
                <span className={isSelected ? 'drop-shadow-sm tracking-wide' : ''}>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto pb-6 pt-1 flex-1 px-1 scrollbar-none">
           {filteredItems.map((item) => {
            const isUnlocked = collectionState.unlockedItemIds.includes(item.id);
            const isOwned = collectionState.ownedItemIds.includes(item.id);
            const isEquipped = collectionService.isItemEquipped(item.id);

            return (
              <button
                key={item.id}
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  setSelectedItem(item);
                }}
                className={`relative aspect-square rounded-2xl border-b-[4px] transition-all flex flex-col overflow-hidden backdrop-blur-sm shadow-lg active:translate-y-1 active:border-b-0 ${
                  isEquipped
                    ? 'bg-gradient-to-b from-emerald-900/60 to-slate-900/95 border-emerald-500/60 border-b-teal-600'
                    : isOwned
                    ? 'bg-slate-800/90 border-slate-600/80 border-b-slate-700'
                    : isUnlocked
                    ? 'bg-slate-900/80 border-slate-700/50 border-b-slate-800 hover:bg-slate-800/90'
                    : 'bg-slate-950/90 border-slate-800/40 border-b-slate-900 opacity-80'
                }`}
              >
                {/* Background Color Fill */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${item.previewColor || 'from-slate-700 to-slate-800'} opacity-30`}
                />

                {/* Dark overlay for locked items */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 pt-4">
                    <Lock className="w-8 h-8 text-slate-400 drop-shadow-md mb-2" />
                  </div>
                )}
                
                {/* Equipped Badge */}
                {isEquipped && (
                  <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-sm rounded-full p-1 shadow-md border border-emerald-300 z-10">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Rarity Badge (Top Left) */}
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded border shadow-sm ${getRarityBadge(
                      item.rarity
                    )}`}
                  >
                    {item.rarity}
                  </span>
                </div>

                {/* Center Icon */}
                <div className="flex-1 w-full flex items-center justify-center z-0">
                  {getCategoryIcon(item.category)}
                </div>

                {/* Title overlay */}
                <div className="bg-slate-950/80 w-full py-1.5 px-2 z-10 border-t border-white/5">
                  <span className="font-black text-[11px] text-white drop-shadow-sm leading-tight line-clamp-1 w-full">
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Details Popup */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-t-[4px] sm:border-[4px] border-slate-700 shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800 relative z-10">
               <h3 className="font-black text-lg text-white">Item Details</h3>
               <button 
                 onClick={() => setSelectedItem(null)}
                 className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
               >
                 <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center overflow-y-auto space-y-5 scrollbar-none">
               {/* Big Preview */}
               <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${selectedItem.previewColor || 'from-slate-700 to-slate-800'} border-[4px] border-slate-700 shadow-inner flex items-center justify-center relative overflow-hidden`}>
                  {getCategoryIcon(selectedItem.category)}
                  {!collectionState.unlockedItemIds.includes(selectedItem.id) && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                      <Lock className="w-12 h-12 text-slate-400 drop-shadow-md" />
                    </div>
                  )}
               </div>

               {/* Title & Category & Rarity */}
               <div className="text-center space-y-1">
                 <h2 className="text-2xl font-black text-white drop-shadow-md">{selectedItem.name}</h2>
                 <div className="flex items-center justify-center gap-2">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-wide">
                     {categories.find(c => c.id === selectedItem.category)?.label || 'Item'}
                   </span>
                   <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border shadow-sm ${getRarityBadge(selectedItem.rarity)}`}>
                     {selectedItem.rarity}
                   </span>
                 </div>
               </div>

               <p className="text-sm text-slate-300 font-medium text-center px-4 leading-relaxed">
                 {selectedItem.description}
               </p>

               {/* Action Buttons */}
               <div className="w-full pt-4 border-t border-slate-800 flex flex-col gap-3">
                 {!collectionState.unlockedItemIds.includes(selectedItem.id) ? (
                    <div className="w-full bg-slate-950/60 rounded-2xl py-3 px-4 flex flex-col items-center justify-center border border-slate-800/80">
                      <Lock className="w-5 h-5 text-amber-500/60 mb-1" />
                      <span className="text-xs text-amber-500/90 font-black text-center uppercase tracking-wider">
                        {selectedItem.unlockRequirement.description}
                      </span>
                    </div>
                 ) : collectionService.isItemEquipped(selectedItem.id) ? (
                    <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 font-black text-sm text-center shadow-inner">
                      EQUIPPED
                    </div>
                 ) : collectionState.ownedItemIds.includes(selectedItem.id) ? (
                    (selectedItem.category === 'tile_theme' || selectedItem.category === 'tile_skin' || selectedItem.category === 'board_theme' || selectedItem.category === 'player_frame') ? (
                      <button
                        onClick={() => {
                          handleEquip(selectedItem.id);
                          setSelectedItem(null);
                        }}
                        className="w-full py-4 rounded-2xl bg-slate-700 hover:bg-slate-600 border-b-[4px] border-slate-800 active:translate-y-1 active:border-b-0 text-white font-black text-sm transition-all shadow-md"
                      >
                        EQUIP
                      </button>
                    ) : (
                      <div className="w-full py-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 text-teal-400/80 font-black text-sm text-center shadow-inner">
                        UNLOCKED
                      </div>
                    )
                 ) : (
                    // Can Purchase
                    <div className="flex flex-col gap-2 w-full">
                      <span className="text-center text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">Purchase Item</span>
                      <div className="flex gap-2">
                        {selectedItem.coinPrice && (
                          <button
                            onClick={() => {
                              handlePurchase(selectedItem.id, 'coins');
                              setSelectedItem(null);
                            }}
                            className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 border-b-[4px] border-amber-700 active:translate-y-1 active:border-b-0 text-slate-900 font-black text-sm transition-all shadow-md"
                          >
                            <Coins className="w-4 h-4 fill-amber-200" />
                            <span>{selectedItem.coinPrice}</span>
                          </button>
                        )}
                        {selectedItem.gemPrice && (
                          <button
                            onClick={() => {
                              handlePurchase(selectedItem.id, 'gems');
                              setSelectedItem(null);
                            }}
                            className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 border-b-[4px] border-teal-700 active:translate-y-1 active:border-b-0 text-white font-black text-sm transition-all shadow-md"
                          >
                            <Gem className="w-4 h-4 fill-emerald-200" />
                            <span>{selectedItem.gemPrice}</span>
                          </button>
                        )}
                      </div>
                    </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
