'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import Toast, { ToastType } from '@/components/ui/Toast'
import ReviewList from '@/components/product/ReviewList'
import ReviewForm from '@/components/product/ReviewForm'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  rating: number
  reviews: number
  inStock: boolean
  stockCount: number
  description: string
  specifications: { [key: string]: string }
  slug: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, isLoading: cartLoading } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const slug = params.slug as string
      console.log('🔍 Buscando produto com slug:', slug)
      
      const response = await fetch(`http://localhost:5000/api/products?slug=${slug}`)
      
      if (!response.ok) {
        throw new Error('Produto não encontrado')
      }
      
      const result = await response.json()
      const products = result.data || result
      
      if (!Array.isArray(products) || products.length === 0) {
        console.error('❌ Produto não encontrado:', slug)
        setProduct(null)
        setLoading(false)
        return
      }
      
      const backendProduct = products[0]
      console.log('✅ Produto encontrado:', backendProduct)
      
      // Converter para formato da página
      const productData: Product = {
        id: backendProduct.id,
        name: backendProduct.name,
        price: Number(backendProduct.price),
        originalPrice: backendProduct.featured ? Number(backendProduct.price) * 1.2 : undefined,
        images: backendProduct.imageUrl 
          ? [backendProduct.imageUrl, backendProduct.imageUrl, backendProduct.imageUrl, backendProduct.imageUrl]
          : ['/api/placeholder/600/600', '/api/placeholder/600/600'],
        category: backendProduct.categories?.[0]?.name || 'Geral',
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 200) + 50,
        inStock: backendProduct.stockQuantity > 0,
        stockCount: backendProduct.stockQuantity,
        slug: backendProduct.slug,
        description: backendProduct.description || `${backendProduct.name} - Produto importado de alta qualidade.

Características principais:
• Produto original e importado
• Garantia de qualidade
• Entrega rápida e segura
• Melhor custo-benefício`,
        specifications: {
          'SKU': backendProduct.sku || 'N/A',
          'Estoque': `${backendProduct.stockQuantity} unidades`,
          'Categoria': backendProduct.categories?.[0]?.name || 'Geral',
          'Status': backendProduct.isActive ? 'Ativo' : 'Inativo'
        }
      }
      
      setProduct(productData)
      setLoading(false)
    } catch (error) {
      console.error('❌ Erro ao buscar produto:', error)
      setProduct(null)
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    try {
      await addToCart(product.id, quantity)
      setToast({ message: `${quantity} item(s) adicionado(s) ao carrinho!`, type: 'success' })
      // Optional: redirect to cart
      // router.push('/cart')
    } catch (error) {
      setToast({ message: 'Erro ao adicionar ao carrinho. Tente novamente.', type: 'error' })
    }
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setIsZoomed(false)
  }

  const nextImage = () => {
    if (!product) return
    setLightboxIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    if (!product) return
    setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return
      
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, lightboxIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <Link href="/products" className="btn-primary">
            Voltar aos Produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                Início
              </Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/products" className="text-gray-400 hover:text-gray-500">
                Produtos
              </Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria de Imagens Profissional */}
          <div className="space-y-4">
            {/* Imagem Principal com Zoom */}
            <div 
              className="relative aspect-square bg-white rounded-lg overflow-hidden cursor-zoom-in group border-2 border-gray-200 flex items-center justify-center p-4"
              onClick={() => openLightbox(selectedImage)}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <div 
                className="w-full h-full transition-transform duration-300 flex items-center justify-center"
                style={{
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                }}
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
              
              {/* Ícone de Zoom */}
              <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>

              {/* Badge de desconto */}
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  onMouseEnter={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 bg-white flex items-center justify-center p-1 ${
                    selectedImage === index 
                      ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-blue-600/10"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Indicador de posição */}
            <div className="flex justify-center items-center gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-2 rounded-full transition-all ${
                    selectedImage === index 
                      ? 'w-8 bg-blue-600' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>

            <div className="mb-6">
              {product.originalPrice && (
                <p className="text-lg text-gray-500 line-through mb-1">
                  R$ {product.originalPrice.toFixed(2)}
                </p>
              )}
              <p className="text-4xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-md inline-block">
                  Economia de R$ {(product.originalPrice - product.price).toFixed(2)} 
                  ({Math.round((1 - product.price / product.originalPrice) * 100)}% OFF)
                </p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Categoria: {product.category}</p>
              <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock 
                  ? `Em estoque (${product.stockCount} unidades disponíveis)`
                  : 'Fora de estoque'
                }
              </p>
            </div>

            {/* Quantidade e Compra */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-2">
                  Quantidade:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input w-20"
                >
                  {Array.from({ length: Math.min(product.stockCount, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar ao Carrinho
              </button>
              <button className="btn-secondary w-full">
                Comprar Agora
              </button>
            </div>

            {/* Informações de Entrega */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Informações de Entrega</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="text-amber-600 font-bold">📦 Frete GRÁTIS para todo o Brasil</p>
                <p>🚚 Entrega expressa em 2-5 dias úteis</p>
                <p>🔄 30 dias para trocas e devoluções</p>
                <p>🛡️ Garantia oficial do fabricante</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Informações */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Descrição
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specifications'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Especificações
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Avaliações ({product.reviews})
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div className="bg-white rounded-lg p-6">
                  <div className="whitespace-pre-line text-gray-700">
                    {product.description}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="bg-white rounded-lg p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <dt className="font-medium text-gray-900">{key}</dt>
                      <dd className="text-gray-700">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <ReviewForm 
                  productId={product.id}
                  onReviewSubmitted={() => setReviewRefreshTrigger(prev => prev + 1)}
                />
                
                <div className="border-t pt-6">
                  <ReviewList 
                    productId={product.id}
                    refreshTrigger={reviewRefreshTrigger}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Botão Fechar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contador */}
          <div className="absolute top-4 left-4 text-white text-lg font-medium">
            {lightboxIndex + 1} / {product.images.length}
          </div>

          {/* Botão Anterior */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Imagem */}
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[lightboxIndex]}
              alt={`${product.name} ${lightboxIndex + 1}`}
              width={1200}
              height={1200}
              className="object-contain max-h-full max-w-full"
              priority
            />
          </div>

          {/* Botão Próximo */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnails no Lightbox */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-xl overflow-x-auto p-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(index)
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  lightboxIndex === index
                    ? 'border-white scale-110'
                    : 'border-gray-500 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          {/* Instruções */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            Use as setas ← → ou clique nas imagens para navegar. ESC para fechar.
          </div>
        </div>
      )}
    </div>
  )
}