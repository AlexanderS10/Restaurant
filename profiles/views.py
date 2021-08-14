from django.shortcuts import render

# Create your views here.
def customer_view(request):
    return render(request,"profiles/customer.html")
def staff_view(request):
    return render(request,"profiles/staff.html")
def admin_view(request):
    return render(request,"profiles/admin.html")