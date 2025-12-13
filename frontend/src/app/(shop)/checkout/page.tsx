'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import Image from 'next/image'

// Toast customizado
const toast = {
  success: (message: string) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, type: 'success' }
    })
    window.dispatchEvent(event)
  },
  error: (message: string) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, type: 'error' }
    })
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

interface CheckoutData {
  personal: {
    fullName: string
    email: string
    phone: string
    document: string
  }
  address: {
    zipCode: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }
  payment: {
    method: 'credit' | 'debit' | 'pix' | 'boleto'
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total: cartTotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingShipping, setLoadingShipping] = useState(false)
  
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>('')
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    personal: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      document: ''
    },
    address: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    payment: {
      method: 'pix'
    }
  })

  // Redirect se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para finalizar sua compra')
      router.push('/login?redirect=/checkout')
    }
  }, [isAuthenticated, router])

  // Redirect se carrinho vazio
  useEffect(() => {
    if (items && items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  // Preencher dados do usuário quando carregar
  useEffect(() => {
    if (user) {
      setCheckoutData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || ''
        }
      }))
    }
  }, [user])

  // Buscar endereço por CEP
  const handleZipCodeBlur = async () => {
    const cep = checkoutData.address.zipCode.replace(/\D/g, '')
    
    if (cep.length !== 8) return

    try {
      setLoadingShipping(true)
      
      // Buscar endereço na API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (data.erro) {
        toast.error('CEP não encontrado')
        return
      }
      
      setCheckoutData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          street: data.logradouro || prev.address.street,
          neighborhood: data.bairro || prev.address.neighborhood,
          city: data.localidade || prev.address.city,
          state: data.uf || prev.address.state
        }
      }))
      
      toast.success('Endereço encontrado!')
      
      // Calcular frete automaticamente
      await calculateShipping(cep)
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
      toast.error('Erro ao buscar CEP')
    } finally {
      setLoadingShipping(false)
    }
  }

  // Calcular frete
  const calculateShipping = async (zipCode: string) => {
    try {
      setLoadingShipping(true)
      
      const token = localStorage.getItem('token')
      
      const response = await fetch('http://localhost:5000/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toZipCode: zipCode,
          items: items.map(item => ({
            weight: 0.5,
            length: 20,
            height: 10,
            width: 15,
            quantity: item.quantity,
            value: Number(item.product.price)
          }))
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.options) {
        setShippingOptions(data.options)
        
        if (data.options.length > 0) {
          setSelectedShipping(data.options[0].id)
        }
        
        toast.success('Frete calculado!')
      } else {
        toast.error(data.message || 'Erro ao calcular frete')
      }
    } catch (err) {
      console.error('Erro ao calcular frete:', err)
      toast.error('Erro ao calcular frete')
    } finally {
      setLoadingShipping(false)
    }
  }

  const handlePersonalDataChange = (field: keyof CheckoutData['personal'], value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }))
  }

  const handleAddressChange = (field: keyof CheckoutData['address'], value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }))
  }

  const handlePaymentChange = (method: CheckoutData['payment']['method']) => {
    setCheckoutData(prev => ({
      ...prev,
      payment: { method }
    }))
  }

  // Finalizar compra
  const handleFinishOrder = async () => {
    // Validações
    if (!checkoutData.address.zipCode || !checkoutData.address.street || !checkoutData.address.number || 
        !checkoutData.address.neighborhood || !checkoutData.address.city || !checkoutData.address.state) {
      toast.error('Preencha todos os campos obrigatórios do endereço')
      return
    }

    if (!selectedShipping) {
      toast.error('Selecione uma opção de frete')
      return
    }

    try {
      setLoading(true)
      
      const token = localStorage.getItem('token')
      
      // 1. Criar endereço
      const addressResponse = await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...checkoutData.address,
          isDefault: true
        })
      })
      
      const addressData = await addressResponse.json()
      
      if (!addressResponse.ok) {
        throw new Error(addressData.message || 'Erro ao criar endereço')
      }
      
      const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping)
      
      // 2. Criar pedido
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          addressId: addressData.address.id,
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: Number(item.product.price)
          })),
          shippingCost: selectedShippingOption?.price || 0,
          shippingMethod: selectedShippingOption?.name || 'PAC'
        })
      })
      
      const orderData = await orderResponse.json()
      
      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Erro ao criar pedido')
      }
      
      // 3. Criar preferência de pagamento no MercadoPago
      const paymentResponse = await fetch('http://localhost:5000/api/payment/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderData.order.id
        })
      })
      
      const paymentData = await paymentResponse.json()
      
      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || 'Erro ao criar pagamento')
      }
      
      // 4. Limpar carrinho
      clearCart()
      
      // 5. Redirecionar para MercadoPago
      if (paymentData.init_point) {
        window.location.href = paymentData.init_point
      } else {
        throw new Error('Link de pagamento não encontrado')
      }
    } catch (err: any) {
      console.error('Erro ao finalizar compra:', err)
      toast.error(err.message || 'Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping)
  const shippingCost = selectedShippingOption?.price || 0
  const totalWithShipping = cartTotal + shippingCost

  const steps = [
    { id: 1, name: 'Dados Pessoais', completed: currentStep > 1 },
    { id: 2, name: 'Endereço', completed: currentStep > 2 },
    { id: 3, name: 'Pagamento', completed: currentStep > 3 },
    { id: 4, name: 'Revisão', completed: false }
  ]

  if (!isAuthenticated || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    step.completed || currentStep >= step.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                    step.completed || currentStep >= step.id ? 'text-slate-800' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {stepIdx < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-4 ${
                    step.completed ? 'bg-slate-800' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {/* Step 1: Dados Pessoais */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Pessoais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.personal.fullName}
                        onChange={(e) => handlePersonalDataChange('fullName', e.target.value)}
                        className="input w-full"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={checkoutData.personal.email}
                        onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                        className="input w-full"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        value={checkoutData.personal.phone}
                        onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                        className="input w-full"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF/CNPJ *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.personal.document}
                        onChange={(e) => handlePersonalDataChange('document', e.target.value)}
                        className="input w-full"
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn-primary"
                      disabled={!checkoutData.personal.fullName || !checkoutData.personal.email || !checkoutData.personal.phone}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Endereço */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Endereço de Entrega</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CEP *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.address.zipCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 8)
                          handleAddressChange('zipCode', value)
                        }}
                        onBlur={handleZipCodeBlur}
                        className="input w-full"
                        placeholder="00000-000"
                        required
                        disabled={loadingShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value.toUpperCase().slice(0, 2))}
                        className="input w-full"
                        placeholder="SP"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        className="input w-full"
                        placeholder="Nome da rua"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.address.number}
                        onChange={(e) => handleAddressChange('number', e.target.value)}
                        className="input w-full"
                        placeholder="123"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={checkoutData.address.complement}
                        onChange={(e) => handleAddressChange('complement', e.target.value)}
                        className="input w-full"
                        placeholder="Apto 45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.address.neighborhood}
                        onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                        className="input w-full"
                        placeholder="Nome do bairro"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={checkoutData.address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="input w-full"
                        placeholder="Nome da cidade"
                        required
                      />
                    </div>
                  </div>

                  {/* Opções de Frete */}
                  {loadingShipping && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <p className="text-blue-700">Calculando frete...</p>
                    </div>
                  )}

                  {shippingOptions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Opções de Frete</h3>
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
                                <p className="text-sm text-gray-500">{option.company}</p>
                                <p className="text-sm text-gray-500">{option.deliveryTime}</p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              R$ {option.price.toFixed(2)}
                            </p>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn-secondary"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="btn-primary"
                      disabled={!checkoutData.address.zipCode || !selectedShipping}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Pagamento */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Forma de Pagamento</h2>
                  
                  {/* Métodos de Pagamento */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { id: 'pix', name: 'PIX', icon: '🔄' },
                      { id: 'credit', name: 'Crédito', icon: '💳' },
                      { id: 'debit', name: 'Débito', icon: '💳' },
                      { id: 'boleto', name: 'Boleto', icon: '📄' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentChange(method.id as any)}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          checkoutData.payment.method === method.id
                            ? 'border-slate-800 bg-slate-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="text-sm font-medium">{method.name}</div>
                      </button>
                    ))}
                  </div>

                  {checkoutData.payment.method === 'pix' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-blue-600 mr-3 text-2xl">🔄</div>
                        <div>
                          <h3 className="font-medium text-blue-900">PIX - Pagamento Instantâneo</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Após confirmar, você será redirecionado para o Mercado Pago onde receberá o QR Code para pagamento instantâneo.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutData.payment.method === 'credit' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-emerald-600 mr-3 text-2xl">💳</div>
                        <div>
                          <h3 className="font-medium text-emerald-900">Cartão de Crédito</h3>
                          <p className="text-sm text-emerald-700 mt-1">
                            Você será redirecionado para o Mercado Pago para inserir os dados do cartão com segurança. Parcelamento em até 12x.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutData.payment.method === 'debit' && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-indigo-600 mr-3 text-2xl">💳</div>
                        <div>
                          <h3 className="font-medium text-indigo-900">Cartão de Débito</h3>
                          <p className="text-sm text-indigo-700 mt-1">
                            Você será redirecionado para o Mercado Pago para inserir os dados do cartão com segurança.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutData.payment.method === 'boleto' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-yellow-600 mr-3 text-2xl">📄</div>
                        <div>
                          <h3 className="font-medium text-yellow-900">Boleto Bancário</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            O boleto será gerado no Mercado Pago após a confirmação do pedido. Prazo de vencimento: 3 dias úteis.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn-secondary"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="btn-primary"
                    >
                      Revisar Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Revisão */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Revisar Pedido</h2>
                  
                  {/* Dados Pessoais */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Dados Pessoais</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <p className="text-sm"><strong>Nome:</strong> {checkoutData.personal.fullName}</p>
                      <p className="text-sm"><strong>Email:</strong> {checkoutData.personal.email}</p>
                      <p className="text-sm"><strong>Telefone:</strong> {checkoutData.personal.phone}</p>
                      <p className="text-sm"><strong>CPF/CNPJ:</strong> {checkoutData.personal.document}</p>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Endereço de Entrega</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <p className="text-sm">{checkoutData.address.street}, {checkoutData.address.number}</p>
                      {checkoutData.address.complement && <p className="text-sm">{checkoutData.address.complement}</p>}
                      <p className="text-sm">{checkoutData.address.neighborhood} - {checkoutData.address.city}/{checkoutData.address.state}</p>
                      <p className="text-sm">CEP: {checkoutData.address.zipCode}</p>
                      {selectedShippingOption && (
                        <p className="text-sm mt-2"><strong>Frete:</strong> {selectedShippingOption.name} - {selectedShippingOption.deliveryTime}</p>
                      )}
                    </div>
                  </div>

                  {/* Pagamento */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Forma de Pagamento</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm">
                        {checkoutData.payment.method === 'credit' && '💳 Cartão de Crédito (Mercado Pago)'}
                        {checkoutData.payment.method === 'debit' && '💳 Cartão de Débito (Mercado Pago)'}
                        {checkoutData.payment.method === 'pix' && '🔄 PIX (Pagamento Instantâneo)'}
                        {checkoutData.payment.method === 'boleto' && '📄 Boleto Bancário'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="btn-secondary"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleFinishOrder}
                      disabled={loading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.product.imageUrl || '/placeholder.png'}
                      alt={item.product.name}
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold whitespace-nowrap">
                      R$ {(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <hr className="mb-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-bold">Calcule</span>
                    ) : (
                      `R$ ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>R$ {totalWithShipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Pagamento seguro via Mercado Pago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
