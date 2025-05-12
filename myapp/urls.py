from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('my-jobs/', views.my_jobs, name='my_jobs'),
    path('apply-job/<int:job_id>/', views.apply_job, name='apply_job'),
    path('post-job/', views.post_job, name='post_job'),
    path('edit-job/<int:job_id>/', views.edit_job, name='edit_job'),
    path('delete-job/<int:job_id>/', views.delete_job, name='delete_job'),
]
