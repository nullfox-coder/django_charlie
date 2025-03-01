from django.urls import path
from .views import ChatHistoryView, ActiveUsersView

urlpatterns = [
    path('history/<int:user_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('active-users/', ActiveUsersView.as_view(), name='active-users'),
]