# Project Title

## Description
This project integrates Google Drive functionalities and real-time chat using WebSockets.

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
   python manage.py runserver
   ```
2. Access the API endpoints:
   - **Google Drive Authentication**: `GET /apiV1/google_drive/auth/`
   - **List Files**: `GET /apiV1/google_drive/files/`
   - **Upload File**: `POST /apiV1/google_drive/upload/`
   - **Download File**: `GET /apiV1/google_drive/download/<file_id>/`
   - **Chat WebSocket**: `ws://<server_address>/ws/chat/<room_name>/`

## Testing
You can test the API endpoints using Postman or any other API testing tool.

## Requirements
- Django
- Django Channels
- Google API Client
- Other dependencies listed in `requirements.txt`



## Test in console
```
const socket = new WebSocket('ws://<your_server_address>/ws/chat/<room_name>/');

socket.onopen = function() {
    console.log('WebSocket connection established');
    socket.send(JSON.stringify({
        message: 'Hello, World!',
        sender_id: 1, // Replace with actual sender ID
        receiver_id: 2 // Replace with actual receiver ID
    }));
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Message received:', data);
};
```

## License
This project is licensed under the MIT License.
