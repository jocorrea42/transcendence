# Generated by Django 5.1 on 2024-09-21 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_ponguser_password2'),
    ]

    operations = [
        migrations.AddField(
            model_name='ponguser',
            name='otp',
            field=models.CharField(blank=True, max_length=6),
        ),
        migrations.AddField(
            model_name='ponguser',
            name='otp_expiry_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
