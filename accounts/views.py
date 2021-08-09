from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

# Create your views here.
from .models import *

def login_view(request):
    print(request.POST)
    return render(request,'accounts/login.html',{})
def home_view(request):
    return render(request,"home.html",context={})