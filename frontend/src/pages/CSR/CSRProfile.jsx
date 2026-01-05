import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera,
  Building2, Briefcase, Globe, Award, Activity, TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthUtils';
import api from '../../utils/api';

const CSRProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'csr',
    avatar: '',
    bio: '',
    location: '',
    organization: '',
    designation: '',
    joiningDate: '',
    website: ''
  });

  const [editProfile, setEditProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user/profile');
      const data = response.data?.data || response.data || {};
      setProfile({
        name: data.name || data.fullName || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        role: data.role || 'csr',
        avatar: data.avatar || data.profilePicture || '',
        bio: data.bio || data.about || '',
        location: data.location || '',
        organization: data.organization || '',
        designation: data.designation || data.jobTitle || '',
        joiningDate: data.joiningDate || data.createdAt || '',
        website: data.website || ''
      });
      setEditProfile({
        name: data.name || data.fullName || user?.name || '',
        phone: data.phone || '',
        bio: data.bio || data.about || '',
        location: data.location || '',
        organization: data.organization || '',
        designation: data.designation || data.jobTitle || '',
        website: data.website || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/user/profile', editProfile);
      setProfile(prev => ({ ...prev, ...editProfile }));
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditProfile({
      name: profile.name,
      phone: profile.phone,
      bio: profile.bio,
      location: profile.location,
      organization: profile.organization,
      designation: profile.designation,
      website: profile.website
    });
    setEditMode(false);
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
          <h2 className="text-sm font-bold text-gray-900 mb-1">Loading Profile</h2>
          <p className="text-xs text-gray-600">Fetching profile data...</p>
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
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Profile
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Manage your profile information and preferences
                  </p>
                </div>
              </div>
            </div>
            {!editMode ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditMode(true)}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm flex-shrink-0"
              >
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline sm:mr-1" />
                  <span className="hidden sm:inline">Cancel</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
                  <span className="sm:hidden">{saving ? 'Saving...' : 'Save'}</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-md border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-600">Account Status</div>
            </div>
            <div className="text-xl font-bold text-blue-600">Active</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-md border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-600">Member Since</div>
            </div>
            <div className="text-xl font-bold text-green-600">
              {profile.joiningDate ? new Date(profile.joiningDate).getFullYear() : '2024'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-md border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-600">Role</div>
            </div>
            <div className="text-xl font-bold text-purple-600">CSR</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-md border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-600">Profile Complete</div>
            </div>
            <div className="text-xl font-bold text-amber-600">85%</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-5 shadow-md border border-indigo-100">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg shadow-indigo-500/30">
                    {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  {editMode && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 p-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">{profile.name || 'CSR User'}</h2>
                <p className="text-xs text-gray-600 mb-3">{profile.designation || 'CSR Manager'}</p>
                {profile.bio && (
                  <p className="text-xs text-gray-600 mb-4">{profile.bio}</p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-indigo-200/50">
                <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg text-xs text-gray-700">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="font-medium">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg text-xs text-gray-700">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg text-xs text-gray-700">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <span className="font-medium">{profile.location}</span>
                  </div>
                )}
                {profile.organization && (
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg text-xs text-gray-700">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <span className="font-medium">{profile.organization}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-md border border-blue-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    />
                  ) : (
                    <p className="text-xs text-gray-900 font-medium">{profile.name || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                  <p className="text-xs text-gray-900 font-medium">{profile.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={editProfile.phone}
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    />
                  ) : (
                    <p className="text-xs text-gray-900 font-medium">{profile.phone || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editProfile.location}
                      onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    />
                  ) : (
                    <p className="text-xs text-gray-900 font-medium">{profile.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-md border border-purple-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-sm">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organization</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editProfile.organization}
                      onChange={(e) => setEditProfile({ ...editProfile, organization: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    />
                  ) : (
                    <p className="text-xs text-gray-900 font-medium">{profile.organization || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Designation</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editProfile.designation}
                      onChange={(e) => setEditProfile({ ...editProfile, designation: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                    />
                  ) : (
                    <p className="text-xs text-gray-900 font-medium">{profile.designation || 'Not set'}</p>
                  )}
                </div>
                {profile.joiningDate && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Joining Date</label>
                    <p className="text-xs text-gray-900 font-medium">
                      {new Date(profile.joiningDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Website</label>
                  {editMode ? (
                    <input
                      type="url"
                      value={editProfile.website}
                      onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                      placeholder="https://"
                    />
                  ) : (
                    <p className="text-xs text-gray-900 font-medium">{profile.website || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-md border border-amber-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-sm">
                  <Award className="w-4 h-4 text-white" />
                </div>
                Bio
              </h3>
              {editMode ? (
                <textarea
                  value={editProfile.bio}
                  onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-xs text-gray-700">{profile.bio || 'No bio added yet'}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CSRProfile;

