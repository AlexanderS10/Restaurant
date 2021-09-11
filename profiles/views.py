from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from accounts.models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.
# @login_required(login_url='login')
# def user_details_view(request, *args, **kwargs): #REST API for detailing some basic info about the user that is using the system at the moment
#     current_user = request.user
#     id = current_user.id
#     data = dict()
#     status = 200
#     try:
#         obj = CustomUser.objects.get(id=id)
#         data = obj.serialize()
#     except:
#         data['message'] = "Not Found"
#         status = 404
#     return JsonResponse(data, status=status)
@api_view(['GET'])
def user_details_view(request, *args, **kwargs): #REST API for detailing some basic info about the user that is using the system at the moment
    current_user = request.user
    id = current_user.id
    status = 200
    data = dict()
    try:
        obj = CustomUser.objects.get(id=id)
        data = obj.serialize()
    except:
        data['message'] = "Not Found"
        status = 404
    return Response(data, status=status)

def customer_view(request, *args, **kwargs ):
    current_user = request.user 
    if current_user.is_authenticated:
        if not current_user.is_customer:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request, "profiles/customer.html")        
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')
def staff_view(request):
    current_user = request.user
    if current_user.is_authenticated:
        if not current_user.is_staff:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request,"profiles/staff.html")
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')
def admin_view(request):
    current_user = request.user
    if current_user.is_authenticated:
        if not current_user.is_superuser:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request,"profiles/admin.html")
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')