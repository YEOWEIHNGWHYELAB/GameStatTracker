from django.contrib import admin
from .models import Games, GameStat


class GamesAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by']


class GameStatAdmin(admin.ModelAdmin):
    list_display = ['game_type', 'get_game_name', 'created_by']

    def get_game_name(self, obj):
        return obj.game.name
    get_game_name.short_description = 'Game'
    get_game_name.admin_order_field = 'game__name'


admin.site.register(Games, GamesAdmin)
admin.site.register(GameStat, GameStatAdmin)
