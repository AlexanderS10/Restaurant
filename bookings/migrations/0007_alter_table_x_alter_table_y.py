# Generated by Django 4.0.7 on 2022-08-25 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0006_rename_x_pos_table_x_rename_y_pos_table_y'),
    ]

    operations = [
        migrations.AlterField(
            model_name='table',
            name='x',
            field=models.DecimalField(decimal_places=3, max_digits=8),
        ),
        migrations.AlterField(
            model_name='table',
            name='y',
            field=models.DecimalField(decimal_places=3, max_digits=8),
        ),
    ]