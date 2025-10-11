'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function CheckoutSuccessPage() {
  const [orderNumber] = useState(() => 
    Math.floor(Math.random() * 900000) + 100000
  )

  useEffect(() => {
    // Animação de confetti ao carregar a página
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }))
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }))
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Ícone de Sucesso */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Mensagem Principal */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Pedido Realizado com Sucesso!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Obrigado por sua compra! Seu pedido foi confirmado e está sendo processado.
          </p>

          {/* Informações do Pedido */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Número do Pedido</h3>
                <p className="text-2xl font-bold text-primary">#{orderNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  ⏳ Processando
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Previsão de Entrega</h3>
                <p className="text-gray-700">2-5 dias úteis</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Forma de Pagamento</h3>
                <p className="text-gray-700">Cartão de Crédito ****1234</p>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Próximos Passos
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                Enviaremos um email de confirmação com os detalhes do pedido
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                Você receberá atualizações sobre o status da entrega
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                Acompanhe seu pedido na seção "Meus Pedidos"
              </li>
            </ul>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/orders/${orderNumber}`} className="btn-primary">
              Acompanhar Pedido
            </Link>
            <Link href="/products" className="btn-secondary">
              Continuar Comprando
            </Link>
          </div>

          {/* Suporte */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Precisa de Ajuda?</h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="mailto:suporte@importsstore.com" className="text-primary hover:text-primary/80 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email: suporte@importsstore.com
              </a>
              <a href="tel:+5511999999999" className="text-primary hover:text-primary/80 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                WhatsApp: (11) 99999-9999
              </a>
              <Link href="/help" className="text-primary hover:text-primary/80 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Central de Ajuda
              </Link>
            </div>
          </div>

          {/* Avaliação */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Gostou da sua experiência?</h3>
            <p className="text-gray-600 mb-4">Sua opinião é muito importante para nós!</p>
            <button className="btn-secondary">
              ⭐ Avaliar Experiência de Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}