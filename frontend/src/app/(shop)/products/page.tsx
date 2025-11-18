'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/product/ProductGrid'
import CategoryFloatingActions from '@/components/CategoryFloatingActions'
import ThemedHero from '@/components/ThemedHero'
import { usePageTheme } from '@/utils/themes'

// Interface para produtos do backend
interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  sku?: string
  stockQuantity: number
  categoryId?: string
  imageUrl?: string
  featured: boolean
  isActive: boolean
  category?: {
    id: string
    name: string
    slug: string
  }
}

// Função para converter produto do backend para formato do frontend
const convertBackendProduct = (backendProduct: any) => ({
  id: backendProduct.id,
  name: backendProduct.name,
  slug: backendProduct.slug || backendProduct.name.toLowerCase().replace(/\s+/g, '-'),
  price: Number(backendProduct.price),
  originalPrice: backendProduct.featured ? Number(backendProduct.price) * 1.2 : undefined,
  image: backendProduct.imageUrl || '/api/placeholder/400/400',
  category: backendProduct.category?.slug || 'geral',
  brand: 'Importado',
  volume: '100ml',
  concentration: 'Eau de Parfum',
  fraganceFamily: 'Diversos',
  rating: 4.5 + Math.random() * 0.5,
  reviewCount: Math.floor(Math.random() * 500) + 100,
  discount: backendProduct.featured ? 15 : undefined,
  isNew: false,
  isBestSeller: backendProduct.featured,
  stockStatus: backendProduct.stockQuantity > 0 ? 'in_stock' : 'out_of_stock' as const,
  freeShipping: Number(backendProduct.price) > 100
})

// Category mapping for display
const categoryNames: Record<string, string> = {
  'arabes': 'Essências Árabes',
  'franceses': 'Perfumes Franceses',
  'masculinos': 'Masculinos',
  'femininos': 'Femininos',
  'unissex': 'Unissex'
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const currentTheme = usePageTheme()

  // Get filters from URL params
  const category = searchParams?.get('category') || ''
  const searchQuery = searchParams?.get('search') || ''
  const filter = searchParams?.get('filter') || ''

  // Fetch products from backend
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log('🔄 Buscando produtos do backend...')
      const response = await fetch('http://localhost:5000/api/products')
      
      if (response.ok) {
        const result = await response.json()
        const backendProducts = result.data || result
        
        console.log('📦 Produtos recebidos do backend:', backendProducts)
        
        if (Array.isArray(backendProducts)) {
          // Converter produtos do backend para formato do frontend
          const convertedProducts = backendProducts
            .filter(product => product.isActive) // Apenas produtos ativos
            .map(convertBackendProduct)
          
          console.log('✅ Produtos convertidos:', convertedProducts)
          setProducts(convertedProducts)
        } else {
          console.warn('⚠️ Formato de dados inesperado')
          setProducts([])
        }
      } else {
        console.error('❌ Erro na resposta da API')
        setProducts([])
      }
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error)
      console.log('⚠️ Verifique se o backend está rodando em http://localhost:5000')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on URL parameters
  const filteredProducts = useMemo(() => {
    let filteredList = [...products]

    // Filter by category
    if (category && category !== 'all') {
      filteredList = filteredList.filter(product => product.category === category)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredList = filteredList.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    // Filter by special filters
    if (filter === 'sale') {
      filteredList = filteredList.filter(product => product.originalPrice && product.discount)
    } else if (filter === 'new') {
      filteredList = filteredList.filter(product => product.isNew)
    } else if (filter === 'featured') {
      filteredList = filteredList.filter(product => product.isBestSeller)
    }

    return filteredList
  }, [products, category, searchQuery, filter])

  // Page title based on filters
  const getPageTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`
    }
    if (category && categoryNames[category]) {
      return categoryNames[category]
    }
    if (filter === 'sale') {
      return 'Ofertas'
    }
    if (filter === 'new') {
      return 'Lançamentos'
    }
    if (filter === 'featured') {
      return 'Produtos em Destaque'
    }
    return 'Todos os Perfumes'
  }

  const getPageDescription = () => {
    if (searchQuery) {
      return `${filteredProducts.length} perfume(s) encontrado(s)`
    }
    if (category && categoryNames[category]) {
      return `Descubra nossa seleção exclusiva de ${categoryNames[category].toLowerCase()}`
    }
    if (filter === 'sale') {
      return 'Perfumes com os melhores preços e descontos especiais'
    }
    if (filter === 'new') {
      return 'Os lançamentos mais recentes em perfumaria'
    }
    if (filter === 'featured') {
      return 'Nossa seleção dos perfumes mais populares'
    }
    return 'Explore nossa coleção completa de perfumes importados'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ThemedHero
        theme={currentTheme}
        title={getPageTitle()}
        description={getPageDescription()}
      />
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          </div>
        ) : (
          <>
            <ProductGrid products={filteredProducts} />
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchQuery 
                    ? 'Nenhum produto encontrado para sua busca.' 
                    : 'Nenhum produto disponível no momento.'}
                </p>
              </div>
            )}
          </>
        )}
      </main>
      
      <CategoryFloatingActions />
    </div>
  )
}