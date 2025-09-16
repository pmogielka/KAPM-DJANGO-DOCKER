"use client"

import React from 'react'
import Link from 'next/link'
import { Facebook, Linkedin, Youtube, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslations, useLocale } from 'next-intl'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const getFooterNavigation = (t: any) => ({
  company: [
    { name: t('company.about'), href: '/o-nas' },
    { name: t('company.team'), href: '/zespol' },
    { name: t('company.career'), href: '/kariera' },
  ],
  services: [
    { name: t('services.corporateBankruptcy'), href: '/upadlosc-przedsiebiorstw' },
    { name: t('services.consumerBankruptcy'), href: '/upadlosc-konsumencka' },
    { name: t('services.restructuring'), href: '/restrukturyzacja' },
    { name: t('services.managementProtection'), href: '/ochrona-zarzadu' },
  ],
  resources: [
    { name: t('resources.news'), href: '/aktualnosci' },
    { name: t('resources.blogs'), href: '/blogi' },
  ],
  legal: [
    { name: t('legal.privacy'), href: '/polityka-prywatnosci' },
    { name: t('legal.terms'), href: '/regulamin' },
  ],
})

const getOffices = (t: any) => [
  {
    city: t('offices.office1'),
    address: '',
    postalCode: '',
    phone: '',
    email: 'contact@example.com',
    hours: '9:00 - 17:00',
  },
  {
    city: t('offices.office2'),
    address: '',
    postalCode: '',
    phone: '',
    email: 'contact@example.com',
    hours: '9:00 - 17:00',
  },
]

const socialLinks = [
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'YouTube', href: '#', icon: Youtube },
  { name: 'Instagram', href: '#', icon: Instagram },
]

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const footerNavigation = getFooterNavigation(t);
  const offices = getOffices(t);
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container">
        {/* Newsletter Section */}
        <div className="mb-12 rounded-lg bg-brand-600 p-8 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-2 text-2xl font-bold">
              {t('newsletter.title')}
            </h3>
            <p className="mb-6 text-brand-100">
              {t('newsletter.subtitle')}
            </p>
            <form className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 bg-white text-gray-900"
                required
              />
              <Button
                type="submit"
                className="bg-white text-brand-600 hover:bg-gray-100"
              >
                {t('newsletter.button')}
              </Button>
            </form>
            <div className="mt-4 flex items-start space-x-2 text-xs">
              <Checkbox id="consent" className="border-white" />
              <Label
                htmlFor="consent"
                className="text-brand-100 cursor-pointer"
              >
                {t('newsletter.consent.text')}{' '}
                <Link href="/polityka-prywatnosci" className="underline">
                  {t('newsletter.consent.link')}
                </Link>
              </Label>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-brand-600">{t('companyName')}</span>
              <span className="ml-1 inline-block h-2 w-2 rounded-full bg-brand-600"></span>
            </Link>
            <p className="mb-4 text-sm text-gray-600">
              {t('tagline.line1')}<br />
              {t('tagline.line2')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-brand-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-gray-900">
              {t('sections.company')}
            </h4>
            <ul className="space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-gray-900">
              {t('sections.services')}
            </h4>
            <ul className="space-y-2">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-gray-900">
              {t('sections.resources')}
            </h4>
            <ul className="space-y-2">
              {footerNavigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-gray-900">
              {t('sections.legal')}
            </h4>
            <ul className="space-y-2">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Offices */}
        <div className="mt-12 grid gap-8 border-t pt-8 md:grid-cols-2">
          {offices.map((office) => (
            <div key={office.city} className="space-y-2">
              <h4 className="font-semibold text-gray-900">
                {office.city}
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-start">
                  <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                  {office.address}<br />
                  {office.postalCode}
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                  {office.phone}
                </p>
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                  {office.email}
                </p>
                <p className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                  {t('weekDays')}: {office.hours}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {t('copyright')}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}