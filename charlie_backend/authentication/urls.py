from django.urls import path
from .views import GoogleAuthAPI, GoogleAuthCallback

urlpatterns = [
    path('google/init/', GoogleAuthAPI.as_view(), name='google-auth-init'),
    path('google/callback/', GoogleAuthCallback.as_view(), name='google-auth-callback'),
]