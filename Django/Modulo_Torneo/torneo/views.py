from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Torneo, Participante, Sala
from .serializers import TorneoSerializer, SalaSerializer, ParticipanteSerializer
import random
from django.db import transaction

def torneo_index(request):
    return render(request, 'index.html')

class CrearTorneoView(APIView):
    def post(self, request):
        serializer = TorneoSerializer(data=request.data)
        if serializer.is_valid():
            torneo = serializer.save(creador=request.user)
            return Response(TorneoSerializer(torneo).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListaTorneosView(APIView):
    def get(self, request):
        torneos = Torneo.objects.all()
        serializer = TorneoSerializer(torneos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UnirseTorneoView(APIView):
    def post(self, request, torneo_id):
        torneo = Torneo.objects.get(id=torneo_id)
        if torneo.participantes.count() >= torneo.max_jugadores:
            return Response({"error": "Torneo lleno"}, status=status.HTTP_400_BAD_REQUEST)
        
        participante = Participante.objects.create(torneo=torneo, usuario=request.user)
        return Response({"mensaje": "Unido al torneo con éxito"}, status=status.HTTP_201_CREATED)

def iniciar_torneo(torneo):
    participantes = list(torneo.participantes.all())
    random.shuffle(participantes)
    
    with transaction.atomic():
        for i in range(0, len(participantes), 2):
            jugador_1 = participantes[i].usuario
            jugador_2 = participantes[i + 1].usuario if i + 1 < len(participantes) else None
            
            sala = Sala.objects.create(
                torneo=torneo,
                jugador_1=jugador_1,
                jugador_2=jugador_2
            )
