from rest_framework import serializers
from .models import Games, GameStat


class GamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Games
        fields = '__all__'
        read_only_fields = ['created_by']


class GameStatSerializer(serializers.ModelSerializer):
    game_name = serializers.CharField(read_only=True, source='game.name')

    class Meta:
        model = GameStat
        fields = '__all__'
        read_only_fields = ['created_by']
