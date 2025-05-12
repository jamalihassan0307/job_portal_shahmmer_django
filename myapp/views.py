from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib import messages
from .models import User, Job, Application, Role
from django.utils import timezone

def home(request):
    jobs = Job.objects.all().order_by('-createdAt')
    return render(request, 'home.html', {'jobs': jobs})

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid email or password')
    
    return render(request, 'index.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def profile(request):
    if request.method == 'POST':
        user = request.user
        user.fullName = request.POST.get('fullName')
        user.phone = request.POST.get('phone')
        user.resume = request.POST.get('resume')
        user.profile_picture = request.POST.get('profile_picture')
        user.save()
        messages.success(request, 'Profile updated successfully')
        return redirect('profile')
    
    return render(request, 'profile.html')

@login_required
def my_jobs(request):
    applications = Application.objects.filter(user=request.user).order_by('-appliedAt')
    return render(request, 'myjobs.html', {'applications': applications})

@login_required
def apply_job(request, job_id):
    if request.method == 'POST':
        job = Job.objects.get(id=job_id)
        experience = request.POST.get('experience')
        
        # Check if already applied
        if Application.objects.filter(job=job, user=request.user).exists():
            messages.error(request, 'You have already applied for this job')
            return redirect('home')
        
        Application.objects.create(
            job=job,
            user=request.user,
            experience=experience,
            status='pending'
        )
        messages.success(request, 'Application submitted successfully')
        return redirect('my_jobs')
    
    job = Job.objects.get(id=job_id)
    return render(request, 'apply_job.html', {'job': job})

@login_required
def post_job(request):
    if request.method == 'POST':
        Job.objects.create(
            title=request.POST.get('title'),
            description=request.POST.get('description'),
            company=request.POST.get('company'),
            logo=request.POST.get('logo'),
            jobType=request.POST.get('jobType'),
            salary=request.POST.get('salary'),
            createdAt=int(timezone.now().timestamp()),
            user=request.user
        )
        messages.success(request, 'Job posted successfully')
        return redirect('home')
    
    return render(request, 'post_job.html')

