from django.db import models
from accounts.models import CustomUser
# Create your models here.
class Dish_Category (models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    date_created = models.DateTimeField(auto_now=True, blank=False)
    def __str__(self):
        return f"{self.id}"
class Dish(models.Model):
    category = models.ForeignKey(Dish_Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=False)
    description = models.TextField(blank=False)
    date_created = models.DateTimeField(verbose_name="Date created", auto_now_add=True)
    def __str__(self):
        return f"{self.name}"