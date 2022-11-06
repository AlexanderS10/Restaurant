from asyncio import exceptions
from logging import exception
from django.http.response import Http404
from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model
from knox.auth import TokenAuthentication
from rest_framework.authentication import CSRFCheck
User = get_user_model()


class DevAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        user = User.objects.get(id=6)
        return (user, None)
def enforce_csrf(request):
    check = CSRFCheck()
    check.process_request(request)
    reason = check.process_view(request, None, (),{})
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed ' % reason)
    
class CookieAuthetication(TokenAuthentication):
    def authenticate(self, request):
        try:
            token = request.COOKIES['auth_token'].encode('utf8')
            print("Custom authetication set")
            return self.authenticate_credentials(token)
        except Exception as e:#if the token is not found it will give me an error 
            print(e)
            raise Http404
