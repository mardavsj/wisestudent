import React from "react";
import CSRSidebar from "../components/CSR/CSRSidebar";
import CSRHeader from "../components/CSR/CSRHeader";

const CSRLayout = ({ children }) => (
  <div className="min-h-screen flex bg-slate-50">
    <CSRSidebar />
    <div className="flex-1 flex flex-col">
      <CSRHeader />
      <main className="flex-1 overflow-y-auto px-4 py-6">{children}</main>
    </div>
  </div>
);

export default CSRLayout;

