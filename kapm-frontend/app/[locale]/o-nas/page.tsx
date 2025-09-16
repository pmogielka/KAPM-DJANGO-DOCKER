import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ONasPage() {
  const t = useTranslations('aboutPage')

  return (
    <div className="min-h-screen py-20">
      <div className="container">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToHome')}
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{t('pageTitle')}</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              {t('intro')}
            </p>
            <h2 className="text-2xl font-semibold mb-4">{t('missionTitle')}</h2>
            <p className="text-gray-600 mb-6">
              {t('missionText')}
            </p>
            <h2 className="text-2xl font-semibold mb-4">{t('valuesTitle')}</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>{t('values.value1')}</li>
              <li>{t('values.value2')}</li>
              <li>{t('values.value3')}</li>
              <li>{t('values.value4')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}