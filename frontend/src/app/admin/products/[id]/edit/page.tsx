'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Toast, { ToastType } from '@/components/ui/Toast'
import ImageUpload from '@/components/admin/ImageUpload'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  is_active: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  sku: string
  stockQuantity: number
  categoryId: string | null
  imageUrl: string | null
  featured: boolean
  isActive: boolean
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    sku: '',
    stockQuantity: '',
    categoryIds: [] as string[], // Array de IDs de categorias
    imageUrl: '',
    images: [] as string[], // Array de URLs de imagens
    featured: false,
    isActive: true
  })

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        const product = result.data || result
        
        console.log('📦 Produto carregado:', product)
        console.log('📂 Categorias do produto:', product.categories)
        
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          sku: product.sku || '',
          stockQuantity: product.stockQuantity?.toString() || '',
          categoryIds: product.categories ? product.categories.map((c: any) => c.id) : [],
          imageUrl: product.imageUrl || '',
          images: product.images || (product.imageUrl ? [product.imageUrl] : []),
          featured: product.featured || false,
          isActive: product.isActive !== false
        })
      } else {
        const errorText = await response.text()
        console.error('❌ Erro ao carregar produto:', response.status, errorText)
        alert('Erro ao carregar produto')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
      alert('Erro de conexão ao carregar produto')
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setCategories(data)
        } else if (data && Array.isArray(data.data)) {
          setCategories(data.data)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    console.log('🔍 Estado do formData antes de enviar:', formData)
    console.log('🔍 categoryIds especificamente:', formData.categoryIds)
    console.log('🔍 Tipo de categoryIds:', typeof formData.categoryIds, Array.isArray(formData.categoryIds))

    try {
      const token = localStorage.getItem('token')
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        sku: formData.sku,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        categoryIds: formData.categoryIds, // Array de IDs
        imageUrl: formData.imageUrl || null,
        featured: formData.featured,
        isActive: formData.isActive
      }

      console.log('📤 Enviando dados do produto:', productData)
      console.log('📤 categoryIds no productData:', productData.categoryIds)

      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      const result = await response.json()
      console.log('📥 Resposta do servidor:', result)

      if (response.ok) {
        setToast({ message: 'Produto atualizado com sucesso!', type: 'success' })
        setTimeout(() => router.push('/admin/products'), 1500)
      } else {
        setToast({ message: result.error || result.message || 'Falha ao atualizar produto', type: 'error' })
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      setToast({ message: 'Erro de conexão ao atualizar produto', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6 pt-4">
        <div className="max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/admin/products"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
            <p className="text-gray-600">Altere as informações do produto</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
                  Categorias (segure Ctrl para selecionar múltiplas)
                </label>
                {loadingCategories ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    Carregando...
                  </div>
                ) : (
                  <select
                    id="categories"
                    name="categories"
                    multiple
                    value={formData.categoryIds}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                      console.log('📋 Categorias selecionadas:', selectedOptions)
                      setFormData(prev => ({
                        ...prev,
                        categoryIds: selectedOptions
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Original (R$)
                  <span className="text-gray-500 text-xs ml-2">(opcional - para mostrar desconto)</span>
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Estoque *
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  required
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                  SKU <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: IPHONE-15-PRO"
                />
              </div>
            </div>

            {/* Upload de Imagens */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens do Produto *
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Arraste e solte até 5 imagens. A primeira será a imagem principal.
              </p>
              <ImageUpload
                images={formData.images}
                onImagesChange={(newImages) => {
                  console.log('🖼️ Imagens atualizadas:', newImages);
                  setFormData(prev => ({
                    ...prev,
                    imageUrl: newImages[0] || '',
                    images: newImages
                  }));
                }}
                maxImages={5}
              />
              {formData.images.length > 0 && (
                <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                  ✅ {formData.images.length} imagem(ns) carregada(s)
                </div>
              )}
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Categorias</h2>
            
            {loadingCategories ? (
              <div className="text-gray-500">Carregando categorias...</div>
            ) : categories.length > 0 ? (
              <div className="space-y-2">
                {categories.filter(cat => cat.is_active).map(category => {
                  const isChecked = formData.categoryIds.includes(category.id)
                  return (
                    <label key={category.id} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          console.log(`☑️ Checkbox ${category.name} (${category.id}) mudou para: ${e.target.checked}`)
                          console.log('☑️ categoryIds ANTES:', formData.categoryIds)
                          
                          setFormData(prev => {
                            let newCategoryIds: string[]
                            if (e.target.checked) {
                              // Adicionar categoria
                              newCategoryIds = [...prev.categoryIds, category.id]
                              console.log('➕ Adicionando categoria. Novo array:', newCategoryIds)
                            } else {
                              // Remover categoria
                              newCategoryIds = prev.categoryIds.filter(id => id !== category.id)
                              console.log('➖ Removendo categoria. Novo array:', newCategoryIds)
                            }
                            
                            return {
                              ...prev,
                              categoryIds: newCategoryIds
                            }
                          })
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Nenhuma categoria disponível. 
                <Link href="/admin/categories" className="text-blue-600 hover:underline ml-1">
                  Crie uma categoria primeiro
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Opções</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                  Produto em destaque
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Produto ativo (visível na loja)
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
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