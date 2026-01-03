import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { X, Loader2, CheckCircle, AlertCircle, CreditCard, Shield, Lock, UserPlus, Users, GraduationCap } from 'lucide-react';
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

const CheckoutModal = ({ isOpen, onClose, planType, planName, amount }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('init'); // init, register, payment, success, error
  const [paymentError, setPaymentError] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Reset state when modal opens
      setStep('init');
      setPaymentError(null);
      setLoading(false);
      
      // Check auth first
      const token = localStorage.getItem("finmen_token");
      if (!token) {
        setStep('register');
        return;
      }
      
      // For free plan, activate immediately
      if (planType === 'free' && amount === 0) {
        activateFreePlan();
        return;
      }
      
      // For paid plans, initialize payment
      if (planType && amount > 0) {
        initializePayment();
      }
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'auto';
      
      // Reset everything when modal closes
      setStep('init');
      setPaymentError(null);
      setSubscriptionId(null);
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, planType, amount, activateFreePlan, initializePayment]);

  useEffect(() => {
    // Listen for real-time payment updates
    if (socket?.socket) {
      const handleSubscriptionActivated = (data) => {
        if (data.subscription && subscriptionId === data.subscription._id) {
          setStep('success');
          toast.success('Subscription activated successfully!');
        }
      };

      socket.socket.on('subscription:activated', handleSubscriptionActivated);

      return () => {
        socket.socket.off('subscription:activated', handleSubscriptionActivated);
      };
    }
  }, [socket, subscriptionId]);

  const activateFreePlan = useCallback(async () => {
    try {
      setLoading(true);
      setPaymentError(null);

      const response = await api.post('/api/subscription/create-payment', {
        planType: 'free',
      });

      if (response.data.success) {
        setStep('success');
        toast.success('Free plan activated successfully!');
        
        // Emit real-time update
        if (socket?.socket) {
          socket.socket.emit('subscription:activated', {
            subscription: response.data.subscription,
          });
        }
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to activate free plan');
      }
    } catch (error) {
      console.error('Free plan activation error:', error);
      if (error.response?.status === 401) {
        setStep('register');
        setPaymentError('Please register to activate the free plan');
      } else {
        setPaymentError(error.response?.data?.message || error.message || 'Failed to activate free plan');
        setStep('error');
      }
      toast.error(error.response?.data?.message || 'Failed to activate free plan');
    } finally {
      setLoading(false);
    }
  }, [socket, onClose]);

  const initializePayment = useCallback(async () => {
    try {
      setLoading(true);
      setPaymentError(null);

      // Create payment intent
      // Determine context based on user role and plan type
      const context = (user?.role === 'parent' || planType === 'student_parent_premium_pro') ? 'parent' : 'student';
      
      const response = await api.post('/api/subscription/create-payment', {
        planType,
        context,
        mode: 'purchase',
      });

      if (response.data.success) {
        // For free plan, handle success
        if (planType === 'free') {
          setStep('success');
          toast.success('Free plan activated successfully! 🎉');
          
          // Emit real-time update
          if (socket?.socket) {
            socket.socket.emit('subscription:activated', {
              subscription: response.data.subscription,
            });
          }
          
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2000);
          return;
        }

        // For paid plans, initialize Razorpay
        const orderId = response.data.orderId;
        const keyId = response.data.keyId;
        setSubscriptionId(response.data.subscriptionId);

        // Initialize Razorpay payment
        await initializeRazorpayPayment(orderId, keyId, amount);
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      if (error.response?.status === 401) {
        setStep('register');
        setPaymentError('Please register to continue');
      } else {
        setPaymentError(error.response?.data?.message || error.message || 'Failed to initialize payment');
        setStep('error');
      }
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  }, [user, planType, amount, socket, onClose, initializeRazorpayPayment]);

  const initializeRazorpayPayment = useCallback(async (orderId, keyId, amount) => {
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
        description: `Subscription: ${planName}`,
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
            setStep('success');
            toast.success('Payment successful! Your subscription has been activated. 🎉');
            
            // Emit real-time update via socket
            if (socket?.socket) {
              socket.socket.emit('subscription:activated', {
                subscription: verifyResponse.data.subscription,
              });
            }
            
            // Close modal after a delay and refresh
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2500);
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
          name: user?.name || user?.fullName || '',
          email: user?.email || '',
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
  }, [planName, subscriptionId, socket, onClose, user]);

  const modalContent = isOpen ? (
    <AnimatePresence>
      <motion.div
        key="checkout-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">Complete Payment</h2>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600 font-semibold">Secure Payment • SSL Encrypted</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Plan Info - Only show if not in register step */}
            {step !== 'register' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-lg text-gray-900">{planName}</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-purple-600">₹{amount.toLocaleString()}</span>
                  {amount > 0 && <span className="text-gray-600 font-semibold">/year</span>}
                </div>
                {amount === 0 && (
                  <p className="text-sm text-gray-600 mt-2">Free plan - No payment required</p>
                )}
              </motion.div>
            )}

            {/* Payment Form */}
            {step === 'init' && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            )}

            {step === 'register' && (
              <div className="text-center py-4 sm:py-6 md:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Registration Required</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                  Please register to {amount === 0 ? 'activate' : 'subscribe to'} this plan
                </p>
                
                {/* For Student + Parent Premium Pro Plan - Show two buttons */}
                {planType === 'student_parent_premium_pro' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          localStorage.setItem('pending_subscription', JSON.stringify({ planType, planName, amount }));
                          navigate('/register', { state: { from: 'pricing', planType } });
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="truncate">Continue as Student</span>
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem('pending_subscription', JSON.stringify({ planType, planName, amount }));
                          navigate('/register-parent', { state: { from: 'pricing', planType } });
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="truncate">Continue as Parent</span>
                      </button>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-100 text-gray-700 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  /* For Free Plan and Student Premium Plan - Show single register button */
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        localStorage.setItem('pending_subscription', JSON.stringify({ planType, planName, amount }));
                        navigate('/register', { state: { from: 'pricing', planType } });
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      Go to Register
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-100 text-gray-700 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">
                      Payment Details
                    </label>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>Secured by Razorpay</span>
                    </div>
                  </div>
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
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{paymentError}</span>
                    </motion.div>
                  )}
                  
                  {/* Security Badges */}
                  <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-600" />
                      <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-blue-600" />
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Razorpay payment window will open automatically. Complete the payment there.
                  </p>
                <button
                    type="button"
                    onClick={onClose}
                  disabled={loading}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-60"
                >
                    Cancel
                </button>
                </div>
                
                <p className="text-xs text-center text-gray-500">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Successful! 🎉</h3>
                <p className="text-gray-600 mb-4">Your subscription has been activated successfully.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 font-semibold">
                    You now have access to all premium features!
                  </p>
                </div>
                <p className="text-xs text-gray-500">Redirecting to your dashboard...</p>
              </motion.div>
            )}

            {step === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-4">{paymentError}</p>
                <button
                  onClick={initializePayment}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Try Again
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;

  // Render modal using React Portal to ensure it's always on top
  return createPortal(modalContent, document.body);
};

export default CheckoutModal;

