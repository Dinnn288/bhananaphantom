import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SpiritCompanion, Hero } from '../types';
import { INITIAL_SPIRITS, AWAKEN_TIERS, applyAwakenRankToSpirit } from '../data/spirits';
import { ElementBadge } from './ElementBadge';
import { audioService } from '../services/audioService';
import { SpiritShiftAnimation } from './SpiritShiftAnimation';
import { SpiritAwakenAnimation } from './SpiritAwakenAnimation';
import { 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  ArrowUpCircle, 
  Check, 
  BookOpen, 
  Award,
  Zap,
  Star,
  Info,
  X,
  Layers,
  Search,
  Crown,
  Lock,
  ChevronRight,
  Shield,
  HelpCircle,
  Clock
} from 'lucide-react';

interface SpiritAltarProps {
  heroes: Hero[];
  spiritGems: number; // Token Gacha (20 per enemy defeated)
  onSpendGems: (amount: number) => boolean;
  onEquipSpirit: (heroId: string, spirit: SpiritCompanion) => void;
  ownedSpirits: SpiritCompanion[];
  onSummonNewSpirit: (newSpirit: SpiritCompanion) => void;
  onSummonBatch?: (newSpirits: SpiritCompanion[]) => void;
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
const UPGRADE_COST = 20;     // 20 tokens to upgrade

export const SpiritAltar: React.FC<SpiritAltarProps> = ({
  heroes,
  spiritGems,
  onSpendGems,
  onEquipSpirit,
  ownedSpirits,
  onSummonNewSpirit,
  onSummonBatch
}) => {
  const [selectedSpirit, setSelectedSpirit] = useState<SpiritCompanion>(
    ownedSpirits[0] || INITIAL_SPIRITS[0]
  );
  const [isSummoning, setIsSummoning] = useState<boolean>(false);
  const [summonType, setSummonType] = useState<'single' | 'multi'>('single');
  
  // Results
  const [singleResult, setSingleResult] = useState<{ spirit: SpiritCompanion; isNew: boolean; prevLevel?: number } | null>(null);
  const [multiResults, setMultiResults] = useState<{ spirit: SpiritCompanion; isNew: boolean; prevLevel?: number }[] | null>(null);

  // Spirit Shift & Awaken Animation States
  const [shiftAnimData, setShiftAnimData] = useState<{
    hero: Hero;
    previousSpirit?: SpiritCompanion | null;
    newSpirit: SpiritCompanion;
  } | null>(null);

  const [awakenData, setAwakenData] = useState<{
    spirit: SpiritCompanion;
    isNew: boolean;
    prevLevel?: number;
  } | null>(null);

  // Equip with Spirit Shift Animation
  const handleEquipWithAnimation = (heroId: string, spiritToEquip: SpiritCompanion) => {
    const targetHero = heroes.find(h => h.id === heroId);
    if (!targetHero) return;

    const previous = targetHero.spirits?.find(s => s.id === targetHero.equippedSpiritId)
      || ownedSpirits.find(s => s.id === targetHero.equippedSpiritId)
      || null;

    onEquipSpirit(heroId, spiritToEquip);

    setShiftAnimData({
      hero: targetHero,
      previousSpirit: previous,
      newSpirit: spiritToEquip
    });
  };
  
  // Compendium filters & search
  const [rarityFilter, setRarityFilter] = useState<'ALL' | 'SSR' | 'SR' | 'R' | 'OWNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Rates & SSR info modal
  const [showRatesModal, setShowRatesModal] = useState<boolean>(false);

  // Pity counter (stored in local state, triggers SSR at 90 pulls if unlucky)
  const [pityCount, setPityCount] = useState<number>(() => {
    const saved = localStorage.getItem('bhawana_gacha_pity');
    return saved ? parseInt(saved, 10) : 0;
  });

  const ssrList = INITIAL_SPIRITS.filter(s => s.rarity === 'SSR');
  const srList = INITIAL_SPIRITS.filter(s => s.rarity === 'SR');
  const rList = INITIAL_SPIRITS.filter(s => s.rarity === 'R');

  // Core RNG pull logic according to strict user odds (0.75% SSR)
  const performSingleRoll = (currentPity: number): { spirit: SpiritCompanion; newPity: number; rolledRarity: 'SSR' | 'SR' | 'R' } => {
    let rolledRarity: 'SSR' | 'SR' | 'R';
    let newPity = currentPity + 1;

    // Hard Pity at 90 pulls or natural 0.75% chance
    const rand = Math.random();
    if (newPity >= 90 || rand < GACHA_RATES.SSR) {
      rolledRarity = 'SSR';
      newPity = 0; // reset pity on SSR
    } else if (rand < GACHA_RATES.SSR + GACHA_RATES.SR) {
      // 9.25% SR
      rolledRarity = 'SR';
    } else {
      // 90.00% R
      rolledRarity = 'R';
    }

    // Pick a spirit from the determined rarity pool
    const pool = rolledRarity === 'SSR' ? ssrList : rolledRarity === 'SR' ? srList : rList;
    const template = pool[Math.floor(Math.random() * pool.length)];

    return { spirit: template, newPity, rolledRarity };
  };

  // 1x Single Pull (20 Token Gacha)
  const handleSingleSummon = () => {
    if (spiritGems < SINGLE_PULL_COST || isSummoning) return;
    if (!onSpendGems(SINGLE_PULL_COST)) return;

    setSummonType('single');
    setIsSummoning(true);
    setSingleResult(null);
    setMultiResults(null);
    audioService.playCritical();

    setTimeout(() => {
      const { spirit: template, newPity, rolledRarity } = performSingleRoll(pityCount);
      setPityCount(newPity);
      localStorage.setItem('bhawana_gacha_pity', newPity.toString());

      const existing = ownedSpirits.find(s => s.id === template.id);
      const isNew = !existing;
      let finalSpirit: SpiritCompanion;

      if (existing) {
        // Upgrade duplicate & advance Awaken Rank up to 5
        const curRank = existing.awakenRank ?? 1;
        const nxtRank = Math.min(5, curRank + 1);
        finalSpirit = applyAwakenRankToSpirit({
          ...existing,
          level: existing.level + 1
        }, nxtRank);
      } else {
        finalSpirit = applyAwakenRankToSpirit({ ...template, level: 1 }, 1);
      }

      onSummonNewSpirit(finalSpirit);
      setSelectedSpirit(finalSpirit);
      const resObj = {
        spirit: finalSpirit,
        isNew,
        prevLevel: existing ? existing.level : undefined
      };
      setSingleResult(resObj);
      setAwakenData(resObj);
      setIsSummoning(false);

      if (rolledRarity === 'SSR') {
        audioService.playOneMore();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ff0033', '#ffffff', '#ffaa00']
        });
      } else {
        audioService.playClick();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 1800);
  };

  // 10x Multi Pull (200 Token Gacha)
  const handleMultiSummon = () => {
    if (spiritGems < MULTI_PULL_COST || isSummoning) return;
    if (!onSpendGems(MULTI_PULL_COST)) return;

    setSummonType('multi');
    setIsSummoning(true);
    setSingleResult(null);
    setMultiResults(null);
    audioService.playCritical();

    setTimeout(() => {
      let currentPity = pityCount;
      const results: { spirit: SpiritCompanion; isNew: boolean; prevLevel?: number }[] = [];
      const updatedListForCallback: SpiritCompanion[] = [];

      for (let i = 0; i < 10; i++) {
        const { spirit: template, newPity, rolledRarity } = performSingleRoll(currentPity);
        currentPity = newPity;

        const existingInOwned = ownedSpirits.find(s => s.id === template.id);
        const alreadyPulledInBatch = updatedListForCallback.find(s => s.id === template.id);
        const existing = alreadyPulledInBatch || existingInOwned;
        const isNew = !existing;

        let finalSpirit: SpiritCompanion;
        if (existing) {
          const curRank = existing.awakenRank ?? 1;
          const nxtRank = Math.min(5, curRank + 1);
          finalSpirit = applyAwakenRankToSpirit({
            ...existing,
            level: existing.level + 1
          }, nxtRank);
        } else {
          finalSpirit = applyAwakenRankToSpirit({ ...template, level: 1 }, 1);
        }

        const prevIndex = updatedListForCallback.findIndex(s => s.id === finalSpirit.id);
        if (prevIndex !== -1) {
          updatedListForCallback[prevIndex] = finalSpirit;
        } else {
          updatedListForCallback.push(finalSpirit);
        }

        results.push({
          spirit: finalSpirit,
          isNew,
          prevLevel: existing ? existing.level : undefined
        });
      }

      setPityCount(currentPity);
      localStorage.setItem('bhawana_gacha_pity', currentPity.toString());

      if (onSummonBatch) {
        onSummonBatch(updatedListForCallback);
      } else {
        updatedListForCallback.forEach(s => onSummonNewSpirit(s));
      }

      setMultiResults(results);
      setIsSummoning(false);

      // Trigger Awakening Animation for highest rarity pulled in the batch
      const topResult = results.find(r => r.spirit.rarity === 'SSR')
        || results.find(r => r.spirit.rarity === 'SR')
        || results[0];
      if (topResult) {
        setAwakenData(topResult);
      }

      const hasSsr = results.some(r => r.spirit.rarity === 'SSR');
      if (hasSsr) {
        audioService.playOneMore();
        confetti({
          particleCount: 220,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ff0033', '#ffffff', '#ff5500']
        });
      } else {
        audioService.playSlash();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 2200);
  };

  // Upgrade selected spirit (+stats)
  const handleUpgrade = () => {
    if (spiritGems < UPGRADE_COST) return;
    if (!onSpendGems(UPGRADE_COST)) return;

    audioService.playCritical();
    const statBoostHp = selectedSpirit.rarity === 'SSR' ? 45 : selectedSpirit.rarity === 'SR' ? 30 : 20;
    const statBoostAtk = selectedSpirit.rarity === 'SSR' ? 15 : selectedSpirit.rarity === 'SR' ? 10 : 6;
    const statBoostDef = selectedSpirit.rarity === 'SSR' ? 10 : selectedSpirit.rarity === 'SR' ? 7 : 5;

    const updatedSpirit: SpiritCompanion = {
      ...selectedSpirit,
      level: (selectedSpirit.level || 1) + 1,
      bonusHp: selectedSpirit.bonusHp + statBoostHp,
      bonusAtk: selectedSpirit.bonusAtk + statBoostAtk,
      bonusDef: selectedSpirit.bonusDef + statBoostDef
    };

    setSelectedSpirit(updatedSpirit);
    onSummonNewSpirit(updatedSpirit);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Awaken selected spirit to next rank (up to 5)
  const handleAwakenSpirit = (spiritToAwaken: SpiritCompanion) => {
    const curRank = spiritToAwaken.awakenRank ?? 1;
    if (curRank >= 5) return;
    const nextRank = curRank + 1;
    const cost = AWAKEN_TIERS[nextRank]?.costTokens ?? 40;
    if (spiritGems < cost) return;
    if (!onSpendGems(cost)) return;

    audioService.playCritical();
    const updatedSpirit = applyAwakenRankToSpirit({
      ...spiritToAwaken,
      level: (spiritToAwaken.level || 1) + 1
    }, nextRank);

    setSelectedSpirit(updatedSpirit);
    onSummonNewSpirit(updatedSpirit);

    // Trigger full Awaken Animation
    setAwakenData({
      spirit: updatedSpirit,
      isNew: false,
      prevLevel: spiritToAwaken.level || 1
    });
  };

  // Filtered spirit list for compendium
  const filteredSpirits = INITIAL_SPIRITS.filter(spirit => {
    const isOwned = ownedSpirits.some(s => s.id === spirit.id);

    if (rarityFilter === 'SSR' && spirit.rarity !== 'SSR') return false;
    if (rarityFilter === 'SR' && spirit.rarity !== 'SR') return false;
    if (rarityFilter === 'R' && spirit.rarity !== 'R') return false;
    if (rarityFilter === 'OWNED' && !isOwned) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = spirit.name.toLowerCase().includes(q);
      const matchTitle = spirit.title.toLowerCase().includes(q);
      const matchElem = spirit.element.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchElem) return false;
    }

    return true;
  });

  const isSelectedOwned = ownedSpirits.some(s => s.id === selectedSpirit.id);

  return (
    <div className="w-full bg-[#0A0A0A]/95 border-4 border-[#FF0033] rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden select-none artistic-radial-bg">
      {/* Background Ambience */}
      <div className="absolute inset-0 artistic-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF0033]/20 via-yellow-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b-2 border-[#FF0033]/50 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-[#FF0033] text-black font-black text-xs px-2.5 py-0.5 skew-x-[-12deg] tracking-widest uppercase">
              VELVET REALM // RITUAL ALKEMI
            </span>
            <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1 font-bold">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              8 ROH SSR TERBATAS &bull; CHANCE 0.75%
            </span>
            <h2 className="font-bebas text-3xl text-white tracking-wider flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              ALTAR PEMANGGILAN ROH GHAIB
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-80">
            Kalahkan hantu di koridor untuk mengumpulkan 20 Token Gacha per kemenangan dan uji keberuntunganmu!
          </p>
        </div>

        {/* Currency & Pull Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-start sm:justify-end">
          {/* Token Currency Badge */}
          <div className="bg-[#141418] border-2 border-yellow-400/60 px-3.5 py-1.5 skew-x-[-10deg] text-yellow-300 font-mono text-sm flex items-center gap-2 shadow-lg">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg] font-bold">{spiritGems} Token Gacha</span>
          </div>

          {/* Rates Info Button */}
          <button
            onClick={() => setShowRatesModal(true)}
            className="bg-[#1a1a24] hover:bg-[#252535] text-neutral-300 hover:text-white border border-neutral-700 px-2.5 py-2 skew-x-[-10deg] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors shadow"
            title="Lihat Rincian Tarif & 8 Roh SSR"
          >
            <Info className="w-4 h-4 text-yellow-400 transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg] font-bold">TARIF & SSR (0.75%)</span>
          </button>

          {/* 1x Pull Button */}
          <button
            disabled={spiritGems < SINGLE_PULL_COST || isSummoning}
            onClick={handleSingleSummon}
            className="relative transform -rotate-1 group cursor-pointer disabled:opacity-40"
          >
            <div className="absolute -inset-1 bg-white skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#FF0033] group-hover:bg-white text-white group-hover:text-black font-bebas text-base sm:text-lg px-4 py-1.5 skew-x-[-10deg] border-2 border-black shadow-xl transition-colors flex items-center gap-1.5 font-black">
              <Sparkles className="w-4 h-4 text-yellow-300 transform skew-x-[10deg]" />
              <span className="transform skew-x-[10deg] italic uppercase">1x TARIKAN ({SINGLE_PULL_COST} TKN)</span>
            </div>
          </button>

          {/* 10x Pull Button */}
          <button
            disabled={spiritGems < MULTI_PULL_COST || isSummoning}
            onClick={handleMultiSummon}
            className="relative transform rotate-1 group cursor-pointer disabled:opacity-40"
          >
            <div className="absolute -inset-1 bg-yellow-400 skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-r from-yellow-500 to-amber-600 group-hover:bg-yellow-400 text-black font-bebas text-base sm:text-lg px-4 py-1.5 skew-x-[-10deg] border-2 border-black shadow-xl transition-colors flex items-center gap-1.5 font-black">
              <Crown className="w-4 h-4 text-black transform skew-x-[10deg]" />
              <span className="transform skew-x-[10deg] italic uppercase">10x TARIKAN ({MULTI_PULL_COST} TKN)</span>
            </div>
          </button>
        </div>
      </div>

      {/* Official Hard Gacha Banner & Pity Tracker */}
      <div className="relative z-10 mb-6 bg-gradient-to-r from-black via-[#14080B] to-black border-2 border-[#FF0033]/60 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-[#FF0033] text-black font-black px-2 py-0.5 skew-x-[-10deg] tracking-widest text-[11px] uppercase">
            TARIF RESMI
          </span>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded">
              ★ SSR: 0.75% (8 Roh)
            </span>
            <span className="text-purple-400 font-bold bg-purple-400/10 border border-purple-400/30 px-2 py-0.5 rounded">
              ★ SR: 9.25% (10 Roh)
            </span>
            <span className="text-cyan-400 font-bold bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 rounded">
              ★ R: 90.00% (8 Roh)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
          <Clock className="w-3.5 h-3.5 text-yellow-400" />
          <span>Pity Jaminan SSR:</span>
          <span className="text-white font-black bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded">
            {pityCount} / 90
          </span>
          <span className="text-[10px] text-neutral-500">(Reset jika dapat SSR)</span>
        </div>
      </div>

      {/* Cinematic Summoning Overlay */}
      {isSummoning && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 border-y-8 border-[#FF0033] animate-pulse select-none">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-[#FF0033] flex items-center justify-center animate-spin-slow mb-6 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 border-t-transparent animate-reverse-spin" />
            <Sparkles className="w-8 h-8 text-yellow-300 absolute" />
          </div>

          <span className="font-bebas text-4xl sm:text-6xl text-yellow-300 tracking-widest font-black italic drop-shadow-[0_0_20px_#ff0033]">
            {summonType === 'multi' ? 'MEMBUKA 10 GERBANG DIMENSI GHAIB...' : 'MEMBUKA GERBANG ALKEMI SUKMA...'}
          </span>
          <span className="font-mono text-neutral-300 text-xs sm:text-sm mt-2 uppercase tracking-widest">
            {summonType === 'multi' 
              ? '10 ikatan takdir sedang diuji melawan probabilitas 0.75%...' 
              : 'Menembus tabir gerhana mencari satu dari 8 Roh Legendaris...'}
          </span>
        </div>
      )}

      {/* 1x Summon Single Result Modal */}
      {singleResult && (
        <div className="relative z-30 mb-6 bg-black/95 border-4 border-[#FF0033] rounded-xl p-5 shadow-2xl p5-shadow-red animate-shake">
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
              <button
                onClick={() => setSelectedSpirit(singleResult.spirit)}
                className="bg-[#1e1e28] hover:bg-white text-white hover:text-black font-bebas text-base px-4 py-1.5 skew-x-[-10deg] border border-neutral-700 transition-colors cursor-pointer"
              >
                <span className="block transform skew-x-[10deg] font-bold">LIHAT DETAIL</span>
              </button>
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
        <div className="relative z-30 mb-6 bg-black/95 border-4 border-yellow-400 rounded-xl p-5 shadow-2xl animate-shake">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h3 className="font-bebas text-2xl text-white tracking-wider">
                HASIL 10x TARIKAN RITUAL MASSAL
              </h3>
              <span className="text-xs font-mono text-neutral-400 ml-2">
                (SSR: {multiResults.filter(r => r.spirit.rarity === 'SSR').length} | SR: {multiResults.filter(r => r.spirit.rarity === 'SR').length} | R: {multiResults.filter(r => r.spirit.rarity === 'R').length})
              </span>
            </div>
            <button
              onClick={() => setMultiResults(null)}
              className="bg-white hover:bg-[#FF0033] text-black hover:text-white font-bebas text-base px-4 py-1 skew-x-[-10deg] border-2 border-black transition-colors cursor-pointer"
            >
              <span className="block transform skew-x-[10deg] font-black">SELESAI</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {multiResults.map((res, idx) => {
              const isSsr = res.spirit.rarity === 'SSR';
              const isSr = res.spirit.rarity === 'SR';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSpirit(res.spirit)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSsr
                      ? 'border-yellow-400 bg-gradient-to-b from-[#331100] to-black shadow-lg shadow-yellow-500/30 animate-pulse'
                      : isSr
                      ? 'border-purple-500/80 bg-gradient-to-b from-[#180d24] to-black'
                      : 'border-neutral-800 bg-[#121217]'
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

      {/* Main Content Grid: Compendium List on Left, Selected Spirit Detail on Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Spirit Compendium with Filter Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-lg text-white tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FF0033]" />
              KOMPENDIUM ROH PENDAMPING ({INITIAL_SPIRITS.length})
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              Dimiliki: {ownedSpirits.length}/{INITIAL_SPIRITS.length}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari roh atau elemen..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#121217] border border-neutral-800 focus:border-[#FF0033] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-600 outline-none font-mono"
            />
          </div>

          {/* Rarity Filter Tabs */}
          <div className="grid grid-cols-5 gap-1 text-center font-bebas text-xs">
            {(['ALL', 'SSR', 'SR', 'R', 'OWNED'] as const).map(tab => {
              const count =
                tab === 'ALL'
                  ? INITIAL_SPIRITS.length
                  : tab === 'SSR'
                  ? ssrList.length
                  : tab === 'SR'
                  ? srList.length
                  : tab === 'R'
                  ? rList.length
                  : ownedSpirits.length;

              const isActive = rarityFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setRarityFilter(tab)}
                  className={`py-1 rounded skew-x-[-8deg] cursor-pointer transition-all border ${
                    isActive
                      ? tab === 'SSR'
                        ? 'bg-yellow-400 text-black border-yellow-300 font-black'
                        : 'bg-[#FF0033] text-white border-white font-black'
                      : 'bg-[#141418] text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <span className="block transform skew-x-[8deg]">
                    {tab === 'OWNED' ? 'MILIK' : tab} ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Spirit Card List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredSpirits.map(spirit => {
              const isOwned = ownedSpirits.some(s => s.id === spirit.id);
              const isSelected = selectedSpirit.id === spirit.id;
              const ownedInstance = ownedSpirits.find(s => s.id === spirit.id);
              const displayLevel = ownedInstance?.level || spirit.level || 1;

              return (
                <div
                  key={spirit.id}
                  onClick={() => setSelectedSpirit(ownedInstance || spirit)}
                  className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-white bg-[#1A0B0F] shadow-lg border-r-8 border-r-[#FF0033]'
                      : isOwned
                      ? 'border-neutral-800 bg-[#121217]/90 hover:border-[#FF0033]'
                      : 'border-neutral-900 bg-[#09090D] opacity-45 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-bebas text-xs px-2 py-0.5 rounded skew-x-[-8deg] font-black shrink-0 ${
                        spirit.rarity === 'SSR'
                          ? 'bg-yellow-400 text-black'
                          : spirit.rarity === 'SR'
                          ? 'bg-purple-600 text-white'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {spirit.rarity}
                    </span>

                    <div className="truncate">
                      <div className="font-bebas text-base text-white tracking-wide truncate flex items-center gap-1.5">
                        <span className="truncate">{spirit.name}</span>
                        {isOwned ? (
                          <span className="text-[10px] font-mono text-green-400 font-bold shrink-0 flex items-center gap-1">
                            (LV.{displayLevel})
                            <span className="text-amber-400 flex items-center">
                              ★{ownedInstance?.awakenRank ?? 1}
                            </span>
                          </span>
                        ) : (
                          <Lock className="w-3 h-3 text-neutral-600 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 truncate">
                        {spirit.title}
                      </div>
                    </div>
                  </div>

                  <ElementBadge element={spirit.element} size="sm" showName={false} />
                </div>
              );
            })}

            {filteredSpirits.length === 0 && (
              <div className="text-center py-8 text-neutral-500 font-mono text-xs">
                Tidak ada roh yang sesuai kriteria pencarian.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Spirit Deep Lore, Stats, & Actions */}
        <div className="lg:col-span-2 bg-[#121217]/95 border-2 border-neutral-800 rounded-lg p-5 flex flex-col justify-between border-l-8 border-l-[#FF0033] shadow-xl">
          <div>
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-800 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-black text-xs px-2 py-0.5 skew-x-[-10deg] ${
                      selectedSpirit.rarity === 'SSR'
                        ? 'bg-yellow-400 text-black font-black'
                        : selectedSpirit.rarity === 'SR'
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-700 text-white'
                    }`}
                  >
                    {selectedSpirit.rarity} {selectedSpirit.rarity === 'SSR' ? '★ 0.75% CHANCE' : ''}
                  </span>

                  <span className="font-mono text-xs text-neutral-300 font-bold bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded">
                    LV. {selectedSpirit.level || 1}
                  </span>

                  <ElementBadge element={selectedSpirit.element} size="sm" />

                  {isSelectedOwned ? (
                    <span className="bg-green-500/20 text-green-400 border border-green-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      TERIKAT JIWA (DIMILIKI)
                    </span>
                  ) : (
                    <span className="bg-neutral-800 text-neutral-400 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> BELUM DIBANGKITKAN
                    </span>
                  )}
                </div>

                <h3 className="font-bebas text-3xl text-white tracking-wide mt-1">
                  {selectedSpirit.name}
                </h3>
                <p className="font-mono text-xs text-amber-300 italic">
                  {selectedSpirit.title}
                </p>
              </div>

              {/* Upgrade Button */}
              {isSelectedOwned && (
                <button
                  disabled={spiritGems < UPGRADE_COST}
                  onClick={handleUpgrade}
                  className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-bebas text-base px-4 py-1.5 rounded border-2 border-black skew-x-[-10deg] flex items-center gap-1.5 font-black cursor-pointer transition-transform active:scale-95 shadow-md"
                >
                  <ArrowUpCircle className="w-4 h-4 transform skew-x-[10deg]" />
                  <span className="transform skew-x-[10deg]">UPGRADE (+STATS): {UPGRADE_COST} TKN</span>
                </button>
              )}
            </div>

            {/* Bonus Stats Bar */}
            <div className="grid grid-cols-4 gap-2 mb-4 bg-black/60 p-2.5 rounded border border-neutral-800 text-center">
              <div>
                <span className="block text-[10px] font-mono text-neutral-400 uppercase">BONUS HP</span>
                <span className="font-bebas text-lg text-red-400 font-bold">+{selectedSpirit.bonusHp}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-neutral-400 uppercase">BONUS SP</span>
                <span className="font-bebas text-lg text-cyan-400 font-bold">+{selectedSpirit.bonusSp}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-neutral-400 uppercase">BONUS ATK</span>
                <span className="font-bebas text-lg text-amber-400 font-bold">+{selectedSpirit.bonusAtk}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-neutral-400 uppercase">BONUS DEF</span>
                <span className="font-bebas text-lg text-blue-400 font-bold">+{selectedSpirit.bonusDef}</span>
              </div>
            </div>

            {/* Awaken Tier Status & Ritual Upgrade Button */}
            {isSelectedOwned && (
              <div className="bg-gradient-to-r from-amber-950/60 via-black to-amber-950/40 p-3 rounded-lg border-2 border-amber-500/50 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span className="font-bebas text-xl text-amber-300 tracking-wider">
                      TINGKAT KEBANGKITAN SUKMA: {selectedSpirit.awakenRank ?? 1}/5
                    </span>
                    <div className="flex items-center gap-1 ml-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= (selectedSpirit.awakenRank ?? 1)
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]'
                              : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-300 mt-0.5">
                    <span className="text-amber-400 font-bold">{selectedSpirit.awakenTitle || 'Tingkat I: Pengikatan Sukma'}</span>
                    {' &bull; '}
                    <span className="text-neutral-300">{selectedSpirit.awakenPassive || 'Pasif resonansi sukma aktif'}</span>
                  </p>
                </div>

                {(selectedSpirit.awakenRank ?? 1) < 5 ? (
                  <button
                    disabled={spiritGems < (AWAKEN_TIERS[(selectedSpirit.awakenRank ?? 1) + 1]?.costTokens ?? 40)}
                    onClick={() => handleAwakenSpirit(selectedSpirit)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 text-black font-bebas text-base px-4 py-1.5 rounded skew-x-[-10deg] font-black cursor-pointer shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4 transform skew-x-[10deg]" />
                    <span className="transform skew-x-[10deg]">
                      RITUAL AWAKEN TIER {(selectedSpirit.awakenRank ?? 1) + 1}: {AWAKEN_TIERS[(selectedSpirit.awakenRank ?? 1) + 1]?.costTokens ?? 40} TKN
                    </span>
                  </button>
                ) : (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 font-mono text-xs px-3 py-1 rounded font-bold whitespace-nowrap">
                    ★ KEBANGKITAN MAKSIMAL (TIER 5)
                  </span>
                )}
              </div>
            )}

            {/* Signature Quote */}
            <blockquote className="italic font-serif text-xs sm:text-sm text-neutral-200 border-l-4 border-[#FF0033] pl-4 py-2 mb-4 bg-black/60">
              &ldquo;{selectedSpirit.signatureQuote}&rdquo;
            </blockquote>

            {/* Lore & Origin Story */}
            <div className="space-y-3 text-xs leading-relaxed text-neutral-300 mb-4 font-sans">
              <div>
                <span className="text-[#FF0033] font-black uppercase tracking-wider font-mono text-xs block">
                  ASAL USUL ROH (LORE SEKOLAH):
                </span>
                <p className="mt-1 text-neutral-300 leading-relaxed">{selectedSpirit.originStory}</p>
              </div>

              <div>
                <span className="text-amber-400 font-black uppercase tracking-wider font-mono text-xs block">
                  MANIFESTASI JIWA:
                </span>
                <p className="mt-1 text-neutral-400 leading-relaxed">{selectedSpirit.lore}</p>
              </div>
            </div>

            {/* Showtime Finisher Banner */}
            <div className="mb-4 bg-gradient-to-r from-red-950/80 to-black border-2 border-[#FF0033] p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="bg-[#FF0033] text-black font-bebas text-xs px-2 py-0.5 skew-x-[-10deg] font-black">
                  SHOWTIME PAMUNGKAS
                </span>
                <ElementBadge element={selectedSpirit.highlightSkill.element} size="sm" />
              </div>
              <div className="font-bebas text-lg text-yellow-300 tracking-wide">
                {selectedSpirit.highlightSkill.name} (Power: {selectedSpirit.highlightSkill.power})
              </div>
              <p className="text-[11px] text-neutral-300 font-mono mt-0.5">
                {selectedSpirit.highlightSkill.description}
              </p>
            </div>

            {/* Skills Showcase */}
            <div className="mb-4">
              <span className="text-neutral-400 font-mono text-xs font-black uppercase tracking-wider block mb-2">
                DAFTAR JURUS KONTRAK ({selectedSpirit.skills.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSpirit.skills.map(skill => (
                  <div
                    key={skill.id}
                    className="p-2 rounded bg-black/80 border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bebas text-sm text-white tracking-wide">
                        {skill.name} {skill.spCost ? `(${skill.spCost} SP)` : skill.hpCost ? `(${skill.hpCost} HP)` : ''}
                      </div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">
                        {skill.description}
                      </div>
                    </div>
                    <ElementBadge element={skill.element} size="sm" showName={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equip to Hero Selector */}
          <div className="border-t border-neutral-800 pt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider">
              PASANGKAN KE ANGGOTA TIM:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {heroes.map(hero => {
                const isEquipped = hero.equippedSpiritId === selectedSpirit.id;
                return (
                  <button
                    key={hero.id}
                    disabled={!isSelectedOwned}
                    onClick={() => handleEquipWithAnimation(hero.id, selectedSpirit)}
                    className={`font-bebas text-sm px-3.5 py-1.5 skew-x-[-10deg] transition-all cursor-pointer disabled:opacity-30 ${
                      isEquipped
                        ? 'bg-[#FF0033] text-black font-black border-2 border-white shadow-lg'
                        : 'border border-neutral-700 bg-[#141418] text-neutral-300 hover:border-[#FF0033] hover:text-white'
                    }`}
                  >
                    <span className="block transform skew-x-[10deg] uppercase font-bold">
                      {isEquipped ? 'TERPASANG: ' : 'PASANG: '} {hero.alias}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Gacha Rates & SSR Roster Detail Modal */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border-4 border-[#FF0033] max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h3 className="font-bebas text-2xl text-white tracking-wider">
                  PANDUAN TARIF GACHA & DAFTAR 8 ROH SSR
                </h3>
              </div>
              <button
                onClick={() => setShowRatesModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Rates Breakdown */}
            <div className="space-y-4 text-xs font-mono">
              <div className="bg-black/60 border border-neutral-800 p-3 rounded">
                <span className="text-[#FF0033] font-bold text-sm block mb-2">
                  1. TABEL PELUANG KELANGKAAN RESMI (HARDCORE GACHA)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-yellow-400/10 border border-yellow-400/40 p-2 rounded">
                    <span className="block font-bebas text-lg text-yellow-400">★★★ SSR</span>
                    <span className="text-white font-black text-base">0.75%</span>
                    <span className="block text-[10px] text-neutral-400 mt-1">Hanya ada 8 Roh</span>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/40 p-2 rounded">
                    <span className="block font-bebas text-lg text-purple-400">★★ SR</span>
                    <span className="text-white font-black text-base">9.25%</span>
                    <span className="block text-[10px] text-neutral-400 mt-1">10 Roh Sakti</span>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 p-2 rounded">
                    <span className="block font-bebas text-lg text-cyan-400">★ R</span>
                    <span className="text-white font-black text-base">90.00%</span>
                    <span className="block text-[10px] text-neutral-400 mt-1">8 Roh Standar</span>
                  </div>
                </div>
              </div>

              {/* Reward rules */}
              <div className="bg-black/60 border border-neutral-800 p-3 rounded">
                <span className="text-yellow-400 font-bold block mb-1">
                  2. ATURAN TOKEN & KEMENANGAN MUSUH
                </span>
                <p className="text-neutral-300 leading-relaxed text-[11px]">
                  Setiap kali mengalahkan musuh di Arena Bertarung, kamu akan memperoleh tepat <strong className="text-yellow-400">20 Token Gacha</strong>.
                  <br />
                  &bull; 1x Tarikan = <strong>20 Token Gacha</strong> (1 kemenangan musuh)
                  <br />
                  &bull; 10x Tarikan = <strong>200 Token Gacha</strong> (10 kemenangan musuh)
                  <br />
                  &bull; Jaminan Pity SSR = <strong>90 Tarikan</strong> jika belum mendapatkan SSR sebelumnya.
                </p>
              </div>

              {/* 8 Exclusive SSR Spirits Roster */}
              <div className="bg-black/60 border border-yellow-500/30 p-3 rounded">
                <span className="text-yellow-400 font-bold block mb-2 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  3. DAFTAR 8 ROH SSR LEGENDARIS (CHANCE: 0.75%)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ssrList.map((spirit, i) => (
                    <div
                      key={spirit.id}
                      className="bg-[#181822] border border-yellow-500/40 p-2 rounded flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bebas text-sm text-yellow-300 flex items-center gap-1.5">
                          <span>#{i + 1} {spirit.name}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {spirit.title}
                        </div>
                      </div>
                      <ElementBadge element={spirit.element} size="sm" showName={false} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setShowRatesModal(false)}
                className="bg-[#FF0033] hover:bg-white text-white hover:text-black font-bebas text-base px-6 py-2 skew-x-[-10deg] border-2 border-black transition-colors cursor-pointer font-black"
              >
                <span className="block transform skew-x-[10deg]">MENGERTI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPIRIT SHIFT ANIMATION OVERLAY */}
      {shiftAnimData && (
        <SpiritShiftAnimation
          hero={shiftAnimData.hero}
          previousSpirit={shiftAnimData.previousSpirit}
          newSpirit={shiftAnimData.newSpirit}
          onComplete={() => setShiftAnimData(null)}
        />
      )}

      {/* SPIRIT AWAKEN ANIMATION OVERLAY */}
      {awakenData && (
        <SpiritAwakenAnimation
          spirit={awakenData.spirit}
          isNew={awakenData.isNew}
          prevLevel={awakenData.prevLevel}
          heroes={heroes}
          onConfirm={() => setAwakenData(null)}
          onEquipToHero={(heroId, sp) => {
            handleEquipWithAnimation(heroId, sp);
            setAwakenData(null);
          }}
        />
      )}
    </div>
  );
};
