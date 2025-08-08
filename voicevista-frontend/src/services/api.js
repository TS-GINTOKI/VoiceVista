// src/services/api.js (The Corrected and Complete Version)

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
    constructor( ) {
        this.token = null;
    }

    // THIS IS THE NEW FUNCTION THAT WAS MISSING
    setAuthToken(token) {
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add the authorization header if the token exists
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection.');
            }
            throw error;
        }
    }

    // --- Auth Methods ---
    login(credentials) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // --- User Profile Methods ---
    getUserProfile() {
        return this.request('/api/user/profile');
    }

    updateUserProfile(profileData) {
        return this.request('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    // Optional convenience methods used by SettingsForm
    getUserSettings() {
        // The backend returns profile + settings together; map it here
        return this.getUserProfile().then((data) => data.settings || {});
    }

    updateUserSettings(settings) {
        // Send via updateUserProfile with only settings
        return this.updateUserProfile({ settings });
    }

    uploadAvatar(formData) {
        const url = `${API_BASE_URL}/api/user/avatar`;

        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return fetch(url, {
            method: 'POST',
            body: formData,
            headers,
        }).then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        });
    }

    // --- Transcriptions Methods ---
    getTranscriptions() {
        return this.request('/api/transcriptions');
    }

    getTranscription(id) {
        return this.request(`/api/transcriptions/${id}`);
    }

    deleteTranscription(id) {
        return this.request(`/api/transcriptions/${id}`, { method: 'DELETE' });
    }

    deleteAllTranscriptions() {
        return this.request('/api/transcriptions', { method: 'DELETE' });
    }

    downloadTranscription(id, format = 'txt', lang = 'en') {
        const url = `${API_BASE_URL}/api/transcriptions/${id}/download?format=${format}&lang=${lang}`;
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return fetch(url, {
            method: 'GET',
            headers,
        }).then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.blob();
        });
    }

    // --- File Upload Method (This is different, it's not JSON) ---
    async uploadAudio(file) {
        const url = `${API_BASE_URL}/api/upload`;
        const formData = new FormData();
        formData.append('audio', file);

        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers, // Pass the auth header here too
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}

const api = new ApiService();
export default api;
