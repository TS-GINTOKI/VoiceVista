# backend/db.py (The Final, Correct Version)
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def init_db():
    print("Initializing database schema...")
    conn = get_db_connection()
    cur = conn.cursor()

    # Create users table with a TEXT field for the password hash
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            avatar_url VARCHAR(500),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("- 'users' table checked/created.")

    # Create user_settings table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_settings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            transcription_language VARCHAR(50) DEFAULT 'English',
            voice_diarization BOOLEAN DEFAULT true,
            export_format VARCHAR(20) DEFAULT 'pdf'
        );
    """)
    print("- 'user_settings' table checked/created.")

    # Create audio_files table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS audio_files (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            filename VARCHAR(255) NOT NULL,
            original_filename VARCHAR(255) NOT NULL,
            transcript TEXT,
            summary TEXT,
            status VARCHAR(20) DEFAULT 'processing',
            uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("- 'audio_files' table checked/created.")

    conn.commit()
    cur.close()
    conn.close()
    print("Congrats Master! Your Database Schema is ready!")

if __name__ == '__main__':
    init_db()
