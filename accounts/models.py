from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.fields import NullBooleanField
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


class MyAccountManager(BaseUserManager):
    def create_user(self, email, first_name, last_name , phone_number, password, **other_fields):
        if not email:
            raise ValueError(_("Users must have an email address."))
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, phone_number=phone_number, **other_fields)
        user.set_password(password)
        other_fields.setdefault('is_customer',True)
        user.save()
        return user

    def create_superuser(self, email, first_name, last_name , phone_number, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser',True)
        other_fields.setdefault('is_active', True)
        if other_fields.get('is_staff') is not True:
            raise ValueError("Superuser must be assigned to is_staff=True.")
        if other_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must be assigned to is_superuser=True.")
        return self.create_user(email,first_name,last_name,phone_number,password,**other_fields)

    def create_staff(self, email, first_name, last_name , phone_number, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser',False)
        other_fields.setdefault('is_active', True)
        if other_fields.get('is_staff') is not True:
            raise ValueError("Staff must be assigned to is_staff=True.")
        if other_fields.get('is_superuser') is not False:
            raise ValueError("Staff must not be set as is_superuser=False.")
        return self.create_user(email,first_name,last_name,phone_number,password,**other_fields)

def get_profile_image_filepath(self, filename):
    return f'profile_images/{self.pk}/{"profile_image.png"}'


def get_default_profile_image():
    return "profile_default.png"
# Create your models here.
class CustomUser (AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    first_name = models.CharField(
        verbose_name='first name', max_length=30, blank=True)
    last_name = models.CharField(
        verbose_name='last name', max_length=30, blank=True)
    phone_number = PhoneNumberField()
    date_joined = models.DateTimeField(
        verbose_name="date joined", auto_now_add=True)
    is_admin = models.BooleanField(default=False, verbose_name="Is the user an admin")
    is_staff = models.BooleanField(default=False, verbose_name="Is the user staff")
    is_active = models.BooleanField(default=False, verbose_name="")
    is_customer = models.BooleanField(default=False, verbose_name="Is the user a customer")
    is_superuser = models.BooleanField(default=False)
    profile_image = NullBooleanField
    objects= MyAccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name','phone_number']


def has_perm(self, perm, obj=None):
    return self.is_admin


def has_module_perms(self, app_label):
    return True


def get_full_name(self):
    full_name = '%s %s' % (self.first_name, self.last_name)
    return full_name.strip()


def get_short_name(self):
    return self.first_name


def __str__(self):
    return self.username

# create a new user



        


