'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
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