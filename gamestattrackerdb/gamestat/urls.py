from rest_framework import routers
from .views import GameStatViewSet, GamesViewSet, DashboardGamesWinLose, DashboardTaskByCategoryViewSet

router = routers.DefaultRouter()

router.register(r'game', GamesViewSet, 'games')
router.register(r'gamestat', GameStatViewSet, 'gamestat')

router.register('gamewinlose', DashboardGamesWinLose, 'games-win-lose')
router.register('gamebygame', DashboardTaskByCategoryViewSet, 'games-by-games')

urlpatterns = router.urls
