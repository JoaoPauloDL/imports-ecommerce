'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Só executar se ainda não estiver autenticado
    if (!isAuthenticated) {
      // Verificar se há dados de autenticação no localStorage ao carregar
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      console.log('🔧 AuthProvider - Verificando localStorage:', { 
        hasToken: !!token, 
        hasUser: !!userStr,
        isAuthenticated,
        token: token?.substring(0, 20) + '...',
        userStr 
      })
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr)
          console.log('📋 Dados do usuário no localStorage:', userData)
          
          // Adaptar dados para o formato do store
          const user = {
            id: userData.id,
            email: userData.email,
            fullName: userData.name || userData.fullName || userData.email,
            role: userData.role === 'admin' ? 'ADMIN' as const : 'CLIENT' as const,
            emailVerified: true
          }
          
          const tokens = {
            accessToken: token,
            refreshToken: token
          }
          
          console.log('🔄 Restaurando estado no store:', { user, hasTokens: !!tokens })
          
          // Restaurar estado no store
          login(user, tokens)
          
          console.log('✅ Estado de autenticação restaurado com sucesso!')
        } catch (error) {
          console.error('❌ Erro ao restaurar autenticação:', error)
          // Limpar dados corrompidos
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          logout()
        }
      } else {
        console.log('ℹ️ Nenhum dado de autenticação encontrado no localStorage')
      }
    } else {
      console.log('ℹ️ Usuário já está autenticado, pulando verificação do localStorage')
    }
  }, [login, logout, isAuthenticated])

  return <>{children}</>
}