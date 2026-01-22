import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Eye, CheckCircle, AlertCircle, Target, Sparkles, GraduationCap } from "lucide-react";

const MindfulObservationGame = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-44";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Quiz questions with 3 options each
  const questions = [
    {
      id: 1,
      title: "Mindful Classroom Observation",
      question: "You notice a student frequently looking out the window during lessons. What is the most mindful observation approach?",
      options: [

        {
          id: 'a',
          text: "Immediately redirect the student and scold them for distraction",
          explanation: "This reactive approach doesn't involve mindful observation. It's more about immediate correction than understanding."
        },
        {
          id: 'b',
          text: "Ignore it completely to avoid micromanaging",
          explanation: "Avoiding observation altogether doesn't help you understand your students' needs or improve your teaching environment."
        },
        {
          id: 'c',
          text: "Observe without judgment, noting patterns in timing and frequency",
          explanation: "Correct! Mindful observation involves noticing patterns without jumping to conclusions. This helps you understand the student's behavior in context."
        },
      ],
      correctAnswer: 'c'
    },
    {
      id: 2,
      title: "Environmental Awareness",
      question: "You enter your classroom and notice the lighting seems dimmer than usual. Your mindful response is?",
      options: [

        {
          id: 'a',
          text: "Change the lighting immediately without considering why it's different",
          explanation: "Acting without mindfulness may not address the root cause or consider student needs."
        },
        {
          id: 'b',
          text: "Notice the change without immediate action, considering its impact on students",
          explanation: "Excellent! Mindful awareness means noticing changes and considering their effects without rushing to fix everything."
        },
        {
          id: 'c',
          text: "Blame the facilities team without further thought",
          explanation: "This reaction lacks mindful observation and jumps to assigning blame instead of understanding."
        }
      ],
      correctAnswer: 'b'
    },
    {
      id: 3,
      title: "Student Interaction Patterns",
      question: "You observe that two students consistently sit together and seem to support each other academically. What does mindful observation suggest?",
      options: [
        {
          id: 'a',
          text: "Acknowledge the positive peer support and consider how to foster it",
          explanation: "Great! Mindful observation recognizes beneficial patterns and considers how to enhance positive dynamics."
        },
        {
          id: 'b',
          text: "Separate them immediately to prevent cheating",
          explanation: "This reactive approach assumes negative intent without mindful consideration of the actual situation."
        },
        {
          id: 'c',
          text: "Don't pay attention to seating arrangements",
          explanation: "Ignoring classroom dynamics means missing opportunities to support positive student interactions."
        }
      ],
      correctAnswer: 'a'
    },
    {
      id: 4,
      title: "Emotional Climate Awareness",
      question: "During a lesson, you notice several students appear restless and disengaged. Your mindful observation focuses on?",
      options: [

        {
          id: 'a',
          text: "Increasing the pace to capture their attention",
          explanation: "This reaction doesn't involve mindful observation of the situation before responding."
        },
        {
          id: 'b',
          text: "Assigning more work to keep them busy",
          explanation: "Adding work without understanding the cause doesn't involve mindful observation of student needs."
        },
        {
          id: 'c',
          text: "Noticing the emotional climate while reflecting on possible causes",
          explanation: "Perfect! Mindful observation includes awareness of emotional dynamics and reflection on contributing factors."
        },
      ],
      correctAnswer: 'c'
    },
    {
      id: 5,
      title: "Self-Awareness During Teaching",
      question: "While teaching, you realize you're feeling impatient with slower students. What does mindful observation suggest?",
      options: [

        {
          id: 'a',
          text: "Push through the lesson as planned regardless of your feelings",
          explanation: "Ignoring your emotional state doesn't involve mindful awareness of how it might affect your teaching."
        },
        {
          id: 'b',
          text: "Notice your impatience without judgment and adjust your approach",
          explanation: "Excellent! Mindful self-observation involves recognizing your emotional state and consciously adjusting your response."
        },
        {
          id: 'c',
          text: "Show your impatience so students know you expect more",
          explanation: "Expressing impatience doesn't demonstrate mindful self-awareness or professional emotional regulation."
        }
      ],
      correctAnswer: 'b'
    }
  ];

  // Response options styling
  const responseOptions = [
    { id: 'a', label: 'Option A', icon: GraduationCap, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', borderColor: 'border-blue-300', textColor: 'text-blue-800' },
    { id: 'b', label: 'Option B', icon: Target, color: 'from-orange-500 to-red-500', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-300', textColor: 'text-orange-800' },
    { id: 'c', label: 'Option C', icon: Eye, color: 'from-gray-500 to-slate-500', bgColor: 'from-gray-50 to-slate-50', borderColor: 'border-gray-300', textColor: 'text-gray-800' }
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
      title={gameData?.title || "Mindful Observation Game"}
      subtitle={gameData?.description || "Strengthen awareness by noticing small details in environment"}
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
                  const Icon = option.icon;
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
                          <Icon className="w-6 h-6 text-white" />
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
                            {React.createElement(selectedOption.icon, { className: "w-5 h-5 text-white" })}
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
              Mindful Observation Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {score} out of {totalLevels} correctly
            </p>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {score === totalLevels
                  ? "Perfect! You have a strong understanding of mindful observation techniques. Your awareness of classroom dynamics and student needs is excellent."
                  : score >= Math.ceil(totalLevels * 0.8)
                    ? "Excellent! You're developing strong mindful observation skills. Keep practicing these awareness techniques to enhance your teaching effectiveness."
                    : score >= Math.ceil(totalLevels * 0.6)
                      ? "Good effort! Mindful observation takes practice. Continue to develop your awareness of classroom environments and student behaviors."
                      : "Keep learning! Mindful observation is a valuable skill that helps you better understand your classroom environment and student needs. Practice will strengthen these abilities."}
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
                <Eye className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Practice "slow looking" as a daily classroom mindfulness routine. Spend 30 seconds each morning observing your classroom environment mindfully before students arrive. Notice the lighting, temperature, arrangement, and your own emotional state. This practice strengthens your observational skills and helps you be more present with your students. You can also incorporate brief mindful observation moments during transitions—have students spend 30 seconds observing a plant, picture, or interesting object to develop their attention skills. Regular mindful observation practice enhances everyone's ability to notice details, regulate attention, and create a calmer learning environment.
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

export default MindfulObservationGame;