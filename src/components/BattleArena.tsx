import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Hero, EnemyGhost, Skill, BattleLogEntry, SpiritCompanion } from '../types';
import { INITIAL_SPIRITS } from '../data/spirits';
import { ElementBadge } from './ElementBadge';
import { AnimePortrait } from './AnimePortrait';
import { EnemyAvatar } from './EnemyAvatar';
import { SpiritAttackAnimation } from './SpiritAttackAnimation';
import { AllOutAttackAnimation } from './AllOutAttackAnimation';
import { SpiritShiftAnimation } from './SpiritShiftAnimation';
import { ShowtimeCinematicAnimation } from './ShowtimeCinematicAnimation';
import { audioService } from '../services/audioService';
import { 
  Sword, 
  Sparkles, 
  Crosshair, 
  Shield, 
  RotateCw, 
  Zap, 
  Flame, 
  ArrowRight,
  RefreshCw,
  Skull,
  AlertTriangle
} from 'lucide-react';

export type ArenaDifficulty = 'standar' | 'siksaan' | 'gerhana';

interface BattleArenaProps {
  heroes: Hero[];
  initialEnemies: EnemyGhost[];
  onBattleEnd: (victory: boolean, expEarned: number, gemsEarned: number) => void;
  onEscape?: () => void;
  ownedSpirits?: SpiritCompanion[];
  onEquipSpirit?: (heroId: string, spirit: SpiritCompanion) => void;
}

