from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from .serializers import GamesSerializer, GameStatSerializer
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from django.db.models.query_utils import Q
from .models import Games, GameStat
from .permissions import GameStatPermission


class StandardResultSetPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 10


class GamesViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GamesSerializer

    def get_queryset(self):
        # Return all user's categories
        return self.request.user.games.all()

    def perform_create(self, serializer):
        # Save the new game created by user
        serializer.save(created_by=self.request.user)


class GameStatViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
        GameStatPermission
    ]
    serializer_class = GameStatSerializer
    pagination_class = StandardResultSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['game_type', 'description']
    ordering_fields = ['-created_at', '-end_time', 'start_time']
    ordering = ['-created_at', '-end_time', '-start_time']

    def get_queryset(self):
        user = self.request.user

        game = self.request.query_params.get('id')
        win = self.request.query_params.get('win')

        query_params = {}

        if game is not None:
            query_params["game"] = game

        if win is not None:
            query_params["win"] = win

        # Only return Game Stat that is created by user not others
        return GameStat.objects.filter(created_by=user, **query_params)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
