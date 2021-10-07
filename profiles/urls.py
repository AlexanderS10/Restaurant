from django.contrib import admin
from django.contrib import admin
from django.urls import path, re_path, include


from django.contrib.auth import views as auth_views

from profiles.views import *
from accounts.forms import *
urlpatterns = [
    path('api/userdetails/<int:user_id>/', user_details),
    path('', customer_view, name="customer"),
    path('',include('bookings.urls'))
]