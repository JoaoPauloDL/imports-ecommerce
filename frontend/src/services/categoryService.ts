import React from 'react'

// Sistema de categorias dinâmicas do BACKEND
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  order: number
  isActive: boolean
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

// Mapa de temas visuais por slug (apenas para estilização)
const categoryThemes: Record<string, {
  primary: string
  secondary: string
  accent: string
  text: string
  icon: string
}> = {
  'ofertas': {
    primary: 'from-amber-500 via-orange-500 to-red-500',
    secondary: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    text: 'text-amber-700',
    icon: '✨'
  },
  'arabes': {
    primary: 'from-amber-500 via-amber-600 to-yellow-600',
    secondary: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300',
    accent: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    text: 'text-amber-700',
    icon: '🏺'
  },
  'franceses': {
    primary: 'from-purple-600 via-indigo-600 to-blue-600',
    secondary: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300',
    accent: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    text: 'text-purple-700',
    icon: '🥐'
  },
  'masculinos': {
    primary: 'from-gray-700 via-gray-800 to-black',
    secondary: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300',
    accent: 'bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900',
    text: 'text-gray-800',
    icon: '👔'
  },
  'femininos': {
    primary: 'from-rose-400 via-pink-500 to-red-400',
    secondary: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-300',
    accent: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
    text: 'text-rose-700',
    icon: '💎'
  }
}

// Função para buscar categorias ativas do BACKEND
export async function getActiveCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
    
    if (!response.ok) {
      console.error('Erro ao buscar categorias:', response.status)
      return []
    }
    
    const data = await response.json()
    const categories = Array.isArray(data) ? data : data.data || []
    
    return categories
      .filter((cat: Category) => cat.isActive)
      .sort((a: Category, b: Category) => a.order - b.order)
  } catch (error) {
    console.error('Erro ao conectar com backend para buscar categorias:', error)
    return []
  }
}

// Função para buscar categoria por slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getActiveCategories()
  return categories.find(category => category.slug === slug) || null
}

// Função para obter tema visual de uma categoria
export function getCategoryTheme(slug: string) {
  return categoryThemes[slug] || categoryThemes['masculinos'] // fallback
}

// Hook para usar categorias
export function useCategories() {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getActiveCategories().then(data => {
      setCategories(data)
      setLoading(false)
    })
  }, [])

  return { categories, loading }
}

// Função para construir items de navegação do navbar
export function buildNavigationItems(categories: Category[]) {
  return categories.map(category => ({
    name: category.name,
    href: `/products?category=${category.slug}`,
    icon: categoryThemes[category.slug]?.icon || '📦',
    sortOrder: category.order
  })).sort((a, b) => a.sortOrder - b.sortOrder)
}