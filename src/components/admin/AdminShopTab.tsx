/**
 * Shop Management Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { ShopItemAdminConfig } from '../../types/adminDashboard';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  ShoppingBag,
  Coins,
  Gem,
  Package,
  Tv,
  CheckCircle2,
  XCircle,
  Tag,
  DollarSign,
  Plus,
} from 'lucide-react';

interface AdminShopTabProps {
  adminEmail: string;
  onRefresh: () => void;
}

export const AdminShopTab: React.FC<AdminShopTabProps> = ({ adminEmail, onRefresh }) => {
  const items = globalAdminService.getShopItems();
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleStatus = (item: ShopItemAdminConfig) => {
    const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    globalAdminService.updateShopItem(adminEmail, item.id, { status: nextStatus });
    setNotice(`Updated ${item.name} status to ${nextStatus}.`);
    onRefresh();
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coins':
        return <Coins className="w-5 h-5 text-amber-400" />;
      case 'Gem':
        return <Gem className="w-5 h-5 text-teal-400" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-blue-400" />;
      default:
        return <Package className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-teal-400" />
            <span>In-Game Sanctuary Shop Catalog</span>
          </h2>
          <p className="text-xs text-slate-400">
            Control coin packs, gem bundles, booster trios, promotional bundles, and free ad-based rewards.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
          Catalog Items: <strong className="text-white">{items.length}</strong>
        </span>
      </div>

      {notice && (
        <div className="p-3 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-teal-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Item Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                  {getIcon(item.icon)}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                    item.status === 'ACTIVE'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-teal-400 font-mono uppercase font-bold">
                  {item.category.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-black text-white">{item.name}</h3>
                <p className="text-xs text-amber-300 font-bold mt-1">{item.rewardDescription}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Pricing</span>
                <span className="text-base font-black text-white font-mono">
                  {item.priceUsd === 0 ? 'FREE (Watch Ad)' : `$${item.priceUsd.toFixed(2)}`}
                </span>
              </div>

              <button
                onClick={() => handleToggleStatus(item)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  item.status === 'ACTIVE'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
