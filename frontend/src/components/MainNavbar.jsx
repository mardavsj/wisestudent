import React, { useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import InstallPWA from "./InstallPWA";

const MainNavbar = ({
    handlePillarsClick,
    handleWhyChooseClick,
    handlePricingClick,
    handleFooterClick,
    showMobileMenu,
    setShowMobileMenu,
    fixed = false
}) => {
    const navigate = useNavigate();

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMobileMenu) {
            // Save current scroll position
            const scrollY = window.scrollY;
            // Prevent scrolling
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            return () => {
                // Restore scrolling
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                // Restore scroll position
                window.scrollTo(0, scrollY);
            };
        }
    }, [showMobileMenu]);

    const navClasses = `bg-white shadow-md py-4 relative ${fixed ? "fixed top-0 left-0 z-[60] w-full" : ""}`;

    return (
        <nav className={navClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center cursor-pointer relative">
                    {/* Left: Logo and Title */}
                    <motion.div 
                        onClick={() => navigate("/")} 
                        className="flex items-center cursor-pointer"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img
                            src="/icons/icon.png"
                            alt="WiseStudent logo"
                            className="w-10 h-10 sm:w-11 sm:h-11 object-cover p-0"
                        />
                        <div className="ml-2 sm:ml-3">
                            <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                                WiseStudent
                            </h1>
                        </div>
                    </motion.div>

                    {/* Right: Desktop Navigation - hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-4 ml-auto">
                        <button
                            onClick={handlePillarsClick}
                            className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        >
                            Pillars
                        </button>

                        <button
                            onClick={handleWhyChooseClick}
                            className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        >
                            Why Choose Us
                        </button>

                        <button
                            onClick={handlePricingClick}
                            className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        >
                            Pricing
                        </button>

                        <button
                            onClick={() => navigate("/contact")}
                            className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        >
                            Contact
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 duration-200 ease-in-out hover:bg-opacity-90 transition-all text-sm font-medium cursor-pointer"
                        >
                            Sign In
                        </button>

                        {/* Install App Button - right side of Sign In */}
                        <InstallPWA variant="navbar" />
                    </div>

                    {/* Mobile menu button - visible only on mobile */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none ml-auto"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay - visible only on mobile */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            className="md:hidden fixed inset-0 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Dark overlay background */}
                            <motion.div
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                                onClick={() => setShowMobileMenu(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Mobile menu panel */}
                            <motion.div
                                className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                    mass: 0.8
                                }}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Menu header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                <img
                                                    src="/icons/icon.png"
                                                    alt="WiseStudent logo"
                                                    className="w-5 h-5 object-contain"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <h2 className="text-lg font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">WiseStudent</h2>
                                            </div>
                                        </div>
                                        <button
                                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* Menu items */}
                                    <div className="flex flex-col p-4 space-y-4 flex-grow">
                                        <motion.button
                                            onClick={() => {
                                                setShowMobileMenu(false);
                                                // Small delay to ensure menu closes before scroll
                                                setTimeout(() => {
                                                    handlePillarsClick();
                                                }, 100);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Pillars
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                setShowMobileMenu(false);
                                                // Small delay to ensure menu closes before scroll
                                                setTimeout(() => {
                                                    handleWhyChooseClick();
                                                }, 100);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Why Choose Us
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                setShowMobileMenu(false);
                                                // Small delay to ensure menu closes before scroll
                                                setTimeout(() => {
                                                    handlePricingClick();
                                                }, 100);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Pricing
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                setShowMobileMenu(false);
                                                // Navigate to contact page
                                                setTimeout(() => {
                                                    handleFooterClick();
                                                }, 100);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Contact
                                        </motion.button>

                                        {/* PWA Install in mobile menu - matches Sign In button */}
                                        <div className="mt-auto">
                                            <InstallPWA variant="navbar-mobile" />
                                        </div>

                                        <motion.button
                                            onClick={() => {
                                                navigate("/login");
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Sign In
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default MainNavbar;
