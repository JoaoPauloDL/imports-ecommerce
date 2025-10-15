'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Se não está carregando e não está autenticado, redireciona para login
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin')
      return
    }

    // Se está autenticado mas não tem privilégios de admin, redireciona para home
    if (!isLoading && isAuthenticated && user) {
      const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
      if (!isAdmin) {
        router.push('/')
        return
      }
    }
  }, [user, isAuthenticated, isLoading, router])

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, não renderiza nada (será redirecionado)
  if (!isAuthenticated) {
    return null
  }

  // Se está autenticado mas não é admin, não renderiza nada (será redirecionado)
  if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar o painel administrativo. 
            Esta área é restrita apenas para administradores.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Voltar à Loja
          </button>
        </div>
      </div>
    )
  }

  // Se chegou até aqui, o usuário é admin - renderiza o conteúdo
  return <>{children}</>
}