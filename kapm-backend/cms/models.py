from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.utils import timezone


class BaseModel(models.Model):
    """Model bazowy z polami czasowymi"""
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data utworzenia")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Data modyfikacji")

    class Meta:
        abstract = True


class Category(BaseModel):
    """Kategoria dla postów bloga"""
    name = models.CharField(max_length=100, unique=True, verbose_name="Nazwa")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Opis")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE,
                              related_name='children', verbose_name="Kategoria nadrzędna")
    is_active = models.BooleanField(default=True, verbose_name="Aktywna")

    class Meta:
        verbose_name = "Kategoria"
        verbose_name_plural = "Kategorie"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(BaseModel):
    """Tag dla postów bloga"""
    name = models.CharField(max_length=50, unique=True, verbose_name="Nazwa")
    slug = models.SlugField(max_length=50, unique=True, verbose_name="Slug")

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tagi"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(BaseModel):
    """Model posta blogowego"""
    STATUS_CHOICES = [
        ('draft', 'Szkic'),
        ('published', 'Opublikowany'),
        ('archived', 'Zarchiwizowany'),
    ]

    title = models.CharField(max_length=200, verbose_name="Tytuł")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    excerpt = models.TextField(max_length=500, blank=True, verbose_name="Zajawka")
    content = models.TextField(verbose_name="Treść")
    featured_image = models.ImageField(upload_to='blog/%Y/%m/', blank=True, null=True,
                                      verbose_name="Obraz wyróżniający")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft',
                             verbose_name="Status")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Data publikacji")

    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                              related_name='blog_posts', verbose_name="Autor")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='posts', verbose_name="Kategoria")
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts', verbose_name="Tagi")

    views_count = models.PositiveIntegerField(default=0, verbose_name="Liczba wyświetleń")
    is_featured = models.BooleanField(default=False, verbose_name="Wyróżniony")
    allow_comments = models.BooleanField(default=True, verbose_name="Zezwól na komentarze")

    # SEO fields
    meta_title = models.CharField(max_length=60, blank=True, verbose_name="Meta tytuł")
    meta_description = models.CharField(max_length=160, blank=True, verbose_name="Meta opis")
    meta_keywords = models.CharField(max_length=255, blank=True, verbose_name="Meta słowa kluczowe")

    class Meta:
        verbose_name = "Post blogowy"
        verbose_name_plural = "Posty blogowe"
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        # Automatycznie ustaw datę publikacji przy pierwszej publikacji
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()

        # Automatyczne SEO jeśli nie wypełnione
        if not self.meta_title:
            self.meta_title = self.title[:60]
        if not self.meta_description:
            self.meta_description = self.excerpt[:160] if self.excerpt else self.content[:160]

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def is_published(self):
        return self.status == 'published' and self.published_at and self.published_at <= timezone.now()


class Page(BaseModel):
    """Model dla statycznych stron"""
    TEMPLATE_CHOICES = [
        ('default', 'Domyślny'),
        ('landing', 'Landing Page'),
        ('contact', 'Kontakt'),
        ('about', 'O nas'),
        ('services', 'Usługi'),
    ]

    title = models.CharField(max_length=200, verbose_name="Tytuł")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    content = models.TextField(verbose_name="Treść")
    template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, default='default',
                               verbose_name="Szablon")

    is_published = models.BooleanField(default=False, verbose_name="Opublikowana")
    show_in_menu = models.BooleanField(default=False, verbose_name="Pokaż w menu")
    menu_order = models.IntegerField(default=0, verbose_name="Kolejność w menu")

    # SEO fields
    meta_title = models.CharField(max_length=60, blank=True, verbose_name="Meta tytuł")
    meta_description = models.CharField(max_length=160, blank=True, verbose_name="Meta opis")
    meta_keywords = models.CharField(max_length=255, blank=True, verbose_name="Meta słowa kluczowe")

    class Meta:
        verbose_name = "Strona"
        verbose_name_plural = "Strony"
        ordering = ['menu_order', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title[:60]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class MediaFile(BaseModel):
    """Model dla plików mediów"""
    FILE_TYPE_CHOICES = [
        ('image', 'Obraz'),
        ('document', 'Dokument'),
        ('video', 'Wideo'),
        ('other', 'Inne'),
    ]

    file = models.FileField(upload_to='media/%Y/%m/', verbose_name="Plik")
    title = models.CharField(max_length=200, verbose_name="Tytuł")
    alt_text = models.CharField(max_length=200, blank=True, verbose_name="Tekst alternatywny")
    description = models.TextField(blank=True, verbose_name="Opis")
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES, default='other',
                                verbose_name="Typ pliku")
    file_size = models.PositiveIntegerField(default=0, verbose_name="Rozmiar pliku (bytes)")

    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                   related_name='uploaded_files', verbose_name="Przesłane przez")

    class Meta:
        verbose_name = "Plik mediów"
        verbose_name_plural = "Pliki mediów"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
            # Określ typ pliku na podstawie rozszerzenia
            ext = self.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']:
                self.file_type = 'image'
            elif ext in ['pdf', 'doc', 'docx', 'xls', 'xlsx']:
                self.file_type = 'document'
            elif ext in ['mp4', 'avi', 'mov', 'webm']:
                self.file_type = 'video'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class UserProfile(BaseModel):
    """Rozszerzony profil użytkownika"""
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('editor', 'Edytor'),
        ('author', 'Autor'),
        ('viewer', 'Przeglądający'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile',
                               verbose_name="Użytkownik")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name="Avatar")
    bio = models.TextField(blank=True, verbose_name="Bio")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer',
                          verbose_name="Rola")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon")

    # Preferencje
    receive_notifications = models.BooleanField(default=True, verbose_name="Otrzymuj powiadomienia")
    dark_mode = models.BooleanField(default=False, verbose_name="Tryb ciemny")
    language = models.CharField(max_length=5, default='pl', verbose_name="Język")

    class Meta:
        verbose_name = "Profil użytkownika"
        verbose_name_plural = "Profile użytkowników"

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username


class Comment(BaseModel):
    """Model komentarzy do postów"""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments',
                            verbose_name="Post")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                             related_name='comments', verbose_name="Autor")
    author_name = models.CharField(max_length=100, blank=True, verbose_name="Imię autora")
    author_email = models.EmailField(blank=True, verbose_name="Email autora")
    content = models.TextField(verbose_name="Treść")
    is_approved = models.BooleanField(default=False, verbose_name="Zatwierdzony")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE,
                             related_name='replies', verbose_name="Odpowiedź na")

    class Meta:
        verbose_name = "Komentarz"
        verbose_name_plural = "Komentarze"
        ordering = ['-created_at']

    def __str__(self):
        return f"Komentarz do {self.post.title} przez {self.author_name or self.author.username}"
