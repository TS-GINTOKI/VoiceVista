import React from 'react';
import SettingsForm from '../components/SettingsForm';

const Settings = () => {

    return (
        <div style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', minHeight: '100vh' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--theme-heading)' }}>
                        Settings & Export
                    </h1>
                    <p style={{ color: 'var(--theme-text)' }}>
                        Manage your account settings and transcription preferences.
                    </p>
                </div>
                <SettingsForm />
            </div>
        </div>
    );
};

export default Settings;