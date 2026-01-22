import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Clock, Utensils, Heart, Volume2, ArrowLeft, ArrowRight, Star, ThumbsUp, Smile } from "lucide-react";

const MindfulEatingBreak = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-47";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = 5; // Updated to 5 activities

  const [currentActivity, setCurrentActivity] = useState(0);
  const [activitiesCompleted, setActivitiesCompleted] = useState(Array(5).fill(false));
  const [scores, setScores] = useState(Array(5).fill(0));
  const [phase, setPhase] = useState('ready'); // ready, active, reflection, complete
  const [activityPhase, setActivityPhase] = useState('idle'); // idle, active, completed
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [rating, setRating] = useState(null);

  const timerRef = useRef(null);
  // Define 5 different mindful eating activities
  const activities = [
    {
      id: 1,
      title: "Mindful Tasting Journey",
      description: "Explore flavors and textures with full attention",
      duration: 60, // seconds
      icon: "👅",
      color: "from-red-400 to-pink-400",
      instruction: "Take small bites and focus entirely on taste, texture, and temperature",
      timing: { tasting: 10, pause: 5, reflect: 5 }
    },
    {
      id: 2,
      title: "Gratitude Eating Practice",
      description: "Appreciate your food and its journey to your plate",
      duration: 60,
      icon: "🙏",
      color: "from-green-400 to-emerald-400",
      instruction: "Before each bite, silently express gratitude for your food",
      timing: { grateful: 15, taste: 10, appreciate: 5 }
    },
    {
      id: 3,
      title: "Sensory Exploration",
      description: "Engage all five senses while eating mindfully",
      duration: 60,
      icon: "👁️",
      color: "from-blue-400 to-cyan-400",
      instruction: "Notice colors, smells, sounds, textures, and tastes",
      timing: { observe: 12, smell: 8, taste: 10 }
    },
    {
      id: 4,
      title: "Mindful Chewing Meditation",
      description: "Transform chewing into a meditative practice",
      duration: 60,
      icon: "🦷",
      color: "from-purple-400 to-violet-400",
      instruction: "Chew each bite slowly, counting chews and staying present",
      timing: { chew: 20, swallow: 5, breathe: 5 }
    },
    {
      id: 5,
      title: "Appreciation Reflection",
      description: "Connect eating with nourishment and self-care",
      duration: 60,
      icon: "💝",
      color: "from-amber-400 to-orange-400",
      instruction: "Reflect on how this food nourishes your body and mind",
      timing: { nourish: 15, connect: 10, appreciate: 5 }
    }
  ];

  const currentActivityData = activities[currentActivity];



  const startActivity = () => {
    setPhase('active');
    setIsPlaying(true);
    setActivityPhase('active');
    setTimeRemaining(currentActivityData.duration);
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetActivity = () => {
    setIsPlaying(false);
    setPhase('ready');
    setActivityPhase('idle');
    setTimeRemaining(0);
    setRating(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleNextActivity = () => {
    // Mark current activity as completed
    const newCompleted = [...activitiesCompleted];
    newCompleted[currentActivity] = true;
    setActivitiesCompleted(newCompleted);

    // Set score for current activity
    const newScores = [...scores];
    newScores[currentActivity] = 1; // 1 point per completed activity
    setScores(newScores);

    if (currentActivity < 4) {
      setCurrentActivity(currentActivity + 1);
      setPhase('ready');
      setActivityPhase('idle');
      setTimeRemaining(0);
      setRating(null);
    } else {
      // All activities completed
      setShowGameOver(true);
    }
  };

  const handlePrevActivity = () => {
    if (currentActivity > 0) {
      setCurrentActivity(currentActivity - 1);
      setPhase('ready');
      setActivityPhase('idle');
      setTimeRemaining(0);
      setRating(null);
    }
  };

  // Handle activity timing
  useEffect(() => {
    if (!isPlaying || phase !== 'active') return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Activity complete
      setIsPlaying(false);
      setActivityPhase('completed');
      setTimeout(() => {
        setShowReflection(true);
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, phase, timeRemaining, currentActivityData]);



  const handleRateExperience = (ratingValue) => {
    setRating(ratingValue);
    setTimeout(() => {
      setShowReflection(false);
      handleNextActivity();
    }, 1500);
  };

  const calculateTotalScore = () => {
    return scores.reduce((total, score) => total + score, 0);
  };

  // Calculate visual size based on phase
  const getVisualSize = () => {
    if (eatingPhase === 'bite') {
      const progress = 1 - (timeRemaining / eatingTimings.bite);
      return 150 + (progress * 100); // Grows from 150px to 250px
    } else if (eatingPhase === 'pause') {
      return 250; // Maintains size (chewing)
    } else if (eatingPhase === 'breathe') {
      const progress = 1 - (timeRemaining / eatingTimings.breathe);
      return 250 - (progress * 50); // Slightly shrinks then grows
    }
    return 200;
  };

  // Get visual color based on phase
  const getVisualColor = () => {
    if (eatingPhase === 'bite') {
      return 'from-orange-400 via-amber-400 to-yellow-400';
    } else if (eatingPhase === 'pause') {
      return 'from-green-400 via-emerald-400 to-teal-400';
    } else if (eatingPhase === 'breathe') {
      return 'from-blue-400 via-cyan-400 to-indigo-400';
    }
    return 'from-indigo-400 via-purple-400 to-pink-400';
  };

  // Get phase instruction text
  const getPhaseInstruction = () => {
    if (eatingPhase === 'bite') {
      return 'Take a mindful bite. Notice the food.';
    } else if (eatingPhase === 'pause') {
      return 'Pause and chew slowly. Savor each moment.';
    } else if (eatingPhase === 'breathe') {
      return 'Breathe gently. Notice how you feel.';
    }
    return 'Ready to begin';
  };

  // Get phase emoji
  const getPhaseEmoji = () => {
    if (eatingPhase === 'bite') return '🍎';
    else if (eatingPhase === 'pause') return '🫐';
    else if (eatingPhase === 'breathe') return '🌬️';
    return '🍽️';
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Mindful Eating Break"}
      subtitle={gameData?.description || "Cultivate awareness during short meal or snack breaks"}
      showGameOver={showGameOver}
      score={calculateTotalScore()}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentActivity + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {phase === 'ready' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Activity Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentActivityData.icon}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {currentActivityData.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentActivityData.description}
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-700 font-semibold mb-1">
                  Activity {currentActivity + 1} of {totalLevels}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentActivity + 1) / totalLevels) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="text-sm text-gray-700 font-semibold mb-1">
                  Total Score: {calculateTotalScore()} / {totalLevels}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(calculateTotalScore() / totalLevels) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Activity Instructions */}
            <div className={`bg-gradient-to-br ${currentActivityData.color.replace('from-', 'from-').replace('to-', 'to-')} bg-opacity-10 rounded-xl p-6 border-2 mb-6`}>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Activity Focus:
              </h3>
              <p className="text-gray-700 text-lg">
                {currentActivityData.instruction}
              </p>
              <div className="mt-4 bg-white/50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration: {currentActivityData.duration} seconds
                </p>
              </div>
            </div>



            {/* Navigation and Start Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevActivity}
                disabled={currentActivity === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentActivity === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startActivity}
                className={`bg-gradient-to-r ${currentActivityData.color} text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2`}
              >
                <Play className="w-6 h-6" />
                Begin {currentActivityData.title.split(' ')[0]}
              </motion.button>

              <div className="w-24"></div> {/* Spacer for alignment */}
            </div>
          </div>
        )}

        {phase === 'active' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentActivityData.title} in Progress
              </h2>
              <p className="text-gray-600">
                Activity {currentActivity + 1} of {totalLevels}
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
                <div
                  className={`bg-gradient-to-r ${currentActivityData.color} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${((currentActivityData.duration - timeRemaining) / currentActivityData.duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Visual indicator */}
            <div className="flex items-center justify-center mb-8 min-h-[400px]">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`rounded-full bg-gradient-to-br ${currentActivityData.color} shadow-2xl flex items-center justify-center w-64 h-64`}
              >
                <div className="text-7xl">
                  {currentActivityData.icon}
                </div>
              </motion.div>
            </div>

            {/* Instruction */}
            <div className={`bg-gradient-to-br ${currentActivityData.color.replace('from-', 'from-').replace('to-', 'to-')} bg-opacity-10 rounded-xl p-6 border-2 mb-6 text-center`}>
              <p className={`text-2xl font-bold mb-2 ${currentActivityData.color.includes('red') ? 'text-red-800' : currentActivityData.color.includes('green') ? 'text-green-800' : currentActivityData.color.includes('blue') ? 'text-blue-800' : currentActivityData.color.includes('purple') ? 'text-purple-800' : 'text-amber-800'}`}>
                {currentActivityData.instruction}
              </p>
              {timeRemaining > 0 && (
                <p className={`text-4xl font-bold ${currentActivityData.color.includes('red') ? 'text-red-600' : currentActivityData.color.includes('green') ? 'text-green-600' : currentActivityData.color.includes('blue') ? 'text-blue-600' : currentActivityData.color.includes('purple') ? 'text-purple-600' : 'text-amber-600'}`}>
                  {timeRemaining}
                </p>
              )}
            </div>

            {/* Activity Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <p className="text-gray-700 font-semibold">
                  Focus: {currentActivityData.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Duration: {currentActivityData.duration} seconds
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePause}
                className={`bg-gradient-to-r ${currentActivityData.color} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2`}
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
                onClick={resetActivity}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>
          </div>
        )}

        {showReflection && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {currentActivityData.title} Complete!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              How would you rate your experience with this mindful eating practice?
            </p>

            {/* Experience Rating */}
            <div className="grid grid-cols-5 gap-4 mb-8 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <motion.button
                  key={ratingValue}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRateExperience(ratingValue)}
                  className={`p-6 rounded-xl border-2 transition-all ${rating === ratingValue
                      ? `border-${currentActivityData.color.includes('red') ? 'red' : currentActivityData.color.includes('green') ? 'green' : currentActivityData.color.includes('blue') ? 'blue' : currentActivityData.color.includes('purple') ? 'purple' : 'amber'}-500 bg-gradient-to-br ${currentActivityData.color.replace('from-', 'from-').replace('to-', 'to-')} bg-opacity-20 shadow-lg`
                      : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                    }`}
                >
                  <div className="text-4xl mb-2">
                    {ratingValue === 1 ? '😞' : ratingValue === 2 ? '😐' : ratingValue === 3 ? '🙂' : ratingValue === 4 ? '😊' : '😍'}
                  </div>
                  <div className={`font-bold text-lg ${rating === ratingValue ? 'text-gray-800' : 'text-gray-700'
                    }`}>
                    {ratingValue}
                  </div>
                  {ratingValue === 1 && <div className="text-xs text-gray-500 mt-1">Poor</div>}
                  {ratingValue === 3 && <div className="text-xs text-gray-500 mt-1">Good</div>}
                  {ratingValue === 5 && <div className="text-xs text-gray-500 mt-1">Excellent</div>}
                </motion.button>
              ))}
            </div>

            {rating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${currentActivityData.color.replace('from-', 'from-').replace('to-', 'to-')} bg-opacity-10 rounded-xl p-6 border-2 ${currentActivityData.color.includes('red') ? 'border-red-200' : currentActivityData.color.includes('green') ? 'border-green-200' : currentActivityData.color.includes('blue') ? 'border-blue-200' : currentActivityData.color.includes('purple') ? 'border-purple-200' : 'border-amber-200'}`}
              >
                <p className="text-lg text-gray-800 font-semibold">
                  {rating >= 4
                    ? `Excellent! You've successfully practiced ${currentActivityData.title.toLowerCase()}. This mindful approach helps you develop greater awareness and appreciation for your eating experience.`
                    : rating >= 3
                      ? `Good job! You've completed the ${currentActivityData.title.toLowerCase()} practice. With regular practice, this mindful approach will become more natural and beneficial.`
                      : `You've completed the ${currentActivityData.title.toLowerCase()} activity. Mindful eating skills improve with practice. Each attempt builds your awareness and presence.`}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              🌟
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mindful Eating Journey Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Congratulations! You've completed all 5 mindful eating activities and developed a comprehensive practice for bringing awareness to your meals.
                You've explored tasting, gratitude, sensory awareness, mindful chewing, and appreciation—each building different aspects of mindful eating.
                This holistic approach helps you cultivate presence, reduce stress, and develop a healthier relationship with food and eating.
              </p>
              <div className="bg-white/60 rounded-lg p-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Activities Completed</p>
                    <p className="text-2xl font-bold text-indigo-600">{totalLevels} / {totalLevels}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Score</p>
                    <p className="text-2xl font-bold text-purple-600">{calculateTotalScore()} / {totalLevels}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Create a mindful eating routine for busy school days. Establish a simple 2-3 minute mindful eating practice you can do daily during lunch or snack breaks. Choose one activity that resonates most with you (perhaps the Gratitude Eating Practice or Sensory Exploration) and make it your go-to technique. Keep healthy snacks visible and accessible—nuts, fruit, or yogurt that you can eat mindfully. Set a phone reminder: "Time for mindful lunch break" to ensure you actually take the break. Involve colleagues by sharing one mindful eating tip each week during staff meetings. Model this behavior for students by occasionally practicing mindful eating in front of them during classroom snack time. Teach children that eating mindfully isn't about eating slowly, but about being present with their food. This builds emotional regulation and self-awareness. Remember: protecting your meal breaks with mindfulness isn't selfish—it's professional self-care that makes you a more patient, present, and effective educator. Even 2-3 minutes of mindful awareness can reset your nervous system and improve your afternoon teaching energy.
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

export default MindfulEatingBreak;