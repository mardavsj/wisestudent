import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import notificationService from "../../services/notificationService";
import NotificationItem from "./NotificationItem";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const loadUnread = useCallback(async () => {
    try {
      const payload = await notificationService.unreadCount();
      setUnreadCount(payload?.count || 0);
    } catch (err) {
      console.error("Failed to load unread notifications", err);
    }
  }, []);

  const loadRecent = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await notificationService.list({ limit: 5 });
      const list = Array.isArray(payload)
        ? payload
        : payload.notifications || payload.data || [];
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUnread();
  }, [loadUnread]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        loadRecent();
      }
      return next;
    });
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications read", err);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[11px] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-3 w-80 min-w-[320px] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Notifications</p>
              <p className="text-sm font-semibold text-slate-900">Recent updates</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={loadRecent}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 uppercase tracking-[0.3em] text-slate-500"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
          </div>
          <div className="max-h-[280px] space-y-3 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-slate-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  compact
                />
              ))
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="uppercase tracking-[0.3em] text-indigo-600"
            >
              Mark all read
            </button>
            <Link
              to="/csr/notifications"
              className="font-semibold text-slate-900 hover:text-indigo-600"
              onClick={handleViewAll}
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
