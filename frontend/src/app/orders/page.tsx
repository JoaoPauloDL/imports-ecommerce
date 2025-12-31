'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  shippingCost: number
  trackingCode?: string
  paymentMethod?: string
  items: OrderItem[]
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  pending_payment: { label: 'Aguardando Pagamento', color: 'bg-orange-100 text-orange-800' },
  processing: { label: 'Processando', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders')
      return
    }

    fetchOrders()
  }, [isAuthenticated, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!user?.id) {
        throw new Error('Usuário não encontrado')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos')
      }

      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
      setError('Não foi possível carregar seus pedidos')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
          
          {/* Filtro por Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="pending_payment">Aguardando Pagamento</option>
            <option value="processing">Processando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido.</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Começar a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Header do Pedido */}
                  <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <span className="text-sm text-gray-500">Pedido</span>
                      <span className="ml-2 font-mono font-medium">#{order.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items?.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.product?.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.product?.name || 'Produto'}</p>
                            <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                      
                      {order.items?.length > 3 && (
                        <p className="text-sm text-gray-500">
                          + {order.items.length - 3} outros itens
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer do Pedido */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      {order.trackingCode && (
                        <p className="text-sm">
                          <span className="text-gray-500">Rastreio:</span>
                          <span className="ml-2 font-mono">{order.trackingCode}</span>
                        </p>
                      )}
                      {order.paymentMethod && (
                        <p className="text-sm text-gray-500">
                          Pagamento: {order.paymentMethod}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.totalAmount + (order.shippingCost || 0))}
                        </p>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
