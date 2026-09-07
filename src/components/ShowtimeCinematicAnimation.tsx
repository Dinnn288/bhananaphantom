import React, { useState, useEffect, useRef } from 'react';
import { Hero, SpiritCompanion, Skill, ElementType } from '../types';
import { AnimePortrait } from './AnimePortrait';
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
  Star, 
  FastForward,
  ChevronRight
} from 'lucide-react';

interface ShowtimeCinematicProps {
  hero: Hero;
  spirit: SpiritCompanion;
  skill: Skill;
  onFinish: () => void;
}

// Static elemental styling to avoid re-renders
const ELEMENT_SHOWTIME_CONFIG: Record<ElementType, {
  accent: string;
  bgGlow: string;
  badgeBg: string;
  particleColors: string[];
  bannerGradient: string;
  sfxSymbol: string;
}> = {
  Agni: {
    accent: '#FF0033',
    bgGlow: 'rgba(255, 0, 51, 0.4)',
    badgeBg: 'bg-red-950',
    particleColors: ['#FF0033', '#FF6600', '#FFD700', '#FFFFFF'],
    bannerGradient: 'from-red-950 via-black to-red-900',
    sfxSymbol: '🔥 KOBARAN BARA MAHAMERU 🔥'
  },
  Tirta: {
    accent: '#00f5d4',
    bgGlow: 'rgba(0, 245, 212, 0.4)',
    badgeBg: 'bg-cyan-950',
    particleColors: ['#00f5d4', '#38bdf8', '#ffffff', '#60a5fa'],
    bannerGradient: 'from-cyan-950 via-black to-blue-950',
    sfxSymbol: '❄️ KRISTAL ES TELAGA SUCI ❄️'
  },
  Vidyut: {
    accent: '#facc15',
    bgGlow: 'rgba(250, 204, 21, 0.4)',
    badgeBg: 'bg-amber-950',
    particleColors: ['#facc15', '#fbbf24', '#ffffff', '#eab308'],
    bannerGradient: 'from-yellow-950 via-black to-amber-950',
    sfxSymbol: '⚡ KILAT GUNTUR BHARATA ⚡'
  },
  Bayu: {
    accent: '#22c55e',
    bgGlow: 'rgba(34, 197, 94, 0.4)',
    badgeBg: 'bg-emerald-950',
    particleColors: ['#22c55e', '#86efac', '#ffffff', '#10b981'],
    bannerGradient: 'from-emerald-950 via-black to-green-950',
    sfxSymbol: '🌪️ BADAI TEBASAN ANGIN 🌪️'
  },
  Nur: {
    accent: '#fde047',
    bgGlow: 'rgba(253, 224, 71, 0.4)',
    badgeBg: 'bg-yellow-950',
    particleColors: ['#fde047', '#fef08a', '#ffffff', '#ffd700'],
    bannerGradient: 'from-yellow-950 via-stone-900 to-black',
    sfxSymbol: '✨ PENGHAKIMAN CAHAYA KOSMIK ✨'
  },
  Ghaib: {
    accent: '#a855f7',
    bgGlow: 'rgba(168, 85, 247, 0.4)',
    badgeBg: 'bg-purple-950',
    particleColors: ['#a855f7', '#c084fc', '#ffffff', '#7e22ce'],
    bannerGradient: 'from-purple-950 via-black to-neutral-950',
    sfxSymbol: '💀 DIMENSI KUTUKAN PURBA 💀'
  },
  Fisik: {
    accent: '#ef4444',
    bgGlow: 'rgba(239, 68, 68, 0.4)',
    badgeBg: 'bg-red-950',
    particleColors: ['#ef4444', '#f87171', '#ffffff', '#b91c1c'],
    bannerGradient: 'from-red-950 via-stone-900 to-black',
    sfxSymbol: '⚔️ HANTAMAN REMUKAN MUTLAK ⚔️'
  },
  Peluru: {
    accent: '#38bdf8',
    bgGlow: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'bg-sky-950',
    particleColors: ['#38bdf8', '#7dd3fc', '#ffffff', '#0284c7'],
    bannerGradient: 'from-sky-950 via-slate-900 to-black',
    sfxSymbol: '🎯 BIDIKAN PENEMBUS SUKMA 🎯'
  }
};

