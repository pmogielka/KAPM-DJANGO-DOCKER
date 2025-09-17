import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { BlogsSection } from '@/components/sections/blogs-section'

export default function BlogiPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do strony głównej
            </Link>
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center">Nasze Blogi</h1>
        <BlogsSection />
      </div>
    </div>
  )
}