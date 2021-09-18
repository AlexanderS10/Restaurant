"""restaurant URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib import admin
from django.urls import path
from accounts.views import handler404_view, home_view, logout_view, register_view
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from accounts.views import login_view
from profiles.views import *
from accounts.forms import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name=""),
    path('home/', home_view, name='home'),
    path('register/', register_view, name='register'),
    path('login/',login_view, name='login'),
    # path('accounts/login/'),
    path('customer/',customer_view),
    path('staff/', staff_view),
    path('logout/',logout_view),
    path('administration/',admin_view),
    #here the users can input the email for the account they want to reset the passaword for
    path('password_reset/', auth_views.PasswordResetView.as_view(template_name='registration/password_reset.html'), name='password_reset'),
    #Here is displayed after the user has successfully started the reset proccess
    path('password_reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset_done.html'),name='password_reset_done'),
    #Here the user can reset their password to a new one
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='registration/password_reset_confirm.html'),name='password_reset_confirm'),
    #Here the user will get the message that they have successfully reset their passwords
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset_success.html'), name='password_reset_complete'),

    path('userdetails/', user_details_view),
    path('404/', handler404_view)
]
if settings.DEBUG:
    urlpatterns+=static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
handler404='accounts.views.handler404'