// src/components/Header.jsx (The Corrected Version)
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import micLogo from '../assets/images/mic.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { mode, setMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group" onClick={handleNavClick}>
              <img 
                src={micLogo} 
                alt="VoiceVista Logo" 
                className="h-10 w-10 sm:h-16 sm:w-16 object-contain" 
                style={{ filter: mode === 'dark' ? 'drop-shadow(0 0 4px #3abff8)' : 'none' }} 
              />
              <span className="text-xl sm:text-3xl font-bold group-hover:opacity-80 transition" style={{ color: 'var(--theme-heading)' }}>
                VoiceVista
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/") 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/history" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/history") 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent"
              }`}
            >
              History
            </Link>
            <Link 
              to="/settings" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/settings") 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent"
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Desktop Dark Mode Toggle & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
              title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mode === 'dark' ? <Sun className="h-5 w-5" style={{ color: 'var(--theme-heading)' }} /> : <Moon className="h-5 w-5" style={{ color: 'var(--theme-text)' }} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
              style={{ color: 'var(--theme-text)' }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
              title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mode === 'dark' ? <Sun className="h-5 w-5" style={{ color: 'var(--theme-heading)' }} /> : <Moon className="h-5 w-5" style={{ color: 'var(--theme-text)' }} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
              style={{ color: 'var(--theme-text)' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                onClick={handleNavClick}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/") 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/history" 
                onClick={handleNavClick}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/history") 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                History
              </Link>
              <Link 
                to="/settings" 
                onClick={handleNavClick}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/settings") 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800/50 transition-all duration-200"
                style={{ color: 'var(--theme-text)' }}
              >
                <div className="flex items-center space-x-2">
                  <LogOut size={20} />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
