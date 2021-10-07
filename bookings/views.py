from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
@login_required(login_url='login')
def book_table_view(request):
    form = request.POST or None;
    return render(request, 'portals/customer_table_booking.html')