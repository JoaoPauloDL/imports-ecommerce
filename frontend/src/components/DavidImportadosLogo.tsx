'use client'

import Link from 'next/link'

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
    <div className={`flex items-center ${className}`}>
      <Link href="/" className="flex items-center">
        <span className="text-2xl font-black tracking-tighter text-black">
          DAVID <span className="text-amber-600">IMPORTADOS</span>
        </span>
      </Link>
    </div>
  )
}