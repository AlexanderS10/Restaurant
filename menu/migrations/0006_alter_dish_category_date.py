# Generated by Django 4.0.2 on 2022-02-13 05:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0005_dish_category_date_alter_dish_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dish_category',
            name='date',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
