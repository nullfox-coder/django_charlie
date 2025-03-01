from django.urls import path
from .views import ChatHistoryView

urlpatterns = [
    path('history/<int:user_id>/', ChatHistoryView.as_view(), name='chat-history'),
]