'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { toast } from '@/lib/toast';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, isLoading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/wishlist');
      return;
    }
    fetchWishlist();
  }, [user, router, fetchWishlist]);

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
    } catch (error) {
      // Error handled in store
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1);
      toast.success(`${productName} adicionado ao carrinho!`);
    } catch (error) {
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 h-80">
                  <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-600 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
          </div>
          <p className="text-gray-600">
            {items.length === 0
              ? 'Você ainda não tem produtos favoritos'
              : `${items.length} ${items.length === 1 ? 'produto salvo' : 'produtos salvos'}`
            }
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto favoritado
              </h2>
              <p className="text-gray-600 mb-6">
                Explore nossos produtos e clique no ícone de coração para salvar seus favoritos!
              </p>
              <Button href="/products" variant="primary">
                Ver Produtos
              </Button>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={item.product.imageUrl || '/api/placeholder/400/400'}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remover dos favoritos"
                  >
                    {removingId === item.productId ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>

                  {/* Stock Badge */}
                  {item.product.stockQuantity === 0 && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Esgotado
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                    <a href={`/products/${item.product.slug}`}>
                      {item.product.name}
                    </a>
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      R$ {Number(item.product.price).toFixed(2)}
                    </span>
                    {item.product.stockQuantity > 0 && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {item.product.stockQuantity} un.
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(item.productId, item.product.name)}
                      disabled={item.product.stockQuantity === 0}
                      className={`
                        w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors
                        ${item.product.stockQuantity > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.product.stockQuantity > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}
                    </button>

                    <a
                      href={`/products/${item.product.slug}`}
                      className="block w-full text-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                      Ver Detalhes
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
          <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-tight text-center">
            Como funciona a Lista de Desejos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">1. Favorite</h3>
              <p className="text-gray-600 text-sm">
                Clique no ícone do coração nos perfumes que você gosta
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">2. Organize</h3>
              <p className="text-gray-600 text-sm">
                Todos ficam salvos aqui na sua lista pessoal
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">3. Compre</h3>
              <p className="text-gray-600 text-sm">
                Adicione ao carrinho quando estiver pronto para comprar
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5z" />
              </svg>
              Acompanhe Promoções
            </h3>
            <p className="text-gray-600 text-sm">
              Receba notificações quando os perfumes da sua lista entrarem em promoção
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Compare Facilmente
            </h3>
            <p className="text-gray-600 text-sm">
              Tenha todos seus favoritos em um lugar só para comparar preços e características
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <h3 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Presentes Especiais
            </h3>
            <p className="text-gray-600 text-sm">
              Compartilhe sua lista com pessoas queridas para dar dicas de presentes
            </p>
          </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}