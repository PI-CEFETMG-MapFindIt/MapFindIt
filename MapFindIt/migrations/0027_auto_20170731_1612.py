# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-31 19:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MapFindIt', '0026_auto_20170628_2119'),
    ]

    operations = [
        migrations.CreateModel(
            name='Avaliacao',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valavaliacao', models.IntegerField(db_column='valAvaliacao', default=0)),
                ('idmapa', models.ForeignKey(db_column='idMapa', on_delete=django.db.models.deletion.DO_NOTHING, to='MapFindIt.Mapa')),
                ('idusuario', models.ForeignKey(db_column='idUsuario', on_delete=django.db.models.deletion.DO_NOTHING, to='MapFindIt.Usuario')),
            ],
            options={
                'db_table': 'avaliacao',
            },
        ),
        migrations.AlterUniqueTogether(
            name='avaliacao',
            unique_together=set([('idmapa', 'idusuario')]),
        ),
    ]