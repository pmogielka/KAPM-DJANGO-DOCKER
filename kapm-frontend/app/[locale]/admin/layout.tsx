'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useLocale } from 'next-intl';
import InfinoLayout from '@/components/infino/InfinoLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const checkAuth = () => {
      const userData = authAPI.getUser();
      const isAuth = authAPI.isAuthenticated();

      if (!userData || !isAuth) {
        router.push(`/${locale}/auth/login`);
      }
    };

    checkAuth();
  }, [router, locale]);

  return (
    <InfinoLayout>
      {children}
    </InfinoLayout>
  );
}