from django.contrib import messages
from django.shortcuts import render, redirect
from django.conf import settings
from rest_framework.views import APIView
from accounts.models import CustomUser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from profiles.serializers import UserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.middleware.csrf import get_token

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
permission_classes = [IsAuthenticated]
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
def user_details_api(request, *args, **kwargs): #REST API for detailing some basic info about the user that is using the system at the moment
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

#View for customer is defined which will redirect them to their home page
def customer_view(request, *args, **kwargs ):
    #Here I changed the logic of the data validation to be handled by their respective views, original approach was to send the form with two inputs; date and event type
    #I would use that to validate the date here and determine the event. Now instead the forms will be sent to their respective views and managed there which reduces complexity
    current_user = request.user 
    if current_user.is_authenticated:
        if not current_user.is_customer:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        else:
            print("user details: ", request.user.first_name)
            return render(request, "portals/customer/customer.html")        
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')

def user_profile_view(request):
    
    return render(request, 'portals/profile.html')

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
def redirect_view(request):
    return redirect('customer')