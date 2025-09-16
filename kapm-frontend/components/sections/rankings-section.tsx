"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Award } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { useTranslations } from 'next-intl'

export function RankingsSection() {
  const t = useTranslations('rankings')
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
  })

  const rankings = [
    {
      id: 1,
      name: t('items.item1.name'),
      category: t('items.item1.category'),
      logo: '/images/rankings/placeholder.png',
      year: 2024,
    },
    {
      id: 2,
      name: t('items.item2.name'),
      category: t('items.item2.category'),
      logo: '/images/rankings/placeholder.png',
      year: 2024,
    },
    {
      id: 3,
      name: t('items.item3.name'),
      category: t('items.item3.category'),
      logo: '/images/rankings/placeholder.png',
      year: 2024,
    },
  ]

  const partners = [
    {
      id: 1,
      name: t('partnerItems.item1.name'),
      description: t('partnerItems.item1.description'),
      logo: '/images/partners/placeholder.png',
    },
    {
      id: 2,
      name: t('partnerItems.item2.name'),
      description: t('partnerItems.item2.description'),
      logo: '/images/partners/placeholder.png',
    },
  ]

  return (
    <section className="section bg-gray-50">
      <div className="container">
        {/* Rankings */}
        <div className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {t('title')}
            </h2>
            <Button
              asChild
              variant="ghost"
              className="hidden md:flex text-brand-600 hover:text-brand-700"
            >
              <Link href="/o-nas#nagrody">
                {t('viewMore')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Rankings Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {rankings.map((ranking) => (
                <div
                  key={ranking.id}
                  className="relative min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                >
                  <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 transition-all hover:shadow-lg">
                    <div className="absolute top-4 right-4">
                      <Award className="h-6 w-6 text-brand-600" />
                    </div>
                    <div className="mb-4 h-16 w-32">
                      {/* Logo placeholder */}
                      <div className="h-full w-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        Logo
                      </div>
                    </div>
                    <h3 className="mb-1 font-semibold text-gray-900">
                      {ranking.name}
                    </h3>
                    <p className="text-sm text-gray-600">{ranking.category}</p>
                    <p className="mt-2 text-xs text-gray-500">{ranking.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners */}
        <div>
          <h3 className="mb-8 text-2xl font-bold text-gray-900">
            {t('partners')}
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="h-16 w-16 flex-shrink-0">
                  {/* Logo placeholder */}
                  <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    Logo
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {partner.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {partner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}