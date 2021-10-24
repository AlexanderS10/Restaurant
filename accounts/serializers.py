from django.db.models import fields
from accounts.models import CustomUser
from rest_framework import serializers

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'date_joined']
        






        