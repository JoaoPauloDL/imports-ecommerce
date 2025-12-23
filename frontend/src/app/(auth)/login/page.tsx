'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { fetchCart } = useCartStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('🔐 Tentando fazer login:', formData)
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      console.log('📡 Resposta do servidor:', response.status, data)
      
      if (response.ok && data.token && data.user) {
        console.log('✅ Login bem-sucedido!')
        
        // Mostrar sucesso
        setSuccess('Login realizado com sucesso! Redirecionando...')
        
        // Adaptar dados do backend para o formato do store
        const user = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName || data.user.email,
          role: data.user.role === 'admin' ? 'ADMIN' as const : 'CLIENT' as const,
          emailVerified: true
        }
        
        const tokens = {
          accessToken: data.token,
          refreshToken: data.token // Usando o mesmo token por simplicidade
        }
        
        console.log('💾 Salvando no store:', { user, tokens })
        
        // Salvar no store
        login(user, tokens)
        
        // Também salvar no localStorage para compatibilidade  
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('userId', data.user.id) // Importante para o carrinho
        
        // IMPORTANTE: Salvar também em cookies para o middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400`
        document.cookie = `user-role=${data.user.role}; path=/; max-age=86400`
        
        console.log('💾 Dados salvos no localStorage e store')
        
        // Limpar e recarregar o carrinho do usuário específico
        console.log('🛒 Carregando carrinho do usuário...')
        await fetchCart()
        console.log('🔍 Verificação final dos dados salvos:')
        console.log('- Token:', localStorage.getItem('token')?.substring(0, 20) + '...')
        console.log('- User:', localStorage.getItem('user'))
        
        // Pequeno delay para garantir que tudo foi salvo
        setTimeout(() => {
          console.log('🎯 Executando redirecionamento...')
          
          if (user.role === 'ADMIN') {
            console.log('🔧 Redirecionando ADMIN para /admin')
            window.location.href = '/admin'
          } else {
            console.log('🏠 Redirecionando CLIENT para /')
            window.location.href = '/'
          }
        }, 200)
      } else {
        console.error('❌ Erro na resposta:', data)
        setError(data.message || 'Erro ao fazer login')
      }
    } catch (err) {
      console.error('💥 Erro no login:', err)
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Faça login em sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              crie uma nova conta
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Lembrar de mim
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}



          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                Cadastre-se
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}