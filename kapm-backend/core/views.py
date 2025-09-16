from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response


def home_view(request):
    """Widok strony głównej z informacjami o API"""
    api_info = {
        'name': 'KAPM API',
        'version': '1.0.0',
        'description': 'API dla systemu zarządzania treścią KAPM',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'blog': '/api/blog/',
            'services': '/api/services/',
            'team': '/api/team/',
            'contact': '/api/contact/',
        },
        'documentation': {
            'admin_panel': 'http://localhost:8003/admin/',
            'api_root': 'http://localhost:8003/api/',
        }
    }
    return JsonResponse(api_info, json_dumps_params={'indent': 2})


@api_view(['GET'])
def api_root(request):
    """Główny endpoint API z listą dostępnych zasobów"""
    return Response({
        'blog': request.build_absolute_uri('/api/blog/'),
        'services': request.build_absolute_uri('/api/services/'),
        'team': request.build_absolute_uri('/api/team/'),
        'contact': request.build_absolute_uri('/api/contact/'),
    })