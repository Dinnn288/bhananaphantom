import React, { useEffect, useState } from 'react';
import { audioService } from '../services/audioService';
import { ElementType } from '../types';
import { Zap, Flame, Sparkles, Wind, Skull, Award } from 'lucide-react';

interface WeaknessSlashAnimationProps {
  element?: ElementType | string;
  targetName?: string;
  damage?: number;
  onComplete: () => void;
}

export const WeaknessSlashAnimation: React.FC<WeaknessSlashAnimationProps> = ({
  element = 'Agni',
  targetName,
  damage,
  onComplete
}) => {
  const [stage, setStage] = useState<'slash' | 'cutin' | 'fade'>('slash');
  const [scratchLines, setScratchLines] = useState<Array<{ angle: number; top: number; left: number; width: number }>>([]);

  useEffect(() => {
    // Generate dramatic random scratch slash marks (goresan cakar / tebasan Persona 5)
    const lines = [
      { angle: -24, top: 42, left: 10, width: 95 },
      { angle: -18, top: 50, left: 5, width: 100 },
      { angle: -32, top: 58, left: 15, width: 85 },
      { angle: 48, top: 38, left: 45, width: 65 }
    ];
    setScratchLines(lines);

    // 1. Play brutal Persona 5 Royal Weakness Slash sound effect
    audioService.playWeaknessSlash();

    // 2. Progression stages
    const t1 = setTimeout(() => {
      setStage('cutin');
    }, 120);

    const t2 = setTimeout(() => {
      setStage('fade');
    }, 650);

    const t3 = setTimeout(() => {
      onComplete();
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Elemental color styling
  const elementStyle = (() => {
    switch (element) {
      case 'Agni':
        return {
          accent: '#FF0033',
          glow: 'rgba(255, 0, 51, 0.8)',
          bannerBg: 'from-red-900 via-black to-red-950',
          particleColor: '#ff4800',
          icon: <Flame className="w-8 h-8 text-[#FF0033] animate-bounce" />
        };
      case 'Tirta':
        return {
          accent: '#00f5d4',
          glow: 'rgba(0, 245, 212, 0.8)',
          bannerBg: 'from-cyan-900 via-black to-blue-950',
          particleColor: '#00f5d4',
          icon: <Sparkles className="w-8 h-8 text-[#00f5d4] animate-bounce" />
        };
      case 'Vidyut':
        return {
          accent: '#ffd166',
          glow: 'rgba(255, 209, 102, 0.8)',
          bannerBg: 'from-yellow-900 via-black to-amber-950',
          particleColor: '#ffd166',
          icon: <Zap className="w-8 h-8 text-yellow-300 animate-bounce" />
        };
      case 'Bayu':
        return {
          accent: '#06d6a0',
          glow: 'rgba(6, 214, 160, 0.8)',
          bannerBg: 'from-emerald-900 via-black to-teal-950',
          particleColor: '#06d6a0',
          icon: <Wind className="w-8 h-8 text-[#06d6a0] animate-bounce" />
        };
      default:
        return {
          accent: '#e60012',
          glow: 'rgba(230, 0, 18, 0.8)',
          bannerBg: 'from-red-950 via-black to-red-900',
          particleColor: '#FF0033',
          icon: <Flame className="w-8 h-8 text-[#FF0033] animate-bounce" />
        };
    }
  })();

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-200 ${
      stage === 'fade' ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* 1. Flash Shockwave Layer */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-150 ${
          stage === 'slash' ? 'opacity-80' : 'opacity-0'
        }`}
      />

      {/* 2. Persona 5 Royal Red Vignette & Halftone Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-[#FF0033]/20 to-black/80" />

      {/* 3. Manga Action Speed Lines & Red Diagonal Hazard Bars */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -inset-10 opacity-30 transform -rotate-12 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 12px,
              rgba(255, 255, 255, 0.15) 12px,
              rgba(255, 255, 255, 0.15) 14px
            )`
          }}
        />
      </div>

      {/* 4. Persona 5 Razor Scratch Marks ("Goresan Animasi") */}
      <div className="absolute inset-0 pointer-events-none">
        {scratchLines.map((line, idx) => (
          <div
            key={idx}
            className="absolute origin-left transform"
            style={{
              top: `${line.top}%`,
              left: `${line.left}%`,
              width: `${line.width}%`,
              transform: `rotate(${line.angle}deg)`,
              animation: `p5-scratch-strike 0.35s cubic-bezier(0.1, 1, 0.1, 1) forwards`
            }}
          >
            {/* Outer blood/ink claw gouge */}
            <div 
              className="h-3 sm:h-5 bg-black border-y-2 border-[#FF0033] shadow-[0_0_20px_#FF0033] transform skew-x-[-25deg] relative"
              style={{
                boxShadow: `0 0 25px ${elementStyle.accent}`
              }}
            >
              {/* Inner razor white core */}
              <div className="absolute inset-y-1 left-4 right-10 bg-white blur-[0.5px]" />
              {/* Jagged claw scratch tip */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent transform skew-x-[35deg]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 5. Giant Persona 5 Royal Diagonal Banner */}
      <div 
        className={`relative z-20 w-full max-w-5xl transform -rotate-6 transition-all duration-300 ${
          stage === 'cutin' || stage === 'fade' 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-125 -translate-y-12 opacity-0'
        }`}
      >
        {/* Black backing bar */}
        <div className="bg-black py-4 px-6 border-y-4 border-white shadow-[0_0_35px_rgba(255,0,51,0.9)] relative overflow-hidden transform skew-x-[-12deg]">
          {/* Jagged warning tape stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-[#FF0033] to-yellow-400" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-[#FF0033] to-yellow-400" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Kanji & Persona 5 'WEAK!' typography */}
            <div className="flex items-center gap-4">
              <div className="bg-[#FF0033] text-black font-black font-mono text-sm px-2.5 py-1 transform skew-x-[12deg] tracking-widest border border-white">
                『 弱点撃破 !! 』
              </div>

              {/* Massive WEAK! Stamp */}
              <div className="relative">
                <div 
                  className="font-bebas text-6xl sm:text-8xl tracking-wider text-yellow-300 font-black select-none transform skew-x-[-8deg] leading-none"
                  style={{
                    WebkitTextStroke: '4px black',
                    textShadow: '6px 6px 0px #FF0033, 10px 10px 0px black'
                  }}
                >
                  WEAK!
                </div>
                <div className="absolute -top-3 -right-6 bg-white text-black font-bebas text-xs sm:text-sm px-2 py-0.5 transform rotate-12 font-black border border-black shadow">
                  1 MORE!
                </div>
              </div>
            </div>

            {/* Middle: Target and Damage Details */}
            <div className="text-center sm:text-right font-mono">
              <div className="text-xs sm:text-sm font-black text-white uppercase tracking-widest flex items-center justify-center sm:justify-end gap-2">
                <span>KELEMAHAN TERBONGKAR</span>
                <span className="text-[#FF0033]">&bull;</span>
                <span className="text-yellow-300">[{element}]</span>
              </div>
              {targetName && (
                <div className="text-xs text-neutral-300 font-bold mt-0.5">
                  Target: <strong className="text-white">{targetName}</strong> jatuh dalam kondisi <span className="text-red-400 font-black">[DOWN]</span>!
                </div>
              )}
            </div>

            {/* Right: Icon */}
            <div className="hidden sm:flex items-center justify-center p-3 bg-neutral-900 border-2 border-yellow-400 rounded-lg transform skew-x-[12deg] shadow-lg">
              {elementStyle.icon}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Dynamic Japanese SFX Sound Effect Letters */}
      <div 
        className="absolute top-1/4 right-10 text-yellow-300 font-black text-5xl sm:text-7xl font-sans tracking-tight transform rotate-12 select-none pointer-events-none opacity-80"
        style={{
          WebkitTextStroke: '2px #FF0033',
          textShadow: '4px 4px 0px black'
        }}
      >
        ズバァァッ!!
      </div>

      {/* Embedded keyframe styles for smooth, high-impact Persona 5 slash animation */}
      <style>{`
        @keyframes p5-scratch-strike {
          0% {
            transform: scaleX(0) rotate(var(--tw-rotate));
            opacity: 0;
          }
          35% {
            transform: scaleX(1.15) rotate(var(--tw-rotate));
            opacity: 1;
          }
          100% {
            transform: scaleX(1) rotate(var(--tw-rotate));
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
};
