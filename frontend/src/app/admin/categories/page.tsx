'use client'

import { useState } from 'react'
import { Category } from '@/services/categoryService'

// Mock de categorias para demonstrar administração
const mockCategories: Category[] = [
  {
    id: 'cat-001',
    name: 'Essências Árabes',
    slug: 'arabes',
    description: 'Aromas intensos e luxuosos do Oriente Médio',
    theme: {
      primary: 'from-amber-600 to-orange-600',
      secondary: 'bg-amber-50 border-amber-200',
      accent: 'bg-amber-600 hover:bg-amber-700',
      text: 'text-amber-600'
    },
    icon: '🏺',
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cat-002',
    name: 'Perfumes Franceses',
    slug: 'franceses',
    description: 'Elegância e sofisticação parisiense',
    theme: {
      primary: 'from-purple-600 to-pink-600',
      secondary: 'bg-purple-50 border-purple-200',
      accent: 'bg-purple-600 hover:bg-purple-700',
      text: 'text-purple-600'
    },
    icon: '🥐',
    isActive: true,
    sortOrder: 3,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
]

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleToggleActive = (id: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    )
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
    }
  }

  const themeOptions = [
    { label: 'Âmbar/Dourado', value: 'from-amber-600 to-orange-600', preview: 'bg-gradient-to-r from-amber-600 to-orange-600' },
    { label: 'Roxo/Rosa', value: 'from-purple-600 to-pink-600', preview: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { label: 'Azul/Índigo', value: 'from-blue-600 to-indigo-600', preview: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
    { label: 'Rosa/Pink', value: 'from-rose-600 to-pink-600', preview: 'bg-gradient-to-r from-rose-600 to-pink-600' },
    { label: 'Verde/Esmeralda', value: 'from-emerald-600 to-green-600', preview: 'bg-gradient-to-r from-emerald-600 to-green-600' },
    { label: 'Vermelho/Rosa', value: 'from-red-600 to-pink-600', preview: 'bg-gradient-to-r from-red-600 to-pink-600' },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h1>
          <p className="text-gray-600 mt-1">
            Configure as categorias que aparecem no menu principal
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingCategory(null)
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Nova Categoria
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Sistema Dinâmico de Categorias</h3>
        <p className="text-blue-800 text-sm">
          As categorias criadas aqui aparecerão automaticamente no menu principal do site. 
          Cada categoria pode ter seu próprio tema de cores personalizado para uma melhor experiência visual.
        </p>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                  {category.slug}
                </td>
                <td className="px-6 py-4">
                  <div className={`w-16 h-8 rounded bg-gradient-to-r ${category.theme.primary}`}></div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {category.sortOrder}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {category.isActive ? 'Ativa' : 'Inativa'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    defaultValue={editingCategory?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Perfumes Importados"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    defaultValue={editingCategory?.slug || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Ex: perfumes-importados"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  rows={3}
                  defaultValue={editingCategory?.description || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Descrição da categoria que aparecerá no site"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ícone Emoji</label>
                  <input
                    type="text"
                    defaultValue={editingCategory?.icon || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center text-2xl"
                    placeholder="🎯"
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordem</label>
                  <input
                    type="number"
                    defaultValue={editingCategory?.sortOrder || categories.length + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema de Cores</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {themeOptions.map((theme) => (
                    <label key={theme.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        defaultChecked={editingCategory?.theme.primary === theme.value}
                        className="text-blue-600"
                      />
                      <div className={`w-8 h-8 rounded ${theme.preview}`}></div>
                      <span className="text-sm font-medium">{theme.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  defaultChecked={editingCategory?.isActive ?? true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Categoria ativa (aparece no menu)
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'Atualizar' : 'Criar'} Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}