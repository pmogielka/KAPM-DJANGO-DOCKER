from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    BlogPost, Category, Tag, Page, MediaFile,
    UserProfile, Comment
)
from .serializers import (
    BlogPostListSerializer, BlogPostDetailSerializer, BlogPostWriteSerializer,
    CategorySerializer, TagSerializer, PageSerializer,
    MediaFileSerializer, UserProfileSerializer,
    CommentSerializer, CommentWriteSerializer,
    DashboardStatsSerializer
)
from .permissions import IsAuthorOrAdmin, IsOwnerOrAdmin


# ==================== PUBLIC VIEWS ====================

class PublicBlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publiczny ViewSet dla postów bloga (tylko odczyt)
    """
    serializer_class = BlogPostListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'tags', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'views_count', 'created_at']
    ordering = ['-published_at']

    def get_queryset(self):
        """Zwraca tylko opublikowane posty"""
        return BlogPost.objects.filter(
            status='published',
            published_at__lte=timezone.now()
        ).select_related('author', 'category').prefetch_related('tags')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def retrieve(self, request, *args, **kwargs):
        """Zwiększa licznik wyświetleń przy pobieraniu posta"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class PublicPageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publiczny ViewSet dla stron statycznych
    """
    serializer_class = PageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        """Zwraca tylko opublikowane strony"""
        return Page.objects.filter(is_published=True)


class PublicCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publiczny ViewSet dla kategorii
    """
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.filter(is_active=True)


class PublicTagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publiczny ViewSet dla tagów
    """
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    queryset = Tag.objects.all()


class PublicCommentViewSet(viewsets.ModelViewSet):
    """
    Publiczny ViewSet dla komentarzy
    """
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post', 'is_approved']

    def get_queryset(self):
        """Zwraca tylko zatwierdzone komentarze"""
        return Comment.objects.filter(
            is_approved=True,
            parent=None  # Tylko główne komentarze, odpowiedzi są zagnieżdżone
        ).select_related('author', 'post').order_by('-created_at')

    def get_serializer_class(self):
        if self.action in ['create']:
            return CommentWriteSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        """Automatycznie zatwierdza komentarze od zalogowanych użytkowników"""
        is_approved = self.request.user.is_authenticated
        serializer.save(is_approved=is_approved)


# ==================== ADMIN/PRIVATE VIEWS ====================

class AdminBlogPostViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet dla zarządzania postami bloga
    """
    permission_classes = [IsAuthenticated, IsAuthorOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'tags', 'author']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'published_at', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        """Zwraca wszystkie posty dla adminów, własne dla autorów"""
        user = self.request.user
        if user.is_superuser or (hasattr(user, 'profile') and user.profile.role in ['admin', 'editor']):
            return BlogPost.objects.all().select_related('author', 'category').prefetch_related('tags')
        return BlogPost.objects.filter(author=user).select_related('category').prefetch_related('tags')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BlogPostWriteSerializer
        elif self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publikuje post"""
        post = self.get_object()
        post.status = 'published'
        if not post.published_at:
            post.published_at = timezone.now()
        post.save()
        return Response({'status': 'Post opublikowany'})

    @action(detail=True, methods=['post'])
    def unpublish(self, request, pk=None):
        """Cofa publikację posta"""
        post = self.get_object()
        post.status = 'draft'
        post.save()
        return Response({'status': 'Publikacja cofnięta'})


class AdminPageViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet dla zarządzania stronami
    """
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticated]
    queryset = Page.objects.all()
    lookup_field = 'slug'

    def get_permissions(self):
        """Tylko admini i edytorzy mogą zarządzać stronami"""
        if self.request.method not in ['GET']:
            user = self.request.user
            if not (user.is_superuser or
                   (hasattr(user, 'profile') and user.profile.role in ['admin', 'editor'])):
                return [IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()


class AdminCategoryViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet dla zarządzania kategoriami
    """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()

    def get_permissions(self):
        """Tylko admini mogą zarządzać kategoriami"""
        if self.request.method not in ['GET']:
            user = self.request.user
            if not (user.is_superuser or
                   (hasattr(user, 'profile') and user.profile.role == 'admin')):
                return [IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()


class AdminTagViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet dla zarządzania tagami
    """
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    queryset = Tag.objects.all()


class MediaFileViewSet(viewsets.ModelViewSet):
    """
    ViewSet dla zarządzania plikami mediów
    """
    serializer_class = MediaFileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['file_type']
    search_fields = ['title', 'description']
    ordering = ['-created_at']

    def get_queryset(self):
        """Zwraca pliki użytkownika lub wszystkie dla adminów"""
        user = self.request.user
        if user.is_superuser or (hasattr(user, 'profile') and user.profile.role in ['admin', 'editor']):
            return MediaFile.objects.all()
        return MediaFile.objects.filter(uploaded_by=user)

    def perform_create(self, serializer):
        """Przypisuje przesyłającego użytkownika"""
        serializer.save(uploaded_by=self.request.user)


class AdminCommentViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet dla zarządzania komentarzami
    """
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post', 'is_approved', 'author']
    ordering = ['-created_at']

    def get_queryset(self):
        """Zwraca wszystkie komentarze dla adminów"""
        return Comment.objects.all().select_related('author', 'post')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Zatwierdza komentarz"""
        comment = self.get_object()
        comment.is_approved = True
        comment.save()
        return Response({'status': 'Komentarz zatwierdzony'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Odrzuca komentarz"""
        comment = self.get_object()
        comment.is_approved = False
        comment.save()
        return Response({'status': 'Komentarz odrzucony'})


# ==================== DASHBOARD VIEWS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats_view(request):
    """
    Zwraca statystyki dla dashboardu
    """
    from django.contrib.auth.models import User
    from django.db.models import Sum

    stats = {
        'total_posts': BlogPost.objects.count(),
        'published_posts': BlogPost.objects.filter(status='published').count(),
        'draft_posts': BlogPost.objects.filter(status='draft').count(),
        'total_comments': Comment.objects.count(),
        'pending_comments': Comment.objects.filter(is_approved=False).count(),
        'total_users': User.objects.count(),
        'total_media': MediaFile.objects.count(),
        'total_views': BlogPost.objects.aggregate(Sum('views_count'))['views_count__sum'] or 0
    }

    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_posts_view(request):
    """
    Zwraca ostatnie posty
    """
    posts = BlogPost.objects.all().order_by('-created_at')[:5]
    serializer = BlogPostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_comments_view(request):
    """
    Zwraca ostatnie komentarze do moderacji
    """
    comments = Comment.objects.filter(is_approved=False).order_by('-created_at')[:10]
    serializer = CommentSerializer(comments, many=True, context={'request': request})
    return Response(serializer.data)
