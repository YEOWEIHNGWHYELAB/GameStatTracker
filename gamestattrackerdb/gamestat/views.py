from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from .serializers import GamesSerializer, GameStatSerializer, DashboardGameWinLoseSerializer, \
    DashboardGameByGameSerializer
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from django.db.models.query_utils import Q
from .models import Games, GameStat
from .permissions import GameStatPermission
from datetime import datetime


class StandardResultSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 6


class GamesViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GamesSerializer

    def get_queryset(self):
        # Return all user's games
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

        start_time = self.request.query_params.get('start_time')
        end_time = self.request.query_params.get('end_time')

        query_params = {}

        if game is not None:
            query_params["game"] = game

        if win is not None:
            query_params["win"] = win

        if start_time is not None and end_time is not None:
            # Both start_time and end_time are not null
            time_range_filter = {'start_time__range': [start_time, end_time], 'end_time__range': [start_time, end_time]}
        elif start_time is not None:
            # Only start_time is not null
            time_range_filter = {'start_time__gte': start_time}
        elif end_time is not None:
            # Only end_time is not null
            time_range_filter = {'end_time__lte': end_time}
        else:
            # Both start_time and end_time are null, no need to filter by time_range
            time_range_filter = {}

        # Only return Game Stat that is created by user not others
        return GameStat.objects.filter(created_by=user, **query_params, **time_range_filter)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class DashboardGamesWinLose(viewsets.ViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def list(self, request):
        user = self.request.user

        # show the task by that user based on completion and annotate with the count where its completed
        queryset = GameStat.objects.filter(created_by=user).values('win').annotate(count=Count('win'))
        serializer = DashboardGameWinLoseSerializer(queryset, many=True)
        return Response(serializer.data)


class DashboardTaskByCategoryViewSet(viewsets.ViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    # Indicates the number of objects inside a particular category
    def list(self, request):
        user = self.request.user

        gameFilter = {}
        win = self.request.query_params.get('win')

        if win is not None:
            gameFilter['gamestat__win'] = win

        queryset = Games.objects \
            .filter(created_by=user) \
            .annotate(count=Count('gamestat', filter=Q(**gameFilter)))

        serializer = DashboardGameByGameSerializer(queryset, many=True)

        return Response(serializer.data)
