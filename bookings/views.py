from functools import partial
from urllib import response
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .serializers import *
from rest_framework import generics,serializers, status
from .models import *
from rest_framework.response import Response
# Create your views here.
@login_required(login_url='login')
def book_table_view(request,date_sent):
    print ("This is the date",date_sent)
    date_use = datetime.strptime(date_sent, '%m-%d-%Y')
    datetime_server = datetime.now()
    if date_use.date() < datetime_server.date() and date_use is not None:
        messages.error(request,"Cannot create reservation on invalid day")
        return redirect('customer')

    return render(request, 'portals/customer/customer_table_booking.html')

def book_event_view(request,date_sent):
    date_use = datetime.strptime(date_sent, '%m-%d-%Y')
    datetime_server = datetime.now()
    if date_use.date() < datetime_server.date() and date_use is not None:
        messages.error(request,"Cannot create reservation on invalid day")
        return redirect('customer')
    return render(request, "portals/customer/customer_event_booking.html")

class RoomsAPIView(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.get_queryset()

class TablesListAPIView(generics.ListAPIView):
    serializer_class = TableSerializer
    queryset =  Table.objects.all()

class TableAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TableSerializer
    queryset = Table.objects.all()
    def put(self, request,id):
        try:
            instance = Table.objects.get(id = id)#get the instance 
            if instance:#if the instance is found then it will update with the new data
                serializer = self.get_serializer(instance, data = request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message":"Invalid data submitted"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"message":"There was an error"}, status=status.HTTP_404_NOT_FOUND)
        except:#An error will be thrown if the desired object is not found 
            serializer = self.get_serializer(data = request.data)
            if serializer.is_valid():#Check if the data sent is valid and create a new object
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message":"Request error"}, status=status.HTTP_404_NOT_FOUND)     
    def get(self, request, id):
        try:
            instance = Table.objects.get(id=id)
            if instance:
                serializer = self.get_serializer(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"message":"There was an error"}, status=status.HTTP_404_NOT_FOUND)
class CreateTableAPIView(generics.CreateAPIView):
    serializer_class = TableSerializer
    def post(self, request):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"message":"The data provided is invalid"})
class CreateRoomAPIView(generics.CreateAPIView):
    serializer_class=RoomSerializer
    def post(self, request):
        print(request.data)
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            #serializer.save()
            return Response({"message":"The room was created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"message":"The data provided is invalid"}, status=status.HTTP_406_NOT_ACCEPTABLE)
class CreateRoomImageAPIView(generics.CreateAPIView):
    serializer_class = RoomImageSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Image added successfully"}, status=status.HTTP_201_CREATED)
        return Response({"message":"Image could not be added"}, status=status.HTTP_406_NOT_ACCEPTABLE)


