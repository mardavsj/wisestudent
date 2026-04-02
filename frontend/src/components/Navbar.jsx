import React, { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthUtils";
import { useWallet } from "../context/WalletContext";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Avatar from "./Avatar";
import {
    Bell, Wallet, ChevronDown, Settings, User, LogOut, Menu, X, Home, BarChart3, TrendingUp, Gift, MessageSquare, AlertCircle, Users, Mail, CheckCircle, FileText, Target, DollarSign, Activity, CreditCard, Presentation, Building2, Calendar, Gamepad2
} from "lucide-react";


const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const { wallet } = useWallet();
    const socket = useSocket();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const profileMenuRef = useRef(null);

    // Function to normalize avatar URL (utility kept for future use)
    // eslint-disable-next-line no-unused-vars
    const normalizeAvatarUrl = (src) => {
        const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000';
        if (!src) return '/default-avatar.png';
        if (src.startsWith('http')) return src;
        if (src.startsWith('/uploads/')) return `${apiBaseUrl}${src}`;
        return src; // e.g. /avatars/... served by frontend
    };

    const getDashboardLabel = () => {
        switch (user?.role) {
            case "admin": return "Admin Dashboard";
            case "parent": return "Parent Dashboard";
            case "seller": return "Seller Dashboard";
            case "csr": return "CSR Dashboard";
            case "school_admin": return "School Admin Dashboard";
            case "school_teacher": return "Teacher Dashboard";
            case "school_student": return "Student Dashboard";
            case "school_parent": return "Parent Dashboard";
            case "student":
            default: return "Student Dashboard";
        }
    };

    const handleDashboardRedirect = () => {
        if (!user) return;
        const paths = {
            parent: "/parent/overview",
            seller: "/seller/dashboard",
            csr: "/csr/overview",
            school_admin: "/school/admin/dashboard",
            school_teacher: "/school-teacher/overview",
            school_student: "/student/dashboard",
            school_parent: "/school-parent/dashboard",
            student: "/student/dashboard"
        };
        navigate(paths[user.role] || paths.student);
    };

    const hasSchoolAccess = Boolean(
        user?.role === "school_student" ||
        user?.role === "school_parent" ||
        user?.school ||
        user?.schoolDetails ||
        user?.schoolId ||
        user?.orgId ||
        (typeof user?.tenantId === "string" && user.tenantId.startsWith("school_"))
    );
    const isIndividualStudent = user?.role === "student" && !hasSchoolAccess;
    const isIndividualParent = user?.role === "parent" && !hasSchoolAccess;

    const handleDisabledNavClick = (label) => {
        if (
            (user?.role === "school_student" ||
                user?.role === "school_parent" ||
                ((user?.role === "student" || user?.role === "parent") && hasSchoolAccess)) &&
            label === "Upgrade"
        ) {
            toast("School accounts can only upgrade through your school.");
            return;
        }
        if (user?.role === "student" && !isIndividualStudent) return;
        if (user?.role === "parent" && !isIndividualParent) return;
        const itemName = label ? `${label} ` : "";
        toast(`${itemName}is available after you link to a school.`);
    };

    const navigationItems = user?.role === "student" ? [
        { icon: <Bell className="w-5 h-5" />, label: "Announcements", onClick: () => navigate("/student/announcements"), disabled: isIndividualStudent },
        { icon: <Activity className="w-5 h-5" />, label: "Activity", onClick: () => navigate("/student/activity"), disabled: isIndividualStudent },
        { icon: <CreditCard className="w-5 h-5" />, label: "Upgrade", onClick: () => navigate("/student/payment"), disabled: !isIndividualStudent },
        { icon: <Presentation className="w-5 h-5" />, label: "Presentation", onClick: () => navigate("/student/presentation"), disabled: isIndividualStudent }
    ] : user?.role === "school_student" ? [
        { icon: <Bell className="w-5 h-5" />, label: "Announcements", onClick: () => navigate("/school-student/announcements") },
        { icon: <Activity className="w-5 h-5" />, label: "Activity", onClick: () => navigate("/student/activity") },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Chat", onClick: () => navigate("/school-student/chat") },
        { icon: <CreditCard className="w-5 h-5" />, label: "Upgrade", onClick: () => navigate("/student/payment"), disabled: true },
        { icon: <Presentation className="w-5 h-5" />, label: "Presentation", onClick: () => navigate("/student/presentation") }
    ] : user?.role === "parent" ? [
        { icon: <Users className="w-5 h-5" />, label: "Children", onClick: () => navigate("/parent/children") },
        { icon: <Gamepad2 className="w-5 h-5" />, label: "Module", onClick: () => navigate("/parent/games") },
        { icon: <Bell className="w-5 h-5" />, label: "Announcements", onClick: () => navigate("/parent/announcements") },
        {
            icon: <CreditCard className="w-5 h-5" />,
            label: "Upgrade",
            onClick: () => navigate("/parent/upgrade"),
            disabled: hasSchoolAccess,
        }
    ] : user?.role === "admin" ? [
        { icon: <CheckCircle className="w-5 h-5" />, label: "Approvals", onClick: () => navigate("/admin/approvals") },
        { icon: <Building2 className="w-5 h-5" />, label: "Schools", onClick: () => navigate("/admin/schools") },
        { icon: <Users className="w-5 h-5" />, label: "Individuals", onClick: () => navigate("/admin/individuals") },
        { icon: <AlertCircle className="w-5 h-5" />, label: "Incidents", onClick: () => navigate("/admin/incidents") },
        { icon: <Activity className="w-5 h-5" />, label: "Tracker", onClick: () => navigate("/admin/tracking") },
        { icon: <FileText className="w-5 h-5" />, label: "Reports", onClick: () => navigate("/admin/reports") }
    ] : user?.role === "school_admin" ? [
        { icon: <Users className="w-5 h-5" />, label: "Students", onClick: () => navigate("/school/admin/students") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", onClick: () => navigate("/school/admin/analytics") },
        { icon: <Bell className="w-5 h-5" />, label: "Announcements", onClick: () => navigate("/school/admin/announcements") },
        { icon: <CheckCircle className="w-5 h-5" />, label: "Approvals", onClick: () => navigate("/school/admin/approvals") },
        { icon: <FileText className="w-5 h-5" />, label: "Templates", onClick: () => navigate("/school/admin/templates") },
        { icon: <CreditCard className="w-5 h-5" />, label: "Payment Tracker", onClick: () => navigate("/school/admin/payment-tracker") }
    ] : user?.role === "school_teacher" ? [
        { icon: <Users className="w-5 h-5" />, label: "Students", onClick: () => navigate("/school-teacher/students") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", onClick: () => navigate("/school-teacher/analytics") },
        { icon: <Gamepad2 className="w-5 h-5" />, label: "Module", onClick: () => navigate("/school-teacher/games") },
        { icon: <Bell className="w-5 h-5" />, label: "Announcements", onClick: () => navigate("/school-teacher/announcements") },
        { icon: <CheckCircle className="w-5 h-5" />, label: "Tasks", onClick: () => navigate("/school-teacher/tasks") },
        
    ] : user?.role === "school_parent" ? [
        { icon: <Users className="w-5 h-5" />, label: "Children", onClick: () => navigate("/school-parent/children") },
        { icon: <Bell className="w-5 h-5" />, label: "Announcements", onClick: () => navigate("/school-parent/announcements") },
        { icon: <Mail className="w-5 h-5" />, label: "Messages", onClick: () => navigate("/school-parent/messages") },
        { icon: <CreditCard className="w-5 h-5" />, label: "Payment Tracker", onClick: () => navigate("/school-parent/payment-tracker") }
    ] : user?.role === "csr" ? [
        { icon: <Target className="w-5 h-5" />, label: "Overview", onClick: () => navigate("/csr/overview") },
        { icon: <FileText className="w-5 h-5" />, label: "Reports", onClick: () => navigate("/csr/reports") },
    ] : [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect }
    ];

    const displayName = useMemo(() => {
        const nameSources = [
            user?.fullName,
            user?.name,
            user?.profile?.fullName,
            user?.profile?.name,
        ].filter(Boolean);
        if (nameSources.length) {
            const trimmed = nameSources[0].toString().trim();
            if (trimmed) return trimmed;
        }
        if (user?.email) {
            const emailName = user.email.split("@")[0];
            if (emailName) return emailName;
        }
        return "User";
    }, [user]);

    const shortDisplayName = useMemo(() => {
        if (!displayName) return "User";
        const parts = displayName.trim().split(/\s+/);
        return parts[0] || displayName;
    }, [displayName]);

    const profileMenuItems = [
        { icon: <User className="w-5 h-5" />, label: "Profile", 
        onClick: () => {
            if (user?.role === "student" || user?.role === "school_student") {
                navigate("/student/profile");
            } else if (user?.role === "admin") {
                navigate("/admin/profile");
            } else {
                navigate(`/${user?.role}/profile`);
            }
        }},
        { icon: <Settings className="w-5 h-5" />, label: "Settings", onClick: () => {
            if (user?.role === "student" || user?.role === "school_student") {
                navigate("/student/settings");
            } else if (user?.role === "admin") {
                navigate("/admin/settings");
            } else {
                navigate(`/${user?.role}/settings`);
            }
        }},
        { icon: <LogOut className="w-5 h-5" />, label: "Sign Out", onClick: logoutUser, danger: true }
    ];

    const profileMenuVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMobileMenu) {
            // Save current scroll position
            const scrollY = window.scrollY;
            // Prevent scrolling
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            return () => {
                // Restore scrolling
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                // Restore scroll position
                window.scrollTo(0, scrollY);
            };
        }
    }, [showMobileMenu]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setShowProfileMenu(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showProfileMenu]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            // Only fetch if user is authenticated
            const token = localStorage.getItem('finmen_token');
            if (!token) {
                setUnreadCount(0);
                return;
            }

            try {
                const response = await api.get('/api/notifications/unread-count');
                if (response.status === 200) setUnreadCount(response.data.count || 0);
            } catch (error) {
                // Don't log auth errors as they're handled by the interceptor
                if (error.response?.status !== 401) {
                    console.error("Error fetching unread count:", error);
                }
                setUnreadCount(0);
            }
        };

        // Only fetch if user exists
        if (user) {
            fetchUnreadCount();
        } else {
            setUnreadCount(0);
        }

        if (socket?.socket && user) {
            socket.socket.on('student:notifications:update', fetchUnreadCount);
            return () => socket.socket.off('student:notifications:update', fetchUnreadCount);
        }
    }, [socket, user]);

    return (
        <>
            <header className="w-full bg-white shadow-lg sticky top-0 z-50">
                {/* Subtle gradient border at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center justify-between sm:gap-4 gap-0 h-16 sm:h-20">
                        {/* Logo/Brand */}
                        <motion.div
                            className="flex-shrink-0 flex items-center cursor-pointer"
                            onClick={handleDashboardRedirect}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                src="/icons/icon.png"
                                alt="WiseStudent logo"
                                className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
                            />
                            <div className="ml-0 sm:ml-3">
                                <h1 className="hidden lg:block text-lg sm:text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">WiseStudent</h1>
                                <p className="hidden lg:block text-xs text-gray-600 font-semibold">{getDashboardLabel()}</p>
                            </div>
                        </motion.div>
                        

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 flex-1 justify-center max-w-6xl overflow-x-auto scrollbar-hide">
                            {navigationItems.map((item, index) => (
                                <motion.button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        if (item.disabled) {
                                            handleDisabledNavClick(item.label);
                                            return;
                                        }
                                        item.onClick();
                                    }}
                                    aria-disabled={item.disabled ? "true" : "false"}
                                    className={`flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                                        item.disabled
                                            ? "text-slate-400 bg-slate-100 border border-slate-200 shadow-none cursor-pointer"
                                            : "text-slate-700 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 border border-slate-200 hover:border-indigo-300 duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                    }`}
                                    whileHover={item.disabled ? undefined : { scale: 1.05, y: -2 }}
                                    whileTap={item.disabled ? undefined : { scale: 0.98 }}
                                >
                                    <div className={item.disabled ? "w-4 h-4 text-slate-400" : "w-4 h-4 text-indigo-600"}>{item.icon}</div>
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </motion.button>
                            ))}
                        </nav>

                        {/* Tablet Navigation (md to lg) */}
                        <nav className="hidden md:flex lg:hidden items-center gap-1.5 flex-1 justify-center max-w-4xl overflow-x-auto scrollbar-hide">
                            {navigationItems.slice(0, 6).map((item, index) => (
                                <motion.button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        if (item.disabled) {
                                            handleDisabledNavClick(item.label);
                                            return;
                                        }
                                        item.onClick();
                                    }}
                                    aria-disabled={item.disabled ? "true" : "false"}
                                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                                        item.disabled
                                            ? "text-slate-400 bg-slate-100 border border-slate-200 shadow-none cursor-pointer"
                                            : "text-slate-700 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 border border-slate-200 hover:border-indigo-300 duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                    }`}
                                    whileHover={item.disabled ? undefined : { scale: 1.05, y: -2 }}
                                    whileTap={item.disabled ? undefined : { scale: 0.98 }}
                                >
                                    <div className={item.disabled ? "w-3.5 h-3.5 text-slate-400" : "w-3.5 h-3.5 text-indigo-600"}>{item.icon}</div>
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </motion.button>
                            ))}
                            {navigationItems.length > 6 && (
                                <motion.button
                                    onClick={() => setShowMobileMenu(true)}
                                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 border border-slate-200 hover:border-indigo-300 duration-200 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap flex-shrink-0 transition-all"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="w-3.5 h-3.5 text-indigo-600">⋯</div>
                                    <span className="whitespace-nowrap">More</span>
                                </motion.button>
                            )}
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                            {user && (
                                <>
                                    {(user.role === "student" || user.role === "school_student") && (
                                        <motion.button
                                            className="hidden md:flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-2 border-yellow-500 cursor-pointer"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate("/student/wallet")}
                                        >
                                            <Wallet className="w-4 h-4" />
                                            <span className="font-black">{wallet?.balance || 0}</span>
                                            <span className="hidden sm:inline text-xs">Coins</span>
                                        </motion.button>
                                    )}

                                    {( user.role === "admin") && (
                                        <motion.button
                                            className="hidden md:flex relative p-2 sm:p-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                            whileHover={{ scale: 1.08, rotate: -10 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/${user.role}/notifications`)}
                                        >
                                            <Bell className="w-5 h-5" />
                                            {unreadCount > 0 && (
                                                <motion.span
                                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </motion.span>
                                            )}
                                        </motion.button>
                                    )}
                                    {(user.role === "student" || user.role === "school_student") && (
                                        <motion.button
                                            className="hidden md:flex relative p-2 sm:p-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                            whileHover={{ scale: 1.08, rotate: -10 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/student/notifications`)}
                                        >
                                            <Bell className="w-5 h-5" />
                                            {unreadCount > 0 && (
                                                <motion.span
                                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </motion.span>
                                            )}
                                        </motion.button>
                                    )}

                                    {/* Chat Icon for Teachers */}
                                    {user.role === "school_teacher" && (
                                        <motion.button
                                            className="relative p-2 sm:p-2.5 text-indigo-600 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/school-teacher/chat-contacts`)}
                                            title="Chat with Students and Parents"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </motion.button>
                                    )}

                                    {/* Profile Menu */}
                                    <div className="relative" ref={profileMenuRef}>
                                        <motion.button
                                            className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-lg bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 border border-slate-200 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowProfileMenu(!showProfileMenu);
                                            }}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <div className="relative">
                                                <Avatar
                                                    user={user}
                                                    size="xsmall"
                                                    className=""
                                                />
                                                <motion.div
                                                    className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-lg"
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            </div>
                                            <div className="hidden xl:block text-left">
                                                <p className="text-xs font-bold text-gray-900 leading-tight">{shortDisplayName}</p>
                                                <p className="text-xs text-gray-600 font-medium capitalize leading-tight">{user.role?.replace('_', ' ')}</p>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                        </motion.button>
                                        <AnimatePresence>
                                            {showProfileMenu && (
                                                <motion.div
                                                    variants={profileMenuVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="absolute right-0 mt-3 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 overflow-hidden"
                                                >
                                                    <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <Avatar
                                                                user={user}
                                                                size="medium"
                                                                className="border-2 rounded-full border-white shadow-xl ring-4 ring-indigo-100"
                                                            />
                                                            <div>
                                                                <p className="text-sm sm:text-base font-bold text-gray-900">{displayName}</p>
                                                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <motion.span
                                                            className="inline-block text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg"
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            {user.role === "student" ? "🎓 Student Account" :
                                                                user.role === "parent" ? "👨‍👩‍👧 Parent Account" :
                                                                    user.role === "seller" ? "🛍️ Seller Account" :
                                                                        user.role === "csr" ? "🤝 CSR Account" :
                                                                            user.role === "school_admin" ? "🏫 School Admin Account" :
                                                                                user.role === "school_teacher" ? "👨‍🏫 Teacher Account" :
                                                                                    user.role === "school_student" ? "📚 Student Account" :
                                                                                        user.role === "school_parent" ? "👪 Parent Account" :
                                                                                            "⚡ Admin Account"}
                                                        </motion.span>
                                                    </div>
                                                    {profileMenuItems.map((item, index) => (
                                                        <motion.button
                                                            key={index}
                                                            onClick={() => {
                                                                item.onClick();
                                                                setShowProfileMenu(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-semibold transition-all duration-200 ${item.danger
                                                                    ? 'text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50'
                                                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                                                                }`}
                                                            whileHover={{ x: 5, scale: 1.02 }}
                                                        >
                                                            {item.icon}
                                                            <span>{item.label}</span>
                                                        </motion.button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <motion.button
                                className="md:hidden p-2 text-slate-700 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mobile-menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMobileMenu(!showMobileMenu);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Sidebar */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            className="md:hidden fixed inset-0 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Dark overlay background */}
                            <motion.div
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                                onClick={() => setShowMobileMenu(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Mobile menu panel */}
                            <motion.div
                                className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                    mass: 0.8
                                }}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Menu header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                <img
                                                    src="/icons/icon.png"
                                                    alt="WiseStudent logo"
                                                    className="w-5 h-5 object-contain"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <h2 className="text-lg font-semibold text-gray-900">WiseStudent</h2>
                                                <p className="text-xs text-gray-600 font-medium">{getDashboardLabel()}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* User info section */}
                                    {user && (
                                        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    user={user}
                                                    size="small"
                                                    className="border-2 border-white shadow-md"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                                                    <p className="text-xs text-gray-600 truncate capitalize">{user.role?.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Menu items */}
                                    <div className="flex flex-col p-4 space-y-2 flex-grow overflow-y-auto">
                                        {navigationItems.map((item, index) => (
                                            <motion.button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    if (item.disabled) {
                                                        handleDisabledNavClick(item.label);
                                                        return;
                                                    }
                                                    item.onClick();
                                                    setShowMobileMenu(false);
                                                }}
                                                aria-disabled={item.disabled ? "true" : "false"}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                                                    item.disabled
                                                        ? "text-slate-400 bg-slate-100 cursor-pointer"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                                whileTap={item.disabled ? undefined : { scale: 0.98 }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className={item.disabled ? "w-5 h-5 text-slate-400" : "w-5 h-5 text-gray-600"}>{item.icon}</div>
                                                <span>{item.label}</span>
                                            </motion.button>
                                        ))}

                                        {/* Wallet button for students */}
                                        {(user?.role === "student" || user?.role === "school_student") && (
                                            <motion.button
                                                onClick={() => {
                                                    navigate("/student/wallet");
                                                    setShowMobileMenu(false);
                                                }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-medium text-left mt-2"
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: navigationItems.length * 0.05 }}
                                            >
                                                <Wallet className="w-5 h-5" />
                                                <div className="flex-1">
                                                    <span>Wallet</span>
                                                    <p className="text-xs font-bold">{wallet?.balance || 0} Coins</p>
                                                </div>
                                            </motion.button>
                                        )}

                                        {/* Notifications button */}
                                        {user && (
                                            <motion.button
                                                onClick={() => {
                                                    if (user.role === "admin") {
                                                        navigate(`/admin/notifications`);
                                                    } else if (user.role === "student" || user.role === "school_student") {
                                                        navigate(`/student/notifications`);
                                                    }
                                                    setShowMobileMenu(false);
                                                }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium text-left relative"
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: (navigationItems.length + 1) * 0.05 }}
                                            >
                                                <div className="relative">
                                                    <Bell className="w-5 h-5 text-gray-600" />
                                                    {unreadCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                            {unreadCount > 9 ? '9+' : unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <span>Notifications</span>
                                            </motion.button>
                                        )}

                                        {/* Profile menu items */}
                                        <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
                                            {profileMenuItems.map((item, index) => (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => {
                                                        item.onClick();
                                                        setShowMobileMenu(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                                                        item.danger
                                                            ? 'text-red-600 hover:bg-red-50'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                    whileTap={{ scale: 0.98 }}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: (navigationItems.length + 3 + index) * 0.05 }}
                                                >
                                                    <div className="w-5 h-5">{item.icon}</div>
                                                    <span>{item.label}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Navbar;
