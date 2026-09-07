import React, { useState } from 'react';
import { ClueDocument } from '../types';
import { CLUE_DOCUMENTS } from '../data/story';
import { audioService } from '../services/audioService';
import { 
  FileText, 
  Lock, 
  FolderLock, 
  Calendar, 
  MapPin, 
  AlertCircle,
  HelpCircle,
  CheckCheck
} from 'lucide-react';

interface ClueArchiveProps {
  unlockedClueIds: string[];
}

export const ClueArchive: React.FC<ClueArchiveProps> = ({ unlockedClueIds }) => {
  const [selectedClueId, setSelectedClueId] = useState<string>(
    unlockedClueIds[0] || 'clue_partitur'
  );

  const clues = CLUE_DOCUMENTS.map(c => ({
    ...c,
    found: unlockedClueIds.includes(c.id) || c.id === 'clue_partitur'
  }));

  const selectedClue = clues.find(c => c.id === selectedClueId) || clues[0];

  return (
    <div className="w-full bg-[#0A0A0A]/95 border-4 border-[#FF0033] rounded-xl p-4 sm:p-6 shadow-2xl relative select-none artistic-radial-bg overflow-hidden">
      {/* Repeating Red Background Pattern and Atmosphere */}
      <div className="absolute inset-0 artistic-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="border-b-2 border-[#FF0033]/50 pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-[#FF0033] text-black font-black text-xs px-2.5 py-0.5 skew-x-[-12deg] tracking-widest uppercase">
              CONFIDENTIAL CLASSIFIED
            </span>
            <h2 className="font-bebas text-3xl text-white tracking-wider flex items-center gap-2">
              <FolderLock className="w-6 h-6 text-[#FF0033]" />
              ARSIP BERKAS RAHASIA 1998
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-1 tracking-widest uppercase opacity-70">
            Kumpulan dokumen rahasia yang mengungkap kronologi tragedi dan asal-usul Roh Pendamping.
          </p>
        </div>

        <div className="bg-[#141418] px-3.5 py-1.5 border-2 border-white skew-x-[-10deg] text-xs font-mono text-neutral-200 flex items-center gap-2 shadow-lg">
          <CheckCheck className="w-4 h-4 text-green-400 transform skew-x-[10deg]" />
          <span className="transform skew-x-[10deg] font-bold uppercase tracking-wider">
            BERKAS: {clues.filter(c => c.found).length} / {clues.length}
          </span>
        </div>
      </div>

      {/* Grid: Left List, Right Document Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Column: File Tabs */}
        <div className="space-y-2.5">
          {clues.map(clue => {
            const isSelected = selectedClue.id === clue.id;
            return (
              <div
                key={clue.id}
                onClick={() => {
                  audioService.playClick();
                  setSelectedClueId(clue.id);
                }}
                className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-white bg-[#1A0B0F] border-r-8 border-r-[#FF0033] p5-shadow-red'
                    : clue.found
                    ? 'border-neutral-800 bg-[#121217]/90 hover:border-[#FF0033]'
                    : 'border-neutral-900 bg-[#09090D] opacity-40 hover:opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber-300 font-bold">
                    {clue.code}
                  </span>
                  {clue.found ? (
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black skew-x-[-10deg] ${
                        clue.importance === 'terlarang'
                          ? 'bg-[#FF0033] text-black'
                          : clue.importance === 'krusial'
                          ? 'bg-yellow-400 text-black'
                          : 'bg-neutral-700 text-white'
                      }`}
                    >
                      {clue.importance}
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                </div>

                <div className="font-bebas text-lg text-white tracking-wide mt-1 truncate">
                  {clue.found ? clue.title : 'DOKUMEN RAHASIA TERKUNCI'}
                </div>

                <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF0033]" />
                  <span className="truncate uppercase font-bold">{clue.location}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Document Reading View */}
        <div className="lg:col-span-2 bg-[#121217]/95 border-2 border-neutral-800 rounded-lg p-6 flex flex-col justify-between border-l-8 border-l-[#FF0033] shadow-xl">
          {selectedClue.found ? (
            <div>
              <div className="border-b border-neutral-800 pb-3 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-[#FF0033] font-black uppercase tracking-widest">
                    ARSIP RESMI: {selectedClue.code}
                  </span>
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-bold">{selectedClue.date}</span>
                  </div>
                </div>

                <h3 className="font-bebas text-3xl text-white tracking-wide">
                  {selectedClue.title}
                </h3>

                <div className="text-xs font-mono text-amber-300 mt-1 flex items-center gap-1.5 italic">
                  <MapPin className="w-3.5 h-3.5 text-[#FF0033]" />
                  <span>Ditemukan di: {selectedClue.location}</span>
                </div>
              </div>

              {/* Excerpt Box */}
              <div className="bg-black/90 border-l-4 border-[#FF0033] p-4 mb-4 shadow-md">
                <div className="text-xs font-mono text-[#FF0033] font-black uppercase tracking-widest mb-1">
                  RINGKASAN CATATAN TERDAHULU:
                </div>
                <p className="text-sm text-neutral-200 italic font-serif leading-relaxed">
                  &ldquo;{selectedClue.excerpt}&rdquo;
                </p>
              </div>

              {/* Full Content */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                  ISI TRANSKRIP LENGKAP:
                </span>
                <p className="text-sm text-neutral-200 leading-relaxed font-sans bg-black/70 p-4 rounded border border-neutral-800">
                  {selectedClue.fullContent}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Lock className="w-14 h-14 text-[#FF0033] mb-3 animate-pulse" />
              <h3 className="font-bebas text-3xl text-white tracking-wide">
                BERKAS BELUM DITEMUKAN
              </h3>
              <p className="text-xs font-mono text-neutral-400 max-w-sm mt-2 leading-relaxed uppercase tracking-wider">
                Jelajahi koridor di menu <span className="text-[#FF0033] font-bold">Eksplorasi Koridor</span> atau selesaikan bab cerita untuk membuka berkas rahasia ini.
              </p>
            </div>
          )}

          {/* Bottom Lore Connection Bar */}
          <div className="border-t border-neutral-800 pt-3 mt-4 text-[11px] font-mono text-neutral-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>
              Petunjuk Misteri: Kumpulkan kelima dokumen untuk memahami sepenuhnya mengapa Gilang mengorbankan diri demi menyelamatkan Renald.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
