'use client'

import { useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  fullName: string
  email: string
  phone: string
  document: string
  birthDate: string
  memberSince: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [editMode, setEditMode] = useState(false)
  
  const [user, setUser] = useState<User>({
    id: '1',
    fullName: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    document: '123.456.789-00',
    birthDate: '1990-05-15',
    memberSince: '2024-01-10'
  })

  const [formData, setFormData] = useState<User>(user)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1500))
      setUser(formData)
      setEditMode(false)
      alert('Dados atualizados com sucesso!')
    } catch (error) {
      alert('Erro ao salvar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(user)
    setEditMode(false)
  }

  const recentOrders = [
    {
      id: '1001',
      date: '2024-01-15',
      total: 2999.99,
      status: 'delivered',
      items: 3
    },
    {
      id: '1002',
      date: '2024-01-10',
      total: 1579.50,
      status: 'shipped',
      items: 2
    },
    {
      id: '1003',
      date: '2024-01-05',
      total: 899.90,
      status: 'processing',
      items: 1
    }
  ]

  const getStatusText = (status: string) => {
    const statusMap = {
      delivered: 'Entregue',
      shipped: 'Enviado',
      processing: 'Processando',
      pending: 'Pendente'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    }
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  const tabs = [
    { id: 'personal', name: 'Dados Pessoais', icon: '👤' },
    { id: 'orders', name: 'Meus Pedidos', icon: '📦' },
    { id: 'addresses', name: 'Endereços', icon: '📍' },
    { id: 'security', name: 'Segurança', icon: '🔒' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>

        {/* Resumo do Usuário */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-primary">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Membro desde {new Date(user.memberSince).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Navegação */}
          <div>
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {/* Dados Pessoais */}
              {activeTab === 'personal' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Dados Pessoais</h2>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="btn-secondary"
                      >
                        Editar
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={handleCancel}
                          className="btn-secondary"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="btn-primary disabled:opacity-50"
                        >
                          {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="input w-full"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      {editMode ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="input w-full"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="input w-full"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.document}
                          onChange={(e) => handleInputChange('document', e.target.value)}
                          className="input w-full"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.document}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      {editMode ? (
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          className="input w-full md:w-auto"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">
                          {new Date(user.birthDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pedidos */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Meus Pedidos</h2>
                    <Link href="/orders" className="btn-secondary">
                      Ver Todos
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="font-medium text-gray-900">Pedido #{order.id}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString('pt-BR')} • {order.items} {order.items === 1 ? 'item' : 'itens'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">R$ {order.total.toFixed(2)}</p>
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-sm text-primary hover:text-primary/80"
                            >
                              Ver Detalhes →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Endereços */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Meus Endereços</h2>
                    <Link href="/profile/addresses" className="btn-primary">
                      Gerenciar Endereços
                    </Link>
                  </div>

                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-500 mb-4">Nenhum endereço cadastrado ainda.</p>
                    <Link href="/profile/addresses" className="btn-primary">
                      Adicionar Primeiro Endereço
                    </Link>
                  </div>
                </div>
              )}

              {/* Segurança */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações de Segurança</h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">Alterar Senha</h3>
                          <p className="text-sm text-gray-500">Mantenha sua conta segura</p>
                        </div>
                        <button className="btn-secondary">
                          Alterar
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">Autenticação de Dois Fatores</h3>
                          <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                        </div>
                        <button className="btn-secondary">
                          Configurar
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">Sessões Ativas</h3>
                          <p className="text-sm text-gray-500">Gerencie dispositivos conectados</p>
                        </div>
                        <button className="btn-secondary">
                          Ver Sessões
                        </button>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-red-900">Excluir Conta</h3>
                          <p className="text-sm text-red-700">Remova permanentemente sua conta</p>
                        </div>
                        <button className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium">
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}