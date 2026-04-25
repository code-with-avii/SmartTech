import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setTheme, 
  setLanguage, 
  setCurrency, 
  toggleNotifications, 
  toggleEmailNotifications, 
  toggleAutoSave, 
  resetPreferences 
} from '../Store/preferencesSlice';
import { FaSun, FaMoon, FaGlobe, FaBell, FaEnvelope, FaSave, FaUndo, FaDollarSign } from 'react-icons/fa';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const Settings = () => {
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.preferences);
  const [activeTab, setActiveTab] = useState('general');
  
  const handleResetPreferences = () => {
    if (window.confirm('Are you sure you want to reset all preferences to default values?')) {
      dispatch(resetPreferences());
    }
  };
  
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            {preferences.theme === 'dark' ? <FaMoon className="text-gray-600" /> : <FaSun className="text-gray-600" />}
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-gray-500">Choose your preferred theme</div>
            </div>
          </div>
          <select
            value={preferences.theme}
            onChange={(e) => dispatch(setTheme(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      
      <div>
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <FaGlobe className="text-gray-600" />
            <div>
              <div className="font-medium">Language</div>
              <div className="text-sm text-gray-500">Select your preferred language</div>
            </div>
          </div>
          <select
            value={preferences.language}
            onChange={(e) => dispatch(setLanguage(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      
      <div>
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <FaDollarSign className="text-gray-600" />
            <div>
              <div className="font-medium">Currency</div>
              <div className="text-sm text-gray-500">Choose your preferred currency</div>
            </div>
          </div>
          <select
            value={preferences.currency}
            onChange={(e) => dispatch(setCurrency(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
  
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <FaBell className="text-gray-600" />
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications in your browser</div>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleNotifications())}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.notifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>
      
      <div>
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-gray-600" />
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive updates via email</div>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleEmailNotifications())}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  );
  
  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <FaSave className="text-gray-600" />
            <div>
              <div className="font-medium">Auto-Save</div>
              <div className="text-sm text-gray-500">Automatically save your progress</div>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleAutoSave())}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.autoSave ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>
      
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <FaUndo className="text-gray-600" />
          <div>
            <div className="font-medium">Reset Preferences</div>
            <div className="text-sm text-gray-500">Restore all settings to default values</div>
          </div>
        </div>
        <button
          onClick={handleResetPreferences}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reset All Settings
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'general', label: 'General' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'privacy', label: 'Privacy' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
