'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Tag,
  MessageSquare,
  Image,
  BarChart3,
  Shield,
  Database,
  Mail,
  Calendar,
  Package,
  Globe,
  Key,
  FileSearch
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard'
  },
  {
    id: 'content',
    label: 'Treść',
    icon: FileText,
    children: [
      { id: 'posts', label: 'Posty blogowe', icon: FileText, href: '/admin/blog' },
      { id: 'pages', label: 'Strony', icon: FileSearch, href: '/admin/pages' },
      { id: 'categories', label: 'Kategorie', icon: FolderOpen, href: '/admin/categories' },
      { id: 'tags', label: 'Tagi', icon: Tag, href: '/admin/tags' }
    ]
  },
  {
    id: 'media',
    label: 'Media',
    icon: Image,
    href: '/admin/media'
  },
  {
    id: 'comments',
    label: 'Komentarze',
    icon: MessageSquare,
    href: '/admin/comments'
  },
  {
    id: 'users',
    label: 'Użytkownicy',
    icon: Users,
    children: [
      { id: 'all-users', label: 'Wszyscy użytkownicy', icon: Users, href: '/admin/users' },
      { id: 'roles', label: 'Role i uprawnienia', icon: Shield, href: '/admin/users/roles' },
      { id: 'permissions', label: 'Uprawnienia', icon: Key, href: '/admin/users/permissions' }
    ]
  },
  {
    id: 'analytics',
    label: 'Analityka',
    icon: BarChart3,
    children: [
      { id: 'overview', label: 'Przegląd', icon: BarChart3, href: '/admin/analytics' },
      { id: 'reports', label: 'Raporty', icon: FileText, href: '/admin/analytics/reports' }
    ]
  },
  {
    id: 'settings',
    label: 'Ustawienia',
    icon: Settings,
    children: [
      { id: 'general', label: 'Ogólne', icon: Settings, href: '/admin/settings' },
      { id: 'seo', label: 'SEO', icon: Globe, href: '/admin/settings/seo' },
      { id: 'email', label: 'Email', icon: Mail, href: '/admin/settings/email' },
      { id: 'backup', label: 'Kopie zapasowe', icon: Database, href: '/admin/settings/backup' }
    ]
  }
];

interface InfinoSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function InfinoSidebar({ isCollapsed = false, onToggle }: InfinoSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const [expandedItems, setExpandedItems] = useState<string[]>(['content', 'users']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || pathname.startsWith(fullPath + '/');
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const Icon = item.icon;
    const active = item.href ? isActive(item.href) : false;

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-200
              hover:bg-gray-100 rounded-lg group
              ${isExpanded ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}
            `}
            style={{
              paddingLeft: `${16 + depth * 16}px`,
              backgroundColor: isExpanded ? 'var(--infino-bg-hover)' : 'transparent',
              color: isExpanded ? 'var(--infino-text-primary)' : 'var(--infino-text-secondary)'
            }}
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon className={`w-4 h-4 ${isCollapsed ? '' : ''}`} />
              )}
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 opacity-50" />
              ) : (
                <ChevronRight className="w-4 h-4 opacity-50" />
              )
            )}
          </button>

          {isExpanded && !isCollapsed && item.children && (
            <div className="mt-1">
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={`/${locale}${item.href}`}
        className={`
          flex items-center gap-3 px-4 py-2.5 mb-1 text-sm font-medium transition-all duration-200
          rounded-lg group
          ${active
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
        style={{
          paddingLeft: `${16 + depth * 16}px`,
          backgroundColor: active ? 'var(--infino-primary-light)' : '',
          color: active ? 'var(--infino-primary)' : 'var(--infino-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'var(--infino-bg-hover)';
            e.currentTarget.style.color = 'var(--infino-text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--infino-text-secondary)';
          }
        }}
      >
        {Icon && (
          <Icon className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : ''}`} />
        )}
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`
        bg-white border-r h-full transition-all duration-300 overflow-y-auto
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
      style={{
        backgroundColor: 'var(--infino-bg-card)',
        borderColor: 'var(--infino-border)',
        width: isCollapsed ? 'var(--infino-sidebar-collapsed)' : 'var(--infino-sidebar-width)'
      }}
    >
      {/* Sidebar Header */}
      <div
        className="px-4 py-5 border-b"
        style={{ borderColor: 'var(--infino-border)' }}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: 'var(--infino-primary)' }}
            >
              K
            </div>
            <span className="font-semibold text-base" style={{ color: 'var(--infino-text-primary)' }}>
              KAPM Admin
            </span>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="px-3 py-4">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Sidebar Footer */}
      <div
        className="mt-auto px-4 py-4 border-t"
        style={{ borderColor: 'var(--infino-border)' }}
      >
        {!isCollapsed && (
          <div className="text-xs" style={{ color: 'var(--infino-text-muted)' }}>
            <p>© 2024 KAPM</p>
            <p className="mt-1">Wersja 1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}