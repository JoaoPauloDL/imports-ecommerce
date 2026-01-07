'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import Input from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '../../../lib/utils';

export default function CheckoutForm() {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const items = cart?.items || [];
  const total = cart?.total || 0;
  
  const [billingData, setBillingData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    cpf: '',
    phone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [shippingData, setShippingData] = useState({ ...billingData });
  const [sameAddress, setSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    installments: 1
  });

  const handleBillingChange = (field: string, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }));
    if (sameAddress) {
      setShippingData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 16);
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCardExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 4);
    return numbers.replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    try {
      // Simular criação do pedido
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpar carrinho
      clearCart();
      
      // Redirecionar para página de sucesso
      router.push('/checkout/success');
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form Steps */}
      <div className="space-y-8">
        {/* Step 1: Billing Address */}
        <div className={`space-y-6 ${step !== 1 && 'hidden'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              1. Dados de Cobrança
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              value={billingData.fullName}
              onChange={(value) => handleBillingChange('fullName', value)}
              required
              fullWidth
            />
            <Input
              label="E-mail"
              type="email"
              value={billingData.email}
              onChange={(value) => handleBillingChange('email', value)}
              required
              fullWidth
            />
            <Input
              label="CPF"
              value={billingData.cpf}
              onChange={(value) => {
                const cpf = value.replace(/\D/g, '').slice(0, 11);
                const formatted = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                handleBillingChange('cpf', formatted);
              }}
              placeholder="000.000.000-00"
              required
              fullWidth
            />
            <Input
              label="Telefone"
              value={billingData.phone}
              onChange={(value) => {
                const phone = value.replace(/\D/g, '').slice(0, 11);
                const formatted = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                handleBillingChange('phone', formatted);
              }}
              placeholder="(11) 99999-9999"
              required
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="CEP"
              value={billingData.zipCode}
              onChange={(value) => {
                const zip = value.replace(/\D/g, '').slice(0, 8);
                const formatted = zip.replace(/(\d{5})(\d{3})/, '$1-$2');
                handleBillingChange('zipCode', formatted);
              }}
              placeholder="00000-000"
              required
              fullWidth
            />
            <Input
              label="Rua"
              value={billingData.street}
              onChange={(value) => handleBillingChange('street', value)}
              required
              fullWidth
              className="sm:col-span-2"
            />
            <Input
              label="Número"
              value={billingData.number}
              onChange={(value) => handleBillingChange('number', value)}
              required
              fullWidth
            />
            <Input
              label="Complemento"
              value={billingData.complement}
              onChange={(value) => handleBillingChange('complement', value)}
              fullWidth
            />
            <Input
              label="Bairro"
              value={billingData.neighborhood}
              onChange={(value) => handleBillingChange('neighborhood', value)}
              required
              fullWidth
            />
            <Input
              label="Cidade"
              value={billingData.city}
              onChange={(value) => handleBillingChange('city', value)}
              required
              fullWidth
            />
            <Input
              label="Estado"
              value={billingData.state}
              onChange={(value) => handleBillingChange('state', value)}
              required
              fullWidth
            />
          </div>

          <div className="flex items-center">
            <input
              id="same-address"
              type="checkbox"
              checked={sameAddress}
              onChange={(e) => {
                setSameAddress(e.target.checked);
                if (e.target.checked) {
                  setShippingData({ ...billingData });
                }
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="same-address" className="ml-2 text-sm text-gray-700">
              Endereço de entrega é o mesmo da cobrança
            </label>
          </div>

          <Button onClick={() => setStep(2)} variant="default" size="lg" className="w-full">
            Continuar para Entrega
          </Button>
        </div>

        {/* Step 2: Shipping Address */}
        <div className={`space-y-6 ${step !== 2 && 'hidden'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              2. Endereço de Entrega
            </h2>
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Voltar
            </button>
          </div>

          {!sameAddress && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="CEP"
                  value={shippingData.zipCode}
                  onChange={(value) => {
                    const zip = value.replace(/\D/g, '').slice(0, 8);
                    const formatted = zip.replace(/(\d{5})(\d{3})/, '$1-$2');
                    handleShippingChange('zipCode', formatted);
                  }}
                  placeholder="00000-000"
                  required
                  fullWidth
                />
                <Input
                  label="Rua"
                  value={shippingData.street}
                  onChange={(value) => handleShippingChange('street', value)}
                  required
                  fullWidth
                  className="sm:col-span-2"
                />
              </div>
              {/* Outros campos similares */}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Opções de Entrega</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="radio" name="shipping" defaultChecked className="h-4 w-4 text-blue-600" />
                <div className="flex-1 flex justify-between">
                  <span className="text-sm font-medium">PAC - Correios</span>
                  <span className="text-sm font-bold">R$ 15,00</span>
                </div>
              </label>
              <p className="text-xs text-gray-600 ml-7">Entrega em 8-12 dias úteis</p>
            </div>
          </div>

          <Button onClick={() => setStep(3)} variant="default" size="lg" className="w-full">
            Continuar para Pagamento
          </Button>
        </div>

        {/* Step 3: Payment */}
        <div className={`space-y-6 ${step !== 3 && 'hidden'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              3. Pagamento
            </h2>
            <button
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Voltar
            </button>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Método de Pagamento</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium">Cartão de Crédito</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PIX</span>
                  </div>
                  <span className="font-medium">PIX - 5% de desconto</span>
                </div>
              </label>
            </div>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === 'credit_card' && (
            <div className="space-y-4">
              <Input
                label="Número do Cartão"
                value={paymentData.cardNumber}
                onChange={(value) => setPaymentData(prev => ({ 
                  ...prev, 
                  cardNumber: formatCardNumber(value) 
                }))}
                placeholder="0000 0000 0000 0000"
                required
                fullWidth
              />
              
              <Input
                label="Nome no Cartão"
                value={paymentData.cardName}
                onChange={(value) => setPaymentData(prev => ({ 
                  ...prev, 
                  cardName: value.toUpperCase() 
                }))}
                placeholder="NOME COMO NO CARTÃO"
                required
                fullWidth
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Validade"
                  value={paymentData.cardExpiry}
                  onChange={(value) => setPaymentData(prev => ({ 
                    ...prev, 
                    cardExpiry: formatCardExpiry(value) 
                  }))}
                  placeholder="MM/AA"
                  required
                  fullWidth
                />
                
                <Input
                  label="CVV"
                  value={paymentData.cardCvv}
                  onChange={(value) => setPaymentData(prev => ({ 
                    ...prev, 
                    cardCvv: value.replace(/\D/g, '').slice(0, 4) 
                  }))}
                  placeholder="000"
                  required
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parcelamento
                </label>
                <select
                  value={paymentData.installments}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    installments: parseInt(e.target.value) 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1x de {formatPrice(total)} sem juros</option>
                  <option value={2}>2x de {formatPrice(total / 2)} sem juros</option>
                  <option value={3}>3x de {formatPrice(total / 3)} sem juros</option>
                  <option value={6}>6x de {formatPrice(total / 6)} sem juros</option>
                  <option value={12}>12x de {formatPrice(total / 12)} sem juros</option>
                </select>
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmitOrder}
            loading={loading}
            variant="default"
            size="lg"
            className="w-full"
          >
            {loading ? 'Processando...' : 'Finalizar Pedido'}
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo do Pedido
        </h3>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.product?.name}
                </p>
                <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatPrice((item.product?.price || 0) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frete</span>
            <span className="font-medium">R$ 15,00</span>
          </div>
          {paymentMethod === 'pix' && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto PIX (5%)</span>
              <span>-{formatPrice(total * 0.05)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                {formatPrice(
                  paymentMethod === 'pix' 
                    ? total * 0.95 + 1500 
                    : total + 1500
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
