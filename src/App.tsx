import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Hero, EnemyGhost, SpiritCompanion } from './types';
import { INITIAL_HEROES } from './data/characters';
import { ALL_ENEMIES } from './data/enemies';
import { INITIAL_SPIRITS, applyAwakenRankToSpirit } from './data/spirits';
import { NavigationHeader } from './components/NavigationHeader';
import { BattleArena } from './components/BattleArena';
import { StoryMode } from './components/StoryMode';
import { SchoolExplorer } from './components/SchoolExplorer';
import { SpiritAltar } from './components/SpiritAltar';
import { ClueArchive } from './components/ClueArchive';
import { audioService } from './services/audioService';
import { Swords, Trophy, Sparkles, Flame, ShieldAlert, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'story' | 'battle' | 'explorer' | 'altar' | 'archive'>('story');
  const [heroes, setHeroes] = useState<Hero[]>(INITIAL_HEROES);
  const [ownedSpirits, setOwnedSpirits] = useState<SpiritCompanion[]>(() => {
    const s1 = INITIAL_SPIRITS.find(s => s.id === 'garuda_hayam') || INITIAL_SPIRITS[0];
    const s2 = INITIAL_SPIRITS.find(s => s.id === 'nyai_candra_kirana') || INITIAL_SPIRITS[8];
    const s3 = INITIAL_SPIRITS.find(s => s.id === 'bharata_petir') || INITIAL_SPIRITS[9];
    return [
      applyAwakenRankToSpirit(s1, 1),
      applyAwakenRankToSpirit(s2, 1),
      applyAwakenRankToSpirit(s3, 1)
    ];
  });

  const [spiritGems, setSpiritGems] = useState<number>(120);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [playerExp, setPlayerExp] = useState<number>(0);

  const [unlockedChapterId, setUnlockedChapterId] = useState<string>('chap_0');
  const [unlockedClues, setUnlockedClues] = useState<string[]>(['clue_partitur']);

  // Active Battle state
  const [activeBattleEnemies, setActiveBattleEnemies] = useState<EnemyGhost[] | null>(null);
  const [postWinStoryNodeId, setPostWinStoryNodeId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Start battle triggered from story or arena
  const handleTriggerBattle = (enemy: EnemyGhost, onWinStoryNodeId?: string) => {
    audioService.playCritical();
    setActiveBattleEnemies([enemy]);
    setPostWinStoryNodeId(onWinStoryNodeId || null);
    setCurrentTab('battle');
  };

  // Handle battle completion
  const handleBattleEnd = (victory: boolean, expGained: number, gemsGained: number) => {
    if (victory) {
      const newExp = playerExp + expGained;
      const newGems = spiritGems + gemsGained;
      setSpiritGems(newGems);

      // Level check
      const expNeeded = playerLevel * 80;
      if (newExp >= expNeeded) {
        setPlayerLevel(prev => prev + 1);
        setPlayerExp(newExp - expNeeded);
        showNotification(`LEVEL UP! Pemain mencapai LV. ${playerLevel + 1}! Seluruh atribut tim meningkat!`);

        // Upgrade party base stats
        setHeroes(prev =>
          prev.map(h => ({
            ...h,
            maxHp: h.maxHp + 40,
            hp: h.maxHp + 40,
            maxSp: h.maxSp + 20,
            sp: h.maxSp + 20,
            baseAtk: h.baseAtk + 6,
            baseDef: h.baseDef + 4
          }))
        );
      } else {
        setPlayerExp(newExp);
        showNotification(`MENANG! Memperoleh +${expGained} EXP & +${gemsGained} Token Gacha!`);
      }

      // Recover partial party HP
      setHeroes(prev =>
        prev.map(h => ({
          ...h,
          hp: Math.min(h.maxHp, Math.max(h.hp, Math.floor(h.maxHp * 0.75))),
          sp: Math.min(h.maxSp, Math.max(h.sp, Math.floor(h.maxSp * 0.75))),
          gunBullets: h.maxGunBullets
        }))
      );
    } else {
      showNotification('Kekalahan! Tim dipulihkan kembali ke kondisi sedia kala.');
      // Restore party
      setHeroes(prev =>
        prev.map(h => ({
          ...h,
          hp: h.maxHp,
          sp: h.maxSp,
          gunBullets: h.maxGunBullets
        }))
      );
    }

    setActiveBattleEnemies(null);
    if (postWinStoryNodeId) {
      setCurrentTab('story');
    }
  };

  // Spend gems helper
  const handleSpendGems = (amount: number): boolean => {
    if (spiritGems >= amount) {
      setSpiritGems(prev => prev - amount);
      return true;
    }
    return false;
  };

  // Add new spirit from summon
  const handleSummonNewSpirit = (newSpirit: SpiritCompanion) => {
    setOwnedSpirits(prev => {
      const idx = prev.findIndex(s => s.id === newSpirit.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newSpirit;
        return copy;
      }
      return [...prev, newSpirit];
    });
    showNotification(`Roh Pendamping [${newSpirit.name}] berhasil dipanggil ke dalam jiwamu!`);
  };

  // Batch summon handler (for 10x summon)
  const handleSummonBatch = (newSpirits: SpiritCompanion[]) => {
    setOwnedSpirits(prev => {
      let copy = [...prev];
      for (const s of newSpirits) {
        const idx = copy.findIndex(item => item.id === s.id);
        if (idx !== -1) {
          copy[idx] = s;
        } else {
          copy.push(s);
        }
      }
      return copy;
    });
    const ssrCount = newSpirits.filter(s => s.rarity === 'SSR').length;
    if (ssrCount > 0) {
      showNotification(`★ MUKJIZAT GHAIB! Berhasil mendapatkan ${ssrCount} Roh SSR Langka (0.75%)!`);
    } else {
      showNotification(`${newSpirits.length} Roh Pendamping berhasil dipanggil melalui ritual!`);
    }
  };

  // Equip spirit to hero
  const handleEquipSpirit = (heroId: string, spirit: SpiritCompanion) => {
    audioService.playClick();
    setHeroes(prev =>
      prev.map(h => {
        if (h.id === heroId) {
          return {
            ...h,
            equippedSpiritId: spirit.id,
            spirits: [spirit, ...h.spirits.filter(s => s.id !== spirit.id)]
          };
        }
        return h;
      })
    );
    showNotification(`${spirit.name} kini terpasang pada ${heroId.toUpperCase()}!`);
  };

  // Clue discovery
  const handleClueDiscovered = (clueId: string) => {
    if (!unlockedClues.includes(clueId)) {
      setUnlockedClues(prev => [...prev, clueId]);
      showNotification('ARSIP RAHASIA BARU TERUNGKAP! Periksa menu Arsip 1998.');
      setSpiritGems(prev => prev + 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between relative overflow-x-hidden artistic-radial-bg">
      {/* Background Repeating Red Pattern (Artistic Flair) */}
      <div className="fixed inset-0 opacity-15 pointer-events-none artistic-pattern z-0" />

      {/* Atmospheric Giant Geometric Frames from Theme */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="w-[800px] sm:w-[1100px] h-[450px] border-[20px] border-[#FF0033] opacity-[0.04] transform rotate-[15deg]" />
        <div className="w-[900px] sm:w-[1200px] h-[350px] border border-white opacity-[0.06] transform -rotate-[10deg] mt-16" />
        <div className="absolute top-10 left-20 w-[450px] h-[450px] bg-gradient-to-t from-[#FF0033] to-transparent opacity-10 blur-3xl rounded-full" />
      </div>

      {/* Top Header */}
      <div className="relative z-20">
        <NavigationHeader
          currentTab={currentTab}
          onSelectTab={tab => {
            if (tab !== 'battle') setActiveBattleEnemies(null);
            setCurrentTab(tab);
          }}
          spiritGems={spiritGems}
          playerLevel={playerLevel}
        />
      </div>

      {/* Global Notification Toast (Artistic Flair Style) */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-black/95 border-2 border-white text-white px-5 py-2.5 rounded shadow-2xl p5-skew flex items-center gap-3 animate-shake border-l-8 border-l-[#FF0033]">
          <div className="bg-[#FF0033] text-black font-black text-xs px-2 py-0.5 uppercase italic">
            ALERT
          </div>
          <span className="font-mono text-xs tracking-wide">{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* TAB 1: STORY MODE (VISUAL NOVEL EPISODES) */}
        {currentTab === 'story' && (
          <StoryMode
            onTriggerBattle={handleTriggerBattle}
            unlockedChapterId={unlockedChapterId}
            onClueDiscovered={handleClueDiscovered}
            postWinStoryNodeId={postWinStoryNodeId}
            onClearPostWinStoryNodeId={() => setPostWinStoryNodeId(null)}
          />
        )}

        {/* TAB 2: BATTLE ARENA */}
        {currentTab === 'battle' && (
          <div>
            {activeBattleEnemies ? (
              <BattleArena
                heroes={heroes}
                initialEnemies={activeBattleEnemies}
                onBattleEnd={handleBattleEnd}
                onEscape={() => setActiveBattleEnemies(null)}
              />
            ) : (
              /* Custom Battle Match Selection */
              <div className="w-full bg-[#0E0E12]/95 border-2 border-[#FF0033]/60 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF0033]/15 to-transparent pointer-events-none blur-2xl" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-[#FF0033]/50 pb-4 mb-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FF0033] text-black px-4 py-1 skew-x-[-12deg] font-black text-xl">
                        PHANTOM TRACKER
                      </div>
                      <h2 className="font-bebas text-3xl text-white tracking-wider flex items-center gap-2">
                        ARENA PERTARUNGAN GHAIB
                      </h2>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-80">
                      Combat Simulation &bull; Eksploitasi Kelemahan &bull; Serangan Total P5X
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black italic text-[#FF0033] tracking-tighter">S-RANK</div>
                    <div className="text-[10px] opacity-60 uppercase font-mono tracking-widest">CURSE INTENSITY</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
                  {Object.values(ALL_ENEMIES).map(enemy => (
                    <div
                      key={enemy.id}
                      className="p-5 rounded-lg border-2 border-neutral-800 bg-[#121217]/90 hover:border-[#FF0033] transition-all flex flex-col justify-between group hover:p5-shadow-red relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF0033]/5 rounded-bl-full pointer-events-none group-hover:bg-[#FF0033]/15 transition-all" />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-[#FF0033] font-bold tracking-wider">
                            LV.{enemy.level}
                          </span>
                          {enemy.isBoss ? (
                            <span className="bg-[#FF0033] text-black font-black text-xs px-2 py-0.5 skew-x-[-10deg]">
                              BOSS
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                              SPECTRAL
                            </span>
                          )}
                        </div>
                        <h3 className="font-bebas text-2xl text-white tracking-wide group-hover:text-[#FF0033] transition-colors">
                          {enemy.name}
                        </h3>
                        <p className="text-xs font-mono text-amber-300 mb-2 italic">
                          {enemy.title}
                        </p>
                        <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed font-sans">
                          {enemy.lore}
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-mono bg-black/50 px-2.5 py-1 rounded border border-neutral-800 mb-3">
                          <span className="text-yellow-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> +20 Token Gacha
                          </span>
                          <span className="text-cyan-400 font-bold">
                            +{enemy.dropExp} EXP
                          </span>
                        </div>
                      </div>

                      {/* Artistic Flair Layered Button */}
                      <button
                        onClick={() => handleTriggerBattle(enemy)}
                        className="relative transform -rotate-1 group/btn cursor-pointer w-full mt-2"
                      >
                        <div className="absolute -inset-1 bg-white skew-x-[-10deg] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <div className="relative bg-[#FF0033] group-hover/btn:bg-white text-white group-hover/btn:text-black py-2.5 px-4 skew-x-[-10deg] font-bebas text-lg font-black tracking-wider flex items-center justify-center gap-2 shadow-xl border-2 border-black transition-colors">
                          <Swords className="w-4 h-4 transform skew-x-[10deg]" />
                          <span className="transform skew-x-[10deg] italic uppercase">TANTANG PERTARUNGAN</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CORRIDOR EXPLORER */}
        {currentTab === 'explorer' && (
          <SchoolExplorer
            onTriggerBattle={enemy => handleTriggerBattle(enemy)}
            onFindGems={amount => {
              setSpiritGems(prev => prev + amount);
              showNotification(`Mendapatkan +${amount} Kristal Jiwa!`);
            }}
            onFindClue={handleClueDiscovered}
            foundClues={unlockedClues}
          />
        )}

        {/* TAB 4: SPIRIT ALTAR (VELVET ROOM) */}
        {currentTab === 'altar' && (
          <SpiritAltar
            heroes={heroes}
            spiritGems={spiritGems}
            onSpendGems={handleSpendGems}
            onEquipSpirit={handleEquipSpirit}
            ownedSpirits={ownedSpirits}
            onSummonNewSpirit={handleSummonNewSpirit}
            onSummonBatch={handleSummonBatch}
          />
        )}

        {/* TAB 5: SECRET CLUE ARCHIVE */}
        {currentTab === 'archive' && (
          <ClueArchive unlockedClueIds={unlockedClues} />
        )}
      </main>

      {/* Footer in Artistic Flair */}
      <footer className="relative z-20 border-t-2 border-[#FF0033]/40 bg-gradient-to-t from-black to-[#0A0A0A]/90 py-4 px-6 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF0033] text-black font-black px-2 py-0.5 skew-x-[-12deg] text-[10px]">
              ARTISTIC FLAIR
            </span>
            <span>BHAWANA PHANTOM &copy; 2026</span>
          </div>
          <p className="opacity-70 tracking-widest uppercase text-[10px]">
            Urban Horror RPG &bull; Persona 5X Stylized Aesthetic
          </p>
        </div>
      </footer>
    </div>
  );
}
