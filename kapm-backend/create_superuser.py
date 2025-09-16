import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from cms.models import UserProfile

# Tworzenie superusera
u, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@kapm.pl',
        'is_staff': True,
        'is_superuser': True,
        'first_name': 'Administrator',
        'last_name': 'Systemu'
    }
)

if created:
    u.set_password('admin123')
    u.save()
    print('✅ Superuser "admin" utworzony z hasłem "admin123"')
else:
    print('ℹ️ Superuser "admin" już istnieje')

# Tworzenie profilu użytkownika
profile, profile_created = UserProfile.objects.get_or_create(
    user=u,
    defaults={'role': 'admin'}
)

if profile_created:
    print('✅ Profil użytkownika utworzony')
else:
    print('ℹ️ Profil użytkownika już istnieje')

# Tworzenie przykładowych kategorii
from cms.models import Category, Tag, Page

categories = [
    ('Aktualności', 'aktualnosci', 'Najnowsze informacje z branży'),
    ('Upadłość', 'upadlosc', 'Informacje o postępowaniach upadłościowych'),
    ('Restrukturyzacja', 'restrukturyzacja', 'Informacje o restrukturyzacji'),
    ('Prawo', 'prawo', 'Zmiany w prawie i orzecznictwo'),
]

for name, slug, desc in categories:
    cat, created = Category.objects.get_or_create(
        slug=slug,
        defaults={'name': name, 'description': desc}
    )
    if created:
        print(f'✅ Kategoria "{name}" utworzona')

# Tworzenie przykładowych tagów
tags = ['upadłość', 'restrukturyzacja', 'KSH', 'prawo upadłościowe', 'syndyk', 'wierzyciel']
for tag_name in tags:
    tag, created = Tag.objects.get_or_create(name=tag_name)
    if created:
        print(f'✅ Tag "{tag_name}" utworzony')

# Tworzenie przykładowej strony "O nas"
page, created = Page.objects.get_or_create(
    slug='o-nas',
    defaults={
        'title': 'O nas',
        'content': '<p>Jesteśmy wiodącą kancelarią specjalizującą się w prawie upadłościowym i restrukturyzacyjnym.</p>',
        'template': 'about',
        'is_published': True,
        'show_in_menu': True,
        'menu_order': 1
    }
)
if created:
    print('✅ Strona "O nas" utworzona')

print('\n🚀 Setup zakończony! Możesz teraz zalogować się do panelu admina:')
print('   URL: http://localhost:8003/admin/')
print('   Login: admin')
print('   Hasło: admin123')