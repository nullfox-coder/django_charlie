from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import ChatMessage
from django.db.models import Q

class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id):
        try:
            other_user = User.objects.get(id=user_id)
            
            # Get chat history between current user and other user
            messages = ChatMessage.objects.filter(
                (Q(sender=request.user) & Q(receiver=other_user)) |
                (Q(sender=other_user) & Q(receiver=request.user))
            ).order_by('timestamp')
            
            # Mark messages as read
            unread_messages = messages.filter(receiver=request.user, is_read=False)
            unread_messages.update(is_read=True)
            
            # Format messages
            message_list = []
            for msg in messages:
                message_list.append({
                    'id': msg.id,
                    'sender_id': msg.sender.id,
                    'sender_name': msg.sender.username,
                    'receiver_id': msg.receiver.id,
                    'receiver_name': msg.receiver.username,
                    'content': msg.content,
                    'timestamp': msg.timestamp.isoformat(),
                    'is_read': msg.is_read
                })
            
            return Response({
                'messages': message_list,
                'user1': {
                    'id': request.user.id,
                    'username': request.user.username
                },
                'user2': {
                    'id': other_user.id,
                    'username': other_user.username
                }
            })
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
