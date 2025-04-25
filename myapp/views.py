from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse('<h1>Welcome to your Django project!</h1>')

def index(request):
    return render(request, 'index.html')

def myjobs(request):
    return render(request, 'myjobs.html')

def profile(request):
    return render(request, 'profile.html')
