# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-06-13 22:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MapFindIt', '0019_auto_20170521_1252'),
    ]

    operations = [
        migrations.AddField(
            model_name='amizade',
            name='aceita',
            field=models.BooleanField(db_column='aceita', default=False),
        ),
    ]
