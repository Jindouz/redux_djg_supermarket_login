# Generated by Django 5.0.1 on 2024-01-24 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_book'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='img',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
