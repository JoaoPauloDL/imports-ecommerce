'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  fullName: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin: string
  orders: number
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    // Simular carregamento de usuários
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          fullName: 'João Silva',
          email: 'joao@email.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-15',
          orders: 5
        },
        {
          id: '2',
          fullName: 'Maria Santos',
          email: 'maria@email.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-08',
          lastLogin: '2024-01-14',
          orders: 3
        },
        {
          id: '3',
          fullName: 'Pedro Costa',
          email: 'pedro@email.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01',
          lastLogin: '2024-01-15',
          orders: 0
        },
        {
          id: '4',
          fullName: 'Ana Oliveira',
          email: 'ana@email.com',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-01-05',
          lastLogin: '2024-01-10',
          orders: 1
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getRoleColor = (role: User['role']) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800'
  }

  const getStatusColor = (status: User['status']) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || user.role === filterRole
    const matchesStatus = !filterStatus || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
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
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
        <p className="text-gray-600">Gerencie todos os usuários do sistema</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input w-full"
            >
              <option value="">Todas as funções</option>
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-full"
            >
              <option value="">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          <p className="text-sm text-gray-600">Total de Usuários</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </p>
          <p className="text-sm text-gray-600">Usuários Ativos</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
          <p className="text-sm text-gray-600">Administradores</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-2xl font-bold text-orange-600">
            {users.reduce((acc, user) => acc + user.orders, 0)}
          </p>
          <p className="text-sm text-gray-600">Total de Pedidos</p>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Usuário</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Função</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cadastro</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Último Login</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Pedidos</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-4 text-gray-900">{user.orders}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Editar
                      </button>
                      <button className={`text-sm font-medium ${
                        user.status === 'active' 
                          ? 'text-red-600 hover:text-red-800' 
                          : 'text-green-600 hover:text-green-800'
                      }`}>
                        {user.status === 'active' ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  )
}