import React, { useState } from "react";
import { Lock, Mail, ToggleLeft } from "lucide-react";

const CSRSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
  });
  const [publicProfile, setPublicProfile] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    latest: "",
    confirm: "",
  });

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (passwords.latest !== passwords.confirm) {
      alert("Passwords do not match");
      return;
    }
    alert("Password change saved (mock)");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Settings</p>
          <h1 className="text-3xl font-bold text-slate-900">Account preferences</h1>
        </header>

        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500">Choose how you want to stay informed.</p>
          </div>
          <div className="space-y-3">
            {[
              { key: "email", label: "Email updates" },
              { key: "sms", label: "SMS alerts" },
              { key: "inApp", label: "In-app notifications" },
            ].map((option) => (
              <label key={option.key} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                <span>{option.label}</span>
                <input
                  type="checkbox"
                  checked={notifications[option.key]}
                  onChange={(event) =>
                    setNotifications((prev) => ({
                      ...prev,
                      [option.key]: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Public profile</h2>
              <p className="text-sm text-slate-500">Control public visibility.</p>
            </div>
            <button
              onClick={() => setPublicProfile((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              <ToggleLeft className="w-4 h-4" />
              {publicProfile ? "Visible" : "Hidden"}
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Password</h2>
            <p className="text-sm text-slate-500">Change your login password.</p>
          </div>
          <form className="space-y-3" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
              placeholder="Current password"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            />
            <input
              type="password"
              value={passwords.latest}
              onChange={(e) => setPasswords((prev) => ({ ...prev, latest: e.target.value }))}
              placeholder="New password"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            />
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
              placeholder="Confirm new password"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
            >
              <Lock className="w-4 h-4" />
              Save password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CSRSettings;
