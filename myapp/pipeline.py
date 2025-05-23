from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Role

User = get_user_model()

def get_or_create_role(strategy, details, user=None, *args, **kwargs):
    if user is None:
        user_role, created = Role.objects.get_or_create(name='user')
        return {'role': user_role}
    return {}

def create_user(strategy, details, backend, user=None, *args, **kwargs):
    if user is None:
        # Get the user role
        user_role = Role.objects.get(name='user')
        
        # Create user with role
        user = strategy.create_user(
            username=details.get('username'),
            email=details.get('email'),
            first_name=details.get('first_name', ''),
            last_name=details.get('last_name', ''),
            role=user_role
        )
    return {'is_new': True, 'user': user}

def save_google_user(backend, user, response, *args, **kwargs):
    if backend.name == 'google-oauth2':
        with transaction.atomic():
            # Update user details from Google
            if not user.first_name and response.get('name'):
                user.first_name = response.get('name', '').split()[0]
                user.last_name = ' '.join(response.get('name', '').split()[1:])
            
            if not user.email and response.get('email'):
                user.email = response.get('email')
            
            # Save the user
            user.save() 