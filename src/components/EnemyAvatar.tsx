import React from 'react';

interface EnemyAvatarProps {
  type: string;
  isDown?: boolean;
  isHit?: boolean;
  isRaging?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EnemyAvatar: React.FC<EnemyAvatarProps> = ({
  type,
  isDown = false,
  isHit = false,
  isRaging = false,
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44'
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${sizeMap[size]} ${
        isHit
          ? 'animate-heavy-shake brightness-150 ring-4 ring-[#FF0033] scale-105'
          : isRaging
          ? 'animate-rage-glow border-[#FF0033] ring-2 ring-[#FF0033]'
          : isDown
          ? 'border-yellow-400 rotate-12 scale-95 opacity-80 ring-4 ring-yellow-500/50'
          : 'border-red-900 hover:border-red-500'
      } bg-gradient-to-b from-neutral-950 via-neutral-900 to-black`}
    >
      {isRaging && (
        <div className="absolute top-1 right-1 z-20 bg-[#FF0033] text-black font-black text-[9px] px-1.5 py-0.2 skew-x-[-8deg] uppercase animate-pulse">
          RAGE
        </div>
      )}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Dark Miasma smoke background */}
        <radialGradient id={`ghostFog_${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
        </radialGradient>
        <rect width="100" height="100" fill={`url(#ghostFog_${type})`} />

        {type === 'genderuwo' && (
          <g>
            {/* Furry hulking silhouette */}
            <path d="M 20 90 Q 15 40 40 25 Q 50 18 60 25 Q 85 40 80 90 Z" fill="#262626" />
            <path d="M 28 32 L 20 18 L 36 26 Z" fill="#171717" />
            <path d="M 72 32 L 80 18 L 64 26 Z" fill="#171717" />
            {/* Glowing Red Piercing Eyes */}
            <circle cx="42" cy="42" r="5" fill="#ef4444" className="animate-pulse" />
            <circle cx="58" cy="42" r="5" fill="#ef4444" className="animate-pulse" />
            <circle cx="43" cy="41" r="2" fill="#ffffff" />
            <circle cx="59" cy="41" r="2" fill="#ffffff" />
            {/* Sharp Fangs */}
            <path d="M 38 60 L 42 70 L 46 60 L 50 68 L 54 60 L 58 70 L 62 60 Z" fill="#f5f5f5" />
          </g>
        )}

        {type === 'kuntilanak' && (
          <g>
            {/* Long wild black hair and blood-red robe */}
            <path d="M 30 100 L 40 60 Q 50 55 60 60 L 70 100 Z" fill="#991b1b" />
            <path d="M 20 100 Q 25 30 50 20 Q 75 30 80 100 Q 70 40 50 42 Q 30 40 20 100 Z" fill="#09090b" />
            {/* Pale Face in Shadow */}
            <ellipse cx="50" cy="46" rx="14" ry="16" fill="#e4e4e7" />
            {/* Hollow Black Sockets with Red Tears */}
            <ellipse cx="44" cy="45" rx="3.5" ry="4" fill="#000000" />
            <ellipse cx="56" cy="45" rx="3.5" ry="4" fill="#000000" />
            <line x1="44" y1="49" x2="43" y2="62" stroke="#dc2626" strokeWidth="2" />
            <line x1="56" y1="49" x2="57" y2="62" stroke="#dc2626" strokeWidth="2" />
            {/* Creepy Stitch Smile */}
            <path d="M 40 56 Q 50 62 60 56" stroke="#450a0a" strokeWidth="2" fill="none" />
          </g>
        )}

        {type === 'pocong' && (
          <g>
            {/* Shroud tied at the top with chains */}
            <ellipse cx="50" cy="18" rx="7" ry="5" fill="#e2e8f0" />
            <path d="M 36 22 Q 30 55 35 95 L 65 95 Q 70 55 64 22 Z" fill="#cbd5e1" />
            {/* Black charred face */}
            <circle cx="50" cy="42" r="12" fill="#18181b" />
            {/* Glowing yellow dots */}
            <circle cx="45" cy="40" r="2.5" fill="#facc15" />
            <circle cx="55" cy="40" r="2.5" fill="#facc15" />
            {/* Rusty Iron Chains wrapping */}
            <path d="M 32 50 L 68 58" stroke="#78350f" strokeWidth="3" strokeDasharray="3,3" />
            <path d="M 34 68 L 66 60" stroke="#78350f" strokeWidth="3" strokeDasharray="3,3" />
            <path d="M 33 80 L 67 80" stroke="#78350f" strokeWidth="3" strokeDasharray="3,3" />
          </g>
        )}

        {type === 'kuyang' && (
          <g>
            {/* Floating head with exposed organs */}
            <path d="M 28 45 Q 25 15 50 14 Q 75 15 72 45 Q 68 30 50 28 Q 32 30 28 45 Z" fill="#18181b" />
            <ellipse cx="50" cy="40" rx="14" ry="15" fill="#fecaca" />
            <circle cx="44" cy="38" r="3" fill="#dc2626" />
            <circle cx="56" cy="38" r="3" fill="#dc2626" />
            <path d="M 42 48 Q 50 56 58 48" stroke="#7f1d1d" strokeWidth="2" fill="#450a0a" />
            {/* Hanging Intestines and heart */}
            <path d="M 45 55 Q 40 75 48 95" stroke="#b91c1c" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 55 55 Q 62 70 54 90" stroke="#991b1b" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="49" cy="68" r="7" fill="#7f1d1d" />
          </g>
        )}

        {type === 'banaspati' && (
          <g>
            {/* Fiery skull ball of flames */}
            <circle cx="50" cy="50" r="28" fill="#ea580c" opacity="0.8" />
            <path d="M 50 15 Q 65 30 75 45 Q 85 65 65 80 Q 50 90 35 80 Q 15 65 25 45 Q 35 30 50 15 Z" fill="#f97316" />
            {/* Inner Skull */}
            <circle cx="50" cy="50" r="16" fill="#fef08a" />
            <ellipse cx="43" cy="48" rx="4" ry="5" fill="#451a03" />
            <ellipse cx="57" cy="48" rx="4" ry="5" fill="#451a03" />
            <polygon points="50,53 47,58 53,58" fill="#451a03" />
            <rect x="42" y="62" width="16" height="4" fill="#451a03" />
          </g>
        )}

        {type === 'kepala_sekolah' && (
          <g>
            {/* Corrupted Demon Principal with 1000 ghost hands & eclipse halo */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#dc2626" strokeWidth="3" strokeDasharray="4,2" className="animate-spin" />
            {/* Demonic Horns */}
            <path d="M 32 30 Q 20 10 15 12 Q 22 24 35 34 Z" fill="#991b1b" />
            <path d="M 68 30 Q 80 10 85 12 Q 78 24 65 34 Z" fill="#991b1b" />
            {/* Twisted Old Face */}
            <ellipse cx="50" cy="45" rx="18" ry="20" fill="#404040" />
            {/* Glasses cracked */}
            <rect x="38" y="38" width="10" height="8" rx="2" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <rect x="52" y="38" width="10" height="8" rx="2" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <line x1="48" y1="42" x2="52" y2="42" stroke="#facc15" strokeWidth="1.5" />
            {/* Crimson eyes burning behind glass */}
            <circle cx="43" cy="42" r="2.5" fill="#ef4444" />
            <circle cx="57" cy="42" r="2.5" fill="#ef4444" />
            {/* Evil grin */}
            <path d="M 38 54 Q 50 66 62 54" stroke="#ef4444" strokeWidth="2.5" fill="#1c1917" />
            {/* Shadow robe with 33 red ritual runes */}
            <path d="M 25 100 L 38 65 L 62 65 L 75 100 Z" fill="#09090b" />
            <circle cx="50" cy="78" r="3" fill="#dc2626" />
            <circle cx="42" cy="85" r="2.5" fill="#dc2626" />
            <circle cx="58" cy="85" r="2.5" fill="#dc2626" />
          </g>
        )}
      </svg>

      {isDown && (
        <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center backdrop-blur-[1px]">
          <span className="font-bebas text-2xl text-yellow-300 font-black tracking-widest px-2 py-0.5 bg-black/85 border border-yellow-400 p5-skew shadow-lg">
            DOWN!
          </span>
        </div>
      )}
    </div>
  );
};
