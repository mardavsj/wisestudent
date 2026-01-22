import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Moon, CheckCircle, Circle, Sparkles, Smartphone, Lightbulb, Activity, Heart, Clock, BookOpen, Star, Wind } from "lucide-react";

const EveningLogOffRitual = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-93";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [ritualItems, setRitualItems] = useState([
    {
      id: 'dim-lights',
      title: 'Dim the Lights',
      description: 'Lower brightness in your space 30 minutes before bed',
      category: 'Environment',
      icon: Lightbulb,
      checked: false,
      emoji: '💡',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      tip: 'Dim lighting signals to your brain that it\'s time to wind down and supports natural melatonin production.'
    },
    {
      id: 'reduce-screen-time',
      title: 'Stop Using Screens',
      description: 'Put away phones, tablets, and computers 1 hour before bed',
      category: 'Digital Boundaries',
      icon: Smartphone,
      checked: false,
      emoji: '📱',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      tip: 'Blue light from screens interferes with sleep hormones. Give your brain time to produce melatonin naturally.'
    },
    {
      id: 'phone-outside',
      title: 'Phone Outside Bedroom',
      description: 'Charge your phone in another room, not beside your bed',
      category: 'Digital Boundaries',
      icon: Smartphone,
      checked: false,
      emoji: '🚪',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300',
      tip: 'Keeping phones out of the bedroom eliminates temptation to check and prevents sleep-disrupting notifications.'
    },
    {
      id: 'gratitude-practice',
      title: 'Gratitude Reflection',
      description: 'Write or think about 3 things you\'re grateful for today',
      category: 'Mindful',
      icon: Heart,
      checked: false,
      emoji: '❤️',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      tip: 'Gratitude shifts your mind from stress to appreciation, creating a peaceful mental state for sleep.'
    },
    {
      id: 'gentle-stretch',
      title: 'Gentle Stretching',
      description: 'Do 5-10 minutes of gentle stretches or yoga',
      category: 'Physical',
      icon: Activity,
      checked: false,
      emoji: '🧘',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      tip: 'Gentle movement releases physical tension and helps your body transition into rest mode.'
    }
  ]);

  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleToggleItem = (itemId) => {
    setRitualItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const calculateDigitalWindDownScore = () => {
    const checkedCount = ritualItems.filter(item => item.checked).length;

    // Simple scoring: 1 point per completed ritual, up to 5 points
    const score = checkedCount;

    return score;
  };

  const handleCompleteRitual = () => {
    const windDownScore = calculateDigitalWindDownScore();
    setScore(windDownScore);
    setShowScore(true);
    setTimeout(() => {
      setShowGameOver(true);
    }, 3000);
  };

  const getWindDownLevel = (score) => {
    if (score >= 5) {
      return {
        level: 'Excellent',
        emoji: '🌟',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-300',
        message: 'Excellent digital wind-down! You\'ve created a comprehensive evening ritual that supports rest.',
        recommendation: 'Continue this ritual nightly to maintain healthy sleep habits.'
      };
    } else if (score >= 4) {
      return {
        level: 'Great',
        emoji: '✨',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        message: 'Great wind-down ritual! You\'ve established strong evening habits for rest.',
        recommendation: 'Consider adding the remaining items to enhance your ritual further.'
      };
    } else if (score >= 3) {
      return {
        level: 'Good',
        emoji: '👍',
        color: 'from-yellow-500 to-amber-600',
        bgColor: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-300',
        message: 'Good start on your wind-down ritual! You\'re building healthy evening habits.',
        recommendation: 'Try adding more items to create a more complete wind-down routine.'
      };
    } else if (score >= 2) {
      return {
        level: 'Developing',
        emoji: '🌱',
        color: 'from-orange-500 to-amber-600',
        bgColor: 'from-orange-50 to-amber-50',
        borderColor: 'border-orange-300',
        message: 'You\'re developing your wind-down ritual. Keep building on what you\'ve started.',
        recommendation: 'Focus on the most important items: reducing screen time, dimming lights, and phone boundaries.'
      };
    } else {
      return {
        level: 'Beginner',
        emoji: '🌙',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-300',
        message: 'You\'re beginning your wind-down journey. Every step toward better rest is valuable.',
        recommendation: 'Start with the most impactful items: stop using screens 1 hour before bed and keep your phone outside the bedroom.'
      };
    }
  };

  const checkedCount = ritualItems.filter(item => item.checked).length;
  const windDownScore = showScore ? calculateDigitalWindDownScore() : null;
  const windDownLevel = windDownScore ? getWindDownLevel(windDownScore) : null;

  if (showGameOver) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Evening Log-Off Ritual"}
        subtitle={gameData?.description || "Create a calm nightly transition away from screens"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={Math.min(checkedCount, totalLevels)}
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
                {windDownLevel?.emoji || '🌙'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Evening Ritual Complete!
              </h2>
              <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${windDownLevel?.color || 'from-blue-500 to-indigo-500'} text-white font-bold text-xl mb-4`}>
                Digital Wind-Down Score: {windDownScore}/{totalLevels}
              </div>
              <p className="text-2xl font-bold text-gray-700 mb-2">
                {windDownLevel?.level || 'Complete'}
              </p>
            </div>

            {/* Wind-Down Level Display */}
            {windDownLevel && (
              <div className={`bg-gradient-to-br ${windDownLevel.bgColor} rounded-xl p-6 border-2 ${windDownLevel.borderColor} mb-8`}>
                <p className="text-lg text-gray-700 text-center leading-relaxed mb-4">
                  {windDownLevel.message}
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Recommendation:</p>
                  <p className="text-gray-800 leading-relaxed">
                    {windDownLevel.recommendation}
                  </p>
                </div>
              </div>
            )}

            {/* Ritual Summary */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Moon className="w-6 h-6 text-indigo-600" />
                Your Evening Ritual Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ritualItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border-2 ${item.checked
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                          : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.checked
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                          }`}>
                          {item.checked ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{item.emoji}</span>
                            <h4 className={`font-bold ${item.checked ? 'text-green-800' : 'text-gray-600'}`}>
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-700">
                    Items Completed:
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {checkedCount} / {ritualItems.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Benefits of Evening Log-Off Ritual
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li>• <strong>Better sleep quality:</strong> Reducing screen time and creating calm helps you fall asleep faster and sleep more deeply</li>
                <li>• <strong>Improved focus:</strong> Proper rest enhances your ability to focus and teach effectively the next day</li>
                <li>• <strong>Reduced stress:</strong> Evening rituals help your body and mind transition from work to rest</li>
                <li>• <strong>Clear boundaries:</strong> Keeping phones outside the bedroom creates physical separation between work and rest</li>
                <li>• <strong>Mental clarity:</strong> Journaling and gratitude practices help clear your mind before sleep</li>
                <li>• <strong>Physical relaxation:</strong> Stretching and breathing exercises release tension from the day</li>
                <li>• <strong>Hormone balance:</strong> Dim lighting and reduced screen time support natural melatonin production</li>
                <li>• <strong>Sustainable teaching:</strong> Quality rest helps prevent burnout and sustains your teaching career</li>
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
                    <strong>Keep phone outside bedroom; use analogue alarm.</strong> Creating physical separation from your phone supports better rest:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Charge in another room:</strong> Set up a charging station in your kitchen, living room, or hallway—anywhere but your bedroom. This creates a physical boundary between you and your phone during rest time.</li>
                    <li><strong>Eliminates temptation:</strong> When your phone isn't within reach, you're less likely to check it during the night or first thing in the morning. Out of sight, out of mind—truly.</li>
                    <li><strong>Prevents sleep disruption:</strong> Notifications, calls, or even the light from your phone can wake you or keep you awake. Keeping it elsewhere prevents these disruptions entirely.</li>
                    <li><strong>Reduces anxiety:</strong> Not having your phone nearby means you're not worried about missing something important. This mental freedom supports rest.</li>
                    <li><strong>Use an analogue alarm:</strong> Invest in a traditional alarm clock (or clock radio). This eliminates the need for your phone as an alarm, making it easier to keep phones out of the bedroom.</li>
                    <li><strong>Creates routine:</strong> Charging your phone in the same place every night becomes a ritual that signals the end of your day. Consistency supports habit formation.</li>
                    <li><strong>Improves morning:</strong> When your phone is in another room, you're less likely to immediately check it upon waking. This allows you to start your day with intention, not reactivity.</li>
                    <li><strong>Protects relationships:</strong> Not having your phone in the bedroom allows you to be fully present with your partner or family during bedtime and waking moments.</li>
                    <li><strong>Models boundaries:</strong> If you live with family, keeping phones out of bedrooms models healthy boundaries for everyone, including children.</li>
                    <li><strong>Enhances rest quality:</strong> Research shows that even having a phone in the same room can affect sleep quality. True separation supports deeper rest.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you keep your phone outside the bedroom and use an analogue alarm, you're creating physical boundaries that support better sleep, clearer mornings, and healthier relationships with technology. This simple change can transform your rest quality and overall well-being.
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
      title={gameData?.title || "Evening Log-Off Ritual"}
      subtitle={gameData?.description || "Create a calm nightly transition away from screens"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalLevels}
      currentQuestion={Math.min(checkedCount, totalLevels)}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Evening Log-Off Ritual
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create a calm nightly transition away from screens with this guided checklist
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5" />
              How to Use This Ritual
            </h3>
            <ul className="text-indigo-800 space-y-2 text-sm">
              <li>• <strong>Follow the checklist:</strong> Complete each item that fits into your evening routine</li>
              <li>• <strong>Customize as needed:</strong> You don't need to do everything—focus on what works for you</li>
              <li>• <strong>Create consistency:</strong> Doing the same items nightly helps your body recognize it's time to rest</li>
              <li>• <strong>Start small:</strong> Begin with 2-3 items and gradually build your ritual</li>
              <li>• <strong>Track your score:</strong> Complete the ritual to see your digital wind-down score</li>
            </ul>
          </div>

          {/* Checklist */}
          <div className="space-y-4 mb-8">
            {ritualItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all ${item.checked
                      ? `${item.bgColor} ${item.borderColor} shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${item.checked
                          ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}>
                        {item.checked ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{item.emoji}</span>
                          <h3 className={`text-xl font-bold ${item.checked ? 'text-gray-800' : 'text-gray-700'
                            }`}>
                            {item.title}
                          </h3>
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${item.category === 'Digital Boundaries' ? 'bg-blue-100 text-blue-700' :
                              item.category === 'Physical' ? 'bg-green-100 text-green-700' :
                                item.category === 'Mindful' ? 'bg-pink-100 text-pink-700' :
                                  'bg-yellow-100 text-yellow-700'
                            }`}>
                            {item.category}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {item.description}
                        </p>
                        {item.checked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-white rounded-lg p-3 border-2 border-gray-200 mt-2"
                          >
                            <p className="text-sm text-gray-700 leading-relaxed">
                              <strong>💡 Tip:</strong> {item.tip}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Ritual Progress
              </h3>
              <span className="text-2xl font-bold text-purple-600">
                {checkedCount} / {ritualItems.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(checkedCount / ritualItems.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              />
            </div>
            {checkedCount > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {Math.round((checkedCount / ritualItems.length) * 100)}% Complete
              </p>
            )}
          </div>

          {/* Complete Button */}
          {checkedCount > 0 && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCompleteRitual}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
              >
                <Moon className="w-5 h-5" />
                Complete Ritual & View Score
              </motion.button>
            </div>
          )}

          {/* Score Display */}
          {showScore && windDownLevel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-gradient-to-br ${windDownLevel.bgColor} rounded-xl p-6 border-2 ${windDownLevel.borderColor} mt-8`}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{windDownLevel.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Digital Wind-Down Score
                </h3>
                <div className="text-4xl font-bold text-indigo-600 mb-3">
                  {windDownScore}/{totalLevels}
                </div>
                <p className={`text-xl font-semibold mb-4 ${windDownScore >= 5 ? 'text-green-700' :
                    windDownScore >= 4 ? 'text-green-700' :
                      windDownScore >= 3 ? 'text-yellow-700' :
                        'text-orange-700'
                  }`}>
                  {windDownLevel.level}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {windDownLevel.message}
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Recommendation:</p>
                  <p className="text-gray-800 leading-relaxed">
                    {windDownLevel.recommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default EveningLogOffRitual;