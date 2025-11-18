'use client'



import { useState, useEffect } from 'react'import { useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/store/authStore'interface User {

  id: string

interface User {  fullName: string

  id: string  email: string

  fullName: string  phone: string

  email: string  document: string

  phone: string | null  birthDate: string

  cpf: string | null  memberSince: string

  role: string}

  createdAt: string

}export default function ProfilePage() {

  const [activeTab, setActiveTab] = useState('personal')

export default function ProfilePage() {  const [editMode, setEditMode] = useState(false)

  const router = useRouter()  

  const { user: authUser, token } = useAuthStore()  const [user, setUser] = useState<User>({

      id: '1',

  const [activeTab, setActiveTab] = useState('personal')    fullName: 'João Silva',

  const [editMode, setEditMode] = useState(false)    email: 'joao@email.com',

  const [loading, setLoading] = useState(true)    phone: '(11) 99999-9999',

  const [saving, setSaving] = useState(false)    document: '123.456.789-00',

      birthDate: '1990-05-15',

  const [user, setUser] = useState<User | null>(null)    memberSince: '2024-01-10'

  const [formData, setFormData] = useState({  })

    fullName: '',

    email: '',  const [formData, setFormData] = useState<User>(user)

    phone: ''  const [loading, setLoading] = useState(false)

  })

  const handleInputChange = (field: keyof User, value: string) => {

  useEffect(() => {    setFormData(prev => ({ ...prev, [field]: value }))

    if (!authUser || !token) {  }

      router.push('/login')

      return  const handleSave = async () => {

    }    setLoading(true)

    fetchUserData()    try {

  }, [authUser, token])      // Simular salvamento

      await new Promise(resolve => setTimeout(resolve, 1500))

  const fetchUserData = async () => {      setUser(formData)

    try {      setEditMode(false)

      setLoading(true)      alert('Dados atualizados com sucesso!')

      const response = await fetch(`http://localhost:5000/api/users/${authUser?.id}`, {    } catch (error) {

        headers: {      alert('Erro ao salvar dados')

          Authorization: `Bearer ${token}`    } finally {

        }      setLoading(false)

      })    }

        }

      if (!response.ok) {

        throw new Error('Erro ao buscar dados do usuário')  const handleCancel = () => {

      }    setFormData(user)

          setEditMode(false)

      const data = await response.json()  }

      setUser(data)

      setFormData({  const recentOrders = [

        fullName: data.fullName || '',    {

        email: data.email || '',      id: '1001',

        phone: data.phone || ''      date: '2024-01-15',

      })      total: 2999.99,

    } catch (error) {      status: 'delivered',

      console.error('Erro:', error)      items: 3

      alert('Erro ao carregar dados do perfil')    },

    } finally {    {

      setLoading(false)      id: '1002',

    }      date: '2024-01-10',

  }      total: 1579.50,

      status: 'shipped',

  const handleInputChange = (field: string, value: string) => {      items: 2

    setFormData(prev => ({ ...prev, [field]: value }))    },

  }    {

      id: '1003',

  const handleSave = async () => {      date: '2024-01-05',

    try {      total: 899.90,

      setSaving(true)      status: 'processing',

            items: 1

      const response = await fetch(`http://localhost:5000/api/users/${authUser?.id}`, {    }

        method: 'PUT',  ]

        headers: {

          'Content-Type': 'application/json',  const getStatusText = (status: string) => {

          Authorization: `Bearer ${token}`    const statusMap = {

        },      delivered: 'Entregue',

        body: JSON.stringify(formData)      shipped: 'Enviado',

      })      processing: 'Processando',

            pending: 'Pendente'

      if (!response.ok) {    }

        const error = await response.json()    return statusMap[status as keyof typeof statusMap] || status

        throw new Error(error.error || 'Erro ao atualizar dados')  }

      }

        const getStatusColor = (status: string) => {

      const updatedUser = await response.json()    const colorMap = {

      setUser(updatedUser)      delivered: 'bg-green-100 text-green-800',

      setEditMode(false)      shipped: 'bg-blue-100 text-blue-800',

      alert('Dados atualizados com sucesso!')      processing: 'bg-yellow-100 text-yellow-800',

    } catch (error: any) {      pending: 'bg-gray-100 text-gray-800'

      console.error('Erro:', error)    }

      alert(error.message || 'Erro ao salvar dados')    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'

    } finally {  }

      setSaving(false)

    }  const tabs = [

  }    { id: 'personal', name: 'Dados Pessoais', icon: '👤' },

    { id: 'orders', name: 'Meus Pedidos', icon: '📦' },

  const handleCancel = () => {    { id: 'addresses', name: 'Endereços', icon: '📍' },

    if (user) {    { id: 'security', name: 'Segurança', icon: '🔒' }

      setFormData({  ]

        fullName: user.fullName || '',

        email: user.email || '',  return (

        phone: user.phone || ''    <div className="min-h-screen bg-gray-50">

      })      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    }        {/* Header */}

    setEditMode(false)        <div className="mb-8">

  }          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>

          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>

  if (loading) {        </div>

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">        {/* Resumo do Usuário */}

        <div className="text-center">        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>          <div className="flex items-center">

          <p className="text-gray-600">Carregando...</p>            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">

        </div>              <span className="text-2xl font-bold text-primary">

      </div>                {user.fullName.split(' ').map(n => n[0]).join('')}

    )              </span>

  }            </div>

            <div>

  if (!user) {              <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>

    return (              <p className="text-gray-600">{user.email}</p>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">              <p className="text-sm text-gray-500">

        <div className="text-center">                Membro desde {new Date(user.memberSince).toLocaleDateString('pt-BR')}

          <p className="text-red-600">Erro ao carregar dados do perfil</p>              </p>

        </div>            </div>

      </div>          </div>

    )        </div>

  }

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

  return (          {/* Sidebar de Navegação */}

    <div className="min-h-screen bg-gray-50 py-8">          <div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">            <nav className="bg-white rounded-lg shadow-sm border p-4">

        {/* Header */}              <ul className="space-y-2">

        <div className="mb-8">                {tabs.map((tab) => (

          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>                  <li key={tab.id}>

          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>                    <button

        </div>                      onClick={() => setActiveTab(tab.id)}

                      className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${

        {/* Tabs */}                        activeTab === tab.id

        <div className="bg-white rounded-lg shadow-sm border mb-6">                          ? 'bg-primary/10 text-primary font-medium'

          <div className="flex border-b">                          : 'text-gray-700 hover:bg-gray-50'

            <button                      }`}

              onClick={() => setActiveTab('personal')}                    >

              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${                      <span className="mr-3">{tab.icon}</span>

                activeTab === 'personal'                      {tab.name}

                  ? 'text-blue-600 border-b-2 border-blue-600'                    </button>

                  : 'text-gray-500 hover:text-gray-700'                  </li>

              }`}                ))}

            >              </ul>

              Dados Pessoais            </nav>

            </button>          </div>

            <Link

              href="/profile/addresses"          {/* Conteúdo Principal */}

              className="flex-1 px-6 py-4 text-center font-medium text-gray-500 hover:text-gray-700 transition-colors"          <div className="lg:col-span-3">

            >            <div className="bg-white rounded-lg shadow-sm border p-6">

              Endereços              {/* Dados Pessoais */}

            </Link>              {activeTab === 'personal' && (

            <Link                <div>

              href="/orders"                  <div className="flex justify-between items-center mb-6">

              className="flex-1 px-6 py-4 text-center font-medium text-gray-500 hover:text-gray-700 transition-colors"                    <h2 className="text-xl font-semibold text-gray-900">Dados Pessoais</h2>

            >                    {!editMode ? (

              Pedidos                      <button

            </Link>                        onClick={() => setEditMode(true)}

          </div>                        className="btn-secondary"

                      >

          {/* Dados Pessoais */}                        Editar

          {activeTab === 'personal' && (                      </button>

            <div className="p-6">                    ) : (

              <div className="flex justify-between items-center mb-6">                      <div className="space-x-2">

                <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>                        <button

                {!editMode ? (                          onClick={handleCancel}

                  <button                          className="btn-secondary"

                    onClick={() => setEditMode(true)}                        >

                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"                          Cancelar

                  >                        </button>

                    Editar                        <button

                  </button>                          onClick={handleSave}

                ) : (                          disabled={loading}

                  <div className="flex gap-2">                          className="btn-primary disabled:opacity-50"

                    <button                        >

                      onClick={handleCancel}                          {loading ? 'Salvando...' : 'Salvar'}

                      disabled={saving}                        </button>

                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"                      </div>

                    >                    )}

                      Cancelar                  </div>

                    </button>

                    <button                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      onClick={handleSave}                    <div>

                      disabled={saving}                      <label className="block text-sm font-medium text-gray-700 mb-1">

                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"                        Nome Completo

                    >                      </label>

                      {saving && (                      {editMode ? (

                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>                        <input

                      )}                          type="text"

                      Salvar                          value={formData.fullName}

                    </button>                          onChange={(e) => handleInputChange('fullName', e.target.value)}

                  </div>                          className="input w-full"

                )}                        />

              </div>                      ) : (

                        <p className="py-2 text-gray-900">{user.fullName}</p>

              <div className="space-y-6">                      )}

                {/* Nome Completo */}                    </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">                    <div>

                    Nome Completo                      <label className="block text-sm font-medium text-gray-700 mb-1">

                  </label>                        Email

                  {editMode ? (                      </label>

                    <input                      {editMode ? (

                      type="text"                        <input

                      value={formData.fullName}                          type="email"

                      onChange={(e) => handleInputChange('fullName', e.target.value)}                          value={formData.email}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"                          onChange={(e) => handleInputChange('email', e.target.value)}

                    />                          className="input w-full"

                  ) : (                        />

                    <p className="text-gray-900">{user.fullName}</p>                      ) : (

                  )}                        <p className="py-2 text-gray-900">{user.email}</p>

                </div>                      )}

                    </div>

                {/* Email */}

                <div>                    <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">                      <label className="block text-sm font-medium text-gray-700 mb-1">

                    Email                        Telefone

                  </label>                      </label>

                  {editMode ? (                      {editMode ? (

                    <input                        <input

                      type="email"                          type="tel"

                      value={formData.email}                          value={formData.phone}

                      onChange={(e) => handleInputChange('email', e.target.value)}                          onChange={(e) => handleInputChange('phone', e.target.value)}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"                          className="input w-full"

                    />                        />

                  ) : (                      ) : (

                    <p className="text-gray-900">{user.email}</p>                        <p className="py-2 text-gray-900">{user.phone}</p>

                  )}                      )}

                </div>                    </div>



                {/* Telefone */}                    <div>

                <div>                      <label className="block text-sm font-medium text-gray-700 mb-1">

                  <label className="block text-sm font-medium text-gray-700 mb-2">                        CPF

                    Telefone                      </label>

                  </label>                      {editMode ? (

                  {editMode ? (                        <input

                    <input                          type="text"

                      type="tel"                          value={formData.document}

                      value={formData.phone}                          onChange={(e) => handleInputChange('document', e.target.value)}

                      onChange={(e) => handleInputChange('phone', e.target.value)}                          className="input w-full"

                      placeholder="(11) 99999-9999"                        />

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"                      ) : (

                    />                        <p className="py-2 text-gray-900">{user.document}</p>

                  ) : (                      )}

                    <p className="text-gray-900">{user.phone || 'Não informado'}</p>                    </div>

                  )}

                </div>                    <div className="md:col-span-2">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                {/* CPF (não editável) */}                        Data de Nascimento

                <div>                      </label>

                  <label className="block text-sm font-medium text-gray-700 mb-2">                      {editMode ? (

                    CPF                        <input

                  </label>                          type="date"

                  <p className="text-gray-900">{user.cpf || 'Não informado'}</p>                          value={formData.birthDate}

                </div>                          onChange={(e) => handleInputChange('birthDate', e.target.value)}

                          className="input w-full md:w-auto"

                {/* Membro desde */}                        />

                <div>                      ) : (

                  <label className="block text-sm font-medium text-gray-700 mb-2">                        <p className="py-2 text-gray-900">

                    Membro desde                          {new Date(user.birthDate).toLocaleDateString('pt-BR')}

                  </label>                        </p>

                  <p className="text-gray-900">                      )}

                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {                    </div>

                      day: '2-digit',                  </div>

                      month: 'long',                </div>

                      year: 'numeric'              )}

                    })}

                  </p>              {/* Pedidos */}

                </div>              {activeTab === 'orders' && (

              </div>                <div>

            </div>                  <div className="flex justify-between items-center mb-6">

          )}                    <h2 className="text-xl font-semibold text-gray-900">Meus Pedidos</h2>

        </div>                    <Link href="/orders" className="btn-secondary">

                      Ver Todos

        {/* Cards de Atalhos */}                    </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                  </div>

          <Link

            href="/profile/addresses"                  <div className="space-y-4">

            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"                    {recentOrders.map((order) => (

          >                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">

            <div className="flex items-center gap-4">                        <div className="flex justify-between items-start">

              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">                          <div>

                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">                            <div className="flex items-center space-x-4 mb-2">

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />                              <h3 className="font-medium text-gray-900">Pedido #{order.id}</h3>

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>

                </svg>                                {getStatusText(order.status)}

              </div>                              </span>

              <div>                            </div>

                <h3 className="font-semibold text-gray-900">Meus Endereços</h3>                            <p className="text-sm text-gray-500">

                <p className="text-sm text-gray-600">Gerencie seus endereços de entrega</p>                              {new Date(order.date).toLocaleDateString('pt-BR')} • {order.items} {order.items === 1 ? 'item' : 'itens'}

              </div>                            </p>

            </div>                          </div>

          </Link>                          <div className="text-right">

                            <p className="font-semibold text-gray-900">R$ {order.total.toFixed(2)}</p>

          <Link                            <Link

            href="/orders"                              href={`/orders/${order.id}`}

            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"                              className="text-sm text-primary hover:text-primary/80"

          >                            >

            <div className="flex items-center gap-4">                              Ver Detalhes →

              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">                            </Link>

                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">                          </div>

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />                        </div>

                </svg>                      </div>

              </div>                    ))}

              <div>                  </div>

                <h3 className="font-semibold text-gray-900">Meus Pedidos</h3>                </div>

                <p className="text-sm text-gray-600">Acompanhe seus pedidos</p>              )}

              </div>

            </div>              {/* Endereços */}

          </Link>              {activeTab === 'addresses' && (

        </div>                <div>

      </div>                  <div className="flex justify-between items-center mb-6">

    </div>                    <h2 className="text-xl font-semibold text-gray-900">Meus Endereços</h2>

  )                    <Link href="/profile/addresses" className="btn-primary">

}                      Gerenciar Endereços

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