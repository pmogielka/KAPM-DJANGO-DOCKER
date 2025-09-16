from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login endpoint - zwraca JWT tokens
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Proszę podać nazwę użytkownika i hasło'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is not None and user.is_active:
        # Generuj tokeny JWT
        refresh = RefreshToken.for_user(user)

        # Pobierz profil użytkownika jeśli istnieje
        profile_data = {}
        if hasattr(user, 'profile'):
            profile = user.profile
            profile_data = {
                'role': profile.role,
                'avatar': profile.avatar.url if profile.avatar else None,
                'bio': profile.bio,
                'language': profile.language,
                'dark_mode': profile.dark_mode,
            }

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                **profile_data
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Nieprawidłowa nazwa użytkownika lub hasło'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Rejestracja nowego użytkownika
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    password2 = request.data.get('password2')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    # Walidacja
    if not username or not email or not password:
        return Response(
            {'error': 'Wszystkie pola są wymagane'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if password != password2:
        return Response(
            {'error': 'Hasła nie są identyczne'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Użytkownik o tej nazwie już istnieje'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Ten email jest już używany'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Tworzenie użytkownika
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    # Tworzenie profilu użytkownika
    from cms.models import UserProfile
    UserProfile.objects.create(
        user=user,
        role='viewer'  # Domyślna rola
    )

    # Generuj tokeny
    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout - blacklistuje refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Wylogowano pomyślnie'}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Refresh token jest wymagany'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except TokenError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Zwraca dane zalogowanego użytkownika
    """
    user = request.user

    # Pobierz profil użytkownika
    profile_data = {}
    if hasattr(user, 'profile'):
        profile = user.profile
        profile_data = {
            'role': profile.role,
            'avatar': profile.avatar.url if profile.avatar else None,
            'bio': profile.bio,
            'phone': profile.phone,
            'language': profile.language,
            'dark_mode': profile.dark_mode,
            'receive_notifications': profile.receive_notifications,
        }

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'date_joined': user.date_joined,
        'last_login': user.last_login,
        **profile_data
    })


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """
    Aktualizacja profilu użytkownika
    """
    user = request.user

    # Aktualizuj podstawowe dane użytkownika
    if 'first_name' in request.data:
        user.first_name = request.data['first_name']
    if 'last_name' in request.data:
        user.last_name = request.data['last_name']
    if 'email' in request.data:
        # Sprawdź czy email nie jest zajęty
        if User.objects.exclude(pk=user.pk).filter(email=request.data['email']).exists():
            return Response(
                {'error': 'Ten email jest już używany'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.email = request.data['email']

    user.save()

    # Aktualizuj profil
    if hasattr(user, 'profile'):
        profile = user.profile

        if 'bio' in request.data:
            profile.bio = request.data['bio']
        if 'phone' in request.data:
            profile.phone = request.data['phone']
        if 'language' in request.data:
            profile.language = request.data['language']
        if 'dark_mode' in request.data:
            profile.dark_mode = request.data['dark_mode']
        if 'receive_notifications' in request.data:
            profile.receive_notifications = request.data['receive_notifications']

        # Obsługa avatara wymaga dodatkowej logiki dla plików
        # if 'avatar' in request.FILES:
        #     profile.avatar = request.FILES['avatar']

        profile.save()

    return Response({'message': 'Profil zaktualizowany pomyślnie'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Zmiana hasła użytkownika
    """
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    new_password2 = request.data.get('new_password2')

    if not old_password or not new_password:
        return Response(
            {'error': 'Wszystkie pola są wymagane'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if new_password != new_password2:
        return Response(
            {'error': 'Nowe hasła nie są identyczne'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(old_password):
        return Response(
            {'error': 'Aktualne hasło jest nieprawidłowe'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    # Generuj nowe tokeny po zmianie hasła
    refresh = RefreshToken.for_user(user)

    return Response({
        'message': 'Hasło zmienione pomyślnie',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


# Rozszerzenie TokenRefreshView o dodatkowe dane
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Jeśli refresh się powiódł, dodaj dane użytkownika
        if response.status_code == 200:
            # Pobierz user_id z tokenu
            refresh_token = request.data.get('refresh')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    user_id = token.payload.get('user_id')
                    if user_id:
                        user = User.objects.get(pk=user_id)
                        response.data['user'] = {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                        }
                except (User.DoesNotExist, TokenError):
                    pass

        return response
