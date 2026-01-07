'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Toast, { ToastType } from '@/components/ui/Toast'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive'
  image: string
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setToast({ message: 'Produto excluído com sucesso!', type: 'success' })
        fetchProducts() // Recarregar lista
      } else {
        const error = await response.json()
        setToast({ message: `Erro ao excluir: ${error.message || 'Falha desconhecida'}`, type: 'error' })
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      setToast({ message: 'Erro de conexão ao excluir produto', type: 'error' })
    }
  }

  const fetchProducts = async () => {
    try {
      console.log('🔄 Buscando produtos do backend...')
      const token = localStorage.getItem('token')
      console.log('🔑 Token:', token ? 'Encontrado' : 'Não encontrado')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📡 Status da resposta:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Dados recebidos:', data)
        console.log('📊 Tipo de dados:', Array.isArray(data) ? 'Array' : 'Object')
        console.log('📊 Quantidade:', Array.isArray(data) ? data.length : 'N/A')
        
        // Backend retorna array direto
        const productsArray = Array.isArray(data) ? data : (data.data || [])
        
        const adaptedProducts = productsArray.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          stock: product.stockQuantity || 0,
          category: product.categories && product.categories.length > 0 
            ? product.categories.map((c: any) => c.name).join(', ')
            : 'Sem categoria',
          status: product.isActive ? 'active' : 'inactive',
          image: product.imageUrl || '/api/placeholder/100/100'
        }))
        
        console.log('✅ Produtos adaptados:', adaptedProducts.length)
        setProducts(adaptedProducts)
      } else {
        const errorText = await response.text()
        console.error('❌ Erro ao carregar produtos:', response.status, errorText)
        setProducts([])
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com backend:', error)
      console.log('⚠️ Certifique-se de que o backend está rodando')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(product => product.category))]

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">📦 Gerenciar Produtos</h1>
          <p className="text-gray-600 text-sm lg:text-base">Gerencie o catálogo de produtos da loja</p>
        </div>
        <Link
          href="/admin/products/new"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Novo Produto
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input w-full"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Produto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Categoria</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Preço</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Estoque</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{product.category}</td>
                  <td className="py-4 px-4 text-gray-900">R$ {product.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-green-600' :
                      product.stock > 0 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mb-4">Tente ajustar os filtros ou adicione novos produtos.</p>
            <Link href="/admin/products/new" className="btn-primary">
              Adicionar Produto
            </Link>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          <p className="text-sm text-gray-600">Total de Produtos</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'active').length}
          </p>
          <p className="text-sm text-gray-600">Produtos Ativos</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => p.stock === 0).length}
          </p>
          <p className="text-sm text-gray-600">Fora de Estoque</p>
        </div>
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