/**
 * Comprehensive Design Tokens & Reusable UI Classes
 * Professional Production UI/UX System for Sanctuary Match 3
 * Phase 22 Mobile-First AAA Presentation Architecture
 */

export const DesignTokens = {
  // Color Palette Tokens
  colors: {
    canvas: 'bg-slate-950',
    canvasGradient: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950',
    surface: 'bg-slate-900',
    surfaceSubtle: 'bg-slate-900/80',
    surfaceGlass: 'bg-slate-900/90 backdrop-blur-md',
    surfaceElevated: 'bg-slate-800/90',
    card: 'bg-slate-900 border border-slate-800/80 rounded-2xl',
    cardElevated: 'bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl',
    cardInteractive:
      'bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 active:scale-[0.98] transition-all cursor-pointer rounded-2xl',
    border: 'border-slate-800',
    borderLight: 'border-slate-700/80',
    borderAccent: 'border-teal-500/30',

    // Status & Feedback Colors
    primary: {
      gradient: 'bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600',
      text: 'text-teal-400',
      bgSubtle: 'bg-teal-500/10 border border-teal-500/30 text-teal-300',
      ring: 'ring-teal-400/50',
    },
    accent: {
      gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600',
      text: 'text-indigo-400',
      bgSubtle: 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300',
    },
    gold: {
      gradient: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500',
      text: 'text-amber-400',
      bgSubtle: 'bg-amber-500/10 border border-amber-500/30 text-amber-300',
    },
    danger: {
      gradient: 'bg-gradient-to-r from-rose-500 to-red-600',
      text: 'text-rose-400',
      bgSubtle: 'bg-rose-500/10 border border-rose-500/30 text-rose-300',
    },
    cyan: {
      gradient: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      text: 'text-cyan-400',
      bgSubtle: 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300',
    },
    locked: {
      bg: 'bg-slate-900/60',
      border: 'border-slate-800/80',
      text: 'text-slate-500',
    },
  },

  // Typography Tokens
  typography: {
    titleDisplay: 'text-2xl sm:text-3xl font-black text-white tracking-tight',
    titleSection: 'text-lg sm:text-xl font-black text-white tracking-tight',
    titleModal: 'text-xl sm:text-2xl font-black text-white tracking-tight',
    titleCard: 'text-sm font-extrabold text-white',
    subtitle: 'text-xs text-slate-400 font-medium',
    caption: 'text-[10px] sm:text-[11px] text-slate-400 font-semibold tracking-wide uppercase',
    numberMono: 'font-mono font-black text-white',
    numberStat: 'font-mono text-base font-extrabold text-white',
    labelEyebrow: 'text-[10px] font-black uppercase tracking-widest',
  },

  // Standardized Button System (Min 44px touch targets on mobile)
  buttons: {
    primary:
      'w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-teal-300/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 select-none',
    secondary:
      'w-full min-h-[44px] py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm hover:text-white active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md select-none',
    gold:
      'w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-amber-200/50 cursor-pointer select-none',
    danger:
      'w-full min-h-[44px] py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-rose-400/40 cursor-pointer select-none',
    iconCircle:
      'w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-sm shrink-0 select-none',
    iconPill:
      'min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition-all flex items-center space-x-1.5 text-xs font-bold shrink-0 select-none',
  },

  // Modal Dialog Container Tokens
  modals: {
    backdrop:
      'fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in duration-200',
    container:
      'relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-100',
    closeButton:
      'absolute top-4 right-4 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20',
  },

  // Difficulty Badges
  difficultyBadges: {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Normal: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    Medium: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    Hard: 'bg-amber-500/20 text-amber-400 border-amber-500/30 font-bold',
    'Very Hard': 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-black',
    Expert: 'bg-rose-500/25 text-rose-400 border-rose-500/50 font-black animate-pulse',
  },

  // Special Mechanics Badge Tokens (Standardized visual system)
  mechanicBadges: {
    rainbow: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-white/60 shadow-purple-500/30',
    golden: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-yellow-200 shadow-amber-500/30',
    bomb: 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-300 shadow-rose-600/30',
    key: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-200 shadow-amber-500/30',
    frozen: 'bg-cyan-950/80 border-cyan-400/80 text-cyan-200',
    chained: 'bg-slate-950/80 border-amber-500/60 text-amber-300',
  },

  // Tile 3D Visual Tokens
  tiles: {
    unblocked: 'border-white/40 shadow-black/80 shadow-2xl cursor-pointer hover:scale-105 active:scale-95',
    blocked: 'bg-slate-800/90 border-slate-700/80 text-slate-500 opacity-60 grayscale-[35%] cursor-not-allowed shadow-none',
    topHighlight: 'absolute top-0 inset-x-0 h-1.5 bg-white/35 rounded-t-2xl pointer-events-none',
    bottomShadow: 'absolute bottom-0 inset-x-0 h-2 bg-black/35 rounded-b-2xl pointer-events-none',
  },

  // Holding Tray Tokens
  tray: {
    containerNormal: 'bg-slate-950/80 border-slate-800 shadow-inner',
    containerWarning: 'bg-slate-950/90 border-amber-500/80 shadow-amber-500/20 animate-tray-warning',
    containerDanger: 'bg-slate-950/90 border-rose-500/90 shadow-rose-500/30 animate-pulse',
    slotEmpty: 'bg-slate-900/60 border-slate-800/80 shadow-inner',
    slotOccupied: 'border-white/40 shadow-lg transform scale-105',
  },

  // Mobile Ergonomics & Safe Areas
  layout: {
    minTouchTarget: 'min-w-[44px] min-h-[44px]',
    optimalTouchTarget: 'min-w-[48px] min-h-[48px]',
    safeTopPadding: 'pt-[max(env(safe-area-inset-top),16px)]',
    safeBottomPadding: 'pb-[max(env(safe-area-inset-bottom),16px)]',
    cardPadding: 'p-3.5 sm:p-4',
    screenContainer: 'w-full max-w-md mx-auto h-full flex flex-col',
  },
};

