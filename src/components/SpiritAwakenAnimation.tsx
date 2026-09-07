import React, { useState, useEffect, useRef } from 'react';
import { SpiritCompanion, Hero, ElementType } from '../types';
import { ElementBadge } from './ElementBadge';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Wind, 
  Shield, 
  Skull, 
  Crosshair, 
  Sword,
  X,
  ArrowRight,
  UserCheck,
  Award,
  CircleDot,
  Star
} from 'lucide-react';

interface SpiritAwakenAnimationProps {
  spirit: SpiritCompanion;
  isNew: boolean;
  prevLevel?: number;
  heroes?: Hero[];
  onConfirm: () => void;
  onEquipToHero?: (heroId: string, spirit: SpiritCompanion) => void;
}

export const SpiritAwakenAnimation: React.FC<SpiritAwakenAnimationProps> = ({
  spirit,
  isNew,
  prevLevel,
  heroes = [],
  onConfirm,
  onEquipToHero
}) => {
  const [phase, setPhase] = useState<'shatter' | 'reveal'>('shatter');
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  useEffect(() => {
    // Play the awakening audio
    audioService.playAwakenSound(spirit.rarity);

    // After 1.2s, transition from shatter/seal rupture to full card reveal
    const timer = setTimeout(() => {
      setPhase('reveal');
      if (spirit.rarity === 'SSR') {
        confetti({
          particleCount: 160,
          spread: 120,
          origin: { y: 0.45 },
          colors: ['#ffd700', '#ff0033', '#ffffff', '#ff8800']
        });
      } else if (spirit.rarity === 'SR') {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#a855f7', '#38bdf8', '#ffffff']
        });
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, [spirit.rarity]);

  // Safe dismiss
  const handleSkipOrConfirm = () => {
    if (onConfirmRef.current) {
      onConfirmRef.current();
    }
  };

  const handleEquipAndClose = (heroId: string) => {
    if (onEquipToHero) {
      onEquipToHero(heroId, spirit);
    }
    handleSkipOrConfirm();
  };

  // Element theme helper
  const getElementColors = (elem: ElementType) => {
    switch (elem) {
      case 'Agni':
        return {
          glow: 'shadow-[0_0_60px_rgba(255,0,51,0.7)]',
          border: 'border-[#FF0033]',
          accent: '#FF0033',
          badgeBg: 'bg-red-950/80',
          textColor: 'text-red-400'
        };
      case 'Tirta':
        return {
          glow: 'shadow-[0_0_60px_rgba(0,245,212,0.7)]',
          border: 'border-[#00f5d4]',
          accent: '#00f5d4',
          badgeBg: 'bg-cyan-950/80',
          textColor: 'text-cyan-400'
        };
      case 'Vidyut':
        return {
          glow: 'shadow-[0_0_60px_rgba(250,204,21,0.8)]',
          border: 'border-yellow-400',
          accent: '#facc15',
          badgeBg: 'bg-amber-950/80',
          textColor: 'text-yellow-400'
        };
      case 'Bayu':
        return {
          glow: 'shadow-[0_0_60px_rgba(34,197,94,0.7)]',
          border: 'border-green-400',
          accent: '#22c55e',
          badgeBg: 'bg-emerald-950/80',
          textColor: 'text-green-400'
        };
      case 'Nur':
        return {
          glow: 'shadow-[0_0_60px_rgba(253,224,71,0.8)]',
          border: 'border-yellow-200',
          accent: '#fde047',
          badgeBg: 'bg-yellow-950/80',
          textColor: 'text-yellow-200'
        };
      case 'Ghaib':
        return {
          glow: 'shadow-[0_0_60px_rgba(168,85,247,0.8)]',
          border: 'border-purple-500',
          accent: '#a855f7',
          badgeBg: 'bg-purple-950/80',
          textColor: 'text-purple-400'
        };
      default:
        return {
          glow: 'shadow-[0_0_60px_rgba(255,255,255,0.5)]',
          border: 'border-white',
          accent: '#ffffff',
          badgeBg: 'bg-neutral-900',
          textColor: 'text-neutral-200'
        };
    }
  };

  const elemStyle = getElementColors(spirit.element);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-hidden select-none backdrop-blur-md">
      {/* Background Animated Summoning Rings & Halftone */}
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-black pointer-events-none" />

      {/* Floating Skip Button Always Available */}
      <button
        onClick={handleSkipOrConfirm}
        className="absolute top-4 right-4 z-50 bg-neutral-900/90 hover:bg-[#FF0033] text-neutral-300 hover:text-white px-3 py-1.5 rounded skew-x-[-12deg] border border-neutral-700 transition-colors font-mono text-xs font-bold cursor-pointer"
      >
        <span className="block transform skew-x-[12deg] flex items-center gap-1.5">
          <X className="w-4 h-4" /> LEWATI (SKIP)
        </span>
      </button>

      {/* ================= PHASE 1: SHATTER & SEAL RUPTURE ================= */}
      {phase === 'shatter' && (
        <div className="relative flex flex-col items-center justify-center text-center animate-shake max-w-lg">
          {/* Spinning Mystic Summoning Circles */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#FF0033]/60 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border-2 border-yellow-400/50 animate-reverse-spin" />
            <div className="absolute inset-12 rounded-full border border-white/30 animate-spin-slow" />

            {/* Glowing Core Sigil */}
            <div className="relative z-10 text-center animate-pulse">
              <span className="font-bebas text-6xl text-white font-black italic tracking-widest drop-shadow-[0_0_30px_#FF0033]">
                AWAKEN!
              </span>
              <div className="text-xs font-mono text-yellow-300 uppercase tracking-widest mt-1">
                MEMBELAH TABIR DIMENSI
              </div>
            </div>
          </div>

          {/* Mask / Chain Fracture Text Banner */}
          <div className="bg-black/80 border-2 border-[#FF0033] px-6 py-2 skew-x-[-12deg] p5-shadow-red shadow-2xl">
            <span className="block transform skew-x-[12deg] font-bebas text-2xl sm:text-3xl text-yellow-300 tracking-wider">
              SEGEL SUKMA GHAIB TERPUTUS!
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-400 mt-3 max-w-sm">
            Jiwaku terbebas dari belenggu... Sambutlah perjanjian sukma SMA 7 Bhawana!
          </p>
        </div>
      )}

      {/* ================= PHASE 2: FULL AWAKENED REVEAL ================= */}
      {phase === 'reveal' && (
        <div className="relative w-full max-w-3xl bg-black/95 border-4 rounded-xl p-5 sm:p-7 shadow-2xl p5-shadow-red overflow-hidden transform -rotate-1 animate-spirit-slide"
             style={{ borderColor: elemStyle.accent }}>
          {/* Subtle Ambient Elemental Glow */}
          <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none ${elemStyle.badgeBg}`} />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none bg-[#FF0033]" />

          {/* Top Bar: Rarity Banner & Status */}
          <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Rarity Pill */}
              <div 
                className={`font-bebas text-base px-3.5 py-0.5 rounded skew-x-[-12deg] font-black tracking-wider ${
                  spirit.rarity === 'SSR'
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-black shadow-lg shadow-yellow-500/50 animate-pulse'
                    : spirit.rarity === 'SR'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                    : 'bg-neutral-800 text-neutral-300'
                }`}
              >
                <span className="block transform skew-x-[12deg]">
                  {spirit.rarity === 'SSR' ? '★ ★ ★ SSR MUKJIZAT 0.75%' : spirit.rarity === 'SR' ? '★ ★ SR SAKTI' : '★ R ROH PENJAGA'}
                </span>
              </div>

              {isNew ? (
                <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded animate-bounce">
                  ✨ SUKMA BARU DIBANGKITKAN!
                </span>
              ) : (
                <span className="bg-blue-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                  UPGRADE KEBANGKITAN: TINGKAT {spirit.awakenRank ?? 1}/5
                </span>
              )}

              {/* 5 Stars Awaken Rank */}
              <div className="flex items-center gap-1 bg-black border border-amber-500/50 px-2 py-0.5 rounded">
                {[1, 2, 3, 4, 5].map(starNum => (
                  <Star
                    key={starNum}
                    className={`w-3.5 h-3.5 ${
                      starNum <= (spirit.awakenRank ?? 1)
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse'
                        : 'text-neutral-700'
                    }`}
                  />
                ))}
                <span className="text-[10px] font-mono text-amber-300 font-bold ml-1">
                  AWAKEN {spirit.awakenRank ?? 1}
                </span>
              </div>

              <ElementBadge element={spirit.element} size="md" />
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                IKATAN KONTRAK
              </span>
              <span className="font-bebas text-sm text-yellow-400">SMA 7 BHAWANA</span>
            </div>
          </div>

          {/* Main Card Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left: Spirit Avatar Emblem */}
            <div className="md:col-span-4 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-neutral-800 pb-4 md:pb-0 md:pr-4">
              <div 
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 ${elemStyle.border} ${elemStyle.glow} flex items-center justify-center bg-black/80 mb-3 shadow-2xl overflow-hidden`}
              >
                <span className="text-5xl sm:text-6xl select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-pulse">
                  {spirit.avatarIcon || '🔥'}
                </span>
              </div>

              <span className="font-mono text-xs text-neutral-400 font-bold uppercase">
                {spirit.title}
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl text-white font-black tracking-wide italic drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {spirit.name}
              </h2>
            </div>

            {/* Right: Details, Quote & Showtime Finisher */}
            <div className="md:col-span-8 space-y-3">
              {/* Signature Quote Banner */}
              <div className="bg-neutral-900/90 border-l-4 border-[#FF0033] p-3 rounded-r-lg">
                <div className="text-[10px] font-mono text-[#FF0033] uppercase tracking-wider font-bold mb-1">
                  SUMPAH KONTRAK SUKMA:
                </div>
                <blockquote className="text-xs sm:text-sm text-neutral-200 italic font-serif leading-relaxed">
                  &ldquo;{spirit.signatureQuote}&rdquo;
                </blockquote>
              </div>

              {/* Stat Attunement */}
              <div className="bg-black/90 p-2.5 rounded-lg border border-neutral-800">
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>PENGUATAN STATUS SUKMA:</span>
                  <span className="text-yellow-400 font-bold">LV.{spirit.level}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-neutral-900 p-1 rounded border border-red-900/40">
                    <span className="text-[10px] text-neutral-400 block">HP</span>
                    <span className="font-bebas text-base text-red-400 font-bold">+{spirit.bonusHp}</span>
                  </div>
                  <div className="bg-neutral-900 p-1 rounded border border-blue-900/40">
                    <span className="text-[10px] text-neutral-400 block">SP</span>
                    <span className="font-bebas text-base text-blue-400 font-bold">+{spirit.bonusSp}</span>
                  </div>
                  <div className="bg-neutral-900 p-1 rounded border border-amber-900/40">
                    <span className="text-[10px] text-neutral-400 block">ATK</span>
                    <span className="font-bebas text-base text-amber-400 font-bold">+{spirit.bonusAtk}</span>
                  </div>
                  <div className="bg-neutral-900 p-1 rounded border border-indigo-900/40">
                    <span className="text-[10px] text-neutral-400 block">DEF</span>
                    <span className="font-bebas text-base text-indigo-400 font-bold">+{spirit.bonusDef}</span>
                  </div>
                </div>
              </div>

              {/* Awaken Passive & Title Banner */}
              {spirit.awakenPassive && (
                <div className="bg-gradient-to-r from-amber-950/70 via-black to-amber-950/50 border border-amber-500/50 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="text-amber-300 font-bold block">{spirit.awakenTitle || 'Kebangkitan Sukma'}</span>
                      <span className="text-neutral-300 text-[11px]">{spirit.awakenPassive}</span>
                    </div>
                  </div>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    PASIF AKTIF
                  </span>
                </div>
              )}

              {/* Showtime Finisher Teaser */}
              <div className="bg-gradient-to-r from-red-950/60 to-black p-2.5 rounded-lg border border-[#FF0033]/40 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> JURUS PAMUNGKAS (SHOWTIME):
                  </div>
                  <div className="font-bebas text-lg text-white tracking-wide">
                    {spirit.highlightSkill.name}
                  </div>
                </div>
                <span className="text-neutral-400 text-[11px]">
                  Daya Serang: <strong className="text-white">{spirit.highlightSkill.power}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Actions: Direct Equip or Store */}
          <div className="border-t-2 border-neutral-800 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Direct Equip Shortcut to Active Heroes */}
            {heroes.length > 0 && onEquipToHero && (
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <span className="text-[11px] font-mono text-neutral-400 font-bold">
                  PASANG LANGSUNG:
                </span>
                {heroes.map(hero => (
                  <button
                    key={hero.id}
                    type="button"
                    onClick={() => handleEquipAndClose(hero.id)}
                    className="bg-neutral-900 hover:bg-[#FF0033] text-neutral-300 hover:text-white px-2.5 py-1 rounded text-xs font-mono border border-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
                    title={`Pasangkan roh ini ke ${hero.name}`}
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>{hero.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Main Confirm Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleSkipOrConfirm}
                className="bg-[#FF0033] hover:bg-white text-white hover:text-black font-bebas text-lg px-6 py-2 skew-x-[-12deg] border-2 border-black font-black tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <span className="block transform skew-x-[12deg] flex items-center justify-center gap-2">
                  <span>IKAT KONTRAK SUKMA</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
