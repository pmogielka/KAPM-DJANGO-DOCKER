from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # Auth endpoints
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),

    # User endpoints
    path('me/', views.me_view, name='me'),
    path('profile/', views.update_profile_view, name='update_profile'),
    path('change-password/', views.change_password_view, name='change_password'),
]