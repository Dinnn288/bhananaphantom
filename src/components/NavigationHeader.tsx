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
  Star,
  User,
  Save,
  RotateCcw
} from 'lucide-react';

interface NavigationHeaderProps {
  currentTab: 'story' | 'battle' | 'explorer' | 'altar' | 'archive';
  onSelectTab: (tab: 'story' | 'battle' | 'explorer' | 'altar' | 'archive') => void;
  spiritGems: number;
  playerLevel: number;
  activeProfileName?: string;
  onOpenAccountManager?: () => void;
  onManualSave?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentTab,
  onSelectTab,
  spiritGems,
  playerLevel,
  activeProfileName,
  onOpenAccountManager,
  onManualSave
}) => {
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

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

  const handleSaveClick = () => {
    audioService.playClick();
    if (onManualSave) {
      onManualSave();
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    }
  };

  const navItems: { id: 'story' | 'battle' | 'explorer' | 'altar' | 'archive'; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'story', label: 'KISAH MISTERI', shortLabel: 'Kisah', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'battle', label: 'ARENA BERTARUNG', shortLabel: 'Arena', icon: <Swords className="w-4 h-4" /> },
    { id: 'explorer', label: 'EKSPLORASI KORIDOR', shortLabel: 'Jelajah', icon: <Compass className="w-4 h-4" /> },
    { id: 'altar', label: 'ALTAR PEMANGGILAN ROH', shortLabel: 'Altar', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'archive', label: 'ARSIP 1998', shortLabel: 'Arsip', icon: <FolderLock className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* Top Header */}
      <header className="w-full bg-[#0A0A0A]/95 border-b-4 border-[#FF0033] px-3 sm:px-6 py-2.5 sm:py-3 select-none backdrop-blur-md shadow-2xl relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Branding & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF0033] border-2 border-white rounded flex items-center justify-center p5-skew shadow-lg shadow-[#FF0033]/40 shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-bebas text-xl sm:text-3xl text-white tracking-widest leading-none">
                  BHAWANA <span className="text-[#FF0033]">PHANTOM</span>
                </h1>
                <span className="bg-[#FF0033] text-black font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 skew-x-[-12deg] tracking-wider uppercase">
                  P5X
                </span>
              </div>
              {activeProfileName && (
                <p className="text-[10px] sm:text-[11px] font-mono text-neutral-400 tracking-wider truncate max-w-[160px] sm:max-w-xs">
                  Penyelidik: <span className="text-yellow-400 font-bold">{activeProfileName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs (Hidden on mobile to prevent clutter) */}
          <nav className="hidden md:flex items-center gap-2 flex-wrap justify-center">
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

          {/* Right: Currency & Account / Save / Audio Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Level & Gems Badge */}
            <div className="bg-[#121216] border-2 border-neutral-700 px-2 sm:px-3 py-1 rounded skew-x-[-10deg] text-[11px] sm:text-xs font-mono text-neutral-300 flex items-center gap-1.5 shadow-inner">
              <span className="text-[#FF0033] font-black tracking-wider">LV.{playerLevel}</span>
              <span className="text-neutral-600">|</span>
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400" />
                {spiritGems}
              </span>
            </div>

            {/* Quick Save Button */}
            {onManualSave && (
              <button
                onClick={handleSaveClick}
                title="Simpan Game Sekarang"
                className="p-1.5 sm:p-2 rounded border bg-[#141418] hover:bg-[#FF0033] text-neutral-300 hover:text-black border-neutral-700 skew-x-[-10deg] transition-colors cursor-pointer relative"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform skew-x-[10deg]" />
                {saveToast && (
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white font-mono text-[9px] px-1 rounded whitespace-nowrap">
                    Disimpan!
                  </span>
                )}
              </button>
            )}

            {/* Account / Save Slots Switcher */}
            {onOpenAccountManager && (
              <button
                onClick={onOpenAccountManager}
                title="Ganti Akun / Muat Data"
                className="px-2 py-1 rounded border bg-[#141418] hover:border-[#FF0033] text-neutral-300 hover:text-white border-neutral-700 skew-x-[-10deg] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 transform skew-x-[10deg] text-[#FF0033]" />
                <span className="transform skew-x-[10deg] hidden sm:inline font-bold">AKUN</span>
              </button>
            )}

            {/* BGM Toggle */}
            <button
              onClick={toggleBgm}
              title={isBgmOn ? 'Matikan Musik' : 'Nyalakan Musik P5X'}
              className={`p-1.5 sm:p-2 rounded border skew-x-[-10deg] transition-all cursor-pointer ${
                isBgmOn
                  ? 'bg-[#FF0033] text-black border-white animate-pulse shadow-md shadow-[#FF0033]/40'
                  : 'bg-[#141418] text-neutral-400 border-neutral-700 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform skew-x-[10deg]" />
            </button>

            {/* SFX Mute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Buka Suara' : 'Bisukan Suara'}
              className={`p-1.5 sm:p-2 rounded border skew-x-[-10deg] transition-all cursor-pointer ${
                isMuted
                  ? 'bg-neutral-800 text-red-400 border-red-500'
                  : 'bg-[#141418] text-neutral-400 border-neutral-700 hover:text-white'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform skew-x-[10deg]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform skew-x-[10deg]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Thumb Navigation Bar (Only visible on mobile screens) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A0A0A]/95 border-t-2 border-[#FF0033] backdrop-blur-md shadow-[0_-5px_20px_rgba(0,0,0,0.8)] pb-safe">
        <nav className="grid grid-cols-5 h-14 items-center">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  audioService.playClick();
                  onSelectTab(item.id);
                }}
                className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-[#FF0033] font-bold bg-[#1A0B0F]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 inset-x-2 h-0.5 bg-[#FF0033] shadow-[0_0_8px_#FF0033]" />
                )}
                <div className={`p-1 rounded ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono tracking-wider truncate max-w-[60px]">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
