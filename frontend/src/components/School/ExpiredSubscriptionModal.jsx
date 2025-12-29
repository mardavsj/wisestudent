import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Mail, Phone, Building2, X, RefreshCw, Shield, Lock, Zap } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-hot-toast';

const ExpiredSubscriptionModal = ({ isOpen, onClose, schoolInfo, contactInfo, onCheckAgain }) => {
  const socket = useSocket()?.socket;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Listen for subscription renewal updates
  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleAccessUpdate = (data) => {
      if (data && data.hasAccess === true) {
        toast.success('Subscription renewed! Access restored.', {
          duration: 5000,
          icon: '✅',
        });
        if (onClose) {
          onClose();
        }
      }
    };

    socket.on('teacher:access:updated', handleAccessUpdate);

    return () => {
      socket.off('teacher:access:updated', handleAccessUpdate);
    };
  }, [socket, isOpen, onClose]);

  if (!isOpen) return null;

  const schoolName = schoolInfo?.name || 'Your school';
  const contactEmail = contactInfo?.email || null;
  const contactPhone = contactInfo?.phone || null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 px-6 py-6">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Subscription Expired</h2>
                  <p className="text-white/90 text-sm mt-1 font-medium">Access Temporarily Restricted</p>
                </div>
              </div>
              {onClose && typeof onClose === 'function' && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 flex-1 overflow-y-auto">
            {/* Main Message */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl border border-red-200">
                  <Building2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {schoolName}'s subscription has expired
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    We're unable to provide access to the platform at this time. Your school administrator needs to renew the subscription to restore full access for all teachers and students.
                  </p>
                </div>
              </div>

              {/* What this means */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  What this means:
                </h4>
                <ul className="space-y-2.5 text-amber-800 text-sm">
                  <li className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>You cannot access any features or data on the platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>All dashboard features are temporarily unavailable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <RefreshCw className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Access will be automatically restored once the subscription is renewed</span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
                <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  Next Steps - Contact Your School
                </h4>
                <p className="text-indigo-800 text-sm mb-4">
                  Please reach out to your school administrator to renew the subscription:
                </p>
                <div className="space-y-3">
                  {contactEmail ? (
                    <motion.a
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href={`mailto:${contactEmail}?subject=Subscription Renewal Required&body=Hello,%0D%0A%0D%0AOur school's subscription has expired. Please renew it to restore access to the platform.%0D%0A%0D%0AThank you.`}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">Email Administrator</p>
                        <p className="text-xs text-slate-600 mt-0.5">{contactEmail}</p>
                      </div>
                    </motion.a>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                      <div className="p-2.5 bg-slate-100 rounded-lg">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">Email Administrator</p>
                        <p className="text-xs text-slate-500 mt-0.5">your school administrator</p>
                      </div>
                    </div>
                  )}
                  {contactPhone && (
                    <motion.a
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">Call Administrator</p>
                        <p className="text-xs text-slate-600 mt-0.5">{contactPhone}</p>
                      </div>
                    </motion.a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCheckAgain}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Check Again
              </motion.button>
              <div className="text-xs text-slate-500 text-right max-w-xs">
                Access will be restored automatically once renewed
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              This is an automated notification. Your access status is checked in real-time.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExpiredSubscriptionModal;
