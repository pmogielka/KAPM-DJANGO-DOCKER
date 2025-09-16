from django.db import models
from django.contrib.auth.models import User
from core.models import BaseModel, Client


class BankruptcyCase(BaseModel):
    """Model sprawy upadłościowej"""
    CASE_TYPE_CHOICES = [
        ('consumer', 'Upadłość konsumencka'),
        ('business', 'Upadłość przedsiębiorstwa'),
        ('liquidation', 'Upadłość likwidacyjna'),
        ('arrangement', 'Upadłość układowa'),
    ]

    STATUS_CHOICES = [
        ('preparation', 'Przygotowanie wniosku'),
        ('filed', 'Wniosek złożony'),
        ('hearing', 'Rozprawa'),
        ('declared', 'Upadłość ogłoszona'),
        ('ongoing', 'W toku'),
        ('completed', 'Zakończona'),
        ('rejected', 'Oddalona'),
    ]

    case_number = models.CharField(max_length=50, unique=True, verbose_name="Numer sprawy")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='bankruptcy_cases', verbose_name="Klient")
    case_type = models.CharField(max_length=20, choices=CASE_TYPE_CHOICES, verbose_name="Typ upadłości")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='preparation', verbose_name="Status")

    court = models.CharField(max_length=200, verbose_name="Sąd")
    judge = models.CharField(max_length=100, blank=True, verbose_name="Sędzia")
    trustee = models.CharField(max_length=100, blank=True, verbose_name="Syndyk")

    filing_date = models.DateField(null=True, blank=True, verbose_name="Data złożenia wniosku")
    declaration_date = models.DateField(null=True, blank=True, verbose_name="Data ogłoszenia upadłości")
    completion_date = models.DateField(null=True, blank=True, verbose_name="Data zakończenia")

    debt_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Kwota zadłużenia")
    assets_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Wartość majątku")

    description = models.TextField(verbose_name="Opis sprawy")
    notes = models.TextField(blank=True, verbose_name="Notatki wewnętrzne")

    assigned_lawyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='bankruptcy_cases', verbose_name="Przydzielony prawnik")

    class Meta:
        verbose_name = "Sprawa upadłościowa"
        verbose_name_plural = "Sprawy upadłościowe"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.case_number} - {self.client.name}"


class Creditor(BaseModel):
    """Model wierzyciela"""
    bankruptcy_case = models.ForeignKey(BankruptcyCase, on_delete=models.CASCADE, related_name='creditors', verbose_name="Sprawa upadłościowa")
    name = models.CharField(max_length=200, verbose_name="Nazwa wierzyciela")
    creditor_type = models.CharField(max_length=50, choices=[
        ('bank', 'Bank'),
        ('tax_office', 'Urząd Skarbowy'),
        ('zus', 'ZUS'),
        ('supplier', 'Dostawca'),
        ('employee', 'Pracownik'),
        ('other', 'Inny'),
    ], verbose_name="Typ wierzyciela")

    claim_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Kwota wierzytelności")
    claim_category = models.IntegerField(choices=[
        (1, 'Kategoria pierwsza'),
        (2, 'Kategoria druga'),
        (3, 'Kategoria trzecia'),
        (4, 'Kategoria czwarta'),
    ], verbose_name="Kategoria wierzytelności")

    is_secured = models.BooleanField(default=False, verbose_name="Zabezpieczona")
    security_description = models.TextField(blank=True, verbose_name="Opis zabezpieczenia")

    contact_person = models.CharField(max_length=100, blank=True, verbose_name="Osoba kontaktowa")
    contact_email = models.EmailField(blank=True, verbose_name="Email kontaktowy")
    contact_phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon kontaktowy")

    class Meta:
        verbose_name = "Wierzyciel"
        verbose_name_plural = "Wierzyciele"
        ordering = ['claim_category', '-claim_amount']

    def __str__(self):
        return f"{self.name} - {self.claim_amount} PLN"


class BankruptcyEvent(BaseModel):
    """Model wydarzenia w sprawie upadłościowej"""
    EVENT_TYPE_CHOICES = [
        ('filing', 'Złożenie wniosku'),
        ('hearing', 'Rozprawa'),
        ('decision', 'Postanowienie'),
        ('creditors_meeting', 'Zgromadzenie wierzycieli'),
        ('asset_sale', 'Sprzedaż majątku'),
        ('distribution', 'Podział środków'),
        ('report', 'Sprawozdanie'),
        ('other', 'Inne'),
    ]

    bankruptcy_case = models.ForeignKey(BankruptcyCase, on_delete=models.CASCADE, related_name='events', verbose_name="Sprawa upadłościowa")
    event_type = models.CharField(max_length=30, choices=EVENT_TYPE_CHOICES, verbose_name="Typ wydarzenia")
    event_date = models.DateTimeField(verbose_name="Data wydarzenia")
    title = models.CharField(max_length=200, verbose_name="Tytuł")
    description = models.TextField(verbose_name="Opis")

    is_public = models.BooleanField(default=False, verbose_name="Publiczne")
    reminder_date = models.DateTimeField(null=True, blank=True, verbose_name="Data przypomnienia")

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="Utworzone przez")

    class Meta:
        verbose_name = "Wydarzenie"
        verbose_name_plural = "Wydarzenia"
        ordering = ['-event_date']

    def __str__(self):
        return f"{self.event_date.strftime('%Y-%m-%d')} - {self.title}"


class ConsumerBankruptcy(BaseModel):
    """Model szczegółów upadłości konsumenckiej"""
    bankruptcy_case = models.OneToOneField(BankruptcyCase, on_delete=models.CASCADE, related_name='consumer_details', verbose_name="Sprawa upadłościowa")

    monthly_income = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Miesięczny dochód")
    family_size = models.IntegerField(verbose_name="Liczba osób w rodzinie")
    has_real_estate = models.BooleanField(default=False, verbose_name="Posiada nieruchomości")

    repayment_plan_duration = models.IntegerField(null=True, blank=True, verbose_name="Okres planu spłaty (miesiące)")
    repayment_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="Procent spłaty")

    reason_for_debt = models.TextField(verbose_name="Przyczyna zadłużenia")
    previous_bankruptcy = models.BooleanField(default=False, verbose_name="Poprzednia upadłość")
    previous_bankruptcy_date = models.DateField(null=True, blank=True, verbose_name="Data poprzedniej upadłości")

    class Meta:
        verbose_name = "Upadłość konsumencka - szczegóły"
        verbose_name_plural = "Upadłości konsumenckie - szczegóły"

    def __str__(self):
        return f"Szczegóły konsumenckie - {self.bankruptcy_case.case_number}"