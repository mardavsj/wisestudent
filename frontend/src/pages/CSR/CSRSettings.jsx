import React, { useState, useEffect } from "react";
import { Lock, Bell, Eye, EyeOff, RefreshCw, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const CSRSettings = () => {

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    frequency: "instant",
  });
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  // Password change form
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'from-red-500 to-orange-500';
    if (passwordStrength <= 4) return 'from-yellow-500 to-amber-500';
    return 'from-green-500 to-emerald-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  // Fetch settings (GET /api/csr/settings) on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoadingPrefs(true);
      try {
        const res = await api.get("/api/csr/settings");
        const prefs = res.data?.data?.notificationPreferences;
        if (prefs) {
          setNotifications({
            email: prefs.email ?? true,
            inApp: prefs.inApp ?? true,
            frequency: prefs.frequency || "instant",
          });
        }
      } catch (err) {
        // Fallback to preferences endpoint for backward compatibility
        try {
          const res = await api.get("/api/csr/preferences");
          if (res.data?.data) {
            setNotifications({
              email: res.data.data.emailNotifications ?? true,
              inApp: res.data.data.inAppNotifications ?? true,
              frequency: res.data.data.notificationFrequency || "instant",
            });
          }
        } catch (e) {
          console.error("Failed to load settings:", e);
        }
      } finally {
        setLoadingPrefs(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      await api.put("/api/csr/settings", {
        notificationPreferences: {
          email: notifications.email,
          inApp: notifications.inApp,
          frequency: notifications.frequency,
        },
      });
      toast.success("Settings saved successfully");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to save settings";
      toast.error(errorMessage);
      console.error("Failed to save settings:", err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    // Validation
    if (!passwords.current) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwords.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await api.put("/api/csr/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({ current: "", newPassword: "", confirm: "" });
      setPasswordStrength(0);
      // Clear password visibility states
      setShowPasswords({ current: false, newPassword: false, confirm: false });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
      // Clear passwords on error for security
      setPasswords({ current: "", newPassword: "", confirm: "" });
      setPasswordStrength(0);
    } finally {
      setChangingPassword(false);
    }
  };


  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordInput = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (field === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account</p>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">
            Manage your account security and notification preferences. Update your password and choose how you want to receive notifications.
          </p>
        </header>

        {/* ACCOUNT SECURITY - CHANGE PASSWORD */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900">Account Security</h2>
          </div>
          <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>

          <form className="space-y-4" onSubmit={handlePasswordChange}>
            {/* Current Password */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) => handlePasswordInput("current", e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordInput("newPassword", e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords.newPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwords.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Password Strength</span>
                    <span className={`text-xs font-medium bg-gradient-to-r ${getPasswordStrengthColor()} bg-clip-text text-transparent`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all`}
                      style={{ width: `${(passwordStrength / 6) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordInput("confirm", e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    passwords.confirm && passwords.newPassword !== passwords.confirm
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                      : passwords.confirm && passwords.newPassword === passwords.confirm
                      ? "border-green-300"
                      : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwords.confirm && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      passwords.newPassword === passwords.confirm
                        ? "bg-green-500"
                        : "bg-rose-500"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      passwords.newPassword === passwords.confirm
                        ? "text-green-600"
                        : "text-rose-600"
                    }`}
                  >
                    {passwords.newPassword === passwords.confirm
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={changingPassword || !passwords.current || !passwords.newPassword || passwords.newPassword !== passwords.confirm}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>

        {/* NOTIFICATION PREFERENCES */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
          </div>
          <p className="text-sm text-slate-500">Choose how you want to stay informed.</p>

          {loadingPrefs ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {/* Email Notifications */}
                <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-4 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Receive updates about your programs via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, email: e.target.checked }))
                    }
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                {/* In-App Notifications */}
                <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-4 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">In-App Notifications</span>
                    <p className="text-xs text-slate-400 mt-1">
                      See notifications when logged into the portal
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.inApp}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, inApp: e.target.checked }))
                    }
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                {/* Notification Frequency */}
                <div className="rounded-xl border border-slate-200 px-4 py-4">
                  <span className="text-sm font-medium text-slate-700">Notification Frequency</span>
                  <p className="text-xs text-slate-400 mt-1 mb-3">
                    How often would you like to receive digest emails?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["instant", "daily", "weekly", "monthly"].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setNotifications((prev) => ({ ...prev, frequency: freq }))}
                        className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${
                          notifications.frequency === freq
                            ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPrefs ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {savingPrefs ? "Saving..." : "Save Preferences"}
              </button>
            </>
          )}
        </section>

        {/* SUPPORT NOTE */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            <p className="text-xs text-slate-500">
              Need help? Contact{" "}
              <a href="mailto:support@wisestudent.com" className="text-indigo-600 hover:underline">
                support@wisestudent.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRSettings;
