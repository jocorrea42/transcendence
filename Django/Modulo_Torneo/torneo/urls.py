# torneos/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.torneo_index, name='torneo_index'),
    path('api/torneos/', views.ListaTorneosView.as_view(), name='lista_torneos'),
    path('api/torneos/create/', views.CrearTorneoView.as_view(), name='create_torneos'),
]
