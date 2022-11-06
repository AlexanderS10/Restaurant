from django.db.models import fields
from accounts.models import CustomUser
from menu.models import *
from rest_framework import serializers
from django.contrib.auth import authenticate

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','email', 'first_name', 'last_name', 'phone_number',"date_joined","is_customer","is_staff","is_admin"]
        ordering = ['date_joined']
        
class userDetailedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','email', 'first_name', 'last_name', 'phone_number',"image","comments","is_customer","is_staff","is_admin","is_superuser","is_active","date_joined"]

#Register
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields =['id','email','phone_number','first_name', 'last_name', 'password']
        extra_kwargs = {'password':{'write_only':True}}
    def validate_phone_number(self, attrs):
        try:
            int(attrs) #if the phone number can be transformed into a int then it should be valid which the PhoneField attribute failed to check
        except:
            raise serializers.ValidationError("Phone number cannot contain letters or special characters")
        return super().validate(attrs)
    def create(self, validated_data):
        user = CustomUser.objects.create_user(validated_data['email'],validated_data['first_name'],validated_data['last_name'],validated_data['phone_number'],validated_data['password'])
        return user
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=30)
    def validate(self, attrs):
        print("Email password checker authentication")
        user = authenticate(**attrs)
        if user:
            return user
        raise serializers.ValidationError("Incorrect email or password")