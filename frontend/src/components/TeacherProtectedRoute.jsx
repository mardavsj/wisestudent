import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthUtils";
import api from "../utils/api";
import ExpiredSubscriptionModal from "./School/ExpiredSubscriptionModal";
import { Loader2 } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-hot-toast";

/**
 * ProtectedRoute specifically for school teachers that checks subscription status
 * Prevents access to all teacher routes if school subscription is expired
 */
const TeacherProtectedRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const socket = useSocket()?.socket;
  
  const [hasAccess, setHasAccess] = useState(true);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Check teacher access
  const checkTeacherAccess = async () => {
    try {
      setAccessLoading(true);
      const response = await api.get('/api/school/teacher/access');
      if (response.data.success) {
        const accessData = response.data;
        setHasAccess(accessData.hasAccess === true);
        setAccessInfo(accessData);
        
        if (!accessData.hasAccess) {
          setShowExpiredModal(true);
        }
      } else {
        setHasAccess(false);
        setShowExpiredModal(true);
      }
    } catch (error) {
      console.error('Error checking teacher access:', error);
      setHasAccess(false);
      setShowExpiredModal(true);
    } finally {
      setAccessLoading(false);
    }
  };

  // Initial access check
  useEffect(() => {
    if (user && user.role === 'school_teacher' && !authLoading) {
      checkTeacherAccess();
    } else if (user && user.role !== 'school_teacher' && !authLoading) {
      // Not a teacher, set access to false to trigger redirect
      setAccessLoading(false);
    }
  }, [user, authLoading]);

  // Listen for real-time access updates
  useEffect(() => {
    if (!socket || !user || user.role !== 'school_teacher') return;

    const handleAccessUpdate = (data) => {
      if (data) {
        setHasAccess(data.hasAccess === true);
        if (data.hasAccess === true) {
          setShowExpiredModal(false);
          toast.success('Access restored! Your school has renewed its subscription.', {
            duration: 5000,
            icon: '🎉'
          });
        } else {
          setShowExpiredModal(true);
          toast.warning('Your school\'s subscription has expired. Access restricted.', {
            duration: 5000,
            icon: '⚠️'
          });
        }
      }
    };

    socket.on('teacher:access:updated', handleAccessUpdate);

    return () => {
      socket.off('teacher:access:updated', handleAccessUpdate);
    };
  }, [socket, user]);

  // Show loading state
  if (authLoading || (user?.role === 'school_teacher' && accessLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Not logged in - let ProtectedRoute handle this
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not a teacher - redirect
  if (user.role !== 'school_teacher') {
    return <Navigate to="/" replace />;
  }

  // Subscription expired - block access
  if (!hasAccess && !accessLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ExpiredSubscriptionModal
          isOpen={true}
          onClose={() => {
            // Don't allow closing - subscription must be renewed
          }}
          schoolInfo={accessInfo ? {
            name: accessInfo.schoolName,
            planStatus: accessInfo.subscriptionStatus,
            planEndDate: accessInfo.subscriptionEndDate,
          } : null}
          contactInfo={accessInfo?.schoolContact || null}
          onCheckAgain={checkTeacherAccess}
        />
        {/* Blocked content overlay */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <p className="text-slate-600 text-sm mt-4">
              Access to this page is restricted. Please contact your school administrator to renew the subscription.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Access granted - render children
  return children;
};

export default TeacherProtectedRoute;

