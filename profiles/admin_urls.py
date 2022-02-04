from django.urls import path
from profiles.views import * 
from menu.views import *
urlpatterns = [
    path('', admin_view, name='admin_home'),
    path('profile/', user_profile_view, name='admin_profile'),
    path('menu',admin_menu,name='admin_menu'),
]