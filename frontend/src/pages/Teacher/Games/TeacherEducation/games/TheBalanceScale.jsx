import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Sliders, Scale, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

const TheBalanceScale = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-31";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  // Define 5 questions about teacher work-life balance
  const questions = [
    {
      id: 1,
      question: "You're grading papers at 10 PM after dinner. What's the most balanced approach for your well-being?",
      options: [
        { id: 'a', text: "Finish all papers tonight so you're caught up", isCorrect: false, explanation: "Working late regularly disrupts sleep and affects your next day's performance. Setting boundaries is important for sustainability." },

        { id: 'b', text: "Stop immediately and grade during school hours tomorrow", isCorrect: false, explanation: "While respecting rest time is good, this adds pressure to find time during busy school hours. A compromise is better." },
        { id: 'c', text: "Work until midnight to get it all done", isCorrect: false, explanation: "This severely impacts your sleep and well-being. It's not sustainable and affects your effectiveness as a teacher." },
        { id: 'd', text: "Grade for 30 minutes, then save the rest for tomorrow", isCorrect: true, explanation: "Setting a time limit respects your sleep schedule and maintains work-life balance. You can finish tomorrow with fresh energy." },
      ]
    },
    {
      id: 2,
      question: "Your family wants to spend quality time with you, but you have lesson planning to do. How do you handle this?",
      options: [
        { id: 'a', text: "Spend focused time with family, then plan lessons afterward", isCorrect: true, explanation: "This honors both commitments by giving each focused attention. Quality family time is essential for your well-being." },
        { id: 'b', text: "Plan lessons while spending time with family", isCorrect: false, explanation: "Divided attention doesn't serve either purpose well. Both family time and planning deserve focused attention." },
        { id: 'c', text: "Tell them you're too busy and continue planning", isCorrect: false, explanation: "This neglects your family's need for connection. It can strain relationships and doesn't support work-life balance." },

        { id: 'd', text: "Cancel family time to focus on work", isCorrect: false, explanation: "Regularly sacrificing family time for work creates imbalance and can harm relationships. Both are important for your overall well-being." }
      ]
    },
    {
      id: 3,
      question: "You're feeling overwhelmed with work and personal responsibilities. What's the most supportive action for yourself?",
      options: [
        { id: 'a', text: "Push harder and work through the stress", isCorrect: false, explanation: "Ignoring stress leads to burnout. Taking care of yourself is necessary to be effective in all areas." },
        { id: 'b', text: "Take a 10-minute meditation break or walk", isCorrect: true, explanation: "Brief self-care activities help reset your nervous system and improve your ability to handle stress effectively." },
        { id: 'c', text: "Ignore your feelings and focus on tasks", isCorrect: false, explanation: "Suppressing emotions doesn't solve underlying stress. Addressing your needs is important for long-term balance." },
        { id: 'd', text: "Work even more to get ahead of the stress", isCorrect: false, explanation: "This increases stress rather than addressing it. Self-care is essential for managing overwhelm." }
      ]
    },
    {
      id: 4,
      question: "It's Sunday evening and you have 5 hours of grading to do. How do you approach this?",
      options: [
        { id: 'a', text: "Do all 5 hours tonight to be ready for Monday", isCorrect: false, explanation: "Using all weekend time for work prevents rest and recovery, which is essential for Monday readiness." },

        { id: 'b', text: "Do 2 hours tonight and 3 hours Monday morning", isCorrect: false, explanation: "Starting Monday with a heavy workload doesn't support a balanced start to the week. Planning ahead is better." },
        { id: 'c', text: "Spread the grading across Monday to Thursday, doing 1 hour each day", isCorrect: true, explanation: "Distributing workload prevents weekend burnout and maintains boundaries between work and personal time." },
        { id: 'd', text: "Leave it all for Monday", isCorrect: false, explanation: "Delaying everything until Monday creates unnecessary stress. Proactive time management is key to balance." }
      ]
    },
    {
      id: 5,
      question: "You consistently get only 5-6 hours of sleep to prepare for the next day. What's the most sustainable approach?",
      options: [
        { id: 'a', text: "Keep sleeping less to prepare more", isCorrect: false, explanation: "Chronic sleep deprivation impairs cognitive function, mood, and immune system. It's counterproductive in the long run." },
        { id: 'b', text: "Prepare the night before to ensure 7-8 hours of sleep", isCorrect: true, explanation: "Prioritizing sleep by preparing ahead ensures you're well-rested and effective as an educator." },
        { id: 'c', text: "Sleep during the day instead", isCorrect: false, explanation: "Daytime sleep doesn't fully compensate for missed nighttime sleep and disrupts circadian rhythms." },
        { id: 'd', text: "Take sleeping pills to get more rest", isCorrect: false, explanation: "Medication should be a last resort. Developing healthy sleep habits is a more sustainable approach." }
      ]
    }
  ];

  const handleAnswerSelect = (optionId) => {
    if (selectedAnswer !== null) return; // Prevent changing answer

    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    setSelectedAnswer(optionId);
    setShowFeedback(true);

    // Update score if correct
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Record the answer
    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      question: currentQ.question,
      selectedOption: optionId,
      correct: isCorrect,
      correctOption: currentQ.options.find(opt => opt.isCorrect).id,
      explanation: selectedOption.explanation
    }]);

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setShowGameOver(true);
      }
    }, 4000); // Show feedback for 4 seconds
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowGameOver(false);
    setScore(0);
    setAnswers([]);
  };


  const getBalanceColor = () => {
    if (score >= 4) {
      return 'from-green-500 to-emerald-500';
    } else if (score >= 3) {
      return 'from-blue-500 to-cyan-500';
    } else if (score >= 2) {
      return 'from-yellow-500 to-orange-500';
    } else {
      return 'from-red-500 to-rose-500';
    }
  };

  const getBalanceLabel = () => {
    if (score >= 4) {
      return 'Excellent Understanding';
    } else if (score >= 3) {
      return 'Good Understanding';
    } else if (score >= 2) {
      return 'Moderate Understanding';
    } else {
      return 'Needs Improvement';
    }
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "The Balance Scale"}
      subtitle={gameData?.description || "Understand the current ratio between personal time and school time"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showGameOver ? totalLevels : currentQuestion + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">

              <p className="text-lg text-gray-600 mb-2">
                Test your understanding of work-life balance as a teacher
              </p>
              <p className="text-sm text-gray-500 italic">
                Choose the most balanced approach for each scenario
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span className="font-semibold">Score: {score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-800">
                  {questions[currentQuestion].question}
                </h3>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-6">
              {questions[currentQuestion].options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${selectedAnswer === option.id
                      ? option.isCorrect
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-purple-300 hover:shadow-md'
                    } ${selectedAnswer !== null ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedAnswer === option.id
                        ? option.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }`}>
                      {option.id.toUpperCase()}
                    </div>
                    <p className="text-gray-800 font-medium">
                      {option.text}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border-2 ${answers[answers.length - 1]?.correct
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-3xl ${answers[answers.length - 1]?.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {answers[answers.length - 1]?.correct ? '✅' : '❌'}
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${answers[answers.length - 1]?.correct ? 'text-green-800' : 'text-red-800'}`}>
                      {answers[answers.length - 1]?.correct ? 'Correct!' : 'Not quite'}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {answers[answers.length - 1]?.explanation}
                    </p>
                    <p className="text-gray-600 mt-3 italic">

                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Game Over Screen */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Balance Assessment Complete
              </h2>
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getBalanceColor()} text-white px-6 py-3 rounded-xl mb-4`}>
                <Scale className="w-6 h-6" />
                <span className="text-2xl font-bold">Score: {score}/{questions.length}</span>
              </div>
              <p className="text-lg text-gray-600">
                {getBalanceLabel()}
              </p>
            </div>

            {/* Summary of Answers */}
            <div className="space-y-4 mb-8">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${answer.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${answer.correct ? 'text-green-600' : 'text-red-600'}`}>
                      {answer.correct ? '✅' : '❌'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">
                        Q{index + 1}: {answer.question}
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Your answer:</span> {questions[index].options.find(opt => opt.id === answer.selectedOption)?.text}
                      </p>
                      {!answer.correct && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Better approach:</span> {questions[index].options.find(opt => opt.id === answer.correctOption)?.text}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        {answer.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Restart Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Restart Quiz
              </motion.button>
            </div>
          </div>
        )}


      </div>
    </TeacherGameShell>
  );
};

export default TheBalanceScale;