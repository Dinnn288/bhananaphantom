import React, { useState, useEffect } from 'react';
import { StoryChapter, StoryNode, EnemyGhost } from '../types';
import { STORY_CHAPTERS, STORY_NODES } from '../data/story';
import { ALL_ENEMIES } from '../data/enemies';
import { AnimePortrait } from './AnimePortrait';
import { audioService } from '../services/audioService';
import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Swords, 
  Sparkles, 
  FileText,
  History,
  Compass,
  Flame,
  Radio,
  Map,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface StoryModeProps {
  onTriggerBattle: (enemy: EnemyGhost, onWinStoryNodeId?: string) => void;
  unlockedChapterId: string;
  onClueDiscovered: (clueId: string) => void;
  postWinStoryNodeId?: string | null;
  onClearPostWinStoryNodeId?: () => void;
  playerLevel?: number;
}

export const StoryMode: React.FC<StoryModeProps> = ({
  onTriggerBattle,
  unlockedChapterId,
  onClueDiscovered,
  postWinStoryNodeId,
  onClearPostWinStoryNodeId,
  playerLevel = 1
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('chap_0');
  const [currentNodeId, setCurrentNodeId] = useState<string>('node_p_01');
  const [viewMode, setViewMode] = useState<'reading' | 'chapter_select' | 'season2_preview'>('reading');
  const [dialogueHistory, setDialogueHistory] = useState<{ speaker: string; text: string; role?: string }[]>([]);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>(['chap_0', 'chap_1', 'chap_2']);

  // Handle post-battle victory resumption
  useEffect(() => {
    if (postWinStoryNodeId && STORY_NODES[postWinStoryNodeId]) {
      setCurrentNodeId(postWinStoryNodeId);
      setViewMode('reading');
      
      // Auto unlock clue if attached to victory node
      const node = STORY_NODES[postWinStoryNodeId];
      if (node.unlockClueId) {
        onClueDiscovered(node.unlockClueId);
      }

      // Check which chapter this node belongs to
      for (const chap of STORY_CHAPTERS) {
        if (postWinStoryNodeId.startsWith(chap.startNodeId.slice(0, 7))) {
          setActiveChapterId(chap.id);
          setUnlockedChapters(prev => Array.from(new Set([...prev, chap.id])));
          break;
        }
      }

      if (onClearPostWinStoryNodeId) {
        onClearPostWinStoryNodeId();
      }
    }
  }, [postWinStoryNodeId, onClueDiscovered, onClearPostWinStoryNodeId]);

  const activeChapter = STORY_CHAPTERS.find(c => c.id === activeChapterId) || STORY_CHAPTERS[0];
  const currentNode: StoryNode = STORY_NODES[currentNodeId] || STORY_NODES['node_p_01'];

  // Identify character avatar key
  const getSpeakerAvatarKey = (speaker: string): string => {
    if (speaker.includes('Maya')) return 'maya';
    if (speaker.includes('Bagas')) return 'bagas';
    if (speaker.includes('Gilang') || speaker.includes('Garuda')) return 'gilang';
    if (speaker.includes('Soedjarwo') || speaker.includes('Batara') || speaker.includes('Kala')) return 'soedjarwo';
    if (
      speaker.includes('Sindikat') || 
      speaker.includes('Utusan') || 
      speaker.includes('Bayangan') || 
      speaker.includes('Pemancar') ||
      speaker.includes('NARATOR TAKDIR')
    ) return 'utusan';
    return 'renald';
  };

  // Handle advancing story node
  const advanceToNode = (targetNodeId: string) => {
    audioService.playClick();
    const nextNode = STORY_NODES[targetNodeId];
    if (!nextNode) return;

    // Record history
    setDialogueHistory(prev => [
      ...prev,
      { speaker: currentNode.speaker, text: currentNode.text, role: currentNode.speakerRole }
    ]);

    // Check if node unlocks a secret clue
    if (nextNode.unlockClueId) {
      onClueDiscovered(nextNode.unlockClueId);
    }

    // Auto unlock appropriate chapter if moving to new chapter prefix
    if (targetNodeId.startsWith('node_c1')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_1'])));
    if (targetNodeId.startsWith('node_c2')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_2'])));
    if (targetNodeId.startsWith('node_c3')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_3'])));
    if (targetNodeId.startsWith('node_c4')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_4'])));
    if (targetNodeId.startsWith('node_c5')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_5'])));
    if (targetNodeId.startsWith('node_c6')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_6'])));
    if (targetNodeId.startsWith('node_c7')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_7'])));
    if (targetNodeId.startsWith('node_c8')) setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_8'])));

    // Check if node triggers a fight
    if (nextNode.triggerBattleEnemyId) {
      const enemy = ALL_ENEMIES[nextNode.triggerBattleEnemyId];
      if (enemy) {
        onTriggerBattle(enemy, nextNode.autoNext || nextNode.choices?.[0]?.nextNodeId);
        return;
      }
    }

    setCurrentNodeId(targetNodeId);
  };

  const startChapter = (chapter: StoryChapter) => {
    audioService.playClick();
    setActiveChapterId(chapter.id);
    setCurrentNodeId(chapter.startNodeId);
    setViewMode('reading');
  };

  // Background ambiance by style
  const getBackgroundTheme = (style: StoryNode['backgroundStyle']) => {
    switch (style) {
      case 'music_room':
        return 'from-rose-950/80 via-neutral-900 to-black';
      case 'bio_lab':
        return 'from-emerald-950/70 via-neutral-900 to-black';
      case 'stairwell':
        return 'from-purple-950/70 via-neutral-900 to-black';
      case 'boss_gate':
        return 'from-amber-950/80 via-red-950 to-black';
      case 'rooftop':
        return 'from-red-950 via-stone-950 to-black';
      default:
        return 'from-neutral-900 via-neutral-950 to-black';
    }
  };

  // ==========================================
  // VIEW 1: SEASON 2 INTEL TEASER (PROLOG SEASON 2)
  // ==========================================
  if (viewMode === 'season2_preview') {
    return (
      <div className="w-full bg-[#0A0A0A]/95 border-4 border-[#FF0033] rounded-xl p-6 shadow-2xl relative overflow-hidden artistic-radial-bg">
        <div className="absolute inset-0 artistic-pattern opacity-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b-2 border-[#FF0033]/50 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-purple-600 text-white font-black text-xs px-2.5 py-0.5 skew-x-[-12deg] tracking-wider uppercase flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                CLASSIFIED DOSSIER
              </span>
              <h2 className="font-bebas text-3xl text-white tracking-wider flex items-center gap-2">
                <Radio className="w-6 h-6 text-[#FF0033] animate-pulse" />
                INTEL RAHASIA: MENUJU SEASON 2
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-70">
              Konspirasi Sindikat Sembilan Gerbang Nusantara &bull; Ancaman Baru di Ibu Kota
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('chapter_select')}
              className="bg-[#141418] hover:bg-[#FF0033] hover:text-black text-white font-bebas text-base px-4 py-2 skew-x-[-10deg] border-2 border-neutral-700 hover:border-black transition-all cursor-pointer shadow-lg"
            >
              <span className="block transform skew-x-[10deg] italic uppercase font-bold">&larr; DAFTAR BAB</span>
            </button>
          </div>
        </div>

        {/* Season 2 Teaser Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Left Column: Cover & Threat Level */}
          <div className="bg-[#121217] border-2 border-purple-600/80 p-5 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 mb-4">
                <span className="text-xs font-mono text-purple-400 font-bold tracking-widest uppercase">
                  OPERASI GHAIB NASIONAL
                </span>
                <span className="bg-red-600 text-black text-[10px] font-black px-2 py-0.5 skew-x-[-8deg] uppercase">
                  KODE MERAH
                </span>
              </div>

              <h3 className="font-bebas text-2xl text-white tracking-wide mb-1">
                SEASON 2: SINDIKAT SEMBILAN GERBANG
              </h3>
              <p className="text-xs text-amber-300 font-mono italic mb-4">
                “Soedjarwo hanyalah permulaan. Gerbang Kedua telah memanggil tumbal baru di Jakarta.”
              </p>

              <div className="space-y-2 text-xs font-sans text-neutral-300 leading-relaxed">
                <p>
                  Setelah kehancuran Batara Kala Soedjarwo di SMA 7 Bhawana, radio transmisi militer yang ditemukan mengungkap rahasia yang jauh lebih mengerikan:
                </p>
                <p className="border-l-2 border-purple-500 pl-3 italic text-neutral-400">
                  Ritual 33 tumbal 1998 hanyalah <strong>Gerbang Pertama</strong> dari sembilan pasak segel gelap yang ditanam sekte okultisme di sembilan sekolah unggulan se-Indonesia!
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-400 block mb-1">TARGET BERIKUTNYA:</span>
              <div className="bg-black/80 border border-neutral-700 p-2.5 rounded font-mono text-xs text-yellow-400">
                &gt; SMA GARUDA MEGANTARA (JAKARTA PUSAT)<br/>
                &gt; KEPALA SEKOLAH BAYANGAN &bull; ANOMALI MENTAL
              </div>
            </div>
          </div>

          {/* Center Column: 9 Gates Map Radar */}
          <div className="lg:col-span-2 bg-[#121217] border-2 border-neutral-800 p-5 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-[#FF0033]" />
                <h4 className="font-bebas text-xl text-white tracking-wider">
                  STATUS SEMBILAN GERBANG NUSANTARA
                </h4>
              </div>
              <span className="text-xs font-mono text-neutral-400">STATUS SIKLUS: 1/9 HANCUR</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-black/60 border border-green-600/60 p-3 rounded">
                <div className="flex items-center justify-between text-green-400 font-bold mb-1">
                  <span>GERBANG 01: SMA 7 BHAWANA</span>
                  <span className="text-[10px] bg-green-950 px-1.5 py-0.5 rounded">HANCUR (S1)</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Disucikan oleh Renald, Maya, & Bagas. Jiwa Kak Gilang dan 33 murid bebas.
                </p>
              </div>

              <div className="bg-black/60 border border-[#FF0033] p-3 rounded animate-pulse">
                <div className="flex items-center justify-between text-[#FF0033] font-bold mb-1">
                  <span>GERBANG 02: SMA GARUDA MEGANTARA</span>
                  <span className="text-[10px] bg-red-950 px-1.5 py-0.5 rounded">TARGET SEASON 2</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Ibu Kota Jakarta. Sekolah elit pencetak anak pejabat. Terjadi hipnosis massal siswa.
                </p>
              </div>

              <div className="bg-black/60 border border-neutral-800 p-3 rounded opacity-70">
                <div className="flex items-center justify-between text-neutral-300 font-bold mb-1">
                  <span>GERBANG 03: SMA WATU IRENG (YOGYAKARTA)</span>
                  <span className="text-[10px] bg-neutral-900 px-1.5 py-0.5 rounded">TERKUNCI</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Makam candi kuno di lereng Gunung Merapi. Pusat ritual sesajen lahar.
                </p>
              </div>

              <div className="bg-black/60 border border-neutral-800 p-3 rounded opacity-70">
                <div className="flex items-center justify-between text-neutral-300 font-bold mb-1">
                  <span>GERBANG 04: ASRAMA GIRI KENCANA (BALI)</span>
                  <span className="text-[10px] bg-neutral-900 px-1.5 py-0.5 rounded">TERKUNCI</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Asrama tepi danau terlarang. Diyakini memelihara arwah Leak bertaring emas.
                </p>
              </div>
            </div>

            {/* Teaser feature checklist for Season 2 */}
            <div className="bg-[#1A121D] border-l-4 border-purple-500 p-4 rounded text-xs font-sans text-neutral-300">
              <h5 className="font-bebas text-lg text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                FITUR UTAMA YANG AKAN HADIR PADA SEASON 2:
              </h5>
              <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                <li><strong>Sistem Fusi Roh Tingkat Tinggi (Persona Evolution)</strong>: Gabungkan Garuda Hayam, Nyai Candra Kirana, dan Bharata Petir menjadi wujud Roh Agathodaimon.</li>
                <li><strong>Anggota Tim Baru (The 4th Phantom)</strong>: Siswa hacker jenius dari SMA Megantara bersenjatakan jimat gelombang suara digital.</li>
                <li><strong>Investigasi Metropolitan</strong>: Jelajahi koridor sekolah elit modern, stasiun MRT bawah tanah angker, dan gedung pencakar langit berhantu.</li>
                <li><strong>Pertarungan Melawan Dewan Sembilan</strong>: Hadapi petinggi yayasan berwajah dua dengan mekanik bos 3 fase.</li>
              </ul>
            </div>

            {/* Play Season 2 directly button */}
            <button
              onClick={() => {
                const s2Chap = STORY_CHAPTERS.find(c => c.id === 'chap_7');
                if (s2Chap) {
                  setUnlockedChapters(prev => Array.from(new Set([...prev, 'chap_7', 'chap_8'])));
                  startChapter(s2Chap);
                }
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF0033] via-purple-700 to-indigo-700 text-white font-bebas text-2xl tracking-wider skew-x-[-8deg] hover:brightness-125 shadow-2xl flex items-center justify-center gap-2 cursor-pointer border-2 border-white animate-pulse"
            >
              <span className="transform skew-x-[8deg] flex items-center gap-2">
                <Flame className="w-5 h-5 text-yellow-300" />
                MAINKAN SEASON 2 SEKARANG (BAB 1: SAFEHOUSE & DEKRIPSI) &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: CHAPTER SELECTION
  // ==========================================
  if (viewMode === 'chapter_select') {
    return (
      <div className="w-full bg-[#0A0A0A]/95 border-4 border-[#FF0033] rounded-xl p-6 shadow-2xl relative overflow-hidden artistic-radial-bg">
        <div className="absolute inset-0 artistic-pattern opacity-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b-2 border-[#FF0033]/50 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-[#FF0033] text-black font-black text-xs px-2.5 py-0.5 skew-x-[-12deg] tracking-wider uppercase">
                SEMUA BAB CERITA (SEASON 1 & 2)
              </span>
              <h2 className="font-bebas text-3xl text-white tracking-wider flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#FF0033]" />
                PILIH BAB KISAH HOROR SEKOLAH
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-70">
              9 Bab Lengkap: Dari Panggilan Jam 00:00 hingga Infiltrasi Megantara Ibu Kota Season 2.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('season2_preview')}
              className="bg-purple-900/80 hover:bg-purple-700 text-purple-200 font-bebas text-base px-4 py-2 skew-x-[-10deg] border border-purple-500 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4 transform skew-x-[10deg] animate-pulse" />
              <span className="block transform skew-x-[10deg] italic uppercase font-bold">DOSSIER SEASON 2</span>
            </button>

            <button
              onClick={() => setViewMode('reading')}
              className="bg-[#141418] hover:bg-white hover:text-black text-white font-bebas text-lg px-5 py-2 skew-x-[-10deg] border-2 border-white transition-all cursor-pointer shadow-lg"
            >
              <span className="block transform skew-x-[10deg] italic uppercase font-bold">LANJUT BACA &rarr;</span>
            </button>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {STORY_CHAPTERS.map((chapter, idx) => {
            const isUnlocked = idx === 0 || unlockedChapters.includes(chapter.id) || chapter.id === unlockedChapterId || chapter.isUnlocked;
            const isCurrent = chapter.id === activeChapterId;
            const isSeason2 = chapter.number >= 7;

            return (
              <div
                key={chapter.id}
                onClick={() => isUnlocked && startChapter(chapter)}
                className={`p-5 rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden group ${
                  isUnlocked
                    ? isCurrent
                      ? 'border-[#FF0033] border-r-8 bg-[#151117] p5-shadow-red'
                      : isSeason2
                      ? 'border-purple-600/70 bg-[#130E1F]/90 hover:border-purple-400 hover:bg-[#1C142E]'
                      : 'border-neutral-800 bg-[#121217]/90 hover:border-[#FF0033] hover:bg-[#181820]'
                    : 'border-neutral-900 bg-[#0A0A0E] opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`font-bebas text-xs tracking-widest px-2.5 py-0.5 rounded font-black skew-x-[-10deg] uppercase italic ${
                        isSeason2
                          ? 'bg-purple-600 text-white shadow-[0_0_10px_#9333ea]'
                          : chapter.number === 6
                          ? 'bg-amber-400 text-black'
                          : 'bg-[#FF0033] text-black'
                      }`}
                    >
                      {chapter.number === 0
                        ? 'PROLOG'
                        : chapter.number === 6
                        ? 'EPILOG SEASON 1'
                        : chapter.number >= 7
                        ? `SEASON 2 - BAB ${chapter.number - 6}`
                        : `BAB ${chapter.number}`}
                    </span>
                    <h3 className="font-bebas text-2xl text-white tracking-wide mt-2 group-hover:text-[#FF0033] transition-colors">
                      {chapter.title}
                    </h3>
                    <h4 className="font-mono text-xs text-amber-300 mb-2 italic">
                      {chapter.subtitle}
                    </h4>
                  </div>
                  {isUnlocked ? (
                    <ChevronRight className="w-5 h-5 text-[#FF0033] group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <Lock className="w-5 h-5 text-neutral-600" />
                  )}
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed font-sans">
                  {chapter.summary}
                </p>

                <div className="mt-4 flex items-center justify-between text-[11px] font-mono border-t border-neutral-800/80 pt-2.5 text-neutral-400">
                  <span className="flex items-center gap-1 text-[#FF0033] font-bold">
                    <Swords className="w-3.5 h-3.5" />
                    Boss: {ALL_ENEMIES[chapter.bossEnemyId]?.name || 'Entitas Ghaib'}
                  </span>
                  {isUnlocked && (
                    <span className="text-yellow-400 font-black tracking-wider uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      TERBUKA
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Hook to Season 2 */}
        <div 
          onClick={() => setViewMode('season2_preview')}
          className="mt-6 border-2 border-purple-600 bg-gradient-to-r from-purple-950/70 via-black to-[#1A0B1A] p-4 rounded-lg cursor-pointer hover:border-purple-400 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-900/60 rounded-lg border border-purple-500">
              <Radio className="w-6 h-6 text-purple-300 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono bg-purple-600 text-white font-black px-2 py-0.5 rounded uppercase">
                COMING SOON
              </span>
              <h4 className="font-bebas text-xl text-white tracking-wider mt-1">
                SEASON 2: SINDIKAT SEMBILAN GERBANG NUSANTARA
              </h4>
              <p className="text-xs text-neutral-400 font-sans">
                Klik di sini untuk melihat intelijen bocoran lokasi 9 sekolah tumbal dan musuh baru di Ibu Kota!
              </p>
            </div>
          </div>
          
          <button className="bg-purple-600 hover:bg-purple-500 text-black font-bebas text-base px-4 py-1.5 skew-x-[-8deg] font-bold flex items-center gap-1 whitespace-nowrap">
            <span className="skew-x-[8deg]">BUKA INTEL S2 &rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: READING / VISUAL NOVEL VIEW
  // ==========================================
  return (
    <div className="relative w-full h-[640px] bg-[#0A0A0A] border-4 border-[#FF0033] rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl select-none artistic-radial-bg">
      {/* Repeating Red Background Pattern and Atmosphere */}
      <div className="absolute inset-0 artistic-pattern opacity-10 pointer-events-none z-0" />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${getBackgroundTheme(
          currentNode.backgroundStyle
        )} opacity-85 z-0 transition-colors duration-700`}
      />
      <div className="absolute inset-0 bg-halftone pointer-events-none opacity-20 z-0" />

      {/* Top Header Controls */}
      <div className="relative z-10 p-4 flex items-center justify-between border-b-2 border-[#FF0033]/50 bg-[#0A0A0A]/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="bg-[#FF0033] text-black font-black text-xs px-3 py-1 skew-x-[-12deg] tracking-widest uppercase italic">
            SEASON 1 &bull; {activeChapter.title.toUpperCase()}
          </span>
          <span className="font-mono text-xs text-amber-300 hidden sm:inline italic">
            {activeChapter.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dialogue Log Button */}
          <button
            onClick={() => setShowLogModal(true)}
            className="text-xs text-neutral-300 hover:text-white px-2.5 py-1.5 bg-[#141418] border border-neutral-700 hover:border-[#FF0033] skew-x-[-10deg] flex items-center gap-1 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-amber-400 transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg] font-mono uppercase font-bold text-[11px]">LOG</span>
          </button>

          {/* Season 2 Intel Teaser Shortcut */}
          <button
            onClick={() => setViewMode('season2_preview')}
            className="text-xs text-purple-300 hover:text-white px-2.5 py-1.5 bg-[#1B1124] border border-purple-700 hover:border-purple-400 skew-x-[-10deg] flex items-center gap-1 cursor-pointer hidden sm:flex"
          >
            <Radio className="w-3.5 h-3.5 text-purple-400 transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg] font-mono uppercase font-bold text-[11px]">INTEL S2</span>
          </button>

          {/* Quick Bab 2 Shortcut Button */}
          {activeChapterId !== 'chap_2' && (
            <button
              onClick={() => {
                const ch2 = STORY_CHAPTERS.find(c => c.id === 'chap_2');
                if (ch2) startChapter(ch2);
              }}
              className="text-xs text-yellow-300 hover:text-black hover:bg-yellow-400 px-3 py-1.5 bg-yellow-950/80 border border-yellow-500 skew-x-[-10deg] flex items-center gap-1.5 cursor-pointer shadow-lg transition-colors"
            >
              <Swords className="w-3.5 h-3.5 text-yellow-400 transform skew-x-[10deg]" />
              <span className="transform skew-x-[10deg] font-mono uppercase font-bold">MAIN BAB 2</span>
            </button>
          )}

          {/* Chapter Select Button */}
          <button
            onClick={() => setViewMode('chapter_select')}
            className="text-xs text-neutral-200 hover:text-white px-3 py-1.5 bg-[#141418] border border-neutral-700 hover:border-[#FF0033] skew-x-[-10deg] flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF0033] transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg] font-mono uppercase font-bold">DAFTAR BAB</span>
          </button>
        </div>
      </div>

      {/* Center Stage: Character Visual Portrait Display (Clean & Unobstructed) */}
      <div className="relative z-10 flex-1 flex items-end justify-center sm:justify-start px-6 sm:px-12 pb-4 pointer-events-none">
        <div className="flex items-end gap-6 max-w-2xl">
          <div className="shrink-0 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
            <AnimePortrait
              characterId={getSpeakerAvatarKey(currentNode.speaker)}
              emotion={currentNode.emotion || 'normal'}
              size="xl"
              isCutin
            />
          </div>
        </div>
      </div>

      {/* Bottom Dialogue Box & Choices */}
      <div className="relative z-20 p-4 sm:p-6 bg-black/95 border-t-4 border-[#FF0033] shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
        {/* Speaker Name Bar (Inside Dialogue Box: 100% Guaranteed NOT to overlap the face) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-neutral-800">
          <div className="inline-flex items-center gap-2 bg-[#FF0033] text-black px-4 py-1 skew-x-[-12deg] shadow-lg border border-black">
            <span className="uppercase tracking-wider transform skew-x-[12deg] font-bebas text-lg leading-none font-black">
              {currentNode.speaker}
            </span>
            {currentNode.speakerRole && (
              <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded transform skew-x-[12deg]">
                {currentNode.speakerRole}
              </span>
            )}
          </div>

          {/* Location Badge cleanly placed in dialogue bar */}
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono bg-neutral-900/90 border border-neutral-800 px-3 py-1">
            <Compass className="w-3.5 h-3.5 text-[#FF0033]" />
            <span className="uppercase font-bold tracking-wider text-[11px]">
              LOKASI: {currentNode.backgroundStyle.toUpperCase().replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="min-h-[75px] text-neutral-100 text-sm sm:text-base leading-relaxed font-sans mb-4 pt-1 pl-4 border-l-4 border-[#FF0033]">
          <p className="italic text-neutral-200">
            {currentNode.text}
          </p>
        </div>

        {/* Interactive Choices or Next Prompt */}
        <div className="flex flex-wrap items-center gap-3 justify-end">
          {currentNode.choices && currentNode.choices.length > 0 ? (
            currentNode.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => advanceToNode(choice.nextNodeId)}
                className="relative transform -rotate-1 group cursor-pointer"
              >
                <div className="absolute -inset-1 bg-white skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#141418] group-hover:bg-[#FF0033] text-white group-hover:text-black font-bebas text-base sm:text-lg px-4 py-2 border-2 border-[#FF0033] group-hover:border-black skew-x-[-10deg] transition-colors shadow-lg">
                  <span className="block transform skew-x-[10deg] italic uppercase font-bold">
                    &gt; {choice.text}
                  </span>
                </div>
              </button>
            ))
          ) : currentNode.autoNext ? (
            <button
              onClick={() => advanceToNode(currentNode.autoNext!)}
              className="relative transform -rotate-2 group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-white skew-x-[-12deg]" />
              <div className="relative bg-[#FF0033] group-hover:bg-white text-white group-hover:text-black font-bebas text-lg px-7 py-2 skew-x-[-12deg] border-2 border-black transition-colors shadow-xl flex items-center gap-1.5">
                <span className="block transform skew-x-[12deg] font-black italic uppercase">LANJUT</span>
                <ChevronRight className="w-5 h-5 transform skew-x-[12deg]" />
              </div>
            </button>
          ) : currentNode.triggerBattleEnemyId ? (() => {
            const enemy = ALL_ENEMIES[currentNode.triggerBattleEnemyId!];
            const isLevelGated = enemy && enemy.minPlayerLevel && playerLevel < enemy.minPlayerLevel;

            if (isLevelGated) {
              return (
                <div className="flex flex-col items-center gap-2 bg-red-950/90 border-2 border-red-500 rounded-xl p-4 shadow-2xl max-w-lg">
                  <div className="flex items-center gap-2 text-red-400 font-bebas text-xl">
                    <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
                    <span>BATASAN LEVEL BELUM TERCAPAI!</span>
                  </div>
                  <p className="text-xs font-mono text-neutral-300 text-center leading-relaxed">
                    Roh Boss <span className="text-yellow-400 font-bold">{enemy?.name}</span> memancarkan aura kutukan yang terlalu pekat! Diperlukan minimal <span className="text-red-400 font-bold">Level {enemy?.minPlayerLevel}</span> untuk menantang pertarungan ini.
                  </p>
                  <div className="flex items-center gap-3 text-xs font-mono bg-black/60 px-3 py-1.5 rounded border border-red-900/60">
                    <span className="text-neutral-400">Level Anda Saat Ini: <strong className="text-white">LV.{playerLevel}</strong></span>
                    <span className="text-red-400 font-bold">Syarat Minimal: LV.{enemy?.minPlayerLevel}</span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-400 italic text-center">
                    Tingkatkan level di Arena Bertarung atau kuatkan Roh di Kuil Penguatan terlebih dahulu.
                  </p>
                </div>
              );
            }

            return (
              <button
                onClick={() => {
                  if (enemy) onTriggerBattle(enemy, currentNode.autoNext || currentNode.choices?.[0]?.nextNodeId);
                }}
                className="relative transform -rotate-2 cursor-pointer animate-pulse"
              >
                <div className="absolute -inset-1.5 bg-yellow-300 skew-x-[-12deg]" />
                <div className="relative bg-[#FF0033] text-black font-bebas text-xl px-7 py-2.5 skew-x-[-12deg] border-2 border-black font-black flex items-center gap-2 shadow-2xl">
                  <Swords className="w-5 h-5 transform skew-x-[12deg]" />
                  <span className="block transform skew-x-[12deg] italic uppercase tracking-wider">
                    MULAI PERTARUNGAN GHAIB!
                  </span>
                </div>
              </button>
            );
          })() : (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('season2_preview')}
                className="bg-purple-700 hover:bg-purple-600 text-white font-bebas text-base px-5 py-2 skew-x-[-10deg] border-2 border-purple-400 cursor-pointer shadow-lg flex items-center gap-1.5"
              >
                <Radio className="w-4 h-4 transform skew-x-[10deg]" />
                <span className="block transform skew-x-[10deg] uppercase font-bold">BUKA INTEL SEASON 2</span>
              </button>

              <button
                onClick={() => setViewMode('chapter_select')}
                className="bg-[#141418] hover:bg-neutral-800 text-neutral-300 hover:text-white font-bebas text-base px-4 py-2 skew-x-[-10deg] border border-neutral-700 cursor-pointer"
              >
                <span className="block transform skew-x-[10deg]">SELESAI (KEMBALI KE BAB)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DIALOGUE BACKLOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border-4 border-[#FF0033] rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b-2 border-[#FF0033]/50 flex items-center justify-between bg-black">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#FF0033]" />
                <h3 className="font-bebas text-2xl text-white tracking-wider">LOG RIWAYAT PERCAKAPAN</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
              {dialogueHistory.length === 0 ? (
                <p className="text-neutral-500 italic text-center py-8">Belum ada riwayat dialog sebelumnya.</p>
              ) : (
                dialogueHistory.map((item, idx) => (
                  <div key={idx} className="border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#FF0033] font-bebas text-base">{item.speaker}</span>
                      {item.role && (
                        <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                          {item.role}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-300 leading-relaxed italic">{item.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-black border-t border-neutral-800 text-right">
              <button
                onClick={() => setShowLogModal(false)}
                className="bg-[#FF0033] hover:bg-white text-black font-bebas text-base px-5 py-1.5 skew-x-[-10deg] font-bold cursor-pointer"
              >
                <span className="skew-x-[10deg]">TUTUP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
