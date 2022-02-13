from rest_framework import serializers
from .models import Dish, Dish_Category 

class DishSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100)
    description = serializers.CharField()
    class Meta:
        model = Dish
        fields = ['id','category','name','description','date_created']
    #category = serializers.ReadOnlyField(source='Dish_Category.id')
    

class DishCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish_Category
        fields = ['id','date_created']