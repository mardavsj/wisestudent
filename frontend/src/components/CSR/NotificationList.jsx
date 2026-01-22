import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import notificationService from "../../services/notificationService";
import NotificationItem from "./NotificationItem";

const TYPE_FILTERS = [
  "all",
  "unread",
  "info",
  "success",
  "warning",
  "alert",
  "message",
  "achievement",
  "general",
];

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await notificationService.list({ limit: 50 });
      const list = Array.isArray(payload)
        ? payload
        : payload.notifications || payload.data || [];
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const payload = await notificationService.unreadCount();
      setUnreadCount(payload?.count || 0);
    } catch (err) {
      console.error("Unread count failed", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  const handleMarkRead = async (notification) => {
    if (notification?.isRead) return;
    try {
      await notificationService.markAsRead(notification._id);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: true } : item
        )
      );
      loadUnreadCount();
    } catch (err) {
      console.error("Cannot mark notification read", err);
    }
  };

  const handleDelete = async (notification) => {
    try {
      await notificationService.remove(notification._id);
      setNotifications((prev) => prev.filter((item) => item._id !== notification._id));
      loadUnreadCount();
    } catch (err) {
      console.error("Cannot delete notification", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const filterOptions = useMemo(
    () =>
      TYPE_FILTERS.map((type) => ({
        value: type,
        label: type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1),
      })),
    []
  );

  const displayedNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }
    if (filter === "unread") {
      return notifications.filter((item) => !item.isRead);
    }
    return notifications.filter((item) => item.type === filter);
  }, [filter, notifications]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Notifications</p>
          <h1 className="text-2xl font-semibold text-slate-900">All updates</h1>
          <p className="text-xs text-slate-500">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={fetchNotifications}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700"
          >
            Mark all read
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm text-slate-500">
            No notifications yet.
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              showActions
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default NotificationList;
