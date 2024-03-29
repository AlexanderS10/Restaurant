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
from django.urls.conf import include
from accounts.views import handler404_view, home_view
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from profiles.views import *
from accounts.forms import *
from django.views.generic import TemplateView
from accounts import urls
urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('', home_view, name=""),
    path('home/', home_view, name='home'),
    # path('accounts/login/'),
    path('',include('profiles.urls')),
    path('staff/', staff_view),
    #here the users can input the email for the account they want to reset the passaword for
    path('password_reset/', auth_views.PasswordResetView.as_view(template_name='registration/password_reset.html'), name='password_reset'),
    #This is displayed after the user has successfully started the reset proccess
    path('password_reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset_done.html'),name='password_reset_done'),
    #Here the user can reset their password to a new one
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='registration/password_reset_confirm.html'),name='password_reset_confirm'),
    #Here the user will get the message that they have successfully reset their passwords
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset_success.html'), name='password_reset_complete'),
    #API paths
    path('api/', include('restaurant.api_urls')),
    path('api/', include('accounts.urls')),
    path('404/', handler404_view),
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('csrf/',csrf),
    path('ping/',ping),
    path('react/', TemplateView.as_view(template_name = 'react.html')),
]
if settings.DEBUG:
    urlpatterns+=static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
    urlpatterns+=static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
handler404='accounts.views.handler404'