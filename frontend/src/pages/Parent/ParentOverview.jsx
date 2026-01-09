import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Heart,
  Trophy,
  AlertTriangle,
  ArrowRight,
  Activity,
  Coins,
  Zap,
  Star,
  Flame,
  BookOpen,
  Brain,
  Target,
  MessageSquare,
  Plus,
  Eye,
  BarChart3,
  Settings,
  CheckCircle,
  X,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ParentOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [parentProfile, setParentProfile] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [modalView, setModalView] = useState("link"); // "link" or "create"
  const [childLinkingCode, setChildLinkingCode] = useState("");
  const [addingChild, setAddingChild] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  
  // Create child form state
  const [childFormData, setChildFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [creatingChild, setCreatingChild] = useState(false);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddChildModal) {
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
  }, [showAddChildModal]);

  const formatRelativeTime = (date) => {
    if (!date) return "just now";
    const value = new Date(date).getTime();
    if (Number.isNaN(value)) {
      return "just now";
    }
    const diff = Date.now() - value;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  };

  const fetchRecentActivities = async (childrenData) => {
    try {
      if (!childrenData || childrenData.length === 0) {
        setRecentActivities([]);
        return;
      }

      const activities = [];
      const childIds = childrenData.map(child => child._id);
      const childMap = new Map(childrenData.map(child => [child._id.toString(), child.name]));

      // Fetch activities from all children in parallel
      const activityPromises = childIds.map(async (childId) => {
        try {
          const [analyticsRes, transactionsRes] = await Promise.all([
            api.get(`/api/parent/child/${childId}/analytics?startDate=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`).catch(() => ({ data: { activityTimeline: [] } })),
            api.get(`/api/parent/child/${childId}/transactions?limit=10&page=1`).catch(() => ({ data: { transactions: [] } }))
          ]);

          const activityTimeline = analyticsRes.data?.activityTimeline || [];
          const transactions = transactionsRes.data?.transactions || [];
          const childName = childMap.get(childId.toString()) || "Child";

          // Process activity timeline
          activityTimeline.forEach((log) => {
            let icon = "🎯";
            let action = "";

            const activityType = log.type || log.activityType || "";
            const activityTitle = log.title || log.action || "";
            const activityDescription = log.description || "";
            const activityDetails = log.details || {};

            // Extract actual activity name from various possible fields
            const actualActivityName = 
              activityTitle || 
              activityDescription || 
              activityDetails?.gameName || 
              activityDetails?.activityName || 
              activityDetails?.name ||
              activityDetails?.title ||
              "";

            if (activityType.includes("game") || activityType.includes("mission") || activityTitle.toLowerCase().includes("mission")) {
              icon = "🎯";
              if (actualActivityName) {
                action = `${childName} completed ${actualActivityName}`;
              } else {
                action = `${childName} completed a mission`;
              }
            } else if (activityType.includes("lesson") || activityType.includes("learning")) {
              icon = "📚";
              if (actualActivityName) {
                action = `${childName} completed ${actualActivityName}`;
              } else {
                action = `${childName} completed a lesson`;
              }
            } else if (activityType.includes("achievement") || activityType.includes("badge")) {
              icon = "🏆";
              if (actualActivityName) {
                action = `${childName} achieved ${actualActivityName}`;
              } else {
                action = `${childName} achieved a new badge`;
              }
            } else if (activityType.includes("quiz")) {
              icon = "✅";
              if (actualActivityName) {
                action = `${childName} completed ${actualActivityName}`;
              } else {
                action = `${childName} completed a quiz`;
              }
            } else {
              icon = "📝";
              if (actualActivityName) {
                action = `${childName} ${actualActivityName}`;
              } else if (activityType) {
                // Use activity type if no name available
                action = `${childName} ${activityType.replace(/_/g, " ")}`;
              } else {
                action = `${childName} completed an activity`;
              }
            }

            activities.push({
              action,
              time: formatRelativeTime(log.timestamp || log.createdAt),
              icon,
              child: childName,
              timestamp: new Date(log.timestamp || log.createdAt).getTime(),
            });
          });

          // Process transactions (HealCoins earned)
          transactions.forEach((transaction) => {
            if (transaction.type === "credit" && transaction.amount > 0) {
              activities.push({
                action: `${childName} earned ${transaction.amount} HealCoins`,
                time: formatRelativeTime(transaction.createdAt),
                icon: "🪙",
                child: childName,
                timestamp: new Date(transaction.createdAt).getTime(),
              });
            }
          });
        } catch (error) {
          console.error(`Error fetching activities for child ${childId}:`, error);
        }
      });

      await Promise.all(activityPromises);

      // Sort by timestamp (most recent first) and limit to 3
      const sortedActivities = activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 3);

      setRecentActivities(sortedActivities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      setRecentActivities([]);
    }
  };

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [childrenRes, profileRes] = await Promise.all([
        api.get("/api/parent/children"),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      
      setChildren(childrenRes.data.children || []);
      setParentProfile(profileRes.data);

      // Calculate aggregate stats
      const childrenData = childrenRes.data.children || [];
      const totalChildren = childrenData.length;
      const totalXP = childrenData.reduce((sum, child) => sum + (child.xp || 0), 0);
      const totalCoins = childrenData.reduce((sum, child) => sum + (child.healCoins || 0), 0);
      const avgProgress = childrenData.length > 0 
        ? Math.round(childrenData.reduce((sum, child) => sum + (child.overallMastery || 0), 0) / childrenData.length)
        : 0;

      setStats({
        totalChildren,
        totalXP,
        totalCoins,
        avgProgress
      });

      // Fetch recent activities from all children
      await fetchRecentActivities(childrenData);
    } catch (error) {
      console.error("Error fetching overview data:", error);
      toast.error("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => resolve(null);
      document.body.appendChild(script);
    });
  };

  const initializeRazorpayPayment = async (orderId, keyId, amount, childId) => {
    try {
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error("Payment gateway not available right now.");
      }

      const options = {
        key: keyId,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Wise Student",
        description: "Link Child Account - Premium Plan",
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify and confirm payment
            const confirmResponse = await api.post("/api/parent/link-child/confirm-payment", {
              childId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (confirmResponse.data.success) {
              toast.success(confirmResponse.data.message || "Child linked successfully!");
              setShowAddChildModal(false);
              setChildLinkingCode("");
              setPaymentData(null);
              fetchOverviewData();
            } else {
              toast.error(confirmResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment confirmation error:", error);
            toast.error(error.response?.data?.message || "Failed to confirm payment");
          } finally {
            setAddingChild(false);
          }
        },
        prefill: {
          name: parentProfile?.name || "",
          email: parentProfile?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setAddingChild(false);
            setPaymentData(null);
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed:", response);
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
        setAddingChild(false);
        setPaymentData(null);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment gateway");
      setAddingChild(false);
      setPaymentData(null);
    }
  };

  const handleAddChild = async () => {
    if (!childLinkingCode.trim()) {
      toast.error("Please enter child's secret linking code");
      return;
    }

    try {
      setAddingChild(true);
      const response = await api.post("/api/parent/link-child", {
        childLinkingCode: childLinkingCode.trim().toUpperCase(),
      });

      // Check if payment is required
      if (response.data?.requiresPayment) {
        setPaymentData({
          orderId: response.data.orderId,
          keyId: response.data.keyId,
          amount: response.data.amount,
          childId: response.data.childId,
          childName: response.data.childName,
          childPlanType: response.data.childPlanType,
        });
        
        // Initialize Razorpay payment
        await initializeRazorpayPayment(
          response.data.orderId,
          response.data.keyId,
          response.data.amount,
          response.data.childId
        );
        return;
      }

      // No payment required - child linked directly
      if (response.data?.success) {
        toast.success(response.data.message || "Child linked successfully!");
        setShowAddChildModal(false);
        setChildLinkingCode("");
        fetchOverviewData();
      }
    } catch (error) {
      console.error("Error linking child:", error);
      toast.error(error.response?.data?.message || "Failed to link child");
    } finally {
      setAddingChild(false);
    }
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    
    if (childFormData.password !== childFormData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (childFormData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setCreatingChild(true);
      const response = await api.post("/api/parent/create-child", {
        fullName: childFormData.fullName.trim(),
        email: childFormData.email.trim(),
        password: childFormData.password,
        dateOfBirth: childFormData.dateOfBirth,
        gender: childFormData.gender,
      });

      // Check if payment is required
      if (response.data?.requiresPayment) {
        // Initialize Razorpay payment
        await initializeRazorpayPaymentForChildCreation(
          response.data.orderId,
          response.data.keyId,
          response.data.amount,
          response.data.childCreationIntentId
        );
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message || "Child account created successfully!");
        setShowAddChildModal(false);
        setModalView("link");
        setChildFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          gender: "",
        });
        fetchOverviewData();
      }
    } catch (error) {
      console.error("Error creating child:", error);
      toast.error(error.response?.data?.message || "Failed to create child account");
    } finally {
      setCreatingChild(false);
    }
  };

  const initializeRazorpayPaymentForChildCreation = async (orderId, keyId, amount, childCreationIntentId) => {
    try {
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error("Payment gateway not available right now.");
      }

      const options = {
        key: keyId,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Wise Student",
        description: "Create Child Account - Student + Parent Premium Pro Plan",
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify and confirm payment
            const confirmResponse = await api.post("/api/parent/create-child/confirm-payment", {
              childCreationIntentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (confirmResponse.data.success) {
              toast.success(confirmResponse.data.message || "Child account created successfully!");
              setShowAddChildModal(false);
              setModalView("link");
              setChildFormData({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                dateOfBirth: "",
                gender: "",
              });
              fetchOverviewData();
            } else {
              toast.error(confirmResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment confirmation error:", error);
            toast.error(error.response?.data?.message || "Failed to confirm payment");
          } finally {
            setCreatingChild(false);
          }
        },
        prefill: {
          name: parentProfile?.name || "",
          email: parentProfile?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setCreatingChild(false);
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed:", response);
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
        setCreatingChild(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment gateway");
      setCreatingChild(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg bg-indigo-50`}>
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-xl p-8 shadow-sm border border-slate-200 max-w-md"
        >
          <Users className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            No Children Linked Yet
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            Start by linking your child's account to monitor their progress
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddChildModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Link Child Account
          </motion.button>
        </motion.div>

        {/* Add Child Modal */}
        {showAddChildModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  {modalView === "link" ? "Link Child Account" : "Create Child Account"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddChildModal(false);
                    setModalView("link");
                    setChildLinkingCode("");
                    setPaymentData(null);
                    setChildFormData({
                      fullName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      dateOfBirth: "",
                      gender: "",
                    });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {modalView === "link" ? (
                <>
                  <p className="text-sm text-slate-600 mb-4">
                    Enter your child's secret linking code to link their account
                  </p>
                  {paymentData ? (
                    <div className="mb-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                        <p className="text-sm text-amber-800 font-medium mb-1">
                          Payment Required
                        </p>
                        <p className="text-xs text-amber-700">
                          {paymentData.childPlanType === 'free' 
                            ? `To link ${paymentData.childName}, you need to upgrade to Student + Parent Premium Pro Plan (₹${paymentData.amount}).`
                            : `To link ${paymentData.childName}, you need to pay ₹${paymentData.amount} for parent dashboard access.`}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 text-center">
                        Razorpay payment window will open shortly...
                      </p>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="e.g. ST-ABC123 or SST-XYZ789"
                        value={childLinkingCode}
                        onChange={(e) => setChildLinkingCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === "Enter" && !addingChild && handleAddChild()}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none mb-4 uppercase tracking-wider text-sm"
                        disabled={addingChild}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowAddChildModal(false);
                            setChildLinkingCode("");
                            setPaymentData(null);
                          }}
                          disabled={addingChild}
                          className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddChild}
                          disabled={addingChild || !childLinkingCode.trim()}
                          className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {addingChild ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {paymentData ? "Processing Payment..." : "Linking..."}
                            </>
                          ) : (
                            "Link Child"
                          )}
                        </button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-xs text-center text-slate-600 mb-2">
                          Doesn't have an account?
                        </p>
                        <button
                          onClick={() => setModalView("create")}
                          disabled={addingChild}
                          className="w-full px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50"
                        >
                          Create Child Account
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-600 mb-5">
                    Create a new account for your child
                  </p>
                  <form onSubmit={handleCreateChild} className="space-y-3">
                    {/* Full Name and Date of Birth - Side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={childFormData.fullName}
                          onChange={(e) => setChildFormData({ ...childFormData, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                          placeholder="Enter child's full name"
                          disabled={creatingChild}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          required
                          value={childFormData.dateOfBirth}
                          onChange={(e) => setChildFormData({ ...childFormData, dateOfBirth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                          max={new Date().toISOString().split('T')[0]}
                          disabled={creatingChild}
                        />
                      </div>
                    </div>

                    {/* Email and Gender - Side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={childFormData.email}
                          onChange={(e) => setChildFormData({ ...childFormData, email: e.target.value.toLowerCase() })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                          placeholder="Enter child's email"
                          disabled={creatingChild}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Gender *
                        </label>
                        <select
                          required
                          value={childFormData.gender}
                          onChange={(e) => setChildFormData({ ...childFormData, gender: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm bg-white"
                          disabled={creatingChild}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non_binary">Non-binary</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Password and Confirm Password - Side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={childFormData.password}
                            onChange={(e) => setChildFormData({ ...childFormData, password: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none pr-10 text-sm"
                            placeholder="Min 6 characters"
                            minLength={6}
                            disabled={creatingChild}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs"
                            disabled={creatingChild}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={childFormData.confirmPassword}
                            onChange={(e) => setChildFormData({ ...childFormData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none pr-10 text-sm"
                            placeholder="Confirm password"
                            disabled={creatingChild}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs"
                            disabled={creatingChild}
                          >
                            {showConfirmPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {childFormData.password && childFormData.confirmPassword && childFormData.password !== childFormData.confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setModalView("link");
                          setChildFormData({
                            fullName: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                            dateOfBirth: "",
                            gender: "",
                          });
                        }}
                        disabled={creatingChild}
                        className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={creatingChild || childFormData.password !== childFormData.confirmPassword || !childFormData.fullName || !childFormData.email || !childFormData.dateOfBirth || !childFormData.gender || childFormData.password.length < 6}
                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {creatingChild ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome back, {parentProfile?.name?.split(" ")[0] || "Parent"}!
                </h1>
                <p className="text-sm text-white/80">
                  Here's what's happening with your children today
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-white/80">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <p className="text-sm font-semibold">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddChildModal(true)}
                  className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg font-medium hover:bg-white/30 transition flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Link Child
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Children"
            value={stats.totalChildren || 0}
            icon={Users}
            trend="+1"
          />
          <StatCard
            title="Total XP Earned"
            value={stats.totalXP || 0}
            icon={Zap}
            trend="+12%"
          />
          <StatCard
            title="Total HealCoins"
            value={stats.totalCoins || 0}
            icon={Coins}
            trend="+8%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - My Children */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Children */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  My Children
                </h2>
                <button
                  onClick={() => navigate("/parent/children")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 text-sm"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child, idx) => {
                // Only log in development (never expose user data in production)
                if (import.meta.env.DEV) {
                  console.log('Child data:', { id: child._id, name: child.name });
                }
                return (
                <motion.div
                  key={child._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={child.avatar || "/avatars/avatar1.png"}
                        alt={child.name}
                        className="w-12 h-12 rounded-lg border-2 border-slate-200"
                      />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900">
                          {child.name}
                        </h3>
                        <p className="text-xs text-slate-600">{child.grade || "Student"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-blue-50 rounded-md p-2 text-center">
                        <p className="text-base font-bold text-blue-700">
                          {child.level || 1}
                        </p>
                        <p className="text-xs text-blue-600">Level</p>
                      </div>
                      <div className="bg-amber-50 rounded-md p-2 text-center">
                        <p className="text-base font-bold text-amber-700">
                          {child.xp || 0}
                        </p>
                        <p className="text-xs text-amber-600">XP</p>
                      </div>
                      <div className="bg-emerald-50 rounded-md p-2 text-center">
                        <p className="text-base font-bold text-emerald-700">
                          {child.healCoins || 0}
                        </p>
                        <p className="text-xs text-emerald-600">Coins</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parent/child/${child._id}/analytics`);
                        }}
                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Progress
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parent/child/${child._id}/chat`);
                        }}
                        className="flex-1 px-3 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition text-sm flex items-center justify-center gap-1.5"
                        title="Chat with teacher"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chat with Teacher</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
            >
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-indigo-600" />
                Recent Activity
              </h2>
              <div className="space-y-2">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, idx) => (
                    <motion.div
                      key={`${activity.child}-${activity.timestamp}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">{activity.action}</p>
                        <p className="text-xs text-slate-600">
                          {activity.child} • {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600">No recent activity</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Activities from your children will appear here
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
            >
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/parent/children")}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-medium text-slate-900 text-sm">
                    Manage Children
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/parent/settings")}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-medium text-slate-900 text-sm">
                    Settings
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
            >
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Quick Insights
              </h2>
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">
                        Active Children Today
                      </span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-bold text-emerald-600">
                    {children.filter((c) => c.lastActive).length}/{children.length}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">
                      Total XP
                    </span>
                    <Zap className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-xl font-bold text-indigo-600">
                    {stats.totalXP || 0}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Child Modal - Always available */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {modalView === "link" ? "Link Child Account" : "Create Child Account"}
              </h3>
              <button
                onClick={() => {
                  setShowAddChildModal(false);
                  setModalView("link");
                  setChildLinkingCode("");
                  setPaymentData(null);
                  setChildFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    dateOfBirth: "",
                    gender: "",
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {modalView === "link" ? (
              <>
                <p className="text-sm text-slate-600 mb-4">
                  Enter your child's secret linking code to link their account
                </p>
                {paymentData ? (
                  <div className="mb-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                      <p className="text-sm text-amber-800 font-medium mb-1">
                        Payment Required
                      </p>
                      <p className="text-xs text-amber-700">
                        {paymentData.childPlanType === 'free' 
                          ? `To link ${paymentData.childName}, you need to upgrade to Student + Parent Premium Pro Plan (₹${paymentData.amount}).`
                          : `To link ${paymentData.childName}, you need to pay ₹${paymentData.amount} for parent dashboard access.`}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 text-center">
                      Razorpay payment window will open shortly...
                    </p>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="e.g. ST-ABC123 or SST-XYZ789"
                      value={childLinkingCode}
                      onChange={(e) => setChildLinkingCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === "Enter" && !addingChild && handleAddChild()}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none mb-4 uppercase tracking-wider text-sm"
                      disabled={addingChild}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowAddChildModal(false);
                          setChildLinkingCode("");
                          setPaymentData(null);
                        }}
                        disabled={addingChild}
                        className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddChild}
                        disabled={addingChild || !childLinkingCode.trim()}
                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {addingChild ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {paymentData ? "Processing Payment..." : "Linking..."}
                          </>
                        ) : (
                          "Link Child"
                        )}
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-center text-slate-600 mb-2">
                        Doesn't have an account?
                      </p>
                      <button
                        onClick={() => setModalView("create")}
                        disabled={addingChild}
                        className="w-full px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50"
                      >
                        Create Child Account
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-5">
                  Create a new account for your child
                </p>
                <form onSubmit={handleCreateChild} className="space-y-3">
                  {/* Full Name and Date of Birth - Side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={childFormData.fullName}
                        onChange={(e) => setChildFormData({ ...childFormData, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                        placeholder="Enter child's full name"
                        disabled={creatingChild}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={childFormData.dateOfBirth}
                        onChange={(e) => setChildFormData({ ...childFormData, dateOfBirth: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                        max={new Date().toISOString().split('T')[0]}
                        disabled={creatingChild}
                      />
                    </div>
                  </div>

                  {/* Email and Gender - Side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={childFormData.email}
                        onChange={(e) => setChildFormData({ ...childFormData, email: e.target.value.toLowerCase() })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                        placeholder="Enter child's email"
                        disabled={creatingChild}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Gender *
                      </label>
                      <select
                        required
                        value={childFormData.gender}
                        onChange={(e) => setChildFormData({ ...childFormData, gender: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm bg-white"
                        disabled={creatingChild}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non_binary">Non-binary</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Password and Confirm Password - Side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={childFormData.password}
                          onChange={(e) => setChildFormData({ ...childFormData, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none pr-10 text-sm"
                          placeholder="Min 6 characters"
                          minLength={6}
                          disabled={creatingChild}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs"
                          disabled={creatingChild}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={childFormData.confirmPassword}
                          onChange={(e) => setChildFormData({ ...childFormData, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none pr-10 text-sm"
                          placeholder="Confirm password"
                          disabled={creatingChild}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs"
                          disabled={creatingChild}
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {childFormData.password && childFormData.confirmPassword && childFormData.password !== childFormData.confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setModalView("link");
                        setChildFormData({
                          fullName: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          dateOfBirth: "",
                          gender: "",
                        });
                      }}
                      disabled={creatingChild}
                      className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={creatingChild || childFormData.password !== childFormData.confirmPassword || !childFormData.fullName || !childFormData.email || !childFormData.dateOfBirth || !childFormData.gender || childFormData.password.length < 6}
                      className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {creatingChild ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentOverview;

