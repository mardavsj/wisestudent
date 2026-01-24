import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Zap,
    ChevronRight,
    Lock,
    Sparkles,
    Star,
    AlertTriangle,
    X,
    Clock
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { mockFeatures } from "../../data/mockFeatures";
import { logActivity } from "../../services/activityService";
import { toast } from "react-hot-toast";
import { isModuleAccessible, getAllowedAgeGroupsForAge } from "../../utils/ageUtils";
import { getAgeRestrictionMessage } from "../../utils/moduleAccessUtils";

export default function CategoryView() {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [featureCards, setFeatureCards] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAgeRestrictionModal, setShowAgeRestrictionModal] = useState(false);
    const [restrictedUserAge, setRestrictedUserAge] = useState(null);
    const [restrictedCategorySlug, setRestrictedCategorySlug] = useState(null);
    const [restrictionType, setRestrictionType] = useState(null); // 'adult', 'kids', or 'teens'
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);
    const [comingSoonCardTitle, setComingSoonCardTitle] = useState(null);
    console.log("featuresCrad,", featureCards);

    const categories = [
        { key: "finance", label: "Financial Literacy", color: "from-blue-500 to-cyan-500" },
        { key: "wellness", label: "Brain Health", color: "from-green-500 to-emerald-500" },
        { key: "personal", label: "UVLS (Life Skills & Values)", color: "from-orange-500 to-red-500" },
        { key: "education", label: "Digital Citizenship & Online Safety", color: "from-yellow-500 to-amber-500" },
        { key: "creativity", label: "Moral Values", color: "from-pink-500 to-rose-500" },
        { key: "entertainment", label: "AI for All", color: "from-indigo-500 to-purple-500" },
        { key: "social", label: "Health - Male", color: "from-teal-500 to-cyan-500" },
        { key: "competition", label: "Health - Female", color: "from-red-500 to-orange-500" },
        { key: "rewards", label: "Entrepreneurship & Higher Education", color: "from-lime-500 to-green-500" },
        { key: "shopping", label: "Civic Responsibility & Global Citizenship", color: "from-fuchsia-500 to-purple-500" },
        { key: "sustainability", label: "Sustainability", color: "from-green-500 to-emerald-500" },
        { key: "challenges", label: "Challenges", color: "from-violet-500 to-purple-500" },
    ];

    useEffect(() => {
        // Convert slug back to category
        const category = categories.find(cat => 
            cat.label.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[()&]/g, '')
                .replace(/--+/g, '-') === categorySlug
        );

        if (category) {
            setCategoryInfo(category);
            
            // Filter cards by category for all categories (including Sustainability)
            let filtered = mockFeatures.filter((card) => card.category === category.key);
                
            // Special handling for Digital Citizenship & Online Safety category
            if (category.key === 'education' && categorySlug === 'digital-citizenship-online-safety') {
                // Remove the "Financial Literacy" card
                filtered = filtered.filter((card) => card.title !== "Financial Literacy");
            }
            
            // Special handling for Health - Female category
            // Remove the "Leaderboard" card
            if (category.key === 'competition' && categorySlug === 'health-female') {
                filtered = filtered.filter((card) => card.title !== "Leaderboard");
            }



            // Special handling for Health - Male category
            // Show only 8 cards (Kids, Teen, Adult Module + 5 core male health topics)
            if (category.key === 'social' && categorySlug === 'health-male') {
                const allowedTitles = [
                    "Kids Module",
                    "Teen Module",
                    "Adult Module",
                    "Puberty & Growth",
                    "Nutrition & Diet",
                    "Fitness & Strength Training",
                    "Body Image & Confidence",
                    "Reproductive Health",
                ];
                filtered = filtered.filter((card) => allowedTitles.includes(card.title));
            }


            // Special handling for Civic Responsibility & Global Citizenship category
            // Show only 8 cards (Kids, Teen, Adult Module + 5 core civic topics)
            if (category.key === 'shopping' && categorySlug === 'civic-responsibility-global-citizenship') {
                const allowedTitles = [
                    "Kids Module",
                    "Teen Module",
                    "Young Adult Module",
                    "Adult Module",
                    "Civic Duties & Rights",
                    "Volunteering & Service",
                    "Global Citizenship",
                    "Cultural Respect & Diversity",
                    "UN Sustainable Development Goals",
                ];
                filtered = filtered.filter((card) => allowedTitles.includes(card.title));
            }

            // Special handling for Sustainability category
            // Show Kids, Teen, Adult Module cards + main Sustainability game + core sustainability topics
            if (category.key === 'sustainability' && categorySlug === 'sustainability') {
                const allowedTitles = [
                    "Kids Module",
                    "Teen Module",
                    "Young Adult Module",
                    "Adult Module",
                    "Sustainability",
                    "Climate Change Awareness",
                    "Waste Management",
                    "Energy Conservation",
                    "Water Conservation",
                    "Renewable Energy",
                    "Sustainable Living",
                    "Biodiversity & Conservation",
                ];
                filtered = filtered.filter((card) => allowedTitles.includes(card.title));
            }
            
            // Special handling for Financial Literacy category
            // Move "Financial Quiz" card to the end
            if (category.key === 'finance' && categorySlug === 'financial-literacy') {
                const financialQuizCard = filtered.find((card) => card.title === "Financial Quiz");
                const otherCards = filtered.filter((card) => card.title !== "Financial Quiz");
                if (financialQuizCard) {
                    filtered = [...otherCards, financialQuizCard];
                }
            }

            
            setFeatureCards(filtered);
        } else {
            // Invalid category, redirect to dashboard
            navigate('/student/dashboard');
        }
        
        setLoading(false);
    }, [categorySlug, navigate]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (showAgeRestrictionModal || showComingSoonModal) {
            // Save the current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            return () => {
                // Restore scroll position when modal closes
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [showAgeRestrictionModal, showComingSoonModal]);

    const handleNavigate = (path, featureTitle) => {
        if (path && typeof path === "string") {
            logActivity({
                activityType: "navigation",
                description: `Navigated to: ${featureTitle || path}`,
                metadata: {
                    featurePath: path,
                    featureTitle: featureTitle,
                    fromPage: `category-${categorySlug}`,
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
            navigate(path);
        }
    };

    const calculateUserAge = (dob) => {
        if (!dob) return null;
        const dobDate = typeof dob === 'string' ? new Date(dob) : new Date(dob);
        if (isNaN(dobDate.getTime())) return null;
        
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        return age;
    };

    const getGameAccessStatus = () => {
        const userAge = calculateUserAge(user?.dateOfBirth || user?.dob);
        return { userAge };
    };

    const moduleTierSlugMap = {
        "Kids Module": "kids",
        "Teen Module": "teen",
        "Young Adult Module": "young-adult",
        "Adult Module": "adults",
    };

    const normalizeTierForAccess = (tier) => (tier === "teen" ? "teens" : tier);

    const MODULE_DISPLAY_NAMES = {
        kids: "Kids Module",
        teens: "Teen Module",
        "young-adult": "Young Adult Module",
        adults: "Adult Module",
    };

    const formatModuleList = (labels) => {
        if (!labels || labels.length === 0) return "";
        if (labels.length === 1) return labels[0];
        if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
        const copy = [...labels];
        const last = copy.pop();
        return `${copy.join(", ")}, and ${last}`;
    };

    const getAccessibleModuleLabels = (age) => {
        if (age === null || age === undefined) return [];
        const allowedGroups = getAllowedAgeGroupsForAge(age);
        const seen = new Set();
        const labels = [];
        allowedGroups.forEach((group) => {
            const normalizedGroup = group === "teen" ? "teens" : group;
            const label = MODULE_DISPLAY_NAMES[normalizedGroup];
            if (label && !seen.has(label)) {
                seen.add(label);
                labels.push(label);
            }
        });
        return labels;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    const allowedModuleLabels = getAccessibleModuleLabels(restrictedUserAge);
    const formattedAllowedModules = formatModuleList(allowedModuleLabels);
    const encouragementContent = allowedModuleLabels.length > 0 ? (
        <>
            We encourage you to explore our <strong>{formattedAllowedModules}</strong> section{allowedModuleLabels.length > 1 ? "s" : ""}{categoryInfo ? ` in ${categoryInfo.label}` : ""}, which are specifically tailored to your age group and offer engaging, educational experiences designed to support your learning journey.
        </>
    ) : (
        <>We encourage you to explore other modules{categoryInfo ? ` in ${categoryInfo.label}` : ""}.</>
    );
    const explorationButtonLabel = allowedModuleLabels.length > 0
        ? `Explore ${formattedAllowedModules}`
        : "Explore available modules";
    const restrictionMessages = {
        kids: {
            label: "Kids Module",
            requirement: "Designed for learners aged 0-12.",
            note: (age) => `Your current age is ${age}. This content remains tailored to younger learners at that stage.`,
            encouragement: encouragementContent,
        },
        teens: {
            label: "Teen Module",
            requirement: "Designed for learners aged 13-17.",
            note: (age) => `Your current age is ${age}. You'll gain access once you fall within the 13-17 range.`,
            encouragement: encouragementContent,
        },
        "young-adult": {
            label: "Young Adult Module",
            requirement: "Designed for learners aged 18-23.",
            note: (age) => `Your current age is ${age}. This module unlocks when you enter the 18-23 age bracket.`,
            encouragement: encouragementContent,
        },
        adults: {
            label: "Adult Module",
            requirement: "Designed for learners aged 24 and above.",
            note: (age) => `Your current age is ${age}. Access opens automatically at age 24 and beyond.`,
            encouragement: encouragementContent,
        },
    };

    if (loading || !categoryInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
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
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    {/* Back Button */}
                    <motion.button
                        onClick={() => navigate('/student/dashboard')}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-6 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-800">Back to Dashboard</span>
                    </motion.button>

                    {/* Category Header */}
                    <div className="text-center">
                        <motion.div
                            className={`inline-block bg-gradient-to-r ${categoryInfo.color} text-white px-8 py-4 rounded-3xl shadow-2xl mb-4`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black flex items-center gap-3">
                                <span>{categoryInfo.label}</span>
                                <Sparkles className="w-8 h-8" />
                            </h1>
                        </motion.div>
                        <p className="text-lg text-gray-600 mt-2">
                            Explore {featureCards.length} amazing {featureCards.length === 1 ? 'activity' : 'activities'} in this category
                        </p>
                    </div>
                </motion.div>

                {/* Cards Grid */}
                {featureCards.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {featureCards.map((card, i) => {
                            const cardKey = card.id ? `${card.id}-${i}` : `${card.title}-${card.category}-${i}`;
                            const isGameCard = Object.keys(moduleTierSlugMap).includes(card.title);
                            const gameAccess = getGameAccessStatus();
                            const userAge = gameAccess.userAge;
                            const tierSlug = moduleTierSlugMap[card.title];
                            const normalizedTierSlug = tierSlug ? normalizeTierForAccess(tierSlug) : null;
                            
                            const isAgeRestricted = isGameCard && normalizedTierSlug && userAge !== null && !isModuleAccessible(normalizedTierSlug, userAge);
                            const isDisabled = isAgeRestricted;
                            const disabledMessage = normalizedTierSlug ? getAgeRestrictionMessage(normalizedTierSlug, userAge) : "";
                            
                            return (
                                <motion.div
                                    key={cardKey}
                                    variants={itemVariants}
                                    whileHover={isDisabled ? {} : {
                                        scale: 1.05,
                                        y: -8,
                                        transition: { duration: 0.2 },
                                    }}
                                    whileTap={isDisabled ? {} : { scale: 0.95 }}
                                    className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (isDisabled) {
                                            toast.error(disabledMessage || "This module is locked for your age group.", {
                                                duration: 4000,
                                                position: "bottom-center",
                                                icon: "🔒"
                                            });
                                            setRestrictedUserAge(userAge);
                                            setRestrictedCategorySlug(categorySlug);
                                            setRestrictionType(tierSlug || "kids");
                                            setShowAgeRestrictionModal(true);
                                            return;
                                        }
                                        
                                        // Check if the card has comingSoon flag set to true
                                        if (card.comingSoon === true) {
                                            setComingSoonCardTitle(card.title);
                                            setShowComingSoonModal(true);
                                            return;
                                        }
                                        
                                        toast.success(`Loading ${card.title}...`, {
                                            duration: 2000,
                                            position: "bottom-center",
                                            icon: "🚀"
                                        });
                                        handleNavigate(card.path, card.title);
                                    }}
                                >
                                    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 transition-all duration-300 relative overflow-hidden h-full ${
                                        isDisabled 
                                            ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300' 
                                            : 'hover:shadow-2xl'
                                    }`}>
                                        {isDisabled && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center z-40">
                                                <div className="bg-black/20 backdrop-blur-sm rounded-full p-4 flex flex-col items-center z-50">
                                                    <Lock className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-r from-${card.color.replace('bg-', '')} to-${card.color.replace('bg-', '')}/70 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                        />

                                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                                            <motion.div
                                                className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                                                    isDisabled ? 'grayscale opacity-70' : ''
                                                }`}
                                                whileHover={isDisabled ? {} : { rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <span className="text-2xl">{card.icon}</span>
                                            </motion.div>

                                            <h3 className={`text-lg font-bold mb-2 ${
                                                isDisabled ? 'text-gray-500' : 'text-gray-800'
                                            }`}>
                                                {card.title}
                                            </h3>

                                            <p className={`text-sm mb-4 flex-1 ${
                                                isDisabled ? 'text-gray-500' : 'text-gray-600'
                                            }`}>
                                                {card.description}
                                            </p>

                                            <div className="flex items-center justify-between w-full">
                                                {card.showXp !== false ? (
                                                    <div className={`flex items-center gap-1 text-xs font-semibold ${
                                                        isDisabled ? 'text-gray-500' : 'text-indigo-600'
                                                    }`}>
                                                        <Zap className="w-4 h-4" />
                                                        <span>+{card.xpReward} XP</span>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                                {isDisabled ? (
                                                    <Lock className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <Star className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No activities found</h3>
                        <p className="text-gray-500">Check back soon for more content!</p>
                    </motion.div>
                )}

                {/* Motivational Footer */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg animate-pulse">
                        <Sparkles className="w-6 h-6" />
                        <span>Keep learning and growing! 🚀</span>
                        <Sparkles className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Coming Soon Modal */}
            <AnimatePresence>
                {showComingSoonModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowComingSoonModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-blue-200 relative overflow-hidden"
                        >
                            {/* Blue Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Coming Soon</h3>
                                </div>
                                <button
                                    onClick={() => setShowComingSoonModal(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="mb-4 text-center">
                                    <div className="mb-4">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-4">
                                            <Clock className="w-10 h-10 text-blue-600" />
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-800 mb-3">
                                        {comingSoonCardTitle}
                                    </h4>
                                    <p className="text-gray-600 text-base leading-relaxed mb-4">
                                        We're working hard to bring you this amazing feature! 
                                        This content will be available soon.
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Stay tuned for updates and new features in {categoryInfo?.label || 'this category'}.
                                    </p>
                                </div>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {encouragementContent}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowComingSoonModal(false)}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        Got it!
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Age Restriction Modal */}
            <AnimatePresence>
                {showAgeRestrictionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAgeRestrictionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-red-200 relative overflow-hidden"
                        >
                            {/* Red Warning Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <AlertTriangle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Age Restriction Notice</h3>
                                </div>
                                <button
                                    onClick={() => setShowAgeRestrictionModal(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    {(() => {
                                        const normalizedRestrictionType =
                                            restrictionType === "adult"
                                                ? "adults"
                                                : restrictionType === "teen"
                                                    ? "teens"
                                                    : restrictionType === "young-adult"
                                                        ? "young-adult"
                                                        : restrictionType;
                                        const detail =
                                            restrictionMessages[normalizedRestrictionType] || restrictionMessages.kids;

                                        return (
                                            <>
                                                <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                    Thank you for your interest in accessing our {detail.label} content
                                                    {categoryInfo ? ` in ${categoryInfo.label}` : ""}. We appreciate your enthusiasm for learning!
                                                </p>
                                                <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                    <strong className="text-red-600">Age Requirement:</strong> {detail.requirement}
                                                </p>
                                                {restrictedUserAge !== null && (
                                                    <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                        {detail.note(restrictedUserAge)}
                                                    </p>
                                                )}
                                                <p className="text-gray-700 text-base leading-relaxed">
                                                    {detail.encouragement}
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowAgeRestrictionModal(false);
                                            if (restrictedCategorySlug) {
                                                navigate(`/student/dashboard/${restrictedCategorySlug}`);
                                            } else {
                                                navigate('/student/dashboard');
                                            }
                                        }}
                                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        {explorationButtonLabel}
                                    </button>
                                    <button
                                        onClick={() => setShowAgeRestrictionModal(false)}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
