# Generated by Django 3.2.5 on 2021-09-18 18:10

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='image',
            field=models.ImageField(blank=True, default=accounts.models.get_default_profile_image, null=True, upload_to=accounts.models.get_profile_image_filepath),
        ),
    ]
