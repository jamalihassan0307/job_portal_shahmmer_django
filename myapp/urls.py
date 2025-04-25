from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('home/', views.home, name='home'),
    path('index/', views.index, name='index'),
    path('myjobs/', views.myjobs, name='myjobs'),
    path('profile/', views.profile, name='profile'),]
