import logging
from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)  # Logging setup

class PingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Check database connection
            db_status = "ok"
            try:
                connections["default"].cursor()
            except OperationalError as e:
                db_status = "unavailable"
                logger.error(f"Database connection error: {e}")

            return JsonResponse({
                "status": "ok",
                "database": db_status,
                "message": "API is running"
            }, status=200)

        except Exception as e:
            logger.error(f"Ping endpoint error: {e}")
            return JsonResponse({"error": "Internal Server Error"}, status=500)
