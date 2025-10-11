'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
      title: "JUST DO IT",
      subtitle: "NEW ARRIVALS",
      description: "Get the latest drops and exclusive releases",
      cta: "Shop Now",
      image: "/hero-1.jpg",
      dark: true
    },
    {
      title: "IMPOSSIBLE IS NOTHING",
      subtitle: "PERFORMANCE COLLECTION", 
      description: "Engineered for athletes, designed for everyone",
      cta: "Explore",
      image: "/hero-2.jpg", 
      dark: false
    },
    {
      title: "FUTURE FORWARD",
      subtitle: "SUSTAINABLE STYLE",
      description: "Made with recycled materials for a better tomorrow",
      cta: "Discover",
      image: "/hero-3.jpg",
      dark: true
    }
  ]

  const collections = [
    {
      name: "Men's",
      description: "Athletic & Lifestyle",
      link: "/products?category=men",
      image: "/collection-men.jpg"
    },
    {
      name: "Women's", 
      description: "Performance & Fashion",
      link: "/products?category=women",
      image: "/collection-women.jpg"
    },
    {
      name: "Kids'",
      description: "Growing Strong",
      link: "/products?category=kids", 
      image: "/collection-kids.jpg"
    }
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "AIR MAX REVOLUTION",
      price: 299.99,
      originalPrice: 399.99,
      category: "Sneakers",
      image: "/product-1.jpg",
      isNew: true
    },
    {
      id: 2, 
      name: "ULTRABOOST DNA",
      price: 249.99,
      category: "Running",
      image: "/product-2.jpg",
      isNew: false
    },
    {
      id: 3,
      name: "CLASSIC HOODIE",
      price: 89.99,
      originalPrice: 129.99,
      category: "Apparel", 
      image: "/product-3.jpg",
      isNew: false
    },
    {
      id: 4,
      name: "SPORTS BACKPACK",
      price: 79.99,
      category: "Accessories",
      image: "/product-4.jpg", 
      isNew: true
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
                  <p className="text-sm font-medium tracking-wider uppercase mb-4 opacity-80">
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
                        ? 'bg-white text-black hover:bg-gray-100' 
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
                  ? 'bg-white' 
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
              SHOP BY CATEGORY
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find your perfect style across our curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    Shop Now
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
              TRENDING NOW
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The hottest drops everyone's talking about
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
                    {product.category}
                  </p>
                  <h3 className="text-lg font-bold text-black mb-3 group-hover:text-gray-600 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-black">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
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
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            STAY IN THE LOOP
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be the first to know about new arrivals, exclusive drops, and special offers
          </p>
          
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white text-black text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 font-medium tracking-wide uppercase hover:bg-gray-100 transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}