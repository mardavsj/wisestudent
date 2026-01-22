import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { ArrowUp, Heart, Sparkles, CheckCircle, Book } from "lucide-react";

const GratitudeLadder = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-59";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [step, setStep] = useState(1); // 1: Writing, 2: Animation, 3: Complete
  const [rungEntries, setRungEntries] = useState({
    today: "",
    thisWeek: "",
    thisMonth: "",
    thisYear: "",
    myPurpose: ""
  });
  const [currentClimbingRung, setCurrentClimbingRung] = useState(0);
  const [showClimbAnimation, setShowClimbAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [completedRungs, setCompletedRungs] = useState(new Set());
  const [showGameOver, setShowGameOver] = useState(false);

  // Ladder rungs definition
  const rungs = [
    {
      id: 'today',
      label: 'Today',
      description: 'What are you grateful for today?',
      emoji: '☀️',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      prompt: 'What are you grateful for today? (e.g., "A student smiled at me", "I had time to breathe")'
    },
    {
      id: 'thisWeek',
      label: 'This Week',
      description: 'What are you grateful for this week?',
      emoji: '📅',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      prompt: 'What are you grateful for this week? (e.g., "A lesson went well", "I connected with a colleague")'
    },
    {
      id: 'thisMonth',
      label: 'This Month',
      description: 'What are you grateful for this month?',
      emoji: '🌙',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300',
      prompt: 'What are you grateful for this month? (e.g., "I learned a new teaching strategy", "My students made progress")'
    },
    {
      id: 'thisYear',
      label: 'This Year',
      description: 'What are you grateful for this year?',
      emoji: '🌟',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      prompt: 'What are you grateful for this year? (e.g., "I grew as a teacher", "I built meaningful relationships with students")'
    },
    {
      id: 'myPurpose',
      label: 'My Purpose',
      description: 'What are you grateful for about your purpose as a teacher?',
      emoji: '💫',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      prompt: 'What are you grateful for about your purpose as a teacher? (e.g., "I make a difference in students\' lives", "I help shape the future")'
    }
  ];

  const allRungsFilled = Object.values(rungEntries).every(entry => entry.trim().length >= 10);

  const handleRungChange = (rungId, value) => {
    setRungEntries(prev => ({
      ...prev,
      [rungId]: value
    }));

    // Track completed rungs for scoring
    if (value.trim().length >= 10) {
      setCompletedRungs(prev => new Set(prev).add(rungId));
    } else {
      setCompletedRungs(prev => {
        const newSet = new Set(prev);
        newSet.delete(rungId);
        return newSet;
      });
    }
  };

  const handleStartClimb = () => {
    if (allRungsFilled) {
      setScore(completedRungs.size); // Award score based on completed rungs (1 point per rung)
      setStep(2);
      setShowClimbAnimation(true);
      animateClimb();
    }
  };

  const animateClimb = () => {
    // Animate climbing each rung one by one
    let currentRung = 0;
    const climbInterval = setInterval(() => {
      setCurrentClimbingRung(currentRung);
      currentRung++;

      if (currentRung > rungs.length) {
        clearInterval(climbInterval);
        setTimeout(() => {
          setShowClimbAnimation(false);
          setStep(3);
          setShowGameOver(true);
        }, 2000);
      }
    }, 1500); // 1.5 seconds per rung
  };

  const completedCount = Object.values(rungEntries).filter(entry => entry.trim().length >= 10).length;
  const progress = (completedCount / rungs.length) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Gratitude Ladder"}
      subtitle={gameData?.description || "Earn 1 Healcoin per gratitude rung completed"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={completedRungs.size}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🪜</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Gratitude Ladder
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Climb the ladder of gratitude by appreciating progress at different time scales.
                Fill each rung with something you're grateful for.
              </p>
            </div>

            {/* Progress */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Progress</h3>
                  <p className="text-sm text-gray-600">Complete each rung to climb higher</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Rungs Completed</p>
                  <p className="text-3xl font-bold text-indigo-600">{completedCount} / {rungs.length}</p>
                  <p className="text-sm text-purple-600 font-semibold">🧡 {completedRungs.size} Healcoins earned</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full"
                />
              </div>
            </div>

            {/* Ladder Visualization */}
            <div className="mb-8">
              <div className="relative" style={{ height: '600px', margin: '0 auto', maxWidth: '400px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 600"
                  className="absolute inset-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Ladder sides */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="550"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="350"
                    y1="50"
                    x2="350"
                    y2="550"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Rungs */}
                  {rungs.map((rung, index) => {
                    const yPosition = 100 + index * 100;
                    const isCompleted = rungEntries[rung.id].trim().length >= 10;
                    const isClimbing = currentClimbingRung === index + 1;

                    return (
                      <g key={rung.id}>
                        {/* Rung line */}
                        <line
                          x1="50"
                          y1={yPosition}
                          x2="350"
                          y2={yPosition}
                          stroke={isCompleted ? '#10b981' : '#d1d5db'}
                          strokeWidth={isCompleted ? '6' : '4'}
                          strokeLinecap="round"
                        />
                        {/* Rung label background */}
                        <rect
                          x="150"
                          y={yPosition - 15}
                          width="100"
                          height="30"
                          fill={isCompleted ? '#10b981' : '#f3f4f6'}
                          rx="15"
                        />
                        {/* Rung label text */}
                        <text
                          x="200"
                          y={yPosition + 5}
                          textAnchor="middle"
                          fill={isCompleted ? 'white' : '#6b7280'}
                          fontSize="14"
                          fontWeight="bold"
                        >
                          {rung.label}
                        </text>
                        {/* Climbing indicator */}
                        {isClimbing && (
                          <motion.circle
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
                            transition={{ duration: 0.5, repeat: 2 }}
                            cx="200"
                            cy={yPosition}
                            r="20"
                            fill="#fbbf24"
                          />
                        )}
                        {/* Completion checkmark */}
                        {isCompleted && !isClimbing && (
                          <motion.text
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            x="200"
                            y={yPosition + 5}
                            textAnchor="middle"
                            fill="white"
                            fontSize="16"
                            fontWeight="bold"
                          >
                            ✓
                          </motion.text>
                        )}
                      </g>
                    );
                  })}

                  {/* Climbing person animation */}
                  {showClimbAnimation && currentClimbingRung > 0 && currentClimbingRung <= rungs.length && (
                    <motion.g
                      initial={{ y: 100 + (currentClimbingRung - 1) * 100 }}
                      animate={{ y: 100 + (currentClimbingRung - 1) * 100 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Person emoji/icon */}
                      <text
                        x="200"
                        y={100 + (currentClimbingRung - 1) * 100 - 20}
                        textAnchor="middle"
                        fontSize="32"
                      >
                        🧗
                      </text>
                    </motion.g>
                  )}
                </svg>
              </div>
            </div>

            {/* Rung Input Fields */}
            <div className="space-y-6 mb-8">
              {rungs.map((rung, index) => {
                const value = rungEntries[rung.id];
                const isCompleted = value.trim().length >= 10;

                return (
                  <motion.div
                    key={rung.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-xl border-2 transition-all ${isCompleted
                        ? `bg-gradient-to-br ${rung.bgColor} ${rung.borderColor} shadow-md`
                        : 'bg-white border-gray-300 hover:border-indigo-400'
                      }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl ${isCompleted
                            ? `bg-gradient-to-r ${rung.color} shadow-lg`
                            : 'bg-gray-200'
                          }`}>
                          {isCompleted ? rung.emoji : <span className="text-gray-500">{index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-800">
                              {rung.label}
                            </h3>
                            {isCompleted && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                              >
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {rung.description}
                          </p>
                        </div>
                      </div>
                      <textarea
                        value={value}
                        onChange={(e) => handleRungChange(rung.id, e.target.value)}
                        placeholder={rung.prompt}
                        className={`w-full h-24 p-4 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${isCompleted
                            ? `bg-white ${rung.borderColor}`
                            : 'bg-gray-50 border-gray-300 focus:border-indigo-400'
                          }`}
                      />
                      {isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 text-sm text-green-600 font-medium flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Rung complete! Climbing higher in gratitude.</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Start Climb Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartClimb}
                disabled={!allRungsFilled}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${allRungsFilled
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {allRungsFilled ? (
                  <span className="flex items-center justify-center gap-2">
                    <ArrowUp className="w-5 h-5" />
                    Climb the Ladder!
                  </span>
                ) : (
                  `Complete ${rungs.length - completedCount} more rung${rungs.length - completedCount !== 1 ? 's' : ''} to climb`
                )}
              </motion.button>
            </div>
          </div>
        )}

        {step === 2 && showClimbAnimation && (
          /* Climbing Animation */
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-purple-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Climbing Your Gratitude Ladder</h2>

              {/* Animated Ladder */}
              <div className="relative mb-8" style={{ height: '600px', margin: '0 auto', maxWidth: '400px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 600"
                  className="absolute inset-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Ladder sides */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="550"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="350"
                    y1="50"
                    x2="350"
                    y2="550"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Completed rungs */}
                  {rungs.map((rung, index) => {
                    const yPosition = 100 + index * 100;
                    const isClimbing = currentClimbingRung === index + 1;
                    const isReached = currentClimbingRung > index + 1;

                    return (
                      <g key={rung.id}>
                        {/* Rung line */}
                        <line
                          x1="50"
                          y1={yPosition}
                          x2="350"
                          y2={yPosition}
                          stroke="#10b981"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        {/* Rung label */}
                        <rect
                          x="150"
                          y={yPosition - 15}
                          width="100"
                          height="30"
                          fill="#10b981"
                          rx="15"
                        />
                        <text
                          x="200"
                          y={yPosition + 5}
                          textAnchor="middle"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                        >
                          {rung.label}
                        </text>
                        {/* Sparkle effect on current rung */}
                        {isClimbing && (
                          <motion.g
                            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          >
                            <text
                              x="200"
                              y={yPosition - 30}
                              textAnchor="middle"
                              fontSize="24"
                            >
                              ✨
                            </text>
                          </motion.g>
                        )}
                        {/* Checkmark on reached rungs */}
                        {isReached && (
                          <text
                            x="200"
                            y={yPosition + 5}
                            textAnchor="middle"
                            fill="white"
                            fontSize="16"
                            fontWeight="bold"
                          >
                            ✓
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Climbing person */}
                  {currentClimbingRung > 0 && currentClimbingRung <= rungs.length && (
                    <motion.g
                      animate={{
                        y: 100 + (currentClimbingRung - 1) * 100 - 20
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <text
                        x="200"
                        y={100 + (currentClimbingRung - 1) * 100 - 20}
                        textAnchor="middle"
                        fontSize="40"
                      >
                        🧗
                      </text>
                    </motion.g>
                  )}
                </svg>
              </div>

              <p className="text-xl text-gray-700">
                {currentClimbingRung > 0 && currentClimbingRung <= rungs.length && (
                  <span>
                    Reached: <strong>{rungs[currentClimbingRung - 1].label}</strong> - {rungs[currentClimbingRung - 1].description}
                  </span>
                )}
                {currentClimbingRung > rungs.length && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-green-600"
                  >
                    🎉 You've reached the top! 🎉
                  </motion.span>
                )}
              </p>
            </div>
          </div>
        )}

        {showGameOver && step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🎉💫
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Gratitude Ladder Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've earned {score} Healcoins for climbing through gratitude
              </p>
            </div>

            {/* Gratitude Summary */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Your Gratitude Journey:</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Healcoins Earned</p>
                  <p className="text-3xl font-bold text-purple-600">🧡 {score}</p>
                </div>
              </div>
              <div className="space-y-4">
                {rungs.map((rung, index) => {
                  const value = rungEntries[rung.id];
                  if (!value.trim()) return null;

                  return (
                    <motion.div
                      key={rung.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${rung.bgColor} rounded-xl p-5 border-2 ${rung.borderColor}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${rung.color} flex items-center justify-center flex-shrink-0 text-xl`}>
                          {rung.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-2">{rung.label}: {rung.description}</p>
                          <p className="text-gray-700 leading-relaxed">{value}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Resilience Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Resilience Building Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Gratitude builds resilience:</strong> Appreciating progress at different time scales helps you see how far you've come.</li>
                <li>• <strong>Daily progress matters:</strong> Recognizing small daily wins builds momentum and resilience over time.</li>
                <li>• <strong>Purpose anchors gratitude:</strong> Connecting gratitude to your purpose as a teacher strengthens your sense of meaning and resilience.</li>
                <li>• <strong>Progress is cumulative:</strong> Each rung represents progress at a different scale, showing how growth compounds over time.</li>
                <li>• <strong>Reflection deepens appreciation:</strong> Regularly reflecting on gratitude at different time scales deepens your appreciation and resilience.</li>
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
                    Use ladder reflection in monthly meetings. The gratitude ladder can be a powerful tool for team reflection and building collective resilience:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Monthly team ladder:</strong> At monthly staff meetings, have each teacher share one gratitude from each rung. This creates a collective appreciation practice.</li>
                    <li><strong>Grade-level reflections:</strong> Use the ladder structure in grade-level meetings to reflect on progress and build team resilience.</li>
                    <li><strong>Personal ladder check-ins:</strong> Set aside time monthly to review your personal gratitude ladder. Reflect on how your gratitudes have evolved.</li>
                    <li><strong>Student progress ladder:</strong> Adapt the ladder for reflecting on student progress: today's win, this week's growth, this month's achievement, this year's transformation.</li>
                    <li><strong>Share with colleagues:</strong> Share your gratitude ladder reflections with trusted colleagues to build mutual support and appreciation.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you use ladder reflection in monthly meetings, you create regular opportunities for appreciation and resilience building. This practice helps teams recognize progress, build collective gratitude, and strengthen resilience together. The ladder structure provides a framework for reflecting on progress at different time scales, making gratitude more tangible and meaningful.
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

export default GratitudeLadder;