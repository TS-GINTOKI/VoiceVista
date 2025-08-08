// src/pages/LoginPage.jsx (The Final, Corrected Version)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await api.login({ email, password });
            login(data);
            navigate('/'); 
        } catch (err) {
            setError(err.message || 'An unknown error occurred.');
            console.error('Login failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-6 sm:py-12 px-4" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
            <div className="w-full max-w-sm sm:max-w-md">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--theme-heading)' }}>✨ VoiceVista</h1>
                    <h2 className="mt-2 text-xl sm:text-2xl font-semibold" style={{ color: 'var(--theme-heading)' }}>Welcome Back</h2>
                    <p className="mt-2 text-xs sm:text-sm" style={{ color: 'var(--theme-text)' }}>Sign in to continue to your ultimate audio processing tool.</p>
                </div>

                <div className="shadow-lg rounded-xl p-6 sm:p-8 border" style={{ background: 'var(--theme-bg)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Email</label>
                            <input 
                                id="email" 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" 
                                style={{ 
                                    background: 'var(--theme-bg)', 
                                    color: 'var(--theme-text)', 
                                    borderColor: 'rgba(255,255,255,0.2)'
                                }}
                                placeholder="you@example.com" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Password</label>
                            <div className="relative mt-1">
                                <input 
                                    id="password" 
                                    type={showPassword ? "text" : "password"}
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base pr-10" 
                                    style={{ 
                                        background: 'var(--theme-bg)', 
                                        color: 'var(--theme-text)', 
                                        borderColor: 'rgba(255,255,255,0.2)'
                                    }}
                                    placeholder="Your password" 
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white focus:outline-none disabled:opacity-50 transition-colors"
                                style={{ background: 'var(--theme-heading)' }}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm" style={{ color: 'var(--theme-text)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--theme-heading)' }}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
