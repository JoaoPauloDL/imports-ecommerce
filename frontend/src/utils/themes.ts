import { getActiveCategories, specialPages } from '@/services/categoryService'

// Cache de temas para performance
let themesCache: Record<string, any> = {}
let lastCacheUpdate = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Sistema de temas por categoria/página
export const pageThemes = {
  // Categorias de produtos
  arabes: {
    primary: 'from-amber-400 to-amber-500',
    secondary: 'bg-amber-50 border-amber-200',
    accent: 'bg-amber-500 hover:bg-amber-600',
    text: 'text-amber-600',
    name: 'Essências Árabes',
    description: 'Aromas intensos e luxuosos do Oriente Médio'
  },
  franceses: {
    primary: 'from-violet-400 to-violet-500',
    secondary: 'bg-violet-50 border-violet-200',
    accent: 'bg-violet-500 hover:bg-violet-600',
    text: 'text-violet-600',
    name: 'Perfumes Franceses',
    description: 'Elegância e sofisticação parisiense'
  },
  masculinos: {
    primary: 'from-slate-400 to-slate-500',
    secondary: 'bg-slate-50 border-slate-200',
    accent: 'bg-slate-500 hover:bg-slate-600',
    text: 'text-slate-600',
    name: 'Masculinos',
    description: 'Fragrâncias marcantes e elegantes'
  },
  femininos: {
    primary: 'from-rose-400 to-pink-400',
    secondary: 'bg-rose-50 border-rose-200',
    accent: 'bg-rose-400 hover:bg-rose-500',
    text: 'text-rose-500',
    name: 'Femininos',
    description: 'Delicadeza e sofisticação em cada gota'
  },
  
  // Páginas especiais
  ofertas: {
    primary: 'from-orange-400 to-red-400',
    secondary: 'bg-orange-50 border-orange-200',
    accent: 'bg-orange-500 hover:bg-orange-600',
    text: 'text-orange-600',
    name: 'Ofertas Especiais',
    description: 'Descontos imperdíveis por tempo limitado'
  },
  lancamentos: {
    primary: 'from-cyan-600 to-blue-600',
    secondary: 'bg-cyan-50 border-cyan-200',
    accent: 'bg-cyan-600 hover:bg-cyan-700',
    text: 'text-cyan-600',
    name: 'Lançamentos',
    description: 'As novidades mais aguardadas'
  },
  
  // Tema padrão
  default: {
    primary: 'from-gray-800 to-black',
    secondary: 'bg-gray-50 border-gray-200',
    accent: 'bg-black hover:bg-gray-800',
    text: 'text-black',
    name: 'Perfumes Importados',
    description: 'Sua loja de fragrâncias exclusivas'
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