from django.urls import path, include
from profiles.views import * 
from menu.views import dish_list_view, category_list_view
urlpatterns = [
    path('customer/', include('profiles.customer_urls')),
    path('password-change', change_password_view, name ='password-change'),
    path('administration/',include('profiles.admin_urls')),
    path('api/userdetails/', user_details_api),
    path('api/userdetails/<int:user_id>', user_details),
    path('api/dishes/', dish_list_view),
    path('api/categories', category_list_view)
]