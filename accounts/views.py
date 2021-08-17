from django.core.checks import messages
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from accounts.models import MyAccountManager
from django.contrib.auth.forms import AuthenticationForm
# Create your views here.
from .forms import *
from .models import *
from django.contrib import messages

def login_view(request):
    form = LoginForm(request.POST or None)
    if form.is_valid():
        email = form.cleaned_data.get("email")
        password = form.cleaned_data.get("password")
        user = authenticate(request, email=email, password=password)
        print(user)
        if user is not None:
            if user.is_customer:
                login(request,user)
                return redirect("/customer")
            elif user.is_superuser:
                login(request, user)
                return redirect("/admin")
            elif user.is_staff:
                login(request, user)
                return redirect("/staff")
        else:
            messages.error(request,'Incorrect Username or Password')
            return redirect('login')
        
    return render (request,"registration/login.html", {"form":form})
def logout_view(request):
    logout(request)
    return redirect("login")
def register_view(request):
    form = RegisterForm(request.POST or None)
    if form.is_valid():
        email = form.cleaned_data.get("email")
        password1 = form.cleaned_data.get("password1")
        password2 = form.cleaned_data.get("password2")
        first_name = form.cleaned_data.get("first_name")
        last_name = form.cleaned_data.get("last_name")
        phone_number = form.cleaned_data.get("phone_number")
        user = CustomUser.objects.create_user(email, first_name, last_name , phone_number, password1, is_active=True, is_customer=True)
        
        if user is not None:
            login(request,user)
            return redirect("/customer")
            
    context = {'form':form}
    return render(request,'registration/register.html',context)
def home_view(request):
    return render(request,"home.html",context={})