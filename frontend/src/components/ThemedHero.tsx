'use client'

import { useState, useEffect } from 'react'
import { usePageTheme } from '@/utils/themes'
import Breadcrumbs, { useBreadcrumbs, BreadcrumbItem } from './Breadcrumbs'

interface ThemedHeroProps {
  title: string
  description: string
  breadcrumbs?: BreadcrumbItem[]
  children?: React.ReactNode
  theme?: any
}

export default function ThemedHero({ title, description, breadcrumbs, children, theme: propTheme }: ThemedHeroProps) {
  const hookTheme = usePageTheme()
  const [mounted, setMounted] = useState(false)
  const autoBreadcrumbs = useBreadcrumbs()
  
  // Usar tema passado como prop ou do hook
  const currentTheme = propTheme || hookTheme
  
  // Usar breadcrumbs passados como props ou gerar automaticamente
  const finalBreadcrumbs = breadcrumbs || autoBreadcrumbs

  useEffect(() => {
    setMounted(true)
  }, [])

  // Renderização consistente no servidor e cliente
  if (!mounted) {
    return (
      <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            {title}
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto mb-8">
            {description}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br ${currentTheme.primary} text-white py-16 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 border border-white/25 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 border border-white/15 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
          {title}
        </h1>
        <p className="text-xl font-light max-w-2xl mx-auto mb-8">
          {description}
        </p>
        
        {/* Breadcrumbs */}
        {finalBreadcrumbs.length > 1 && (
          <div className="flex justify-center">
            <Breadcrumbs items={finalBreadcrumbs} />
          </div>
        )}

        {/* Additional content */}
        {children}
      </div>
    </div>
  )
}