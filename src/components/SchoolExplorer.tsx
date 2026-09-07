import React, { useState } from 'react';
import { EnemyGhost } from '../types';
import { ALL_ENEMIES } from '../data/enemies';
import { audioService } from '../services/audioService';
import { 
  MapPin, 
  Search, 
  Swords, 
  Sparkles, 
  AlertTriangle, 
  FileSearch, 
  KeyRound,
  Eye
} from 'lucide-react';

interface SchoolExplorerProps {
  onTriggerBattle: (enemy: EnemyGhost) => void;
  onFindGems: (amount: number) => void;
  onFindClue: (clueId: string) => void;
  foundClues: string[];
}

interface CorridorLocation {
  id: string;
  name: string;
  floor: string;
  atmosphere: string;
  dangerLevel: 'Rendah' | 'Sedang' | 'Ekstrem';
  enemyPool: string[];
  interactables: {
    id: string;
    label: string;
    type: 'clue' | 'gems' | 'ghost';
    clueId?: string;
    gemsAmount?: number;
    enemyId?: string;
    description: string;
    isInvestigated?: boolean;
  }[];
}

export const SchoolExplorer: React.FC<SchoolExplorerProps> = ({
  onTriggerBattle,
  onFindGems,
  onFindClue,
  foundClues
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('floor1_hall');
  const [investigatedSpots, setInvestigatedSpots] = useState<Set<string>>(new Set());
  const [investigationLog, setInvestigationLog] = useState<string | null>(null);

  const locations: CorridorLocation[] = [
    {
      id: 'floor1_hall',
      name: 'Lorong Utama Sayap Barat',
      floor: 'Lantai 1 - Gedung Lama',
      atmosphere: 'Lantai marmer retak berlumur jelaga hitam. Bau dupa anyir menguar dari celah loker siswa.',
      dangerLevel: 'Sedang',
      enemyPool: ['genderuwo_lorong'],
      interactables: [
        {
          id: 'spot_loker',
          label: 'Loker Siswa Karatan No. 13',
          type: 'gems',
          gemsAmount: 35,
          description: 'Membongkar gembok loker yang diikat kawat berduri... Menemukan 35 Kristal Jiwa terselip di balik buku rapor lama!'
        },
        {
          id: 'spot_mading',
          label: 'Papan Mading Berdebu 1998',
          type: 'clue',
          clueId: 'clue_daftar_tumbal',
          description: 'Di balik poster pentas seni yang menguning, ada sobekan arsip nama-nama murid yang hilang secara misterius!'
        },
        {
          id: 'spot_bayangan',
          label: 'Bayangan Hitam di Sudut Lorong',
          type: 'ghost',
          enemyId: 'genderuwo_lorong',
          description: 'Hawa dingin menusuk tulang! Sesosok Genderuwo bertaring panjang melompat dari balik pilar beton!'
        }
      ]
    },
    {
      id: 'music_room',
      name: 'Ruang Musik Terkutuk',
      floor: 'Lantai 2 - Ujung Koridor',
      atmosphere: 'Suara denting piano terdengar samar meski tidak ada seorang pun di dalam. Cermin besar di dinding dipenuhi rajah darah.',
      dangerLevel: 'Sedang',
      enemyPool: ['kuntilanak_merah', 'boss_clara'],
      interactables: [
        {
          id: 'spot_piano',
          label: 'Piano Grand Antik Berdarah',
          type: 'clue',
          clueId: 'clue_partitur',
          description: 'Membuka penutup tuts piano tua... Menemukan Partitur Sonata Terkutuk 1995 bernoda darah segar!'
        },
        {
          id: 'spot_cermin',
          label: 'Cermin Rias Pecah',
          type: 'gems',
          gemsAmount: 45,
          description: 'Menyentuh pantulan cermin yang bergetar... Kristal Jiwa sebesar 45 butir jatuh dari retakan kaca!'
        },
        {
          id: 'spot_kunti',
          label: 'Kain Merah di Langit-Langit',
          type: 'ghost',
          enemyId: 'kuntilanak_merah',
          description: 'Pekikan tawa melengking menggema! Kuntilanak bergaun merah darah terjun menghunuskan kukunya!'
        }
      ]
    },
    {
      id: 'bio_lab',
      name: 'Laboratorium Biologi Terbengkalai',
      floor: 'Lantai 1 - Sayap Belakang',
      atmosphere: 'Toples-toples kaca berisi awetan janin dan organ membusuk tersusun di rak. Bau formalin pekat menusuk hidung.',
      dangerLevel: 'Ekstrem',
      enemyPool: ['kuyang_ventilasi', 'pocong_berantai', 'boss_anatomi'],
      interactables: [
        {
          id: 'spot_ventilasi',
          label: 'Lubang Ventilasi Berceceran Darah',
          type: 'ghost',
          enemyId: 'kuyang_ventilasi',
          description: 'Kepala terbang melesat keluar dari ventilasi dengan jerohan menggantung berlumur bisa!'
        },
        {
          id: 'spot_brankas_lab',
          label: 'Laci Rahasia Meja Praktikum',
          type: 'clue',
          clueId: 'clue_yayasan',
          description: 'Menemukan amplop cokelat berstempel rahasia yayasan bertanggal 1972!'
        },
        {
          id: 'spot_toples',
          label: 'Toples Berlabel "Subjek 33"',
          type: 'gems',
          gemsAmount: 60,
          description: 'Memecahkan toples kutukan... Membebaskan 60 Kristal Jiwa dari ikatan mantra hitam!'
        }
      ]
    },
    {
      id: 'stairwell_gate',
      name: 'Tangga Darurat Menara Lonceng',
      floor: 'Lantai 3 Menuju Atap',
      atmosphere: 'Anak tangga memutar dalam kegelapan tak berujung. Angin menderu kencang membawa suara lonceng kematian.',
      dangerLevel: 'Ekstrem',
      enemyPool: ['pocong_berantai', 'boss_soedjarwo'],
      interactables: [
        {
          id: 'spot_papan',
          label: 'Papan Lantai Retak',
          type: 'clue',
          clueId: 'clue_jurnal_gilang',
          description: 'Di balik serpihan kayu yang terbakar, terselip Jurnal Sobek Terakhir Gilang Suryakusuma!'
        },
        {
          id: 'spot_pocong',
          label: 'Sosok Berbalut Mori di Anak Tangga',
          type: 'ghost',
          enemyId: 'pocong_berantai',
          description: 'Rantai besi berdenting kencang saat Pocong Berantai mengadang jalan menuju menara!'
        }
      ]
    }
  ];

  const currentLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  const handleInvestigate = (interactable: CorridorLocation['interactables'][0]) => {
    audioService.playClick();
    setInvestigatedSpots(prev => new Set(prev).add(interactable.id));
    setInvestigationLog(interactable.description);

    if (interactable.type === 'gems' && interactable.gemsAmount) {
      audioService.playOneMore();
      onFindGems(interactable.gemsAmount);
    } else if (interactable.type === 'clue' && interactable.clueId) {
      audioService.playCritical();
      onFindClue(interactable.clueId);
    } else if (interactable.type === 'ghost' && interactable.enemyId) {
      const enemy = ALL_ENEMIES[interactable.enemyId];
      if (enemy) {
        setTimeout(() => {
          onTriggerBattle(enemy);
        }, 1200);
      }
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A]/95 border-4 border-[#FF0033] rounded-xl p-4 sm:p-6 shadow-2xl relative select-none artistic-radial-bg overflow-hidden">
      {/* Repeating Red Background Pattern and Atmosphere */}
      <div className="absolute inset-0 artistic-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="border-b-2 border-[#FF0033]/50 pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-[#FF0033] text-black font-black text-xs px-2.5 py-0.5 skew-x-[-12deg] tracking-widest uppercase">
              CAMPUS SHADOWS
            </span>
            <h2 className="font-bebas text-3xl text-white tracking-wider flex items-center gap-2">
              <FileSearch className="w-6 h-6 text-[#FF0033]" />
              EKSPLORASI KORIDOR BERHANTU
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-70">
            Jelajahi sudut-sudut SMA 7 Bhawana untuk mengungkap arsip rahasia dan basmi entitas yang berkeliaran.
          </p>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Column: Corridor Navigation */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block font-bold">
            PILIH AREA INVESTIGASI:
          </span>

          <div className="space-y-2">
            {locations.map(loc => {
              const isSelected = selectedLocationId === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    audioService.playClick();
                    setSelectedLocationId(loc.id);
                    setInvestigationLog(null);
                  }}
                  className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-white bg-[#1A0B0F] border-r-8 border-r-[#FF0033] p5-shadow-red'
                      : 'border-neutral-800 bg-[#121217]/90 hover:border-[#FF0033]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bebas text-xl text-white tracking-wide">
                      {loc.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                        loc.dangerLevel === 'Ekstrem'
                          ? 'bg-[#FF0033] text-black skew-x-[-10deg]'
                          : 'bg-yellow-400 text-black skew-x-[-10deg]'
                      }`}
                    >
                      {loc.dangerLevel}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-300 mt-1 italic">
                    {loc.floor}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Location Atmosphere & Interactables */}
        <div className="lg:col-span-2 bg-[#121217]/95 border-2 border-neutral-800 rounded-lg p-5 flex flex-col justify-between border-l-8 border-l-[#FF0033] shadow-xl">
          <div>
            {/* Atmosphere Header */}
            <div className="border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF0033]" />
                <span className="font-mono text-xs text-[#FF0033] font-bold uppercase tracking-wider">{currentLocation.floor}</span>
              </div>
              <h3 className="font-bebas text-3xl text-white tracking-wide mt-1">
                {currentLocation.name}
              </h3>
              <p className="text-sm font-serif text-neutral-200 italic mt-2 leading-relaxed border-l-4 border-[#FF0033] pl-3 py-1 bg-black/50">
                &ldquo;{currentLocation.atmosphere}&rdquo;
              </p>
            </div>

            {/* Interactive Search Spots */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block font-bold">
                TITIK MENCURIGAKAN (KLIK UNTUK INVESTIGASI):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentLocation.interactables.map(spot => {
                  const isChecked = investigatedSpots.has(spot.id);
                  return (
                    <button
                      key={spot.id}
                      onClick={() => handleInvestigate(spot)}
                      className={`p-3.5 rounded-lg border-2 text-left transition-all skew-x-[-8deg] cursor-pointer ${
                        isChecked
                          ? 'border-neutral-800 bg-black/40 opacity-50 cursor-default'
                          : spot.type === 'ghost'
                          ? 'border-[#FF0033] bg-[#220B10] hover:bg-[#330E17] text-white p5-shadow-red'
                          : 'border-white/50 bg-[#141418] hover:border-white text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 transform skew-x-[8deg]">
                        <span className="font-bebas text-lg text-white tracking-wide flex items-center gap-1.5">
                          {spot.type === 'ghost' ? (
                            <Swords className="w-4 h-4 text-[#FF0033]" />
                          ) : spot.type === 'clue' ? (
                            <KeyRound className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                          )}
                          {spot.label}
                        </span>
                        {isChecked && (
                          <span className="text-[10px] font-mono text-green-400 font-black">
                            SELESAI
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 transform skew-x-[8deg] uppercase tracking-wider">
                        {spot.type === 'ghost'
                          ? 'WASPADA: PERTARUNGAN GHAIB'
                          : spot.type === 'clue'
                          ? 'DOKUMEN RAHASIA TERSEMBUNYI'
                          : 'KRISTAL JIWA TERSEMBUNYI'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Investigation Log Banner */}
          {investigationLog && (
            <div className="bg-black/95 border-2 border-[#FF0033] p-4 rounded text-xs font-mono text-slate-100 flex items-start gap-3 shadow-xl">
              <Eye className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[#FF0033] font-black uppercase tracking-widest block mb-1">HASIL PENELUSURAN:</span>
                <p className="text-neutral-200 leading-relaxed font-sans">{investigationLog}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
