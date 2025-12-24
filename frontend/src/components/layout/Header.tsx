'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { usePageTheme } from '@/utils/themes'
import { buildNavigationItems, useCategories } from '@/services/categoryService'
import DavidImportadosLogo from '@/components/DavidImportadosLogo'

interface SearchSuggestion {
  id: string
  name: string
  slug: string
  price: number
  imageUrl: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const [navigation, setNavigation] = useState<Array<{name: string, href: string, icon?: string}>>([])
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Estado real do usuário e carrinho
  const authState = useAuthStore()
  const { user, isAuthenticated, logout } = authState
  const { cart, fetchCart } = useCartStore()
  const cartItemCount = cart?.itemCount || 0

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Carregar carrinho quando montar o componente
  useEffect(() => {
    if (mounted) {
      fetchCart()
    }
  }, [mounted, fetchCart])
  
  // Verificar se é admin
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
  
  console.log('🧭 Header - Estado COMPLETO de autenticação:', { 
    user: user ? { id: user.id, email: user.email, role: user.role } : null, 
    isAuthenticated, 
    isAdmin,
    rawAuthState: authState
  })
  
  // Função de logout
  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Limpar cookies também
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    router.push('/')
  }
  
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

  // Buscar sugestões quando digitar
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setSearchSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(searchTerm)}&limit=5`)
        const data = await response.json()
        setSearchSuggestions(data.products || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
      setSearchTerm('')
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (slug: string) => {
    router.push(`/products/${slug}`)
    setSearchTerm('')
    setShowSuggestions(false)
    setIsSearchOpen(false)
  }

  // Navegação estática removida - agora usa categorias dinâmicas

  // Verificar se está em uma categoria específica
  const isInCategory = currentPath.includes('category=') || 
                      currentPath.includes('/offers') || 
                      currentPath.includes('/new-arrivals')

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Bar - Mais elegante */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center py-2.5 text-sm font-light tracking-wide">
        <p className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="font-normal">ENTREGA</span> para todo o Brasil com segurança
          <span className="hidden md:inline-flex items-center gap-1 ml-4 text-amber-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Produtos 100% Originais e Importados
          </span>
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center">
            <DavidImportadosLogo />
          </div>

          {/* Desktop Navigation - Mais elegante */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => {
              const isActive = currentPath.includes(item.href.split('?')[1])
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-gray-700 font-medium text-sm tracking-wide hover:text-amber-600 transition-all duration-300 uppercase group ${
                    isActive ? 'text-amber-600' : ''
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {/* Underline elegante */}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transform origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                  {/* Background hover sutil */}
                  <span className="absolute inset-0 bg-amber-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions - Mais refinados */}
          <div className="flex items-center space-x-3">
            {/* Search com Autocomplete */}
            <div ref={searchRef} className="relative hidden md:block">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="group relative p-3 hover:bg-amber-50 rounded-full transition-all duration-300"
                title="Buscar perfumes"
              >
                <svg className="h-5 w-5 text-gray-700 group-hover:text-amber-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </button>

              {/* Search Dropdown com Autocomplete */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                  <form onSubmit={handleSearch} className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar perfumes, marcas..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                        autoFocus
                      />
                      <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </form>

                  {/* Sugestões */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="border-t border-gray-100">
                      <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Sugestões
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {searchSuggestions.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSuggestionClick(product.slug)}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <img
                              src={product.imageUrl || '/placeholder.png'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-emerald-600 font-semibold">R$ {Number(product.price).toFixed(2)}</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                      >
                        Ver todos os resultados
                      </button>
                    </div>
                  )}

                  {showSuggestions && searchSuggestions.length === 0 && searchTerm.length >= 2 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm">Nenhum produto encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden group relative p-3 hover:bg-amber-50 rounded-full transition-all duration-300"
              title="Buscar perfumes"
            >
              <svg className="h-5 w-5 text-gray-700 group-hover:text-amber-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Favorites */}
            <Link 
              href="/wishlist"
              className="group relative p-3 hover:bg-amber-50 rounded-full transition-all duration-300 hidden md:block"
              title="Lista de desejos"
            >
              <svg className="h-5 w-5 text-gray-700 group-hover:text-amber-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="group relative p-3 hover:bg-amber-50 rounded-full transition-all duration-300">
              <svg className="h-5 w-5 text-gray-700 group-hover:text-amber-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {cartItemCount}
                </span>
              )}
              <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            </Link>

            {/* Account */}
            {mounted && isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1.5 px-3 py-2 hover:bg-amber-50 rounded-full transition-all duration-300">
                  <svg className="h-5 w-5 text-gray-700 group-hover:text-amber-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg className="h-3.5 w-3.5 text-gray-500 group-hover:text-amber-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu - Mais elegante */}
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Minha Conta</p>
                      <p className="text-sm text-gray-900 font-medium mt-0.5 truncate">{user.email}</p>
                    </div>
                    
                    <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-all group/item">
                      <svg className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Meu Perfil
                    </Link>
                    
                    <Link href="/orders" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-all group/item">
                      <svg className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H6L5 9z" />
                      </svg>
                      Meus Pedidos
                    </Link>
                    
                    <Link href="/profile/addresses" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-all group/item">
                      <svg className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Endereços
                    </Link>
                    
                    {isAdmin && (
                      <>
                        <div className="my-2 border-t border-gray-100"></div>
                        <Link href="/admin" className="flex items-center px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-all font-medium group/item">
                          <svg className="w-4 h-4 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Painel Admin
                        </Link>
                      </>
                    )}
                    
                    <div className="my-2 border-t border-gray-100"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all group/item"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : mounted ? (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-700 font-medium hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all duration-300 uppercase text-sm tracking-wide"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 rounded-full transition-all duration-300 uppercase text-sm tracking-wide shadow-md hover:shadow-lg"
                >
                  Cadastrar
                </Link>
              </div>
            ) : (
              <div className="w-20 h-8"></div>
            )}

            {/* Mobile menu button - Mais elegante */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden group relative p-2.5 hover:bg-amber-50 rounded-lg transition-all duration-300"
            >
              <svg className={`h-6 w-6 text-gray-700 group-hover:text-amber-600 transition-all duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              
              {mounted && !isAuthenticated && (
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