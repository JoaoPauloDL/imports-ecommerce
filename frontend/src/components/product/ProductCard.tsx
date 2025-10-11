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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
    }
  }

  return (
    <div 
      className={`group relative bg-white transition-all duration-300 hover:shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">{product.name}</span>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-black text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
                Best Seller
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isWishlisted 
                ? 'bg-black text-white' 
                : 'bg-white/80 text-black hover:bg-white hover:shadow-md'
            }`}
          >
            <svg 
              className="w-5 h-5" 
              fill={isWishlisted ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>

          {/* Quick Action Overlay */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'out_of_stock'}
              className={`px-8 py-3 font-medium tracking-wider uppercase text-sm transition-all duration-200 ${
                product.stockStatus === 'out_of_stock'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-black hover:text-white border-2 border-white'
              }`}
            >
              {product.stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          {/* Category */}
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-black leading-tight group-hover:text-gray-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= product.rating! ? 'text-black' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {product.reviewCount && (
                <span className="text-xs text-gray-500">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-black">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stockStatus === 'low_stock' && (
            <p className="text-xs text-orange-600 font-medium">
              Only few left in stock
            </p>
          )}

          {/* Free Shipping */}
          {product.freeShipping && (
            <p className="text-xs text-green-600 font-medium">
              Free shipping
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}