from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Role

User = get_user_model()

def save_google_user(backend, user, response, *args, **kwargs):
    if backend.name == 'google-oauth2':
        with transaction.atomic():
            # Get or create user role
            user_role, created = Role.objects.get_or_create(name='user')
            
            # Update user details from Google
            if not user.first_name and response.get('name'):
                user.first_name = response.get('name', '').split()[0]
                user.last_name = ' '.join(response.get('name', '').split()[1:])
            
            if not user.email and response.get('email'):
                user.email = response.get('email')
            
            # Always set the role
            user.role = user_role
            
            # Save the user
            user.save() 