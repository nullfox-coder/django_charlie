from django.urls import path, include

from .views import (
    GoogleDriveAuthView, 
    GoogleDriveFilesView, 
    GoogleDriveUploadView,
    GoogleDriveDownloadView
)

urlpatterns = [
    path('auth/', GoogleDriveAuthView.as_view(), name='drive-auth'),
    path('files/', GoogleDriveFilesView.as_view(), name='drive-files'),
    path('upload/', GoogleDriveUploadView.as_view(), name='drive-upload'),
    path('download/<str:file_id>/', GoogleDriveDownloadView.as_view(), name='drive-download'),
]
