from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib import messages
from .models import User, Job, Application, Role
from django.utils import timezone

@login_required
def home(request):
    jobs = Job.objects.all().order_by('-createdAt')
    return render(request, 'home.html', {'jobs': jobs})

def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
        
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, 'Invalid email or password')
        except User.DoesNotExist:
            messages.error(request, 'No account found with this email')
    
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
    job = get_object_or_404(Job, id=job_id)
    
    if request.method == 'POST':
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
    
    return render(request, 'apply_job.html', {'job': job})

@login_required
def post_job(request):
    if not request.user.role.name == 'admin':
        messages.error(request, 'You do not have permission to post jobs')
        return redirect('home')
        
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

@login_required
def edit_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    
    if not request.user.role.name == 'admin':
        messages.error(request, 'You do not have permission to edit jobs')
        return redirect('home')
        
    if request.method == 'POST':
        job.title = request.POST.get('title')
        job.description = request.POST.get('description')
        job.company = request.POST.get('company')
        job.logo = request.POST.get('logo')
        job.jobType = request.POST.get('jobType')
        job.salary = request.POST.get('salary')
        job.save()
        messages.success(request, 'Job updated successfully')
        return redirect('home')
    
    return render(request, 'edit_job.html', {'job': job})

@login_required
def delete_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    
    if not request.user.role.name == 'admin':
        messages.error(request, 'You do not have permission to delete jobs')
        return redirect('home')
        
    if request.method == 'POST':
        job.delete()
        messages.success(request, 'Job deleted successfully')
    
    return redirect('home')

