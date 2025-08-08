import React from "react";
import { Clock, Eye, CheckCircle, AlertCircle, Loader, Trash2 } from "lucide-react";
import { useTheme } from '../context/ThemeContext';

const TranscriptionCard = ({ transcription, onViewDetails, onDelete }) => {
  const { mode } = useTheme();

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return mode === 'dark' ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800";
      case "processing":
        return mode === 'dark' ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800";
      case "failed":
        return mode === 'dark' ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800";
      default:
        return mode === 'dark' ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-2" style={{ color: 'var(--theme-heading)' }}>
            {transcription.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--theme-text)' }}>
            <span>{transcription.date}</span>
            <span>{transcription.duration}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(transcription.status)}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium
                ${getStatusColor(transcription.status)}`}
          >
            {transcription.status.charAt(0).toUpperCase() +
              transcription.status.slice(1)}
          </span>
        </div>
      </div>
      {transcription.transcript && (
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--theme-text)' }}>
          {transcription.transcript}
        </p>
      )}
      <button
        onClick={() => onViewDetails(transcription.id)}
        className="flex items-center space-x-2 font-medium text-sm"
        style={{ color: 'var(--theme-heading)' }}
      >
        <Eye size={16} />
        <span>View Details</span>
      </button>
      {onDelete && (
        <button
          onClick={() => onDelete(transcription.id)}
          className="flex items-center space-x-2 font-medium text-sm mt-2 text-red-500"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      )}
    </div>
  );
};

export default TranscriptionCard;
