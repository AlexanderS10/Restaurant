# Generated by Django 4.0.2 on 2022-02-13 05:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0007_rename_date_dish_category_added'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dish_category',
            old_name='added',
            new_name='date_created',
        ),
    ]
