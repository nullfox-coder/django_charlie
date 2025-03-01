from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from authentication.models import GoogleUser
from charlie.utils import decrypt_token, encrypt_token
from django.utils.timezone import now
from django.conf import settings

def get_google_credentials(user):
    """Fetch user’s Google credentials, refresh if expired."""
    try:
        google_user = GoogleUser.objects.get(user=user)

        # Decrypt the stored tokens
        access_token = decrypt_token(google_user.access_token)
        refresh_token = decrypt_token(google_user.refresh_token) if google_user.refresh_token else None

        # Load credentials
        credentials = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.CLIENT_SECRETS["web"]["client_id"],
            client_secret=settings.CLIENT_SECRETS["web"]["client_secret"],
        )

        # Check if token is expired and refresh if necessary
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())  # This gets a new access token

            # Update stored tokens
            google_user.access_token = encrypt_token(credentials.token)
            google_user.token_expiry = credentials.expiry
            google_user.save()

        return credentials

    except GoogleUser.DoesNotExist:
        return None
