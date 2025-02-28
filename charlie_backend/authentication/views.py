import json
from django.conf import settings
from rest_framework.request import Request
from charlie.settings import APP_ENV, client_secrets
from authentication.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from authentication.serializers import UserSerializer
from rest_framework.exceptions import PermissionDenied
from django.db import transaction
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from django.shortcuts import redirect
from pathlib import Path
import os


if APP_ENV == "prod":
    call_back = "https://glacialapiv2.trixno.com/apiV1/web/google-callback/"
    redirect_url = "https://main.d2agie3gcrc35h.amplifyapp.com/"
else:
    call_back = "https://glacialapiv2.trixno.com/apiV1/web/google-callback/"
    redirect_url = "https://main.d2agie3gcrc35h.amplifyapp.com/"


class GoogleAuthAPI(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format=None):
        custom_redirect = self.request.query_params.get('redirect', None)
        origin = request.META.get("HTTP_ORIGIN")
        flow = Flow.from_client_config(
            client_secrets,
            scopes=[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "openid",
            ],
            redirect_uri=call_back
            # redirect_uri = "http://127.0.0.1:8000/web/google-callback/"
            )
        state = {"origin" : origin}  
        
        if custom_redirect is not None and custom_redirect != '':
            state["custom_redirect"]=str(custom_redirect)
            
        auth_url, _ = flow.authorization_url(prompt='consent', state=json.dumps(state)) 
        return Response({'message':auth_url})


class GoogleAuthCallback(APIView):
    permission_classes = (permissions.AllowAny, )
    
    @transaction.atomic
    def get(self, request, format=None):
        try:
            code = self.request.query_params.get('code', None)
            state = self.request.query_params.get('state', None)
            state = json.loads(state)
            state.pop("origin")
            flow = Flow.from_client_config(
                client_secrets,
                scopes=[
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                    "openid",
                ],
                redirect_uri=call_back
            )
            flow.fetch_token(code=code)
            
            custom_url = state.get('custom_redirect')
            final_redirect_url = custom_url if custom_url else redirect_url

            session = flow.authorized_session()
            profile = session.get('https://www.googleapis.com/userinfo/v2/me').json()
            if profile['verified_email']:
                try:
                    user= User.objects.get(email=profile['email'])
                    if user.is_active:
                        token = RefreshToken.for_user(user)
                        return redirect(f"{final_redirect_url}?is_authorised=true&access_token={token.access_token}&refresh_token={token}")
                    else:
                        return redirect(f"{final_redirect_url}?is_authorised=false&message=exception_occuredd")
                except Exception as e:
                    email = profile['email']
                    username = email.split('@')[0] + "@gtrip.com"
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{email.split('@')[0]}{counter}@gtrip.com"
                        counter += 1
                    user= User.objects.create(email=email,contact=None,is_active=True,first_name=profile.get('given_name', ''),last_name=profile.get('family_name', ''),username=username)
                    if user.is_active:
                        token = RefreshToken.for_user(user)
                        return redirect(f"{final_redirect_url}?is_authorised=true&access_token={token.access_token}&refresh_token={token}")
                    else:
                        return redirect(f"{final_redirect_url}?is_authorised=false&message=exception_occuredd")
        except Exception as e:
            print(e)
            return redirect(f"{redirect_url}?is_authorised=false&message={str(e)}")
