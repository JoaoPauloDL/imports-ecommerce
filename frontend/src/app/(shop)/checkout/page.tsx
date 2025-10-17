'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
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
    cardNumber: string
    cardName: string
    cardExpiry: string
    cardCvv: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Dados simulados do carrinho
  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      price: 8999.99,
      image: '/api/placeholder/80/80',
      quantity: 1
    },
    {
      id: '3',
      name: 'AirPods Pro 2ª Geração',
      price: 1899.99,
      image: '/api/placeholder/80/80',
      quantity: 2
    }
  ])

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
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
      method: 'credit',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: ''
    }
  })

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 500 ? 0 : 49.90
  const total = subtotal + shipping

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

  const handlePaymentChange = (field: keyof CheckoutData['payment'], value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      payment: { ...prev.payment, [field]: value }
    }))
  }

  const handleSubmitOrder = async () => {
    setLoading(true)
    try {
      // Simular processamento do pedido
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/checkout/success')
    } catch (error) {
      console.error('Erro ao processar pedido:', error)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, name: 'Dados Pessoais', completed: currentStep > 1 },
    { id: 2, name: 'Endereço', completed: currentStep > 2 },
    { id: 3, name: 'Pagamento', completed: currentStep > 3 },
    { id: 4, name: 'Revisão', completed: false }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.completed || currentStep >= step.id
                    ? 'bg-primary text-white'
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
                <span className={`ml-2 text-sm font-medium ${
                  step.completed || currentStep >= step.id ? 'text-primary' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {stepIdx < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    step.completed ? 'bg-primary' : 'bg-gray-200'
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
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        className="input w-full"
                        placeholder="00000-000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <select
                        value={checkoutData.address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="input w-full"
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        {/* Outros estados */}
                      </select>
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
                      { id: 'credit', name: 'Cartão de Crédito', icon: '💳' },
                      { id: 'debit', name: 'Cartão de Débito', icon: '💳' },
                      { id: 'pix', name: 'PIX', icon: '🔄' },
                      { id: 'boleto', name: 'Boleto', icon: '📄' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentChange('method', method.id)}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          checkoutData.payment.method === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="text-sm font-medium">{method.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Dados do Cartão */}
                  {(checkoutData.payment.method === 'credit' || checkoutData.payment.method === 'debit') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número do Cartão *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.payment.cardNumber}
                          onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                          className="input w-full"
                          placeholder="0000 0000 0000 0000"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome no Cartão *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.payment.cardName}
                          onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                          className="input w-full"
                          placeholder="Nome conforme impresso no cartão"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Validade *
                          </label>
                          <input
                            type="text"
                            value={checkoutData.payment.cardExpiry}
                            onChange={(e) => handlePaymentChange('cardExpiry', e.target.value)}
                            className="input w-full"
                            placeholder="MM/AA"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={checkoutData.payment.cardCvv}
                            onChange={(e) => handlePaymentChange('cardCvv', e.target.value)}
                            className="input w-full"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutData.payment.method === 'pix' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-blue-600 mr-3">🔄</div>
                        <div>
                          <h3 className="font-medium text-blue-900">PIX</h3>
                          <p className="text-sm text-blue-700">
                            Após a confirmação, você receberá o código PIX para pagamento.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutData.payment.method === 'boleto' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-yellow-600 mr-3">📄</div>
                        <div>
                          <h3 className="font-medium text-yellow-900">Boleto Bancário</h3>
                          <p className="text-sm text-yellow-700">
                            O boleto será gerado após a confirmação do pedido. Prazo de vencimento: 3 dias.
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