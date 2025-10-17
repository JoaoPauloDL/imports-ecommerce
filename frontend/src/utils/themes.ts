import { getActiveCategories, specialPages } from '@/services/categoryService'

// Cache de temas para performance
let themesCache: Record<string, any> = {}
let lastCacheUpdate = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Sistema de temas por categoria/página - Paleta David Importados
export const pageThemes = {
  // Categorias de produtos com gradientes sofisticados
  arabes: {
    primary: 'from-amber-500 via-amber-600 to-yellow-600',
    secondary: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300',
    accent: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    text: 'text-amber-700',
    name: 'Essências Árabes',
    description: 'Aromas intensos e luxuosos do Oriente Médio'
  },
  franceses: {
    primary: 'from-purple-600 via-indigo-600 to-blue-600',
    secondary: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300',
    accent: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    text: 'text-purple-700',
    name: 'Perfumes Franceses',
    description: 'Elegância e sofisticação parisiense'
  },
  masculinos: {
    primary: 'from-gray-700 via-gray-800 to-black',
    secondary: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300',
    accent: 'bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900',
    text: 'text-gray-800',
    name: 'Masculinos',
    description: 'Fragrâncias marcantes e elegantes'
  },
  femininos: {
    primary: 'from-rose-400 via-pink-500 to-red-400',
    secondary: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-300',
    accent: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
    text: 'text-rose-700',
    name: 'Femininos',
    description: 'Delicadeza e sofisticação em cada gota'
  },
  
  // Páginas especiais
  ofertas: {
    primary: 'from-amber-500 via-orange-500 to-red-500',
    secondary: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    text: 'text-amber-700',
    name: 'Ofertas Exclusivas',
    description: 'Descontos exclusivos e oportunidades limitadas'
  },
  lancamentos: {
    primary: 'from-emerald-600 via-teal-600 to-cyan-600',
    secondary: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300',
    accent: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
    text: 'text-emerald-700',
    name: 'Lançamentos',
    description: 'As novidades mais aguardadas'
  },
  
  // Tema padrão - David Importados
  default: {
    primary: 'from-gray-800 via-black to-gray-900',
    secondary: 'bg-gradient-to-br from-gray-50 to-amber-50 border-amber-200',
    accent: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    text: 'text-gray-800',
    name: 'David Importados',
    description: 'Perfumaria de luxo e sofisticação'
  }
}

// Função para construir temas dinamicamente
async function buildDynamicThemes() {
  const now = Date.now()
  
  // Usar cache se ainda válido
  if (themesCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return themesCache
  }

  try {
    const categories = await getActiveCategories()
    const dynamicThemes: Record<string, any> = { ...pageThemes }

    // Adicionar temas das categorias dinâmicas
    categories.forEach(category => {
      dynamicThemes[category.slug] = {
        primary: category.theme.primary,
        secondary: category.theme.secondary,
        accent: category.theme.accent,
        text: category.theme.text,
        name: category.name,
        description: category.description
      }
    })

    // Adicionar páginas especiais
    dynamicThemes.ofertas = {
      primary: specialPages.ofertas.theme.primary,
      secondary: specialPages.ofertas.theme.secondary,
      accent: specialPages.ofertas.theme.accent,
      text: specialPages.ofertas.theme.text,
      name: specialPages.ofertas.name,
      description: specialPages.ofertas.description
    }

    themesCache = dynamicThemes
    lastCacheUpdate = now
    
    return dynamicThemes
  } catch (error) {
    console.warn('Erro ao carregar temas dinâmicos, usando fallback:', error)
    return pageThemes
  }
}

// Hook para obter o tema atual baseado na URL
export function usePageTheme() {
  if (typeof window === 'undefined') {
    return pageThemes.default
  }
  
  const pathname = window.location.pathname
  const searchParams = new URLSearchParams(window.location.search)
  
  // Verificar categoria nos parâmetros de pesquisa
  const category = searchParams.get('category')
  if (category && pageThemes[category as keyof typeof pageThemes]) {
    return pageThemes[category as keyof typeof pageThemes]
  }
  
  // Verificar filtros especiais
  const filter = searchParams.get('filter')
  if (filter === 'sale') return pageThemes.ofertas
  if (filter === 'new') return pageThemes.lancamentos
  
  // Verificar rotas específicas
  if (pathname.includes('/offers')) return pageThemes.ofertas
  if (pathname.includes('/new-arrivals')) return pageThemes.lancamentos
  
  // Tema padrão
  return pageThemes.default
}

// Função para obter tema por chave
export function getThemeByKey(key: string) {
  return pageThemes[key as keyof typeof pageThemes] || pageThemes.default
}