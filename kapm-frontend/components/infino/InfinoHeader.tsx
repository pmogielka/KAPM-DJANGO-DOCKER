'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { authAPI } from '@/lib/api';
import {
  Menu,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Search,
  Home
} from 'lucide-react';

interface InfinoHeaderProps {
  onMenuToggle?: () => void;
}

export default function InfinoHeader({ onMenuToggle }: InfinoHeaderProps) {
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount] = useState(3);

  useEffect(() => {
    const userData = authAPI.getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = async () => {
    await authAPI.logout();
    router.push(`/${locale}/auth/login`);
  };

  const getUserInitials = () => {
    if (!user) return 'NN';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'NN';
  };

  return (
    <header
      className="w-full bg-white border-b shadow-sm relative z-40"
      style={{
        backgroundColor: 'var(--infino-bg-card)',
        borderColor: 'var(--infino-border)',
        height: 'var(--infino-header-height)'
      }}
    >
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Toggle */}
          <button
            className="text-gray-600 hover:text-gray-800 p-2 rounded transition-colors"
            onClick={onMenuToggle}
            style={{
              color: 'var(--infino-text-secondary)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--infino-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--infino-text-secondary)'}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href={`/${locale}/admin/dashboard`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: 'var(--infino-primary)' }}>
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-semibold" style={{ color: 'var(--infino-text-primary)' }}>
                KAPM Admin
              </span>
            </Link>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Szukaj..."
              className="il-input pl-10"
              style={{
                backgroundColor: 'var(--infino-bg-hover)',
                border: '1px solid var(--infino-border-light)',
                borderRadius: 'var(--infino-radius)',
                padding: '0.5rem 1rem 0.5rem 2.5rem'
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: 'var(--infino-text-muted)' }} />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded transition-colors"
            style={{
              color: 'var(--infino-text-secondary)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--infino-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--infino-text-secondary)'}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--infino-danger)' }}
              >
                {notificationCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded transition-colors"
            style={{
              color: 'var(--infino-text-secondary)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--infino-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--infino-text-secondary)'}
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                backgroundColor: dropdownOpen ? 'var(--infino-bg-hover)' : 'transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--infino-bg-hover)'}
              onMouseLeave={(e) => !dropdownOpen && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: 'var(--infino-primary)' }}
              >
                {getUserInitials()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium" style={{ color: 'var(--infino-text-primary)' }}>
                  {user?.first_name || 'Użytkownik'} {user?.last_name || ''}
                </div>
                <div className="text-xs" style={{ color: 'var(--infino-text-muted)' }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                </div>
              </div>
              <ChevronDown className="h-4 w-4" style={{ color: 'var(--infino-text-secondary)' }} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Menu */}
                <div
                  className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-20 overflow-hidden"
                  style={{
                    backgroundColor: 'var(--infino-bg-card)',
                    border: '1px solid var(--infino-border)',
                    boxShadow: 'var(--infino-shadow-md)'
                  }}
                >
                  <div className="py-1">
                    <Link
                      href={`/${locale}/admin/profile`}
                      className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                      style={{ color: 'var(--infino-text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--infino-bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User className="h-4 w-4" />
                      Mój profil
                    </Link>
                    <Link
                      href={`/${locale}/admin/settings`}
                      className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                      style={{ color: 'var(--infino-text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--infino-bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Settings className="h-4 w-4" />
                      Ustawienia
                    </Link>
                    <hr style={{ borderColor: 'var(--infino-border)', margin: '0.5rem 0' }} />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm w-full transition-colors"
                      style={{ color: 'var(--infino-danger)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--infino-bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut className="h-4 w-4" />
                      Wyloguj
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}