from django import forms
from django.contrib import admin
from .models import Games, GameStat


class GamesAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by']


class GameStatAdmin(admin.ModelAdmin):
    list_display = ['get_game_name', 'game_type', 'created_by']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "game":
            kwargs["queryset"] = Games.objects.filter(created_by=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_game_name(self, obj):
        return obj.game.name

    get_game_name.short_description = 'Game'
    get_game_name.admin_order_field = 'game__name'


admin.site.register(Games, GamesAdmin)
admin.site.register(GameStat, GameStatAdmin)
