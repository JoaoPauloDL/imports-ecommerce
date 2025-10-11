'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
  trackingCode?: string
  paymentMethod: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    // Simular carregamento de pedidos
    setTimeout(() => {
      setOrders([
        {
          id: '1001',
          date: '2024-01-15',
          status: 'delivered',
          total: 2999.99,
          items: 3,
          trackingCode: 'BR123456789',
          paymentMethod: 'Cartão de Crédito'
        },
        {
          id: '1002',
          date: '2024-01-10',
          status: 'shipped',
          total: 1579.50,
          items: 2,
          trackingCode: 'BR987654321',
          paymentMethod: 'PIX'
        },
        {
          id: '1003',
          date: '2024-01-05',
          status: 'processing',
          total: 899.90,
          items: 1,
          paymentMethod: 'Cartão de Débito'
        },
        {
          id: '1004',
          date: '2023-12-28',
          status: 'pending',
          total: 4599.99,
          items: 5,
          paymentMethod: 'Boleto'
        },
        {
          id: '1005',
          date: '2023-12-20',
          status: 'cancelled',
          total: 1299.99,
          items: 2,
          paymentMethod: 'Cartão de Crédito'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    }
    return statusMap[status]
  }

  const getStatusColor = (status: Order['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colorMap[status]
  }

  const getStatusIcon = (status: Order['status']) => {
    const iconMap = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    }
    return iconMap[status]
  }

  const filteredOrders = orders.filter(order => {
    if (!filterStatus) return true
    return order.status === filterStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
          <p className="text-gray-600">Acompanhe todos os seus pedidos e entregas</p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pendentes</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </p>
            <p className="text-sm text-gray-600">Processando</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
            <p className="text-sm text-gray-600">Enviados</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
            <p className="text-sm text-gray-600">Entregues</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input w-full sm:w-auto"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="processing">Processando</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{order.id}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Data:</strong> {new Date(order.date).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Itens:</strong> {order.items} {order.items === 1 ? 'item' : 'itens'}</p>
                      </div>
                      <div>
                        <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
                        <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
                      </div>
                      <div>
                        {order.trackingCode && (
                          <p><strong>Rastreamento:</strong> {order.trackingCode}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="btn-primary text-center"
                    >
                      Ver Detalhes
                    </Link>
                    
                    {order.trackingCode && (
                      <button className="btn-secondary">
                        Rastrear
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button className="btn-secondary">
                        Avaliar
                      </button>
                    )}
                    
                    {order.status === 'pending' && (
                      <button className="text-red-600 hover:text-red-800 px-3 py-2 text-sm font-medium">
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar para pedidos em andamento */}
                {(order.status === 'processing' || order.status === 'shipped') && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progresso do Pedido</span>
                      <span>
                        {order.status === 'processing' && '25%'}
                        {order.status === 'shipped' && '75%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{
                          width: order.status === 'processing' ? '25%' : '75%'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Confirmado</span>
                      <span>Preparando</span>
                      <span>Enviado</span>
                      <span>Entregue</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus ? 'Nenhum pedido encontrado' : 'Você ainda não fez nenhum pedido'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus 
                ? 'Tente ajustar os filtros de busca.'
                : 'Que tal começar explorando nossos produtos?'
              }
            </p>
            <Link href="/products" className="btn-primary">
              Explorar Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}