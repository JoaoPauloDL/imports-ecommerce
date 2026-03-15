'use client'

import Link from 'next/link'
import Image from 'next/image'

interface DavidImportadosLogoProps {
  width?: number
  height?: number
  className?: string
  variant?: 'default' | 'light'
}

export default function DavidImportadosLogo({ 
  width = 140, 
  height = 140, 
  className = "",
  variant = 'default'
}: DavidImportadosLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Link href="/" className="flex items-center group">
        <Image
          src="/logo.png"
          alt="David Importados - Perfumaria"
          width={width}
          height={height}
          className="transition-transform duration-300 group-hover:scale-105 object-contain"
          priority
        />
      </Link>
    </div>
  )
}