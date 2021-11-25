from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from profiles.views import * 
urlpatterns = [
    path('customer/api/userdetails/<int:user_id>/', user_details),
    path('customer/', customer_view, name="customer"),
    path('customer/',include('bookings.urls')),
    path('customer/api/userdetails/', user_details_api),
    path('customer/api/', redirect_view),
    path('customer/profile/', user_profile_view, name='profile'),
    path('password-change', change_password_view, name ='password-change'),
    path('administration/',admin_view),
    path('administration/profile/', user_profile_view, name='profile'),
    path('administration/api/userdetails/', user_details_api),
]