'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  is_active: boolean
  order: number
  created_at: string
  updated_at: string
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    order: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      console.log('🔄 Buscando categorias...')
      const response = await fetch('http://localhost:5000/api/categories')
      
      if (response.ok) {
        const data = await response.json()
        console.log('📋 Dados recebidos da API:', data)
        console.log('📋 Tipo dos dados:', typeof data, Array.isArray(data))
        
        // Garantir que sempre temos um array
        if (Array.isArray(data)) {
          setCategories(data)
        } else if (data && Array.isArray(data.data)) {
          // Se a API retorna { data: [...] }
          setCategories(data.data)
        } else if (data && data.categories && Array.isArray(data.categories)) {
          // Se a API retorna { categories: [...] }
          setCategories(data.categories)
        } else {
          console.warn('⚠️ Dados não são array, usando fallback')
          setCategories([])
        }
      } else {
        console.error('❌ Erro ao carregar categorias:', response.status)
        setCategories([])
      }
    } catch (error) {
      console.error('💥 Erro ao conectar com backend:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('http://localhost:5000/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      })

      if (response.ok) {
        const result = await response.json()
        setCategories(prev => [...prev, result.data])
        setNewCategory({
          name: '',
          slug: '',
          description: '',
          is_active: true,
          order: 0
        })
        setShowForm(false)
        alert('Categoria criada com sucesso!')
      } else {
        const error = await response.json()
        alert(`Erro ao criar categoria: ${error.message}`)
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setCreating(false)
    }
  }

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !currentStatus
        })
      })

      if (response.ok) {
        const result = await response.json()
        setCategories(prev => 
          prev.map(cat => 
            cat.id === categoryId 
              ? { ...cat, is_active: !currentStatus }
              : cat
          )
        )
      } else {
        alert('Erro ao atualizar categoria')
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      alert('Erro ao conectar com o servidor')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCategory(prev => ({
      ...prev,
      [name]: value,
      // Auto-gerar slug se estiver editando o nome
      ...(name === 'name' && {
        slug: value.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      })
    }))
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6 pt-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">🏷️ Gerenciar Categorias</h1>
          <p className="text-gray-600 text-sm lg:text-base">Organize seus produtos por categorias</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
        >
          {showForm ? '✕ Cancelar' : '+ Nova Categoria'}
        </button>
      </div>

      {/* Formulário de Nova Categoria */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Criar Nova Categoria</h2>
          
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Perfumes Premium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={newCategory.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="perfumes-premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                rows={3}
                value={newCategory.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva a categoria..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newCategory.is_active}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Categoria ativa</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                <input
                  type="number"
                  name="order"
                  min="0"
                  value={newCategory.order}
                  onChange={handleInputChange}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Criando...' : 'Criar Categoria'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Categorias */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Categorias Existentes ({categories.length})</h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p>Nenhuma categoria encontrada</p>
            <p className="text-sm text-gray-400 mt-1">
              ⚠️ Verifique se o backend está rodando em http://localhost:5000
            </p>
            <button 
              onClick={fetchCategories}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {Array.isArray(categories) && categories.map((category) => (
              <div key={category.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">/{category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Ordem: {category.order}
                      </span>
                      
                      <span className={`text-xs px-2 py-1 rounded ${
                        category.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      category.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {category.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status do Backend */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold mb-2 text-blue-800">✅ Status do Sistema:</h3>
        <div className="text-xs space-y-1 text-blue-700">
          <p>🔗 Backend: <a href="http://localhost:5000/health" target="_blank" className="underline">http://localhost:5000</a></p>
          <p>📊 Categorias carregadas: {categories.length}</p>
          <p>🔄 Última atualização: {new Date().toLocaleTimeString()}</p>
          <p>🛍️ Essas são as categorias de perfumes que você implementou!</p>
        </div>
      </div>
      </div>
    </div>
  )
}