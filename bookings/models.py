from django.db import models
from django.forms import ImageField
from accounts.models import CustomUser

# Create your models here.
class Room (models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    name = models.CharField(blank=False, unique=True, verbose_name="Room name", max_length=100)
    description = models.TextField(blank=False, verbose_name="Room description")
    def __str__(self):
        return self.name

class Table ( models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    table_number = models.IntegerField(null=False, unique=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    capacity = models.IntegerField(verbose_name="Capacity")
    available = models.BooleanField(verbose_name="Available")
    shape = models.CharField(max_length=10, blank=False)
    sides = models.IntegerField(blank=False)
    rotation = models.IntegerField(blank=False)
    x_pos = models.DecimalField(default=0.0,max_digits=6, decimal_places=2)
    y_pos = models.DecimalField(default=0.0, max_digits=6, decimal_places=2)
    def __str__(self):
        return str(self.table_number)

def room_image_path(self,a):
    print("This is the value of a="+a)
    return f'room_images/{self.room.id}/{a}'
    
class RoomImages(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=room_image_path)
    def __str__(self):
        return f'{self.room.name} {self.image.name}'

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
    def __str__(self):
        return self.room.name+" "+self.table

class RoomReservation(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    party_size = models.IntegerField(null=False)
    date = models.DateField(null=False)
    time = models.TimeField(null=False)
    details= models.TextField(null=True)
    commets = models.TextField(null=True)
    def __str__(self):
        return self.id+" "+self.date 
