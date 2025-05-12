from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Role, Job, Application

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'fullName', 'phone', 'role')
    search_fields = ('username', 'email', 'fullName')
    list_filter = ('role',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('fullName', 'email', 'phone', 'resume', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'role')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'fullName', 'phone', 'role'),
        }),
    )

class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'jobType', 'salary', 'user')
    search_fields = ('title', 'company')
    list_filter = ('jobType',)

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'status', 'appliedAt')
    search_fields = ('user__username', 'job__title')
    list_filter = ('status',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Role)
admin.site.register(Job, JobAdmin)
admin.site.register(Application, ApplicationAdmin)
