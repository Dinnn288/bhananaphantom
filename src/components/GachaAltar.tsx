import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SpiritCompanion, Hero } from '../types';
import { INITIAL_SPIRITS, applyAwakenRankToSpirit } from '../data/spirits';
import { ElementBadge } from './ElementBadge';
import { audioService } from '../services/audioService';
import { SpiritAwakenAnimation } from './SpiritAwakenAnimation';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Zap, 
  Star, 
  Info, 
  X, 
  Layers, 
  Crown, 
  Lock, 
  HelpCircle,
  Swords,
  ShieldAlert
} from 'lucide-react';

interface GachaAltarProps {
  heroes: Hero[];
  spiritGems: number; // Token Gacha (20 per enemy defeated)
  onSpendGems: (amount: number) => boolean;
  ownedSpirits: SpiritCompanion[];
  onSummonNewSpirit: (newSpirit: SpiritCompanion) => void;
  onSummonBatch?: (newSpirits: SpiritCompanion[]) => void;
  onNavigateToUpgrade?: () => void;
}

// EXACT GACHA RATES AS REQUESTED BY USER
// SSR: 0.75% (00.75%), exactly 8 spirits in the whole game
// SR:  9.25%
// R:   90.00%
const GACHA_RATES = {
  SSR: 0.0075, // 0.75%
  SR: 0.0925,  // 9.25%
  R: 0.9000    // 90.00%
};

const SINGLE_PULL_COST = 20; // 20 tokens (1 battle victory)
const MULTI_PULL_COST = 200; // 200 tokens (10 pulls)

