# project_root/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('torneo/', include('torneo.urls')),  # Incluye las rutas de la app 'torneos'
]

