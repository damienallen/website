# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-10-23 00:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='email',
            name='subject',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='email',
            name='message',
            field=models.TextField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='email',
            name='timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
