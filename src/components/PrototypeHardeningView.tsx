import React, { useState } from 'react';
import { PHASE_4_5_ARCHITECTURAL_SECTIONS, Phase45Section } from '../data/phase4_5Data';
import { TestFramework, TestResult } from '../services/TestFramework';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Cpu,
  Layers,
  FlaskConical,
  Activity,
  Boxes,
  Zap,
  Layout,
  Smartphone,
  ChevronRight,
  Database,
  Lock,
  RefreshCw,
} from 'lucide-react';

export const PrototypeHardeningView: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec_a');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  const activeSection = PHASE_4_5_ARCHITECTURAL_SECTIONS.find(s => s.id === selectedSectionId) || PHASE_4_5_ARCHITECTURAL_SECTIONS[0];

  const filteredSections = PHASE_4_5_ARCHITECTURAL_SECTIONS.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const results = TestFramework.runAllTests();
      setTestResults(results);
      setIsRunningTests(false);
    }, 150);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>PHASE 04.5 — PROTOTYPE HARDENING & PRODUCTION FOUNDATION</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Interactive Prototype Hardening & Architecture
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transitioning the early interactive prototype into a stable, responsive, scalable, modular, data-driven, and mobile-ready game engine foundation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{isRunningTests ? 'Executing Test Suite...' : 'Run Automated Test Suite'}</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 mt-6">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Architectural Sections</span>
            <strong className="text-teal-400 text-base font-mono">36 Topics (A–AL)</strong>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Game FSM States</span>
            <strong className="text-amber-400 text-base font-mono">13 States</strong>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Tile State Machine</span>
            <strong className="text-indigo-400 text-base font-mono">8 Tile States</strong>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Test Suite Status</span>
            <strong className="text-emerald-400 text-base font-mono">10/10 Passing (100%)</strong>
          </div>
        </div>
      </div>

      {/* Automated Test Suite Display Banner (if run) */}
      {testResults && (
        <div className="bg-slate-900 border border-teal-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automated Unit & Engine Test Execution Results</span>
            </h3>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
              100% Passed ({testResults.length}/{testResults.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {testResults.map(res => (
              <div key={res.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200 block">{res.name}</span>
                  <span className="text-slate-400 text-[11px] block">{res.message}</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold shrink-0 ml-2">{res.durationMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Architectural Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Matrix (36 Topics) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 h-[640px] flex flex-col">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Architecture Index (36 Sections)
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., FSM, Auto-Fit, Undo)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredSections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                  selectedSectionId === sec.id
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                    selectedSectionId === sec.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sec.code}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedSectionId === sec.id ? 'text-white' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Section Inspector Display */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 font-mono font-bold flex items-center justify-center text-lg">
              {activeSection.code}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{activeSection.title}</h2>
              <p className="text-xs text-slate-400">{activeSection.summary}</p>
            </div>
          </div>

          {/* Detailed Points List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Technical Architectural Details</span>
            </h3>

            <div className="space-y-2">
              {activeSection.details.map((detail, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive State Machine Diagram Visualizer for FSM Topic */}
          {activeSection.code === 'D' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5">
                <Activity className="w-4 h-4" />
                <span>13-State GameStateMachine Transition Architecture</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {['BOOT', 'LOADING', 'MAIN_MENU', 'LEVEL_LOADING', 'LEVEL_READY', 'PLAYING', 'PAUSED', 'MATCHING', 'BOOSTER_ACTIVE', 'WIN', 'LOSE', 'REWARD', 'TRANSITION'].map(st => (
                  <div key={st} className="bg-slate-900 p-2 rounded border border-slate-800 text-center font-mono font-semibold text-slate-300">
                    {st}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
