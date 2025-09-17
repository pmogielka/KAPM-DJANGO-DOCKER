import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ZespolPage() {
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

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Zespół</h1>
          <p className="text-lg text-gray-600 mb-8">
            Strona zespołu jest w przygotowaniu.
          </p>
          <p className="text-gray-500">
            Wkrótce przedstawimy nasz zespół ekspertów prawnych i podatkowych.
          </p>
        </div>
      </div>
    </div>
  )
}