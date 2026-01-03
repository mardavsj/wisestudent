import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  Settings, Save, Globe, Shield, Bell, Database, Server, Lock,
  Mail, Phone, MapPin, CheckCircle, AlertCircle, RefreshCw,
  MessageSquare, UserPlus, Calendar, User, Users, Search, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import AdminJobPositions from '../../components/admin/AdminJobPositions.jsx';

const COMMUNICATIONS_PASSWORD = 'Magorix@wise@110';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const passwordInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState('all');
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    role: 'student',
    selectedPlan: 'free',
    parentId: '',
    organization: '',
    childLinkCode: '',
  });
  const [settings, setSettings] = useState({
    general: {
      platformName: 'Wise Student',
      supportEmail: 'support@wisestudent.org',
      supportPhone: '+91 9043411110',
      timezone: 'Asia/Kolkata',
      language: 'en'
    },
    security: {
      requireEmailVerification: true,
      requireTwoFactor: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      enableAuditLog: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true
    },
    system: {
      maintenanceMode: false,
      maxUploadSize: 10,
      enableAnalytics: true,
      enableCookies: true
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/admin/settings').catch(() => ({ data: { data: settings } }));
        if (res.data.data) {
          setSettings(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'addUser') {
      fetchCreatedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, usersPage, usersSearch, usersRoleFilter]);

  const fetchCreatedUsers = async () => {
    try {
      setLoadingUsers(true);
      const params = new URLSearchParams({
        page: usersPage.toString(),
        limit: '10',
      });
      if (usersSearch) params.append('search', usersSearch);
      if (usersRoleFilter !== 'all') params.append('role', usersRoleFilter);

      const response = await api.get(`/api/admin/users/created-by-me?${params.toString()}`);
      console.log('Fetched created users response:', response.data);
      
      if (response.data.success) {
        setCreatedUsers(response.data.data.users || []);
        setUsersTotal(response.data.data.pagination?.total || 0);
        console.log('Set users:', response.data.data.users?.length || 0, 'Total:', response.data.data.pagination?.total || 0);
      } else {
        console.error('API returned unsuccessful response:', response.data);
        toast.error(response.data.message || 'Failed to load created users');
      }
    } catch (error) {
      console.error('Error fetching created users:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load created users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/api/admin/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  useEffect(() => {
    if (showPasswordPrompt) {
      setPasswordInput('');
      setPasswordError('');
      const timeout = setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [showPasswordPrompt]);

  useEffect(() => {
    if (showPasswordPrompt) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    return () => {};
  }, [showPasswordPrompt]);

  const handleOpenCommunications = () => {
    setShowPasswordPrompt(true);
    setShowPassword(false);
  };

  const handlePasswordSubmit = (e) => {
    e?.preventDefault();
    if (passwordInput === COMMUNICATIONS_PASSWORD) {
      setShowPasswordPrompt(false);
      setPasswordInput('');
      setPasswordError('');
      setShowPassword(false);
      navigate('/admin/settings/communications');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setCreatingUser(true);

      const response = await api.post('/api/admin/users/create-with-plan', userForm);

      if (response.data.success) {
        toast.success(response.data.message || 'User created successfully!');
        // Reset form
        setUserForm({
          email: '',
          password: '',
          fullName: '',
          dateOfBirth: '',
          gender: 'male',
          role: 'student',
          selectedPlan: 'free',
          parentId: '',
          organization: '',
          childLinkCode: '',
        });
        // Refresh the users list
        fetchCreatedUsers();
      } else {
        toast.error(response.data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setCreatingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2">Platform Settings ⚙️</h1>
            <p className="text-lg text-white/90">Configure platform-wide settings and preferences</p>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['general', 'security', 'notifications', 'system', 'positions', 'addUser'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab === 'addUser' ? 'Add User' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <Motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
        >
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        value={settings.general.platformName}
                        onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={settings.general.supportEmail}
                        onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                      <input
                        type="text"
                        value={settings.general.supportPhone}
                        onChange={(e) => updateSetting('general', 'supportPhone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  <div className="space-y-4">
                    {Object.entries(settings.security).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-sm text-gray-600">Enable {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateSetting('security', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                  <div className="space-y-4">
                    {Object.entries(settings.system).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                        {typeof value === 'boolean' ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => updateSetting('system', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        ) : (
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => updateSetting('system', key, e.target.value)}
                            className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Positions */}
              {activeTab === 'positions' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Positions</h2>
                  <AdminJobPositions />
                </div>
              )}

              {/* Add User */}
              {activeTab === 'addUser' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Add User for Testing</h2>
                      <p className="text-sm text-gray-600">Create users with subscription plans bypassing payment</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-yellow-900 mb-1">Testing Mode</p>
                        <p className="text-sm text-yellow-800">
                          This feature allows super admins to create test users with any subscription plan without payment processing. 
                          Use this only for testing purposes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={userForm.fullName}
                          onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="john.doe@example.com"
                          required
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Minimum 8 characters"
                          minLength={8}
                          required
                        />
                      </div>

                      {/* Date of Birth - Only for Student */}
                      {userForm.role === 'student' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={userForm.dateOfBirth}
                            onChange={(e) => setUserForm({ ...userForm, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      )}

                      {/* Gender - Only for Student */}
                      {userForm.role === 'student' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={userForm.gender}
                            onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non_binary">Non-binary</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      )}

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={userForm.role}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            setUserForm({ 
                              ...userForm, 
                              role: newRole,
                              // Reset role-specific fields when role changes
                              dateOfBirth: newRole === 'student' ? userForm.dateOfBirth : '',
                              gender: newRole === 'student' ? userForm.gender : 'male',
                              selectedPlan: newRole === 'student' ? userForm.selectedPlan : 'free',
                              organization: newRole === 'csr' ? userForm.organization : '',
                              childLinkCode: (newRole === 'parent' || newRole === 'csr') ? userForm.childLinkCode : '',
                            });
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="student">Student</option>
                          <option value="parent">Parent</option>
                          <option value="csr">CSR</option>
                        </select>
                      </div>

                      {/* Subscription Plan - Only for Student */}
                      {userForm.role === 'student' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subscription Plan <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={userForm.selectedPlan}
                            onChange={(e) => setUserForm({ ...userForm, selectedPlan: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          >
                            <option value="free">Free Plan</option>
                            <option value="student_premium">Student Premium (₹4,499)</option>
                            <option value="student_parent_premium_pro">Student + Parent Premium Pro (₹4,999)</option>
                          </select>
                        </div>
                      )}

                      {/* Organization - Only for CSR */}
                      {userForm.role === 'csr' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Organization <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={userForm.organization}
                            onChange={(e) => setUserForm({ ...userForm, organization: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Organization Name"
                            required
                          />
                        </div>
                      )}

                      {/* Parent ID (Optional, for linking student to parent) */}
                      {userForm.role === 'student' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent ID (Optional)
                          </label>
                          <input
                            type="text"
                            value={userForm.parentId}
                            onChange={(e) => setUserForm({ ...userForm, parentId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Parent user ID to link"
                          />
                          <p className="text-xs text-gray-500 mt-1">Leave empty if creating standalone student</p>
                        </div>
                      )}

                      {/* Student/Child Link Code (Optional, for linking parent/CSR to child) */}
                      {(userForm.role === 'parent' || userForm.role === 'csr') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student/Child Link Code (Optional)
                          </label>
                          <input
                            type="text"
                            value={userForm.childLinkCode}
                            onChange={(e) => setUserForm({ ...userForm, childLinkCode: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter student/child linking code"
                          />
                          <p className="text-xs text-gray-500 mt-1">Link this account to an existing student/child</p>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={creatingUser}
                        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creatingUser ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Creating User...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5" />
                            Create User
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Users Created by Me Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Users Created by Me</h3>
                          <p className="text-sm text-gray-600">View all test users you've created</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Total: <span className="font-semibold text-indigo-600">{usersTotal}</span>
                      </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={usersSearch}
                          onChange={(e) => {
                            setUsersSearch(e.target.value);
                            setUsersPage(1);
                          }}
                          placeholder="Search by name or email..."
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <select
                        value={usersRoleFilter}
                        onChange={(e) => {
                          setUsersRoleFilter(e.target.value);
                          setUsersPage(1);
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                        <option value="csr">CSR</option>
                      </select>
                    </div>

                    {/* Users List */}
                    {loadingUsers ? (
                      <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                      </div>
                    ) : createdUsers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No users created yet</p>
                        <p className="text-sm">Create your first test user above</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {createdUsers.map((user) => (
                            <div
                              key={user._id || user.id}
                              className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                      {user.name?.charAt(0)?.toUpperCase() || user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">
                                        {user.name || user.fullName || 'Unknown'}
                                      </h4>
                                      <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold capitalize">
                                      {user.role}
                                    </span>
                                    {user.role === 'student' && user.subscription && (
                                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                        {user.subscription.planName || user.subscription.planType}
                                      </span>
                                    )}
                                    {user.linkingCode && (
                                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-mono">
                                        Code: {user.linkingCode}
                                      </span>
                                    )}
                                    {user.isLegacy && (
                                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                        Created Before Tracking
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500">
                                      Created: {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {user.isVerified && (
                                    <CheckCircle className="w-5 h-5 text-green-500" title="Verified" />
                                  )}
                                  {user.approvalStatus === 'approved' && (
                                    <CheckCircle className="w-5 h-5 text-blue-500" title="Approved" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {usersTotal > 10 && (
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                              disabled={usersPage === 1}
                              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-600">
                              Page {usersPage} of {Math.ceil(usersTotal / 10)}
                            </span>
                            <button
                              onClick={() => setUsersPage((p) => p + 1)}
                              disabled={usersPage >= Math.ceil(usersTotal / 10)}
                              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Settings
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleOpenCommunications}
                    className="flex-1 px-6 py-4 bg-white border-2 border-indigo-200 text-indigo-700 rounded-xl font-bold hover:shadow-lg hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Communications
                  </button>
                </div>
              </div>
        </Motion.div>
      </div>
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black">Verify Access</h2>
                <p className="text-sm text-white/80">Enter the communications access password</p>
              </div>
            </div>
            <form onSubmit={handlePasswordSubmit} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Access Password
                </label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError('');
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      passwordError ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-red-500 font-semibold">{passwordError}</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPasswordInput('');
                    setPasswordError('');
                    setShowPassword(false);
                  }}
                  className="px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              </div>
            </form>
          </Motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
