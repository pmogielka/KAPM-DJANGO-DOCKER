from django.db import models
from django.contrib.auth.models import User


class BaseModel(models.Model):
    """Model bazowy z polami czasowymi"""
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data utworzenia")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Data modyfikacji")

    class Meta:
        abstract = True


class Client(BaseModel):
    """Model klienta"""
    CLIENT_TYPE_CHOICES = [
        ('individual', 'Osoba fizyczna'),
        ('company', 'Przedsiębiorstwo'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, verbose_name="Nazwa/Imię i nazwisko")
    client_type = models.CharField(max_length=20, choices=CLIENT_TYPE_CHOICES, verbose_name="Typ klienta")
    nip = models.CharField(max_length=20, blank=True, verbose_name="NIP")
    regon = models.CharField(max_length=20, blank=True, verbose_name="REGON")
    krs = models.CharField(max_length=20, blank=True, verbose_name="KRS")
    pesel = models.CharField(max_length=11, blank=True, verbose_name="PESEL")

    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Telefon")

    address = models.CharField(max_length=200, verbose_name="Adres")
    city = models.CharField(max_length=100, verbose_name="Miasto")
    postal_code = models.CharField(max_length=10, verbose_name="Kod pocztowy")

    notes = models.TextField(blank=True, verbose_name="Notatki")
    is_active = models.BooleanField(default=True, verbose_name="Aktywny")

    class Meta:
        verbose_name = "Klient"
        verbose_name_plural = "Klienci"
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Document(BaseModel):
    """Model dokumentu"""
    DOCUMENT_TYPE_CHOICES = [
        ('court_decision', 'Postanowienie sądu'),
        ('application', 'Wniosek'),
        ('financial_report', 'Sprawozdanie finansowe'),
        ('contract', 'Umowa'),
        ('other', 'Inne'),
    ]

    title = models.CharField(max_length=200, verbose_name="Tytuł")
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES, verbose_name="Typ dokumentu")
    file = models.FileField(upload_to='documents/%Y/%m/', verbose_name="Plik")
    description = models.TextField(blank=True, verbose_name="Opis")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='documents', verbose_name="Klient")
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="Przesłane przez")

    class Meta:
        verbose_name = "Dokument"
        verbose_name_plural = "Dokumenty"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.client.name}"


class NewsItem(BaseModel):
    """Model aktualności"""
    title = models.CharField(max_length=200, verbose_name="Tytuł")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    excerpt = models.TextField(max_length=500, verbose_name="Zajawka")
    content = models.TextField(verbose_name="Treść")
    image = models.ImageField(upload_to='news/%Y/%m/', blank=True, verbose_name="Obraz")
    is_published = models.BooleanField(default=False, verbose_name="Opublikowany")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Data publikacji")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="Autor")

    category = models.CharField(max_length=50, choices=[
        ('bankruptcy', 'Upadłość'),
        ('restructuring', 'Restrukturyzacja'),
        ('law_changes', 'Zmiany w prawie'),
        ('court_rulings', 'Orzecznictwo'),
        ('analysis', 'Analizy'),
    ], verbose_name="Kategoria")

    class Meta:
        verbose_name = "Aktualność"
        verbose_name_plural = "Aktualności"
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title


class TeamMember(BaseModel):
    """Model członka zespołu"""
    POSITION_CHOICES = [
        ('partner', 'Partner'),
        ('lawyer', 'Radca prawny'),
        ('attorney', 'Adwokat'),
        ('advisor', 'Doradca restrukturyzacyjny'),
        ('specialist', 'Specjalista'),
    ]

    name = models.CharField(max_length=100, verbose_name="Imię i nazwisko")
    position = models.CharField(max_length=50, choices=POSITION_CHOICES, verbose_name="Stanowisko")
    bio = models.TextField(verbose_name="Biografia")
    specializations = models.TextField(verbose_name="Specjalizacje")
    photo = models.ImageField(upload_to='team/', blank=True, verbose_name="Zdjęcie")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon")
    linkedin = models.URLField(blank=True, verbose_name="LinkedIn")
    order = models.IntegerField(default=0, verbose_name="Kolejność wyświetlania")
    is_active = models.BooleanField(default=True, verbose_name="Aktywny")

    class Meta:
        verbose_name = "Członek zespołu"
        verbose_name_plural = "Członkowie zespołu"
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} - {self.get_position_display()}"
