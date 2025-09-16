'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const loginSchema = z.object({
  username: z.string().min(1, 'Login jest wymagany'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get('redirect') || `/${locale}/admin/dashboard`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await authAPI.login(data.username, data.password);
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Nieprawidłowy login lub hasło');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">KAPM</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-navy-900">
            Panel Administracyjny
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Zaloguj się, aby zarządzać treścią strony
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Login</Label>
              <Input
                id="username"
                type="text"
                placeholder="Wprowadź login"
                disabled={isLoading}
                {...register('username')}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="Wprowadź hasło"
                disabled={isLoading}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-sm text-brand-600 hover:text-brand-700 hover:underline"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
                </>
              ) : (
                'Zaloguj się'
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <Link href={`/${locale}`} className="text-brand-600 hover:text-brand-700 hover:underline">
                ← Powrót do strony głównej
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}