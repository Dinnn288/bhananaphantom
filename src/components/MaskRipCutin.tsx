import React, { useEffect, useState } from 'react';
import { Hero, SpiritCompanion, Skill } from '../types';
import { Flame, Sparkles, Zap, Skull, ShieldAlert } from 'lucide-react';

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
  const [ripStage, setRipStage] = useState<'grip' | 'fracture' | 'tear' | 'burst'>('grip');
  const [flashActive, setFlashActive] = useState<boolean>(false);

  useEffect(() => {
    // Stage 1: Grip (0-160ms) - Hand clutches the mask, eyes narrow with lethal focus
    // Stage 2: Fracture (160-340ms) - Mask cracks with glowing fracture veins, screen flash
    // Stage 3: Tear (340-540ms) - Violent mask pull with plasma arcs & breaking chains
    // Stage 4: Burst (540ms+) - Full soul geyser eruption, flying shards, eye cut-in flash
    const t1 = setTimeout(() => {
      setRipStage('fracture');
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 90);
    }, 160);

    const t2 = setTimeout(() => {
      setRipStage('tear');
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 70);
    }, 340);

    const t3 = setTimeout(() => {
      setRipStage('burst');
    }, 540);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const heroId = hero?.id || 'renald';
  const name = hero?.name || heroName || 'Renald Suryakusuma';
  const shortName = name.split(' ')[0].toUpperCase();
  const spiritName = spirit?.name || 'Roh Pelindung';
  const skillName = skill?.name || 'JURUS SUKMA';

  // Hero theme configurations for the mask rip
  const heroConfig = (() => {
    if (heroId === 'maya' || name.toLowerCase().includes('maya')) {
      return {
        alias: 'MIRROR',
        accent: '#00f5d4',
        accentBg: 'from-cyan-950 via-blue-950 to-black',
        textColor: 'text-cyan-300',
        flameColor: '#00f5d4',
        flameCore: '#ecfeff',
        eyeColor: '#a7f3d0',
        kanji: '『 ズバァァン!! 』',
        soundFx: 'HYOOOOM!!',
        callout: '“HAPUS ILUSI PALSU... CANDRA KIRANA!!”',
        subCallout: 'RANTAI BEKU ILUSI TERPUTUS!',
        icon: <Sparkles className="w-5 h-5 text-cyan-300 animate-spin-slow" />
      };
    }
    if (heroId === 'bagas' || name.toLowerCase().includes('bagas')) {
      return {
        alias: 'THUNDER',
        accent: '#ffd166',
        accentBg: 'from-amber-950 via-yellow-950 to-black',
        textColor: 'text-yellow-300',
        flameColor: '#ffd166',
        flameCore: '#fffbeb',
        eyeColor: '#fef08a',
        kanji: '『 ドゴォォォン!! 』',
        soundFx: 'KRA-KRAK!!',
        callout: '“SAMBAR MEREKA DENGAN PETIR... BHARATA!!”',
        subCallout: 'BELENGGU KUTUKAN HANCUR LEBUR!',
        icon: <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
      };
    }
    // Default: Renald (CROW)
    return {
      alias: 'CROW',
      accent: '#FF0033',
      accentBg: 'from-red-950 via-rose-950 to-black',
      textColor: 'text-red-400',
      flameColor: '#ff1e1e',
      flameCore: '#fff1f2',
      eyeColor: '#fecaca',
      kanji: '『 ガキィィン!! 』',
      soundFx: 'ZUGAAAN!!',
      callout: '“BANGKITLAH DARI KEGELAPAN... GARUDA HAYAM!!”',
      subCallout: 'PELEPASAN JIWA PEMBERONTAK!!',
      icon: <Flame className="w-5 h-5 text-red-500 animate-pulse" />
    };
  })();

  return (
    <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-center items-center select-none">
      {/* Dynamic Screen Flash Overlay on Fracture/Tear */}
      {flashActive && (
        <div className="absolute inset-0 bg-white/90 z-50 pointer-events-none transition-opacity duration-75 animate-pulse" />
      )}

      {/* Dynamic Background with Element Theme & Halftone */}
      <div className={`absolute inset-0 bg-gradient-to-r ${heroConfig.accentBg} opacity-95`} />
      <div className="absolute inset-0 bg-halftone opacity-35 pointer-events-none" />

      {/* Heavy Manga Speed Lines */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/10 to-white/30 pointer-events-none animate-pulse" />
      
      {/* Diagonal Warning / Critical Slash Bars in Background */}
      <div className="absolute -top-10 -left-10 w-[120%] h-12 bg-red-600/30 transform -rotate-6 pointer-events-none skew-x-[-20deg]" />
      <div className="absolute -bottom-10 -right-10 w-[120%] h-12 bg-yellow-400/20 transform -rotate-6 pointer-events-none skew-x-[-20deg]" />

      {/* SHATTERED SPECTRAL CHAINS (Left & Right breaking chain links) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-6 pointer-events-none z-10">
        {/* Left Chain */}
        <div 
          className={`transition-all duration-300 transform ${
            ripStage === 'grip' 
              ? 'opacity-80 translate-x-0' 
              : ripStage === 'fracture'
              ? 'opacity-90 -translate-x-2 rotate-6 scale-105'
              : 'opacity-20 -translate-x-16 rotate-12 scale-90'
          }`}
        >
          <svg width="100" height="120" viewBox="0 0 100 120" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
            <rect x="10" y="20" width="30" height="50" rx="8" fill="none" stroke="#e4e4e7" strokeWidth="6" />
            <rect x="30" y="45" width="30" height="50" rx="8" fill="none" stroke={heroConfig.accent} strokeWidth="6" />
            {ripStage !== 'grip' && (
              <>
                <line x1="25" y1="20" x2="35" y2="40" stroke="#fbbf24" strokeWidth="3" />
                <circle cx="28" cy="30" r="3" fill="#ffffff" className="animate-ping" />
                <line x1="45" y1="65" x2="60" y2="85" stroke="#fbbf24" strokeWidth="3" />
              </>
            )}
          </svg>
        </div>

        {/* Right Chain */}
        <div 
          className={`transition-all duration-300 transform ${
            ripStage === 'grip' 
              ? 'opacity-80 translate-x-0' 
              : ripStage === 'fracture'
              ? 'opacity-90 translate-x-2 -rotate-6 scale-105'
              : 'opacity-20 translate-x-16 -rotate-12 scale-90'
          }`}
        >
          <svg width="100" height="120" viewBox="0 0 100 120" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
            <rect x="40" y="20" width="30" height="50" rx="8" fill="none" stroke="#e4e4e7" strokeWidth="6" />
            <rect x="20" y="45" width="30" height="50" rx="8" fill="none" stroke={heroConfig.accent} strokeWidth="6" />
            {ripStage !== 'grip' && (
              <>
                <line x1="55" y1="20" x2="45" y2="40" stroke="#fbbf24" strokeWidth="3" />
                <circle cx="50" cy="30" r="3" fill="#ffffff" className="animate-ping" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Top Banner: Awakening Callout Header */}
      <div className="relative z-30 mb-2 transform -rotate-1 animate-spirit-slide">
        <div className="flex items-center gap-2 bg-black border-2 border-white px-4 sm:px-6 py-1 skew-x-[-15deg] shadow-[0_0_30px_rgba(255,0,51,0.9)]">
          <span className="bg-[#FF0033] text-black font-black text-[10px] sm:text-xs px-2 py-0.5 uppercase tracking-widest font-mono">
            ★ PERSONA AWAKENING ★
          </span>
          <span className="text-white font-bebas text-base sm:text-2xl tracking-wider font-black italic flex items-center gap-2">
            {heroConfig.icon}
            <span>MEMBUKA TOPENG SUKMA // {heroConfig.alias}</span>
          </span>
          <span className="hidden sm:inline bg-yellow-300 text-black font-mono font-bold text-[10px] px-1.5 py-0.5 uppercase">
            {heroConfig.subCallout}
          </span>
        </div>
      </div>

      {/* Centerpiece: Persona Mask-Rip Dynamic Visual Cut-in Panel */}
      <div className="relative z-30 w-full max-w-3xl px-3 sm:px-6 flex flex-col items-center">
        {/* Slanted Manga Panel Box */}
        <div className="w-full relative bg-neutral-950 border-4 border-white skew-x-[-10deg] shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden p-3 sm:p-5 flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-transparent to-black/70 pointer-events-none" />

          {/* Left: Dynamic Animated Face & Peeling Mask SVG */}
          <div className="transform skew-x-[10deg] relative w-36 h-36 sm:w-52 sm:h-52 shrink-0 rounded-lg overflow-hidden border-2 border-neutral-700 bg-black shadow-2xl">
            <svg viewBox="0 0 160 160" className="w-full h-full">
              <defs>
                <radialGradient id="maskFlameGlowBig" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor={heroConfig.flameColor} stopOpacity="0.95" />
                  <stop offset="60%" stopColor={heroConfig.accent} stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <filter id="ultraGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Aura */}
              <rect width="160" height="160" fill="#09090b" />
              <circle cx="80" cy="80" r="70" fill="url(#maskFlameGlowBig)" />

              {/* Dynamic Aura Shockwave Ring on Tear */}
              {(ripStage === 'tear' || ripStage === 'burst') && (
                <circle
                  cx="80"
                  cy="75"
                  r={ripStage === 'tear' ? 65 : 78}
                  fill="none"
                  stroke={heroConfig.flameColor}
                  strokeWidth={ripStage === 'tear' ? 4 : 2}
                  opacity={ripStage === 'tear' ? 0.9 : 0.4}
                  className="animate-ping"
                />
              )}

              {/* Character Face & Neck */}
              <polygon points="65,98 95,98 91,134 69,134" fill="#fde68a" />
              <path d="M 45 56 Q 80 110 115 56 Q 115 34 80 28 Q 45 34 45 56 Z" fill="#fed7aa" />

              {/* Tense Jawline Shadow */}
              <path d="M 52 74 Q 80 108 108 74" stroke="#d97706" strokeWidth="2.5" fill="none" opacity="0.6" />

              {/* Determined / Roaring Mouth */}
              {ripStage === 'burst' || ripStage === 'tear' ? (
                <g>
                  {/* Open Roaring Mouth */}
                  <ellipse cx="80" cy="94" rx="10" ry="7" fill="#450a0a" stroke="#991b1b" strokeWidth="2" />
                  <path d="M 72 92 Q 80 95 88 92" stroke="#ffffff" strokeWidth="2" fill="none" />
                </g>
              ) : (
                <path d="M 70 92 Q 80 97 90 92" stroke="#7f1d1d" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}

              {/* Hair Base */}
              {heroId === 'maya' || name.toLowerCase().includes('maya') ? (
                <path d="M 36 40 Q 80 14 124 40 Q 132 80 126 115 L 112 115 Q 116 68 108 50 Q 80 28 52 50 Q 44 68 48 115 L 34 115 Z" fill="#1e1b4b" />
              ) : heroId === 'bagas' || name.toLowerCase().includes('bagas') ? (
                <path d="M 42 44 L 54 20 L 70 30 L 86 16 L 100 30 L 116 24 L 112 48 Z" fill="#451a03" />
              ) : (
                <path d="M 40 46 L 52 18 L 68 30 L 84 14 L 98 28 L 114 20 L 110 52 Z" fill="#18181b" />
              )}

              {/* UNMASKED FIERCE GLOWING EYES */}
              <g filter="url(#ultraGlow)">
                {/* Left Eye */}
                <polygon points="54,62 70,57 68,66 56,66" fill="#ffffff" />
                <circle cx="62" cy="62" r="4.5" fill={heroConfig.accent} />
                <circle cx="62" cy="62" r="2.2" fill={heroConfig.flameCore} />

                {/* Right Eye */}
                <polygon points="106,62 90,57 92,66 104,66" fill="#ffffff" />
                <circle cx="98" cy="62" r="4.5" fill={heroConfig.accent} />
                <circle cx="98" cy="62" r="2.2" fill={heroConfig.flameCore} />

                {/* Fierce Eyebrows Glare */}
                <path d="M 52 55 L 72 60" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 108 55 L 88 60" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />

                {/* Persona Ocular Flame Trails (Streaming from eyes) */}
                <path d="M 62 62 Q 40 40 28 44" stroke={heroConfig.flameColor} strokeWidth="2.5" fill="none" opacity="0.85" />
                <path d="M 98 62 Q 120 40 132 44" stroke={heroConfig.flameColor} strokeWidth="2.5" fill="none" opacity="0.85" />
              </g>

              {/* BURSTING SOUL FLAMES (Erupting skyward from eyes and skull) */}
              {(ripStage === 'tear' || ripStage === 'burst') && (
                <g filter="url(#ultraGlow)">
                  {/* Left Eye Flame Column */}
                  <path d="M 58 58 Q 42 30 50 10 Q 64 24 63 56 Z" fill={heroConfig.flameColor} opacity="0.9" />
                  <path d="M 62 60 Q 70 38 78 18 Q 68 40 66 58 Z" fill={heroConfig.flameCore} opacity="0.85" />

                  {/* Right Eye Flame Column */}
                  <path d="M 102 58 Q 118 30 110 10 Q 96 24 97 56 Z" fill={heroConfig.flameColor} opacity="0.9" />
                  <path d="M 98 60 Q 90 38 82 18 Q 92 40 94 58 Z" fill={heroConfig.flameCore} opacity="0.85" />

                  {/* Towering Crown Soul Fire */}
                  <path d="M 80 50 Q 76 10 80 2 Q 84 10 80 50 Z" fill="#ffffff" />
                  <path d="M 74 52 Q 80 18 86 52 Z" fill={heroConfig.flameColor} opacity="0.8" />
                </g>
              )}

              {/* THE PHANTOM MASK (Transforms, Cracks, and Rips Away) */}
              <g
                className="transition-all duration-300"
                style={{
                  transform:
                    ripStage === 'grip'
                      ? 'translate(0px, 0px) rotate(0deg)'
                      : ripStage === 'fracture'
                      ? 'translate(4px, -2px) rotate(2deg)'
                      : ripStage === 'tear'
                      ? 'translate(22px, -16px) rotate(14deg)'
                      : 'translate(65px, -50px) rotate(35deg) scale(0.6)',
                  opacity: ripStage === 'burst' ? 0.2 : 1,
                  filter: `drop-shadow(0 0 14px ${heroConfig.accent})`
                }}
              >
                {/* Main Mask Wing Shape */}
                <path
                  d="M 44 58 Q 60 46 80 52 Q 100 46 116 58 Q 110 74 80 70 Q 50 74 44 58 Z"
                  fill="#09090b"
                  stroke={heroConfig.accent}
                  strokeWidth="2.8"
                />
                {/* Pointed Wing Feathers */}
                <polygon points="44,58 30,51 41,63" fill={heroConfig.accent} />
                <polygon points="116,58 130,51 119,63" fill={heroConfig.accent} />

                {/* Glowing Fracture Lines on Mask during Fracture & Tear */}
                {ripStage !== 'grip' && (
                  <g>
                    <line x1="80" y1="52" x2="84" y2="70" stroke="#ffffff" strokeWidth="2.5" />
                    <line x1="68" y1="56" x2="74" y2="68" stroke={heroConfig.flameCore} strokeWidth="2" />
                    <line x1="92" y1="55" x2="88" y2="66" stroke={heroConfig.flameCore} strokeWidth="2" />
                  </g>
                )}

                {/* Hand / Tactical Knuckle Glove Gripping the Mask Edge */}
                <g
                  style={{
                    transform:
                      ripStage === 'grip'
                        ? 'translate(0px, 0px)'
                        : 'translate(12px, -8px) rotate(6deg)'
                  }}
                >
                  <ellipse cx="114" cy="62" rx="8" ry="12" fill="#18181b" stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx="112" cy="55" r="4" fill="#27272a" />
                  <circle cx="116" cy="63" r="4" fill="#27272a" />
                  <circle cx="114" cy="71" r="3.5" fill="#27272a" />
                  {/* Knuckle Studs */}
                  <circle cx="112" cy="55" r="1.5" fill="#e4e4e7" />
                  <circle cx="116" cy="63" r="1.5" fill="#e4e4e7" />
                </g>
              </g>

              {/* EXPLODING MASK SHARDS & PLASMA SPARS (Stage Burst & Tear) */}
              {ripStage !== 'grip' && (
                <g>
                  {/* Shard 1 (Top Left) */}
                  <polygon points="42,40 50,34 46,46" fill={heroConfig.accent} opacity="0.9" />
                  {/* Shard 2 (Top Right) */}
                  <polygon points="128,38 138,32 132,44" fill={heroConfig.flameCore} opacity="0.95" />
                  {/* Shard 3 (Center Burst) */}
                  <polygon points="85,35 92,28 90,40" fill="#ffffff" />
                  {/* Shard 4 (Bottom) */}
                  <polygon points="120,75 128,68 126,80" fill={heroConfig.accent} />
                  {/* Plasma sparks */}
                  <circle cx="75" cy="45" r="2.5" fill="#fbbf24" className="animate-ping" />
                  <circle cx="105" cy="48" r="2" fill="#ffffff" />
                  <circle cx="95" cy="72" r="2" fill="#f87171" />
                </g>
              )}
            </svg>
          </div>

          {/* Right: Dramatic Manga Typography, Kanji Sound Effect & Hero Callout */}
          <div className="transform skew-x-[10deg] ml-3 sm:ml-6 flex-1 min-w-0">
            {/* Manga Sound Effect Katakana Stamp */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="bg-yellow-300 text-black font-black text-xs sm:text-base px-2.5 py-0.5 skew-x-[-10deg] uppercase tracking-wider font-bebas shadow-md">
                {heroConfig.kanji} {heroConfig.soundFx}
              </span>
              <span className="text-white font-mono text-[10px] sm:text-xs hidden sm:inline uppercase tracking-widest opacity-80">
                P5 SOUL EXORCISM
              </span>
            </div>

            {/* Main Action Title */}
            <h3 className="font-bebas text-3xl sm:text-6xl text-white tracking-wide font-black italic drop-shadow-[3px_3px_0_#000] leading-tight">
              BUKA TOPENG!!
            </h3>

            {/* Quoted Hero Awakening Slogan */}
            <div className="my-1 sm:my-2 border-l-4 border-yellow-400 pl-2.5 sm:pl-3 bg-black/40 py-1">
              <p className="font-bebas text-lg sm:text-2xl text-yellow-300 tracking-wider font-bold italic drop-shadow-[0_0_15px_rgba(255,209,102,0.7)] truncate sm:whitespace-normal">
                {heroConfig.callout}
              </p>
            </div>

            {/* Sub-details: Skill & Spirit */}
            <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs font-mono pt-1 text-neutral-300 border-t border-neutral-800">
              <span className="truncate max-w-[140px] sm:max-w-none">
                JURUS: <strong className="text-white uppercase">{skillName}</strong>
              </span>
              <span className="text-amber-400 font-bold uppercase truncate">
                ROH: {spiritName}
              </span>
            </div>
          </div>
        </div>

        {/* EYE-CUTIN SLIT (Persona 5 signature ocular cut-in strip across the screen on Burst) */}
        {ripStage === 'burst' && (
          <div className="w-full mt-2 transform -rotate-1 skew-x-[-12deg] bg-black border-2 border-yellow-400 shadow-[0_0_30px_rgba(255,209,102,0.8)] overflow-hidden flex items-center justify-between px-4 py-1 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-white font-bebas text-base sm:text-xl italic font-black tracking-widest">
                EYE CUT-IN // {heroConfig.alias} TERCENGANG MEMBARA
              </span>
            </div>
            <span className="text-yellow-300 font-mono font-bold text-xs uppercase italic tracking-wider">
              CRITICAL STRIKE READY &gt;&gt;&gt;
            </span>
          </div>
        )}
      </div>

      {/* Bottom Dramatic Slash Sound Tag */}
      <div className="relative z-30 mt-2 sm:mt-3 transform rotate-1 animate-shake">
        <div className="bg-[#FF0033] text-black border-2 border-black px-6 py-1 skew-x-[-12deg] shadow-2xl">
          <span className="font-bebas text-lg sm:text-2xl font-black italic tracking-widest flex items-center gap-2">
            <span>★ CRITICAL SPIRIT RELEASE &bull; SUKMA BANGKIT ★</span>
          </span>
        </div>
      </div>
    </div>
  );
};
