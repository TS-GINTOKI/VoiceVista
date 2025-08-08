import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const AudioPlayer = ({ audioUrl, transcript }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {

        const audio = audioRef.current;

        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * duration;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const skipBackward = () => {
        const audio = audioRef.current;
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    };

    const skipForward = () => {
        const audio = audioRef.current;
        audio.currentTime = Math.min(duration, audio.currentTime + 10);
    };

    return (
        <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Audio Playback</h3>
            <audio ref={audioRef} src={audioUrl} />
            <div className="flex items-center space-x-4 mb-4">
                <button
                    onClick={skipBackward}
                    className="p-2 text-gray-600 hover:text-gray-800"
                >
                    <SkipBack size={20} />
                </button>
                <button
                    onClick={togglePlayPause}
                    className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700"
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                    onClick={skipForward}
                    className="p-2 text-gray-600 hover:text-gray-800"
                >
                    <SkipForward size={20} />
                </button>
                <Volume2 size={20} className="text-gray-600" />
            </div>
            {/* Progress Bar */}
            <div className="mb-2">
                <div
                    className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{
                            width: `${duration ? (currentTime / duration) * 100 : 0}%`
                        }}
                    />
                </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
};


export default AudioPlayer;