const HERO_FINISH_QUOTES: Record<string, string> = {
  renald: '“Bara ini tak akan padam sebelum keadilan tegak!”',
  maya: '“Cermin kebenaran tak pernah berbohong... lenyaplah!”',
  bagas: '“Guntur kebenaran telah meremukkan belenggumu!”',
  gilang: '“Jiwa Suryakusuma akan selalu menjaga koridor ini!”'
};

export const ShowtimeCinematicAnimation: React.FC<ShowtimeCinematicProps> = ({
  hero,
  spirit,
  skill,
  onFinish
}) => {
  // Phases:
  // 'opener': Giant SHOWTIME comic slash & red alarm flash (0 - 800ms)
  // 'duo': Dual Clashing Split-Screen (Hero & Spirit) (800 - 1900ms)
  // 'strike': Multi-hit barrage & giant comic slash VFX (1900 - 3200ms)
  // 'finisher': Persona 5 signature stylish freeze-frame finish screen (3200 - 4500ms)
  const [phase, setPhase] = useState<'opener' | 'duo' | 'strike' | 'finisher'>('opener');
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const hasTriggeredRef = useRef(false);

  const rawElem = skill.element || spirit.element || 'Agni';
  const element: ElementType = (rawElem in ELEMENT_SHOWTIME_CONFIG) ? rawElem : 'Agni';
  const cfg = ELEMENT_SHOWTIME_CONFIG[element] || ELEMENT_SHOWTIME_CONFIG.Agni;

  const heroQuote = HERO_FINISH_QUOTES[hero.id] || `“Kekuatan sukma ${spirit.name} telah meremukkanmu!”`;
  const awakenRank = spirit.awakenRank ?? 1;

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Play initial critical alarm
    audioService.playCritical();

    const tDuo = setTimeout(() => {
      setPhase('duo');
      audioService.playSpiritShift();
    }, 750);

    const tStrike = setTimeout(() => {
      setPhase('strike');
      audioService.playMagic(element);
      audioService.playSlash();
    }, 1850);

    const tFinish = setTimeout(() => {
      setPhase('finisher');
      audioService.playAllOutAttack();
      try {
        confetti({
          particleCount: 140,
          spread: 120,
          origin: { y: 0.5, x: 0.5 },
          colors: cfg.particleColors
        });
      } catch {
        // Fallback
      }
    }, 3100);

    const tEnd = setTimeout(() => {
      if (onFinishRef.current) {
        onFinishRef.current();
      }
    }, 4600);

    return () => {
      clearTimeout(tDuo);
      clearTimeout(tStrike);
      clearTimeout(tFinish);
      clearTimeout(tEnd);
    };
  }, [element, cfg.particleColors]);

  const handleSkip = () => {
    if (onFinishRef.current) {
      onFinishRef.current();
    }
  };

  return (
    <div 
      onClick={handleSkip}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden cursor-pointer"
      style={{ willChange: 'transform' }}
    >
      {/* Background Halftone & Red Comic Speedlines */}
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />
      <div className={`absolute inset-0 bg-gradient-to-br ${cfg.bannerGradient} opacity-90`} />

      {/* Top Skip Button */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={e => {
            e.stopPropagation();
            handleSkip();
          }}
          className="bg-black/90 hover:bg-[#FF0033] hover:text-black text-white font-mono text-xs px-3 py-1.5 rounded border border-white skew-x-[-12deg] shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5 transform skew-x-[12deg]" />
          <span className="transform skew-x-[12deg] font-bold">LEWATI (SKIP)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ACT 1: OPENER - GIANT SLANTED "SHOWTIME!" COMIC CUT-IN                    */}
      {/* ========================================================================= */}
      {phase === 'opener' && (
        <div className="relative z-30 w-full max-w-5xl flex flex-col items-center animate-shake">
          {/* Top Yellow Warning Strip */}
          <div className="w-full bg-[#FF0033] text-black font-black text-sm py-1.5 px-6 skew-x-[-15deg] shadow-2xl flex items-center justify-between border-y-4 border-black">
            <span className="tracking-widest uppercase flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              KOMBINASI PEMUNCAK TERTINGGI // SHOWTIME OVERDRIVE
            </span>
            <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5">
              MAX GAUGE 100%
            </span>
          </div>

          {/* Massive SHOWTIME Typography */}
          <div className="relative my-4 transform -rotate-3">
            <div className="absolute -inset-4 bg-[#FF0033] skew-x-[-15deg] shadow-[0_0_50px_#FF0033]" />
            <div className="relative bg-black text-yellow-300 border-4 border-yellow-300 px-12 sm:px-20 py-4 skew-x-[-15deg] shadow-2xl">
              <h1 className="font-bebas text-6xl sm:text-9xl tracking-wider italic font-black text-center drop-shadow-[0_0_20px_#ffd166]">
                SHOWTIME!
              </h1>
            </div>
          </div>

          {/* Partner Callout */}
          <div className="bg-black/90 border-2 border-white px-8 py-2 skew-x-[-12deg] shadow-xl">
            <p className="transform skew-x-[12deg] font-bebas text-2xl sm:text-3xl text-white tracking-widest uppercase">
              {hero.name} <span className="text-[#FF0033]">&times;</span> {spirit.name}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACT 2: DUO CLASHING SPLIT-SCREEN (HERO & SPIRIT PARTNER CUT-IN)          */}
      {/* ========================================================================= */}
      {phase === 'duo' && (
        <div className="relative z-30 w-full h-full max-w-6xl flex flex-col justify-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Left Hero Card */}
            <div className="bg-black/90 border-4 border-[#FF0033] p-5 rounded-lg skew-x-[-8deg] shadow-2xl relative overflow-hidden animate-slide-left">
              <div className="absolute top-0 right-0 bg-[#FF0033] text-black font-bebas text-xs px-3 py-0.5 font-bold uppercase tracking-widest">
                LEAD ATTACKER
              </div>
              <div className="transform skew-x-[8deg] flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white bg-neutral-900 shrink-0 shadow-lg">
                  <AnimePortrait characterId={hero.id} emotion="determined" size="md" isCutin />
                </div>
                <div>
                  <span className="text-xs font-mono text-neutral-400 block tracking-widest uppercase">
                    PEMIMPIN TIM PENGUSIR ROH
                  </span>
                  <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider font-black">
                    {hero.name}
                  </h2>
                  <p className="text-xs font-serif italic text-amber-300 mt-1">
                    {heroQuote}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Spirit Card */}
            <div 
              className="bg-black/90 border-4 p-5 rounded-lg skew-x-[-8deg] shadow-2xl relative overflow-hidden animate-slide-right"
              style={{ borderColor: cfg.accent }}
            >
              <div 
                className="absolute top-0 right-0 text-black font-bebas text-xs px-3 py-0.5 font-bold uppercase tracking-widest"
                style={{ backgroundColor: cfg.accent }}
              >
                ROH MANIFESTASI
              </div>
              <div className="transform skew-x-[8deg] flex items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-neutral-900 shrink-0 shadow-lg"
                  style={{ borderColor: cfg.accent }}
                >
                  {spirit.avatarUrl ? (
                    <img 
                      src={spirit.avatarUrl} 
                      alt={spirit.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-4xl">
                      {element === 'Agni' ? '🔥' : element === 'Tirta' ? '❄️' : element === 'Vidyut' ? '⚡' : element === 'Bayu' ? '🌪️' : element === 'Nur' ? '✨' : '🔮'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <ElementBadge element={spirit.element} size="sm" />
                    <span className="text-amber-400 font-mono text-xs font-bold flex items-center">
                      ★ AWAKEN TIER {awakenRank}/5
                    </span>
                  </div>
                  <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider font-black mt-1">
                    {spirit.name}
                  </h2>
                  <p className="text-xs font-mono text-neutral-300 italic truncate max-w-xs mt-1">
                    {spirit.title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Collision Banner */}
          <div className="text-center mt-6">
            <div className="inline-block bg-[#FF0033] text-black font-bebas text-2xl sm:text-4xl px-8 py-1.5 skew-x-[-15deg] font-black shadow-2xl tracking-wider animate-bounce">
              <span className="transform skew-x-[15deg]">
                &ldquo;SATUKAN JIWA, KOYAK KORIDOR KEGELAPAN!!&rdquo;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACT 3: COMBINED CINEMATIC STRIKE & SLASHING BARRAGE                      */}
      {/* ========================================================================= */}
      {phase === 'strike' && (
        <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-4">
          {/* Diagonal Multi-Hit Cutlines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-[140%] h-3 bg-white skew-y-[-18deg] shadow-[0_0_30px_#ffffff] animate-ping" />
            <div className="absolute top-1/3 -left-20 w-[140%] h-5 bg-[#FF0033] skew-y-[12deg] shadow-[0_0_40px_#FF0033]" />
            <div className="absolute top-2/3 -left-20 w-[140%] h-4 bg-yellow-300 skew-y-[-8deg] shadow-[0_0_35px_#ffd166]" />
          </div>

          {/* Comic Impact Bubbles */}
          <div className="relative z-30 text-center animate-shake">
            <span className="inline-block font-mono text-sm sm:text-base font-black px-4 py-1 bg-black/90 border border-neutral-400 text-yellow-300 skew-x-[-12deg] mb-3">
              {cfg.sfxSymbol}
            </span>

            <div className="bg-black/95 border-4 border-yellow-400 px-8 sm:px-14 py-4 skew-x-[-12deg] shadow-[0_0_60px_rgba(255,215,0,0.6)]">
              <h2 className="font-bebas text-4xl sm:text-7xl text-white tracking-wider font-black italic">
                {skill.name.toUpperCase()}
              </h2>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-yellow-400 font-mono text-sm sm:text-base font-bold">
                  DAYA DAYA HANCUR KOSMIK: {skill.power * 2} POWER
                </span>
                <span className="bg-[#FF0033] text-black font-bebas text-sm sm:text-base px-2 py-0.5 font-black rounded">
                  ★ CRITICAL GUARANTEED ★
                </span>
              </div>
            </div>

            {/* Comic Onomatopoeia */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <span className="font-bebas text-5xl sm:text-7xl text-[#FF0033] tracking-tighter italic font-black transform -rotate-12 drop-shadow-[0_0_15px_#FF0033]">
                DORRR!
              </span>
              <span className="font-bebas text-5xl sm:text-7xl text-yellow-300 tracking-tighter italic font-black transform rotate-6 drop-shadow-[0_0_15px_#ffd166]">
                KRAAAK!
              </span>
              <span className="font-bebas text-5xl sm:text-7xl text-white tracking-tighter italic font-black transform -rotate-6 drop-shadow-[0_0_15px_#ffffff]">
                BAMMM!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACT 4: SIGNATURE PERSONA 5 STYLISH FINISHER SCREEN                       */}
      {/* ========================================================================= */}
      {phase === 'finisher' && (
        <div className="relative z-30 w-full h-full flex flex-col justify-between p-6 sm:p-10 animate-fade-in">
          {/* Top Decorative Border Banner */}
          <div className="flex items-center justify-between border-b-4 border-white pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-black font-bebas text-sm px-2.5 py-0.5 skew-x-[-12deg] font-black">
                P5X FINISH
              </span>
              <span className="font-bebas text-2xl sm:text-3xl text-white tracking-widest">
                THE SHOWTIME EXECUTION
              </span>
            </div>
            <span className="font-mono text-xs sm:text-sm text-yellow-300 font-bold tracking-wider">
              SELURUH MUSUH TERKAPAR // DOWN!
            </span>
          </div>

          {/* Center Showcase */}
          <div className="my-auto flex flex-col items-center text-center">
            {/* Giant Stylized Finish Splash */}
            <div className="relative transform -rotate-2 mb-6">
              <div className="absolute -inset-3 bg-white skew-x-[-15deg] shadow-2xl" />
              <div className="relative bg-[#FF0033] text-black px-12 sm:px-24 py-4 skew-x-[-15deg] border-4 border-black shadow-2xl">
                <h1 className="font-bebas text-5xl sm:text-8xl tracking-wider italic font-black drop-shadow-[0_4px_0_#000000]">
                  SHOWTIME FINISH!
                </h1>
              </div>
            </div>

            {/* Signature Stylish Quote */}
            <blockquote className="bg-black/90 border-l-8 border-[#FF0033] px-6 py-3 max-w-2xl skew-x-[-8deg] shadow-2xl">
              <p className="transform skew-x-[8deg] font-serif text-lg sm:text-2xl text-neutral-100 italic">
                {heroQuote}
              </p>
            </blockquote>

            <p className="font-mono text-xs text-neutral-400 mt-4 uppercase tracking-widest">
              GABUNGAN SUKMA: {hero.name.toUpperCase()} &bull; {spirit.name.toUpperCase()} (TINGKAT {awakenRank})
            </p>
          </div>

          {/* Bottom Tap to Continue Banner */}
          <div className="flex items-center justify-between border-t-2 border-neutral-800 pt-3 text-xs font-mono text-neutral-400">
            <span>TEKAN DI MANA SAJA UNTUK MELANJUTKAN</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              LANJUT &rarr;
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
