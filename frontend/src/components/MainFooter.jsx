import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Zap,
} from "lucide-react";

const MainFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = React.useState(false);

  // Remove unused services array

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Pillars", href: "/#features" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    // { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ];

  // Handle smooth scrolling for Home link
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home page, scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to home page then scroll to top
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  // Handle smooth scrolling for Pillars link
  const handlePillarsClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home page, scroll to features section smoothly
      const featuresElement = document.getElementById("features");
      if (featuresElement) {
        featuresElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Navigate to home page, then scroll after page loads
      navigate("/");
      // Wait for navigation and DOM to be ready
      setTimeout(() => {
        const scrollToFeatures = () => {
          const featuresElement = document.getElementById("features");
          if (featuresElement) {
            featuresElement.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            // Retry if element not found yet
            setTimeout(scrollToFeatures, 100);
          }
        };
        scrollToFeatures();
      }, 100);
    }
  };

  // const socialLinks = [
    // {
    //   name: "Facebook",
    //   href: "https://facebook.com",
    //   icon: Facebook,
    //   color: "hover:bg-blue-600",
    // },
    // {
    //   name: "Twitter",
    //   href: "https://twitter.com",
    //   icon: Twitter,
    //   color: "hover:bg-sky-500",
    // },
    // {
    //   name: "Instagram",
    //   href: "https://instagram.com",
    //   icon: Instagram,
    //   color: "hover:bg-pink-600",
    // },
    // {
    //   name: "LinkedIn",
    //   href: "https://linkedin.com",
    //   icon: Linkedin,
    //   color: "hover:bg-blue-700",
    // },
  // ];


  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  React.useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:mt-20 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {/* Company Info & Newsletter */}
            <div className="space-y-6 lg:col-span-1">
              <div className="group">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                  animate={{
                    boxShadow: [
                      '0 4px 20px rgba(139, 92, 246, 0.3)',
                      '0 4px 40px rgba(139, 92, 246, 0.5)',
                      '0 4px 20px rgba(139, 92, 246, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  WiseStudent
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-8">
                  Empowering education with innovative management and wellness
                  solutions for the next generation.
                </p>
              </div>

              {/* <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Stay Updated
                </p>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm outline-none"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ArrowUp className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div> */}
            </div>

            {/* Quick Links */}
            <div className="space-y-4 lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3.5">
                {quickLinks.map((link, index) => {
                  // Use smooth scroll handlers for Home and Pillars
                  const handleClick = (e) => {
                    if (link.name === "Home") {
                      handleHomeClick(e);
                    } else if (link.name === "Pillars") {
                      handlePillarsClick(e);
                    }
                    // Other links will use default navigation
                  };

                  return (
                    <li key={index}>
                      <a
                        href={link.href}
                        onClick={link.name === "Home" || link.name === "Pillars" ? handleClick : undefined}
                        className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm flex items-center gap-2 group"
                      >
                        <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-4 lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Contact Us
              </h3>
              <div className="space-y-4.5">
                <a
                  href="mailto:support@wisestudent.org"
                  className="flex items-start gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Email</p>
                    <p className="text-sm font-medium">
                      support@wisestudent.org
                    </p>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-gray-600 group">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Location</p>
            <p className="text-sm font-medium">Chennai | Bangalore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="pt-8 border-t border-gray-200 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Wise Student. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                <a
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Terms of Service
                </a>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Privacy Policy
                </a>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <a
                  href="/cookies"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </footer>

      {/* Back to Top Button */}
      {isVisible && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50 border-1 border-white/40 cursor-pointer hover:scale-105 duration-200 ease-in-out"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default MainFooter;
