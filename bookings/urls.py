from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import views
from bookings.views import *
from profiles.views import customer_view
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('book-table/<str:date_sent>/', book_table_view),
    path('book-event/<str:date_sent>/',book_event_view),
    path('book-table/', customer_view),
    path('book-event/', customer_view),
]