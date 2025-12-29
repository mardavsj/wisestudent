import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Mail,
  Save,
  RefreshCw,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Users,
  Loader2,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const TeacherSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    newSubmissionAlerts: true,
    assignmentReminders: true,
    messageAlerts: true,
  });


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, profileRes] = await Promise.all([
        api.get("/api/school/teacher/settings").catch(() => ({ data: {} })),
        api.get("/api/user/profile").catch(() => ({ data: null })),
      ]);

      if (settingsRes.data.notifications) {
        setNotificationSettings({
          emailNotifications: settingsRes.data.notifications.emailNotifications !== false,
          inAppNotifications: settingsRes.data.notifications.inAppNotifications !== false,
          newSubmissionAlerts: settingsRes.data.notifications.newSubmissionAlerts !== false,
          assignmentReminders: settingsRes.data.notifications.assignmentReminders !== false,
          messageAlerts: settingsRes.data.notifications.messageAlerts !== false,
        });
      }
      setTeacherProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await api.put("/api/school/teacher/settings", {
        notifications: notificationSettings,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const SettingToggle = ({ title, description, value, onChange, icon: Icon, color = "indigo" }) => {
    const colorClasses = {
      indigo: {
        bg: "bg-gradient-to-br from-indigo-100 to-purple-100",
        icon: "text-indigo-600",
        toggle: value ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-slate-300",
      },
      purple: {
        bg: "bg-gradient-to-br from-purple-100 to-pink-100",
        icon: "text-purple-600",
        toggle: value ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-slate-300",
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-100 to-cyan-100",
        icon: "text-blue-600",
        toggle: value ? "bg-gradient-to-r from-blue-600 to-cyan-600" : "bg-slate-300",
      },
    };

    const classes = colorClasses[color] || colorClasses.indigo;

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-lg ${classes.bg}`}>
            <Icon className={`w-5 h-5 ${classes.icon}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(!value)}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${classes.toggle}`}
        >
          <motion.div
            animate={{ x: value ? 28 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
          />
        </motion.button>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Settings className="w-8 h-8" />
                Settings
              </h1>
              <p className="text-base text-white/90">
                Manage your preferences and account settings
              </p>
            </motion.div>
          </div>
        </div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600 mb-1">Email</p>
              <p className="font-semibold text-slate-900">{teacherProfile?.email || "N/A"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600 mb-1">Role</p>
              <p className="font-semibold text-slate-900 capitalize">
                {teacherProfile?.role?.replace("_", " ") || "Teacher"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600 mb-1">Member Since</p>
              <p className="font-semibold text-slate-900">
                {teacherProfile?.createdAt
                  ? new Date(teacherProfile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Notification Preferences
                </h2>
                <p className="text-sm text-slate-600">
                  Choose how you want to receive updates and alerts
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3">
            <SettingToggle
              title="Email Notifications"
              description="Receive updates and alerts via email"
              value={notificationSettings.emailNotifications}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  emailNotifications: val,
                })
              }
              icon={Mail}
              color="blue"
            />
            <SettingToggle
              title="In-App Notifications"
              description="Get real-time notifications in the app"
              value={notificationSettings.inAppNotifications}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  inAppNotifications: val,
                })
              }
              icon={Bell}
              color="purple"
            />
            <SettingToggle
              title="New Submission Alerts"
              description="Get notified when students submit assignments"
              value={notificationSettings.newSubmissionAlerts}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  newSubmissionAlerts: val,
                })
              }
              icon={CheckCircle}
              color="indigo"
            />
            <SettingToggle
              title="Assignment Reminders"
              description="Reminders for upcoming assignment deadlines"
              value={notificationSettings.assignmentReminders}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  assignmentReminders: val,
                })
              }
              icon={BarChart3}
              color="blue"
            />
            <SettingToggle
              title="Message Alerts"
              description="Get notified when you receive new messages"
              value={notificationSettings.messageAlerts}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  messageAlerts: val,
                })
              }
              icon={MessageSquare}
              color="purple"
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Save All Changes
              </h3>
              <p className="text-sm text-slate-600">
                Your settings will be applied immediately
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
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
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherSettings;
