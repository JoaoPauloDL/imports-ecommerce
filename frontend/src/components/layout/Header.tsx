'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  // Simular estado do usuário logado
  const [isLoggedIn] = useState(false)
  const [cartItemCount] = useState(3)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
      setSearchTerm('')
    }
  }

  const navigation = [
    { name: 'Árabes', href: '/products?category=arabes' },
    { name: 'Franceses', href: '/products?category=franceses' },
    { name: 'Masculinos', href: '/products?category=masculinos' },
    { name: 'Femininos', href: '/products?category=femininos' },
    { name: 'Unissex', href: '/products?category=unissex' },
    { name: 'Ofertas', href: '/products?filter=sale' }
  ]

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-white text-center py-2 text-sm font-medium">
        <p>FRETE GRÁTIS para todo Brasil acima de R$ 300 | Perfumes 100% Originais</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-black tracking-tighter text-black">PERFUMES</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-black font-medium text-sm tracking-wide hover:text-gray-600 transition-colors duration-200 uppercase"
              >
                {item.name}
              </Link>
            ))}
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
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isLoggedIn ? (
              <div className="relative">
                <button className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
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
              
              {!isLoggedIn && (
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