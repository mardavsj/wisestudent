import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthUtils';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    UserPlus,
    ArrowRight,
    Shield,
    Zap,
    User,
    Calendar,
    ShieldCheck,
    Link2,
    Loader2,
    CheckCircle2,
    X,
    GraduationCap,
    Users,
    CreditCard,
    MessageCircle,
    CheckCircle,
} from 'lucide-react';

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

const AnimatedBackdrop = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
    </div>
);

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalView, setModalView] = useState('mode-select');
    const [registrationMode, setRegistrationMode] = useState(null);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [parentLinkCode, setParentLinkCode] = useState('');
    const [schoolLinkCode, setSchoolLinkCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [linkingCodeGenerated, setLinkingCodeGenerated] = useState(null);
    const [gender, setGender] = useState('');
    const [showPlanSelectionModal, setShowPlanSelectionModal] = useState(false);
    const [planSelectionData, setPlanSelectionData] = useState(null);
    const [showStandalonePlanSelection, setShowStandalonePlanSelection] = useState(false);
    const [isInitializingPayment, setIsInitializingPayment] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const handleGoogleLogin = useGoogleLogin({
        // Note: The app name shown in Google OAuth consent screen is configured in Google Cloud Console
        // Go to: APIs & Services > OAuth consent screen > Edit App > App name: "Wise Student"
        // 
        // IMPORTANT: For production, ensure your production domain is added to:
        // Google Cloud Console > APIs & Services > Credentials > [Your OAuth Client ID] > 
        // Authorized JavaScript origins: https://your-production-domain.com
        // See GOOGLE_OAUTH_FIX.md for detailed instructions
        onSuccess: async (tokenResponse) => {
            try {
                setIsGoogleLoading(true);
                setError("");

                // Send the Google access token to your backend
                const response = await api.post(`/api/auth/google`, {
                    accessToken: tokenResponse.access_token,
                });

                const { token, user } = response.data;
                localStorage.setItem("finmen_token", token);

                await fetchUser();

                // Navigate based on user role
                switch (user.role) {
                    case "admin":
                        navigate("/admin/dashboard");
                        break;
                    case "school_admin":
                        navigate("/school/admin/dashboard");
                        break;
                    case "school_teacher":
                        navigate("/school-teacher/overview");
                        break;
                    case "parent":
                        navigate("/parent/dashboard");
                        break;
                    case "seller":
                        navigate("/seller/dashboard");
                        break;
                    case "csr":
                        navigate("/csr/dashboard");
                        break;
                    case "student":
                    case "school_student":
                    default:
                        navigate("/student/dashboard");
                        break;
                }
            } catch (err) {
                if (err.response?.status === 403 && err.response?.data?.approvalStatus) {
                    // Handle pending/rejected approval status
                    setError(err.response?.data?.message || "Your account is currently under review.");
                } else {
                    setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
                }
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: (error) => {
            // Handle OAuth errors with more specific messages
            let errorMessage = "Google sign-in was cancelled or failed. Please try again.";
            
            // Check if it's a redirect_uri_mismatch error
            if (error?.error === "redirect_uri_mismatch" || 
                error?.error_description?.includes("redirect_uri_mismatch") ||
                error?.message?.includes("redirect_uri_mismatch")) {
                errorMessage = "OAuth configuration error: Please ensure your production domain is added to Google Cloud Console. See GOOGLE_OAUTH_FIX.md for instructions.";
            }
            
            setError(errorMessage);
            setIsGoogleLoading(false);
            
            // Log detailed error in development
            if (import.meta.env.DEV) {
                console.error("Google OAuth Error:", error);
            }
        },
    });

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim() || !dob || !email || !password || !confirmPassword || !gender) {
            setError('Please fill in all fields.');
            return;
        }

        if (fullName.trim().length === 0) {
            setError('Full name is required.');
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            setError('Date of Birth must be in YYYY-MM-DD format.');
            return;
        }
        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime())) {
            setError('Invalid Date of Birth.');
            return;
        }
        const today = new Date();
        if (dobDate > today) {
            setError('Date of Birth cannot be in the future.');
            return;
        }

        if (!gender) {
            setError('Please select your gender.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setModalOpen(true);
        setModalView('mode-select');
        setRegistrationMode(null);
        setSelectedFlow(null);
        setParentLinkCode('');
        setSchoolLinkCode('');
        setLinkingCodeGenerated(null);
    };
    const closeModal = () => {
        setModalOpen(false);
        setModalView('mode-select');
        setRegistrationMode(null);
        setSelectedFlow(null);
        setParentLinkCode('');
        setSchoolLinkCode('');
        setIsProcessing(false);
        setLinkingCodeGenerated(null);
    };

    const loginAndRedirect = async () => {
            const res = await api.post(`/api/auth/login`, {
                email,
            password,
            });

            localStorage.setItem('finmen_token', res.data.token);
            const user = await fetchUser();
            if (user?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/student/dashboard");
            }
    };

    const finalizeStudentRegistration = async (payload) => {
        try {
            const response = await api.post(`/api/auth/student-registration/finalize`, payload);
            const { linkingCode = null, planType = 'free' } = response.data || {};
            setLinkingCodeGenerated(linkingCode || null);
            
            // Close all modals before redirecting
            setShowStandalonePlanSelection(false);
            setShowPlanSelectionModal(false);
            closeModal();
            
            await loginAndRedirect();
            
            if (planType === 'student_parent_premium_pro') {
                toast.success("You're all set! Your family plan is active.");
            } else if (planType === 'student_premium') {
                toast.success("You're connected to your school's premium plan. Enjoy full access!");
            } else if (planType === 'educational_institutions_premium') {
                toast.success("Welcome aboard! Your school's premium access is active.");
            } else if (payload.flow === 'school_link') {
                toast.success("Your student account is ready. You'll start with freemium access until your school activates their plan.");
            } else if (payload.flow === 'parent_not_created') {
                if (planType === 'free') {
                toast.success("Freemium student account created. Ask your parent to complete their upgrade anytime.");
                } else {
                    toast.success("Your premium account is active! Enjoy full access.");
            }
                if (linkingCode) {
                toast.success(`Share this linking code with your parent: ${linkingCode}`);
            }
            } else {
                toast.success("Freemium student account created. Ask your parent to complete their upgrade anytime.");
            }
        } catch (err) {
            console.error('Student registration finalize error:', err);
            setError(err.response?.data?.message || 'Failed to complete registration.');
            setIsProcessing(false);
        }
    };

    const handleStandalonePlanSelection = async (selectedPlan) => {
        setIsProcessing(true);
        setShowStandalonePlanSelection(false);
        
        try {
            if (selectedPlan === 'free') {
                // Create account with free plan
                await startStudentRegistration('parent_not_created', { selectedPlan: 'free' });
            } else if (selectedPlan === 'student_premium' || selectedPlan === 'student_parent_premium_pro') {
                // Create payment order for premium plans
                const response = await api.post(`/api/auth/student-registration/initiate-standalone-with-plan`, {
                    email: email.trim(),
                    password,
                    fullName: fullName.trim(),
                    dateOfBirth: dob,
                    flow: 'parent_not_created',
                    gender,
                    selectedPlan,
                });
                
                if (response.data?.requiresPayment) {
                    // Initialize Razorpay payment
                    await initializeRazorpayPayment(
                        response.data.orderId,
                        response.data.keyId,
                        response.data.amount,
                        response.data.registrationIntentId
                    );
                } else {
                    const payload = response.data?.payload;
                    if (payload) {
                        await finalizeStudentRegistration(payload);
                    }
                }
            }
        } catch (err) {
            console.error('Standalone plan selection error:', err);
            setError(err.response?.data?.message || 'Failed to process plan selection.');
            setIsProcessing(false);
        }
    };

    const handlePlanSelection = async (selectedPlan) => {
        if (!planSelectionData) return;
        
        setIsProcessing(true);
        
        try {
            if (selectedPlan === 'free') {
                // Create account with free plan
                const response = await api.post(`/api/auth/student-registration/initiate-with-plan`, {
                    email: email.trim(),
                    password,
                    fullName: fullName.trim(),
                    dateOfBirth: dob,
                    flow: 'parent_exists',
                    parentLinkingCode: parentLinkCode.trim().toUpperCase(),
                    gender,
                    selectedPlan: 'free',
                    parentId: planSelectionData.parentId,
                });
                
                const payload = response.data?.payload;
                if (payload) {
                    await finalizeStudentRegistration(payload);
                } else {
                    throw new Error('Invalid registration response');
                }
            } else if (selectedPlan === 'student_premium' || selectedPlan === 'student_parent_premium_pro') {
                // Create payment order for premium plans
                const response = await api.post(`/api/auth/student-registration/initiate-with-plan`, {
                    email: email.trim(),
                    password,
                    fullName: fullName.trim(),
                    dateOfBirth: dob,
                    flow: 'parent_exists',
                    parentLinkingCode: parentLinkCode.trim().toUpperCase(),
                    gender,
                    selectedPlan,
                    parentId: planSelectionData.parentId,
                });
                
                if (response.data?.requiresPayment) {
                    // Initialize Razorpay payment
                    await initializeRazorpayPayment(
                        response.data.orderId,
                        response.data.keyId,
                        response.data.amount,
                        response.data.registrationIntentId
                    );
                } else {
                    const payload = response.data?.payload;
                    if (payload) {
                        await finalizeStudentRegistration(payload);
                    }
                }
            } else if (selectedPlan === 'contact_parent') {
                // Close modal and show message
                setShowPlanSelectionModal(false);
                toast.info('Please contact your parent to create your account. You can register again later.');
                setIsProcessing(false);
            }
        } catch (err) {
            console.error('Plan selection error:', err);
            toast.error(err.response?.data?.message || 'Failed to process plan selection.');
            setIsProcessing(false);
        }
    };

    const initializeRazorpayPayment = async (orderId, keyId, amount, registrationIntentId) => {
        try {
            setIsInitializingPayment(true);
            const Razorpay = await loadRazorpay();
            if (!Razorpay) {
                setIsInitializingPayment(false);
                throw new Error('Payment gateway not available right now.');
            }

            const options = {
                key: keyId,
                amount: Math.round(amount * 100), // Convert to paise
                currency: 'INR',
                name: 'Wise Student',
                description: 'Student Registration Payment',
                order_id: orderId,
                handler: async function (response) {
                    // Payment successful - finalize registration
                    setIsProcessing(true);
                    try {
                        const finalizeResponse = await api.post(`/api/auth/student-registration/finalize-with-payment`, {
                            registrationIntentId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        
                        const payload = finalizeResponse.data?.payload;
                        if (payload) {
                            // Close modals before finalizing
                            setShowStandalonePlanSelection(false);
                            setShowPlanSelectionModal(false);
                            await finalizeStudentRegistration(payload);
                        } else {
                            throw new Error('Invalid registration response');
                        }
                    } catch (error) {
                        console.error('Registration finalization error:', error);
                        toast.error('Payment succeeded but registration failed. Please contact support.');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: fullName.trim(),
                    email: email.trim(),
                },
                theme: {
                    color: '#6366f1',
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.info('Payment was cancelled');
                    },
                },
            };

            const razorpayInstance = new Razorpay(options);
            
            // Handle payment failure
            razorpayInstance.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                setIsInitializingPayment(false);
                setIsProcessing(false);
                toast.error(response.error.description || 'Payment failed. Please try again.');
            });
            
            setIsInitializingPayment(false); // Hide initialization modal when Razorpay opens
            razorpayInstance.open();
        } catch (error) {
            console.error('Razorpay initialization error:', error);
            setIsInitializingPayment(false);
            toast.error(error.message || 'Unable to initialize payment.');
            setIsProcessing(false);
        }
    };

    const startStudentRegistration = async (flow, options = {}) => {
        setIsProcessing(true);
        setError('');
        setLinkingCodeGenerated(null);
        try {
            const parentCode = options.parentLinkingCode
                ? options.parentLinkingCode.trim().toUpperCase()
                : undefined;
            const schoolCode = options.schoolLinkingCode
                ? options.schoolLinkingCode.trim().toUpperCase()
                : undefined;
            
            // For parent_not_created flow, plan selection is required
            if (flow === 'parent_not_created') {
                if (!options.selectedPlan) {
                    // This should not happen - plan selection modal should have been shown
                    setError('Please select a plan to continue with registration.');
                    setIsProcessing(false);
                    return;
                }
                
                // Use the standalone plan endpoint
                const response = await api.post(`/api/auth/student-registration/initiate-standalone-with-plan`, {
                    email: email.trim(),
                    password,
                    fullName: fullName.trim(),
                    dateOfBirth: dob,
                    flow: 'parent_not_created',
                    gender,
                    selectedPlan: options.selectedPlan,
                });
                
                if (response.data?.requiresPayment) {
                    await initializeRazorpayPayment(
                        response.data.orderId,
                        response.data.keyId,
                        response.data.amount,
                        response.data.registrationIntentId
                    );
                    return;
                } else if (response.data?.payload) {
                    await finalizeStudentRegistration(response.data.payload);
                    return;
                } else {
                    setError('Invalid response from server. Please try again.');
                    setIsProcessing(false);
                    return;
                }
            }

            // Prevent calling initiate endpoint for parent_not_created flow
            if (flow === 'parent_not_created') {
                setError('Please select a plan to continue with registration.');
                setIsProcessing(false);
                return;
            }

            const response = await api.post(`/api/auth/student-registration/initiate`, {
                email: email.trim(),
                password,
                fullName: fullName.trim(),
                dateOfBirth: dob,
                flow,
                parentLinkingCode: parentCode,
                schoolLinkingCode: schoolCode,
                gender,
            });
            
            console.log('Registration response:', response);
            console.log('Response data:', response.data);
            console.log('Response status:', response.status);
            
            // Check if response exists
            if (!response || !response.data) {
                console.error('No response or response data received');
                setError('Failed to start registration. Please try again.');
                setIsProcessing(false);
                return;
            }
            
            // Check if response is successful
            if (response.data.success === false) {
                const errorMessage = response.data.message || 'Failed to start registration.';
                console.error('Registration failed:', errorMessage);
                setError(errorMessage);
                setIsProcessing(false);
                return;
            }
            
            // Check if parent already has linked children - show plan selection modal FIRST
            if (response.data.requiresPlanSelection === true) {
                console.log('Parent already has linked children, showing plan selection modal');
                setPlanSelectionData({
                    parentId: response.data.parentId,
                    parentName: response.data.parentName,
                    existingChildrenCount: response.data.existingChildrenCount,
                });
                setShowPlanSelectionModal(true);
                setIsProcessing(false);
                // Close the parent code entry modal if it's open
                if (modalView === 'enter-parent-code') {
                    setModalView(null);
                }
                return;
            }
            
            // Check for payload - required for normal registration flow
            if (!response.data.payload) {
                console.error('Invalid registration response - missing payload:', response.data);
                const errorMessage = response.data?.message || 'Invalid registration response. Please try again.';
                setError(errorMessage);
                setIsProcessing(false);
                return;
            }
            
            const payload = response.data.payload;
            console.log('Proceeding with payload:', payload);
            await finalizeStudentRegistration(payload);
        } catch (err) {
            console.error('Student registration initiate error:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                responseData: err.response?.data,
                status: err.response?.status,
            });
            
            let errorMessage = 'Failed to start registration.';
            
            if (err.response) {
                // Server responded with error
                errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
            } else if (err.request) {
                // Request was made but no response received
                errorMessage = 'No response from server. Please check your internet connection.';
            } else {
                // Error in request setup
                errorMessage = err.message || errorMessage;
            }
            
            setError(errorMessage);
            setIsProcessing(false);
        }
    };

    const handleFlowSelection = (flow) => {
        setSelectedFlow(flow);
        setRegistrationMode('individual');
        if (flow === 'parent_not_created') {
            // Close parent choice modal and show plan selection modal instead of directly creating account
            setModalView(null);
            setShowStandalonePlanSelection(true);
            // Prevent any automatic registration - user must select a plan first
            return;
        } else {
            setModalView('enter-parent-code');
        }
    };

    const handleRegistrationModeSelection = (mode) => {
        setRegistrationMode(mode);
        setSelectedFlow(null);
        setError('');

        if (mode === 'individual') {
            setParentLinkCode('');
            setSchoolLinkCode('');
            setModalView('parent-choice');
        } else if (mode === 'school') {
            setParentLinkCode('');
            setSchoolLinkCode('');
            setModalView('school-code');
        }
    };

    const handleParentCodeSubmit = () => {
        if (!parentLinkCode.trim()) {
            setError('Please enter your parent’s secret linking code.');
            return;
        }
        startStudentRegistration('parent_exists', { parentLinkingCode: parentLinkCode });
    };

    const handleSchoolCodeSubmit = () => {
        if (!schoolLinkCode.trim()) {
            setError('Please enter your school’s secret linking code.');
            return;
        }
        setError('');
        setRegistrationMode('school');
        startStudentRegistration('school_link', { schoolLinkingCode: schoolLinkCode });
    };

    const renderModalContent = () => {
        if (isProcessing) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-4 py-10"
                >
                    <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
                    <div className="text-center space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900">Hold on a moment…</h3>
                        <p className="text-sm text-gray-600">We’re preparing your student dashboard.</p>
                    </div>
                </motion.div>
            );
        }

        if (modalView === 'enter-parent-code') {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Link to your parent</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Enter your parent’s secret linking code. If their family plan is active, you’ll upgrade instantly.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-cyan-500" />
                            Parent’s secret linking code
                        </label>
                        <input
                            type="text"
                            value={parentLinkCode}
                            onChange={(event) => setParentLinkCode(event.target.value.toUpperCase())}
                            placeholder="e.g. PR-XYZ789"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex justify-between gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFlow(null);
                                setParentLinkCode('');
                                setModalView('parent-choice');
                            }}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleParentCodeSubmit}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                        >
                            Link & Continue
                        </button>
                    </div>
                </motion.div>
            );
        }

        if (modalView === 'school-code') {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">Link through your school</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Enter your school’s secret linking code. We’ll connect you to the right classroom instantly.
                        </p>
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-emerald-500" />
                            School secret linking code
                        </label>
                        <input
                            type="text"
                            value={schoolLinkCode}
                            onChange={(event) => setSchoolLinkCode(event.target.value.toUpperCase())}
                            placeholder="e.g. REG-SCHOOL2025"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex justify-between gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setSchoolLinkCode('');
                                setModalView('mode-select');
                                setRegistrationMode(null);
                            }}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSchoolCodeSubmit}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                        >
                            Link & Continue
                        </button>
                    </div>
                </motion.div>
            );
        }

        if (modalView === 'parent-choice') {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <button
                        type="button"
                        onClick={() => {
                            setModalView('mode-select');
                            setRegistrationMode(null);
                            setSelectedFlow(null);
                        }}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition w-fit"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Change registration type
                    </button>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 text-center">
                            Do your parents already have an account?
                        </h3>
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Choose an option so we can keep your family in sync from the very first login.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleFlowSelection('parent_exists')}
                            className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                                selectedFlow === 'parent_exists'
                                    ? 'border-cyan-500 bg-cyan-50'
                                    : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                    <Link2 className="w-5 h-5" />
                                </div>
                                {selectedFlow === 'parent_exists' && (
                                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                                )}
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-gray-900">
                                My parent’s account is already created
                            </h4>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                Link with their secret code. If their plan is active, you’ll upgrade to the premium family plan instantly.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleFlowSelection('parent_not_created')}
                            className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                                selectedFlow === 'parent_not_created'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                {selectedFlow === 'parent_not_created' && (
                                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                )}
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-gray-900">
                                My parent will create their account later
                            </h4>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                We’ll create your freemium student account now and give you a secret code to share with them.
                            </p>
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div>
                    <h3 className="text-xl font-bold text-gray-900 text-center">
                        How would you like to register?
                    </h3>
                    <p className="text-sm text-gray-600 text-center mt-2">
                        Pick the option that matches you best. We’ll guide you through the next steps.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleRegistrationModeSelection('individual')}
                        className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                            registrationMode === 'individual'
                                ? 'border-cyan-500 bg-cyan-50'
                                : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            {registrationMode === 'individual' && (
                                <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                            )}
                        </div>
                        <h4 className="mt-4 text-lg font-semibold text-gray-900">
                            Register Individually
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                            Perfect if you’re signing up with a parent or creating your own account first.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRegistrationModeSelection('school')}
                        className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                            registrationMode === 'school'
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            {registrationMode === 'school' && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            )}
                        </div>
                        <h4 className="mt-4 text-lg font-semibold text-gray-900">
                            Register Through School
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                            Use your school’s secret code to unlock class access and premium benefits instantly.
                        </p>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={closeModal}
                    className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
            </motion.div>
        );
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <AnimatedBackdrop />

            {/* Main Content - Changed to use flex to fill entire screen */}
            {/* Added responsive padding and mobile-friendly positioning */}
            <div className="relative z-10 h-full flex items-center justify-center px-4 py-6 sm:py-8 sm:px-6 lg:px-8 overflow-y-auto">
                {/* Back Button - Adjusted positioning for mobile */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 z-50"
                >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                    <span className="hidden xs:inline">Back</span>
                    <span className="xs:hidden">Back</span>
                </button>

                <motion.div
                    className="w-full max-w-3xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Register Card - Adjusted padding for mobile */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl w-full max-w-full"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* Header - Adjusted text sizes for mobile */}
                        <motion.div
                            className="mb-6 sm:mb-8"
                            variants={itemVariants}
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                                {/* Left side - Title and description */}
                                <div className="flex-1">
                            <motion.div
                                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-3 sm:mb-4"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </motion.div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                                Create Account
                            </h1>
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                                Join the gamified learning experience
                            </p>
                                </div>

                                {/* Right side - Google Sign In Button */}
                    <div className="w-full sm:w-auto self-end">
                                    <motion.button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={isGoogleLoading || modalOpen}
                                        className="bg-white/5 border-r-2 border-white/20 rounded-l-xl px-4 sm:px-6 py-2 sm:py-4.5 w-full sm:w-auto hover:bg-white/10 hover:border-white/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 text-xs sm:text-sm cursor-pointer flex items-center justify-end gap-1.5 sm:gap-2"
                                        whileHover={{ scale: isGoogleLoading || modalOpen ? 1 : 1.02 }}
                                        whileTap={{ scale: isGoogleLoading || modalOpen ? 1 : 0.98 }}
                                    >
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="text-white text-xs sm:text-sm whitespace-nowrap font-medium">
                                            {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                                        </span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 sm:p-3 mb-4 sm:mb-6"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-red-300 text-xs sm:text-sm text-center">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Register Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-5 sm:space-y-6"
                            variants={itemVariants}
                        >
                            {/* Full Name and Date of Birth Fields - Responsive grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4">
                                {/* Full Name Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        autoComplete="name"
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-base appearance-none"
                                        style={{ 
                                            WebkitAppearance: 'none',
                                            WebkitTapHighlightColor: 'transparent',
                                            fontSize: '16px' // Prevents iOS zoom on focus
                                        }}
                                    />
                                </motion.div>

                                {/* Date of Birth Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-base relative"
                                        style={{ 
                                            WebkitAppearance: 'none',
                                            WebkitTapHighlightColor: 'transparent',
                                            colorScheme: 'dark',
                                            minHeight: '48px',
                                            fontSize: '16px', // Prevents iOS zoom on focus
                                            position: 'relative'
                                        }}
                                    />
                                </motion.div>
                            </div>

                            {/* Email Field */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4">
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-base appearance-none"
                                        style={{ 
                                            WebkitAppearance: 'none',
                                            WebkitTapHighlightColor: 'transparent',
                                            fontSize: '16px' // Prevents iOS zoom on focus
                                        }}
                                    />
                                </motion.div>

                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                        className="w-full appearance-none pl-10 sm:pl-12 pr-8 sm:pr-10 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-base"
                                        style={{ 
                                            WebkitAppearance: 'none',
                                            WebkitTapHighlightColor: 'transparent',
                                            fontSize: '16px', // Prevents iOS zoom on focus
                                            minHeight: '48px'
                                        }}
                                    >
                                        <option value="" disabled className="bg-slate-800 text-white">
                                            Select gender
                                        </option>
                                        <option value="female" className="bg-slate-800 text-white">
                                            Female
                                        </option>
                                        <option value="male" className="bg-slate-800 text-white">
                                            Male
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 z-10">
                                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Password and Confirm Password Fields - Responsive grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4">
                                {/* Password Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="new-password"
                                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-base appearance-none"
                                        style={{ 
                                            WebkitAppearance: 'none',
                                            WebkitTapHighlightColor: 'transparent',
                                            fontSize: '16px' // Prevents iOS zoom on focus
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors z-10"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    </button>
                                </motion.div>

                                {/* Confirm Password Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-base appearance-none"
                                        style={{ 
                                            WebkitAppearance: 'none',
                                            WebkitTapHighlightColor: 'transparent',
                                            fontSize: '16px' // Prevents iOS zoom on focus
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors z-10"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    </button>
                                </motion.div>
                            </div>

                            {/* Password Match Indicator */}
                            <AnimatePresence>
                                {confirmPassword && (
                                    <motion.div
                                        className="flex items-center space-x-2"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${password === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className={`text-xs sm:text-sm ${password === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                            {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Register Button */}
                            <motion.button
                                type="submit"
                                disabled={modalOpen}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm sm:text-base"
                                whileHover={{ scale: modalOpen ? 1 : 1.02 }}
                                whileTap={{ scale: modalOpen ? 1 : 0.98 }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Continue
                                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />
                            </motion.button>
                        </motion.form>

                        {/* Warning Note - Simple Highlight */}
                        <p className="text-xs sm:text-sm text-amber-400 text-center py-2">
                            📌 <span className="font-semibold">Your date of birth and gender cannot be changed after registration, Choose it wisely.</span>
                        </p>

                        {/* Login Link */}
                        <motion.div
                            className="text-center mt-6 pt-5 border-t border-white/10"
                            variants={itemVariants}
                        >
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Already have a Student account?{' '}
                                <motion.button
                                    onClick={() => navigate('/login')}
                                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors relative group"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Sign In
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
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            {renderModalContent()}
                            {linkingCodeGenerated && registrationMode === 'individual' && (
                                <div className="mt-6 p-4 bg-cyan-50 border border-cyan-100 rounded-2xl text-sm text-cyan-700">
                                    Share this code with your parent:{" "}
                                    <span className="font-semibold">{linkingCodeGenerated}</span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Standalone Plan Selection Modal (for parent_not_created flow) */}
            <AnimatePresence>
                {showStandalonePlanSelection && (
                    <motion.div
                        className="fixed inset-0 z-[201] flex items-center justify-center bg-black/70 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isProcessing && setShowStandalonePlanSelection(false)}
                    >
                        <motion.div
                            className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => !isProcessing && setShowStandalonePlanSelection(false)}
                                disabled={isProcessing}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Choose Your Plan
                                </h2>
                                <p className="text-gray-600">
                                    Select a plan that best fits your learning needs
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Free Plan */}
                                <motion.button
                                    type="button"
                                    onClick={() => handleStandalonePlanSelection('free')}
                                    disabled={isProcessing}
                                    className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-left hover:border-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-200 rounded-xl">
                                            <Zap className="w-6 h-6 text-green-600" />
                                        </div>
                                        <span className="text-2xl font-bold text-green-600">₹0</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Free Plan</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Basic access with limited features
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• 5 Games per Pillar</li>
                                        <li>• Basic Dashboard</li>
                                        <li>• HealCoins Rewards</li>
                                    </ul>
                                </motion.button>

                                {/* Student Premium Plan */}
                                <motion.button
                                    type="button"
                                    onClick={() => handleStandalonePlanSelection('student_premium')}
                                    disabled={isProcessing}
                                    className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl text-left hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-200 rounded-xl">
                                            <Shield className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">₹4,499</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Students Premium</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Full access to all features
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Unlimited Games</li>
                                        <li>• All 10 Pillars</li>
                                        <li>• Advanced Analytics</li>
                                        <li>• Certificates</li>
                                    </ul>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-600">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Payment required</span>
                                    </div>
                                </motion.button>

                                {/* Student + Parent Premium Pro Plan */}
                                <motion.button
                                    type="button"
                                    onClick={() => handleStandalonePlanSelection('student_parent_premium_pro')}
                                    disabled={isProcessing}
                                    className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl text-left hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-purple-200 rounded-xl">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <span className="text-2xl font-bold text-purple-600">₹4,999</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Student + Parent Pro</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Complete family plan with all features
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Everything in Premium</li>
                                        <li>• Parent Dashboard</li>
                                        <li>• Family Tracking</li>
                                        <li>• Parent Support</li>
                                    </ul>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-purple-600">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Payment required</span>
                                    </div>
                                </motion.button>
                            </div>

                            {isProcessing && (
                                <div className="mt-6 flex items-center justify-center gap-3 text-gray-600">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Processing...</span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Plan Selection Modal */}
            <AnimatePresence>
                {showPlanSelectionModal && planSelectionData && (
                    <motion.div
                        className="fixed inset-0 z-[201] flex items-center justify-center bg-white/10 backdrop-blur-xl px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isProcessing && setShowPlanSelectionModal(false)}
                    >
                        <motion.div
                            className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => !isProcessing && setShowPlanSelectionModal(false)}
                                disabled={isProcessing}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                                    <Users className="w-8 h-8 text-amber-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Parent Already Linked
                                </h2>
                                <p className="text-gray-600 mb-2">
                                    This parent account is already linked with {planSelectionData.existingChildrenCount} {planSelectionData.existingChildrenCount === 1 ? 'child' : 'children'}.
                                </p>
                                {/* Contact Parent Option */}
                                <div className="w-full text-center text-sm text-red-600 mb-1">Ask your parent to create your account for you
                                </div>
                                <p className="text-black font-bold text-center"> OR </p>
                            </div>

                            <div className="space-y-2">
                                {/* Free Plan Option */}
                                <motion.button
                                    type="button"
                                    onClick={() => handlePlanSelection('free')}
                                    disabled={isProcessing}
                                    className="w-full p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-left hover:border-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-200 rounded-xl">
                                            <Zap className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900">Continue with Free Plan</h3>
                                                <span className="text-lg font-bold text-green-600">₹0</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Basic access with limited features
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Student Premium Plan Option */}
                                <motion.button
                                    type="button"
                                    onClick={() => handlePlanSelection('student_premium')}
                                    disabled={isProcessing}
                                    className="w-full p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl text-left hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-200 rounded-xl">
                                            <Shield className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900">Students Premium Plan</h3>
                                                <span className="text-lg font-bold text-blue-600">₹4,499</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Full access to all 10 pillars, 2200+ games, and premium features
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-blue-600">
                                                <CreditCard className="w-4 h-4" />
                                                <span>Payment required</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Student + Parent Premium Pro Plan Option */}
                                <motion.button
                                    type="button"
                                    onClick={() => handlePlanSelection('student_parent_premium_pro')}
                                    disabled={isProcessing}
                                    className="w-full p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl text-left hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-200 rounded-xl">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900">Student + Parent Premium Pro</h3>
                                                <span className="text-lg font-bold text-purple-600">₹4,999</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Everything in Students Premium + Parent Dashboard & Family Features
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-purple-600">
                                                <CreditCard className="w-4 h-4" />
                                                <span>Payment required</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            </div>

                            {isProcessing && (
                                <div className="mt-6 flex items-center justify-center gap-3 text-gray-600">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Processing...</span>
                                </div>
                            )}
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

export default Register;