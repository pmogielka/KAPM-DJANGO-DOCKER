'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  FileText,
  File,
  Tag,
  FolderOpen,
  Image,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  PenTool,
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  role: string;
  avatar?: string;
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
  },
  {
    label: 'Treść',
    icon: PenTool,
    items: [
      { label: 'Posty blogowe', href: '/admin/blog', icon: FileText },
      { label: 'Strony', href: '/admin/pages', icon: File },
      { label: 'Kategorie', href: '/admin/categories', icon: FolderOpen },
      { label: 'Tagi', href: '/admin/tags', icon: Tag },
    ],
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'Komentarze',
    href: '/admin/comments',
    icon: MessageSquare,
  },
  {
    label: 'Użytkownicy',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Ustawienia',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Treść']);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const checkAuth = () => {
      const userData = authAPI.getUser();
      const isAuth = authAPI.isAuthenticated();

      if (!userData || !isAuth) {
        router.push(`/${locale}/login`);
      } else {
        setUser(userData);
      }
    };

    checkAuth();
  }, [router, locale]);

  const handleLogout = async () => {
    await authAPI.logout();
    router.push(`/${locale}/login`);
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: any, depth = 0) => {
    const isExpanded = expandedItems.includes(item.label);
    const hasSubItems = item.items && item.items.length > 0;
    const isActive = item.href && pathname.includes(item.href);

    if (hasSubItems) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpanded(item.label)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors',
              'hover:bg-navy-700 hover:text-white',
              isExpanded ? 'bg-navy-700 text-white' : 'text-gray-300',
              depth > 0 && 'pl-8'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="bg-navy-900/50">
              {item.items.map((subItem: any) => renderMenuItem(subItem, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={`/${locale}${item.href}`}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
          'hover:bg-navy-700 hover:text-white',
          isActive ? 'bg-brand-600 text-white' : 'text-gray-300',
          depth > 0 && 'pl-12'
        )}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.label}</span>
      </Link>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-navy-800 transition-transform duration-300',
          !sidebarOpen && '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-navy-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-white font-semibold text-lg">KAPM Admin</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-navy-700 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => renderMenuItem(item))}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t border-navy-700 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-brand-600 text-white">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn('transition-all duration-300', sidebarOpen ? 'lg:ml-64' : '')}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-brand-600 text-white text-xs">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/admin/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Ustawienia
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj się
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}