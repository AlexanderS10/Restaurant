from django.db.models import fields
from accounts.models import CustomUser
from menu.models import *
from rest_framework import serializers

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','email', 'first_name', 'last_name', 'phone_number',"date_joined"]
        ordering = ['date_joined']
        
class userDetailedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','email', 'first_name', 'last_name', 'phone_number',"image","comments","is_customer","is_staff","is_admin","is_superuser","is_active","date_joined"]