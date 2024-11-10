# Generated by Django 5.1.3 on 2024-11-10 14:21

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Torneo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
                ('es_privado', models.BooleanField(default=False)),
                ('max_jugadores', models.IntegerField(default=16)),
                ('estado', models.CharField(choices=[('activo', 'Activo'), ('finalizado', 'Finalizado')], max_length=50)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('creador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Sala',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('ganador', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sala_ganador', to=settings.AUTH_USER_MODEL)),
                ('jugador_1', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sala_jugador_1', to=settings.AUTH_USER_MODEL)),
                ('jugador_2', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sala_jugador_2', to=settings.AUTH_USER_MODEL)),
                ('torneo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='salas', to='torneo.torneo')),
            ],
        ),
        migrations.CreateModel(
            name='Participante',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('puntaje', models.IntegerField(default=0)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('torneo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participantes', to='torneo.torneo')),
            ],
        ),
    ]
