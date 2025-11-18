'use client'



import { useState, useEffect } from 'react'

import { formatPrice } from '@/lib/utils'

interface Order {

interface Order {  id: string

  id: string  customer: string

  createdAt: string  email: string

  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'  total: number

  totalAmount: number  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

  shippingCost: number  date: string

  user: {  items: number

    fullName: string}

    email: string

  }export default function OrdersManagement() {

  items: Array<{  const [orders, setOrders] = useState<Order[]>([])

    quantity: number  const [loading, setLoading] = useState(true)

  }>  const [searchTerm, setSearchTerm] = useState('')

}  const [filterStatus, setFilterStatus] = useState('')



export default function OrdersManagement() {  useEffect(() => {

  const [orders, setOrders] = useState<Order[]>([])    // Simular carregamento de pedidos

  const [loading, setLoading] = useState(true)    setTimeout(() => {

  const [error, setError] = useState('')      setOrders([

  const [searchTerm, setSearchTerm] = useState('')        {

  const [filterStatus, setFilterStatus] = useState('')          id: '1001',

  const [page, setPage] = useState(1)          customer: 'João Silva',

  const [totalPages, setTotalPages] = useState(1)          email: 'joao@email.com',

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)          total: 2999.99,

          status: 'pending',

  useEffect(() => {          date: '2024-01-15',

    fetchOrders()          items: 3

  }, [page, filterStatus])        },

        {

  const fetchOrders = async () => {          id: '1002',

    try {          customer: 'Maria Santos',

      setLoading(true)          email: 'maria@email.com',

      setError('')          total: 1579.50,

                status: 'shipped',

      const token = localStorage.getItem('token')          date: '2024-01-14',

                items: 2

      const params = new URLSearchParams({        },

        page: page.toString(),        {

        limit: '10'          id: '1003',

      })          customer: 'Pedro Costa',

                email: 'pedro@email.com',

      if (filterStatus) {          total: 899.90,

        params.append('status', filterStatus)          status: 'delivered',

      }          date: '2024-01-13',

                items: 1

      const response = await fetch(`http://localhost:5000/api/admin/orders?${params}`, {        },

        headers: {        {

          'Authorization': `Bearer ${token}`          id: '1004',

        }          customer: 'Ana Oliveira',

      })          email: 'ana@email.com',

                total: 4599.99,

      const data = await response.json()          status: 'processing',

                date: '2024-01-12',

      if (response.ok) {          items: 5

        setOrders(data.orders || [])        }

        setTotalPages(data.pagination?.totalPages || 1)      ])

      } else {      setLoading(false)

        setError(data.message || 'Erro ao carregar pedidos')    }, 1000)

      }  }, [])

    } catch (err) {

      console.error('Erro ao buscar pedidos:', err)  const getStatusColor = (status: Order['status']) => {

      setError('Erro ao carregar pedidos')    const colors = {

    } finally {      pending: 'bg-yellow-100 text-yellow-800',

      setLoading(false)      processing: 'bg-blue-100 text-blue-800',

    }      shipped: 'bg-purple-100 text-purple-800',

  }      delivered: 'bg-green-100 text-green-800',

      cancelled: 'bg-red-100 text-red-800'

  const handleStatusChange = async (orderId: string, newStatus: string) => {    }

    if (!confirm(`Tem certeza que deseja alterar o status para "${newStatus}"?`)) {    return colors[status]

      return  }

    }

      const getStatusText = (status: Order['status']) => {

    try {    const texts = {

      setUpdatingStatus(orderId)      pending: 'Pendente',

            processing: 'Processando',

      const token = localStorage.getItem('token')      shipped: 'Enviado',

            delivered: 'Entregue',

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {      cancelled: 'Cancelado'

        method: 'PUT',    }

        headers: {    return texts[status]

          'Authorization': `Bearer ${token}`,  }

          'Content-Type': 'application/json'

        },  const filteredOrders = orders.filter(order => {

        body: JSON.stringify({ status: newStatus })    const matchesSearch = 

      })      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||

            order.id.includes(searchTerm) ||

      const data = await response.json()      order.email.toLowerCase().includes(searchTerm.toLowerCase())

          const matchesStatus = !filterStatus || order.status === filterStatus

      if (response.ok) {    return matchesSearch && matchesStatus

        alert('Status atualizado com sucesso! Email enviado ao cliente.')  })

        fetchOrders() // Recarregar lista

      } else {  if (loading) {

        alert(data.message || 'Erro ao atualizar status')    return (

      }      <div className="p-4 lg:p-6 pt-4">

    } catch (err) {        <div className="animate-pulse">

      console.error('Erro ao atualizar status:', err)          <div className="h-8 bg-gray-200 rounded mb-6"></div>

      alert('Erro ao atualizar status')          <div className="space-y-4">

    } finally {            {[1, 2, 3, 4].map(i => (

      setUpdatingStatus(null)              <div key={i} className="h-16 bg-gray-200 rounded"></div>

    }            ))}

  }          </div>

        </div>

  const getStatusColor = (status: Order['status']) => {      </div>

    const colors = {    )

      pending: 'bg-yellow-100 text-yellow-800',  }

      processing: 'bg-blue-100 text-blue-800',

      shipped: 'bg-purple-100 text-purple-800',  return (

      delivered: 'bg-green-100 text-green-800',    <div className="p-4 lg:p-6 pt-4">

      cancelled: 'bg-red-100 text-red-800'      <div className="max-w-7xl mx-auto">

    }      {/* Header */}

    return colors[status]      <div className="mb-6">

  }        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h1>

