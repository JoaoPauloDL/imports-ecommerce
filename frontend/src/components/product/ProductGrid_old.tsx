'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  category: string
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
}

// Loading skeleton component
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
    </div>
  </div>
)

export default function ProductGrid({
  products,
  loading = false,
  className = '',
  columns = 'auto',
  onAddToCart,
  onAddToWishlist
}: ProductGridProps) {
  const [notification, setNotification] = useState<string | null>(null)

  // Handle add to cart with notification
  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setNotification(`${product.name} adicionado ao carrinho!`)
      setTimeout(() => setNotification(null), 3000)
    }
    if (onAddToCart) {
      onAddToCart(productId)
    }
  }

  // Handle add to wishlist with notification
  const handleAddToWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setNotification(`${product.name} adicionado à lista de desejos!`)
      setTimeout(() => setNotification(null), 3000)
    }
    if (onAddToWishlist) {
      onAddToWishlist(productId)
    }
  }

  // Determine grid classes based on columns prop
  const getGridClasses = () => {
    const baseClasses = 'grid gap-6'
    
    switch (columns) {
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
      case 4:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
      case 5:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{notification}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={getGridClasses()}>
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500 max-w-md">
            Não encontramos produtos que correspondam aos seus critérios de busca. 
            Tente ajustar os filtros ou buscar por outros termos.
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className={getGridClasses()}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {!loading && products.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-6">
          <div className="mb-2 sm:mb-0">
            Exibindo {products.length} produto{products.length !== 1 ? 's' : ''}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Em estoque</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Últimas unidades</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Esgotado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Utility function to generate mock products for testing
export const generateMockProducts = (count: number = 12): Product[] => {
  const categories = ['Eletrônicos', 'Roupas', 'Casa e Jardim', 'Esportes', 'Beleza', 'Livros']
  const products: Product[] = []

  for (let i = 1; i <= count; i++) {
    const hasDiscount = Math.random() > 0.6
    const price = Math.floor(Math.random() * 500) + 50
    const originalPrice = hasDiscount ? price + Math.floor(Math.random() * 100) + 20 : undefined
    
    products.push({
      id: `product-${i}`,
      name: `Produto Importado Premium ${i}`,
      slug: `produto-importado-premium-${i}`,
      price,
      originalPrice,
      image: `https://picsum.photos/400/400?random=${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      rating: Math.random() * 5,
      reviewCount: Math.floor(Math.random() * 100),
      isNew: Math.random() > 0.8,
      isBestSeller: Math.random() > 0.9,
      stockStatus: ['in_stock', 'low_stock', 'out_of_stock'][Math.floor(Math.random() * 3)] as any,
      freeShipping: Math.random() > 0.5,
    })
  }

  return products
}