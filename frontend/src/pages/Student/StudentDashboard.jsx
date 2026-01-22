import React, { useEffect, useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Smile,
    Gamepad2,
    HandHeart,
    Cpu,
    ArrowRight,
    HeartHandshake,
    Globe,
    Leaf,
    Book,
    Wallet,
    Gift,
    Bell,
    TrendingUp,
    User,
    Heart,
    Star,
    Flame,
    Trophy,
    Calendar,
    ArrowUp,
    Sparkles,
    Zap,
    Target,
    Award,
    Crown,
    Rocket,
    Shield,
    Diamond,
    ChevronRight,
    Play,
    BarChart3,
    Clock,
    Coins,
    Lock,
    TrendingDown,
    Minus,
    Activity,
    Brain,
    Timer,
    CheckCircle2,
    CheckCircle,
    Mail,
    Lightbulb,
    Medal,
    Eye,
    EyeOff,
    MessageCircle,
    Inbox,
    Loader,
    RefreshCw,
    X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../context/WalletContext";
import { useSubscription } from "../../context/SubscriptionContext";
import { fetchStudentAchievements } from "../../services/studentService";
import { logActivity } from "../../services/activityService";
import UpgradePrompt from "../../components/UpgradePrompt";
import { 
    fetchStudentDashboardData, 
    fetchNotifications,
    markNotificationAsRead,
    cacheDashboardData,
    fetchPillarMastery,
    fetchEmotionalScore,
    fetchEngagementMinutes,
    fetchActivityHeatmap,
    fetchMoodTimeline,
    fetchRecommendations,
    fetchLeaderboardSnippet,
    fetchAchievementTimeline,
    fetchDailyActions
} from "../../services/dashboardService";
import { toast } from "react-hot-toast";
import { mockFeatures } from "../../data/mockFeatures";
import schoolSponsorshipService from "../../services/schoolSponsorshipService";
import { useSocket } from '../../context/SocketContext';
import api from "../../utils/api";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user, fetchUser } = useAuth();
    const { wallet, refreshWallet, setWallet } = useWallet();
    const { subscription, canAccessPillar, hasFeature, refreshSubscription } = useSubscription();
    const socketContext = useSocket();
    const socket = socketContext?.socket || null;
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState(null);
    const [featureCards, setFeatureCards] = useState([]);
    const [achievements, setAchievements] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [notifications, setNotifications] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [stats, setStats] = useState({
        xp: 0,
        level: 1,
        nextLevelXp: 1000,
        todayMood: "😊",
        streak: 0,
        rank: 0,
        weeklyXP: 0,
    });
    const [loading, setLoading] = useState(true);
    
    // New analytics data states
    const [pillarMastery, setPillarMastery] = useState(null);
    const [emotionalScore, setEmotionalScore] = useState(null);
    const [engagementMinutes, setEngagementMinutes] = useState(null);
    const [activityHeatmap, setActivityHeatmap] = useState(null);
    const [moodTimeline, setMoodTimeline] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);
    const [recommendationsLastUpdated, setRecommendationsLastUpdated] = useState(null);
    const [dismissedRecommendations, setDismissedRecommendations] = useState(new Set()); // Track dismissed recommendation IDs
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [achievementTimeline, setAchievementTimeline] = useState(null);
    const [dailyActions, setDailyActions] = useState(null);
    const [newAchievementIds, setNewAchievementIds] = useState(new Set());
    const [sponsorBadge, setSponsorBadge] = useState(null);
    const [sponsorshipLoading, setSponsorshipLoading] = useState(true);
    
    // Track if data has been loaded to prevent unnecessary refetches
    const dataLoadedRef = useRef(false);
    const lastUserIdRef = useRef(null);
    
    // Profile completion modal state
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        dateOfBirth: "",
        gender: "",
        registrationType: "individual", // "individual" or "school"
        schoolLinkingCode: "",
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [savingProfile, setSavingProfile] = useState(false);
    
    // Calculate user's age from date of birth
    const calculateUserAge = (dob) => {
        if (!dob) return null;
        
        // Handle both string and Date object formats
        const dobDate = typeof dob === 'string' ? new Date(dob) : new Date(dob);
        if (isNaN(dobDate.getTime())) return null;
        
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        // Adjust if birthday hasn't occurred this year yet
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        return age;
    };

    const getPillarNameFromType = (gameType) => {
        const map = {
            ai: "AI for All",
            brain: "Brain Teasers",
            finance: "Finance Literacy",
            financial: "Finance Literacy",
            mental: "Mental Health",
            educational: "Educational",
            uvls: "UVLS",
            dcos: "Digital Citizenship & Online Safety",
            moral: "Moral Values",
            ehe: "Entrepreneurship & Higher Education",
            crgc: "Civic Responsibility & Global Citizenship",
            "civic-responsibility": "Civic Responsibility & Global Citizenship",
            "health-male": "Health - Male",
            "health-female": "Health - Female",
            sustainability: "Sustainability"
        };

        return map[gameType] || "Unknown";
    };

    const getAgeGroupFromGameId = (gameId = "") => {
        if (gameId.includes("kids")) return "Kids";
        if (gameId.includes("teen")) return "Teen";
        return "Unknown";
    };
    
    // Check if user can access a specific game based on age and completion
    // eslint-disable-next-line no-unused-vars
    const canAccessGame = (gameType, userAge) => {
        if (userAge === null) return false;
        
        switch (gameType) {
            case 'kids':
                // Kids games: accessible to users under 18, locked for 18+
                return userAge < 18;
            case 'teens':
                // Teens games: accessible to users under 18, locked for 18+
                return userAge < 18;
            case 'adults':
                // Adult games: accessible to users 18 and above
                return userAge >= 18;
            default:
                return true;
        }
    };
    
    // Check if kids games are completed (in a real app, this would check actual completion)
    // eslint-disable-next-line no-unused-vars
    const areKidsGamesCompleted = () => {
        // For demo purposes, we'll simulate this with a simple check
        // In a real implementation, this would check the user's game progress
        return false; // Will be updated to check actual completion of 20 games
    };
    
    // Check if teen games are completed (in a real app, this would check actual completion)
    // eslint-disable-next-line no-unused-vars
    const areTeenGamesCompleted = () => {
        // For demo purposes, we'll simulate this with a simple check
        // In a real implementation, this would check the user's game progress
        return false; // Will be updated to check actual completion of 20 games
    };
    
    // Get game access status for the current user
    // eslint-disable-next-line no-unused-vars
    const getGameAccessStatus = () => {
        const userAge = calculateUserAge(user?.dateOfBirth || user?.dob);
        if (userAge === null) return {};
        
        return {
            userAge,
        };
    };
    
    // Track dashboard page view (non-blocking)
    useEffect(() => {
        // Log dashboard view activity (deferred to not block rendering)
        setTimeout(() => {
            logActivity({
                activityType: "page_view",
                description: "Viewed student dashboard",
                metadata: {
                    page: "/student/dashboard",
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
        }, 0);
        
        // Welcome toast for returning users
        if (user?.name && user?._id) {
            const welcomeToastKey = `finmen_student_welcome_${user._id}`;
            const hasShownWelcomeToast = sessionStorage.getItem(welcomeToastKey);

            if (!hasShownWelcomeToast) {
                // Defer toast to not block initial render
                setTimeout(() => {
                    toast.success(`Welcome back, ${user.name}! 🎮`, {
                        duration: 3000,
                        position: "top-center",
                        icon: "👋"
                    });
                }, 300);
                sessionStorage.setItem(welcomeToastKey, "true");
            }
        }
    }, [user]);
    
    // Set feature cards immediately (no API call needed)
    useEffect(() => {
        setFeatureCards(mockFeatures);
    }, []);

    useEffect(() => {
        let mounted = true;
        const loadBadge = async () => {
            setSponsorshipLoading(true);
            try {
                const response = await schoolSponsorshipService.getDetails();
                if (!mounted) return;
                if (response?.sponsorship) {
                    const sponsor = response.sponsorship.sponsorId || {};
                    setSponsorBadge({
                        sponsorName: sponsor.companyName,
                        sponsorLogo: sponsor.metadata?.logo,
                        startDate: response.sponsorship.startDate,
                        endDate: response.sponsorship.endDate,
                        studentCount: response.studentCount,
                    });
                } else {
                    setSponsorBadge(null);
                }
            } catch (err) {
                console.error("Sponsor badge load error:", err);
            } finally {
                if (mounted) setSponsorshipLoading(false);
            }
        };
        loadBadge();
        return () => {
            mounted = false;
        };
    }, [user]);

    // Optimized: Load critical dashboard data in parallel
    const loadDashboardData = React.useCallback(async () => {
        try {
            setLoading(true);

            // Log dashboard data loading activity (non-blocking)
            setTimeout(() => {
                logActivity({
                    activityType: "data_fetch",
                    description: "Loading comprehensive dashboard data",
                    metadata: {
                        action: "load_dashboard_data",
                        timestamp: new Date().toISOString()
                    },
                    pageUrl: window.location.pathname
                });
            }, 0);

            // Fetch all critical data in parallel (dashboard data, leaderboard, notifications, wallet)
            const [dashboardDataResult, leaderboardDataResult, notificationDataResult] = await Promise.all([
                fetchStudentDashboardData().catch(err => {
                    console.error("Failed to fetch dashboard data:", err);
                    return { stats: null, achievements: [] };
                }),
                fetchLeaderboardSnippet().catch(() => ({ currentUserRank: null, leaderboard: [], currentUserXP: 0, totalUsers: 0 })),
                fetchNotifications('student', true).catch(() => [])
            ]);

            const data = dashboardDataResult;
            console.log("📊 Dashboard data received:", data);
            setDashboardData(data);
            setNotifications(notificationDataResult);
            setLeaderboardData(leaderboardDataResult);
            
            // Update stats with leaderboard rank
            if (data.stats) {
                const userRank = leaderboardDataResult?.currentUserRank ?? data.stats.rank ?? 0;
                
                setStats({
                    xp: data.stats.xp || 0,
                    level: data.stats.level || 1,
                    nextLevelXp: data.stats.nextLevelXp || 1000,
                    todayMood: data.stats.todayMood || "😊",
                    streak: data.stats.streak || 0,
                    rank: userRank,
                    weeklyXP: data.stats.weeklyXP || 0,
                });
            } else {
                console.error("❌ No stats data in response:", data);
                setStats({
                    xp: 0,
                    level: 1,
                    nextLevelXp: 1000,
                    todayMood: "😊",
                    streak: 0,
                    rank: 0,
                    weeklyXP: 0,
                });
            }
            
            if (data.achievements) {
                setAchievements(data.achievements);
            }

            // Cache the dashboard data
            cacheDashboardData('student', data);
            
        } catch (err) {
            // Log error activity (non-blocking)
            setTimeout(() => {
                logActivity({
                    activityType: "error",
                    description: "Failed to load dashboard data",
                    metadata: {
                        errorMessage: err.message || "Unknown error",
                        timestamp: new Date().toISOString()
                    },
                    pageUrl: window.location.pathname
                });
            }, 0);
            
            // Show error toast
            toast.error("Could not load dashboard data. Please try refreshing the page.", {
                duration: 5000,
                position: "top-center",
                icon: "❌"
            });
            
            console.error("❌ Failed to load dashboard data", err);
            console.error("Error details:", err.response?.data || err.message);
            
            // Set default stats to prevent UI breaking
            setStats({
                xp: 0,
                level: 1,
                nextLevelXp: 1000,
                todayMood: "😊",
                streak: 0,
                rank: 0,
                weeklyXP: 0,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Load notifications (separate for refresh purposes)
    const loadNotifications = React.useCallback(async () => {
        try {
            const notificationData = await fetchNotifications('student', true);
            setNotifications(notificationData);
        } catch (err) {
            console.error("❌ Failed to load notifications", err);
        }
    }, []);

    // Load analytics data (deferred - non-critical, loads after initial render)
    const loadAnalyticsData = React.useCallback(async () => {
        try {
            const [
                pillarData, 
                emotionalData, 
                engagementData,
                heatmapData,
                timelineData,
                recommendationsData,
                achievementsData,
                dailyActionsData
            ] = await Promise.all([
                fetchPillarMastery(),
                fetchEmotionalScore(),
                fetchEngagementMinutes(),
                fetchActivityHeatmap(),
                fetchMoodTimeline(),
                fetchRecommendations(),
                fetchAchievementTimeline(),
                fetchDailyActions()
            ]);
            
            setPillarMastery(pillarData);
            setEmotionalScore(emotionalData);
            setEngagementMinutes(engagementData);
            setActivityHeatmap(heatmapData);
            setMoodTimeline(timelineData);
            setRecommendations(recommendationsData);
            setRecommendationsLastUpdated(new Date());
            setAchievementTimeline(achievementsData);
            setDailyActions(dailyActionsData);
            
            // Note: Leaderboard rank is already set from loadDashboardData, no need to fetch again
        } catch (err) {
            console.error("❌ Failed to load analytics data", err);
        }
    }, []);

    // Refresh recommendations function
    const refreshRecommendations = React.useCallback(async () => {
        try {
            setRecommendationsLoading(true);
            const recommendationsData = await fetchRecommendations();
            setRecommendations(recommendationsData);
            setRecommendationsLastUpdated(new Date());
            toast.success("Recommendations updated!", {
                duration: 2000,
                position: "bottom-center",
                icon: "✨"
            });
        } catch (err) {
            console.error("❌ Failed to refresh recommendations", err);
            toast.error("Failed to refresh recommendations", {
                duration: 3000,
                position: "bottom-center"
            });
        } finally {
            setRecommendationsLoading(false);
        }
    }, []);

    // Handle notification click
    // eslint-disable-next-line no-unused-vars
    const handleNotificationClick = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            // Refresh notifications
            loadNotifications();
            
            toast.success("Notification marked as read", {
                duration: 2000,
                position: "bottom-center",
                icon: "✅"
            });
        } catch (err) {
            console.error("❌ Failed to mark notification as read", err);
        }
    };


    const handleNavigate = async (path, featureTitle, recommendationData = null) => {
        if (path && typeof path === "string") {
            console.log("Navigating to:", path);
            
            // Track recommendation interaction if this is from a recommendation
            if (recommendationData) {
                try {
                    await api.post('/api/stats/recommendations/track', {
                        recommendationId: recommendationData.recommendationId,
                        recommendationType: recommendationData.type,
                        recommendationTitle: recommendationData.title,
                        recommendationPath: recommendationData.path,
                        recommendationReason: recommendationData.reason,
                        recommendationPriority: recommendationData.priority,
                        recommendationScore: recommendationData.score,
                        action: 'clicked',
                        position: recommendationData.position,
                        metadata: {
                            recommendationGeneratedAt: recommendations?.generatedAt,
                            pageUrl: window.location.pathname
                        }
                    });
                } catch (error) {
                    console.error('Failed to track recommendation interaction:', error);
                    // Don't block navigation on tracking failure
                }
            }
            
            // Log feature usage activity
            logActivity({
                activityType: "navigation",
                description: `Navigated to: ${featureTitle || path}`,
                metadata: {
                    featurePath: path,
                    featureTitle: featureTitle,
                    fromPage: "dashboard",
                    timestamp: new Date().toISOString(),
                    isRecommendation: !!recommendationData
                },
                pageUrl: window.location.pathname
            });
            
            navigate(path);
        } else {
            console.log("Invalid path, navigating to default");
            navigate("/student/dashboard");
        }
    };

    // Handle dismissing a recommendation
    const handleDismissRecommendation = async (recommendationData, index) => {
        try {
            // Track dismissal
            await api.post('/api/stats/recommendations/track', {
                recommendationId: recommendationData.recommendationId,
                recommendationType: recommendationData.type,
                recommendationTitle: recommendationData.title,
                recommendationPath: recommendationData.path,
                recommendationReason: recommendationData.reason,
                recommendationPriority: recommendationData.priority,
                recommendationScore: recommendationData.score,
                action: 'dismissed',
                position: index + 1,
                metadata: {
                    recommendationGeneratedAt: recommendations?.generatedAt,
                    pageUrl: window.location.pathname
                }
            });

            // Add to dismissed set to hide it immediately
            setDismissedRecommendations(prev => new Set([...prev, recommendationData.recommendationId]));

            // Show subtle toast
            toast.success("Recommendation dismissed", {
                duration: 2000,
                position: "bottom-center",
                icon: "✓"
            });
        } catch (error) {
            console.error('Failed to track recommendation dismissal:', error);
            // Still hide it locally even if tracking fails
            setDismissedRecommendations(prev => new Set([...prev, recommendationData.recommendationId]));
        }
    };

    // Check if profile needs to be completed (for Google users)
    useEffect(() => {
        if (user && (user.role === "student" || user.role === "school_student")) {
            // Check if user is from Google and missing DOB or gender
            if (user.fromGoogle && (!user.dateOfBirth || !user.gender)) {
                setShowProfileModal(true);
            }
        }
    }, [user]);

    // Reload pillar data when user gender changes (for real-time updates)
    useEffect(() => {
        if (user?.gender && (user.role === "student" || user.role === "school_student")) {
            loadAnalyticsData(); // Reload pillar mastery data
        }
    }, [user?.gender]); // eslint-disable-line react-hooks/exhaustive-deps

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showProfileModal) {
            // Save current overflow style
            const originalStyle = window.getComputedStyle(document.body).overflow;
            // Disable scrolling
            document.body.style.overflow = 'hidden';
            // Cleanup function to restore scrolling when modal closes
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [showProfileModal]);

    // Handle profile completion
    const handleCompleteProfile = async () => {
        setProfileErrors({});
        
        if (!profileForm.dateOfBirth) {
            setProfileErrors({ dateOfBirth: "Date of birth is required" });
            return;
        }
        
        if (!profileForm.gender) {
            setProfileErrors({ gender: "Gender is required" });
            return;
        }

        // Validate registration type selection
        if (!profileForm.registrationType) {
            setProfileErrors({ registrationType: "Please select a registration type" });
            return;
        }

        // If school registration, validate linking code
        if (profileForm.registrationType === "school") {
            if (!profileForm.schoolLinkingCode || !profileForm.schoolLinkingCode.trim()) {
                setProfileErrors({ schoolLinkingCode: "School linking code is required" });
                return;
            }
        }

        // Validate date of birth
        const dobDate = new Date(profileForm.dateOfBirth);
        if (isNaN(dobDate.getTime())) {
            setProfileErrors({ dateOfBirth: "Invalid date format" });
            return;
        }
        
        const today = new Date();
        if (dobDate > today) {
            setProfileErrors({ dateOfBirth: "Date of birth cannot be in the future" });
            return;
        }

        setSavingProfile(true);
        try {
            await api.post('/api/user/complete-google-profile', {
                dateOfBirth: profileForm.dateOfBirth,
                gender: profileForm.gender,
                registrationType: profileForm.registrationType,
                schoolLinkingCode: profileForm.registrationType === "school" ? profileForm.schoolLinkingCode.trim() : undefined,
            });

            toast.success("Profile completed successfully!");
            setShowProfileModal(false);
            
            // Refresh user data and subscription
            await fetchUser(); // Refresh user context
            if (refreshSubscription) {
                await refreshSubscription(); // Refresh subscription data
            }
            loadAnalyticsData(); // Reload pillar mastery with gender filtering
        } catch (err) {
            console.error("Profile completion error:", err);
            toast.error(err.response?.data?.message || "Failed to complete profile");
            if (err.response?.data?.errors) {
                setProfileErrors(err.response.data.errors);
            }
        } finally {
            setSavingProfile(false);
        }
    };

    useEffect(() => {
        // Only run once on mount or when user changes
        if (user && (user.role === "student" || user.role === "school_student")) {
            const currentUserId = user._id;
            
            // Check if data already exists in state (component remounted but state preserved)
            const hasData = dashboardData !== null || stats.xp > 0 || leaderboardData !== null;
            
            // Check if user changed or if data hasn't been loaded yet
            const userChanged = lastUserIdRef.current !== currentUserId;
            const shouldLoadData = !hasData && (!dataLoadedRef.current || userChanged);
            
            if (shouldLoadData) {
                // Load critical data first (dashboard, notifications, wallet)
                loadDashboardData();
                refreshWallet();
                
                // Start loading analytics data in parallel with critical data
                // This improves loading time while still prioritizing critical data
                loadAnalyticsData();
                
                // Mark as loaded and update user reference
                dataLoadedRef.current = true;
                lastUserIdRef.current = currentUserId;
            } else {
                // Data already loaded for this user, just set loading to false
                setLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id]); // Only depend on user ID to prevent infinite loops

    // Real-time subscription updates
    useEffect(() => {
        if (!socket) return;

        const handleSubscriptionUpdate = (data) => {
            if (data && data.subscription) {
                console.log('🔄 Subscription updated:', data.subscription);
                // Refresh subscription context
                if (refreshSubscription) {
                    refreshSubscription();
                }
                // Refresh pillar mastery to reflect new access
                loadAnalyticsData();
                
                // Show appropriate message based on reason
                const reason = data.reason || 'updated';
                if (reason === 'school_subscription_renewed') {
                    toast.success('Your school has renewed its plan! Premium access restored.', {
                        duration: 4000,
                        position: 'bottom-center',
                        icon: '🎉'
                    });
                } else if (reason === 'school_subscription_expired') {
                    toast.warning('Your school\'s plan has expired. You now have freemium access.', {
                        duration: 5000,
                        position: 'bottom-center',
                        icon: '⚠️'
                    });
                } else {
                    toast.success('Subscription updated! Access refreshed.', {
                        duration: 3000,
                        position: 'bottom-center',
                        icon: '🎉'
                    });
                }
            }
        };

        socket.on('subscription:activated', handleSubscriptionUpdate);
        socket.on('subscription:updated', handleSubscriptionUpdate);
        socket.on('subscription:cancelled', handleSubscriptionUpdate);
        socket.on('student:subscription:updated', handleSubscriptionUpdate); // New event for school-linked students

        return () => {
            if (socket) {
                socket.off('subscription:activated', handleSubscriptionUpdate);
                socket.off('subscription:updated', handleSubscriptionUpdate);
                socket.off('subscription:cancelled', handleSubscriptionUpdate);
                socket.off('student:subscription:updated', handleSubscriptionUpdate);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, subscription?.status]); // Only depend on socket and subscription status

    useEffect(() => {
        if (!socket) return;
        
        const handleGameCompleted = (data) => {
            console.log('🎮 Game completed event:', data);
            
            // Update stats with new values from backend - real-time updates
            setStats((prev) => ({ 
                ...prev, 
                xp: data.totalXP || prev.xp,
                level: data.level || prev.level,
                nextLevelXp: (data.level || prev.level) * 1000,
                streak: data.streak || prev.streak,
                weeklyXP: data.weeklyXP !== undefined ? data.weeklyXP : prev.weeklyXP,
                rank: data.rank !== undefined ? data.rank : prev.rank
            }));
            
            // Refresh analytics data for real-time engagement and achievements
            if (data.totalXP || data.level || data.streak) {
                setTimeout(() => {
                    loadAnalyticsData();
                }, 500);
            }
            
            // Update wallet balance immediately if provided in the event
            if (data?.newBalance !== undefined && setWallet) {
                setWallet(prev => {
                    if (prev) {
                        return {
                            ...prev,
                            balance: data.newBalance
                        };
                    } else {
                        return {
                            balance: data.newBalance,
                            userId: user?._id || user?.id
                        };
                    }
                });
            }
            
            // Refresh wallet from API to ensure consistency
            if (refreshWallet) {
                setTimeout(() => {
                    refreshWallet();
                }, 200);
            }
            
            // Show toast with XP and coins earned
            if (data.xpEarned && data.coinsEarned) {
                toast.success(`🎮 Game completed! +${data.xpEarned} XP, +${data.coinsEarned} HealCoins`, {
                    duration: 4000,
                    icon: "🎉"
                });
            } else {
                toast.success(`🎮 Game completed! +${data.coinsEarned} HealCoins`, {
                    duration: 3000
                });
            }
            
            // Check for level up
            if (data.level && data.level > stats.level) {
                setTimeout(() => {
                    toast.success(
                        `🎉 Level Up! You're now Level ${data.level}!`,
                        {
                            duration: 5000,
                            icon: "🚀"
                        }
                    );
                }, 500);
            }
        };
        
        const handleWalletUpdate = (data) => {
            console.log('💰 Wallet updated via socket in StudentDashboard:', data);
            
            // Update wallet balance directly from socket data for immediate UI update
            if (data?.balance !== undefined || data?.newBalance !== undefined) {
                const newBalance = data.balance || data.newBalance;
                if (setWallet) {
                    setWallet(prev => {
                        if (prev) {
                            return {
                                ...prev,
                                balance: newBalance
                            };
                        } else {
                            return {
                                balance: newBalance,
                                userId: user?._id || user?.id
                            };
                        }
                    });
                }
            }
            
            // Also refresh from API to ensure consistency
            if (refreshWallet) {
                setTimeout(() => {
                    refreshWallet();
                }, 200);
            }
        };
        
        const handleLevelUp = (data) => {
            setStats((prev) => ({ 
                ...prev, 
                level: data.newLevel, 
                xp: data.totalXP,
                weeklyXP: data.weeklyXP !== undefined ? data.weeklyXP : prev.weeklyXP,
                rank: data.rank !== undefined ? data.rank : prev.rank
            }));
            
            // Refresh recommendations when leveling up
            setTimeout(() => {
                refreshRecommendations();
            }, 500);
            
            // Refresh analytics for real-time updates
            setTimeout(() => {
                loadAnalyticsData();
            }, 500);
            
            toast.success(
                <div>
                    <p>🎉 Level Up! You're now Level {data.newLevel}!</p>
                    <p>+{data.coinsEarned} HealCoins bonus!</p>
                </div>
            );
        };
        
        // Handle real-time stats updates
        const handleStatsUpdate = (data) => {
            if (data.userId === (user?._id || user?.id)) {
                setStats((prev) => ({
                    ...prev,
                    ...(data.xp !== undefined && { xp: data.xp }),
                    ...(data.level !== undefined && { level: data.level }),
                    ...(data.streak !== undefined && { streak: data.streak }),
                    ...(data.weeklyXP !== undefined && { weeklyXP: data.weeklyXP }),
                    ...(data.rank !== undefined && { rank: data.rank })
                }));
                
                // Refresh recommendations when stats are updated
                setTimeout(() => {
                    refreshRecommendations();
                }, 1000);
            }
        };
        
        // Handle real-time achievement updates with professional animations
        const handleAchievementUpdate = (data) => {
            if (data.userId === (user?._id || user?.id) && data.achievement) {
                const rawAchievement = data.achievement;
                const achievement = {
                    id: rawAchievement.id || `${rawAchievement.badgeName || rawAchievement.name}-${rawAchievement.earnedAt || rawAchievement.date || Date.now()}`,
                    badgeName: rawAchievement.badgeName || rawAchievement.name || "Badge Earned",
                    badgeImage: rawAchievement.badgeImage || rawAchievement.icon || null,
                    earnedAt: rawAchievement.earnedAt || rawAchievement.date || new Date().toISOString(),
                    gameId: rawAchievement.gameId || null,
                    gameType: rawAchievement.gameType || null,
                    ageGroup: rawAchievement.ageGroup || getAgeGroupFromGameId(rawAchievement.gameId || ""),
                    pillarName: rawAchievement.pillarName || getPillarNameFromType(rawAchievement.gameType)
                };

                const subtitle = achievement.pillarName
                    ? `${achievement.pillarName}${achievement.ageGroup ? ` (${achievement.ageGroup})` : ""}`
                    : achievement.ageGroup || "Unknown";

                // Show professional toast notification
                toast.success(
                    (t) => (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-lg overflow-hidden">
                                {achievement.badgeImage ? (
                                    <img
                                        src={achievement.badgeImage}
                                        alt={achievement.badgeName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold">B</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-white text-sm">Badge Earned!</p>
                                <p className="text-white/90 text-xs">{achievement.badgeName}</p>
                                <p className="text-white/70 text-[10px]">{subtitle}</p>
                            </div>
                        </div>
                    ),
                    {
                        duration: 5000,
                        position: "top-center",
                        style: {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        },
                        icon: 'dYZ%',
                    }
                );

                // Mark as new achievement
                const achievementId = achievement.id;
                setNewAchievementIds((prev) => new Set([...prev, achievementId]));

                // Remove "new" indicator after 10 seconds
                setTimeout(() => {
                    setNewAchievementIds((prev) => {
                        const updated = new Set(prev);
                        updated.delete(achievementId);
                        return updated;
                    });
                }, 10000);

                // Update achievement timeline in real-time
                setAchievementTimeline((prev) => {
                    if (!prev) {
                        return {
                            achievements: [achievement],
                            totalAchievements: 1
                        };
                    }

                    // Check if achievement already exists (prevent duplicates)
                    const exists = prev.achievements.some(
                        a => a.id === achievement.id ||
                        (a.badgeName === achievement.badgeName &&
                         new Date(a.earnedAt).getTime() === new Date(achievement.earnedAt).getTime())
                    );

                    if (exists) {
                        return prev;
                    }

                    // Add new achievement at the beginning and limit to 10
                    const updatedAchievements = [achievement, ...prev.achievements].slice(0, 10);

                    return {
                        achievements: updatedAchievements,
                        totalAchievements: prev.totalAchievements + 1
                    };
                });

                // Also refresh analytics data in background for consistency
                setTimeout(() => {
                    loadAnalyticsData();
                }, 1000);
            }
        };
        // Handle achievement timeline updates from subscription
        const handleAchievementTimeline = (data) => {
            if (data && data.achievements) {
                setAchievementTimeline({
                    achievements: data.achievements,
                    totalAchievements: data.totalAchievements || data.achievements.length
                });
            }
        };
        
        const handleSettingsUpdate = (data) => {
            // Settings updates are handled in the Settings component
            // This handler is kept for socket event cleanup but doesn't need to update state here
            if (data.userId === user?._id) {
                // Settings are managed in the Settings component
                console.log('Settings updated via socket:', data);
            }
        };
        
        // Handle mood logged event for recommendation updates
        const handleMoodLogged = () => {
            setTimeout(() => {
                refreshRecommendations();
            }, 1000);
        };
        
        socket.on('game-completed', handleGameCompleted);
        socket.on('wallet:updated', handleWalletUpdate);
        socket.on('level-up', handleLevelUp);
        socket.on('settings:updated', handleSettingsUpdate);
        socket.on('stats:updated', handleStatsUpdate);
        socket.on('achievement:earned', handleAchievementUpdate);
        socket.on('student:achievements:timeline', handleAchievementTimeline);
        socket.on('mood:logged', handleMoodLogged);
        socket.on('activity:logged', handleMoodLogged); // Also refresh on activity logged
        
        // Subscribe to achievement updates when socket is connected
        const subscribeToAchievements = () => {
            if (socket && user?._id) {
                socket.emit('student:achievements:subscribe', { studentId: user._id });
            }
        };
        
        if (socket && socket.connected) {
            subscribeToAchievements();
        } else if (socket) {
            // If socket exists but not connected, wait for connection
            socket.on('connect', subscribeToAchievements);
        }
        
        // Handle profile updates
        const handleProfileUpdate = async (data) => {
            if (data.userId === user?._id || data.userId?.toString() === user?._id?.toString()) {
                // Refresh user data
                await fetchUser();
                // Refresh subscription if available
                if (refreshSubscription) {
                    await refreshSubscription();
                }
                // Reload analytics data
                loadAnalyticsData();
            }
        };
        socket.on('user:profile:updated', handleProfileUpdate);
        
        return () => {
            socket.off('game-completed', handleGameCompleted);
            socket.off('wallet:updated', handleWalletUpdate);
            socket.off('level-up', handleLevelUp);
            socket.off('settings:updated', handleSettingsUpdate);
            socket.off('stats:updated', handleStatsUpdate);
            socket.off('achievement:earned', handleAchievementUpdate);
            socket.off('student:achievements:timeline', handleAchievementTimeline);
            socket.off('user:profile:updated', handleProfileUpdate);
            socket.off('mood:logged', handleMoodLogged);
            socket.off('activity:logged', handleMoodLogged);
            socket.off('connect', subscribeToAchievements);
        };
    }, [socket, stats.level, setWallet, refreshWallet, user, loadAnalyticsData, fetchUser, refreshSubscription, refreshRecommendations]);

    const allCategories = [
        { key: "finance", label: "Financial Literacy" },
        { key: "wellness", label: "Brain Health" },
        { key: "personal", label: "UVLS (Life Skills & Values)" },
        { key: "education", label: "Digital Citizenship & Online Safety" },
        { key: "creativity", label: "Moral Values" },
        { key: "entertainment", label: "AI for All" },
        { key: "social", label: "Health - Male" },
        { key: "competition", label: "Health - Female" },
        { key: "rewards", label: "Entrepreneurship & Higher Education" },
        { key: "shopping", label: "Civic Responsibility & Global Citizenship" },
        { key: "sustainability", label: "Sustainability" },
    ];

    // Filter categories based on user gender
    const userGender = user?.gender?.toLowerCase();
    const categories = allCategories.filter((category) => {
        // Hide Health - Female for male users
        if (userGender === 'male' && category.label === 'Health - Female') {
            return false;
        }
        // Hide Health - Male for female users
        if (userGender === 'female' && category.label === 'Health - Male') {
            return false;
        }
        // If gender is not set, hide both health pillars for existing users
        if (!userGender && (category.label === 'Health - Male' || category.label === 'Health - Female')) {
            return false;
        }
        return true;
    });

    // Show all cards on dashboard (excluding special game categories)
    // Memoize to prevent unnecessary recalculations
    const filteredCards = React.useMemo(() => {
        return featureCards.filter((card) => 
            !(card.title === "Kids Games" || 
              card.title === "Teen Games" || 
              card.title === "Adult Games")
        );
    }, [featureCards]);

    const progressPercentage = (stats.xp / stats.nextLevelXp) * 100;

    // Animation variants
    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // Full-page skeleton loader
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                    <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                    <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
                </div>

                <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="text-center mb-8 mt-2 animate-pulse">
                        <div className="h-16 bg-gray-300 rounded-2xl w-96 max-w-full mx-auto mb-4"></div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-12 bg-gray-300 rounded-full w-32"></div>
                            ))}
                        </div>
                    </div>

                    {/* Player Stats Bar Skeleton */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-300 rounded-2xl"></div>
                                <div className="flex-1">
                                    <div className="h-6 bg-gray-300 rounded mb-2 w-24"></div>
                                    <div className="h-4 bg-gray-300 rounded mb-2 w-16"></div>
                                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-200 p-4 rounded-2xl h-20"></div>
                                <div className="bg-gray-200 p-4 rounded-2xl h-20"></div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Cards Skeleton */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-200 rounded-2xl h-64"></div>
                            ))}
                        </div>
                    </div>

                    {/* Feature Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 animate-pulse">
                                <div className="h-8 bg-gray-300 rounded-lg mb-4 w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                                <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Sections Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 animate-pulse">
                            <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 animate-pulse">
                            <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
                            <div className="h-48 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

                {/* Floating geometric shapes */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-2/3 right-1/4 w-4 h-4 bg-pink-400 rotate-45 opacity-50"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [45, 225, 45],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-2/3 w-8 h-8 bg-blue-400 rounded-full opacity-40"
                    animate={{
                        y: [0, -25, 0],
                        scale: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 mt-2"
                >
                    <motion.div
                        className="relative inline-block"
                        variants={pulseVariants}
                        animate="animate"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm leading-tight">
                                {loading
                                    ? "Game On, Player!"
                                    : `Game On, ${user?.name || "Player"}!`}
                            </span>
                            <span className="text-black dark:text-white drop-shadow-sm">
                                🎮
                            </span>
                        </h1>
                        {/* Sparkle effects around the title */}
                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-pink-400 animate-bounce delay-300">
                            <Star className="w-5 h-5" />
                        </div>
                    </motion.div>

                    {!sponsorshipLoading && sponsorBadge && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto mt-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-100 shadow-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black">
                                    {sponsorBadge.sponsorName?.[0] || "S"}
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Sponsored by</p>
                                    <h3 className="text-xl font-bold text-slate-900">{sponsorBadge.sponsorName}</h3>
                                    <p className="text-sm text-slate-500">
                                        {sponsorBadge.studentCount || 0} students supported
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-slate-600 space-y-1 text-right">
                                <p className="font-semibold text-slate-900">
                                    {sponsorBadge.startDate ? new Date(sponsorBadge.startDate).toLocaleDateString() : "-"} - {sponsorBadge.endDate ? new Date(sponsorBadge.endDate).toLocaleDateString() : "-"}
                                </p>
                                <p className="text-xs uppercase tracking-wide text-slate-500">Sponsorship period</p>
                            </div>
                            <button
                                onClick={() => navigate("/school/sponsorship")}
                                className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm font-semibold shadow-lg hover:bg-indigo-500 transition"
                            >
                                View sponsorship
                            </button>
                        </motion.div>
                    )}

                    
                    {/* Category Pills - Below Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-10"
                    >
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((category, index) => {
                                const colorClasses = [
                                    'from-purple-500 to-pink-500',
                                    'from-blue-500 to-cyan-500',
                                    'from-green-500 to-emerald-500',
                                    'from-orange-500 to-red-500',
                                    'from-yellow-500 to-amber-500',
                                    'from-pink-500 to-rose-500',
                                    'from-indigo-500 to-purple-500',
                                    'from-teal-500 to-cyan-500',
                                    'from-red-500 to-orange-500',
                                    'from-lime-500 to-green-500',
                                    'from-blue-500 to-cyan-500',
                                    'from-violet-500 to-purple-500'
                                ];
                                const gradientColors = colorClasses[index % colorClasses.length];
                                
                                // Convert category key to URL-friendly slug
                                const categorySlug = category.label.toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .replace(/[()&]/g, '')
                                    .replace(/--+/g, '-');

                                return (
                                    <motion.button
                                        key={category.key}
                                        onClick={() => {
                                            // Log category navigation
                                            logActivity({
                                                activityType: "navigation",
                                                description: `Navigated to category: ${category.label}`,
                                                metadata: {
                                                    category: category.key,
                                                    categoryLabel: category.label,
                                                    timestamp: new Date().toISOString()
                                                },
                                                pageUrl: window.location.pathname
                                            });

                                            // Navigate to category page
                                            navigate(`/student/dashboard/${categorySlug}`);
                                        }}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`bg-gradient-to-r ${gradientColors} cursor-pointer text-white px-6 py-4 rounded-full font-bold text-sm shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                                    >
                                        {/* Shine effect on hover */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                        />
                                        
                                        {/* Pulse animation */}
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0, 0.3, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                        
                                        <span className="relative z-10 drop-shadow-sm">
                                            {category.label}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                            </motion.div>
                </motion.div>

                {/* Player Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r rounded-3xl from-blue-500/8 via-purple-500/8 to-pink-500/8" />

                    {loading ? (
                        <div className="relative z-10 animate-pulse">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-300 rounded-2xl"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-gray-300 rounded mb-2 w-24"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2 w-16"></div>
                                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-200 p-4 rounded-2xl h-20"></div>
                                    <div className="bg-gray-200 p-4 rounded-2xl h-20"></div>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-12 h-12 bg-gray-300 rounded-xl"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                            {/* Level Progress */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <motion.div
                                        className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {stats.level}
                                    </motion.div>
                                    <motion.div
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        <Crown className="w-4 h-4 text-yellow-800" />
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                        Level {stats.level}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2 font-medium">
                                        {stats.xp.toLocaleString()}/
                                        {stats.nextLevelXp.toLocaleString()} XP
                                    </p>
                                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative shadow-sm"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-2xl text-center shadow-lg border border-orange-200"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Flame className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm font-bold text-orange-700">
                                            Streak
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-orange-600">
                                        {stats.streak}
                                    </div>
                                    <div className="text-xs text-orange-500 font-medium">
                                        days
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl text-center shadow-lg border border-green-200"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Coins className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-bold text-green-700">
                                            Coins
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-green-600">
                                        {wallet?.balance || 0}
                                    </div>
                                    <div className="text-xs text-green-500 font-medium">
                                        HealCoins
                                    </div>
                                </motion.div>
                            </div>

                            {/* Professional Performance Metrics Showcase */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                {/* Weekly Progress */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-2xl text-center shadow-lg border border-indigo-200"
                                >
                                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-bold text-indigo-700">
                                            Weekly XP
                                        </span>
                                    </div>
                                    <div className="text-xl font-black text-indigo-700">
                                        {stats.weeklyXP || 0}
                                    </div>
                                    <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
                                        Points
                                    </div>
                                </motion.div>

                                {/* Global Rank */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-amber-100 to-yellow-100 p-3 rounded-2xl text-center shadow-lg border border-amber-200"
                                >
                                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                        <Trophy className="w-4 h-4 text-amber-600" />
                                        <span className="text-xs font-bold text-amber-700">
                                            Rank
                                        </span>
                                    </div>
                                    <div className="text-xl font-black text-amber-700">
                                        {stats.rank !== null && stats.rank !== undefined && stats.rank > 0 ? `#${stats.rank}` : 'N/A'}
                                    </div>
                                    <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                                        Global
                                    </div>
                                </motion.div>
                                {/* Achievement Count */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-pink-100 to-rose-100 p-3 rounded-2xl text-center shadow-lg border border-pink-200"
                                >
                                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                        <Medal className="w-4 h-4 text-pink-600" />
                                        <span className="text-xs font-bold text-pink-700">
                                            Badges
                                        </span>
                                    </div>
                                    <div className="text-xl font-black text-pink-700">
                                        {achievements?.length || 0}
                                    </div>
                                    <div className="text-[10px] text-pink-600 font-medium mt-0.5">
                                        Earned
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* New Analytics Card - Pillar Mastery, Emotional Score, Engagement */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/8 via-blue-500/8 to-pink-500/8" />

                    {loading || !pillarMastery || !emotionalScore || !engagementMinutes ? (
                        <div className="relative z-10 animate-pulse">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Pillar Mastery Skeleton */}
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-6 w-32 bg-purple-200 rounded-lg"></div>
                                        <div className="w-8 h-8 bg-purple-200 rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="w-32 h-32 bg-purple-200 rounded-full mb-2"></div>
                                        <div className="h-4 w-24 bg-purple-200 rounded"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-20 bg-purple-200 rounded"></div>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="bg-white/80 rounded-xl p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="h-4 w-32 bg-purple-200 rounded"></div>
                                                    <div className="h-4 w-12 bg-purple-200 rounded"></div>
                                                </div>
                                                <div className="h-2 w-full bg-purple-200 rounded-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Emotional Score Skeleton */}
                                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-6 w-36 bg-pink-200 rounded-lg"></div>
                                        <div className="w-8 h-8 bg-pink-200 rounded-full"></div>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-4 mb-4">
                                        <div className="h-4 w-24 bg-pink-200 rounded mb-2"></div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-16 bg-pink-200 rounded"></div>
                                            <div className="h-6 w-12 bg-pink-200 rounded"></div>
                                        </div>
                                        <div className="h-6 w-16 bg-pink-200 rounded mt-2 ml-auto"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-pink-200 rounded"></div>
                                        <div className="flex items-end justify-between gap-1 h-32 bg-white/50 rounded-xl p-3">
                                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                                <div key={i} className="flex-1 bg-pink-200 rounded-t" style={{ height: `${20 + (i * 10)}%` }}></div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="h-3 w-12 bg-pink-200 rounded"></div>
                                            <div className="h-3 w-12 bg-pink-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Engagement Skeleton */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-6 w-28 bg-green-200 rounded-lg"></div>
                                        <div className="w-8 h-8 bg-green-200 rounded-full"></div>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-4 mb-4">
                                        <div className="h-4 w-20 bg-green-200 rounded mx-auto mb-2"></div>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <div className="h-12 w-16 bg-green-200 rounded"></div>
                                            <div className="h-6 w-8 bg-green-200 rounded"></div>
                                        </div>
                                        <div className="h-3 w-32 bg-green-200 rounded mx-auto mt-2"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white/80 rounded-xl p-3">
                                            <div className="h-3 w-16 bg-green-200 rounded mb-2"></div>
                                            <div className="h-8 w-12 bg-green-200 rounded"></div>
                                        </div>
                                        <div className="bg-white/80 rounded-xl p-3">
                                            <div className="h-3 w-12 bg-green-200 rounded mb-2"></div>
                                            <div className="h-8 w-8 bg-green-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <div className="h-4 w-20 bg-green-200 rounded"></div>
                                            <div className="h-4 w-12 bg-green-200 rounded"></div>
                                        </div>
                                        <div className="h-4 w-full bg-green-200 rounded-full"></div>
                                        <div className="h-3 w-28 bg-green-200 rounded mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* 1. Pillar Mastery Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
                                        <Brain className="w-6 h-6 text-purple-600" />
                                        Pillar Mastery
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="text-3xl"
                                    >
                                        ✨
                                    </motion.div>
                                </div>

                                {/* Overall Mastery Circle */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative w-32 h-32">
                                        <svg className="transform -rotate-90 w-32 h-32">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="#e0e7ff"
                                                strokeWidth="12"
                                                fill="none"
                                            />
                                            <motion.circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="url(#gradient-purple)"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 56}`}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                                                animate={{
                                                    strokeDashoffset: 2 * Math.PI * 56 * (1 - pillarMastery.overallMastery / 100)
                                                }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                            <defs>
                                                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#8b5cf6" />
                                                    <stop offset="100%" stopColor="#6366f1" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-purple-700">
                                                {pillarMastery.overallMastery}%
                                            </span>
                                            <span className="text-xs text-purple-600 font-semibold">Overall</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-purple-600 mt-2 font-medium">
                                        {pillarMastery.totalPillars} Pillars Active
                                    </p>
                                </div>

                                {/* Top 3 Weak Pillars */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-purple-700 mb-2">Focus Areas:</h4>
                                    {pillarMastery.weakPillars
                                        .filter((pillar) => {
                                            // Filter weak pillars based on user gender
                                            const userGender = user?.gender?.toLowerCase();
                                            
                                            // Hide Health - Female for male users
                                            if (userGender === 'male' && (pillar.pillar === 'Health - Female' || pillar.pillarKey === 'health-female')) {
                                                return false;
                                            }
                                            // Hide Health - Male for female users
                                            if (userGender === 'female' && (pillar.pillar === 'Health - Male' || pillar.pillarKey === 'health-male')) {
                                                return false;
                                            }
                                            // If gender is not set, hide both health pillars for existing users
                                            if (!userGender && (pillar.pillar === 'Health - Male' || pillar.pillar === 'Health - Female' || pillar.pillarKey === 'health-male' || pillar.pillarKey === 'health-female')) {
                                                return false;
                                            }
                                            return true;
                                        })
                                        .map((pillar, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{pillar.icon}</span>
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {pillar.pillar}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs font-bold text-purple-600">
                                                        {pillar.mastery}%
                                                    </span>
                                                    {pillar.deltaWoW !== 0 && (
                                                        <motion.div
                                                            animate={{ y: [0, -3, 0] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                            className={`flex items-center text-xs font-semibold ${
                                                                pillar.deltaWoW > 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {pillar.deltaWoW > 0 ? (
                                                                <TrendingUp className="w-3 h-3" />
                                                            ) : (
                                                                <TrendingDown className="w-3 h-3" />
                                                            )}
                                                            {Math.abs(pillar.deltaWoW)}%
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pillar.mastery}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                />
                                            </div>
                                        </motion.div>
                        ))}
                    </div>
                </motion.div>

                            {/* 2. Emotional Score Card */}
                <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-pink-800 flex items-center gap-2">
                                        <Heart className="w-6 h-6 text-pink-600" />
                                        Emotional Score
                                    </h3>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-3xl"
                                    >
                                        💖
                                    </motion.div>
                                </div>

                                {/* Average Score Display */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-pink-600 font-medium">7-Day Average</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-4xl font-black text-pink-700">
                                                    {emotionalScore.averageScore}
                                                </span>
                                                <span className="text-gray-500">/5.0</span>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1 px-3 py-2 rounded-full ${
                                            emotionalScore.trend === 'up' ? 'bg-green-100 text-green-700' :
                                            emotionalScore.trend === 'down' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {emotionalScore.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                                            {emotionalScore.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                                            {emotionalScore.trend === 'stable' && <Minus className="w-4 h-4" />}
                                            <span className="text-xs font-bold capitalize">{emotionalScore.trend}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 7-Day Trend Chart */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-pink-700 mb-2">7-Day Trend:</h4>
                                    <div className="flex items-end justify-between gap-1 h-32 bg-white/50 backdrop-blur-sm rounded-xl p-3">
                                        {emotionalScore.trendData.map((day, index) => {
                                            const height = day.score ? (day.score / 5) * 100 : 0;
                                            const date = new Date(day.date);
                                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        
                        return (
                                                <div key={index} className="flex flex-col items-center flex-1 gap-1">
                            <motion.div
                                                        className="w-full bg-gradient-to-t from-pink-500 to-rose-400 rounded-t-lg relative group"
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${height}%` }}
                                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        {day.emoji && (
                                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span className="text-xl">{day.emoji}</span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                    <span className="text-xs font-semibold text-pink-600">
                                                        {dayName.charAt(0)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between text-xs text-pink-600">
                                        <span>😢 Low</span>
                                        <span>😄 High</span>
                                    </div>
                                    <p className="text-xs text-center text-pink-600 mt-2 font-medium">
                                        {emotionalScore.entriesThisWeek} mood entries this week
                                    </p>
                                </div>
                            </motion.div>

                            {/* 3. Engagement Minutes Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
                                        <Timer className="w-6 h-6 text-green-600" />
                                        Engagement
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: [0, 20, -20, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-3xl"
                                    >
                                        ⚡
                                    </motion.div>
                                </div>

                                {/* Total Hours Display */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-md">
                                    <div className="text-center">
                                        <p className="text-sm text-green-600 font-medium">Last 7 Days</p>
                                        <div className="flex items-baseline justify-center gap-1 mt-1">
                                            <span className="text-5xl font-black text-green-700">
                                                {(engagementMinutes.totalMinutes / 60).toFixed(1)}
                                            </span>
                                            <span className="text-xl text-gray-500">hrs</span>
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">
                                            ~{(engagementMinutes.avgMinutesPerDay / 60).toFixed(1)} hrs/day average
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span className="text-xs font-semibold text-green-700">Days Active</span>
                                        </div>
                                        <span className="text-2xl font-black text-green-700">
                                            {engagementMinutes.daysActive}/7
                                        </span>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs font-semibold text-green-700">Streak</span>
                                        </div>
                                        <span className="text-2xl font-black text-green-700">
                                            {engagementMinutes.streak}
                                        </span>
                                    </motion.div>
                                </div>

                                {/* Goal Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-bold text-green-700">Daily Goal</h4>
                                        <span className="text-xs font-semibold text-green-600">
                                            {engagementMinutes.goalProgress}%
                                        </span>
                                    </div>
                                    <div className="relative w-full h-4 bg-green-100 rounded-full overflow-hidden shadow-inner">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full relative"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, engagementMinutes.goalProgress)}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
                                        </motion.div>
                                    </div>
                                    <p className="text-xs text-center text-green-600 font-medium">
                                        Goal: {(engagementMinutes.goalMinutes / 60).toFixed(1)} hrs/day
                                    </p>
                                </div>

                                {/* Activity Indicator */}
                                <motion.div
                                    className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white shadow-lg"
                                    animate={{ 
                                        boxShadow: [
                                            "0 4px 6px rgba(34, 197, 94, 0.3)",
                                            "0 8px 12px rgba(34, 197, 94, 0.5)",
                                            "0 4px 6px rgba(34, 197, 94, 0.3)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-5 h-5" />
                                            <span className="text-sm font-bold">Keep it up!</span>
                                        </div>
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* 2. Daily Actions Strip */}
                {!dailyActions ? (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="py-20"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 sm:gap-4 gap-2 justify-center animate-pulse">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-6 shadow-xl h-32">
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg mb-2"></div>
                                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="py-20"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 sm:gap-4 gap-2 justify-center">
                            {/* Daily Check-in */}
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: dailyActions.dailyCheckIn ? 0 : 2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (!dailyActions.dailyCheckIn) {
                                        // Navigate to check-in
                                        handleNavigate('/student/mood-tracker', 'Daily Check-in');
                                    }
                                }}
                                className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all ${
                                    dailyActions.dailyCheckIn 
                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                                        : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                                }`}
                            >
                                <motion.div
                                    className="absolute top-0 right-0 w-full h-full bg-white/10"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <CheckCircle className={`w-8 h-8 ${dailyActions.dailyCheckIn ? 'text-white' : 'text-white/80'}`} />
                                        {dailyActions.dailyCheckIn && <span className="text-3xl">✅</span>}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">Daily Check-in</h3>
                                    <p className="text-white/90 text-sm">
                                        {dailyActions.dailyCheckIn ? 'Completed today!' : 'Log your mood'}
                                    </p>
                                </div>
                            </motion.button>

                            {/* Start Mission */}
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: dailyActions.missionStarted ? 0 : -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigate('/student/dashboard', 'Dashboard')}
                                className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all ${
                                    dailyActions.missionStarted 
                                        ? 'bg-gradient-to-br from-purple-400 to-violet-500' 
                                        : 'bg-gradient-to-br from-orange-400 to-red-500'
                                }`}
                            >
                                <motion.div
                                    className="absolute top-0 right-0 w-full h-full bg-white/10"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <Rocket className={`w-8 h-8 ${dailyActions.missionStarted ? 'text-white' : 'text-white/80'}`} />
                                        {dailyActions.missionStarted && <span className="text-3xl">🎯</span>}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">Start Mission</h3>
                                    <p className="text-white/90 text-sm">
                                        {dailyActions.missionStarted ? 'In progress!' : 'Begin your quest'}
                                    </p>
                                </div>
                            </motion.button>

                            {/* Quick Quiz */}
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: dailyActions.quizCompleted ? 0 : 2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigate('/student/dashboard/quick-quiz', 'Quick Quiz')}
                                className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all ${
                                    dailyActions.quizCompleted 
                                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500' 
                                        : 'bg-gradient-to-br from-pink-400 to-rose-500'
                                }`}
                            >
                                <motion.div
                                    className="absolute top-0 right-0 w-full h-full bg-white/10"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <Lightbulb className={`w-8 h-8 ${dailyActions.quizCompleted ? 'text-white' : 'text-white/80'}`} />
                                        {dailyActions.quizCompleted && <span className="text-3xl">🏆</span>}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">Quick Quiz</h3>
                                    <p className="text-white/90 text-sm">
                                        {dailyActions.quizCompleted ? 'Mastered!' : 'Test yourself'}
                                    </p>
                                </div>
                            </motion.button>

                            {/* Inbox */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigate('/student/notifications', 'Inbox')}
                                className="relative overflow-hidden bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl p-6 shadow-xl"
                            >
                                <motion.div
                                    className="absolute top-0 right-0 w-full h-full bg-white/10"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <Inbox className="w-8 h-8 text-white" />
                                        {dailyActions.inboxCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {dailyActions.inboxCount}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">Inbox</h3>
                                    <p className="text-white/90 text-sm">
                                        {dailyActions.inboxCount > 0 ? `${dailyActions.inboxCount} unread` : 'All caught up!'}
                                    </p>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* 3. Pillar Progress Tiles - Enhanced 3D Design */}
                {!pillarMastery || !pillarMastery.pillars || pillarMastery.pillars.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-8 animate-pulse">
                            <div className="h-10 bg-gray-300 rounded-lg w-64 mx-auto mb-2"></div>
                            <div className="h-5 bg-gray-200 rounded w-80 mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 sm:gap-8 justify-center">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <div key={i} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 animate-pulse">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                        <div className="h-6 w-16 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                                    <div className="h-2 bg-gray-200 rounded-full mb-2"></div>
                                    <div className="flex gap-2">
                                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-gray-800 mb-2 flex items-center justify-center gap-3">
                                <Brain className="w-8 h-8 text-purple-600" />
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Your Learning Pillars
                                </span>
                            </h2>
                            <p className="text-gray-600 font-medium">Master all skills and unlock your potential!</p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 sm:gap-8 justify-center items-stretch">
                            {pillarMastery.pillars
                                .filter((pillar) => {
                                    // Filter pillars based on user gender
                                    const userGender = user?.gender?.toLowerCase();
                                    
                                    // Hide Health - Female for male users
                                    if (userGender === 'male' && (pillar.pillar === 'Health - Female' || pillar.pillarKey === 'health-female')) {
                                        return false;
                                    }
                                    // Hide Health - Male for female users
                                    if (userGender === 'female' && (pillar.pillar === 'Health - Male' || pillar.pillarKey === 'health-male')) {
                                        return false;
                                    }
                                    // If gender is not set, hide both health pillars for existing users
                                    if (!userGender && (pillar.pillar === 'Health - Male' || pillar.pillar === 'Health - Female' || pillar.pillarKey === 'health-male' || pillar.pillarKey === 'health-female')) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((pillar, index) => {
                                const colorSchemes = [
                                    { 
                                        gradient: 'from-purple-400 to-pink-400',
                                        shadow: 'shadow-purple-400/30',
                                        glow: 'rgba(168, 85, 247, 0.3)',
                                        ring: '#a855f7',
                                        bg: 'from-purple-50 to-pink-50'
                                    },
                                    { 
                                        gradient: 'from-blue-400 to-cyan-400',
                                        shadow: 'shadow-blue-400/30',
                                        glow: 'rgba(59, 130, 246, 0.3)',
                                        ring: '#3b82f6',
                                        bg: 'from-blue-50 to-cyan-50'
                                    },
                                    { 
                                        gradient: 'from-green-400 to-emerald-400',
                                        shadow: 'shadow-green-400/30',
                                        glow: 'rgba(34, 197, 94, 0.3)',
                                        ring: '#22c55e',
                                        bg: 'from-green-50 to-emerald-50'
                                    },
                                    { 
                                        gradient: 'from-orange-400 to-red-400',
                                        shadow: 'shadow-orange-400/30',
                                        glow: 'rgba(249, 115, 22, 0.3)',
                                        ring: '#f97316',
                                        bg: 'from-orange-50 to-red-50'
                                    },
                                    { 
                                        gradient: 'from-yellow-400 to-amber-400',
                                        shadow: 'shadow-yellow-400/30',
                                        glow: 'rgba(234, 179, 8, 0.3)',
                                        ring: '#eab308',
                                        bg: 'from-yellow-50 to-amber-50'
                                    },
                                    { 
                                        gradient: 'from-pink-400 to-rose-400',
                                        shadow: 'shadow-pink-400/30',
                                        glow: 'rgba(236, 72, 153, 0.3)',
                                        ring: '#ec4899',
                                        bg: 'from-pink-50 to-rose-50'
                                    },
                                    { 
                                        gradient: 'from-indigo-400 to-violet-400',
                                        shadow: 'shadow-indigo-400/30',
                                        glow: 'rgba(99, 102, 241, 0.3)',
                                        ring: '#6366f1',
                                        bg: 'from-indigo-50 to-violet-50'
                                    },
                                    { 
                                        gradient: 'from-teal-400 to-cyan-400',
                                        shadow: 'shadow-teal-400/30',
                                        glow: 'rgba(20, 184, 166, 0.3)',
                                        ring: '#14b8a6',
                                        bg: 'from-teal-50 to-cyan-50'
                                    },
                                    { 
                                        gradient: 'from-rose-400 to-pink-400',
                                        shadow: 'shadow-rose-400/30',
                                        glow: 'rgba(244, 63, 94, 0.3)',
                                        ring: '#f43f5e',
                                        bg: 'from-rose-50 to-pink-50'
                                    },
                                    { 
                                        gradient: 'from-lime-400 to-green-400',
                                        shadow: 'shadow-lime-400/30',
                                        glow: 'rgba(132, 204, 22, 0.3)',
                                        ring: '#84cc16',
                                        bg: 'from-lime-50 to-green-50'
                                    }
                                ];
                                const colorScheme = colorSchemes[index % colorSchemes.length];
                                const circumference = 2 * Math.PI * 50;
                                const strokeOffset = circumference - (pillar.mastery / 100) * circumference;

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 12
                                        }}
                                        whileHover={{ 
                                            scale: 1.08, 
                                            y: -5,
                                            transition: { duration: 0.2 }
                                        }}
                                        className="sm:w-auto w-full relative group cursor-pointer h-full"
                                    >
                                        {/* 3D Card Container */}
                                        <div 
                                            className={`relative bg-gradient-to-br ${colorScheme.bg} -z-10 rounded-3xl sm:p-6 p-3 shadow-xl ${colorScheme.shadow} transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col`}
                                            style={{
                                                boxShadow: `0 10px 30px -10px ${colorScheme.glow}`
                                            }}
                                        >
                                            {/* Radial Progress Ring with 3D Effect */}
                                            <div className="relative w-32 h-32 mx-auto">
                                                
                                                <svg className="relative w-32 h-32 transform -rotate-90 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}>
                                                    {/* Background circle with gradient */}
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="50"
                                                        fill="url(#bg-gradient-${index})"
                                                        stroke="#f3f4f6"
                                                        strokeWidth="3"
                                                    />
                                                    
                                                    {/* Track circle */}
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="50"
                                                        fill="none"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="8"
                                                    />
                                                    
                                                    {/* Progress circle with gradient */}
                                                    <motion.circle
                                                        cx="64"
                                                        cy="64"
                                                        r="50"
                                                        fill="none"
                                                        stroke={`url(#progress-gradient-${index})`}
                                                        strokeWidth="8"
                                                        strokeLinecap="round"
                                                        strokeDasharray={circumference}
                                                        initial={{ strokeDashoffset: circumference }}
                                                        animate={{ strokeDashoffset: strokeOffset }}
                                                        transition={{ duration: 2, ease: "easeOut", delay: index * 0.1 }}
                                                        style={{
                                                            filter: 'drop-shadow(0 0 10px ' + colorScheme.ring + ')'
                                                        }}
                                                    />
                                                    
                                                    {/* Inner highlight circle */}
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="42"
                                                        fill="white"
                                                        opacity="0.9"
                                                    />
                                                    
                                                    <defs>
                                                        <linearGradient id={`bg-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                                                            <stop offset="100%" stopColor="#f9fafb" stopOpacity="0.8" />
                                                        </linearGradient>
                                                        <linearGradient id={`progress-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor={colorScheme.ring} />
                                                            <stop offset="50%" stopColor={colorScheme.ring} stopOpacity="0.8" />
                                                            <stop offset="100%" stopColor={colorScheme.ring} stopOpacity="1" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                
                                                {/* Center content */}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-4xl mb-1 drop-shadow-lg">
                                                        {pillar.icon}
                                                    </span>
                                                    <span className="text-lg font-black bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                                        {pillar.mastery}%
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Label with gradient background */}
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => {
                                                    // Check if pillar is locked
                                                    if (pillar.locked || pillar.accessMode === 'locked' || pillar.upgradeRequired) {
                                                        setUpgradeFeature('pillar');
                                                        setShowUpgradeModal(true);
                                                        toast.error('Upgrade to premium to access this pillar!', {
                                                            duration: 3000,
                                                            position: 'bottom-center',
                                                            icon: '🔒'
                                                        });
                                                        return;
                                                    }

                                                    // Check access using subscription context
                                                    const accessCheck = canAccessPillar(pillar.pillar || pillar.pillarKey);
                                                    if (!accessCheck.allowed) {
                                                        setUpgradeFeature('pillar');
                                                        setShowUpgradeModal(true);
                                                        toast.error(accessCheck.message || 'Upgrade to premium to access this pillar!', {
                                                            duration: 3000,
                                                            position: 'bottom-center',
                                                            icon: '🔒'
                                                        });
                                                        return;
                                                    }

                                                    // Map pillar keys to route paths
                                                    const pillarRouteMap = {
                                                        'finance': '/games/financial-literacy',
                                                        'brain': '/games/brain-health',
                                                        'uvls': '/games/uvls',
                                                        'dcos': '/games/digital-citizenship',
                                                        'moral': '/games/moral-values',
                                                        'ai': '/games/ai-for-all',
                                                        'health-male': '/games/health-male',
                                                        'health-female': '/games/health-female',
                                                        'ehe': '/games/ehe',
                                                        'crgc': '/games/civic-responsibility',
                                                        'sustainability': '/games/sustainability'
                                                    };

                                                    const routeBase = pillarRouteMap[pillar.pillarKey] || `/games/${pillar.pillarKey}`;
                                                    
                                                    // Navigate to kids games by default (can be changed based on user age)
                                                    const userAge = calculateUserAge(user?.dateOfBirth || user?.dob);
                                                    const ageGroup = userAge && userAge < 13 ? 'kids' : userAge && userAge < 18 ? 'teens' : 'adults';
                                                    
                                                    navigate(`${routeBase}/${ageGroup}`);
                                                }}
                                                className={`mt-4 bg-gradient-to-r ${colorScheme.gradient} rounded-2xl px-4 py-3 shadow-lg min-h-[4rem] flex flex-col justify-center ${pillar.locked || pillar.accessMode === 'locked' || pillar.upgradeRequired ? 'cursor-pointer opacity-75' : 'cursor-pointer'}`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <p className="text-sm font-bold text-white text-center leading-tight drop-shadow" style={{ 
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {pillar.pillar}
                                                    </p>
                                                    {(pillar.locked || pillar.accessMode === 'locked' || pillar.upgradeRequired) && (
                                                        <Lock className="w-4 h-4 text-white" />
                                                    )}
                                                    {pillar.accessMode === 'preview' && !pillar.locked && !pillar.upgradeRequired && (
                                                        <Eye className="w-4 h-4 text-white/80" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/90 text-center mt-1">
                                                    {pillar.upgradeRequired ? (
                                                        <span className="block text-white/70 text-[10px]">Upgrade Required</span>
                                                    ) : (
                                                        <>
                                                            {pillar.gamesCompleted}/{pillar.totalGames} games
                                                            {pillar.accessMode === 'preview' && !hasFeature('fullAccess') && (
                                                                <span className="block text-white/70 text-[10px] mt-0.5">Preview Mode</span>
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                            </motion.div>
                                            
                                            {/* Hover Tooltip */}
                                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-xl px-4 py-3 whitespace-nowrap z-50 shadow-2xl pointer-events-none">
                                                <div className="font-bold mb-1">{pillar.pillar}</div>
                                                <div className="text-gray-300">
                                                    📊 {pillar.mastery}% Mastery
                                                </div>
                                                <div className="text-gray-300">
                                                    🎮 {pillar.gamesCompleted}/{pillar.totalGames} Completed
                                                </div>
                                                {pillar.deltaWoW !== 0 && (
                                                    <div className={`mt-1 ${pillar.deltaWoW > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {pillar.deltaWoW > 0 ? '📈' : '📉'} {Math.abs(pillar.deltaWoW)}% this week
                                                    </div>
                                                )}
                                                {/* Tooltip arrow */}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                    </motion.div>
                )}

                {/* 4. Activity Heatmap */}
                {!activityHeatmap || !activityHeatmap.heatmapData ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mb-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-6 shadow-xl border border-gray-200 animate-pulse"
                    >
                        <div className="h-8 bg-gray-300 rounded-lg w-48 mb-4"></div>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="flex items-center gap-10">
                                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                                    <div className="flex gap-1 flex-1">
                                        {Array.from({ length: 24 }).map((_, j) => (
                                            <div key={j} className="w-8 h-8 bg-gray-300 rounded-sm"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="h-3 w-12 bg-gray-300 rounded"></div>
                            <div className="h-3 w-16 bg-gray-300 rounded"></div>
                            <div className="h-3 w-12 bg-gray-300 rounded"></div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mb-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-6 shadow-xl border border-gray-200"
                    >
                        <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-7 h-7 text-indigo-600" />
                            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Activity Heatmap
                            </span>
                        </h2>
                        <div className="overflow-x-auto sm:overflow-hidden">
                            <div className="min-w-[600px]">
                                {activityHeatmap.heatmapData.map((day, dayIndex) => (
                                    <div key={dayIndex} className="flex items-center justify-none sm:justify-start gap-10 sm:gap-32 mb-1">
                                        <span className="text-xs font-bold text-gray-600 w-12">{day.day}</span>
                                        <div className="flex gap-1 flex-1">
                                            {day.hours.map((count, hourIndex) => {
                                                const intensity = count === 0 ? 0 : Math.min(count / 5, 1);
                                                const bgColor = count === 0 
                                                    ? 'bg-gray-300' 
                                                    : `bg-gradient-to-br from-blue-${Math.round(intensity * 500)} to-indigo-${Math.round(intensity * 600)}`;
                                                
                                                return (
                                                    <motion.div
                                                        key={hourIndex}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: (dayIndex * 0.05) + (hourIndex * 0.002) }}
                                                        whileHover={{ zIndex: 10 }}
                                                        className={`size-4 sm:size-8 rounded-sm ${bgColor} cursor-pointer group relative`}
                                                        style={{
                                                            opacity: count === 0 ? 0.3 : 0.6 + (intensity * 0.4),
                                                            backgroundColor: count > 0 ? `rgba(99, 102, 241, ${0.3 + intensity * 0.7})` : undefined
                                                        }}
                                                    >
                                                        {count > 0 && (
                                                            <div className="absolute top-full left-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                                                                • {hourIndex}:00 - {count} activities •
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center items-center translate-x-5 sm:gap-96 gap-48 mt-4 text-xs text-gray-500">
                                    <span>0:00</span>
                                    <span className="sm:translate-x-6 translate-x-4">12:00</span>
                                    <span className="sm:translate-x-2 translate-x-4">23:00</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 justify-center">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                                <span className="text-xs text-gray-600">Low</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(99, 102, 241, 0.5)' }}></div>
                                <span className="text-xs text-gray-600">Medium</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(99, 102, 241, 1)' }}></div>
                                <span className="text-xs text-gray-600">High</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 5. Mood Timeline */}
                {!moodTimeline ? (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mb-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-3xl p-6 shadow-xl border-2 border-pink-200 animate-pulse"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="h-8 bg-gray-300 rounded-lg w-40"></div>
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mb-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-3xl p-5 shadow-xl border-2 border-pink-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-pink-600" />
                                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                    Mood Journey
                                </span>
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/student/mood-tracker')}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition-colors shadow-md hover:shadow-lg"
                                aria-label="Go to Mood Tracker"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                        {moodTimeline.timeline && moodTimeline.timeline.length > 0 ? (() => {
                            // Filter to show only last 7 days
                            const sevenDaysAgo = new Date();
                            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                            sevenDaysAgo.setHours(0, 0, 0, 0);
                            
                            const recentMoodLogs = moodTimeline.timeline.filter(entry => {
                                const entryDate = new Date(entry.date || entry.timestamp);
                                entryDate.setHours(0, 0, 0, 0);
                                return entryDate >= sevenDaysAgo;
                            });
                            
                            return recentMoodLogs.length > 0 ? (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-rose-300 to-orange-300 rounded-full" />
                                    
                                    {/* Timeline items */}
                                    <div className="space-y-3">
                                        {recentMoodLogs.map((entry, index) => (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-12 group"
                                        >
                                            {/* Timeline dot */}
                                            <motion.div
                                                whileHover={{ scale: 1.2 }}
                                                className="absolute left-3 top-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-pink-300 z-10"
                                            >
                                                <span className="text-base">{entry.emoji}</span>
                                            </motion.div>
                                            
                                            {/* Content */}
                                            <motion.div
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-gray-800">
                                                        {new Date(entry.date).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric',
                                                            weekday: 'short'
                                                        })}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                {entry.note && (
                                                    <p className="text-xs text-gray-600 italic">"{entry.note}"</p>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col items-center gap-3"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                                            <Heart className="w-8 h-8 text-pink-400" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-700 mb-1">No mood logs in the last 7 days</p>
                                            <p className="text-xs text-gray-500 mb-3">Start tracking your mood to see your recent journey</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate('/student/mood-tracker')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <span>Track Your Mood</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })() : (
                            <div className="text-center py-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                                        <Heart className="w-8 h-8 text-pink-400" />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-700 mb-1">No mood logs yet</p>
                                        <p className="text-xs text-gray-500 mb-3">Start tracking your mood to see your journey here</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/student/mood-tracker')}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <span>Track Your Mood</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* 6. AI Recommendations */}
                {!recommendations && !recommendationsLoading ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mb-8 animate-pulse"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-8 bg-gray-300 rounded-lg w-48"></div>
                            <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl p-6 shadow-2xl h-48">
                                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                                    <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mb-8"
                    >
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-xl font-black text-gray-800">
                            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                Recommended For You
                            </span>
                        </h2>
                    </div>
                    {recommendationsLoading && !recommendations && (
                        <div className="mb-4 text-center py-8">
                            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                                <Loader className="w-5 h-5 animate-spin text-yellow-500" />
                                <span className="font-medium">Loading recommendations...</span>
                            </div>
                        </div>
                    )}
                    {recommendations && recommendations.recommendations && recommendations.recommendations.length > 0 ? (
                        <>
                            {recommendationsLoading && (
                                <div className="mb-4 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>Updating recommendations...</span>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                            {recommendations.recommendations
                                .filter(rec => {
                                    // Filter out dismissed recommendations
                                    if (dismissedRecommendations.has(rec.recommendationId)) {
                                        return false;
                                    }
                                    // Filter out UVLS Master Skills
                                    if (rec.title && rec.title.includes('Master') && rec.title.includes('UVLS') && rec.title.includes('Skills')) {
                                        return false;
                                    }
                                    // Filter out Daily Challenge
                                    if (rec.title && rec.title.includes('Daily Challenge')) {
                                        return false;
                                    }
                                    // Filter out daily-challenges path
                                    if (rec.path && rec.path.includes('daily-challenges')) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((rec, index) => {
                                const bgColors = [
                                    'from-violet-400 to-purple-500',
                                    'from-cyan-400 to-blue-500',
                                    'from-emerald-400 to-green-500'
                                ];
                                const bgGradient = bgColors[index % bgColors.length];

                                return (
                                    <motion.div
                                        key={rec.recommendationId || index}
                                        initial={{ y: 50, opacity: 0, rotate: -5 }}
                                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                        transition={{ delay: index * 0.15, type: "spring" }}
                                        whileHover={{ y: -5, rotate: 1, scale: 1.02 }}
                                        className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl p-4 shadow-xl cursor-pointer group`}
                                    >
                                        {/* Dismiss button */}
                                        <motion.button
                                            whileHover={{ scale: 1.2, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                handleDismissRecommendation(rec, index);
                                            }}
                                            className="absolute top-2 right-2 z-20 p-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all opacity-0 group-hover:opacity-100"
                                            title="Dismiss this recommendation"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </motion.button>

                                        {/* Clickable card content */}
                                        <div onClick={() => handleNavigate(rec.path, rec.title, { ...rec, position: index + 1 })}>
                                            {/* Animated background blob */}
                                            <motion.div
                                                className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-2xl"
                                                animate={{ 
                                                    scale: [1, 1.2, 1],
                                                    x: [0, 10, 0],
                                                    y: [0, -10, 0]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="text-3xl mb-2">{rec.icon}</div>
                                                <h3 className="text-white font-black text-base mb-1.5 line-clamp-2">{rec.title}</h3>
                                                <p className="text-white/90 text-xs mb-3 line-clamp-2">{rec.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white font-semibold">
                                                        {rec.reason}
                                                    </span>
                                                    <span className="text-white font-bold text-sm flex items-center gap-1">
                                                        <Zap className="w-3 h-3" />
                                                        +{rec.xpReward}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Corner accent */}
                                            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-full" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                            </AnimatePresence>
                            </div>
                        </>
                        ) : (
                            !recommendationsLoading && (
                                <div className="text-center py-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-dashed border-yellow-200">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col items-center gap-3"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-700 mb-1">No recommendations yet</p>
                                            <p className="text-xs text-gray-500 mb-3">Complete activities to get personalized recommendations</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={refreshRecommendations}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                <span>Refresh</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </div>
                            )
                        )}
                    </motion.div>
                )}

                {/* 7. Leaderboard Snippet + 8. Achievement Timeline - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Leaderboard Snippet */}
                    {!leaderboardData || !leaderboardData.leaderboard ? (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-3xl p-6 shadow-xl border-2 border-yellow-200 animate-pulse"
                        >
                            <div className="h-8 bg-gray-300 rounded-lg w-40 mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/70 rounded-2xl">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-300 rounded mb-2 w-32"></div>
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </div>
                                        <div className="text-right">
                                            <div className="h-6 bg-gray-300 rounded w-16 mb-1"></div>
                                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 bg-gray-300 rounded-2xl p-4 h-24"></div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-3xl p-6 shadow-xl border-2 border-yellow-200"
                        >
                            <h2 className="text-xl font-black text-gray-800 mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-600" />
                                <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                    Top Players
                                </span>
                                </div>
                                <button
                                    onClick={() => navigate('/student/leaderboard')}
                                    className="p-1.5 hover:bg-yellow-100 rounded-full transition-colors cursor-pointer"
                                    aria-label="View full leaderboard"
                                >
                                    <ChevronRight className="w-5 h-5 text-yellow-600" />
                                </button>
                            </h2>
                            <div className="space-y-2">
                                {leaderboardData.leaderboard.slice(0, 5).map((player, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                            player.isCurrentUser 
                                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg' 
                                                : 'bg-white/70 backdrop-blur-sm shadow-md'
                                        }`}
                                    >
                                        {/* Rank Badge */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg flex-shrink-0 ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                            player.isCurrentUser ? 'bg-white text-orange-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {index === 0 && '👑'}
                                            {index === 1 && '🥈'}
                                            {index === 2 && '🥉'}
                                            {index > 2 && `#${player.rank}`}
                                        </div>
                                        
                                        {/* Player Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-bold text-sm truncate ${player.isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                                                {player.name} {player.isCurrentUser && '(You)'}
                                            </h4>
                                            <p className={`text-xs truncate ${player.isCurrentUser ? 'text-white/80' : 'text-gray-500'}`}>
                                                @{player.username}
                                            </p>
                                        </div>
                                        
                                        {/* XP & Level */}
                                        <div className="text-right flex-shrink-0">
                                            <p className={`font-black text-base ${player.isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                                                {player.xp.toLocaleString()}
                                            </p>
                                            <p className={`text-xs ${player.isCurrentUser ? 'text-white/80' : 'text-gray-500'}`}>
                                                Level {player.level}
                                            </p>
                                        </div>
                                        </motion.div>
                                ))}
                            </div>
                            
                            {/* Your Rank */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-3 text-white text-center shadow-lg"
                            >
                                <p className="text-xs font-medium mb-0.5">Your Global Rank</p>
                                <p className="text-2xl font-black">#{leaderboardData.currentUserRank}</p>
                                <p className="text-xs mt-0.5 text-white/80">out of {leaderboardData.totalUsers} players</p>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Achievement Timeline */}
                    {!achievementTimeline || !achievementTimeline.achievements ? (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 shadow-xl border-2 border-blue-200 animate-pulse"
                        >
                            <div className="h-8 bg-gray-300 rounded-lg w-48 mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/80 rounded-2xl p-4">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                        <div className="h-6 w-16 bg-gray-300 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 shadow-xl border-2 border-blue-200"
                        >
                            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                                <Medal className="w-7 h-7 text-blue-600" />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Recent Achievements
                                </span>
                            </h2>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {achievementTimeline.achievements.length > 0 ? (
                                    achievementTimeline.achievements.map((achievement, index) => {
                                        const achievementId = achievement.id || `${achievement.badgeName}-${achievement.earnedAt}`;
                                        const isNew = newAchievementIds.has(achievementId);
                                        const subtitle = achievement.pillarName
                                            ? `${achievement.pillarName}${achievement.ageGroup ? ` (${achievement.ageGroup})` : ""}`
                                            : achievement.ageGroup || "Unknown";

                                        return (
                                            <motion.div
                                                key={achievementId}
                                                initial={{ scale: 0.8, opacity: 0, x: -20 }}
                                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                    type: "spring",
                                                    stiffness: 100,
                                                    damping: 15
                                                }}
                                                whileHover={{ scale: 1.03, x: 5, y: -2 }}
                                                className={`flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border ${
                                                    isNew ? 'border-yellow-400 border-2 shadow-yellow-200' : 'border-white/50'
                                                } group relative overflow-hidden`}
                                            >
                                                {achievement.badgeImage ? (
                                                    <img
                                                        src={achievement.badgeImage}
                                                        alt={achievement.badgeName || "Badge"}
                                                        className="w-14 h-14 rounded-xl object-cover shadow-lg bg-white flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0">
                                                        B
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                                                            {achievement.badgeName || "Badge Earned"}
                                                        </h4>
                                                        {isNew && (
                                                            <motion.span
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: [0, 1.2, 1] }}
                                                                className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full"
                                                            >
                                                                NEW
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 truncate mt-0.5">
                                                        {subtitle}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8">
                                        <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">No achievements yet</p>
                                        <p className="text-sm text-gray-400">Start playing to earn badges!</p>
                                    </div>
                                )}
                            </div>
                                        
                            {achievementTimeline.totalAchievements > 0 && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-bold text-purple-600">
                                        {achievementTimeline.totalAchievements} total achievements earned! 🎉
                                    </p>
                                            </div>
                            )}
                        </motion.div>
                    )}
                </div>



                {/* Motivational Footer */}
                <div className="text-center mt-10">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg animate-pulse">
                        <Sparkles className="w-6 h-6" />
                        <span>Every small step counts! Keep going champion! 🚀</span>
                        <Sparkles className="w-6 h-6" />
                    </div>
                    
                    {/* Debug Info - Hidden unless dashboardData exists */}
                    {dashboardData && import.meta.env.DEV && (
                        <div className="mt-4 text-xs text-gray-500">
                            <p>Dashboard data loaded: {new Date().toLocaleTimeString()}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <UpgradePrompt
                            feature={upgradeFeature || 'game'}
                            gamesPlayed={pillarMastery?.pillars?.find(p => p.locked)?.gamesCompleted || 0}
                            gamesAllowed={pillarMastery?.pillars?.find(p => p.locked)?.gamesAllowed || 5}
                            onClose={() => {
                                setShowUpgradeModal(false);
                                setUpgradeFeature(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Profile Completion Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-purple-100"
                    >
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Complete Your Profile
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Please provide your date of birth and gender to continue
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={profileForm.dateOfBirth}
                                    onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                                        profileErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {profileErrors.dateOfBirth && (
                                    <p className="text-red-500 text-xs mt-1">{profileErrors.dateOfBirth}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={profileForm.gender}
                                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                                        profileErrors.gender ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {profileErrors.gender && (
                                    <p className="text-red-500 text-xs mt-1">{profileErrors.gender}</p>
                                )}
                            </div>

                            {/* Registration Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Registration Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setProfileForm({ ...profileForm, registrationType: "individual", schoolLinkingCode: "" })}
                                        className={`px-4 py-3 border-2 rounded-xl font-medium transition-all ${
                                            profileForm.registrationType === "individual"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-purple-300"
                                        } ${profileErrors.registrationType ? 'border-red-500' : ''}`}
                                    >
                                        Register Individual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProfileForm({ ...profileForm, registrationType: "school" })}
                                        className={`px-4 py-3 border-2 rounded-xl font-medium transition-all ${
                                            profileForm.registrationType === "school"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-purple-300"
                                        } ${profileErrors.registrationType ? 'border-red-500' : ''}`}
                                    >
                                        Register Through School
                                    </button>
                                </div>
                                {profileErrors.registrationType && (
                                    <p className="text-red-500 text-xs mt-1">{profileErrors.registrationType}</p>
                                )}
                            </div>

                            {/* School Linking Code Input - Only show when school is selected */}
                            {profileForm.registrationType === "school" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        School Linking Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.schoolLinkingCode}
                                        onChange={(e) => setProfileForm({ ...profileForm, schoolLinkingCode: e.target.value.toUpperCase() })}
                                        placeholder="Enter your school linking code"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                                            profileErrors.schoolLinkingCode ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {profileErrors.schoolLinkingCode && (
                                        <p className="text-red-500 text-xs mt-1">{profileErrors.schoolLinkingCode}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Ask your school administrator for the linking code
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleCompleteProfile}
                                disabled={savingProfile}
                                className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {savingProfile ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </span>
                                ) : (
                                    "Complete Profile"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}



