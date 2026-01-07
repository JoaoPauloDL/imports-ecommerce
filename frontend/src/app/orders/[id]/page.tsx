'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/utils'
import Toast, { ToastType } from '@/components/ui/Toast'

interface OrderDetail {
  id: string
  createdAt: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  shippingCost: number
  shippingMethod: string
  paymentMethod?: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      image: string
    }
  }>
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  user: {
    fullName: string
    email: string
  }
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders/' + params.id)
      return
    }
    
    fetchOrderDetail()
  }, [isAuthenticated, params.id, router])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      setError('')
      
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setOrder(data.order)
      } else {
        setError(data.message || 'Erro ao carregar pedido')
      }
    } catch (err) {
      console.error('Erro ao buscar pedido:', err)
      setError('Erro ao carregar detalhes do pedido')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
      return
    }
    
    try {
      setCancelling(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setToast({ message: 'Pedido cancelado com sucesso!', type: 'success' })
        fetchOrderDetail() // Recarregar dados
      } else {
        setToast({ message: data.message || 'Erro ao cancelar pedido', type: 'error' })
      }
    } catch (err) {
      console.error('Erro ao cancelar pedido:', err)
      setToast({ message: 'Erro ao cancelar pedido', type: 'error' })
    } finally {
      setCancelling(false)
    }
  }

  const getStatusText = (status: OrderDetail['status']) => {
    const statusMap = {
      pending: 'Aguardando Pagamento',
      processing: 'Em Processamento',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    }
    return statusMap[status]
  }

  const getStatusColor = (status: OrderDetail['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colorMap[status]
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Pedido não encontrado'}</p>
            <Link href="/orders" className="text-blue-600 hover:underline">
              Voltar para Meus Pedidos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/orders" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Voltar para Meus Pedidos
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Pedido #{order.id.slice(0, 8)}
            </h1>
            <span className={`px-4 py-2 rounded-lg font-medium border-2 ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Pedido realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Timeline de Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Acompanhamento do Pedido</h2>
          <div className="flex items-center justify-between">
            {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
              const statusOrder = ['pending', 'processing', 'shipped', 'delivered']
              const currentIndex = statusOrder.indexOf(order.status)
              const stepIndex = statusOrder.indexOf(step)
              const isCompleted = order.status === 'cancelled' ? false : stepIndex <= currentIndex
              const isCurrent = stepIndex === currentIndex
              
              return (
                <div key={step} className="flex-1">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    {index < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        stepIndex < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                  <p className={`text-xs mt-2 ${isCurrent ? 'font-semibold' : ''}`}>
                    {getStatusText(step as any)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Preço unitário: {formatPrice(item.price)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frete ({order.shippingMethod})</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(order.totalAmount + order.shippingCost)}</span>
            </div>
          </div>
        </div>

        {/* Endereço de Entrega */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
          <div className="text-gray-700">
            <p className="font-medium">{order.user.fullName}</p>
            <p>{order.address.street}, {order.address.number}</p>
            {order.address.complement && <p>{order.address.complement}</p>}
            <p>{order.address.neighborhood}</p>
            <p>{order.address.city} - {order.address.state}</p>
            <p>CEP: {order.address.zipCode}</p>
          </div>
        </div>

        {/* Informações de Pagamento */}
        {order.paymentMethod && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Forma de Pagamento</h2>
            <p className="text-gray-700">{order.paymentMethod}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-4">
          {(order.status === 'pending' || order.status === 'processing') && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {cancelling ? 'Cancelando...' : 'Cancelar Pedido'}
            </button>
          )}
          
          <Link
            href="/orders"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Voltar para Pedidos
          </Link>
          
          {order.status === 'delivered' && (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Avaliar Produtos
            </button>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
