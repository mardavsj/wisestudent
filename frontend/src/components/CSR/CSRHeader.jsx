import React from "react";
import { ChevronDown, UserCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "./NotificationBell";
const CSRHeader = () => {
  const { user, logoutUser } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-indigo-600 p-2 text-white shadow">
          <UserCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">WiseStudent CSR</p>
          <p className="text-sm font-semibold text-slate-900">{user?.name || "CSR Partner"}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <button
          type="button"
          onClick={logoutUser}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-slate-400"
        >
          <ChevronDown className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default CSRHeader;
