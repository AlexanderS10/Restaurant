from django.urls import path, include
from profiles.views import * 
urlpatterns = [
    path('customer/', include('profiles.customer_urls')),
    path('password-change', change_password_view, name ='password-change'),
    path('administration/',include('profiles.admin_urls')),
]