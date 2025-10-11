'use client'

import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand?: string
  volume?: string
  concentration?: string
  fraganceFamily?: string
  rating?: number
  reviewCount?: number
  discount?: number
  isNew?: boolean
  isBestSeller?: boolean
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'
  freeShipping?: boolean
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  className?: string
  columns?: 'auto' | 2 | 3 | 4 | 5
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  showFilters?: boolean
}

interface FilterState {
  category: string
  priceRange: [number, number]
  sortBy: string
  inStock: boolean
}

// Loading skeleton component
const ProductSkeleton = () => (
  <div className="bg-white overflow-hidden group">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <div className="p-6 space-y-3">
      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
      </div>
    </div>
  </div>
)

export default function ProductGrid({
  products,
  loading = false,
  className = '',
  columns = 'auto',
  onAddToCart,
  onAddToWishlist,
  showFilters = false
}: ProductGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'featured',
    inStock: false
  })

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)))
    return ['all', ...cats]
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    // Price range filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stockStatus === 'in_stock')
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        // Featured - prioritize new and best sellers
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1
          if (!a.isNew && b.isNew) return 1
          if (a.isBestSeller && !b.isBestSeller) return -1
          if (!a.isBestSeller && b.isBestSeller) return 1
          return 0
        })
    }

    return filtered
  }, [products, filters])

  // Grid columns class
  const getGridClass = () => {
    if (columns === 'auto') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
    return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Filters */}
      {showFilters && (
        <div className="space-y-6">
          {/* Filter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-black">
                {filteredProducts.length} Perfumes
              </h3>
              
              {/* View Toggle */}
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'text-black'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'text-black'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black">Ordenar por:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
              >
                <option value="featured">Destaques</option>
                <option value="name">Nome A-Z</option>
                <option value="price_low">Menor Preço</option>
                <option value="price_high">Maior Preço</option>
                <option value="rating">Mais Avaliados</option>
              </select>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black">Categoria:</span>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas as Categorias' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Apenas em Estoque</span>
            </label>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                category: 'all',
                priceRange: [0, 1000],
                sortBy: 'featured',
                inStock: false
              })}
              className="text-sm text-gray-500 hover:text-black underline"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {loading ? (
        <div className={`grid ${getGridClass()} gap-8`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 4V2a1 1 0 00-1-1H4a1 1 0 00-1 1v2H2a1 1 0 000 2h1v11a3 3 0 003 3h8a3 3 0 003-3V6h1a1 1 0 100-2h-1V2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2H7zM6 4h8v11a1 1 0 01-1 1H7a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-2">Nenhum perfume encontrado</h3>
          <p className="text-gray-500 mb-6">
            Tente ajustar seus filtros ou termos de busca
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? `grid ${getGridClass()} gap-8` 
          : 'space-y-6'
        }>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              className={viewMode === 'list' ? 'flex' : ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}