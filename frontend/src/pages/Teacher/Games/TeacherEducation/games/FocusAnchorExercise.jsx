import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Clock, Target, Eye, Volume2, Hand, AlertCircle, CheckCircle, Sparkles, AirVent, HeartPulse } from "lucide-react";

const FocusAnchorExercise = () => {
  const location = useLocation();

  // Function to calculate duration: 20 seconds for first exercise, increasing by 10 seconds for each subsequent exercise
  const calculateDuration = (exerciseIndex) => {
    return 20 + (exerciseIndex * 10); // First exercise: 20s, second: 30s, third: 40s, etc.
  };

  // Get game data
  const gameId = "teacher-education-43";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [selectedAnchor, setSelectedAnchor] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(calculateDuration(0)); // Dynamic initial duration
  const [distractionCount, setDistractionCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);

  const timerRef = useRef(null);

  const focusExercises = [
    {
      id: 1,
      title: 'Sound Anchor Focus',
      anchorType: 'sound',
      name: 'Sound Anchor',
      icon: Volume2,
      emoji: '🎵',
      description: 'Focus on a specific sound (clock ticking, ambient noise, your breath)',
      instruction: 'Choose a sound in your environment. Focus your attention on this sound. When your mind wanders, gently return your attention to the sound.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      tip: 'Listen deeply to the sound, noticing its qualities: pitch, rhythm, volume. Let it anchor your attention in the present moment.'
    },
    {
      id: 2,
      title: 'Visual Anchor Focus',
      anchorType: 'sight',
      name: 'Sight Anchor',
      icon: Eye,
      emoji: '👁️',
      description: 'Focus on a visual point (a spot on the wall, a candle flame, a plant)',
      instruction: 'Choose a visual anchor point. Gently rest your gaze on it. Focus your attention on what you see. When thoughts arise, return your attention to the visual anchor.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      tip: 'Notice the details of your visual anchor: its shape, color, texture. Let your eyes rest gently without straining. This anchors you in the present.'
    },
    {
      id: 3,
      title: 'Tactile Anchor Focus',
      anchorType: 'touch',
      name: 'Touch Anchor',
      icon: Hand,
      emoji: '👋',
      description: 'Focus on a physical sensation (feet on floor, hands on desk, breath moving)',
      instruction: 'Choose a physical sensation to anchor your attention. Notice how it feels: temperature, texture, movement. When you notice your mind wandering, gently return to this sensation.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      tip: 'Feel the sensation fully. Notice if it changes or stays constant. This physical anchor grounds you in your body and the present moment.'
    },
    {
      id: 4,
      title: 'Breath Anchor Focus',
      anchorType: 'breath',
      name: 'Breath Anchor',
      icon: AirVent,
      emoji: '💨',
      description: 'Focus on your natural breath rhythm',
      instruction: 'Bring your attention to your breath. Notice the sensation of air entering and leaving your nostrils, or the rise and fall of your chest or abdomen. When thoughts arise, gently return to your breath.',
      color: 'from-teal-500 to-emerald-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-300',
      tip: 'Don\'t control your breath, just observe it naturally. This creates a stable anchor for your attention in the present moment.'
    },
    {
      id: 5,
      title: 'Body Scan Anchor Focus',
      anchorType: 'body',
      name: 'Body Scan Anchor',
      icon: HeartPulse,
      emoji: '🦴',
      description: 'Focus on different parts of your body sequentially',
      instruction: 'Slowly scan your body from head to toe. Notice any sensations in each part. When your mind wanders, gently return to the body scan.',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      tip: 'Move slowly from one body part to the next. This creates embodied awareness and grounds you in the present moment.'
    }
  ];

  const currentExerciseData = focusExercises[currentExercise];
  const currentExerciseDuration = calculateDuration(currentExercise);
  const IconComponent = currentExerciseData?.icon;

  // Start the focus exercise
  const startExercise = () => {
    setIsPlaying(true);
    setTimeRemaining(currentExerciseDuration);
    setDistractionCount(0);
    setShowResults(false);
  };

  // Toggle pause/resume
  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset exercise
  const resetExercise = () => {
    setIsPlaying(false);
    setTimeRemaining(currentExerciseDuration);
    setDistractionCount(0);
    setShowResults(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Handle distraction counter
  const handleDistraction = () => {
    if (!isPlaying) return;
    setDistractionCount(prev => prev + 1);
  };

  // Main timer
  useEffect(() => {
    if (!isPlaying) return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Exercise complete
      setIsPlaying(false);
      setShowResults(true);

      // Mark current exercise as completed if not already marked
      if (!completedExercises.includes(currentExercise)) {
        const newCompleted = [...completedExercises, currentExercise];
        setCompletedExercises(newCompleted);
        setScore(newCompleted.length); // Set score to number of completed exercises
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, completedExercises, currentExercise, currentExerciseDuration]);

  // Calculate progress percentage
  const progressPercentage = ((currentExerciseDuration - timeRemaining) / currentExerciseDuration) * 100;
  const circumference = 2 * Math.PI * 100; // radius = 100
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;



  return (
    <TeacherGameShell
      title={gameData?.title || "Focus Anchor Exercise"}
      subtitle={gameData?.description || "Practice grounding the mind using a sensory focus point"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentExercise + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showResults && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {!isPlaying && (
              <>
                {/* Exercise Instructions */}
                <div className={`${currentExerciseData.bgColor} ${currentExerciseData.borderColor} border-2 rounded-xl p-6 mb-6`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentExerciseData.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                      {currentExerciseData.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-xl mb-2">
                        {currentExerciseData.title}
                      </h3>
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {currentExerciseData.instruction}
                      </p>
                      <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-700 italic">
                          💡 {currentExerciseData.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ready to Start */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startExercise}
                    className={`bg-gradient-to-r ${currentExerciseData.color} text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto`}
                  >
                    <Play className="w-6 h-6" />
                    Start {Math.ceil(currentExerciseDuration / 60)}-Minute Focus Exercise ({currentExerciseDuration}s)
                  </motion.button>
                </div>
              </>
            )}

            {isPlaying && (
              <>
                {/* Exercise in Progress */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Focus on Your {currentExerciseData.name}
                  </h2>
                  <p className="text-gray-600">
                    When you notice your mind has wandered, click "I Got Distracted"
                  </p>
                </div>

                {/* Timer and Stats */}
                <div className="flex flex-col items-center justify-center min-h-[400px] mb-8">
                  {/* Circular Timer */}
                  <div className="relative mb-8">
                    <svg className="transform -rotate-90" width="240" height="240">
                      {/* Background circle */}
                      <circle
                        cx="120"
                        cy="120"
                        r="100"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="120"
                        cy="120"
                        r="100"
                        stroke="url(#anchorGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />
                      <defs>
                        <linearGradient id="anchorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">
                          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">remaining</div>
                      </div>
                    </div>
                  </div>

                  {/* Anchor Visualization */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentExerciseData.color} shadow-2xl flex items-center justify-center mb-6`}
                  >
                    {IconComponent && <IconComponent className="w-16 h-16 text-white" />}
                  </motion.div>

                  {/* Distraction Counter */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 mb-6">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                      <span className="text-lg font-semibold text-gray-700">Distractions Noticed:</span>
                      <span className="text-3xl font-bold text-orange-600">{distractionCount}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDistraction}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      I Got Distracted
                    </motion.button>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Click when you notice your mind has wandered
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePause}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Resume
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetExercise}
                      className="bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </motion.button>
                  </div>

                  {/* Focus Reminder */}
                  <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200 max-w-md">
                    <p className="text-sm text-gray-700 text-center">
                      <Target className="w-4 h-4 inline mr-1" />
                      Keep returning your attention to your {currentExerciseData.name.toLowerCase()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {showResults && !showGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {Math.ceil(currentExerciseDuration / 60)}-Minute Focus Complete! ({currentExerciseDuration}s)
              </h2>
              <p className="text-gray-600 text-lg">
                You focused on your {currentExerciseData.name}
              </p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Anchor Used */}
              <div className={`${currentExerciseData.bgColor} ${currentExerciseData.borderColor} border-2 rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentExerciseData.color} flex items-center justify-center text-2xl`}>
                    {currentExerciseData.emoji}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    Anchor Used
                  </h3>
                </div>
                <p className="text-gray-700 font-semibold">
                  {currentExerciseData.name}
                </p>
              </div>

              {/* Distractions */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  <h3 className="font-bold text-gray-800 text-lg">
                    Distractions Noticed
                  </h3>
                </div>
                <p className="text-3xl font-bold text-orange-600 mb-1">
                  {distractionCount}
                </p>
                <p className="text-sm text-gray-600">
                  {distractionCount === 0
                    ? "Perfect focus! You stayed present throughout."
                    : distractionCount <= 3
                      ? "Good awareness! You noticed when your mind wandered and returned to focus."
                      : "Normal practice! Each time you noticed a distraction and returned to your anchor, you strengthened your focus muscle."}
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Focus Insights:</h3>
              <div className="space-y-3 text-gray-700">
                {distractionCount === 0 && (
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Excellent! You maintained strong focus throughout the {currentExerciseDuration} seconds. This demonstrates your ability to anchor your attention.</span>
                  </p>
                )}
                {distractionCount > 0 && distractionCount <= 3 && (
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Well done! You noticed {distractionCount} distraction{distractionCount !== 1 ? 's' : ''} and returned to your anchor. The practice isn't about having no distractions—it's about noticing them and returning to focus.</span>
                  </p>
                )}
                {distractionCount > 3 && (
                  <p className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Good practice! You noticed {distractionCount} distractions and returned your attention to your anchor each time. This is exactly how focus strengthens—by noticing wandering thoughts and gently returning to your anchor.</span>
                  </p>
                )}
                <p className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>Remember: The goal isn't to have zero distractions. The goal is to notice when your mind wanders and gently guide it back to your focus anchor. Each return strengthens your focus muscle.</span>
                </p>
              </div>
            </div>

            {/* Continue or Complete Button */}
            <div className="text-center">
              {currentExercise < focusExercises.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentExercise(prev => prev + 1);
                    setShowResults(false);
                    setTimeRemaining(calculateDuration(currentExercise + 1));
                    setDistractionCount(0);
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Next Exercise →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setScore(focusExercises.length); // Ensure score is set to total exercises
                    setShowGameOver(true);
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Complete All Exercises
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {distractionCount === 0 ? '🌟' : distractionCount <= 3 ? '✨' : '🎯'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              All Focus Anchor Exercises Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                You completed all {focusExercises.length} focus anchor exercises and earned {score} points.
              </p>
              <p className="text-gray-600">
                These focus anchor exercises with increasing durations (starting at 20 seconds and adding 10 seconds each time) strengthen your ability to ground attention in the present moment using different sensory anchors. Regular practice will enhance your focus and mindfulness.
              </p>
            </div>

            {/* Final Stats */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">{score}</div>
                  <div className="text-sm text-gray-600">Exercises Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{focusExercises.length}</div>
                  <div className="text-sm text-gray-600">Total Exercises</div>
                </div>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use these focus anchor techniques throughout your teaching day. The Sound Anchor works well before meetings or during transitions. The Visual Anchor is helpful when you need a quick reset. The Tactile Anchor grounds you physically during stressful moments. The Breath Anchor is always available for immediate centering. The Body Scan Anchor helps release physical tension. Practice different anchors in different situations to develop your ability to return to present-moment awareness. These techniques help you stay calm, focused, and responsive rather than reactive. Regular practice builds your capacity to remain centered regardless of classroom chaos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default FocusAnchorExercise;