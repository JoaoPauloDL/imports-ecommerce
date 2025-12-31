'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { toast } from '@/lib/toast'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setIsSubmitted(true)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao enviar email. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email Enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Se o email <strong>{email}</strong> existir em nossa base, você receberá instruções para redefinir sua senha.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Não se esqueça de verificar sua caixa de spam.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Login
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="bg-amber-100 p-4 rounded-full">
              <Mail className="w-10 h-10 text-amber-600" />
            </div>
          </div>
          
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Esqueceu sua senha?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu email e enviaremos um link para você redefinir sua senha.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="seu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Lembrou sua senha?{' '}
          <Link href="/login" className="font-medium text-amber-600 hover:text-amber-500">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
