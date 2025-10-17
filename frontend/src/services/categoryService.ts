import React from 'react'

// Sistema de categorias dinâmicas
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  theme: CategoryTheme
  icon?: string
  isActive: boolean
  sortOrder: number
  parentId?: string
  createdAt: string
  updatedAt: string
}

export interface CategoryTheme {
  primary: string
  secondary: string
  accent: string
  text: string
}

// Mock de categorias - futuramente será uma API
const mockCategories: Category[] = [
  {
    id: 'cat-001',
    name: 'Essências Árabes',
    slug: 'arabes',
    description: 'Aromas intensos e luxuosos do Oriente Médio',
    theme: {
      primary: 'from-amber-500 via-amber-600 to-yellow-600',
      secondary: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300',
      accent: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
      text: 'text-amber-700'
    },
    icon: '🏺',
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cat-002',
    name: 'Perfumes Franceses',
    slug: 'franceses',
    description: 'Elegância e sofisticação parisiense',
    theme: {
      primary: 'from-purple-600 via-indigo-600 to-blue-600',
      secondary: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300',
      accent: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
      text: 'text-purple-700'
    },
    icon: '🥐',
    isActive: true,
    sortOrder: 3,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cat-003',
    name: 'Masculinos',
    slug: 'masculinos',
    description: 'Fragrâncias marcantes e elegantes',
    theme: {
      primary: 'from-gray-700 via-gray-800 to-black',
      secondary: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300',
      accent: 'bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900',
      text: 'text-gray-800'
    },
    icon: '👔',
    isActive: true,
    sortOrder: 4,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cat-004',
    name: 'Femininos',
    slug: 'femininos',
    description: 'Delicadeza e sofisticação em cada gota',
    theme: {
      primary: 'from-rose-400 via-pink-500 to-red-400',
      secondary: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-300',
      accent: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
      text: 'text-rose-700'
    },
    icon: '💎',
    isActive: true,
    sortOrder: 5,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
]

// Páginas especiais (não são categorias, mas aparecem no menu)
export const specialPages = {
  ofertas: {
    name: 'Ofertas',
    slug: 'ofertas',
    href: '/offers',
    description: 'Descontos exclusivos e oportunidades limitadas',
    theme: {
      primary: 'from-amber-500 via-orange-500 to-red-500',
      secondary: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300',
      accent: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
      text: 'text-amber-700'
    },
    icon: '✨',
    sortOrder: 1
  }
}

// Função para buscar categorias ativas (simulando API)
export async function getActiveCategories(): Promise<Category[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return mockCategories
    .filter(category => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

// Função para buscar categoria por slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getActiveCategories()
  return categories.find(category => category.slug === slug) || null
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

// Função para construir items de navegação
export function buildNavigationItems(categories: Category[]) {
  const items = [
    // Ofertas sempre primeiro
    {
      name: specialPages.ofertas.name,
      href: specialPages.ofertas.href,
      icon: specialPages.ofertas.icon,
      sortOrder: specialPages.ofertas.sortOrder
    },
    // Categorias dinâmicas
    ...categories.map(category => ({
      name: category.name,
      href: `/products?category=${category.slug}`,
      icon: category.icon,
      sortOrder: category.sortOrder
    }))
  ]

  return items.sort((a, b) => a.sortOrder - b.sortOrder)
}