import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
  MessageSquare,
  Filter,
  Grid,
  List,
  TrendingUp,
  Zap,
  Coins,
  Heart,
  Brain,
  Star,
  Activity,
  BookOpen,
  Trophy,
  AlertTriangle,
  X,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

const ParentChildren = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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
    fetchChildren();
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

  // Listen for real-time child creation updates
  useEffect(() => {
    if (!socket) return;

    const handleChildCreated = (data) => {
      console.log('Child created event received:', data);
      fetchChildren();
      toast.success(`Child ${data.childName} has been added!`);
    };

    socket.on('child_created', handleChildCreated);

    return () => {
      socket.off('child_created', handleChildCreated);
    };
  }, [socket]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const [childrenRes, profileRes] = await Promise.all([
        api.get("/api/parent/children"),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      setChildren(childrenRes.data.children || []);
      setParentProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
    }
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
              fetchChildren();
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
        fetchChildren();
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
        fetchChildren();
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
              fetchChildren();
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

  const handleRemoveChild = async (childId, childName) => {
    if (!window.confirm(`Are you sure you want to unlink ${childName}?`)) {
      return;
    }

    try {
      const response = await api.delete(`/api/parent/child/${childId}/unlink`);
      toast.success(response.data?.message || "Child unlinked successfully");
      fetchChildren();
    } catch (error) {
      console.error("Error unlinking child:", error);
      const errorMessage = error.response?.data?.message || "Failed to unlink child";
      toast.error(errorMessage);
    }
  };

  const filteredChildren = children.filter((child) =>
    child.name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  {parentProfile?.name || "Parent"}'s Children
                </h1>
                <p className="text-sm text-white/80">
                  Manage and monitor all your children's accounts
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Search and Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search children by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Child Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddChildModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Link Child
            </motion.button>
          </div>
        </motion.div>

        {/* Children Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChildren.map((child, idx) => (
              <motion.div
                key={child._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={child.avatar || "/avatars/avatar1.png"}
                    alt={child.name}
                    className="w-14 h-14 rounded-lg border-2 border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 truncate">
                      {child.name}
                    </h3>
                    <p className="text-xs text-slate-600">{child.grade || "Student"}</p>
                    <p className="text-xs text-slate-500 truncate">{child.email}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-50 rounded-md p-2 text-center">
                    <Zap className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-base font-bold text-blue-700">
                      {child.level || 1}
                    </p>
                    <p className="text-xs text-blue-600">Level</p>
                  </div>
                  <div className="bg-amber-50 rounded-md p-2 text-center">
                    <Star className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <p className="text-base font-bold text-amber-700">
                      {child.xp || 0}
                    </p>
                    <p className="text-xs text-amber-600">XP</p>
                  </div>
                  <div className="bg-emerald-50 rounded-md p-2 text-center">
                    <Coins className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-base font-bold text-emerald-700">
                      {child.healCoins || 0}
                    </p>
                    <p className="text-xs text-emerald-600">Coins</p>
                  </div>
                  <div className="bg-indigo-50 rounded-md p-2 text-center">
                    <Trophy className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                    <p className="text-base font-bold text-indigo-700">
                      {child.streak || 0}
                    </p>
                    <p className="text-xs text-indigo-600">Streak</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                      className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Progress
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/parent/child/${child._id}/chat`)}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition text-sm flex items-center justify-center gap-1.5"
                      title="Chat with teacher"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat with Teacher
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRemoveChild(child._id, child.name)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition border border-red-200 self-start"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Child</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">Level</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">XP</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">Coins</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">Streak</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredChildren.map((child, idx) => (
                  <motion.tr
                    key={child._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={child.avatar || "/avatars/avatar1.png"}
                          alt={child.name}
                          className="w-10 h-10 rounded-lg border border-slate-200"
                        />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{child.name}</p>
                          <p className="text-xs text-slate-500">{child.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-blue-600 text-sm">
                        {child.level || 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-amber-600 text-sm">
                        {child.xp || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-emerald-600 text-sm">
                        {child.healCoins || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-indigo-600 text-sm">
                        {child.streak || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-xs flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveChild(child._id, child.name)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredChildren.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-600">No children found</p>
            <p className="text-sm text-slate-500 mt-1">
              {searchTerm
                ? "Try adjusting your search"
                : "Link your first child to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto"
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
                disabled={addingChild || creatingChild}
                className="p-2 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
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

export default ParentChildren;
