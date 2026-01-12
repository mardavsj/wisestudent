import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera, Shield,
  Award, Activity, TrendingUp, Clock, CheckCircle, AlertCircle, Key,
  Upload, Eye, EyeOff, Building2, Briefcase, Globe, Lock, Copy
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'school_admin',
    avatar: '',
    bio: '',
    organization: '',
    position: '',
    joiningDate: '',
    address: '',
    dateOfBirth: ''
  });

  const [editProfile, setEditProfile] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    assignmentsApproved: 0,
    daysActive: 0
  });
  const [schoolCodeCopied, setSchoolCodeCopied] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState({ subscription: null, enhanced: null });
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchAdminStats();
    fetchSubscriptionDetails();
  }, []);

  const normalizeProfile = (data) => {
    const normalized = { ...(data || {}) };
    normalized.position =
      normalized.position ||
      normalized.professional?.position ||
      normalized.metadata?.position ||
      '';
    normalized.joiningDate =
      normalized.joiningDate ||
      normalized.professional?.joiningDate ||
      normalized.metadata?.joiningDate ||
      '';
    normalized.organization =
      normalized.organization ||
      normalized.school?.name ||
      normalized.schoolDetails?.schoolName ||
      '';
    normalized.dateOfBirth =
      normalized.dateOfBirth || normalized.dob || normalized.metadata?.dateOfBirth || '';
    return normalized;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/profile');
      const normalized = normalizeProfile(response.data);
      setProfile(normalized);
      setEditProfile(normalized);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/api/school/admin/profile-stats');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSubscriptionDetails = async () => {
    try {
      setSubscriptionLoading(true);
      const response = await api.get('/api/school/admin/subscription/enhanced');
      setSubscriptionInfo({
        subscription: response.data?.subscription || null,
        enhanced: response.data?.enhancedDetails || null,
      });
    } catch (error) {
      console.error('Error fetching subscription details:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        personal: {
          name: editProfile.name || '',
          phone: editProfile.phone || '',
          location: editProfile.location || '',
          website: editProfile.website || '',
          bio: editProfile.bio || ''
        },
        dateOfBirth: editProfile.dateOfBirth || null,
        professional: {
          position: editProfile.position || '',
          joiningDate: editProfile.joiningDate || ''
        }
      };
      const response = await api.put('/api/user/profile', payload);
      const normalized = normalizeProfile(response.data?.user || editProfile);
      setProfile(normalized);
      setEditProfile(normalized);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await api.put('/api/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/api/user/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile({ ...profile, avatar: response.data.avatarUrl });
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const schoolLinkingCode = profile?.schoolLinkingCode || profile?.school?.linkingCode;
  const schoolLinkingIssuedAt = profile?.schoolLinkingCodeIssuedAt || profile?.school?.linkingCodeIssuedAt;
  const formatDate = (value) => {
    if (!value) return 'N/A';
    try {
      return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const subscription = subscriptionInfo.subscription;
  const enhancedDetails = subscriptionInfo.enhanced;
  const planExpiryDate = enhancedDetails?.nextBillingDate || subscription?.endDate || null;
  const planName = enhancedDetails?.planName || subscription?.plan?.displayName || 'Premium Plan';
  
  // Compute actual status based on endDate
  let planStatus = enhancedDetails?.status || subscription?.status || 'active';
  if (planExpiryDate && (planStatus === 'active' || planStatus === 'pending')) {
    const expiryDate = new Date(planExpiryDate);
    const now = new Date();
    if (expiryDate <= now) {
      planStatus = 'expired';
    }
  }
  
  const daysRemaining = enhancedDetails?.daysRemaining ??
    (planExpiryDate ? Math.max(0, Math.ceil((new Date(planExpiryDate) - new Date()) / (1000 * 60 * 60 * 24))) : null);


  const handleCopySchoolCode = async () => {
    if (!schoolLinkingCode) return;
    try {
      await navigator.clipboard.writeText(schoolLinkingCode);
      setSchoolCodeCopied(true);
      toast.success('School linking code copied!');
      setTimeout(() => setSchoolCodeCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy school linking code', error);
      toast.error('Unable to copy right now');
    }
  };

  // Password Change Modal
  const PasswordModal = () => (
    <AnimatePresence>
      {showPasswordModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Change Password</h2>
                    <p className="text-sm text-white/80">Update your account password</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      minLength="6"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <User className="w-10 h-10" />
              My Profile
            </h1>
            <p className="text-lg text-white/90">Manage your personal information and preferences</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            {/* Avatar Section */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-5xl shadow-2xl">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile.name?.charAt(0) || 'A'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full cursor-pointer hover:bg-purple-600 transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mt-4">{profile.name || 'Admin'}</h2>
              <p className="text-sm text-gray-600 capitalize">{profile.role?.replace('_', ' ') || 'School Admin'}</p>
              <p className="text-xs text-gray-500 mt-1">{profile.email || 'No email'}</p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              {schoolLinkingCode && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-700">School linking code</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Share with students to connect them to {profile?.school?.name || 'your school'} instantly.
                      </p>
                      {schoolLinkingIssuedAt && (
                        <p className="text-[11px] text-gray-400">
                          Issued {new Date(schoolLinkingIssuedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySchoolCode}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-purple-600 bg-white border border-purple-100 hover:bg-purple-50 transition"
                    >
                      <Copy className="w-4 h-4" />
                      {schoolCodeCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="mt-3 px-4 py-3 rounded-xl bg-white text-lg font-mono tracking-[0.4em] text-purple-700 border border-purple-100 select-all text-center">
                    {schoolLinkingCode}
                  </div>
                </div>
              )}

              {(subscriptionLoading || subscription || enhancedDetails) && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-gray-700">Plan status</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {planName} • {planStatus === 'active' ? 'Active' : planStatus}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      {subscriptionLoading ? 'Loading…' : daysRemaining != null ? `${daysRemaining} days left` : '---'}
                    </span>
                  </div>
                  <div className="mt-3 px-4 py-3 rounded-xl bg-white text-sm font-semibold text-gray-700 border border-emerald-100 flex items-center justify-between">
                    <span>Plan expires on</span>
                    <span className="text-base font-bold text-emerald-600">{formatDate(planExpiryDate)}</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Total Students</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600">{stats.totalStudents || 0}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Total Teachers</span>
                  </div>
                  <span className="text-2xl font-black text-green-600">{stats.totalTeachers || 0}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">Approvals</span>
                  </div>
                  <span className="text-2xl font-black text-purple-600">{stats.assignmentsApproved || 0}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">Days Active</span>
                  </div>
                  <span className="text-2xl font-black text-orange-600">{stats.daysActive || 0}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-5 h-5" />
                Change Password
              </button>
              <button
                onClick={() => navigate('/school/admin/settings')}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                Organization Settings
              </button>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditProfile(profile);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={editProfile.name || ''}
                        onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={editProfile.email || ''}
                        onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editProfile.phone || ''}
                        onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={editProfile.position || ''}
                        onChange={(e) => setEditProfile({...editProfile, position: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                        placeholder="e.g., Principal, Administrator"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={editProfile.dateOfBirth?.split('T')[0] || ''}
                        onChange={(e) => setEditProfile({...editProfile, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Joining Date</label>
                      <input
                        type="date"
                        value={editProfile.joiningDate?.split('T')[0] || ''}
                        onChange={(e) => setEditProfile({...editProfile, joiningDate: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={editProfile.bio || ''}
                        onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold resize-none"
                        rows="3"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                      <textarea
                        value={editProfile.address || ''}
                        onChange={(e) => setEditProfile({...editProfile, address: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold resize-none"
                        rows="2"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Email</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{profile.email || 'Not set'}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Phone</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{profile.phone || 'Not set'}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Position</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{profile.position || 'School Administrator'}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Joining Date</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Date of Birth</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Organization</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{profile.organization || 'School Name'}</p>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Bio</span>
                      </div>
                      <p className="text-sm text-gray-700">{profile.bio}</p>
                    </div>
                  )}

                  {profile.address && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Address</span>
                      </div>
                      <p className="text-sm text-gray-700">{profile.address}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PasswordModal />
    </div>
  );
};

export default SchoolAdminProfile;