export const GachaAltar: React.FC<GachaAltarProps> = ({
  heroes,
  spiritGems,
  onSpendGems,
  ownedSpirits,
  onSummonNewSpirit,
  onSummonBatch,
  onNavigateToUpgrade
}) => {
  const [isSummoning, setIsSummoning] = useState<boolean>(false);
  const [summonType, setSummonType] = useState<'single' | 'multi'>('single');
  const [singleResult, setSingleResult] = useState<{ spirit: SpiritCompanion; isNew: boolean; prevLevel?: number } | null>(null);
  const [multiResults, setMultiResults] = useState<{ spirit: SpiritCompanion; isNew: boolean; prevLevel?: number }[] | null>(null);
  const [showRatesModal, setShowRatesModal] = useState<boolean>(false);

  // Spirit Awaken Animation for newly unlocked SSR/SR
  const [awakenData, setAwakenData] = useState<{
    spirit: SpiritCompanion;
    isNew: boolean;
    prevLevel?: number;
  } | null>(null);

  // Pity counter (stored in local state, triggers guaranteed SSR at 90 pulls)
  const [pityCount, setPityCount] = useState<number>(() => {
    const saved = localStorage.getItem('bhawana_gacha_pity');
    return saved ? parseInt(saved, 10) : 0;
  });

  const ssrList = INITIAL_SPIRITS.filter(s => s.rarity === 'SSR');
  const srList = INITIAL_SPIRITS.filter(s => s.rarity === 'SR');
  const rList = INITIAL_SPIRITS.filter(s => s.rarity === 'R');

  // Perform single random pull based on exact probabilities
  const executeSingleRoll = (currentPity: number): { spiritTemplate: SpiritCompanion; resetPity: boolean } => {
    const rand = Math.random();
    
    // Pity trigger (at 90 pulls without SSR, guaranteed SSR)
    if (currentPity >= 89 || rand < GACHA_RATES.SSR) {
      const chosen = ssrList[Math.floor(Math.random() * ssrList.length)];
      return { spiritTemplate: chosen, resetPity: true };
    } else if (rand < GACHA_RATES.SSR + GACHA_RATES.SR) {
      const chosen = srList[Math.floor(Math.random() * srList.length)];
      return { spiritTemplate: chosen, resetPity: false };
    } else {
      const chosen = rList[Math.floor(Math.random() * rList.length)];
      return { spiritTemplate: chosen, resetPity: false };
    }
  };

  // 1x Single Summon
  const handleSingleSummon = () => {
    if (spiritGems < SINGLE_PULL_COST) {
      audioService.playWeakness();
      return;
    }

    if (!onSpendGems(SINGLE_PULL_COST)) return;

    audioService.playClick();
    setIsSummoning(true);
    setSummonType('single');
    setSingleResult(null);
    setMultiResults(null);

    const roll = executeSingleRoll(pityCount);
    const newPity = roll.resetPity ? 0 : pityCount + 1;
    setPityCount(newPity);
    localStorage.setItem('bhawana_gacha_pity', newPity.toString());

    setTimeout(() => {
      setIsSummoning(false);
      const existing = ownedSpirits.find(s => s.id === roll.spiritTemplate.id);
      let resultingSpirit: SpiritCompanion;
      let isNew = false;
      let prevLevel = 1;

      if (existing) {
        prevLevel = existing.level;
        resultingSpirit = {
          ...existing,
          level: existing.level + 1,
          bonusHp: existing.bonusHp + 15,
          bonusSp: existing.bonusSp + 8,
          bonusAtk: existing.bonusAtk + 4,
          bonusDef: existing.bonusDef + 3
        };
      } else {
        isNew = true;
        resultingSpirit = applyAwakenRankToSpirit({ ...roll.spiritTemplate, level: 1 }, 1);
      }

      onSummonNewSpirit(resultingSpirit);
      setSingleResult({ spirit: resultingSpirit, isNew, prevLevel });

      if (resultingSpirit.rarity === 'SSR') {
        audioService.playCritical();
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ff0033', '#ffffff', '#ff8800']
        });
        setAwakenData({ spirit: resultingSpirit, isNew, prevLevel });
      } else if (resultingSpirit.rarity === 'SR') {
        audioService.playOneMore();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#3b82f6', '#ffffff']
        });
      } else {
        audioService.playHit();
      }
    }, 1400);
  };

  // 10x Multi Summon (with guaranteed SR+ in 10 pulls)
  const handleMultiSummon = () => {
    if (spiritGems < MULTI_PULL_COST) {
      audioService.playWeakness();
      return;
    }

    if (!onSpendGems(MULTI_PULL_COST)) return;

    audioService.playClick();
    setIsSummoning(true);
    setSummonType('multi');
    setSingleResult(null);
    setMultiResults(null);

    let tempPity = pityCount;
    const batchTemplates: SpiritCompanion[] = [];

    for (let i = 0; i < 10; i++) {
      const roll = executeSingleRoll(tempPity);
      if (roll.resetPity) {
        tempPity = 0;
      } else {
        tempPity += 1;
      }
      batchTemplates.push(roll.spiritTemplate);
    }

    // Guarantee at least 1 SR or SSR in 10 pulls
    const hasSrOrSsr = batchTemplates.some(s => s.rarity === 'SR' || s.rarity === 'SSR');
    if (!hasSrOrSsr) {
      const guaranteedSr = srList[Math.floor(Math.random() * srList.length)];
      batchTemplates[9] = guaranteedSr;
    }

    setPityCount(tempPity);
    localStorage.setItem('bhawana_gacha_pity', tempPity.toString());

    setTimeout(() => {
      setIsSummoning(false);
      const results: { spirit: SpiritCompanion; isNew: boolean; prevLevel?: number }[] = [];
      const updatedOwnedList: SpiritCompanion[] = [...ownedSpirits];

      for (const t of batchTemplates) {
        const existingIdx = updatedOwnedList.findIndex(s => s.id === t.id);
        if (existingIdx !== -1) {
          const current = updatedOwnedList[existingIdx];
          const prevLvl = current.level;
          const upgraded: SpiritCompanion = {
            ...current,
            level: current.level + 1,
            bonusHp: current.bonusHp + 15,
            bonusSp: current.bonusSp + 8,
            bonusAtk: current.bonusAtk + 4,
            bonusDef: current.bonusDef + 3
          };
          updatedOwnedList[existingIdx] = upgraded;
          results.push({ spirit: upgraded, isNew: false, prevLevel: prevLvl });
        } else {
          const newlyCreated = applyAwakenRankToSpirit({ ...t, level: 1 }, 1);
          updatedOwnedList.push(newlyCreated);
          results.push({ spirit: newlyCreated, isNew: true, prevLevel: 1 });
        }
      }

      if (onSummonBatch) {
        onSummonBatch(updatedOwnedList);
      } else {
        results.forEach(r => onSummonNewSpirit(r.spirit));
      }

      setMultiResults(results);

      const ssrCount = results.filter(r => r.spirit.rarity === 'SSR').length;
      if (ssrCount > 0) {
        audioService.playCritical();
        confetti({
          particleCount: 220,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ff0033', '#ffffff', '#e60012']
        });
      } else {
        audioService.playOneMore();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#ffffff']
        });
      }
    }, 1800);
  };

  return (
    <div className="w-full bg-[#0E0E12]/95 border-2 border-[#FF0033]/60 rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background Decorative Auras */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#FF0033]/15 via-purple-900/10 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none blur-3xl" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#FF0033]/50 pb-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#FF0033] text-black px-4 py-1 skew-x-[-12deg] font-black text-xl flex items-center gap-1.5 shadow-lg shadow-[#FF0033]/30">
              <Sparkles className="w-5 h-5 fill-black" />
              <span>ALTAR DOA GACHA</span>
            </div>
            <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">
              PEMANGGILAN SUKMA GHAIB
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-80">
            Ritual Altar Keramat &bull; Peluang SSR 0.75% (8 Roh Tertinggi) &bull; 20 Token Per Tarikan
          </p>
        </div>

        {/* Right Status Badges */}
        <div className="flex items-center gap-3 self-end sm:self-center flex-wrap">
          {/* Token Counter */}
          <div className="flex items-center gap-2 bg-[#1A1A24] border-2 border-yellow-500/80 px-4 py-2 skew-x-[-10deg] shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" />
            <div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                TOKEN GACHA (+20/Musuh)
              </div>
              <div className="font-bebas text-xl text-yellow-400 leading-none">
                {spiritGems} <span className="text-xs text-neutral-400 font-mono">TOKEN</span>
              </div>
            </div>
          </div>

          {/* Rates Info Button */}
          <button
            onClick={() => {
              audioService.playClick();
              setShowRatesModal(true);
            }}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-[#FF0033] text-neutral-300 hover:text-black font-bebas text-sm px-3.5 py-2.5 skew-x-[-10deg] border border-neutral-700 transition-all cursor-pointer"
          >
            <Info className="w-4 h-4" />
            <span className="transform skew-x-[10deg] font-bold">INFO PROBABILITAS</span>
          </button>

          {/* Shortcut to Upgrade Temple */}
          {onNavigateToUpgrade && (
            <button
              onClick={() => {
                audioService.playClick();
                onNavigateToUpgrade();
              }}
              className="flex items-center gap-1.5 bg-[#1B1124] hover:bg-purple-600 text-purple-300 hover:text-white font-bebas text-sm px-3.5 py-2.5 skew-x-[-10deg] border border-purple-600/80 transition-all cursor-pointer shadow-md"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="transform skew-x-[10deg] font-bold">MENU UPGRADE ROH</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Main Gacha Stage & Summon Altar */}
      <div className="relative z-10 bg-gradient-to-b from-[#12121A] to-[#0A0A10] border-2 border-neutral-800 rounded-xl p-6 sm:p-8 mb-6 overflow-hidden">
        {/* Magic Pentagram / Altar Graphic */}
        <div className="relative max-w-xl mx-auto py-6 flex flex-col items-center justify-center text-center">
          {/* Animated Glow Circle */}
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-4 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border-4 border-dashed ${isSummoning ? 'border-yellow-400 animate-spin' : 'border-[#FF0033]/40'} opacity-60`} />
            <div className="absolute inset-4 rounded-full border-2 border-[#FF0033]/60 transform rotate-45" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#FF0033]/20 via-purple-600/15 to-transparent blur-md" />
            
            {/* Center Altar Flame */}
            <div className="relative z-10 flex flex-col items-center">
              <Flame className={`w-16 h-16 sm:w-20 sm:h-20 ${isSummoning ? 'text-yellow-400 fill-yellow-400 animate-bounce' : 'text-[#FF0033] fill-[#FF0033] animate-pulse'}`} />
              <span className="font-bebas text-xs sm:text-sm text-neutral-300 tracking-widest mt-1">
                {isSummoning ? 'MERAPAL MANTRA SUKMA...' : 'LILIN KRAMAT'}
              </span>
            </div>
          </div>

          <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-widest mb-1">
            PEMANGGILAN SUKMA TERTINGGI
          </h3>
          <p className="text-xs font-mono text-neutral-400 max-w-md mx-auto mb-5 leading-relaxed">
            Korbankan Token Gacha kemenangan untuk memanggil roh pelindung berkekuatan mistis Nusantara. Waspadai roh SSR yang overpower dengan konsumsi SP tinggi!
          </p>

          {/* Pity Progress Bar */}
          <div className="w-full max-w-md bg-black/70 border border-neutral-800 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                Pity Jaminan SSR Langka:
              </span>
              <span className="text-yellow-400 font-bold">
                {pityCount} / 90 Tarikan
              </span>
            </div>
            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
              <div 
                className="h-full bg-gradient-to-r from-[#FF0033] via-purple-500 to-yellow-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (pityCount / 90) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-neutral-500 text-left mt-1">
              *Jika belum mendapatkan SSR dalam 89 tarikan, tarikan ke-90 dipastikan SSR!
            </div>
          </div>

          {/* Summon Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            {/* 1x Summon */}
            <button
              onClick={handleSingleSummon}
              disabled={isSummoning || spiritGems < SINGLE_PULL_COST}
              className={`flex-1 w-full relative group cursor-pointer transition-all ${
                spiritGems < SINGLE_PULL_COST || isSummoning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              <div className="absolute -inset-1 bg-white skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#141418] group-hover:bg-[#FF0033] text-white group-hover:text-black py-3 px-5 skew-x-[-10deg] border-2 border-[#FF0033] group-hover:border-black font-bebas text-lg tracking-wider shadow-xl transition-colors text-center">
                <div className="transform skew-x-[10deg] flex flex-col items-center">
                  <span className="font-black italic uppercase">1x DOA PEMANGGILAN</span>
                  <span className="text-xs font-mono text-yellow-400 group-hover:text-black font-bold flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3" /> 20 Token Gacha
                  </span>
                </div>
              </div>
            </button>

            {/* 10x Multi Summon */}
            <button
              onClick={handleMultiSummon}
              disabled={isSummoning || spiritGems < MULTI_PULL_COST}
              className={`flex-1 w-full relative group cursor-pointer transition-all ${
                spiritGems < MULTI_PULL_COST || isSummoning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              <div className="absolute -inset-1 bg-yellow-400 skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#FF0033] group-hover:bg-yellow-400 text-white group-hover:text-black py-3 px-5 skew-x-[-10deg] border-2 border-white group-hover:border-black font-bebas text-lg tracking-wider shadow-2xl transition-colors text-center">
                <div className="transform skew-x-[10deg] flex flex-col items-center">
                  <span className="font-black italic uppercase">10x DOA KERAMAT</span>
                  <span className="text-xs font-mono text-black font-bold flex items-center gap-1 mt-0.5">
                    <Crown className="w-3 h-3" /> 200 Token (Jamin SR+)
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 1x Single Summon Result Modal / Banner */}
      {singleResult && (
        <div className="relative z-20 bg-[#160B0E] border-2 border-yellow-400/90 rounded-xl p-5 mb-6 shadow-2xl animate-shake">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div 
                className={`w-16 h-16 flex items-center justify-center font-black text-2xl skew-x-[-12deg] border-2 border-white shadow-xl ${
                  singleResult.spirit.rarity === 'SSR' 
                    ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-red-600 text-black animate-pulse' 
                    : singleResult.spirit.rarity === 'SR'
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-700 text-white'
                    : 'bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-200'
                }`}
              >
                <span className="transform skew-x-[12deg]">{singleResult.spirit.rarity}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-black tracking-widest uppercase ${
                    singleResult.spirit.rarity === 'SSR' ? 'text-yellow-400' : 'text-neutral-400'
                  }`}>
                    {singleResult.spirit.rarity === 'SSR' 
                      ? '★ ULTRA RARE (CHANCE 0.75%) DIBANGKITKAN!' 
                      : singleResult.isNew ? 'ROH BARU TELAH DIBANGKITKAN!' : 'DUPLIKAT DIPEROLEH - LEVEL NAIK!'}
                  </span>
                  {!singleResult.isNew && (
                    <span className="bg-green-500 text-black font-mono font-bold text-[10px] px-1.5 rounded">
                      LV.{singleResult.prevLevel} &rarr; LV.{singleResult.spirit.level}
                    </span>
                  )}
                </div>

                <div className="font-bebas text-2xl sm:text-3xl text-white tracking-wide flex items-center gap-2">
                  <span>{singleResult.spirit.name}</span>
                  <span className="text-[#FF0033]">&bull; {singleResult.spirit.title}</span>
                </div>

                <p className="text-xs font-sans text-neutral-300 italic mt-0.5">
                  &ldquo;{singleResult.spirit.signatureQuote}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {onNavigateToUpgrade && (
                <button
                  onClick={() => {
                    setSingleResult(null);
                    onNavigateToUpgrade();
                  }}
                  className="bg-[#1e1e28] hover:bg-white text-white hover:text-black font-bebas text-base px-4 py-1.5 skew-x-[-10deg] border border-neutral-700 transition-colors cursor-pointer"
                >
                  <span className="block transform skew-x-[10deg] font-bold">UPGRADE SEKARANG</span>
                </button>
              )}
              <button
                onClick={() => setSingleResult(null)}
                className="bg-[#FF0033] hover:bg-white text-white hover:text-black font-bebas text-base px-4 py-1.5 skew-x-[-10deg] border-2 border-black transition-colors cursor-pointer"
              >
                <span className="block transform skew-x-[10deg] font-black">TUTUP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10x Multi Summon Results Grid */}
      {multiResults && (
        <div className="relative z-20 bg-[#0c0c12] border-2 border-yellow-400/90 rounded-xl p-5 mb-6 shadow-2xl animate-shake">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-black font-black font-bebas text-sm px-2 py-0.5 skew-x-[-10deg]">
                HASIL 10x RITUAL
              </span>
              <h4 className="font-bebas text-xl text-white tracking-wider">
                ROH YANG BERHASIL DIBANGKITKAN
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {onNavigateToUpgrade && (
                <button
                  onClick={() => {
                    setMultiResults(null);
                    onNavigateToUpgrade();
                  }}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bebas text-sm px-3.5 py-1 skew-x-[-10deg] cursor-pointer"
                >
                  <span className="block transform skew-x-[10deg] font-bold">KE KUIL UPGRADE</span>
                </button>
              )}
              <button
                onClick={() => setMultiResults(null)}
                className="bg-[#FF0033] text-black font-bebas text-sm px-3.5 py-1 skew-x-[-10deg] font-black hover:bg-white cursor-pointer"
              >
                <span className="block transform skew-x-[10deg]">SELESAI</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {multiResults.map((res, idx) => {
              const isSsr = res.spirit.rarity === 'SSR';
              const isSr = res.spirit.rarity === 'SR';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col justify-between ${
                    isSsr
                      ? 'border-yellow-400 bg-gradient-to-b from-yellow-950/60 to-black shadow-lg shadow-yellow-500/20 animate-pulse'
                      : isSr
                      ? 'border-purple-500 bg-gradient-to-b from-purple-950/50 to-black shadow-md shadow-purple-500/15'
                      : 'border-neutral-800 bg-[#14141a]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-bebas text-xs px-2 py-0.5 rounded skew-x-[-8deg] font-black ${
                        isSsr
                          ? 'bg-yellow-400 text-black'
                          : isSr
                          ? 'bg-purple-600 text-white'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {res.spirit.rarity}
                    </span>
                    <ElementBadge element={res.spirit.element} size="sm" showName={false} />
                  </div>

                  <div className="font-bebas text-base text-white tracking-wide truncate">
                    {res.spirit.name}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 truncate">
                    {res.spirit.title}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono">
                    <span className={res.isNew ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                      {res.isNew ? '★ BARU' : `LV.${res.spirit.level}`}
                    </span>
                    <span className="text-neutral-500">#{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RATES & SSR PROBABILITY MODAL */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border-4 border-[#FF0033] rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRatesModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-black/60 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="font-bebas text-2xl text-white tracking-wider">
                TABEL PROBABILITAS RESMI ALTAR PEMANGGILAN
              </h3>
            </div>

            {/* Probability Breakdown Table */}
            <div className="grid grid-cols-3 gap-3 mb-6 font-mono text-center">
              <div className="p-3 bg-gradient-to-b from-yellow-950/40 to-black border-2 border-yellow-400/80 rounded-lg">
                <div className="text-xs text-neutral-400 uppercase">SSR (Ultra Rare)</div>
                <div className="text-2xl font-black text-yellow-400 mt-1">0.75%</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">8 Roh Khusus</div>
              </div>

              <div className="p-3 bg-gradient-to-b from-purple-950/40 to-black border-2 border-purple-500/80 rounded-lg">
                <div className="text-xs text-neutral-400 uppercase">SR (Super Rare)</div>
                <div className="text-2xl font-black text-purple-400 mt-1">9.25%</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">10 Roh Pilihan</div>
              </div>

              <div className="p-3 bg-gradient-to-b from-neutral-900 to-black border-2 border-neutral-700 rounded-lg">
                <div className="text-xs text-neutral-400 uppercase">R (Rare)</div>
                <div className="text-2xl font-black text-neutral-300 mt-1">90.00%</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Roh Dasar</div>
              </div>
            </div>

            {/* 8 Exclusive SSR Spirits Showcase */}
            <div className="border-t border-neutral-800 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bebas text-lg text-yellow-400 tracking-wider flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  DAFTAR LENGKAP 8 ROH SSR (KONSUMSI SP TINGGI - OVERPOWER)
                </h4>
                <span className="text-xs font-mono text-neutral-400">Total: 8/8 SSR</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {ssrList.map(ssr => (
                  <div
                    key={ssr.id}
                    className="p-2.5 bg-black/60 border border-yellow-500/30 rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bebas text-base text-white tracking-wide flex items-center gap-1.5">
                        <span className="text-yellow-400 font-bold">SSR</span>
                        <span>{ssr.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 truncate max-w-[200px]">
                        {ssr.title}
                      </div>
                    </div>
                    <ElementBadge element={ssr.element} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Awaken Animation Overlay */}
      {awakenData && (
        <SpiritAwakenAnimation
          spirit={awakenData.spirit}
          isNew={awakenData.isNew}
          prevLevel={awakenData.prevLevel}
          heroes={heroes}
          onConfirm={() => setAwakenData(null)}
        />
      )}
    </div>
  );
};
