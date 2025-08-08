// src/App.js (Final, Corrected Structure)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext'; // Import both
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import TranscriptionResult from './pages/TranscriptionResult';
import Settings from './pages/Settings';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

// This component is GUARANTEED to be inside the AuthProvider's scope.
const AppContent = () => {
    const { user, isLoading } = useAuth();
    const location = window.location.pathname;

    useEffect(() => {
        document.title = 'VoiceVista';
    }, []);

    // Force signup page if not authenticated and not already on /register
    if (!user && location !== '/register') {
        window.location.replace('/register');
        return null;
    }

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--theme-bg)', color: 'var(--theme-text)' }} className="flex justify-center items-center">
                <div className="text-xl font-semibold">Loading Application...</div>
            </div>
        );
    }

    return (
        <div className="App flex flex-col" style={{ minHeight: '100vh', background: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
            {user && <Header />}
            <main className="flex-1">
                <Routes>
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
                    
                    {/* Private Routes */}
                    <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/history" element={user ? <HistoryPage /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
                    <Route path="/transcription-result" element={user ? <TranscriptionResult /> : <Navigate to="/login" />} />
                    <Route path="/transcription-result/:id" element={user ? <TranscriptionResult /> : <Navigate to="/login" />} />

                    {/* Fallback: if no match, go to dashboard if logged in, else to login */}
                    <Route path="*" element={<Navigate to={user ? "/" : "/register"} />} />
                </Routes>
            </main>
            {user && <Footer />}
        </div>
    );
};

// The main App component now ONLY sets up the providers.
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
