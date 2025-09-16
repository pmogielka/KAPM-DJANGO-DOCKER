"use client"

import React from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Scale, Calculator } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function SpecializationsSection() {
  const t = useTranslations('specializations')

  const specializations = {
    upadlosc: {
      icon: Scale,
      title: t('bankruptcy.title'),
      description: t('bankruptcy.description'),
      items: [
        { name: t('bankruptcy.items.corporate'), href: '/upadlosc-przedsiebiorstw' },
        { name: t('bankruptcy.items.consumer'), href: '/upadlosc-konsumencka' },
        { name: t('bankruptcy.items.liquidation'), href: '/likwidacja-spolek' },
        { name: t('bankruptcy.items.trustees'), href: '/obsluga-syndykow' },
        { name: t('bankruptcy.items.managementProtection'), href: '/ochrona-zarzadu' },
        { name: t('bankruptcy.items.managementLiability'), href: '/odpowiedzialnosc-zarzadu' },
      ],
    },
    restrukturyzacja: {
      icon: Calculator,
      title: t('restructuring.title'),
      description: t('restructuring.description'),
      items: [
        { name: t('restructuring.items.arrangementApproval'), href: '/zatwierdzenie-ukladu' },
        { name: t('restructuring.items.acceleratedArrangement'), href: '/przyspieszone-ukladowe' },
        { name: t('restructuring.items.arrangementProceedings'), href: '/postepowanie-ukladowe' },
        { name: t('restructuring.items.remedialProceedings'), href: '/postepowanie-sanacyjne' },
        { name: t('restructuring.items.restructuringPlans'), href: '/plany-restrukturyzacyjne' },
        { name: t('restructuring.items.creditorsNegotiations'), href: '/negocjacje-wierzyciele' },
      ],
    },
  }

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
          </p>
        </div>

        <Tabs defaultValue="upadlosc" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger
              value="upadlosc"
              className="data-[state=active]:bg-brand-600 data-[state=active]:text-white"
            >
              <Scale className="mr-2 h-4 w-4" />
              {t('tabs.bankruptcy')}
            </TabsTrigger>
            <TabsTrigger
              value="restrukturyzacja"
              className="data-[state=active]:bg-brand-600 data-[state=active]:text-white"
            >
              <Calculator className="mr-2 h-4 w-4" />
              {t('tabs.restructuring')}
            </TabsTrigger>
          </TabsList>

          {Object.entries(specializations).map(([key, category]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="mb-8 text-center">
                    <p className="text-gray-600">{category.description}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-brand-600 hover:bg-brand-50"
                      >
                        <span className="text-gray-700 group-hover:text-brand-600">
                          {item.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
                      </Link>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Link
                      href={`/specjalizacje?kategoria=${key}`}
                      className="inline-flex items-center text-brand-600 hover:text-brand-500"
                    >
                      {t('viewAll')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}