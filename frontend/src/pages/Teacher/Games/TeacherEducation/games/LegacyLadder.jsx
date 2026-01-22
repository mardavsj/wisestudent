import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { ArrowUp, Heart, Award, Users, CheckCircle, TrendingUp, BookOpen, Sparkles, Target } from "lucide-react";

const LegacyLadder = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-83";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [step, setStep] = useState(1); // 1: Writing, 2: Animation, 3: Complete
  const [rungEntries, setRungEntries] = useState({
    learned: "",
    inspired: "",
    impacted: "",
    guided: "",
    transformed: ""
  });
  const [currentClimbingRung, setCurrentClimbingRung] = useState(0);
  const [showLegacyPath, setShowLegacyPath] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Legacy ladder rungs definition
  const rungs = [
    {
      id: 'learned',
      label: 'Learned',
      description: 'What have you learned from teaching?',
      emoji: '📚',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      prompt: 'What knowledge, skills, or wisdom have you gained from your teaching journey? (e.g., "I learned patience and resilience through challenging moments")'
    },
    {
      id: 'inspired',
      label: 'Inspired',
      description: 'Who have you inspired?',
      emoji: '✨',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300',
      prompt: 'How have you inspired others—students, colleagues, or your community? (e.g., "I inspired a student to pursue their passion for science")'
    },
    {
      id: 'impacted',
      label: 'Impacted',
      description: 'What impact have you made?',
      emoji: '💙',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      prompt: 'What specific impact have you had on students\' lives, learning, or growth? (e.g., "I helped a struggling student find confidence and succeed")'
    },
    {
      id: 'guided',
      label: 'Guided',
      description: 'Who have you guided?',
      emoji: '🧭',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      prompt: 'How have you guided students, mentored colleagues, or provided direction? (e.g., "I guided new teachers through their first years")'
    },
    {
      id: 'transformed',
      label: 'Transformed',
      description: 'How have you transformed?',
      emoji: '🌟',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      prompt: 'How has teaching transformed you personally and professionally? (e.g., "Teaching transformed me into a more patient, empathetic person")'
    }
  ];

  const allRungsFilled = Object.values(rungEntries).every(entry => entry.trim().length >= 10);

  const handleRungChange = (rungId, value) => {
    setRungEntries(prev => ({
      ...prev,
      [rungId]: value
    }));
  };

  const handleStartClimb = () => {
    if (allRungsFilled) {
      // Score based on number of rungs filled (1 point per rung)
      const rungsCompleted = Object.values(rungEntries).filter(entry => entry.trim().length >= 10).length;
      setScore(rungsCompleted);
      setStep(2);
      setShowLegacyPath(true);
      animateLegacyPath();
    }
  };

  const animateLegacyPath = () => {
    let currentRung = 0;
    const climbInterval = setInterval(() => {
      setCurrentClimbingRung(currentRung);
      currentRung++;

      if (currentRung > rungs.length) {
        clearInterval(climbInterval);
        setTimeout(() => {
          setShowLegacyPath(false);
          setStep(3);
          setShowGameOver(true);
        }, 2000);
      }
    }, 1500);
  };

  const completedCount = Object.values(rungEntries).filter(entry => entry.trim().length >= 10).length;
  const progress = (completedCount / rungs.length) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Legacy Ladder"}
      subtitle={gameData?.description || "Visualize one's growth beyond daily struggles"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🪜</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Legacy Ladder
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Climb the ladder of legacy by reflecting on your growth and contributions beyond daily struggles.
                Fill each rung with a contribution that represents your teaching journey.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                How to Use the Legacy Ladder:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Fill each rung</strong> with a contribution from your teaching journey</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Reflect on your growth:</strong> What have you learned, inspired, impacted, guided, and transformed?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Celebrate personal evolution:</strong> Focus on your journey and growth, not just outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Complete all rungs</strong> to generate your animated Legacy Path</span>
                </li>
              </ul>
            </div>

            {/* Progress */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Progress</h3>
                  <p className="text-gray-600">{completedCount} of {rungs.length} rungs completed</p>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {completedCount} / {rungs.length}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Legacy Ladder Rungs */}
            <div className="space-y-6 mb-8">
              {rungs.map((rung, index) => {
                const isCompleted = rungEntries[rung.id].trim().length >= 10;
                return (
                  <motion.div
                    key={rung.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${rung.bgColor} rounded-xl p-6 border-2 ${rung.borderColor} transition-all ${isCompleted ? 'ring-2 ring-green-400' : ''
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Rung Number & Emoji */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${rung.color} flex items-center justify-center shadow-lg mb-2`}>
                          <div className="text-3xl">{rung.emoji}</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-bold ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                            Rung {index + 1}
                          </div>
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-1" />
                          )}
                        </div>
                      </div>

                      {/* Rung Content */}
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className={`text-2xl font-bold mb-1 ${isCompleted ? 'text-gray-900' : 'text-gray-800'}`}>
                            {rung.label}
                          </h3>
                          <p className="text-gray-700 font-medium">{rung.description}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-2 border-gray-200 mb-3">
                          <p className="text-sm text-gray-600 mb-3">{rung.prompt}</p>
                          <textarea
                            value={rungEntries[rung.id]}
                            onChange={(e) => handleRungChange(rung.id, e.target.value)}
                            placeholder={`Write your contribution for ${rung.label.toLowerCase()}...`}
                            rows={4}
                            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-gray-800"
                          />
                          {rungEntries[rung.id].trim().length > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                              {rungEntries[rung.id].trim().length} characters
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartClimb}
                disabled={!allRungsFilled}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${allRungsFilled
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <ArrowUp className="w-5 h-5" />
                Generate Legacy Path
              </motion.button>

              {!allRungsFilled && (
                <p className="text-sm text-gray-600 mt-3">
                  Complete all {rungs.length} rungs to generate your Legacy Path ({completedCount} / {rungs.length})
                </p>
              )}
            </div>
          </div>
        )}

        {/* Legacy Path Animation */}
        {step === 2 && showLegacyPath && (
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-2xl shadow-lg p-8 min-h-[600px]">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🌟✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Legacy Path
              </h2>
              <p className="text-xl text-gray-600">
                Visualizing your journey of growth and contribution
              </p>
            </div>

            {/* Animated Ladder */}
            <div className="relative flex flex-col items-center gap-4 mb-8">
              {rungs.map((rung, index) => {
                const isActive = currentClimbingRung > index;
                const isCurrent = currentClimbingRung === index + 1;

                return (
                  <motion.div
                    key={rung.id}
                    initial={{ opacity: 0, scale: 0.8, x: -50 }}
                    animate={{
                      opacity: isActive || isCurrent ? 1 : 0.3,
                      scale: isCurrent ? 1.1 : isActive ? 1 : 0.8,
                      x: isActive || isCurrent ? 0 : -50
                    }}
                    transition={{ duration: 0.5 }}
                    className={`w-full max-w-2xl rounded-xl p-6 border-2 transition-all ${isCurrent
                        ? `${rung.borderColor} bg-gradient-to-br ${rung.bgColor} shadow-xl ring-4 ring-purple-300`
                        : isActive
                          ? `${rung.borderColor} bg-gradient-to-br ${rung.bgColor} shadow-lg`
                          : 'border-gray-300 bg-gray-100 opacity-30'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${isCurrent ? 'animate-bounce' : ''}`}>
                        {rung.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-1 ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>
                          {rung.label}
                        </h3>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap"
                          >
                            {rungEntries[rung.id]}
                          </motion.p>
                        )}
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Path Lines */}
              {currentClimbingRung > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(currentClimbingRung / rungs.length) * 100}%` }}
                  className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-400 to-pink-400 -z-10"
                  style={{ top: '5%', height: `${((currentClimbingRung - 1) / rungs.length) * 80}%` }}
                />
              )}
            </div>

            {currentClimbingRung > rungs.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Legacy Path Complete!
                </h3>
                <p className="text-gray-600">
                  You've visualized your journey of growth and contribution
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Game Over Summary */}
        {step === 3 && showGameOver && (
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
                🪜✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Legacy Ladder Complete!
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                You've visualized your growth beyond daily struggles
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border-2 border-green-300">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">Earned {score} Healcoin{score !== 1 ? 's' : ''}!</span>
              </div>
            </div>

            {/* Legacy Path Display */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-800">Your Legacy Path</h3>
              </div>

              <div className="space-y-4">
                {rungs.map((rung, index) => (
                  <motion.div
                    key={rung.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${rung.bgColor} rounded-xl p-6 border-2 ${rung.borderColor} shadow-lg`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{rung.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-xl font-bold text-gray-800">Rung {index + 1}: {rung.label}</h4>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rung.description}</p>
                        <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {rungEntries[rung.id]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Visualizing Your Legacy
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Beyond daily struggles:</strong> The ladder helps you see your growth and impact beyond temporary challenges</li>
                <li>• <strong>Celebrate evolution:</strong> Recognizing your personal and professional growth builds confidence and satisfaction</li>
                <li>• <strong>See the bigger picture:</strong> Visualizing contributions helps you understand the broader impact of your teaching</li>
                <li>• <strong>Build resilience:</strong> Remembering your legacy during difficult times provides perspective and motivation</li>
                <li>• <strong>Recognize transformation:</strong> Seeing how teaching has transformed you reinforces the value of your work</li>
                <li>• <strong>Inspire continued growth:</strong> Visualizing your legacy path motivates continued development and contribution</li>
                <li>• <strong>Create meaning:</strong> Understanding your legacy gives meaning to daily work and challenges</li>
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
                    <strong>Encourage teachers to celebrate personal evolution, not just outcomes.</strong> Shifting focus from outcomes to growth creates sustainable satisfaction and resilience:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Focus on process:</strong> Celebrate the journey, learning, growth, and effort rather than only final results. Process-focused reflection builds resilience and satisfaction.</li>
                    <li><strong>Honor small steps:</strong> Acknowledge incremental growth, small wins, and gradual progress. Every step on the legacy ladder matters, not just major achievements.</li>
                    <li><strong>Value transformation:</strong> Recognize how teaching has changed you—your skills, perspectives, character, relationships. Personal transformation is a significant achievement.</li>
                    <li><strong>Celebrate learning:</strong> Honor mistakes as learning opportunities, challenges as growth experiences, and struggles as sources of wisdom. Every experience contributes to your legacy.</li>
                    <li><strong>Recognize invisible work:</strong> Celebrate the emotional labor, relationships built, moments of support, and care that may not show in traditional metrics. This work creates lasting impact.</li>
                    <li><strong>Personal evolution:</strong> Focus on who you've become, not just what you've accomplished. Character growth, empathy, patience, and wisdom are all part of your legacy.</li>
                    <li><strong>Long-term perspective:</strong> Remember that impact often unfolds over time. Some contributions become clear years later, so celebrate the work you're doing now.</li>
                    <li><strong>Individual journey:</strong> Avoid comparing your legacy to others'. Each teacher's journey is unique, and every legacy path is valuable and meaningful.</li>
                    <li><strong>Regular reflection:</strong> Make legacy reflection a regular practice—monthly, quarterly, or yearly. Regular reflection helps you recognize ongoing growth and contribution.</li>
                    <li><strong>Share with others:</strong> Share your legacy reflections with colleagues, mentors, or support groups. Sharing helps you see your impact and inspires others to reflect on theirs.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you encourage teachers to celebrate personal evolution, not just outcomes, you're helping them build sustainable satisfaction, recognize their true value, develop resilience, and find meaning in their work beyond traditional metrics. This shift from outcome-focused to growth-focused reflection creates healthier, more sustainable, and more meaningful teaching careers. Celebrating evolution honors the person behind the teacher and recognizes that growth itself is success.
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

export default LegacyLadder;