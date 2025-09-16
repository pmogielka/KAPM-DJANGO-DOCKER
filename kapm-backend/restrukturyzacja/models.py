from django.db import models
from django.contrib.auth.models import User
from core.models import BaseModel, Client


class RestructuringCase(BaseModel):
    """Model sprawy restrukturyzacyjnej"""
    PROCEEDING_TYPE_CHOICES = [
        ('arrangement_approval', 'Postępowanie o zatwierdzenie układu'),
        ('accelerated_arrangement', 'Przyspieszone postępowanie układowe'),
        ('arrangement', 'Postępowanie układowe'),
        ('sanation', 'Postępowanie sanacyjne'),
    ]

    STATUS_CHOICES = [
        ('preparation', 'Przygotowanie'),
        ('filed', 'Wniosek złożony'),
        ('opened', 'Postępowanie otwarte'),
        ('arrangement_proposed', 'Propozycja układowa'),
        ('voting', 'Głosowanie'),
        ('arrangement_accepted', 'Układ przyjęty'),
        ('arrangement_approved', 'Układ zatwierdzony'),
        ('execution', 'Wykonanie układu'),
        ('completed', 'Zakończone'),
        ('discontinued', 'Umorzone'),
    ]

    case_number = models.CharField(max_length=50, unique=True, verbose_name="Numer sprawy")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='restructuring_cases', verbose_name="Klient")
    proceeding_type = models.CharField(max_length=30, choices=PROCEEDING_TYPE_CHOICES, verbose_name="Rodzaj postępowania")
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='preparation', verbose_name="Status")

    court = models.CharField(max_length=200, verbose_name="Sąd")
    judge_commissioner = models.CharField(max_length=100, blank=True, verbose_name="Sędzia-komisarz")
    court_supervisor = models.CharField(max_length=100, blank=True, verbose_name="Nadzorca sądowy")
    restructuring_advisor = models.CharField(max_length=100, blank=True, verbose_name="Doradca restrukturyzacyjny")

    filing_date = models.DateField(null=True, blank=True, verbose_name="Data złożenia wniosku")
    opening_date = models.DateField(null=True, blank=True, verbose_name="Data otwarcia postępowania")
    arrangement_date = models.DateField(null=True, blank=True, verbose_name="Data zatwierdzenia układu")
    completion_date = models.DateField(null=True, blank=True, verbose_name="Data zakończenia")

    total_debt = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Całkowite zadłużenie")
    restructured_debt = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Zadłużenie objęte układem")

    description = models.TextField(verbose_name="Opis sprawy")
    restructuring_plan = models.TextField(blank=True, verbose_name="Plan restrukturyzacji")
    notes = models.TextField(blank=True, verbose_name="Notatki wewnętrzne")

    assigned_lawyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='restructuring_cases', verbose_name="Przydzielony prawnik")

    class Meta:
        verbose_name = "Sprawa restrukturyzacyjna"
        verbose_name_plural = "Sprawy restrukturyzacyjne"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.case_number} - {self.client.name}"


class ArrangementProposal(BaseModel):
    """Model propozycji układowej"""
    restructuring_case = models.ForeignKey(RestructuringCase, on_delete=models.CASCADE, related_name='proposals', verbose_name="Sprawa restrukturyzacyjna")
    version = models.IntegerField(default=1, verbose_name="Wersja propozycji")

    reduction_percentage = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Procent redukcji")
    payment_installments = models.IntegerField(verbose_name="Liczba rat")
    payment_period_months = models.IntegerField(verbose_name="Okres spłaty (miesiące)")

    grace_period_months = models.IntegerField(default=0, verbose_name="Okres karencji (miesiące)")
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Oprocentowanie")

    special_conditions = models.TextField(blank=True, verbose_name="Warunki szczególne")
    creditor_groups = models.TextField(verbose_name="Grupy wierzycieli")

    is_active = models.BooleanField(default=True, verbose_name="Aktywna")
    submission_date = models.DateField(null=True, blank=True, verbose_name="Data złożenia")

    class Meta:
        verbose_name = "Propozycja układowa"
        verbose_name_plural = "Propozycje układowe"
        ordering = ['-version']

    def __str__(self):
        return f"Propozycja v{self.version} - {self.restructuring_case.case_number}"


