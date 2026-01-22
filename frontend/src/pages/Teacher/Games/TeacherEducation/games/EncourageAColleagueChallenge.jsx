import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, Users, CheckCircle, MessageCircle, TrendingUp, BookOpen, Sparkles, Award } from "lucide-react";

const EncourageAColleagueChallenge = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-76";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [selectedColleague, setSelectedColleague] = useState(null);
  const [selectedEncouragement, setSelectedEncouragement] = useState(null);
  const [sentEncouragements, setSentEncouragements] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(1);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Total number of encouragements to send
  const TOTAL_ENCOURAGEMENTS = 5;

  // Colleague cards (simulated)
  const colleagues = [
    { id: 1, name: "Sarah", role: "Math Teacher", emoji: "👩‍🏫", color: "from-blue-400 to-cyan-500" },
    { id: 2, name: "Michael", role: "Science Teacher", emoji: "👨‍🔬", color: "from-green-400 to-emerald-500" },
    { id: 3, name: "Emily", role: "English Teacher", emoji: "👩‍💼", color: "from-purple-400 to-indigo-500" },
    { id: 4, name: "David", role: "History Teacher", emoji: "👨‍🏫", color: "from-orange-400 to-red-500" },
    { id: 5, name: "Lisa", role: "Art Teacher", emoji: "👩‍🎨", color: "from-pink-400 to-rose-500" },
    { id: 6, name: "James", role: "PE Teacher", emoji: "👨‍💪", color: "from-yellow-400 to-amber-500" },
    { id: 7, name: "Maria", role: "Music Teacher", emoji: "👩‍🎵", color: "from-indigo-400 to-purple-500" },
    { id: 8, name: "Tom", role: "Principal", emoji: "👔", color: "from-gray-400 to-slate-500" }
  ];

  // Pre-written encouragement messages
  const encouragements = [
    {
      id: 'appreciation',
      category: 'Appreciation',
      message: "Thank you for your dedication to our students. Your hard work doesn't go unnoticed, and I'm grateful to work alongside you.",
      emoji: "💙"
    },
    {
      id: 'support',
      category: 'Support',
      message: "I wanted to let you know that your support and encouragement mean a lot to me. You're an amazing colleague!",
      emoji: "🤝"
    },
    {
      id: 'inspiration',
      category: 'Inspiration',
      message: "Your creativity and passion for teaching inspire me. Thank you for bringing such positive energy to our school.",
      emoji: "✨"
    },
    {
      id: 'gratitude',
      category: 'Gratitude',
      message: "I'm grateful for your willingness to help and collaborate. Your teamwork makes our school a better place.",
      emoji: "🙏"
    },
    {
      id: 'strength',
      category: 'Strength',
      message: "Your resilience and positive attitude, especially during challenging times, are truly admirable. Keep up the great work!",
      emoji: "💪"
    },
    {
      id: 'kindness',
      category: 'Kindness',
      message: "Your kindness and compassion make such a difference. Thank you for being such a caring colleague.",
      emoji: "💚"
    },
    {
      id: 'expertise',
      category: 'Expertise',
      message: "I really appreciate your expertise and the time you take to share your knowledge. You're an invaluable member of our team.",
      emoji: "🌟"
    },
    {
      id: 'encouragement',
      category: 'Encouragement',
      message: "I wanted to encourage you—you're doing great work, and your impact on students is significant. Keep going!",
      emoji: "💫"
    }
  ];

  const handleColleagueSelect = (colleague) => {
    setSelectedColleague(colleague);
    setSelectedEncouragement(null);
  };

  const handleEncouragementSelect = (encouragement) => {
    setSelectedEncouragement(encouragement);
  };

  const handleSendEncouragement = () => {
    if (!selectedColleague || !selectedEncouragement) return;

    const sent = {
      id: sentEncouragements.length + 1,
      colleague: selectedColleague,
      encouragement: selectedEncouragement,
      sentAt: new Date().toISOString()
    };

    setSentEncouragements(prev => [...prev, sent]);
    setScore(sentEncouragements.length + 1);
    setShowAnimation(true);
    setDailyStreak(prev => prev + 1);

    // Reset selection after a delay
    setTimeout(() => {
      setShowAnimation(false);
      setSelectedColleague(null);
      setSelectedEncouragement(null);

      // Show game over if sent all encouragements
      if (sentEncouragements.length + 1 >= TOTAL_ENCOURAGEMENTS) {
        setTimeout(() => {
          setShowGameOver(true);
        }, 2000);
      }
    }, 3000);
  };

  const encouragementCount = sentEncouragements.length;
  const progress = (encouragementCount / TOTAL_ENCOURAGEMENTS) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Encourage-a-Colleague Challenge"}
      subtitle={gameData?.description || "Promote verbal appreciation in the workplace"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={encouragementCount + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💙</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Encourage-a-Colleague Challenge
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Daily reminder: Encourage {TOTAL_ENCOURAGEMENTS} colleagues today!
              </p>
            </div>

            {/* Challenge Board */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-pink-200 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Daily Challenge</h3>
                    <p className="text-gray-600">Send {TOTAL_ENCOURAGEMENTS - encouragementCount} more encouragement{TOTAL_ENCOURAGEMENTS - encouragementCount !== 1 ? 's' : ''} today</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-600">{dailyStreak}</div>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">{encouragementCount} / {TOTAL_ENCOURAGEMENTS} encouragements sent</p>
            </div>

            {/* Animation */}
            {showAnimation && selectedColleague && selectedEncouragement && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
                >
                  <div className="text-6xl mb-4">{selectedEncouragement.emoji}✨</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Encouragement Sent!
                  </h3>
                  <p className="text-lg text-gray-600 mb-2">
                    To: <strong>{selectedColleague.name}</strong>
                  </p>
                  <p className="text-gray-700 italic mb-4">
                    "{selectedEncouragement.message}"
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <p className="text-green-800 font-semibold">
                      Your encouragement makes a difference! 💙
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Colleague Cards */}
            {!selectedColleague && !showAnimation && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Tap a Colleague to Encourage:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colleagues.map((colleague) => {
                    const alreadySent = sentEncouragements.some(e => e.colleague.id === colleague.id);

                    return (
                      <motion.button
                        key={colleague.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColleagueSelect(colleague)}
                        disabled={alreadySent}
                        className={`p-6 rounded-xl border-2 transition-all text-center ${alreadySent
                            ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                            : `border-${colleague.color.split('-')[1]}-300 bg-gradient-to-br ${colleague.color} hover:shadow-lg cursor-pointer`
                          }`}
                      >
                        {alreadySent ? (
                          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        ) : (
                          <div className="text-4xl mb-2">{colleague.emoji}</div>
                        )}
                        <p className="font-bold text-white text-sm mb-1">{colleague.name}</p>
                        <p className="text-white text-xs opacity-90">{colleague.role}</p>
                        {alreadySent && (
                          <p className="text-green-600 text-xs mt-2 font-semibold">Encouraged!</p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Encouragement Selection */}
            {selectedColleague && !selectedEncouragement && !showAnimation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{selectedColleague.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedColleague.name}</h3>
                      <p className="text-gray-600">{selectedColleague.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold mb-4">Choose an encouragement message:</p>
                </div>

                <div className="space-y-4">
                  {encouragements.map((encouragement) => (
                    <motion.button
                      key={encouragement.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEncouragementSelect(encouragement)}
                      className="w-full p-6 rounded-xl border-2 border-gray-300 bg-white hover:border-pink-300 hover:shadow-lg transition-all text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{encouragement.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded">
                              {encouragement.category}
                            </span>
                          </div>
                          <p className="text-gray-800 leading-relaxed italic">
                            "{encouragement.message}"
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColleague(null)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Back to Colleagues
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Send Button */}
            {selectedColleague && selectedEncouragement && !showAnimation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{selectedEncouragement.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Send</h3>
                  <p className="text-gray-700 mb-4">
                    To: <strong>{selectedColleague.name}</strong> ({selectedColleague.role})
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-gray-800 leading-relaxed italic">
                      "{selectedEncouragement.message}"
                    </p>
                  </div>
                </div>

                <div className="text-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendEncouragement}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Send Encouragement
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedColleague(null);
                      setSelectedEncouragement(null);
                    }}
                    className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Sent Encouragements List */}
            {sentEncouragements.length > 0 && !showAnimation && (
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Encouragements Sent Today ({sentEncouragements.length})
                </h3>
                <div className="space-y-3">
                  {sentEncouragements.map((sent) => (
                    <div key={sent.id} className="bg-white rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{sent.encouragement.emoji}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-1">
                            To: {sent.colleague.name} ({sent.colleague.role})
                          </p>
                          <p className="text-gray-700 text-sm italic mb-2">
                            "{sent.encouragement.message}"
                          </p>
                          <p className="text-xs text-gray-500">
                            Category: {sent.encouragement.category}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                💙✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Challenge Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You sent {encouragementCount} of {TOTAL_ENCOURAGEMENTS} encouragements today!
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-pink-600 mb-2">{encouragementCount}</div>
                  <p className="text-sm text-gray-700">Encouragements Sent</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">{dailyStreak}</div>
                  <p className="text-sm text-gray-700">Day Streak</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{Math.round((encouragementCount / TOTAL_ENCOURAGEMENTS) * 100)}%</div>
                  <p className="text-sm text-gray-700">Challenge Complete</p>
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Impact
              </h3>
              <p className="text-green-800 leading-relaxed mb-4">
                Your encouragements make a real difference! When you appreciate colleagues verbally, you:
              </p>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Boost morale:</strong> Verbal appreciation makes people feel valued and recognized</li>
                <li>• <strong>Strengthen relationships:</strong> Regular encouragement builds deeper connections with colleagues</li>
                <li>• <strong>Create culture:</strong> Consistent appreciation creates a culture of gratitude and support</li>
                <li>• <strong>Reduce isolation:</strong> Feeling appreciated reduces feelings of isolation and builds community</li>
                <li>• <strong>Improve satisfaction:</strong> Appreciated teachers are more satisfied and motivated</li>
                <li>• <strong>Build resilience:</strong> Feeling valued increases resilience and reduces burnout</li>
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
                    <strong>Build this habit till it becomes daily culture.</strong> Turning verbal appreciation into a daily practice transforms workplace culture:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Start small:</strong> Commit to encouraging one colleague every day. Small, consistent actions build habits.</li>
                    <li><strong>Set reminders:</strong> Use a daily reminder (calendar, phone alarm, sticky note) to prompt you to encourage someone. Consistency creates habit.</li>
                    <li><strong>Be specific:</strong> Specific appreciations are more meaningful than general ones. Notice what colleagues do well and acknowledge it specifically.</li>
                    <li><strong>Mix it up:</strong> Encourage different colleagues regularly. This ensures everyone feels appreciated, not just a few people.</li>
                    <li><strong>Make it natural:</strong> Look for natural moments - after meetings, during breaks, in passing. Verbal appreciation doesn't have to be formal.</li>
                    <li><strong>Track your habit:</strong> Keep a simple log of encouragements sent. Tracking helps you maintain the habit and see your impact.</li>
                    <li><strong>Lead by example:</strong> When you consistently encourage others, you model the behavior and inspire others to do the same.</li>
                    <li><strong>Celebrate streaks:</strong> Acknowledge when you've encouraged someone every day for a week, month, etc. Celebrate building the habit.</li>
                    <li><strong>Notice the impact:</strong> Pay attention to how encouragements affect colleagues and the workplace atmosphere. This reinforces the habit.</li>
                    <li><strong>Make it part of culture:</strong> When enough people practice daily encouragement, it becomes school culture. Keep building the habit!</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you build this habit till it becomes daily culture, you're transforming workplace relationships and creating a school where everyone feels appreciated. Daily verbal appreciation becomes a natural part of how you interact, strengthening morale, building connections, and creating a positive culture that benefits everyone. Consistency is key - keep encouraging until it's simply who you are and how your school operates.
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

export default EncourageAColleagueChallenge;