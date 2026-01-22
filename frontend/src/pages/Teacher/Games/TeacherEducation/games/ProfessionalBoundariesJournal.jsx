import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { BookOpen, Clock, Heart, AlertTriangle, Save, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const ProfessionalBoundariesJournal = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-67";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [boundariesEntries, setBoundariesEntries] = useState({
    workHours: "",
    rechargeTime: "",
    redLines: "",
    communicationLimits: "",
    personalTime: ""
  });
  const [completionScore, setCompletionScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [score, setScore] = useState(0);

  // Journal template sections
  const sections = [
    {
      id: 'workHours',
      label: 'My Work Hours',
      icon: Clock,
      description: 'Define your professional availability boundaries',
      placeholder: 'e.g., I work from 7:00 AM to 4:00 PM on school days. I do not check emails after 5:00 PM or on weekends unless it\'s an emergency. I dedicate one hour daily for lesson planning during school hours...',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800',
      helpText: 'Clarify when you\'re available for work-related tasks. Set clear start and end times, specify days off, and communicate availability expectations.'
    },
    {
      id: 'rechargeTime',
      label: 'My Recharge Time',
      icon: Heart,
      description: 'Identify activities and time needed for personal well-being',
      placeholder: 'e.g., I need 30 minutes of quiet time after school before engaging with family. I reserve weekends for personal activities and hobbies. I take one mental health day per term. I practice mindfulness every morning for 15 minutes...',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      textColor: 'text-pink-800',
      helpText: 'Define what activities, time, and practices help you recharge and maintain well-being. This is essential for preventing burnout.'
    },
    {
      id: 'redLines',
      label: 'My Red Lines',
      icon: AlertTriangle,
      description: 'Establish non-negotiable boundaries for self-respect and protection',
      placeholder: 'e.g., I do not accept verbal abuse or disrespect from parents, students, or colleagues. I will not work beyond my contract hours without compensation. I do not engage in discussions about students during social events. I prioritize my mental health over work demands...',
      color: 'from-red-400 to-orange-500',
      bgColor: 'from-red-50 to-orange-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800',
      helpText: 'Identify absolute boundaries that protect your well-being, dignity, and professional integrity. These are non-negotiable limits.'
    },
    {
      id: 'communicationLimits',
      label: 'My Communication Limits',
      icon: AlertTriangle,
      description: 'Set boundaries for how and when others can communicate with you',
      placeholder: 'e.g., I respond to emails during designated hours only (8 AM - 6 PM). I do not take phone calls during family dinners. I have specific days when I do not engage in work-related communication. I let important contacts know my communication boundaries...',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-800',
      helpText: 'Define how, when, and through what channels others can reach you. This prevents interruptions and protects your focus time.'
    },
    {
      id: 'personalTime',
      label: 'My Personal Time',
      icon: Heart,
      description: 'Establish boundaries for protecting your personal and family time',
      placeholder: 'e.g., I reserve 7-8 PM for family dinner without work distractions. I do not work on Sundays except for urgent planning. I have designated time for personal hobbies and interests. I protect my sleep schedule by avoiding work-related activities before bedtime...',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-800',
      helpText: 'Protect your personal time by setting clear boundaries that ensure dedicated time for yourself and loved ones.'
    }
  ];

  const handleEntryChange = (field, value) => {
    setBoundariesEntries(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate completion score
    const completed = Object.values({ ...boundariesEntries, [field]: value })
      .filter(entry => entry.trim().length > 0).length;
    const newScore = Math.round((completed / 5) * 100);
    setCompletionScore(newScore);
  };

  const handleSave = async () => {
    const completedCount = Object.values(boundariesEntries)
      .filter(entry => entry.trim().length > 0).length;

    if (completedCount === 0) {
      toast.error("Please fill in at least one section of your boundaries journal.");
      return;
    }

    if (completedCount < 5) {
      const confirmSave = window.confirm(`You've completed ${completedCount} of 5 sections. Would you like to save your Boundaries Note now, or add more?`);
      if (!confirmSave) {
        return;
      }
    }

    // Save boundaries note (in a real app, this would save to backend)
    // For now, we'll just mark it as saved locally
    setHasSaved(true);
    setScore(completedCount);

    // Show success message
    toast.success("Your Boundaries Note has been saved!");

    // Small delay before showing game over screen
    setTimeout(() => {
      setShowGameOver(true);
    }, 1000);
  };

  const handleComplete = () => {
    handleSave();
  };

  const completedCount = Object.values(boundariesEntries)
    .filter(entry => entry.trim().length > 0).length;
  const allCompleted = completedCount === 5;

  return (
    <TeacherGameShell
      title={gameData?.title || "Professional Boundaries Journal"}
      subtitle={gameData?.description || "Define boundaries around availability and self-respect"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={score}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Professional Boundaries Journal
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Define your boundaries around availability and self-respect. Creating clear boundaries protects your well-being and prevents burnout.
              </p>
            </div>

            {/* Completion Score Indicator */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${completionScore >= 66 ? 'from-green-400 to-emerald-500' :
                      completionScore >= 33 ? 'from-blue-400 to-cyan-500' :
                        'from-gray-300 to-gray-400'
                    } flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                    {completionScore}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Boundaries Defined</h3>
                    <p className="text-gray-600">{completedCount} of 5 sections completed</p>
                  </div>
                </div>
                {allCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">Complete!</span>
                  </motion.div>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionScore}%` }}
                  className={`h-3 rounded-full bg-gradient-to-r ${completionScore >= 66 ? 'from-green-400 to-emerald-500' :
                      completionScore >= 33 ? 'from-blue-400 to-cyan-500' :
                        'from-gray-300 to-gray-400'
                    }`}
                />
              </div>
            </div>

            {/* Journal Sections */}
            <div className="space-y-6 mb-8">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const value = boundariesEntries[section.id];
                const isCompleted = value.trim().length > 0;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${section.bgColor} rounded-xl p-6 border-2 ${section.borderColor} shadow-md`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-xl font-bold ${section.textColor}`}>
                            {section.label}
                          </h3>
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{section.description}</p>
                        <p className="text-gray-600 text-xs italic">{section.helpText}</p>
                      </div>
                    </div>

                    <textarea
                      value={value}
                      onChange={(e) => handleEntryChange(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      rows={6}
                      className={`w-full p-4 rounded-lg border-2 ${section.borderColor} focus:ring-2 focus:ring-opacity-50 focus:outline-none resize-none transition-all ${isCompleted ? 'bg-white' : 'bg-white/80'
                        }`}
                    />

                    {value.trim().length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-xs text-gray-600 flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        {value.trim().length} characters
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={completedCount === 0}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${completedCount > 0
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Save className="w-5 h-5" />
                Save Boundaries Note
              </motion.button>

              {completedCount > 0 && completedCount < 5 && (
                <p className="text-sm text-gray-600 mt-3">
                  You can save your Boundaries Note now or complete all sections first.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Game Over - Boundaries Note Display */}
        {showGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                📋✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Boundaries Note Has Been Saved!
              </h2>
              <p className="text-xl text-gray-600">
                {completedCount === 5
                  ? "All sections completed!"
                  : `${completedCount} of 5 sections completed`}
              </p>
            </div>

            {/* Saved Boundaries Note */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border-2 border-indigo-200 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-800">My Boundaries Note</h3>
                <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div className="space-y-6">
                {sections.map((section, index) => {
                  const value = boundariesEntries[section.id];
                  if (!value.trim()) return null;

                  const Icon = section.icon;

                  return (
                    <div
                      key={section.id}
                      className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className={`text-lg font-bold ${section.textColor}`}>
                          {section.label}
                        </h4>
                      </div>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {completedCount < 5 && (
                <div className="mt-6 bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> You've saved {completedCount} of 5 sections. You can return to complete the remaining sections anytime.
                  </p>
                </div>
              )}
            </div>

            {/* Boundaries Benefits */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Why Boundaries Matter
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Prevent burnout:</strong> Clear boundaries protect your energy and prevent overwork.</li>
                <li>• <strong>Maintain self-respect:</strong> Boundaries communicate your worth and what you will and won't accept.</li>
                <li>• <strong>Improve work-life balance:</strong> Defined availability helps separate work from personal time.</li>
                <li>• <strong>Build respect:</strong> Clear boundaries help others understand and respect your limits.</li>
                <li>• <strong>Reduce stress:</strong> Knowing your limits reduces anxiety and decision fatigue.</li>
                <li>• <strong>Enhance teaching quality:</strong> Well-rested, balanced teachers provide better education.</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    <strong>Revisit your Boundaries Note every term to prevent burnout.</strong> Your boundaries may need adjustment as circumstances change:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Schedule regular reviews:</strong> Set a reminder to review your Boundaries Note at the start of each term or semester. This keeps your boundaries current and prevents gradual boundary creep.</li>
                    <li><strong>Assess what's working:</strong> Reflect on which boundaries are serving you well and which might need adjustment. Some boundaries may need to be firmer, while others might become more flexible.</li>
                    <li><strong>Update as needed:</strong> Life circumstances, workload, and personal needs change. Your boundaries should evolve with them. Update your work hours, recharge time, and red lines as appropriate.</li>
                    <li><strong>Communicate changes:</strong> When you update boundaries, communicate them clearly to colleagues, administrators, and parents if necessary. Consistency in communication builds respect.</li>
                    <li><strong>Celebrate progress:</strong> Notice if you've successfully maintained boundaries and celebrate these wins. Boundary-setting is a skill that improves with practice.</li>
                    <li><strong>Seek support:</strong> If you're struggling to maintain boundaries, share your Boundaries Note with a trusted colleague or mentor for accountability and support.</li>
                    <li><strong>Prevent boundary drift:</strong> Without regular review, boundaries can gradually erode. Regular check-ins prevent this "boundary creep" that leads to burnout.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you revisit your Boundaries Note every term, you're actively preventing burnout and maintaining your well-being. This practice keeps your boundaries relevant, communicates your needs clearly, and helps you stay committed to self-care. Regular boundary review is essential for long-term teaching sustainability.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default ProfessionalBoundariesJournal;