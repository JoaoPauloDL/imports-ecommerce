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
      primary: 'from-amber-400 to-amber-500',
      secondary: 'bg-amber-50 border-amber-200',
      accent: 'bg-amber-500 hover:bg-amber-600',
      text: 'text-amber-600'
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
      primary: 'from-violet-400 to-violet-500',
      secondary: 'bg-violet-50 border-violet-200',
      accent: 'bg-violet-500 hover:bg-violet-600',
      text: 'text-violet-600'
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
      primary: 'from-slate-400 to-slate-500',
      secondary: 'bg-slate-50 border-slate-200',
      accent: 'bg-slate-500 hover:bg-slate-600',
      text: 'text-slate-600'
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
      primary: 'from-rose-400 to-pink-400',
      secondary: 'bg-rose-50 border-rose-200',
      accent: 'bg-rose-400 hover:bg-rose-500',
      text: 'text-rose-500'
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
    description: 'Descontos imperdíveis por tempo limitado',
    theme: {
      primary: 'from-orange-400 to-red-400',
      secondary: 'bg-orange-50 border-orange-200',
      accent: 'bg-orange-500 hover:bg-orange-600',
      text: 'text-orange-600'
    },
    icon: '🔥',
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