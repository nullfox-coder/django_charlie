# django_charlie
Integrating Google Auth and Websocket

http://34.46.28.212:8080/api/auth/google/callback/
http://localhost:8080/api/auth/google/callback/




# Google Integration API

This Django project implements integration with Google OAuth 2.0, Google Drive, and real-time WebSocket communication. It provides endpoints for authenticating users through Google, interacting with Google Drive (upload, download, and list files), and enabling real-time chat between users.

## Features

- **Google OAuth 2.0 Authentication**
  - Authenticate users with Google OAuth 2.0
  - Securely store and manage user tokens

- **Google Drive Integration**
  - Connect to Google Drive
  - Upload files to Google Drive
  - Download files from Google Drive
  - List files from Google Drive
  - Use Google Picker API for file selection

- **Real-time Chat**
  - WebSocket-based real-time chat between users
  - Chat history persistence
  - Real-time message delivery

## Prerequisites

- Python 3.8+
- Django 4.2+
- PostgreSQL (Neon PostgreSQL for production)
- Google Cloud Platform account with OAuth credentials

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/google-integration-api.git
cd google-integration-api
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Variables

Create a `.env` file in the project root with the following variables:

```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=your-postgresql-connection-string
client_secrets=your-google-client-secrets
```

### 5. Database Setup

If using PostgreSQL with Neon:

```bash
# The migrations will automatically apply using the DATABASE_URL
python manage.py migrate
```

### 6. Create a superuser

```bash
python manage.py createsuperuser
```

### 7. Run the development server

```bash
python manage.py runserver
```

### 8. Google Cloud Platform Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Drive API, Google Picker API, and People API
4. Create OAuth credentials (Web application type)
5. Set the authorized redirect URI to match your GOOGLE_REDIRECT_URI env variable
6. Note your client ID, client secret, and API key

## API Documentation

### Authentication Endpoints

- **Initiate Google Auth**: `GET /auth/google/init/`
  - Initiates the Google OAuth flow
  - Response: Redirect URL to Google's authentication page

- **Google Auth Callback**: `GET /auth/google/callback/`
  - Callback URL for Google authentication
  - Query parameters:
    - `code`: Authorization code provided by Google
    - `state`: State parameter for security
  - Response: User authentication data including access token

### Google Drive Endpoints

- **Drive Auth Status**: `GET /drive/auth/`
  - Checks if user has connected Google Drive
  - Response: Connection status and user details

- **List Drive Files**: `GET /drive/files/`
  - Lists files from user's Google Drive
  - Response: Array of file objects with metadata

- **Upload File**: `POST /drive/upload/`
  - Uploads a file to user's Google Drive
  - Request: `multipart/form-data` with file attachment
  - Response: File metadata of the uploaded file

- **Download File**: `GET /drive/download/{file_id}/`
  - Downloads a file from user's Google Drive
  - Path parameter: `file_id` - Google Drive file ID
  - Response: File content as attachment

### Chat Endpoints

- **Chat History**: `GET /chat/history/{user_id}/`
  - Gets chat history between current user and specified user
  - Path parameter: `user_id` - User ID to get chat history with
  - Response: Array of message objects with metadata

- **WebSocket Connection**: `ws://{host}/ws/chat/{room_name}/`
  - Establishes WebSocket connection for real-time chat
  - Path parameter: `room_name` - Unique identifier for chat room

## Testing with Postman

Import the included Postman collection to test all API endpoints. The collection includes:

1. Authentication requests
2. Google Drive operations
3. Chat functionality
4. Environment variables for easy configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.