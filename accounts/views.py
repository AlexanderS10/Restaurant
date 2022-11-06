from knox.models import AuthToken
from rest_framework.decorators import api_view
from rest_framework import generics, filters, status, pagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from django.shortcuts import render
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication
from .forms import *
from .models import *
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def home_view(request):
    return render(request, "home.html", context={})

def handler404(request, exception):
    return render(request, 'pages/404.html', status=404)

def handler404_view(request):
    return render(request, 'pages/404.html', status=404)


@api_view(['GET'])
def search_users_view(request):
    print(request.user)
    return Response({"message": "Action Denied"}, status=status.HTTP_200_OK)


class CustomPagination(pagination.PageNumberPagination):
    page_size = 20


# generics provides with a get handler
class SearchUsersAPIView(generics.ListAPIView, pagination.PageNumberPagination):
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    filter_backends = (filters.SearchFilter,)
    queryset = CustomUser.objects.get_queryset().order_by('-date_joined')
    #authentication_classes = [restaurant.rest_api.dev.DevAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = userSerializer
    pagination_class = CustomPagination
    ordering = ['date_joined']


class AdminUserInfoUpdate(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = userDetailedSerializer
    #queryset = CustomUser.objects.all()

    def get(self, request, user_id):
        if request.user.is_anonymous or request.user.is_user_superuser() == False:
            return Response({"message": "Action Denied"})
        instance = CustomUser.objects.get(id=user_id)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def delete(self, request, user_id):
        if request.user.is_anonymous or request.user.is_user_superuser() == False:
            return Response({"message": "Action Denied"})
        user = CustomUser.objects.get(id=user_id)
        serializer = self.get_serializer(user)
        user.delete()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def update(self, request, user_id):
        instance = CustomUser.objects.get(id=user_id)
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class CreateUserAPIView(generics.CreateAPIView):
    serializer_class = userDetailedSerializer


@api_view(['GET', 'POST'])
def reset_default_profile_image(request):
    print(request.data)
    default_image = "http://127.0.0.1:8000/media/defaults/profile_default.png"
    return Response({"image": default_image}, status=status.HTTP_200_OK)


@api_view(["PUT", "GET"])
def reset_profile_image(request):
    try:
        id = request.data["id"]
        user = CustomUser.objects.get(id=id)
        user.image = "defaults/profile_default.png"
        user.save()
        return Response({"message": "Reset Sucessfully"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "Incorrect or empty data sequence sent"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterUserAPI(generics.GenericAPIView):
    authentication_classes =[]
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    def post(self, request, *args, **kwargs):
        #print(request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        #serializer.save()
        return Response({"message":"User created successfully"}, status=status.HTTP_200_OK)

class LoginViewAPI(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]#explicitlty make sure it does not use the custom backend as it checks for cookies only 
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    @method_decorator(ensure_csrf_cookie)#include a csrf token to protect against csrf attacks 
    def post(self, request):
        serializer = LoginSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        response=None
        if(user is None):
            return Response({"message":"The user was not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            response=Response({"user": userSerializer(user, context=self.get_serializer_context()).data})
            token = AuthToken.objects.create(user)[1]
            response.set_cookie(
                'auth_token', token,#set token in cookie and http only so it cannot be accessed by js and managing xss attacks 
                httponly=True,
            )
        return response
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = userSerializer
    def get_object(self):
        return self.request.user

