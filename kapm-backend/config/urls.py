"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import home_view, api_root
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('', home_view, name='home'),
    path("admin/", admin.site.urls),

    # Authentication endpoints
    path('api/auth/', include('authentication.urls')),

    # CMS endpoints - nowa struktura
    path('api/', include('cms.urls')),

    # Legacy endpoints (do zachowania kompatybilności)
    path('api/', api_root, name='api-root'),
    path('api/blog/', include('core.blog_urls')),
    path('api/services/', include('core.services_urls')),
    path('api/team/', include('core.team_urls')),
    path('api/contact/', include('core.contact_urls')),

    # DRF auth
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # API documentation (opcjonalne)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
