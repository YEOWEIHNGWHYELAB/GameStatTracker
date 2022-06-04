from rest_framework import permissions
from .models import Games


class GameStatPermission(permissions.BasePermission):
    message = 'Game not found!'

    def has_permission(self, request, view):
        if view.action == 'create' or view.action == 'update' or view.action == 'partial_update':
            games = request.data.get('game')

            if games is None:
                return True

            user_games = Games.objects.filter(created_by=request.user).values_list('id', flat=True)

            if not games in user_games:
                return False

        return True
