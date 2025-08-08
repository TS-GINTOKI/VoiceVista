import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import api from '../services/api';

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

const TranscriptionResult = () => {
  const { id } = useParams();
  const [transcription, setTranscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState('txt');
  const [downloadLang, setDownloadLang] = useState('en');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      loadTranscriptionDetails(id);
    }
    // eslint-disable-next-line
  }, [id]);

  const loadTranscriptionDetails = async (transcriptionId) => {
    setIsLoading(true);
    try {
      const data = await api.getTranscription(transcriptionId);
      setTranscription(data);
    } catch (error) {
      setTranscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!transcription) return;
    setDownloading(true);
    try {
      const blob = await api.downloadTranscription(transcription.id, downloadFormat, downloadLang);
      const ext = downloadFormat === 'docx' ? 'docx' : downloadFormat;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${transcription.title}_transcript.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (error) {
      alert('Error downloading file');
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading transcription...</p>
        </div>
      </div>
    );
  }

  if (!transcription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No transcription found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--theme-heading)' }}>{transcription.title}</h1>
            <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--theme-text)' }}>
              <span>{transcription.date}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={downloadFormat}
              onChange={e => setDownloadFormat(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {formatOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={downloadLang}
              onChange={e => setDownloadLang(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {languageOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg disabled:opacity-50"
              style={{ background: 'var(--theme-heading)', color: '#fff' }}
            >
              <Download size={16} />
              <span>{downloading ? 'Downloading...' : 'Download'}</span>
            </button>
          </div>
        </div>
        <div className="border rounded-lg p-6 mb-6" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--theme-heading)' }}>Summary</h2>
          <p className="leading-relaxed" style={{ color: 'var(--theme-text)' }}>
            {transcription.summary || 'No summary available.'}
          </p>
        </div>
        <div className="border rounded-lg p-6" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--theme-heading)' }}>Full Transcript</h2>
          <div className="whitespace-pre-line" style={{ color: 'var(--theme-text)' }}>
            {transcription.transcript || 'No transcript available.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionResult;
