import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line
import {
  School,
  Mail,
  Lock,
  BookOpen,
  User,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const createInitialFormState = () => ({
  schoolName: "",
  schoolId: "",
  email: "",
  password: "",
  confirmPassword: "",
  contactInfo: {
    phone: "",
    address: "",
    website: "",
    city: "",
    state: "",
    pincode: ""
  },
  academicInfo: {
    board: "",
    establishedYear: "",
    totalStudents: "",
    totalTeachers: ""
  }
});

const SchoolRegistration = () => {
  const [formData, setFormData] = useState(() => createInitialFormState());
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState("whatYouGet");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [pendingApprovalInfo, setPendingApprovalInfo] = useState(null);
  const navigate = useNavigate();
  const activeStepRef = useRef(null);
  const progressContainerRef = useRef(null);

  // Auto-scroll to active step on mobile
  useEffect(() => {
    if (activeStepRef.current && progressContainerRef.current) {
      const container = progressContainerRef.current;
      const activeStep = activeStepRef.current;
      
      // Only auto-scroll on mobile devices
      if (window.innerWidth < 640) {
        const containerRect = container.getBoundingClientRect();
        const activeStepRect = activeStep.getBoundingClientRect();
        
        const scrollLeft = activeStep.offsetLeft - containerRect.width / 2 + activeStepRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [step]);

  const boardOptions = [
    { value: "cbse", label: "CBSE" },
    { value: "icse", label: "ICSE" },
    { value: "state", label: "State Board" },
    { value: "ib", label: "IB" },
    { value: "igcse", label: "IGCSE" }
  ];

  const whatYouGetHighlights = [
    "Teacher Dashboard — class-level performance and student well-being overview.",
    "Teacher Mental Well-being Module — emotional balance and stress awareness tools.",
    "Inavora Presentation with AI — analytics and insights for students, teachers, and school leaders.",
    "School Impact Dashboard — track progress across grades and classes.",
    "Customizable Challenges — run school, state, or CSR-level missions.",
    "WiseImpact CSR Dashboard — visualize your institution’s overall contribution to student growth.",
    "Parent Integration — optional dashboards for emotional and academic visibility.",
    "NEP 2020 & CBSE Life-Skills Ready — mapped to well-being and value education guidelines.",
    "AI-Powered Insights — predictive patterns for engagement and learning readiness.",
    "Dedicated Onboarding & Support — training and launch assistance for partner schools."
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contactInfo.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }));
    } else if (name.startsWith("academicInfo.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          [field]: value,
        },
      }));
    } else {
      if (name === "email") {
        setEmailError(value.includes("@") || value.trim() === "" ? "" : "Please enter a valid email address.");
      }

      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/company/signup", {
        name: formData.schoolName,
        email: formData.email,
        password: formData.password,
        contactInfo: formData.contactInfo,
        type: "school",
        academicInfo: formData.academicInfo,
        schoolId: formData.schoolId
      });
      if (response.data?.status === "pending") {
        setPendingApprovalInfo({
          message: response.data?.message || "Your registration is under review. You will be able to log in once an admin approves your account.",
          email: formData.email,
          status: "pending"
        });
        setShowSuccessModal(true);
        toast.success("Registration submitted for approval. We'll notify you once it's reviewed.");
        setFormData(createInitialFormState());
        setStep(1);
      } else if (response.data && response.data.token && response.data.user) {
        localStorage.setItem("finmen_token", response.data.token);
        setShowSuccessModal(true);
        setPendingApprovalInfo({
          message: "Registration successful.",
          status: "approved"
        });
        setTimeout(() => {
          navigate("/school/admin/dashboard");
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      if (error.response?.data?.error === 'DUPLICATE_EMAIL') {
        toast.error("A school with this email already exists. Please use a different email.");
      } else if (error.response?.data?.error === 'DUPLICATE_INSTITUTION_ID') {
        toast.error("School ID already exists. Please use a different School ID.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const handleNext = () => {
    // Validate current step before proceeding
    let errorMessage = "";

    if (step === 1) {
      // Validate basic information
      if (!formData.schoolName.trim()) {
        errorMessage = "School name is required";
      } else if (!formData.schoolId.trim()) {
        errorMessage = "School ID is required";
      } else if (!formData.email.trim()) {
        errorMessage = "Email is required";
      } else if (!formData.email.includes("@")) {
        errorMessage = "Please enter a valid email address";
      } else if (!formData.password) {
        errorMessage = "Password is required";
      } else if (formData.password !== formData.confirmPassword) {
        errorMessage = "Passwords do not match";
      } else if (formData.password.length < 6) {
        errorMessage = "Password must be at least 6 characters";
      }
    } else if (step === 2) {
      // Validate contact information
      if (!formData.contactInfo.phone.trim()) {
        errorMessage = "Phone number is required";
      } else if (!formData.contactInfo.address.trim()) {
        errorMessage = "Address is required";
      } else if (!formData.contactInfo.city.trim()) {
        errorMessage = "City is required";
      } else if (!formData.contactInfo.state.trim()) {
        errorMessage = "State is required";
      } else if (!formData.contactInfo.pincode.trim()) {
        errorMessage = "Pincode is required";
      }
    } else if (step === 3) {
      // Validate academic information
      if (!formData.academicInfo.board.trim()) {
        errorMessage = "Educational board is required";
      }
    }

    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      setStep(step + 1);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", description: "School details and credentials" },
    { number: 2, title: "Contact Information", description: "Address and contact details" },
    { number: 3, title: "Academic Setup", description: "Board, establishment, and staffing details" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Back Buttons - Adjusted for mobile */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
        >
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
          <span className="sm:block hidden">Back</span>
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-8 max-w-md w-full text-center"
          >
            <CheckCircle className={`w-12 h-12 sm:w-16 sm:h-16 ${pendingApprovalInfo?.status === "approved" ? "text-green-400" : "text-amber-300"} mx-auto mb-3 sm:mb-4`} />
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
              {pendingApprovalInfo?.status === "approved"
                ? "School Registered Successfully!"
                : "Registration Submitted"}
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
              {pendingApprovalInfo?.message ||
                "Your school registration is complete. You can now log in to your account and start using the platform."}
            </p>
            {pendingApprovalInfo?.email && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-200 mb-4">
                <p className="font-semibold text-white">Registered Email</p>
                <p className="text-purple-200 break-words">{pendingApprovalInfo.email}</p>
              </div>
            )}
            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
              onClick={() => {
                setShowSuccessModal(false);
                setPendingApprovalInfo(null);
                navigate("/login");
              }}
            >
              Back to Login
            </button>
          </motion.div>
        </div>
      )}
      {/* Main Content - Added responsive padding */}
      <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex border-b border-white/10">
            {[
              { id: "whatYouGet", label: "What You Get" },
              { id: "register", label: "Register" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "whatYouGet" && (
            <div className="p-0 sm:p-6 space-y-0 sm:space-y-6">
              <div className="relative overflow-hidden sm:rounded-2xl rounded-none p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/70 via-purple-500/80 to-pink-500/80 blur-2xl opacity-40"></div>
                <div className="bg-gradient-to-br from-[#1a1f4d] via-[#351f57] to-[#521b6a] relative sm:rounded-2xl rounded-none z-[1] p-3 sm:p-4 border border-white/10 shadow-[0_10px_40px_rgba(109,40,217,0.35)]">
                  <div className="absolute -top-10 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/20 via-sky-200/20 to-transparent rounded-full blur-2xl opacity-70"></div>
                  <div className="absolute -bottom-12 -left-6 w-40 h-40 bg-gradient-to-br from-pink-400/30 via-transparent to-transparent rounded-full blur-3xl opacity-60"></div>
                  <p className="text-center relative z-[2] text-sm sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-purple-100 to-pink-200 drop-shadow-[0_2px_6px_rgba(59,130,246,0.35)]">
                    Everything from
                    <span className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 via-rose-500/40 to-purple-500/30 border border-white/20 text-amber-100 text-[8px] sm:text-sm uppercase tracking-[0.2em] shadow-[0_8px_20px_rgba(236,72,153,0.35)]">
                      Student + Parent Premium Pro Plan
                    </span>
                  </p>
                </div>
              </div>

              <div className="sm:space-y-4 space-y-2 sm:p-0 p-3">
                <p className="uppercase text-xs sm:text-sm font-bold text-pink-200 tracking-[0.25em]">PLUS</p>
                <ul className="space-y-2 sm:space-y-4">
                  {whatYouGetHighlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200 text-xs sm:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "register" && (
            <>
              <div className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div
                  ref={progressContainerRef}
                  className="flex items-center justify-between pb-2 overflow-x-auto sm:overflow-x-hidden"
                >
                  {steps.map((stepItem, index) => (
                    <div
                      key={stepItem.number}
                      className="flex items-center flex-shrink-0"
                      ref={stepItem.number === step ? activeStepRef : null}
                    >
                      <div
                        className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${
                          step >= stepItem.number
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-white/10 text-gray-400"
                        } ${stepItem.number > step ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => stepItem.number <= step && setStep(stepItem.number)}
                      >
                        {step > stepItem.number ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          stepItem.number
                        )}
                      </div>
                      <div className="ml-2 sm:ml-3 min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-medium ${
                            stepItem.number <= step ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {stepItem.title}
                        </p>
                        <p
                          className={`text-xs hidden sm:block ${
                            stepItem.number <= step ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {stepItem.description}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-8 sm:w-16 h-0.5 mx-2 ${
                            step > stepItem.number ? "bg-purple-500" : "bg-white/20"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5 sm:space-y-6"
                    >

                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <School className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              School Name *
                            </label>
                            <input
                              type="text"
                              name="schoolName"
                              value={formData.schoolName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="Enter school name"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              School ID *
                            </label>
                            <input
                              type="text"
                              name="schoolId"
                              value={formData.schoolId}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="Enter unique school ID"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                            Email Address *
                          </label>
                          <div className="space-y-2">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm ${emailError ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-white/20"}`}
                              placeholder="Enter email address"
                            />
                            <AnimatePresence>
                              {emailError && (
                                <motion.p
                                  className="text-red-400 text-xs sm:text-sm"
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                >
                                  {emailError}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              Password *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                                placeholder="Create password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-300 hover:text-white transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              Confirm Password *
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                                placeholder="Confirm password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-300 hover:text-white transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {formData.confirmPassword && (
                            <motion.div
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <div
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${passwordsMatch ? "bg-green-500" : "bg-red-500"}`}
                              />
                              <span
                                className={`text-xs sm:text-sm ${passwordsMatch ? "text-green-400" : "text-red-400"}`}
                              >
                                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Contact Information */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="contactInfo.phone"
                              value={formData.contactInfo.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="Enter phone number"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              Website
                            </label>
                            <input
                              type="url"
                              name="contactInfo.website"
                              value={formData.contactInfo.website}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="https://yourschool.edu"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                            Address *
                          </label>
                          <input
                            type="text"
                            name="contactInfo.address"
                            value={formData.contactInfo.address}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            placeholder="Enter full address"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="contactInfo.city"
                              value={formData.contactInfo.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="Enter city"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              name="contactInfo.state"
                              value={formData.contactInfo.state}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="Enter state"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              name="contactInfo.pincode"
                              value={formData.contactInfo.pincode}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="Enter pincode"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Academic Setup */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-5 sm:gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              Educational Board *
                            </label>
                            <select
                              name="academicInfo.board"
                              value={formData.academicInfo.board}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                            >
                              <option value="">Select Board</option>
                              {boardOptions.map((option) => (
                                <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                              Year of Establishment
                            </label>
                            <input
                              type="number"
                              name="academicInfo.establishedYear"
                              value={formData.academicInfo.establishedYear}
                              onChange={handleInputChange}
                              min="1800"
                              max={new Date().getFullYear()}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                              placeholder="Enter establishment year"
                            />
                          </div>
                        </div>

                        <div className="bg-white/10 p-5 rounded-xl">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                Total Students
                              </label>
                              <input
                                type="number"
                                name="academicInfo.totalStudents"
                                value={formData.academicInfo.totalStudents}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                                placeholder="Enter total students"
                              />
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                                Total Teachers
                              </label>
                              <input
                                type="number"
                                name="academicInfo.totalTeachers"
                                value={formData.academicInfo.totalTeachers}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                                placeholder="Enter total teachers"
                              />
                            </div>
                          </div>
                            <p className="text-xs sm:text-sm text-yellow-400 mt-4 text-center"> * Mention only the number of students and teachers that you want to register on Wise Student *</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(step > 1 ? step - 1 : 1)}
                      disabled={step === 1}
                      className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm ${
                        step === 1 ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Previous
                    </button>

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all text-xs sm:text-sm"
                      >
                        Next
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-xs sm:text-sm"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full mr-1.5 sm:mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span className="text-xs sm:text-sm">Registering...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs sm:text-sm">Register School</span>
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>

                <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Already have a School account?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors relative group text-xs sm:text-sm"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
