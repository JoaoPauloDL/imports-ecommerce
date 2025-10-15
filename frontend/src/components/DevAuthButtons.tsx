'use client'

import { useDevAuth } from '@/hooks/useDevAuth'
import { useAuthStore } from '@/store/authStore'

export default function DevAuthButtons() {
  const { loginAsClient, loginAsAdmin, loginAsSuperAdmin, logout } = useDevAuth()
  const { user, isAuthenticated } = useAuthStore()

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-sm font-bold text-gray-800 mb-3">🔧 Dev Tools</h3>
      
      {isAuthenticated ? (
        <div className="space-y-2">
          <div className="text-xs text-gray-600 mb-2">
            Logado como: <span className="font-medium">{user?.fullName}</span>
            <br />
            Role: <span className="font-medium text-blue-600">{user?.role}</span>
          </div>
          <button
            onClick={logout}
            className="w-full text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={loginAsClient}
            className="w-full text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Login Cliente
          </button>
          <button
            onClick={loginAsAdmin}
            className="w-full text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors"
          >
            Login Admin
          </button>
          <button
            onClick={loginAsSuperAdmin}
            className="w-full text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors"
          >
            Login Super Admin
          </button>
        </div>
      )}
    </div>
  )
}