import React from 'react';
import CSRSidebar from '../components/CSR/CSRSidebar';

const CSRLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <CSRSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default CSRLayout;

