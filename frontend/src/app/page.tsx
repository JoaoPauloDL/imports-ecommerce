'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DevAuthButtons from '@/components/DevAuthButtons'
import DavidImportadosLogo from '@/components/DavidImportadosLogo'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    // Auto-slide hero carousel
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: "DAVID IMPORTADOS",
      subtitle: "PERFUMARIA DE LUXO",
      description: "Fragrâncias exclusivas e sofisticadas das melhores casas internacionais",
      cta: "Descobrir Coleção",
      image: "/hero-1.jpg",
      dark: true
    },
    {
      title: "ESSÊNCIAS ÁRABES",
      subtitle: "ORIENTE MÉDIO AUTÊNTICO", 
      description: "Aromas intensos e luxuosos que despertam os sentidos",
      cta: "Explorar Árabes",
      image: "/hero-2.jpg", 
      dark: true
    },
    {
      title: "PERFUMES FRANCESES",
      subtitle: "ELEGÂNCIA PARISIENSE",
      description: "O refinamento e a sofisticação das tradicionais parfumeries francesas",
      cta: "Ver França",
      image: "/hero-3.jpg",
      dark: true
    }
  ]

  const collections = [
    {
      name: "Perfumes Árabes",
      description: "Oud, Âmbar & Especiarias",
      link: "/products?category=arabes",
      image: "/collection-arabes.jpg"
    },
    {
      name: "Perfumes Franceses", 
      description: "Elegância & Sofisticação",
      link: "/products?category=franceses",
      image: "/collection-franceses.jpg"
    },
    {
      name: "Masculinos",
      description: "Força & Personalidade",
      link: "/products?category=masculinos", 
      image: "/collection-masculinos.jpg"
    },
    {
      name: "Femininos",
      description: "Delicadeza & Charme",
      link: "/products?category=femininos", 
      image: "/collection-femininos.jpg"
    }
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "OUD ROYAL ARABESQUE",
      price: 299.90,
      originalPrice: 399.90,
      category: "Perfumes Árabes",
      image: "/product-1.jpg",
      isNew: true,
      brand: "Al Haramain"
    },
    {
      id: 2, 
      name: "CHANEL No. 5 PARIS",
      price: 549.99,
      category: "Perfumes Franceses",
      image: "/product-2.jpg",
      isNew: false,
      brand: "Chanel"
    },
    {
      id: 3,
      name: "SAUVAGE DIOR",
      price: 389.90,
      originalPrice: 459.90,
      category: "Masculinos", 
      image: "/product-3.jpg",
      isNew: false,
      brand: "Dior"
    },
    {
      id: 4,
      name: "MISS DIOR BLOOMING",
      price: 429.99,
      category: "Femininos",
      image: "/product-4.jpg", 
      isNew: true,
      brand: "Dior"
    }
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`h-full flex items-center justify-center ${
              slide.dark ? 'bg-black text-white' : 'bg-gray-100 text-black'
            }`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-4xl mx-auto">
                  <p className="text-sm font-medium tracking-wider uppercase mb-4 opacity-80 text-amber-400">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl font-light mb-12 opacity-90">
                    {slide.description}
                  </p>
                  <Link 
                    href="/products"
                    className={`inline-block px-12 py-4 text-lg font-medium tracking-wide uppercase transition-all duration-300 ${
                      slide.dark 
                        ? 'bg-white text-black hover:bg-amber-100 border-2 border-transparent hover:border-amber-600' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-amber-600' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">
              EXPLORE NOSSAS CATEGORIAS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra sua fragrância perfeita entre nossas coleções exclusivas de perfumes importados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((collection, index) => (
              <Link
                key={index}
                href={collection.link}
                className="group relative overflow-hidden bg-gray-100 aspect-[4/5] hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                    {collection.name}
                  </h3>
                  <p className="text-white/80 font-medium mb-4">
                    {collection.description}
                  </p>
                  <div className="inline-flex items-center text-white font-medium tracking-wide uppercase text-sm">
                    Ver Perfumes
                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">
              FRAGRÂNCIAS EM DESTAQUE
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os perfumes mais procurados e avaliados pelos nossos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <div className="w-full h-full bg-gray-200" />
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                      New
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                      Sale
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <h3 className="text-lg font-bold text-black mb-1 group-hover:text-gray-600 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-black">
                      R$ {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        R$ {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="inline-block bg-black text-white px-12 py-4 font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors duration-200"
            >
              Ver Todos os Perfumes
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            FIQUE POR DENTRO
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Seja o primeiro a saber sobre novos lançamentos, ofertas exclusivas e coleções especiais
          </p>
          
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-6 py-4 bg-white text-black text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 font-medium tracking-wide uppercase hover:bg-gray-100 transition-colors duration-200"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </section>

      {/* Dev Auth Buttons - Only in development */}
      <DevAuthButtons />
    </div>
  )
}