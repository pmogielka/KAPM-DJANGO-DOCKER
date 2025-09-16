import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react'

const offices = [
  {
    city: 'Poznań',
    address: 'ul. Grunwaldzka 38',
    postalCode: '60-786 Poznań',
    phone: '+48 61 222 43 80',
    email: 'office@kapm.pl',
    hours: '9:00 - 17:00',
  },
  {
    city: 'Warszawa',
    address: 'ul. Marszałkowska 89',
    postalCode: '00-693 Warszawa',
    phone: '+48 22 333 43 80',
    email: 'warszawa@kapm.pl',
    hours: '9:00 - 17:00',
  },
]

export default function KontaktPage() {
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

        <h1 className="text-4xl font-bold mb-8 text-center">Kontakt</h1>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Napisz do nas</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Imię i nazwisko</Label>
                    <Input id="name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" />
                </div>
                <div>
                  <Label htmlFor="subject">Temat</Label>
                  <Input id="subject" required />
                </div>
                <div>
                  <Label htmlFor="message">Wiadomość</Label>
                  <Textarea id="message" rows={5} required />
                </div>
                <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-500">
                  Wyślij wiadomość
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Office Locations */}
          <div className="space-y-6">
            {offices.map((office) => (
              <Card key={office.city}>
                <CardHeader>
                  <CardTitle>Biuro {office.city}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{office.address}</p>
                      <p>{office.postalCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-brand-600 flex-shrink-0" />
                    <p>{office.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-brand-600 flex-shrink-0" />
                    <p>{office.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-3 h-5 w-5 text-brand-600 flex-shrink-0" />
                    <p>Pn-Pt: {office.hours}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}