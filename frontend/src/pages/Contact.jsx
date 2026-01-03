import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Building } from "lucide-react";
import MainNavbar from "../components/MainNavbar";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handlePillarsClick = () => {
    navigate("/");
  };

  const handleWhyChooseClick = () => {
    navigate("/");
  };

  const handlePricingClick = () => {
    navigate("/");
  };

  const handleStudentServicesClick = () => {
    navigate("/");
  };

  const handleFooterClick = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "support@wisestudent.org",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      content: "Chennai | Bangalore, India",
      description: "Our headquarters and innovation center"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Office Hours",
      content: "Monday - Friday",
      description: "9:00 AM - 6:00 PM"
    }
  ];

  // Use motion directly to satisfy linter
  const MotionDiv = motion.div;

  return (
    <MotionDiv 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
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
      
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            We'd love to hear from you. Get in touch with our team.
          </motion.p>
        </div>
      </div>

      {/* Contact Information and Form */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-8">
              Have questions about WiseStudent? Want to learn more about our platform? 
              Our team is ready to assist you with any inquiries you may have.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-4 bg-white rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mr-4 flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{info.title}</h3>
                    <p className="text-gray-900 font-medium">{info.content}</p>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="self-start bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What is this regarding?"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Section - Full Width */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Our Location</h3>
          <div className="rounded-xl overflow-hidden w-full h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.68594894256!2d80.2437199!3d12.991927500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d7d6641728d%3A0xddfdb15c6538d927!2sIIT%20Madras%20Research%20Park!5e0!3m2!1sen!2sin!4v1761973206960!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </motion.div> */}
      </div>

      {/* FAQ Section */}
      {/* <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-3">How do I register my school?</h3>
              <p className="text-blue-100">
                Visit our institution registration page and fill out the application form. 
                Our team will review your application and get back to you within 2 business days.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-3">What age groups does WiseStudent support?</h3>
              <p className="text-blue-100">
                Our platform is designed for students aged 6-18, with age-appropriate content 
                and activities for different developmental stages.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-3">Is there a free trial available?</h3>
              <p className="text-blue-100">
                Yes, we offer a 30-day free trial for schools. Contact our sales team to get started 
                with your trial today.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-3">How can I become a content partner?</h3>
              <p className="text-blue-100">
                We're always looking for passionate educators and content creators. 
                Email partnerships@wisestudent.com with your portfolio and ideas.
              </p>
            </motion.div>
          </div>
        </div>
      </div> */}
    </MotionDiv>
  );
};

export default Contact;