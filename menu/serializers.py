from rest_framework import serializers
from .models import Dish, Dish_Category 

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id','category','name','description','date_created']
    def validate(self, attrs):
        if len(attrs['category']) == 0 or len(attrs['name']) == 0 or len(attrs['Description']) == 0:
            raise serializers.ValidationError("Attributes should not be empty")
        return attrs

class DishCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish_Category
        fields = ['id']
    def validate(self, attrs):
        qs = Dish_Category.objects.get(attrs['id'])
        if len(attrs)==0:
            raise serializers.ValidationError("Category name cannot be empty")
        elif qs:
            raise serializers.ValidationError("This category already exists")