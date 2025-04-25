from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('myjobs/', views.myjobs, name='myjobs'),
    path('profile/', views.profile, name='profile'),
]
