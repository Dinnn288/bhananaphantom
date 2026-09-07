import React from 'react';

interface AnimePortraitProps {
  characterId: string;
  name?: string;
  emotion?: 'normal' | 'shock' | 'determined' | 'smirk' | 'fear' | 'whisper';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isCutin?: boolean;
}

export const AnimePortrait: React.FC<AnimePortraitProps> = ({
  characterId,
  emotion = 'normal',
  size = 'md',
  isCutin = false
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52'
  };

  // SVG-based expressive anime portraits with crisp details
  if (characterId === 'renald' || characterId.includes('Renald')) {
    return (
      <div className={`relative overflow-hidden rounded-md border-2 border-red-600 bg-gradient-to-b from-neutral-900 to-black ${sizeMap[size]} ${isCutin ? 'skew-x-[-8deg]' : ''}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Background Crimson aura */}
          <radialGradient id="renaldAura" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </radialGradient>
          <rect width="120" height="120" fill="url(#renaldAura)" />

          {/* School Uniform Collar */}
          <path d="M 35 120 L 50 85 L 70 85 L 85 120 Z" fill="#1e1e24" />
          <path d="M 50 85 L 60 105 L 70 85 Z" fill="#ffffff" />
          <polygon points="56,92 64,92 62,110 58,110" fill="#dc2626" />

          {/* Face & Neck */}
          <polygon points="52,78 68,78 65,95 55,95" fill="#fbcfe8" />
          <path d="M 38 45 Q 60 85 82 45 Q 82 30 60 25 Q 38 30 38 45 Z" fill="#fed7aa" />

          {/* Eyes based on emotion */}
          {emotion === 'fear' || emotion === 'shock' ? (
            <g>
              {/* Wide shock eyes */}
              <ellipse cx="49" cy="50" rx="6" ry="7" fill="#ffffff" />
              <ellipse cx="71" cy="50" rx="6" ry="7" fill="#ffffff" />
              <circle cx="49" cy="50" r="3" fill="#dc2626" />
              <circle cx="71" cy="50" r="3" fill="#dc2626" />
              <circle cx="50" cy="48" r="1" fill="#ffffff" />
              <circle cx="72" cy="48" r="1" fill="#ffffff" />
            </g>
          ) : emotion === 'smirk' ? (
            <g>
              {/* Confident smirking eyes */}
              <path d="M 44 48 Q 50 44 56 49" stroke="#b91c1c" strokeWidth="2.5" fill="none" />
              <path d="M 64 49 Q 70 44 76 48" stroke="#b91c1c" strokeWidth="2.5" fill="none" />
              <circle cx="50" cy="51" r="3.5" fill="#ef4444" />
              <circle cx="70" cy="51" r="3.5" fill="#ef4444" />
            </g>
          ) : (
            <g>
              {/* Sharp determined eyes */}
              <polygon points="44,48 55,45 54,54 44,52" fill="#ffffff" />
              <polygon points="76,48 65,45 66,54 76,52" fill="#ffffff" />
              <circle cx="49" cy="50" r="3.5" fill="#dc2626" />
              <circle cx="71" cy="50" r="3.5" fill="#dc2626" />
              <circle cx="51" cy="49" r="1.2" fill="#ffffff" />
              <circle cx="73" cy="49" r="1.2" fill="#ffffff" />
              {/* Eyebrows */}
              <path d="M 43 43 L 56 46" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 77 43 L 64 46" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* Mouth */}
          {emotion === 'determined' || emotion === 'shock' ? (
            <path d="M 54 68 L 66 68 L 60 73 Z" fill="#991b1b" stroke="#000" strokeWidth="1" />
          ) : emotion === 'smirk' ? (
            <path d="M 54 68 Q 63 71 67 65" stroke="#7f1d1d" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <line x1="56" y1="67" x2="64" y2="67" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Anime Hair: Spiky black & crimson tips */}
          <path d="M 32 45 Q 22 25 45 18 Q 60 10 75 18 Q 98 25 88 45 Q 85 28 72 26 Q 80 40 76 52 Q 68 35 60 48 Q 52 35 44 52 Q 40 40 48 26 Q 35 28 32 45 Z" fill="#18181b" />
          <path d="M 36 28 L 48 20 L 44 32 Z" fill="#dc2626" />
          <path d="M 74 20 L 84 30 L 75 32 Z" fill="#dc2626" />

          {/* Crow Feathers Motif */}
          <path d="M 15 80 Q 25 70 30 85" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.6" />
        </svg>
        <div className="absolute bottom-0 right-0 bg-red-600 text-white font-bebas px-1 text-[11px] tracking-wider">
          RENALD
        </div>
      </div>
    );
  }

  if (characterId === 'maya' || characterId.includes('Maya')) {
    return (
      <div className={`relative overflow-hidden rounded-md border-2 border-cyan-400 bg-gradient-to-b from-neutral-900 to-black ${sizeMap[size]} ${isCutin ? 'skew-x-[-8deg]' : ''}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <radialGradient id="mayaAura" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </radialGradient>
          <rect width="120" height="120" fill="url(#mayaAura)" />

          {/* Sailor uniform collar with ribbon */}
          <path d="M 35 120 L 50 88 L 70 88 L 85 120 Z" fill="#0f172a" />
          <path d="M 45 92 L 60 110 L 75 92 Z" fill="#ffffff" />
          <polygon points="55,95 65,95 63,115 57,115" fill="#06b6d4" />

          {/* Face & Neck */}
          <polygon points="53,78 67,78 64,95 56,95" fill="#fce7f3" />
          <path d="M 40 46 Q 60 82 80 46 Q 80 32 60 28 Q 40 32 40 46 Z" fill="#fed7aa" />

          {/* Eyes: Turquoise blue */}
          <ellipse cx="50" cy="52" rx="5" ry="6" fill="#ffffff" />
          <ellipse cx="70" cy="52" rx="5" ry="6" fill="#ffffff" />
          <circle cx="50" cy="52" r="3" fill="#06b6d4" />
          <circle cx="70" cy="52" r="3" fill="#06b6d4" />
          <circle cx="51" cy="50" r="1" fill="#ffffff" />
          <circle cx="71" cy="50" r="1" fill="#ffffff" />
          {/* Eyebrows */}
          <path d="M 44 45 Q 50 43 56 46" stroke="#0e7490" strokeWidth="1.8" fill="none" />
          <path d="M 76 45 Q 70 43 64 46" stroke="#0e7490" strokeWidth="1.8" fill="none" />

          {/* Lips */}
          <path d="M 57 68 Q 60 70 63 68" stroke="#be185d" strokeWidth="1.5" fill="none" />

          {/* Long dark blue hair with bangs & hairpin */}
          <path d="M 28 65 Q 26 25 50 18 Q 60 15 70 18 Q 94 25 92 65 Q 92 90 85 110 L 78 70 Q 72 40 60 48 Q 48 40 42 70 L 35 110 Q 28 90 28 65 Z" fill="#0f172a" />
          {/* Cyan hair highlight ribbon */}
          <line x1="38" y1="35" x2="48" y2="35" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-0 right-0 bg-cyan-600 text-white font-bebas px-1 text-[11px] tracking-wider">
          MAYA
        </div>
      </div>
    );
  }

  if (characterId === 'bagas' || characterId.includes('Bagas')) {
    return (
      <div className={`relative overflow-hidden rounded-md border-2 border-amber-400 bg-gradient-to-b from-neutral-900 to-black ${sizeMap[size]} ${isCutin ? 'skew-x-[-8deg]' : ''}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <radialGradient id="bagasAura" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </radialGradient>
          <rect width="120" height="120" fill="url(#bagasAura)" />

          {/* Athletic sleeveless shirt */}
          <path d="M 30 120 L 45 88 L 75 88 L 90 120 Z" fill="#292524" />
          <path d="M 48 88 L 60 108 L 72 88 Z" fill="#f59e0b" />

          {/* Muscular Neck & Face */}
          <polygon points="50,78 70,78 68,95 52,95" fill="#fde68a" />
          <path d="M 36 48 Q 60 88 84 48 Q 84 32 60 26 Q 36 32 36 48 Z" fill="#fde68a" />

          {/* Yellow Headband */}
          <path d="M 34 38 L 86 38 L 85 46 L 35 46 Z" fill="#f59e0b" />
          <polygon points="57,40 63,40 60,45" fill="#ffffff" />

          {/* Determined eyes with scar */}
          <polygon points="42,52 54,48 52,56 42,54" fill="#ffffff" />
          <polygon points="78,52 66,48 68,56 78,54" fill="#ffffff" />
          <circle cx="48" cy="52" r="3.5" fill="#b45309" />
          <circle cx="72" cy="52" r="3.5" fill="#b45309" />
          <line x1="68" y1="45" x2="74" y2="58" stroke="#dc2626" strokeWidth="1.5" />

          {/* Smirking mouth */}
          <path d="M 52 70 Q 62 76 68 68" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Spiky textured cropped hair */}
          <path d="M 34 38 Q 30 15 60 14 Q 90 15 86 38 Q 78 26 68 28 Q 60 22 52 28 Q 42 26 34 38 Z" fill="#1c1917" />
        </svg>
        <div className="absolute bottom-0 right-0 bg-amber-600 text-black font-bebas px-1 text-[11px] font-bold tracking-wider">
          BAGAS
        </div>
      </div>
    );
  }

  // Gilang / Garuda Hayam spirit portrait
  if (characterId === 'gilang' || characterId.includes('Gilang') || characterId.includes('Garuda')) {
    return (
      <div className={`relative overflow-hidden rounded-md border-2 border-amber-400 bg-gradient-to-b from-neutral-900 to-black ${sizeMap[size]} ${isCutin ? 'skew-x-[-8deg]' : ''}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <radialGradient id="gilangAura" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0.9" />
          </radialGradient>
          <rect width="120" height="120" fill="url(#gilangAura)" />
          {/* Ethereal wings silhouette in background */}
          <path d="M 15 45 Q 35 15 55 35 Q 25 55 15 45 Z" fill="#f59e0b" opacity="0.4" />
          <path d="M 105 45 Q 85 15 65 35 Q 95 55 105 45 Z" fill="#f59e0b" opacity="0.4" />
          {/* School Uniform Vintage 1998 */}
          <path d="M 32 120 L 50 85 L 70 85 L 88 120 Z" fill="#1e1b4b" />
          <path d="M 50 85 L 60 102 L 70 85 Z" fill="#ffffff" />
          <polygon points="56,90 64,90 62,108 58,108" fill="#d97706" />
          {/* Face */}
          <polygon points="52,76 68,76 65,92 55,92" fill="#fde68a" />
          <path d="M 38 42 Q 60 82 82 42 Q 82 28 60 22 Q 38 28 38 42 Z" fill="#fed7aa" />
          {/* Calm & Majestic Eyes */}
          <polygon points="44,48 55,45 54,53 44,51" fill="#ffffff" />
          <polygon points="76,48 65,45 66,53 76,51" fill="#ffffff" />
          <circle cx="49" cy="49" r="3.2" fill="#f59e0b" />
          <circle cx="71" cy="49" r="3.2" fill="#f59e0b" />
          <circle cx="50" cy="48" r="1.2" fill="#ffffff" />
          <circle cx="72" cy="48" r="1.2" fill="#ffffff" />
          {/* Gentle warm smile */}
          <path d="M 54 66 Q 60 70 66 66" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Flowing golden-streaked black hair */}
          <path d="M 32 42 Q 25 20 48 14 Q 60 10 72 14 Q 95 20 88 42 Q 82 25 70 22 Q 78 35 74 48 Q 66 32 60 42 Q 54 32 46 48 Q 42 35 48 22 Q 38 25 32 42 Z" fill="#1c1917" />
          <path d="M 36 24 L 46 16 L 42 28 Z" fill="#fbbf24" />
          <path d="M 74 16 L 84 24 L 75 28 Z" fill="#fbbf24" />
        </svg>
        <div className="absolute bottom-0 right-0 bg-amber-500 text-black font-bebas px-1.5 text-[11px] font-bold tracking-wider">
          GILANG (ROH)
        </div>
      </div>
    );
  }

  // Soedjarwo / Batara Kala portrait
  if (characterId === 'soedjarwo' || characterId.includes('Soedjarwo') || characterId.includes('Kala')) {
    return (
      <div className={`relative overflow-hidden rounded-md border-2 border-red-700 bg-gradient-to-b from-neutral-950 to-black ${sizeMap[size]} ${isCutin ? 'skew-x-[-8deg]' : ''}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <radialGradient id="soedjarwoAura" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#991b1b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
          </radialGradient>
          <rect width="120" height="120" fill="url(#soedjarwoAura)" />
          {/* Black sinister trenchcoat/suit */}
          <path d="M 28 120 L 46 82 L 74 82 L 92 120 Z" fill="#18181b" />
          <path d="M 48 84 L 60 106 L 72 84 Z" fill="#7f1d1d" />
          {/* Wrinkled sinister Face */}
          <polygon points="50,74 70,74 66,90 54,90" fill="#e5e7eb" />
          <path d="M 36 44 Q 60 84 84 44 Q 84 26 60 22 Q 36 26 36 44 Z" fill="#e5e7eb" />
          {/* Sinister Red Glasses with Glare */}
          <rect x="40" y="44" width="16" height="10" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="64" y="44" width="16" height="10" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="56" y1="48" x2="64" y2="48" stroke="#ef4444" strokeWidth="2" />
          <line x1="42" y1="46" x2="48" y2="52" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="66" y1="46" x2="72" y2="52" stroke="#ffffff" strokeWidth="1.5" />
          {/* Diabolical Grin */}
          <path d="M 48 68 Q 60 78 72 68" stroke="#991b1b" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Slicked-back grey hair */}
          <path d="M 34 38 Q 30 18 60 16 Q 90 18 86 38 Q 80 24 60 22 Q 40 24 34 38 Z" fill="#52525b" />
        </svg>
        <div className="absolute bottom-0 right-0 bg-red-800 text-white font-bebas px-1.5 text-[11px] font-bold tracking-wider">
          SOEDJARWO
        </div>
      </div>
    );
  }

  // Utusan Sindikat 9 Gerbang (Season 2 shadowy harbinger)
  if (characterId === 'sindikat' || characterId === 'utusan' || characterId.includes('Sindikat') || characterId.includes('Utusan') || characterId.includes('Bayangan')) {
    return (
      <div className={`relative overflow-hidden rounded-md border-2 border-purple-600 bg-gradient-to-b from-neutral-950 to-black ${sizeMap[size]} ${isCutin ? 'skew-x-[-8deg]' : ''}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <radialGradient id="sindikatAura" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
          </radialGradient>
          <rect width="120" height="120" fill="url(#sindikatAura)" />
          {/* Dark Silhouette Suit & Red Tie */}
          <path d="M 28 120 L 46 80 L 74 80 L 92 120 Z" fill="#09090b" />
          <polygon points="56,86 64,86 62,112 58,112" fill="#9333ea" />
          {/* Fedora Hat brim */}
          <ellipse cx="60" cy="42" rx="38" ry="12" fill="#18181b" />
          <path d="M 38 42 Q 40 20 60 18 Q 80 20 82 42 Z" fill="#09090b" />
          <rect x="42" y="34" width="36" height="4" fill="#a855f7" />
          {/* Mysterious glowing purple eye in shadow */}
          <ellipse cx="60" cy="56" rx="20" ry="24" fill="#030712" />
          <circle cx="53" cy="56" r="3" fill="#c084fc" />
          <circle cx="67" cy="56" r="3" fill="#c084fc" />
          <circle cx="53" cy="56" r="1" fill="#ffffff" />
          <circle cx="67" cy="56" r="1" fill="#ffffff" />
          {/* Subtle knowing smirk */}
          <path d="M 54 70 Q 60 73 66 70" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-0 right-0 bg-purple-700 text-white font-bebas px-1.5 text-[11px] font-bold tracking-wider">
          UTUSAN GERBANG
        </div>
      </div>
    );
  }

  // Generic Spirit or Entity Avatar
  return (
    <div className={`relative overflow-hidden rounded-md border-2 border-red-500 bg-neutral-950 flex items-center justify-center ${sizeMap[size]}`}>
      <span className="font-bebas text-xl text-red-400">{characterId.slice(0, 3).toUpperCase()}</span>
    </div>
  );
};
