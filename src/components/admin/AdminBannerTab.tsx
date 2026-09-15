/**
 * Promotional Banners & Other Apps Cross-Promotion Management Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState, useEffect } from 'react';
import { ImageUploadField } from './ImageUploadField';
import { compressImage } from '../../utils/imageCompressor';
import { PromotionalBanner, BannerType, CrossPromoApp } from '../../types/adminDashboard';
import { globalContentManagerService } from '../../services/admin/ContentManagerService';
import {
  Flag,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  Sliders,
  Gamepad2,
  Copy,
  Check,
  Star,
  Coins,
  MousePointerClick, UploadCloud,
  Layers,
} from 'lucide-react';

interface AdminBannerTabProps {
  banners: PromotionalBanner[];
  onRefresh: () => void;
}

export const AdminBannerTab: React.FC<AdminBannerTabProps> = ({ banners, onRefresh }) => {
  const [subTab, setSubTab] = useState<'BANNERS' | 'OTHER_APPS'>('OTHER_APPS');

  // Other Apps state
  const [otherApps, setOtherApps] = useState<CrossPromoApp[]>(() =>
    globalContentManagerService.getAllCrossPromoApps()
  );
  const [editingApp, setEditingApp] = useState<CrossPromoApp | null>(null);
  const [isCreatingApp, setIsCreatingApp] = useState<boolean>(false);
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);

  // App Form state
  const [appName, setAppName] = useState<string>('');
  const [packageName, setPackageName] = useState<string>('');
  const [developerName, setDeveloperName] = useState<string>('Oasis Game Studio');
  const [category, setCategory] = useState<string>('Puzzle');
  const [iconUrl, setIconUrl] = useState<string>('');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [storeUrl, setStoreUrl] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [badgeText, setBadgeText] = useState<string>('NEW');
  const [callToAction, setCallToAction] = useState<string>('Get on Google Play');
  const [appStatus, setAppStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [appPriority, setAppPriority] = useState<number>(1);
  const [rating, setRating] = useState<number>(4.8);
  const [rewardCoins, setRewardCoins] = useState<number>(200);

  // Banner states
  const [editingBanner, setEditingBanner] = useState<PromotionalBanner | null>(null);
  const [isCreatingBanner, setIsCreatingBanner] = useState<boolean>(false);

  // Banner Form states
  const [bannerName, setBannerName] = useState<string>('');
  const [bannerType, setBannerType] = useState<BannerType>('CROSS_PROMO');
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [bannerTitle, setBannerTitle] = useState<string>('');
  const [bannerDescription, setBannerDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2026-09-30');
  const [bannerStatus, setBannerStatus] = useState<'ACTIVE' | 'INACTIVE' | 'SCHEDULED'>('ACTIVE');
  const [bannerPriority, setBannerPriority] = useState<number>(1);
  const [bannerActionUrl, setBannerActionUrl] = useState<string>('');

  const refreshApps = () => {
    setOtherApps(globalContentManagerService.getAllCrossPromoApps());
  };

  // ---------------------------------------------------------------------------
  // OTHER APPS ACTIONS
  // ---------------------------------------------------------------------------

  const handleOpenCreateApp = () => {
    setAppName('');
    setPackageName('com.tileoasis.newapp');
    setDeveloperName('Oasis Game Studio');
    setCategory('Puzzle');
    setIconUrl('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80');
    setBannerUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80');
    setStoreUrl('https://play.google.com/store/apps/details?id=com.tileoasis.newapp');
    setShortDescription('An exciting new puzzle adventure with endless levels.');
    setBadgeText('NEW RELEASE');
    setCallToAction('Install on Google Play');
    setAppStatus('ACTIVE');
    setAppPriority(1);
    setRating(4.9);
    setRewardCoins(250);
    setEditingApp(null);
    setIsCreatingApp(true);
  };

  const handleOpenEditApp = (app: CrossPromoApp) => {
    setAppName(app.appName);
    setPackageName(app.packageName || '');
    setDeveloperName(app.developerName || 'Oasis Game Studio');
    setCategory(app.category);
    setIconUrl(app.iconUrl);
    setBannerUrl(app.bannerUrl);
    setStoreUrl(app.storeUrl);
    setShortDescription(app.shortDescription);
    setBadgeText(app.badgeText || '');
    setCallToAction(app.callToAction);
    setAppStatus(app.status);
    setAppPriority(app.priority);
    setRating(app.rating || 4.8);
    setRewardCoins(app.rewardCoins || 0);
    setEditingApp(app);
    setIsCreatingApp(true);
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !storeUrl.trim()) return;

    if (editingApp) {
      globalContentManagerService.updateCrossPromoApp(editingApp.id, {
        appName,
        packageName,
        developerName,
        category,
        iconUrl,
        bannerUrl,
        storeUrl,
        shortDescription,
        badgeText,
        callToAction,
        status: appStatus,
        priority: appPriority,
        rating,
        rewardCoins,
      });
    } else {
      globalContentManagerService.addCrossPromoApp({
        appName,
        packageName,
        developerName,
        category,
        iconUrl,
        bannerUrl,
        storeUrl,
        shortDescription,
        badgeText,
        callToAction,
        status: appStatus,
        priority: appPriority,
        rating,
        rewardCoins,
      });
    }

    setIsCreatingApp(false);
    setEditingApp(null);
    refreshApps();
  };

  const handleToggleAppStatus = (app: CrossPromoApp) => {
    const nextStatus = app.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    globalContentManagerService.updateCrossPromoApp(app.id, { status: nextStatus });
    refreshApps();
  };

  const handleDeleteApp = (id: string) => {
    if (window.confirm('Delete this promoted app from the showcase?')) {
      globalContentManagerService.deleteCrossPromoApp(id);
      refreshApps();
    }
  };

  const handleCopyLink = (app: CrossPromoApp) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(app.storeUrl);
      setCopiedAppId(app.id);
      setTimeout(() => setCopiedAppId(null), 2000);
    }
  };

  // ---------------------------------------------------------------------------
  // BANNER ACTIONS
  // ---------------------------------------------------------------------------

  const handleOpenCreateBanner = () => {
    setBannerName('');
    setBannerType('CROSS_PROMO');
    setBannerImageUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80');
    setBannerTitle('Try Solitaire Sanctuary: Zen Cards');
    setBannerDescription('Discover our sister game with soothing gardens and 3,000+ levels!');
    setStartDate('2026-09-01');
    setEndDate('2026-09-30');
    setBannerStatus('ACTIVE');
    setBannerPriority(1);
    setBannerActionUrl('https://play.google.com/store/apps/details?id=com.tileoasis.solitairesanctuary');
    setEditingBanner(null);
    setIsCreatingBanner(true);
  };

  const handleOpenEditBanner = (b: PromotionalBanner) => {
    setBannerName(b.name);
    setBannerType(b.type);
    setBannerImageUrl(b.imageUrl);
    setBannerTitle(b.title);
    setBannerDescription(b.description);
    setStartDate(b.startDate);
    setEndDate(b.endDate);
    setBannerStatus(b.status);
    setBannerPriority(b.priority);
    setBannerActionUrl(b.actionUrl || '');
    setEditingBanner(b);
    setIsCreatingBanner(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerName.trim() || !bannerTitle.trim()) return;

    if (editingBanner) {
      globalContentManagerService.updateBanner(editingBanner.id, {
        name: bannerName,
        type: bannerType,
        imageUrl: bannerImageUrl,
        title: bannerTitle,
        description: bannerDescription,
        startDate,
        endDate,
        status: bannerStatus,
        priority: bannerPriority,
        actionUrl: bannerActionUrl,
      });
    } else {
      globalContentManagerService.addBanner({
        name: bannerName,
        type: bannerType,
        imageUrl: bannerImageUrl,
        title: bannerTitle,
        description: bannerDescription,
        startDate,
        endDate,
        status: bannerStatus,
        priority: bannerPriority,
        actionUrl: bannerActionUrl,
      });
    }

    setIsCreatingBanner(false);
    setEditingBanner(null);
    onRefresh();
  };

  const handleToggleBannerStatus = (b: PromotionalBanner) => {
    const nextStatus = b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    globalContentManagerService.updateBanner(b.id, { status: nextStatus });
    onRefresh();
  };

  const handleDeleteBanner = (id: string) => {
    globalContentManagerService.deleteBanner(id);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Sub-Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Flag className="w-5 h-5 text-teal-400" />
            <span>Cross-Promotion & Promotional Banners</span>
          </h2>
          <p className="text-xs text-slate-400">
            Share and cross-promote your other apps, games, Google Play Store links, and in-game billboard carousels.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {subTab === 'OTHER_APPS' ? (
            <button
              onClick={handleOpenCreateApp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Other App</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateBanner}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Banner</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('OTHER_APPS')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition-all ${
            subTab === 'OTHER_APPS'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Our Other Apps ({otherApps.length})</span>
        </button>

        <button
          onClick={() => setSubTab('BANNERS')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition-all ${
            subTab === 'BANNERS'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>In-Game Banners & Carousels ({banners.length})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. OTHER APPS PORTFOLIO VIEW                                          */}
      {/* ===================================================================== */}
      {subTab === 'OTHER_APPS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherApps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                {/* Banner Preview */}
                <div className="relative h-32 bg-slate-950 overflow-hidden">
                  <img
                    src={app.bannerUrl || app.iconUrl}
                    alt={app.appName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-teal-500 text-slate-950 text-[10px] font-black uppercase">
                        {app.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          app.status === 'ACTIVE'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {app.badgeText && (
                      <span className="self-start px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                        {app.badgeText}
                      </span>
                    )}
                  </div>
                </div>

                {/* App Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <img
                        src={app.iconUrl}
                        alt={app.appName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-950"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black text-white truncate">{app.appName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono truncate">
                          {app.packageName || 'Oasis Game Studio'}
                        </p>
                        {app.rating && (
                          <div className="flex items-center space-x-1 text-[10px] text-amber-300 font-bold pt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{app.rating.toFixed(1)} Rating</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{app.shortDescription}</p>

                    {/* Stats bar */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-center space-x-1.5 text-xs text-slate-300">
                        <MousePointerClick className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>Clicks: <strong>{app.clickCount || 0}</strong></span>
                      </div>
                      <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-center space-x-1.5 text-xs text-slate-300">
                        <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Reward: <strong>+{app.rewardCoins || 0}</strong></span>
                      </div>
                    </div>

                    {/* Store Link Input / Copy */}
                    <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 truncate flex-1 font-mono pl-1">
                        {app.storeUrl}
                      </span>
                      <button
                        onClick={() => handleCopyLink(app)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Copy Store Link"
                      >
                        {copiedAppId === app.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => window.open(app.storeUrl, '_blank')}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-teal-300"
                        title="Open in Play Store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleAppStatus(app)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all ${
                        app.status === 'ACTIVE'
                          ? 'text-amber-300 hover:bg-amber-500/10'
                          : 'text-emerald-300 hover:bg-emerald-500/10'
                      }`}
                    >
                      {app.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditApp(app)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit App Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteApp(app.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400"
                        title="Delete App"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. PROMOTIONAL BANNERS CAROUSEL VIEW                                  */}
      {/* ===================================================================== */}
      {subTab === 'BANNERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              {/* Banner Media */}
              <div className="relative h-40 bg-slate-950 overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-teal-500 text-slate-950 text-[10px] font-black uppercase shadow-md">
                      {b.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-md ${
                        b.status === 'ACTIVE'
                          ? 'bg-emerald-500 text-slate-950'
                          : b.status === 'SCHEDULED'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                      Priority #{b.priority}
                    </span>
                    <h4 className="text-sm font-black text-white truncate">{b.title}</h4>
                  </div>
                </div>
              </div>

              {/* Banner Description & Scheduling */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-300 line-clamp-2">{b.description}</p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono pt-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{b.startDate} → {b.endDate}</span>
                  </div>
                  {b.actionUrl && (
                    <div className="flex items-center space-x-1 text-[10px] text-teal-300 font-mono truncate">
                      <ExternalLink className="w-3 h-3 text-teal-400 shrink-0" />
                      <span className="truncate">{b.actionUrl}</span>
                    </div>
                  )}
                </div>

                {/* Action Toolbar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleBannerStatus(b)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all ${
                      b.status === 'ACTIVE'
                        ? 'text-amber-300 hover:bg-amber-500/10'
                        : 'text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    {b.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditBanner(b)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. MODAL: ADD / EDIT OTHER APP                                        */}
      {/* ===================================================================== */}
      {isCreatingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-teal-400" />
                <span>{editingApp ? 'Edit Promoted App' : 'Add New Other App / Game'}</span>
              </h3>
              <button
                onClick={() => setIsCreatingApp(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveApp} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">App Name</label>
                  <input
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., Solitaire Sanctuary"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Puzzle, Card, Casual"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Package Name</label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="com.example.app"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Developer / Studio</label>
                  <input
                    type="text"
                    value={developerName}
                    onChange={(e) => setDeveloperName(e.target.value)}
                    placeholder="Oasis Game Studio"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Google Play Store URL / Download Link</label>
                <input
                  type="url"
                  required
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ImageUploadField
                  label="Icon Image Upload"
                  value={iconUrl}
                  onChange={(url) => setIconUrl(url)}
                  maxWidth={300}
                  maxHeight={300}
                />
                <ImageUploadField
                  label="Banner Image Upload"
                  value={bannerUrl}
                  onChange={(url) => setBannerUrl(url)}
                  maxWidth={800}
                  maxHeight={450}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Tell players why they should try this game..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Badge Text</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="NEW, HOT, 4.9 ★"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Call to Action</label>
                  <input
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="Install Now, Play Free"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Star Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value) || 4.8)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Coin Bonus Incentive</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={rewardCoins}
                    onChange={(e) => setRewardCoins(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 200"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Priority (1 = Highest)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={appPriority}
                    onChange={(e) => setAppPriority(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingApp(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black"
                >
                  {editingApp ? 'Save App Changes' : 'Publish to Showcase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. MODAL: ADD / EDIT BANNER                                           */}
      {/* ===================================================================== */}
      {isCreatingBanner && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Flag className="w-5 h-5 text-teal-400" />
                <span>{editingBanner ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}</span>
              </h3>
              <button
                onClick={() => setIsCreatingBanner(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Internal Reference Name</label>
                <input
                  type="text"
                  required
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  placeholder="e.g., Cross-Promo Solitaire Banner"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Banner Type</label>
                  <select
                    value={bannerType}
                    onChange={(e) => setBannerType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="CROSS_PROMO">CROSS_PROMO (Other App / Store)</option>
                    <option value="EVENT">EVENT</option>
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="SHOP">SHOP</option>
                    <option value="REWARD">REWARD</option>
                    <option value="SEASONAL">SEASONAL</option>
                    <option value="HOME">HOME</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Status</label>
                  <select
                    value={bannerStatus}
                    onChange={(e) => setBannerStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                  </select>
                </div>
              </div>

              <ImageUploadField
                label="Promotional Image Upload"
                value={bannerImageUrl}
                onChange={(url) => setBannerImageUrl(url)}
                maxWidth={800}
                maxHeight={800}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Display Title</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g., Try Solitaire Sanctuary: Zen Cards"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Description</label>
                <textarea
                  required
                  rows={2}
                  value={bannerDescription}
                  onChange={(e) => setBannerDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Priority (1 = Highest)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={bannerPriority}
                    onChange={(e) => setBannerPriority(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Target Action URL (Store or Modal)</label>
                  <input
                    type="text"
                    value={bannerActionUrl}
                    onChange={(e) => setBannerActionUrl(e.target.value)}
                    placeholder="https://play.google.com/..., #shop, #event"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingBanner(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black"
                >
                  {editingBanner ? 'Save Changes' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
