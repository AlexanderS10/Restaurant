from django.forms.widgets import PasswordInput, TextInput, Widget
from accounts.models import CustomUser
from django import forms
from django.core.validators import RegexValidator
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm


User = get_user_model()
class LoginForm(forms.Form):
    email = forms.EmailField(required=True, max_length=100, widget=forms.EmailInput(attrs={
        'class': 'form-control validate',
        'id': 'id_username'
    }))
    password = forms.CharField(max_length=100, required=True, widget=forms.PasswordInput(attrs={
        'class': 'form-control validate',
        'id': 'id_password'
    }))
    #Verify if the email entered returns an existing user if not then an error will be printed
    def clean_email(self):
        email = self.cleaned_data.get("email")
        qs = User.objects.filter(email__iexact=email)
        if not qs.exists():
            raise forms.ValidationError("Incorrect Username or Password")
        return email

class RegisterForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ["email","first_name", "last_name", "phone_number"]
        
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
    #phone_number = PhoneNumberField(region='US')
  
    password2 = forms.CharField(max_length=100, required=True, widget=forms.PasswordInput(attrs={
        'class': 'form-control validate',
        'id': 'id_password2'
    }))

    #If a new user is trying to use an already registered email then it will print an error
    def clean_email(self):
        email = self.cleaned_data.get("email")
        qs = User.objects.filter(email__iexact=email)
        if qs.exists():
            raise forms.ValidationError("Email address already in use.")
        return email
    #Here it will be validated if the two passwords are the same otherwise an error w ill be shown
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if password is not None and password != password2:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data
    

    
    