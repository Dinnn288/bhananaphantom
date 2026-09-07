import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Hero } from '../types';
import { AnimePortrait } from './AnimePortrait';
import { audioService } from '../services/audioService';
import { Zap, Sparkles, Sword, FastForward } from 'lucide-react';

interface AllOutAttackAnimationProps {
  heroes: Hero[];
  leadHero?: Hero;
  onFinish: () => void;
}

type AnimationPhase = 'cutin' | 'brawl' | 'shatter' | 'finisher';

interface ComicTag {
  id: number;
  text: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  bg: string;
}

export const AllOutAttackAnimation: React.FC<AllOutAttackAnimationProps> = ({
  heroes,
  leadHero,
  onFinish
}) => {
  const [phase, setPhase] = useState<AnimationPhase>('cutin');
  const [hitCount, setHitCount] = useState<number>(1);
  const [comicTags, setComicTags] = useState<ComicTag[]>([]);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const activeLeader = leadHero || heroes[0] || {
    id: 'renald',
    name: 'Renald Suryakusuma',
    alias: 'The Shadow Seeker'
  };

  // Skip animation handler
  const handleSkip = () => {
    if (onFinishRef.current) {
      onFinishRef.current();
    }
  };

  // Keyboard shortcut (Escape or Space to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Master Phase Controller
  useEffect(() => {
    // Initial sound
    audioService.playCritical();

    // Phase 0 -> Phase 1: Brawl Cloud (at 1.2s)
    const t1 = setTimeout(() => {
      setPhase('brawl');
      audioService.playAllOutAttack();
    }, 1200);

    // Phase 1 -> Phase 2: Dimension Shatter (at 3.1s)
    const t2 = setTimeout(() => {
      setPhase('shatter');
      audioService.playAllOutShatter();
    }, 3100);

    // Phase 2 -> Phase 3: Finisher Victory Splash (at 3.6s)
    const t3 = setTimeout(() => {
      setPhase('finisher');
      audioService.playAllOutFinisherFanfare();

      try {
        confetti({
          particleCount: 130,
          spread: 100,
          origin: { y: 0.55 },
          colors: ['#FF0033', '#FFFFFF', '#FFD166', '#0A0A0A']
        });
      } catch (err) {
        console.warn('All-Out confetti triggered safely:', err);
      }
    }, 3600);

    // End animation and callback (at 5.4s)
    const t4 = setTimeout(() => {
      if (onFinishRef.current) {
        onFinishRef.current();
      }
    }, 5400);

    // Hard fallback safety timer (5.8s) in case anything hangs
    const safetyTimer = setTimeout(() => {
      if (onFinishRef.current) {
        onFinishRef.current();
      }
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(safetyTimer);
    };
  }, []);

  // Brawl Phase: Rapid hit counter & spawning comic words
  useEffect(() => {
    if (phase !== 'brawl') return;

    const words = [
      'TEBAS!!',
      'DUARRR!!',
      'BAM!!',
      'CRUSH!!',
      'SABAT!!',
      'POW!!',
      'SLASH!!',
      'HANTAM!!',
      'KABUUR!!',
      'CLEAVE!!'
    ];
    const colors = ['#FFD166', '#00F5D4', '#FF0033', '#FFFFFF'];
    const backgrounds = ['#0A0A0A', '#1A1A1A', '#FF0033', '#000000'];

    // Rapid hits interval
    const hitInterval = setInterval(() => {
      setHitCount(prev => Math.min(52, prev + Math.floor(Math.random() * 4 + 2)));

      // Add a randomized comic word
      const newTag: ComicTag = {
        id: Date.now() + Math.random(),
        text: words[Math.floor(Math.random() * words.length)],
        x: Math.floor(Math.random() * 65 + 15),
        y: Math.floor(Math.random() * 60 + 20),
        rotation: Math.floor(Math.random() * 36 - 18),
        color: colors[Math.floor(Math.random() * colors.length)],
        bg: backgrounds[Math.floor(Math.random() * backgrounds.length)]
      };

      setComicTags(prev => [...prev.slice(-6), newTag]);
    }, 130);

    return () => clearInterval(hitInterval);
  }, [phase]);

  return (
    <div
      id="allout-attack-cinematic"
      className="absolute inset-0 z-50 overflow-hidden select-none bg-black flex flex-col justify-between"
    >
      {/* Halftone pop-art background dots */}
      <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none z-0" />

      {/* Top right Skip Button */}
      <button
        id="allout-skip-button"
        onClick={handleSkip}
        className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-black/85 hover:bg-[#FF0033] text-white border-2 border-white skew-x-[-12deg] shadow-lg text-xs font-mono font-bold tracking-wider cursor-pointer transition-all hover:scale-105 active:scale-95"
      >
        <span className="block transform skew-x-[12deg] flex items-center gap-1">
          LEWATI <FastForward className="w-3.5 h-3.5" />
        </span>
      </button>

      {/* ============================================================
          PHASE 0: CUT-IN DASH (0.0s - 1.2s)
          Dramatic diagonal hero panels sliding across with battle quotes
         ============================================================ */}
      {phase === 'cutin' && (
        <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-[#FF0033]">
          {/* Black diagonal background bands */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0A0A0A_25%,#FF0033_25%,#FF0033_50%,#0A0A0A_50%,#0A0A0A_75%,#FF0033_75%)] bg-[length:60px_60px] opacity-25" />

          {/* Top Dramatic Banner */}
          <div className="absolute top-6 left-0 right-0 flex justify-center z-20">
            <div className="bg-black text-white px-8 py-2 skew-x-[-15deg] border-4 border-white shadow-2xl animate-shake">
              <span className="font-bebas text-3xl sm:text-5xl text-yellow-300 italic tracking-wider flex items-center gap-3">
                ★ KESEMPATAN SERANGAN TOTAL! ★
              </span>
            </div>
          </div>

          {/* Triple Slanted Hero Cut-ins */}
          <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col gap-3 sm:gap-4 my-auto">
            {/* Renald Cut-in (Red Flame Trail) */}
            <div className="relative flex items-center bg-gradient-to-r from-red-950 via-black to-red-900 border-y-4 border-red-600 p-2 skew-x-[-12deg] shadow-2xl transform translate-x-[-2%] animate-spirit-slide">
              <div className="transform skew-x-[12deg] flex-shrink-0 ml-2">
                <AnimePortrait characterId="renald" emotion="determined" size="md" isCutin />
              </div>
              <div className="ml-4 transform skew-x-[12deg] flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-bebas text-xs sm:text-sm px-2 py-0.5 font-black">
                    RENALD // SHADOW
                  </span>
                  <Sword className="w-4 h-4 text-red-400" />
                </div>
                <p className="font-bebas text-2xl sm:text-4xl text-yellow-300 italic tracking-tight drop-shadow-[2px_2px_0_#000]">
                  "WAKTUNYA EKSEKUSI! TAK ADA JALAN KELUAR!!"
                </p>
              </div>
            </div>

            {/* Maya Cut-in (Cyan Frost Trail) */}
            <div
              className="relative flex items-center bg-gradient-to-r from-cyan-950 via-black to-blue-950 border-y-4 border-cyan-400 p-2 skew-x-[-12deg] shadow-2xl transform translate-x-[2%] animate-spirit-slide"
              style={{ animationDelay: '0.12s' }}
            >
              <div className="transform skew-x-[12deg] flex-shrink-0 ml-2">
                <AnimePortrait characterId="maya" emotion="determined" size="md" isCutin />
              </div>
              <div className="ml-4 transform skew-x-[12deg] flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-500 text-black font-bebas text-xs sm:text-sm px-2 py-0.5 font-black">
                    MAYA // FROST
                  </span>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                <p className="font-bebas text-2xl sm:text-4xl text-cyan-200 italic tracking-tight drop-shadow-[2px_2px_0_#000]">
                  "SEMUA TITIK LEMAH TERKUNCI! HANTAM SEKALIGUS!"
                </p>
              </div>
            </div>

            {/* Bagas Cut-in (Electric Gold Trail) */}
            <div
              className="relative flex items-center bg-gradient-to-r from-amber-950 via-black to-yellow-950 border-y-4 border-yellow-400 p-2 skew-x-[-12deg] shadow-2xl transform translate-x-[-1%] animate-spirit-slide"
              style={{ animationDelay: '0.24s' }}
            >
              <div className="transform skew-x-[12deg] flex-shrink-0 ml-2">
                <AnimePortrait characterId="bagas" emotion="determined" size="md" isCutin />
              </div>
              <div className="ml-4 transform skew-x-[12deg] flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-400 text-black font-bebas text-xs sm:text-sm px-2 py-0.5 font-black">
                    BAGAS // THUNDER
                  </span>
                  <Zap className="w-4 h-4 text-yellow-300" />
                </div>
                <p className="font-bebas text-2xl sm:text-4xl text-amber-300 italic tracking-tight drop-shadow-[2px_2px_0_#000]">
                  "JANGAN KASIH KENDOR! RATAKAN DENGAN PETIR!!"
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="absolute bottom-4 z-20 animate-pulse">
            <span className="font-mono text-xs sm:text-sm text-black bg-white px-4 py-1 font-black skew-x-[-12deg] border-2 border-black tracking-widest uppercase">
              TRIO BHAWANA PHANTOM // ALL-OUT INITIATION
            </span>
          </div>
        </div>
      )}

      {/* ============================================================
          PHASE 1: THE COMIC BRAWL CLOUD & RAPID HITS (1.2s - 3.1s)
          Classic comic dust-cloud tornado with bouncing starbursts & words
         ============================================================ */}
      {phase === 'brawl' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden">
          {/* Pulsing red radial backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF0033_0%,#4A000E_50%,#0A0A0A_95%)] opacity-85" />
          <div className="absolute inset-0 bg-halftone opacity-35 pointer-events-none" />

          {/* Live Hit Counter Banner (Top Left) */}
          <div className="absolute top-6 left-6 z-30 transform -rotate-6 animate-shake">
            <div className="bg-yellow-400 text-black px-4 py-2 border-4 border-black skew-x-[-15deg] shadow-[5px_5px_0_#000]">
              <div className="font-bebas text-4xl sm:text-6xl font-black italic tracking-tighter leading-none">
                {hitCount} <span className="text-2xl sm:text-3xl text-red-600">HITS!!</span>
              </div>
              <div className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold text-neutral-900">
                MASSIVE BEATDOWN COMBO
              </div>
            </div>
          </div>

          {/* Center: Comic Dust Cloud Sphere SVG & Animations */}
          <div className="relative z-10 w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center animate-shake">
            {/* Outer Dust Puffs */}
            <div className="absolute inset-0 rounded-full border-8 border-dashed border-white/60 animate-spin-slow opacity-80" />
            <div className="absolute -inset-4 rounded-full border-4 border-dashed border-yellow-300/70 animate-reverse-spin opacity-70" />

            {/* Swirling Smoke Silhouette SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_35px_#FF0033]">
              <circle cx="100" cy="100" r="85" fill="#18181b" stroke="#ffffff" strokeWidth="4" />
              <circle cx="80" cy="80" r="40" fill="#27272a" />
              <circle cx="125" cy="85" r="35" fill="#3f3f46" />
              <circle cx="95" cy="130" r="45" fill="#27272a" />
              <circle cx="130" cy="125" r="30" fill="#52525b" />

              {/* Action Starburst Points */}
              <polygon
                points="100,10 115,70 175,45 130,95 185,130 125,145 145,195 100,160 55,195 75,145 15,130 70,95 25,45 85,70"
                fill="#FF0033"
                opacity="0.8"
              />
              <polygon
                points="100,25 112,75 160,55 125,95 170,125 120,135 135,175 100,145 65,175 80,135 30,125 75,95 40,55 88,75"
                fill="#FFD166"
                opacity="0.9"
              />
            </svg>

            {/* Criss-Cross Elemental Slash VFX */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[140%] h-4 bg-gradient-to-r from-transparent via-red-500 to-transparent transform rotate-45 animate-elemental-slash shadow-[0_0_25px_#FF0033]" />
              <div
                className="w-[140%] h-4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transform -rotate-45 animate-elemental-slash shadow-[0_0_25px_#00F5D4]"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-[140%] h-5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent transform rotate-15 animate-elemental-slash shadow-[0_0_25px_#FFD166]"
                style={{ animationDelay: '0.2s' }}
              />
            </div>

            {/* Center Dynamic Comic SFX */}
            <div className="absolute z-20 text-center animate-heavy-shake">
              <span className="font-bebas text-5xl sm:text-7xl text-white font-black italic tracking-tighter drop-shadow-[0_0_30px_#000000]">
                DUARRR!!
              </span>
            </div>
          </div>

          {/* Floating Popping Comic Words */}
          {comicTags.map(tag => (
            <div
              key={tag.id}
              className="absolute z-20 pointer-events-none animate-bounce"
              style={{
                left: `${tag.x}%`,
                top: `${tag.y}%`,
                transform: `rotate(${tag.rotation}deg)`
              }}
            >
              <div
                className="px-3 py-1 font-bebas text-2xl sm:text-4xl font-black italic skew-x-[-15deg] border-2 border-black shadow-[4px_4px_0_#000]"
                style={{ backgroundColor: tag.bg, color: tag.color }}
              >
                {tag.text}
              </div>
            </div>
          ))}

          {/* Bottom Dramatic Action Bar */}
          <div className="absolute bottom-4 z-20 bg-black/90 border-t-4 border-[#FF0033] px-6 py-2 skew-x-[-12deg] shadow-xl">
            <span className="font-mono text-xs sm:text-sm text-yellow-300 font-bold uppercase tracking-widest">
              ★ KOMBINASI TRIO PENGUSIR ROH SEDANG MEMBABAT HABIS MEDAN GHAIB! ★
            </span>
          </div>
        </div>
      )}

      {/* ============================================================
          PHASE 2: DIMENSION SHATTER (3.1s - 3.6s)
          Sudden glass shatter / dimension crack with comic shock silhouettes
         ============================================================ */}
      {phase === 'shatter' && (
        <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden animate-shake">
          {/* Inverted Black/Red Shock BG */}
          <div className="absolute inset-0 bg-red-600 animate-pulse" />

          {/* Glass Fracture SVG Overlay */}
          <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full">
            <line x1="400" y1="300" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="8" />
            <line x1="400" y1="300" x2="800" y2="50" stroke="#FFFFFF" strokeWidth="10" />
            <line x1="400" y1="300" x2="800" y2="600" stroke="#FFFFFF" strokeWidth="8" />
            <line x1="400" y1="300" x2="100" y2="600" stroke="#FFFFFF" strokeWidth="9" />
            <line x1="400" y1="300" x2="0" y2="350" stroke="#FFFFFF" strokeWidth="7" />
            <line x1="400" y1="300" x2="450" y2="0" stroke="#FFFFFF" strokeWidth="9" />

            {/* Inner fracture spiderweb */}
            <polygon points="400,240 450,290 420,360 350,330 360,260" fill="none" stroke="#FFFFFF" strokeWidth="5" />
            <polygon points="400,200 490,280 440,400 320,350 330,230" fill="none" stroke="#FFD166" strokeWidth="4" />
          </svg>

          {/* Comic Impact Text */}
          <div className="relative z-30 transform -rotate-3 text-center">
            <div className="bg-black text-white px-10 py-4 skew-x-[-15deg] border-6 border-white shadow-[8px_8px_0_#FF0033]">
              <span className="font-bebas text-6xl sm:text-8xl text-yellow-300 italic tracking-tighter drop-shadow-[0_0_35px_#000]">
                DIMENSI HANCUR!!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          PHASE 3: THE ICONIC PERSONA 5 VICTORY FINISHER SPLASH (3.6s - 5.4s)
          Ultra-stylish monochrome/crimson silhouette pose & slanted typography
         ============================================================ */}
      {phase === 'finisher' && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FF0033] p-6 sm:p-8 animate-shake">
          {/* Black Geometric Slanted Accents */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-black transform skew-x-[-18deg] translate-x-24 z-0 shadow-2xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-neutral-900 transform skew-x-[-18deg] -translate-x-12 z-0 opacity-70" />

          {/* Manga Halftone Screen Tone */}
          <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none z-0" />

          {/* Top Classification Stamp */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="bg-black text-white px-4 py-1.5 skew-x-[-15deg] border-2 border-white shadow-lg">
              <span className="font-mono text-xs sm:text-sm text-yellow-300 font-black tracking-widest uppercase">
                ★ KASUS DOKUMEN GHAIB // DIHAPUSKAN ★
              </span>
            </div>
            <div className="hidden sm:block font-bebas text-xl text-black tracking-wider bg-white px-3 py-1 skew-x-[-12deg] font-bold">
              BHAWANA PHANTOM // ALL-OUT FINISH
            </div>
          </div>

          {/* Center Stage: Stylized Hero Silhouette & Bold Typography */}
          <div className="relative z-20 flex-1 flex flex-col sm:flex-row items-center justify-between my-auto gap-6 max-w-5xl mx-auto w-full">
            {/* Left: Lead Character Silhouette & Portrait Badge */}
            <div className="flex flex-col items-center sm:items-start">
              {/* Stylish Character Victory Silhouette SVG */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Red Circular Crest Halo behind Hero */}
                <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-8 border-dashed border-white opacity-40 animate-spin-slow" />
                <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-red-600/50 blur-xl animate-pulse" />

                {/* SVG Silhouette of Stylish Persona Protagonist */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_#000000]">
                  {/* Long trench coat fluttering */}
                  <path
                    d="M 60 190 L 40 130 Q 55 90 75 80 L 125 80 Q 145 90 160 130 L 140 190 Q 100 170 60 190 Z"
                    fill="#000000"
                  />
                  {/* Katana sheathed across shoulder */}
                  <line x1="20" y1="180" x2="175" y2="40" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                  <line x1="170" y1="45" x2="190" y2="30" stroke="#FFD166" strokeWidth="8" strokeLinecap="square" />
                  {/* Torso & Uniform */}
                  <polygon points="75,80 125,80 115,140 85,140" fill="#18181b" />
                  {/* Crimson Necktie / Scarf blowing in wind */}
                  <path d="M 95 80 L 105 80 L 145 110 L 125 115 Z" fill="#FF0033" />
                  {/* Head & Spiky Hair Silhouette */}
                  <circle cx="100" cy="55" r="22" fill="#000000" />
                  <polygon points="78,55 95,25 105,40 120,20 125,50 110,65" fill="#000000" />
                  {/* Glowing Red Eyes behind dark glasses / mask */}
                  <ellipse cx="94" cy="54" rx="4" ry="2" fill="#FF0033" />
                  <ellipse cx="108" cy="54" rx="4" ry="2" fill="#FF0033" />
                  {/* Glove / Hand gesture adjusting glasses */}
                  <circle cx="112" cy="58" r="6" fill="#ffffff" />
                  {/* Floating Black Crow Feathers */}
                  <path d="M 40 50 Q 50 45 45 60 Q 35 55 40 50 Z" fill="#000000" />
                  <path d="M 155 70 Q 165 65 160 80 Q 150 75 155 70 Z" fill="#000000" />
                  <path d="M 170 140 Q 180 135 175 150 Q 165 145 170 140 Z" fill="#000000" />
                </svg>

                {/* Overlaid Corner Portrait Badge */}
                <div className="absolute -bottom-2 -left-2 border-4 border-white bg-black p-1 shadow-2xl skew-x-[-12deg] z-10">
                  <AnimePortrait characterId={activeLeader.id} emotion="smirk" size="sm" isCutin />
                </div>
              </div>

              {/* Leader Name Tag */}
              <div className="bg-black text-white px-4 py-1 skew-x-[-12deg] border-2 border-white shadow-lg mt-1">
                <span className="font-bebas text-lg sm:text-2xl text-yellow-300 tracking-wider">
                  {activeLeader.name.toUpperCase()} // EXECUTED
                </span>
              </div>
            </div>

            {/* Right: Massive Slanted Persona 5 Slogan Banner */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              {/* Giant Catchphrase */}
              <div className="relative transform -rotate-3 mb-2">
                <div className="bg-white text-black font-black px-6 sm:px-10 py-2 sm:py-3 skew-x-[-15deg] border-4 border-black shadow-[6px_6px_0_#000]">
                  <span className="font-bebas text-4xl sm:text-7xl italic tracking-tighter leading-none block drop-shadow-[2px_2px_0_#FF0033]">
                    THE CURSE HAS BEEN CLEANSED!
                  </span>
                </div>
              </div>

              {/* Sub-headline Indonesian */}
              <div className="relative transform rotate-1 mb-4">
                <div className="bg-black text-yellow-300 font-black px-6 py-2 skew-x-[-15deg] border-2 border-white shadow-xl inline-block">
                  <span className="font-bebas text-2xl sm:text-4xl tracking-wider uppercase">
                    PENGUSIRAN PARIPURNA // KORIDOR GHAIB BERSIH!
                  </span>
                </div>
              </div>

              {/* Party Credits */}
              <div className="bg-black/90 p-3 border-2 border-white skew-x-[-12deg] shadow-lg max-w-md">
                <div className="font-mono text-xs text-neutral-300 leading-relaxed font-semibold">
                  <span className="text-red-500 font-bold">RENALD</span> •{' '}
                  <span className="text-cyan-400 font-bold">MAYA</span> •{' '}
                  <span className="text-yellow-400 font-bold">BAGAS</span>
                  <p className="text-[11px] text-neutral-400 mt-1 italic">
                    "Semua simpul kutukan dan arwah pengganggu telah dinetralkan oleh kekuatan sinergi Tiga Persona."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Dramatic Action Bar */}
          <div className="relative z-20 flex items-center justify-between border-t-4 border-black pt-2 bg-black/95 px-4 py-2 skew-x-[-12deg] shadow-2xl">
            <span className="font-mono text-[11px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">
              STATUS: VICTORY ANNIHILATION ACHIEVED
            </span>
            <span className="font-bebas text-base sm:text-lg text-yellow-300 tracking-wider">
              MEMULIHKAN KONDISI NORMAL...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
