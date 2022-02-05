from django.urls import path
from profiles.views import user_details, user_details_api
from menu.views import *
urlpatterns = [
    path('userdetails/', user_details_api),
    path('userdetails/<int:user_id>', user_details),
    path('dishes/', dish_list_view),
    path('categories/', category_list_view),
    path('dishes/<int:dish_id>/', dish_detail_view)
]