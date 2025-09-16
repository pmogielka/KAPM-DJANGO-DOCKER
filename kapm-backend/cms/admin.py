from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import (
    BlogPost, Category, Tag, Page, MediaFile,
    UserProfile, Comment
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'is_active', 'posts_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']

    def posts_count(self, obj):
        return obj.posts.count()
    posts_count.short_description = 'Liczba postów'


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'posts_count', 'created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']

    def posts_count(self, obj):
        return obj.posts.count()
    posts_count.short_description = 'Liczba postów'


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    fields = ['author', 'author_name', 'content', 'is_approved', 'created_at']
    readonly_fields = ['created_at']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status_badge', 'is_featured',
                   'views_count', 'published_at', 'created_at']
    list_filter = ['status', 'is_featured', 'category', 'tags', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'excerpt']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    inlines = [CommentInline]

    fieldsets = (
        ('Podstawowe informacje', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Kategoria i tagi', {
            'fields': ('category', 'tags')
        }),
        ('Status i publikacja', {
            'fields': ('status', 'published_at', 'is_featured', 'allow_comments')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Informacje systemowe', {
            'fields': ('author', 'views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['views_count', 'created_at', 'updated_at']

    def status_badge(self, obj):
        colors = {
            'draft': 'orange',
            'published': 'green',
            'archived': 'red'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def save_model(self, request, obj, form, change):
        if not change:  # Nowy obiekt
            obj.author = request.user
        if obj.status == 'published' and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)

    actions = ['make_published', 'make_draft', 'make_featured']

    def make_published(self, request, queryset):
        updated = queryset.update(status='published', published_at=timezone.now())
        self.message_user(request, f'{updated} postów zostało opublikowanych.')
    make_published.short_description = 'Opublikuj zaznaczone posty'

    def make_draft(self, request, queryset):
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} postów zostało przeniesionych do szkiców.')
    make_draft.short_description = 'Przenieś do szkiców'

    def make_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} postów zostało wyróżnionych.')
    make_featured.short_description = 'Wyróżnij posty'


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'template', 'is_published', 'show_in_menu',
                   'menu_order', 'created_at']
    list_filter = ['is_published', 'show_in_menu', 'template', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['menu_order', 'title']

    fieldsets = (
        ('Podstawowe informacje', {
            'fields': ('title', 'slug', 'content', 'template')
        }),
        ('Opcje wyświetlania', {
            'fields': ('is_published', 'show_in_menu', 'menu_order')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )

    actions = ['publish_pages', 'unpublish_pages']

    def publish_pages(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f'{updated} stron zostało opublikowanych.')
    publish_pages.short_description = 'Opublikuj strony'

    def unpublish_pages(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f'{updated} stron zostało ukrytych.')
    unpublish_pages.short_description = 'Ukryj strony'


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'file_type', 'file_size_human', 'uploaded_by', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['title', 'description', 'alt_text']
    readonly_fields = ['file_type', 'file_size', 'uploaded_by', 'created_at']
    ordering = ['-created_at']

    def file_size_human(self, obj):
        size = obj.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    file_size_human.short_description = 'Rozmiar'

    def save_model(self, request, obj, form, change):
        if not change:  # Nowy obiekt
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'role', 'phone', 'receive_notifications', 'created_at']
    list_filter = ['role', 'receive_notifications', 'dark_mode', 'language']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    ordering = ['-created_at']

    fieldsets = (
        ('Użytkownik', {
            'fields': ('user', 'avatar', 'bio', 'role')
        }),
        ('Dane kontaktowe', {
            'fields': ('phone',)
        }),
        ('Preferencje', {
            'fields': ('receive_notifications', 'dark_mode', 'language')
        }),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author_display', 'content_preview', 'is_approved',
                   'parent', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['content', 'author__username', 'author_name', 'author_email']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    def author_display(self, obj):
        if obj.author:
            return obj.author.username
        return f"{obj.author_name} ({obj.author_email})"
    author_display.short_description = 'Autor'

    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Treść'

    actions = ['approve_comments', 'reject_comments']

    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} komentarzy zostało zatwierdzonych.')
    approve_comments.short_description = 'Zatwierdź komentarze'

    def reject_comments(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} komentarzy zostało odrzuconych.')
    reject_comments.short_description = 'Odrzuć komentarze'


# Customizacja panelu admina
admin.site.site_header = "KAPM CMS - Panel Administracyjny"
admin.site.site_title = "KAPM CMS Admin"
admin.site.index_title = "Zarządzanie treścią"
