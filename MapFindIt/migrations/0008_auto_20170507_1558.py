# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-07 18:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MapFindIt', '0007_auto_20170507_0023'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ponto',
            name='fotoponto',
            field=models.ImageField(blank=True, null=True, upload_to='MapFindIt/static/MapFindIt/imagemPonto/'),
        ),
    ]