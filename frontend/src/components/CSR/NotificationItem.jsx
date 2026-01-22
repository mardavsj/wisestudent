import React from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  MessageSquare,
  Sparkles,
  Trash2,
} from "lucide-react";

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  alert: Bell,
  message: MessageSquare,
  achievement: Sparkles,
  general: Bell,
};

const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
  showActions = false,
  compact = false,
}) => {
  if (!notification) return null;
  const Icon = iconMap[notification.type] || Bell;
  const timestamp = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString()
    : null;

  const handleMarkRead = () => {
    if (notification.isRead) return;
    onMarkRead?.(notification);
  };

  const handleDelete = () => {
    onDelete?.(notification);
  };

  const hasLink = notification.metadata?.link || notification.metadata?.actionLink;
  const linkLabel = notification.metadata?.actionLabel || "View details";

  return (
    <div
      className={`rounded-2xl border px-4 py-3 transition ${
        notification.isRead
          ? "border-slate-200 bg-white"
          : "border-slate-300 bg-slate-50 shadow-sm"
      } ${compact ? "text-sm" : "text-base"}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 rounded-xl p-2 ${
            notification.isRead ? "bg-slate-100 text-slate-500" : "bg-indigo-100 text-indigo-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-slate-900">
              {notification.title || "New notification"}
            </p>
            {timestamp && (
              <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                {timestamp}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">{notification.message}</p>
          {hasLink && (
            <a
              href={notification.metadata.link}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-400"
              target={notification.metadata.link?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {linkLabel}
            </a>
          )}
          {showActions && (
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={handleMarkRead}
                disabled={notification.isRead}
                className={`rounded-full border px-3 py-1 uppercase tracking-[0.25em] ${
                  notification.isRead
                    ? "border-slate-200 text-slate-400"
                    : "border-indigo-200 text-indigo-600 hover:border-indigo-400"
                }`}
              >
                Mark read
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-200 px-3 py-1 uppercase tracking-[0.25em] text-rose-600 hover:border-rose-400"
              >
                <Trash2 className="mr-1 inline h-3 w-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
