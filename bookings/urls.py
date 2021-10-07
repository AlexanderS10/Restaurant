from django.contrib import admin
from django.urls import path, re_path, include
from bookings.views import *

from django.contrib.auth import views as auth_views


urlpatterns = [
    path('book-table/', book_table_view),
]