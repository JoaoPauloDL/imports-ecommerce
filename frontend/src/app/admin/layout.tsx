'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Produtos', href: '/admin/products', icon: '📦' },
    { name: 'Pedidos', href: '/admin/orders', icon: '🛒' },
    { name: 'Usuários', href: '/admin/users', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Admin Panel
          </Link>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Link 
            href="/" 
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar à Loja
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h0z" />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <img className="w-8 h-8 rounded-full bg-gray-200" src="/api/placeholder/32/32" alt="Admin" />
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}