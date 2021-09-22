from django.db.models import fields
from models import CustomUser
from rest_framework import serializers

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'date_joined', 'is_admin', 
        'is_staff', 'is_active']
        






        