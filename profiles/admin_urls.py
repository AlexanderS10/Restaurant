from django.contrib import admin
from django.urls import path, include
from profiles.views import * 
urlpatterns = [
    path('', admin_view, name='admin_home'),
    path('profile/', user_profile_view, name='admin_profile'),
    path('api/userdetails/', user_details_api),
    path('menu',admin_menu,name='admin_menu'),
]