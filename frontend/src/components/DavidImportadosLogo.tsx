'use client'

interface DavidImportadosLogoProps {
  width?: number
  height?: number
  className?: string
}

export default function DavidImportadosLogo({ 
  width = 60, 
  height = 80, 
  className = "" 
}: DavidImportadosLogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Perfume Bottle SVG */}
      <svg 
        width={width} 
        height={height * 0.7} 
        viewBox="0 0 200 280" 
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="bottleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#D4AF37', stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:'#FFD700', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#B8860B', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="bottleLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#FFFEF7', stopOpacity:0.9}} />
            <stop offset="100%" style={{stopColor:'#FFF8DC', stopOpacity:0.7}} />
          </linearGradient>
        </defs>
        
        {/* Bottle Cap */}
        <ellipse cx="100" cy="30" rx="35" ry="15" fill="url(#bottleGold)" stroke="#B8860B" strokeWidth="2"/>
        <rect x="88" y="35" width="24" height="15" fill="url(#bottleGold)" stroke="#B8860B" strokeWidth="1.5"/>
        
        {/* Bottle Neck */}
        <rect x="92" y="50" width="16" height="25" fill="url(#bottleGold)" stroke="#B8860B" strokeWidth="1"/>
        
        {/* Main Bottle Body */}
        <rect x="75" y="75" width="50" height="80" rx="6" ry="6" fill="url(#bottleGold)" stroke="#B8860B" strokeWidth="2"/>
        
        {/* Inner Liquid */}
        <rect x="78" y="78" width="44" height="74" rx="4" ry="4" fill="url(#bottleLight)"/>
        
        {/* Bottle Details */}
        <rect x="82" y="85" width="36" height="2" fill="url(#bottleGold)"/>
        <rect x="90" y="95" width="20" height="12" fill="url(#bottleGold)" opacity="0.6" rx="2"/>
        <rect x="82" y="125" width="36" height="12" fill="url(#bottleGold)" rx="2"/>
        
        {/* Label Frame */}
        <rect x="80" y="160" width="40" height="20" fill="none" stroke="url(#bottleGold)" strokeWidth="1.5" rx="2"/>
        
        {/* Bottom Base */}
        <rect x="70" y="155" width="60" height="25" rx="8" ry="8" fill="url(#bottleGold)" stroke="#B8860B" strokeWidth="2"/>
      </svg>
      
      {/* Text Logo */}
      <div className="text-center mt-2">
        <div className="font-serif font-bold text-2xl text-black tracking-tight">
          David
        </div>
        <div className="font-serif font-light text-sm text-amber-600 tracking-[0.2em] uppercase">
          Importados
        </div>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1"></div>
        <div className="font-serif font-light text-xs text-gray-600 tracking-[0.15em] uppercase mt-1">
          Perfumaria
        </div>
      </div>
    </div>
  )
}