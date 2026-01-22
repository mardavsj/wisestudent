import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Calendar, Clock, Coffee, Heart, Moon, CheckCircle, Bell, BookOpen, Plus, X } from "lucide-react";

const RestRecoveryPlan = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-98";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [planData, setPlanData] = useState({
    dailyMiniBreak: {
      time: '',
      activity: '',
      duration: ''
    },
    weeklyJoy: {
      day: '',
      activity: '',
      duration: ''
    },
    monthlyReset: {
      date: '',
      activity: '',
      duration: ''
    },
    monthlySelfCare: {
      date: '',
      activity: '',
      duration: ''
    },
    quarterlyReflection: {
      date: '',
      activity: '',
      duration: ''
    }
  });
  const [remindersSet, setRemindersSet] = useState({
    dailyMiniBreak: false,
    weeklyJoy: false,
    monthlyReset: false,
    monthlySelfCare: false,
    quarterlyReflection: false
  });
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const activitySuggestions = {
    dailyMiniBreak: [
      'Deep breathing (5 minutes)',
      'Stretch break (5 minutes)',
      'Walk around school (10 minutes)',
      'Quiet moment alone (5 minutes)',
      'Listen to calming music (5 minutes)',
      'Drink water and pause (3 minutes)',
      'Look out a window (3 minutes)'
    ],
    weeklyJoy: [
      'Coffee with a friend',
      'Watch a favorite show',
      'Read a book',
      'Take a nature walk',
      'Cook a special meal',
      'Do a creative hobby',
      'Attend a class or workshop',
      'Have a spa day at home'
    ],
    monthlyReset: [
      'Full day off with no plans',
      'Weekend getaway',
      'Day of self-care activities',
      'Visit a new place',
      'Digital detox day',
      'Reconnect with loved ones',
      'Try something new',
      'Reflect and plan ahead'
    ],
    monthlySelfCare: [
      'Self-massage with oils',
      'Take a relaxing bath',
      'Practice yoga at home',
      'Do a skincare routine',
      'Journal and reflect',
      'Meditate for 20 minutes',
      'Read inspirational books',
      'Listen to healing music'
    ],
    quarterlyReflection: [
      'Review and adjust goals',
      'Evaluate teaching practices',
      'Plan professional development',
      'Assess work-life balance',
      'Celebrate achievements',
      'Identify stress patterns',
      'Reassess priorities',
      'Create new intentions'
    ]
  };

  const handleInputChange = (section, field, value) => {
    setPlanData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSetReminder = (section) => {
    // Validate that the specific section is filled
    let isValid = false;

    switch (section) {
      case 'dailyMiniBreak':
        isValid = planData.dailyMiniBreak.time && planData.dailyMiniBreak.activity;
        break;
      case 'weeklyJoy':
        isValid = planData.weeklyJoy.day && planData.weeklyJoy.activity;
        break;
      case 'monthlyReset':
        isValid = planData.monthlyReset.date && planData.monthlyReset.activity;
        break;
      case 'monthlySelfCare':
        isValid = planData.monthlySelfCare.date && planData.monthlySelfCare.activity;
        break;
      case 'quarterlyReflection':
        isValid = planData.quarterlyReflection.date && planData.quarterlyReflection.activity;
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      alert(`Please fill in all required fields for ${section.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} before setting reminder.`);
      return;
    }

    // Update the specific reminder status
    setRemindersSet(prev => ({
      ...prev,
      [section]: true
    }));

    // Update score based on how many reminders are set
    const newScore = Object.values({ ...remindersSet, [section]: true }).filter(Boolean).length;
    setScore(Math.min(newScore, 5)); // Cap at 5

    // Check if all 5 reminders are set
    const allSet = Object.values({ ...remindersSet, [section]: true }).every(Boolean);
    if (allSet) {
      setTimeout(() => {
        setShowGameOver(true);
      }, 2000);
    }
  };

  const getFormattedDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toISOString().split('T')[0];
  };

  const getQuarterlyDate = () => {
    const today = new Date();
    const nextQuarter = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    return nextQuarter.toISOString().split('T')[0];
  };

  if (showGameOver) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Rest & Recovery Plan"}
        subtitle={gameData?.description || "Schedule deliberate rest periods to prevent exhaustion"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={score}
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
                📅✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Rest & Recovery Plan Complete!
              </h2>
              <p className="text-xl text-gray-600">
                Your rest appointments are scheduled
              </p>
            </div>

            {/* Reminder Confirmation */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  Reminders Set
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  ✓ Daily Mini Break: {remindersSet.dailyMiniBreak ? 'SET' : 'NOT SET'}
                </p>
                <p className="text-gray-700">
                  ✓ Weekly Joy: {remindersSet.weeklyJoy ? 'SET' : 'NOT SET'}
                </p>
                <p className="text-gray-700">
                  ✓ Monthly Reset: {remindersSet.monthlyReset ? 'SET' : 'NOT SET'}
                </p>
                <p className="text-gray-700">
                  ✓ Monthly Self Care: {remindersSet.monthlySelfCare ? 'SET' : 'NOT SET'}
                </p>
                <p className="text-gray-700">
                  ✓ Quarterly Reflection: {remindersSet.quarterlyReflection ? 'SET' : 'NOT SET'}
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                Your rest appointments have been scheduled. Remember to honor these rest times as strictly as you would honor a meeting.
              </p>
            </div>

            {/* Plan Summary */}
            <div className="space-y-6 mb-6">
              {/* Daily Mini Break */}
              {planData.dailyMiniBreak.time && planData.dailyMiniBreak.activity && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-start gap-4 mb-4">
                    <Coffee className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Daily Mini Break</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Time:</strong> {planData.dailyMiniBreak.time}</p>
                        <p><strong>Activity:</strong> {planData.dailyMiniBreak.activity}</p>
                        {planData.dailyMiniBreak.duration && (
                          <p><strong>Duration:</strong> {planData.dailyMiniBreak.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border-2 border-blue-200">
                      <p className="text-sm font-semibold text-blue-700">Daily</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weekly Joy */}
              {planData.weeklyJoy.day && planData.weeklyJoy.activity && (
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                  <div className="flex items-start gap-4 mb-4">
                    <Heart className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Joy</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Day:</strong> {planData.weeklyJoy.day}</p>
                        <p><strong>Activity:</strong> {planData.weeklyJoy.activity}</p>
                        {planData.weeklyJoy.duration && (
                          <p><strong>Duration:</strong> {planData.weeklyJoy.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border-2 border-pink-200">
                      <p className="text-sm font-semibold text-pink-700">Weekly</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly Reset */}
              {planData.monthlyReset.date && planData.monthlyReset.activity && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-start gap-4 mb-4">
                    <Moon className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Monthly Reset</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Date:</strong> {new Date(planData.monthlyReset.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p><strong>Activity:</strong> {planData.monthlyReset.activity}</p>
                        {planData.monthlyReset.duration && (
                          <p><strong>Duration:</strong> {planData.monthlyReset.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border-2 border-purple-200">
                      <p className="text-sm font-semibold text-purple-700">Monthly</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly Self Care */}
              {planData.monthlySelfCare.date && planData.monthlySelfCare.activity && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                  <div className="flex items-start gap-4 mb-4">
                    <Heart className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Monthly Self Care</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Date:</strong> {new Date(planData.monthlySelfCare.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p><strong>Activity:</strong> {planData.monthlySelfCare.activity}</p>
                        {planData.monthlySelfCare.duration && (
                          <p><strong>Duration:</strong> {planData.monthlySelfCare.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border-2 border-yellow-200">
                      <p className="text-sm font-semibold text-yellow-700">Monthly</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quarterly Reflection */}
              {planData.quarterlyReflection.date && planData.quarterlyReflection.activity && (
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                  <div className="flex items-start gap-4 mb-4">
                    <BookOpen className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Quarterly Reflection</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Date:</strong> {new Date(planData.quarterlyReflection.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p><strong>Activity:</strong> {planData.quarterlyReflection.activity}</p>
                        {planData.quarterlyReflection.duration && (
                          <p><strong>Duration:</strong> {planData.quarterlyReflection.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border-2 border-teal-200">
                      <p className="text-sm font-semibold text-teal-700">Quarterly</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Benefits of Scheduled Rest
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Prevents exhaustion:</strong> Regular rest prevents the accumulation of fatigue</li>
                <li>• <strong>Improves energy:</strong> Scheduled breaks restore energy throughout the day and week</li>
                <li>• <strong>Reduces burnout:</strong> Consistent rest periods prevent chronic stress and burnout</li>
                <li>• <strong>Increases productivity:</strong> Rested teachers are more effective and focused</li>
                <li>• <strong>Protects boundaries:</strong> Scheduled rest creates clear boundaries around work time</li>
                <li>• <strong>Supports sustainability:</strong> Regular recovery supports long-term teaching careers</li>
                <li>• <strong>Models self-care:</strong> When you schedule rest, you model healthy practices for students and colleagues</li>
                <li>• <strong>Creates anticipation:</strong> Having scheduled rest gives you something to look forward to</li>
                <li>• <strong>Five-tier approach:</strong> Daily, weekly, monthly, quarterly rest ensures comprehensive recovery</li>
                <li>• <strong>Progressive wellness:</strong> Each tier builds upon the others for sustained well-being</li>
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
                    <strong>Honour rest appointments as strictly as meetings.</strong> Treating rest with the same importance as work commitments creates sustainable habits:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Put rest in your calendar:</strong> Schedule rest appointments in your calendar just like you would schedule meetings. This makes them "real" and visible.</li>
                    <li><strong>Set reminders:</strong> Set digital reminders for your rest appointments—daily mini breaks, weekly joy activities, and monthly resets. Reminders help you remember to honor these times.</li>
                    <li><strong>Protect rest time:</strong> When someone asks you to do something during your scheduled rest time, say "I'm not available then—I have a prior commitment." This is true—you've committed to rest.</li>
                    <li><strong>Don't reschedule rest:</strong> Just as you wouldn't easily reschedule an important meeting, don't easily reschedule rest. Rest is just as important as work.</li>
                    <li><strong>Block your calendar:</strong> Use calendar blocking to mark rest times as "busy" or "unavailable." This prevents others from scheduling over your rest time.</li>
                    <li><strong>Communicate boundaries:</strong> Let colleagues and family know about your rest appointments. When they understand these are commitments, they're more likely to respect them.</li>
                    <li><strong>Prepare for rest:</strong> Prepare for rest just as you'd prepare for a meeting—set things aside, find a quiet space, and commit fully to the rest time.</li>
                    <li><strong>Respect your own schedule:</strong> When you honor your own rest appointments, you teach yourself that your rest matters. This builds self-respect and sustainable habits.</li>
                    <li><strong>Create accountability:</strong> Tell someone about your rest appointments and ask them to check in. Accountability helps you maintain consistency.</li>
                    <li><strong>Reflect on impact:</strong> After honoring rest appointments, notice how you feel. This reinforces the value of rest and motivates continued commitment.</li>
                    <li><strong>Adjust as needed:</strong> If a rest appointment doesn't work, adjust it—but don't cancel it. Find a new time, don't skip rest entirely.</li>
                    <li><strong>Build the habit:</strong> The more you honor rest appointments, the easier it becomes. Over time, protecting rest becomes automatic.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you honor rest appointments as strictly as meetings, you're creating a practice that protects your well-being, prevents exhaustion, and supports sustainable teaching. Rest is not optional—it's essential for your effectiveness and longevity in teaching.
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
      title={gameData?.title || "Rest & Recovery Plan"}
      subtitle={gameData?.description || "Schedule deliberate rest periods to prevent exhaustion"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={score}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Rest & Recovery Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Schedule deliberate rest periods to prevent exhaustion and maintain sustainable teaching
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              How This Works
            </h3>
            <ul className="text-indigo-800 space-y-2 text-sm">
              <li>• <strong>Daily Mini Break:</strong> Schedule a brief rest period each day (5-15 minutes)</li>
              <li>• <strong>Weekly Joy:</strong> Plan one joyful activity each week for deeper restoration</li>
              <li>• <strong>Monthly Reset:</strong> Schedule a longer rest period once per month</li>
              <li>• <strong>Monthly Self Care:</strong> Dedicate time to personal care and nurturing activities</li>
              <li>• <strong>Quarterly Reflection:</strong> Schedule time for deep evaluation and planning</li>
              <li>• <strong>Set Reminders:</strong> Add these to your calendar with reminders to honor them</li>
              <li>• <strong>Earn Points:</strong> Set each reminder to earn 1 point, up to 5 total points</li>
              <li>• <strong>Treat as commitments:</strong> Honor rest appointments as strictly as you would honor a meeting</li>
            </ul>
          </div>

          {/* Daily Mini Break */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Coffee className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Daily Mini Break</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule a brief rest period each day to recharge during work hours
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={planData.dailyMiniBreak.time}
                      onChange={(e) => handleInputChange('dailyMiniBreak', 'time', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={planData.dailyMiniBreak.activity}
                      onChange={(e) => handleInputChange('dailyMiniBreak', 'activity', e.target.value)}
                      placeholder="e.g., Deep breathing, stretch break, walk"
                      list="daily-activities"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <datalist id="daily-activities">
                      {activitySuggestions.dailyMiniBreak.map((activity, index) => (
                        <option key={index} value={activity} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (Optional)
                    </label>
                    <input
                      type="text"
                      value={planData.dailyMiniBreak.duration}
                      onChange={(e) => handleInputChange('dailyMiniBreak', 'duration', e.target.value)}
                      placeholder="e.g., 5 minutes, 10 minutes"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Joy */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Heart className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Joy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Plan one activity each week that brings you joy and deeper restoration
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Day of Week <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={planData.weeklyJoy.day}
                      onChange={(e) => handleInputChange('weeklyJoy', 'day', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    >
                      <option value="">Select a day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={planData.weeklyJoy.activity}
                      onChange={(e) => handleInputChange('weeklyJoy', 'activity', e.target.value)}
                      placeholder="e.g., Coffee with friend, nature walk, creative hobby"
                      list="weekly-activities"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                    <datalist id="weekly-activities">
                      {activitySuggestions.weeklyJoy.map((activity, index) => (
                        <option key={index} value={activity} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (Optional)
                    </label>
                    <input
                      type="text"
                      value={planData.weeklyJoy.duration}
                      onChange={(e) => handleInputChange('weeklyJoy', 'duration', e.target.value)}
                      placeholder="e.g., 1 hour, 2 hours, half day"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Reset */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Moon className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Monthly Reset</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule a longer rest period once per month for deeper recovery
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={planData.monthlyReset.date}
                      onChange={(e) => handleInputChange('monthlyReset', 'date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={planData.monthlyReset.activity}
                      onChange={(e) => handleInputChange('monthlyReset', 'activity', e.target.value)}
                      placeholder="e.g., Full day off, weekend getaway, day of self-care"
                      list="monthly-activities"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <datalist id="monthly-activities">
                      {activitySuggestions.monthlyReset.map((activity, index) => (
                        <option key={index} value={activity} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (Optional)
                    </label>
                    <input
                      type="text"
                      value={planData.monthlyReset.duration}
                      onChange={(e) => handleInputChange('monthlyReset', 'duration', e.target.value)}
                      placeholder="e.g., Full day, weekend, half day"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Self Care */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Heart className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Monthly Self Care</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule dedicated time for self-care activities each month
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={planData.monthlySelfCare.date}
                      onChange={(e) => handleInputChange('monthlySelfCare', 'date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={planData.monthlySelfCare.activity}
                      onChange={(e) => handleInputChange('monthlySelfCare', 'activity', e.target.value)}
                      placeholder="e.g., Spa day, massage, yoga session"
                      list="selfcare-activities"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                    <datalist id="selfcare-activities">
                      {activitySuggestions.monthlySelfCare.map((activity, index) => (
                        <option key={index} value={activity} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (Optional)
                    </label>
                    <input
                      type="text"
                      value={planData.monthlySelfCare.duration}
                      onChange={(e) => handleInputChange('monthlySelfCare', 'duration', e.target.value)}
                      placeholder="e.g., 1 hour, 2 hours, half day"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Reflection */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <BookOpen className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quarterly Reflection</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule time for deep reflection and planning every quarter
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={planData.quarterlyReflection.date}
                      onChange={(e) => handleInputChange('quarterlyReflection', 'date', e.target.value)}
                      min={getQuarterlyDate()}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={planData.quarterlyReflection.activity}
                      onChange={(e) => handleInputChange('quarterlyReflection', 'activity', e.target.value)}
                      placeholder="e.g., Review goals, evaluate practices, plan ahead"
                      list="reflection-activities"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <datalist id="reflection-activities">
                      {activitySuggestions.quarterlyReflection.map((activity, index) => (
                        <option key={index} value={activity} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (Optional)
                    </label>
                    <input
                      type="text"
                      value={planData.quarterlyReflection.duration}
                      onChange={(e) => handleInputChange('quarterlyReflection', 'duration', e.target.value)}
                      placeholder="e.g., Half day, Full day, 2 hours"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Set Reminder Buttons */}
          <div className="space-y-4">
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSetReminder('dailyMiniBreak')}
                disabled={remindersSet.dailyMiniBreak}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto ${remindersSet.dailyMiniBreak
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
                {remindersSet.dailyMiniBreak ? 'Daily Mini Break Set!' : 'Set Daily Mini Break Reminder'}
              </motion.button>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSetReminder('weeklyJoy')}
                disabled={remindersSet.weeklyJoy}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto ${remindersSet.weeklyJoy
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
                {remindersSet.weeklyJoy ? 'Weekly Joy Set!' : 'Set Weekly Joy Reminder'}
              </motion.button>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSetReminder('monthlyReset')}
                disabled={remindersSet.monthlyReset}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto ${remindersSet.monthlyReset
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
                {remindersSet.monthlyReset ? 'Monthly Reset Set!' : 'Set Monthly Reset Reminder'}
              </motion.button>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSetReminder('monthlySelfCare')}
                disabled={remindersSet.monthlySelfCare}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto ${remindersSet.monthlySelfCare
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
                {remindersSet.monthlySelfCare ? 'Monthly Self Care Set!' : 'Set Monthly Self Care Reminder'}
              </motion.button>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSetReminder('quarterlyReflection')}
                disabled={remindersSet.quarterlyReflection}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto ${remindersSet.quarterlyReflection
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
                {remindersSet.quarterlyReflection ? 'Quarterly Reflection Set!' : 'Set Quarterly Reflection Reminder'}
              </motion.button>
            </div>
          </div>

          {/* Validation Message */}
          {!remindersSet.dailyMiniBreak && (!planData.dailyMiniBreak.time || !planData.dailyMiniBreak.activity) && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Please fill in required fields for Daily Mini Break before setting reminder
            </div>
          )}
          {!remindersSet.weeklyJoy && (!planData.weeklyJoy.day || !planData.weeklyJoy.activity) && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Please fill in required fields for Weekly Joy before setting reminder
            </div>
          )}
          {!remindersSet.monthlyReset && (!planData.monthlyReset.date || !planData.monthlyReset.activity) && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Please fill in required fields for Monthly Reset before setting reminder
            </div>
          )}
          {!remindersSet.monthlySelfCare && (!planData.monthlySelfCare.date || !planData.monthlySelfCare.activity) && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Please fill in required fields for Monthly Self Care before setting reminder
            </div>
          )}
          {!remindersSet.quarterlyReflection && (!planData.quarterlyReflection.date || !planData.quarterlyReflection.activity) && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Please fill in required fields for Quarterly Reflection before setting reminder
            </div>
          )}
          {score === 5 && (
            <div className="mt-2 text-center text-sm text-green-600 font-semibold">
              Congratulations! You've set all 5 rest reminders and earned 5/5 points!
            </div>
          )}
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default RestRecoveryPlan;