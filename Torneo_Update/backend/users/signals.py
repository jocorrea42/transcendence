# import logging
# from django.db.models.signals import post_migrate
# from django.dispatch import receiver
# from django.db import transaction
# from .models import PongUser

# logger = logging.getLogger(__name__)

# @receiver(post_migrate)
# def create_IA(sender, **kwargs):
#     # Usar transaction.on_commit para asegurarse de que las migraciones han terminado
#     transaction.on_commit(lambda: create_users())

# def create_users():
#     try:
#         # Verificar si el usuario 'IA' existe, y si no, crearlo
#         if not PongUser.objects.filter(username='IA').exists():
#             logger.info("Creando usuario 'IA'.")
#             PongUser.objects.create(username='IA', password="Iapassword", email="ia@gmail.com")

#         # Verificar si el usuario 'localhost' existe, y si no, crearlo
#         if not PongUser.objects.filter(username="localhost").exists():
#             logger.info("Creando usuario 'localhost'.")
#             PongUser.objects.create(username="localhost", password="localPassword", email="localemail@gmail.com")

#     except Exception as e:
#         logger.error(f"Error al crear usuarios en post_migrate: {str(e)}")
