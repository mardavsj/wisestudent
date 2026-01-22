import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { BookOpen, CheckCircle, Sparkles, Share2, TrendingUp, Award } from "lucide-react";

const ChallengeJournal = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-56";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [journalEntries, setJournalEntries] = useState({
    challenge: "",
    learned: "",
    nextTime: "",
    helpedBy: "",
    proudOf: ""
  });
  const [completionScore, setCompletionScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [score, setScore] = useState(0);

  // Journal template prompts
  const prompts = [
    {
      id: 'challenge',
      label: 'The challenge was…',
      icon: BookOpen,
      description: 'Describe a recent difficulty or challenge you faced',
      placeholder: 'e.g., A parent was upset about their child\'s grade and questioned my teaching methods...',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-800'
    },
    {
      id: 'learned',
      label: 'I learned that…',
      icon: TrendingUp,
      description: 'Reflect on what you learned from overcoming this challenge',
      placeholder: 'e.g., I learned that listening first and asking clarifying questions helps diffuse tension...',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800'
    },
    {
      id: 'nextTime',
      label: 'Next time I will…',
      icon: Award,
      description: 'Identify actions you\'ll take when facing similar challenges',
      placeholder: 'e.g., Next time I will pause, breathe, and listen before responding...',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800'
    },
    {
      id: 'helpedBy',
      label: 'I was helped by…',
      icon: Share2,
      description: 'Identify people, resources, or strategies that supported you',
      placeholder: 'e.g., My mentor gave me advice on de-escalation techniques, and a colleague shared similar experiences...',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-800'
    },
    {
      id: 'proudOf',
      label: "I'm proud that…",
      icon: Sparkles,
      description: 'Acknowledge your accomplishments and growth from this experience',
      placeholder: "e.g., I'm proud that I remained calm under pressure and found a solution that worked for everyone...",
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800'
    }
  ];

  const handleEntryChange = (field, value) => {
    setJournalEntries(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate completion score
    const completed = Object.values({ ...journalEntries, [field]: value })
      .filter(entry => entry.trim().length > 0).length;
    const newScore = Math.round((completed / 5) * 100);
    setCompletionScore(newScore);
  };

  const handleComplete = () => {
    const completedCount = Object.values(journalEntries)
      .filter(entry => entry.trim().length > 0).length;

    if (completedCount === 0) {
      alert("Please fill in at least one section of your challenge journal.");
      return;
    }

    if (completedCount < 5) {
      if (!confirm(`You've completed ${completedCount} of 5 sections. Would you like to add more, or complete with what you have?`)) {
        return;
      }
    }

    setScore(completedCount);
    setShowGameOver(true);
  };

  const handleShare = () => {
    setHasShared(true);
    setShowShareModal(true);
    // In a real app, this would trigger sharing functionality
    setTimeout(() => {
      setShowShareModal(false);
    }, 2000);
  };

  const completedCount = Object.values(journalEntries)
    .filter(entry => entry.trim().length > 0).length;
  const allCompleted = completedCount === 5;

  return (
    <TeacherGameShell
      title={gameData?.title || "Challenge Journal"}
      subtitle={gameData?.description || "Document one recent difficulty and how it was overcome"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📔</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">

              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Document a recent challenge you faced and reflect on how you overcame it. Celebrating small comebacks strengthens self-belief.
              </p>
            </div>

            {/* Completion Score Indicator */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${completionScore >= 66 ? 'from-green-400 to-emerald-500' :
                      completionScore >= 33 ? 'from-blue-400 to-cyan-500' :
                        'from-gray-300 to-gray-400'
                    } flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                    {completionScore}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Completion Score</h3>
                    <p className="text-sm text-gray-600">Rises as you fill each section</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Sections Completed</p>
                  <p className="text-3xl font-bold text-indigo-600">{completedCount} / 5</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionScore}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-4 rounded-full ${completionScore >= 66 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      completionScore >= 33 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                        'bg-gradient-to-r from-gray-300 to-gray-400'
                    } shadow-md`}
                />
              </div>

              {/* Completion Message */}
              <p className="text-sm text-center text-gray-600 mt-2">
                {completionScore === 0 && "Start documenting your challenge to begin reflection..."}
                {completionScore > 0 && completionScore < 20 && "Good start! Continue reflecting..."}
                {completionScore >= 20 && completionScore < 40 && "You're building insights! Keep going..."}
                {completionScore >= 40 && completionScore < 60 && "Making progress! Continue your reflection..."}
                {completionScore >= 60 && completionScore < 80 && "Great work! Almost there..."}
                {completionScore >= 80 && completionScore < 100 && "Almost complete! Finish your reflection..."}
                {completionScore === 100 && "Perfect! You've documented your comeback journey."}
              </p>
            </div>

            {/* Journal Template Sections */}
            <div className="space-y-6 mb-8">
              {prompts.map((prompt, index) => {
                const Icon = prompt.icon;
                const value = journalEntries[prompt.id];
                const isCompleted = value.trim().length > 0;

                return (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl border-2 transition-all ${isCompleted
                        ? `bg-gradient-to-br ${prompt.bgColor} ${prompt.borderColor} shadow-md`
                        : 'bg-white border-gray-300 hover:border-indigo-400'
                      }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                            ? `bg-gradient-to-r ${prompt.color} shadow-lg`
                            : 'bg-gray-200'
                          }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="block text-lg font-bold text-gray-800 mb-1">
                            {prompt.label}
                          </label>
                          <p className="text-sm text-gray-600 mb-2">
                            {prompt.description}
                          </p>
                        </div>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                          </motion.div>
                        )}
                      </div>
                      <textarea
                        value={value}
                        onChange={(e) => handleEntryChange(prompt.id, e.target.value)}
                        placeholder={prompt.placeholder}
                        className={`w-full h-32 p-4 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${isCompleted
                            ? `bg-white ${prompt.borderColor} focus:${prompt.borderColor.replace('border-', 'border-')}`
                            : 'bg-gray-50 border-gray-300 focus:border-indigo-400'
                          }`}
                      />
                      {isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 text-sm font-medium flex items-center gap-2"
                          style={{ color: prompt.textColor.replace('text-', '') }}
                        >
                          <Award className="w-4 h-4" />
                          <span>Section complete! Your reflection builds resilience.</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Examples */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-semibold mb-2">
                💡 Remember: Small comebacks matter
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                The challenge doesn't have to be huge. Even small difficulties and how you overcame them count. Documenting these moments helps you recognize your resilience and build self-belief. Each comeback, no matter how small, strengthens your ability to handle future challenges.
              </p>
            </div>

            {/* Complete and Share Buttons */}
            <div className="flex items-center justify-between gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={completedCount === 0}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${allCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl'
                    : completedCount > 0
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {allCompleted ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Complete Journal
                  </span>
                ) : completedCount > 0 ? (
                  `Complete with ${completedCount} Section${completedCount !== 1 ? 's' : ''}`
                ) : (
                  "Fill in at least one section to complete"
                )}
              </motion.button>

              {allCompleted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  disabled={hasShared}
                  className={`px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${hasShared
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl'
                    }`}
                >
                  {hasShared ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Shared!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Share with Wellbeing Group
                    </span>
                  )}
                </motion.button>
              )}
            </div>

            {/* Share Modal */}
            {showShareModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowShareModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✨
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Shared Successfully!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your challenge journal has been shared with your wellbeing group. Your comeback story can inspire others!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowShareModal(false)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
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
                {allCompleted ? '🎉✨' : completedCount >= 2 ? '📚💪' : '📝🌱'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Challenge Journal Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've documented your comeback journey
              </p>
            </div>

            {/* Journal Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Challenge Journal:</h3>
              <div className="space-y-4">
                {prompts.map((prompt, index) => {
                  const value = journalEntries[prompt.id];
                  if (!value.trim()) return null;

                  const Icon = prompt.icon;

                  return (
                    <motion.div
                      key={prompt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${prompt.bgColor} rounded-xl p-5 border-2 ${prompt.borderColor}`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${prompt.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-2">{prompt.label}</p>
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
                <TrendingUp className="w-5 h-5" />
                Resilience Building Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Documentation builds awareness:</strong> Writing about challenges and how you overcame them helps you recognize your own resilience and strength.</li>
                <li>• <strong>Reflection creates learning:</strong> Reflecting on what you learned from challenges transforms difficult experiences into growth opportunities.</li>
                <li>• <strong>Planning builds confidence:</strong> Identifying what you'll do next time prepares you for future challenges and builds self-belief.</li>
                <li>• <strong>Small comebacks matter:</strong> Every challenge you overcome, no matter how small, strengthens your resilience and ability to handle future difficulties.</li>
                <li>• <strong>Celebration reinforces success:</strong> Celebrating small comebacks reinforces your self-belief and motivates you to face future challenges with confidence.</li>
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
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Celebrate small comebacks to strengthen self-belief. Every challenge you overcome is a victory worth recognizing:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Keep a comeback journal:</strong> Regularly document challenges and how you overcame them. Review it when you need a reminder of your resilience.</li>
                    <li><strong>Share with colleagues:</strong> Share your comeback stories with trusted colleagues. This builds collective resilience and creates a supportive community.</li>
                    <li><strong>Create a comeback wall:</strong> Display small reminders of challenges you've overcome. This visual celebration reinforces your self-belief.</li>
                    <li><strong>Make it a routine:</strong> Set aside time weekly or monthly to reflect on challenges and comebacks. Regular reflection builds resilience over time.</li>
                    <li><strong>Celebrate with others:</strong> Create a culture where celebrating comebacks is normalized. Share comeback stories in team meetings or staff gatherings.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you celebrate small comebacks, you're not just acknowledging past successes—you're building self-belief and resilience for future challenges. Each celebration reinforces your ability to overcome difficulties and strengthens your confidence in facing new challenges. This practice transforms challenges from threats to growth opportunities, building sustainable resilience throughout your teaching career.
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

export default ChallengeJournal;