from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

# Create your views here.
# @login_required(login_url='login')
def customer_view(request):
    current_user = request.user
    if current_user.is_authenticated:
        if not current_user.is_customer:
            messages.error(request,"You do not have access to this page")
            return redirect('login')
        return render(request,"profiles/customer.html")
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