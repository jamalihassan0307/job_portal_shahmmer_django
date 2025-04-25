from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html')

def index(request):
    return render(request, 'index.html')

def myjobs(request):
    return render(request, 'myjobs.html')

def profile(request):
    return render(request, 'profile.html')
