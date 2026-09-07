import React, { useState, useEffect, useRef } from 'react';
import { Hero, SpiritCompanion, ElementType } from '../types';
import { AnimePortrait } from './AnimePortrait';
import { ElementBadge } from './ElementBadge';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Sparkles, 
  Zap, 
  Wind, 
  Shield, 
  Skull, 
  Crosshair, 
  Sword,
  FastForward,
  Star
} from 'lucide-react';

interface SpiritShiftAnimationProps {
  hero: Hero;
  previousSpirit?: SpiritCompanion | null;
  newSpirit: SpiritCompanion;
  onComplete: () => void;
  autoCloseMs?: number;
}

// Static theme configurations declared strictly outside the component to prevent re-creation
const STATIC_ELEMENT_THEMES: Record<ElementType, {
  glow: string;
  border: string;
  accent: string;
  bgGradient: string;
  textColor: string;
  badgeBg: string;
  iconName: string;
  label: string;
  confettiColors: string[];
}> = {
  Agni: {
    glow: 'shadow-[0_0_50px_rgba(255,0,51,0.6)]',
    border: 'border-[#FF0033]',
    accent: '#FF0033',
    bgGradient: 'from-red-950/90 via-black to-red-950/80',
    textColor: 'text-red-500',
    badgeBg: 'bg-red-950',
    iconName: 'flame',
    label: 'KOBARAN API AGNI',
    confettiColors: ['#ff0033', '#ff6600', '#ffd700', '#ffffff']
  },
  Tirta: {
    glow: 'shadow-[0_0_50px_rgba(0,245,212,0.6)]',
    border: 'border-[#00f5d4]',
    accent: '#00f5d4',
    bgGradient: 'from-cyan-950/90 via-black to-blue-950/80',
    textColor: 'text-[#00f5d4]',
    badgeBg: 'bg-cyan-950',
    iconName: 'sparkles',
    label: 'KESEJUKAN ES TIRTA',
    confettiColors: ['#00f5d4', '#38bdf8', '#ffffff', '#60a5fa']
  },
  Vidyut: {
    glow: 'shadow-[0_0_50px_rgba(250,204,21,0.6)]',
    border: 'border-yellow-400',
    accent: '#facc15',
    bgGradient: 'from-amber-950/90 via-black to-yellow-950/80',
    textColor: 'text-yellow-400',
    badgeBg: 'bg-amber-950',
    iconName: 'zap',
    label: 'GELOMBANG PETIR VIDYUT',
    confettiColors: ['#facc15', '#fbbf24', '#ffffff', '#eab308']
  },
  Bayu: {
    glow: 'shadow-[0_0_50px_rgba(34,197,94,0.6)]',
    border: 'border-green-400',
    accent: '#22c55e',
    bgGradient: 'from-emerald-950/90 via-black to-green-950/80',
    textColor: 'text-green-400',
    badgeBg: 'bg-emerald-950',
    iconName: 'wind',
    label: 'PUSARAN ANGIN BAYU',
    confettiColors: ['#22c55e', '#86efac', '#ffffff', '#10b981']
  },
  Nur: {
    glow: 'shadow-[0_0_50px_rgba(253,224,71,0.6)]',
    border: 'border-yellow-200',
    accent: '#fde047',
    bgGradient: 'from-yellow-950/90 via-black to-stone-900/90',
    textColor: 'text-yellow-200',
    badgeBg: 'bg-yellow-950',
    iconName: 'shield',
    label: 'CAHAYA SUCI NUR',
    confettiColors: ['#fde047', '#fef08a', '#ffffff', '#ffd700']
  },
  Ghaib: {
    glow: 'shadow-[0_0_50px_rgba(168,85,247,0.6)]',
    border: 'border-purple-500',
    accent: '#a855f7',
    bgGradient: 'from-purple-950/90 via-black to-black',
    textColor: 'text-purple-400',
    badgeBg: 'bg-purple-950',
    iconName: 'skull',
    label: 'KUTUKAN GHAIB PURBA',
    confettiColors: ['#a855f7', '#c084fc', '#ffffff', '#7e22ce']
  },
  Peluru: {
    glow: 'shadow-[0_0_50px_rgba(56,189,248,0.6)]',
    border: 'border-sky-400',
    accent: '#38bdf8',
    bgGradient: 'from-sky-950/90 via-black to-blue-950/80',
    textColor: 'text-sky-400',
    badgeBg: 'bg-sky-950',
    iconName: 'crosshair',
    label: 'BIDIKAN PELURU KRAMAT',
    confettiColors: ['#38bdf8', '#7dd3fc', '#ffffff', '#0284c7']
  },
  Fisik: {
    glow: 'shadow-[0_0_50px_rgba(255,255,255,0.4)]',
    border: 'border-neutral-400',
    accent: '#ffffff',
    bgGradient: 'from-neutral-900 via-black to-neutral-900',
    textColor: 'text-white',
    badgeBg: 'bg-neutral-900',
    iconName: 'sword',
    label: 'SERANGAN FISIK MURNI',
    confettiColors: ['#ffffff', '#d4d4d4', '#a3a3a3']
  }
};

