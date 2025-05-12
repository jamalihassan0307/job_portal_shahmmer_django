from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if not Role.objects.filter(name='admin').exists():
            Role.objects.create(name='admin')
        extra_fields['role'] = Role.objects.get(name='admin')
        return self._create_user(username, email, password, **extra_fields)

class Role(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class User(AbstractUser):
    fullName = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    resume = models.TextField(null=True, blank=True)
    profile_picture = models.TextField(null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    objects = CustomUserManager()

    def __str__(self):
        return self.username

class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    company = models.CharField(max_length=100)
    logo = models.TextField(null=True, blank=True)
    jobType = models.CharField(max_length=50)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    createdAt = models.BigIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    experience = models.CharField(max_length=255)
    appliedAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.job.title}"
