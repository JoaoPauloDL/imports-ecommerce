'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import { useCartStore } from '@/store/cartStore'

interface ProductCardType {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  imageUrl: string
  category: string
  categories: Array<{ id: string; name: string; slug: string }>
  stockStatus: 'in_stock' | 'out_of_stock'
  stockQuantity: number
  featured: boolean
}

interface BackendProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number
  imageUrl: string
  stockQuantity: number
  featured: boolean
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface FilterState {
  search: string
  category: string
  minPrice: string
  maxPrice: string
  inStock: boolean
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToCart } = useCartStore()
  
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.inStock) params.append('inStock', 'true')
      params.append('sortBy', filters.sortBy)
      params.append('sortOrder', filters.sortOrder)
      params.append('page', page.toString())
      params.append('limit', '12')
      
      const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`)
      const data = await response.json()
      
      setProducts(data.products || [])
      setTotal(data.pagination?.total || 0)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, page])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setFilters(prev => ({ ...prev, search: q }))
    }
  }, [searchParams])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1)
  }

  const convertToProductCardType = (product: BackendProduct): ProductCardType => {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: Number(product.price),
      image: product.imageUrl || '/placeholder.png',
      imageUrl: product.imageUrl || '/placeholder.png',
      category: product.categories[0]?.name || 'Sem categoria',
      categories: product.categories,
      stockStatus: product.stockQuantity > 0 ? 'in_stock' : 'out_of_stock',
      stockQuantity: product.stockQuantity,
      featured: product.featured
    }
  }

  const clearFilters = () => {
    setFilters({
      search: searchParams.get('q') || '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {filters.search ? `Resultados para "${filters.search}"` : 'Buscar Produtos'}
          </h1>
          <p className="mt-2 text-gray-600">
            {loading ? 'Buscando...' : `${total} produto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-800 hover:text-slate-600"
                >
                  Limpar
                </button>
              </div>

              {/* Busca */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Nome do produto..."
                  className="input w-full"
                />
              </div>

              {/* Faixa de Preço */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Mín"
                    className="input w-full"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Máx"
                    className="input w-full"
                  />
                </div>
              </div>

              {/* Disponibilidade */}
              <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-slate-800 rounded"
                  />
                  <span className="text-sm text-gray-700">Apenas em estoque</span>
                </label>
              </div>

              {/* Ordenação */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }))
                  }}
                  className="input w-full"
                >
                  <option value="createdAt-desc">Mais recentes</option>
                  <option value="createdAt-asc">Mais antigos</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="name-desc">Nome (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Produtos - Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={convertToProductCardType(product)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Paginação */}
                {total > 12 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn-secondary disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <span className="text-sm text-gray-600">
                        Página {page} de {Math.ceil(total / 12)}
                      </span>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= Math.ceil(total / 12)}
                        className="btn-secondary disabled:opacity-50"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
