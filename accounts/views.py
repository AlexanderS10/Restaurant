from urllib import request
from django.db import reset_queries
from rest_framework.decorators import api_view
from rest_framework import generics, filters, status, pagination
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from accounts.decorators import admin_only
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import *
from restaurant.settings import ALLOWED_HOSTS
from django.core.checks import messages
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
import restaurant
# Create your views here.
from .forms import *
from .models import *
from django.contrib import messages
from django.conf import settings
ALLOWED_HOSTS = settings.ALLOWED_HOSTS
    #With the reset password I would have tried two methods of views, one where I create my own which is the following  case
    #while the reset passwords with email is the use of the included views which is the more secure approach in my opinion as it will have more security features than the ones 
    #I can do at this moment but still I tried both methods. At the same time I found three different methods to personalize the default forms: create own, use javascript
    # and use django-widgets-tweaks.

def login_view(request):
    form = LoginForm(request.POST or None)
    #Here if a user is already logged in and is not anonymous if tries the login page it will redirect them to their portal as they are already logged in
    if request.user is not None and request.user.is_anonymous==False: 
        current_user = request.user
        id = current_user.id
        if current_user.is_customer:
            return redirect("/customer")
        elif current_user.is_superuser:
            return redirect("/administration")
        elif current_user.is_staff:
            return redirect("/staff")
        elif current_user.is_anonymous:
            return redirect("/login")
    # If the info provided does match with a user's password, redirect them to their portal otherwise throw an error
    elif form.is_valid():
        email = form.cleaned_data.get("email")
        password = form.cleaned_data.get("password")
        user = authenticate(request, email=email, password=password)
        if user is not None:
            if user.is_customer:
                login(request,user)
                return redirect("/customer")
            elif user.is_superuser:
                login(request, user)
                return redirect("/administration")
            elif user.is_staff:
                login(request, user)
                return redirect("/staff")
        else:
            messages.error(request,'Incorrect Username or Password')
            return redirect('login')
    return render (request,"registration/login.html", {"form":form})

# When a user logs out they will be taken to the login page
def logout_view(request):
    logout(request)
    return redirect("login")
def register_view(request):
    form = RegisterForm(request.POST or None)
    form.is_customer = True
    if form.is_valid():
        #Once the user is created redirect them to their portal
        user = form.save()
        login(request,user)
        return redirect("/customer")
    context = {'form':form}
    return render(request,'registration/register.html',context)
def home_view(request):
    return render(request,"home.html",context={})
def handler404(request,exception):
    return render(request,'pages/404.html',status=404)
def handler404_view(request):
    return render(request,'pages/404.html',status=404)

@api_view(['GET'])
def search_users_view(request):
    print(request.user)
    return Response({"message":"Action Denied"}, status = status.HTTP_200_OK)

class CustomPagination(pagination.PageNumberPagination):
    page_size = 2
    
class SearchUsersAPIView(generics.ListAPIView,pagination.PageNumberPagination): #generics provides with a get handler
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    filter_backends = (filters.SearchFilter,)
    queryset = CustomUser.objects.get_queryset().order_by('-date_joined')
    authentication_classes = [restaurant.rest_api.dev.DevAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class = userSerializer
    pagination_class = CustomPagination
    ordering = ['date_joined']


    # def dispatch(self,request, *args, **kwargs):
    #     self.request = request
    #     print(self.request.user)
    #     if request.user.is_anonymous or request.user.is_user_superuser()==False: #since the decorator did not work I will check if the user has access to the api as admin
    #         response = Response({"message":"Action Denied"}, status = status.HTTP_400_BAD_REQUEST)
    #         response.accepted_renderer = JSONRenderer()
    #         response.accepted_media_type = "application/json"
    #         response.renderer_context = {}
    #         return response
    #     return super().dispatch(request,*args, **kwargs)