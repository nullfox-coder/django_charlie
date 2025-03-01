from django.conf import settings

def encrypt_token(token: str) -> str:
    return settings.CIPHER.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    return settings.CIPHER.decrypt(encrypted_token.encode()).decode()
