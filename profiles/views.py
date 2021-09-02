from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from accounts.models import CustomUser

# Create your views here.
# @login_required(login_url='login')
def user_details_view(request, *args, **kwargs): #REST API for detailing some basic info about the user that is using the system at the moment
    current_user = request.user
    id = current_user.id
    if current_user.is_authenticated:
        if not current_user.is_customer:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        obj = CustomUser.objects.get(id=id)
        data ={
            "id" : id,
            "name" : obj.first_name,
            "last_name" : obj.last_name
        }
        try:
            obj = CustomUser.objects.get(id=id)
            data ['content'] =  obj.content
        except:
            #data['message'] = "Not Found"
            status = 404
        return JsonResponse(data)
    else:
        messages.error(request,"You need to be logged in to access this page")
        return redirect('login')
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