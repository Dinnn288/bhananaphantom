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
  ArrowUpCircle, 
  Check, 
  BookOpen, 
  Award,
  Zap,
  Star,
  Search,
  Crown,
  Lock,
  ChevronRight,
  Shield,
  Clock,
  Swords,
  Info
} from 'lucide-react';

interface SpiritUpgradeTempleProps {
  heroes: Hero[];
  spiritGems: number; // Token Gacha used for upgrading
  onSpendGems: (amount: number) => boolean;
  onEquipSpirit: (heroId: string, spirit: SpiritCompanion) => void;
  ownedSpirits: SpiritCompanion[];
  onUpdateSpirit: (updatedSpirit: SpiritCompanion) => void;
}

const UPGRADE_COST = 20; // 20 tokens per level up

export const SpiritUpgradeTemple: React.FC<SpiritUpgradeTempleProps> = ({
  heroes,
  spiritGems,
  onSpendGems,
  onEquipSpirit,
  ownedSpirits,
  onUpdateSpirit
}) => {
  const [selectedSpirit, setSelectedSpirit] = useState<SpiritCompanion>(
    ownedSpirits[0] || INITIAL_SPIRITS[0]
  );

  // Filter & Search
  const [rarityFilter, setRarityFilter] = useState<'ALL' | 'SSR' | 'SR' | 'R'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Animation States
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

  // Level Up Spirit
  const handleLevelUp = () => {
    if (spiritGems < UPGRADE_COST) {
      audioService.playWeakness();
      return;
    }

    if (!onSpendGems(UPGRADE_COST)) return;

    audioService.playOneMore();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00f5d4', '#ffd166', '#ff0033']
    });

    const updated: SpiritCompanion = {
      ...selectedSpirit,
      level: selectedSpirit.level + 1,
      bonusHp: selectedSpirit.bonusHp + 25,
      bonusSp: selectedSpirit.bonusSp + 10,
      bonusAtk: selectedSpirit.bonusAtk + 6,
      bonusDef: selectedSpirit.bonusDef + 4
    };

    setSelectedSpirit(updated);
    onUpdateSpirit(updated);
  };

  // Awaken Star Rank (★1 to ★5)
  const handleAwakenRank = () => {
    const currentRank = selectedSpirit.awakenRank ?? 1;
    if (currentRank >= 5) return;

    const nextTier = AWAKEN_TIERS[currentRank + 1];
    const cost = nextTier ? nextTier.costTokens : 40;

    if (spiritGems < cost) {
      audioService.playWeakness();
      return;
    }

    if (!onSpendGems(cost)) return;

    const updated = applyAwakenRankToSpirit(selectedSpirit, currentRank + 1);
    setSelectedSpirit(updated);
    onUpdateSpirit(updated);

    audioService.playCritical();
    setAwakenData({
      spirit: updated,
      isNew: false,
      prevLevel: selectedSpirit.level
    });
  };

  // Filter spirits
  const filteredSpirits = ownedSpirits.filter(spirit => {
    const matchRarity = rarityFilter === 'ALL' || spirit.rarity === rarityFilter;
    const matchSearch =
      spirit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spirit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spirit.element.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRarity && matchSearch;
  });

  const currentAwakenRank = selectedSpirit.awakenRank ?? 1;
  const nextAwakenTier = AWAKEN_TIERS[currentAwakenRank + 1];
  const awakenCost = nextAwakenTier ? nextAwakenTier.costTokens : 40;

  return (
    <div className="w-full bg-[#0E0E12]/95 border-2 border-[#FF0033]/60 rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-900/15 via-[#FF0033]/10 to-transparent pointer-events-none blur-3xl" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#FF0033]/50 pb-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#FF0033] text-black px-4 py-1 skew-x-[-12deg] font-black text-xl flex items-center gap-1.5 shadow-lg">
              <Flame className="w-5 h-5 fill-black" />
              <span>KUIL PENGUATAN ROH</span>
            </div>
            <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">
              UPGRADE & KEBANGKITAN SUKMA
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-80">
            Tingkatkan Level &bull; Bintang Kebangkitan ★1-★5 &bull; Pasang Roh Ke Karakter
          </p>
        </div>

        {/* Token Counter */}
        <div className="flex items-center gap-2 bg-[#1A1A24] border-2 border-yellow-500/80 px-4 py-2 skew-x-[-10deg] shadow-lg self-end sm:self-center">
          <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <div>
            <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              TOKEN GACHA TERSEDIA
            </div>
            <div className="font-bebas text-xl text-yellow-400 leading-none">
              {spiritGems} <span className="text-xs text-neutral-400 font-mono">TOKEN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left List (Owned Spirits), Right Detailed Upgrade Console */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Owned Spirits List & Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-lg text-white tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FF0033]" />
              ROH DIMILIKI ({ownedSpirits.length})
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              Pilih untuk Upgrade
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari roh dimiliki..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#121217] border border-neutral-800 focus:border-[#FF0033] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-600 outline-none font-mono"
            />
          </div>

          {/* Rarity Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 text-center font-bebas text-xs">
            {(['ALL', 'SSR', 'SR', 'R'] as const).map(tab => {
              const count =
                tab === 'ALL'
                  ? ownedSpirits.length
                  : ownedSpirits.filter(s => s.rarity === tab).length;

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
                    {tab} ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Spirits Card List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredSpirits.length === 0 ? (
              <div className="p-6 text-center text-neutral-500 font-mono text-xs border border-neutral-800 rounded">
                Tidak ada roh yang cocok dengan filter.
              </div>
            ) : (
              filteredSpirits.map(spirit => {
                const isSelected = selectedSpirit.id === spirit.id;
                const isEquippedBy = heroes.find(h => h.equippedSpiritId === spirit.id);

                return (
                  <div
                    key={spirit.id}
                    onClick={() => {
                      audioService.playClick();
                      setSelectedSpirit(spirit);
                    }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-white bg-[#1A0B0F] shadow-lg border-r-8 border-r-[#FF0033]'
                        : 'border-neutral-800 bg-[#121217]/90 hover:border-[#FF0033]'
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
                          <span className="text-[10px] font-mono text-green-400 font-bold shrink-0 flex items-center gap-1">
                            (LV.{spirit.level})
                            <span className="text-amber-400 flex items-center">
                              ★{spirit.awakenRank ?? 1}
                            </span>
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400 truncate flex items-center gap-2">
                          <span>{spirit.title}</span>
                          {isEquippedBy && (
                            <span className="bg-[#FF0033]/30 text-[#FF0033] border border-[#FF0033]/50 text-[9px] px-1 rounded uppercase font-bold">
                              {isEquippedBy.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ElementBadge element={spirit.element} size="sm" showName={false} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Columns: Selected Spirit Detailed Upgrade Studio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#14141D] border-2 border-neutral-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
            {/* Top Showcase: Spirit Identity Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bebas text-xs px-2.5 py-0.5 rounded skew-x-[-10deg] font-black ${
                      selectedSpirit.rarity === 'SSR'
                        ? 'bg-yellow-400 text-black'
                        : selectedSpirit.rarity === 'SR'
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {selectedSpirit.rarity}
                  </span>
                  <ElementBadge element={selectedSpirit.element} size="sm" />
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    Kebangkitan ★{currentAwakenRank}/5
                  </span>
                  {selectedSpirit.rarity === 'SSR' && (
                    <span className="bg-red-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                      SP KONSUMSI TINGGI
                    </span>
                  )}
                </div>

                <h3 className="font-bebas text-3xl text-white tracking-wide mt-1">
                  {selectedSpirit.name}
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  {selectedSpirit.title}
                </p>
              </div>

              {/* Action Buttons: Level Up & Awaken */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Level Up Button */}
                <button
                  onClick={handleLevelUp}
                  disabled={spiritGems < UPGRADE_COST}
                  className={`bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white font-bebas text-sm px-4 py-2 skew-x-[-10deg] border-2 border-green-400 cursor-pointer shadow-lg flex items-center gap-1.5 ${
                    spiritGems < UPGRADE_COST ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4 transform skew-x-[10deg]" />
                  <span className="transform skew-x-[10deg] font-bold">
                    UPGRADE LV (+{UPGRADE_COST} TOKEN)
                  </span>
                </button>

                {/* Awaken Button */}
                {currentAwakenRank < 5 && (
                  <button
                    onClick={handleAwakenRank}
                    disabled={spiritGems < awakenCost}
                    className={`bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-black font-bebas text-sm px-4 py-2 skew-x-[-10deg] border-2 border-amber-300 font-black cursor-pointer shadow-lg flex items-center gap-1.5 ${
                      spiritGems < awakenCost ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    <Star className="w-4 h-4 fill-black transform skew-x-[10deg]" />
                    <span className="transform skew-x-[10deg]">
                      BANGKITKAN ★{currentAwakenRank + 1} ({awakenCost} TOKEN)
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Signature Quote */}
            <div className="bg-black/40 border-l-4 border-yellow-500/80 p-3 rounded mb-4">
              <p className="text-xs font-sans text-yellow-200/90 italic">
                &ldquo;{selectedSpirit.signatureQuote}&rdquo;
              </p>
            </div>

            {/* Stat Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono">
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded">
                <div className="text-[10px] text-neutral-400 uppercase">BONUS HP</div>
                <div className="text-lg font-black text-green-400">+{selectedSpirit.bonusHp}</div>
              </div>
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded">
                <div className="text-[10px] text-neutral-400 uppercase">BONUS SP</div>
                <div className="text-lg font-black text-cyan-400">+{selectedSpirit.bonusSp}</div>
              </div>
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded">
                <div className="text-[10px] text-neutral-400 uppercase">BONUS ATTACK</div>
                <div className="text-lg font-black text-red-400">+{selectedSpirit.bonusAtk}</div>
              </div>
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded">
                <div className="text-[10px] text-neutral-400 uppercase">BONUS DEFENSE</div>
                <div className="text-lg font-black text-amber-400">+{selectedSpirit.bonusDef}</div>
              </div>
            </div>

            {/* Equip to Hero Action */}
            <div className="border-t border-neutral-800 pt-4 mb-5">
              <div className="text-xs font-mono text-neutral-400 uppercase mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#FF0033]" />
                PASANGKAN ROH INI KE PENYELIDIK:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {heroes.map(hero => {
                  const isCurrent = hero.equippedSpiritId === selectedSpirit.id;
                  return (
                    <button
                      key={hero.id}
                      onClick={() => handleEquipWithAnimation(hero.id, selectedSpirit)}
                      className={`p-2 rounded border font-bebas text-sm flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#FF0033] text-black font-black border-white'
                          : 'bg-[#181822] text-neutral-300 border-neutral-700 hover:border-[#FF0033]'
                      }`}
                    >
                      <span className="truncate">{hero.name} ({hero.alias})</span>
                      {isCurrent ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills & Jurus Showcase */}
            <div className="border-t border-neutral-800 pt-4">
              <h4 className="font-bebas text-lg text-white tracking-wider mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  DAFTAR JURUS & KEMAMPUAN ROH
                </span>
                {selectedSpirit.rarity === 'SSR' && (
                  <span className="text-xs font-mono text-red-400 font-bold">
                    *Karakteristik Overpower: Konsumsi SP Lebih Tinggi
                  </span>
                )}
              </h4>

              <div className="space-y-2.5">
                {selectedSpirit.skills.map((skill, idx) => (
                  <div
                    key={skill.id || idx}
                    className="p-3 bg-black/60 border border-neutral-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ElementBadge element={skill.element} size="sm" />
                        <span className="font-bebas text-base text-white tracking-wide">
                          {skill.name}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          skill.spCost >= 30 ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-cyan-950 text-cyan-300'
                        }`}>
                          {skill.spCost > 0 ? `${skill.spCost} SP` : `${skill.hpCost || 0} HP`}
                        </span>
                        <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded">
                          Daya: {skill.power}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-neutral-400 mt-1">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Highlight / Showtime Ultimate */}
                {selectedSpirit.highlightSkill && (
                  <div className="p-3 bg-gradient-to-r from-[#1E0E12] via-[#2A0E18] to-black border-2 border-[#FF0033] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#FF0033] text-black font-bebas text-xs px-2 py-0.5 font-black skew-x-[-10deg]">
                        SHOWTIME ULTIMATE
                      </span>
                      <ElementBadge element={selectedSpirit.highlightSkill.element} size="sm" />
                      <span className="font-bebas text-base text-white tracking-wide">
                        {selectedSpirit.highlightSkill.name}
                      </span>
                      <span className="text-[10px] font-mono text-yellow-400 font-bold">
                        Daya: {selectedSpirit.highlightSkill.power}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-300 italic">
                      {selectedSpirit.highlightSkill.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Lore & Mystery Backstory */}
            <div className="border-t border-neutral-800 pt-4 mt-5">
              <h4 className="font-bebas text-lg text-white tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FF0033]" />
                KISAH & MISTERI ASAL-USUL (1998)
              </h4>
              <p className="text-xs font-sans text-neutral-300 leading-relaxed mb-2">
                {selectedSpirit.lore}
              </p>
              <div className="p-3 bg-black/40 border border-neutral-800 rounded text-xs font-mono text-neutral-400 leading-relaxed">
                <span className="text-yellow-400 font-bold">Arsip Tragedi: </span>
                {selectedSpirit.originStory}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spirit Shift Animation Modal */}
      {shiftAnimData && (
        <SpiritShiftAnimation
          hero={shiftAnimData.hero}
          previousSpirit={shiftAnimData.previousSpirit}
          newSpirit={shiftAnimData.newSpirit}
          onComplete={() => setShiftAnimData(null)}
        />
      )}

      {/* Awaken Animation Modal */}
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
