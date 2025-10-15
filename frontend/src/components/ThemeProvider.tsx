'use client'

import { useEffect } from 'react'
import { usePageTheme } from '@/utils/themes'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = usePageTheme()

  useEffect(() => {
    // Aplicar CSS custom properties para transições suaves
    const root = document.documentElement
    
    // Extrair cores do tema atual (simplified for demo)
    const themeColors = {
      primary: currentTheme.primary,
      accent: currentTheme.accent,
      text: currentTheme.text
    }

    // Aplicar CSS variables
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    // Adicionar classe para transições suaves
    document.body.classList.add('theme-transition')
    
    return () => {
      document.body.classList.remove('theme-transition')
    }
  }, [currentTheme])

  return <>{children}</>
}