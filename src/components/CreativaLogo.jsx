import React from 'react';

/**
 * Official Creativa Brandmark & Logo Component
 * High-definition vector rendering with 3D gradient ribbon 'C' and brilliance sparkle
 */
export function CreativaIcon({ className = "w-8 h-8", size = 32 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="creativaRibbonGrad1" x1="15" y1="20" x2="105" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="28%" stopColor="#0072FF" />
          <stop offset="65%" stopColor="#7D2AE8" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>
        <linearGradient id="creativaRibbonGrad2" x1="85" y1="30" x2="35" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="40%" stopColor="#FF007A" />
          <stop offset="100%" stopColor="#7D2AE8" />
        </linearGradient>
        <linearGradient id="creativaStarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="50%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>
        <filter id="creativaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#7D2AE8" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Main Ribbon Loop 'C' */}
      <g filter="url(#creativaGlow)">
        {/* Outer flowing arc */}
        <path
          d="M 94 38 C 84 20, 62 14, 44 22 C 22 32, 14 58, 22 80 C 31 101, 57 108, 78 102 C 92 98, 102 86, 104 76 C 104 70, 96 68, 92 73 C 84 83, 71 88, 58 86 C 42 83, 33 68, 36 53 C 39 37, 53 28, 68 30 C 78 32, 86 38, 90 46 C 93 51, 100 48, 94 38 Z"
          fill="url(#creativaRibbonGrad1)"
        />
        {/* Inner dynamic highlight ribbon */}
        <path
          d="M 68 30 C 53 28, 39 37, 36 53 C 33 68, 42 83, 58 86 C 66 87, 75 84, 82 78 C 86 74, 91 79, 87 84 C 77 94, 62 97, 48 93 C 30 87, 21 68, 25 50 C 29 32, 47 20, 66 22 C 77 23, 87 29, 93 37 C 97 42, 91 46, 88 43 C 83 37, 76 32, 68 30 Z"
          fill="url(#creativaRibbonGrad2)"
          opacity="0.85"
        />
      </g>

      {/* 4-Point Brilliance Sparkle Star */}
      <g transform="translate(86, 18)">
        <path
          d="M 12 0 C 12 6, 16 10, 22 12 C 16 14, 12 18, 12 24 C 12 18, 8 14, 2 12 C 8 10, 12 6, 12 0 Z"
          fill="url(#creativaStarGrad)"
        />
      </g>
    </svg>
  );
}

export default function CreativaLogo({ className = "h-9 w-auto", showTagline = true }) {
  return (
    <div className={`flex items-center space-x-2 sm:space-x-2.5 select-none ${className}`}>
      <CreativaIcon size={32} className="shrink-0 hover:scale-105 transition-transform" />
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5 leading-none">
          <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 bg-clip-text text-transparent drop-shadow-xs">
            Creativa
          </span>
          <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xs">
            Pro Free
          </span>
        </div>
        {showTagline && (
          <span className="hidden md:inline-block text-[8px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
            Design Without Limits
          </span>
        )}
      </div>
    </div>
  );
}
