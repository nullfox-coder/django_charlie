from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
import json
from rest_framework_simplejwt.tokens import AccessToken
from .models import ChatMessage
import logging

User = get_user_model()

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            query_string = self.scope["query_string"].decode()
            params = parse_qs(query_string)
            token = params.get("token", [None])[0]

            if not token:
                logger.warning("WebSocket connection rejected: No token provided")
                await self.close()
                return

            user = await self.get_user_from_token(token)
            if user is None:
                logger.warning("WebSocket connection rejected: Invalid token")
                await self.close()
                return

            self.user = user
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'chat_{self.room_name}'

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"): 
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )


    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        receiver_id = data['receiver_id']

        await self.save_message(self.user.id, receiver_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': self.user.id,
                'receiver_id': receiver_id,
                'timestamp': self.get_timestamp()
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        ChatMessage.objects.create(
            sender=sender,
            receiver=receiver,
            content=message
        )

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            access_token = AccessToken(token)
            return User.objects.get(id=access_token["user_id"])
        except Exception:
            return None

    def get_timestamp(self):
        import datetime
        return datetime.datetime.now().isoformat()
