from django.contrib import messages
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth.decorators import login_required
from rest_framework import serializers
from datetime import datetime
from rest_framework.views import APIView
from accounts.models import CustomUser
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from profiles.serializers import UserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.middleware.csrf import get_token

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
@api_view(['GET'])
def user_details(request, user_id,*args, **kwargs):
    current_user = request.user
    id = current_user.id
    status = 200
    try:
        obj = CustomUser.objects.get(id=user_id)
        data = UserSerializer(obj)
        return Response(data.data, status=status)
    except:
        status = 404
        return Response(status=404)

@api_view(['GET'])# @authentication_classes((SessionAuthentication))
@ensure_csrf_cookie
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

#Here the view for customer is defined which will redirect them to their home page
def customer_view(request, *args, **kwargs ):
    #Here I will see if the users are selecting an acceptable date. If it is a previous day than the one in the server (which is located where the restaurant is so timezones are 
    # not a problem) then the system will blcik them from continuing as it is not possible to create a reservation for a day that passed. This same logic will apply to time if the date is the current one.
    if request.method =="POST":
        form = request.POST
        current_date = datetime.now().strftime('%m-%d-%Y-%H:%M:%S')
        date_post = form["date"]
        date_use = datetime.strptime(date_post, '%m-%d-%Y')#.strftime('%m-%d-%Y')
        datetime_server = datetime.now()
        date_server = datetime_server.strftime('%m-%d-%Y')
        if date_use.date() == datetime_server.date():
            print("THE DATES ARE THE SAME!!!!")
        else:
            print("THE DATES ARE DIFFERENT!!!")
        # print("This is the date in the backend ",date_use.date())
        # print("Date from server: ", datetime_server.date())
    current_user = request.user 
    if current_user.is_authenticated:
        if not current_user.is_customer:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request, "portals/customer.html")        
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')

#Here I define the view for staff
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

@method_decorator(ensure_csrf_cookie, name = 'dispatch')
class GetCSRFToken(APIView):
    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})
def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def ping(request):
    return JsonResponse({'result': 'OK'})