interface ActiveSpiritAttack {
  hero: Hero;
  spirit: SpiritCompanion;
  skill: Skill;
  isShowtime?: boolean;
  targetIndices: number[];
  onFinish: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  heroes: initialHeroes,
  initialEnemies,
  onBattleEnd,
  onEscape,
  ownedSpirits = [],
  onEquipSpirit
}) => {
  const [difficulty, setDifficulty] = useState<ArenaDifficulty>('standar');
  const [heroes, setHeroes] = useState<Hero[]>(() =>
    initialHeroes.map(h => ({ ...h, isDown: false, isDefending: false }))
  );
  const [enemies, setEnemies] = useState<EnemyGhost[]>(() =>
    initialEnemies.map(e => ({ ...e, isDown: false }))
  );

  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState<number>(0);
  const [menuMode, setMenuMode] = useState<'main' | 'skills' | 'items' | 'spirits'>('main');
  const [isEnemyTurn, setIsEnemyTurn] = useState<boolean>(false);
  const [hasOneMore, setHasOneMore] = useState<boolean>(false);
  const [showOneMoreBanner, setShowOneMoreBanner] = useState<boolean>(false);
  const [showAllOutPrompt, setShowAllOutPrompt] = useState<boolean>(false);
  const [isExecutingAllOut, setIsExecutingAllOut] = useState<boolean>(false);

  // Cinematic Showtime Ultimate Overlay State
  const [showtimeCinematic, setShowtimeCinematic] = useState<{
    hero: Hero;
    spirit: SpiritCompanion;
    skill: Skill;
  } | null>(null);

  // Spirit Shift Animation Overlay State
  const [shiftAnimData, setShiftAnimData] = useState<{
    hero: Hero;
    previousSpirit?: SpiritCompanion | null;
    newSpirit: SpiritCompanion;
  } | null>(null);

  // Active Spirit Attack Cinematic Animation
  const [activeSpiritAttack, setActiveSpiritAttack] = useState<ActiveSpiritAttack | null>(null);

  // Dynamic Combat VFX states
  const [enemyAttackVfx, setEnemyAttackVfx] = useState<{
    enemyName: string;
    skillName: string;
    targetName: string;
    isAoE: boolean;
  } | null>(null);

  const [playerAttackVfx, setPlayerAttackVfx] = useState<{
    type: 'melee' | 'gun';
    enemyIndex: number;
    isCrit?: boolean;
  } | null>(null);

  const [floatingText, setFloatingText] = useState<{ id: number; text: string; color: string; isCrit?: boolean } | null>(null);
  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>([
    {
      id: 'log-start',
      text: 'Pertarungan Ghaib dimulai! Manfaatkan kelemahan hantu untuk memicu ONE MORE!',
      type: 'system'
    }
  ]);

  const activeHero = heroes[activeHeroIndex];
  const activeSpirit = activeHero?.spirits?.find(s => s.id === activeHero.equippedSpiritId) || activeHero?.spirits?.[0];

  const fallbackSpirit: SpiritCompanion = INITIAL_SPIRITS[0];
  const effectiveSpirit = activeSpirit || fallbackSpirit;

  // Difficulty stat multiplier
  const getDifficultyMultiplier = () => {
    if (difficulty === 'gerhana') return 1.6;
    if (difficulty === 'siksaan') return 1.3;
    return 1.0;
  };

  // Change difficulty on the fly
  const handleDifficultyChange = (newDiff: ArenaDifficulty) => {
    setDifficulty(newDiff);
    audioService.playClick();
    if (newDiff === 'gerhana') {
      addLog('PERINGATAN: Modus GERHANA NERAKA aktif! Musuh +60% ATK, bos bertindak 2x per ronde!', 'highlight');
    } else if (newDiff === 'siksaan') {
      addLog('PERINGATAN: Modus SIKSAAN GHAIB aktif! Musuh +30% ATK, kabut menyerap 5 SP per ronde!', 'action');
    } else {
      addLog('Tingkat kesulitan diubah ke STANDAR.', 'system');
    }
  };

  const addLog = (text: string, type: BattleLogEntry['type'] = 'action') => {
    setBattleLogs(prev => [
      { id: `log-${Date.now()}-${Math.random()}`, text, type },
      ...prev.slice(0, 15)
    ]);
  };

  const showDamageNumber = (text: string, color: string = 'text-yellow-300', isCrit: boolean = false) => {
    const id = Date.now();
    setFloatingText({ id, text, color, isCrit });
    setTimeout(() => {
      setFloatingText(prev => (prev?.id === id ? null : prev));
    }, 1200);
  };

  // Check if All-Out Attack conditions are met (all alive enemies are DOWN)
  const checkAllOutCondition = (currentEnemies: EnemyGhost[]) => {
    const aliveEnemies = currentEnemies.filter(e => e.hp > 0);
    if (aliveEnemies.length > 0 && aliveEnemies.every(e => e.isDown)) {
      setShowAllOutPrompt(true);
      audioService.playCritical();
      addLog('SEMUA HANTU DALAM KONDISI DOWN! KESEMPATAN SERANGAN TOTAL (ALL-OUT ATTACK)!', 'allout');
      return true;
    }
    return false;
  };

  // Execute All-Out Attack Finisher
  const executeAllOutAttack = () => {
    setShowAllOutPrompt(false);
    setIsExecutingAllOut(true);
    addLog(`TRIO PENGUSIR GHAIB melancarkan SERANGAN TOTAL BERSAMA (ALL-OUT ATTACK)!`, 'allout');
  };

  // Callback when AllOutAttackAnimation finishes
  const handleAllOutFinish = () => {
    // Calculate massive finisher damage (guarantees massive damage or instant wipe to downed targets)
    const totalAllOutPower = heroes.reduce((sum, h) => sum + (h.hp > 0 ? h.baseAtk * 3.4 : 0), 250);

    setEnemies(prev => {
      const updated = prev.map(e => {
        if (e.hp <= 0) return e;
        const remainingHp = Math.max(0, e.hp - Math.floor(totalAllOutPower));
        return { ...e, hp: remainingHp, isDown: false };
      });

      addLog(`KUTUKAN HANCUR! Seluruh hantu terkapar oleh serangan total (-${Math.floor(totalAllOutPower)} HP)!`, 'allout');

      // Check victory
      if (updated.every(e => e.hp <= 0)) {
        handleVictory(updated);
      }
      return updated;
    });

    setIsExecutingAllOut(false);
    advanceTurn();
  };

  // Trigger ONE MORE! extra turn
  const triggerOneMore = () => {
    setHasOneMore(true);
    setShowOneMoreBanner(true);
    audioService.playOneMore();
    addLog(`1 MORE! Giliran tambahan didapatkan!`, 'onemore');
    setTimeout(() => {
      setShowOneMoreBanner(false);
    }, 1500);
  };

  // Turn management: advance to next hero or switch to enemy phase
  const advanceTurn = () => {
    if (hasOneMore) {
      setHasOneMore(false);
      setMenuMode('main');
      return;
    }

    setMenuMode('main');
    // Find next alive hero
    let nextIdx = (activeHeroIndex + 1) % heroes.length;
    let loopCount = 0;
    while (heroes[nextIdx].hp <= 0 && loopCount < heroes.length) {
      nextIdx = (nextIdx + 1) % heroes.length;
      loopCount++;
    }

    if (loopCount >= heroes.length) {
      // All heroes defeated
      handleDefeat();
      return;
    }

    // If we wrapped around to 0, start enemy turn!
    if (nextIdx <= activeHeroIndex) {
      startEnemyTurn();
    } else {
      setActiveHeroIndex(nextIdx);
    }
  };

  // Enemy Turn Processing with Multi-Target AoE, Boss Rage & Arena Curse
  const startEnemyTurn = () => {
    setIsEnemyTurn(true);
    addLog('--- FASE SERANGAN HANTU SEKOLAH ---', 'system');

    // Arena Curse Fog on Siksaan / Gerhana
    if (difficulty === 'siksaan' || difficulty === 'gerhana') {
      setHeroes(prev =>
        prev.map(h => {
          if (h.hp > 0 && !h.isDefending) {
            return { ...h, sp: Math.max(0, h.sp - 5) };
          }
          return h;
        })
      );
      addLog('[KABUT KUTUKAN KORIDOR] Miasma beracun menyerap 5 SP dari setiap pengusir roh yang tidak bertahan!', 'system');
    }

    setTimeout(() => {
      let currentHeroes = [...heroes];
      const aliveEnemies = enemies.filter(e => e.hp > 0);
      const diffMult = getDifficultyMultiplier();

      aliveEnemies.forEach((enemy, idx) => {
        setTimeout(() => {
          // Check if any hero alive
          const livingHeroes = currentHeroes.filter(h => h.hp > 0);
          if (livingHeroes.length === 0) {
            handleDefeat();
            return;
          }

          // Check if boss is enraged (HP < 50%)
          const isRaging = enemy.isBoss && enemy.hp < (enemy.maxHp * 0.5);
          if (isRaging) {
            addLog(`[PERINGATAN AMUKAN GHAIB] ${enemy.name} mengamuk liar dengan aura merah darah!`, 'highlight');
          }

          // Pick skill
          const skill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];

          // If skill targets ALL living heroes:
          if (skill.target === 'all') {
            audioService.playMagic(skill.element);
            setEnemyAttackVfx({
              enemyName: enemy.name,
              skillName: skill.name,
              targetName: 'Seluruh Tim Penyusup',
              isAoE: true
            });
            setTimeout(() => setEnemyAttackVfx(null), 600);

            livingHeroes.forEach(targetHero => {
              const targetIndex = currentHeroes.findIndex(h => h.id === targetHero.id);
              if (targetIndex === -1) return;

              let dmg = Math.max(15, Math.floor((enemy.attack * diffMult * 1.25) + (skill.power * 0.45) - (targetHero.baseDef * 0.4)));
              if (targetHero.isDefending) dmg = Math.floor(dmg * 0.5);

              const isCrit = Math.random() < 0.15;
              if (isCrit) dmg = Math.floor(dmg * 1.5);

              const newHp = Math.max(0, targetHero.hp - dmg);
              currentHeroes[targetIndex] = {
                ...targetHero,
                hp: newHp,
                highlightGauge: Math.min(100, targetHero.highlightGauge + 15)
              };
            });

            addLog(
              `${enemy.name} melancarkan jurus massal [${skill.name}] menyapu seluruh tim penyusup!`,
              'action'
            );
          } else {
            // Single target attack
            const targetHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
            const targetIndex = currentHeroes.findIndex(h => h.id === targetHero.id);

            setEnemyAttackVfx({
              enemyName: enemy.name,
              skillName: skill.name,
              targetName: targetHero.name,
              isAoE: false
            });
            setTimeout(() => setEnemyAttackVfx(null), 600);

            let dmg = Math.max(18, Math.floor((enemy.attack * diffMult * 1.35) + (skill.power * 0.5) - (targetHero.baseDef * 0.45)));
            if (targetHero.isDefending) dmg = Math.floor(dmg * 0.5);

            const isCrit = Math.random() < 0.18;
            if (isCrit) dmg = Math.floor(dmg * 1.6);

            audioService.playSlash();
            const newHp = Math.max(0, targetHero.hp - dmg);
            currentHeroes[targetIndex] = {
              ...targetHero,
              hp: newHp,
              highlightGauge: Math.min(100, targetHero.highlightGauge + 15)
            };

            addLog(
              `${enemy.name} melancarkan [${skill.name}] pada ${targetHero.name}! (-${dmg} HP) ${isCrit ? '★ CRITICAL HIT!' : ''}`,
              isCrit ? 'critical' : 'action'
            );

            // Life drain healing
            if (skill.id === 'soul_drain') {
              setEnemies(prev =>
                prev.map(e => e.id === enemy.id ? { ...e, hp: Math.min(e.maxHp, e.hp + 250) } : e)
              );
              addLog(`[HISAPAN JIWA] ${enemy.name} menyerap darah dan memulihkan +250 HP!`, 'highlight');
            }
          }

          setHeroes([...currentHeroes]);

          // Boss Berserk or Nightmare extra action
          if ((isRaging || difficulty === 'gerhana') && enemy.isBoss) {
            setTimeout(() => {
              const livingAgain = currentHeroes.filter(h => h.hp > 0);
              if (livingAgain.length === 0) return;
              const bonusTarget = livingAgain[Math.floor(Math.random() * livingAgain.length)];
              const bIdx = currentHeroes.findIndex(h => h.id === bonusTarget.id);
              let bonusDmg = Math.max(18, Math.floor(enemy.attack * diffMult * 0.85));
              if (bonusTarget.isDefending) bonusDmg = Math.floor(bonusDmg * 0.5);
              currentHeroes[bIdx] = {
                ...bonusTarget,
                hp: Math.max(0, bonusTarget.hp - bonusDmg)
              };
              addLog(`[SERANGAN AMUKAN GANDA] ${enemy.name} menyambar ${bonusTarget.name} sekali lagi! (-${bonusDmg} HP)`, 'critical');
              setHeroes([...currentHeroes]);
            }, 400);
          }

          if (idx === aliveEnemies.length - 1) {
            // End of enemy phase, reset down states on enemies
            setTimeout(() => {
              setEnemies(prev => prev.map(e => ({ ...e, isDown: false })));
              setHeroes(prev => prev.map(h => ({ ...h, isDefending: false })));
              setIsEnemyTurn(false);

              // Find first alive hero
              const firstAliveIdx = currentHeroes.findIndex(h => h.hp > 0);
              if (firstAliveIdx === -1) {
                handleDefeat();
              } else {
                setActiveHeroIndex(firstAliveIdx);
              }
            }, 750);
          }
        }, idx * 850);
      });
    }, 600);
  };

  // Perform standard Physical Attack
  const handlePhysicalAttack = () => {
    if (isEnemyTurn || activeSpiritAttack) return;
    const targetEnemy = enemies[selectedEnemyIndex];
    if (!targetEnemy || targetEnemy.hp <= 0) return;

    audioService.playSlash();
    const isCrit = Math.random() < 0.25;
    let dmg = Math.floor((activeHero.baseAtk * 1.5) - (targetEnemy.defense * 0.4));
    if (isCrit) dmg = Math.floor(dmg * 1.7);
    dmg = Math.max(15, dmg);

    setPlayerAttackVfx({ type: 'melee', enemyIndex: selectedEnemyIndex, isCrit });
    setTimeout(() => setPlayerAttackVfx(null), 500);

    showDamageNumber(`-${dmg}`, isCrit ? 'text-amber-400' : 'text-slate-100', isCrit);
    addLog(`${activeHero.name} melancarkan tebasan pedang fisik pada ${targetEnemy.name}! (-${dmg} HP)`, isCrit ? 'critical' : 'action');

    applyDamageToEnemy(selectedEnemyIndex, dmg, 'Fisik', isCrit);
  };

  // Perform Gun / Jimat Peluru Attack
  const handleGunAttack = () => {
    if (isEnemyTurn || activeSpiritAttack) return;
    if (activeHero.gunBullets <= 0) {
      addLog(`${activeHero.name} kehabisan Jimat Peluru!`, 'system');
      return;
    }

    const targetEnemy = enemies[selectedEnemyIndex];
    if (!targetEnemy || targetEnemy.hp <= 0) return;

    audioService.playSlash();
    const bulletsToShoot = Math.min(2, activeHero.gunBullets);
    const dmgPerBullet = Math.floor((activeHero.baseAtk * 0.9) - (targetEnemy.defense * 0.2));
    const totalDmg = Math.max(20, dmgPerBullet * bulletsToShoot);

    setPlayerAttackVfx({ type: 'gun', enemyIndex: selectedEnemyIndex });
    setTimeout(() => setPlayerAttackVfx(null), 500);

    setHeroes(prev =>
      prev.map((h, i) =>
        i === activeHeroIndex ? { ...h, gunBullets: h.gunBullets - bulletsToShoot } : h
      )
    );

    const isWeak = targetEnemy.weaknesses.includes('Peluru');
    showDamageNumber(`-${totalDmg} [PELURU]`, isWeak ? 'text-red-400' : 'text-blue-300', isWeak);
    addLog(`${activeHero.name} menembakkan ${bulletsToShoot} Jimat Peluru Perak pada ${targetEnemy.name}! (-${totalDmg} HP)`, isWeak ? 'weakness' : 'action');

    applyDamageToEnemy(selectedEnemyIndex, totalDmg, 'Peluru', false, isWeak);
  };

  // Perform Guard
  const handleGuard = () => {
    if (isEnemyTurn || activeSpiritAttack) return;
    audioService.playClick();
    setHeroes(prev =>
      prev.map((h, i) => (i === activeHeroIndex ? { ...h, isDefending: true } : h))
    );
    addLog(`${activeHero.name} mengambil posisi bertahan (Guard)! Kerusakan akan berkurang 50%.`, 'action');
    advanceTurn();
  };

  // Perform Baton Pass (Transfer Turn)
  const handleBatonPass = (targetHeroIdx: number) => {
    if (isEnemyTurn || activeSpiritAttack || targetHeroIdx === activeHeroIndex) return;
    const target = heroes[targetHeroIdx];
    if (target.hp <= 0) return;

    audioService.playOneMore();
    addLog(`BATON PASS! ${activeHero.name} menyerahkan tongkat estafet giliran pada ${target.name} (+25% ATK Boost)!`, 'onemore');

    setHeroes(prev =>
      prev.map((h, i) =>
        i === targetHeroIdx ? { ...h, baseAtk: Math.floor(h.baseAtk * 1.25) } : h
      )
    );

    setActiveHeroIndex(targetHeroIdx);
    setMenuMode('main');
  };

  // Perform Spirit Shift (Persona Switch in combat)
  const handleSpiritShift = (selectedSpirit: SpiritCompanion) => {
    if (isEnemyTurn || activeSpiritAttack || selectedSpirit.id === effectiveSpirit.id) return;

    audioService.playClick();
    const prevSpirit = effectiveSpirit;

    setShiftAnimData({
      hero: activeHero,
      previousSpirit: prevSpirit,
      newSpirit: selectedSpirit
    });

    setHeroes(prev =>
      prev.map((h, i) => {
        if (i !== activeHeroIndex) return h;
        return {
          ...h,
          equippedSpiritId: selectedSpirit.id,
          spirits: [selectedSpirit, ...(h.spirits || []).filter(s => s.id !== selectedSpirit.id)]
        };
      })
    );

    if (onEquipSpirit) {
      onEquipSpirit(activeHero.id, selectedSpirit);
    }

    addLog(
      `SPIRIT SHIFT! ${activeHero.name} berganti roh ke ${selectedSpirit.name} (${selectedSpirit.element})! Elemen & jurus diperbarui.`,
      'action'
    );

    setMenuMode('main');
  };

  // Cast Spirit / Persona Skill with Cinematic Animation
  const handleCastSkill = (skill: Skill) => {
    if (isEnemyTurn || activeSpiritAttack) return;

    // Check SP/HP cost
    if (skill.spCost > 0 && activeHero.sp < skill.spCost) {
      addLog(`SP ${activeHero.name} tidak mencukupi untuk ${skill.name}!`, 'system');
      return;
    }
    if (skill.hpCost && activeHero.hp <= skill.hpCost) {
      addLog(`HP ${activeHero.name} terlalu rendah untuk mengorbankan darah!`, 'system');
      return;
    }

    // Deduct cost
    setHeroes(prev =>
      prev.map((h, i) => {
        if (i !== activeHeroIndex) return h;
        return {
          ...h,
          sp: Math.max(0, h.sp - skill.spCost),
          hp: Math.max(1, h.hp - (skill.hpCost || 0)),
          highlightGauge: Math.min(100, h.highlightGauge + 10)
        };
      })
    );

    audioService.playMagic(skill.element);

    if (skill.effectType === 'heal') {
      // Heal party
      audioService.playCritical();
      setHeroes(prev =>
        prev.map(h => (h.hp > 0 ? { ...h, hp: Math.min(h.maxHp, h.hp + skill.power) } : h))
      );
      addLog(`${activeHero.name} merapalkan [${skill.name}]! Memulihkan +${skill.power} HP seluruh tim!`, 'action');
      showDamageNumber(`+${skill.power} HP`, 'text-green-400');
      advanceTurn();
      return;
    }

    if (skill.effectType === 'buff') {
      addLog(`${activeHero.name} mengaktifkan mantra suci [${skill.name}]!`, 'action');
      advanceTurn();
      return;
    }

    // Damage skill targets
    const targetEnemy = enemies[selectedEnemyIndex];
    if (!targetEnemy || targetEnemy.hp <= 0) return;

    const targetIndices =
      skill.target === 'all'
        ? enemies.map((e, i) => (e.hp > 0 ? i : -1)).filter(i => i !== -1)
        : [selectedEnemyIndex];

    // Trigger Spirit Cinematic Attack Animation
    setActiveSpiritAttack({
      hero: activeHero,
      spirit: effectiveSpirit,
      skill,
      isShowtime: false,
      targetIndices,
      onFinish: () => {
        if (skill.target === 'all') {
          let causedWeaknessOrCrit = false;

          setEnemies(prev => {
            const updated = prev.map(e => {
              if (e.hp <= 0) return e;
              const isWeak = e.weaknesses.includes(skill.element);
              let dmg = Math.floor((activeHero.baseAtk * 1.3) + (skill.power * 1.2) - (e.defense * 0.35));

              // Resistance check on nightmare mode
              if (!isWeak && difficulty === 'gerhana') {
                dmg = Math.floor(dmg * 0.6);
              }

              if (isWeak) {
                dmg = Math.floor(dmg * 1.65);
                causedWeaknessOrCrit = true;
              }
              dmg = Math.max(25, dmg);

              addLog(`[${skill.name}] membakar ${e.name}! (-${dmg} HP) ${isWeak ? '★ WEAK!' : ''}`, isWeak ? 'weakness' : 'action');

              return {
                ...e,
                hp: Math.max(0, e.hp - dmg),
                isDown: e.isDown || isWeak
              };
            });

            if (causedWeaknessOrCrit) {
              triggerOneMore();
            }

            checkAllOutCondition(updated);
            if (updated.every(e => e.hp <= 0)) {
              handleVictory(updated);
            }
            return updated;
          });

          advanceTurn();
        } else {
          // Single target
          const isWeak = targetEnemy.weaknesses.includes(skill.element);
          let dmg = Math.floor((activeHero.baseAtk * 1.45) + (skill.power * 1.25) - (targetEnemy.defense * 0.4));

          if (!isWeak && difficulty === 'gerhana') {
            dmg = Math.floor(dmg * 0.6);
          }

          if (isWeak) dmg = Math.floor(dmg * 1.7);
          dmg = Math.max(30, dmg);

          showDamageNumber(`-${dmg}`, isWeak ? 'text-red-500' : 'text-yellow-300', isWeak);
          addLog(`${activeHero.name} memanggil ${activeSpirit?.name} dan melancarkan [${skill.name}] pada ${targetEnemy.name}! (-${dmg} HP)`, isWeak ? 'weakness' : 'action');

          applyDamageToEnemy(selectedEnemyIndex, dmg, skill.element, false, isWeak);
        }
      }
    });
  };

  // Cast Showtime / Highlight Ultimate with Ultra-Cool Cinematic Animation
  const handleShowtime = () => {
    if (!activeSpirit || activeHero.highlightGauge < 100 || isEnemyTurn || activeSpiritAttack || showtimeCinematic) return;

    const hlSkill: Skill = activeSpirit?.highlightSkill || {
      id: 'showtime_finisher',
      name: 'Puncak Penghakiman Kosmik',
      element: effectiveSpirit.element,
      power: 280,
      spCost: 0,
      target: 'all',
      description: 'Serangan puncak gabungan manusia dan roh penjaga.'
    };

    // Deduct highlight gauge
    setHeroes(prev =>
      prev.map((h, i) => (i === activeHeroIndex ? { ...h, highlightGauge: 0 } : h))
    );

    addLog(`★ SHOWTIME DILEPASKAN! ${activeHero.name} & ${effectiveSpirit.name}: [${hlSkill.name}]!!`, 'highlight');

    setShowtimeCinematic({
      hero: activeHero,
      spirit: effectiveSpirit,
      skill: hlSkill
    });
  };

  const handleShowtimeFinish = () => {
    if (!showtimeCinematic) return;
    const { hero, spirit, skill } = showtimeCinematic;
    setShowtimeCinematic(null);

    // Awaken Tier 5 bonus (Kebangkitan Sempurna = 1.5x damage)
    const awakenMultiplier = (spirit.awakenRank ?? 1) >= 5 ? 1.5 : 1.0;

    setEnemies(prev => {
      const updated = prev.map(e => {
        if (e.hp <= 0) return e;
        const dmg = Math.floor((hero.baseAtk * 3.4 + skill.power * 1.8 - e.defense * 0.15) * awakenMultiplier);
        addLog(`LEDAKAN SHOWTIME melalap ${e.name}! (-${dmg} HP) [DOWN!]`, 'highlight');
        return {
          ...e,
          hp: Math.max(0, e.hp - dmg),
          isDown: true
        };
      });

      checkAllOutCondition(updated);
      if (updated.every(e => e.hp <= 0)) {
        handleVictory(updated);
      }
      return updated;
    });

    advanceTurn();
  };

  // Helper: Apply single target damage to enemy and check for DOWN/ONE MORE
  const applyDamageToEnemy = (
    enemyIdx: number,
    damage: number,
    element: string,
    isCrit: boolean = false,
    forcedWeak: boolean = false
  ) => {
    setEnemies(prev => {
      const target = prev[enemyIdx];
      const isWeak = forcedWeak || target.weaknesses.includes(element as any);
      const newHp = Math.max(0, target.hp - damage);
      const shouldKnockDown = (isWeak || isCrit) && !target.isDown;

      if (shouldKnockDown) {
        addLog(`★ KELEMAHAN EKSPLOITASI! ${target.name} JATUH DALAM KONDISI [DOWN]!`, 'down');
      }

      const updated = prev.map((e, idx) =>
        idx === enemyIdx ? { ...e, hp: newHp, isDown: e.isDown || shouldKnockDown } : e
      );

      if (shouldKnockDown && newHp > 0) {
        triggerOneMore();
      }

      // Check if all-out attack can now be executed
      const allOutTriggered = checkAllOutCondition(updated);

      if (updated.every(e => e.hp <= 0)) {
        handleVictory(updated);
      } else if (!shouldKnockDown && !allOutTriggered) {
        advanceTurn();
      }

      return updated;
    });
  };

  const handleVictory = (finalEnemies: EnemyGhost[]) => {
    const diffRewardMult = difficulty === 'gerhana' ? 2.2 : difficulty === 'siksaan' ? 1.5 : 1.0;
    const totalExp = Math.floor(finalEnemies.reduce((sum, e) => sum + e.dropExp, 0) * diffRewardMult);
    // User requirement: Setiap telah mengalahkan musuh hanya mendapat 20 token untuk gacha
    const totalGems = 20;

    audioService.playCritical();
    addLog(`PERTARUNGAN BERHASIL DIMENANGKAN! Memperoleh +${totalExp} EXP & +20 Token Gacha!`, 'allout');

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onBattleEnd(true, totalExp, totalGems);
    }, 2200);
  };

  const handleDefeat = () => {
    audioService.playSlash();
    addLog('SELURUH TIM TUMBANG TERENGGUT KEGELAPAN KORIDOR...', 'defeat');
    setTimeout(() => {
      onBattleEnd(false, 0, 0);
    }, 1800);
  };

  return (
    <div className="relative w-full h-[640px] bg-[#0A0A0A] border-4 border-[#FF0033] rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl select-none artistic-radial-bg">
      {/* Background with repeating red angled pattern and subtle glow */}
      <div className="absolute inset-0 artistic-pattern opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-halftone pointer-events-none opacity-25 z-0" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-t from-[#FF0033] to-transparent opacity-10 blur-3xl rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#FF0033]/20 pointer-events-none z-0" />

      {/* Floating Damage Text Overlay */}
      {floatingText && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <span
            className={`font-bebas text-4xl sm:text-6xl font-black italic tracking-wider px-4 py-1.5 bg-black/95 border-2 border-[#FF0033] skew-x-[-12deg] shadow-2xl ${floatingText.color}`}
          >
            {floatingText.text}
          </span>
        </div>
      )}

      {/* ONE MORE! Big Comic Diagonal Pop-up Banner (Artistic Flair Style) */}
      {showOneMoreBanner && (
        <div className="absolute inset-x-0 top-1/4 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative transform -rotate-3">
            <div className="absolute -inset-2 bg-white skew-x-[-15deg] shadow-2xl" />
            <div className="relative bg-[#FF0033] text-black px-14 py-3 font-black text-5xl sm:text-7xl font-sans italic tracking-tighter skew-x-[-15deg] border-4 border-black animate-shake">
              ★ 1 MORE! ★
            </div>
          </div>
        </div>
      )}

      {/* SHOWTIME / HIGHLIGHT Ultra-Cool Cinematic Cut-in */}
      {showtimeCinematic && (
        <ShowtimeCinematicAnimation
          hero={showtimeCinematic.hero}
          spirit={showtimeCinematic.spirit}
          skill={showtimeCinematic.skill}
          onFinish={handleShowtimeFinish}
        />
      )}

      {/* ALL-OUT ATTACK Full Screen Prompt */}
      {showAllOutPrompt && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center backdrop-blur-md border-4 border-[#FF0033] p-6 animate-shake">
          <div className="relative transform -rotate-2 mb-4">
            <div className="absolute -inset-2 bg-white skew-x-[-12deg]" />
            <div className="relative bg-[#FF0033] text-black font-black text-4xl sm:text-6xl tracking-widest px-8 py-2 skew-x-[-12deg] border-2 border-black shadow-2xl">
              ALL-OUT ATTACK?!
            </div>
          </div>
          <p className="text-neutral-200 text-sm max-w-md text-center mb-6 font-mono leading-relaxed">
            Seluruh arwah musuh terkapar dalam kondisi DOWN! Lancarkan serangan gabungan total untuk menghabisi mereka sekaligus!
          </p>
          <div className="flex gap-4">
            <button
              onClick={executeAllOutAttack}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bebas text-2xl px-8 py-3 rounded border-2 border-black skew-x-[-12deg] shadow-lg font-black tracking-wider transition-transform hover:scale-105 cursor-pointer"
            >
              <span className="block transform skew-x-[12deg]">EKSEKUSI SERANGAN TOTAL!</span>
            </button>
            <button
              onClick={() => {
                setShowAllOutPrompt(false);
                advanceTurn();
              }}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bebas text-xl px-6 py-3 rounded border border-neutral-600 skew-x-[-12deg] cursor-pointer"
            >
              <span className="block transform skew-x-[12deg]">LEWATKAN</span>
            </button>
          </div>
        </div>
      )}

      {/* ALL-OUT ATTACK Full Screen Cinematic Finisher */}
      {isExecutingAllOut && (
        <AllOutAttackAnimation
          heroes={heroes}
          leadHero={activeHero}
          onFinish={handleAllOutFinish}
        />
      )}

      {/* Active Spirit Attack Cinematic Animation Overlay */}
      {activeSpiritAttack && (
        <SpiritAttackAnimation
          hero={activeSpiritAttack.hero}
          heroName={activeSpiritAttack.hero?.name || activeHero.name}
          spirit={activeSpiritAttack.spirit || effectiveSpirit}
          skill={activeSpiritAttack.skill}
          isShowtime={activeSpiritAttack.isShowtime}
          onComplete={() => {
            const finishCb = activeSpiritAttack.onFinish;
            setActiveSpiritAttack(null);
            if (finishCb) finishCb();
          }}
        />
      )}

      {/* TOP: ENEMY ROW */}
      <div className="relative z-10 pt-4 px-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-[#FF0033] text-black font-black px-3 py-0.5 text-xs tracking-wider skew-x-[-12deg] uppercase italic">
              GHOST TARGET
            </span>

            {/* Arena Difficulty Selector Bar */}
            <div className="flex items-center gap-1 bg-black/80 px-2 py-0.5 border border-neutral-700 skew-x-[-8deg]">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase transform skew-x-[8deg] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-[#FF0033]" /> ARENA:
              </span>
              <button
                type="button"
                onClick={() => handleDifficultyChange('standar')}
                className={`text-[10px] font-mono font-black px-2 py-0.5 transform skew-x-[8deg] transition-all cursor-pointer ${
                  difficulty === 'standar' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tingkat musuh normal"
              >
                STANDAR
              </button>
              <button
                type="button"
                onClick={() => handleDifficultyChange('siksaan')}
                className={`text-[10px] font-mono font-black px-2 py-0.5 transform skew-x-[8deg] transition-all cursor-pointer ${
                  difficulty === 'siksaan' ? 'bg-[#FF0033] text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
                title="Musuh +30% ATK, kabut menyerap 5 SP, EXP x1.5"
              >
                SIKSAAN (+30% DMG)
              </button>
              <button
                type="button"
                onClick={() => handleDifficultyChange('gerhana')}
                className={`text-[10px] font-mono font-black px-2 py-0.5 transform skew-x-[8deg] transition-all cursor-pointer ${
                  difficulty === 'gerhana' ? 'bg-purple-600 text-white animate-pulse shadow-lg' : 'text-neutral-400 hover:text-purple-300'
                }`}
                title="Musuh +60% ATK, bos serang 2x, resistensi non-weak, EXP x2.2"
              >
                GERHANA (NIGHTMARE)
              </button>
            </div>
          </div>

          {onEscape && (
            <button
              onClick={onEscape}
              className="text-xs text-neutral-300 hover:text-white px-3 py-1 bg-[#141418] border border-neutral-700 hover:border-[#FF0033] skew-x-[-10deg] font-mono cursor-pointer"
            >
              <span className="block transform skew-x-[10deg]">KABUR DARI KORIDOR</span>
            </button>
          )}
        </div>

        {/* Enemies list */}
        <div className="flex items-center justify-center gap-4 flex-wrap relative">
          {/* Cinematic Enemy Attack Overlay */}
          {enemyAttackVfx && (
            <div className="absolute inset-0 z-35 flex flex-col items-center justify-center pointer-events-none animate-shake">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[120%] h-4 bg-gradient-to-r from-transparent via-purple-600 to-transparent transform -rotate-25 shadow-[0_0_35px_#9333ea] animate-elemental-slash" />
                <div className="w-[120%] h-6 bg-gradient-to-r from-transparent via-red-600 to-transparent transform rotate-20 shadow-[0_0_40px_#dc2626] animate-elemental-slash" />
              </div>
              <div className="relative z-10 transform -rotate-2">
                <div className="bg-black/95 border-2 border-red-600 px-6 py-2.5 skew-x-[-10deg] shadow-[0_0_30px_#dc2626] flex items-center gap-3">
                  <Skull className="w-6 h-6 text-red-500 animate-pulse transform skew-x-[10deg]" />
                  <div className="transform skew-x-[10deg] text-left">
                    <div className="font-mono text-[10px] text-red-400 font-bold uppercase tracking-widest">
                      SERANGAN GHAIB: {enemyAttackVfx.enemyName}
                    </div>
                    <div className="font-bebas text-2xl sm:text-3xl text-yellow-300 font-black italic tracking-wide">
                      {enemyAttackVfx.skillName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {enemies.map((enemy, idx) => {
            const isSelected = selectedEnemyIndex === idx;
            const isDefeated = enemy.hp <= 0;
            const isHit = activeSpiritAttack?.targetIndices.includes(idx);
            const isRaging = enemy.isBoss && enemy.hp > 0 && enemy.hp < (enemy.maxHp * 0.5);
            const isPlayerHit = playerAttackVfx?.enemyIndex === idx;

            return (
              <div
                key={enemy.id}
                onClick={() => !isDefeated && setSelectedEnemyIndex(idx)}
                className={`cursor-pointer transition-all duration-200 p-2.5 rounded-lg border-2 relative overflow-hidden ${
                  isDefeated
                    ? 'opacity-30 border-neutral-800 grayscale'
                    : isSelected
                    ? 'border-white bg-[#1A0B0F] scale-105 shadow-xl shadow-[#FF0033]/30 ring-2 ring-[#FF0033]'
                    : 'border-neutral-800 bg-[#121217]/80 hover:border-[#FF0033]'
                } ${isHit || isPlayerHit ? 'ring-4 ring-yellow-400 animate-heavy-shake' : ''}`}
              >
                {/* Dynamic Player Attack Impact VFX */}
                {isPlayerHit && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none overflow-hidden rounded-lg bg-red-950/40">
                    {playerAttackVfx.type === 'melee' ? (
                      <div className="relative w-full h-full flex items-center justify-center animate-shake">
                        <div className="absolute w-[140%] h-3 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 shadow-[0_0_20px_#ff0033] animate-elemental-slash" />
                        <div className="absolute w-[140%] h-4 bg-gradient-to-r from-transparent via-red-500 to-transparent transform rotate-35 shadow-[0_0_30px_#ff0033] animate-elemental-slash" />
                        <span className="font-bebas text-2xl font-black italic tracking-wider text-yellow-300 bg-red-600 border border-white px-2 py-0.5 skew-x-[-12deg] shadow-lg animate-bounce">
                          {playerAttackVfx.isCrit ? 'CRITICAL SLASH!!' : 'SLASH!!'}
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center animate-shake">
                        <div className="absolute w-14 h-14 rounded-full border-2 border-dashed border-sky-400 animate-spin" />
                        <div className="absolute w-2 h-10 bg-sky-300 shadow-[0_0_15px_#38bdf8]" />
                        <div className="absolute w-10 h-2 bg-sky-300 shadow-[0_0_15px_#38bdf8]" />
                        <span className="font-bebas text-2xl font-black italic tracking-wider text-black bg-sky-300 border border-white px-2 py-0.5 skew-x-[-12deg] shadow-lg animate-pulse">
                          BANG-BANG!!
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <EnemyAvatar
                    type={enemy.avatarType}
                    isDown={enemy.isDown}
                    isHit={isHit}
                    isRaging={isRaging}
                    size="md"
                  />

                  <div className="w-40 sm:w-48 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-bebas text-base text-white font-bold tracking-wide truncate">
                        {enemy.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {isRaging && (
                          <span className="bg-red-600 text-white text-[9px] px-1 font-black rounded animate-pulse">
                            RAGE!
                          </span>
                        )}
                        {enemy.isBoss && (
                          <span className="bg-[#FF0033] text-black text-[10px] px-1.5 font-black rounded skew-x-[-8deg]">
                            BOSS
                          </span>
                        )}
                      </div>
                    </div>

                    {/* HP Bar */}
                    <div className="w-full bg-neutral-900 h-2.5 rounded-full border border-neutral-700 overflow-hidden my-1">
                      <div
                        className="h-full bg-[#FF0033] transition-all duration-300"
                        style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
                      />
                    </div>

                    <div className="text-[11px] font-mono text-neutral-400 flex justify-between">
                      <span>HP: {enemy.hp}/{enemy.maxHp}</span>
                      {enemy.isDown && <span className="text-[#FF0033] font-black italic">DOWN</span>}
                    </div>

                    {/* Weaknesses tags */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">WEAK:</span>
                      {enemy.weaknesses.map(w => (
                        <ElementBadge key={w} element={w} size="sm" showName={false} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MIDDLE: BATTLE LOG TICKER */}
      <div className="relative z-10 px-6 py-2">
        <div className="bg-black/90 border-l-4 border-[#FF0033] px-3.5 py-2 max-h-16 overflow-y-auto font-mono text-xs text-neutral-300 flex flex-col-reverse gap-0.5 shadow-lg">
          {battleLogs.slice(0, 3).map(log => (
            <div
              key={log.id}
              className={`leading-tight ${
                log.type === 'weakness'
                  ? 'text-[#FF0033] font-black'
                  : log.type === 'onemore'
                  ? 'text-yellow-300 font-black'
                  : log.type === 'allout'
                  ? 'text-yellow-400 font-black'
                  : log.type === 'highlight'
                  ? 'text-purple-300 font-bold'
                  : 'text-neutral-300'
              }`}
            >
              {log.text}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM: PARTY HUD & P5 COMMAND WHEEL (Artistic Flair Layout) */}
      <div className="relative z-10 bg-[#0A0A0A]/95 border-t-4 border-[#FF0033] px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        {/* Heroes Status Cards */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1">
          {heroes.map((hero, idx) => {
            const isActive = activeHeroIndex === idx && !isEnemyTurn;
            const isFainted = hero.hp <= 0;

            return (
              <div
                key={hero.id}
                className={`relative transition-all p-2.5 rounded-lg border-2 min-w-[175px] ${
                  isFainted
                    ? 'border-neutral-800 bg-[#0D0D11]/60 opacity-40'
                    : isActive
                    ? 'border-[#FF0033] border-r-8 bg-[#151116] p5-shadow-red -translate-y-1'
                    : 'border-neutral-800 bg-[#121217]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AnimePortrait characterId={hero.id} emotion={hero.isDown ? 'fear' : 'determined'} size="sm" />
                  <div className="overflow-hidden">
                    <div className="font-bebas text-base font-bold text-white tracking-wide truncate">
                      {hero.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">
                      {hero.alias}
                    </div>
                  </div>
                </div>

                {/* HP & SP */}
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-[#FF0033] font-bold">
                    <span>HP</span>
                    <span>{hero.hp}/{hero.maxHp}</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-[#FF0033] h-full transition-all"
                      style={{ width: `${(hero.hp / hero.maxHp) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-blue-400 font-bold">
                    <span>SOUL SYNC</span>
                    <span>{hero.sp}/{hero.maxSp}</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] h-full transition-all"
                      style={{ width: `${(hero.sp / hero.maxSp) * 100}%` }}
                    />
                  </div>

                  {/* Highlight Gauge */}
                  <div className="flex items-center justify-between text-yellow-400 text-[10px] font-bold">
                    <span>SHOWTIME</span>
                    <span>{hero.highlightGauge}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-yellow-400 h-full transition-all"
                      style={{ width: `${hero.highlightGauge}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Persona 5 Style Command Wheel (Artistic Flair Themed) */}
        <div className="w-full md:w-auto flex-1 max-w-lg">
          {menuMode === 'main' ? (
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
              {/* Artistic Flair Primary Attack Button */}
              <button
                disabled={isEnemyTurn}
                onClick={handlePhysicalAttack}
                className="relative transform -rotate-3 group cursor-pointer disabled:opacity-40"
              >
                <div className="absolute -inset-1.5 bg-white skew-x-[-12deg] transition-all group-hover:scale-105" />
                <div className="relative bg-[#FF0033] px-5 py-2 skew-x-[-12deg] shadow-2xl border border-black">
                  <span className="block transform skew-x-[12deg] text-lg font-black text-white italic tracking-tighter flex items-center gap-1.5">
                    <Sword className="w-4 h-4" />
                    <span>ATTACK</span>
                  </span>
                </div>
              </button>

              {/* Artistic Flair Persona / Spirit Skills Button */}
              <button
                disabled={isEnemyTurn}
                onClick={() => setMenuMode('skills')}
                className="relative transform rotate-2 cursor-pointer group disabled:opacity-40"
              >
                <div className="absolute -inset-1 bg-white skew-x-[-10deg] opacity-80 group-hover:opacity-100 transition-all" />
                <div className="relative bg-[#111] border-2 border-white px-4 py-2 skew-x-[-10deg]">
                  <span className="block transform skew-x-[10deg] text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#FF0033]" />
                    <span>{activeSpirit?.name.split(' ')[0] || 'SKILL'}</span>
                  </span>
                </div>
              </button>

              {/* Gun / Jimat Peluru */}
              <button
                disabled={isEnemyTurn || activeHero.gunBullets <= 0}
                onClick={handleGunAttack}
                className="relative transform -rotate-1 cursor-pointer disabled:opacity-40"
              >
                <div className="bg-[#141418] border border-neutral-700 hover:border-[#FF0033] px-3.5 py-2 skew-x-[8deg]">
                  <span className="block transform skew-x-[-8deg] text-sm font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Crosshair className="w-4 h-4 text-blue-400" />
                    <span>JIMAT ({activeHero.gunBullets})</span>
                  </span>
                </div>
              </button>

              {/* Guard */}
              <button
                disabled={isEnemyTurn}
                onClick={handleGuard}
                className="relative transform rotate-3 cursor-pointer disabled:opacity-40"
              >
                <div className="bg-[#141418] border border-neutral-700 hover:border-[#FF0033] px-3.5 py-2 skew-x-[-10deg]">
                  <span className="block transform skew-x-[10deg] text-sm font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-1">
                    <Shield className="w-4 h-4 text-neutral-400" />
                    <span>GUARD</span>
                  </span>
                </div>
              </button>

              {/* Spirit Shift (Ganti Roh) */}
              <button
                disabled={isEnemyTurn}
                onClick={() => setMenuMode('spirits')}
                className="relative transform -rotate-1 cursor-pointer group disabled:opacity-40"
                title="Ganti Roh Pendamping (Persona Shift)"
              >
                <div className="bg-[#18121f] border-2 border-purple-500 hover:border-white px-3.5 py-2 skew-x-[-8deg] shadow-lg transition-colors">
                  <span className="block transform skew-x-[8deg] text-sm font-bold text-purple-300 group-hover:text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                    <span>GANTI ROH</span>
                  </span>
                </div>
              </button>

              {/* SHOWTIME / HIGHLIGHT BUTTON */}
              {activeHero.highlightGauge >= 100 && (
                <button
                  disabled={isEnemyTurn}
                  onClick={handleShowtime}
                  className="relative transform -rotate-2 cursor-pointer animate-pulse"
                >
                  <div className="absolute -inset-1 bg-yellow-300 skew-x-[-12deg]" />
                  <div className="relative bg-[#FF0033] border-2 border-yellow-300 px-4 py-2 skew-x-[-12deg]">
                    <span className="block transform skew-x-[12deg] text-base font-black text-yellow-300 italic tracking-wider flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      <span>SHOWTIME!</span>
                    </span>
                  </div>
                </button>
              )}

              {/* Baton Pass */}
              <div className="flex items-center gap-1">
                {heroes.map((h, idx) => {
                  if (idx === activeHeroIndex || h.hp <= 0) return null;
                  return (
                    <button
                      key={h.id}
                      onClick={() => handleBatonPass(idx)}
                      className="text-[11px] font-mono font-bold px-2 py-1 bg-[#1A1A22] border border-white text-white hover:bg-[#FF0033] hover:text-black skew-x-[-10deg] cursor-pointer transition-colors"
                      title={`Baton Pass ke ${h.name}`}
                    >
                      <span className="block transform skew-x-[10deg]">BATON &gt; {h.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : menuMode === 'skills' ? (
            /* Sub-Menu: Spirit Skills Selection (Artistic Flair Themed) */
            <div className="bg-[#121217] border-2 border-[#FF0033] rounded-lg p-3 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bebas text-base text-[#FF0033] tracking-wider flex items-center gap-1.5 font-bold">
                  <Flame className="w-4 h-4 text-[#FF0033]" />
                  JURUS ROH PENDAMPING: {activeSpirit?.name}
                </span>
                <button
                  onClick={() => setMenuMode('main')}
                  className="text-xs text-neutral-300 hover:text-white font-mono px-2.5 py-1 bg-[#1A1A22] border border-neutral-700 skew-x-[-8deg] cursor-pointer"
                >
                  <span className="block transform skew-x-[8deg]">&larr; KEMBALI</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {activeSpirit?.skills.map(skill => {
                  const cannotAfford =
                    (skill.spCost > 0 && activeHero.sp < skill.spCost) ||
                    (skill.hpCost && activeHero.hp <= skill.hpCost);

                  return (
                    <button
                      key={skill.id}
                      disabled={cannotAfford}
                      onClick={() => handleCastSkill(skill)}
                      className={`text-left p-2 rounded border transition-all cursor-pointer ${
                        cannotAfford
                          ? 'border-neutral-800 bg-neutral-950/60 opacity-40 cursor-not-allowed'
                          : 'border-neutral-700 bg-black/80 hover:border-[#FF0033] hover:bg-[#1A0B0F]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bebas text-base text-white tracking-wide truncate">
                          {skill.name}
                        </span>
                        <ElementBadge element={skill.element} size="sm" showName={false} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono mt-0.5 text-neutral-400">
                        <span>Pwr: {skill.power}</span>
                        <span className={skill.spCost > 0 ? 'text-blue-400 font-bold' : 'text-[#FF0033] font-bold'}>
                          {skill.spCost > 0 ? `${skill.spCost} SP` : `${skill.hpCost} HP`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Sub-Menu: Spirit Shift Selection */
            <div className="bg-[#121217] border-2 border-purple-500 rounded-lg p-3 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bebas text-base text-purple-400 tracking-wider flex items-center gap-1.5 font-bold">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  PERGANTIAN ROH (PERSONA SHIFT): {activeHero.name}
                </span>
                <button
                  onClick={() => setMenuMode('main')}
                  className="text-xs text-neutral-300 hover:text-white font-mono px-2.5 py-1 bg-[#1A1A22] border border-neutral-700 skew-x-[-8deg] cursor-pointer"
                >
                  <span className="block transform skew-x-[8deg]">&larr; BATAL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {Array.from(
                  new Map(
                    [...(activeHero.spirits || []), ...ownedSpirits, ...INITIAL_SPIRITS].map(s => [s.id, s])
                  ).values()
                ).map(spirit => {
                  const isActive = spirit.id === effectiveSpirit.id;
                  return (
                    <button
                      key={spirit.id}
                      disabled={isActive}
                      onClick={() => handleSpiritShift(spirit)}
                      className={`text-left p-2 rounded border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isActive
                          ? 'border-green-500/80 bg-green-950/30 opacity-80 cursor-default'
                          : 'border-purple-500/40 bg-black/80 hover:border-purple-400 hover:bg-[#1f132a]'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded border border-neutral-700 overflow-hidden flex-shrink-0 bg-neutral-900 flex items-center justify-center text-sm">
                          {spirit.avatarUrl ? (
                            <img
                              src={spirit.avatarUrl}
                              alt={spirit.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span>
                              {spirit.element === 'Agni' ? '🔥' : spirit.element === 'Tirta' ? '❄️' : spirit.element === 'Vidyut' ? '⚡' : spirit.element === 'Bayu' ? '🌪️' : spirit.element === 'Nur' ? '✨' : '🔮'}
                            </span>
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-bebas text-sm text-white truncate flex items-center gap-1.5">
                            <span className="truncate">{spirit.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400">({spirit.rarity})</span>
                            <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center">
                              ★{spirit.awakenRank ?? 1}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-neutral-400 truncate">
                            +{spirit.bonusAtk} ATK | +{spirit.bonusHp} HP
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <ElementBadge element={spirit.element} size="sm" showName={false} />
                        {isActive ? (
                          <span className="text-[9px] font-mono font-bold text-green-400 mt-1">AKTIF</span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-purple-300 mt-1">GANTI &rarr;</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SPIRIT SHIFT ANIMATION OVERLAY IN COMBAT */}
      {shiftAnimData && (
        <SpiritShiftAnimation
          hero={shiftAnimData.hero}
          previousSpirit={shiftAnimData.previousSpirit}
          newSpirit={shiftAnimData.newSpirit}
          onComplete={() => setShiftAnimData(null)}
        />
      )}
    </div>
  );
};
