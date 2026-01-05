import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Save, Key, Bell, Shield, Globe, Eye, EyeOff,
  Mail, Smartphone, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthUtils';
import api from '../../utils/api';

const CSRSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      goalAlerts: true,
      complianceReminders: true,
      budgetWarnings: true,
      roiUpdates: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user/settings').catch(() => ({ data: {} }));
      if (response.data?.settings) {
        setSettings(prev => ({
          ...prev,
          ...response.data.settings
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/api/user/settings', { settings });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      await api.post('/api/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-sm font-bold text-gray-900 mb-1">Loading Settings</h2>
          <p className="text-xs text-gray-600">Fetching settings data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Settings
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm disabled:opacity-50 flex-shrink-0"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
              <span className="sm:hidden">{saving ? 'Saving...' : 'Save'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 shadow-md border border-indigo-100 sticky top-24">
              <div className="space-y-1">
                {[
                  { id: 'general', label: 'General', icon: Globe, color: 'from-blue-500 to-cyan-500' },
                  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-amber-500 to-orange-500' },
                  { id: 'security', label: 'Security', icon: Shield, color: 'from-green-500 to-emerald-500' },
                  { id: 'password', label: 'Password', icon: Key, color: 'from-purple-500 to-pink-500' }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                          : 'text-gray-700 hover:bg-white/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-md border border-blue-100"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  General Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Language</label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, language: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, timezone: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date Format</label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, dateFormat: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-md border border-amber-100"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-sm">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  Notification Preferences
                </h3>
                <div className="space-y-3">
                  {Object.entries(settings.notifications).map(([key, value], index) => {
                    const colors = [
                      'from-blue-100 to-cyan-100 border-blue-200',
                      'from-green-100 to-emerald-100 border-green-200',
                      'from-purple-100 to-pink-100 border-purple-200',
                      'from-yellow-100 to-amber-100 border-yellow-200',
                      'from-indigo-100 to-purple-100 border-indigo-200',
                      'from-rose-100 to-pink-100 border-rose-200'
                    ];
                    const colorClass = colors[index % colors.length];
                    return (
                      <div key={key} className={`flex items-center justify-between p-3 bg-gradient-to-r ${colorClass} rounded-lg border`}>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                        <button
                          onClick={() => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, [key]: !value }
                          })}
                          className={`relative h-5 w-10 rounded-full transition-colors ${
                            value ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                              value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md border border-green-100"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-sm">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-600">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorAuth: !settings.security.twoFactorAuth }
                      })}
                      className={`relative h-5 w-10 rounded-full transition-colors ${
                        settings.security.twoFactorAuth ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                          settings.security.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(e.target.value) || 30 }
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                      min="5"
                      max="120"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Password Change */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-md border border-purple-100"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-sm">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="w-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Changing Password...' : 'Change Password'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRSettings;

