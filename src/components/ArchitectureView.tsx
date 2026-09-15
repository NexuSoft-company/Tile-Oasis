import React, { useState } from 'react';
import { UNITY_PROJECT_STRUCTURE, BACKEND_ARCHITECTURE_SUMMARY } from '../data/phase1Data';
import { UnityFolderNode } from '../types/game';
import { Folder, FolderOpen, FileCode, Server, Database, Shield, Smartphone, Globe, Cpu, Layers } from 'lucide-react';

const UnityTreeNode: React.FC<{ node: UnityFolderNode; depth?: number }> = ({ node, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'file') {
    return (
      <div 
        style={{ paddingLeft: `${depth * 18 + 12}px` }}
        className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-slate-800/60 text-xs text-slate-300 transition-colors group cursor-pointer"
      >
        <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="font-mono text-slate-200 group-hover:text-indigo-300 font-semibold">{node.name}</span>
        {node.description && (
          <span className="text-[11px] text-slate-500 italic truncate ml-2">— {node.description}</span>
        )}
      </div>
    );
  }

  return (
    <div className="select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ paddingLeft: `${depth * 18 + 8}px` }}
        className="w-full flex items-center space-x-2 py-1.5 px-2 rounded hover:bg-slate-800/80 text-xs text-slate-200 font-bold transition-colors text-left"
      >
        {isOpen ? (
          <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <Folder className="w-4 h-4 text-amber-500 shrink-0" />
        )}
        <span className="font-mono text-amber-200">{node.name}</span>
        {node.description && (
          <span className="text-[11px] text-slate-400 font-normal truncate font-sans ml-2">({node.description})</span>
        )}
      </button>

      {isOpen && node.children && (
        <div className="border-l border-slate-800 ml-4 my-0.5">
          {node.children.map((child, idx) => (
            <UnityTreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'UNITY' | 'BACKEND'>('OVERVIEW');

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>High-Level System Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('UNITY')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'UNITY' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>Unity Client C# Structure</span>
        </button>

        <button
          onClick={() => setActiveTab('BACKEND')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'BACKEND' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Backend Microservices Layout</span>
        </button>
      </div>

      {/* Overview Diagram */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Decoupled Client-Server Production Topology</span>
            </h3>

            {/* Topology Flowchart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Client Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Unity Mobile Client (Android / iOS)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">C# Engine</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>3D Layer Occlusion Rendering</li>
                  <li>Smooth Bezier Tray Animations</li>
                  <li>Local SQLite Save & Conflict Cache</li>
                  <li>Native Audio Synthesis & DOTween VFX</li>
                  <li>OAuth Client & In-App Purchasing</li>
                </ul>
              </div>

              {/* API Gateway Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>API Gateway & Anti-Cheat</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">HTTPS / WSS</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>JWT Auth Token Verification</li>
                  <li>Rate Limiting & DDoS Shielding</li>
                  <li>Move Sequence Validation Engine</li>
                  <li>Store Purchase Receipt Proxy</li>
                  <li>WebSocket Chat Router</li>
                </ul>
              </div>

              {/* Backend Microservices & DB Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <span>Microservices & Storage</span>
                  </span>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Node / C#</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>PostgreSQL 16 (Users, Levels, Purchases)</li>
                  <li>Redis Cluster 7.0 (Chat, Tournaments)</li>
                  <li>Level Solver Bot Pipeline</li>
                  <li>Admin LiveOps Console</li>
                  <li>Firebase Push Notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unity Tree Tab */}
      {activeTab === 'UNITY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Unity Assets Directory Layout</h3>
              <p className="text-xs text-slate-400">Strict modular separation of Scripts, Prefabs, ScriptableObjects, and Services.</p>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-md font-mono">Unity 2022.3 / 6.0 LTS</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <UnityTreeNode node={UNITY_PROJECT_STRUCTURE} />
          </div>
        </div>
      )}

      {/* Backend Microservices Tab */}
      {activeTab === 'BACKEND' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Backend Microservices Specifications</h3>
            <p className="text-xs text-slate-400">{BACKEND_ARCHITECTURE_SUMMARY.architectureStyle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BACKEND_ARCHITECTURE_SUMMARY.services.map((svc, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400 text-xs flex items-center space-x-2">
                  <Server className="w-3.5 h-3.5" />
                  <span>{svc.name}</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="font-bold text-white text-xs flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Database Architecture</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {BACKEND_ARCHITECTURE_SUMMARY.databases.map((db, idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="font-bold text-emerald-400">{db.type}</span>
                  <p className="text-slate-400 mt-1">{db.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
