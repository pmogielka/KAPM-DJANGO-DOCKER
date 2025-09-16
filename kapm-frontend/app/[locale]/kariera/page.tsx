import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Briefcase, Users, TrendingUp, Heart } from 'lucide-react'

const benefits = [
  {
    icon: Briefcase,
    title: 'Ciekawe projekty',
    description: 'Pracuj przy najbardziej interesujących sprawach gospodarczych w Polsce',
  },
  {
    icon: Users,
    title: 'Zespół ekspertów',
    description: 'Ucz się od najlepszych specjalistów w branży prawniczej',
  },
  {
    icon: TrendingUp,
    title: 'Rozwój kariery',
    description: 'Jasna ścieżka awansu i program rozwoju kompetencji',
  },
  {
    icon: Heart,
    title: 'Work-life balance',
    description: 'Elastyczne godziny pracy i bogaty pakiet benefitów',
  },
]

export default function KarieraPage() {
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Kariera w KAPM</h1>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Dołącz do zespołu jednej z wiodących kancelarii prawnych w Polsce
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-brand-600 mb-2" />
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Aktualne oferty pracy</h2>
            <p className="text-gray-600 mb-8">
              Obecnie nie mamy otwartych rekrutacji, ale zawsze szukamy talentów.
            </p>
            <Button asChild className="bg-brand-600 hover:bg-brand-500">
              <Link href="/kontakt">
                Wyślij CV
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}