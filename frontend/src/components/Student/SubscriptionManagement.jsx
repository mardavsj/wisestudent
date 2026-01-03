import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Crown, ArrowRight, Zap, CheckCircle, Calendar, TrendingUp, ArrowUp, ArrowDown, RefreshCw, Lock, Unlock, Sparkles, Loader2, Shield
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthUtils';

// Load Razorpay
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
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

// Plan configurations - moved outside component to prevent recreation on every render
const PLANS = {
    free: {
      name: 'Free Plan',
      price: 0,
      features: ['5 Games per Pillar', 'Basic Dashboard', 'HealCoins Rewards'],
      color: 'from-green-500 to-emerald-500',
      icon: '🎁',
    },
    student_premium: {
      name: 'Students Premium Plan',
      price: 4499,
      features: [
        'Full Access to All 10 Pillars',
        '2200+ Gaming Micro Lessons',
        'Advanced Analytics',
        'Certificates, Badges & Achievements',
        'WiseClub Community Access (Coming Soon)',
        'Presentation Tool',
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: '⭐',
    },
    student_parent_premium_pro: {
      name: 'Student + Parent Premium Pro Plan',
      price: 4999,
      features: [
        'Everything in Students Premium',
        'Parent Dashboard',
        'Family Progress Tracking',
        'Parent Mental Health Care',
        'Parent-Child Learning Challenges',
      ],
      color: 'from-purple-500 to-pink-500',
      icon: '👨‍👩‍👧‍👦',
    },
    educational_institutions_premium: {
      name: 'Educational Institutions Premium Plan',
      price: 0,
      features: [
        'Unlimited Academics Access',
        'Advanced Teacher & Admin Dashboards',
        'Comprehensive Analytics & Insights',
        'Certificates, Badges & Achievements',
        'WiseClub & Inavora Access',
        'Institution-wide Seat Management',
      ],
      color: 'from-emerald-500 to-green-600',
      icon: '🏫',
      isSchoolPlan: true,
    },
  };

const SubscriptionManagement = ({ onUpgradingChange, onPlanChange }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [currentUpgradingPlan, setCurrentUpgradingPlan] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const { user } = useAuth();
  const availableUpgradesRef = useRef(null);

  // Notify parent when upgrading state changes
  useEffect(() => {
    if (onUpgradingChange) {
      onUpgradingChange(upgrading);
    }
    if (onPlanChange && currentUpgradingPlan) {
      onPlanChange(currentUpgradingPlan);
    }
  }, [upgrading, currentUpgradingPlan, onUpgradingChange, onPlanChange]);

  // Memoize plans to prevent recreation
  const plans = useMemo(() => PLANS, []);

  // Define functions first before using them in useEffect
  const fetchSubscription = useCallback(async () => {
    try {
      const response = await api.get('/api/subscription/current');
      if (response.data.success) {
        setSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Set default free plan if error - use static features array
      setSubscription({
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: ['5 Games per Pillar', 'Basic Dashboard', 'HealCoins Rewards'],
      });
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - only fetch once on mount

  // Initial data fetch - only run once on mount
  useEffect(() => {
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Store fetchSubscription in a ref to avoid stale closures
  const fetchSubscriptionRef = useRef(fetchSubscription);
  useEffect(() => {
    fetchSubscriptionRef.current = fetchSubscription;
  }, [fetchSubscription]);

  // Listen for real-time subscription updates
  useEffect(() => {
    if (!socket?.socket) return;

    const handleSubscriptionActivated = (data) => {
      // Check if this update is for the current user
      if (data && data.subscription) {
        toast.success('Subscription updated!', { icon: '🎉' });
        fetchSubscriptionRef.current();
      }
    };

    const handleSubscriptionCancelled = (data) => {
      // Check if this update is for the current user
      if (data && data.subscription) {
        toast.info('Subscription cancelled');
        fetchSubscriptionRef.current();
      }
    };

    socket.socket.on('subscription:activated', handleSubscriptionActivated);
    socket.socket.on('subscription:cancelled', handleSubscriptionCancelled);

    return () => {
      socket.socket.off('subscription:activated', handleSubscriptionActivated);
      socket.socket.off('subscription:cancelled', handleSubscriptionCancelled);
    };
  }, [socket?.socket]); // Only depend on socket

  const handleUpgrade = async (planType) => {
    const plan = plans[planType];
    if (!plan) {
      toast.error('Invalid plan selected');
      return;
    }

    // Check if user already has this plan
    if (subscription?.planType === planType && subscription?.status === 'active') {
      toast.error('You already have this plan active');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("finmen_token");
    if (!token) {
      toast.error('Please login to upgrade your plan');
      navigate('/login');
      return;
    }

    // Use the plan price (same for all purchases)
    const amount = plan.price || 0;

    // Set the upgrading plan info for the parent component
    setCurrentUpgradingPlan({
      planType,
      planName: plan.name,
      amount,
    });

    // For free plan, activate immediately
    if (planType === 'free' || amount === 0) {
      try {
        setUpgrading(true);
        const response = await api.post('/api/subscription/create-payment', {
          planType: 'free',
        });
        if (response.data.success) {
          toast.success('Free plan activated successfully! 🎉');
          if (socket?.socket) {
            socket.socket.emit('subscription:activated', {
              subscription: response.data.subscription,
            });
          }
          fetchSubscription();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to activate free plan');
      } finally {
        setUpgrading(false);
      }
      return;
    }

    // For paid plans, initialize Razorpay payment
    try {
      setUpgrading(true);
      
      // Set the upgrading plan info for the parent component
      setCurrentUpgradingPlan({
        planType,
        planName: plan.name,
        amount,
        isFirstYear,
      });
      
      // Determine context based on user role and plan type
      const context = (user?.role === 'parent' || planType === 'student_parent_premium_pro') ? 'parent' : 'student';
      
      // Create payment intent
      const response = await api.post('/api/subscription/create-payment', {
        planType,
        context,
        mode: 'purchase',
      });

      if (response.data.success) {
        const { orderId, keyId, subscriptionId } = response.data;

        // Load Razorpay
        const Razorpay = await loadRazorpay();
        if (!Razorpay) {
          throw new Error('Payment gateway not available right now.');
        }

        // Initialize Razorpay payment
        const options = {
          key: keyId,
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          name: 'Wise Student',
          description: `Subscription: ${plan.name}`,
          order_id: orderId,
          handler: async function (paymentResponse) {
            try {
              setUpgrading(true);
              // Verify payment
              const verifyResponse = await api.post('/api/subscription/verify-payment', {
                subscriptionId,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              });

              if (verifyResponse.data.success) {
                toast.success('Payment successful! Your subscription has been activated. 🎉');
                
                // Emit real-time update via socket
                if (socket?.socket) {
                  socket.socket.emit('subscription:activated', {
                    subscription: verifyResponse.data.subscription,
                  });
                }
                
                // Refresh subscription data
                fetchSubscription();
              } else {
                throw new Error(verifyResponse.data.message || 'Failed to activate subscription');
              }
            } catch (verifyError) {
              console.error('Subscription activation error:', verifyError);
              toast.error(verifyError.response?.data?.message || 'Payment succeeded but subscription activation failed. Please contact support.');
            } finally {
              setUpgrading(false);
              setCurrentUpgradingPlan(null);
            }
          },
          prefill: {
            name: user?.name || user?.fullName || '',
            email: user?.email || '',
          },
          theme: {
            color: '#6366f1',
          },
          modal: {
            ondismiss: function () {
              setUpgrading(false);
              setCurrentUpgradingPlan(null);
              toast.info('Payment was cancelled');
            },
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to continue');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to initialize payment';
        // Check if it's a payment gateway configuration error
        if (errorMessage.toLowerCase().includes('payment gateway not configured')) {
          toast.error('Payment gateway is not configured. Please contact support or try again later.', {
            duration: 5000,
          });
        } else {
          toast.error(errorMessage);
        }
      }
    } finally {
      setUpgrading(false);
      setCurrentUpgradingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      setUpgrading(true);
      const response = await api.post('/api/subscription/cancel');
      if (response.data.success) {
        toast.success('Subscription cancelled successfully');
        fetchSubscription();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanInfo = (planType) => {
    return plans[planType] || plans.free;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelled':
      case 'pending': // Show pending as cancelled
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const currentPlan = subscription ? getPlanInfo(subscription.planType) : plans.free;
  const currentPlanType = subscription?.planType || 'free';
  const daysRemaining = subscription?.endDate
    ? Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for Header */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl animate-pulse"></div>
              <div>
                <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Skeleton for Current Subscription Card */}
          <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-6 w-40 bg-white/30 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-5 w-24 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-8 w-32 bg-white/30 rounded-lg animate-pulse mb-2"></div>
                  <div className="h-4 w-20 bg-white/20 rounded-lg animate-pulse ml-auto"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="h-4 w-48 bg-white/20 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton for Plan Comparison Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-purple-200 rounded animate-pulse"></div>
            <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-3 text-purple-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading subscription plans...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${currentPlan.color} rounded-xl shadow-lg`}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
              <p className="text-sm text-gray-600">Manage your plan and payment methods</p>
            </div>
          </div>
          <button
            onClick={() => {
              fetchSubscription();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Current Subscription Card */}
        <div className={`bg-gradient-to-br ${currentPlan.color} rounded-2xl p-6 mb-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentPlan.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{subscription?.planName || currentPlan.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border-2 mt-2 ${getStatusColor(subscription?.status || 'active').replace('bg-', 'bg-white/20 ').replace('text-', 'text-white ').replace('border-', 'border-white/30 ')}`}>
                    {subscription?.status?.toLowerCase() === 'pending' ? 'CANCELLED' : (subscription?.status?.toUpperCase() || 'ACTIVE')}
                  </span>
                </div>
              </div>
              {subscription?.planType !== 'free' && (
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    ₹{(currentPlan.price || 0).toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">
                    /year
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {(() => {
                // Get features from subscription or use plan defaults
                let features = [];
                if (subscription?.features && typeof subscription.features === 'object') {
                  // Convert feature object to array
                  const featureNames = {
                    fullAccess: 'Full Access to All Pillars',
                    parentDashboard: 'Parent Dashboard',
                    advancedAnalytics: 'Advanced Analytics',
                    certificates: 'Certificates, Badges & Achievements',
                    wiseClubAccess: 'WiseClub Community Access (Coming Soon)',
                    inavoraAccess: 'Presentation Tool',
                  };
                  features = Object.entries(subscription.features)
                    .filter(([, value]) => value === true)
                    .map(([featureKey]) => featureNames[featureKey] || featureKey);
                }
                if (features.length === 0) {
                  features = currentPlan.features || [];
                }
                return features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ));
              })()}
            </div>

            {/* Subscription Details */}
            {subscription && subscription.planType !== 'free' && (
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {subscription.endDate
                      ? `Expires: ${new Date(subscription.endDate).toLocaleDateString()}`
                      : 'Active'}
                  </span>
                </div>
                {daysRemaining !== null && daysRemaining > 0 && (
                  <div className="text-sm font-semibold">
                    {daysRemaining} days remaining
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {subscription?.planType !== 'free' && subscription?.status === 'active' && (
                <button
                  onClick={handleCancel}
                  disabled={upgrading}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel Subscription
                </button>
              )}
              {subscription?.planType === 'free' && (
                <button
                  onClick={() => {
                    // Scroll to available upgrades section
                    availableUpgradesRef.current?.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }}
                  className="flex-1 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Plan Comparison Table */}
        <div className="mb-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Compare Plans
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <th className="p-4 text-left font-bold text-gray-900 border-b-2 border-purple-200">Features</th>
                  <th className={`p-4 text-center font-bold text-gray-900 border-b-2 transition-all ${
                    currentPlanType === 'free' 
                      ? 'bg-gradient-to-b from-emerald-100 to-green-100 border-emerald-400 border-b-4 shadow-lg relative' 
                      : 'border-purple-200'
                  }`}>
                    <div className="flex flex-col items-center">
                      <span className="text-lg">Free Plan</span>
                      <span className="text-sm font-normal text-gray-600">₹0/year</span>
                      {currentPlanType === 'free' && (
                        <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full mt-2 font-semibold shadow-md">
                          ✓ Current Plan
                        </span>
                      )}
                    </div>
                  </th>
                  <th className={`p-4 text-center font-bold text-gray-900 border-b-2 transition-all ${
                    currentPlanType === 'student_premium' 
                      ? 'bg-gradient-to-b from-blue-100 to-cyan-100 border-blue-400 border-b-4 shadow-lg relative' 
                      : 'border-purple-200'
                  }`}>
                    <div className="flex flex-col items-center">
                      <span className="text-lg">Students Premium</span>
                      <span className="text-sm font-normal text-gray-600">₹4,499/year</span>
                      {currentPlanType === 'student_premium' ? (
                        <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full mt-2 font-semibold shadow-md">
                          ✓ Current Plan
                        </span>
                      ) : currentPlanType === 'free' && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full mt-1">Popular</span>
                      )}
                    </div>
                  </th>
                  <th className={`p-4 text-center font-bold text-gray-900 border-b-2 transition-all ${
                    currentPlanType === 'student_parent_premium_pro' 
                      ? 'bg-gradient-to-b from-purple-100 to-pink-100 border-purple-400 border-b-4 shadow-lg relative' 
                      : 'border-purple-200'
                  }`}>
                    <div className="flex flex-col items-center">
                      <span className="text-lg">Student + Parent Pro</span>
                      <span className="text-sm font-normal text-gray-600">₹4,999/year</span>
                      {currentPlanType === 'student_parent_premium_pro' && (
                        <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full mt-2 font-semibold shadow-md">
                          ✓ Current Plan
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Games per Pillar', free: '5 games', premium: 'Unlimited', pro: 'Unlimited' },
                  { feature: 'Total Games Access', free: '50 games', premium: '2200+ games', pro: '2200+ games' },
                  { feature: 'Full Access to All 10 Pillars', free: false, premium: true, pro: true },
                  { feature: 'Advanced Analytics', free: false, premium: true, pro: true },
                  { feature: 'Certificates, Badges & Achievements', free: false, premium: true, pro: true },
                  { feature: 'WiseClub Community Access', free: false, premium: 'coming_soon', pro: 'coming_soon' },
                  { feature: 'Presentation Tool', free: false, premium: true, pro: true },
                  { feature: 'Parent Dashboard', free: false, premium: false, pro: true },
                  { feature: 'Family Progress Tracking', free: false, premium: false, pro: true },
                  { feature: 'Parent Mental Health Care', free: false, premium: false, pro: true },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{row.feature}</td>
                    <td className={`p-4 text-center transition-all ${
                      currentPlanType === 'free' 
                        ? 'bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-l-4 border-emerald-400' 
                        : ''
                    }`}>
                      {typeof row.free === 'boolean' ? (
                        row.free ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <span className="text-gray-400">—</span>
                      ) : (
                        <span className={`text-gray-700 ${currentPlanType === 'free' ? 'font-semibold' : ''}`}>{row.free}</span>
                      )}
                    </td>
                    <td className={`p-4 text-center transition-all ${
                      currentPlanType === 'student_premium' 
                        ? 'bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-l-4 border-blue-400' 
                        : ''
                    }`}>
                      {row.premium === 'coming_soon' ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold italic">Coming Soon</span>
                      ) : typeof row.premium === 'boolean' ? (
                        row.premium ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <span className="text-gray-400">—</span>
                      ) : (
                        <span className={`text-gray-700 ${currentPlanType === 'student_premium' ? 'font-semibold' : 'font-semibold'}`}>{row.premium}</span>
                      )}
                    </td>
                    <td className={`p-4 text-center transition-all ${
                      currentPlanType === 'student_parent_premium_pro' 
                        ? 'bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-l-4 border-purple-400' 
                        : ''
                    }`}>
                      {row.pro === 'coming_soon' ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold italic">Coming Soon</span>
                      ) : typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <span className="text-gray-400">—</span>
                      ) : (
                        <span className={`text-gray-700 ${currentPlanType === 'student_parent_premium_pro' ? 'font-semibold' : 'font-semibold'}`}>{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upgrade Options */}
        {!['student_parent_premium_pro', 'educational_institutions_premium'].includes(currentPlanType) && (
          <div className="mb-6" ref={availableUpgradesRef}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Available Upgrades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPlanType === 'free' && (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`bg-gradient-to-br ${plans.student_premium.color} rounded-2xl p-6 text-white cursor-pointer shadow-xl relative overflow-hidden`}
                    onClick={() => handleUpgrade('student_premium')}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{plans.student_premium.icon}</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>
                      </div>
                      <h4 className="font-black text-xl mb-3">{plans.student_premium.name}</h4>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black">₹{plans.student_premium.price.toLocaleString()}</span>
                          <span className="text-sm opacity-90">/year</span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {plans.student_premium.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade('student_premium');
                        }}
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                      >
                        Upgrade Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-gradient-to-br ${plans.student_parent_premium_pro.color} rounded-2xl p-6 text-white cursor-pointer shadow-xl relative overflow-hidden`}
                    onClick={() => handleUpgrade('student_parent_premium_pro')}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{plans.student_parent_premium_pro.icon}</span>
                        <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">BEST VALUE</span>
                      </div>
                      <h4 className="font-black text-xl mb-3">{plans.student_parent_premium_pro.name}</h4>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black">₹{plans.student_parent_premium_pro.price.toLocaleString()}</span>
                          <span className="text-sm opacity-90">/year</span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {plans.student_parent_premium_pro.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade('student_parent_premium_pro');
                        }}
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                      >
                        Upgrade Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}

              {currentPlanType === 'student_premium' && (
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-gradient-to-br ${plans.student_parent_premium_pro.color} rounded-2xl p-6 text-white cursor-pointer shadow-xl relative overflow-hidden`}
                  onClick={() => handleUpgrade('student_parent_premium_pro')}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{plans.student_parent_premium_pro.icon}</span>
                      <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">BEST VALUE</span>
                    </div>
                    <h4 className="font-black text-xl mb-3">{plans.student_parent_premium_pro.name}</h4>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">
                          ₹{plans.student_parent_premium_pro.price.toLocaleString()}
                        </span>
                        <span className="text-sm opacity-90">/year</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {plans.student_parent_premium_pro.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade('student_parent_premium_pro');
                      }}
                      className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Upgrade Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

      </motion.div>
    </>
  );
};

export default SubscriptionManagement;

