# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-18 21:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MapFindIt', '0021_auto_20170618_1325'),
    ]

    operations = [
        migrations.AddField(
            model_name='grupo',
            name='privado',
            field=models.BooleanField(db_column='Privacidade', default=False),
        ),
    ]
