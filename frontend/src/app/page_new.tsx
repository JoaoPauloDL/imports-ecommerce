'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px, 30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase">
            Just Do It
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 tracking-wide max-w-2xl mx-auto">
            Premium imports. Uncompromising quality. Designed for those who demand excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/products" 
              className="bg-white text-black px-8 py-4 font-bold text-lg tracking-wide uppercase hover:bg-gray-100 transition-colors duration-200"
            >
              Shop Now
            </Link>
            <Link 
              href="/products?filter=new" 
              className="border-2 border-white text-white px-8 py-4 font-bold text-lg tracking-wide uppercase hover:bg-white hover:text-black transition-colors duration-200"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight uppercase">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Men', 
                subtitle: 'Performance & Style',
                href: '/products?category=men',
                bgColor: 'bg-gray-100'
              },
              { 
                title: 'Women', 
                subtitle: 'Elegance Redefined',
                href: '/products?category=women',
                bgColor: 'bg-black',
                textColor: 'text-white'
              },
              { 
                title: 'Kids', 
                subtitle: 'Future Champions',
                href: '/products?category=kids',
                bgColor: 'bg-gray-100'
              }
            ].map((category, index) => (
              <Link 
                key={index}
                href={category.href}
                className={`group relative h-96 ${category.bgColor} ${category.textColor || 'text-black'} overflow-hidden transition-transform duration-300 hover:scale-105`}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">
                    {category.title}
                  </h3>
                  <p className="text-lg font-medium tracking-wide mb-4">
                    {category.subtitle}
                  </p>
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-8 tracking-tight uppercase">
                Innovation Meets Design
              </h2>
              <p className="text-xl font-light mb-8 leading-relaxed">
                Every product in our collection represents the pinnacle of craftsmanship and innovation. 
                From cutting-edge materials to timeless design, we curate only the finest imports for the modern consumer.
              </p>
              <Link 
                href="/products?filter=featured" 
                className="inline-block bg-white text-black px-8 py-4 font-bold text-lg tracking-wide uppercase hover:bg-gray-100 transition-colors duration-200"
              >
                Discover More
              </Link>
            </div>
            <div className="bg-gray-900 h-96 flex items-center justify-center">
              <span className="text-6xl font-black text-gray-600 tracking-tighter uppercase">
                Quality
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '1000+', label: 'Premium Products' },
              { number: '25+', label: 'Countries' },
              { number: '99%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="py-8">
                <div className="text-4xl md:text-6xl font-black text-black mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-lg font-medium text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6 tracking-tight uppercase">
            Stay In The Loop
          </h2>
          <p className="text-xl font-light mb-8 text-gray-600">
            Be the first to know about new arrivals, exclusive drops, and member-only offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 border-b-2 border-gray-300 bg-transparent focus:border-black focus:outline-none text-lg"
            />
            <button className="bg-black text-white px-8 py-3 font-bold tracking-wide uppercase hover:bg-gray-800 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase">
            Ready to Elevate Your Style?
          </h2>
          <Link 
            href="/products" 
            className="inline-block bg-white text-black px-12 py-6 font-bold text-xl tracking-wide uppercase hover:bg-gray-100 transition-colors duration-200"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  )
}