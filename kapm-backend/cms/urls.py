from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'cms'

# Router dla publicznych endpointów
public_router = DefaultRouter()
public_router.register(r'blog', views.PublicBlogPostViewSet, basename='public-blog')
public_router.register(r'pages', views.PublicPageViewSet, basename='public-pages')
public_router.register(r'categories', views.PublicCategoryViewSet, basename='public-categories')
public_router.register(r'tags', views.PublicTagViewSet, basename='public-tags')
public_router.register(r'comments', views.PublicCommentViewSet, basename='public-comments')

# Router dla admin endpointów
admin_router = DefaultRouter()
admin_router.register(r'blog', views.AdminBlogPostViewSet, basename='admin-blog')
admin_router.register(r'pages', views.AdminPageViewSet, basename='admin-pages')
admin_router.register(r'categories', views.AdminCategoryViewSet, basename='admin-categories')
admin_router.register(r'tags', views.AdminTagViewSet, basename='admin-tags')
admin_router.register(r'media', views.MediaFileViewSet, basename='media')
admin_router.register(r'comments', views.AdminCommentViewSet, basename='admin-comments')

urlpatterns = [
    # Publiczne API
    path('public/', include((public_router.urls, 'public'))),

    # Admin API (wymaga autoryzacji)
    path('admin/', include((admin_router.urls, 'admin'))),

    # Dashboard endpoints
    path('admin/dashboard/stats/', views.dashboard_stats_view, name='dashboard-stats'),
    path('admin/dashboard/recent-posts/', views.recent_posts_view, name='recent-posts'),
    path('admin/dashboard/recent-comments/', views.recent_comments_view, name='recent-comments'),
]