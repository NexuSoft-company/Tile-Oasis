import React, { useState, useEffect } from 'react';
import { Flame, Zap, Coins, Clock, ChevronRight, Gift } from 'lucide-react';
import { LiveOpsConfigService } from '../services/LiveOpsConfigService';
import { LiveOpsEventConfig } from '../types/liveOps';
import { LiveOpsEventModal } from './LiveOpsEventModal';
import { globalAudioService } from '../services/AudioService';

interface LiveOpsEventBannerProps {
  onNavigateToShop?: () => void;
  compact?: boolean;
}

export const LiveOpsEventBanner: React.FC<LiveOpsEventBannerProps> = ({
  onNavigateToShop,
  compact = false,
}) => {
  const [activeEvents, setActiveEvents] = useState<LiveOpsEventConfig[]>(() =>
    LiveOpsConfigService.getInstance().getActiveEvents()
  );
  const [selectedEvent, setSelectedEvent] = useState<LiveOpsEventConfig | null>(null);

  useEffect(() => {
    const unsub = LiveOpsConfigService.getInstance().subscribe(() => {
      setActiveEvents(LiveOpsConfigService.getInstance().getActiveEvents());
    });
    return unsub;
  }, []);

  if (!activeEvents || activeEvents.length === 0) {
    return null; // Gracefully hide when no live-ops events are active
  }

  const primaryEvent = activeEvents[0];

  const handleBannerClick = () => {
    globalAudioService.emit('ButtonPressed');
    setSelectedEvent(primaryEvent);
  };

  if (compact) {
    return (
      <>
        <button
          onClick={handleBannerClick}
          className="w-full bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border border-amber-500/40 hover:border-amber-400/60 p-2 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] shadow-md group"
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-amber-300 truncate">{primaryEvent.name}</span>
                {primaryEvent.coinMultiplier > 1 && (
                  <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                    {primaryEvent.coinMultiplier}x Coins
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <LiveOpsEventModal
          event={selectedEvent || primaryEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onNavigateToShop={onNavigateToShop}
        />
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleBannerClick}
        className="w-full bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/60 border border-amber-500/40 hover:border-amber-400/60 p-3 rounded-2xl cursor-pointer transition-all active:scale-[0.99] shadow-lg relative overflow-hidden group select-none"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  EVENT LIVE
                </span>
                <span className="text-xs font-black text-white">{primaryEvent.name}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">{primaryEvent.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {primaryEvent.coinMultiplier > 1 && (
              <div className="hidden sm:flex items-center space-x-1 bg-amber-500/20 border border-amber-500/40 px-2 py-1 rounded-xl text-amber-300 text-xs font-black">
                <Coins className="w-3.5 h-3.5" />
                <span>{primaryEvent.coinMultiplier}x</span>
              </div>
            )}
            <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <LiveOpsEventModal
        event={selectedEvent || primaryEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onNavigateToShop={onNavigateToShop}
      />
    </>
  );
};
