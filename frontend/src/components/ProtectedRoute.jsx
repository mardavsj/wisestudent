import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthUtils";

const ProtectedRoute = ({ children, roles, requireApproved = false, otpOnly = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    // 🔐 OTP-only routes (e.g., reset password)
    if (otpOnly) {
        const verifiedEmail = localStorage.getItem("verified_reset_email");
        if (!verifiedEmail) {
            if (import.meta.env.DEV) {
                console.warn("⚠️ OTP route access denied. Missing verified email.");
            }
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }

    // 🔒 Not logged in
    if (!user) {
        // Only log in development to reduce console noise
        if (import.meta.env.DEV) {
            console.warn("⚠️ Route access denied. User not logged in.");
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 🔐 Role-based access control
    if (roles && !roles.includes(user.role)) {
        const isStudentEquivalent = user.role === "school_student" && roles.includes("student");

        if (!isStudentEquivalent) {
            if (import.meta.env.DEV) {
                console.warn(`⚠️ Access denied. Role '${user.role}' not permitted for this route.`);
            }
            return <Navigate to="/" replace />;
        }
    }

    // ⛔ Stakeholder not approved (seller, csr). Parents are auto-approved.
    if (requireApproved && ["seller", "csr"].includes(user.role) && !user.isApproved) {
        if (import.meta.env.DEV) {
            console.warn(`🔒 ${user.role} not approved. Redirecting to pending approval.`);
        }
        return <Navigate to="/pending-approval" state={{
            message: `Your ${user.role} account is currently under review. You will be notified once approved.`,
            user: { email: user.email }
        }} replace />;
    }

    return children;
};

export default ProtectedRoute;
