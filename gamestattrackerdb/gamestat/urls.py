from rest_framework import routers
from .views import GameStatViewSet, GamesViewSet

router = routers.DefaultRouter()
router.register(r'game', GamesViewSet, 'games')
router.register(r'gamestat', GameStatViewSet, 'gamestat')

urlpatterns = router.urls
