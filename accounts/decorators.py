from django.shortcuts import render
#Here we will create functions that make sure and make it easy users will not access other people links and pages
def admin_only(view_function):
    def wrap(request, *args, **kwargs):
        if request.user.is_user_superuser():
            return view_function(request, *args, **kwargs)
        else:
            #Instead of redirecting to a certain page, I will redirect them to the 404 page leaving it ambiguous if users other than admins guessed a link
            return render(request, "pages/404.html")
    return wrap

def customer_only(view_function):
    def wrap(request, *args, **kwargs):
        if request.user.is_user_customer():
            return view_function(request, *args, **kwargs)
        else:
            #Instead of redirecting to a certain page, I will redirect them to the 404 page leaving it ambiguous if users other than admins guessed a link
            return render(request, "pages/404.html")
    return wrap

def staff_only(view_function):
    def wrap(request, *args, **kwargs):
        if request.user.is_user_staff():
            return view_function(request, *args, **kwargs)
        else:
            #Instead of redirecting to a certain page, I will redirect them to the 404 page leaving it ambiguous if users other than staff guessed a link
            return render(request, "pages/404.html")
    return wrap