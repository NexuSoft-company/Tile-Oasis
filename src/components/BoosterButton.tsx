import React from 'react';
import { BoosterType } from '../types/gameEngine';
import { BoosterRegistry, BoosterDefinition } from '../engine/BoosterDefinition';
import { RotateCcw, Shuffle, Magnet, PlusCircle, Snowflake, Lightbulb, Target, Lock, Coins, Gem, Plus } from 'lucide-react';

interface BoosterButtonProps {
  boosterId: BoosterType;
  quantity: number;
  playerLevel: number;
  isEngineBusy: boolean;
  canUse: boolean;
  onActivate: (boosterId: BoosterType) => void;
  onOpenShop: (boosterId: BoosterType) => void;
}

export const BoosterButton: React.FC<BoosterButtonProps> = ({
  boosterId,
  quantity,
  playerLevel,
  isEngineBusy,
  canUse,
  onActivate,
  onOpenShop,
}) => {
  const def: BoosterDefinition | null = BoosterRegistry.getDefinition(boosterId);
  if (!def || !def.isActive) return null;

  const isUnlocked = playerLevel >= def.unlockLevel;
  const isOut = quantity <= 0;
  const isDisabled = isEngineBusy || !canUse || !isUnlocked;

  const renderIcon = () => {
    const iconClass = "w-7 h-7 text-white drop-shadow-md";
    switch (def.iconId) {
      case 'RotateCcw':
        return <RotateCcw className={iconClass} strokeWidth={2.5} />;
      case 'Shuffle':
        return <Shuffle className={iconClass} strokeWidth={2.5} />;
      case 'Magnet':
        return <Magnet className={iconClass} strokeWidth={2.5} />;
      case 'PlusCircle':
        return <PlusCircle className={iconClass} strokeWidth={2.5} />;
      case 'Snowflake':
        return <Snowflake className={iconClass} strokeWidth={2.5} />;
      case 'Lightbulb':
        return <Lightbulb className={iconClass} strokeWidth={2.5} />;
      case 'Target':
      case 'Wand2':
        return <Target className={iconClass} strokeWidth={2.5} />;
      default:
        return <RotateCcw className={iconClass} strokeWidth={2.5} />;
    }
  };

  const handleClick = () => {
    if (!isUnlocked) return;
    if (isOut) {
      onOpenShop(boosterId);
    } else {
      onActivate(boosterId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`relative w-[60px] h-[60px] flex items-center justify-center rounded-full border-2 transition-all active:scale-95 select-none ${
        !isUnlocked
          ? 'bg-slate-900/50 border-slate-700/50 cursor-not-allowed opacity-50'
          : 'bg-black/20 border-white/80 hover:bg-black/30 backdrop-blur-sm shadow-lg'
      } ${isDisabled && isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isUnlocked ? `${def.name}: ${def.description}` : `Unlocks at Level ${def.unlockLevel}`}
    >
      {!isUnlocked ? (
        <Lock className="w-6 h-6 text-white/50" />
      ) : (
        <>
          {renderIcon()}
          
          {/* Badge for quantity or plus icon */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-teal-500 border-2 border-white shadow-sm text-[10px] font-black text-white">
            {isOut ? <Plus className="w-3.5 h-3.5" strokeWidth={3} /> : quantity}
          </div>
        </>
      )}
    </button>
  );
};

