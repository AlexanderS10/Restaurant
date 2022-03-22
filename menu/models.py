from pyexpat import model
from django.db import models
from accounts.models import CustomUser
# Create your models here.
class Dish_Category (models.Model):
    id = models.AutoField(unique=True, primary_key=True, blank=False)
    category_name = models.CharField(max_length=100, blank=False, unique=True, verbose_name="Dish category")
    date_created = models.DateTimeField(auto_now_add=True, blank=False)
    def __str__(self):
        return f"{self.category_name}"
class Dish(models.Model):
    category = models.ForeignKey(Dish_Category, on_delete=models.CASCADE)
    price = models.DecimalField(blank=True, max_digits=5, decimal_places=2, default=0.0)
    #category = models.ForeignKey(Dish_Category, to_field="category_name",db_column="category_name", on_delete=models.CASCADE)
    dish_name = models.CharField(max_length=200, blank=False)
    description = models.TextField(blank=False)
    date_created = models.DateTimeField(verbose_name="Date created", auto_now_add=True)
    def __str__(self):
        return f"{self.dish_name}"