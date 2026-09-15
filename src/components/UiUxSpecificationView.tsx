import React, { useState } from 'react';
import {
  ALL_66_SCREENS,
  UI_COMPONENTS_LIBRARY,
  PLAYER_JOURNEYS,
  NAVIGATION_MAP,
  SCREEN_CATEGORIES,
  ScreenSpec,
  UiComponentSpec
} from '../data/phase4Data';
import {
  Search,
  Layout,
  Compass,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  WifiOff,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Smartphone,
  Cpu,
  Tv,
  Box,
  Share2,
  Info
} from 'lucide-react';

export const UiUxSpecificationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCREENS' | 'FLOW' | 'COMPONENTS' | 'JOURNEY' | 'UNITY_ARCH'>('SCREENS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedScreenId, setSelectedScreenId] = useState<string>('scr_main_menu');

  // Filtered screens
  const filteredScreens = ALL_66_SCREENS.filter(scr => {
    const matchesCategory = selectedCategory === 'ALL' || scr.category === selectedCategory;
    const matchesSearch = scr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scr.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedScreen = ALL_66_SCREENS.find(s => s.id === selectedScreenId) || ALL_66_SCREENS[4];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Header Banner */}
      <div className="max-w-7xl mx-auto mb-8 bg-gradient-to-r from-teal-900/60 via-emerald-950 to-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layout className="w-64 h-64 text-teal-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full text-xs font-semibold tracking-wider uppercase">
                Phase 04 Technical Deliverable
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-semibold">
                66/66 Screens Spec
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-300 to-amber-200">
              Complete UI/UX Design & Screen Architecture
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-3xl">
              Sanctuary Match: Tile Oasis — Full architectural layout for all 66 screens across 10 functional domains, Unity UI Canvas layering hierarchy, state management, and player flow map.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="bg-slate-900/80 border border-teal-500/30 p-3 rounded-xl text-center">
              <span className="text-xs text-slate-400 uppercase tracking-widest block">Total Defined Screens</span>
              <span className="text-2xl font-black text-teal-400">66 Screens</span>
            </div>
            <div className="bg-slate-900/80 border border-teal-500/30 p-3 rounded-xl text-center">
              <span className="text-xs text-slate-400 uppercase tracking-widest block">Categories</span>
              <span className="text-2xl font-black text-emerald-400">10 Domains</span>
            </div>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('SCREENS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'SCREENS'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            Screen Inspector (66)
          </button>
          <button
            onClick={() => setActiveTab('FLOW')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'FLOW'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            Navigation Flow Map
          </button>
          <button
            onClick={() => setActiveTab('COMPONENTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'COMPONENTS'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            UI Component Library
          </button>
          <button
            onClick={() => setActiveTab('JOURNEY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'JOURNEY'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            Player Journeys
          </button>
          <button
            onClick={() => setActiveTab('UNITY_ARCH')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'UNITY_ARCH'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Unity UI Canvas Architecture
          </button>
        </div>
      </div>

      {/* TAB 1: 66 SCREEN INSPECTOR */}
      {activeTab === 'SCREENS' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Screen Selector & Search */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[780px]">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search screen by name, ID, or purpose..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4 pb-2 border-b border-slate-800 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ALL ({ALL_66_SCREENS.length})
              </button>
              {SCREEN_CATEGORIES.map(cat => {
                const count = ALL_66_SCREENS.filter(s => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      selectedCategory === cat
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Screens List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredScreens.map(scr => {
                const isSelected = scr.id === selectedScreenId;
                return (
                  <div
                    key={scr.id}
                    onClick={() => setSelectedScreenId(scr.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/80 shadow-md shadow-teal-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-teal-400">{scr.id}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {scr.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                      {scr.name}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-teal-400 translate-x-1' : 'text-slate-600'}`} />
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">{scr.purpose}</p>
                  </div>
                );
              })}
              {filteredScreens.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No screens match your search query.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Screen Full Detailed Specification */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[780px] overflow-y-auto custom-scrollbar flex flex-col justify-between">
            <div>
              {/* Header Details */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 border border-teal-500/30 px-2.5 py-0.5 rounded">
                      {selectedScreen.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Domain: {selectedScreen.category}
                    </span>
                    {selectedScreen.backendRequired && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Database className="w-3 h-3" /> Backend API
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-slate-100">{selectedScreen.name}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Analytics Trigger</span>
                  <span className="text-xs font-mono text-amber-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 inline-block mt-1">
                    {selectedScreen.analytics}
                  </span>
                </div>
              </div>

              {/* Purpose Box */}
              <div className="mb-5 bg-slate-950/80 border border-teal-500/20 p-4 rounded-xl">
                <h4 className="text-xs uppercase tracking-widest text-teal-400 font-bold mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Functional Purpose & User Intent
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedScreen.purpose}</p>
              </div>

              {/* Navigation Matrix: Entry Points & Exit Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" /> Entry Points
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedScreen.entryPoints.map((ep, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {ep}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                  <h4 className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Exit Destinations
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedScreen.exitPoints.map((xp, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {xp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions & Controls */}
              <div className="mb-5 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h4 className="text-xs uppercase tracking-widest text-teal-400 font-bold mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> User Actions & Interaction Controls
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Primary Action (CTA)</span>
                    <span className="text-xs font-bold text-teal-300 bg-teal-950/60 px-3 py-1 rounded border border-teal-500/30 inline-block mt-0.5">
                      {selectedScreen.primaryAction}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Secondary Actions</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedScreen.secondaryActions.map((act, i) => (
                        <span key={i} className="text-xs text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Required UI Component Tree */}
              <div className="mb-5 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" /> Required UI Components
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedScreen.uiComponents.map((cmp, i) => (
                    <span key={i} className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {cmp}
                    </span>
                  ))}
                </div>
              </div>

              {/* System States Matrix (Loading, Empty, Error, Offline) */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> System Resilience States
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 font-semibold block text-[11px] text-teal-400">Loading State</span>
                    <span className="text-slate-200">{selectedScreen.loadingState}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 font-semibold block text-[11px] text-amber-400">Empty State</span>
                    <span className="text-slate-200">{selectedScreen.emptyState}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 font-semibold block text-[11px] text-rose-400">Error Handling State</span>
                    <span className="text-slate-200">{selectedScreen.errorState}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 font-semibold block text-[11px] text-blue-400">Offline Resilience</span>
                    <span className="text-slate-200">{selectedScreen.offlineState}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Data Observable Binding Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-400" />
                <span><strong className="text-slate-200">Data Requirement:</strong> {selectedScreen.dataRequired}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NAVIGATION FLOW MAP */}
      {activeTab === 'FLOW' && (
        <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-6 h-6 text-teal-400" /> Screen Transition Navigation Architecture
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Core player navigation loop linking Main Menu Hub, Gameplay Viewport, Win/Lose Screens, and sub-systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NAVIGATION_MAP.map((node) => (
              <div key={node.screenId} className="bg-slate-950 border border-teal-500/30 rounded-2xl p-5 relative">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-teal-400">{node.screenId}</span>
                  <span className="text-xs font-bold text-slate-200 bg-teal-950 border border-teal-500/40 px-2.5 py-0.5 rounded">
                    {node.screenName}
                  </span>
                </div>
                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                    Outbound Transitions ({node.destinations.length})
                  </span>
                  {node.destinations.map((dest, i) => (
                    <div key={i} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-amber-300 font-semibold block">{dest.trigger}</span>
                        <span className="text-[10px] font-mono text-slate-400">{dest.targetScreenId}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-teal-400" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Full Screen Category Distribution Chart */}
          <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-400" /> Complete 66-Screen Category Distribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {SCREEN_CATEGORIES.map(cat => {
                const count = ALL_66_SCREENS.filter(s => s.category === cat).length;
                const percentage = Math.round((count / 66) * 100);
                return (
                  <div key={cat} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-center">
                    <span className="text-xs text-slate-400 uppercase font-semibold block">{cat}</span>
                    <span className="text-2xl font-black text-teal-400 block my-1">{count}</span>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-teal-400 h-full rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">{percentage}% of total UI</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UI COMPONENT LIBRARY */}
      {activeTab === 'COMPONENTS' && (
        <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-6 h-6 text-teal-400" /> Reusable UI Component Library Specifications
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Standardized interactive UI widgets with state matrices, animation timing, and UniRx data bindings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UI_COMPONENTS_LIBRARY.map(cmp => (
              <div key={cmp.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-teal-400">{cmp.id}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {cmp.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{cmp.name}</h3>
                <p className="text-xs text-slate-300 mb-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  {cmp.purpose}
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">State Variants</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cmp.states.map((st, i) => (
                        <span key={i} className="bg-teal-950/60 border border-teal-500/30 text-teal-300 px-2.5 py-0.5 rounded text-[11px]">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Data Binding Observable</span>
                    <span className="font-mono text-amber-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 block">
                      {cmp.dataBinding}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Animation Rule</span>
                    <span className="text-slate-200 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 block">
                      {cmp.animationRule}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLAYER JOURNEYS */}
      {activeTab === 'JOURNEY' && (
        <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-6 h-6 text-teal-400" /> End-to-End Player UX Journey Stepper
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Step-by-step UX walkthrough from First Time User Experience (FTUE) to long-term retention loops.
            </p>
          </div>

          <div className="relative border-l-2 border-teal-500/40 ml-4 pl-6 space-y-8">
            {PLAYER_JOURNEYS.map(j => (
              <div key={j.step} className="relative bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <div className="absolute -left-[37px] top-5 w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-lg shadow-teal-500/30">
                  {j.step}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-500/30">
                    Phase: {j.phase.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Target Screen: {j.screenId}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{j.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">User Goal</span>
                    <span className="text-slate-200">{j.userGoal}</span>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block uppercase text-[10px] text-amber-400 mb-1">Key UX Trigger</span>
                    <span className="text-amber-200 font-medium">{j.keyUXTrigger}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: UNITY UI CANVAS ARCHITECTURE */}
      {activeTab === 'UNITY_ARCH' && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Canvas Layering Hierarchy */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Tv className="w-6 h-6 text-teal-400" /> Unity UI Canvas Layering & Stacking Priority System
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Strict Canvas sorting orders preventing UI clipping, popup double-stacking, and input blocking in Unity 3D.
            </p>

            <div className="space-y-3">
              {[
                { layer: 'Layer 0', name: 'World 3D Scene Viewport Canvas', sort: 'Sort Order: 0', desc: 'Background 3D Diorama, Water reflection camera depth, World particles.', color: 'border-slate-700 bg-slate-950' },
                { layer: 'Layer 1', name: 'Main HUD Header & Dock Canvas', sort: 'Sort Order: 100', desc: 'Persistent Player Currency Bar, Bottom Navigation Dock, Pause Button.', color: 'border-teal-500/40 bg-teal-950/30' },
                { layer: 'Layer 2', name: 'Sub-View Screens Canvas', sort: 'Sort Order: 200', desc: 'Shop, Club Hub, Event Dashboard, Profile, Level Map views.', color: 'border-emerald-500/40 bg-emerald-950/30' },
                { layer: 'Layer 3', name: 'Modal Popup Dialog Canvas', sort: 'Sort Order: 500', desc: 'Level Prep Modal, Win/Lose Screens, Starter Pack Offers, Settings.', color: 'border-amber-500/40 bg-amber-950/30' },
                { layer: 'Layer 4', name: 'System Alerts & Scrim Canvas', sort: 'Sort Order: 900', desc: 'Network Error Modal, Reconnecting Banner, Translucent Dark Scrim.', color: 'border-rose-500/40 bg-rose-950/30' },
                { layer: 'Layer 5', name: 'Global Tooltips & Loading Canvas', sort: 'Sort Order: 1000', desc: 'Universal Loading Spinner Overlay, Item Context Tooltips, Finger Tutorial Cursor.', color: 'border-purple-500/40 bg-purple-950/30' }
              ].map((l, i) => (
                <div key={i} className={`border p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${l.color}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-teal-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {l.layer}
                      </span>
                      <span className="text-xs font-mono text-amber-300 font-semibold">{l.sort}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100">{l.name}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{l.desc}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-center">
                    CanvasScaler: Match Width (1080x1920)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Architecture Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-teal-400">
                <Smartphone className="w-5 h-5" />
                <h3 className="font-bold text-slate-100">Responsive Resolution Handling</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  Reference Resolution: 1080 x 1920 (9:16 Aspect Ratio)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  Match Mode: 0.5 Width / Height balanced scaling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  Safe Area Padding: Automated notches/island insets via RectTransform anchors
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Database className="w-5 h-5" />
                <h3 className="font-bold text-slate-100">UniRx / Reactive Data Binding</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ReactiveProperty&lt;int&gt; for live Coins & Gems counters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ObservableArray for Tray Slot changes and matching triggers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  UniTask async/await for smooth asset loading & transitions
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-amber-400">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold text-slate-100">Unity Addressables Optimization</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Lazy load popups & heavy 3D tile textures on demand
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Automatic memory garbage collection on screen pop
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  TextMeshPro font static atlas with dynamic fallback
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
