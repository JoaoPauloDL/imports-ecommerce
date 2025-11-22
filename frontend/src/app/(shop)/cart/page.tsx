'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { cart, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart()
      setLoading(false)
    }
    loadCart()
  }, [fetchCart])

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const cartItems = cart?.items || []
  const subtotal = Number(cart?.total || 0)
  const shipping = subtotal > 500 ? 0 : 49.90
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.36a1 1 0 00.95 1.36h9.38M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-500 mb-8">Parece que você ainda não adicionou nenhum item ao carrinho.</p>
            <Link href="/products" className="btn-primary">
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Carrinho de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Itens no Carrinho ({cartItems.length})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      {/* Imagem e Info do Produto */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                          <Image
                            src={item.product.imageUrl || item.product.images[0] || '/api/placeholder/80/80'}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover w-20 h-20"
                          />
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-medium text-gray-900 hover:text-primary text-sm sm:text-base truncate">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-base sm:text-lg font-semibold text-primary mt-1">
                            R$ {Number(item.product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Controles de Quantidade e Preço */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        {/* Quantidade */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg px-2 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <span className="font-medium text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>

                        {/* Preço Total e Remover */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-base sm:text-lg whitespace-nowrap">
                            R$ {(Number(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-800 text-xs sm:text-sm mt-1"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <Link href="/products" className="btn-secondary text-center">
                ← Continuar Comprando
              </Link>
              <button
                onClick={async () => {
                  try {
                    await useCartStore.getState().clearCart()
                  } catch (error) {
                    console.error('Error clearing cart:', error)
                  }
                }}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Frete</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded text-xs sm:text-sm">GRÁTIS</span>
                    ) : (
                      <span className="font-medium">R$ {shipping.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="text-xs sm:text-sm text-emerald-700 font-medium bg-emerald-50 p-2 rounded">
                    💡 Frete GRÁTIS em compras acima de R$ 500,00
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full mb-3 text-center block py-3 sm:py-4 text-sm sm:text-base">
                Finalizar Compra
              </Link>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Compra 100% segura</span>
                </div>
              </div>

              {/* Cupom de desconto */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3">Cupom de Desconto</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom"
                    className="input flex-1 text-sm sm:text-base px-3 py-2"
                  />
                  <button className="btn-secondary px-4 py-2 text-sm sm:text-base whitespace-nowrap">
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}