from rest_framework import routers
#from .views import CategoryViewSet, TaskViewSet

router = routers.DefaultRouter()
#router.register(r'game', CategoryViewSet, 'categories')
#router.register(r'gamestat', TaskViewSet, 'tasks')

urlpatterns = router.urls
