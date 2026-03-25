'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PixPaymentPage() {
  const router = useRouter()
  const [pixData, setPixData] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const data = sessionStorage.getItem('pixData')
    if (!data) {
      router.push('/checkout')
      return
    }
    setPixData(JSON.parse(data))
  }, [router])

  useEffect(() => {
    if (!pixData?.expirationDate) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiration = new Date(pixData.expirationDate).getTime()
      const diff = expiration - now

      if (diff <= 0) {
        setTimeLeft('Expirado')
        clearInterval(timer)
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [pixData])

  const handleCopyCode = async () => {
    if (!pixData?.qrCode) return
    try {
      await navigator.clipboard.writeText(pixData.qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback para navegadores sem clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = pixData.qrCode
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (!pixData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-3xl">🔄</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pagamento via PIX</h1>
            <p className="text-gray-600 mt-1">
              Escaneie o QR Code ou copie o código para pagar
            </p>
          </div>

          {/* Valor */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Valor a pagar</p>
            <p className="text-3xl font-bold text-gray-900">
              R$ {pixData.totalAmount?.toFixed(2)}
            </p>
          </div>

          {/* QR Code */}
          {pixData.qrCodeBase64 && (
            <div className="mb-6">
              <div className="inline-block bg-white p-4 rounded-xl border-2 border-gray-200">
                <img
                  src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                  alt="QR Code PIX"
                  width={250}
                  height={250}
                  className="mx-auto"
                />
              </div>
            </div>
          )}

          {/* Timer */}
          {timeLeft && (
            <div className={`mb-4 text-sm font-medium ${timeLeft === 'Expirado' ? 'text-red-600' : 'text-orange-600'}`}>
              ⏱️ {timeLeft === 'Expirado' ? 'Código expirado' : `Expira em ${timeLeft}`}
            </div>
          )}

          {/* Código PIX Copia e Cola */}
          {pixData.qrCode && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">PIX Copia e Cola</p>
              <div className="bg-gray-50 rounded-lg p-3 break-all text-xs text-gray-600 font-mono max-h-20 overflow-y-auto mb-3">
                {pixData.qrCode}
              </div>
              <button
                onClick={handleCopyCode}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {copied ? '✅ Código copiado!' : '📋 Copiar código PIX'}
              </button>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-blue-50 rounded-lg p-4 text-left mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Como pagar:</h3>
            <ol className="text-sm text-blue-800 space-y-1.5">
              <li>1. Abra o app do seu banco</li>
              <li>2. Escolha pagar via PIX</li>
              <li>3. Escaneie o QR Code ou cole o código</li>
              <li>4. Confirme o pagamento</li>
            </ol>
            <p className="text-xs text-blue-600 mt-3">
              O pagamento é processado instantaneamente. Após a confirmação, seu pedido será preparado para envio.
            </p>
          </div>

          {/* Botão voltar */}
          <button
            onClick={() => router.push('/orders')}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Ver meus pedidos
          </button>
        </div>
      </div>
    </div>
  )
}
