import os
import json
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from django.utils.timezone import now
from authentication.models import GoogleUser
from charlie.utils import encrypt_token, decrypt_token

User = get_user_model()

if settings.APP_ENV == "prod":
    call_back = settings.GOOGLE_REDIRECT_URI
    redirect_url = settings.GOOGLE_CLIENT_REDIRECT
else:
    call_back = "http://localhost:8080/api/auth/google/callback/"
    redirect_url = "http://localhost:3000/"


class GoogleAuthAPI(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        custom_redirect = request.query_params.get("redirect", None)
        origin = request.META.get("HTTP_ORIGIN")

        flow = Flow.from_client_config(
            settings.CLIENT_SECRETS,
            scopes=[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "openid",
                "https://www.googleapis.com/auth/drive.file", 
            ],
            redirect_uri=call_back,
        )
        state = {"origin": origin}
        if custom_redirect:
            state["custom_redirect"] = str(custom_redirect)

        auth_url, _ = flow.authorization_url(prompt="consent", state=json.dumps(state))
        return Response({"auth_url": auth_url})


class GoogleAuthCallback(APIView):
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    def get(self, request, format=None):
        try:
            code = request.query_params.get("code", None)
            state = json.loads(request.query_params.get("state", "{}"))
            custom_url = state.get("custom_redirect", redirect_url)

            flow = Flow.from_client_config(
                settings.CLIENT_SECRETS,
                scopes=[
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                    "openid",
                    "https://www.googleapis.com/auth/drive.file",                 
                ],
                redirect_uri=call_back,
            )
            flow.fetch_token(code=code)

            session = flow.authorized_session()
            profile = session.get("https://www.googleapis.com/userinfo/v2/me").json()

            if not profile.get("verified_email"):
                return Response({"is_authorised": False, "message": "Email not verified."})

            user, created = User.objects.get_or_create(
                email=profile["email"],
                defaults={
                    "first_name": profile.get("given_name", ""),
                    "last_name": profile.get("family_name", ""),
                    "is_active": True,
                    "username": profile["email"],
                },
            )

            google_user, _ = GoogleUser.objects.update_or_create(
                user=user,
                defaults={
                    "google_id": profile["id"],
                    "access_token": encrypt_token(flow.credentials.token),
                    "refresh_token": encrypt_token(flow.credentials.refresh_token)
                    if flow.credentials.refresh_token
                    else None,
                    "token_expiry": flow.credentials.expiry,
                },
            )

            if user.is_active:
                token = RefreshToken.for_user(user)
                return Response(
                        {
                            "is_authorised": True,
                            "access_token": str(token.access_token),  # ✅ Convert to string
                            "refresh_token": str(token),  # ✅ Convert to string
                            "user": {
                                "user_id" : user.id,
                                "email": user.email,
                                "first_name": user.first_name,
                                "last_name": user.last_name,
                            },
                        }
                    )
            else:
                return Response({"is_authorised": False, "message": "User is not active."})
        except Exception as e:
            return Response({"is_authorised": False, "message": str(e)})
