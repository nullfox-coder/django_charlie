import io
import json
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
from google.oauth2.credentials import Credentials
from authentication.models import GoogleUser
from google_drive.models import DriveFile
from google_drive.serializers import DriveFileSerializer
from authentication.utils import get_google_credentials

class GoogleDriveAuthView(APIView):
    """
    View to handle Google Drive authentication.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            google_user = GoogleUser.objects.get(user=request.user)
            return Response({
                "status": "connected",
                "google_user_id": google_user.google_id,
                "expiry": google_user.token_expiry.isoformat()
            })
        except GoogleUser.DoesNotExist:
            return Response({
                "status": "disconnected",
                "connect_url": f"/auth/google/init/"
            })

class GoogleDriveFilesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        drive_files = DriveFile.objects.filter(user=request.user)
        serializer = DriveFileSerializer(drive_files, many=True)
        return Response({"status": "success", "files": serializer.data})

class GoogleDriveUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        try:
            credentials = get_google_credentials(request.user)
            if not credentials:
                return Response({"error": "Google account not connected"}, status=400)
            
            drive_service = build('drive', 'v3', credentials=credentials)
            file_obj = request.FILES.get('file')
            if not file_obj:
                return Response({"error": "No file provided", "status": "failed"}, status=400)

            file_metadata = {'name': file_obj.name}
            media = MediaIoBaseUpload(io.BytesIO(file_obj.read()), mimetype=file_obj.content_type, resumable=True)
            file = drive_service.files().create(body=file_metadata, media_body=media, fields='id,name,mimeType').execute()
            
            drive_file = DriveFile.objects.create(
                user=request.user,
                file_id=file['id'],
                file_name=file['name'],
                mime_type=file['mimeType']
            )
            
            return Response({"status": "success", "file": DriveFileSerializer(drive_file).data})
        
        except GoogleUser.DoesNotExist:
            return Response({"error": "Google account not connected"}, status=400)

from django.http import HttpResponse
from googleapiclient.http import MediaIoBaseDownload
import io

class GoogleDriveDownloadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, file_id):
        try:
            credentials = get_google_credentials(request.user)
            if not credentials:
                return Response({"error": "Google account not connected"}, status=400)
            
            drive_service = build('drive', 'v3', credentials=credentials)
            file_metadata = drive_service.files().get(fileId=file_id).execute()
            
            request = drive_service.files().get_media(fileId=file_id)
            file_content = io.BytesIO()
            downloader = MediaIoBaseDownload(file_content, request)
            
            done = False
            while not done:
                status, done = downloader.next_chunk()
            
            file_content.seek(0)  # Reset pointer to start

            # Return the file as an attachment for download
            response = HttpResponse(
                file_content.read(),
                content_type=file_metadata.get("mimeType", "application/octet-stream")
            )
            response['Content-Disposition'] = f'attachment; filename="{file_metadata["name"]}"'
            
            return response  # ✅ Returns the file directly for download
        
        except GoogleUser.DoesNotExist:
            return Response({"error": "Google account not connected"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
