# Generated by Django 3.2.5 on 2022-01-11 23:53

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20211022_1342'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='image',
            field=models.ImageField(default=accounts.models.get_default_profile_image, upload_to=accounts.models.get_profile_image_filepath),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Active'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='is_customer',
            field=models.BooleanField(default=True, verbose_name='Customer'),
        ),
    ]
