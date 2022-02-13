from rest_framework import serializers
from .models import Dish, Dish_Category 

class DishSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(max_length=200)
    description = serializers.CharField()
    class Meta:
        model = Dish
        fields = ['id','category','dish_name','description','date_created']
    #category = serializers.ReadOnlyField(source='Dish_Category.id')
    

class DishCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish_Category
        fields = ['id','category_name']