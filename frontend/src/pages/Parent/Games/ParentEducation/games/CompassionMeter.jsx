import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; //eslint-disable-line
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const CompassionMeter = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-25";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [dailyRatings, setDailyRatings] = useState({});
  const [showTrend, setShowTrend] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  // Day scenarios with context
  const days = [
    {
      id: 1,
      title: "Day 1: Monday Morning",
      context: "The start of the week. Everyone is adjusting to the routine after the weekend.",
      scenario: "How did you handle morning routines, school preparation, and getting everyone out the door?"
    },
    {
      id: 2,
      title: "Day 2: Midweek Stress",
      context: "The middle of the week. Work and school pressures are building up.",
      scenario: "How did you manage stress, homework battles, and evening routines today?"
    },
    {
      id: 3,
      title: "Day 3: Hump Day Challenge",
      context: "Midweek fatigue. Everyone is tired and emotions may be running high.",
      scenario: "How did you respond to conflicts, frustrations, and emotional moments today?"
    },
    {
      id: 4,
      title: "Day 4: Thursday Momentum",
      context: "The week is progressing. You're finding your rhythm.",
      scenario: "How did you balance firmness with kindness in your interactions today?"
    },
    {
      id: 5,
      title: "Day 5: Friday Reflection",
      context: "End of the week. Time to reflect on the week's patterns and progress.",
      scenario: "How did you show patience, use a calm tone, and demonstrate understanding today?"
    }
  ];

  // Calculate average scores
  const calculateAverage = (metric) => {
    const ratings = Object.values(dailyRatings);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, day) => acc + (day[metric] || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Get reflection suggestion based on trends
  const getReflection = () => {
    if (Object.keys(dailyRatings).length < 2) {
      return {
        title: "Keep Tracking!",
        message: "Continue rating yourself each day. Awareness is the first step toward growth.",
        color: "blue"
      };
    }

    const patienceAvg = parseFloat(calculateAverage('patience'));
    const toneAvg = parseFloat(calculateAverage('tone'));
    const understandingAvg = parseFloat(calculateAverage('understanding'));

    const overallAvg = (patienceAvg + toneAvg + understandingAvg) / 3;
    
    // Check for improvement trend
    const dayKeys = Object.keys(dailyRatings).sort();
    const firstDay = dailyRatings[dayKeys[0]];
    const lastDay = dailyRatings[dayKeys[dayKeys.length - 1]];
    
    const firstAvg = ((firstDay.patience || 0) + (firstDay.tone || 0) + (firstDay.understanding || 0)) / 3;
    const lastAvg = ((lastDay.patience || 0) + (lastDay.tone || 0) + (lastDay.understanding || 0)) / 3;
    const improvement = lastAvg - firstAvg;

    if (improvement > 1) {
      return {
        title: "Great Progress!",
        message: `You've improved by ${improvement.toFixed(1)} points this week! Your awareness and practice are making a difference. Keep celebrating these small wins.`,
        color: "green"
      };
    } else if (improvement > 0) {
      return {
        title: "Steady Improvement",
        message: `You're showing improvement this week. Every small gain matters. Remember: progress over perfection!`,
        color: "blue"
      };
    } else if (overallAvg >= 7) {
      return {
        title: "Strong Compassion Practice",
        message: "You're consistently showing high levels of patience, calm tone, and understanding. This creates a positive foundation for your relationships.",
        color: "green"
      };
    } else if (overallAvg >= 5) {
      return {
        title: "Building Awareness",
        message: "You're developing self-awareness, which is the foundation of growth. Consider focusing on one area to strengthen—small improvements compound over time.",
        color: "blue"
      };
    } else {
      return {
        title: "Awareness is Growth",
        message: "Noticing where you struggle is itself an act of compassion. Be kind to yourself. Every moment you choose compassion is a win, no matter how small.",
        color: "orange"
      };
    }
  };

  const handleRatingChange = (metric, value) => {
    setDailyRatings(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [metric]: parseInt(value)
      }
    }));
  };

  const handleNext = () => {
    if (currentDay < totalLevels - 1) {
      setCurrentDay(prev => prev + 1);
      setShowTrend(false);
    } else {
      // Show results after completing all days
      setShowTrend(true);
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentDay(0);
    setDailyRatings({});
    setShowTrend(false);
    setShowGameOver(false);
  };

  const currentDayData = days[currentDay];
  const currentRatings = dailyRatings[currentDay] || {};
  const completedDaysCount = Object.values(dailyRatings).filter(
    (day) => day.patience && day.tone && day.understanding
  ).length;
  const progress = ((currentDay + 1) / totalLevels) * 100;

  // Simple trend chart component
  const TrendChart = () => {
    const dayKeys = Object.keys(dailyRatings).sort((a, b) => parseInt(a) - parseInt(b));
    const maxValue = 10;
    const chartHeight = 250;

    if (dayKeys.length === 0) return null;

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Your Week's Trend</h3>
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          {/* Chart container */}
          <div className="relative h-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2 w-8">
              <span>10</span>
              <span>7.5</span>
              <span>5</span>
              <span>2.5</span>
              <span>0</span>
            </div>

            {/* Chart area with padding */}
            <div className="ml-10 h-full border-l-2 border-b-2 border-gray-300 relative">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(percent => (
                <div
                  key={percent}
                  className="absolute left-0 right-0 border-t border-gray-200"
                  style={{ bottom: `${percent}%` }}
                />
              ))}

              {/* SVG for trend lines and data points */}
              {dayKeys.length > 0 && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Patience line */}
                  {dayKeys.length > 1 && (
                    <polyline
                      points={dayKeys.map((dayKey, idx) => {
                        const x = (idx / (dayKeys.length - 1)) * 100;
                        const y = 100 - ((dailyRatings[dayKey].patience || 0) / maxValue * 100);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {/* Tone line */}
                  {dayKeys.length > 1 && (
                    <polyline
                      points={dayKeys.map((dayKey, idx) => {
                        const x = (idx / (dayKeys.length - 1)) * 100;
                        const y = 100 - ((dailyRatings[dayKey].tone || 0) / maxValue * 100);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {/* Understanding line */}
                  {dayKeys.length > 1 && (
                    <polyline
                      points={dayKeys.map((dayKey, idx) => {
                        const x = (idx / (dayKeys.length - 1)) * 100;
                        const y = 100 - ((dailyRatings[dayKey].understanding || 0) / maxValue * 100);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  
                  {/* Data points */}
                  {dayKeys.map((dayKey, idx) => {
                    const x = (idx / (dayKeys.length - 1 || 1)) * 100;
                    const patienceY = 100 - ((dailyRatings[dayKey].patience || 0) / maxValue * 100);
                    const toneY = 100 - ((dailyRatings[dayKey].tone || 0) / maxValue * 100);
                    const understandingY = 100 - ((dailyRatings[dayKey].understanding || 0) / maxValue * 100);
                    
                    return (
                      <g key={dayKey}>
                        <circle cx={x} cy={patienceY} r="2" fill="#10b981" stroke="white" strokeWidth="0.5" />
                        <circle cx={x} cy={toneY} r="2" fill="#3b82f6" stroke="white" strokeWidth="0.5" />
                        <circle cx={x} cy={understandingY} r="2" fill="#8b5cf6" stroke="white" strokeWidth="0.5" />
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Day labels */}
              {dayKeys.map((dayKey, idx) => {
                const xPercent = dayKeys.length > 1 ? (idx / (dayKeys.length - 1)) * 100 : 50;
                return (
                  <div key={`label-${dayKey}`} className="absolute" style={{ left: `${xPercent}%`, transform: 'translateX(-50%)', bottom: '-25px' }}>
                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                      Day {parseInt(dayKey) + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Patience</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">Tone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-gray-700">Understanding</span>
          </div>
        </div>
      </div>
    );
  };

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentDay}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Day {currentDay + 1} of {totalLevels}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {!showTrend ? (
          <>
            {/* Day information */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentDayData.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-lg text-gray-700 leading-relaxed mb-3">
                    {currentDayData.context}
                  </p>
                  <p className="text-base text-indigo-700 font-medium italic">
                    {currentDayData.scenario}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Rate yourself (1-10) for today:
                </p>
                <p className="text-sm text-gray-600">
                  Be honest and compassionate with yourself
                </p>
              </div>
            </div>

            {/* Rating sliders */}
            <div className="space-y-6 mb-6">
              {/* Patience */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🌱</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Patience</h3>
                      <p className="text-sm text-gray-600">How patient were you today?</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {currentRatings.patience || 5}
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentRatings.patience || 5}
                  onChange={(e) => handleRatingChange('patience', e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Tone */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎵</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Tone</h3>
                      <p className="text-sm text-gray-600">How calm and kind was your tone?</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {currentRatings.tone || 5}
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentRatings.tone || 5}
                  onChange={(e) => handleRatingChange('tone', e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Harsh</span>
                  <span>Neutral</span>
                  <span>Calm & Kind</span>
                </div>
              </div>

              {/* Understanding */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💙</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Understanding</h3>
                      <p className="text-sm text-gray-600">How well did you understand their perspective?</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {currentRatings.understanding || 5}
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentRatings.understanding || 5}
                  onChange={(e) => handleRatingChange('understanding', e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Dismissive</span>
                  <span>Moderate</span>
                  <span>Highly Empathetic</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            {currentRatings.patience && currentRatings.tone && currentRatings.understanding && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6 border border-green-200"
              >
                <p className="text-center text-sm text-gray-700">
                  <strong>Today's Average:</strong> {(
                    (parseInt(currentRatings.patience) + 
                     parseInt(currentRatings.tone) + 
                     parseInt(currentRatings.understanding)) / 3
                  ).toFixed(1)} / 10
                </p>
              </motion.div>
            )}

            {/* Next button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!currentRatings.patience || !currentRatings.tone || !currentRatings.understanding}
              className={`w-full px-6 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all ${
                currentRatings.patience && currentRatings.tone && currentRatings.understanding
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentDay < totalLevels - 1 ? 'Continue to Next Day' : "View Week's Results"}
            </motion.button>
          </>
        ) : (
          /* Results view */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Summary stats */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-indigo-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  Your Week's Compassion Summary
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {calculateAverage('patience')}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Patience</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {calculateAverage('tone')}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Tone</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {calculateAverage('understanding')}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Understanding</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {((parseFloat(calculateAverage('patience')) + 
                       parseFloat(calculateAverage('tone')) + 
                       parseFloat(calculateAverage('understanding'))) / 3).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Overall Average</div>
                </div>
              </div>

              {/* Trend chart */}
              <TrendChart />

              {/* Reflection */}
              {(() => {
                const reflection = getReflection();
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    delay={0.3}
                    className={`p-6 rounded-xl border-2 ${
                      reflection.color === 'green' ? 'bg-green-50 border-green-200' :
                      reflection.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                      'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <h3 className={`text-xl font-bold mb-3 ${
                      reflection.color === 'green' ? 'text-green-800' :
                      reflection.color === 'blue' ? 'text-blue-800' :
                      'text-orange-800'
                    }`}>
                      💡 {reflection.title}
                    </h3>
                    <p className={`${
                      reflection.color === 'green' ? 'text-green-700' :
                      reflection.color === 'blue' ? 'text-blue-700' :
                      'text-orange-700'
                    } leading-relaxed`}>
                      {reflection.message}
                    </p>
                  </motion.div>
                );
              })()}

              {/* Parent tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.5}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> Improvement matters more than perfection—celebrate small gains. 
                  Every day you track your compassion is a day you're growing. Awareness itself is progress. 
                  Be kind to yourself on the difficult days, and celebrate yourself on the good ones.
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentDay + 1}
      score={completedDaysCount}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default CompassionMeter;

