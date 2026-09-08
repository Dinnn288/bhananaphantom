import React, { useEffect, useState } from 'react';
import { Hero, SpiritCompanion, Skill } from '../types';
import { Sparkles, Flame, Zap } from 'lucide-react';

interface MaskRipCutinProps {
  hero?: Hero;
  heroName?: string;
  spirit?: SpiritCompanion;
  skill?: Skill;
}

export const MaskRipCutin: React.FC<MaskRipCutinProps> = ({
  hero,
  heroName,
  spirit,
  skill
}) => {
  const [ripStage, setRipStage] = useState<'grip' | 'tear' | 'burst'>('grip');

  useEffect(() => {
    // Stage 1: Gripping the mask (0-150ms)
    // Stage 2: Tearing the mask off with spiritual spark (150-320ms)
    // Stage 3: Full burst of spiritual soul flame from unmasked eyes (320ms+)
    const t1 = setTimeout(() => setRipStage('tear'), 140);
    const t2 = setTimeout(() => setRipStage('burst'), 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const heroId = hero?.id || 'renald';
  const name = hero?.name || heroName || 'Renald Suryakusuma';
  const shortName = name.split(' ')[0].toUpperCase();
  const spiritName = spirit?.name || 'Roh Pelindung';
  const skillName = skill?.name || 'JURUS SUKMA';

  // Hero theme configurations for the mask rip
  const heroConfig = (() => {
    if (heroId === 'maya') {
      return {
        accent: '#00f5d4',
        accentBg: 'from-cyan-950 via-blue-950 to-black',
        textColor: 'text-cyan-300',
        flameColor: '#00f5d4',
        eyeColor: '#a7f3d0',
        callout: '“HAPUS ILUSI PALSU... CANDRA KIRANA!!”',
        icon: <Sparkles className="w-5 h-5 text-cyan-300 animate-spin-slow" />
      };
    }
    if (heroId === 'bagas') {
      return {
        accent: '#ffd166',
        accentBg: 'from-amber-950 via-yellow-950 to-black',
        textColor: 'text-yellow-300',
        flameColor: '#ffd166',
        eyeColor: '#fef08a',
        callout: '“SAMBAR MEREKA DENGAN PETIR... BHARATA!!”',
        icon: <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
      };
    }
    // Default: Renald
    return {
      accent: '#FF0033',
      accentBg: 'from-red-950 via-rose-950 to-black',
      textColor: 'text-red-400',
      flameColor: '#ff2a2a',
      eyeColor: '#fecaca',
      callout: '“BANGKITLAH DARI KEGELAPAN... GARUDA HAYAM!!”',
      icon: <Flame className="w-5 h-5 text-red-400 animate-pulse" />
    };
  })();

  return (
    <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-center items-center select-none">
      {/* Dynamic Background with Red/Dark Persona Slashes & Halftone */}
      <div className={`absolute inset-0 bg-gradient-to-r ${heroConfig.accentBg} opacity-95`} />
      <div className="absolute inset-0 bg-halftone opacity-30 pointer-events-none" />

      {/* Dynamic Speed Lines */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/10 to-white/30 pointer-events-none" />

      {/* Top Banner: Awakening Callout */}
      <div className="relative z-20 mb-3 transform -rotate-2 animate-spirit-slide">
        <div className="flex items-center gap-2 bg-black border-2 border-white px-5 py-1.5 skew-x-[-15deg] shadow-[0_0_25px_rgba(255,0,51,0.8)]">
          <span className="bg-[#FF0033] text-black font-black text-xs px-2 py-0.5 uppercase tracking-widest font-mono">
            SUMMON AWAKENING
          </span>
          <span className="text-white font-bebas text-lg sm:text-2xl tracking-wider font-bold italic flex items-center gap-2">
            {heroConfig.icon}
            <span>MEMBUKA TOPENG SUKMA // {shortName}</span>
          </span>
        </div>
      </div>

      {/* Centerpiece: Persona Mask-Rip Dynamic Visual Cut-in */}
      <div className="relative z-20 w-full max-w-2xl px-4 flex flex-col items-center">
        {/* Slanted Manga Panel Box */}
        <div className="w-full relative bg-neutral-950 border-4 border-white skew-x-[-10deg] shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden p-3 sm:p-5 flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-transparent to-black/60 pointer-events-none" />
          
          {/* Left: Dynamic Animated Face & Peeling Mask SVG */}
          <div className="transform skew-x-[10deg] relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-lg overflow-hidden border-2 border-neutral-700 bg-black shadow-2xl">
            <svg viewBox="0 0 140 140" className="w-full h-full">
              <defs>
                <radialGradient id="maskFlameGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={heroConfig.flameColor} stopOpacity="0.9" />
                  <stop offset="70%" stopColor={heroConfig.accent} stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <filter id="flameBlur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Aura */}
              <rect width="140" height="140" fill="#0c0a09" />
              <circle cx="70" cy="70" r="60" fill="url(#maskFlameGlow)" />

              {/* Character Face & Neck */}
              <polygon points="56,88 84,88 80,118 60,118" fill="#fde68a" />
              <path d="M 40 50 Q 70 98 100 50 Q 100 30 70 24 Q 40 30 40 50 Z" fill="#fed7aa" />

              {/* Determined / Fierce Mouth */}
              <path d="M 62 82 Q 70 87 78 82" stroke="#7f1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Hair Base */}
              {heroId === 'maya' ? (
                <path d="M 32 35 Q 70 12 108 35 Q 115 70 110 100 L 98 100 Q 102 60 94 44 Q 70 24 46 44 Q 38 60 42 100 L 30 100 Z" fill="#1e1b4b" />
              ) : heroId === 'bagas' ? (
                <path d="M 38 38 L 48 18 L 62 26 L 76 14 L 88 26 L 102 20 L 98 42 Z" fill="#451a03" />
              ) : (
                <path d="M 36 40 L 46 16 L 60 26 L 74 12 L 86 24 L 100 18 L 96 46 Z" fill="#18181b" />
              )}

              {/* UNMASKED FIERCE GLOWING EYES (Revealed when mask pulls off) */}
              <g filter="url(#flameBlur)">
                {/* Left Eye */}
                <polygon points="48,54 62,50 60,58 50,58" fill="#ffffff" />
                <circle cx="55" cy="54" r="4" fill={heroConfig.accent} />
                <circle cx="55" cy="54" r="2" fill={heroConfig.eyeColor} />

                {/* Right Eye */}
                <polygon points="92,54 78,50 80,58 90,58" fill="#ffffff" />
                <circle cx="85" cy="54" r="4" fill={heroConfig.accent} />
                <circle cx="85" cy="54" r="2" fill={heroConfig.eyeColor} />

                {/* Intense Eyebrow Glare */}
                <path d="M 46 48 L 64 52" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                <path d="M 94 48 L 76 52" stroke="#000" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* BURSTING SOUL FLAMES (Erupting from eyes & forehead during rip) */}
              {(ripStage === 'tear' || ripStage === 'burst') && (
                <g filter="url(#flameBlur)" className="animate-pulse">
                  {/* Left Eye Flame Tongues */}
                  <path d="M 52 50 Q 40 30 46 15 Q 56 26 55 48 Z" fill={heroConfig.flameColor} opacity="0.85" />
                  <path d="M 55 52 Q 62 36 68 22 Q 60 38 58 50 Z" fill="#fef08a" opacity="0.75" />

                  {/* Right Eye Flame Tongues */}
                  <path d="M 88 50 Q 100 30 94 15 Q 84 26 85 48 Z" fill={heroConfig.flameColor} opacity="0.85" />
                  <path d="M 85 52 Q 78 36 72 22 Q 80 38 82 50 Z" fill="#fef08a" opacity="0.75" />

                  {/* Brow Soul Crown */}
                  <circle cx="70" cy="46" r="6" fill="#ffffff" opacity="0.8" />
                  <path d="M 68 44 Q 70 20 72 44 Z" fill={heroConfig.flameColor} />
                </g>
              )}

              {/* THE PHANTOM MASK (Transforms / Tears away dynamically) */}
              <g
                className="transition-all duration-300"
                style={{
                  transform:
                    ripStage === 'grip'
                      ? 'translate(0px, 0px) rotate(0deg)'
                      : ripStage === 'tear'
                      ? 'translate(14px, -10px) rotate(8deg)'
                      : 'translate(45px, -35px) rotate(25deg) scale(0.7)',
                  opacity: ripStage === 'burst' ? 0.25 : 1,
                  filter: `drop-shadow(0 0 10px ${heroConfig.accent})`
                }}
              >
                {/* Mask Wing Shape */}
                <path
                  d="M 38 50 Q 52 40 70 45 Q 88 40 102 50 Q 96 64 70 60 Q 44 64 38 50 Z"
                  fill="#09090b"
                  stroke={heroConfig.accent}
                  strokeWidth="2.5"
                />
                {/* Mask Feather / Pointed Wings */}
                <polygon points="38,50 26,44 36,54" fill={heroConfig.accent} />
                <polygon points="102,50 114,44 104,54" fill={heroConfig.accent} />

                {/* Hand / Tactical Glove Gripping the Mask Edge */}
                <g
                  style={{
                    transform:
                      ripStage === 'grip'
                        ? 'translate(0px, 0px)'
                        : 'translate(10px, -6px) rotate(4deg)'
                  }}
                >
                  <ellipse cx="100" cy="54" rx="7" ry="10" fill="#18181b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="98" cy="48" r="3.5" fill="#27272a" />
                  <circle cx="102" cy="55" r="3.5" fill="#27272a" />
                  <circle cx="100" cy="62" r="3" fill="#27272a" />
                </g>
              </g>

              {/* FLYING SHATTERS / EMBERS (During tear and burst) */}
              {ripStage !== 'grip' && (
                <g>
                  <polygon points="110,40 116,36 114,42" fill={heroConfig.flameColor} />
                  <polygon points="122,28 126,24 128,30" fill="#ffffff" />
                  <polygon points="98,22 104,18 102,24" fill={heroConfig.accent} />
                  <circle cx="118" cy="48" r="2" fill="#ffd166" />
                  <circle cx="128" cy="36" r="1.5" fill="#ffffff" />
                </g>
              )}
            </svg>
          </div>

          {/* Right: Dramatic Typography & Quote */}
          <div className="transform skew-x-[10deg] ml-4 sm:ml-6 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-yellow-300 text-black font-black text-[11px] sm:text-xs px-2 py-0.5 skew-x-[-8deg] uppercase tracking-wider">
                PELEPASAN BELENGGU SUKMA
              </span>
              <span className="text-white font-mono text-xs hidden sm:inline uppercase tracking-widest opacity-80">
                P5 SOUL EXORCISM
              </span>
            </div>

            <h3 className="font-bebas text-3xl sm:text-5xl text-white tracking-wide font-black italic drop-shadow-[2px_2px_0_#000]">
              BUKA TOPENG!!
            </h3>

            <div className="my-1 sm:my-2 border-l-4 border-yellow-400 pl-3">
              <p className="font-bebas text-xl sm:text-3xl text-yellow-300 tracking-wider font-bold italic drop-shadow-[0_0_15px_rgba(255,209,102,0.6)]">
                {heroConfig.callout}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1 text-neutral-300 border-t border-neutral-800">
              <span>
                JURUS: <strong className="text-white uppercase">{skillName}</strong>
              </span>
              <span className="text-amber-400 font-bold uppercase">
                ROH: {spiritName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dramatic Slash Sound Tag */}
      <div className="relative z-20 mt-3 transform rotate-1 animate-shake">
        <div className="bg-[#FF0033] text-black border-2 border-black px-6 py-1 skew-x-[-12deg] shadow-2xl">
          <span className="font-bebas text-xl sm:text-2xl font-black italic tracking-widest flex items-center gap-2">
            <span>★ CRITICAL SPIRIT RELEASE ★</span>
          </span>
        </div>
      </div>
    </div>
  );
};
