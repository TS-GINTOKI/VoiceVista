// src/components/FileUpload.jsx

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

// IMPORTANT CHANGE: We now pass 'onStartTranscription' and 'isUploading' from the parent (Dashboard)
const FileUpload = ({ onStartTranscription, isUploading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  // This function now calls the function passed from the Dashboard
  const handleStartClick = () => {
    if (selectedFile) {
      onStartTranscription(selectedFile);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drag files here or browse
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: MP3, WAV, M4A. Max file size: 500MB.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={handleStartClick} // <-- Use the new handler
            disabled={isUploading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Starting Transcription...' : 'Start Transcription'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
