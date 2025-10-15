'use client'

import { useAuthStore } from '@/store/authStore'

// Utilitário para simular diferentes tipos de usuário durante desenvolvimento
export function useDevAuth() {
  const { login, logout } = useAuthStore()

  const loginAsClient = () => {
    const clientUser = {
      id: 'client-001',
      email: 'cliente@exemplo.com',
      fullName: 'João Cliente',
      role: 'CLIENT' as const,
      emailVerified: true
    }
    
    const tokens = {
      accessToken: 'fake-access-token-client',
      refreshToken: 'fake-refresh-token-client'
    }
    
    login(clientUser, tokens)
  }

  const loginAsAdmin = () => {
    const adminUser = {
      id: 'admin-001',
      email: 'admin@exemplo.com',
      fullName: 'Maria Admin',
      role: 'ADMIN' as const,
      emailVerified: true
    }
    
    const tokens = {
      accessToken: 'fake-access-token-admin',
      refreshToken: 'fake-refresh-token-admin'
    }
    
    login(adminUser, tokens)
  }

  const loginAsSuperAdmin = () => {
    const superAdminUser = {
      id: 'superadmin-001',
      email: 'superadmin@exemplo.com',
      fullName: 'Carlos Super Admin',
      role: 'SUPER_ADMIN' as const,
      emailVerified: true
    }
    
    const tokens = {
      accessToken: 'fake-access-token-superadmin',
      refreshToken: 'fake-refresh-token-superadmin'
    }
    
    login(superAdminUser, tokens)
  }

  return {
    loginAsClient,
    loginAsAdmin,
    loginAsSuperAdmin,
    logout
  }
}