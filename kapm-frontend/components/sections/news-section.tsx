"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export function NewsSection() {
  const t = useTranslations('news')
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')

  const categories = [
    t('categories.all'),
    t('categories.bankruptcy'),
    t('categories.restructuring'),
    t('categories.law'),
    t('categories.advice'),
  ]

  // Mock data - data will be loaded from API
  const newsItems = [
    {
      id: 1,
      title: t('items.news1.title'),
      excerpt: t('items.news1.excerpt'),
      category: t('categories.law'),
      date: `15 ${t('date')} 2024`,
      image: '/images/news/placeholder.jpg',
      slug: 'zmiany-prawo-upadlosciowe-2024',
    },
    {
      id: 2,
      title: t('items.news2.title'),
      excerpt: t('items.news2.excerpt'),
      category: t('categories.restructuring'),
      date: `10 ${t('date')} 2024`,
      image: '/images/news/placeholder.jpg',
      slug: 'przygotowanie-restrukturyzacja',
    },
    {
      id: 3,
      title: t('items.news3.title'),
      excerpt: t('items.news3.excerpt'),
      category: t('categories.bankruptcy'),
      date: `5 ${t('date')} 2024`,
      image: '/images/news/placeholder.jpg',
      slug: 'upadlosc-konsumencka-zmiany',
    },
  ]

  const filteredNews = selectedCategory === t('categories.all')
    ? newsItems
    : newsItems.filter((item) => item.category === selectedCategory)

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case t('categories.bankruptcy'):
        return 'bg-red-100 text-red-800'
      case t('categories.restructuring'):
        return 'bg-blue-100 text-blue-800'
      case t('categories.law'):
        return 'bg-purple-100 text-purple-800'
      case t('categories.advice'):
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryFirstLetter = (category: string) => {
    return category.charAt(0).toUpperCase()
  }

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl text-center">
            {t('title')}
          </h2>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  selectedCategory === category
                    ? 'bg-brand-600 hover:bg-brand-700'
                    : 'hover:border-brand-600 hover:text-brand-600'
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-gray-200 transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    className={cn(
                      'h-8 w-8 rounded-full p-0 flex items-center justify-center font-bold',
                      getCategoryColorClass(item.category)
                    )}
                  >
                    {getCategoryFirstLetter(item.category)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600 line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    {item.date}
                  </span>
                  <Link
                    href={`/aktualnosci/${item.slug}`}
                    className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-500"
                  >
                    {t('readMore')}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white"
          >
            <Link href="/aktualnosci">
              {t('viewAllNews')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}