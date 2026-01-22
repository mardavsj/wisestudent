import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Moon, MessageCircle, BookOpen, Heart, Footprints, Music, Coffee, Users, Sparkles, CheckCircle, Download, Share2, Book } from "lucide-react";

const EmotionalRecoveryToolkit = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-57";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [showRecoveryRoutine, setShowRecoveryRoutine] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 12 Recovery Strategy Cards
  const recoveryStrategies = [
    {
      id: 1,
      title: "Rest",
      emoji: "😴",
      description: "Take time to rest and recharge your energy",
      icon: Moon,
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-300",
      tips: "Take a nap, get extra sleep, or simply lie down quietly. Rest is essential for emotional recovery."
    },
    {
      id: 2,
      title: "Venting",
      emoji: "🗣️",
      description: "Talk it out with a trusted friend, colleague, or partner",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      tips: "Find someone who will listen without judgment. Sometimes expressing emotions helps release stress."
    },
    {
      id: 3,
      title: "Journaling",
      emoji: "📝",
      description: "Write down your thoughts, feelings, and reflections",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      tips: "Write freely without editing. Journaling helps process emotions and gain perspective."
    },
    {
      id: 4,
      title: "Prayer or Meditation",
      emoji: "🙏",
      description: "Connect with your spiritual practice or practice mindfulness",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-300",
      tips: "Take time for prayer, meditation, or quiet reflection. This can provide comfort and clarity."
    },
    {
      id: 5,
      title: "Walking or Exercise",
      emoji: "🚶",
      description: "Move your body through walking, running, or other physical activity",
      icon: Footprints,
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50 to-amber-50",
      borderColor: "border-orange-300",
      tips: "Physical movement releases endorphins and helps clear your mind. Even a short walk can help."
    },
    {
      id: 6,
      title: "Music",
      emoji: "🎵",
      description: "Listen to music that soothes, energizes, or inspires you",
      icon: Music,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-300",
      tips: "Music can shift your mood and provide emotional support. Create playlists for different emotional needs."
    },
    {
      id: 7,
      title: "Quiet Time with Tea or Coffee",
      emoji: "☕",
      description: "Enjoy a warm beverage in a peaceful moment",
      icon: Coffee,
      color: "from-amber-500 to-yellow-500",
      bgColor: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-300",
      tips: "Take a break with a warm drink. This simple ritual can provide comfort and a moment of pause."
    },
    {
      id: 8,
      title: "Spend Time with Loved Ones",
      emoji: "👥",
      description: "Connect with family, friends, or pets for support and comfort",
      icon: Users,
      color: "from-cyan-500 to-teal-500",
      bgColor: "from-cyan-50 to-teal-50",
      borderColor: "border-cyan-300",
      tips: "Social connection is powerful for emotional recovery. Spend quality time with people who support you."
    },
    {
      id: 9,
      title: "Creative Expression",
      emoji: "🎨",
      description: "Express yourself through art, writing, or other creative activities",
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-50 to-purple-50",
      borderColor: "border-violet-300",
      tips: "Creativity can be therapeutic. Draw, paint, write, or engage in any creative activity that brings you joy."
    },
    {
      id: 10,
      title: "Nature Connection",
      emoji: "🌳",
      description: "Spend time outdoors in nature",
      icon: Footprints,
      color: "from-green-600 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-400",
      tips: "Nature has a calming effect. Visit a park, garden, or natural space to reconnect and restore."
    },
    {
      id: 11,
      title: "Read or Watch Inspiring Content",
      emoji: "📚",
      description: "Engage with books, articles, or videos that inspire or comfort you",
      icon: Book,
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-300",
      tips: "Reading or watching content that inspires you can shift your perspective and provide hope."
    },
    {
      id: 12,
      title: "Deep Breathing or Yoga",
      emoji: "🧘",
      description: "Practice breathing exercises or gentle yoga movements",
      icon: Heart,
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-300",
      tips: "Controlled breathing and gentle movement can calm your nervous system and reduce stress."
    }
  ];

  const handleStrategySelect = (strategyId) => {
    if (selectedStrategies.includes(strategyId)) {
      // Deselect if already selected
      setSelectedStrategies(selectedStrategies.filter(id => id !== strategyId));
    } else if (selectedStrategies.length < 5) {
      // Select if less than 5 are selected
      setSelectedStrategies([...selectedStrategies, strategyId]);
    } else {
      // Already have 5 selected, replace the first one
      setSelectedStrategies([...selectedStrategies.slice(1), strategyId]);
    }
  };

  const handleBuildRoutine = () => {
    if (selectedStrategies.length !== 5) {
      alert("Please select exactly 5 recovery strategies to build your toolkit.");
      return;
    }
    setShowRecoveryRoutine(true);
  };

  const handleComplete = () => {
    setScore(selectedStrategies.length);
    setShowGameOver(true);
  };

  const selectedStrategyObjects = recoveryStrategies.filter(s =>
    selectedStrategies.includes(s.id)
  );

  return (
    <TeacherGameShell
      title={gameData?.title || "Emotional Recovery Toolkit"}
      subtitle={gameData?.description || "Build a personal plan to handle disappointment or failure days"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showRecoveryRoutine && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🛠️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Emotional Recovery Toolkit
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Build your personal recovery plan. Choose 5 strategies that help you recover from disappointment or failure days.
              </p>
            </div>

            {/* Selection Counter */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedStrategies.length === 5
                      ? 'from-green-400 to-emerald-500'
                      : selectedStrategies.length >= 3
                        ? 'from-blue-400 to-cyan-500'
                        : 'from-gray-300 to-gray-400'
                    } flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                    {selectedStrategies.length}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Strategies Selected</h3>
                    <p className="text-sm text-gray-600">
                      {selectedStrategies.length === 5
                        ? "Perfect! Ready to build your toolkit"
                        : `Select ${5 - selectedStrategies.length} more to complete your toolkit`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Target: 5 Strategies</p>
                  <div className="w-32 bg-gray-200 rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedStrategies.length / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-4 rounded-full ${selectedStrategies.length === 5
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                        }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {recoveryStrategies.map((strategy, index) => {
                const Icon = strategy.icon;
                const isSelected = selectedStrategies.includes(strategy.id);

                return (
                  <motion.button
                    key={strategy.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStrategySelect(strategy.id)}
                    disabled={!isSelected && selectedStrategies.length >= 5}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all ${isSelected
                        ? `bg-gradient-to-br ${strategy.bgColor} ${strategy.borderColor} shadow-lg`
                        : selectedStrategies.length >= 5
                          ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                          : 'bg-white border-gray-300 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected
                          ? `bg-gradient-to-r ${strategy.color} shadow-lg`
                          : 'bg-gray-200'
                        }`}>
                        <span className="text-2xl">{strategy.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                          {strategy.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {strategy.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        </motion.div>
                      )}
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-gray-200"
                      >
                        <p className="text-xs text-gray-700 italic">
                          💡 {strategy.tips}
                        </p>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Build Routine Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBuildRoutine}
                disabled={selectedStrategies.length !== 5}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${selectedStrategies.length === 5
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {selectedStrategies.length === 5 ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Build My Recovery Routine
                  </span>
                ) : (
                  'Select ' + (5 - selectedStrategies.length) + ' more strateg' + (5 - selectedStrategies.length === 1 ? 'y' : 'ies')
                )}
              </motion.button>
            </div>
          </div>
        )}

        {/* Recovery Routine Display */}
        {showRecoveryRoutine && !showGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Recovery Routine
              </h2>
              <p className="text-gray-600 text-lg">
                Your personal plan for handling disappointment or failure days
              </p>
            </div>

            {/* Recovery Routine Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {selectedStrategyObjects.map((strategy, index) => {
                const Icon = strategy.icon;

                return (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${strategy.bgColor} rounded-xl p-6 border-2 ${strategy.borderColor} shadow-md`}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${strategy.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-3xl">{strategy.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-700">Strategy {index + 1}</span>
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${strategy.color} flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {strategy.title}
                        </h3>
                        <p className="text-gray-700 mb-3">
                          {strategy.description}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-sm text-gray-800">
                        <strong>💡 Tip:</strong> {strategy.tips}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Book className="w-5 h-5" />
                How to Use Your Recovery Routine
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Keep it accessible:</strong> Save this routine where you can easily find it on rough days—your phone, desk, or wallet.</li>
                <li>• <strong>Use when needed:</strong> When you experience disappointment or failure, refer to this routine and choose 1-2 strategies that feel right.</li>
                <li>• <strong>Practice regularly:</strong> Don't wait for difficult days. Practice these strategies regularly to build resilience.</li>
                <li>• <strong>Adjust as needed:</strong> Your needs may change over time. Feel free to update your routine with strategies that work best for you.</li>
                <li>• <strong>Combine strategies:</strong> You don't have to use just one. Combine strategies that complement each other.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-5 h-5" />
                Print or Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Complete Toolkit
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Game Over Summary */}
        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🎉🛠️
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Recovery Toolkit is Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've built a personal plan for handling difficult days
              </p>
            </div>

            {/* Toolkit Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Recovery Strategies:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStrategyObjects.map((strategy, index) => (
                  <div
                    key={strategy.id}
                    className={`bg-gradient-to-br ${strategy.bgColor} rounded-xl p-4 border-2 ${strategy.borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{strategy.emoji}</span>
                      <div>
                        <h4 className="font-bold text-gray-800">{strategy.title}</h4>
                        <p className="text-sm text-gray-700">{strategy.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resilience Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Recovery Toolkit Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Preparation builds resilience:</strong> Having a recovery plan ready helps you respond effectively when difficult days come.</li>
                <li>• <strong>Personalization matters:</strong> Your toolkit is unique to you. Choose strategies that genuinely help you recover and restore.</li>
                <li>• <strong>Accessibility is key:</strong> Keep your recovery routine easily accessible so you can use it when you need it most.</li>
                <li>• <strong>Practice makes it natural:</strong> Regularly practicing recovery strategies makes them more effective and easier to use during difficult times.</li>
                <li>• <strong>Flexibility is important:</strong> Different situations may require different strategies. Be flexible in how you use your toolkit.</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Book className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Keep the plan accessible for rough days. Your recovery toolkit is most effective when you can easily access it when you need it:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Save on your phone:</strong> Take a screenshot of your recovery routine or save it as a note on your phone for easy access.</li>
                    <li><strong>Print and post:</strong> Print your recovery routine and post it in your workspace, car, or home where you'll see it regularly.</li>
                    <li><strong>Create reminders:</strong> Set calendar reminders or phone notifications to practice your recovery strategies regularly, not just on difficult days.</li>
                    <li><strong>Share with trusted people:</strong> Share your recovery toolkit with a trusted colleague or family member who can remind you to use it when needed.</li>
                    <li><strong>Review regularly:</strong> Review your recovery routine weekly or monthly to ensure it still fits your needs and update it as necessary.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you keep your recovery plan accessible and visible, you're more likely to use it on rough days. This preparation makes recovery faster and more effective, helping you bounce back from disappointment or failure more quickly. Having a plan ready removes the mental effort of figuring out what to do when you're already struggling, making recovery more accessible and sustainable.
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

export default EmotionalRecoveryToolkit;