from rest_framework import serializers
from .models import DriveFile

class DriveFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveFile
        fields = ['id', 'user', 'file_id', 'file_name', 'mime_type', 'created_at']
