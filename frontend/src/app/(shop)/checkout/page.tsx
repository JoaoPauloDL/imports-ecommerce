'use client'



import { useState, useEffect } from 'react'import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useCartStore } from '@/store/cartStore'import Image from 'next/image'

import { useAuthStore } from '@/store/authStore'

import { formatPrice } from '@/lib/utils'interface CartItem {

  id: string

interface ShippingOption {  name: string

  id: string  price: number

  name: string  image: string

  company: string  quantity: number

  price: number}

  deliveryTime: string

}interface CheckoutData {

  personal: {

interface Address {    fullName: string

  zipCode: string    email: string

  street: string    phone: string

  number: string    document: string

  complement: string  }

  neighborhood: string  address: {

  city: string    zipCode: string

  state: string    street: string

}    number: string

    complement: string

export default function CheckoutPage() {    neighborhood: string

  const router = useRouter()    city: string

  const { items, total: cartTotal, clearCart } = useCartStore()    state: string

  const { user, isAuthenticated } = useAuthStore()  }

    payment: {

  const [loading, setLoading] = useState(false)    method: 'credit' | 'debit' | 'pix' | 'boleto'

  const [loadingShipping, setLoadingShipping] = useState(false)    cardNumber: string

  const [error, setError] = useState('')    cardName: string

      cardExpiry: string

  // Dados do endereço    cardCvv: string

  const [address, setAddress] = useState<Address>({  }

    zipCode: '',}

    street: '',

    number: '',export default function CheckoutPage() {

    complement: '',  const router = useRouter()

    neighborhood: '',  const [currentStep, setCurrentStep] = useState(1)

    city: '',  const [loading, setLoading] = useState(false)

    state: ''  

  })  // Dados simulados do carrinho

    const [cartItems] = useState<CartItem[]>([

  // Opções de frete    {

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])      id: '1',

  const [selectedShipping, setSelectedShipping] = useState<string>('')      name: 'iPhone 15 Pro Max',

        price: 8999.99,

  // Redirect se não estiver autenticado      image: '/api/placeholder/80/80',

  useEffect(() => {      quantity: 1

    if (!isAuthenticated) {    },

      router.push('/login?redirect=/checkout')    {

    }      id: '3',

  }, [isAuthenticated, router])      name: 'AirPods Pro 2ª Geração',

        price: 1899.99,

  // Redirect se carrinho vazio      image: '/api/placeholder/80/80',

  useEffect(() => {      quantity: 2

    if (items.length === 0) {    }

      router.push('/cart')  ])

    }

  }, [items, router])  const [checkoutData, setCheckoutData] = useState<CheckoutData>({

      personal: {

  // Buscar endereço por CEP      fullName: '',

  const handleZipCodeBlur = async () => {      email: '',

    const cep = address.zipCode.replace(/\D/g, '')      phone: '',

          document: ''

    if (cep.length !== 8) return    },

        address: {

    try {      zipCode: '',

      setLoadingShipping(true)      street: '',

            number: '',

      // Buscar endereço na API ViaCEP      complement: '',

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)      neighborhood: '',

      const data = await response.json()      city: '',

            state: ''

      if (data.erro) {    },

        setError('CEP não encontrado')    payment: {

        return      method: 'credit',

      }      cardNumber: '',

            cardName: '',

      setAddress(prev => ({      cardExpiry: '',

        ...prev,      cardCvv: ''

        street: data.logradouro || prev.street,    }

        neighborhood: data.bairro || prev.neighborhood,  })

        city: data.localidade || prev.city,

        state: data.uf || prev.state  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      }))  const shipping = subtotal > 500 ? 0 : 49.90

        const total = subtotal + shipping

      // Calcular frete automaticamente

      await calculateShipping(cep)  const handlePersonalDataChange = (field: keyof CheckoutData['personal'], value: string) => {

    } catch (err) {    setCheckoutData(prev => ({

      console.error('Erro ao buscar CEP:', err)      ...prev,

      setError('Erro ao buscar CEP')      personal: { ...prev.personal, [field]: value }

    } finally {    }))

      setLoadingShipping(false)  }

    }

  }  const handleAddressChange = (field: keyof CheckoutData['address'], value: string) => {

      setCheckoutData(prev => ({

  // Calcular frete      ...prev,

  const calculateShipping = async (zipCode: string) => {      address: { ...prev.address, [field]: value }

    try {    }))

      setLoadingShipping(true)  }

      setError('')

        const handlePaymentChange = (field: keyof CheckoutData['payment'], value: string) => {

      const token = localStorage.getItem('token')    setCheckoutData(prev => ({

            ...prev,

      const response = await fetch('http://localhost:5000/api/shipping/calculate', {      payment: { ...prev.payment, [field]: value }

        method: 'POST',    }))

        headers: {  }

          'Content-Type': 'application/json',

          'Authorization': `Bearer ${token}`  const handleSubmitOrder = async () => {

        },    setLoading(true)

        body: JSON.stringify({    try {

          toZipCode: zipCode,      // Simular processamento do pedido

          items: items.map(item => ({      await new Promise(resolve => setTimeout(resolve, 2000))

            weight: 0.5, // kg (deve vir do produto)      router.push('/checkout/success')

            length: 20,  // cm (deve vir do produto)    } catch (error) {

            height: 10,  // cm (deve vir do produto)      console.error('Erro ao processar pedido:', error)

            width: 15,   // cm (deve vir do produto)    } finally {

            quantity: item.quantity      setLoading(false)

          }))    }

        })  }

      })

        const steps = [

      const data = await response.json()    { id: 1, name: 'Dados Pessoais', completed: currentStep > 1 },

          { id: 2, name: 'Endereço', completed: currentStep > 2 },

      if (response.ok && data.options) {    { id: 3, name: 'Pagamento', completed: currentStep > 3 },

        setShippingOptions(data.options)    { id: 4, name: 'Revisão', completed: false }

          ]

        // Selecionar a primeira opção por padrão

        if (data.options.length > 0) {  return (

          setSelectedShipping(data.options[0].id)    <div className="min-h-screen bg-gray-50">

        }      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      } else {        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        setError(data.message || 'Erro ao calcular frete')

      }        {/* Progress Steps */}

    } catch (err) {        <div className="mb-8">

      console.error('Erro ao calcular frete:', err)          <div className="flex items-center justify-between">

      setError('Erro ao calcular frete')            {steps.map((step, stepIdx) => (

    } finally {              <div key={step.id} className="flex items-center">

      setLoadingShipping(false)                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${

    }                  step.completed || currentStep >= step.id

  }                    ? 'bg-primary text-white'

                      : 'bg-gray-200 text-gray-600'

  // Finalizar compra                }`}>

  const handleFinishOrder = async () => {                  {step.completed ? (

    // Validações                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

    if (!address.zipCode || !address.street || !address.number || !address.neighborhood || !address.city || !address.state) {                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />

      setError('Preencha todos os campos obrigatórios do endereço')                    </svg>

      return                  ) : (

    }                    step.id

                      )}

    if (!selectedShipping) {                </div>

      setError('Selecione uma opção de frete')                <span className={`ml-2 text-sm font-medium ${

      return                  step.completed || currentStep >= step.id ? 'text-primary' : 'text-gray-500'

    }                }`}>

                      {step.name}

    try {                </span>

      setLoading(true)                {stepIdx < steps.length - 1 && (

      setError('')                  <div className={`w-16 h-0.5 ml-4 ${

                          step.completed ? 'bg-primary' : 'bg-gray-200'

      const token = localStorage.getItem('token')                  }`} />

                      )}

      // 1. Criar endereço              </div>

      const addressResponse = await fetch('http://localhost:5000/api/addresses', {            ))}

        method: 'POST',          </div>

        headers: {        </div>

          'Content-Type': 'application/json',

          'Authorization': `Bearer ${token}`        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        },          {/* Formulário */}

        body: JSON.stringify({          <div className="lg:col-span-2">

          ...address,            <div className="bg-white rounded-lg shadow-sm border p-6">

          isDefault: true              {/* Step 1: Dados Pessoais */}

        })              {currentStep === 1 && (

      })                <div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Pessoais</h2>

      const addressData = await addressResponse.json()                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          <div className="md:col-span-2">

      if (!addressResponse.ok) {                      <label className="block text-sm font-medium text-gray-700 mb-1">

        throw new Error(addressData.message || 'Erro ao criar endereço')                        Nome Completo *

      }                      </label>

                            <input

      const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping)                        type="text"

                              value={checkoutData.personal.fullName}

      // 2. Criar pedido                        onChange={(e) => handlePersonalDataChange('fullName', e.target.value)}

      const orderResponse = await fetch('http://localhost:5000/api/orders', {                        className="input w-full"

        method: 'POST',                        placeholder="Seu nome completo"

        headers: {                        required

          'Content-Type': 'application/json',                      />

          'Authorization': `Bearer ${token}`                    </div>

        },                    <div>

        body: JSON.stringify({                      <label className="block text-sm font-medium text-gray-700 mb-1">

          addressId: addressData.address.id,                        Email *

          items: items.map(item => ({                      </label>

            productId: item.id,                      <input

            quantity: item.quantity,                        type="email"

            price: item.price                        value={checkoutData.personal.email}

          })),                        onChange={(e) => handlePersonalDataChange('email', e.target.value)}

          shippingCost: selectedShippingOption?.price || 0,                        className="input w-full"

          shippingMethod: selectedShippingOption?.name || 'PAC'                        placeholder="seu@email.com"

        })                        required

      })                      />

                          </div>

      const orderData = await orderResponse.json()                    <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">

      if (!orderResponse.ok) {                        Telefone *

        throw new Error(orderData.message || 'Erro ao criar pedido')                      </label>

      }                      <input

                              type="tel"

      // 3. Criar preferência de pagamento no MercadoPago                        value={checkoutData.personal.phone}

      const paymentResponse = await fetch('http://localhost:5000/api/payment/create-preference', {                        onChange={(e) => handlePersonalDataChange('phone', e.target.value)}

        method: 'POST',                        className="input w-full"

        headers: {                        placeholder="(11) 99999-9999"

          'Content-Type': 'application/json',                        required

          'Authorization': `Bearer ${token}`                      />

        },                    </div>

        body: JSON.stringify({                    <div className="md:col-span-2">

          orderId: orderData.order.id                      <label className="block text-sm font-medium text-gray-700 mb-1">

        })                        CPF/CNPJ *

      })                      </label>

                            <input

      const paymentData = await paymentResponse.json()                        type="text"

                              value={checkoutData.personal.document}

      if (!paymentResponse.ok) {                        onChange={(e) => handlePersonalDataChange('document', e.target.value)}

        throw new Error(paymentData.message || 'Erro ao criar pagamento')                        className="input w-full"

      }                        placeholder="000.000.000-00"

                              required

      // 4. Limpar carrinho                      />

      clearCart()                    </div>

                        </div>

      // 5. Redirecionar para MercadoPago                  <div className="mt-6 flex justify-end">

      if (paymentData.init_point) {                    <button

        window.location.href = paymentData.init_point                      onClick={() => setCurrentStep(2)}

      } else {                      className="btn-primary"

        throw new Error('Link de pagamento não encontrado')                    >

      }                      Continuar

    } catch (err: any) {                    </button>

      console.error('Erro ao finalizar compra:', err)                  </div>

      setError(err.message || 'Erro ao processar pedido. Tente novamente.')                </div>

    } finally {              )}

      setLoading(false)

    }              {/* Step 2: Endereço */}

  }              {currentStep === 2 && (

                  <div>

  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping)                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Endereço de Entrega</h2>

  const shippingCost = selectedShippingOption?.price || 0                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  const totalWithShipping = cartTotal + shippingCost                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

  if (!isAuthenticated || items.length === 0) {                        CEP *

    return null                      </label>

  }                      <input

                          type="text"

  return (                        value={checkoutData.address.zipCode}

    <div className="min-h-screen bg-gray-50 py-8">                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                        className="input w-full"

        <div className="mb-8">                        placeholder="00000-000"

          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>                        required

          <p className="mt-2 text-gray-600">Preencha os dados para concluir seu pedido</p>                      />

        </div>                    </div>

                            <div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">                      <label className="block text-sm font-medium text-gray-700 mb-1">

          {/* Formulário */}                        Estado *

          <div className="lg:col-span-2 space-y-6">                      </label>

            {/* Endereço de Entrega */}                      <select

            <div className="bg-white rounded-lg shadow p-6">                        value={checkoutData.address.state}

              <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>                        onChange={(e) => handleAddressChange('state', e.target.value)}

                                      className="input w-full"

              <div className="space-y-4">                        required

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">                      >

                  <div>                        <option value="">Selecione</option>

                    <label className="block text-sm font-medium text-gray-700 mb-1">                        <option value="SP">São Paulo</option>

                      CEP *                        <option value="RJ">Rio de Janeiro</option>

                    </label>                        <option value="MG">Minas Gerais</option>

                    <input                        {/* Outros estados */}

                      type="text"                      </select>

                      value={address.zipCode}                    </div>

                      onChange={(e) => {                    <div className="md:col-span-2">

                        const value = e.target.value.replace(/\D/g, '').slice(0, 8)                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        setAddress(prev => ({ ...prev, zipCode: value }))                        Rua *

                      }}                      </label>

                      onBlur={handleZipCodeBlur}                      <input

                      placeholder="00000-000"                        type="text"

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                        value={checkoutData.address.street}

                      disabled={loading}                        onChange={(e) => handleAddressChange('street', e.target.value)}

                    />                        className="input w-full"

                  </div>                        placeholder="Nome da rua"

                </div>                        required

                                      />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">                    </div>

                  <div className="sm:col-span-3">                    <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">                      <label className="block text-sm font-medium text-gray-700 mb-1">

                      Rua *                        Número *

                    </label>                      </label>

                    <input                      <input

                      type="text"                        type="text"

                      value={address.street}                        value={checkoutData.address.number}

                      onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}                        onChange={(e) => handleAddressChange('number', e.target.value)}

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                        className="input w-full"

                      disabled={loading}                        placeholder="123"

                    />                        required

                  </div>                      />

                  <div>                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>

                      Número *                      <label className="block text-sm font-medium text-gray-700 mb-1">

                    </label>                        Complemento

                    <input                      </label>

                      type="text"                      <input

                      value={address.number}                        type="text"

                      onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}                        value={checkoutData.address.complement}

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                        onChange={(e) => handleAddressChange('complement', e.target.value)}

                      disabled={loading}                        className="input w-full"

                    />                        placeholder="Apto 45"

                  </div>                      />

                </div>                    </div>

                                    <div>

                <div>                      <label className="block text-sm font-medium text-gray-700 mb-1">

                  <label className="block text-sm font-medium text-gray-700 mb-1">                        Bairro *

                    Complemento                      </label>

                  </label>                      <input

                  <input                        type="text"

                    type="text"                        value={checkoutData.address.neighborhood}

                    value={address.complement}                        onChange={(e) => handleAddressChange('neighborhood', e.target.value)}

                    onChange={(e) => setAddress(prev => ({ ...prev, complement: e.target.value }))}                        className="input w-full"

                    placeholder="Apto, bloco, etc..."                        placeholder="Nome do bairro"

                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                        required

                    disabled={loading}                      />

                  />                    </div>

                </div>                    <div>

                                      <label className="block text-sm font-medium text-gray-700 mb-1">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">                        Cidade *

                  <div>                      </label>

                    <label className="block text-sm font-medium text-gray-700 mb-1">                      <input

                      Bairro *                        type="text"

                    </label>                        value={checkoutData.address.city}

                    <input                        onChange={(e) => handleAddressChange('city', e.target.value)}

                      type="text"                        className="input w-full"

                      value={address.neighborhood}                        placeholder="Nome da cidade"

                      onChange={(e) => setAddress(prev => ({ ...prev, neighborhood: e.target.value }))}                        required

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                      />

                      disabled={loading}                    </div>

                    />                  </div>

                  </div>                  <div className="mt-6 flex justify-between">

                  <div>                    <button

                    <label className="block text-sm font-medium text-gray-700 mb-1">                      onClick={() => setCurrentStep(1)}

                      Cidade *                      className="btn-secondary"

                    </label>                    >

                    <input                      Voltar

                      type="text"                    </button>

                      value={address.city}                    <button

                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}                      onClick={() => setCurrentStep(3)}

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                      className="btn-primary"

                      disabled={loading}                    >

                    />                      Continuar

                  </div>                    </button>

                  <div>                  </div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">                </div>

                      Estado *              )}

                    </label>

                    <input              {/* Step 3: Pagamento */}

                      type="text"              {currentStep === 3 && (

                      value={address.state}                <div>

                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value.toUpperCase().slice(0, 2) }))}                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Forma de Pagamento</h2>

                      placeholder="SP"                  

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                  {/* Métodos de Pagamento */}

                      disabled={loading}                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                    />                    {[

                  </div>                      { id: 'credit', name: 'Cartão de Crédito', icon: '💳' },

                </div>                      { id: 'debit', name: 'Cartão de Débito', icon: '💳' },

              </div>                      { id: 'pix', name: 'PIX', icon: '🔄' },

            </div>                      { id: 'boleto', name: 'Boleto', icon: '📄' }

                                ].map((method) => (

            {/* Opções de Frete */}                      <button

            {shippingOptions.length > 0 && (                        key={method.id}

              <div className="bg-white rounded-lg shadow p-6">                        onClick={() => handlePaymentChange('method', method.id)}

                <h2 className="text-xl font-semibold mb-4">Opções de Frete</h2>                        className={`p-4 border-2 rounded-lg text-center transition-colors ${

                                          checkoutData.payment.method === method.id

                <div className="space-y-3">                            ? 'border-primary bg-primary/5'

                  {shippingOptions.map((option) => (                            : 'border-gray-200 hover:border-gray-300'

                    <label                        }`}

                      key={option.id}                      >

                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${                        <div className="text-2xl mb-1">{method.icon}</div>

                        selectedShipping === option.id                        <div className="text-sm font-medium">{method.name}</div>

                          ? 'border-blue-500 bg-blue-50'                      </button>

                          : 'border-gray-200 hover:border-gray-300'                    ))}

                      }`}                  </div>

                    >

                      <div className="flex items-center">                  {/* Dados do Cartão */}

                        <input                  {(checkoutData.payment.method === 'credit' || checkoutData.payment.method === 'debit') && (

                          type="radio"                    <div className="space-y-4">

                          name="shipping"                      <div>

                          value={option.id}                        <label className="block text-sm font-medium text-gray-700 mb-1">

                          checked={selectedShipping === option.id}                          Número do Cartão *

                          onChange={(e) => setSelectedShipping(e.target.value)}                        </label>

                          className="w-4 h-4 text-blue-600"                        <input

                        />                          type="text"

                        <div className="ml-3">                          value={checkoutData.payment.cardNumber}

                          <p className="font-medium text-gray-900">{option.name}</p>                          onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}

                          <p className="text-sm text-gray-500">{option.company}</p>                          className="input w-full"

                          <p className="text-sm text-gray-500">{option.deliveryTime}</p>                          placeholder="0000 0000 0000 0000"

                        </div>                          required

                      </div>                        />

                      <p className="font-semibold text-gray-900">                      </div>

                        {formatPrice(option.price)}                      <div>

                      </p>                        <label className="block text-sm font-medium text-gray-700 mb-1">

                    </label>                          Nome no Cartão *

                  ))}                        </label>

                </div>                        <input

              </div>                          type="text"

            )}                          value={checkoutData.payment.cardName}

                                      onChange={(e) => handlePaymentChange('cardName', e.target.value)}

            {loadingShipping && (                          className="input w-full"

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">                          placeholder="Nome conforme impresso no cartão"

                <p className="text-blue-700">Calculando frete...</p>                          required

              </div>                        />

            )}                      </div>

          </div>                      <div className="grid grid-cols-2 gap-4">

                                  <div>

          {/* Resumo do Pedido */}                          <label className="block text-sm font-medium text-gray-700 mb-1">

          <div className="lg:col-span-1">                            Validade *

            <div className="bg-white rounded-lg shadow p-6 sticky top-4">                          </label>

              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>                          <input

                                          type="text"

              <div className="space-y-3 mb-4">                            value={checkoutData.payment.cardExpiry}

                {items.map((item) => (                            onChange={(e) => handlePaymentChange('cardExpiry', e.target.value)}

                  <div key={item.id} className="flex justify-between text-sm">                            className="input w-full"

                    <span className="text-gray-600">                            placeholder="MM/AA"

                      {item.name} x{item.quantity}                            required

                    </span>                          />

                    <span className="font-medium">                        </div>

                      {formatPrice(item.price * item.quantity)}                        <div>

                    </span>                          <label className="block text-sm font-medium text-gray-700 mb-1">

                  </div>                            CVV *

                ))}                          </label>

              </div>                          <input

                                          type="text"

              <div className="border-t pt-4 space-y-2">                            value={checkoutData.payment.cardCvv}

                <div className="flex justify-between text-sm">                            onChange={(e) => handlePaymentChange('cardCvv', e.target.value)}

                  <span className="text-gray-600">Subtotal</span>                            className="input w-full"

                  <span className="font-medium">{formatPrice(cartTotal)}</span>                            placeholder="123"

                </div>                            required

                                          />

                {selectedShippingOption && (                        </div>

                  <div className="flex justify-between text-sm">                      </div>

                    <span className="text-gray-600">Frete ({selectedShippingOption.name})</span>                    </div>

                    <span className="font-medium">{formatPrice(shippingCost)}</span>                  )}

                  </div>

                )}                  {checkoutData.payment.method === 'pix' && (

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

                <div className="border-t pt-2 flex justify-between">                      <div className="flex items-center">

                  <span className="text-lg font-bold">Total</span>                        <div className="text-blue-600 mr-3">🔄</div>

                  <span className="text-lg font-bold text-blue-600">                        <div>

                    {formatPrice(totalWithShipping)}                          <h3 className="font-medium text-blue-900">PIX</h3>

                  </span>                          <p className="text-sm text-blue-700">

                </div>                            Após a confirmação, você receberá o código PIX para pagamento.

              </div>                          </p>

                                      </div>

              {error && (                      </div>

                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">                    </div>

                  {error}                  )}

                </div>

              )}                  {checkoutData.payment.method === 'boleto' && (

                                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">

              <button                      <div className="flex items-center">

                onClick={handleFinishOrder}                        <div className="text-yellow-600 mr-3">📄</div>

                disabled={loading || !selectedShipping || loadingShipping}                        <div>

                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"                          <h3 className="font-medium text-yellow-900">Boleto Bancário</h3>

              >                          <p className="text-sm text-yellow-700">

                {loading ? 'Processando...' : 'Finalizar Compra'}                            O boleto será gerado após a confirmação do pedido. Prazo de vencimento: 3 dias.

              </button>                          </p>

                                      </div>

              <p className="mt-4 text-xs text-gray-500 text-center">                      </div>

                Você será redirecionado para o MercadoPago para efetuar o pagamento                    </div>

              </p>                  )}

            </div>

          </div>                  <div className="mt-6 flex justify-between">

        </div>                    <button

      </div>                      onClick={() => setCurrentStep(2)}

    </div>                      className="btn-secondary"

  )                    >

}                      Voltar

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
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p><strong>Nome:</strong> {checkoutData.personal.fullName}</p>
                      <p><strong>Email:</strong> {checkoutData.personal.email}</p>
                      <p><strong>Telefone:</strong> {checkoutData.personal.phone}</p>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Endereço de Entrega</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>{checkoutData.address.street}, {checkoutData.address.number}</p>
                      {checkoutData.address.complement && <p>{checkoutData.address.complement}</p>}
                      <p>{checkoutData.address.neighborhood} - {checkoutData.address.city}/{checkoutData.address.state}</p>
                      <p>CEP: {checkoutData.address.zipCode}</p>
                    </div>
                  </div>

                  {/* Pagamento */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Forma de Pagamento</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>
                        {checkoutData.payment.method === 'credit' && '💳 Cartão de Crédito'}
                        {checkoutData.payment.method === 'debit' && '💳 Cartão de Débito'}
                        {checkoutData.payment.method === 'pix' && '🔄 PIX'}
                        {checkoutData.payment.method === 'boleto' && '📄 Boleto Bancário'}
                      </p>
                      {(checkoutData.payment.method === 'credit' || checkoutData.payment.method === 'debit') && (
                        <p>Cartão terminado em {checkoutData.payment.cardNumber.slice(-4)}</p>
                      )}
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
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <hr className="mb-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md">GRÁTIS</span>
                    ) : (
                      `R$ ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Seus dados estão protegidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}