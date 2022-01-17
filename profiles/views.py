from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import render, redirect
from django.conf import settings
from rest_framework.views import APIView
from accounts.forms import UserSettingsForm
from accounts.models import CustomUser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.serializers import userSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.contrib.auth.forms import PasswordChangeForm
from django.http import HttpResponseRedirect
ALLOWED_HOSTS = settings.ALLOWED_HOSTS
permission_classes = [IsAuthenticated]
@api_view(['GET'])
def user_details(request, user_id,*args, **kwargs):
    current_user = request.user
    id = current_user.id
    status = 200
    try:
        obj = CustomUser.objects.get(id=user_id)
        data = userSerializer(obj)
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
        data = userSerializer(obj)
        return Response(data.data, status=status)
    except:
        status = 404
        return Response(status=404)

#CUSTOMER VIEW
def customer_view(request, *args, **kwargs ):
    #Here I changed the logic of the data validation to be handled by their respective views, original approach was to send the form with two inputs; date and event type
    #I would use that to validate the date here and determine the event. Now instead the forms will be sent to their respective views and managed there which reduces complexity
    current_user = request.user 
    if current_user.is_authenticated:
        if not current_user.is_customer:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        else:
            if(request.user.image is None):
                print()
            print("user details: ", request.user.image)
            return render(request, "portals/customer/customer.html")        
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')
#
#PROFILE VIEW 
#
@login_required(login_url='../../login/')
def user_profile_view(request):
    user = request.user
    userSettings = UserSettingsForm(instance=user)
    if request.POST:
        userSettings = UserSettingsForm(request.POST, request.FILES,instance=user)
        if userSettings.is_valid():
            userSettings.save()
    form = PasswordChangeForm(request.user)
    return render(request, 'portals/profile.html',{'form':form, 'settings':userSettings})

#
#CHANGE PASSWORD
#
@login_required(login_url='../../login/')
def change_password_view(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request,"Your password has been changed successfully")
            return redirect(request.META['HTTP_REFERER'])
        else:
            messages.error(request,"Passwords do not match or does not meet the requirements")
            return redirect(request.META['HTTP_REFERER'])
    
      
#
#STAFF VIEW
#
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
#
#ADMIN VIEW
#
def admin_view(request):
    current_user = request.user
    if current_user.is_authenticated:
        if not current_user.is_superuser:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request,"portals/administrator/admin.html")
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