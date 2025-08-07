# VoiceVista Backend

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/voicevista_db

# JWT Secret Key (Change this to a secure random string)
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# CORS Configuration
CORS_ORIGINS=http://localhost:3000
```

### 2. Database Setup
1. Install PostgreSQL
2. Create a database named `voicevista_db`
3. Run the database initialization:
   ```bash
   python db.py
   ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Profile
- `GET /api/user/profile` - Get user profile (requires auth)

### File Upload & Transcription
- `POST /api/upload` - Upload audio file (requires auth)
- `GET /api/transcriptions` - Get all transcriptions (requires auth)
- `GET /api/transcriptions/<id>` - Get specific transcription (requires auth)

## Features Fixed

1. ✅ Added missing `/api/upload` endpoint
2. ✅ Added missing `/api/user/profile` endpoint
3. ✅ Integrated Whisper for transcription
4. ✅ Added file upload handling with validation
5. ✅ Improved error handling throughout
6. ✅ Added background transcription processing
7. ✅ Fixed JWT token validation
8. ✅ Added file size and type validation
9. ✅ Improved database connection handling
10. ✅ Added proper CORS configuration 