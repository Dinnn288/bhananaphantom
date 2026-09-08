import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SpiritCompanion, Hero } from '../types';
import { ElementBadge } from './ElementBadge';
import { audioService } from '../services/audioService';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Crown, 
  ShieldAlert, 
  Star, 
  X, 
  Check, 
  ArrowRight,
  UserCheck,
  Award,
  Layers,
  Swords
} from 'lucide-react';

interface GachaRitualAnimationProps {
  spirit: SpiritCompanion;
  isNew: boolean;
  prevLevel?: number;
  heroes?: Hero[];
  onConfirm: () => void;
  onEquipToHero?: (heroId: string, spirit: SpiritCompanion) => void;
}

export const GachaRitualAnimation: React.FC<GachaRitualAnimationProps> = ({
  spirit,
  isNew,
  prevLevel,
  heroes = [],
  onConfirm,
  onEquipToHero
}) => {
  const isSsr = spirit.rarity === 'SSR';
  const isSr = spirit.rarity === 'SR';

  // 3 Distinct Phases: 'summoning' -> 'shatter' -> 'manifest'
  const [phase, setPhase] = useState<'summoning' | 'shatter' | 'manifest'>('summoning');
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  useEffect(() => {
    // 1. Trigger distinct rarity audio
    if (isSsr) {
      audioService.playGachaSsrSummon();
    } else if (isSr) {
      audioService.playGachaSrSummon();
    } else {
      audioService.playAwakenSound('R');
    }

    // 2. Transition from Portal Summoning to Chain/Rune Shatter (at 1000ms)
    const t1 = setTimeout(() => {
      setPhase('shatter');
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 120);

      if (isSsr) {
        audioService.playCritical();
        confetti({
          particleCount: 160,
          spread: 110,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ff0033', '#ffffff', '#fbbf24']
        });
      } else if (isSr) {
        audioService.playOneMore();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#a855f7', '#00f5d4', '#ffffff', '#818cf8']
        });
      }
    }, 1100);

    // 3. Transition from Shatter to Grand Card Manifestation (at 2100ms)
    const t2 = setTimeout(() => {
      setPhase('manifest');
      if (isSsr) {
        audioService.playAllOutFinisherFanfare();
      }
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isSsr, isSr]);

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

  // SSR Configuration: Golden Velvet, Sacred Chains, Royal Fanfare
  // SR Configuration: Amethyst Crystal, Runes, Psychic Portal
  const config = isSsr
    ? {
        themeTitle: '★ KEAJAIBAN TERTINGGI: SUKMA SSR 0.75% DIBANGKITKAN! ★',
        themeSub: 'SEGEL EMAS DIMENSI GHAIB NUSANTARA TELAH PECAH!',
        kanji: '『 神の降臨!! ULTRA RARE 』',
        soundFx: 'ZUGAAAN!!',
        colorGlow: 'shadow-[0_0_80px_rgba(255,215,0,0.85)]',
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-400',
        bgGradient: 'from-amber-950 via-red-950 to-black',
        cardBorder: 'border-4 border-yellow-400',
        badgeBg: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-black',
        accentColor: '#ffd700',
        calloutBadge: 'SSR MUKJIZAT OVERPOWER'
      }
    : {
        themeTitle: '★ RESONANSI SUKMA SAKTI: SR TERBANGKITKAN! ★',
        themeSub: 'GELOMBANG MISTIS MENJAWAB PANGGILAN SUKMA!',
        kanji: '『 秘術の覚醒!! SUPER RARE 』',
        soundFx: 'HYOOOOM!!',
        colorGlow: 'shadow-[0_0_80px_rgba(168,85,247,0.85)]',
        borderColor: 'border-purple-500',
        textColor: 'text-purple-400',
        bgGradient: 'from-purple-950 via-indigo-950 to-black',
        cardBorder: 'border-4 border-purple-500',
        badgeBg: 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 text-white',
        accentColor: '#a855f7',
        calloutBadge: 'SR SAKTI PILIHAN'
      };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none backdrop-blur-md">
      {/* Screen flash on shatter */}
      {flashActive && (
        <div className={`absolute inset-0 z-50 pointer-events-none transition-opacity duration-75 ${
          isSsr ? 'bg-yellow-100/90' : 'bg-purple-100/90'
        }`} />
      )}

      {/* Dynamic Background Atmosphere */}
      <div className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient} opacity-90`} />
      <div className="absolute inset-0 bg-halftone opacity-25 pointer-events-none" />

      {/* Diagonal Warning / Critical Slash Bars */}
      <div className="absolute -top-12 -left-10 w-[120%] h-14 bg-red-600/30 transform -rotate-6 pointer-events-none skew-x-[-20deg]" />
      <div className="absolute -bottom-12 -right-10 w-[120%] h-14 bg-yellow-400/20 transform -rotate-6 pointer-events-none skew-x-[-20deg]" />

      {/* Skip Button in Top Right */}
      <button
        onClick={handleSkipOrConfirm}
        className="absolute top-4 right-4 z-50 bg-neutral-900/90 hover:bg-[#FF0033] text-neutral-300 hover:text-white px-3.5 py-1.5 rounded skew-x-[-12deg] border border-neutral-700 transition-all font-mono text-xs font-bold cursor-pointer shadow-lg"
      >
        <span className="block transform skew-x-[12deg] flex items-center gap-1.5">
          <X className="w-4 h-4" /> LEWATI (SKIP)
        </span>
      </button>

      {/* ========================================================================= */}
      {/* PHASE 1 & 2: THE RITUAL SUMMONING & SEAL SHATTER ANIMATION */}
      {/* ========================================================================= */}
      {(phase === 'summoning' || phase === 'shatter') && (
        <div className="relative flex flex-col items-center justify-center text-center max-w-xl w-full px-4 animate-shake z-20">
          {/* Top Banner Tag */}
          <div className="mb-4 transform -rotate-1">
            <div className={`flex items-center gap-2 bg-black border-2 ${config.borderColor} px-4 py-1.5 skew-x-[-12deg] shadow-2xl`}>
              <span className={`font-mono font-black text-xs px-2 py-0.5 uppercase ${config.badgeBg}`}>
                {isSsr ? '★ CHANCE 0.75% ★' : '★ CHANCE 9.25% ★'}
              </span>
              <span className="text-white font-bebas text-lg sm:text-2xl font-black italic tracking-wider">
                {config.themeTitle}
              </span>
            </div>
          </div>

          {/* Central Sacred Altar Sigil / Tarot Seal */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-4">
            {/* Spinning Aura Rings */}
            <div className={`absolute inset-0 rounded-full border-4 border-dashed ${
              isSsr ? 'border-yellow-400' : 'border-purple-400'
            } ${phase === 'shatter' ? 'animate-ping' : 'animate-spin-slow'} opacity-75`} />
            
            <div className="absolute inset-6 rounded-full border-2 border-white/40 animate-reverse-spin" />
            <div className={`absolute inset-12 rounded-full ${
              isSsr ? 'bg-gradient-to-tr from-yellow-500/30 via-red-600/20' : 'bg-gradient-to-tr from-purple-500/30 via-cyan-500/20'
            } to-transparent blur-xl`} />

            {/* THE TAROT / SEAL TABLET SVG */}
            <div className={`relative z-10 w-44 h-60 sm:w-52 sm:h-72 bg-black rounded-lg border-4 ${
              config.borderColor
            } shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 transform ${
              phase === 'shatter' ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
            }`}>
              {/* Card Face Internal Art */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-950 p-3 flex flex-col justify-between items-center text-center">
                {/* Header Arcana */}
                <div className="flex items-center justify-between w-full border-b border-neutral-800 pb-1">
                  <span className={`font-bebas text-sm font-black ${config.textColor}`}>
                    {isSsr ? 'TAROT AGUNG' : 'PRASASTI GHAIB'}
                  </span>
                  <span className={`font-mono text-xs font-bold ${config.textColor}`}>
                    {spirit.rarity}
                  </span>
                </div>

                {/* Central Emblem / Mystic Wings */}
                <div className="relative my-auto flex flex-col items-center">
                  {isSsr ? (
                    <>
                      <Crown className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.9)] animate-pulse" />
                      <div className="font-bebas text-xl sm:text-2xl text-yellow-300 tracking-widest mt-2 font-black">
                        SUKMA RAJA
                      </div>
                    </>
                  ) : (
                    <>
                      <Zap className="w-16 h-16 sm:w-20 sm:h-20 text-purple-400 fill-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.9)] animate-pulse" />
                      <div className="font-bebas text-xl sm:text-2xl text-purple-300 tracking-widest mt-2 font-black">
                        SUKMA SAKTI
                      </div>
                    </>
                  )}
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                    {spirit.element} &bull; {spirit.name}
                  </span>
                </div>

                {/* Bottom Signature Motif */}
                <div className="w-full border-t border-neutral-800 pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>SMA 7 BHAWANA</span>
                  <span className="text-white font-bold">{isSsr ? '0.75%' : '9.25%'}</span>
                </div>
              </div>

              {/* OVERLAY: SPECTRAL CHAINS (SSR) OR RUNIC WARDS (SR) */}
              {isSsr ? (
                /* 4 Golden Chains for SSR */
                <svg viewBox="0 0 200 280" className="absolute inset-0 w-full h-full pointer-events-none">
                  {phase === 'summoning' ? (
                    <g stroke="#facc15" strokeWidth="6" fill="none" opacity="0.95" className="drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                      {/* Diagonal crossing chains */}
                      <line x1="0" y1="0" x2="200" y2="280" strokeDasharray="12 6" />
                      <line x1="200" y1="0" x2="0" y2="280" strokeDasharray="12 6" />
                      {/* Heavy Golden Center Padlock */}
                      <rect x="75" y="115" width="50" height="50" rx="6" fill="#18181b" stroke="#facc15" strokeWidth="4" />
                      <circle cx="100" cy="135" r="7" fill="#facc15" />
                      <polygon points="97,135 103,135 102,150 98,150" fill="#facc15" />
                    </g>
                  ) : (
                    /* Shattering Golden Chains & Flying Fragments */
                    <g fill="#facc15">
                      <polygon points="40,50 60,35 50,65" className="animate-ping" />
                      <polygon points="150,70 170,55 160,85" className="animate-ping" />
                      <polygon points="80,180 100,165 90,195" className="animate-ping" />
                      <polygon points="120,220 140,205 130,235" className="animate-ping" />
                      <line x1="100" y1="140" x2="40" y2="20" stroke="#fef08a" strokeWidth="4" strokeDasharray="6 6" />
                      <line x1="100" y1="140" x2="160" y2="260" stroke="#fef08a" strokeWidth="4" strokeDasharray="6 6" />
                    </g>
                  )}
                </svg>
              ) : (
                /* Amethyst Mystic Seals for SR */
                <svg viewBox="0 0 200 280" className="absolute inset-0 w-full h-full pointer-events-none">
                  {phase === 'summoning' ? (
                    <g stroke="#c084fc" strokeWidth="4" fill="none" opacity="0.9" className="drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]">
                      {/* Arcane Rune Ring */}
                      <circle cx="100" cy="140" r="60" strokeDasharray="8 4" />
                      <polygon points="100,85 145,165 55,165" />
                      <polygon points="100,195 145,115 55,115" />
                      <circle cx="100" cy="140" r="14" fill="#a855f7" />
                    </g>
                  ) : (
                    /* Fracturing Amethyst Crystal Beams */
                    <g fill="#c084fc">
                      <line x1="100" y1="140" x2="20" y2="60" stroke="#e9d5ff" strokeWidth="5" />
                      <line x1="100" y1="140" x2="180" y2="60" stroke="#e9d5ff" strokeWidth="5" />
                      <line x1="100" y1="140" x2="100" y2="240" stroke="#e9d5ff" strokeWidth="5" />
                      <circle cx="100" cy="140" r="30" fill="#a855f7" opacity="0.8" className="animate-ping" />
                    </g>
                  )}
                </svg>
              )}
            </div>
          </div>

          {/* Persona Manga Cut-In Header Banner */}
          <div className="bg-black/90 border-2 border-white px-6 py-2 skew-x-[-12deg] shadow-2xl">
            <span className="block transform skew-x-[12deg] font-bebas text-xl sm:text-3xl text-white tracking-wider flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>{config.kanji}</span>
              <span className={config.textColor}>{config.soundFx}</span>
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-300 mt-2 tracking-widest uppercase">
            {config.themeSub}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: THE GRAND PERSONA MANIFESTATION & INTERACTIVE SHOWCASE */}
      {/* ========================================================================= */}
      {phase === 'manifest' && (
        <div className={`relative w-full max-w-4xl bg-black/95 border-4 rounded-xl p-4 sm:p-7 shadow-2xl overflow-hidden transform -rotate-0.5 animate-spirit-slide z-20 ${config.cardBorder} ${config.colorGlow}`}>
          {/* Subtle Ambient Elemental Glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none bg-yellow-500/20" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none bg-purple-600/20" />

          {/* Top Bar: Rarity Banner, Title & Awakening Star Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-neutral-800 pb-3 mb-4 gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Rarity Pill with Distinct Rarity Color */}
              <div className={`font-bebas text-base sm:text-lg px-4 py-0.5 rounded skew-x-[-12deg] font-black tracking-wider ${config.badgeBg} shadow-lg`}>
                <span className="block transform skew-x-[12deg] flex items-center gap-1">
                  {isSsr ? <Crown className="w-4 h-4 fill-black" /> : <Zap className="w-4 h-4 fill-white" />}
                  <span>{isSsr ? '★ ★ ★ SSR MUKJIZAT 0.75%' : '★ ★ SR SUPER RARE 9.25%'}</span>
                </span>
              </div>

              {isNew ? (
                <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded animate-bounce">
                  ✨ SUKMA BARU BERIKRAR!
                </span>
              ) : (
                <span className="bg-blue-600 text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded">
                  DUPLIKAT DIPEROLEH: LV.{prevLevel} &rarr; LV.{spirit.level}
                </span>
              )}

              {/* 5 Stars Awaken Rank */}
              <div className="flex items-center gap-1 bg-black border border-amber-500/60 px-2.5 py-0.5 rounded">
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
                  AWAKEN {spirit.awakenRank ?? 1}/5
                </span>
              </div>

              <ElementBadge element={spirit.element} size="md" />
            </div>

            <div className="text-[11px] font-mono text-neutral-400">
              {isSsr ? (
                <span className="text-yellow-400 font-bold bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-500/40">
                  ★ 1 DARI HANYA 8 ROH SSR TERTINGGI ★
                </span>
              ) : (
                <span className="text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/40">
                  ROH ELITE PILIHAN NUSANTARA
                </span>
              )}
            </div>
          </div>

          {/* Main Showcase Layout: Two Columns (Left: Spirit Visual Portrait, Right: Lore & Jurus Sukma) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left: Dramatic Spirit Visual Avatar Panel */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className={`relative w-44 h-56 sm:w-52 sm:h-64 rounded-xl border-4 ${
                isSsr ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.6)]' : 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.6)]'
              } overflow-hidden bg-gradient-to-b from-neutral-900 to-black p-4 flex flex-col items-center justify-between text-center`}>
                <div className="absolute inset-0 bg-halftone opacity-30 pointer-events-none" />
                
                {/* Element Badge Top */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono text-neutral-400 tracking-widest">
                    #{spirit.id.toUpperCase()}
                  </span>
                  <span className={`text-xs font-mono font-black uppercase px-2 py-0.5 rounded ${
                    isSsr ? 'bg-yellow-400 text-black' : 'bg-purple-600 text-white'
                  }`}>
                    {spirit.rarity}
                  </span>
                </div>

                {/* Main Mythic Avatar Icon */}
                <div className="relative z-10 my-auto">
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto border-4 ${
                    isSsr ? 'border-yellow-300 bg-yellow-950/50 shadow-inner' : 'border-purple-400 bg-purple-950/50 shadow-inner'
                  }`}>
                    {isSsr ? (
                      <Crown className="w-14 h-14 text-yellow-300 fill-yellow-400 animate-pulse" />
                    ) : (
                      <Flame className="w-14 h-14 text-purple-300 fill-purple-400 animate-pulse" />
                    )}
                  </div>
                  <div className="font-bebas text-2xl text-white font-black tracking-wide mt-2">
                    {spirit.name}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400 truncate max-w-[160px]">
                    {spirit.title}
                  </div>
                </div>

                {/* Awaken Stars Indicator */}
                <div className="relative z-10 w-full pt-1 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>LEVEL {spirit.level}</span>
                  <span className="text-amber-400 font-bold">KUALITAS {spirit.rarity}</span>
                </div>
              </div>

              {/* Overpower Warning for SSR */}
              {isSsr && (
                <div className="mt-2.5 bg-yellow-950/80 border border-yellow-500/60 rounded p-2 text-center max-w-[220px]">
                  <div className="text-[10px] font-mono text-yellow-300 font-bold flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
                    <span>STATUS OVERPOWER</span>
                  </div>
                  <div className="text-[9px] font-mono text-neutral-300 mt-0.5">
                    Konsumsi SP tinggi, namun menghasilkan burst damage eksponensial!
                  </div>
                </div>
              )}
            </div>

            {/* Right: Lore, Jurus Puncak, and Bonus Stat Attributes */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              {/* Persona Quote Callout */}
              <div className="border-l-4 border-[#FF0033] pl-3.5 bg-neutral-900/80 py-2 rounded-r">
                <p className="font-sans text-xs sm:text-sm text-yellow-200 italic leading-relaxed">
                  &ldquo;{spirit.signatureQuote}&rdquo;
                </p>
                <div className="text-[11px] font-mono text-neutral-400 mt-1">
                  &mdash; {spirit.lore}
                </div>
              </div>

              {/* Bonus Attribute Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded">
                  <div className="text-[10px] text-neutral-400">BONUS HP</div>
                  <div className="font-bebas text-lg text-emerald-400">+{spirit.bonusHp}</div>
                </div>
                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded">
                  <div className="text-[10px] text-neutral-400">BONUS SP</div>
                  <div className="font-bebas text-lg text-blue-400">+{spirit.bonusSp}</div>
                </div>
                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded">
                  <div className="text-[10px] text-neutral-400">BONUS ATK</div>
                  <div className="font-bebas text-lg text-red-400">+{spirit.bonusAtk}</div>
                </div>
                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded">
                  <div className="text-[10px] text-neutral-400">BONUS DEF</div>
                  <div className="font-bebas text-lg text-yellow-400">+{spirit.bonusDef}</div>
                </div>
              </div>

              {/* Primary Skill Showcase */}
              {spirit.skills && spirit.skills.length > 0 && (
                <div className="bg-neutral-900/90 border border-neutral-800 rounded p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#FF0033]" />
                      <span className="font-bebas text-base text-white tracking-wide">
                        JURUS UTAMA: <span className="text-yellow-400">{spirit.skills[0].name}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-400 font-bold">
                        {spirit.skills[0].spCost} SP
                      </span>
                      <ElementBadge element={spirit.skills[0].element} size="sm" />
                    </div>
                  </div>
                  <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                    {spirit.skills[0].description}
                  </p>
                </div>
              )}

              {/* Highlight / Showtime Ultimate Skill */}
              {spirit.highlightSkill && (
                <div className="bg-[#18101a] border border-purple-500/50 rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                      <span className="font-bebas text-base text-yellow-300 tracking-wide">
                        SHOWTIME ULTIMATE: {spirit.highlightSkill.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-purple-300 font-bold">
                      0 SP (Gunakan Highlight)
                    </span>
                  </div>
                  <p className="text-xs font-sans text-neutral-300">
                    {spirit.highlightSkill.description}
                  </p>
                </div>
              )}

              {/* Quick Hero Equip Bar */}
              {heroes.length > 0 && onEquipToHero && (
                <div className="bg-black/80 border border-neutral-800 rounded p-2.5">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-yellow-400" />
                      PASANGKAN LANGSUNG KE KARAKTER:
                    </span>
                    <span className="text-[10px] text-neutral-500">*Dapat diganti kapan saja</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {heroes.map(hero => {
                      const isEquipped = hero.equippedSpiritId === spirit.id;
                      return (
                        <button
                          key={hero.id}
                          onClick={() => handleEquipAndClose(hero.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                              : 'bg-neutral-900 border-neutral-700 hover:border-[#FF0033] text-neutral-200 hover:text-white'
                          }`}
                        >
                          <span className="font-bold truncate">{hero.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-neutral-400 ml-1">
                            {isEquipped ? 'TERPASANG' : 'PASANG'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleSkipOrConfirm}
                  className="bg-[#FF0033] hover:bg-white text-white hover:text-black font-bebas text-lg px-6 py-2 skew-x-[-12deg] border-2 border-black transition-all cursor-pointer shadow-xl font-black"
                >
                  <span className="block transform skew-x-[12deg] flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>SELESAI & SIMPAN SUKMA</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
