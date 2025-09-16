from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    BlogPost, Category, Tag, Page, MediaFile,
    UserProfile, Comment
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer dla User"""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer dla UserProfile"""
    user = UserSerializer(read_only=True)
    full_name = serializers.ReadOnlyField(source='full_name')

    class Meta:
        model = UserProfile
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    """Serializer dla Category"""
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    """Serializer dla Tag"""
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = '__all__'

    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer dla listy postów bloga"""
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    is_published = serializers.ReadOnlyField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'status', 'published_at', 'author', 'category', 'tags',
            'views_count', 'is_featured', 'is_published', 'created_at'
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Serializer dla szczegółów posta bloga"""
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    is_published = serializers.ReadOnlyField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = '__all__'

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class BlogPostWriteSerializer(serializers.ModelSerializer):
    """Serializer do tworzenia/edycji postów bloga"""
    author = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    tags = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        required=False
    )

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ['slug', 'views_count']


class PageSerializer(serializers.ModelSerializer):
    """Serializer dla Page"""
    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ['slug']


class MediaFileSerializer(serializers.ModelSerializer):
    """Serializer dla MediaFile"""
    uploaded_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaFile
        fields = '__all__'
        read_only_fields = ['file_size', 'file_type', 'uploaded_by']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class CommentSerializer(serializers.ModelSerializer):
    """Serializer dla Comment"""
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['author', 'is_approved']

    def get_replies(self, obj):
        if obj.parent is None:
            # Tylko dla komentarzy głównych zwracamy odpowiedzi
            replies = obj.replies.filter(is_approved=True)
            return CommentSerializer(replies, many=True, context=self.context).data
        return []


class CommentWriteSerializer(serializers.ModelSerializer):
    """Serializer do tworzenia komentarzy"""
    class Meta:
        model = Comment
        fields = ['post', 'content', 'parent', 'author_name', 'author_email']

    def validate(self, data):
        # Jeśli użytkownik jest zalogowany, używamy jego danych
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            data['author'] = request.user
            data['author_name'] = request.user.get_full_name() or request.user.username
            data['author_email'] = request.user.email
        else:
            # Dla niezalogowanych wymagamy imienia i emaila
            if not data.get('author_name') or not data.get('author_email'):
                raise serializers.ValidationError(
                    "Imię i email są wymagane dla niezalogowanych użytkowników"
                )
        return data


# Dashboard Serializers
class DashboardStatsSerializer(serializers.Serializer):
    """Serializer dla statystyk dashboardu"""
    total_posts = serializers.IntegerField()
    published_posts = serializers.IntegerField()
    draft_posts = serializers.IntegerField()
    total_comments = serializers.IntegerField()
    pending_comments = serializers.IntegerField()
    total_users = serializers.IntegerField()
    total_media = serializers.IntegerField()
    total_views = serializers.IntegerField()