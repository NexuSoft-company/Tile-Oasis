import React from 'react';
import { ROADMAP_PHASES, SCOPE_COMPARISON } from '../data/phase1Data';
import { Calendar, CheckCircle, Flag, AlertTriangle, ShieldAlert, Star, Check } from 'lucide-react';

export const RoadmapView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Phases Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Master Production Roadmap (Phases 01 - 10)</span>
          </h3>
          <p className="text-xs text-slate-400">Structured development lifecycle with explicit approval gates between major phases.</p>
        </div>

        <div className="space-y-4">
          {ROADMAP_PHASES.map((p, idx) => (
            <div key={p.phase} className="flex items-start space-x-4 p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                p.status === 'CURRENT' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {idx + 1}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{p.phase}: {p.title}</span>
                    {p.status === 'CURRENT' && (
                      <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                        ACTIVE PHASE
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{p.duration}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scope Comparison: MVP vs Full Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended MVP Scope */}
        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="font-bold text-indigo-400 text-sm flex items-center space-x-2">
              <Flag className="w-4 h-4" />
              <span>Recommended MVP Scope</span>
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">Phases 01 - 06</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            {SCOPE_COMPARISON.mvp.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Full Production Scope */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="font-bold text-emerald-400 text-sm flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Full Production LiveOps Scope</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">Phases 01 - 10</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            {SCOPE_COMPARISON.fullProduction.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical Risk Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Technical Risks & Mitigation Strategies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400">1. Unsolvable Generated Levels</span>
            <p className="text-slate-400 leading-relaxed">
              <strong>Risk:</strong> Random tile generation creates impossible dead-end board states.<br />
              <strong>Mitigation:</strong> Backward-generation algorithm + automated solver bot in CI pipeline to verify solvability.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-red-400">2. Client Memory Exploits</span>
            <p className="text-slate-400 leading-relaxed">
              <strong>Risk:</strong> Memory editing tray size or currency values locally.<br />
              <strong>Mitigation:</strong> Server-side move log verification & cryptographically signed purchase receipts.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-400">3. Low-End Device Thermal Throttling</span>
            <p className="text-slate-400 leading-relaxed">
              <strong>Risk:</strong> Over-draw from dense 3D tile stacks causing lag.<br />
              <strong>Mitigation:</strong> Object pooling, 2D mesh sprite rendering fallback mode, & static texture atlasing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
