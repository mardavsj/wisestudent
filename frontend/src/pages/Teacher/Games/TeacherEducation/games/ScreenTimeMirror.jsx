import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Monitor, Smartphone, Tablet, Laptop, Tv, Clock, TrendingUp, BookOpen, BarChart3, Eye, AlertCircle, CheckCircle } from "lucide-react";

const ScreenTimeMirror = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-91";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [screenTimeData, setScreenTimeData] = useState({
    work: { hours: 0, minutes: 0 },
    email: { hours: 0, minutes: 0 },
    social: { hours: 0, minutes: 0 },
    entertainment: { hours: 0, minutes: 0 },
    news: { hours: 0, minutes: 0 }
  });

  const [showChart, setShowChart] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Activity definitions
  const activities = [
    {
      id: 'work',
      name: 'Work/Lesson Planning',
      description: 'Time spent on work-related tasks, lesson planning, grading',
      icon: Laptop,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'email',
      name: 'Email/Communication',
      description: 'Checking emails, messaging, communication apps',
      icon: Monitor,
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300'
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Social networking, scrolling, sharing',
      icon: Smartphone,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      description: 'Streaming, videos, games, leisure browsing',
      icon: Tv,
      color: 'from-orange-400 to-amber-500',
      bgColor: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-300'
    },
    {
      id: 'news',
      name: 'News/Information',
      description: 'Reading news, articles, staying informed',
      icon: Tablet,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    }
  ];

  const handleTimeChange = (activityId, type, value) => {
    const numValue = parseInt(value) || 0;
    const maxValue = type === 'hours' ? 24 : 59;

    if (numValue >= 0 && numValue <= maxValue) {
      setScreenTimeData(prev => ({
        ...prev,
        [activityId]: {
          ...prev[activityId],
          [type]: numValue
        }
      }));
    }
  };

  const getTotalMinutes = () => {
    return Object.values(screenTimeData).reduce((total, activity) => {
      return total + (activity.hours * 60) + activity.minutes;
    }, 0);
  };

  const getTotalHours = () => {
    const totalMinutes = getTotalMinutes();
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes, total: totalMinutes / 60 };
  };

  const getActivityMinutes = (activityId) => {
    const activity = screenTimeData[activityId];
    return (activity.hours * 60) + activity.minutes;
  };

  const getActivityPercentage = (activityId) => {
    const total = getTotalMinutes();
    if (total === 0) return 0;
    return (getActivityMinutes(activityId) / total) * 100;
  };

  const getDigitalLoadLevel = () => {
    const totalHours = getTotalHours().total;
    if (totalHours >= 10) {
      return {
        level: 'Very High',
        emoji: '🔴',
        color: 'from-red-500 to-rose-600',
        bgColor: 'from-red-50 to-rose-50',
        borderColor: 'border-red-300',
        message: 'Very high digital exposure may significantly impact focus and rest.',
        recommendation: 'Consider setting strong boundaries and scheduled breaks.'
      };
    } else if (totalHours >= 7) {
      return {
        level: 'High',
        emoji: '🟠',
        color: 'from-orange-500 to-amber-600',
        bgColor: 'from-orange-50 to-amber-50',
        borderColor: 'border-orange-300',
        message: 'High digital exposure may affect your focus and rest quality.',
        recommendation: 'Try to reduce screen time by 1-2 hours, especially before bed.'
      };
    } else if (totalHours >= 5) {
      return {
        level: 'Moderate',
        emoji: '🟡',
        color: 'from-yellow-500 to-amber-600',
        bgColor: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-300',
        message: 'Moderate digital exposure. Some adjustments may help improve focus and rest.',
        recommendation: 'Consider limiting evening screen time and setting device-free times.'
      };
    } else if (totalHours >= 3) {
      return {
        level: 'Low',
        emoji: '🟢',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        message: 'Low digital exposure. This is a healthy amount for maintaining focus and rest.',
        recommendation: 'Continue maintaining balanced screen time habits.'
      };
    } else {
      return {
        level: 'Very Low',
        emoji: '✅',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-300',
        message: 'Very low digital exposure. Excellent for focus and rest!',
        recommendation: 'Keep up the great balance with technology.'
      };
    }
  };

  const handleGenerateChart = () => {
    if (getTotalMinutes() === 0) {
      alert("Please enter at least some screen time data first.");
      return;
    }

    // Calculate score based on completed activities (1 point per activity with time entered)
    let calculatedScore = 0;
    for (const activityId in screenTimeData) {
      const activity = screenTimeData[activityId];
      if ((activity.hours || 0) > 0 || (activity.minutes || 0) > 0) {
        calculatedScore++;
      }
    }

    setShowChart(true);
    setScore(calculatedScore);
    setTimeout(() => {
      setShowGameOver(true);
    }, 3000);
  };

  const totalHours = getTotalHours();
  const digitalLoad = getDigitalLoadLevel();

  return (
    <TeacherGameShell
      title={gameData?.title || "Screen-Time Mirror"}
      subtitle={gameData?.description || "Become aware of how much daily digital exposure affects focus and rest"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📱</div>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Track your daily digital exposure to understand how screen time affects your focus and rest.
              </p>
            </div>

            {!showChart ? (
              <>
                {/* Instructions */}
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    How to Use
                  </h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• <strong>Track one typical day:</strong> Enter the hours and minutes you spend on each digital activity</li>
                    <li>• <strong>Be honest:</strong> Include all screen time—work, personal, and everything in between</li>
                    <li>• <strong>Estimate if needed:</strong> If you're not sure, make your best estimate</li>
                    <li>• <strong>Review your digital load:</strong> See how your total screen time affects focus and rest</li>
                  </ul>
                </div>

                {/* Screen Time Tracker */}
                <div className="space-y-6 mb-8">
                  {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    const activityData = screenTimeData[activity.id];
                    const totalMinutes = getActivityMinutes(activity.id);

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-br ${activity.bgColor} rounded-xl p-6 border-2 ${activity.borderColor}`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${activity.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {activity.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {activity.description}
                            </p>

                            {/* Time Input */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Hours:</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="24"
                                  value={activityData.hours || ''}
                                  onChange={(e) => handleTimeChange(activity.id, 'hours', e.target.value)}
                                  className="w-20 px-3 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center font-semibold"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Minutes:</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={activityData.minutes || ''}
                                  onChange={(e) => handleTimeChange(activity.id, 'minutes', e.target.value)}
                                  className="w-20 px-3 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center font-semibold"
                                />
                              </div>
                              {totalMinutes > 0 && (
                                <div className="ml-auto text-sm font-semibold text-gray-700">
                                  {totalMinutes} min
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Total Summary */}
                {getTotalMinutes() > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-purple-600" />
                      Daily Total Screen Time
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-purple-600">
                        {totalHours.hours}h {totalHours.minutes}m
                      </div>
                      <div className="text-lg text-gray-600">
                        ({totalHours.total.toFixed(1)} hours)
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getTotalMinutes()} total minutes of digital exposure
                    </p>
                  </motion.div>
                )}

                {/* Generate Chart Button */}
                {getTotalMinutes() > 0 && (
                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerateChart}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                    >
                      <BarChart3 className="w-5 h-5" />
                      Generate Digital Load Chart
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              /* Digital Load Chart */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Your Digital Load Chart
                  </h3>
                  <p className="text-xl text-gray-600">
                    Visual representation of your daily digital exposure
                  </p>
                </div>

                {/* Digital Load Level */}
                <div className={`bg-gradient-to-br ${digitalLoad.bgColor} rounded-xl p-8 border-2 ${digitalLoad.borderColor} mb-8`}>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{digitalLoad.emoji}</div>
                    <h3 className={`text-3xl font-bold mb-2 ${digitalLoad.level === 'Very High' ? 'text-red-700' :
                        digitalLoad.level === 'High' ? 'text-orange-700' :
                          digitalLoad.level === 'Moderate' ? 'text-yellow-700' :
                            digitalLoad.level === 'Low' ? 'text-green-700' :
                              'text-emerald-700'
                      }`}>
                      {digitalLoad.level} Digital Load
                    </h3>
                    <div className="text-2xl font-bold text-gray-700 mb-2">
                      {totalHours.hours}h {totalHours.minutes}m / day
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {digitalLoad.message}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recommendation:</p>
                    <p className="text-gray-800 leading-relaxed">
                      {digitalLoad.recommendation}
                    </p>
                  </div>
                </div>

                {/* Activity Breakdown Chart */}
                <div className="bg-white rounded-xl p-8 border-2 border-gray-200 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    Activity Breakdown
                  </h3>

                  <div className="space-y-4">
                    {activities.map((activity, index) => {
                      const Icon = activity.icon;
                      const minutes = getActivityMinutes(activity.id);
                      const percentage = getActivityPercentage(activity.id);
                      const hours = Math.floor(minutes / 60);
                      const mins = minutes % 60;

                      if (minutes === 0) return null;

                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-2 border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${activity.color} flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800">{activity.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {hours > 0 ? `${hours}h ` : ''}{mins}m ({percentage.toFixed(1)}%)
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                              className={`h-full bg-gradient-to-r ${activity.color} rounded-full`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Impact Insights */}
                <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    How Digital Load Affects Focus & Rest
                  </h3>
                  <div className="space-y-3 text-amber-800">
                    {totalHours.total >= 7 && (
                      <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                        <p className="font-semibold mb-2">⚡ High Digital Load Impact:</p>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                          <li>Can reduce deep focus and sustained attention</li>
                          <li>May interfere with restful sleep, especially evening screen use</li>
                          <li>Can increase mental fatigue and eye strain</li>
                          <li>May reduce time for physical activity and face-to-face connections</li>
                          <li>Can create constant stimulation that makes relaxation difficult</li>
                        </ul>
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                      <p className="font-semibold mb-2">💡 Tips for Better Balance:</p>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li><strong>Set boundaries:</strong> Establish specific times for checking emails and social media</li>
                        <li><strong>Screen-free times:</strong> Create device-free periods, especially before bed</li>
                        <li><strong>Take breaks:</strong> Follow the 20-20-20 rule (every 20 minutes, look 20 feet away for 20 seconds)</li>
                        <li><strong>Prioritize rest:</strong> Avoid screens 1-2 hours before sleep for better rest quality</li>
                        <li><strong>Be intentional:</strong> Use screens with purpose rather than defaulting to scrolling</li>
                        <li><strong>Track progress:</strong> Review your chart weekly and set small reduction goals</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGameOver(true)}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Reflection
                  </motion.button>
                </div>
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
                📱✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Digital Load Chart Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've tracked your daily digital exposure and created a visual chart
              </p>
            </div>

            {/* Chart Summary */}
            {showChart && (
              <>
                {/* Digital Load Level Display */}
                <div className={`bg-gradient-to-br ${digitalLoad.bgColor} rounded-xl p-8 border-2 ${digitalLoad.borderColor} mb-6`}>
                  <div className="text-center">
                    <div className="text-5xl mb-3">{digitalLoad.emoji}</div>
                    <h3 className={`text-2xl font-bold mb-2 ${digitalLoad.level === 'Very High' ? 'text-red-700' :
                        digitalLoad.level === 'High' ? 'text-orange-700' :
                          digitalLoad.level === 'Moderate' ? 'text-yellow-700' :
                            digitalLoad.level === 'Low' ? 'text-green-700' :
                              'text-emerald-700'
                      }`}>
                      {digitalLoad.level} Digital Load
                    </h3>
                    <div className="text-3xl font-bold text-gray-700 mb-3">
                      {totalHours.hours}h {totalHours.minutes}m / day
                    </div>
                    <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                      {digitalLoad.message}
                    </p>
                  </div>
                </div>

                {/* Top Activities */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    Your Top Digital Activities
                  </h3>
                  <div className="space-y-3">
                    {activities
                      .map(activity => ({
                        ...activity,
                        minutes: getActivityMinutes(activity.id),
                        percentage: getActivityPercentage(activity.id)
                      }))
                      .filter(activity => activity.minutes > 0)
                      .sort((a, b) => b.minutes - a.minutes)
                      .slice(0, 3)
                      .map((activity, index) => {
                        const Icon = activity.icon;
                        const hours = Math.floor(activity.minutes / 60);
                        const mins = activity.minutes % 60;

                        return (
                          <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <div className="text-2xl font-bold text-purple-600 w-8">#{index + 1}</div>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${activity.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{activity.name}</h4>
                              <p className="text-sm text-gray-600">
                                {hours > 0 ? `${hours}h ` : ''}{mins}m ({activity.percentage.toFixed(1)}% of total)
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                The Power of Digital Awareness
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Increases awareness:</strong> Tracking screen time helps you see exactly where your time goes</li>
                <li>• <strong>Supports focus:</strong> Understanding your digital load helps you make choices that support focus</li>
                <li>• <strong>Improves rest:</strong> Awareness of evening screen use helps you protect rest quality</li>
                <li>• <strong>Guides decisions:</strong> Seeing your digital load helps you make intentional choices about technology use</li>
                <li>• <strong>Reduces overwhelm:</strong> Understanding your exposure helps you feel more in control</li>
                <li>• <strong>Creates balance:</strong> Awareness is the first step toward creating healthier technology habits</li>
                <li>• <strong>Prevents burnout:</strong> Managing digital load helps prevent technology-related exhaustion</li>
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
                    <strong>Review chart every Sunday and set one small reduction goal.</strong> Making screen-time awareness a weekly practice helps you maintain healthy digital habits:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Sunday review:</strong> Every Sunday, review your digital load chart from the past week. Sunday reflection helps you plan for the week ahead.</li>
                    <li><strong>Notice patterns:</strong> Look for patterns in your screen time—when do you use devices most? What activities take the most time? Pattern recognition helps you make informed changes.</li>
                    <li><strong>Set one goal:</strong> Choose ONE small reduction goal for the week—not multiple goals, just one. Examples: "Reduce evening screen time by 30 minutes," "No screens after 9 PM," "Check email only 3 times per day."</li>
                    <li><strong>Make it specific:</strong> Set a specific, measurable goal rather than a vague intention. Specificity makes success more likely.</li>
                    <li><strong>Start small:</strong> Choose a goal that feels achievable, not overwhelming. Small reductions add up over time.</li>
                    <li><strong>Track progress:</strong> Note your progress throughout the week. Tracking helps you see improvement and stay motivated.</li>
                    <li><strong>Celebrate success:</strong> When you meet your goal, celebrate! Acknowledging success reinforces positive habits.</li>
                    <li><strong>Adjust as needed:</strong> If a goal is too easy, increase it slightly. If it's too hard, make it smaller. Flexibility helps you find what works.</li>
                    <li><strong>Build gradually:</strong> Once one goal becomes a habit, add another small goal. Gradual change is more sustainable than sudden overhaul.</li>
                    <li><strong>Be kind to yourself:</strong> If you don't meet your goal one week, be kind to yourself and try again. Self-compassion supports long-term change.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you review your chart every Sunday and set one small reduction goal, you're creating a practice that builds awareness, supports focus, improves rest, and helps you develop healthier relationships with technology. Regular review and small, intentional goals transform digital awareness into sustainable habits that benefit your well-being and teaching effectiveness.
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

export default ScreenTimeMirror;