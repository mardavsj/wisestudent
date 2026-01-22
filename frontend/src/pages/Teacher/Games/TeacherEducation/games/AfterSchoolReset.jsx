import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Moon, Sun, Heart, CheckCircle, Lightbulb } from "lucide-react";

const AfterSchoolReset = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-33";
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

  const timerRef = useRef(null);
  const speechSynthRef = useRef(null);

  // Define 5 unique questions for After School Reset
  const questions = [
    {
      id: 1,
      question: "How can you mentally separate work stress from personal time when leaving school?",
      options: [

        { id: 'a', text: "Think about tomorrow's lesson plans on the drive home", isCorrect: false, explanation: "Continuing to think about work keeps your mind engaged with work tasks. This prevents proper mental separation and can lead to burnout." },
        { id: 'b', text: "Check emails immediately when you get home", isCorrect: false, explanation: "Checking work communications at home blurs boundaries between work and personal time. This prevents you from fully engaging in your personal life." },
        { id: 'c', text: "Bring all school materials home for the weekend", isCorrect: false, explanation: "Consistently bringing work home prevents rest and recovery. Healthy boundaries include designated work-free time." },
        { id: 'd', text: "Create a physical ritual like changing clothes or washing hands", isCorrect: true, explanation: "Creating a physical ritual helps signal the brain that work time is ending. This is a proven technique to establish clear boundaries between work and personal life." },
      ]
    },
    {
      id: 2,
      question: "What is an effective way to decompress after a challenging day with students?",
      options: [

        { id: 'a', text: "Spend the evening planning for tomorrow to feel more prepared", isCorrect: false, explanation: "Planning for tomorrow keeps you mentally engaged with work. It's important to have dedicated decompression time before engaging in work planning." },
        { id: 'b', text: "Engage in a brief physical activity like walking or stretching", isCorrect: true, explanation: "Physical activity helps release stress hormones and clears the mind. It's an active way to transition from work stress to personal time." },
        { id: 'c', text: "Talk to family members about all the day's challenges", isCorrect: false, explanation: "While communication is important, overwhelming family with work details can strain relationships. Find appropriate outlets for processing work stress." },
        { id: 'd', text: "Stay up late grading papers to get ahead", isCorrect: false, explanation: "Staying up late prevents adequate rest and recovery. Proper sleep is essential for resilience and effectiveness as a teacher." }
      ]
    },
    {
      id: 3,
      question: "How should you handle parent communications after school hours?",
      options: [

        { id: 'a', text: "Respond immediately to any parent message, even at night", isCorrect: false, explanation: "Immediate responses at all hours blur work-life boundaries. Parents can wait for reasonable response times during school hours." },
        { id: 'b', text: "Answer all messages within 15 minutes to appear responsive", isCorrect: false, explanation: "Expecting immediate responses creates unnecessary pressure and stress. Setting expectations for response times is healthier for all parties." },
        { id: 'c', text: "Set specific times for checking and responding to parent messages", isCorrect: true, explanation: "Setting boundaries around communication protects personal time and prevents work from bleeding into personal life. This is crucial for maintaining work-life balance." },
        { id: 'd', text: "Check messages during family dinners and bedtime routines", isCorrect: false, explanation: "Checking work communications during family time divides attention and prevents full engagement with loved ones." }
      ]
    },
    {
      id: 4,
      question: "What is the best approach to handling work thoughts during personal time?",
      options: [

        { id: 'a', text: "Immediately start working on the idea or problem", isCorrect: false, explanation: "Starting work during personal time erodes boundaries. Personal time should be protected for rest and recovery." },
        { id: 'b', text: "Ignore the thoughts completely and suppress them", isCorrect: false, explanation: "Suppressing thoughts often makes them stronger. Acknowledging and redirecting is a healthier approach than suppression." },
        { id: 'c', text: "Write down all work thoughts to remember them later", isCorrect: false, explanation: "Writing down work thoughts can perpetuate rumination. It's better to acknowledge and redirect rather than document work concerns during personal time." },
        { id: 'd', text: "Acknowledge the thought and consciously redirect to present moment", isCorrect: true, explanation: "Mindful redirection acknowledges work concerns without letting them dominate personal time. This maintains boundaries while addressing legitimate concerns." },
      ]
    },
    {
      id: 5,
      question: "How can you maintain energy for both professional and personal responsibilities?",
      options: [
        { id: 'a', text: "Ensure dedicated personal time for activities you enjoy", isCorrect: true, explanation: "Engaging in enjoyable activities restores energy and prevents burnout. Self-care is essential for sustaining effectiveness in all areas of life." },
        { id: 'b', text: "Use weekends to prepare extensively for the coming week", isCorrect: false, explanation: "Using all weekend time for work prevents rest and recovery. Downtime is essential for recharging and preventing long-term burnout." },
        { id: 'c', text: "Sacrifice personal hobbies to focus more on teaching duties", isCorrect: false, explanation: "Sacrificing personal interests leads to an imbalanced life and eventual burnout. Personal fulfillment is necessary for sustained professional effectiveness." },
        { id: 'd', text: "Work through lunch breaks to free up time later", isCorrect: false, explanation: "Skipping breaks leads to exhaustion and decreased effectiveness. Regular breaks are essential for maintaining energy throughout the day." }
      ]
    }
  ];

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = (text) => {
    if (!speechSynthRef.current) return;

    speechSynthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthRef.current.speak(utterance);
  };

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

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "After-School Reset"}
      subtitle={gameData?.description || "Practice end-of-day mental separation techniques"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showGameOver ? totalLevels : currentQuestion + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">

              <p className="text-lg text-gray-600 mb-2">
                Learn effective techniques for separating work and personal life as a teacher
              </p>
              <p className="text-sm text-gray-500 italic">
                Choose the best approach for each scenario
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
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-800">
                  {currentQuestionData.question}
                </h3>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-6">
              {currentQuestionData.options.map((option) => (
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
                      : 'border-gray-300 bg-white hover:border-indigo-300 hover:shadow-md'
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
                Reset Complete
              </h2>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl mb-4">
                <Moon className="w-6 h-6" />
                <span className="text-2xl font-bold">Score: {score}/{questions.length}</span>
              </div>
              <p className="text-lg text-gray-600">
                {score >= 4
                  ? 'Excellent! You have a strong understanding of work-life boundaries.'
                  : score >= 3
                    ? 'Good job! You are developing awareness of healthy work-life balance.'
                    : 'Nice effort! Continue learning about effective work-life separation.'}
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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
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

export default AfterSchoolReset;