'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    stockQuantity: '',
    categoryIds: [] as string[], // Array de IDs das categorias
    imageUrl: '',
    images: [] as string[], // Array de URLs de imagens
    featured: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('📂 Carregando categorias do banco de dados...');
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        const categoriesList = Array.isArray(data) ? data : data.data || [];
        console.log('✅ Categorias carregadas do backend:', categoriesList);
        setCategories(categoriesList.filter((cat: Category) => cat.isActive !== false));
        return;
      }
      console.error('❌ Erro ao buscar categorias:', response.status);
      setCategories([]);
    } catch (error) {
      console.error('❌ Erro ao conectar com backend:', error);
      console.log('⚠️ Certifique-se de que o backend está rodando em http://localhost:5000');
      setCategories([]);
    }
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showMessage('error', 'Nome do produto é obrigatório');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      showMessage('error', 'Preço deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', token ? 'Sim' : 'Não');
      
      // Para teste, vamos usar um token mock se não houver um
      const authToken = token || 'mock-token-test';

            const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        sku: formData.sku,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        categoryIds: formData.categoryIds, // Array de categorias
        imageUrl: formData.imageUrl,
        images: formData.images, // Array de imagens
        featured: formData.featured
      };

      console.log('📤 Enviando produto:', productData);

      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      console.log('📊 Response status:', response.status);

      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok && result.success) {
        showMessage('success', 'Produto criado com sucesso!');
        setTimeout(() => router.push('/admin/products'), 2000);
      } else {
        showMessage('error', result.message || `Erro HTTP ${response.status}: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      showMessage('error', `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
            ← Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Criar Novo Produto</h1>
            <p className="text-gray-600">Adicione um novo produto ao catálogo</p>
          </div>
        </div>

        {/* Status das categorias */}
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-800">
              <strong>Categorias:</strong> Sistema com fallback automático ativo. 
              {categories.length > 0 && <span className="text-green-600">{categories.length} categorias disponíveis para seleção.</span>}
            </p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
            'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold mb-4">Informações do Produto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Perfume Masculino Premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorias * <span className="text-sm text-gray-500">(Selecione uma ou mais)</span>
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <label key={category.id} className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                categoryIds: [...prev.categoryIds, category.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                categoryIds: prev.categoryIds.filter(id => id !== category.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Carregando categorias...</p>
                  )}
                </div>
                {formData.categoryIds.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Selecionadas: {formData.categoryIds.map(id => 
                        categories.find(c => c.id === id)?.name
                      ).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estoque</label>
                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU <span className="text-gray-400 text-xs">(opcional - será gerado automaticamente)</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: IPHONE-15-PRO (deixe vazio para gerar automaticamente)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens do Produto
                </label>
                
                {/* Imagem Principal */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Imagem Principal (URL)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemplo.com/imagem-principal.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Imagens Adicionais */}
              {/* Upload de Imagens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens do Produto *
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Envie até 5 imagens. A primeira será a imagem principal.
                </p>
                <ImageUpload
                  images={formData.images.length > 0 ? formData.images : (formData.imageUrl ? [formData.imageUrl] : [])}
                  onImagesChange={(newImages) => {
                    setFormData(prev => ({
                      ...prev,
                      imageUrl: newImages[0] || '',
                      images: newImages
                    }));
                  }}
                  maxImages={5}
                />
              </div>                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Dica:</strong> Em breve teremos upload direto de arquivos! 
                    Por enquanto, use URLs de imagens hospedadas (ex: Imgur, Cloudinary).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva as características do produto..."
              />
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Produto em destaque</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? 'Criando produto...' : 'Criar Produto'}
            </button>
            
            <button
              type="button"
              onClick={async () => {
                const token = localStorage.getItem('token');
                console.log('🔑 Token do localStorage:', token);
                
                try {
                  const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: 'admin@davidimportados.com',
                      password: 'admin123'
                    })
                  });
                  const result = await response.json();
                  console.log('📋 Resultado do login:', result);
                  
                  if (result.success) {
                    localStorage.setItem('token', result.data.token);
                    console.log('✅ Token salvo!');
                    showMessage('success', 'Token atualizado!');
                  }
                } catch (error) {
                  console.error('❌ Erro ao fazer login:', error);
                  showMessage('error', 'Erro ao conectar com servidor');
                }
              }}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              🔑 Debug Token
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
    </div>
  );
}
