from django.contrib import admin
from django.urls import path, include
from profiles.views import * 
urlpatterns = [
    path('', customer_view, name="customer"),
    path('',include('bookings.urls')),
    path('api/', redirect_view),
    path('profile/', user_profile_view, name='customer_profile'),
]