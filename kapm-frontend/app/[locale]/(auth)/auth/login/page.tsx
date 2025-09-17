'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { Loader2, AlertCircle, Lock, User } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Login jest wymagany'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      router.push('/pl/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Nieprawidłowy login lub hasło');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="il-card" style={{
      maxWidth: '420px',
      width: '100%',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <div className="il-card-body" style={{ padding: '2.5rem' }}>
        <h2 className="text-center mb-8" style={{
          fontSize: '1.75rem',
          fontWeight: '600',
          color: 'var(--infino-text-primary)'
        }}>
          Logowanie
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="il-alert il-alert-danger flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Field */}
          <div className="il-form-group">
            <label className="il-label flex items-center gap-2">
              <User className="h-4 w-4" style={{ color: 'var(--infino-text-muted)' }} />
              Login
            </label>
            <input
              type="text"
              className={`il-input ${errors.username ? 'il-input-error' : ''}`}
              placeholder="Wprowadź login"
              disabled={isLoading}
              {...register('username')}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '14px'
              }}
            />
            {errors.username && (
              <p className="il-error-message">{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="il-form-group">
            <label className="il-label flex items-center gap-2">
              <Lock className="h-4 w-4" style={{ color: 'var(--infino-text-muted)' }} />
              Hasło
            </label>
            <input
              type="password"
              className={`il-input ${errors.password ? 'il-input-error' : ''}`}
              placeholder="Wprowadź hasło"
              disabled={isLoading}
              {...register('password')}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '14px'
              }}
            />
            {errors.password && (
              <p className="il-error-message">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
                style={{
                  accentColor: 'var(--infino-primary)'
                }}
              />
              <span className="text-sm" style={{ color: 'var(--infino-text-secondary)' }}>
                Zapamiętaj mnie
              </span>
            </label>
            <Link
              href="#"
              className="text-sm"
              style={{
                color: 'var(--infino-primary)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Zapomniałeś hasła?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="il-btn il-btn-primary il-btn-lg w-full"
            disabled={isLoading}
            style={{
              marginTop: '1.5rem',
              padding: '0.875rem',
              fontSize: '15px',
              fontWeight: '500',
              borderRadius: 'var(--infino-radius)'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logowanie...
              </>
            ) : (
              'Zaloguj się'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-8 pt-6 border-t" style={{
          borderColor: 'var(--infino-border)'
        }}>
          <p className="text-sm" style={{ color: 'var(--infino-text-muted)' }}>
            Nie masz konta?{' '}
            <Link
              href="#"
              style={{
                color: 'var(--infino-primary)',
                fontWeight: '500'
              }}
            >
              Skontaktuj się z administratorem
            </Link>
          </p>
          <div className="mt-4">
            <Link
              href="/pl"
              className="text-sm"
              style={{
                color: 'var(--infino-text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--infino-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--infino-text-secondary)'}
            >
              ← Powrót do strony głównej
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}