import React, { useEffect, useState } from 'react';
import { GameNotification } from '../types/metaProgression';
import { globalNotificationService } from '../services/NotificationService';
import {
  Bell,
  Flame,
  Trophy,
  Award,
  Calendar,
  Coins,
  CheckCircle2,
  Lock,
  Zap,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';

export const NotificationBanner: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<GameNotification | null>(null);

  useEffect(() => {
    const unsubscribe = globalNotificationService.subscribe((notification) => {
      setActiveNotification(notification);
      const timer = setTimeout(() => {
        setActiveNotification((current) => (current?.id === notification.id ? null : current));
      }, 4000);
      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  if (!activeNotification) return null;

  const getIcon = () => {
    switch (activeNotification.type) {
      case 'daily_reward_ready':
        return <Calendar className="w-5 h-5 text-amber-400" />;
      case 'mission_completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'achievement_completed':
        return <Trophy className="w-5 h-5 text-amber-300" />;
      case 'milestone_completed':
        return <Award className="w-5 h-5 text-indigo-400" />;
      case 'booster_earned':
        return <Zap className="w-5 h-5 text-teal-300" />;
      case 'rank_up':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'event_started':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'purchase_success':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'purchase_failure':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in slide-in-from-top duration-300">
      <div className="bg-slate-900/95 border border-teal-500/40 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 text-white">
        <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 text-left min-w-0">
          <h4 className="text-xs font-black text-amber-300 truncate">{activeNotification.title}</h4>
          <p className="text-[11px] text-slate-300 font-medium truncate">{activeNotification.message}</p>
        </div>
      </div>
    </div>
  );
};
