import React, { useState, useEffect } from 'react';
import { SavedGameProfile } from '../types';
import { saveService } from '../services/saveService';
import { AnimePortrait } from './AnimePortrait';
import { ElementBadge } from './ElementBadge';
import { audioService } from '../services/audioService';
import { 
  Flame, 
  Sparkles, 
  UserPlus, 
  Play, 
  Trash2, 
  RotateCcw, 
  ShieldAlert, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Zap
} from 'lucide-react';

interface TitleAccountScreenProps {
  onLoadProfile: (profile: SavedGameProfile) => void;
}

export const TitleAccountScreen: React.FC<TitleAccountScreenProps> = ({ onLoadProfile }) => {
  const [profiles, setProfiles] = useState<SavedGameProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'load' | 'create' | 'backup'>('load');

  // New Profile Form State
  const [playerName, setPlayerName] = useState<string>('Renald');
  const [selectedHeroId, setSelectedHeroId] = useState<string>('renald');
  const [selectedElement, setSelectedElement] = useState<'Agni' | 'Tirta' | 'Vidyut'>('Agni');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [backupText, setBackupText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    refreshProfiles();
  }, []);

  const refreshProfiles = () => {
    const loaded = saveService.getAllProfiles();
    setProfiles(loaded);
    if (loaded.length === 0) {
      setActiveTab('create');
    }
  };

  const handleSelectProfile = (profile: SavedGameProfile) => {
    audioService.playCritical();
    saveService.setActiveProfileId(profile.id);
    onLoadProfile(profile);
  };

  const handleCreateNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    audioService.playAwakenSound();
    const newProfile = saveService.createNewProfile(
      playerName.trim(),
      selectedHeroId,
      selectedElement
    );
    onLoadProfile(newProfile);
  };

  const handleDeleteProfile = (id: string) => {
    audioService.playClick();
    saveService.deleteProfile(id);
    setDeleteConfirmId(null);
    refreshProfiles();
  };

  const handleExportBackup = () => {
    audioService.playClick();
    const all = saveService.getAllProfiles();
    const jsonStr = JSON.stringify(all, null, 2);
    setBackupText(jsonStr);
    try {
      navigator.clipboard.writeText(jsonStr);
      setImportStatus('Data berhasil disalin ke clipboard!');
      setTimeout(() => setImportStatus(null), 3000);
    } catch {
      setImportStatus('Salin teks dari kotak di bawah secara manual:');
    }
  };

  const handleImportBackup = () => {
    audioService.playClick();
    if (!backupText.trim()) return;
    try {
      const parsed = JSON.parse(backupText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem('bhawana_phantom_profiles_v1', JSON.stringify(parsed));
        setImportStatus('Berhasil mengimpor akun tersimpan!');
        refreshProfiles();
        setActiveTab('load');
      } else {
        setImportStatus('Format data tidak valid!');
      }
    } catch {
      setImportStatus('Gagal membaca JSON data!');
    }
  };

  const LEAD_HERO_OPTIONS = [
    {
      id: 'renald',
      name: 'Renald',
      alias: 'Sang Pemberontak',
      desc: 'Pemuda yang membangkitkan mata batin di koridor terkutuk.',
      tag: 'Penyerang Api Seimbang'
    },
    {
      id: 'maya',
      name: 'Maya',
      alias: 'Cermin Kejujuran',
      desc: 'Siswi OSIS dengan intuisi tajam dan kemampuan analisis sukma.',
      tag: 'Taktisi Es & Pemulih'
    },
    {
      id: 'bagas',
      name: 'Bagas',
      alias: 'Benteng Perkasa',
      desc: 'Mantan atlet pencak silat sekolah yang melindungi kawan-kawannya.',
      tag: 'Pertahanan & Hantaman Petir'
    },
    {
      id: 'gilang',
      name: 'Gilang',
      alias: 'Bayangan Sunyi',
      desc: 'Penjelajah misteri yang mahir membaca arah angin ghaib.',
      tag: 'Kecepatan & Badai Angin'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between relative overflow-hidden select-none p-4 sm:p-6 artistic-radial-bg">
      {/* Background Decorative Persona Patterns */}
      <div className="fixed inset-0 opacity-15 pointer-events-none artistic-pattern z-0" />
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-[#FF0033]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Atmospheric Giant Geometric Background Slanted Frames */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="w-[850px] sm:w-[1200px] h-[380px] border-[16px] border-[#FF0033] opacity-[0.05] transform rotate-[14deg]" />
        <div className="w-[950px] sm:w-[1300px] h-[320px] border-2 border-white opacity-[0.05] transform -rotate-[10deg] mt-10" />
      </div>

      {/* Top Header Banner */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between border-b-2 border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF0033] border-2 border-white rounded flex items-center justify-center p5-skew shadow-lg shadow-[#FF0033]/40">
            <Flame className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <h1 className="font-bebas text-3xl sm:text-4xl text-white tracking-widest leading-none">
              BHAWANA <span className="text-[#FF0033]">PHANTOM</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-widest">
              SISTEM PENYIMPANAN DATA PENYELIDIKAN ROH SEKOLAH
            </p>
          </div>
        </div>

        <span className="bg-black/80 text-neutral-400 font-mono text-xs px-3 py-1 border border-neutral-700 skew-x-[-10deg]">
          VERSI 1.2 &bull; P5X
        </span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-auto py-6">
        {/* Tab Selection Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
          <button
            onClick={() => {
              audioService.playClick();
              setActiveTab('load');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 font-bebas text-lg tracking-wider skew-x-[-10deg] transition-all cursor-pointer ${
              activeTab === 'load'
                ? 'bg-[#FF0033] text-black font-black border-2 border-white shadow-xl shadow-[#FF0033]/30 scale-105'
                : 'bg-[#141418] text-neutral-300 border border-neutral-700 hover:border-[#FF0033]'
            }`}
          >
            <RotateCcw className="w-4 h-4 transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg]">MUAT DATA TERSIMPAN ({profiles.length})</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setActiveTab('create');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 font-bebas text-lg tracking-wider skew-x-[-10deg] transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-[#FF0033] text-black font-black border-2 border-white shadow-xl shadow-[#FF0033]/30 scale-105'
                : 'bg-[#141418] text-neutral-300 border border-neutral-700 hover:border-[#FF0033]'
            }`}
          >
            <UserPlus className="w-4 h-4 transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg]">+ BUAT AKUN BARU</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setActiveTab('backup');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 font-bebas text-base tracking-wider skew-x-[-10deg] transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-neutral-200 text-black font-black border-2 border-white'
                : 'bg-[#141418] text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 transform skew-x-[10deg]" />
            <span className="transform skew-x-[10deg]">CADANGAN DATA</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: LOAD SAVED PROFILES LIST                                         */}
        {/* ========================================================================= */}
        {activeTab === 'load' && (
          <div className="space-y-4">
            {profiles.length === 0 ? (
              <div className="bg-[#121217]/95 border-2 border-neutral-700 rounded-xl p-8 text-center max-w-lg mx-auto shadow-2xl">
                <ShieldAlert className="w-12 h-12 text-[#FF0033] mx-auto mb-3 animate-pulse" />
                <h3 className="font-bebas text-2xl text-white tracking-wider">
                  BELUM ADA DATA AKUN TERSIMPAN
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-2 mb-6 leading-relaxed">
                  Kamu belum memiliki profil penyelidikan tersimpan di peramban ini. Buat akun baru sekarang untuk memulai petualangan koridor SMA 7 Bhawana!
                </p>
                <button
                  onClick={() => {
                    audioService.playClick();
                    setActiveTab('create');
                  }}
                  className="bg-[#FF0033] hover:bg-red-600 text-black font-bebas text-xl px-6 py-2.5 rounded border-2 border-white skew-x-[-10deg] shadow-lg font-black tracking-wider transition-transform hover:scale-105 cursor-pointer"
                >
                  <span className="transform skew-x-[10deg] block">+ BUAT AKUN PERTAMA</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {profiles.map(p => {
                  const leadHero = p.heroes?.find(h => h.id === p.leadHeroId) || p.heroes?.[0];
                  const dateStr = new Date(p.lastSavedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={p.id}
                      className="bg-[#121217]/95 border-2 border-neutral-700 hover:border-[#FF0033] rounded-xl p-4 shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between"
                    >
                      {/* Top slot header strip */}
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#FF0033] text-black font-black font-bebas text-xs px-2 py-0.5 rounded skew-x-[-10deg]">
                            SLOT #{p.slotNumber}
                          </span>
                          <span className="text-xs font-mono text-amber-300 font-bold">
                            LV. {p.playerLevel}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateStr}
                        </span>
                      </div>

                      {/* Main card info */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white bg-neutral-900 shrink-0 shadow-md">
                          <AnimePortrait
                            characterId={leadHero?.id || 'renald'}
                            emotion="determined"
                            size="sm"
                          />
                        </div>

                        <div className="overflow-hidden flex-1">
                          <h3 className="font-bebas text-2xl text-white tracking-wider font-bold truncate">
                            {p.playerName}
                          </h3>
                          <p className="text-[11px] font-mono text-neutral-400">
                            {leadHero?.alias || 'Penyelidik Ghaib'}
                          </p>

                          <div className="flex items-center gap-3 text-xs font-mono text-neutral-300 mt-1">
                            <span className="text-yellow-400 font-bold">
                              💎 {p.spiritGems} Token
                            </span>
                            <span className="text-neutral-400">
                              🔮 {p.ownedSpirits?.length || 0} Roh
                            </span>
                            <span className="text-blue-400 font-bold">
                              {p.unlockedChapterId === 'chap_0' ? 'Bab Pembuka' : 'Koridor Lanjutan'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                        <button
                          onClick={() => handleSelectProfile(p)}
                          className="flex-1 bg-[#FF0033] hover:bg-red-600 text-black font-bebas text-lg py-2 rounded border border-white skew-x-[-10deg] shadow-lg font-black tracking-wider transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-black transform skew-x-[10deg]" />
                          <span className="transform skew-x-[10deg]">LANJUT BERMAIN</span>
                        </button>

                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteProfile(p.id)}
                              className="bg-red-700 hover:bg-red-800 text-white font-mono text-xs px-2.5 py-2 rounded border border-white font-bold cursor-pointer"
                            >
                              HAPUS!
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-neutral-800 text-neutral-300 font-mono text-xs px-2 py-2 rounded cursor-pointer"
                            >
                              BATAL
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 p-2 rounded border border-neutral-700 transition-colors cursor-pointer"
                            title="Hapus slot ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CREATE NEW PROFILE FORM                                          */}
        {/* ========================================================================= */}
        {activeTab === 'create' && (
          <form
            onSubmit={handleCreateNewAccount}
            className="bg-[#121217]/95 border-2 border-[#FF0033]/80 rounded-xl p-5 sm:p-7 shadow-2xl max-w-2xl mx-auto backdrop-blur-md relative overflow-hidden"
          >
            <div className="border-b-2 border-neutral-800 pb-3 mb-5">
              <h2 className="font-bebas text-3xl text-white tracking-wider flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-[#FF0033]" />
                REGISTRASI KONTRAK JIWA BARU
              </h2>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Tentukan identitas penyelidik dan berkah roh pelindung pertamamu.
              </p>
            </div>

            {/* Step 1: Player Name Input */}
            <div className="mb-5">
              <label className="block text-xs font-mono text-neutral-300 uppercase tracking-widest font-bold mb-1.5">
                1. NAMA PENYELIDIK / KODE PANGGILAN
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={18}
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  placeholder="Masukkan nama karaktermu..."
                  className="w-full bg-black/90 border-2 border-neutral-700 focus:border-[#FF0033] text-white px-4 py-3 rounded font-bebas text-2xl tracking-wider outline-none transition-colors shadow-inner"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
                  {playerName.length}/18
                </span>
              </div>
            </div>

            {/* Step 2: Choose Lead Character */}
            <div className="mb-5">
              <label className="block text-xs font-mono text-neutral-300 uppercase tracking-widest font-bold mb-2">
                2. PILIH KARAKTER UTAMA (LEAD PROTAGONIST)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LEAD_HERO_OPTIONS.map(hero => {
                  const isSelected = selectedHeroId === hero.id;
                  return (
                    <div
                      key={hero.id}
                      onClick={() => {
                        audioService.playClick();
                        setSelectedHeroId(hero.id);
                        if (!playerName || playerName === 'Renald' || playerName === 'Maya' || playerName === 'Bagas' || playerName === 'Gilang') {
                          setPlayerName(hero.name);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#FF0033] bg-[#1d0e12] ring-2 ring-[#FF0033]/50 scale-[1.02] shadow-lg'
                          : 'border-neutral-800 bg-black/60 hover:border-neutral-600'
                      }`}
                    >
                      <div className="w-12 h-12 rounded overflow-hidden border border-white shrink-0 bg-neutral-900">
                        <AnimePortrait characterId={hero.id} emotion="normal" size="sm" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="font-bebas text-xl text-white tracking-wide">
                            {hero.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF0033]" />}
                        </div>
                        <span className="text-[10px] font-mono text-[#FF0033] font-bold block uppercase truncate">
                          {hero.alias}
                        </span>
                        <p className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                          {hero.tag}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Starter Spirit Blessing */}
            <div className="mb-6">
              <label className="block text-xs font-mono text-neutral-300 uppercase tracking-widest font-bold mb-2">
                3. PILIH BERKAH ROH PELINDUNG PERTAMA
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Agni */}
                <div
                  onClick={() => {
                    audioService.playClick();
                    setSelectedElement('Agni');
                  }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedElement === 'Agni'
                      ? 'border-[#FF0033] bg-red-950/40 ring-1 ring-[#FF0033]'
                      : 'border-neutral-800 bg-black/60 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ElementBadge element="Agni" size="sm" />
                    <span className="font-bebas text-base text-white">GARUDA HAYAM</span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-300 leading-tight">
                    Daya serang tinggi berelemen api panas. Mengoyak pertahanan arwah hitam.
                  </p>
                </div>

                {/* Tirta */}
                <div
                  onClick={() => {
                    audioService.playClick();
                    setSelectedElement('Tirta');
                  }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedElement === 'Tirta'
                      ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400'
                      : 'border-neutral-800 bg-black/60 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ElementBadge element="Tirta" size="sm" />
                    <span className="font-bebas text-base text-white">NYAI CANDRA</span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-300 leading-tight">
                    Membekukan gerak musuh dan memberikan ketenangan pemulihan sukma.
                  </p>
                </div>

                {/* Vidyut */}
                <div
                  onClick={() => {
                    audioService.playClick();
                    setSelectedElement('Vidyut');
                  }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedElement === 'Vidyut'
                      ? 'border-yellow-400 bg-amber-950/40 ring-1 ring-yellow-400'
                      : 'border-neutral-800 bg-black/60 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ElementBadge element="Vidyut" size="sm" />
                    <span className="font-bebas text-base text-white">BHARATA PETIR</span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-300 leading-tight">
                    Hentakan guntur cepat dengan peluang melumpuhkan musuh seketika.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-400">
                Bonus Awal: <strong className="text-yellow-400">+150 Token Gacha</strong>
              </span>

              <button
                type="submit"
                className="bg-[#FF0033] hover:bg-red-600 text-black font-bebas text-2xl px-8 py-3 rounded border-2 border-white skew-x-[-12deg] shadow-xl font-black tracking-wider transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <span className="transform skew-x-[12deg] flex items-center gap-2">
                  MULAI PETUALANGAN GHAIB &rarr;
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: BACKUP / RESTORE JSON                                            */}
        {/* ========================================================================= */}
        {activeTab === 'backup' && (
          <div className="bg-[#121217]/95 border-2 border-neutral-700 rounded-xl p-6 max-w-xl mx-auto shadow-2xl">
            <h3 className="font-bebas text-2xl text-white tracking-wider flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-yellow-400" />
              CADANGAN & EKSPOR DATA AKUN
            </h3>
            <p className="text-xs font-mono text-neutral-400 mb-4 leading-relaxed">
              Kamu bisa menyalin kode data tersimpan di sini untuk dicadangkan atau dipindahkan ke perangkat lain.
            </p>

            {importStatus && (
              <div className="bg-[#FF0033]/20 border border-[#FF0033] text-yellow-300 font-mono text-xs p-2.5 rounded mb-3">
                {importStatus}
              </div>
            )}

            <textarea
              value={backupText}
              onChange={e => setBackupText(e.target.value)}
              placeholder="Tempelkan data JSON tersimpan di sini untuk mengimpor..."
              className="w-full h-32 bg-black/90 border border-neutral-700 text-neutral-200 font-mono text-xs p-3 rounded mb-4 outline-none focus:border-[#FF0033]"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs py-2.5 rounded border border-neutral-600 font-bold cursor-pointer transition-colors"
              >
                EKSPOR / SALIN SEMUA DATA
              </button>
              <button
                type="button"
                onClick={handleImportBackup}
                className="flex-1 bg-[#FF0033] hover:bg-red-600 text-black font-mono text-xs py-2.5 rounded border border-white font-black cursor-pointer transition-colors"
              >
                IMPOR DATA DARI TEKS
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer Credits */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto text-center border-t border-neutral-900 pt-3 text-[11px] font-mono text-neutral-500">
        Bhawana Phantom RPG &bull; Persona 5X Homage &bull; Data tersimpan aman di perambanmu (LocalStorage)
      </footer>
    </div>
  );
};
