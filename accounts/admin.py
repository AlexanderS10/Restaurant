from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea
# Register your models here.
from .models import CustomUser
class UserAdminConfig(UserAdmin):
    model = CustomUser
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',) #This is for the ordering from newest to oldest user
    list_filter = ('email', 'first_name')
    list_display = ('email', 'first_name','last_name','is_active','is_staff','is_superuser','is_customer','date_joined')
    fieldsets = (
        (None,{'fields':('image','email','first_name','last_name','password')}),
        ('Permissions',{'fields':('is_staff','is_active','is_superuser','is_customer','is_admin',)}),
        ('Personal',{'fields':('phone_number','comments',)}),
    )
    # formfield_overrides = {
    #     CustomUser.about: {'widget': Textarea(attrs={'rows': 10, 'cols': 40})},
    # }
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','first_name', 'last_name', 'phone_number', 'password1', 'password2','comments', 'is_active', 'is_staff','is_superuser','is_customer','is_admin')}
         ),
    )

admin.site.register(CustomUser, UserAdminConfig)
