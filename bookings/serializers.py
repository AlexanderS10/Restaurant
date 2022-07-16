from rest_framework import serializers
from .models import *
 
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model= RoomImages
        fields = "__all__"