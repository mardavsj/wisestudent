import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  CreditCard,
  Smartphone,
  Banknote,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuth';

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

const PLAN_CONFIG = {
  free: {
    name: 'Free Plan',
    price: 0,
    features: ['5 Games per Pillar', 'Basic Dashboard', 'HealCoins Rewards'],
  },
  student_premium: {
    name: 'Students Premium Plan',
    price: 4499,
    features: [
      'Full access to all 10 Pillars',
      '2200+ Gaming Micro Lessons',
      'Advanced Analytics & Reports',
      'Certificates, Badges & Achievements',
      'WiseClub Community Access (Coming Soon)',
      'Presentation Tool',
    ],
  },
  student_parent_premium_pro: {
    name: 'Student + Parent Premium Pro Plan',
    price: 4999,
    features: [
      'Everything in Students Premium',
      'Dedicated Parent Dashboard',
      'Family Progress Tracking',
      'Parent Mental Health Care',
      'Parent-Child Learning Challenges',
    ],
  },
};

const SubscriptionCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const planFromQuery = searchParams.get('plan');
  const firstYearFromQuery = searchParams.get('firstYear');
  const contextFromQuery = searchParams.get('context');
  const modeFromQuery = searchParams.get('mode');

  const planState = location.state || {};
  const initialPlanType = planState.planType || planFromQuery || 'student_premium';
  const initialMode = planState.mode || modeFromQuery || 'purchase';
  const initialIsFirstYear = planState.isFirstYear !== undefined
    ? planState.isFirstYear
    : firstYearFromQuery === '0'
      ? false
      : true;
  const checkoutContext = planState.context || contextFromQuery || 'student';
  const isParentContext = checkoutContext === 'parent';

  const [planType, setPlanType] = useState(initialPlanType);
  const [checkoutMode, setCheckoutMode] = useState(initialMode === 'renew' ? 'renew' : 'purchase');
  const planConfig = useMemo(() => PLAN_CONFIG[planType] || PLAN_CONFIG.student_premium, [planType]);
  const isRenewalFlow = checkoutMode === 'renew';
  const [billingDetails, setBillingDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('details'); // details, payment, success, error
  const [orderId, setOrderId] = useState(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [isFirstYear, setIsFirstYear] = useState(initialMode === 'renew' ? false : initialIsFirstYear);

  const amount = useMemo(() => {
    if (planType === initialPlanType && planState.amount !== undefined) {
      return planState.amount;
    }
    const config = PLAN_CONFIG[planType] || PLAN_CONFIG.student_premium;
    return config.price || 0;
  }, [planType, checkoutMode, initialPlanType, planState.amount]);

  const availablePlanKeys = useMemo(() => {
    if (isParentContext) {
      return ['student_parent_premium_pro'];
    }
    return Object.keys(PLAN_CONFIG);
  }, [isParentContext]);

  useEffect(() => {
    if (planType === initialPlanType) {
      setIsFirstYear(checkoutMode === 'renew' ? false : initialIsFirstYear);
    } else {
      setIsFirstYear(checkoutMode === 'renew' ? false : true);
    }
  }, [planType, initialPlanType, initialIsFirstYear, checkoutMode]);

  // Razorpay handles payment UI, no need for element mounting

  const handleBillingChange = (field, value) => {
    setBillingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateBillingDetails = () => {
    if (!billingDetails.fullName?.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!billingDetails.email?.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    if (!billingDetails.phone?.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    return true;
  };

  const initializePayment = async () => {
    if (!validateBillingDetails()) return;

    try {
      setLoading(true);
      setPaymentError(null);

      const response = await api.post('/api/subscription/create-payment', {
        planType,
        context: checkoutContext,
        mode: checkoutMode,
      });

      if (response.data.success) {
        if (planType === 'free' || amount === 0) {
          toast.success('Free plan activated successfully! 🎉');
          setStep('success');
          setTimeout(() => navigate(checkoutContext === 'parent' ? '/parent/upgrade' : '/student/dashboard'), 2000);
          return;
        }

        setOrderId(response.data.orderId);
        setRazorpayKeyId(response.data.keyId);
        setSubscriptionId(response.data.subscriptionId);

        // Initialize Razorpay payment
        await initializeRazorpayPayment(response.data.orderId, response.data.keyId, amount);
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentError(error.response?.data?.message || error.message || 'Failed to initialize payment');
      toast.error('Unable to initialize payment. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const initializeRazorpayPayment = async (orderId, keyId, amount) => {
    try {
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error('Payment gateway not available right now.');
      }

      const options = {
        key: keyId,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Wise Student',
        description: `Subscription: ${planConfig.name}`,
        order_id: orderId,
        handler: async function (response) {
          // Payment successful
          setLoading(true);
          try {
        const verifyResponse = await api.post('/api/subscription/verify-payment', {
          subscriptionId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
        });

        if (verifyResponse.data.success) {
          toast.success('Payment successful! Your subscription is now active.');
        setStep('success');

          if (socket?.socket) {
            socket.socket.emit('subscription:activated', {
              subscription: verifyResponse.data.subscription,
            });
          }

        setTimeout(() => navigate(checkoutContext === 'parent' ? '/parent/upgrade' : '/student/dashboard'), 2000);
        } else {
          throw new Error(verifyResponse.data.message || 'Failed to activate subscription');
        }
          } catch (verifyError) {
            console.error('Subscription activation error:', verifyError);
            setPaymentError(verifyError.response?.data?.message || 'Payment succeeded but failed to activate subscription. Please contact support.');
            toast.error('Payment succeeded but subscription activation failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: billingDetails.fullName || user?.name || user?.fullName || '',
          email: billingDetails.email || user?.email || '',
          contact: billingDetails.phone || '',
        },
        notes: {
          address: billingDetails.address,
          city: billingDetails.city,
          state: billingDetails.state,
          zipCode: billingDetails.zipCode,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: async function () {
            setLoading(false);
            setPaymentError('Payment was cancelled');
            
            // Update backend to mark payment as cancelled
            if (subscriptionId) {
              try {
                await api.post('/api/subscription/cancel-payment', {
                  subscriptionId,
                });
              } catch (error) {
                console.error('Error cancelling payment:', error);
                // Don't show error to user as they already closed the window
              }
            }
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
      setLoading(true);
      setStep('payment');
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      setPaymentError(error.message || 'Unable to initialize payment.');
      toast.error(error.message || 'Unable to initialize payment.');
      setLoading(false);
    }
  };

  const handleChangePlan = (newPlanType) => {
    setPlanType(newPlanType);
    setCheckoutMode('purchase');
    setIsFirstYear(true);
    setStep('details');
    setOrderId(null);
    setRazorpayKeyId(null);
    setPaymentError(null);
  };

  const renderPlanSelection = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">
          {isParentContext
            ? (isRenewalFlow ? 'Renew Student + Parent Premium Pro' : 'Choose Your Family Plan')
            : '1. Choose Your Plan'}
        </h2>
        <span className="text-sm text-purple-600 font-semibold">
          {isParentContext
            ? (isRenewalFlow ? 'Confirm renewal details' : 'Curated for purposeful parenting')
            : 'Flexible upgrade options'}
        </span>
      </div>

      <div className={`grid grid-cols-1 ${isParentContext ? 'md:grid-cols-1' : 'md:grid-cols-3'} gap-4`}>
        {availablePlanKeys.map((key) => {
          const config = PLAN_CONFIG[key];
          if (!config) return null;
          return (
          <button
            key={key}
            type="button"
            onClick={() => handleChangePlan(key)}
            className={`relative rounded-2xl border-2 p-5 text-left transition-all ${
              planType === key
                ? 'border-purple-500 shadow-lg shadow-purple-100'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            {key === 'student_premium' && (
              <span className="absolute -top-3 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Popular
              </span>
            )}
            {key === 'student_parent_premium_pro' && (
              <span className="absolute -top-3 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Best Value
              </span>
            )}
            <h3 className="text-lg font-black text-gray-900 mb-2">{config.name}</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-black text-purple-600">₹{config.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/year</span>
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              {config.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{feature}</span>
                </li>
              ))}
              {config.features.length > 3 && (
                <li className="text-xs text-gray-400">+ {config.features.length - 3} more benefits</li>
              )}
            </ul>
          </button>
          );
        })}
      </div>
    </div>
  );

  const renderBillingForm = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">2. Billing Details</h2>
        <span className="text-sm text-gray-500">Secure & encrypted</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-purple-600" />
            Full Name
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
            placeholder="Enter your name"
            value={billingDetails.fullName}
            onChange={(e) => handleBillingChange('fullName', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-purple-600" />
            Email Address
          </label>
          <input
            type="email"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
            placeholder="name@email.com"
            value={billingDetails.email}
            onChange={(e) => handleBillingChange('email', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-purple-600" />
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
            placeholder="10-digit mobile number"
            value={billingDetails.phone}
            onChange={(e) => handleBillingChange('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-purple-600" />
            Address Line
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
            placeholder="House / Street / Locality"
            value={billingDetails.address}
            onChange={(e) => handleBillingChange('address', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-purple-600" />
            City
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
            placeholder="City"
            value={billingDetails.city}
            onChange={(e) => handleBillingChange('city', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">State</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
              placeholder="State"
              value={billingDetails.state}
              onChange={(e) => handleBillingChange('state', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">PIN Code</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
              placeholder="6-digit"
              value={billingDetails.zipCode}
              onChange={(e) => handleBillingChange('zipCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">3. Select Payment Method</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>256-bit SSL Encryption</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition ${
            paymentMethod === 'card' ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Card (Visa / MasterCard / RuPay)
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('upi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition ${
            paymentMethod === 'upi' ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          UPI
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('netbanking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition ${
            paymentMethod === 'netbanking' ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600'
          }`}
        >
          <Banknote className="w-4 h-4" />
          Net Banking
        </button>
      </div>

      {paymentMethod === 'card' && step === 'details' && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-purple-700 mb-2">Pay securely with your card</h4>
          <p className="text-xs text-purple-600">
            We use Razorpay for secure payments. Your payment details are directly processed by Razorpay and never stored on our servers.
          </p>
        </div>
      )}

      {paymentMethod === 'upi' && step === 'details' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-emerald-700 mb-2">Pay with UPI</h4>
          <p className="text-xs text-emerald-600">
            Proceed to payment and select <strong>UPI</strong> in the secure payment window. You can complete the payment using any supported UPI app such as PhonePe, Google Pay, BHIM, etc.
          </p>
        </div>
      )}

      {paymentMethod === 'netbanking' && step === 'details' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-blue-700 mb-2">Pay with Net Banking</h4>
          <p className="text-xs text-blue-600">
            Proceed to payment and choose <strong>Net Banking</strong> to pay directly from your bank account. All major Indian banks are supported through our payment gateway.
          </p>
        </div>
      )}

      {step === 'payment' && (
        <div className="mt-4">
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Complete Your Payment</label>
            <p className="text-xs text-gray-500 mb-2">
              Select <strong>{paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}</strong> from the payment options inside the secure window and follow the on-screen instructions.
            </p>
            <div className="p-8 border-2 border-gray-200 rounded-lg bg-gray-50 text-center">
              {loading ? (
                <>
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600 mb-4" />
                  <p className="text-gray-700 font-semibold">Opening Razorpay payment window...</p>
                  <p className="text-sm text-gray-500 mt-2">Complete the payment in the popup window</p>
                </>
              ) : (
                <>
                  <CreditCard className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                  <p className="text-gray-700 font-semibold">Razorpay payment window will open</p>
                  <p className="text-sm text-gray-500 mt-2">You'll be redirected to complete the payment securely</p>
                </>
              )}
            </div>
            {paymentError && (
              <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{paymentError}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">Order Summary</h2>
        <span className="text-xs text-gray-500">Secure checkout</span>
      </div>
      <div className="space-y-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Plan Selected</span>
          <span className="font-semibold text-gray-900">{planConfig.name}</span>
        </div>
        <div className="flex justify-between">
          <span>{isFirstYear ? 'First Year Price' : 'Renewal Price'}</span>
          <span className="font-semibold text-gray-900">₹{amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base font-black text-purple-600 border-t border-gray-200 pt-4">
          <span>Total Payable</span>
          <span>₹{amount.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-500 text-right">Price includes 18% GST.</p>
      </div>

      <div className="mt-6 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>PCI DSS compliant – your payment data is fully secure.</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>Instant activation immediately after successful payment.</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>7-day no-questions-asked refund policy.</span>
        </div>
      </div>
    </div>
  );

  const renderActionButton = () => {
    if (step === 'details') {
      return (
        <button
          onClick={initializePayment}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Initializing Payment...
            </span>
          ) : (
            `Continue with ${paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'} Payment`
          )}
        </button>
      );
    }

    if (step === 'payment') {
      return (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Razorpay payment window will open automatically. Complete the payment there.
          </p>
        <button
            type="button"
            onClick={() => {
              setStep('details');
              setPaymentError(null);
            }}
          disabled={loading}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-60"
        >
            Back to Details
        </button>
        </div>
      );
    }

    if (step === 'success') {
      return (
        <button
          onClick={() => navigate('/student/dashboard')}
          className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all"
        >
          Go to Dashboard
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          setStep('details');
          setPaymentError(null);
        }}
        className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-all"
      >
        Try Again
      </button>
    );
  };

  const pageTitle = isParentContext ? 'Complete Your Family Upgrade' : 'Complete Your Upgrade';
  const pageSubtitle = isParentContext
    ? 'Secure checkout powered by Razorpay. Confirm your details, choose your preferred payment method, and unlock instant access to WiseFamily Pro.'
    : 'Secure checkout powered by Razorpay. Fill in your billing details, choose your payment method, and unlock instant access to WiseStudent Premium.';
  const backLink = isParentContext ? '/parent/upgrade' : '/student/payment';
  const backLabel = isParentContext ? 'Back to Parent Plans' : 'Back to Plans';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(backLink)}
          className="flex items-center gap-2 text-sm font-semibold text-purple-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow-2xl border border-white/40"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">{pageTitle}</h1>
              <p className="text-sm text-gray-600">
                {pageSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-semibold text-purple-700">Trusted & Secure</p>
                <p className="text-xs text-purple-500">Your data is protected with enterprise-grade encryption</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {renderPlanSelection()}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {renderBillingForm()}
              {renderPaymentMethods()}
            </div>
            <div className="space-y-6">
              {renderOrderSummary()}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                {renderActionButton()}
                {paymentError && step !== 'payment' && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{paymentError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;

