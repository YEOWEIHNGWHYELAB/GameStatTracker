# Generated by Django 4.0.4 on 2023-04-15 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gamestat', '0006_alter_games_created_by_alter_gamestat_created_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamestat',
            name='win',
            field=models.BooleanField(default=False),
        ),
    ]
