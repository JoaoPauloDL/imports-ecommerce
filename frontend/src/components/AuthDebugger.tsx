'use client'

import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'

export default function AuthDebugger() {
  const authState = useAuthStore()
  const [localStorageState, setLocalStorageState] = useState<{token: string | null, user: string | null}>({
    token: null,
    user: null
  })

  useEffect(() => {
    // Verificar localStorage
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    setLocalStorageState({ token, user })
  }, [])

  // Não mostrar em produção
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50 opacity-90">
      <h3 className="font-bold mb-2 text-yellow-300">🐛 Auth Debug</h3>
      
      <div className="mb-2">
        <strong className="text-green-300">Store State:</strong>
        <pre className="text-xs mt-1 text-gray-300">
          {JSON.stringify({
            isAuthenticated: authState.isAuthenticated,
            user: authState.user ? {
              id: authState.user.id,
              email: authState.user.email,
              role: authState.user.role
            } : null,
            hasTokens: !!authState.tokens
          }, null, 2)}
        </pre>
      </div>

      <div className="mb-2">
        <strong className="text-blue-300">localStorage:</strong>
        <pre className="text-xs mt-1 text-gray-300">
          {JSON.stringify({
            hasToken: !!localStorageState.token,
            tokenLength: localStorageState.token?.length || 0,
            hasUser: !!localStorageState.user,
            userJson: localStorageState.user
          }, null, 2)}
        </pre>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => {
            localStorage.clear()
            authState.logout()
            window.location.reload()
          }}
          className="bg-red-600 px-2 py-1 text-xs rounded hover:bg-red-700"
        >
          Clear & Reload
        </button>
        <button 
          onClick={() => {
            // Teste de login manual
            const testUser = {
              id: 'admin-hardcoded',
              email: 'admin@davidimportados.com',
              fullName: 'Administrador',
              role: 'ADMIN' as const,
              emailVerified: true
            }
            const testTokens = {
              accessToken: 'test-token',
              refreshToken: 'test-token'
            }
            authState.login(testUser, testTokens)
          }}
          className="bg-green-600 px-2 py-1 text-xs rounded hover:bg-green-700"
        >
          Test Login
        </button>
      </div>
    </div>
  )
}