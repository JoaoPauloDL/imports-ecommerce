'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = () => {
    try {
      console.log('🛡️ AdminRouteGuard: Verificando autenticação SIMPLIFICADA...')
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      console.log('🔑 Token presente:', !!token)
      console.log('👤 Dados do usuário:', userData)
      
      if (!token || !userData) {
        console.log('❌ Token ou dados não encontrados, redirecionando para login')
        router.push('/login?redirect=/admin')
        setIsLoading(false)
        return
      }

      // Verificar se é admin localmente
      const parsedUser = JSON.parse(userData)
      console.log('👤 Usuário parseado:', parsedUser)
      
      if (parsedUser.role !== 'admin') {
        console.log('❌ Usuário NÃO é admin, redirecionando para home')
        router.push('/')
        setIsLoading(false)
        return
      }

      console.log('✅ Usuário é ADMIN, liberando acesso')
      setUser(parsedUser)
      setIsAuthenticated(true)
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      router.push('/login?redirect=/admin')
    } finally {
      setIsLoading(false)
    }
  }

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">🔍 Verificando permissões...</p>
          <p className="text-xs text-gray-500 mt-2">Conectando com o servidor...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, não renderiza nada (será redirecionado)
  if (!isAuthenticated) {
    return null
  }

  // Se está autenticado como admin, renderiza o conteúdo
  return (
    <>
      {/* Header com info do usuário logado */}
      <div className="bg-blue-600 text-white px-4 py-2 text-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <span>👋 Olá, <strong>{user?.name}</strong>! Você está no painel administrativo.</span>
          <div className="flex items-center gap-4">
            <span className="text-blue-200 text-xs">Backend: ✅ Conectado</span>
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/login')
              }}
              className="text-blue-200 hover:text-white text-xs underline"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      {children}
    </>
  )
}