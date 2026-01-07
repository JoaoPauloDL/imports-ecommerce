'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import Image from 'next/image'

const toast = {
  success: (message: string) => {
    const event = new CustomEvent('show-toast', { detail: { message, type: 'success' } })
    window.dispatchEvent(event)
  },
  error: (message: string) => {
    const event = new CustomEvent('show-toast', { detail: { message, type: 'error' } })
    window.dispatchEvent(event)
  }
}

interface ShippingOption {
  id: string
  name: string
  company: string
  price: number
  deliveryTime: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, fetchCart, clearCart } = useCartStore()
  const { user, isAuthenticated, tokens } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>('')
  const [isInitializing, setIsInitializing] = useState(true)
  
  // Form data
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [document, setDocument] = useState('')
  
  const [zipCode, setZipCode] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'pix' | 'boleto'>('pix')

  // Extrair items e total do cart
  const items = cart?.items || []
  const cartTotal = cart?.total || 0

  useEffect(() => {
    console.log('🔍 Debug cart structure:', {
      cart,
      items,
      itemsLength: items.length,
      firstItem: items[0],
      firstItemFull: JSON.stringify(items[0], null, 2)
    })
  }, [cart, items])

  useEffect(() => {
    const loadCheckout = async () => {
      console.log('🏁 Carregando checkout...')
      await fetchCart()
      console.log('✅ Carrinho carregado')
      setIsInitializing(false)
    }
    loadCheckout()
  }, [fetchCart])

  useEffect(() => {
    if (!isInitializing) {
      console.log('🔍 Verificando autenticação e carrinho...', { isAuthenticated, itemsCount: items.length })
      
      if (!isAuthenticated) {
        console.log('❌ Não autenticado, redirecionando para login')
        toast.error('Faça login para finalizar sua compra')
        router.push('/login?redirect=/checkout')
        return
      }
      
      if (items.length === 0) {
        console.log('⚠️ Carrinho vazio, redirecionando...')
        router.push('/cart')
      }
    }
  }, [isInitializing, isAuthenticated, items, router])

  useEffect(() => {
    if (user) {
      console.log('👤 Carregando dados do usuário:', user)
      setFullName(user.fullName || '')
      setEmail(user.email || '')
    }
  }, [user])

  useEffect(() => {
    console.log('🛒 Estado do carrinho:', { cart, items, itemsLength: items.length, isAuthenticated, isInitializing })
  }, [cart, items, isAuthenticated, isInitializing])

  const handleZipCodeBlur = async () => {
    const cep = zipCode.replace(/\D/g, '')
    if (cep.length !== 8) return

    try {
      setLoadingShipping(true)
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (data.erro) {
        toast.error('CEP não encontrado')
        return
      }
      
      setStreet(data.logradouro || '')
      setNeighborhood(data.bairro || '')
      setCity(data.localidade || '')
      setState(data.uf || '')
      
      toast.success('Endereço encontrado!')
      await calculateShipping(cep)
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
      toast.error('Erro ao buscar CEP')
    } finally {
      setLoadingShipping(false)
    }
  }

  const calculateShipping = async (zipCodeValue: string) => {
    if (!items || items.length === 0) {
      console.log('⚠️ Sem items para calcular frete')
      toast.error('Carrinho vazio')
      return
    }

    if (!zipCodeValue || zipCodeValue.length !== 8) {
      console.log('⚠️ CEP inválido:', zipCodeValue)
      toast.error('CEP inválido. Digite um CEP válido com 8 dígitos.')
      return
    }

    try {
      setLoadingShipping(true)
      const token = tokens?.accessToken || localStorage.getItem('token')
      
      console.log('📦 Iniciando cálculo de frete')
      console.log('📦 CEP:', zipCodeValue)
      console.log('📦 Token presente:', !!token)
      
      // Mapear items de forma simples
      const shippingItems = items.map(item => ({
        weight: 0.5,
        length: 20,
        height: 10,
        width: 15,
        quantity: item.quantity || 1,
        value: Number(item.product?.price || 100)
      }))
      
      const payload = {
        zipCode: zipCodeValue,
        items: shippingItems
      }
      
      console.log('📦 Enviando payload:', payload)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      console.log('📦 Status da resposta:', response.status)
      
      const data = await response.json()
      console.log('📦 Dados recebidos:', data)
      
      // Backend sempre retorna options, mesmo em erro (fallback)
      if (data.options && Array.isArray(data.options)) {
        setShippingOptions(data.options)
        if (data.options.length > 0) {
          setSelectedShipping(data.options[0].id)
          console.log('✅ Frete calculado com sucesso!')
          toast.success(`${data.options.length} opções de frete disponíveis`)
        } else {
          console.log('⚠️ Nenhuma opção de frete retornada')
          toast.error('Nenhuma opção de frete disponível para este CEP')
        }
      } else {
        console.error('❌ Resposta inválida:', data)
        toast.error(data.error || data.message || 'Erro ao calcular frete')
      }
    } catch (err) {
      console.error('Erro ao calcular frete:', err)
      toast.error('Erro ao calcular frete')
    } finally {
      setLoadingShipping(false)
    }
  }

  const handleFinishOrder = async () => {
    console.log('🛒 Iniciando finalização do pedido')
    
    try {
      setLoading(true)
      
      // Verificar autenticação
      if (!isAuthenticated || !tokens?.accessToken) {
        console.log('❌ Não autenticado ou sem token')
        toast.error('Sessão expirada. Faça login novamente.')
        router.push('/login?redirect=/checkout')
        return
      }
      
      const token = tokens.accessToken
      
      console.log('🔑 Verificando token...')
      
      // Tentar um request simples primeiro para ver se o token está válido
      const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (testResponse.status === 401) {
        console.log('❌ Token expirado')
        toast.error('Sessão expirada. Faça login novamente.')
        router.push('/login?redirect=/checkout')
        return
      }
      
      console.log('✅ Token válido, continuando...')

      console.log('📍 Criando endereço...')
      
      const addressResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          zipCode,
          isDefault: true
        })
      })

      const addressData = await addressResponse.json()
      console.log('📍 Resposta do endereço:', addressResponse.status, addressData)

      if (!addressResponse.ok) {
        throw new Error(addressData.message || addressData.error || 'Erro ao criar endereço')
      }

      // O ID pode vir em addressData.id ou addressData.address.id
      const addressId = addressData.id || addressData.address?.id
      
      if (!addressId) {
        console.error('❌ Estrutura de resposta inesperada:', addressData)
        throw new Error('Endereço criado mas ID não encontrado na resposta')
      }
      
      console.log('✅ Endereço criado com ID:', addressId)

      console.log('📦 Criando pedido...')
      const orderPayload = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: Number(item.product.price)
        })),
        addressId: addressId,
        shippingCost: shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0,
        paymentMethod: paymentMethod
      }
      console.log('📦 Payload do pedido:', orderPayload)

      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      })

      const orderData = await orderResponse.json()
      console.log('✅ Pedido criado:', orderData)

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Erro ao criar pedido')
      }

      console.log('💳 Criando preferência de pagamento...')
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: orderData.order.id })
      })

      const paymentData = await paymentResponse.json()
      console.log('✅ Preferência criada:', paymentData)

      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || 'Erro ao criar pagamento')
      }

      console.log('🧹 Limpando carrinho...')
      await clearCart()

      console.log('🚀 Redirecionando para Mercado Pago:', paymentData.init_point)
      window.location.href = paymentData.init_point
      
    } catch (error: any) {
      console.error('❌ Erro ao finalizar pedido:', error)
      toast.error(error.message || 'Erro ao processar pedido')
    } finally {
      setLoading(false)
    }
  }

  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping)
  const shippingCost = selectedShippingOption?.price || 0
  const totalWithShipping = cartTotal + shippingCost

  const isFormValid = fullName && email && phone && zipCode && street && number && neighborhood && city && state && selectedShipping

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
          <p className="text-gray-600">Carregando checkout...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !items || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dados Pessoais */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input w-full"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input w-full"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="input w-full"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Endereço de Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    onBlur={handleZipCodeBlur}
                    className="input w-full"
                    placeholder="00000-000"
                    disabled={loadingShipping}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                    className="input w-full"
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="input w-full"
                    placeholder="Nome da rua"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="input w-full"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className="input w-full"
                    placeholder="Apto, bloco, etc"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="input w-full"
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input w-full"
                    placeholder="Cidade"
                  />
                </div>
              </div>

              {/* Botão para calcular frete manualmente */}
              {zipCode.length === 8 && !loadingShipping && shippingOptions.length === 0 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => calculateShipping(zipCode)}
                    className="btn-secondary w-full"
                  >
                    Calcular Frete
                  </button>
                </div>
              )}

              {/* Opções de Frete */}
              {loadingShipping && (
                <div className="mt-4 text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                  <p className="mt-2 text-sm text-gray-600">Calculando frete...</p>
                </div>
              )}

              {shippingOptions.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Opções de Frete</h3>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedShipping === option.id
                            ? 'border-slate-800 bg-slate-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="w-4 h-4 text-slate-800"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{option.name}</p>
                            <p className="text-sm text-gray-500">
                              {option.company || 'Transportadora'}
                            </p>
                            <p className="text-sm text-gray-500">{option.deliveryTime}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">R$ {option.price.toFixed(2)}</p>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pagamento */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Forma de Pagamento</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'pix', name: 'PIX', icon: '🔄' },
                  { id: 'credit', name: 'Crédito', icon: '💳' },
                  { id: 'debit', name: 'Débito', icon: '💳' },
                  { id: 'boleto', name: 'Boleto', icon: '📄' }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      paymentMethod === method.id
                        ? 'border-slate-800 bg-slate-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <div className="text-sm font-medium">{method.name}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  ℹ️ Você será redirecionado para o Mercado Pago para finalizar o pagamento com segurança.
                </p>
              </div>
            </div>

          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        R$ {(Number(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Valores */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium">
                    {selectedShipping ? `R$ ${shippingCost.toFixed(2)}` : 'Calcular'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>R$ {totalWithShipping.toFixed(2)}</span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <button
                type="button"
                onClick={handleFinishOrder}
                disabled={loading || !isFormValid}
                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </>
                ) : (
                  'Finalizar Pedido'
                )}
              </button>

              {!isFormValid && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  Preencha todos os campos obrigatórios (*)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
