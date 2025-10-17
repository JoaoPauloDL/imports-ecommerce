'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { usePageTheme } from '@/utils/themes'
import { buildNavigationItems, useCategories } from '@/services/categoryService'
import DavidImportadosLogo from '@/components/DavidImportadosLogo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [navigation, setNavigation] = useState<Array<{name: string, href: string, icon?: string}>>([])
  const router = useRouter()

  // Estado real do usuário
  const { user, isAuthenticated } = useAuthStore()
  const [cartItemCount] = useState(3)
  
  // Verificar se é admin
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
  
  // Tema atual baseado na página
  const currentTheme = usePageTheme()
  
  // Carregar categorias dinâmicas
  const { categories, loading } = useCategories()
  
  // Atualizar path atual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname + window.location.search)
    }
  }, [])

  // Construir navegação quando categorias carregarem
  useEffect(() => {
    if (!loading && categories.length > 0) {
      const navItems = buildNavigationItems(categories)
      setNavigation(navItems)
    }
  }, [categories, loading])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
      setSearchTerm('')
    }
  }

  // Navegação estática removida - agora usa categorias dinâmicas

  // Verificar se está em uma categoria específica
  const isInCategory = currentPath.includes('category=') || 
                      currentPath.includes('/offers') || 
                      currentPath.includes('/new-arrivals')

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-white text-center py-2 text-sm font-medium">
        <p>
          FRETE GRÁTIS para todo Brasil acima de R$ 300 | Perfumes 100% Originais
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <DavidImportadosLogo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-10">
            {navigation.map((item) => {
              const isActive = currentPath.includes(item.href.split('?')[1]) // Verificar se a categoria está ativa
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-black font-medium text-sm tracking-wide hover:text-amber-600 transition-all duration-200 uppercase ${
                    isActive ? 'text-amber-600' : ''
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Buscar perfumes"
            >
              <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Favorites */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 hidden md:block">
              <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Meu Perfil
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Meus Pedidos
                    </Link>
                    <Link href="/profile/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Endereços
                    </Link>
                    {isAdmin && (
                      <>
                        <hr className="my-2 border-gray-200" />
                        <Link href="/admin" className="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors font-medium">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Painel Admin
                          </span>
                        </Link>
                      </>
                    )}
                    <hr className="my-2 border-gray-200" />
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/login" className="text-black font-medium hover:text-gray-600 transition-colors duration-200 uppercase text-sm tracking-wide">
                  Entrar
                </Link>
                <Link href="/register" className="text-black font-medium hover:text-gray-600 transition-colors duration-200 uppercase text-sm tracking-wide">
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="pb-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mt-4 relative">
              <input
                type="text"
                placeholder="Buscar perfumes, marcas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-4 pr-12 text-lg border-b-2 border-gray-300 bg-transparent focus:border-black focus:outline-none placeholder:text-gray-500 transition-colors duration-200"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center"
              >
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-4 text-black font-medium text-lg tracking-wide hover:text-gray-600 transition-colors duration-200 uppercase border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-6 space-y-4">
                  <Link 
                    href="/login" 
                    className="block w-full py-3 text-center bg-black text-white font-medium tracking-wide uppercase transition-colors duration-200 hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/register" 
                    className="block w-full py-3 text-center border-2 border-black text-black font-medium tracking-wide uppercase transition-colors duration-200 hover:bg-black hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}