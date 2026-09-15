import React, { useState } from 'react';
import { DETAILED_FEATURE_INVENTORY, SYSTEM_LIST, SCREEN_INVENTORY } from '../data/phase1Data';
import { Priority, FeatureItem } from '../types/game';
import { Search, Filter, Layers, Layout, ChevronRight, CheckCircle2, Shield, Database, Cpu, Coins, BarChart3, AlertTriangle } from 'lucide-react';

export const FeatureMatrixView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [systemFilter, setSystemFilter] = useState<string>('ALL');
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(DETAILED_FEATURE_INVENTORY[0]);

  const filteredFeatures = DETAILED_FEATURE_INVENTORY.filter(f => {
    const matchesSearch = f.featureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || f.priority === priorityFilter;
    const matchesSystem = systemFilter === 'ALL' || f.system === systemFilter;
    return matchesSearch && matchesPriority && matchesSystem;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'P0': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">P0 - Core / Required</span>;
      case 'P1': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">P1 - Full Game</span>;
      case 'P2': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">P2 - Important Expansion</span>;
      case 'P3': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">P3 - Future Optional</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search features, systems, logic..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 font-medium">Priority:</span>
            {(['ALL', 'P0', 'P1', 'P2', 'P3'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${priorityFilter === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <select
            value={systemFilter}
            onChange={(e) => setSystemFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Systems ({SYSTEM_LIST.length})</option>
            {SYSTEM_LIST.slice(0, 15).map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feature Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Features List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-3 max-h-[700px] overflow-y-auto space-y-2">
          <div className="px-2 py-1 text-xs font-semibold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Features ({filteredFeatures.length})</span>
            <span className="text-slate-500">Select to inspect specification</span>
          </div>

          {filteredFeatures.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedFeature(item)}
              className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col space-y-2 ${
                selectedFeature?.id === item.id 
                  ? 'bg-indigo-950/60 border-indigo-500/60 text-white shadow-lg shadow-indigo-950/40' 
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                  <span className="text-indigo-400 font-mono text-[10px]">{item.id}</span>
                  <span>{item.featureName}</span>
                </span>
                {getPriorityBadge(item.priority)}
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">{item.system}</span>
                <span>•</span>
                <span className="truncate">{item.screen}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Feature Specification Inspector (Adheres to user required schema) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6">
          {selectedFeature ? (
            <div className="space-y-6 text-xs text-slate-300">
              {/* Feature Header */}
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-md">
                    {selectedFeature.id} — {selectedFeature.system}
                  </span>
                  {getPriorityBadge(selectedFeature.priority)}
                </div>

                <h3 className="text-lg font-bold text-white">{selectedFeature.featureName}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{selectedFeature.purpose}</p>
              </div>

              {/* Grid Specification Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Layout className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Target Screen</span>
                  </span>
                  <p className="text-slate-400">{selectedFeature.screen}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Player Action</span>
                  </span>
                  <p className="text-slate-400">{selectedFeature.playerAction}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1 md:col-span-2">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expected Result</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed">{selectedFeature.expectedResult}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1 md:col-span-2">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Game Logic & Rules</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed font-mono text-[11px] bg-slate-900/80 p-2 rounded border border-slate-800">
                    {selectedFeature.gameLogic}
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200">Required UI</span>
                  <p className="text-slate-400">{selectedFeature.requiredUI}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200">Required Assets</span>
                  <p className="text-slate-400">{selectedFeature.requiredAssets}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>Backend & Database</span>
                  </span>
                  <p className="text-slate-400">{selectedFeature.backendRequirement}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Monetization Impact</span>
                  </span>
                  <p className="text-slate-400">{selectedFeature.monetizationRequirement}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1 md:col-span-2">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    <span>Security & Anti-Cheat Considerations</span>
                  </span>
                  <p className="text-slate-400">{selectedFeature.securityConsiderations}</p>
                </div>
              </div>

              {/* Analytics & Dependencies */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-300">Analytics Events:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedFeature.analyticsEvents.map(ev => (
                      <span key={ev} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-400">Dependencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedFeature.dependencies.map(dep => (
                      <span key={dep} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a feature from the left list to view detailed discovery specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
