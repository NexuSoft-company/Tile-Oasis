/**
 * Content & Asset Management Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { ContentAssetItem, ContentAssetType } from '../../types/adminDashboard';
import { globalContentManagerService } from '../../services/admin/ContentManagerService';
import { ImageUploadField } from "./ImageUploadField";
import { compressImage } from '../../utils/imageCompressor';
import {
  Layers,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  X,
  UploadCloud,
  Check,
  Tag,
} from 'lucide-react';

interface AdminContentTabProps {
  assets: ContentAssetItem[];
  onRefresh: () => void;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({ assets, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<ContentAssetType | 'ALL'>('ALL');
  const [previewAsset, setPreviewAsset] = useState<ContentAssetItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newAssetName, setNewAssetName] = useState<string>('');
  const [newAssetType, setNewAssetType] = useState<ContentAssetType>('TILE_ARTWORK');
  const [newAssetUrl, setNewAssetUrl] = useState<string>('');
  const [newAssetTags, setNewAssetTags] = useState<string>('sanctuary, zen, new');

  const filteredAssets = (assets || []).filter(
    (a) => a && (selectedCategory === 'ALL' || a.type === selectedCategory)
  );

  const handleToggleStatus = (item: ContentAssetItem) => {
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    globalContentManagerService.updateAsset(item.id, { status: newStatus });
    onRefresh();
  };

  const handleDelete = (id: string) => {
    globalContentManagerService.deleteAsset(id);
    onRefresh();
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim() || !newAssetUrl.trim()) return;

    globalContentManagerService.addAsset({
      name: newAssetName,
      type: newAssetType,
      imageUrl: newAssetUrl,
      status: 'ACTIVE',
      tags: newAssetTags.split(',').map((t) => t.trim()),
    });

    setNewAssetName('');
    setNewAssetUrl('');
    setShowUploadModal(false);
    onRefresh();
  };

  const categories: Array<{ type: ContentAssetType; label: string }> = [
    { type: 'TILE_ARTWORK', label: 'Tile Designs' },
    { type: 'PROMOTIONAL', label: 'Promotional' },
    { type: 'BACKGROUNDS', label: 'Backgrounds' },
    { type: 'ICONS', label: 'Icons & Badges' },
    { type: 'BANNERS', label: 'Banners' },
    { type: 'EVENT_ARTWORK', label: 'Live Events' },
    { type: 'REWARD_ARTWORK', label: 'Rewards' },
    { type: 'WORLD_ARTWORK', label: 'Worlds 1-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <span>Game Content & Visual Asset Library</span>
          </h2>
          <p className="text-xs text-slate-400">
            Authoritative asset repository for triple-match tiles, sanctuary backdrops, event branding, and icons.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center space-x-1.5 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Assets ({(assets || []).length})
        </button>
        {categories.map((c) => {
          const count = (assets || []).filter((a) => a && a.type === c.type).length;
          return (
            <button
              key={c.type}
              onClick={() => setSelectedCategory(c.type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === c.type
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{c.label}</span>
              <span className="ml-1 text-[10px] font-mono opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-slate-700 transition-all"
          >
            {/* Asset Image Box */}
            <div className="relative h-36 bg-slate-950 overflow-hidden flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase shadow-sm ${
                    item.status === 'ACTIVE'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <button
                onClick={() => setPreviewAsset(item)}
                className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              >
                <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 text-xs font-bold flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Full</span>
                </div>
              </button>
            </div>

            {/* Content Details */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-teal-400 font-mono uppercase font-bold">
                  {item.type.replace('_', ' ')}
                </span>
                <h4 className="text-xs font-black text-white truncate">{item.name}</h4>
                {item.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span key={t} className="px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 text-[9px] border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all ${
                    item.status === 'ACTIVE'
                      ? 'text-amber-300 hover:bg-amber-500/10'
                      : 'text-emerald-300 hover:bg-emerald-500/10'
                  }`}
                >
                  {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition-all"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative text-slate-100">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <UploadCloud className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-black text-white">Upload / Register Visual Asset</h3>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Asset Name</label>
                <input
                  type="text"
                  required
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="e.g., Celestial Moon Orchid Tile"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Category / Type</label>
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value as ContentAssetType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c.type} value={c.type}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <ImageUploadField
                label="Upload Image Asset"
                value={newAssetUrl}
                onChange={(url) => setNewAssetUrl(url)}
                maxWidth={800}
                maxHeight={800}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newAssetTags}
                  onChange={(e) => setNewAssetTags(e.target.value)}
                  placeholder="flower, world_1, rare"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xl w-full shadow-2xl space-y-4 relative text-slate-100">
            <button
              onClick={() => setPreviewAsset(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-teal-400 font-mono uppercase font-bold">
                {previewAsset.type}
              </span>
              <h3 className="text-base font-black text-white">{previewAsset.name}</h3>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-96 flex items-center justify-center">
              <img
                src={previewAsset.imageUrl}
                alt={previewAsset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="font-mono">ID: {previewAsset.id}</span>
              <span className="font-bold text-emerald-400">Status: {previewAsset.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
