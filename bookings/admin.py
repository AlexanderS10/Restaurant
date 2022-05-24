from django.contrib import admin

from bookings.models import *

# Register your models here.
admin.site.register(TableReservation)
admin.site.register(Room)
admin.site.register(Table)
admin.site.register(RoomImages)
admin.site.register(RoomReservation)