'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Replace the locale in the pathname
      const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPathname);
    });
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => handleLanguageChange('pl')}
        disabled={isPending}
        className={cn(
          "px-3 py-1 text-sm font-medium transition-colors",
          locale === 'pl'
            ? "text-brand-600 border-b-2 border-brand-600"
            : "text-gray-600 hover:text-brand-600"
        )}
      >
        PL
      </button>
      <span className="mx-1 text-gray-300">|</span>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className={cn(
          "px-3 py-1 text-sm font-medium transition-colors",
          locale === 'en'
            ? "text-brand-600 border-b-2 border-brand-600"
            : "text-gray-600 hover:text-brand-600"
        )}
      >
        EN
      </button>
    </div>
  );
}