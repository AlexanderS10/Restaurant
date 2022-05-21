from django import views
from django.urls import path
from profiles.views import user_details, user_details_api
from menu.views import *
from accounts.views import AdminUserInfoUpdate, CreateUserAPIView, SearchUsersAPIView, search_users_view, reset_default_profile_image, reset_profile_image
urlpatterns = [
    path('userdetails/', user_details_api),
    path('userdetails/<int:user_id>/', user_details),
    path('dishes/', dish_list_view),
    path('dishes/<int:dish_id>/', DishDetail.as_view()),
    path('categories/', category_list_view),
    path('categories/<int:id>/', DishCategory.as_view()),
    path('categories/create/', create_category),
    path('dishes/create/',create_dish),
    path('users/', SearchUsersAPIView.as_view()),
    path('moreusers/',search_users_view),
    path('users/<int:user_id>/',AdminUserInfoUpdate.as_view()),
    path('users/create/', CreateUserAPIView.as_view()),
    path('default_profile_image/', reset_default_profile_image),
    path('reset_profile/', reset_profile_image)
]
