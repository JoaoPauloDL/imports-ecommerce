'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  className?: string
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  className = '' 
}: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stockStatus !== 'out_of_stock' && onAddToCart) {
      onAddToCart(product.id)
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    const remainingStars = 5 - stars.length
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return stars
  }

  return (
    <div 
      className={`group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              NOVO
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              MAIS VENDIDO
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{discountPercentage}%
            </span>
          )}
          {product.freeShipping && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              FRETE GRÁTIS
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => setImageLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Quick Add to Cart - Shows on Hover */}
          <div className={`absolute inset-x-0 bottom-0 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'out_of_stock'}
              className={`w-full py-3 px-4 font-semibold transition-colors ${
                product.stockStatus === 'out_of_stock'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {product.stockStatus === 'out_of_stock' ? 'ESGOTADO' : 'ADICIONAR AO CARRINHO'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                product.stockStatus === 'in_stock' ? 'bg-green-500' :
                product.stockStatus === 'low_stock' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <span className={`text-xs ${
                product.stockStatus === 'in_stock' ? 'text-green-600' :
                product.stockStatus === 'low_stock' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {product.stockStatus === 'in_stock' ? 'Em estoque' :
                 product.stockStatus === 'low_stock' ? 'Últimas unidades' :
                 'Esgotado'}
              </span>
            </div>

            {product.freeShipping && (
              <span className="text-xs text-green-600 font-semibold">
                📦 Frete grátis
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}