'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  items: number
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    // Simular carregamento de pedidos
    setTimeout(() => {
      setOrders([
        {
          id: '1001',
          customer: 'João Silva',
          email: 'joao@email.com',
          total: 2999.99,
          status: 'pending',
          date: '2024-01-15',
          items: 3
        },
        {
          id: '1002',
          customer: 'Maria Santos',
          email: 'maria@email.com',
          total: 1579.50,
          status: 'shipped',
          date: '2024-01-14',
          items: 2
        },
        {
          id: '1003',
          customer: 'Pedro Costa',
          email: 'pedro@email.com',
          total: 899.90,
          status: 'delivered',
          date: '2024-01-13',
          items: 1
        },
        {
          id: '1004',
          customer: 'Ana Oliveira',
          email: 'ana@email.com',
          total: 4599.99,
          status: 'processing',
          date: '2024-01-12',
          items: 5
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status]
  }

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    }
    return texts[status]
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h1>
        <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por cliente, email ou ID do pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-full"
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

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Pedido</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Itens</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">#{order.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-4 text-gray-900">{order.items} itens</td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    R$ {order.total.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Ver Detalhes
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Atualizar Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  )
}