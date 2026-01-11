import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, Volume2, Lightbulb, Target, Sparkles, BookOpen, Heart, TrendingUp, Star, CheckCircle } from "lucide-react";

const ImpactVisualization = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-87";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: visualization, 2: reflection, 3: summary
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [reflectionText, setReflectionText] = useState("");
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const animationIntervalRef = useRef(null);

  // Visualization steps (guided imagery script)
  const visualizationSteps = [
    {
      id: 1,
      title: "Find Your Center",
      duration: 15000, // 15 seconds
      text: "Take a comfortable position. Close your eyes gently or soften your gaze. Take three deep breaths, breathing in calm and breathing out tension. Feel your body relax as you settle into this moment.",
      emoji: "🧘",
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 2,
      title: "Envision Your Classroom",
      duration: 20000, // 20 seconds
      text: "Picture your classroom in your mind. See the desks, the boards, the familiar spaces where you teach every day. Feel the energy of learning that fills this room. Notice the warmth and care that exists here.",
      emoji: "🏫",
      color: "from-purple-400 to-indigo-500"
    },
    {
      id: 3,
      title: "See the Light Begin",
      duration: 15000, // 15 seconds
      text: "Now imagine a soft, warm light at the center of your classroom—perhaps emanating from where you stand when you teach. This light represents your teaching, your care, your dedication. Watch as it begins to glow gently.",
      emoji: "💡",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 4,
      title: "Light Reaches Students",
      duration: 20000, // 20 seconds
      text: "See this light slowly expanding, touching each student in your classroom. As it reaches them, imagine them growing in confidence, understanding, and capability. See them sitting taller, their eyes brightening with comprehension, their minds opening to possibilities.",
      emoji: "✨",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 5,
      title: "Light Expands Beyond",
      duration: 25000, // 25 seconds
      text: "Watch as the light continues expanding beyond your classroom walls. It travels with your students as they leave, carrying your teachings, your support, your belief in them. See this light reaching into their homes, their communities, their future classrooms and workplaces.",
      emoji: "🌍",
      color: "from-pink-400 to-rose-500"
    },
    {
      id: 6,
      title: "See Future Success",
      duration: 30000, // 30 seconds
      text: "Now visualize your students years from now. See them using skills you helped them develop—perhaps solving problems, helping others, pursuing dreams. Imagine one student confidently presenting their ideas. Another helping a colleague understand something new. Another creating something meaningful. See the ripple effect of your teaching extending through time and space.",
      emoji: "🚀",
      color: "from-indigo-400 to-purple-500"
    },
    {
      id: 7,
      title: "Feel Your Impact",
      duration: 20000, // 20 seconds
      text: "Feel the profound impact of your work. Recognize that the knowledge, confidence, and care you share doesn't end when students leave your classroom—it grows, spreads, and transforms lives. Feel the deep meaning and purpose of your teaching. Your impact extends far beyond what you can see in any single moment.",
      emoji: "❤️",
      color: "from-red-400 to-pink-500"
    },
    {
      id: 8,
      title: "Return with Awareness",
      duration: 15000, // 15 seconds
      text: "Take three more deep breaths, holding this awareness of your impact. When you're ready, gently return your attention to the present moment. Open your eyes, carrying this sense of purpose and impact with you.",
      emoji: "🌅",
      color: "from-teal-400 to-cyan-500"
    }
  ];

  // Total visualization duration (in ms)
  const totalDuration = visualizationSteps.reduce((sum, step) => sum + step.duration, 0);

  const stepTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const stepStartTimeRef = useRef(null);

  const handleStartVisualization = () => {
    setCurrentStep(1);
    setIsPlaying(true);
    setShowAnimation(true);
    playStep(1);
  };

  const playStep = (stepIndex) => {
    if (stepIndex > visualizationSteps.length || !isPlaying) {
      // Visualization complete
      setIsPlaying(false);
      setShowAnimation(false);
      setCurrentStep(2); // Move to reflection
      return;
    }

    setCurrentStep(stepIndex);
    setAnimationProgress(0);
    const stepDuration = visualizationSteps[stepIndex - 1].duration;
    stepStartTimeRef.current = Date.now();

    // Update progress during current step
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(() => {
      if (!isPlaying) {
        clearInterval(progressIntervalRef.current);
        return;
      }
      const elapsed = Date.now() - stepStartTimeRef.current;
      const progress = Math.min((elapsed / stepDuration) * 100, 100);
      setAnimationProgress(progress);
    }, 50);

    // Move to next step after duration
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }
    stepTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (stepIndex < visualizationSteps.length) {
        playStep(stepIndex + 1);
      } else {
        // Visualization complete
        setIsPlaying(false);
        setShowAnimation(false);
        setCurrentStep(2); // Move to reflection
      }
    }, stepDuration);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleResume = () => {
    setIsPlaying(true);
    // Resume from current step
    const currentStepDuration = visualizationSteps[currentStep - 1]?.duration || 15000;
    const elapsed = (animationProgress / 100) * currentStepDuration;
    const remainingTime = currentStepDuration - elapsed;
    
    if (remainingTime > 500) {
      // Continue current step
      stepStartTimeRef.current = Date.now() - elapsed;
      progressIntervalRef.current = setInterval(() => {
        if (!isPlaying) {
          clearInterval(progressIntervalRef.current);
          return;
        }
        const elapsed = Date.now() - stepStartTimeRef.current;
        const progress = Math.min((elapsed / currentStepDuration) * 100, 100);
        setAnimationProgress(progress);
      }, 50);

      stepTimerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        if (currentStep < visualizationSteps.length) {
          playStep(currentStep + 1);
        } else {
          setIsPlaying(false);
          setShowAnimation(false);
          setCurrentStep(2);
        }
      }, remainingTime);
    } else {
      // Move to next step
      if (currentStep < visualizationSteps.length) {
        playStep(currentStep + 1);
      } else {
        setIsPlaying(false);
        setShowAnimation(false);
        setCurrentStep(2);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleSkipToReflection = () => {
    setIsPlaying(false);
    setShowAnimation(false);
    setCurrentStep(2);
  };

  const handleReflectionSubmit = () => {
    if (!reflectionText.trim()) {
      alert("Please write your reflection first.");
      return;
    }
    setScore(1);
    setCurrentStep(3);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  const currentStepData = currentStep > 0 && currentStep <= visualizationSteps.length 
    ? visualizationSteps.find((_, idx) => idx === currentStep - 1) 
    : visualizationSteps[0];

  return (
    <TeacherGameShell
      title={gameData?.title || "Impact Visualization"}
      subtitle={gameData?.description || "Visualize future student success inspired by your teaching"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Intro Screen */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-6xl mb-6">✨</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Impact Visualization
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Follow this guided visualization to imagine how your teaching creates ripples of impact, extending beyond your classroom to transform students' lives far into the future.
                </p>

                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                    What to Expect
                  </h3>
                  <ul className="text-left text-gray-700 space-y-2 max-w-2xl mx-auto">
                    <li>• <strong>8 guided steps</strong> taking you through a visualization of your impact</li>
                    <li>• <strong>Beautiful animations</strong> of light expanding from your classroom</li>
                    <li>• <strong>Visualization prompts</strong> to help you imagine student success</li>
                    <li>• <strong>Reflection opportunity</strong> to capture your insights</li>
                    <li>• <strong>Total duration:</strong> About 3-4 minutes</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center justify-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Preparation
                  </h3>
                  <ul className="text-left text-blue-800 space-y-2 max-w-2xl mx-auto text-sm">
                    <li>• Find a quiet, comfortable space where you won't be interrupted</li>
                    <li>• You can close your eyes or keep them open—whatever feels comfortable</li>
                    <li>• Take your time with each step—there's no rush</li>
                    <li>• Allow yourself to fully engage with the visualization</li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartVisualization}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Begin Visualization
                </motion.button>
              </motion.div>
            )}

            {/* Visualization Screen */}
            {currentStep >= 1 && currentStep <= visualizationSteps.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Light Expansion Animation */}
                {showAnimation && (
                  <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border-4 border-purple-300 shadow-2xl">
                    {/* Classroom Light Source (Center) */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Central Light */}
                      <motion.div
                        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500 blur-2xl opacity-80"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        className="absolute w-20 h-20 rounded-full bg-white"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>

                    {/* Expanding Light Rings */}
                    <AnimatePresence>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 m-auto rounded-full border-4 border-yellow-400 opacity-30"
                          style={{
                            width: `${(i + 1) * 80}px`,
                            height: `${(i + 1) * 80}px`
                          }}
                          initial={{ scale: 0, opacity: 0.8 }}
                          animate={{
                            scale: [1, 3, 1],
                            opacity: [0.8, 0, 0.8]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Particles (Student representations) */}
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = (i / 12) * 2 * Math.PI;
                      const radius = 100 + animationProgress * 2;
                      const x = 50 + Math.cos(angle) * (radius / 4);
                      const y = 50 + Math.sin(angle) * (radius / 4);
                      
                      return (
                        <motion.div
                          key={i}
                          className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`
                          }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                        />
                      );
                    })}

                    {/* Progress Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 bg-black/50 rounded-full h-2">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep - 1) / visualizationSteps.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Current Step Content */}
                <div className={`bg-gradient-to-br ${currentStepData?.color || 'from-purple-400 to-indigo-500'} rounded-xl p-8 border-2 border-purple-200`}>
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">{currentStepData?.emoji}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Step {currentStep} of {visualizationSteps.length}
                    </h3>
                    <h4 className="text-xl font-semibold text-white/90 mb-4">
                      {currentStepData?.title}
                    </h4>
                  </div>

                  <div className="bg-white/95 rounded-lg p-6 mb-6">
                    <p className="text-gray-800 text-lg leading-relaxed text-center">
                      {currentStepData?.text}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    {isPlaying ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePause}
                        className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <Pause className="w-5 h-5" />
                        Pause
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleResume}
                        className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <Play className="w-5 h-5" />
                        Resume
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSkipToReflection}
                      className="px-6 py-3 bg-white/80 text-gray-700 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                    >
                      Skip to Reflection
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reflection Screen */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Capture Your Insights
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    What did you notice during the visualization? Write a reflection about your impact and how it extends beyond your classroom.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    Reflection Prompts
                  </h3>
                  <ul className="text-gray-700 space-y-2 text-sm mb-4">
                    <li>• What did you notice about your impact during the visualization?</li>
                    <li>• How does imagining student success make you feel?</li>
                    <li>• What does it mean to you that your teaching extends beyond the classroom?</li>
                    <li>• How does this visualization connect to your "why" for teaching?</li>
                  </ul>
                </div>

                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Write your reflection about the visualization and your impact... How does imagining future student success inspire you? What does it mean to you that your teaching creates ripples that extend through time and space?"
                  rows={10}
                  className="w-full p-6 rounded-xl border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-gray-800 mb-6"
                />

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReflectionSubmit}
                    disabled={!reflectionText.trim()}
                    className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${
                      reflectionText.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Visualization
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Completion Screen (before Game Over) */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Visualization Complete!
                </h2>
                <p className="text-xl text-gray-600">
                  Your reflection has been saved
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Game Over Summary */}
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
                ✨💡
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Impact Visualization Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've visualized your impact and captured your insights
              </p>
            </div>

            {/* Reflection Display */}
            {reflectionText && (
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Your Reflection
                </h3>
                <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {reflectionText}
                  </p>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Remember:
              </h3>
              <div className="bg-white rounded-lg p-6 border-2 border-green-300">
                <p className="text-green-800 leading-relaxed text-lg">
                  Your teaching creates ripples that extend far beyond what you can see in any single moment. Every lesson, every conversation, every moment of support and belief you offer to students travels with them into their futures, transforming lives in ways both visible and invisible. Your impact matters, and it extends through time and space.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                The Power of Impact Visualization
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Reconnects with purpose:</strong> Visualizing impact helps you reconnect with the deeper "why" behind your teaching</li>
                <li>• <strong>Sustains motivation:</strong> Seeing the long-term effects of your work helps maintain motivation during challenging times</li>
                <li>• <strong>Reduces burnout:</strong> Remembering your impact helps protect against burnout and exhaustion</li>
                <li>• <strong>Builds resilience:</strong> Understanding your extended influence builds resilience and perspective</li>
                <li>• <strong>Strengthens belief:</strong> Visualizing success strengthens your belief in your students and yourself</li>
                <li>• <strong>Creates perspective:</strong> Seeing beyond daily struggles helps you maintain perspective on what matters most</li>
                <li>• <strong>Inspires action:</strong> Connecting to your impact inspires continued dedication and care</li>
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
                    <strong>Repeat before exams or reviews to remember the deeper "why."</strong> Using this visualization strategically helps you stay connected to your purpose during important moments:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Before exams:</strong> Complete this visualization before exam periods to remember that your teaching prepares students for more than tests—it prepares them for life, problem-solving, and future success.</li>
                    <li><strong>Before evaluations:</strong> Use this visualization before evaluations or observations to reconnect with your purpose and remember your extended impact beyond any single observation.</li>
                    <li><strong>During difficult weeks:</strong> When teaching feels particularly challenging, this visualization helps you remember the long-term impact and find motivation to continue.</li>
                    <li><strong>Before parent meetings:</strong> Use this visualization before important parent meetings to ground yourself in your purpose and communicate your impact with confidence.</li>
                    <li><strong>At the start of terms:</strong> Begin new terms or semesters with this visualization to set intentions and remember why your work matters.</li>
                    <li><strong>During transitions:</strong> Use this visualization during career transitions, moves, or changes to remember the continuity of your impact across contexts.</li>
                    <li><strong>Before presentations:</strong> Complete this visualization before presenting to colleagues or administrators to connect with your purpose and communicate your impact.</li>
                    <li><strong>Weekly practice:</strong> Consider making this a weekly practice to regularly reconnect with your "why" and maintain perspective on your impact.</li>
                    <li><strong>During reflection:</strong> Use this visualization as part of regular reflection practices to integrate purpose awareness into your teaching identity.</li>
                    <li><strong>Share with others:</strong> Consider sharing this visualization with colleagues or using it in professional development to help others reconnect with their purpose.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you repeat this visualization before exams or reviews to remember the deeper "why," you're creating a practice that helps you stay grounded in purpose, maintain perspective on impact, sustain motivation during challenges, and communicate your value with confidence. Regular use of this visualization transforms it from a tool into a cornerstone of your teaching practice—a way to regularly reconnect with the profound meaning and extended impact of your work.
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

export default ImpactVisualization;

