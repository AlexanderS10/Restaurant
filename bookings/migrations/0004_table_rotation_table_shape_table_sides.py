# Generated by Django 4.0.7 on 2022-08-17 23:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_table_x_pos_table_y_pos'),
    ]

    operations = [
        migrations.AddField(
            model_name='table',
            name='rotation',
            field=models.IntegerField(default=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='table',
            name='shape',
            field=models.CharField(default='square', max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='table',
            name='sides',
            field=models.IntegerField(default=3),
            preserve_default=False,
        ),
    ]
