'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge
} from '@/components/infino/InfinoPageCard';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  Plus,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  Activity,
  DollarSign,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

interface DashboardStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_comments: number;
  pending_comments: number;
  total_users: number;
  total_media: number;
  total_views: number;
}

interface RecentPost {
  id: number;
  title: string;
  status: string;
  published_at: string | null;
  views_count: number;
  author_name: string;
}

interface RecentComment {
  id: number;
  author_name: string;
  content: string;
  post_title: string;
  created_at: string;
  is_approved: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, postsRes, commentsRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getRecentPosts(),
          adminAPI.getRecentComments(),
        ]);

        setStats(statsRes.data);
        setRecentPosts(postsRes.data);
        setRecentComments(commentsRes.data);
      } catch (err) {
        console.error('Dashboard data error:', err);
        setError('Nie udało się załadować danych dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return 'Nie opublikowany';
    return new Date(date).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      published: { className: 'il-badge il-badge-success', label: 'Opublikowany' },
      draft: { className: 'il-badge il-badge-warning', label: 'Szkic' },
      archived: { className: 'il-badge', label: 'Zarchiwizowany' },
    };

    const config = variants[status] || variants['draft'];

    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="il-alert il-alert-danger flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Witaj w panelu administracyjnym KAPM</p>
        </div>
        <Link href={`/${locale}/admin/blog/new`} className="il-btn il-btn-primary">
          <Plus className="h-4 w-4" />
          Nowy post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="il-grid-4">
        <div className="il-stat-card">
          <div className="il-flex-between">
            <div className="il-stat-icon" style={{ backgroundColor: 'var(--infino-primary-light)' }}>
              <FileText className="h-5 w-5" style={{ color: 'var(--infino-primary)' }} />
            </div>
            <span className="il-stat-value">{stats?.total_posts || 0}</span>
          </div>
          <h3 className="il-stat-label">Wszystkie posty</h3>
          <p className="il-stat-description">
            {stats?.published_posts || 0} opublikowanych, {stats?.draft_posts || 0} szkiców
          </p>
        </div>

        <div className="il-stat-card">
          <div className="il-flex-between">
            <div className="il-stat-icon" style={{ backgroundColor: 'rgba(27, 197, 189, 0.1)' }}>
              <MessageSquare className="h-5 w-5" style={{ color: 'var(--infino-success)' }} />
            </div>
            <span className="il-stat-value">{stats?.total_comments || 0}</span>
          </div>
          <h3 className="il-stat-label">Komentarze</h3>
          <p className="il-stat-description">
            {stats?.pending_comments || 0} oczekujących na moderację
          </p>
        </div>

        <div className="il-stat-card">
          <div className="il-flex-between">
            <div className="il-stat-icon" style={{ backgroundColor: 'rgba(255, 168, 0, 0.1)' }}>
              <Users className="h-5 w-5" style={{ color: 'var(--infino-warning)' }} />
            </div>
            <span className="il-stat-value">{stats?.total_users || 0}</span>
          </div>
          <h3 className="il-stat-label">Użytkownicy</h3>
          <p className="il-stat-description">Aktywni użytkownicy</p>
        </div>

        <div className="il-stat-card">
          <div className="il-flex-between">
            <div className="il-stat-icon" style={{ backgroundColor: 'rgba(141, 80, 252, 0.1)' }}>
              <Eye className="h-5 w-5" style={{ color: 'var(--infino-info)' }} />
            </div>
            <span className="il-stat-value">{stats?.total_views || 0}</span>
          </div>
          <h3 className="il-stat-label">Wyświetlenia</h3>
          <p className="il-stat-description">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Łączna liczba wyświetleń
          </p>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie posty</CardTitle>
            <CardDescription>
              Najnowsze posty blogowe i ich status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Brak postów do wyświetlenia
              </p>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/admin/blog/${post.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-brand-600 truncate"
                        >
                          {post.title}
                        </Link>
                        {getStatusBadge(post.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="text-xs text-gray-500">
                          <Eye className="inline h-3 w-3 mr-1" />
                          {post.views_count} wyświetleń
                        </span>
                        <span className="text-xs text-gray-500">
                          przez {post.author_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link href={`/${locale}/admin/blog/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie komentarze</CardTitle>
            <CardDescription>
              Najnowsze komentarze wymagające moderacji
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentComments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Brak komentarzy do wyświetlenia
              </p>
            ) : (
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{comment.author_name}</span>
                          {' na '}
                          <span className="text-gray-600">{comment.post_title}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                      <Badge variant={comment.is_approved ? 'default' : 'secondary'}>
                        {comment.is_approved ? 'Zatwierdzony' : 'Oczekuje'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}