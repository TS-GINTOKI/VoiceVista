// src/pages/SettingsForm.jsx (Final Version with Avatar Upload Enabled)
import React, { useState, useEffect, useRef } from 'react';
import { User, Upload } from 'lucide-react'; // Added Upload icon
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SettingsForm = () => {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState({ name: '', email: '', avatar_url: '' });
    const [settings, setSettings] = useState({ transcription_language: 'English', voice_diarization: true, export_format: 'pdf' });
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const { mode, setMode } = useTheme();
    const fileInputRef = useRef(null);

    // Helper function to get full avatar URL
    const getAvatarUrl = (avatarUrl) => {
        if (!avatarUrl) return null;
        // If it's already a full URL, return as is
        if (avatarUrl.startsWith('http')) return avatarUrl;
        // Otherwise, construct the URL to the backend uploads folder
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        return `${API_BASE_URL}/uploads/${avatarUrl}`;
    };

    useEffect(() => {
        if (user) {
            setProfile({ name: user.name, email: user.email, avatar_url: user.avatar_url || '' });
        }
        const loadSettings = async () => {
            try {
                const settingsData = await api.getUserSettings();
                setSettings(settingsData);
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();
    }, [user]);

    const handleProfileChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSettingsChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }

        setIsUploadingAvatar(true);
        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('avatar', file);

            // Upload avatar to backend
            const response = await api.uploadAvatar(formData);
            
            // Update profile with new avatar URL
            const updatedProfile = { ...profile, avatar_url: response.avatar_url };
            setProfile(updatedProfile);
            
            // Update user context
            const currentToken = localStorage.getItem('token');
            login({ token: currentToken, user: { ...user, avatar_url: response.avatar_url } });
            
            setHasChanges(true);
            alert('Avatar updated successfully!');

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar. Please try again.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            // Send both profile and settings in the payload
            const profileToSave = {
                name: profile.name,
                email: profile.email,
                avatar_url: profile.avatar_url,
                settings: {
                    transcription_language: settings.transcription_language,
                    voice_diarization: settings.voice_diarization,
                    export_format: settings.export_format,
                }
            };
            
            await api.updateUserProfile(profileToSave);
            await api.updateUserSettings(settings);

            setHasChanges(false);
            alert('Your settings have been saved successfully!');
            // Optionally, reload the user profile from the backend here if you want to update the context
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Theme Toggle Section */}
            <div className="border rounded-lg p-4 sm:p-8 mb-6 sm:mb-8" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: mode === 'dark' ? '#222' : '#e5e7eb' }}>
                <h2 className="text-lg sm:text-xl font-semibold mb-1" style={{ color: 'var(--theme-heading)' }}>Theme</h2>
                <button
                    onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                    className={`px-3 sm:px-4 py-2 rounded font-semibold border transition-all duration-150 text-sm sm:text-base`}
                    style={{
                        background: mode === 'dark' ? '#222' : '#f3f3f3',
                        color: mode === 'dark' ? '#fff' : '#000',
                        borderColor: 'var(--theme-toggle)',
                    }}
                >
                    {mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>
            {/* Account Details Section */}
            <div className="border rounded-lg p-4 sm:p-8" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: mode === 'dark' ? '#222' : '#e5e7eb' }}>
                <h2 className="text-lg sm:text-xl font-semibold mb-1" style={{ color: 'var(--theme-heading)' }}>Account Details</h2>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: 'var(--theme-text)' }}>Manage your profile information and preferences.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-text)' }}>Name</label>
                        <input type="text" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base" style={{ background: mode === 'dark' ? '#111' : '#fff', color: 'var(--theme-text)' }} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-text)' }}>Email</label>
                        <input type="email" value={profile.email} onChange={(e) => handleProfileChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base" style={{ background: mode === 'dark' ? '#111' : '#fff', color: 'var(--theme-text)' }} />
                    </div>
                </div>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2" style={{ background: mode === 'dark' ? '#222' : '#e5e7eb', borderColor: 'rgba(255,255,255,0.1)' }}>
                        {profile.avatar_url ? (
                            <img src={getAvatarUrl(profile.avatar_url)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} style={{ color: 'var(--theme-text)' }} />
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="flex items-center space-x-2 px-3 sm:px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                            style={{ 
                                background: 'var(--theme-heading)', 
                                color: '#fff', 
                                borderColor: 'var(--theme-heading)' 
                            }}
                        >
                            <Upload size={16} />
                            <span>{isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        <p className="text-xs" style={{ color: 'var(--theme-text)' }}>
                            JPG, PNG, GIF up to 5MB
                        </p>
                    </div>
                </div>
            </div>
            {/* Transcription Preferences Section */}
            <div className="border rounded-lg p-4 sm:p-8" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: mode === 'dark' ? '#222' : '#e5e7eb' }}>
                <h2 className="text-lg sm:text-xl font-semibold mb-1" style={{ color: 'var(--theme-heading)' }}>Transcription Preferences</h2>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: 'var(--theme-text)' }}>Customize how your audio files are transcribed.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-text)' }}>Transcription Language</label>
                        <select value={settings.transcription_language} onChange={(e) => handleSettingsChange('transcription_language', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base" style={{ background: mode === 'dark' ? '#111' : '#fff', color: 'var(--theme-text)' }}>
                            <option>English</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="font-medium text-sm sm:text-base" style={{ color: 'var(--theme-text)' }}>Enable Voice Diarization</label>
                        <button onClick={() => handleSettingsChange('voice_diarization', !settings.voice_diarization)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`} style={{ background: settings.voice_diarization ? 'var(--theme-toggle)' : (mode === 'dark' ? '#222' : '#e5e7eb') }}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.voice_diarization ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
            {hasChanges && (
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
                    <button onClick={() => setHasChanges(false)} className="px-4 sm:px-6 py-2 border rounded-lg font-medium text-sm sm:text-base" style={{ background: mode === 'dark' ? '#111' : '#fff', color: 'var(--theme-text)', borderColor: mode === 'dark' ? '#333' : '#e5e7eb' }}>Discard Changes</button>
                    <button onClick={handleSaveChanges} disabled={isLoading} className="px-4 sm:px-6 py-2 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base" style={{ background: 'var(--theme-toggle)', color: '#fff', border: 'none' }}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsForm;