class RestructuringCreditor(BaseModel):
    """Model wierzyciela w postępowaniu restrukturyzacyjnym"""
    restructuring_case = models.ForeignKey(RestructuringCase, on_delete=models.CASCADE, related_name='creditors', verbose_name="Sprawa restrukturyzacyjna")
    name = models.CharField(max_length=200, verbose_name="Nazwa wierzyciela")

    creditor_group = models.IntegerField(choices=[
        (1, 'Grupa I - Pracownicy'),
        (2, 'Grupa II - ZUS i Urząd Skarbowy'),
        (3, 'Grupa III - Zabezpieczeni'),
        (4, 'Grupa IV - Pozostali'),
        (5, 'Grupa V - Powiązani'),
    ], verbose_name="Grupa wierzycieli")

    original_claim = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Pierwotna wierzytelność")
    verified_claim = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Wierzytelność po weryfikacji")
    restructured_claim = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Wierzytelność po układzie")

    voting_power = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="Siła głosu (%)")
    vote_cast = models.CharField(max_length=10, choices=[
        ('for', 'Za'),
        ('against', 'Przeciw'),
        ('abstain', 'Wstrzymał się'),
        ('not_voted', 'Nie głosował'),
    ], default='not_voted', verbose_name="Głos")

    is_disputed = models.BooleanField(default=False, verbose_name="Sporna")
    dispute_description = models.TextField(blank=True, verbose_name="Opis sporu")

    contact_person = models.CharField(max_length=100, blank=True, verbose_name="Osoba kontaktowa")
    contact_email = models.EmailField(blank=True, verbose_name="Email")
    contact_phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon")

    class Meta:
        verbose_name = "Wierzyciel restrukturyzacyjny"
        verbose_name_plural = "Wierzyciele restrukturyzacyjni"
        ordering = ['creditor_group', '-original_claim']

    def __str__(self):
        return f"{self.name} - Grupa {self.creditor_group}"


class RestructuringEvent(BaseModel):
    """Model wydarzenia w postępowaniu restrukturyzacyjnym"""
    EVENT_TYPE_CHOICES = [
        ('filing', 'Złożenie wniosku'),
        ('opening', 'Otwarcie postępowania'),
        ('creditors_list', 'Złożenie spisu wierzytelności'),
        ('arrangement_proposal', 'Złożenie propozycji układowej'),
        ('creditors_meeting', 'Zgromadzenie wierzycieli'),
        ('voting', 'Głosowanie'),
        ('court_hearing', 'Rozprawa'),
        ('arrangement_approval', 'Zatwierdzenie układu'),
        ('report', 'Sprawozdanie'),
        ('payment', 'Płatność'),
        ('other', 'Inne'),
    ]

    restructuring_case = models.ForeignKey(RestructuringCase, on_delete=models.CASCADE, related_name='events', verbose_name="Sprawa restrukturyzacyjna")
    event_type = models.CharField(max_length=30, choices=EVENT_TYPE_CHOICES, verbose_name="Typ wydarzenia")
    event_date = models.DateTimeField(verbose_name="Data wydarzenia")
    title = models.CharField(max_length=200, verbose_name="Tytuł")
    description = models.TextField(verbose_name="Opis")

    is_public = models.BooleanField(default=False, verbose_name="Publiczne")
    is_mandatory = models.BooleanField(default=False, verbose_name="Obowiązkowe")
    reminder_date = models.DateTimeField(null=True, blank=True, verbose_name="Data przypomnienia")

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="Utworzone przez")

    class Meta:
        verbose_name = "Wydarzenie restrukturyzacyjne"
        verbose_name_plural = "Wydarzenia restrukturyzacyjne"
        ordering = ['-event_date']

    def __str__(self):
        return f"{self.event_date.strftime('%Y-%m-%d')} - {self.title}"


class ArrangementPayment(BaseModel):
    """Model płatności układowej"""
    restructuring_case = models.ForeignKey(RestructuringCase, on_delete=models.CASCADE, related_name='payments', verbose_name="Sprawa restrukturyzacyjna")
    installment_number = models.IntegerField(verbose_name="Numer raty")
    due_date = models.DateField(verbose_name="Termin płatności")
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Kwota")

    is_paid = models.BooleanField(default=False, verbose_name="Zapłacona")
    payment_date = models.DateField(null=True, blank=True, verbose_name="Data zapłaty")
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Zapłacona kwota")

    notes = models.TextField(blank=True, verbose_name="Uwagi")

    class Meta:
        verbose_name = "Płatność układowa"
        verbose_name_plural = "Płatności układowe"
        ordering = ['due_date', 'installment_number']
        unique_together = ['restructuring_case', 'installment_number']

    def __str__(self):
        return f"Rata {self.installment_number} - {self.amount} PLN - {self.due_date}"