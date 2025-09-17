'use client';

import React from 'react';

interface InfinoAuthLayoutProps {
  children: React.ReactNode;
}

export default function InfinoAuthLayout({ children }: InfinoAuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      backgroundColor: 'var(--infino-bg-main)',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundBlendMode: 'overlay'
    }}>
      {/* Auth Container */}
      <div className="w-full max-w-md mx-auto p-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-lg shadow-lg mb-4">
            <span className="text-3xl font-bold text-[var(--infino-primary)]">KAPM</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">
            System Zarządzania
          </h1>
          <p className="text-white/80 mt-2">
            Zaloguj się do panelu administracyjnego
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}