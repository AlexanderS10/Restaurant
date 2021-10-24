from rest_framework import response
from restaurant.settings import ALLOWED_HOSTS
from django.core.checks import messages
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.contrib.auth.forms import AuthenticationForm
# Create your views here.
from .forms import *
from .models import *
from django.contrib import messages
from django.utils.http import is_safe_url
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
        if current_user.is_customer and is_safe_url("/customer",ALLOWED_HOSTS):
            return redirect("/customer")
        elif current_user.is_staff and is_safe_url("/admin",ALLOWED_HOSTS):
            return redirect("/admin")
        elif current_user.is_superuser and is_safe_url("/staff",ALLOWED_HOSTS):
            return redirect("/staff")
        elif current_user.is_anonymous and is_safe_url("/login",ALLOWED_HOSTS):
            return redirect("/login")
    # If the info provided does match with a user's password, redirect them to their portal otherwise throw an error
    elif form.is_valid():
        email = form.cleaned_data.get("email")
        password = form.cleaned_data.get("password")
        user = authenticate(request, email=email, password=password)
        if user is not None:
            if user.is_customer and is_safe_url("/customer",ALLOWED_HOSTS):
                login(request,user)
                return redirect("/customer")
            elif user.is_superuser and is_safe_url("/administration",ALLOWED_HOSTS):
                login(request, user)
                return redirect("/administration")
            elif user.is_staff and is_safe_url("/staff",ALLOWED_HOSTS):
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