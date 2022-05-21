from django.db import models
from django.forms import ImageField
from accounts.models import CustomUser

# Create your models here.
class Room (models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    name = models.CharField(blank=False, unique=True, verbose_name="Room name", max_length=100)
    description = models.TextField(blank=False, verbose_name="Room description")

class Table ( models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    capacity = models.IntegerField(verbose_name="Capacity")
    available = models.BooleanField(verbose_name="Available")

def room_image_path(self):
    return f'room_images/{self.pk}/'
class RoomImages(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=room_image_path)

class TableReservation(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    date = models.DateField(null=False)
    time = models.TimeField(null=False)
    party_size = models.IntegerField(null=False)
    completed = models.BooleanField(null=False, default=False)
    description = models.TextField(blank=True)
    comments = models.TextField(null=True)

class RoomReservation(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    party_size = models.IntegerField(null=False)
    date = models.DateField(null=False)
    time = models.TimeField(null=False)
    details= models.TextField(null=True)
    commets = models.TextField(null=True)
