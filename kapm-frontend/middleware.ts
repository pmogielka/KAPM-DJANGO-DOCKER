import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Sprawdź czy to ścieżka admin
  const isAdminPath = pathname.includes('/admin') || pathname.includes('/pl/admin') || pathname.includes('/en/admin');

  // Pobierz token z ciasteczek
  const accessToken = request.cookies.get('access_token');

  // Jeśli to ścieżka admin i brak tokena, przekieruj do logowania
  if (isAdminPath && !accessToken) {
    const locale = pathname.split('/')[1];
    const isValidLocale = locales.includes(locale as any);
    const loginPath = isValidLocale ? `/${locale}/login` : '/login';

    const url = new URL(loginPath, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Jeśli użytkownik jest zalogowany i próbuje wejść na stronę logowania
  const isLoginPath = pathname.includes('/login');
  if (isLoginPath && accessToken) {
    const locale = pathname.split('/')[1];
    const isValidLocale = locales.includes(locale as any);
    const dashboardPath = isValidLocale ? `/${locale}/admin/dashboard` : '/admin/dashboard';

    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Zastosuj middleware i18n dla innych ścieżek
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(pl|en)/:path*',
    '/admin/:path*',
    '/login',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ]
};