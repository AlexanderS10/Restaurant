from xml.dom import ValidationErr
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.http.response import Http404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .serializers import *
from rest_framework import generics,serializers, status
from .models import *
from rest_framework.parsers import MultiPartParser, FormParser
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
    queryset = ''
    def get_object(self, id):#Here we check if an object exists and return a 404 error if it does not 
        try:
            return Table.objects.get(id=id)
        except (Table.DoesNotExist):
            raise Http404
    def put(self, request):
        tableList = request.data
        instance = None
        self.get_object(id=50)
        # for table in tableList:
        #     print(table['id'], self.get_object(id=table['id']))
        return Response({"message":"Yeet"}, status=status.HTTP_200_OK)

    def get(self, request, id):
        try:
            instance = Table.objects.get(id=id)
            if instance:
                serializer = self.get_serializer(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"message":"There was an error"}, status=status.HTTP_404_NOT_FOUND)

class TablesListAPIView(generics.ListAPIView):
    serializer_class = TableSerializer
    queryset=''
    def get(self,request,room_id):
        tables = Table.objects.filter(room=room_id)
        serializer = self.get_serializer(tables, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK )


class CreateTableAPIView(generics.CreateAPIView):
    serializer_class = TableSerializer
    def post(self, request):
        serializer = self.get_serializer(data = request.data)
        if(request.data['id']!=request.data['table_number']):#This will ensure that the id and the table number is unique
            return Response({"message":"Table id problem found, try again"})
        if(float(request.data['x'])>=1200 or float(request.data['x'])<0 or float(request.data['y'])>700 or float(request.data['y'])<0):
            return Response({"message":"There was an error in the table position"}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            #serializer.save()
            return Response({"message":"Table created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class CreateRoomAPIView(generics.CreateAPIView):
    serializer_class=RoomSerializer
    def post(self, request, format=None):
        print(request.data)
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"message":"Room cannot be created, check the data and try again"}, status=status.HTTP_406_NOT_ACCEPTABLE)
class CreateRoomImageAPIView(generics.CreateAPIView):
    serializer_class = RoomImageSerializer
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        print(request.FILES)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            #import time
            serializer.save()
            return Response({"message":"Image added successfully"}, status=status.HTTP_201_CREATED)
        return Response({"message":"There was an error uploading the image"}, status=status.HTTP_406_NOT_ACCEPTABLE)
