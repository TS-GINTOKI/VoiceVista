// src/pages/Dashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Settings, FileText, Upload } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import TranscriptionCard from '../components/TranscriptionCard';
import api from '../services/api'; // Use the api service

const Dashboard = () => {
  const navigate = useNavigate();
  const [transcriptions, setTranscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // New state for upload button
  const [userName, setUserName] = useState('User');

  const loadTranscriptions = useCallback(async () => {
    try {
      const data = await api.getTranscriptions();
      setTranscriptions(data);
    } catch (error) {
      console.error('Error loading transcriptions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const profileData = await api.getUserProfile();
        setUserName(profileData.name);
      } catch (error) {
        console.error('Error loading profile:', error);
        setUserName('User'); // Fallback name
      }
      await loadTranscriptions();
    };
    loadInitialData();
  }, [loadTranscriptions]);

  // Auto-refresh if any transcription is processing
  useEffect(() => {
    if (transcriptions.some(t => t.status === 'processing')) {
      const interval = setInterval(() => {
        loadTranscriptions();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [transcriptions, loadTranscriptions]);

  // This is the real upload function
  const handleStartTranscription = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await api.uploadAudio(file);
      console.log('Upload successful:', result);
      // Add the new transcription to the top of the list temporarily
      setTranscriptions(prev => [{
          id: result.file_id,
          title: file.name,
          status: 'processing',
          date: new Date().toISOString().split('T')[0]
      }, ...prev]);
      // You can optionally reload all transcriptions after a delay
      setTimeout(loadTranscriptions, 5000); // Refresh list after 5s
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`File upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewDetails = (transcriptionId) => {
    navigate(`/transcription-result/${transcriptionId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transcription?')) return;
    try {
      if (api.deleteTranscription) {
        await api.deleteTranscription(id);
      }
      setTranscriptions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert('Failed to delete transcription');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete ALL recent transcriptions?')) return;
    try {
      if (api.deleteAllTranscriptions) {
        await api.deleteAllTranscriptions();
      }
      setTranscriptions([]);
    } catch (error) {
      alert('Failed to delete all transcriptions');
    }
  };

  // ... (quickActions array remains the same)
  const quickActions = [
    {
      icon: Eye,
      title: 'View All Transcriptions',
      description: 'See all your past transcriptions',
      onClick: () => navigate('/history')
    },
    {
      icon: Settings,
      title: 'Go to Settings',
      description: 'Customize your preferences',
      onClick: () => navigate('/settings')
    },
    {
      icon: FileText,
      title: 'Export Summary',
      description: 'Download your latest summary',
      onClick: () => navigate('/history')
    }
  ];


  return (
    <div style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--theme-heading)' }}>
            Welcome, {userName}!
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--theme-text)' }}>
            Let's get started with your audio transcription.
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Upload Section */}
          <div className="xl:col-span-2">
            <div className="rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'var(--theme-heading)' }} />
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--theme-heading)' }}>Upload Audio File</h2>
              </div>
              <FileUpload 
                onStartTranscription={handleStartTranscription} 
                isUploading={isUploading} 
              />
            </div>
            {/* Recent Transcriptions */}
            <div className="rounded-lg shadow-sm border p-4 sm:p-6" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--theme-heading)' }}>Recent Transcriptions</h2>
                {transcriptions.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="px-3 py-1 rounded text-sm border"
                    style={{ color: '#fff', background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)' }}
                  >
                    Delete All
                  </button>
                )}
              </div>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : transcriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4" style={{ color: 'var(--theme-heading)' }} />
                  <p className="text-sm sm:text-base" style={{ color: 'var(--theme-text)' }}>No transcriptions yet. Upload your first audio file!</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2">
                  {transcriptions.slice(0, 20).map((transcription) => (
                    <TranscriptionCard
                      key={transcription.id}
                      transcription={transcription}
                      onViewDetails={handleViewDetails}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Quick Actions Sidebar */}
          <div className="xl:col-span-1">
            <div className="rounded-lg shadow-sm border p-4 sm:p-6" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: 'var(--theme-heading)' }}>Quick Actions</h2>
              <div className="space-y-3 sm:space-y-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="w-full text-left p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3 sm:space-x-4"
                    style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" style={{ color: 'var(--theme-heading)' }} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm sm:text-base" style={{ color: 'var(--theme-text)' }}>{action.title}</div>
                      <div className="text-xs sm:text-sm" style={{ color: 'var(--theme-text)' }}>{action.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
