"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'

const slides = [
  {
    id: 'slide1',
    backgroundImage: '/images/hero/slide1.jpg',
    link: '/specjalizacje',
    hasVideo: false,
  },
  {
    id: 'slide2',
    backgroundImage: '/images/hero/slide2.jpg',
    link: '/restrukturyzacja',
    hasVideo: false,
  },
  {
    id: 'slide3',
    backgroundImage: '/images/hero/slide3.jpg',
    link: '/upadlosc-konsumencka',
    hasVideo: false,
  },
]

const navigationItems = [
  { id: 'slide1', icon: '🔄' },
  { id: 'slide2', icon: '⚖️' },
  { id: 'slide3', icon: '✓' },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const t = useTranslations('hero')
  const locale = useLocale()
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Background - Gradient Fallback */}
          <div className={cn(
            "absolute inset-0",
            index === 0 && "bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600",
            index === 1 && "bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500",
            index === 2 && "bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400"
          )}>
            {/* Optional: Add image when available */}
            {/* <Image
              src={slide.backgroundImage}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            /> */}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

          {/* Content */}
          <div className="relative z-10 flex h-full items-center">
            <div className="container">
              <div className="max-w-3xl">
                <h1 className="mb-4 text-5xl font-bold uppercase tracking-tight text-white md:text-6xl lg:text-7xl">
                  {t(`slide${index + 1}.title`)}
                </h1>
                <p className="mb-2 text-xl text-white/90 md:text-2xl">
                  {t(`slide${index + 1}.subtitle`)}
                </p>
                <p className="mb-8 text-lg text-white/80">
                  {t(`slide${index + 1}.description`)}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-600 hover:bg-brand-500"
                  >
                    <Link href={slide.link}>
                      {t(`slide${index + 1}.linkText`)}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {slide.hasVideo && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {t('watchVideo')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container">
          <div className="flex justify-center space-x-4">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  "flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  index === currentSlide
                    ? "bg-brand-600 text-white"
                    : "bg-white/10 text-white/80 backdrop-blur-sm hover:bg-white/20"
                )}
              >
                <span>{item.icon}</span>
                <span>{t(`nav.${index === 0 ? 'restructuring' : index === 1 ? 'bankruptcy' : 'debtRelief'}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20">
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-1 rounded-full transition-all",
                index === currentSlide
                  ? "w-8 bg-brand-600"
                  : "w-2 bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}