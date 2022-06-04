from django.contrib import admin
from .models import Games, GameStat


class GamesAdmin(admin.ModelAdmin):
    list_display = ['name']


class GameStatAdmin(admin.ModelAdmin):
    list_display = ['game_type']


admin.site.register(Games, GamesAdmin)
admin.site.register(GameStat, GameStatAdmin)
