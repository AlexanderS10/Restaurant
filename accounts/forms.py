from django.contrib.auth.forms import AuthenticationForm
from django.forms.widgets import PasswordInput, TextInput, Widget
from accounts.models import CustomUser
from django import forms
from django.core.validators import RegexValidator
from django.contrib.auth import get_user_model
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.forms import ReadOnlyPasswordHashField

User = get_user_model()
# class UserLoginForm(AuthenticationForm):
#     def __init__(self, *args, **kwargs):
#         super(UserLoginForm, self).__init__(*args, **kwargs)

#     email = forms.CharField(required=True, max_length=100, widget=forms.TextInput(attrs={
#             'class': 'form-control validate',
#             'id': 'id_username'
#         }))
#     password = forms.CharField(max_length=100, required=True, widget=forms.PasswordInput(attrs={
#             'class': 'form-control validate',
#             'id': 'id_password'
#     }))

class LoginForm(forms.Form):

    email = forms.EmailField(required=True, max_length=100, widget=forms.EmailInput(attrs={
        'class': 'form-control validate',
        'id': 'id_username'
    }))
    password = forms.CharField(max_length=100, required=True, widget=forms.PasswordInput(attrs={
        'class': 'form-control validate',
        'id': 'id_password'
    }))
    def clean_email(self):
        email = self.cleaned_data.get("email")
        qs = User.objects.filter(email__iexact=email)
        if not qs.exists():
            raise forms.ValidationError("This is an invalid user.")
        return email
class RegisterForm(forms.Form):
    class Meta:
        model = User
        fields = ["email","first_name", "last_name", "phone", "password"]
    email = forms.EmailField(required=True, max_length=100, widget=forms.EmailInput(attrs={
        'class': 'form-control validate',
        'id': 'id_username',
        
    }))
    first_name = forms.CharField(required=True, max_length=15, widget=forms.TextInput(attrs={
        "class":"form-control"
    }))
    last_name = forms.CharField(required=True, max_length=15, widget=forms.TextInput(attrs={
        "class":"form-control"
    }))
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    #Here I tried to implement the phone number field same as in the model in admin but was not successful. Instead I will allow any input with no message but it will not create the object
    phone_number = forms.CharField(validators=[phone_regex], required=True, max_length=15, widget=forms.TextInput(attrs={
        "class":"form-control"
    }))
    password1 = forms.CharField(max_length=100, required=True, widget=forms.PasswordInput(attrs={
        'class': 'form-control validate',
        'id': 'id_password'
    }))
    password2 = forms.CharField(max_length=100, required=True, widget=forms.PasswordInput(attrs={
        'class': 'form-control validate',
        'id': 'id_password2'
    }))

    def clean_email(self):#If a new user is trying to use an already registered email then it won't work
        email = self.cleaned_data.get("email")
        qs = User.objects.filter(email__iexact=email)
        if qs.exists():
            raise forms.ValidationError("Email Address already in use.")
        return email
    def clean(self):#Here I will validate the passwords being the same otherwise an error will be printed
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if password1 is not None and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")
        
        return cleaned_data

    
    