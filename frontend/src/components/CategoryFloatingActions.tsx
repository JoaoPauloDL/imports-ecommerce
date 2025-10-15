'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePageTheme } from '@/utils/themes'

export default function CategoryFloatingActions() {
  const [isOpen, setIsOpen] = useState(false)
  const currentTheme = usePageTheme()

  const quickFilters = [
    { name: 'Ofertas', href: '/offers', icon: '🔥' },
    { name: 'Novos', href: '/products?filter=new', icon: '✨' },
    { name: 'Mais Vendidos', href: '/products?filter=featured', icon: '⭐' },
    { name: 'Árabes', href: '/products?category=arabes', icon: '🏺' },
    { name: 'Franceses', href: '/products?category=franceses', icon: '🥐' },
  ]

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Quick filters */}
      <div className={`space-y-2 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {quickFilters.map((filter, index) => (
          <Link
            key={filter.name}
            href={filter.href}
            className={`flex items-center space-x-3 bg-white ${currentTheme.text} px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className="text-lg">{filter.icon}</span>
            <span className="font-medium text-sm whitespace-nowrap">{filter.name}</span>
          </Link>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${currentTheme.accent} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group`}
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}