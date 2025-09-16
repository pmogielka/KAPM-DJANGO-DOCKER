"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('navigation')
  const locale = useLocale()

  const navigation = [
    { name: t('about'), href: '/o-nas' },
    {
      name: t('services'),
      href: '/specjalizacje',
      children: [
        { name: t('servicesMenu.bankruptcyLaw'), href: '/specjalizacje/upadlosc' },
        { name: t('servicesMenu.restructuring'), href: '/specjalizacje/restrukturyzacja' },
        { name: t('servicesMenu.consumerBankruptcy'), href: '/specjalizacje/konsumencka' },
      ]
    },
    { name: t('news'), href: '/aktualnosci' },
    { name: t('publications'), href: '/publikacje' },
    { name: t('team'), href: '/zespol' },
    { name: t('contact'), href: '/kontakt' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center space-x-2 text-2xl font-bold"
        >
          <span className="text-brand-600">KAPM</span>
          <span className="h-2 w-2 rounded-full bg-brand-600"></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-brand-50 hover:text-brand-600">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                                    "hover:bg-brand-50 hover:text-brand-600 focus:bg-brand-50 focus:text-brand-600"
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {child.name}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                        "hover:bg-brand-50 hover:text-brand-600 focus:bg-brand-50 focus:text-brand-600 focus:outline-none"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Language Switcher & CTA Button */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <LanguageSwitcher />
          <Link href={`/${locale}/login`}>
            <Button variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50">
              <Lock className="mr-2 h-4 w-4" />
              {t('login')}
            </Button>
          </Link>
          <Button className="bg-brand-600 hover:bg-brand-500">
            {t('contact')}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-white lg:hidden">
          <nav className="container py-8">
            <ul className="space-y-6">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block text-lg font-medium text-gray-900 hover:text-brand-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <ul className="mt-4 ml-4 space-y-3">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className="block text-base text-gray-600 hover:text-brand-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-4">
              <Link href={`/${locale}/login`} className="block">
                <Button variant="outline" className="w-full border-brand-600 text-brand-600 hover:bg-brand-50">
                  <Lock className="mr-2 h-4 w-4" />
                  {t('login')}
                </Button>
              </Link>
              <Button className="w-full bg-brand-600 hover:bg-brand-500">
                {t('contact')}
              </Button>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}