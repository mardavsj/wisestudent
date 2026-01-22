import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, Volume2, Lightbulb, Target, Sparkles, BookOpen, Heart, TrendingUp, Star, CheckCircle, RotateCcw } from "lucide-react";

const ImpactVisualization = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-87";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = 5; // Fixed to 5 questions

  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1-5: questions, 6: summary
  const [answers, setAnswers] = useState(Array(5).fill(null)); // Store answers for 5 questions
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // Show feedback for each answer
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of current question

  // Define questions and answers
  const questions = [
    {
      id: 1,
      question: "How does visualizing your positive impact on students help you approach challenging situations in your classroom?",
      options: [
        "It reminds you that your efforts make a difference, helping you stay patient and focused",
        "It makes you feel guilty about past mistakes, pushing you to work harder",
        "It distracts you from immediate problems, allowing you to ignore them",
        "It creates unrealistic expectations that cause more stress"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "When you imagine your students applying skills you've taught them years in the future, what emotion is most likely to emerge?",
      options: [
        "Doubt about whether you're teaching the right things",
        "Pride and fulfillment in your contribution to their development",
        "Anxiety about their future challenges",
        "Indifference since you won't be involved in their lives"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the primary benefit of connecting your daily teaching tasks to your students' long-term success?",
      options: [
        "It reduces your workload by automating some responsibilities",
        "It provides intrinsic motivation that sustains you during difficult periods",
        "It eliminates all conflicts and behavioral issues in the classroom",
        "It ensures all students will achieve academic excellence"
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "Which of the following best describes how visualizing your impact affects your teaching resilience?",
      options: [
        "It makes you more reactive to negative events in your classroom",
        "It decreases your empathy for struggling students",
        "It helps you maintain perspective and recover more quickly from setbacks",
        "It causes you to avoid dealing with problems directly"
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "How can reflecting on your long-term impact influence your teaching decisions today?",
      options: [
        "It leads to rigid decision-making that ignores current needs",
        "It causes you to make decisions based on personal convenience",
        "It encourages choices that prioritize short-term gains over long-term outcomes",
        "It guides you toward decisions that align with your ultimate goals for students"
      ],
      correctAnswer: 3
    }
  ];

  const stepTimerRef = useRef(null);

  // Function to handle answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);

    // Show feedback for the selected answer
    setShowFeedback(true);

    // Check if answer is correct and update score if needed
    if (optionIndex === questions[questionIndex].correctAnswer && questionIndex >= score) {
      setScore(prev => prev + 1);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      setShowFeedback(false);
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // All questions answered, show results
        setTimeout(() => {
          setShowGameOver(true);
        }, 500);
      }
    }, 1500); // Wait 1.5 seconds before moving to next question
  };

  // Function to restart the quiz
  const restartQuiz = () => {
    setAnswers(Array(5).fill(null));
    setScore(0);
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setShowGameOver(false);
    setShowFeedback(false);
  };

  const handleStartQuiz = () => {
    setCurrentStep(1);
    setCurrentQuestionIndex(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, []);


  const currentQuestion = questions[currentQuestionIndex];

  return (
    <TeacherGameShell
      title={gameData?.title || "Impact Visualization Quiz"}
      subtitle={gameData?.description || "Test your understanding of teaching impact and visualization techniques"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentStep > 0 && currentStep <= 5 ? currentStep : 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Intro Screen */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-6xl mb-6">🧠</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Impact Visualization Quiz
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Test your understanding of how visualizing your teaching impact can enhance your effectiveness and resilience in the classroom.
                </p>

                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                    What to Expect
                  </h3>
                  <ul className="text-left text-gray-700 space-y-2 max-w-2xl mx-auto">
                    <li>• <strong>5 thought-provoking questions</strong> about teaching impact and visualization</li>
                    <li>• <strong>Multiple-choice format</strong> with 4 options each</li>
                    <li>• <strong>Instant feedback</strong> after each answer</li>
                    <li>• <strong>Scoring system</strong> to track your understanding</li>
                    <li>• <strong>Total duration:</strong> About 3-5 minutes</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center justify-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Instructions
                  </h3>
                  <ul className="text-left text-blue-800 space-y-2 max-w-2xl mx-auto text-sm">
                    <li>• Read each question carefully before selecting your answer</li>
                    <li>• Select the option that best reflects your understanding</li>
                    <li>• You'll receive immediate feedback after each selection</li>
                    <li>• Try to answer all questions to get your complete score</li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartQuiz}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Begin Quiz
                </motion.button>
              </motion.div>
            )}

            {/* Quiz Questions */}
            {currentStep >= 1 && currentStep <= 5 && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl p-8 border-2 border-purple-200">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Question {currentStep} of {totalLevels}
                    </h3>
                    <div className="w-full bg-white/30 rounded-full h-4 mb-4">
                      <div
                        className="bg-white h-4 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / totalLevels) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white/95 rounded-lg p-6 mb-6">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {currentQuestion?.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-4 mb-6">
                    {currentQuestion?.options.map((option, optionIndex) => {
                      const isSelected = answers[currentQuestionIndex] === optionIndex;
                      const isCorrect = optionIndex === currentQuestion.correctAnswer;
                      let optionStyle = "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left";

                      if (showFeedback) {
                        if (isSelected && isCorrect) {
                          optionStyle += " bg-green-100 border-green-500 text-green-800";
                        } else if (isSelected && !isCorrect) {
                          optionStyle += " bg-red-100 border-red-500 text-red-800";
                        } else if (!isSelected && isCorrect) {
                          optionStyle += " bg-green-100 border-green-500 text-green-800";
                        } else {
                          optionStyle += " bg-white border-gray-300 text-gray-700";
                        }
                      } else {
                        if (isSelected) {
                          optionStyle += " bg-purple-100 border-purple-500 text-purple-800";
                        } else {
                          optionStyle += " bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-400";
                        }
                      }

                      return (
                        <motion.div
                          key={optionIndex}
                          whileHover={{ scale: !showFeedback ? 1.02 : 1 }}
                          whileTap={{ scale: !showFeedback ? 0.98 : 1 }}
                          className={optionStyle}
                          onClick={() => !showFeedback && handleAnswerSelect(currentQuestionIndex, optionIndex)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Feedback message */}
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg mb-4 text-center ${answers[currentQuestionIndex] === currentQuestion.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {answers[currentQuestionIndex] === currentQuestion.correctAnswer
                        ? 'Correct! Well done.'
                        : `Incorrect. The right answer is ${String.fromCharCode(65 + currentQuestion.correctAnswer)}.`}
                    </motion.div>
                  )}
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
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You scored <span className="font-bold text-purple-600">{score} out of {totalLevels}</span>
              </p>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Your Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <p className="text-lg font-semibold text-gray-700">Correct Answers</p>
                  <p className="text-3xl font-bold text-green-600">{score}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <p className="text-lg font-semibold text-gray-700">Incorrect Answers</p>
                  <p className="text-3xl font-bold text-red-600">{totalLevels - score}</p>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-4 border-2 border-purple-200">
                <p className="text-lg font-semibold text-gray-700">Percentage</p>
                <p className="text-3xl font-bold text-blue-600">{Math.round((score / totalLevels) * 100)}%</p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Key Insights:
              </h3>
              <div className="bg-white rounded-lg p-6 border-2 border-green-300">
                <p className="text-green-800 leading-relaxed text-lg">
                  Understanding how visualization impacts your teaching practice can help you maintain perspective and motivation during challenging times. Regular reflection on your impact helps build resilience and reinforces the meaningful nature of your work.
                </p>
              </div>
            </div>

            {/* Restart Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartQuiz}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
}

export default ImpactVisualization;