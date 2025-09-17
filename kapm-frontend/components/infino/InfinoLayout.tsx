'use client';

import React, { useState } from 'react';
import InfinoSidebar from './InfinoSidebar';
import InfinoHeader from './InfinoHeader';

interface InfinoLayoutProps {
  children: React.ReactNode;
}

export default function InfinoLayout({ children }: InfinoLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--infino-bg-main)' }}>
      {/* Main Container */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <InfinoSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <InfinoHeader onMenuToggle={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}