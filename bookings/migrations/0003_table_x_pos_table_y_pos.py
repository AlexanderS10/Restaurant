# Generated by Django 4.0.2 on 2022-05-23 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0002_table_table_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='table',
            name='x_pos',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=6),
        ),
        migrations.AddField(
            model_name='table',
            name='y_pos',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=6),
        ),
    ]