        <p className="text-gray-600">Gerencie todos os pedidos da loja</p>

  const getStatusText = (status: Order['status']) => {      </div>

    const texts = {

      pending: 'Pendente',      {/* Filtros */}

      processing: 'Processando',      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">

      shipped: 'Enviado',        <div className="flex flex-col sm:flex-row gap-4">

      delivered: 'Entregue',          <div className="flex-1">

      cancelled: 'Cancelado'            <input

    }              type="text"

    return texts[status]              placeholder="Buscar por cliente, email ou ID do pedido..."

  }              value={searchTerm}

              onChange={(e) => setSearchTerm(e.target.value)}

  const filteredOrders = orders.filter(order => {              className="input w-full"

    if (!searchTerm) return true            />

    const search = searchTerm.toLowerCase()          </div>

    return (          <div className="sm:w-48">

      order.user.fullName.toLowerCase().includes(search) ||            <select

      order.user.email.toLowerCase().includes(search) ||              value={filterStatus}

      order.id.toLowerCase().includes(search)              onChange={(e) => setFilterStatus(e.target.value)}

    )              className="input w-full"

  })            >

              <option value="">Todos os status</option>

  if (loading && orders.length === 0) {              <option value="pending">Pendente</option>

    return (              <option value="processing">Processando</option>

      <div className="p-4 lg:p-6 pt-4">              <option value="shipped">Enviado</option>

        <div className="animate-pulse">              <option value="delivered">Entregue</option>

          <div className="h-8 bg-gray-200 rounded mb-6"></div>              <option value="cancelled">Cancelado</option>

          <div className="space-y-4">            </select>

            {[1, 2, 3, 4].map(i => (          </div>

              <div key={i} className="h-16 bg-gray-200 rounded"></div>        </div>

            ))}      </div>

          </div>

        </div>      {/* Estatísticas rápidas */}

      </div>      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

    )        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

  }          <p className="text-2xl font-bold text-yellow-600">

            {orders.filter(o => o.status === 'pending').length}

