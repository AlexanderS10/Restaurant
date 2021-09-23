from django.contrib import admin
from django.contrib import admin
from django.urls import path, re_path, include


from django.contrib.auth import views as auth_views

from profiles.views import *
from accounts.forms import *
urlpatterns = [
    path('<int:user_id>/', user_details),
]