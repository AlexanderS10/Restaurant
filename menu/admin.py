from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# Register your models here.
from .models import Dish, Dish_Category

class DishAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        obj = form.save(commit=False)
        obj.admin = request.user
        obj.save()
    
    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
             instance.user = request.user
             instance.save()
        else:
             formset.save_m2m()
admin.site.register(Dish, DishAdmin)
admin.site.register(Dish_Category)
