from django.db import models
from django.contrib.auth import get_user_model

GameUser = get_user_model()


# Games Played
class Games(models.Model):
    class Meta:
        verbose_name_plural = "GAMES PLAYED"

    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(GameUser, related_name="games", on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name) + " : " + str(self.created_by)

    class Meta:
        unique_together = ('name', 'created_by')


# Game Statistical Information
class GameStat(models.Model):
    class Meta:
        verbose_name_plural = "GAME STATISTICS"

    game_type = models.CharField(max_length=100)
    description = models.TextField(max_length=1000, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    game = models.ForeignKey(Games, related_name="gamestat", on_delete=models.CASCADE)
    created_by = models.ForeignKey(GameUser, related_name="gamestat", on_delete=models.CASCADE)
