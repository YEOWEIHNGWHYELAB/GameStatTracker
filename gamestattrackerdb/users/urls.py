from django.urls import include, path


# Using djoser for login/logout
urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken'))
]
