import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion"; //eslint-disable-line
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Moon, Calendar, Gift, Save, Bell, CheckCircle, Sparkles, Download, Clock } from "lucide-react";

const RestRechargePlan = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-97";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;

  const [restPlan, setRestPlan] = useState({
    dailyBreaks: [],
    weeklyReset: "",
    monthlyReward: ""
  });
  const [currentBreak, setCurrentBreak] = useState("");
  const [planSaved, setPlanSaved] = useState(false);
  const [remindersSet, setRemindersSet] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Rest categories
  const categories = [
    {
      id: 'daily',
      label: 'Daily Mini-Breaks',
      description: 'Small moments of rest throughout each day (5-15 minutes)',
      emoji: '☕',
      icon: Moon,
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      placeholder: 'e.g., "5-minute breathing exercise", "Enjoy morning coffee quietly", "Stretch break at 2pm"',
      examples: ['5-minute breathing exercise', 'Morning coffee quietly', 'Stretch break', 'Read one page of a book', 'Listen to calming music', 'Look out the window']
    },
    {
      id: 'weekly',
      label: 'Weekly Reset',
      description: 'Longer rest periods once a week (30 minutes - 2 hours)',
      emoji: '🛀',
      icon: Calendar,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      placeholder: 'e.g., "Sunday afternoon walk in nature", "Friday evening bath", "Saturday morning journaling"',
      examples: ['Nature walk', 'Long bath', 'Journaling session', 'Yoga class', 'Quiet reading time', 'Meditation session']
    },
    {
      id: 'monthly',
      label: 'Monthly Reward',
      description: 'A special treat or rest activity once a month (half day or full day)',
      emoji: '🎁',
      icon: Gift,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      placeholder: 'e.g., "Spa day", "Day trip to favorite place", "Full day reading in bed", "Visit a friend"',
      examples: ['Spa day', 'Day trip', 'Full day of reading', 'Visit a friend', 'Art class', 'Concert or show']
    }
  ];

  const handleAddDailyBreak = () => {
    if (currentBreak.trim()) {
      setRestPlan(prev => ({
        ...prev,
        dailyBreaks: [...prev.dailyBreaks, currentBreak.trim()]
      }));
      setCurrentBreak("");
    }
  };

  const handleRemoveDailyBreak = (index) => {
    setRestPlan(prev => ({
      ...prev,
      dailyBreaks: prev.dailyBreaks.filter((_, i) => i !== index)
    }));
  };

  const handlePlanChange = (category, value) => {
    setRestPlan(prev => ({
      ...prev,
      [category]: value
    }));
    setPlanSaved(false);
    setRemindersSet(false);
  };

  const isPlanComplete = () => {
    return restPlan.dailyBreaks.length >= 2 &&
      restPlan.weeklyReset.trim().length >= 10 &&
      restPlan.monthlyReward.trim().length >= 10;
  };

  const handleSavePlan = () => {
    if (isPlanComplete()) {
      setPlanSaved(true);
      setScore(1);
      // Save to localStorage
      localStorage.setItem('restRechargePlan', JSON.stringify({
        ...restPlan,
        savedAt: new Date().toISOString()
      }));
    }
  };

  const handleSetReminders = () => {
    if (planSaved) {
      setRemindersSet(true);
      setScore(prev => prev + 1);
      // In a real app, this would integrate with calendar/reminder APIs
      setTimeout(() => {
        setShowGameOver(true);
      }, 2000);
    }
  };

  const handleDownloadPlan = () => {
    const planText = `
REST & RECHARGE PLAN
Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

DAILY MINI-BREAKS:
${restPlan.dailyBreaks.map((breakItem, index) => `${index + 1}. ${breakItem}`).join('\n')}

WEEKLY RESET:
${restPlan.weeklyReset}

MONTHLY REWARD:
${restPlan.monthlyReward}

Remember: Protect rest like an appointment — without guilt or apology.
    `.trim();

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rest-recharge-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Rest & Recharge Plan"}
        subtitle="Plan Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={isPlanComplete()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                🌙
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Rest & Recharge Plan is Ready!</h2>
              <p className="text-lg text-gray-600">
                Your personalized rest schedule has been saved and reminders are set.
              </p>
            </div>

            {/* Plan Summary */}
            <div className="space-y-6 mb-6">
              {/* Daily Mini-Breaks */}
              <div className={`bg-gradient-to-br ${categories[0].bgColor} rounded-xl p-6 border-2 ${categories[0].borderColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{categories[0].emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{categories[0].label}</h3>
                    <p className="text-sm text-gray-600">{categories[0].description}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-2">
                  {restPlan.dailyBreaks.map((breakItem, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{breakItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weekly Reset */}
              <div className={`bg-gradient-to-br ${categories[1].bgColor} rounded-xl p-6 border-2 ${categories[1].borderColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{categories[1].emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{categories[1].label}</h3>
                    <p className="text-sm text-gray-600">{categories[1].description}</p>
                  </div>
                </div>
                <p className="text-gray-700 ml-2">{restPlan.weeklyReset}</p>
              </div>

              {/* Monthly Reward */}
              <div className={`bg-gradient-to-br ${categories[2].bgColor} rounded-xl p-6 border-2 ${categories[2].borderColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{categories[2].emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{categories[2].label}</h3>
                    <p className="text-sm text-gray-600">{categories[2].description}</p>
                  </div>
                </div>
                <p className="text-gray-700 ml-2">{restPlan.monthlyReward}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadPlan}
                className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Plan
              </motion.button>
              {remindersSet && (
                <div className="flex-1 bg-green-100 rounded-xl p-4 border-2 border-green-300 flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">Reminders Set!</span>
                </div>
              )}
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Why Rest Matters
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Rest is Essential:</strong> Physical and emotional rest isn't a luxury—it's essential for your wellbeing and ability to parent effectively. Without rest, you burn out.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Restorative Layers:</strong> Daily mini-breaks prevent burnout, weekly resets restore energy, and monthly rewards give you something to look forward to. All three layers matter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Protect Your Rest:</strong> Treat rest appointments with the same respect as work meetings or family commitments. Protect them—without guilt or apology.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Modeling for Children:</strong> When you prioritize rest, you teach your children that self-care is important and normal. They learn to value their own need for rest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Renewal is Productive:</strong> Rest makes you more present, patient, and effective. Time spent resting isn't wasted—it's invested in your capacity to show up fully.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Protect rest like an appointment — without guilt or apology. Your rest isn't selfish or wasteful—it's essential for your physical and emotional renewal. When you schedule rest and honor those appointments, you're taking care of yourself so you can take better care of your family. Put rest in your calendar. Set reminders. Say no to things that conflict with your rest time. And do it without guilt or apology. You're not being selfish—you're being strategic. A rested parent is a more patient, present, and effective parent. Your family benefits when you rest.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Rest & Recharge Plan"}
      subtitle="Create Your Personalized Rest Schedule"
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Rest & Recharge Plan</h2>
            <p className="text-gray-600 text-lg">
              Create a personalized rest schedule for physical and emotional renewal.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">How to Create Your Plan</h3>
            <p className="text-gray-700 mb-2">
              Fill out each category below to build your personalized rest schedule. Think about activities that truly help you rest and recharge—physically and emotionally.
            </p>
            <p className="text-sm text-gray-600">
              Once your plan is complete, save it and set gentle reminders to protect your rest time.
            </p>
          </div>

          {/* Daily Mini-Breaks */}
          <div className={`bg-gradient-to-br ${categories[0].bgColor} rounded-xl p-6 border-2 ${categories[0].borderColor} mb-6`}>
            <div className="flex items-center gap-3 mb-4">
              {React.createElement(categories[0].icon, { className: "w-8 h-8 text-blue-600" })}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{categories[0].label}</h3>
                <p className="text-sm text-gray-600">{categories[0].description}</p>
              </div>
            </div>

            {/* Add Daily Break */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentBreak}
                onChange={(e) => setCurrentBreak(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddDailyBreak()}
                placeholder={categories[0].placeholder}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddDailyBreak}
                disabled={!currentBreak.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </motion.button>
            </div>

            {/* Daily Breaks List */}
            {restPlan.dailyBreaks.length > 0 && (
              <div className="space-y-2">
                {restPlan.dailyBreaks.map((breakItem, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-blue-200 flex items-center justify-between"
                  >
                    <span className="text-gray-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      {breakItem}
                    </span>
                    <button
                      onClick={() => handleRemoveDailyBreak(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Examples */}
            {restPlan.dailyBreaks.length < 2 && (
              <div className="mt-3 text-xs text-gray-600">
                <strong>Examples:</strong> {categories[0].examples.slice(0, 3).join(', ')}
              </div>
            )}

            {restPlan.dailyBreaks.length < 2 && (
              <div className="mt-3 bg-yellow-100 rounded-lg p-2 border border-yellow-300">
                <p className="text-yellow-800 text-sm">
                  Add at least 2 daily mini-breaks to continue.
                </p>
              </div>
            )}
          </div>

          {/* Weekly Reset */}
          <div className={`bg-gradient-to-br ${categories[1].bgColor} rounded-xl p-6 border-2 ${categories[1].borderColor} mb-6`}>
            <div className="flex items-center gap-3 mb-4">
              {React.createElement(categories[1].icon, { className: "w-8 h-8 text-purple-600" })}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{categories[1].label}</h3>
                <p className="text-sm text-gray-600">{categories[1].description}</p>
              </div>
            </div>

            <textarea
              value={restPlan.weeklyReset}
              onChange={(e) => handlePlanChange('weeklyReset', e.target.value)}
              placeholder={categories[1].placeholder}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[100px] resize-none"
            />

            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-gray-600">
                Examples: {categories[1].examples.slice(0, 3).join(', ')}
              </p>
              <p className="text-xs text-gray-600">
                {(restPlan.weeklyReset?.length || 0)} characters (minimum 10)
              </p>
            </div>

            {restPlan.weeklyReset && restPlan.weeklyReset.trim().length < 10 && (
              <div className="mt-2 bg-yellow-100 rounded-lg p-2 border border-yellow-300">
                <p className="text-yellow-800 text-sm">
                  Please write at least 10 characters describing your weekly reset activity.
                </p>
              </div>
            )}
          </div>

          {/* Monthly Reward */}
          <div className={`bg-gradient-to-br ${categories[2].bgColor} rounded-xl p-6 border-2 ${categories[2].borderColor} mb-6`}>
            <div className="flex items-center gap-3 mb-4">
              {React.createElement(categories[2].icon, { className: "w-8 h-8 text-amber-600" })}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{categories[2].label}</h3>
                <p className="text-sm text-gray-600">{categories[2].description}</p>
              </div>
            </div>

            <textarea
              value={restPlan.monthlyReward}
              onChange={(e) => handlePlanChange('monthlyReward', e.target.value)}
              placeholder={categories[2].placeholder}
              className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-gray-800 min-h-[100px] resize-none"
            />

            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-gray-600">
                Examples: {categories[2].examples.slice(0, 3).join(', ')}
              </p>
              <p className="text-xs text-gray-600">
                {(restPlan.monthlyReward?.length || 0)} characters (minimum 10)
              </p>
            </div>

            {restPlan.monthlyReward && restPlan.monthlyReward.trim().length < 10 && (
              <div className="mt-2 bg-yellow-100 rounded-lg p-2 border border-yellow-300">
                <p className="text-yellow-800 text-sm">
                  Please write at least 10 characters describing your monthly reward activity.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavePlan}
              disabled={!isPlanComplete() || planSaved}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {planSaved ? 'Plan Saved!' : 'Save Plan'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSetReminders}
              disabled={!planSaved || remindersSet}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Bell className="w-5 h-5" />
              {remindersSet ? 'Reminders Set!' : 'Set Reminders'}
            </motion.button>
          </div>

          {remindersSet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-green-100 border-2 border-green-300 rounded-lg p-4"
            >
              <p className="text-sm text-green-800 font-medium text-center">
                ✓ Reminders set! Your rest appointments are now protected in your calendar.
              </p>
            </motion.div>
          )}

          {!isPlanComplete() && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please complete all sections: Add at least 2 daily mini-breaks, describe your weekly reset, and describe your monthly reward.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Protect rest like an appointment — without guilt or apology. Your rest schedule is as important as any other commitment. Honor it.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default RestRechargePlan;