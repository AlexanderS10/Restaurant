from django.forms import ModelForm, fields
from django import forms
from django.contrib.auth import get_user_model
from menu.models import *

class CreateCategory(ModelForm):
    class Meta:
        model = Dish_Category
        fields = ["id"]
    id = forms.CharField(required=True, max_length=25, widget=forms.TextInput(attrs={
        "class":"form-control"
        }))
    def clean_category(self):
        id = self.cleaned_data.get("id")
        qs = Dish_Category.objects.filter(email__iexact=id)
        if qs.exists():
            raise forms.ValidationError("Such category already exists.")
        return id