import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Hero, EnemyGhost, SpiritCompanion, SavedGameProfile } from './types';
import { INITIAL_HEROES } from './data/characters';
import { ALL_ENEMIES } from './data/enemies';
import { INITIAL_SPIRITS, applyAwakenRankToSpirit } from './data/spirits';
import { NavigationHeader } from './components/NavigationHeader';
import { BattleArena } from './components/BattleArena';
import { StoryMode } from './components/StoryMode';
import { SchoolExplorer } from './components/SchoolExplorer';
import { GachaAltar } from './components/GachaAltar';
import { SpiritUpgradeTemple } from './components/SpiritUpgradeTemple';
import { ClueArchive } from './components/ClueArchive';
import { TitleAccountScreen } from './components/TitleAccountScreen';
import { saveService } from './services/saveService';
import { audioService } from './services/audioService';
import { 
  Swords, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Lock, 
  UserCheck, 
  X,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Account / Save Profile State
  const [activeProfile, setActiveProfile] = useState<SavedGameProfile | null>(() => {
    const activeId = saveService.getActiveProfileId();
    if (activeId) {
      const p = saveService.getProfileById(activeId);
      if (p) return p;
    }
    const all = saveService.getAllProfiles();
    if (all.length > 0) {
      return all[0];
    }
    return null;
  });

  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

  // Tab State: Story, Battle, Explorer, Gacha (Altar Doa), Upgrade (Kuil Penguatan), Archive
  const [currentTab, setCurrentTab] = useState<'story' | 'battle' | 'explorer' | 'gacha' | 'upgrade' | 'archive'>('story');

  // Game Core States
  const [heroes, setHeroes] = useState<Hero[]>(() => {
    if (activeProfile?.heroes && activeProfile.heroes.length > 0) {
      return activeProfile.heroes;
    }
    return INITIAL_HEROES;
  });

  const [ownedSpirits, setOwnedSpirits] = useState<SpiritCompanion[]>(() => {
    if (activeProfile?.ownedSpirits && activeProfile.ownedSpirits.length > 0) {
      return activeProfile.ownedSpirits;
    }
    const s1 = INITIAL_SPIRITS.find(s => s.id === 'garuda_hayam') || INITIAL_SPIRITS[0];
    const s2 = INITIAL_SPIRITS.find(s => s.id === 'nyai_candra_kirana') || INITIAL_SPIRITS[8];
    const s3 = INITIAL_SPIRITS.find(s => s.id === 'bharata_petir') || INITIAL_SPIRITS[9];
    return [
      applyAwakenRankToSpirit(s1, 1),
      applyAwakenRankToSpirit(s2, 1),
      applyAwakenRankToSpirit(s3, 1)
    ];
  });

  const [spiritGems, setSpiritGems] = useState<number>(() => activeProfile?.spiritGems ?? 120);
  const [playerLevel, setPlayerLevel] = useState<number>(() => activeProfile?.playerLevel ?? 1);
  const [playerExp, setPlayerExp] = useState<number>(() => activeProfile?.playerExp ?? 0);

  const [unlockedChapterId, setUnlockedChapterId] = useState<string>(() => activeProfile?.unlockedChapterId ?? 'chap_0');
  const [unlockedClues, setUnlockedClues] = useState<string[]>(() => activeProfile?.unlockedClues ?? ['clue_partitur']);

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

  // Helper to persist current game state to active profile in LocalStorage
  const persistState = useCallback((overrides?: Partial<SavedGameProfile>) => {
    if (!activeProfile) return;

    const updatedProfile: SavedGameProfile = {
      ...activeProfile,
      playerLevel: overrides?.playerLevel ?? playerLevel,
      playerExp: overrides?.playerExp ?? playerExp,
      spiritGems: overrides?.spiritGems ?? spiritGems,
      heroes: overrides?.heroes ?? heroes,
      ownedSpirits: overrides?.ownedSpirits ?? ownedSpirits,
      unlockedChapterId: overrides?.unlockedChapterId ?? unlockedChapterId,
      unlockedClues: overrides?.unlockedClues ?? unlockedClues,
      lastSavedAt: Date.now()
    };

    saveService.saveProfile(updatedProfile);
    setActiveProfile(updatedProfile);
  }, [activeProfile, playerLevel, playerExp, spiritGems, heroes, ownedSpirits, unlockedChapterId, unlockedClues]);

  // Load a selected or newly created profile
  const handleLoadProfile = (profile: SavedGameProfile) => {
    setActiveProfile(profile);
    setHeroes(profile.heroes || INITIAL_HEROES);
    setOwnedSpirits(profile.ownedSpirits || INITIAL_SPIRITS.slice(0, 3));
    setSpiritGems(profile.spiritGems ?? 120);
    setPlayerLevel(profile.playerLevel ?? 1);
    setPlayerExp(profile.playerExp ?? 0);
    setUnlockedChapterId(profile.unlockedChapterId ?? 'chap_0');
    setUnlockedClues(profile.unlockedClues ?? ['clue_partitur']);
    setShowAccountModal(false);
    setCurrentTab('story');
    showNotification(`Selamat datang kembali, Penyelidik ${profile.playerName || profile.name || 'Penyelidik'}! Data berhasil dimuat.`);
  };

  // Manual save triggered from header button
  const handleManualSave = () => {
    persistState();
    showNotification('Progres penyelidikan berhasil disimpan!');
  };

  // Start battle triggered from story, explorer, or arena
  const handleTriggerBattle = (enemy: EnemyGhost, onWinStoryNodeId?: string) => {
    // Boss level requirement check
    if (enemy.minPlayerLevel && playerLevel < enemy.minPlayerLevel) {
      audioService.playWeakness();
      showNotification(`Aura kutukan terlalu pekat! Diperlukan minimal Level ${enemy.minPlayerLevel} untuk menantang ${enemy.name}!`);
      return;
    }

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
      let nextLevel = playerLevel;
      let nextExp = newExp;

      if (newExp >= expNeeded) {
        nextLevel = playerLevel + 1;
        nextExp = newExp - expNeeded;
        setPlayerLevel(nextLevel);
        setPlayerExp(nextExp);
        showNotification(`LEVEL UP! Penyelidik mencapai LV. ${nextLevel}! Status seluruh tim meningkat!`);

        // Upgrade party base stats
        setHeroes(prev => {
          const upgraded = prev.map(h => ({
            ...h,
            maxHp: h.maxHp + 40,
            hp: h.maxHp + 40,
            maxSp: h.maxSp + 20,
            sp: h.maxSp + 20,
            baseAtk: h.baseAtk + 6,
            baseDef: h.baseDef + 4
          }));
          persistState({
            playerLevel: nextLevel,
            playerExp: nextExp,
            spiritGems: newGems,
            heroes: upgraded
          });
          return upgraded;
        });
      } else {
        setPlayerExp(newExp);
        showNotification(`MENANG! Memperoleh +${expGained} EXP & +${gemsGained} Token Gacha!`);
        persistState({
          playerExp: newExp,
          spiritGems: newGems
        });
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
      const nextGems = spiritGems - amount;
      setSpiritGems(nextGems);
      persistState({ spiritGems: nextGems });
      return true;
    }
    return false;
  };

  // Add new spirit from summon
  const handleSummonNewSpirit = (newSpirit: SpiritCompanion) => {
    setOwnedSpirits(prev => {
      const idx = prev.findIndex(s => s.id === newSpirit.id);
      let updated: SpiritCompanion[];
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = newSpirit;
      } else {
        updated = [...prev, newSpirit];
      }
      persistState({ ownedSpirits: updated });
      return updated;
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
      persistState({ ownedSpirits: copy });
      return copy;
    });
    const ssrCount = newSpirits.filter(s => s.rarity === 'SSR').length;
    if (ssrCount > 0) {
      showNotification(`★ MUKJIZAT GHAIB! Berhasil mendapatkan ${ssrCount} Roh SSR Langka (0.75%)!`);
    } else {
      showNotification(`${newSpirits.length} Roh Pendamping berhasil dipanggil melalui ritual!`);
    }
  };

  // Update spirit stats (e.g. from upgrade or awaken)
  const handleUpdateSpirit = (updatedSpirit: SpiritCompanion) => {
    setOwnedSpirits(prev => {
      const copy = prev.map(s => (s.id === updatedSpirit.id ? updatedSpirit : s));
      persistState({ ownedSpirits: copy });
      return copy;
    });
    showNotification(`Atribut [${updatedSpirit.name}] berhasil ditingkatkan!`);
  };

  // Equip spirit to hero
  const handleEquipSpirit = (heroId: string, spirit: SpiritCompanion) => {
    audioService.playClick();
    setHeroes(prev => {
      const updated = prev.map(h => {
        if (h.id === heroId) {
          return {
            ...h,
            equippedSpiritId: spirit.id,
            spirits: [spirit, ...h.spirits.filter(s => s.id !== spirit.id)]
          };
        }
        return h;
      });
      persistState({ heroes: updated });
      return updated;
    });
    showNotification(`${spirit.name} kini terpasang pada ${heroId.toUpperCase()}!`);
  };

  // Clue discovery
  const handleClueDiscovered = (clueId: string) => {
    if (!unlockedClues.includes(clueId)) {
      const nextClues = [...unlockedClues, clueId];
      const nextGems = spiritGems + 50;
      setUnlockedClues(nextClues);
      setSpiritGems(nextGems);
      persistState({ unlockedClues: nextClues, spiritGems: nextGems });
      showNotification('ARSIP RAHASIA BARU TERUNGKAP! Periksa menu Arsip 1998 (+50 Token).');
    }
  };

  // If no profile exists or user is not logged in, show Title / Account Screen
  if (!activeProfile) {
    return <TitleAccountScreen onLoadProfile={handleLoadProfile} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between relative overflow-x-hidden artistic-radial-bg pb-16 md:pb-0">
      {/* Background Repeating Red Pattern */}
      <div className="fixed inset-0 opacity-15 pointer-events-none artistic-pattern z-0" />

      {/* Atmospheric Giant Geometric Frames */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="w-[800px] sm:w-[1100px] h-[450px] border-[20px] border-[#FF0033] opacity-[0.04] transform rotate-[15deg]" />
        <div className="w-[900px] sm:w-[1200px] h-[350px] border border-white opacity-[0.06] transform -rotate-[10deg] mt-16" />
        <div className="absolute top-10 left-20 w-[450px] h-[450px] bg-gradient-to-t from-[#FF0033] to-transparent opacity-10 blur-3xl rounded-full" />
      </div>

      {/* Top Header & Navigation */}
      <div className="relative z-20">
        <NavigationHeader
          currentTab={currentTab}
          onSelectTab={tab => {
            if (tab !== 'battle') setActiveBattleEnemies(null);
            setCurrentTab(tab);
          }}
          spiritGems={spiritGems}
          playerLevel={playerLevel}
          activeProfileName={activeProfile.playerName || activeProfile.name || 'Penyelidik'}
          onOpenAccountManager={() => setShowAccountModal(true)}
          onManualSave={handleManualSave}
        />
      </div>

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-black/95 border-2 border-white text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded shadow-2xl p5-skew flex items-center gap-3 animate-shake border-l-8 border-l-[#FF0033] max-w-sm sm:max-w-md">
          <div className="bg-[#FF0033] text-black font-black text-xs px-2 py-0.5 uppercase italic shrink-0">
            ALERT
          </div>
          <span className="font-mono text-xs tracking-wide">{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        {/* TAB 1: STORY MODE */}
        {currentTab === 'story' && (
          <StoryMode
            onTriggerBattle={handleTriggerBattle}
            unlockedChapterId={unlockedChapterId}
            onClueDiscovered={handleClueDiscovered}
            postWinStoryNodeId={postWinStoryNodeId}
            onClearPostWinStoryNodeId={() => setPostWinStoryNodeId(null)}
            playerLevel={playerLevel}
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
                ownedSpirits={ownedSpirits}
                onEquipSpirit={handleEquipSpirit}
              />
            ) : (
              /* Custom Battle Match Selection with Level Gating */
              <div className="w-full bg-[#0E0E12]/95 border-2 border-[#FF0033]/60 rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
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
                      Combat Simulation &bull; Eksploitasi Kelemahan &bull; Batasan Level Boss Berlaku
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black italic text-[#FF0033] tracking-tighter">S-RANK</div>
                    <div className="text-[10px] opacity-60 uppercase font-mono tracking-widest">CURSE INTENSITY</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
                  {Object.values(ALL_ENEMIES).map(enemy => {
                    const isLevelGated = enemy.minPlayerLevel && playerLevel < enemy.minPlayerLevel;

                    return (
                      <div
                        key={enemy.id}
                        className={`p-5 rounded-lg border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                          isLevelGated
                            ? 'border-red-900/60 bg-[#0d070a]/90 opacity-80'
                            : 'border-neutral-800 bg-[#121217]/90 hover:border-[#FF0033] hover:p5-shadow-red'
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF0033]/5 rounded-bl-full pointer-events-none" />

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs text-[#FF0033] font-bold tracking-wider">
                              LV.{enemy.level}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {enemy.isBoss && (
                                <span className="bg-[#FF0033] text-black font-black text-xs px-2 py-0.5 skew-x-[-10deg]">
                                  BOSS
                                </span>
                              )}
                              {isLevelGated && (
                                <span className="bg-red-950 text-red-400 border border-red-700 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> BUTUH LV.{enemy.minPlayerLevel}
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className="font-bebas text-2xl text-white tracking-wide">
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

                        {/* Challenge Button with Level Gating */}
                        <button
                          onClick={() => {
                            if (isLevelGated) {
                              audioService.playWeakness();
                              showNotification(`Level belum mencukupi! Diperlukan minimal Level ${enemy.minPlayerLevel} untuk melawan ${enemy.name}!`);
                              return;
                            }
                            handleTriggerBattle(enemy);
                          }}
                          className={`relative transform -rotate-1 group/btn w-full mt-2 ${
                            isLevelGated ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                          }`}
                        >
                          <div className={`absolute -inset-1 skew-x-[-10deg] ${isLevelGated ? 'bg-red-950' : 'bg-white opacity-0 group-hover/btn:opacity-100 transition-opacity'}`} />
                          <div className={`relative py-2.5 px-4 skew-x-[-10deg] font-bebas text-lg font-black tracking-wider flex items-center justify-center gap-2 shadow-xl border-2 transition-colors ${
                            isLevelGated
                              ? 'bg-neutral-900 text-red-400 border-red-800'
                              : 'bg-[#FF0033] group-hover/btn:bg-white text-white group-hover/btn:text-black border-black'
                          }`}>
                            {isLevelGated ? (
                              <>
                                <Lock className="w-4 h-4 transform skew-x-[10deg] text-red-400" />
                                <span className="transform skew-x-[10deg] italic uppercase">
                                  TERKUNCI: BUTUH LV. {enemy.minPlayerLevel}
                                </span>
                              </>
                            ) : (
                              <>
                                <Swords className="w-4 h-4 transform skew-x-[10deg]" />
                                <span className="transform skew-x-[10deg] italic uppercase">
                                  TANTANG PERTARUNGAN
                                </span>
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
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
              const nextGems = spiritGems + amount;
              setSpiritGems(nextGems);
              persistState({ spiritGems: nextGems });
              showNotification(`Mendapatkan +${amount} Token Gacha!`);
            }}
            onFindClue={handleClueDiscovered}
            foundClues={unlockedClues}
          />
        )}

        {/* TAB 4: SEPARATE GACHA MENU (ALTAR DOA PEMANGGILAN) */}
        {currentTab === 'gacha' && (
          <GachaAltar
            heroes={heroes}
            spiritGems={spiritGems}
            onSpendGems={handleSpendGems}
            ownedSpirits={ownedSpirits}
            onSummonNewSpirit={handleSummonNewSpirit}
            onSummonBatch={handleSummonBatch}
            onNavigateToUpgrade={() => setCurrentTab('upgrade')}
          />
        )}

        {/* TAB 5: SEPARATE UPGRADE MENU (KUIL PENGUATAN ROH & KEBANGKITAN) */}
        {currentTab === 'upgrade' && (
          <SpiritUpgradeTemple
            heroes={heroes}
            spiritGems={spiritGems}
            onSpendGems={handleSpendGems}
            onEquipSpirit={handleEquipSpirit}
            ownedSpirits={ownedSpirits}
            onUpdateSpirit={handleUpdateSpirit}
          />
        )}

        {/* TAB 6: SECRET CLUE ARCHIVE */}
        {currentTab === 'archive' && (
          <ClueArchive unlockedClueIds={unlockedClues} />
        )}
      </main>

      {/* Account Switcher Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 z-50 bg-neutral-900 hover:bg-[#FF0033] text-white p-2 rounded-full border border-neutral-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <TitleAccountScreen onLoadProfile={handleLoadProfile} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-20 border-t-2 border-[#FF0033]/40 bg-gradient-to-t from-black to-[#0A0A0A]/90 py-3 sm:py-4 px-4 sm:px-6 select-none">
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
