from re import S
from django.contrib.auth.decorators import login_required
from django.http.response import Http404, JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from accounts.decorators import admin_only
from .serializers import *
# Create your views here.
#ADMIN MENU VIEW
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

#DISH CLASS VIEW will be used to minimize code when writing the views 
class DishDetail(APIView):
    def get_dish(self,pk):
        try:
            return Dish.objects.get(id=pk)
        except Dish.DoesNotExist:
            raise Http404
    @permission_classes([IsAuthenticated])
    def get(self, request, dish_id, *args, **kwargs):
        dish = self.get_dish(dish_id)
        serializer = DishSerializer(dish)
        return Response(serializer.data)
    @permission_classes([IsAuthenticated])
    def delete(self, request, dish_id, *args, **kwargs):
        dish = self.get_dish(dish_id)
        dish.delete()
        return Response({"message":"Dish has been deleted"},status=status.HTTP_204_NO_CONTENT)
    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        serializer = DishSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    def patch(self,request,dish_id,*args, **kwargs):
        dish = Dish.objects.get(id = dish_id)
        serializer = DishSerializer(instance=dish, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def dish_list_view(request, *args, **kwargs):
    qs = Dish.objects.all()
    serializer = DishSerializer(qs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_list_view(request, *args, **kwargs):
    qs = Dish_Category.objects.all()
    serializer = DishCategorySerializer(qs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dish_detail_view(request,dish_id ,*args, **kwargs):
    qs = Dish.objects.get(id = dish_id)
    if not qs:
        return Response ({}, status=404)
    serializer = DishSerializer(qs)
    return Response (serializer.data, status=200)



