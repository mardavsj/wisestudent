import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Smartphone, Mail, Clock, CheckCircle, XCircle, AlertCircle, BookOpen, Shield, Users, Calendar } from "lucide-react";

const DigitalBoundariesQuiz = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-92";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Quiz questions on digital boundaries (5 essential questions)
  const questions = [
    {
      id: 1,
      question: "A student texts you at 9 PM on a school night asking about tomorrow's assignment. What's the ideal boundary?",
      options: [
        {
          id: 'immediate-response',
          text: 'Reply immediately to help them',
          explanation: 'Responding immediately sets an expectation of 24/7 availability. Healthy boundaries mean not responding to student messages outside of school hours.',
          isCorrect: false,
          emoji: '❌',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },

        {
          id: 'weekend-response',
          text: 'Respond on the weekend when you have more time',
          explanation: 'Responding on weekends still blurs boundaries between work and personal time. Better to respond during designated school hours.',
          isCorrect: false,
          emoji: '⚠️',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'ignore',
          text: 'Ignore the message completely',
          explanation: 'While boundaries are important, completely ignoring messages can leave students feeling unsupported. Acknowledge during school hours.',
          isCorrect: false,
          emoji: '❌',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'next-morning',
          text: 'Wait until the next morning during school hours to respond',
          explanation: 'Excellent! Responding during school hours sets clear boundaries and protects your personal time. This teaches students appropriate communication times.',
          isCorrect: true,
          emoji: '✅',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
      ],
      topic: 'Student Communication',
      icon: Smartphone
    },
    {
      id: 2,
      question: "A parent emails you at 10 PM on Friday asking about their child's progress. What's the best boundary?",
      options: [
        {
          id: 'reply-friday',
          text: 'Reply Friday night to show you care',
          explanation: 'Replying Friday night sets expectations of 24/7 availability and blurs boundaries between work and personal time.',
          isCorrect: false,
          emoji: '❌',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'monday-morning',
          text: 'Respond Monday morning during school hours',
          explanation: 'Perfect! Responding during school hours maintains professional boundaries and protects your weekend rest. This models healthy work-life balance.',
          isCorrect: true,
          emoji: '✅',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'saturday-morning',
          text: 'Reply Saturday morning to address it quickly',
          explanation: 'Responding on weekends still blurs boundaries. It\'s better to wait until school hours to maintain clear work-life separation.',
          isCorrect: false,
          emoji: '⚠️',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'auto-reply',
          text: 'Set an auto-reply saying you\'ll respond during school hours',
          explanation: 'Auto-replies are great, but they should be set up proactively, not as a one-time response. Better to respond during school hours and communicate your availability clearly.',
          isCorrect: false,
          emoji: '💡',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        }
      ],
      topic: 'Parent Communication',
      icon: Mail
    },
    {
      id: 3,
      question: "You receive multiple work-related notifications on your phone throughout the evening. What's the ideal boundary practice?",
      options: [
        {
          id: 'check-immediately',
          text: 'Check notifications immediately when they come in',
          explanation: 'Checking notifications immediately creates constant work presence and prevents rest. This blurs boundaries significantly.',
          isCorrect: false,
          emoji: '❌',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },

        {
          id: 'check-hourly',
          text: 'Check notifications once per hour',
          explanation: 'Even checking hourly keeps work in your mind and prevents true rest. Better to disable notifications entirely after hours.',
          isCorrect: false,
          emoji: '⚠️',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'disable-notifications',
          text: 'Disable work notifications after school hours',
          explanation: 'Excellent! Disabling work notifications after hours creates clear boundaries and protects your rest time. You can check messages during designated work hours.',
          isCorrect: true,
          emoji: '✅',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'separate-device',
          text: 'Use a separate device for work',
          explanation: 'Separate devices can help, but you still need to disable notifications. The key is creating time boundaries, not just device separation.',
          isCorrect: false,
          emoji: '💡',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        }
      ],
      topic: 'Notification Boundaries',
      icon: Smartphone
    },
    {
      id: 4,
      question: "A student sends you a friend request on social media. What's the appropriate boundary?",
      options: [
        {
          id: 'decline-politely',
          text: 'Politely decline and explain professional boundaries',
          explanation: 'Perfect! Politely declining and explaining boundaries maintains professionalism while being respectful. This teaches students about appropriate boundaries.',
          isCorrect: true,
          emoji: '✅',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'accept-friend',
          text: 'Accept to show you care about students',
          explanation: 'Accepting friend requests from current students blurs professional boundaries. It\'s best to keep social media separate from student relationships.',
          isCorrect: false,
          emoji: '❌',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },

        {
          id: 'accept-after-graduation',
          text: 'Accept only after they graduate',
          explanation: 'Even after graduation, accepting friend requests can be complex. It\'s generally better to maintain professional boundaries. Many schools have policies on this.',
          isCorrect: false,
          emoji: '⚠️',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'ignore',
          text: 'Ignore the request',
          explanation: 'While this maintains boundaries, ignoring can feel dismissive. Better to politely decline and explain why, which teaches boundaries.',
          isCorrect: false,
          emoji: '💡',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        }
      ],
      topic: 'Social Media Boundaries',
      icon: Users
    },
    {
      id: 5,
      question: "Your school expects teachers to respond to parent emails within 2 hours, including evenings and weekends. What's the healthiest approach?",
      options: [
        {
          id: 'follow-expectation',
          text: 'Follow the expectation to be a team player',
          explanation: 'Following unreasonable expectations leads to burnout. Healthy boundaries benefit everyone, including students. You need rest to teach well.',
          isCorrect: false,
          emoji: '❌',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'discuss-boundaries',
          text: 'Discuss healthy boundaries with leadership and advocate for change',
          explanation: 'Perfect! Discussing boundaries with leadership and advocating for healthy practices helps everyone. This can lead to policies that benefit all teachers.',
          isCorrect: true,
          emoji: '✅',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'set-personal-boundaries',
          text: 'Set personal boundaries but don\'t discuss with leadership',
          explanation: 'Personal boundaries are good, but discussing with leadership can help create school-wide policies that benefit everyone.',
          isCorrect: false,
          emoji: '⚠️',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        },
        {
          id: 'find-new-school',
          text: 'Look for a new school with better boundaries',
          explanation: 'While sometimes necessary, first try advocating for change. Many schools are open to discussions about healthy boundaries when presented respectfully.',
          isCorrect: false,
          emoji: '💡',
          color: 'from-blue-400 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300'
        }
      ],
      topic: 'Institutional Boundaries',
      icon: Shield
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  const handleAnswerSelect = (optionId) => {
    if (showFeedback) return; // Prevent changing answer after feedback is shown

    const option = currentQuestionData.options.find(opt => opt.id === optionId);
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionId
    }));
    setShowFeedback(true);

    if (option.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setShowGameOver(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowFeedback(false);
    }
  };

  const getSelectedOption = () => {
    if (!selectedAnswer) return null;
    return currentQuestionData.options.find(opt => opt.id === selectedAnswer);
  };

  const getBoundaryScore = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) {
      return {
        level: 'Excellent',
        emoji: '🌟',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-300',
        message: 'You have excellent understanding of healthy digital boundaries!'
      };
    } else if (percentage >= 70) {
      return {
        level: 'Good',
        emoji: '👍',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        message: 'You have a good grasp of digital boundaries with room for improvement.'
      };
    } else if (percentage >= 50) {
      return {
        level: 'Developing',
        emoji: '📚',
        color: 'from-yellow-500 to-amber-600',
        bgColor: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-300',
        message: 'You\'re developing your understanding of digital boundaries. Keep learning!'
      };
    } else {
      return {
        level: 'Beginner',
        emoji: '🌱',
        color: 'from-orange-500 to-red-600',
        bgColor: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-300',
        message: 'You\'re starting to learn about digital boundaries. Every journey begins with awareness!'
      };
    }
  };

  if (showGameOver) {
    const boundaryScore = getBoundaryScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <TeacherGameShell
        title={gameData?.title || "Digital Boundaries Quiz"}
        subtitle={gameData?.description || "Learn healthy screen limits for personal and professional life"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={currentQuestion}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
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
                {boundaryScore.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Quiz Complete!
              </h2>
              <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${boundaryScore.color} text-white font-bold text-xl mb-4`}>
                {boundaryScore.level} Understanding
              </div>
              <p className="text-2xl font-bold text-gray-700 mb-2">
                Score: {score} / {questions.length}
              </p>
              <p className="text-xl text-gray-600">
                {percentage}% Correct
              </p>
            </div>

            {/* Boundary Score Display */}
            <div className={`bg-gradient-to-br ${boundaryScore.bgColor} rounded-xl p-6 border-2 ${boundaryScore.borderColor} mb-8`}>
              <p className="text-lg text-gray-700 text-center leading-relaxed">
                {boundaryScore.message}
              </p>
            </div>

            {/* Topic Summary */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Topics Covered
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from(new Set(questions.map(q => q.topic))).map(topic => (
                  <div key={topic} className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-900">{topic}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Key Takeaways
              </h3>
              <ul className="space-y-3 text-green-800">
                <li>• <strong>Set clear hours:</strong> Define specific times when you're available for work communication</li>
                <li>• <strong>Protect personal time:</strong> Don't respond to work messages outside of designated hours</li>
                <li>• <strong>Use scheduling:</strong> Schedule emails to send during work hours even if you write them at other times</li>
                <li>• <strong>Disable notifications:</strong> Turn off work notifications after hours to protect rest</li>
                <li>• <strong>Communicate boundaries:</strong> Let parents, students, and colleagues know your availability</li>
                <li>• <strong>Advocate for policies:</strong> Discuss healthy boundaries with leadership to create school-wide practices</li>
                <li>• <strong>Separate personal and professional:</strong> Keep social media and personal communication separate from student relationships</li>
                <li>• <strong>Vacation means vacation:</strong> Fully disconnect during time off with out-of-office messages</li>
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
                    <strong>Add "no-email zones" in staff policy for collective rest.</strong> Creating institutional boundaries helps everyone:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Advocate for policies:</strong> Discuss with leadership the benefits of "no-email zones"—times when work communication is not expected. Policy protects everyone.</li>
                    <li><strong>Define clear zones:</strong> Suggest specific no-email zones such as: evenings after 6 PM, weekends, holidays, and vacation times. Clear zones create shared expectations.</li>
                    <li><strong>Include exceptions:</strong> Define exceptions for true emergencies (with clear definition of "emergency"). Exceptions maintain safety while protecting boundaries.</li>
                    <li><strong>Set the example:</strong> Model healthy boundaries by respecting no-email zones yourself. Leadership by example encourages others.</li>
                    <li><strong>Create collective support:</strong> When policies protect everyone, teachers feel supported and less pressured to respond outside hours. Collective boundaries reduce competition.</li>
                    <li><strong>Protect rest quality:</strong> No-email zones allow teachers to fully rest, which improves teaching quality and reduces burnout. Rest supports effectiveness.</li>
                    <li><strong>Improve family time:</strong> When boundaries are clear, teachers can fully engage with family without work interruptions. Family time supports well-being.</li>
                    <li><strong>Reduce guilt:</strong> When policies exist, teachers don't feel guilty for not responding after hours. Policy removes individual pressure.</li>
                    <li><strong>Teach boundaries:</strong> Modeling healthy boundaries teaches students and parents about appropriate communication times. Boundaries are educational.</li>
                    <li><strong>Create sustainability:</strong> Healthy boundaries help teachers sustain their careers long-term. Sustainability benefits schools and students.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you add "no-email zones" in staff policy for collective rest, you're creating institutional support that protects everyone's boundaries, improves rest quality, reduces burnout, and models healthy practices for students and parents. Policy-level boundaries are more effective than individual efforts alone.
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
      title={gameData?.title || "Digital Boundaries Quiz"}
      subtitle={gameData?.description || "Learn healthy screen limits for personal and professional life"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {React.createElement(currentQuestionData.icon, { className: "w-8 h-8 text-blue-600" })}
              <div className="bg-blue-50 rounded-lg px-4 py-2 border-2 border-blue-200">
                <p className="text-sm font-semibold text-blue-900">{currentQuestionData.topic}</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentQuestionData.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-6">
            {currentQuestionData.options.map((option, index) => {
              const isSelected = selectedAnswer === option.id;
              const showResult = showFeedback && isSelected;

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${showResult
                      ? option.isCorrect
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                        : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                      : isSelected
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-md'
                        : `bg-gradient-to-br ${option.bgColor} ${option.borderColor} hover:shadow-md`
                    } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xl ${showResult && option.isCorrect ? 'bg-green-500 text-white' :
                        showResult && !option.isCorrect ? 'bg-red-500 text-white' :
                          'bg-gray-200 text-gray-600'
                      }`}>
                      {showResult ? option.emoji : String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${showResult ? 'text-gray-800' : 'text-gray-700'
                        }`}>
                        {option.text}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && getSelectedOption() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-6 rounded-xl border-2 ${getSelectedOption().isCorrect
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
                }`}
            >
              <div className="flex items-start gap-3">
                {getSelectedOption().isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className={`text-lg font-bold mb-2 ${getSelectedOption().isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {getSelectedOption().isCorrect ? 'Correct!' : 'Not quite'}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {getSelectedOption().explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!showFeedback}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${!showFeedback
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                }`}
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default DigitalBoundariesQuiz;