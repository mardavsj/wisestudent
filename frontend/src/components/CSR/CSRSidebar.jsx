import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  Bell,
  Home,
  BarChart3,
  Target,
  DollarSign,
  FileText,
  Image,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  Calculator,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthUtils';

const CSRSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logoutUser } = useAuth();

  const navigationItems = [
        {
          section: 'Navigation',
          items: [
            { icon: Home, label: 'Dashboard', path: '/csr/dashboard', color: 'blue' },
            { icon: Bell, label: 'Notifications', path: '/csr/notifications', color: 'rose' },
            { icon: Target, label: 'Sponsorships', path: '/csr/sponsorships', color: 'purple' },
            { icon: MessageSquare, label: 'Testimonials', path: '/csr/testimonials', color: 'pink' },
            { icon: DollarSign, label: 'Funds', path: '/csr/funds', color: 'green' },
            { icon: ArrowDownRight, label: 'Refunds', path: '/csr/funds/refund', color: 'emerald' },
        { icon: FileText, label: 'Reports', path: '/csr/reports', color: 'teal' },
        { icon: Image, label: 'Gallery', path: '/csr/gallery', color: 'purple' },
        { icon: User, label: 'Profile', path: '/csr/profile', color: 'indigo' },
        { icon: Settings, label: 'Settings', path: '/csr/settings', color: 'slate' },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === '/csr/dashboard') {
      return location.pathname === '/csr/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false); // Close mobile menu after navigation
  };

  // Color mapping for each item
  const getColorClasses = (color, active) => {
    const colorMap = {
      blue: {
        activeBg: 'bg-blue-100',
        activeText: 'text-blue-700',
        activeIcon: 'text-blue-600',
        hoverBg: 'hover:bg-blue-50',
        hoverText: 'hover:text-blue-700',
        hoverIcon: 'hover:text-blue-600'
      },
      purple: {
        activeBg: 'bg-purple-100',
        activeText: 'text-purple-700',
        activeIcon: 'text-purple-600',
        hoverBg: 'hover:bg-purple-50',
        hoverText: 'hover:text-purple-700',
        hoverIcon: 'hover:text-purple-600'
      },
      indigo: {
        activeBg: 'bg-indigo-100',
        activeText: 'text-indigo-700',
        activeIcon: 'text-indigo-600',
        hoverBg: 'hover:bg-indigo-50',
        hoverText: 'hover:text-indigo-700',
        hoverIcon: 'hover:text-indigo-600'
      },
      orange: {
        activeBg: 'bg-orange-100',
        activeText: 'text-orange-700',
        activeIcon: 'text-orange-600',
        hoverBg: 'hover:bg-orange-50',
        hoverText: 'hover:text-orange-700',
        hoverIcon: 'hover:text-orange-600'
      },
      amber: {
        activeBg: 'bg-amber-100',
        activeText: 'text-amber-700',
        activeIcon: 'text-amber-600',
        hoverBg: 'hover:bg-amber-50',
        hoverText: 'hover:text-amber-700',
        hoverIcon: 'hover:text-amber-600'
      },
      green: {
        activeBg: 'bg-green-100',
        activeText: 'text-green-700',
        activeIcon: 'text-green-600',
        hoverBg: 'hover:bg-green-50',
        hoverText: 'hover:text-green-700',
        hoverIcon: 'hover:text-green-600'
      },
      teal: {
        activeBg: 'bg-teal-100',
        activeText: 'text-teal-700',
        activeIcon: 'text-teal-600',
        hoverBg: 'hover:bg-teal-50',
        hoverText: 'hover:text-teal-700',
        hoverIcon: 'hover:text-teal-600'
      },
      cyan: {
        activeBg: 'bg-cyan-100',
        activeText: 'text-cyan-700',
        activeIcon: 'text-cyan-600',
        hoverBg: 'hover:bg-cyan-50',
        hoverText: 'hover:text-cyan-700',
        hoverIcon: 'hover:text-cyan-600'
      },
      emerald: {
        activeBg: 'bg-emerald-100',
        activeText: 'text-emerald-700',
        activeIcon: 'text-emerald-600',
        hoverBg: 'hover:bg-emerald-50',
        hoverText: 'hover:text-emerald-700',
        hoverIcon: 'hover:text-emerald-600'
      },
      pink: {
        activeBg: 'bg-pink-100',
        activeText: 'text-pink-700',
        activeIcon: 'text-pink-600',
        hoverBg: 'hover:bg-pink-50',
        hoverText: 'hover:text-pink-700',
        hoverIcon: 'hover:text-pink-600'
      },
      rose: {
        activeBg: 'bg-rose-100',
        activeText: 'text-rose-700',
        activeIcon: 'text-rose-600',
        hoverBg: 'hover:bg-rose-50',
        hoverText: 'hover:text-rose-700',
        hoverIcon: 'hover:text-rose-600'
      },
      red: {
        activeBg: 'bg-red-100',
        activeText: 'text-red-700',
        activeIcon: 'text-red-600',
        hoverBg: 'hover:bg-red-50',
        hoverText: 'hover:text-red-700',
        hoverIcon: 'hover:text-red-600'
      },
      violet: {
        activeBg: 'bg-violet-100',
        activeText: 'text-violet-700',
        activeIcon: 'text-violet-600',
        hoverBg: 'hover:bg-violet-50',
        hoverText: 'hover:text-violet-700',
        hoverIcon: 'hover:text-violet-600'
      },
      slate: {
        activeBg: 'bg-slate-100',
        activeText: 'text-slate-700',
        activeIcon: 'text-slate-600',
        hoverBg: 'hover:bg-slate-50',
        hoverText: 'hover:text-slate-700',
        hoverIcon: 'hover:text-slate-600'
      }
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      <style>{`
        .csr-sidebar-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .csr-sidebar-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #e0e7ff, #f3e8ff, #fce7f3);
          border-radius: 10px;
          margin: 4px 0;
        }
        .csr-sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #a855f7, #ec4899);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .csr-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #9333ea, #db2777);
        }
        .csr-sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #e0e7ff;
        }
      `}</style>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg shadow-md shadow-indigo-500/30 hover:shadow-lg transition-all"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <Menu className="w-4 h-4" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50
          bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-r border-indigo-200/50
          w-64 flex flex-col shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-indigo-300/40 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CSR Dashboard</h2>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 hover:bg-indigo-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 csr-sidebar-scrollbar">
          {navigationItems.map((section, sectionIndex) => {
            const sectionColors = [
              { bg: 'from-blue-500/10 to-indigo-500/10', text: 'from-blue-600 to-indigo-600', border: 'border-blue-200/50' },
              { bg: 'from-green-500/10 to-emerald-500/10', text: 'from-green-600 to-emerald-600', border: 'border-green-200/50' },
              { bg: 'from-purple-500/10 to-pink-500/10', text: 'from-purple-600 to-pink-600', border: 'border-purple-200/50' },
              { bg: 'from-indigo-500/10 to-purple-500/10', text: 'from-indigo-600 to-purple-600', border: 'border-indigo-200/50' }
            ];
            const sectionColor = sectionColors[sectionIndex % sectionColors.length];
            
            return (
              <div key={section.section} className={sectionIndex > 0 ? 'mt-6' : ''}>
                {/* Section Header */}
                <div className={`px-3 mb-2 pb-2 border-b ${sectionColor.border}`}>
                  <h3 className={`text-xs font-bold bg-gradient-to-r ${sectionColor.text} bg-clip-text text-transparent uppercase tracking-wider`}>
                    {section.section}
                  </h3>
                </div>
                {/* Section Items */}
                <div className="space-y-1 px-3">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    const colors = getColorClasses(item.color, active);

                    // Gradient mappings for icon containers
                    const iconGradients = {
                      blue: 'from-blue-500 to-cyan-500',
                      purple: 'from-purple-500 to-pink-500',
                      indigo: 'from-indigo-500 to-purple-500',
                      orange: 'from-orange-500 to-amber-500',
                      amber: 'from-amber-500 to-yellow-500',
                      green: 'from-green-500 to-emerald-500',
                      teal: 'from-teal-500 to-cyan-500',
                      cyan: 'from-cyan-500 to-blue-500',
                      emerald: 'from-emerald-500 to-green-500',
                      pink: 'from-pink-500 to-rose-500',
                      rose: 'from-rose-500 to-pink-500',
                      red: 'from-red-500 to-rose-500',
                      violet: 'from-violet-500 to-purple-500',
                      slate: 'from-slate-500 to-gray-500'
                    };

                    const iconGradient = iconGradients[item.color] || 'from-blue-500 to-cyan-500';

                    return (
                      <motion.div
                        key={item.path}
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={
                            active
                              ? `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 bg-gradient-to-r ${iconGradient} text-white shadow-md`
                              : `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 text-gray-700 hover:bg-white/60 ${colors.hoverText}`
                          }
                        >
                          <div className={`p-1.5 rounded-lg ${
                            active 
                              ? 'bg-white/20 backdrop-blur-sm' 
                              : `bg-gradient-to-br ${iconGradient} opacity-60`
                          }`}>
                            <Icon
                              className={
                                active
                                  ? `w-3.5 h-3.5 flex-shrink-0 text-white`
                                  : `w-3.5 h-3.5 flex-shrink-0 text-white`
                              }
                            />
                          </div>
                          <span className="flex-1">{item.label}</span>
                          {active && (
                            <ChevronRight className="w-3.5 h-3.5 ml-auto text-white" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-indigo-200/50 bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10 backdrop-blur-sm">
          <motion.button
            onClick={logoutUser}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 hover:text-white transition-all duration-150"
          >
            <div className="p-1 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
              <LogOut className="w-3.5 h-3.5 flex-shrink-0 text-white" />
            </div>
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default CSRSidebar;
