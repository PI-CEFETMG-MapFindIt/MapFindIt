# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-06-24 23:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MapFindIt', '0023_auto_20170621_2001'),
    ]

    operations = [
        migrations.AddField(
            model_name='iconespontos',
            name='idusuario',
            field=models.ForeignKey(db_column='idUsuario', default=4, on_delete=django.db.models.deletion.DO_NOTHING, to='MapFindIt.Usuario'),
            preserve_default=False,
        ),
    ]