  return (          </p>

    <div className="p-4 lg:p-6 pt-4">          <p className="text-sm text-gray-600">Pendentes</p>

      <div className="max-w-7xl mx-auto">        </div>

        {/* Header */}        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

        <div className="mb-6">          <p className="text-2xl font-bold text-blue-600">

          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h1>            {orders.filter(o => o.status === 'processing').length}

          <p className="text-gray-600">Gerencie todos os pedidos da loja</p>          </p>

        </div>          <p className="text-sm text-gray-600">Processando</p>

        </div>

        {error && (        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">          <p className="text-2xl font-bold text-purple-600">

            {error}            {orders.filter(o => o.status === 'shipped').length}

          </div>          </p>

        )}          <p className="text-sm text-gray-600">Enviados</p>

        </div>

        {/* Estatísticas rápidas */}        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">          <p className="text-2xl font-bold text-green-600">

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">            {orders.filter(o => o.status === 'delivered').length}

            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>          </p>

            <p className="text-sm text-gray-600">Total</p>          <p className="text-sm text-gray-600">Entregues</p>

          </div>        </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">      </div>

            <p className="text-2xl font-bold text-yellow-600">

              {orders.filter(o => o.status === 'pending').length}      {/* Lista de Pedidos */}

            </p>      <div className="bg-white rounded-lg shadow-sm border">

            <p className="text-sm text-gray-600">Pendentes</p>        <div className="overflow-x-auto">

          </div>          <table className="w-full">

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">            <thead className="bg-gray-50 border-b">

            <p className="text-2xl font-bold text-blue-600">              <tr>

              {orders.filter(o => o.status === 'processing').length}                <th className="text-left py-3 px-4 font-medium text-gray-900">Pedido</th>

            </p>                <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>

            <p className="text-sm text-gray-600">Processando</p>                <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>

          </div>                <th className="text-left py-3 px-4 font-medium text-gray-900">Itens</th>

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">                <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>

            <p className="text-2xl font-bold text-purple-600">                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>

              {orders.filter(o => o.status === 'shipped').length}                <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>

            </p>              </tr>

            <p className="text-sm text-gray-600">Enviados</p>            </thead>

          </div>            <tbody className="divide-y divide-gray-200">

          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">              {filteredOrders.map((order) => (

            <p className="text-2xl font-bold text-green-600">                <tr key={order.id} className="hover:bg-gray-50">

              {orders.filter(o => o.status === 'delivered').length}                  <td className="py-4 px-4">

            </p>                    <div>

            <p className="text-sm text-gray-600">Entregues</p>                      <p className="font-medium text-gray-900">#{order.id}</p>

          </div>                    </div>

        </div>                  </td>

                  <td className="py-4 px-4">

        {/* Filtros */}                    <div>

        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">                      <p className="font-medium text-gray-900">{order.customer}</p>

          <div className="flex flex-col sm:flex-row gap-4">                      <p className="text-sm text-gray-500">{order.email}</p>

            <div className="flex-1">                    </div>

              <input                  </td>

                type="text"                  <td className="py-4 px-4 text-gray-900">

                placeholder="Buscar por cliente, email ou ID do pedido..."                    {new Date(order.date).toLocaleDateString('pt-BR')}

                value={searchTerm}                  </td>

                onChange={(e) => setSearchTerm(e.target.value)}                  <td className="py-4 px-4 text-gray-900">{order.items} itens</td>

                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                  <td className="py-4 px-4 font-medium text-gray-900">

              />                    R$ {order.total.toFixed(2)}

            </div>                  </td>

            <div className="sm:w-48">                  <td className="py-4 px-4">

              <select                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>

                value={filterStatus}                      {getStatusText(order.status)}

                onChange={(e) => {                    </span>

                  setFilterStatus(e.target.value)                  </td>

                  setPage(1)                  <td className="py-4 px-4">

                }}                    <div className="flex space-x-2">

                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">

              >                        Ver Detalhes

                <option value="">Todos os status</option>                      </button>

                <option value="pending">Pendente</option>                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">

                <option value="processing">Processando</option>                        Atualizar Status

                <option value="shipped">Enviado</option>                      </button>

                <option value="delivered">Entregue</option>                    </div>

                <option value="cancelled">Cancelado</option>                  </td>

              </select>                </tr>

            </div>              ))}

          </div>            </tbody>

        </div>          </table>

        </div>

        {/* Tabela de Pedidos */}

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">        {filteredOrders.length === 0 && (

          <div className="overflow-x-auto">          <div className="text-center py-12">

            <table className="min-w-full divide-y divide-gray-200">            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <thead className="bg-gray-50">              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />

                <tr>            </svg>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>

                    Pedido            <p className="text-gray-500">Tente ajustar os filtros de busca.</p>

                  </th>          </div>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">        )}

                    Cliente      </div>

                  </th>    </div>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  )

                    Data}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} itens
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount + order.shippingCost)}
                      </div>
                      <div className="text-sm text-gray-500">
                        + {formatPrice(order.shippingCost)} frete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      >
                        <option value="pending">Pendente</option>
                        <option value="processing">Processando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
