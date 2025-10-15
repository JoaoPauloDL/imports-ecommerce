'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/product/ProductGrid'
import CategoryFloatingActions from '@/components/CategoryFloatingActions'
import ThemedHero from '@/components/ThemedHero'
import { usePageTheme } from '@/utils/themes'

// Mock products data - will be replaced with API calls
const mockProducts = [
  {
    id: '1',
    name: 'BLEU DE CHANEL',
    slug: 'bleu-de-chanel',
    price: 459.99,
    originalPrice: 529.99,
    image: '/products/bleu-chanel.jpg',
    category: 'masculinos',
    brand: 'Chanel',
    volume: '100ml',
    concentration: 'Eau de Parfum',
    fraganceFamily: 'Amadeirado',
    rating: 4.8,
    reviewCount: 1247,
    discount: 13,
    isNew: false,
    isBestSeller: true,
    stockStatus: 'in_stock' as const,
    freeShipping: true
  },
  {
    id: '2',
    name: 'MISS DIOR',
    slug: 'miss-dior',
    price: 389.99,
    image: '/products/miss-dior.jpg',
    category: 'femininos',
    brand: 'Dior',
    volume: '100ml',
    concentration: 'Eau de Parfum',
    fraganceFamily: 'Floral',
    rating: 4.9,
    reviewCount: 892,
    isNew: true,
    isBestSeller: false,
    stockStatus: 'in_stock' as const,
    freeShipping: true
  },
  {
    id: '3',
    name: 'OUD WOOD',
    slug: 'oud-wood',
    price: 899.99,
    image: '/products/oud-wood.jpg',
    category: 'arabes',
    brand: 'Tom Ford',
    volume: '50ml',
    concentration: 'Eau de Parfum',
    fraganceFamily: 'Oriental',
    rating: 4.7,
    reviewCount: 634,
    isNew: false,
    isBestSeller: true,
    stockStatus: 'low_stock' as const,
    freeShipping: true
  },
  {
    id: '4',
    name: 'LA VIE EST BELLE',
    slug: 'la-vie-est-belle',
    price: 324.99,
    image: '/products/la-vie-est-belle.jpg',
    category: 'franceses',
    brand: 'Lancôme',
    volume: '75ml',
    concentration: 'Eau de Parfum',
    fraganceFamily: 'Gourmand',
    rating: 4.6,
    reviewCount: 1456,
    isNew: false,
    isBestSeller: false,
    stockStatus: 'in_stock' as const,
    freeShipping: true
  },
  {
    id: '5',
    name: 'SAUVAGE',
    slug: 'sauvage',
    price: 429.99,
    image: '/products/sauvage.jpg',
    category: 'masculinos',
    brand: 'Dior',
    volume: '100ml',
    concentration: 'Eau de Toilette',
    fraganceFamily: 'Fresco',
    rating: 4.8,
    reviewCount: 2134,
    isNew: false,
    isBestSeller: true,
    stockStatus: 'in_stock' as const,
    freeShipping: true
  },
  {
    id: '6',
    name: 'CK ONE',
    slug: 'ck-one',
    price: 159.99,
    image: '/products/ck-one.jpg',
    category: 'unissex',
    brand: 'Calvin Klein',
    volume: '200ml',
    concentration: 'Eau de Toilette',
    fraganceFamily: 'Cítrico',
    rating: 4.4,
    reviewCount: 987,
    isNew: false,
    isBestSeller: false,
    stockStatus: 'in_stock' as const,
    freeShipping: false
  },
  {
    id: '7',
    name: 'ANGEL',
    slug: 'angel',
    price: 369.99,
    originalPrice: 429.99,
    image: '/products/angel.jpg',
    category: 'franceses',
    brand: 'Mugler',
    volume: '50ml',
    concentration: 'Eau de Parfum',
    fraganceFamily: 'Oriental',
    rating: 4.5,
    reviewCount: 743,
    discount: 14,
    isNew: false,
    isBestSeller: false,
    stockStatus: 'in_stock' as const,
    freeShipping: true
  },
  {
    id: '8',
    name: 'BLACK AFGHANO',
    slug: 'black-afghano',
    price: 1299.99,
    image: '/products/black-afghano.jpg',
    category: 'arabes',
    brand: 'Nasomatto',
    volume: '30ml',
    concentration: 'Extrait de Parfum',
    fraganceFamily: 'Oriental',
    rating: 4.9,
    reviewCount: 156,
    isNew: true,
    isBestSeller: false,
    stockStatus: 'in_stock' as const,
    freeShipping: true
  }
]

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
  const currentTheme = usePageTheme()

  // Get filters from URL params
  const category = searchParams?.get('category') || ''
  const searchQuery = searchParams?.get('search') || ''
  const filter = searchParams?.get('filter') || ''

  // Filter products based on URL parameters
  const filteredProducts = useMemo(() => {
    let products = [...mockProducts]

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(product => product.category === category)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    // Filter by special filters
    if (filter === 'sale') {
      products = products.filter(product => product.originalPrice && product.discount)
    } else if (filter === 'new') {
      products = products.filter(product => product.isNew)
    } else if (filter === 'featured') {
      products = products.filter(product => product.isBestSeller)
    }

    return products
  }, [category, searchQuery, filter])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [category, searchQuery, filter])

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ThemedHero 
        title={getPageTitle()}
        description={getPageDescription()}
      />

      {/* Category Stats */}
      {(category || filter) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`${currentTheme.secondary} rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6`}>
            <div className="text-center">
              <div className={`text-3xl font-black ${currentTheme.text} mb-2`}>
                {filteredProducts.length}
              </div>
              <p className="text-gray-600 text-sm font-medium">Produtos Disponíveis</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-black ${currentTheme.text} mb-2`}>
                {filteredProducts.filter(p => p.originalPrice).length}
              </div>
              <p className="text-gray-600 text-sm font-medium">Em Promoção</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-black ${currentTheme.text} mb-2`}>
                {filteredProducts.filter(p => p.freeShipping).length}
              </div>
              <p className="text-gray-600 text-sm font-medium">Frete Grátis</p>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          showFilters={true}
          onAddToCart={(productId) => {
            // TODO: Implement add to cart
            console.log('Add to cart:', productId)
          }}
          onAddToWishlist={(productId) => {
            // TODO: Implement add to wishlist
            console.log('Add to wishlist:', productId)
          }}
        />

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                />
              </svg>
              <h3 className="text-lg font-bold text-black mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `Não encontramos perfumes para "${searchQuery}". Tente outras palavras-chave.`
                  : 'Não há produtos nesta categoria no momento.'
                }
              </p>
              <a
                href="/"
                className={`inline-block ${currentTheme.accent} text-white px-8 py-3 font-bold text-sm tracking-wide uppercase transition-colors duration-200`}
              >
                Ver Todos os Produtos
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tight">
            Fique por Dentro
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Receba novidades, lançamentos exclusivos e ofertas especiais diretamente no seu e-mail
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
            <button className={`${currentTheme.accent} text-white px-8 py-4 font-bold text-sm tracking-wide uppercase transition-colors duration-200`}>
              Inscrever
            </button>
          </div>
        </div>
      </div>

      {/* Floating Actions */}
      <CategoryFloatingActions />
    </div>
  )
}