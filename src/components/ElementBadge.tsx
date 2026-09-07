import React from 'react';
import { ElementType } from '../types';
import { Flame, Droplets, Zap, Wind, Sun, Skull, Sword, Crosshair } from 'lucide-react';

interface ElementBadgeProps {
  element: ElementType;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isWeakness?: boolean;
}

export const ELEMENT_CONFIG: Record<ElementType, { name: string; color: string; bg: string; icon: React.ReactNode }> = {
  Agni: {
    name: 'Agni (Api)',
    color: 'text-red-400',
    bg: 'bg-red-950/80 border-red-500/80',
    icon: <Flame className="w-3.5 h-3.5 text-red-400" />
  },
  Tirta: {
    name: 'Tirta (Es)',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/80 border-cyan-500/80',
    icon: <Droplets className="w-3.5 h-3.5 text-cyan-400" />
  },
  Vidyut: {
    name: 'Vidyut (Petir)',
    color: 'text-yellow-400',
    bg: 'bg-amber-950/80 border-amber-500/80',
    icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />
  },
  Bayu: {
    name: 'Bayu (Angin)',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/80 border-emerald-500/80',
    icon: <Wind className="w-3.5 h-3.5 text-emerald-400" />
  },
  Nur: {
    name: 'Nur (Cahaya)',
    color: 'text-amber-200',
    bg: 'bg-amber-900/60 border-amber-300/80',
    icon: <Sun className="w-3.5 h-3.5 text-amber-200" />
  },
  Ghaib: {
    name: 'Ghaib (Kutuk)',
    color: 'text-purple-400',
    bg: 'bg-purple-950/80 border-purple-500/80',
    icon: <Skull className="w-3.5 h-3.5 text-purple-400" />
  },
  Fisik: {
    name: 'Fisik',
    color: 'text-orange-300',
    bg: 'bg-stone-900 border-orange-500/70',
    icon: <Sword className="w-3.5 h-3.5 text-orange-300" />
  },
  Peluru: {
    name: 'Peluru',
    color: 'text-blue-300',
    bg: 'bg-blue-950/80 border-blue-400/80',
    icon: <Crosshair className="w-3.5 h-3.5 text-blue-300" />
  }
};

export const ElementBadge: React.FC<ElementBadgeProps> = ({
  element,
  showName = true,
  size = 'md',
  isWeakness = false
}) => {
  const conf = ELEMENT_CONFIG[element] || ELEMENT_CONFIG.Fisik;
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border font-bold uppercase tracking-wider ${conf.bg} ${conf.color} ${sizeClasses} ${
        isWeakness ? 'animate-pulse ring-2 ring-red-500' : ''
      }`}
    >
      {conf.icon}
      {showName && <span>{conf.name}</span>}
      {isWeakness && <span className="ml-1 text-[10px] bg-red-600 text-white px-1 rounded">WEAK</span>}
    </span>
  );
};
