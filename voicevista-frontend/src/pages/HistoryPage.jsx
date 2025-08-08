import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download, FileText, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [transcriptions, setTranscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadOptions, setDownloadOptions] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const formatOptions = [
    { value: 'txt', label: 'TXT' },
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'DOCX' },
  ];
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
    { value: 'ru', label: 'Russian' },
    { value: 'co', label: 'Colombian' },
  ];

  const handleOptionChange = (id, field, value) => {
    setDownloadOptions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    loadTranscriptions();
  }, []);

  const loadTranscriptions = async () => {
    try {
      const data = await api.getTranscriptions();
      setTranscriptions(data);
    } catch (error) {
      console.error('Error loading transcriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (transcriptionId) => {
    navigate(`/transcription-result/${transcriptionId}`);
  };

  const handleDownload = async (transcriptionId, filename) => {
    setDownloadingId(transcriptionId);
    const opts = downloadOptions[transcriptionId] || {};
    const format = opts.format || 'txt';
    const lang = opts.lang || 'en';
    try {
      const blob = await api.downloadTranscription(transcriptionId, format, lang);
      const url = URL.createObjectURL(blob);
      const ext = format === 'docx' ? 'docx' : format;
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_transcript.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading transcription:', error);
      alert('Error downloading transcription');
    } finally {
      setDownloadingId(null);
    }
  };

  // Delete a single transcription
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transcription?')) return;
    setDeletingId(id);
    try {
      if (api.deleteTranscription) {
        await api.deleteTranscription(id);
      }
      setTranscriptions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      alert('Failed to delete transcription.');
    } finally {
      setDeletingId(null);
    }
  };

  // Delete all transcriptions
  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL transcriptions? This cannot be undone.')) return;
    setIsDeletingAll(true);
    try {
      if (api.deleteAllTranscriptions) {
        await api.deleteAllTranscriptions();
      }
      setTranscriptions([]);
    } catch (error) {
      alert('Failed to delete all transcriptions.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Theme-aware delete button styling
  const getDeleteButtonStyle = () => {
    if (mode === 'dark') {
      return {
        color: '#fff',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.3)'
      };
    } else {
      return {
        color: '#dc2626',
        background: '#fef2f2',
        border: '1px solid #fecaca'
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--theme-heading)' }}>
              Transcription History
            </h1>
            <p style={{ color: 'var(--theme-text)' }}>
              View and manage all your audio transcriptions.
            </p>
          </div>
          {transcriptions.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={isDeletingAll}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm mt-4 md:mt-0 hover:opacity-80 transition-all duration-200 disabled:opacity-50"
              style={getDeleteButtonStyle()}
            >
              <Trash2 size={18} />
              <span>{isDeletingAll ? 'Deleting All...' : 'Delete All'}</span>
            </button>
          )}
        </div>
        {/* Transcriptions List */}
        <div className="rounded-lg shadow-sm border" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}>
          {transcriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--theme-heading)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--theme-heading)' }}>No transcriptions yet</h3>
              <p className="mb-6" style={{ color: 'var(--theme-text)' }}>
                Upload your first audio file to get started with transcription.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-md"
                style={{ background: 'var(--theme-heading)', color: '#fff' }}
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div>
              {transcriptions.map((transcription) => (
                <div key={transcription.id} className="p-6 border-b last:border-b-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-heading)' }}>
                          {transcription.title}
                        </h3>
                        {/* Status icons and badges remain as is */}
                      </div>
                      <div className="text-sm mb-3" style={{ color: 'var(--theme-text)' }}>
                        {transcription.date}
                      </div>
                      {/* Show summary if available */}
                      {transcription.summary && (
                        <div className="mb-2">
                          <span className="font-semibold" style={{ color: 'var(--theme-heading)' }}>Summary:</span>
                          <p className="text-sm" style={{ color: 'var(--theme-text)' }}>{transcription.summary}</p>
                        </div>
                      )}
                      {transcription.transcript && (
                        <div className="mb-4">
                          <p className="text-sm line-clamp-3" style={{ color: 'var(--theme-text)' }}>
                            {transcription.transcript}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Download, View Details, and Delete buttons */}
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {transcription.status === 'completed' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <select
                            value={(downloadOptions[transcription.id]?.format) || 'txt'}
                            onChange={e => handleOptionChange(transcription.id, 'format', e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}
                          >
                            {formatOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <select
                            value={(downloadOptions[transcription.id]?.lang) || 'en'}
                            onChange={e => handleOptionChange(transcription.id, 'lang', e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}
                          >
                            {languageOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDownload(transcription.id, transcription.title)}
                            disabled={downloadingId === transcription.id}
                            className="flex items-center space-x-1 font-medium text-sm disabled:opacity-50"
                            style={{ color: 'var(--theme-heading)' }}
                          >
                            <Download size={16} />
                            <span>
                              {downloadingId === transcription.id ? 'Downloading...' : 'Download'}
                            </span>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleViewDetails(transcription.id)}
                        className="flex items-center space-x-1 font-medium text-sm"
                        style={{ color: 'var(--theme-heading)' }}
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => handleDelete(transcription.id)}
                        disabled={deletingId === transcription.id}
                        className="flex items-center space-x-1 font-medium text-sm px-2 py-1 rounded hover:opacity-80 transition-all duration-200 disabled:opacity-50"
                        style={getDeleteButtonStyle()}
                      >
                        <Trash2 size={15} />
                        <span>{deletingId === transcription.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage; 