const getElementIcon = (iconName: string) => {
  switch (iconName) {
    case 'flame': return <Flame className="w-6 h-6 text-red-500" />;
    case 'sparkles': return <Sparkles className="w-6 h-6 text-[#00f5d4]" />;
    case 'zap': return <Zap className="w-6 h-6 text-yellow-400" />;
    case 'wind': return <Wind className="w-6 h-6 text-green-400" />;
    case 'shield': return <Shield className="w-6 h-6 text-yellow-200" />;
    case 'skull': return <Skull className="w-6 h-6 text-purple-400" />;
    case 'crosshair': return <Crosshair className="w-6 h-6 text-sky-400" />;
    default: return <Sword className="w-6 h-6 text-white" />;
  }
};

export const SpiritShiftAnimation: React.FC<SpiritShiftAnimationProps> = ({
  hero,
  previousSpirit,
  newSpirit,
  onComplete,
  autoCloseMs = 2600
}) => {
  const [phase, setPhase] = useState<'cutin' | 'summoning' | 'manifested'>('cutin');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const hasExecutedRef = useRef(false);

  const rawElement = newSpirit.element || 'Agni';
  const element: ElementType = (rawElement in STATIC_ELEMENT_THEMES) ? rawElement : 'Agni';
  const theme = STATIC_ELEMENT_THEMES[element] || STATIC_ELEMENT_THEMES.Agni;

  // Single mount effect execution — zero re-renders loop!
  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    // Play spirit shift SFX once
    audioService.playSpiritShift();

    const tSound = setTimeout(() => {
      audioService.playMagic(element);
    }, 450);

    const t1 = setTimeout(() => {
      setPhase('summoning');
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.5, x: 0.5 },
          colors: theme.confettiColors
        });
      } catch {
        // Fallback
      }
    }, 550);

    const t2 = setTimeout(() => {
      setPhase('manifested');
      try {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0.45 },
          colors: theme.confettiColors
        });
      } catch {
        // Fallback
      }
    }, 1200);

    const tAuto = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, autoCloseMs);

    return () => {
      clearTimeout(tSound);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tAuto);
    };
  }, [element, autoCloseMs, theme.confettiColors]);

  const handleDismiss = () => {
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  };

  const awakenRank = newSpirit.awakenRank ?? 1;

  return (
    <div 
      onClick={handleDismiss}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center p-3 sm:p-5 select-none overflow-hidden cursor-pointer"
      style={{ willChange: 'transform' }}
    >
      {/* Dynamic Background Speedlines & Elemental Radial Aura */}
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.bgGradient} opacity-90`} />
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />

      {/* Top Skip Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={e => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="bg-black/90 hover:bg-[#FF0033] hover:text-black text-white font-mono text-xs px-3 py-1.5 rounded border border-white skew-x-[-12deg] shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5 transform skew-x-[12deg]" />
          <span className="transform skew-x-[12deg] font-bold">LEWATI (SKIP)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 1: SUDDEN COMIC EYE CUT-IN & PERSONA CHANT (0ms - 550ms)           */}
      {/* ========================================================================= */}
      {phase === 'cutin' && (
        <div className="relative z-30 w-full max-w-4xl transform -rotate-3 flex flex-col items-center animate-shake">
          {/* Top Slanted Red Warning Banner */}
          <div className="w-full bg-[#FF0033] text-black font-black text-xs sm:text-sm py-1.5 px-6 skew-x-[-15deg] shadow-2xl flex items-center justify-between border-y-2 border-black">
            <span className="tracking-widest uppercase flex items-center gap-2">
              <Zap className="w-4 h-4" /> SUKMA MENGGEMBOK MEDAN TEMPUR // MENGGANTI PERSONA
            </span>
            <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5">
              CODE: {hero.alias}
            </span>
          </div>

          {/* High-Contrast Slanted Eye Banner */}
          <div className="relative w-full my-3 bg-black border-4 border-white p-3 skew-x-[-15deg] shadow-[0_0_50px_rgba(255,0,51,0.8)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0033] via-transparent to-black opacity-30" />
            
            <div className="transform skew-x-[15deg] flex items-center justify-between px-4 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded border-2 border-white overflow-hidden bg-neutral-900 shadow-xl shrink-0">
                  <AnimePortrait characterId={hero.id} emotion="determined" size="md" isCutin />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-yellow-300 uppercase tracking-widest block font-bold">
                    SERUAN JIWA &bull; {hero.name}
                  </span>
                  <h1 className="font-bebas text-3xl sm:text-5xl text-white tracking-wider font-black drop-shadow-[0_2px_0_#FF0033]">
                    &ldquo;BANGKITLAH, {newSpirit.name.toUpperCase()}!!&rdquo;
                  </h1>
                </div>
              </div>

              {/* Japanese Manga SFX text */}
              <div className="hidden sm:block text-right">
                <span className="font-bebas text-4xl text-[#FF0033] font-black italic tracking-widest block">
                  ペルソナ！
                </span>
                <span className="font-mono text-[10px] text-neutral-400 uppercase">
                  SPIRIT AWAKENING
                </span>
              </div>
            </div>
          </div>

          {/* Persona Shift Code strip */}
          <div className="bg-black/90 text-white font-mono text-xs px-6 py-1 border border-neutral-700 skew-x-[-12deg]">
            <span className="transform skew-x-[12deg] text-neutral-300">
              {previousSpirit ? `MELEPAS [${previousSpirit.name}] → MEMANGGIL [${newSpirit.name}]` : `MEMANGGIL ROH PENJAGA [${newSpirit.name}]`}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: CELESTIAL SEAL MANDALA & ELEMENT SHOCKWAVE (550ms - 1200ms)      */}
      {/* ========================================================================= */}
      {phase === 'summoning' && (
        <div className="relative z-30 flex flex-col items-center justify-center animate-fade-in">
          {/* Rotating Mystic Mandala Rings */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Ring */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-dashed animate-spin-slow opacity-80"
              style={{ borderColor: theme.accent }}
            />
            {/* Middle Counter-Rotating Ring */}
            <div 
              className="absolute inset-4 rounded-full border-2 border-white/60 animate-reverse-spin opacity-90"
              style={{ borderStyle: 'dotted' }}
            />
            {/* Inner Pulsing Core */}
            <div 
              className="absolute inset-10 rounded-full bg-black/80 border-4 flex flex-col items-center justify-center shadow-2xl animate-pulse"
              style={{ borderColor: theme.accent }}
            >
              <div className="mb-2">
                {getElementIcon(theme.iconName)}
              </div>
              <span className="font-bebas text-2xl text-white tracking-wider font-bold">
                {theme.label}
              </span>
              <span className="text-[10px] font-mono text-yellow-300 font-bold uppercase tracking-widest mt-0.5">
                MEMBELAH DIMENSI...
              </span>
            </div>
          </div>

          {/* Elemental Callout Banner */}
          <div className="mt-6 bg-black/95 border-2 border-white px-8 py-2 skew-x-[-12deg] shadow-2xl">
            <span className="transform skew-x-[12deg] font-bebas text-3xl sm:text-4xl text-white tracking-widest font-black flex items-center gap-2">
              <span style={{ color: theme.accent }}>★</span> {newSpirit.name.toUpperCase()} TERPAKU KE JIWA <span style={{ color: theme.accent }}>★</span>
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: MANIFESTED DUAL-STANCE MANGA SPLASH (1200ms+)                    */}
      {/* ========================================================================= */}
      {phase === 'manifested' && (
        <div className="relative z-30 w-full max-w-5xl flex flex-col items-center animate-fade-in">
          {/* Top Slanted Banner */}
          <div className="w-full bg-black/95 border-2 border-white px-5 py-2.5 skew-x-[-12deg] shadow-2xl flex items-center justify-between mb-4">
            <div className="transform skew-x-[12deg] flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF0033] animate-ping" />
              <span className="font-bebas text-xl sm:text-2xl text-white tracking-wider font-bold flex items-center gap-2">
                <span>PERSONA RESIDENCE COMPLETE</span>
                <span className="text-[#FF0033]">//</span>
                <span className="text-yellow-300">{newSpirit.name}</span>
              </span>
            </div>

            <div className="transform skew-x-[12deg] flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1 bg-amber-950/60 px-2.5 py-0.5 border border-amber-500 rounded">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                AWAKEN TIER {awakenRank}/5
              </span>
            </div>
          </div>

          {/* Main Comic Dual Panel */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Hero Synchronized Stance */}
            <div className="bg-black/90 border-4 border-[#FF0033] p-5 rounded-lg skew-x-[-6deg] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FF0033] text-black font-bebas text-xs px-3 py-0.5 font-bold uppercase tracking-widest">
                WADAH JIWA (USER)
              </div>
              <div className="transform skew-x-[6deg] flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white bg-neutral-900 shrink-0 shadow-lg">
                  <AnimePortrait characterId={hero.id} emotion="determined" size="md" isCutin />
                </div>
                <div>
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    {hero.alias}
                  </div>
                  <h3 className="font-bebas text-3xl text-white tracking-wider font-bold">
                    {hero.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono mt-1 text-neutral-300">
                    <span>HP: <strong className="text-green-400">{hero.hp}/{hero.maxHp}</strong></span>
                    <span>SP: <strong className="text-blue-400">{hero.sp}/{hero.maxSp}</strong></span>
                  </div>
                  <p className="text-[11px] font-mono text-yellow-300 mt-1 italic">
                    {hero.quote}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Spirit Manifested Data & Stats */}
            <div 
              className="bg-black/90 border-4 p-5 rounded-lg skew-x-[-6deg] shadow-2xl relative overflow-hidden"
              style={{ borderColor: theme.accent }}
            >
              <div 
                className="absolute top-0 right-0 text-black font-bebas text-xs px-3 py-0.5 font-bold uppercase tracking-widest"
                style={{ backgroundColor: theme.accent }}
              >
                ROH MANIFESTASI
              </div>

              <div className="transform skew-x-[6deg] flex items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-neutral-900 shrink-0 shadow-lg"
                  style={{ borderColor: theme.accent }}
                >
                  {newSpirit.avatarUrl ? (
                    <img 
                      src={newSpirit.avatarUrl} 
                      alt={newSpirit.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-4xl">
                      {element === 'Agni' ? '🔥' : element === 'Tirta' ? '❄️' : element === 'Vidyut' ? '⚡' : element === 'Bayu' ? '🌪️' : element === 'Nur' ? '✨' : '🔮'}
                    </span>
                  )}
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <ElementBadge element={newSpirit.element} size="sm" />
                    <span className="text-[10px] font-mono font-bold text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded">
                      {newSpirit.rarity}
                    </span>
                  </div>
                  <h3 className="font-bebas text-3xl text-white tracking-wider font-bold truncate mt-0.5">
                    {newSpirit.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 mt-1">
                    <span className="text-amber-400 font-bold">+{newSpirit.bonusAtk} ATK</span>
                    <span className="text-green-400 font-bold">+{newSpirit.bonusHp} HP</span>
                    <span className="text-blue-400 font-bold">+{newSpirit.bonusSp} SP</span>
                  </div>
                </div>
              </div>

              {/* Awaken Perk Ribbon */}
              {newSpirit.awakenPassive && (
                <div className="mt-3 bg-neutral-900 border-l-4 border-amber-400 px-3 py-1.5 transform skew-x-[6deg]">
                  <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">
                    ★ PASIF AWAKEN: {newSpirit.awakenTitle || `Tingkat ${awakenRank}`}
                  </span>
                  <span className="text-xs text-neutral-200 font-mono block truncate">
                    {newSpirit.awakenPassive}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Prompt */}
          <div className="mt-4 flex items-center justify-between w-full text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-2 px-2">
            <span>KLIK DI MANA SAJA UNTUK MELANJUTKAN BERTARUNG</span>
            <span className="text-yellow-400 font-bold">LANJUT &rarr;</span>
          </div>
        </div>
      )}
    </div>
  );
};
