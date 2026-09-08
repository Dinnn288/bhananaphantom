import React from 'react';

interface AnimePortraitProps {
  characterId: string;
  name?: string;
  emotion?: 'normal' | 'shock' | 'determined' | 'smirk' | 'fear' | 'whisper';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isCutin?: boolean;
  showMask?: boolean;
}

export const AnimePortrait: React.FC<AnimePortraitProps> = ({
  characterId,
  emotion = 'normal',
  size = 'md',
  isCutin = false,
  showMask = true
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52'
  };

  // Renald Suryakusuma (CROW) - Leader / Agni Flame Striker
  if (characterId === 'renald' || characterId.includes('Renald') || characterId === 'crow') {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg border-2 border-red-500 bg-gradient-to-b from-[#2A0808] via-black to-neutral-950 ${sizeMap[size]} ${
          isCutin ? 'skew-x-[-12deg] shadow-[0_0_25px_rgba(239,68,68,0.6)] ring-2 ring-red-400' : 'shadow-md shadow-red-950/50'
        } transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <radialGradient id="renaldAuraNew" cx="50%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#7f1d1d" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </radialGradient>
            <linearGradient id="renaldBladeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fee2e2" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <filter id="renaldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dynamic Agni Flame Background */}
          <rect width="120" height="120" fill="url(#renaldAuraNew)" />
          
          {/* Flame Embers in background */}
          <circle cx="25" cy="85" r="2.5" fill="#f87171" opacity="0.6" />
          <circle cx="95" cy="70" r="3" fill="#fca5a5" opacity="0.5" />
          <circle cx="80" cy="30" r="2" fill="#ef4444" opacity="0.7" />
          <path d="M 10 115 Q 25 75 40 120 Z" fill="#b91c1c" opacity="0.4" />
          <path d="M 80 120 Q 95 70 110 120 Z" fill="#b91c1c" opacity="0.4" />

          {/* School Uniform Trench / Dark Jacket with Red Trim */}
          <path d="M 28 120 L 46 82 L 74 82 L 92 120 Z" fill="#18181b" />
          <path d="M 46 82 L 60 106 L 74 82 Z" fill="#ffffff" />
          <polygon points="56,88 64,88 62,112 58,112" fill="#ef4444" />
          {/* High collar red accents */}
          <path d="M 32 88 L 46 82 L 40 102 Z" fill="#991b1b" />
          <path d="M 88 88 L 74 82 L 80 102 Z" fill="#991b1b" />

          {/* Neck & Face Structure */}
          <polygon points="52,76 68,76 65,94 55,94" fill="#fde68a" />
          <path d="M 37 44 Q 60 84 83 44 Q 83 28 60 22 Q 37 28 37 44 Z" fill="#fed7aa" />

          {/* CROW's Signature Phantom Mask (Feather-edged domino mask) */}
          {showMask && (
            <g>
              <path 
                d="M 34 45 Q 46 36 60 41 Q 74 36 86 45 Q 82 56 60 52 Q 38 56 34 45 Z" 
                fill="#09090b" 
                stroke="#dc2626" 
                strokeWidth="1.6" 
              />
              {/* Mask Crimson Feathers */}
              <polygon points="34,45 26,40 33,48" fill="#ef4444" />
              <polygon points="86,45 94,40 87,48" fill="#ef4444" />
            </g>
          )}

          {/* Eyes & Fierce Ocular Glare */}
          {emotion === 'fear' || emotion === 'shock' ? (
            <g>
              <ellipse cx="48" cy="47" rx="5" ry="6" fill="#ffffff" />
              <ellipse cx="72" cy="47" rx="5" ry="6" fill="#ffffff" />
              <circle cx="48" cy="47" r="3" fill="#dc2626" />
              <circle cx="72" cy="47" r="3" fill="#dc2626" />
              <circle cx="49" cy="45" r="1" fill="#ffffff" />
              <circle cx="73" cy="45" r="1" fill="#ffffff" />
            </g>
          ) : (
            <g filter="url(#renaldGlow)">
              {/* Determined / Smirk Sharp Glowing Red Eyes */}
              <polygon points="43,47 55,44 54,51 44,50" fill="#ffffff" />
              <polygon points="77,47 65,44 66,51 76,50" fill="#ffffff" />
              <circle cx="49" cy="48" r="3.5" fill="#ef4444" />
              <circle cx="71" cy="48" r="3.5" fill="#ef4444" />
              <circle cx="49" cy="48" r="1.5" fill="#fee2e2" />
              <circle cx="71" cy="48" r="1.5" fill="#fee2e2" />
              {/* Crimson Eye Trail */}
              <path d="M 52 48 Q 58 44 62 46" stroke="#f87171" strokeWidth="1.2" opacity="0.8" />
            </g>
          )}

          {/* Mouth */}
          {emotion === 'smirk' ? (
            <path d="M 53 68 Q 63 72 67 66" stroke="#991b1b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : emotion === 'determined' ? (
            <polygon points="54,67 66,67 60,72" fill="#7f1d1d" stroke="#000" strokeWidth="1" />
          ) : (
            <line x1="55" y1="67" x2="65" y2="67" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Anime Hair: Fierce spiky black hair with blazing crimson tips */}
          <path 
            d="M 32 44 Q 20 22 45 16 Q 60 8 75 16 Q 100 22 88 44 Q 85 27 72 24 Q 81 38 77 50 Q 69 33 60 46 Q 51 33 43 50 Q 39 38 48 24 Q 35 27 32 44 Z" 
            fill="#18181b" 
          />
          {/* Glowing Crimson Hair Strands */}
          <path d="M 35 26 L 48 18 L 43 30 Z" fill="#ef4444" />
          <path d="M 73 18 L 85 28 L 75 30 Z" fill="#ef4444" />
          <path d="M 56 12 L 62 8 L 60 22 Z" fill="#dc2626" />
        </svg>

        {/* Dynamic Name & Alias Badge (Hidden on size xl to never overlap face) */}
        {size !== 'xl' && (
          <div className="absolute bottom-0 right-0 bg-gradient-to-r from-red-800 to-red-600 text-white font-bebas px-1.5 py-0.5 text-[10px] tracking-wider rounded-tl flex items-center gap-1 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
            <span>RENALD // CROW</span>
          </div>
        )}
      </div>
    );
  }

  // Maya Kirana (MIRROR) - Support / Tirta Water & Ice Sage
  if (characterId === 'maya' || characterId.includes('Maya') || characterId === 'mirror') {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg border-2 border-cyan-400 bg-gradient-to-b from-[#06242b] via-black to-neutral-950 ${sizeMap[size]} ${
          isCutin ? 'skew-x-[-12deg] shadow-[0_0_25px_rgba(6,182,212,0.6)] ring-2 ring-cyan-300' : 'shadow-md shadow-cyan-950/50'
        } transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <radialGradient id="mayaAuraNew" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#083344" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </radialGradient>
            <filter id="mayaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ice / Water Aura Background */}
          <rect width="120" height="120" fill="url(#mayaAuraNew)" />
          {/* Ice Shards */}
          <polygon points="20,70 28,60 26,76" fill="#a5f3fc" opacity="0.6" />
          <polygon points="95,50 102,42 98,58" fill="#67e8f9" opacity="0.7" />
          <circle cx="85" cy="85" r="3" fill="#22d3ee" opacity="0.5" />

          {/* Sailor Uniform Collar & Cyan Velvet Ribbon */}
          <path d="M 32 120 L 48 85 L 72 85 L 88 120 Z" fill="#0f172a" />
          <path d="M 44 89 L 60 110 L 76 89 Z" fill="#ffffff" />
          <polygon points="54,92 66,92 63,116 57,116" fill="#06b6d4" />

          {/* Face & Neck */}
          <polygon points="53,76 67,76 64,94 56,94" fill="#fce7f3" />
          <path d="M 39 44 Q 60 82 81 44 Q 81 30 60 26 Q 39 30 39 44 Z" fill="#fed7aa" />

          {/* MIRROR's Venetian Masquerade Filigree Mask */}
          {showMask && (
            <g>
              <path 
                d="M 36 46 Q 48 38 60 43 Q 72 38 84 46 Q 78 55 60 51 Q 42 55 36 46 Z" 
                fill="#083344" 
                stroke="#22d3ee" 
                strokeWidth="1.5" 
              />
              <circle cx="60" cy="47" r="2" fill="#67e8f9" />
            </g>
          )}

          {/* Eyes: Glowing Turquoise Ice Crystal Eyes */}
          <g filter="url(#mayaGlow)">
            <ellipse cx="49" cy="49" rx="5.5" ry="6" fill="#ffffff" />
            <ellipse cx="71" cy="49" rx="5.5" ry="6" fill="#ffffff" />
            <circle cx="49" cy="49" r="3.2" fill="#06b6d4" />
            <circle cx="71" cy="49" r="3.2" fill="#06b6d4" />
            <circle cx="50" cy="47" r="1.3" fill="#ecfeff" />
            <circle cx="72" cy="47" r="1.3" fill="#ecfeff" />
          </g>

          {/* Lips */}
          <path d="M 56 68 Q 60 71 64 68" stroke="#0891b2" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Long Midnight Blue Hair with Bangs & Cyan Crystal Clip */}
          <path 
            d="M 28 65 Q 25 24 50 16 Q 60 13 70 16 Q 95 24 92 65 Q 92 90 85 110 L 78 70 Q 72 38 60 46 Q 48 38 42 70 L 35 110 Q 28 90 28 65 Z" 
            fill="#0f172a" 
          />
          {/* Flowing Cyan Streaks */}
          <path d="M 35 32 Q 44 26 48 40" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 85 32 Q 76 26 72 40" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>

        {/* Dynamic Name & Alias Badge (Hidden on size xl to never overlap face) */}
        {size !== 'xl' && (
          <div className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-800 to-cyan-600 text-white font-bebas px-1.5 py-0.5 text-[10px] tracking-wider rounded-tl flex items-center gap-1 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping" />
            <span>MAYA // MIRROR</span>
          </div>
        )}
      </div>
    );
  }

  // Bagas Perkasa (THUNDER) - Brawler / Vidyut Lightning Tank
  if (characterId === 'bagas' || characterId.includes('Bagas') || characterId === 'thunder') {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg border-2 border-amber-400 bg-gradient-to-b from-[#2b1e06] via-black to-neutral-950 ${sizeMap[size]} ${
          isCutin ? 'skew-x-[-12deg] shadow-[0_0_25px_rgba(245,158,11,0.6)] ring-2 ring-yellow-300' : 'shadow-md shadow-amber-950/50'
        } transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <radialGradient id="bagasAuraNew" cx="50%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#451a03" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </radialGradient>
            <filter id="bagasGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Electric Background with Thunderbolts */}
          <rect width="120" height="120" fill="url(#bagasAuraNew)" />
          <path d="M 20 20 L 35 45 L 28 48 L 40 70" stroke="#fde047" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 100 30 L 85 55 L 92 58 L 80 85" stroke="#fde047" strokeWidth="2" fill="none" opacity="0.6" />

          {/* Muscular Sleeveless Fighter Uniform with Gold Banding */}
          <path d="M 28 120 L 44 85 L 76 85 L 92 120 Z" fill="#292524" />
          <path d="M 46 85 L 60 106 L 74 85 Z" fill="#f59e0b" />

          {/* Muscular Neck & Face */}
          <polygon points="48,76 72,76 69,96 51,96" fill="#fde68a" />
          <path d="M 35 46 Q 60 88 85 46 Q 85 30 60 24 Q 35 30 35 46 Z" fill="#fde68a" />

          {/* THUNDER's High-Voltage Tactical Headband / Visor */}
          {showMask && (
            <g>
              <path d="M 32 36 L 88 36 L 86 46 L 34 46 Z" fill="#d97706" />
              <polygon points="56,38 64,38 60,44" fill="#ffffff" />
              <circle cx="44" cy="41" r="2.5" fill="#fef08a" />
              <circle cx="76" cy="41" r="2.5" fill="#fef08a" />
            </g>
          )}

          {/* Determined Eyes with Battle Scar */}
          <g filter="url(#bagasGlow)">
            <polygon points="40,50 53,46 51,54 41,53" fill="#ffffff" />
            <polygon points="80,50 67,46 69,54 79,53" fill="#ffffff" />
            <circle cx="47" cy="50" r="3.5" fill="#d97706" />
            <circle cx="73" cy="50" r="3.5" fill="#d97706" />
            <circle cx="48" cy="49" r="1.3" fill="#ffffff" />
            <circle cx="74" cy="49" r="1.3" fill="#ffffff" />
          </g>
          {/* Battle Scar over right eye */}
          <line x1="69" y1="42" x2="77" y2="58" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />

          {/* Confident Fighter Smirk */}
          <path d="M 52 70 Q 62 76 70 68" stroke="#78350f" strokeWidth="2.8" fill="none" strokeLinecap="round" />

          {/* Spiky Textured Crop Hair with Thunder Highlights */}
          <path 
            d="M 33 36 Q 28 12 60 10 Q 92 12 87 36 Q 78 22 68 25 Q 60 18 52 25 Q 42 22 33 36 Z" 
            fill="#1c1917" 
          />
          <path d="M 50 14 L 56 6 L 54 20 Z" fill="#fbbf24" />
          <path d="M 66 14 L 72 8 L 68 22 Z" fill="#fbbf24" />
        </svg>

        {/* Dynamic Name & Alias Badge (Hidden on size xl to never overlap face) */}
        {size !== 'xl' && (
          <div className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-bebas px-1.5 py-0.5 text-[10px] font-black tracking-wider rounded-tl flex items-center gap-1 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            <span>BAGAS // THUNDER</span>
          </div>
        )}
      </div>
    );
  }

  // Gilang Suryakusuma (Garuda Hayam Spirit)
  if (characterId === 'gilang' || characterId.includes('Gilang') || characterId.includes('Garuda')) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg border-2 border-amber-400 bg-gradient-to-b from-[#3a2007] via-black to-neutral-950 ${sizeMap[size]} ${
          isCutin ? 'skew-x-[-12deg] shadow-[0_0_25px_rgba(251,191,36,0.7)] ring-2 ring-yellow-400' : 'shadow-md shadow-amber-950/50'
        } transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <radialGradient id="gilangAuraNew" cx="50%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#78350f" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          <rect width="120" height="120" fill="url(#gilangAuraNew)" />
          {/* Ethereal Golden Wings Silhouette */}
          <path d="M 10 45 Q 35 15 55 35 Q 25 60 10 45 Z" fill="#f59e0b" opacity="0.5" />
          <path d="M 110 45 Q 85 15 65 35 Q 95 60 110 45 Z" fill="#f59e0b" opacity="0.5" />

          {/* Vintage 1998 School Uniform with Solar Crest */}
          <path d="M 30 120 L 48 84 L 72 84 L 90 120 Z" fill="#1e1b4b" />
          <path d="M 48 84 L 60 104 L 72 84 Z" fill="#ffffff" />
          <polygon points="55,88 65,88 63,110 57,110" fill="#f59e0b" />

          {/* Face */}
          <polygon points="51,76 69,76 66,94 54,94" fill="#fde68a" />
          <path d="M 37 42 Q 60 82 83 42 Q 83 26 60 20 Q 37 26 37 42 Z" fill="#fed7aa" />

          {/* Calm & Majestic Eyes */}
          <polygon points="43,47 55,44 54,52 44,51" fill="#ffffff" />
          <polygon points="77,47 65,44 66,52 76,51" fill="#ffffff" />
          <circle cx="49" cy="48" r="3.5" fill="#f59e0b" />
          <circle cx="71" cy="48" r="3.5" fill="#f59e0b" />
          <circle cx="50" cy="47" r="1.3" fill="#ffffff" />
          <circle cx="72" cy="47" r="1.3" fill="#ffffff" />

          {/* Gentle, resolute smile */}
          <path d="M 53 66 Q 60 70 67 66" stroke="#92400e" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Flowing Golden-streaked Black Hair */}
          <path 
            d="M 32 42 Q 22 18 48 12 Q 60 8 72 12 Q 98 18 88 42 Q 82 24 70 20 Q 78 35 74 48 Q 66 30 60 42 Q 54 30 46 48 Q 42 35 48 20 Q 38 24 32 42 Z" 
            fill="#1c1917" 
          />
          <path d="M 36 22 L 48 14 L 43 26 Z" fill="#fbbf24" />
          <path d="M 74 14 L 86 22 L 76 26 Z" fill="#fbbf24" />
        </svg>

        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bebas px-1.5 py-0.5 text-[10px] font-black tracking-wider rounded-tl shadow">
          GILANG // GARUDA
        </div>
      </div>
    );
  }

  // Dr. Soedjarwo / Batara Kala Boss
  if (characterId === 'soedjarwo' || characterId.includes('Soedjarwo') || characterId.includes('Kala')) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg border-2 border-red-700 bg-gradient-to-b from-[#3a0707] via-black to-neutral-950 ${sizeMap[size]} ${
          isCutin ? 'skew-x-[-12deg] shadow-[0_0_25px_rgba(220,38,38,0.7)] ring-2 ring-red-600' : 'shadow-md shadow-red-950/60'
        } transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <radialGradient id="soedjarwoAuraNew" cx="50%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#991b1b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#450a0a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          <rect width="120" height="120" fill="url(#soedjarwoAuraNew)" />
          {/* Black Trenchcoat & Blood Tie */}
          <path d="M 28 120 L 46 80 L 74 80 L 92 120 Z" fill="#18181b" />
          <path d="M 48 82 L 60 106 L 72 82 Z" fill="#7f1d1d" />

          {/* Sinister Wrinkled Face */}
          <polygon points="50,74 70,74 66,92 54,92" fill="#e5e7eb" />
          <path d="M 36 44 Q 60 84 84 44 Q 84 24 60 20 Q 36 24 36 44 Z" fill="#e5e7eb" />

          {/* Sinister Red Glasses with Blood Glare */}
          <rect x="39" y="44" width="18" height="11" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
          <rect x="63" y="44" width="18" height="11" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
          <line x1="57" y1="49" x2="63" y2="49" stroke="#ef4444" strokeWidth="2.5" />
          <line x1="41" y1="46" x2="48" y2="53" stroke="#ffffff" strokeWidth="2" />
          <line x1="65" y1="46" x2="72" y2="53" stroke="#ffffff" strokeWidth="2" />

          {/* Diabolical Grin with Sharp Teeth */}
          <path d="M 48 68 Q 60 80 72 68" stroke="#991b1b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <polygon points="58,68 62,68 60,72" fill="#ffffff" />

          {/* Slicked-back Dark Grey Hair */}
          <path d="M 34 38 Q 30 16 60 14 Q 90 16 86 38 Q 80 22 60 20 Q 40 22 34 38 Z" fill="#52525b" />
        </svg>

        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-red-900 to-red-700 text-white font-bebas px-1.5 py-0.5 text-[10px] font-black tracking-wider rounded-tl shadow">
          SOEDJARWO // KALA
        </div>
      </div>
    );
  }

  // Utusan Sindikat 9 Gerbang
  if (characterId === 'sindikat' || characterId === 'utusan' || characterId.includes('Sindikat') || characterId.includes('Utusan') || characterId.includes('Bayangan')) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg border-2 border-purple-600 bg-gradient-to-b from-[#25073a] via-black to-neutral-950 ${sizeMap[size]} ${
          isCutin ? 'skew-x-[-12deg] shadow-[0_0_25px_rgba(147,51,234,0.7)] ring-2 ring-purple-400' : 'shadow-md shadow-purple-950/60'
        } transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <radialGradient id="sindikatAuraNew" cx="50%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#3b0764" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          <rect width="120" height="120" fill="url(#sindikatAuraNew)" />
          {/* Dark Silhouette Suit & Purple Silk Tie */}
          <path d="M 28 120 L 46 80 L 74 80 L 92 120 Z" fill="#09090b" />
          <polygon points="56,86 64,86 62,112 58,112" fill="#9333ea" />

          {/* Fedora Hat */}
          <ellipse cx="60" cy="40" rx="38" ry="12" fill="#18181b" />
          <path d="M 38 40 Q 40 18 60 16 Q 80 18 82 40 Z" fill="#09090b" />
          <rect x="42" y="32" width="36" height="4" fill="#a855f7" />

          {/* Glowing Purple Ocular Shadows */}
          <ellipse cx="60" cy="56" rx="20" ry="24" fill="#030712" />
          <circle cx="52" cy="56" r="3.5" fill="#c084fc" />
          <circle cx="68" cy="56" r="3.5" fill="#c084fc" />
          <circle cx="52" cy="56" r="1.5" fill="#ffffff" />
          <circle cx="68" cy="56" r="1.5" fill="#ffffff" />

          {/* Enigmatic Smirk */}
          <path d="M 53 70 Q 60 74 67 70" stroke="#a855f7" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>

        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-800 to-purple-600 text-white font-bebas px-1.5 py-0.5 text-[10px] font-black tracking-wider rounded-tl shadow">
          UTUSAN GERBANG
        </div>
      </div>
    );
  }

  // Fallback / Unknown Character
  return (
    <div className={`relative overflow-hidden rounded-lg border-2 border-red-500 bg-neutral-950 flex items-center justify-center ${sizeMap[size]}`}>
      <span className="font-bebas text-xl text-red-400">{characterId.slice(0, 3).toUpperCase()}</span>
    </div>
  );
};
