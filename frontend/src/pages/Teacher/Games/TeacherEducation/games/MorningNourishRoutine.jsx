import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Droplet, Activity, Heart, Sun, VolumeX, Sparkles, CheckCircle, Circle, Star, BookOpen, TrendingUp, Coffee } from "lucide-react";

const MorningNourishRoutine = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-95";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [selectedRoutines, setSelectedRoutines] = useState([]);
  const [currentStep, setCurrentStep] = useState('select'); // 'select', 'guide', 'rate', 'complete'
  const [currentRoutineIndex, setCurrentRoutineIndex] = useState(0);
  const [routineCompleted, setRoutineCompleted] = useState(new Set());
  const [energyLevel, setEnergyLevel] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Available routines
  const routines = [
    {
      id: 'water',
      title: 'Hydrate First',
      emoji: '💧',
      icon: Droplet,
      description: 'Drink a glass of water as soon as you wake up',
      quickGuide: [
        'Keep a glass of water by your bedside the night before',
        'Drink it as soon as you wake up, before coffee or tea',
        'Take slow, mindful sips - notice the coolness',
        'Feel the hydration refreshing your body',
        'Set intention for a nourished day'
      ],
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      benefit: 'Rehydrates your body after sleep, supports metabolism, and signals your body to wake up naturally',
      tip: 'Starting with water instead of caffeine helps your body wake up more naturally and prevents dehydration.'
    },
    {
      id: 'stretch',
      title: 'Gentle Stretch',
      emoji: '🧘',
      icon: Activity,
      description: '5-10 minutes of gentle movement and stretching',
      quickGuide: [
        'Stand up and reach your arms high above your head',
        'Slowly rotate your shoulders forward and backward',
        'Gently twist your torso left and right',
        'Bend forward and let your arms hang loosely',
        'Take 3-5 deep breaths in each position'
      ],
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      benefit: 'Releases overnight stiffness, increases circulation, and energizes your body',
      tip: 'Even 5 minutes of gentle movement can significantly improve your energy and focus for the day.'
    },
    {
      id: 'affirm',
      title: 'Morning Affirmation',
      emoji: '✨',
      icon: Heart,
      description: 'Say or write 3 positive affirmations',
      quickGuide: [
        'Stand in front of a mirror or sit comfortably',
        'Choose 3 affirmations that resonate with you today',
        'Examples: "I am capable," "I am patient," "I make a difference"',
        'Say each one aloud 3 times with conviction',
        'Feel the truth of each statement in your body'
      ],
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      benefit: 'Sets positive tone for the day, builds self-belief, and reduces morning anxiety',
      tip: 'Affirmations are most effective when you say them with feeling and believe them, even if just a little.'
    },
    {
      id: 'sunlight',
      title: 'Morning Sunlight',
      emoji: '☀️',
      icon: Sun,
      description: 'Spend 5-10 minutes in natural sunlight',
      quickGuide: [
        'Step outside or sit by a window with direct sunlight',
        'Close your eyes and turn your face toward the sun',
        'Feel the warmth on your skin',
        'Take slow, deep breaths',
        'Notice how the light energizes you'
      ],
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      benefit: 'Regulates circadian rhythm, boosts vitamin D, and naturally increases energy',
      tip: 'Even on cloudy days, outdoor light is much brighter than indoor light and helps regulate your body clock.'
    },
    {
      id: 'silence',
      title: 'Morning Silence',
      emoji: '🤫',
      icon: VolumeX,
      description: '5-10 minutes of quiet stillness',
      quickGuide: [
        'Find a quiet space - could be your bedroom or a corner',
        'Sit comfortably with your eyes closed',
        'Don\'t turn on music, podcasts, or news yet',
        'Just sit in silence and breathe',
        'Allow your mind to settle before the day begins'
      ],
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      benefit: 'Reduces morning rush, calms the nervous system, and creates mental space for the day',
      tip: 'This silence is especially powerful before checking phones or devices - it protects your mental peace.'
    },
    {
      id: 'gratitude',
      title: 'Morning Gratitude',
      emoji: '❤️',
      icon: Sparkles,
      description: 'Write or think about 3 things you\'re grateful for',
      quickGuide: [
        'Take a moment to reflect on your life',
        'Write down or mentally note 3 things you\'re grateful for',
        'Could be simple: a good night\'s sleep, your health, loved ones',
        'Feel the warmth of gratitude in your heart',
        'Carry this feeling into your day'
      ],
      color: 'from-red-400 to-rose-500',
      bgColor: 'from-red-50 to-rose-50',
      borderColor: 'border-red-300',
      benefit: 'Shifts focus to abundance, improves mood, and creates positive mindset for the day',
      tip: 'Gratitude rewires your brain to notice positive aspects of life, which helps you handle challenges better.'
    }
  ];

  const handleSelectRoutine = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    if (selectedRoutines.find(r => r.id === routineId)) {
      // Deselect
      setSelectedRoutines(prev => prev.filter(r => r.id !== routineId));
      // Remove 1 point for each routine deselected
      setScore(prev => Math.max(0, prev - 1));
    } else {
      // Select (max 5)
      if (selectedRoutines.length < 5) {
        setSelectedRoutines(prev => [...prev, routine]);
        // Award 1 point for each routine selected
        setScore(prev => prev + 1);
      } else {
        alert('Please select only 5 routines. Deselect one first if you want to change.');
      }
    }
  };

  const handleStartRoutine = () => {
    if (selectedRoutines.length !== 5) {
      alert('Please select exactly 5 routines to start your morning nourish routine.');
      return;
    }
    setCurrentStep('guide');
    setCurrentRoutineIndex(0);
  };

  const handleCompleteRoutine = (routineId) => {
    setRoutineCompleted(prev => new Set([...prev, routineId]));

    // Move to next routine or finish
    if (currentRoutineIndex < selectedRoutines.length - 1) {
      setTimeout(() => {
        setCurrentRoutineIndex(prev => prev + 1);
        setRoutineCompleted(new Set()); // Reset for next routine
      }, 500);
    } else {
      // All routines completed, move to energy rating
      setTimeout(() => {
        setCurrentStep('rate');
      }, 1000);
    }
  };

  const handleEnergyRating = (level) => {
    setEnergyLevel(level);
    // Keep the routine selection score (5) and don't override it with energy level
    setTimeout(() => {
      setShowGameOver(true);
    }, 1000);
  };

  const energyLevels = [
    { id: 'very-high', label: 'Very High', emoji: '⚡', value: 5, color: 'from-yellow-400 to-amber-500', bgColor: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-300' },
    { id: 'high', label: 'High', emoji: '🌟', value: 4, color: 'from-green-400 to-emerald-500', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300' },
    { id: 'good', label: 'Good', emoji: '👍', value: 3, color: 'from-blue-400 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', borderColor: 'border-blue-300' },
    { id: 'moderate', label: 'Moderate', emoji: '😐', value: 2, color: 'from-orange-400 to-amber-500', bgColor: 'from-orange-50 to-amber-50', borderColor: 'border-orange-300' },
    { id: 'low', label: 'Low', emoji: '😴', value: 1, color: 'from-gray-400 to-slate-500', bgColor: 'from-gray-50 to-slate-50', borderColor: 'border-gray-300' }
  ];

  const getSelectedRoutine = () => {
    if (currentStep !== 'guide' || selectedRoutines.length === 0) return null;
    return selectedRoutines[currentRoutineIndex];
  };

  const currentRoutine = getSelectedRoutine();

  if (showGameOver) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Morning Nourish Routine"}
        subtitle={gameData?.description || "Start each day with mindful self-care before digital check-ins"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={Math.min(selectedRoutines.length, totalLevels)}
      >
        <div className="w-full max-w-5xl mx-auto px-4">
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
                🌅✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Morning Routine Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've nourished your morning with mindful self-care
              </p>
            </div>

            {/* Energy Level Display */}
            {energyLevel && (
              <div className={`bg-gradient-to-br ${energyLevel.bgColor} rounded-xl p-6 border-2 ${energyLevel.borderColor} mb-6`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">{energyLevel.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Your Morning Energy Level
                  </h3>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {energyLevel.label}
                  </p>
                  <p className="text-gray-600">
                    {energyLevel.value >= 4
                      ? 'Excellent! Your morning routine energized you well.'
                      : energyLevel.value >= 3
                        ? 'Good! Your routine is supporting your energy.'
                        : 'Continue practicing your routine to build morning energy.'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Your Routines Summary */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-indigo-600" />
                Your Morning Nourish Routine
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedRoutines.map((routine, index) => {
                  const Icon = routine.icon;
                  return (
                    <div
                      key={routine.id}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{routine.emoji}</div>
                        <h4 className="font-bold text-gray-800 mb-2">{routine.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{routine.description}</p>
                        <div className="bg-white rounded-lg p-3 border-2 border-indigo-200">
                          <p className="text-xs font-semibold text-indigo-700 mb-1">Benefit:</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{routine.benefit}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Benefits of Morning Nourish Routine
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Better energy:</strong> Starting with self-care sets you up for a more energized day</li>
                <li>• <strong>Reduced stress:</strong> Taking time for yourself before the day begins reduces morning rush</li>
                <li>• <strong>Improved focus:</strong> Mindful mornings help you enter the school day with clarity</li>
                <li>• <strong>Better boundaries:</strong> Starting before digital check-ins protects your mental peace</li>
                <li>• <strong>Positive mindset:</strong> Gratitude and affirmations create a positive foundation for the day</li>
                <li>• <strong>Physical health:</strong> Hydration, sunlight, and movement support your body's needs</li>
                <li>• <strong>Sustainable teaching:</strong> Self-care practices prevent burnout and support long-term teaching</li>
                <li>• <strong>Role modeling:</strong> When you care for yourself, you model self-care for students and colleagues</li>
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
                    <strong>Share "#MorningNourish" updates in staff wellness chat weekly.</strong> Building community around self-care creates accountability and connection:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Create a wellness chat:</strong> If your school doesn't have a staff wellness chat, suggest creating one. This can be on Slack, Teams, WhatsApp, or any platform your staff uses. A dedicated space for wellness supports everyone.</li>
                    <li><strong>Weekly check-ins:</strong> Every week (e.g., Friday mornings), share your "#MorningNourish" update. This could be a simple message like "This week I practiced water, sunlight, and gratitude. I felt energized!" Regular sharing builds habit.</li>
                    <li><strong>Share authentically:</strong> Be honest about your routine—both successes and challenges. Authenticity encourages others and creates real connection. You don't need to be perfect; you just need to show up.</li>
                    <li><strong>Celebrate others:</strong> When colleagues share their routines, celebrate them! Acknowledge their efforts and ask questions if they mention something new. Celebration creates positive reinforcement.</li>
                    <li><strong>Share tips:</strong> If you discover something helpful (a new affirmation, a stretch that works well, a gratitude practice), share it! Tips help everyone learn and grow together.</li>
                    <li><strong>Create accountability:</strong> Knowing you'll share your routine creates gentle accountability. This helps you stick with your routine even on busy mornings. Accountability supports consistency.</li>
                    <li><strong>Build community:</strong> Sharing routines creates connection among staff members. This sense of community reduces isolation and builds support networks. Connection is protective.</li>
                    <li><strong>Normalize self-care:</strong> When self-care is shared and celebrated, it becomes normalized. This makes it easier for everyone to prioritize their well-being. Normalization reduces guilt.</li>
                    <li><strong>Inspire others:</strong> Your routine might inspire a colleague to start their own. Sharing creates ripple effects that benefit the entire school community. Your example matters.</li>
                    <li><strong>Track patterns:</strong> Over time, you can notice patterns in what routines energize you most. Sharing helps you reflect and refine your practice. Reflection supports growth.</li>
                    <li><strong>Create rituals:</strong> Weekly sharing becomes a ritual that reinforces your commitment to self-care. Rituals create meaning and sustain practices long-term.</li>
                    <li><strong>Support school culture:</strong> When many staff members share their routines, it shifts school culture toward prioritizing well-being. Culture change supports individual change.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you share "#MorningNourish" updates in staff wellness chat weekly, you're creating community around self-care, building accountability, normalizing well-being practices, and supporting a culture that values teacher wellness. Your sharing creates ripple effects that benefit everyone.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Morning Nourish Routine"}
      subtitle={gameData?.description || "Start each day with mindful self-care before digital check-ins"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={Math.min(selectedRoutines.length, totalLevels)}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === 'select' && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🌅</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Morning Nourish Routine
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Select 5 routines to start your day with mindful self-care
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Coffee className="w-5 h-5" />
                  How This Works
                </h3>
                <ul className="text-indigo-800 space-y-2 text-sm">
                  <li>• <strong>Choose 5 routines:</strong> Select 5 practices that resonate with you</li>
                  <li>• <strong>Follow the guide:</strong> Complete each routine with the quick guide</li>
                  <li>• <strong>Rate your energy:</strong> After completing all routines, rate your energy level</li>
                  <li>• <strong>Build the habit:</strong> Practice these routines daily to start your day nourished</li>
                </ul>
              </div>

              {/* Routine Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {routines.map((routine, index) => {
                  const Icon = routine.icon;
                  const isSelected = selectedRoutines.find(r => r.id === routine.id);
                  const canSelect = selectedRoutines.length < 5 || isSelected;

                  return (
                    <motion.button
                      key={routine.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectRoutine(routine.id)}
                      disabled={!canSelect && !isSelected}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all text-left ${isSelected
                          ? `${routine.bgColor} ${routine.borderColor} shadow-lg`
                          : canSelect
                            ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                            : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                        }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${routine.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                            <span className="text-3xl">{routine.emoji}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-gray-800' : 'text-gray-700'}`}>
                              {routine.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {routine.description}
                            </p>
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div className="flex items-center justify-between">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isSelected
                              ? 'bg-white text-indigo-700'
                              : 'bg-gray-100 text-gray-500'
                            }`}>
                            {isSelected ? 'Selected' : 'Click to select'}
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-6 h-6 text-indigo-600" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected Count */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      Routines Selected
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedRoutines.length} of 5 selected
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {selectedRoutines.length} / 5
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedRoutines.length / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>

              {/* Start Button */}
              {selectedRoutines.length === 5 && (
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartRoutine}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Morning Routine
                  </motion.button>
                </div>
              )}
            </>
          )}

          {currentStep === 'guide' && currentRoutine && (
            <motion.div
              key={currentRoutine.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{currentRoutine.emoji}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {currentRoutine.title}
                </h2>
                <p className="text-xl text-gray-600 mb-4">
                  Routine {currentRoutineIndex + 1} of {selectedRoutines.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentRoutineIndex + 1) / selectedRoutines.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>

              {/* Quick Guide */}
              <div className={`bg-gradient-to-br ${currentRoutine.bgColor} rounded-xl p-6 border-2 ${currentRoutine.borderColor} mb-6`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Quick Guide
                </h3>
                <ol className="space-y-3 text-gray-700">
                  {currentRoutine.quickGuide.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentRoutine.color} text-white flex items-center justify-center flex-shrink-0 font-bold`}>
                        {index + 1}
                      </div>
                      <p className="flex-1 leading-relaxed pt-1">{step}</p>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Benefit */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">💡 Benefit:</p>
                <p className="text-gray-700 leading-relaxed mb-2">{currentRoutine.benefit}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{currentRoutine.tip}</p>
              </div>

              {/* Complete Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCompleteRoutine(currentRoutine.id)}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <CheckCircle className="w-5 h-5" />
                  I Completed This Routine
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === 'rate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Rate Your Energy Level
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  How energized do you feel after completing your morning nourish routine?
                </p>
              </div>

              {/* Energy Level Options */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {energyLevels.map((level, index) => (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEnergyRating(level)}
                    className={`p-6 rounded-xl border-2 transition-all ${energyLevel?.id === level.id
                        ? `${level.bgColor} ${level.borderColor} shadow-lg`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-5xl mb-2">{level.emoji}</div>
                    <p className={`font-semibold text-sm ${energyLevel?.id === level.id ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                      {level.label}
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* Encouragement */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 text-center">
                <p className="text-gray-700 leading-relaxed">
                  Remember: Your energy level may vary day by day. What matters is that you took time to nourish yourself this morning. 🌅
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default MorningNourishRoutine;