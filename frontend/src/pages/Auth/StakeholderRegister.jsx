import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; //eslint-disable-line
import { Eye, EyeOff, Mail, Lock, User, UserCheck, ArrowRight, Building, Phone, Globe, MapPin, Briefcase, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthUtils";
import { toast } from "react-hot-toast";

const StakeholderRegister = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 6;
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "csr",
        organization: "",
        phone: "",
        website: "",
        registrationNumber: "",
        industry: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { setUser } = useAuth();

    // Step definitions
    const steps = [
        { number: 1, title: "Basic Information", icon: User },
        { number: 2, title: "Security", icon: Lock },
        { number: 3, title: "Contact Details", icon: Phone },
        { number: 4, title: "Company Details", icon: Briefcase },
        { number: 5, title: "Address", icon: MapPin },
        { number: 6, title: "Review", icon: CheckCircle2 },
    ];

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setFormData({
            ...formData,
            password: newPassword
        });
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleConfirmPasswordChange = (e) => {
        setFormData({
            ...formData,
            confirmPassword: e.target.value
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    // Step validation
    const validateStep = (step) => {
        const newErrors = {};
        
        switch (step) {
            case 1:
                if (!formData.name.trim()) newErrors.name = "Full name is required";
                if (!formData.email.trim()) newErrors.email = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = "Invalid email format";
                }
                if (!formData.organization.trim()) newErrors.organization = "Organization name is required";
                break;
            case 2:
                if (!formData.password) newErrors.password = "Password is required";
                else if (formData.password.length < 6) {
                    newErrors.password = "Password must be at least 6 characters";
                }
                if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
                else if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = "Passwords do not match";
                }
                break;
            case 3:
            case 4:
            case 5:
                // Optional steps - no validation required
                break;
            default:
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(2)) {
            setCurrentStep(2);
            return;
        }

        setIsLoading(true);

        try {
            // Build address object only if at least one address field is provided
            const addressFields = {
                street: formData.street?.trim(),
                city: formData.city?.trim(),
                state: formData.state?.trim(),
                postalCode: formData.postalCode?.trim(),
                country: formData.country?.trim(),
            };
            const hasAddressData = Object.values(addressFields).some(val => val);

            const requestData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: "csr",
                organization: formData.organization.trim(),
                ...(formData.phone?.trim() && { phone: formData.phone.trim() }),
                ...(formData.website?.trim() && { website: formData.website.trim() }),
                ...(formData.registrationNumber?.trim() && { registrationNumber: formData.registrationNumber.trim() }),
                ...(formData.industry?.trim() && { industry: formData.industry.trim() }),
                ...(hasAddressData && { address: addressFields }),
            };

            // Doc alignment: use POST /api/csr/register for CSR self-registration
            const registerUrl = formData.role === "csr"
                ? "/api/csr/register"
                : `/api/auth/register-stakeholder?t=${Date.now()}`;
            await api.post(registerUrl, requestData);

            // Auto-login after successful registration
            try {
                const loginResponse = await api.post("/api/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });

                const token = loginResponse.data?.token;
                const userData = loginResponse.data?.user;

                if (token && userData) {
                    localStorage.setItem("finmen_token", token);
                    
                    // Log for debugging
                    console.log("Registration auto-login - User data:", {
                        role: userData.role,
                        approvalStatus: userData.approvalStatus,
                        email: userData.email
                    });
                    
                    // Determine redirect path BEFORE updating context to prevent race conditions
                    let redirectPath = "/csr/pending-approval"; // Default
                    let toastMessage = "CSR account created successfully! Your account is pending admin approval.";
                    
                    if (userData.approvalStatus === "pending") {
                        redirectPath = "/csr/pending-approval";
                        toastMessage = "CSR account created successfully! Your account is pending admin approval.";
                    } else if (userData.approvalStatus === "rejected") {
                        redirectPath = "/csr/rejected";
                        toastMessage = "Your CSR account has been rejected. Please contact administration.";
                    } else if (userData.approvalStatus === "approved") {
                        redirectPath = "/csr/overview";
                        toastMessage = "CSR account created successfully!";
                    }
                    
                    // Update user context
                    const enhancedUser = {
                        ...userData,
                        isApproved: userData.approvalStatus === "approved",
                    };
                    setUser(enhancedUser);

                    // Navigate immediately - don't use setTimeout to avoid race conditions
                    if (userData.approvalStatus === "rejected") {
                        toast.error(toastMessage);
                    } else {
                        toast.success(toastMessage);
                    }
                    navigate(redirectPath, { replace: true });
                } else {
                    // If auto-login fails, redirect to login page
                    toast.success("CSR account created successfully! Please log in.");
                    navigate("/login", { replace: true });
                }
            } catch (loginErr) {
                // If auto-login fails (e.g., account pending), handle appropriately
                console.error("Auto-login failed:", loginErr);
                if (loginErr.response?.status === 403) {
                    const approvalStatus = loginErr.response?.data?.approvalStatus;
                    if (approvalStatus === "pending") {
                        toast.success("CSR account created successfully! Your account is pending admin approval.");
                        navigate("/csr/pending-approval", { replace: true });
                    } else if (approvalStatus === "rejected") {
                        toast.error("Your CSR account has been rejected. Please contact administration.");
                        navigate("/csr/rejected", { replace: true });
                    } else {
                        toast.success("CSR account created successfully! Please log in.");
                        navigate("/login", { replace: true });
                    }
                } else {
                    toast.success("CSR account created successfully! Please log in.");
                    navigate("/login", { replace: true });
                }
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
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

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'from-red-500 to-orange-500';
        if (passwordStrength <= 3) return 'from-yellow-500 to-amber-500';
        return 'from-green-500 to-emerald-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        return 'Strong';
    };

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-5 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border ${errors.name ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm`}
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                    <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    name="organization"
                                    placeholder="Enter organization name"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                    required
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border ${errors.organization ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm`}
                                />
                                {errors.organization && <p className="text-red-400 text-xs mt-1">{errors.organization}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border ${errors.email ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm`}
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-5 sm:space-y-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    required
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-white/5 border ${errors.password ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {formData.password && (
                            <AnimatePresence>
                                <motion.div
                                    className="space-y-2"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Password Strength</span>
                                        <span className={`text-xs font-medium bg-gradient-to-r ${getPasswordStrengthColor()} bg-clip-text text-transparent`}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1">
                                        <motion.div
                                            className={`h-1 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-white/5 border ${errors.confirmPassword ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {formData.confirmPassword && (
                            <AnimatePresence>
                                <motion.div
                                    className="flex items-center space-x-2"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${formData.password === formData.confirmPassword ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className={`text-xs sm:text-sm ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                        {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-5 sm:space-y-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                placeholder="Enter website URL"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-5 sm:space-y-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                Company Registration Number
                            </label>
                            <input
                                type="text"
                                name="registrationNumber"
                                placeholder="Enter registration number"
                                value={formData.registrationNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                                Industry Sector
                            </label>
                            <input
                                type="text"
                                name="industry"
                                placeholder="Enter industry sector"
                                value={formData.industry}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            />
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-5 sm:space-y-6">
                        <div className="flex items-center gap-2 text-gray-300 text-xs mb-3">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>All address fields are optional</span>
                        </div>
                        
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                name="street"
                                placeholder="Enter street address"
                                value={formData.street}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="Enter postal code"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Enter country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            />
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-5 sm:space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Review Your Information</h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-400 text-sm">Full Name:</span>
                                    <span className="text-white text-sm font-medium text-right">{formData.name || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-400 text-sm">Organization:</span>
                                    <span className="text-white text-sm font-medium text-right">{formData.organization || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-400 text-sm">Email:</span>
                                    <span className="text-white text-sm font-medium text-right">{formData.email || "Not provided"}</span>
                                </div>
                                {formData.phone && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 text-sm">Phone:</span>
                                        <span className="text-white text-sm font-medium text-right">{formData.phone}</span>
                                    </div>
                                )}
                                {formData.website && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 text-sm">Website:</span>
                                        <span className="text-white text-sm font-medium text-right break-all">{formData.website}</span>
                                    </div>
                                )}
                                {formData.registrationNumber && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 text-sm">Registration Number:</span>
                                        <span className="text-white text-sm font-medium text-right">{formData.registrationNumber}</span>
                                    </div>
                                )}
                                {formData.industry && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 text-sm">Industry:</span>
                                        <span className="text-white text-sm font-medium text-right">{formData.industry}</span>
                                    </div>
                                )}
                                {(formData.street || formData.city || formData.state || formData.postalCode || formData.country) && (
                                    <div className="pt-2 border-t border-white/10">
                                        <div className="text-gray-400 text-sm mb-2">Address:</div>
                                        <div className="text-white text-sm space-y-1">
                                            {formData.street && <div>{formData.street}</div>}
                                            <div>
                                                {[formData.city, formData.state, formData.postalCode].filter(Boolean).join(", ")}
                                            </div>
                                            {formData.country && <div>{formData.country}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
                            <p className="text-blue-300 text-xs">
                                <strong>Note:</strong> Your account will be reviewed by our team and you'll be notified once approved.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Gradient Orbs */}
                <motion.div
                    className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Floating particles */}
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8 overflow-y-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 z-50"
                >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                    <span className="sm:block hidden">Back</span>
                </button>

                <motion.div
                    className="w-full max-w-2xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Register Card */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* Header */}
                        <motion.div
                            className="text-center px-5 sm:px-8 pt-5 sm:pt-6 pb-4"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-2 sm:mb-3"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </motion.div>

                            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                CSR Partner Registration
                            </h1>
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.title}
                            </p>
                        </motion.div>

                        {/* Step Indicators */}
                        <div className="px-5 sm:px-8 pb-4 border-b border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = currentStep === step.number;
                                    const isCompleted = currentStep > step.number;
                                    
                                    return (
                                        <div key={step.number} className="flex items-center flex-shrink-0">
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                isCompleted 
                                                    ? 'bg-green-500 text-white' 
                                                    : isActive 
                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                                                        : 'bg-white/10 text-gray-400'
                                            }`}>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                ) : (
                                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                )}
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`w-6 sm:w-12 h-0.5 mx-1.5 sm:mx-2 ${
                                                    isCompleted ? "bg-purple-500" : "bg-white/20"
                                                }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-white/10 rounded-full h-1">
                                <motion.div
                                    className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                            <div className="p-5 sm:p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderStepContent()}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between mt-6 sm:mt-8 pt-6 border-t border-white/10">
                                    <motion.button
                                        type="button"
                                        onClick={handlePrevious}
                                        disabled={currentStep === 1}
                                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                                            currentStep === 1
                                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                                : 'bg-white/10 hover:bg-white/20 text-white'
                                        }`}
                                        whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
                                        whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Previous</span>
                                    </motion.button>

                                    {currentStep < totalSteps ? (
                                        <motion.button
                                            type="submit"
                                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>Next</span>
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                                            whileHover={!isLoading ? { scale: 1.05 } : {}}
                                            whileTap={!isLoading ? { scale: 0.95 } : {}}
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                            ) : (
                                                <>
                                                    <span>Create CSR Account</span>
                                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Login Link */}
                        <motion.div
                            className="text-center mt-6 pt-5 pb-6 border-t border-white/10"
                            variants={itemVariants}
                        >
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Already have an account?{' '}
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
        </div>
    );
};

export default StakeholderRegister;
