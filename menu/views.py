from datetime import datetime
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
#
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
#
#DISH CLASS VIEW will be used to minimize code when writing the views 
#
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
    def put(self,request,dish_id,*args, **kwargs):
        dish = Dish.objects.get(id = dish_id)
        serializer = DishSerializer(instance=dish, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#DISH CATEGORY CLASS VIEW
#
class DishCategory(APIView):
    def get_category(self, id):
        try:
            return Dish_Category.objects.get(id=id)
        except:
            raise Http404
    @permission_classes([IsAuthenticated])
    def get(self,request,id,*args, **kwargs):
        category = self.get_category(id)
        serializer = DishCategorySerializer(category)
        return Response(serializer.data)
    
    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        serializer = DishCategorySerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    @permission_classes([IsAuthenticated])
    def delete(self, request, id, *args, **kwargs):
        category = self.get_category(id)
        qs = Dish.objects.filter(category=category)#A category cannot be deleted if dishes contain such category
        if qs.exists():
            return Response({"message":"Some dishes contain this category remove them first before proceding"}, status = status.HTTP_400_BAD_REQUEST)
        category.delete()
        return Response({"message":"Dish categoty has been deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    @permission_classes([IsAuthenticated])
    def patch(self, request, id , *args, **kwargs):
        category = self.get_category(id)
        serializer = DishCategorySerializer(instance=category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_category(request, *args, **kwargs):
    serializer = DishCategorySerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dish_list_view(request, *args, **kwargs):
    qs = Dish.objects.all()
    serializer = DishSerializer(qs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_list_view(request, *args, **kwargs):
    qs = Dish_Category.objects.all().order_by('-date_created')
    serializer = DishCategorySerializer(qs, many=True)
    return Response(serializer.data)




