from django.contrib import messages
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth.decorators import login_required
from rest_framework import serializers
from accounts.models import CustomUser
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from profiles.serializers import UserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
@api_view(['GET'])
@authentication_classes((SessionAuthentication, TokenAuthentication))
@ensure_csrf_cookie
@permission_classes((IsAuthenticated,))
def user_details_view(request, *args, **kwargs): #REST API for detailing some basic info about the user that is using the system at the moment
    current_user = request.user
    id = current_user.id
    status = 200
    try:
        obj = CustomUser.objects.get(id=id)
        data = UserSerializer(obj)
        return Response(data.data, status=status)
    except:
        status = 404
        return Response(status=404)

def customer_view(request, *args, **kwargs ):
    current_user = request.user 
    if current_user.is_authenticated:
        if not current_user.is_customer:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request, "portals/customer.html")        
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')
def staff_view(request):
    current_user = request.user
    if current_user.is_authenticated:
        if not current_user.is_staff:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request,"portals/staff.html")
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')
def admin_view(request):
    current_user = request.user
    if current_user.is_authenticated:
        if not current_user.is_superuser:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request,"portals/admin.html")
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')