import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Clock, Sparkles, Brain, Volume2, CheckCircle, AlertCircle } from "lucide-react";

const GuidedMeditationAudio = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-45";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Quiz questions about Guided Meditation for teachers
  const questions = [
    {
      id: 1,
      title: "Meditation Benefits for Teachers",
      question: "Which of the following is a key benefit of guided meditation for teachers?",
      options: [

        {
          id: 'a',
          text: "Increased stress and anxiety levels",
          explanation: "Incorrect. Guided meditation is designed to reduce stress and anxiety, not increase it."
        },
        {
          id: 'b',
          text: "Reduced ability to manage classroom disruptions",
          explanation: "Incorrect. Meditation actually improves emotional regulation and helps teachers manage disruptions more effectively."
        },
        {
          id: 'c',
          text: "Improved nervous system regulation and sustained focus",
          explanation: "Correct! Guided meditation helps regulate the nervous system and improves sustained focus, which is crucial for effective teaching."
        },
      ],
      correctAnswer: 'c'
    },
    {
      id: 2,
      title: "Optimal Timing for Meditation",
      question: "When is the best time for a teacher to practice guided meditation to enhance their teaching effectiveness?",
      options: [

        {
          id: 'a',
          text: "During active class time when students are working",
          explanation: "Incorrect. While mindfulness can be practiced during class, dedicated meditation requires uninterrupted focus."
        },
        {
          id: 'b',
          text: "Before important meetings or stressful situations",
          explanation: "Correct! Practicing before stressful events helps calm the nervous system and improve performance."
        },
        {
          id: 'c',
          text: "Right after a difficult student interaction when upset",
          explanation: "Incorrect. While meditation can help afterward, it's better to practice prevention rather than only using it as a reaction."
        }
      ],
      correctAnswer: 'b'
    },
    {
      id: 3,
      title: "Breathing Techniques",
      question: "What is the purpose of controlled breathing in guided meditation for teachers?",
      options: [
        {
          id: 'a',
          text: "To activate the parasympathetic nervous system and promote calm",
          explanation: "Correct! Controlled breathing activates the parasympathetic nervous system, promoting calm and reducing stress."
        },
        {
          id: 'b',
          text: "To increase heart rate and adrenaline levels",
          explanation: "Incorrect. Controlled breathing typically decreases heart rate and promotes relaxation."
        },
        {
          id: 'c',
          text: "To eliminate all thoughts from the mind",
          explanation: "Incorrect. The goal is not to eliminate thoughts but to observe them without judgment and return to the breath."
        }
      ],
      correctAnswer: 'a'
    },
    {
      id: 4,
      title: "Visualization in Meditation",
      question: "How can visualization techniques in meditation benefit a teacher's classroom management?",
      options: [

        {
          id: 'a',
          text: "Makes it easier to ignore problematic students",
          explanation: "Incorrect. Visualization is about positive preparation, not avoiding challenges."
        },
        {
          id: 'b',
          text: "Eliminates the need for actual classroom management strategies",
          explanation: "Incorrect. Visualization supplements but doesn't replace practical management strategies."
        },
        {
          id: 'c',
          text: "Helps create mental images of calm classroom scenarios, reducing anxiety",
          explanation: "Correct! Visualization can help teachers mentally rehearse positive classroom scenarios, reducing anxiety and increasing confidence."
        },
      ],
      correctAnswer: 'c'
    },
    {
      id: 5,
      title: "Integrating Meditation in School Culture",
      question: "How can teachers effectively share meditation benefits with students?",
      options: [

        {
          id: 'a',
          text: "Mandate meditation for all students regardless of comfort level",
          explanation: "Incorrect. Meditation should be offered as an option, respecting students' comfort levels and beliefs."
        },
        {
          id: 'b',
          text: "Model the practice first, then introduce simple techniques appropriate for students",
          explanation: "Correct! Teachers should practice and embody meditation techniques before introducing them to students, ensuring age-appropriate adaptations."
        },
        {
          id: 'c',
          text: "Avoid mentioning meditation and keep it as a personal practice only",
          explanation: "Incorrect. Teachers can appropriately share beneficial wellness practices with students when adapted properly."
        }
      ],
      correctAnswer: 'b'
    }
  ];

  // Response options styling
  const responseOptions = [
    { id: 'a', label: 'Option A', color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', borderColor: 'border-blue-300', textColor: 'text-blue-800' },
    { id: 'b', label: 'Option B', color: 'from-orange-500 to-red-500', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-300', textColor: 'text-orange-800' },
    { id: 'c', label: 'Option C', color: 'from-gray-500 to-slate-500', bgColor: 'from-gray-50 to-slate-50', borderColor: 'border-gray-300', textColor: 'text-gray-800' }
  ];

  const handleAnswerSelect = (answerId) => {
    if (selectedAnswers[currentQuestion]) return; // Already answered

    const currentQ = questions[currentQuestion];
    const isCorrect = answerId === currentQ.correctAnswer;

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestion < totalLevels - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const currentQ = questions[currentQuestion];
  const selected = selectedAnswers[currentQuestion];
  const progress = ((currentQuestion + 1) / totalLevels) * 100;
  const isCorrect = selected === currentQ.correctAnswer;
  const feedback = selected ? currentQ.options.find(opt => opt.id === selected) : null;
  const selectedOption = responseOptions.find(opt => opt.id === selected);

  return (
    <TeacherGameShell
      title={gameData?.title || "Guided Meditation Audio"}
      subtitle={gameData?.description || "Relax the nervous system and improve sustained focus"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {totalLevels}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQ.title}</h2>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {currentQ.question}
                </p>
              </div>
            </div>

            {!showFeedback ? (
              /* Answer Options */
              <div className="space-y-4 mb-6">
                {responseOptions.map((option) => {
                  const questionOption = currentQ.options.find(opt => opt.id === option.id);
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={!!selected}
                      className={`w-full p-5 rounded-xl border-2 ${option.borderColor} bg-gradient-to-r ${option.bgColor} hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold">{option.label.charAt(option.label.length - 1)}</span>
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold mb-1 ${option.textColor}`}>
                            {option.label}
                          </h3>
                          <p className={`text-sm ${option.textColor} opacity-80`}>
                            {questionOption?.text}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* Feedback */
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-6 rounded-xl p-6 border-2 ${isCorrect
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
                    }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-800' : 'text-orange-800'
                          }`}>
                          {feedback?.text}
                        </h3>
                        {selectedOption && (
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedOption.color} flex items-center justify-center`}>
                            <span className="text-white text-sm font-bold">{selectedOption.label.charAt(selectedOption.label.length - 1)}</span>
                          </div>
                        )}
                      </div>
                      <div className={`bg-white rounded-lg p-4 border-l-4 ${isCorrect ? 'border-green-500' : 'border-orange-500'
                        }`}>
                        <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-orange-800'
                          }`}>
                          💡 Explanation:
                        </p>
                        <p className={`${isCorrect ? 'text-green-700' : 'text-orange-700'
                          }`}>
                          {feedback?.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {currentQuestion < totalLevels - 1 ? 'Next Question' : 'Finish Game'}
                  </motion.button>
                </div>
              </AnimatePresence>
            )}
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {score === totalLevels ? '🎉' : score >= Math.ceil(totalLevels * 0.8) ? '✨' : score >= Math.ceil(totalLevels * 0.6) ? '💪' : '📚'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Guided Meditation Quiz Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {score} out of {totalLevels} correctly
            </p>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {score === totalLevels
                  ? "Perfect! You have a strong understanding of how guided meditation benefits teachers. You know how to use meditation for nervous system regulation, optimal timing, breathing techniques, visualization, and integrating meditation in school culture."
                  : score >= Math.ceil(totalLevels * 0.8)
                    ? "Excellent! You're developing a solid understanding of guided meditation principles for teachers. Keep applying these concepts to enhance your teaching practice."
                    : score >= Math.ceil(totalLevels * 0.6)
                      ? "Good effort! You understand the basics of guided meditation for teachers. Continue learning to deepen your knowledge of these beneficial practices."
                      : "Keep learning! Understanding how guided meditation benefits teachers is valuable for creating a calm classroom environment and managing stress effectively."
                }
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Your Performance:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-4 border border-gray-300">
                  <p className="text-sm text-gray-600 mb-1">Questions Answered</p>
                  <p className="text-2xl font-bold text-indigo-600">{totalLevels}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-300">
                  <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-600">{score}</p>
                </div>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Integrate short guided meditation moments into your classroom routine. Start with just 1-2 minutes of mindful breathing at the beginning of class or after recess. This helps students transition into learning mode and creates a calm atmosphere. You can guide them with simple instructions like "Close your eyes or soften your gaze, breathe in slowly through your nose, and let your shoulders drop." Regular practice of these brief meditations helps students develop focus and emotional regulation skills. Model the practice yourself by participating, showing students that mindfulness is a lifelong skill for everyone. Remember, consistency is more important than duration—regular short sessions are more beneficial than occasional long ones.
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

export default GuidedMeditationAudio;