import React, { useState, useEffect } from 'react';
import { PlayerAppContainer } from './components/PlayerAppContainer';
import { HardenedTileGameEngine } from './components/HardenedTileGameEngine';
import { PrototypeHardeningView } from './components/PrototypeHardeningView';
import { FeatureMatrixView } from './components/FeatureMatrixView';
import { ArchitectureView } from './components/ArchitectureView';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { RoadmapView } from './components/RoadmapView';
import { GddAndArchitectureView } from './components/GddAndArchitectureView';
import { UiUxSpecificationView } from './components/UiUxSpecificationView';
import { LevelPreviewDevTool } from './components/LevelPreviewDevTool';
import { RuntimeDevTool } from './components/RuntimeDevTool';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { globalAdminAuthService } from './services/admin/AdminAuthService';
import { globalNotificationService } from './services/LocalNotificationService';
import { AdminSession } from './types/adminDashboard';
import {
  Gamepad2,
  ListTree,
  Layers,
  Database,
  Calendar,
  ShieldCheck,
  BookOpen,
  Layout,
  Cpu,
  X,
  Code,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

export default function App() {
  // Check if URL search params request dev mode or admin mode (e.g., ?dev=true or ?admin=true)
  const [devModeActive, setDevModeActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('dev') === 'true';
    }
    return false;
  });

  const [appMode, setAppMode] = useState<'GAME' | 'ADMIN'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true' || params.get('mode') === 'admin';
    }
    return false;
  });

  // Enforce zero auto-login: Always require explicit Secret Key & Password authentication!
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    // Initialize Local Notifications for the player
    globalNotificationService.initialize();
  }, []);

  const [devTab, setDevTab] = useState<
    | 'LEVEL_FACTORY'
    | 'ENGINE'
    | 'SPECS'
    | 'UIUX'
    | 'GDD'
    | 'FEATURES'
    | 'ARCHITECTURE'
    | 'DATABASE'
    | 'ROADMAP'
  >('LEVEL_FACTORY');

  const [devDrawerOpen, setDevDrawerOpen] = useState<boolean>(false);

  // Secret Hotkey Handlers:
  // - Ctrl+Shift+D or Cmd+Shift+D: Dev Tools Drawer
  // - Ctrl+Shift+A or Cmd+Shift+A: Master Admin & Super Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          setDevModeActive((prev) => !prev);
          setDevDrawerOpen(true);
        } else if (e.key.toLowerCase() === 'a') {
          e.preventDefault();
          setAppMode((prev) => (prev === 'ADMIN' ? 'GAME' : 'ADMIN'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // MASTER ADMIN & SUPER ADMIN VIEWPORT
  if (appMode === 'ADMIN') {
    if (adminSession) {
      return (
        <AdminLayout
          session={adminSession}
          onLogout={() => {
            globalAdminAuthService.clearSession();
            setAdminSession(null);
          }}
          onExitToGame={() => {
            setAdminSession(null);
            setAppMode('GAME');
          }}
        />
      );
    }
    return (
      <AdminLoginView
        onLoginSuccess={(session) => {
          setAdminSession(session);
        }}
        onExitToGame={() => setAppMode('GAME')}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] h-[100dvh] sm:h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans selection:bg-teal-500 selection:text-white p-0 sm:p-4 relative overflow-hidden">
      {/* PURE PLAYER GAME CONTAINER (PRODUCTION DEFAULT) */}
      <div className="w-full h-full sm:h-[844px] max-w-md my-auto flex items-center justify-center">
        <PlayerAppContainer
          initialDevMode={devModeActive}
          onOpenDevMode={() => {
            setDevModeActive(true);
            setDevDrawerOpen(true);
          }}
          onOpenAdmin={() => setAppMode('ADMIN')}
        />
      </div>

      {/* INTERNAL DEVELOPER OVERLAY (ONLY SHOWN WHEN SECRETLY UNLOCKED) */}
      {devModeActive && devDrawerOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-50 flex flex-col p-4 md:p-6 overflow-hidden animate-in fade-in">
          {/* Internal Dev Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black text-white">Internal Developer Tools & Specs</h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                DEVELOPER MODE ACTIVE
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setDevDrawerOpen(false);
                  setAppMode('ADMIN');
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all flex items-center space-x-1.5 text-xs font-black shadow-md shadow-teal-500/20"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Open Admin Portal</span>
              </button>

              <button
                onClick={() => setDevDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center space-x-1 text-xs font-bold"
              >
                <X className="w-4 h-4" />
                <span>Back to Game</span>
              </button>
            </div>
          </div>

          {/* Internal Dev Navigation Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-3 mb-4 border-b border-slate-800/80 shrink-0">
            <button
              onClick={() => setDevTab('LEVEL_FACTORY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'LEVEL_FACTORY'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Level Factory & Pipeline</span>
            </button>

            <button
              onClick={() => setDevTab('RUNTIME_DELIVERY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'RUNTIME_DELIVERY'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Runtime Delivery (Phase 09)</span>
            </button>

            <button
              onClick={() => setDevTab('ENGINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'ENGINE'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Hardened Engine & Console</span>
            </button>

            <button
              onClick={() => setDevTab('SPECS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'SPECS'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Hardening Specs (A–AL)</span>
            </button>

            <button
              onClick={() => setDevTab('UIUX')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'UIUX'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>UI/UX Specs</span>
            </button>

            <button
              onClick={() => setDevTab('GDD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'GDD'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>GDD & Tech Specs</span>
            </button>

            <button
              onClick={() => setDevTab('FEATURES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'FEATURES'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Feature Matrix</span>
            </button>

            <button
              onClick={() => setDevTab('ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'ARCHITECTURE'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => setDevTab('DATABASE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'DATABASE'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database Schemas</span>
            </button>

            <button
              onClick={() => setDevTab('ROADMAP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                devTab === 'ROADMAP'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>
          </div>

          {/* Internal Dev Body View */}
          <div className="flex-1 overflow-y-auto">
            {devTab === 'LEVEL_FACTORY' && <LevelPreviewDevTool />}
            {devTab === 'RUNTIME_DELIVERY' && <RuntimeDevTool />}
            {devTab === 'ENGINE' && (
              <div className="h-[650px]">
                <HardenedTileGameEngine />
              </div>
            )}
            {devTab === 'SPECS' && <PrototypeHardeningView />}
            {devTab === 'UIUX' && <UiUxSpecificationView />}
            {devTab === 'GDD' && <GddAndArchitectureView />}
            {devTab === 'FEATURES' && <FeatureMatrixView />}
            {devTab === 'ARCHITECTURE' && <ArchitectureView />}
            {devTab === 'DATABASE' && <DatabaseSchemaView />}
            {devTab === 'ROADMAP' && <RoadmapView />}
          </div>
        </div>
      )}
    </div>
  );
}


