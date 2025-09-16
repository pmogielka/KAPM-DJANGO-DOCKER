from rest_framework import permissions


class IsAuthorOrAdmin(permissions.BasePermission):
    """
    Własny permission - pozwala autorowi edytować własne posty,
    adminowi wszystkie
    """

    def has_object_permission(self, request, view, obj):
        # Odczyt dla wszystkich
        if request.method in permissions.SAFE_METHODS:
            return True

        # Edycja dla autora lub admina
        if hasattr(obj, 'author'):
            return obj.author == request.user or request.user.is_superuser

        return request.user.is_superuser


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Własny permission - pozwala właścicielowi edytować własne obiekty,
    adminowi wszystkie
    """

    def has_object_permission(self, request, view, obj):
        # Odczyt dla wszystkich zalogowanych
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        # Edycja dla właściciela lub admina
        if hasattr(obj, 'uploaded_by'):
            return obj.uploaded_by == request.user or request.user.is_superuser

        if hasattr(obj, 'user'):
            return obj.user == request.user or request.user.is_superuser

        return request.user.is_superuser


class IsAdminOrEditor(permissions.BasePermission):
    """
    Permission tylko dla adminów i edytorów
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        if hasattr(request.user, 'profile'):
            return request.user.profile.role in ['admin', 'editor']

        return False