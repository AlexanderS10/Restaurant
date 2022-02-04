from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.decorators import admin_only
from .serializers import *
# Create your views here.
#ADMIN MENU VIEW
#
@login_required(login_url='login')
@admin_only
def admin_menu(request, *args, **kwargs):
    return render(request, 'portals/administrator/admin_menu.html')

def admin_dish_api(request, *args, **kwargs):
    data = request.POST or None
    serializer = DishSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    return JsonResponse({},status=400)

@api_view(['GET'])
def dish_list_view(request, *args, **kwargs):
    qs = Dish.objects.all()
    serializer = DishSerializer(qs, many=True)
    return Response(serializer.data)