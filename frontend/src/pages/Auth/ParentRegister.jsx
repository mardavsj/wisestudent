// ParentRegister.jsx - Version 2.0 (Razorpay Only - No Stripe)
// Updated: Removed all Stripe code, using Razorpay only
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Link2,
  Loader2,
  CheckCircle2,
  X,
  Shield,
  CheckCircle,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthUtils";

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

const ParentRegister = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlowLoading, setIsFlowLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState("choose");
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [childLinkCode, setChildLinkCode] = useState("");
  const [intentId, setIntentId] = useState(null);
  const [intentAmount, setIntentAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  const resetFlowState = () => {
    setSelectedFlow(null);
    setChildLinkCode("");
    setIntentId(null);
    setIntentAmount(0);
    setOrderId(null);
    setRazorpayKeyId(null);
    setPaymentError(null);
    setIsPaymentLoading(false);
    setIsFlowLoading(false);
    setIsInitializingPayment(false);
  };

  const openFlowModal = () => {
    setModalOpen(true);
    setModalView("choose");
    resetFlowState();
  };

  const closeFlowModal = () => {
    setModalOpen(false);
    resetFlowState();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter an email address");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    openFlowModal();
  };

  const initializeRazorpayPayment = async (orderId, keyId, amount) => {
    try {
      setIsInitializingPayment(true);
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        setIsInitializingPayment(false);
        throw new Error("Payment gateway not available right now.");
      }

      const options = {
        key: keyId,
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
        name: "Wise Student",
        description: "Parent Registration Payment",
        order_id: orderId,
        handler: async function (response) {
          // Payment successful
          setIsPaymentLoading(true);
          try {
            await finalizeParentRegistration(
              intentId,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              true
            );
          } catch (error) {
            console.error("Payment confirmation error:", error);
            setIsPaymentLoading(false);
            toast.error("Payment succeeded but registration failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setIsPaymentLoading(false);
            setPaymentError("Payment was cancelled");
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      
      // Handle payment failure
      razorpayInstance.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setIsPaymentLoading(false);
        setPaymentError(response.error.description || "Payment failed. Please try again.");
        toast.error(response.error.description || "Payment failed. Please try again.");
      });
      
      setIsPaymentLoading(true);
      setIsInitializingPayment(false); // Hide initialization modal when Razorpay opens
      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      setIsInitializingPayment(false);
      toast.error(error.message || "Unable to initialize payment.");
      setIsSubmitting(false);
    }
  };

  const finalizeParentRegistration = async (intent, razorpayPaymentId = null, razorpayOrderId = null, razorpaySignature = null, fromPayment = false) => {
    if (fromPayment) {
      setIsPaymentLoading(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      const response = await api.post("/api/auth/parent-registration/confirm", {
        intentId: intent,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      });

      const { token } = response.data || {};
      if (token) {
        localStorage.setItem("finmen_token", token);
      }

      await fetchUser();
      toast.success("Parent account created successfully!");
      closeFlowModal();
      navigate("/parent/dashboard");
    } catch (error) {
      console.error("Parent registration confirm error:", error);
      toast.error(error.response?.data?.message || "Failed to complete registration");
    } finally {
      if (fromPayment) {
        setIsPaymentLoading(false);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const initiateParentRegistration = async (flow, linkingCode) => {
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const response = await api.post("/api/auth/parent-registration/initiate", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        flow,
        childLinkingCode: linkingCode ? linkingCode.trim().toUpperCase() : undefined,
      });

      const data = response.data;
      setIntentId(data.intentId);
      setIntentAmount(data.amount || 0);

      if (data.requiresPayment) {
        setOrderId(data.orderId);
        setRazorpayKeyId(data.keyId);
        // Close the modal first, then open Razorpay payment directly
        setModalOpen(false);
        setIsSubmitting(false);
        // Small delay to ensure modal closes before opening Razorpay
        setTimeout(async () => {
          await initializeRazorpayPayment(data.orderId, data.keyId, data.amount);
        }, 100);
      } else {
        await finalizeParentRegistration(data.intentId, null, null, null, false);
      }
    } catch (error) {
      console.error("Parent registration initiate error:", error);
      toast.error(error.response?.data?.message || "Failed to start registration");
      setIsSubmitting(false);
    }
  };

  const handleFlowSelection = async (flow) => {
    if (isSubmitting || isFlowLoading) {
      console.log('Flow selection blocked - already processing');
      return; // Prevent multiple clicks
    }
    
    console.log('Flow selected:', flow);
    setSelectedFlow(flow);
    
    if (flow === "child_not_created") {
      setIsFlowLoading(true);
      try {
        await initiateParentRegistration("child_not_created");
      } catch (error) {
        console.error('Flow selection error:', error);
      } finally {
        setIsFlowLoading(false);
      }
    } else {
      setModalView("child-code");
    }
  };

  const handleChildCodeSubmit = async () => {
    if (!childLinkCode.trim()) {
      toast.error("Please enter your child's secret linking code");
      return;
    }
    setIsSubmitting(true);
    try {
      await initiateParentRegistration("child_existing", childLinkCode);
    } catch (error) {
      console.error("Child code submit error:", error);
      setIsSubmitting(false);
    }
  };

  // Payment is handled by Razorpay checkout, no need for separate confirm handler

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);

  const renderModalContent = () => {
    if (modalView === "child-code") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900">Link with your child</h3>
            <p className="text-sm text-gray-600 mt-2">
              Enter your child’s secret linking code. We will verify their current plan and handle the rest.
            </p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-purple-500" />
              Child's secret linking code
            </label>
            <input
              type="text"
              value={childLinkCode}
              onChange={(event) => setChildLinkCode(event.target.value.toUpperCase())}
              placeholder="e.g. ST-ABC123"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase tracking-widest"
            />
          </div>
          <div className="flex justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedFlow(null);
                setModalView("choose");
                setChildLinkCode("");
              }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              disabled={isSubmitting || isFlowLoading}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleChildCodeSubmit}
              disabled={isSubmitting || isFlowLoading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Link & Continue"
              )}
            </button>
          </div>
        </motion.div>
      );
    }

    // Payment view removed - Razorpay handles its own modal
    // No need for a separate payment view since Razorpay opens its own checkout

    return (
      <motion.div
        key="choose"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            How would you like to continue?
          </h3>
          <p className="text-sm text-gray-600 text-center mt-2">
            We’ll tailor the setup based on whether your child’s account already exists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFlowSelection("child_existing");
            }}
            className={`group rounded-2xl border-2 transition-all p-5 text-left ${
              selectedFlow === "child_existing"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
            } ${isSubmitting || isFlowLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={isSubmitting || isFlowLoading}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Link2 className="w-5 h-5" />
              </div>
              {selectedFlow === "child_existing" && (
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <h4 className="mt-4 text-lg font-semibold text-gray-900">
              My child’s account is already created
            </h4>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Link using their secret code. We’ll keep their current progress and upgrade the family plan if needed.
            </p>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFlowSelection("child_not_created");
            }}
            className={`group rounded-2xl border-2 transition-all p-5 text-left ${
              selectedFlow === "child_not_created"
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-pink-200 hover:bg-pink-50/50"
            } ${isSubmitting || isFlowLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={isSubmitting || isFlowLoading}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {selectedFlow === "child_not_created" && (
                <CheckCircle2 className="w-5 h-5 text-pink-600" />
              )}
            </div>
            <h4 className="mt-4 text-lg font-semibold text-gray-900">
              My child’s account is not yet created
            </h4>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Purchase the Student + Parent Premium Pro plan now. We’ll generate a secret linking code instantly.
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={closeFlowModal}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-60"
        >
          Cancel
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl"
          animate={{ x: [0, 20, -10, 0], y: [0, 10, -5, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl"
          animate={{ x: [0, -15, 25, 0], y: [0, -5, 15, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
        />
      </motion.div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
          >
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
            <span className="xs:hidden">Back</span>
          </button>
        </div>

        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div className="text-center mb-5 sm:mb-6">
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mb-2 sm:mb-3"
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                Parent Registration
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Create your parent account and unlock the premium family dashboard.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    required
                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-300 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isFlowLoading}
                className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 text-xs sm:text-sm disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <>
                      Create Parent Account
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <motion.div
              className="text-center mt-6 pt-5 border-t border-white/10"
            >
              <p className="text-gray-300 text-xs sm:text-sm">
                Already have a parent account?{' '}
                <motion.button
                  onClick={() => navigate("/login")}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign in
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
                    layoutId="underline"
                  />
                </motion.button>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <button
                type="button"
                onClick={closeFlowModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              {renderModalContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Loading Overlay - Shows when payment is being initialized - Covers entire page */}
      <AnimatePresence>
        {isInitializingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-50"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full -mr-32 -mt-32 opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-200 rounded-full -ml-24 -mb-24 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              <div className="relative z-10 text-center">
                {/* Animated Spinner */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-pink-200 rounded-full"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-t-pink-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                
                {/* Loading Text */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Initializing Payment</h3>
                <p className="text-gray-600 mb-6">Please wait while we prepare your secure checkout...</p>
                
                {/* Progress Steps */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">Validating registration details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <span className="text-sm text-gray-700">Connecting to payment gateway</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">Opening secure checkout</span>
                  </div>
                </div>
                
                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentRegister;
