import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import MainFooter from "../components/MainFooter";
import NationalAlignments from "../components/NationalAlignments";
import CheckoutModal from "../components/Payment/CheckoutModal";
import InstallPWA from "../components/InstallPWA";
import { useAuth } from "../context/AuthUtils";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
  School,
  GraduationCap,
  Users,
  Building,
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Brain,
  Target,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import kidsImage from "../assets/kids.png";

const AutoSlidingCards = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const intervalRef = React.useRef(null);

  const cards = [
    {
      title: "For Students",
      content: [
        "Learn Through Play – 2,000+ games that make growth exciting.",
        "Skills for Life – From money management to mental wellness.",
        "Future-First – Early exposure to AI, tech, and innovation.",
        "Confidence & Balance – Build strong values, health, and clarity.",
        "Heal Coins & Rewards – Celebrate progress and achievements.",
      ],
      color: "from-blue-500 to-cyan-500",
      icon: "🎓",
    },
    {
      title: "For Parents",
      content: [
        "Progress You Can See – Beyond marks, track growth in skills.",
        "Peace of Mind – Tools for resilience, safety, and well-being.",
        "Beyond Textbooks – Education that shapes character and confidence.",
        "Exclusive-wellbeing labs – AI nudges and 24x7 support.",
        "Partnership – Parents play an active role in their child's journey.",
        
      ],
      color: "from-rose-500 to-red-500",
      icon: "👨‍👩‍👧",
    },
    {
      title: "For Teachers",
      content: [
        "Supportive Tools – Life skills content that complements teaching.",
        "Stronger Classrooms – Students with better focus and resilience.",
        "Aligned Resources – Matches NEP 2020 & national goals.",
        "Less Stress – A partner in guiding student well-being.",
        "Recognition & Rewards – Heal Coins for guiding engaged learners.",
      ],
      color: "from-green-500 to-emerald-500",
      icon: "👩‍🏫",
    },
    {
      title: "For Schools & Institutions",
      content: [
        "Holistic Edge – Differentiate with life skills beyond academics.",
        "Future-Ready Reputation – Position as pioneers of new education.",
        "Community Trust – Parents see added value in your institution.",
        "Unified Platform – Growth + engagement + management together.",
        "School Rewards – Achieve milestones as a National Leaders.",
      ],
      color: "from-amber-500 to-orange-500",
      icon: "🏫",
    },
  ];

  React.useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, cards.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getCardPosition = (index) => {
    const diff = (index - currentIndex + cards.length) % cards.length;

    if (diff === 0) return "center";
    if (diff === 1 || diff === -3) return "right";
    if (diff === cards.length - 1 || diff === -1) return "left";
    return "hidden";
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[500px] max-w-7xl mx-auto">
        {cards.map((card, index) => {
          const position = getCardPosition(index);

          return (
            <div
              key={index}
              className={`absolute top-1/2 left-1/2 transition-all duration-700 ease-out ${position === "center"
                ? "translate-x-[-50%] translate-y-[-50%] scale-100 z-30 opacity-100"
                : position === "right"
                  ? "translate-x-[20%] translate-y-[-50%] scale-75 z-10 opacity-60"
                  : position === "left"
                    ? "translate-x-[-120%] translate-y-[-50%] scale-75 z-10 opacity-60"
                    : "translate-x-[-50%] translate-y-[-50%] scale-50 z-0 opacity-0"
                }`}
              style={{
                width: "550px",
                maxWidth: "90vw",
              }}
            >
              <div
                className={`bg-gradient-to-br ${card.color
                  } rounded-3xl p-8 text-white shadow-2xl h-[400px] sm:h-[320px] flex flex-col relative overflow-hidden transition-transform duration-300 ${position === "center" ? "hover:scale-105" : ""
                  }`}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-start gap-3 mb-8">
                  <div className="sm:text-5xl text-3xl">{card.icon}</div>
                  <div className="sm:text-3xl text-2xl font-bold">{card.title}</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    {card.content.map((item, i) => {
                      const dashIndex = item.indexOf('–');
                      const boldText = dashIndex !== -1 ? item.substring(0, dashIndex).trim() : item;
                      const normalText = dashIndex !== -1 ? item.substring(dashIndex).trim() : '';
                      
                      return (
                        <div key={i} className="flex items-start">
                          <span className="text-white sm:text-sm text-xs leading-relaxed">
                            <span className="font-bold">{boldText}</span>
                            {normalText && <span className="font-normal"> {normalText}</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-2 space-x-3">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${index === currentIndex
              ? "w-10 h-3 bg-gradient-to-r from-blue-600 to-purple-600"
              : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userTypesRef = useRef(null);
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const whyChooseRef = useRef(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const studentServicesRef = useRef(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const services = [
    {
      title: "RBI Financial Literacy Centres",
      logo: "🏦",
    },
    {
      title: "SEBI Investor Education",
      logo: "📈",
    },
    {
      title: "NCFE",
      logo: "🎓",
    },
    {
      title: "PM Jan Dhan Yojana",
      logo: "💰",
    },
    {
      title: "National Mental Health Programme",
      logo: "🧠",
    },
    {
      title: "MANAS App",
      logo: "📱",
    },
    {
      title: "Ayushman Bharat School Health",
      logo: "🏥",
    },
    {
      title: "NCERT Life Skills",
      logo: "🌟",
    },
    {
      title: "UNICEF Adolescent Development",
      logo: "👥",
    },
    {
      title: "Youth Affairs Programmes",
      logo: "🎯",
    },
    {
      title: "MeitY Cyber Surakshit Bharat",
      logo: "🛡️",
    },
    {
      title: "Cyber Safety Drives",
      logo: "🔒",
    },
    {
      title: "NCERT ICT Curriculum",
      logo: "💻",
    },
    {
      title: "NCERT Value Education",
      logo: "📚",
    },
    {
      title: "Ministry of Culture Initiatives",
      logo: "🎭",
    },
    {
      title: "Nehru Yuva Kendra",
      logo: "🏛️",
    },
    {
      title: "NITI Aayog",
      logo: "🤖",
    },
    {
      title: "CBSE AI Curriculum",
      logo: "🧠",
    },
    {
      title: "Digital India",
      logo: "💻",
    },
    {
      title: "Ayushman Bharat",
      logo: "🏥",
    },
    {
      title: "Rashtriya Kishor Swasthya Karyakram (RKSK)",
      logo: "💪",
    },
    {
      title: "Fit India",
      logo: "🏃",
    },
    {
      title: "Menstrual Hygiene Scheme",
      logo: "🌸",
    },
    {
      title: "Beti Bachao Beti Padhao",
      logo: "👧",
    },
    {
      title: "Poshan Abhiyan",
      logo: "🥗",
    },
    {
      title: "Atal Innovation Mission",
      logo: "🚀",
    },
    {
      title: "Skill India",
      logo: "🛠️",
    },
    {
      title: "Startup India",
      logo: "💡",
    },
    {
      title: "NSS",
      logo: "🎓",
    },
    {
      title: "Swachh Bharat Mission",
      logo: "🧹",
    },
    {
      title: "Ek Bharat Shreshtha Bharat",
      logo: "🇮🇳",
    },
    {
      title: "UN SDG 4.7",
      logo: "🌍",
    },
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Financial Literacy",
      description: "Smart with money from day one.",
      color: "from-emerald-500 to-green-500",
      details: {
        whatStudentsLearn: [
          "Saving vs spending",
          "Budgeting",
          "UPI & digital banking basics",
          "Scam awareness",
          "Goal-based investing"
        ],
        whyItMatters: [
          "Creates financially aware, confident youth who are less vulnerable to fraud",
          "Better prepared for entrepreneurship and independent living"
        ],
        nationalAlignment: [
          "RBI Financial Literacy Centres",
          "SEBI Investor Education",
          "NCFE",
          "PM Jan Dhan Yojana"
        ]
      }
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Mental Health",
      description: "Balanced, resilient, and emotionally strong.",
      color: "from-purple-500 to-pink-500",
      details: {
        whatStudentsLearn: [
          "Stress management",
          "Resilience",
          "Emotional regulation",
          "Peer support"
        ],
        whyItMatters: [
          "Improves focus, attendance, and emotional well-being",
          "Reduces anxiety and classroom disruption"
        ],
        nationalAlignment: [
          "National Mental Health Programme",
          "MANAS App",
          "Ayushman Bharat School Health"
        ]
      }
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Life Skills & Values (UVLS)",
      description: "Empathy, respect, and problem-solving.",
      color: "from-orange-500 to-rose-500",
      details: {
        whatStudentsLearn: [
          "Empathy",
          "Teamwork",
          "Respect",
          "Communication skills",
          "Better decision-making",
          "Conflict resolution"
        ],
        whyItMatters: [
          "Develops compassionate, socially responsible students",
          "Creates a harmonious school environment"
        ],
        nationalAlignment: [
          "NCERT Life Skills",
          "UNICEF Adolescent Development",
          "Ministry of Youth Affairs Programmes"
        ]
      }
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Digital Citizenship & Online Safety",
      description: "Safe, ethical, and confident in the online world.",
      color: "from-cyan-500 to-blue-500",
      details: {
        whatStudentsLearn: [
          "Safe internet use",
          "Cyberbullying awareness",
          "Password and OTP protection",
          "Digital balance"
        ],
        whyItMatters: [
          "Protects students from online threats",
          "Prepares them to use technology responsibly and productively"
        ],
        nationalAlignment: [
          "MeitY Cyber Surakshit Bharat",
          "Cyber Safety Drives",
          "NCERT ICT Curriculum"
        ]
      }
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Moral Values",
      description: "Honesty, kindness, and integrity in action.",
      color: "from-amber-500 to-yellow-500",
      details: {
        whatStudentsLearn: [
          "Honesty",
          "Kindness",
          "Respect",
          "Integrity",
          "Responsibility",
          "Cultural awareness",
          "Ethical decision-making"
        ],
        whyItMatters: [
          "Builds strong character, trust, and discipline within the school and community",
          "Builds empathy, respect, and responsibility that strengthen relationships and social harmony",
          "Inspires ethical thinking, integrity, and fairness in daily actions and decision-making."
        ],
        nationalAlignment: [
          "NCERT Value Education",
          "Ministry of Culture Initiatives",
          "Nehru Yuva Kendra"
        ]
      }
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "AI for All",
      description: "Early exposure to tomorrow's technologies.",
      color: "from-indigo-500 to-purple-500",
      details: {
        whatStudentsLearn: [
          "Basics of Artificial Intelligence",
          "Automation",
          "Data ethics"
        ],
        whyItMatters: [
          "Prepares students for emerging digital careers",
          "Aligns with the NEP 2020 vision for a tech-enabled future"
        ],
        nationalAlignment: [
          "NITI Aayog #AIForAll",
          "CBSE AI Curriculum",
          "Digital India"
        ]
      }
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health & Wellness",
      description: "Hygiene, fitness, self-awareness, menstrual health, nutrition, and self-care.",
      color: "from-pink-500 to-rose-500",
      details: {
        whatStudentsLearn: [
          "Hygiene and self-care",
          "Puberty and physical changes",
          "Fitness and nutrition",
          "Menstrual health",
          "Reproductive well-being",
          "Body positivity"
        ],
        whyItMatters: [
          "Promotes confidence, healthy habits, and positive attitudes towards growing up",
          "Reduces absenteeism and empowers participation",
          "Supports healthy adolescence for all students"
        ],
        nationalAlignment: [
          "Ayushman Bharat",
          "Rashtriya Kishor Swasthya Karyakram (RKSK)",
          "Fit India",
          "Menstrual Hygiene Scheme",
          "Beti Bachao Beti Padhao",
          "Poshan Abhiyan"
        ]
      }
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Entrepreneurship & Higher Education",
      description: "Clarity, creativity, and innovation.",
      color: "from-red-500 to-orange-500",
      details: {
        whatStudentsLearn: [
          "Leadership",
          "Creativity",
          "Innovation",
          "Financial planning",
          "Higher education and career choices"
        ],
        whyItMatters: [
          "Inspires future entrepreneurs",
          "Improves career clarity",
          "Reduces dropout rates by showing clear pathways"
        ],
        nationalAlignment: [
          "Atal Innovation Mission",
          "Skill India",
          "Startup India"
        ]
      }
    },
    {
      icon: <School className="w-8 h-8" />,
      title: "Civic Responsibility & Global Citizenship",
      description: "Rights, duties, and global citizenship.",
      color: "from-blue-500 to-indigo-500",
      details: {
        whatStudentsLearn: [
          "Civic duties",
          "Volunteering",
          "Environmental care",
          "Cultural respect",
          "UN Sustainable Development Goals"
        ],
        whyItMatters: [
          "Shapes responsible, globally aware citizens who contribute to society and respect diversity",
          "Builds socially responsible citizens who contribute positively to their communities"

        ],
        nationalAlignment: [
          "NSS",
          "Swachh Bharat Mission",
          "Ek Bharat Shreshtha Bharat",
          "UN SDG 4.7"
        ]
      }
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Sustainability",
      description: "Rights, duties, and global citizenship.",
      color: "from-green-500 to-emerald-500",
      details: {
        whatStudentsLearn: [
          "Environmental conservation",
          "Sustainable practices",
          "Climate change awareness",
          "Resource management",
          "Circular economy concepts"
        ],
        whyItMatters: [
          "Addresses global challenges",
          "Builds environmental consciousness",
          "Promotes responsible consumption",
          "Prepares for green economy"
        ],
        nationalAlignment: [
          "National Action Plan on Climate Change",
          "Swachh Bharat Mission",
          "Sustainable Development Goals",
          "Green Skill Development Programme"
        ]
      }
    },
  ];

  const userTypes = [
    {
      title: "Individual Students",
      description:
        "Students wanting to access mental wellness and learning tools",
      icon: <GraduationCap className="sm:size-12 size-8" />,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/register"),
      buttonText: "Join as Student",
    },
    {
      title: "Parent/Mentor",
      description: "Parents as well as Mentors supporting student growth",
      icon: <Users className="sm:size-12 size-8" />,
      color: "from-green-500 to-emerald-500",
      action: () => navigate("/register-parent"),
      buttonText: "Join as Parent",
    },
    {
      title: "Educational Institution",
      description:
        "Schools looking for comprehensive management solutions",
      icon: <Building className="sm:size-12 size-8" />,
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/school-registration"),
      buttonText: "Join as School",
    },
    {
      title: "Impact Partners",
      description: "Organizations contributing to student development and education",
      icon: <Target className="sm:size-12 size-8" />,
      color: "from-amber-500 to-orange-500",
      action: () => navigate("/register-stakeholder"),
      buttonText: "Partner With Us",
    },
  ];

  const handleGetStartedClick = () => {
    userTypesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePillarsClick = () => {
    if (featuresRef.current) {
      const element = featuresRef.current;
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleSeeHowItWorks = () => {
    navigate("/platform-details");
  };

  // Add this function for pricing scroll
  const handlePricingClick = () => {
    if (pricingRef.current) {
      const element = pricingRef.current;
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleWhyChooseClick = () => {
    if (whyChooseRef.current) {
      const element = whyChooseRef.current;
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleStudentServicesClick = () => {
    if (studentServicesRef.current) {
      const element = studentServicesRef.current;
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleFooterClick = () => {
    // Navigate to contact page instead of scrolling to footer
    navigate("/contact");
  };

  // Handle plan selection
  const handlePlanSelect = (planType, planName, amount) => {
    // Always open the modal - let it handle auth internally
    // For free plan, open modal that will handle activation
    if (planType === 'free') {
      setSelectedPlan({
        planType,
        planName,
        amount: 0,
      });
      setShowCheckout(true);
      return;
    }

    // For paid plans, always use the same price regardless of subscription status
    setSelectedPlan({
      planType,
      planName,
      amount,
    });
    setShowCheckout(true);
  };

  // Check for pending subscription after login redirect
  useEffect(() => {
    const pendingSubscription = location.state?.pendingSubscription || 
      (() => {
        const stored = localStorage.getItem('pending_subscription');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.removeItem('pending_subscription');
            return parsed;
          } catch {
            localStorage.removeItem('pending_subscription');
            return null;
          }
        }
        return null;
      })();
    
    if (pendingSubscription && (user || localStorage.getItem("finmen_token"))) {
      // Scroll to pricing section
      setTimeout(() => {
        if (pricingRef.current) {
          pricingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      // Small delay to ensure modal can render
      setTimeout(() => {
        toast.success('Welcome back! Completing your subscription...');
        const planType = pendingSubscription.planType;
        const planName = pendingSubscription.planName;
        const amount = pendingSubscription.amount || pendingSubscription.firstYearAmount || 0;
        
        // For free plan, open modal that will handle activation
        if (planType === 'free') {
          setSelectedPlan({
            planType,
            planName,
            amount: 0,
          });
          setShowCheckout(true);
          return;
        }

        // For paid plans, always use the same price
        setSelectedPlan({
          planType,
          planName,
          amount,
        });
        setShowCheckout(true);
      }, 800);
    }
  }, [user, location.state]);

  useEffect(() => {
    // Add CSS for animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pop-in {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      .animate-pop-in {
        animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
    `;
    document.head.appendChild(style);

    // Prevent scrolling when modal is open
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.head.removeChild(style);
    };
  }, [showModal]);

  const openModal = (feature) => {
    setSelectedFeature(feature);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeature(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* PWA Install Button */}
      <InstallPWA />
      
      {/* Navbar */}
      <MainNavbar
        handlePillarsClick={handlePillarsClick}
        handleWhyChooseClick={handleWhyChooseClick}
        handlePricingClick={handlePricingClick}
        handleStudentServicesClick={handleStudentServicesClick}
        handleFooterClick={handleFooterClick}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Modal */}
      {showModal && selectedFeature && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out animate-pop-in">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">{selectedFeature.title}</h3>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900">
                      What Students Learn
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {selectedFeature.details.whatStudentsLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></span>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900">
                      Why It Matters for Schools
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {selectedFeature.details.whyItMatters.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></span>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900">
                      National Alignment
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {selectedFeature.details.nationalAlignment.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></span>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative sm:h-screen h-auto sm:py-0 py-12 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sm:text-5xl text-4xl md:text-7xl font-bold text-gray-900 mb-4"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Wise Student
              </span>
              <p className="font-bold text-sm mt-2">
                Beyond Subjects. Building Humans.{" "}
              </p>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sm:text-xl text-lg md:text-xl text-gray-600 mb-6 max-w-4xl mx-auto"
            >
              Knowledge alone is no longer enough — today's learners need
              balance, resilience, and future-ready skills. Our Platform raises
              students who are not just exam-ready, but life-ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStartedClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all relative z-10 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSeeHowItWorks}
                className="border-2 border-gray-200 bg-transparent px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow hover:shadow-md cursor-pointer"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  See how it works
                </span>
              </motion.button>

            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center mt-8 w-full max-w-3xl mx-auto rounded-full"
            >
              <motion.img
                src={kidsImage}
                alt="Kids avatars"
                className="w-full max-w-3xl mx-auto rounded-full"
              />
            </motion.div>
            <p className="text-sm font-bold mb-2">
              The Firm foundation no textbook can teach — but every Student needs.
            </p>
          </motion.div>
        </div>

        {/* Background Elements - Moved behind content with negative z-index */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse z-2 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000 z-2 pointer-events-none" />
      </div>

      {/* Features Section */}
      <div id="features" ref={featuresRef} className="py-10 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="sm:text-4xl text-2xl font-bold text-gray-900 mb-2">
              Everything You Need in One Platform
            </h2>
            <p className="sm:text-lg text-base text-gray-600 max-w-7xl mx-auto py-4">
              WiseStudent sets a new standard in education: blending holistic
              growth with futuristic learning experiences, nurturing confidence,
              values, wellness, and innovation in every Student. Because the
              leaders of tomorrow deserve more than lessons — they deserve a
              complete foundation for life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="group rounded-2xl relative overflow-hidden cursor-pointer"
                onClick={() => openModal(feature)}
              >
                <div className="group relative rounded-2xl p-6 transition-all overflow-hidden bg-white border border-gray-100">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose WiseStudent Section */}
      <div ref={whyChooseRef} className="py-10 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="sm:text-4xl text-2xl font-bold text-gray-900 mb-2">
              Why Choose WiseStudent?
            </h2>
            <p className="sm:text-lg text-base text-gray-600 max-w-3xl mx-auto">
              Because education is more than grades — it's about raising
              life-ready humans.
            </p>
          </motion.div>

          <AutoSlidingCards />
        </div>
      </div>

      {/* Enhanced User Types Section */}
      <div id="get-started" ref={userTypesRef} className="py-16 bg-gradient-to-br from-white to-blue-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="sm:text-4xl text-2xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="sm:text-xl text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Different entry points for different needs. Get started with the
              option that fits you best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {userTypes.map((type, index) => (
              <div key={index} className="group relative">
                <div className={`sm:h-88 h-72 relative bg-white sm:rounded-3xl rounded-2xl sm:p-8 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${type.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>

                  <div className="relative z-10 flex flex-col">
                    <div className={`sm:size-24 size-16 bg-gradient-to-br ${type.color} sm:rounded-3xl rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      {type.icon}
                    </div>

                    <h3 className="sm:text-2xl text-xl font-bold text-gray-900 sm:mb-3 mb-0 text-center">
                      {type.title}
                    </h3>

                    <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                      {type.description}
                    </p>

                    <button
                      onClick={type.action}
                      className={`w-full bg-gradient-to-r ${type.color} text-white sm:py-4 py-3 sm:px-6 px-4 sm:rounded-2xl rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/btn mt-auto`}
                    >
                      <span className="relative z-10">{type.buttonText}</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      {/* Add ref to the pricing section div */}
      <div ref={pricingRef} className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="sm:max-w-[90%] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="sm:text-4xl text-2xl font-bold text-gray-900 mb-4">
              Pricing & Inclusions
            </h2>
            <p className="sm:text-xl text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Choose the plan that best fits your needs with comprehensive features for holistic education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-4 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-green-200 relative overflow-hidden group flex flex-col h-full mb-6 sm:mb-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3 min-h-[180px] sm:min-h-[192px]">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                    <p className="text-sm text-gray-600 mb-6">Start your WiseStudent journey free — 5 games in every pillar, full growth unlocked when you're ready.</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-600">₹0</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Star className="w-6 h-6" />
                  </div>
                </div>

                <button 
                  onClick={() => handlePlanSelect('free', 'Free Plan', 0, true)}
                  className="w-full sm:mb-6 mb-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white sm:py-3 py-2 sm:rounded-2xl rounded-xl sm:font-semibold font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Free Plan
                </button>

                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">5 Free Games per Pillar</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Earn heal coins and save them</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Access to All 10 Pillars (Preview Mode)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Basic Student Dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Gamified micro-lessons & interactive storytelling</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Daily Reflection Prompts (Trial)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">WiseClub Access — <span className="italic text-gray-500">Coming Soon</span></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">NEP 2020 Aligned Foundation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Upgrade Anytime to Full Plan</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Students Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-4 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-blue-200 relative overflow-hidden group flex flex-col h-full mb-6 sm:mb-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3 min-h-[180px] sm:min-h-[192px]">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Students Premium Plan</h3>
                    <p className="text-sm text-gray-600 mb-5">Perfect for self-driven students who aspire to grow emotionally, mentally, ethically as well as academically.</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-600">₹4,499</span>
                      <span className="text-sm text-gray-600">/year</span>
                    </div>
                  </div>
                  <div className=" bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white p-2 shadow-lg">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                <button 
                  onClick={() => handlePlanSelect('student_premium', 'Students Premium Plan', 4499)}
                  className="w-full sm:mb-6 mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white sm:py-3 py-2 sm:rounded-2xl rounded-xl sm:font-semibold font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Students Premium Plan
                </button>

                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Full Access to all 10 WiseStudent pillars</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">More than 2200+ Gaming micro lessons</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Exclusive Student Gamified Learning Dashboard with badges, levels, rewards, collectables and challenges</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Earn Heal Coins, save them, share them, and spend them</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Personal Growth Tracker — emotional, academic, and skill analytics</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <span className="text-gray-700 text-sm">WiseClub Community Access (peer learning and group missions) — <span className="italic text-gray-500">Coming Soon</span></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">NEP 2020-Aligned Curriculum</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Daily, Weekly Motivation & Reflection Prompts</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">Certificates, Badges & Achievements— issued automatically each term</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Secure, Private, and Student-Centric</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Student + Parent Premium Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-4 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-purple-200 relative overflow-hidden group flex flex-col h-full mb-6 sm:mb-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3 min-h-[180px] sm:min-h-[192px]">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Student + Parent Premium Pro Plan</h3>
                    <p className="text-sm text-gray-600 mb-3">For families who want a complete emotional and value-based learning ecosystem.</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-purple-600">₹4,999</span>
                      <span className="text-sm text-gray-600">/year</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <button 
                  onClick={() => handlePlanSelect('student_parent_premium_pro', 'Student + Parent Premium Pro Plan', 4999)}
                  className="w-full sm:mb-6 mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white sm:py-3 py-2 sm:rounded-2xl rounded-xl sm:font-semibold font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Student + Parent Premium Pro Plan
                </button>

                <div className="space-y-4 flex-1">


                  <div className="space-y-3">
                  <div className="relative flex items-center gap-3 p-3 rounded-xl border-2 border-blue-400 bg-blue-50 shadow-sm overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400 rounded-full"></div>
                    <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(147, 51, 234, 0.08)" }}></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                      <span className="text-blue-500 text-sm font-semibold">Everything in the Students Premium Plan, plus:</span>
                    </div>
                  </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Exclusive Parent dashboard with clear, concise snapshot of their child's learning progress, wellbeing, engagement, and suggested at-home activities to support growth</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Parents' Mental Health care (stress care, emotional well-being, family harmony) - <span className="italic">Aligned with Schools</span></span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Family Progress Tracking & Analytics</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Parent-Child Learning Challenges</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Secure, Private, and Family-Centric — only parents and students have data access</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Add-ons Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add-ons (Separate, Not in Bundle)</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Extra Pillars for Adults</h4>
                  <p className="text-gray-600">Finance, Digital Safety, etc.</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="flex items-baseline gap-2 justify-center md:justify-end">
                  <span className="text-2xl font-bold text-amber-600">₹199</span>
                  <span className="text-gray-500">each</span>
                  <span className="text-sm text-gray-500 line-through">₹250</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Save ₹51 per pillar
                </span>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>

      {/* National Alignments Section */}
      <NationalAlignments services={services} sectionRef={studentServicesRef} />

      {/* Main Footer */}
      <MainFooter />

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedPlan(null);
          }}
          planType={selectedPlan.planType}
          planName={selectedPlan.planName}
          amount={selectedPlan.amount}
        />
      )}
    </div>
  );
};

export default LandingPage;
