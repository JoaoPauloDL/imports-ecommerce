'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DevAuthButtons from '@/components/DevAuthButtons'
import DavidImportadosLogo from '@/components/DavidImportadosLogo'
import MobileCarousel from '@/components/MobileCarousel'
import StructuredData from '@/components/StructuredData'
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schema'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

  // Schema.org data para SEO
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  useEffect(() => {
    setMounted(true)
    fetchFeaturedProducts()
    
    // Auto-slide hero carousel
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products')
      if (response.ok) {
        const result = await response.json()
        const products = result.data || result
        
        if (Array.isArray(products)) {
          // Pegar apenas produtos em destaque e ativos
          const featured = products
            .filter(product => product.featured && product.isActive)
            .slice(0, 4) // Máximo 4 produtos
            .map((product: any) => ({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              originalPrice: Number(product.price) * 1.2, // Simular preço original
              category: product.category?.name || 'Geral',
              image: product.imageUrl || '/api/placeholder/300/300',
              isNew: false,
              brand: 'Importado'
            }))
          
          console.log('✅ Produtos em destaque carregados do backend:', featured)
          console.log('📋 Slugs dos produtos:', featured.map(p => `${p.name} → ${p.slug}`))
          setFeaturedProducts(featured)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error)
      console.warn('⚠️ Usando produtos de fallback')
      // Usar produtos de fallback em caso de erro
      setFeaturedProducts(defaultFeaturedProducts)
    }
  }

  const defaultFeaturedProducts = [
    {
      id: '1',
      name: "OUD ROYAL ARABESQUE",
      slug: "oud-royal-arabesque",
      price: 299.90,
      originalPrice: 399.90,
      category: "Perfumes Árabes",
      image: "/product-1.jpg",
      isNew: true,
      brand: "Al Haramain"
    },
    {
      id: '2', 
      name: "CHANEL No. 5 PARIS",
      slug: "chanel-no-5-paris",
      price: 549.99,
      category: "Perfumes Franceses",
      image: "/product-2.jpg",
      isNew: false,
      brand: "Chanel"
    },
    {
      id: '3',
      name: "SAUVAGE DIOR",
      slug: "sauvage-dior",
      price: 389.90,
      originalPrice: 459.90,
      category: "Masculinos", 
      image: "/product-3.jpg",
      isNew: false,
      brand: "Dior"
    },
    {
      id: '4',
      name: "MISS DIOR BLOOMING",
      slug: "miss-dior-blooming",
      price: 429.99,
      category: "Femininos",
      image: "/product-4.jpg", 
      isNew: true,
      brand: "Dior"
    }
  ]

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

  // Slides otimizados para mobile
  const mobileCarouselSlides = [
    {
      title: "DAVID\nIMPORTADOS",
      subtitle: "PERFUMARIA DE LUXO",
      description: "Fragrâncias exclusivas das melhores casas internacionais",
      cta: "Descobrir",
      ctaLink: "/products",
      image: "/hero-1.jpg",
      gradient: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)"
    },
    {
      title: "ESSÊNCIAS\nÁRABES",
      subtitle: "ORIENTE MÉDIO AUTÊNTICO",
      description: "Aromas intensos e luxuosos que despertam os sentidos",
      cta: "Explorar",
      ctaLink: "/products?category=arabes",
      image: "/hero-2.jpg",
      gradient: "linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)"
    },
    {
      title: "PERFUMES\nFRANCESES",
      subtitle: "ELEGÂNCIA PARISIENSE",
      description: "Refinamento das tradicionais parfumeries francesas",
      cta: "Ver França",
      ctaLink: "/products?category=franceses",
      image: "/hero-3.jpg",
      gradient: "linear-gradient(135deg, #0a0a1a 0%, #151530 50%, #0a0a1a 100%)"
    }
  ]

  const collections = [
    {
      name: "Perfumes Árabes",
      description: "Oud, Âmbar & Especiarias",
      link: "/products?category=arabes",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      gradient: "from-amber-900/80 via-orange-900/70 to-black/80",
      icon: "✦"
    },
    {
      name: "Perfumes Franceses", 
      description: "Elegância & Sofisticação",
      link: "/products?category=franceses",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
      gradient: "from-purple-900/80 via-pink-900/70 to-black/80",
      icon: "⚜"
    },
    {
      name: "Masculinos",
      description: "Força & Personalidade",
      link: "/products?category=masculinos", 
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
      gradient: "from-slate-900/80 via-blue-900/70 to-black/80",
      icon: "♔"
    },
    {
      name: "Femininos",
      description: "Delicadeza & Charme",
      link: "/products?category=femininos", 
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
      gradient: "from-rose-900/80 via-pink-900/70 to-black/80",
      icon: "❀"
    }
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org Structured Data para SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />

      {/* Hero Section - Mobile Carousel */}
      <section className="md:hidden">
        <MobileCarousel slides={mobileCarouselSlides} />
      </section>

      {/* Hero Section - Desktop */}
      <section className="relative h-screen overflow-hidden hidden md:block">
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
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl border-2 border-amber-500 hover:border-amber-600' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl'
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
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-semibold tracking-wider uppercase mb-3">Coleções Premium</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">
              EXPLORE NOSSAS CATEGORIAS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra sua fragrância perfeita entre nossas coleções exclusivas de perfumes importados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection, index) => (
              <Link
                key={index}
                href={collection.link}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Imagem de Fundo */}
                <div className="absolute inset-0 bg-gray-900">
                  <Image
                    src={collection.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={index < 2}
                  />
                </div>

                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${collection.gradient} transition-opacity duration-500 group-hover:opacity-90`} />

                {/* Efeito de Brilho no Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                {/* Conteúdo */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  {/* Ícone Decorativo */}
                  <div className="text-5xl mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    {collection.icon}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight leading-tight">
                    {collection.name}
                  </h3>
                  <p className="text-white/90 font-medium mb-4 text-sm md:text-base">
                    {collection.description}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="inline-flex items-center text-white font-bold tracking-wide uppercase text-xs md:text-sm group-hover:text-amber-300 transition-colors duration-300">
                    Ver Perfumes
                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Linha Decorativa */}
                  <div className="w-0 group-hover:w-16 h-0.5 bg-amber-400 mt-4 transition-all duration-500" />
                </div>

                {/* Badge de Tendência (aleatório para efeito) */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                    Destaque
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">FRETE GRÁTIS</h3>
              <p className="text-gray-600">Em compras acima de R$ 200 para todo o Brasil</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PRODUTOS ORIGINAIS</h3>
              <p className="text-gray-600">100% autênticos direto dos fabricantes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ATENDIMENTO VIP</h3>
              <p className="text-gray-600">Suporte especializado e personalizado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-semibold tracking-wider uppercase mb-3">Best Sellers</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">
              FRAGRÂNCIAS EM DESTAQUE
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os perfumes mais procurados e avaliados pelos nossos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="group relative bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.isNew && (
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow-lg rounded-full">
                        Novo
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow-lg rounded-full">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <span className="bg-white text-black px-6 py-2.5 font-bold tracking-wide uppercase text-sm rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver Detalhes
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                    {product.brand}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-black text-gray-900">
                      R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          R$ {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2).replace('.', ',') : product.originalPrice}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {product.originalPrice && (
                    <div className="mt-2 inline-block bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">
                      Economize R$ {(product.originalPrice - product.price).toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-full font-bold tracking-wide uppercase hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ver Todos os Perfumes
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
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
          <p className="text-xl text-gray-300 mb-2 max-w-2xl mx-auto">
            Seja o primeiro a saber sobre novos lançamentos, ofertas exclusivas e coleções especiais
          </p>
          <p className="text-amber-400 font-bold mb-8">
            ✨ Receba 10% de desconto na primeira compra
          </p>
          
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-6 py-4 bg-white text-black text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 font-medium tracking-wide uppercase hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg"
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