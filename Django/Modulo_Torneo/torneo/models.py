from django.db import models
from django.contrib.auth.models import User
import uuid

class Torneo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=255)
    creador = models.ForeignKey(User, on_delete=models.CASCADE)
    es_privado = models.BooleanField(default=False)
    #max_jugadores = models.IntegerField(default=16)
    #estado = models.CharField(max_length=50, choices=[("activo", "Activo"), ("finalizado", "Finalizado")])
    #fecha_creacion = models.DateTimeField(auto_now_add=True)

class Participante(models.Model):
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, related_name="participantes")
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    puntaje = models.IntegerField(default=0)
    fecha_registro = models.DateTimeField(auto_now_add=True)

class Sala(models.Model):
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, related_name="salas")
    jugador_1 = models.ForeignKey(User, related_name="sala_jugador_1", on_delete=models.SET_NULL, null=True)
    jugador_2 = models.ForeignKey(User, related_name="sala_jugador_2", on_delete=models.SET_NULL, null=True)
    ganador = models.ForeignKey(User, related_name="sala_ganador", on_delete=models.SET_NULL, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
