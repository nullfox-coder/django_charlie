# Charlie Backend

## Description
This project integrates Google Login, Google Drive functionalities and real-time chat using WebSockets.

## Installation
1. Clone the repository.
2. Navigate to the project directory.
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage
1. Run the server:
   ```bash
   python manage.py runserver 8080
   ```
2. Access the API endpoints:
   - **Google Drive Authentication**: 
   ``
   curl --location 'http://127.0.0.1:8080/api/auth/google/init'
   ```

   - **Drive Status**: 
   ```
    curl --location 'http://127.0.0.1:8080/api/drive/auth/' \
--header 'Authorization: Bearer your_access_token'
   ```


   - **List Files**: 

   ```
   curl --location 'http://127.0.0.1:8080/api/drive/files' \
--header 'Authorization: Bearer your_access_token'
```

   - **Upload File**: 
   
   ```
   curl --location 'http://127.0.0.1:8080/api/drive/upload/' \
--header 'Authorization: Bearer your_access_token \
--form 'file=@"/C:/Users/User/Downloads/abc.abc"'
```

   - **Download File**: 
   
   ```
   curl --location 'http://127.0.0.1:8080/api/drive/download/1MApiKFaV1E8Hu0ps_G4xmC7iJltHxH3m' \
--header 'Authorization: Bearer your_access_token'
```

## Testing
You can test the API endpoints using Postman or any other API testing tool.

## Requirements
- Django
- Django Channels
- Google API Client
- Other dependencies listed in `requirements.txt`



## Test postman websocket
```
ws://127.0.0.1:8080/ws/chat/room1/?token=your_access_token

{
    "message": "how are you?",
    "receiver_id": 3
}

```
