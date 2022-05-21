from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.contrib import messages
from django.contrib.auth.decorators import login_required
# Create your views here.
@login_required(login_url='login')
def book_table_view(request,date_sent):
    print ("This is the date",date_sent)
    date_use = datetime.strptime(date_sent, '%m-%d-%Y')
    datetime_server = datetime.now()
    if date_use.date() < datetime_server.date() and date_use is not None:
        messages.error(request,"Cannot create reservation on invalid day")
        return redirect('customer')

    return render(request, 'portals/customer/customer_table_booking.html')

def book_event_view(request,date_sent):
    date_use = datetime.strptime(date_sent, '%m-%d-%Y')
    datetime_server = datetime.now()
    if date_use.date() < datetime_server.date() and date_use is not None:
        messages.error(request,"Cannot create reservation on invalid day")
        return redirect('customer')
    return render(request, "portals/customer/customer_event_booking.html")

