import React, { useState } from 'react';
import { audioService } from '../services/audioService';
import { 
  BookOpen, 
  Swords, 
  Compass, 
  Sparkles, 
  FolderLock, 
  Volume2, 
  VolumeX, 
  Music,
  Flame,
  Star
} from 'lucide-react';

interface NavigationHeaderProps {
  currentTab: 'story' | 'battle' | 'explorer' | 'altar' | 'archive';
  onSelectTab: (tab: 'story' | 'battle' | 'explorer' | 'altar' | 'archive') => void;
  spiritGems: number;
  playerLevel: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentTab,
  onSelectTab,
  spiritGems,
  playerLevel
}) => {
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const toggleBgm = () => {
    if (isBgmOn) {
      audioService.stopBgm();
      setIsBgmOn(false);
    } else {
      audioService.startBgm();
      setIsBgmOn(true);
    }
  };

  const toggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const navItems: { id: 'story' | 'battle' | 'explorer' | 'altar' | 'archive'; label: string; icon: React.ReactNode }[] = [
    { id: 'story', label: 'KISAH MISTERI', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'battle', label: 'ARENA BERTARUNG', icon: <Swords className="w-4 h-4" /> },
    { id: 'explorer', label: 'EKSPLORASI KORIDOR', icon: <Compass className="w-4 h-4" /> },
    { id: 'altar', label: 'ALTAR PEMANGGILAN ROH', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'archive', label: 'ARSIP 1998', icon: <FolderLock className="w-4 h-4" /> }
  ];

  return (
    <header className="w-full bg-[#0A0A0A]/95 border-b-4 border-[#FF0033] px-4 sm:px-6 py-3 select-none backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF0033] border-2 border-white rounded flex items-center justify-center p5-skew shadow-lg shadow-[#FF0033]/40">
            <Flame className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bebas text-2xl sm:text-3xl text-white tracking-widest leading-none">
                BHAWANA <span className="text-[#FF0033]">PHANTOM</span>
              </h1>
              <span className="bg-[#FF0033] text-black font-black text-[10px] px-2 py-0.5 skew-x-[-12deg] tracking-wider uppercase">
                P5X RPG
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase opacity-70">
              Location: SMA 7 Bhawana &bull; Spirit Investigation
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-2 flex-wrap justify-center">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  audioService.playClick();
                  onSelectTab(item.id);
                }}
                className={`relative group flex items-center gap-1.5 px-3.5 py-1.5 font-bebas text-sm sm:text-base tracking-wider skew-x-[-10deg] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF0033] text-black font-black border-2 border-white shadow-lg shadow-[#FF0033]/30 scale-105'
                    : 'bg-[#141418] text-neutral-300 border border-neutral-700 hover:border-[#FF0033] hover:text-white'
                }`}
              >
                <span className="transform skew-x-[10deg]">{item.icon}</span>
                <span className="transform skew-x-[10deg] italic uppercase font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Currency & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Level & Gems */}
          <div className="bg-[#121216] border-2 border-neutral-700 px-3 py-1 rounded skew-x-[-10deg] text-xs font-mono text-neutral-300 flex items-center gap-2 shadow-inner">
            <span className="text-[#FF0033] font-black tracking-wider">LV.{playerLevel}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {spiritGems} Token
            </span>
          </div>

          {/* Audio Controls */}
          <button
            onClick={toggleBgm}
            title={isBgmOn ? 'Matikan Musik' : 'Nyalakan Musik P5X'}
            className={`p-2 rounded border skew-x-[-10deg] transition-all cursor-pointer ${
              isBgmOn
                ? 'bg-[#FF0033] text-black border-white animate-pulse shadow-md shadow-[#FF0033]/40'
                : 'bg-[#141418] text-neutral-400 border-neutral-700 hover:text-white hover:border-[#FF0033]'
            }`}
          >
            <Music className="w-4 h-4 transform skew-x-[10deg]" />
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? 'Nyalakan Efek Suara' : 'Bisukan Suara'}
            className="p-2 rounded bg-[#141418] text-neutral-400 border border-neutral-700 hover:text-white hover:border-[#FF0033] skew-x-[-10deg] cursor-pointer"
          >
            <div className="transform skew-x-[10deg]">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-green-400" />}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
