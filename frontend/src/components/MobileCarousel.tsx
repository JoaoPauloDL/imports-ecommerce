'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface MobileCarouselSlide {
  title: string
  subtitle: string
  description: string
  cta: string
  ctaLink: string
  image: string
  gradient: string
}

interface MobileCarouselProps {
  slides: MobileCarouselSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function MobileCarousel({ slides, autoPlay = true, autoPlayInterval = 4000 }: MobileCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, autoPlayInterval, slides.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }
    if (isRightSwipe) {
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
    }

    // Pause auto play for 10 seconds after manual interaction
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full relative flex flex-col justify-center"
            style={{
              background: slide.gradient
            }}
          >
            {/* Content */}
            <div className="relative z-10 px-6 text-center text-white">
              <div className="mb-6">
                <p className="text-amber-300 text-sm font-bold tracking-widest uppercase mb-2">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                  {slide.description}
                </p>
              </div>
              
              <Link
                href={slide.ctaLink}
                className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 font-bold tracking-wider uppercase text-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg"
              >
                {slide.cta}
              </Link>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-gradient-to-br from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-amber-400 scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 ease-out"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </div>
  )
}