import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, User, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function BlogsSection() {
  const t = useTranslations('blogs')

  const blogPosts = [
    {
      id: 1,
      blog: t('items.blog1.category'),
      blogColor: 'text-blue-600',
      title: t('items.blog1.title'),
      excerpt: t('items.blog1.excerpt'),
      author: t('items.blog1.author'),
      readTime: `7 ${t('readTime')}`,
      date: '2024-01-14',
      slug: 'odpowiedzialnosc-zarzadu',
    },
    {
      id: 2,
      blog: t('items.blog2.category'),
      blogColor: 'text-green-600',
      title: t('items.blog2.title'),
      excerpt: t('items.blog2.excerpt'),
      author: t('items.blog2.author'),
      readTime: `5 ${t('readTime')}`,
      date: '2024-01-12',
      slug: 'postepowanie-sanacyjne',
    },
  ]

  const blogsList = [
    { name: t('categories.bankruptcy'), href: '/blog/upadlosc' },
    { name: t('categories.restructuring'), href: '/blog/restrukturyzacja' },
    { name: t('categories.advice'), href: '/blog/porady' },
    { name: t('categories.caselaw'), href: '/blog/orzecznictwo' },
  ]
  return (
    <section className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                {t('title')}
              </h2>
              <p className="mt-2 text-lg text-gray-600">
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden md:flex border-brand-600 text-brand-600 hover:bg-brand-50"
            >
              <Link href="/blogi">
                {t('allBlogs')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-12">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden border-gray-200 transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${post.blogColor}`}>
                    {post.blog}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {post.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="mr-1 h-3 w-3" />
                    {post.author}
                    <span className="mx-2">•</span>
                    {new Date(post.date).toLocaleDateString('pl-PL')}
                  </div>
                  <Link
                    href={`/blogi/${post.blog}/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-500"
                  >
                    {t('readArticle')}
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blogs List */}
        <div className="rounded-lg bg-gray-50 p-8">
          <div className="mb-6 flex items-center">
            <BookOpen className="mr-3 h-6 w-6 text-brand-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              {t('ourBlogs')}
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {blogsList.map((blog) => (
              <a
                key={blog.name}
                href={blog.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-md bg-white px-4 py-2 text-sm transition-all hover:bg-brand-50"
              >
                <span className="text-gray-700 group-hover:text-brand-600">
                  {blog.name}
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Button
            asChild
            variant="outline"
            className="border-brand-600 text-brand-600 hover:bg-brand-50"
          >
            <Link href="/blogi">
              {t('allBlogs')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}