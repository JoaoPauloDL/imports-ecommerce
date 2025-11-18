'use client'



import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'import Link from 'next/link'

import Link from 'next/link'

import { useAuthStore } from '@/store/authStore'interface Order {

import { formatPrice } from '@/lib/utils'  id: string

  date: string

interface Order {  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

  id: string  total: number

  createdAt: string  items: number

  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'  trackingCode?: string

  totalAmount: number  paymentMethod: string

  shippingCost: number}

  items: Array<{

    id: stringexport default function OrdersPage() {

    quantity: number  const [orders, setOrders] = useState<Order[]>([])

    price: number  const [loading, setLoading] = useState(true)

    product: {  const [filterStatus, setFilterStatus] = useState('')

      name: string

    }  useEffect(() => {

  }>    // Simular carregamento de pedidos

}    setTimeout(() => {

      setOrders([

export default function OrdersPage() {        {

  const router = useRouter()          id: '1001',

  const { user, isAuthenticated } = useAuthStore()          date: '2024-01-15',

            status: 'delivered',

  const [orders, setOrders] = useState<Order[]>([])          total: 2999.99,

  const [loading, setLoading] = useState(true)          items: 3,

  const [error, setError] = useState('')          trackingCode: 'BR123456789',

  const [filterStatus, setFilterStatus] = useState('')          paymentMethod: 'Cartão de Crédito'

        },

  useEffect(() => {        {

    if (!isAuthenticated) {          id: '1002',

      router.push('/login?redirect=/orders')          date: '2024-01-10',

      return          status: 'shipped',

    }          total: 1579.50,

              items: 2,

    fetchOrders()          trackingCode: 'BR987654321',

  }, [isAuthenticated, router])          paymentMethod: 'PIX'

        },

  const fetchOrders = async () => {        {

    try {          id: '1003',

      setLoading(true)          date: '2024-01-05',

      setError('')          status: 'processing',

                total: 899.90,

      const token = localStorage.getItem('token')          items: 1,

                paymentMethod: 'Cartão de Débito'

      if (!user?.id) {        },

        setError('Usuário não identificado')        {

        return          id: '1004',

      }          date: '2023-12-28',

                status: 'pending',

      const response = await fetch(`http://localhost:5000/api/orders/user/${user.id}`, {          total: 4599.99,

        headers: {          items: 5,

          'Authorization': `Bearer ${token}`          paymentMethod: 'Boleto'

        }        },

      })        {

                id: '1005',

      const data = await response.json()          date: '2023-12-20',

                status: 'cancelled',

      if (response.ok) {          total: 1299.99,

        setOrders(data.orders || [])          items: 2,

      } else {          paymentMethod: 'Cartão de Crédito'

        setError(data.message || 'Erro ao carregar pedidos')        }

      }      ])

    } catch (err) {      setLoading(false)

      console.error('Erro ao buscar pedidos:', err)    }, 1000)

      setError('Erro ao carregar pedidos')  }, [])

    } finally {

      setLoading(false)  const getStatusText = (status: Order['status']) => {

    }    const statusMap = {

  }      pending: 'Pendente',

      processing: 'Processando',

  const getStatusText = (status: Order['status']) => {      shipped: 'Enviado',

    const statusMap = {      delivered: 'Entregue',

      pending: 'Pendente',      cancelled: 'Cancelado'

      processing: 'Processando',    }

      shipped: 'Enviado',    return statusMap[status]

      delivered: 'Entregue',  }

      cancelled: 'Cancelado'

    }  const getStatusColor = (status: Order['status']) => {

    return statusMap[status]    const colorMap = {

  }      pending: 'bg-yellow-100 text-yellow-800',

      processing: 'bg-blue-100 text-blue-800',

  const getStatusColor = (status: Order['status']) => {      shipped: 'bg-purple-100 text-purple-800',

    const colorMap = {      delivered: 'bg-green-100 text-green-800',

      pending: 'bg-yellow-100 text-yellow-800',      cancelled: 'bg-red-100 text-red-800'

      processing: 'bg-blue-100 text-blue-800',    }

      shipped: 'bg-purple-100 text-purple-800',    return colorMap[status]

      delivered: 'bg-green-100 text-green-800',  }

      cancelled: 'bg-red-100 text-red-800'

    }  const getStatusIcon = (status: Order['status']) => {

    return colorMap[status]    const iconMap = {

  }      pending: '⏳',

      processing: '⚙️',

  const getStatusIcon = (status: Order['status']) => {      shipped: '🚚',

    const iconMap = {      delivered: '✅',

      pending: '⏳',      cancelled: '❌'

      processing: '⚙️',    }

      shipped: '🚚',    return iconMap[status]

      delivered: '✅',  }

      cancelled: '❌'

    }  const filteredOrders = orders.filter(order => {

    return iconMap[status]    if (!filterStatus) return true

  }    return order.status === filterStatus

  })

  const filteredOrders = orders.filter(order => {

    if (!filterStatus) return true  if (loading) {

    return order.status === filterStatus    return (

  })      <div className="min-h-screen bg-gray-50">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

  if (!isAuthenticated) {          <div className="animate-pulse">

    return null            <div className="h-8 bg-gray-200 rounded mb-8"></div>

  }            <div className="space-y-4">

              {Array.from({ length: 5 }, (_, i) => (

  if (loading) {                <div key={i} className="h-32 bg-gray-200 rounded"></div>

    return (              ))}

      <div className="min-h-screen bg-gray-50">            </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">          </div>

          <div className="animate-pulse">        </div>

            <div className="h-8 bg-gray-200 rounded mb-8"></div>      </div>

            <div className="space-y-4">    )

              {Array.from({ length: 3 }, (_, i) => (  }

                <div key={i} className="h-32 bg-gray-200 rounded"></div>

              ))}  return (

            </div>    <div className="min-h-screen bg-gray-50">

          </div>      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        </div>        {/* Header */}

      </div>        <div className="mb-8">

    )          <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>

  }          <p className="text-gray-600">Acompanhe todos os seus pedidos e entregas</p>

        </div>

  return (

    <div className="min-h-screen bg-gray-50">        {/* Estatísticas Rápidas */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">

        {/* Header */}          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

        <div className="mb-8">            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>

          <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>            <p className="text-sm text-gray-600">Total</p>

          <p className="text-gray-600">Acompanhe todos os seus pedidos e entregas</p>          </div>

        </div>          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

            <p className="text-2xl font-bold text-yellow-600">

        {error && (              {orders.filter(o => o.status === 'pending').length}

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">            </p>

            {error}            <p className="text-sm text-gray-600">Pendentes</p>

          </div>          </div>

        )}          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

            <p className="text-2xl font-bold text-blue-600">

        {/* Estatísticas Rápidas */}              {orders.filter(o => o.status === 'processing').length}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">            </p>

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">            <p className="text-sm text-gray-600">Processando</p>

            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>          </div>

            <p className="text-sm text-gray-600">Total</p>          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

          </div>            <p className="text-2xl font-bold text-purple-600">

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">              {orders.filter(o => o.status === 'shipped').length}

            <p className="text-2xl font-bold text-yellow-600">            </p>

              {orders.filter(o => o.status === 'pending').length}            <p className="text-sm text-gray-600">Enviados</p>

            </p>          </div>

            <p className="text-sm text-gray-600">Pendentes</p>          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

          </div>            <p className="text-2xl font-bold text-green-600">

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">              {orders.filter(o => o.status === 'delivered').length}

            <p className="text-2xl font-bold text-blue-600">            </p>

              {orders.filter(o => o.status === 'processing').length}            <p className="text-sm text-gray-600">Entregues</p>

            </p>          </div>

            <p className="text-sm text-gray-600">Processando</p>        </div>

          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">        {/* Filtros */}

            <p className="text-2xl font-bold text-purple-600">        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">

              {orders.filter(o => o.status === 'shipped').length}          <div className="flex flex-col sm:flex-row gap-4">

            </p>            <div className="flex-1">

            <p className="text-sm text-gray-600">Enviados</p>              <label className="block text-sm font-medium text-gray-700 mb-1">

          </div>                Filtrar por Status

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">              </label>

            <p className="text-2xl font-bold text-green-600">              <select

              {orders.filter(o => o.status === 'delivered').length}                value={filterStatus}

            </p>                onChange={(e) => setFilterStatus(e.target.value)}

            <p className="text-sm text-gray-600">Entregues</p>                className="input w-full sm:w-auto"

          </div>              >

        </div>                <option value="">Todos os status</option>

                <option value="pending">Pendente</option>

        {/* Filtros */}                <option value="processing">Processando</option>

        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">                <option value="shipped">Enviado</option>

          <div className="flex flex-col sm:flex-row gap-4">                <option value="delivered">Entregue</option>

            <div className="flex-1">                <option value="cancelled">Cancelado</option>

              <label className="block text-sm font-medium text-gray-700 mb-1">              </select>

                Filtrar por Status            </div>

              </label>          </div>

              <select        </div>

                value={filterStatus}

                onChange={(e) => setFilterStatus(e.target.value)}        {/* Lista de Pedidos */}

                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"        <div className="space-y-4">

              >          {filteredOrders.map((order) => (

                <option value="">Todos os status</option>            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">

                <option value="pending">Pendente</option>              <div className="p-6">

                <option value="processing">Processando</option>                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

                <option value="shipped">Enviado</option>                  <div className="flex-1">

                <option value="delivered">Entregue</option>                    <div className="flex items-center space-x-4 mb-2">

                <option value="cancelled">Cancelado</option>                      <h3 className="text-lg font-semibold text-gray-900">

              </select>                        Pedido #{order.id}

            </div>                      </h3>

          </div>                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>

        </div>                        {getStatusIcon(order.status)} {getStatusText(order.status)}

                      </span>

        {/* Lista de Pedidos */}                    </div>

        {filteredOrders.length > 0 ? (                    

          <div className="space-y-4">                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">

            {filteredOrders.map((order) => (                      <div>

              <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">                        <p><strong>Data:</strong> {new Date(order.date).toLocaleDateString('pt-BR')}</p>

                <div className="p-6">                        <p><strong>Itens:</strong> {order.items} {order.items === 1 ? 'item' : 'itens'}</p>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">                      </div>

                    <div className="flex-1">                      <div>

                      <div className="flex items-center space-x-4 mb-2">                        <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>

                        <h3 className="text-lg font-semibold text-gray-900">                        <p><strong>Pagamento:</strong> {order.paymentMethod}</p>

                          Pedido #{order.id.slice(0, 8)}                      </div>

                        </h3>                      <div>

                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>                        {order.trackingCode && (

                          {getStatusIcon(order.status)} {getStatusText(order.status)}                          <p><strong>Rastreamento:</strong> {order.trackingCode}</p>

                        </span>                        )}

                      </div>                      </div>

                                          </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">                  </div>

                        <div>

                          <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">

                          <p><strong>Itens:</strong> {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>                    <Link

                        </div>                      href={`/orders/${order.id}`}

                        <div>                      className="btn-primary text-center"

                          <p><strong>Subtotal:</strong> {formatPrice(order.totalAmount)}</p>                    >

                          <p><strong>Frete:</strong> {formatPrice(order.shippingCost)}</p>                      Ver Detalhes

                          <p><strong>Total:</strong> <span className="font-semibold text-blue-600">{formatPrice(order.totalAmount + order.shippingCost)}</span></p>                    </Link>

                        </div>                    

                      </div>                    {order.trackingCode && (

                      <button className="btn-secondary">

                      {/* Produtos */}                        Rastrear

                      <div className="mt-3 pt-3 border-t">                      </button>

                        <p className="text-sm font-medium text-gray-700 mb-2">Produtos:</p>                    )}

                        <div className="space-y-1">                    

                          {order.items.map((item) => (                    {order.status === 'delivered' && (

                            <p key={item.id} className="text-sm text-gray-600">                      <button className="btn-secondary">

                              • {item.product.name} <span className="text-gray-400">(x{item.quantity})</span>                        Avaliar

                            </p>                      </button>

                          ))}                    )}

                        </div>                    

                      </div>                    {order.status === 'pending' && (

                    </div>                      <button className="text-red-600 hover:text-red-800 px-3 py-2 text-sm font-medium">

                        Cancelar

                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-2">                      </button>

                      <Link                    )}

                        href={`/orders/${order.id}`}                  </div>

                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"                </div>

                      >

                        Ver Detalhes                {/* Progress Bar para pedidos em andamento */}

                      </Link>                {(order.status === 'processing' || order.status === 'shipped') && (

                                        <div className="mt-4 pt-4 border-t">

                      {order.status === 'pending' && (                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">

                        <button className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-medium">                      <span>Progresso do Pedido</span>

                          Cancelar                      <span>

                        </button>                        {order.status === 'processing' && '25%'}

                      )}                        {order.status === 'shipped' && '75%'}

                    </div>                      </span>

                  </div>                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">

                  {/* Progress Bar para pedidos em andamento */}                      <div 

                  {(order.status === 'processing' || order.status === 'shipped') && (                        className="bg-primary h-2 rounded-full transition-all duration-500"

                    <div className="mt-4 pt-4 border-t">                        style={{

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">                          width: order.status === 'processing' ? '25%' : '75%'

                        <span>Progresso do Pedido</span>                        }}

                        <span>                      ></div>

                          {order.status === 'processing' && '50%'}                    </div>

                          {order.status === 'shipped' && '75%'}                    <div className="flex justify-between text-xs text-gray-500 mt-1">

                        </span>                      <span>Confirmado</span>

                      </div>                      <span>Preparando</span>

                      <div className="w-full bg-gray-200 rounded-full h-2">                      <span>Enviado</span>

                        <div                       <span>Entregue</span>

                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"                    </div>

                          style={{                  </div>

                            width: order.status === 'processing' ? '50%' : '75%'                )}

                          }}              </div>

                        ></div>            </div>

                      </div>          ))}

                      <div className="flex justify-between text-xs text-gray-500 mt-1">        </div>

                        <span>Confirmado</span>

                        <span>Preparando</span>        {filteredOrders.length === 0 && (

                        <span>Enviado</span>          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">

                        <span>Entregue</span>            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      </div>              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />

                    </div>            </svg>

                  )}            <h3 className="text-lg font-medium text-gray-900 mb-2">

                </div>              {filterStatus ? 'Nenhum pedido encontrado' : 'Você ainda não fez nenhum pedido'}

              </div>            </h3>

            ))}            <p className="text-gray-500 mb-6">

          </div>              {filterStatus 

        ) : (                ? 'Tente ajustar os filtros de busca.'

          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">                : 'Que tal começar explorando nossos produtos?'

            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">              }

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />            </p>

            </svg>            <Link href="/products" className="btn-primary">

            <h3 className="text-lg font-medium text-gray-900 mb-2">              Explorar Produtos

              {filterStatus ? 'Nenhum pedido encontrado' : 'Você ainda não fez nenhum pedido'}            </Link>

            </h3>          </div>

            <p className="text-gray-500 mb-6">        )}

              {filterStatus       </div>

                ? 'Tente ajustar os filtros de busca.'    </div>

                : 'Que tal começar explorando nossos produtos?'  )

              }}
            </p>
            <Link href="/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Explorar Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
