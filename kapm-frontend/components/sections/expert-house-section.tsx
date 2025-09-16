import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Award, Briefcase, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ExpertHouseSection() {
  const t = useTranslations('about')

  const features = [
    {
      icon: Users,
      title: t('features.experts.title'),
      description: t('features.experts.description'),
    },
    {
      icon: Award,
      title: t('features.experience.title'),
      description: t('features.experience.description'),
    },
    {
      icon: Briefcase,
      title: t('features.comprehensive.title'),
      description: t('features.comprehensive.description'),
    },
    {
      icon: Globe,
      title: t('features.nationwide.title'),
      description: t('features.nationwide.description'),
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="mb-6">
              <span className="text-brand-600 font-semibold uppercase tracking-wide text-sm">
                {t('badge')}
              </span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                {t('title')}
              </h2>
            </div>
            <p className="mb-6 text-lg text-gray-600 leading-relaxed">
              {t('description1')}
            </p>
            <p className="mb-8 text-lg text-gray-600 leading-relaxed">
              {t('description2')}
            </p>
            <Button
              asChild
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              <Link href="/o-nas">
                {t('learnMore')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md hover:border-brand-600"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100">
                    <Icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}