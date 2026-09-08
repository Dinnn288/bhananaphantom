import React, { useEffect, useRef, useState } from 'react';
import { Hero, SpiritCompanion, Skill, ElementType } from '../types';
import { AnimePortrait } from './AnimePortrait';
import { MaskRipCutin } from './MaskRipCutin';
import { audioService } from '../services/audioService';
import { Flame, Sparkles, Zap, Wind, Shield, Skull, Crosshair, Sword } from 'lucide-react';

interface SpiritAttackAnimationProps {
  hero?: Hero;
  heroName?: string;
  spirit?: SpiritCompanion;
  skill?: Skill;
  isShowtime?: boolean;
  onComplete: () => void;
}

export const SpiritAttackAnimation: React.FC<SpiritAttackAnimationProps> = ({
  hero,
  heroName,
  spirit,
  skill,
  isShowtime = false,
  onComplete
}) => {
  const [phase, setPhase] = useState<'mask_rip' | 'elemental_strike'>('mask_rip');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // 1. Play Persona Mask Rip audio on invocation
    audioService.playMaskRip();

    // 2. Transition from Mask Rip animation to Elemental Spirit Strike
    const ripTimer = setTimeout(() => {
      setPhase('elemental_strike');
      audioService.playCritical();
    }, 800);

    // 3. Complete overall animation cleanly
    const finishTimer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, isShowtime ? 2100 : 1750);

    return () => {
      clearTimeout(ripTimer);
      clearTimeout(finishTimer);
    };
  }, [isShowtime]);

  // Elemental theme configurations
  const elementTheme: Record<
    ElementType,
    {
      bgGradient: string;
      accentColor: string;
      textColor: string;
      borderColor: string;
      icon: React.ReactNode;
      label: string;
    }
  > = {
    Agni: {
      bgGradient: 'from-red-950/80 via-orange-950/70 to-black/90',
      accentColor: '#FF0033',
      textColor: 'text-red-500',
      borderColor: 'border-[#FF0033]',
      icon: <Flame className="w-8 h-8 text-[#FF0033] animate-pulse" />,
      label: 'KOBARAN API BARA AGNI'
    },
    Tirta: {
      bgGradient: 'from-cyan-950/80 via-blue-950/70 to-black/90',
      accentColor: '#00f5d4',
      textColor: 'text-cyan-400',
      borderColor: 'border-[#00f5d4]',
      icon: <Sparkles className="w-8 h-8 text-[#00f5d4] animate-pulse" />,
      label: 'PEMBEKUAN ES TELAGA TIRTA'
    },
    Vidyut: {
      bgGradient: 'from-yellow-950/80 via-amber-950/70 to-black/90',
      accentColor: '#ffd166',
      textColor: 'text-yellow-400',
      borderColor: 'border-[#ffd166]',
      icon: <Zap className="w-8 h-8 text-[#ffd166] animate-pulse" />,
      label: 'SAMBARAN PETIR HALILINTAR VIDYUT'
    },
    Bayu: {
      bgGradient: 'from-emerald-950/80 via-teal-950/70 to-black/90',
      accentColor: '#06d6a0',
      textColor: 'text-emerald-400',
      borderColor: 'border-[#06d6a0]',
      icon: <Wind className="w-8 h-8 text-[#06d6a0] animate-pulse" />,
      label: 'BADAI TEBASAN ANGIN BAYU'
    },
    Nur: {
      bgGradient: 'from-amber-900/60 via-yellow-900/50 to-black/90',
      accentColor: '#ffd700',
      textColor: 'text-yellow-200',
      borderColor: 'border-yellow-400',
      icon: <Shield className="w-8 h-8 text-yellow-300 animate-pulse" />,
      label: 'BERKAS CAHAYA SUCI NUR'
    },
    Ghaib: {
      bgGradient: 'from-purple-950/80 via-neutral-950/90 to-black/95',
      accentColor: '#9333ea',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-600',
      icon: <Skull className="w-8 h-8 text-purple-400 animate-pulse" />,
      label: 'KUTUKAN KEGELAPAN GHAIB'
    },
    Fisik: {
      bgGradient: 'from-red-950/80 via-stone-900/70 to-black/90',
      accentColor: '#ef4444',
      textColor: 'text-red-400',
      borderColor: 'border-red-500',
      icon: <Sword className="w-8 h-8 text-red-500 animate-pulse" />,
      label: 'HANTAMAN TEBASAN FISIK'
    },
    Peluru: {
      bgGradient: 'from-blue-950/80 via-slate-900/70 to-black/90',
      accentColor: '#38bdf8',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-400',
      icon: <Crosshair className="w-8 h-8 text-sky-400 animate-pulse" />,
      label: 'TEMBAKAN JIMAT PELURU PERAK'
    }
  };

  const rawElement = skill?.element || spirit?.element || 'Agni';
  const element: ElementType = (rawElement in elementTheme) ? rawElement : 'Agni';
  const theme = elementTheme[element] || elementTheme.Agni;

  const resolvedHeroName = hero?.name || heroName || 'Pahlawan';
  const shortHeroName = resolvedHeroName.split(' ')[0] || 'PAHLAWAN';

  const spiritName = spirit?.name || 'Roh Pelindung';
  const spiritColor = spirit?.colorHex || theme.accentColor;
  const spiritElement = spirit?.element || element;
  const signatureQuote = spirit?.signatureQuote || 'Kekuatan jiwa bangkit melawan kegelapan!';

  const skillName = skill?.name || (isShowtime ? 'PUNCAK KEKUATAN KOSMIK' : 'SERANGAN JIWA');
  const skillPower = skill?.power ?? 60;
  const skillTarget = skill?.target || 'single';

  if (phase === 'mask_rip') {
    return (
      <MaskRipCutin
        hero={hero}
        heroName={resolvedHeroName}
        spirit={spirit}
        skill={skill}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none flex flex-col justify-between select-none">
      {/* Dynamic Background Atmosphere */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${theme.bgGradient} opacity-85 transition-opacity duration-300`}
      />

      {/* Manga Speed Lines Overlay */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-white/20 pointer-events-none" />

      {/* ================= TOP: SPIRIT SUMMON CUT-IN RIBBON ================= */}
      <div className="relative z-30 pt-6 px-4 sm:px-8 animate-spirit-slide">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/95 border-2 border-white px-5 py-3 skew-x-[-12deg] shadow-2xl p5-shadow-red max-w-3xl">
          <div className="flex items-center gap-3.5 transform skew-x-[12deg]">
            {hero && (
              <div className="hidden sm:block">
                <AnimePortrait characterId={hero.id} emotion="determined" size="sm" isCutin />
              </div>
            )}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-white shadow-lg bg-black"
              style={{ borderColor: spiritColor }}
            >
              {theme.icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black rounded skew-x-[-8deg]"
                  style={{ backgroundColor: spiritColor }}
                >
                  ROH PENDAMPING &bull; {spiritElement}
                </span>
                <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest">
                  {shortHeroName} MENYERUKAN:
                </span>
              </div>
              <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider font-bold">
                {spiritName}
              </h2>
            </div>
          </div>

          <div className="transform skew-x-[12deg] text-left sm:text-right border-l sm:border-l-0 sm:border-r border-neutral-700 pl-3 sm:pl-0 sm:pr-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
              JURUS KEKUATAN JIWA
            </span>
            <span className="font-bebas text-2xl sm:text-3xl text-yellow-300 tracking-wide font-black">
              {skillName}
            </span>
          </div>
        </div>

        {/* Spirit Signature Quote Slanted Toast */}
        <div className="mt-2 inline-block bg-[#121217] border-l-4 border-white px-3 py-1 skew-x-[-12deg] shadow-md">
          <span className="transform skew-x-[12deg] text-xs font-mono text-neutral-300 italic block">
            {signatureQuote}
          </span>
        </div>
      </div>

      {/* ================= MIDDLE: ELEMENTAL ATTACK VFX ON ARENA ================= */}
      <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none">
        {/* AGNI (FIRE) ANIMATION */}
        {element === 'Agni' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Swirling Fire Tornado */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 opacity-75 blur-2xl animate-fire-erupt" />

            {/* Searing Fire Claws Slashes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[130%] h-5 bg-gradient-to-r from-transparent via-yellow-200 to-transparent transform -rotate-45 shadow-[0_0_35px_#ff0033] animate-elemental-slash" />
              <div
                className="w-[130%] h-8 bg-gradient-to-r from-transparent via-red-500 to-transparent transform rotate-35 shadow-[0_0_45px_#ff4400] animate-elemental-slash"
                style={{ animationDelay: '0.12s' }}
              />
              <div
                className="w-[130%] h-6 bg-gradient-to-r from-transparent via-orange-400 to-transparent transform -rotate-15 shadow-[0_0_40px_#ffaa00] animate-elemental-slash"
                style={{ animationDelay: '0.22s' }}
              />
            </div>

            {/* Comic SFX Tag */}
            <div className="absolute top-1/4 right-1/4 transform rotate-12 z-20 animate-shake">
              <div className="bg-yellow-300 text-red-950 font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-red-600 shadow-[3px_3px_0_#ff0033]">
                BAAAKAAAR!!
              </div>
            </div>

            {/* Blazing Center Burst */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-yellow-300 font-black italic tracking-tighter drop-shadow-[0_0_30px_#ff0033]">
                AGI BURST!
              </span>
            </div>
          </div>
        )}

        {/* TIRTA (ICE) ANIMATION */}
        {element === 'Tirta' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Frost Aura */}
            <div className="absolute w-80 h-80 rounded-full bg-cyan-400 opacity-60 blur-3xl animate-ice-burst" />

            {/* Ice Shards Rising */}
            <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
              <div className="w-14 h-72 bg-gradient-to-t from-cyan-300 via-white to-transparent transform rotate-12 clip-polygon animate-ice-burst shadow-[0_0_30px_#00f5d4]" />
              <div
                className="w-16 h-88 bg-gradient-to-t from-blue-400 via-cyan-100 to-white transform -rotate-6 clip-polygon animate-ice-burst shadow-[0_0_40px_#00f5d4]"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-14 h-80 bg-gradient-to-t from-cyan-200 via-white to-transparent transform rotate-20 clip-polygon animate-ice-burst shadow-[0_0_35px_#00f5d4]"
                style={{ animationDelay: '0.18s' }}
              />
            </div>

            {/* Comic SFX Tag */}
            <div className="absolute top-1/4 left-1/4 transform -rotate-12 z-20 animate-shake">
              <div className="bg-cyan-200 text-blue-950 font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-cyan-400 shadow-[3px_3px_0_#00f5d4]">
                BEEEEKUUU!!
              </div>
            </div>

            {/* Center Frost Nova Text */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-cyan-200 font-black italic tracking-tighter drop-shadow-[0_0_35px_#00f5d4]">
                BUFULA NOVA!
              </span>
            </div>
          </div>
        )}

        {/* VIDYUT (LIGHTNING) ANIMATION */}
        {element === 'Vidyut' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Flash screen */}
            <div className="absolute inset-0 bg-yellow-300/40 animate-lightning pointer-events-none" />

            {/* Lightning Bolts SVG */}
            <svg className="absolute inset-0 w-full h-full animate-lightning" viewBox="0 0 800 500">
              <path
                d="M 400 0 L 380 140 L 440 180 L 370 320 L 420 350 L 390 500"
                stroke="#ffd166"
                strokeWidth="14"
                fill="none"
                filter="drop-shadow(0 0 20px #ffd166)"
              />
              <path
                d="M 280 0 L 290 120 L 250 200 L 320 280 L 290 420 L 310 500"
                stroke="#ffffff"
                strokeWidth="10"
                fill="none"
                filter="drop-shadow(0 0 16px #38bdf8)"
              />
              <path
                d="M 520 0 L 500 160 L 560 220 L 480 340 L 530 400 L 510 500"
                stroke="#ffd166"
                strokeWidth="12"
                fill="none"
                filter="drop-shadow(0 0 20px #ffd166)"
              />
            </svg>

            {/* Comic SFX Tag */}
            <div className="absolute bottom-1/3 right-1/4 transform rotate-6 z-20 animate-shake">
              <div className="bg-yellow-400 text-black font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-yellow-200 shadow-[3px_3px_0_#eab308]">
                DZZZZTTT!!
              </div>
            </div>

            {/* Thunder Text */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-amber-300 font-black italic tracking-tighter drop-shadow-[0_0_40px_#facc15]">
                ZIONGA STRIKE!
              </span>
            </div>
          </div>
        )}

        {/* BAYU (WIND) ANIMATION */}
        {element === 'Bayu' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Cyclone Rings */}
            <div className="absolute w-88 h-88 rounded-full border-8 border-dashed border-emerald-400 opacity-80 animate-wind-vortex shadow-[0_0_35px_#06d6a0]" />
            <div
              className="absolute w-72 h-72 rounded-full border-6 border-dashed border-teal-200 opacity-90 animate-wind-vortex"
              style={{ animationDirection: 'reverse' }}
            />

            {/* Crescent Wind Blades */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[120%] h-4 bg-gradient-to-r from-transparent via-emerald-300 to-transparent transform rotate-45 animate-elemental-slash shadow-[0_0_30px_#06d6a0]" />
              <div
                className="w-[120%] h-4 bg-gradient-to-r from-transparent via-teal-200 to-transparent transform -rotate-45 animate-elemental-slash shadow-[0_0_30px_#06d6a0]"
                style={{ animationDelay: '0.12s' }}
              />
            </div>

            {/* Comic SFX Tag */}
            <div className="absolute top-1/4 right-1/3 transform -rotate-8 z-20 animate-shake">
              <div className="bg-emerald-300 text-teal-950 font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-emerald-500 shadow-[3px_3px_0_#059669]">
                WHIIIRRR!!
              </div>
            </div>

            {/* Wind Vortex Text */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-emerald-300 font-black italic tracking-tighter drop-shadow-[0_0_35px_#06d6a0]">
                GARULA CYCLONE!
              </span>
            </div>
          </div>
        )}

        {/* NUR (HOLY) ANIMATION */}
        {element === 'Nur' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Celestial Pillars of Light */}
            <div className="absolute top-0 bottom-0 w-52 bg-gradient-to-b from-yellow-100 via-yellow-300/70 to-transparent animate-holy-beam blur-sm shadow-[0_0_60px_#ffd700]" />
            <div
              className="absolute top-0 bottom-0 w-80 bg-gradient-to-b from-white via-amber-200/50 to-transparent animate-holy-beam blur-md"
              style={{ animationDelay: '0.12s' }}
            />

            {/* Sacred Radial Halo */}
            <div className="absolute w-72 h-72 rounded-full border-4 border-yellow-200 animate-pulse shadow-[0_0_40px_#ffd700]" />

            {/* Comic SFX Tag */}
            <div className="absolute bottom-1/4 left-1/4 transform rotate-12 z-20 animate-shake">
              <div className="bg-yellow-200 text-amber-950 font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-yellow-400 shadow-[3px_3px_0_#d97706]">
                BLIIIND!!
              </div>
            </div>

            {/* Holy Beam Text */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-yellow-200 font-black italic tracking-tighter drop-shadow-[0_0_45px_#ffd700]">
                KOUGAON RAY!
              </span>
            </div>
          </div>
        )}

        {/* GHAIB (CURSE) ANIMATION */}
        {element === 'Ghaib' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Void Singularity */}
            <div className="absolute w-80 h-80 rounded-full bg-purple-950 border-4 border-purple-500 opacity-95 animate-curse-darkness shadow-[0_0_55px_#9333ea]" />

            {/* Demonic Slashes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-5 bg-gradient-to-r from-transparent via-purple-500 to-transparent transform -rotate-30 animate-elemental-slash shadow-[0_0_35px_#9333ea]" />
              <div
                className="w-full h-5 bg-gradient-to-r from-transparent via-red-600 to-transparent transform rotate-30 animate-elemental-slash shadow-[0_0_35px_#dc2626]"
                style={{ animationDelay: '0.12s' }}
              />
            </div>

            {/* Comic SFX Tag */}
            <div className="absolute top-1/4 right-1/4 transform rotate-12 z-20 animate-shake">
              <div className="bg-purple-600 text-white font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-purple-400 shadow-[3px_3px_0_#581c87]">
                KRAAASH!!
              </div>
            </div>

            {/* Curse Text */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-purple-400 font-black italic tracking-tighter drop-shadow-[0_0_40px_#9333ea]">
                EIGA VOID!
              </span>
            </div>
          </div>
        )}

        {/* FISIK (PHYSICAL SLASH) ANIMATION */}
        {element === 'Fisik' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Manga Action Speedlines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-6 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-25 animate-elemental-slash shadow-[0_0_30px_#ffffff]" />
              <div
                className="w-full h-7 bg-gradient-to-r from-transparent via-red-500 to-transparent transform rotate-25 animate-elemental-slash shadow-[0_0_40px_#FF0033]"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-full h-9 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform -rotate-5 animate-elemental-slash shadow-[0_0_40px_#ffd166]"
                style={{ animationDelay: '0.18s' }}
              />
            </div>

            {/* Comic SFX Tag */}
            <div className="absolute top-1/3 left-1/4 transform -rotate-12 z-20 animate-shake">
              <div className="bg-white text-black font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-red-600 shadow-[3px_3px_0_#ff0033]">
                TEBAAAS!!
              </div>
            </div>

            {/* Impact Text */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-white font-black italic tracking-tighter drop-shadow-[0_0_35px_#FF0033]">
                CRITICAL CLEAVE!
              </span>
            </div>
          </div>
        )}

        {/* PELURU (GUN / TALISMAN SHOT) ANIMATION */}
        {element === 'Peluru' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Target Reticle Crosshair */}
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-dashed border-sky-400 animate-spin opacity-80" />
            <div className="absolute w-36 h-36 rounded-full border-2 border-sky-200 animate-pulse" />
            <div className="absolute w-2 h-16 bg-sky-400 shadow-[0_0_15px_#38bdf8]" />
            <div className="absolute w-16 h-2 bg-sky-400 shadow-[0_0_15px_#38bdf8]" />

            {/* Silver Bullets / Talisman Laser Tracers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[120%] h-3 bg-gradient-to-r from-transparent via-sky-300 to-white transform -rotate-12 animate-elemental-slash shadow-[0_0_25px_#38bdf8]" />
              <div
                className="w-[120%] h-3 bg-gradient-to-r from-transparent via-cyan-200 to-white transform rotate-15 animate-elemental-slash shadow-[0_0_30px_#00f5d4]"
                style={{ animationDelay: '0.12s' }}
              />
            </div>

            {/* Comic SFX Tag */}
            <div className="absolute bottom-1/4 right-1/4 transform rotate-12 z-20 animate-shake">
              <div className="bg-sky-400 text-black font-black px-3 py-1 text-base sm:text-xl font-bebas skew-x-[-15deg] border-2 border-white shadow-[3px_3px_0_#0284c7]">
                DOR-DOR!!
              </div>
            </div>

            {/* Impact Text */}
            <div className="relative z-10 text-center animate-shake">
              <span className="font-bebas text-6xl sm:text-8xl text-sky-200 font-black italic tracking-tighter drop-shadow-[0_0_35px_#38bdf8]">
                TALISMAN SHOT!
              </span>
            </div>
          </div>
        )}

        {/* SHOWTIME SPECIAL BANNER */}
        {isShowtime && (
          <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-center z-30">
            <div className="relative transform -rotate-2">
              <div className="absolute -inset-2 bg-yellow-400 skew-x-[-15deg] shadow-2xl" />
              <div className="relative bg-[#FF0033] border-4 border-black px-12 py-2 skew-x-[-15deg]">
                <span className="transform skew-x-[15deg] block font-bebas text-4xl sm:text-5xl text-yellow-300 font-black italic tracking-widest animate-pulse">
                  ★ SHOWTIME FINISHER KOSMIK ★
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= BOTTOM: ELEMENTAL ATTACK BAR ================= */}
      <div className="relative z-30 pb-4 px-6">
        <div className="bg-black/90 border-t-2 border-white px-4 py-2 flex items-center justify-between skew-x-[-10deg] shadow-xl">
          <div className="flex items-center gap-2 transform skew-x-[10deg]">
            <span
              className="w-3 h-3 rounded-full animate-ping"
              style={{ backgroundColor: theme.accentColor }}
            />
            <span className="font-mono text-xs text-white font-black tracking-widest uppercase">
              {theme.label}
            </span>
          </div>

          <div className="transform skew-x-[10deg] text-xs font-mono text-neutral-400">
            Daya Hancur: <span className="text-yellow-300 font-bold">{skillPower}</span> &bull; Sasaran: <span className="uppercase text-white font-bold">{skillTarget}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
