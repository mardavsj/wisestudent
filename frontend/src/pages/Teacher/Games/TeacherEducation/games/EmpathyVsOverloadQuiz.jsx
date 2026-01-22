import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Ear, Wrench, Heart, X, CheckCircle, AlertCircle } from "lucide-react";

const EmpathyVsOverloadQuiz = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-22";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Response options
  const responseOptions = [
    { id: 'listen', label: 'Listen', icon: Ear, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', borderColor: 'border-blue-300', textColor: 'text-blue-800' },
    { id: 'solve', label: 'Solve', icon: Wrench, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300', textColor: 'text-green-800' },
    { id: 'absorb', label: 'Absorb', icon: Heart, color: 'from-orange-500 to-red-500', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-300', textColor: 'text-orange-800' },
    { id: 'avoid', label: 'Avoid', icon: X, color: 'from-gray-500 to-slate-500', bgColor: 'from-gray-50 to-slate-50', borderColor: 'border-gray-300', textColor: 'text-gray-800' }
  ];

  // Student-related vignettes
  const scenarios = [
    {
      id: 1,
      title: "The Anxious Student",
      vignette: "A student comes to you after class, visibly upset. They're worried about an upcoming test and share that they've been having trouble sleeping and feeling overwhelmed. They're asking for help but seem to be carrying a lot of emotional weight.",
      correctAnswer: 'listen', // Listen is the healthiest response
      responses: {

        solve: {
          title: "Solve",
          description: "You immediately jump into problem-solving mode, creating a detailed study plan, offering to tutor them daily, and trying to fix everything. You take on responsibility for their success and feel stressed about their outcome.",
          explanation: "While problem-solving can be helpful, taking on too much responsibility for someone else's success creates emotional overload. You're trying to solve their problem rather than supporting them to solve it themselves."
        },
        absorb: {
          title: "Absorb",
          description: "You feel their anxiety deeply, lose sleep worrying about them, and carry their emotional burden. You think about them constantly and feel responsible for their wellbeing. Their stress becomes your stress.",
          explanation: "Absorbing someone's emotions is unhealthy emotional absorption. You're taking on their emotional burden, which drains your capacity and prevents you from being sustainably helpful. This leads to compassion fatigue."
        },
        listen: {
          title: "Listen",
          description: "You listen attentively, acknowledge their feelings, and validate their experience. You offer support and connect them with appropriate resources (counselor, study strategies) while maintaining emotional boundaries. You care without taking on their emotional burden.",
          explanation: "Listening without carrying is the healthiest response. You can be present, validate feelings, and offer support without absorbing their emotional weight. This maintains your capacity while still being helpful."
        },
        avoid: {
          title: "Avoid",
          description: "You minimize their concerns, tell them to 'just relax,' and quickly redirect the conversation. You don't want to deal with their emotional needs and create distance.",
          explanation: "Avoiding emotional needs creates disconnection and doesn't help the student. While boundaries are important, complete avoidance prevents you from being supportive and can make students feel dismissed."
        }
      }
    },
    {
      id: 2,
      title: "The Struggling Learner",
      vignette: "A student is consistently failing assignments despite your efforts. They're frustrated and discouraged. They come to you asking what they're doing wrong, and you can see they're on the verge of giving up.",
      correctAnswer: 'solve', // Solve with boundaries is the healthiest response
      responses: {
        listen: {
          title: "Listen",
          description: "You listen to their frustration, acknowledge their feelings, and explore what's happening together. You offer support and resources while maintaining boundaries. You care about their success without taking on responsibility for it.",
          explanation: "Listening allows you to understand their experience and offer appropriate support. You can be helpful without absorbing their frustration or feeling responsible for their outcomes."
        },
        solve: {
          title: "Solve",
          description: "You immediately create an intensive intervention plan, offer extra tutoring sessions, and take on the responsibility of ensuring they succeed. You work extra hours and feel stressed if they don't improve.",
          explanation: "While helping is good, taking on full responsibility for someone else's success creates overload. You can support without carrying the entire burden of their academic outcomes."
        },
        absorb: {
          title: "Absorb",
          description: "You take their failure personally, feel guilty about their struggles, and carry their discouragement. You lose sleep worrying about them and feel like you're not doing enough. Their frustration becomes your frustration.",
          explanation: "Absorbing their emotional state is unhealthy. You're taking on their frustration and guilt, which drains your capacity and prevents sustainable support. This is emotional absorption, not helpful empathy."
        },
        avoid: {
          title: "Avoid",
          description: "You tell them to 'try harder' or 'study more,' and quickly move on. You don't want to deal with their emotional needs or invest time in understanding their situation.",
          explanation: "Avoiding prevents you from being helpful. While you might think you're maintaining boundaries, complete avoidance prevents appropriate support and can make students feel dismissed."
        }
      }
    },
    {
      id: 3,
      title: "The Family Crisis",
      vignette: "A student confides in you about a serious family crisis at home. They're worried, scared, and don't know what to do. They're looking to you for guidance and emotional support during this difficult time.",
      correctAnswer: 'listen', // Listen is the healthiest response
      responses: {

        solve: {
          title: "Solve",
          description: "You immediately try to fix their family situation, offer to intervene directly, and take on responsibility for resolving their crisis. You work beyond your role and feel stressed about outcomes you can't control.",
          explanation: "Trying to solve a family crisis is beyond your role and creates overload. You can support and connect them with resources, but you can't fix their family situation. This creates unsustainable responsibility."
        },
        absorb: {
          title: "Absorb",
          description: "You take on their crisis as your own, lose sleep worrying about them, and carry their emotional burden constantly. You feel responsible for their wellbeing and their family situation. Their crisis becomes your crisis.",
          explanation: "Absorbing their crisis is unhealthy emotional absorption. You're taking on emotional weight that isn't yours to carry, which drains your capacity and prevents you from being sustainably helpful."
        },
        avoid: {
          title: "Avoid",
          description: "You acknowledge their situation briefly but quickly redirect, saying it's not your place to get involved. You create distance and don't offer emotional support or resources.",
          explanation: "Avoiding prevents appropriate support. While boundaries are important, students in crisis need connection and resources. Complete avoidance can leave them feeling unsupported and alone."
        },
        listen: {
          title: "Listen",
          description: "You listen with empathy, validate their feelings, and connect them with appropriate resources (counselor, support services). You offer emotional support while maintaining boundaries and recognizing your role as part of a support system.",
          explanation: "Listening without carrying is essential here. You can be present and supportive while connecting them with professional resources. You care deeply without taking on their entire emotional burden."
        },
      }
    },
    {
      id: 4,
      title: "The Behavioral Challenge",
      vignette: "A student with behavioral challenges is disrupting your class regularly. They're acting out, and you can see they're struggling emotionally. Other students are being affected, and you're feeling frustrated and overwhelmed.",
      correctAnswer: 'solve', // Solve with boundaries is the healthiest response
      responses: {

        solve: {
          title: "Solve",
          description: "You immediately create an intensive behavior plan, take on full responsibility for fixing their behavior, and work extra hours trying to solve the problem. You feel stressed and responsible for their transformation.",
          explanation: "While addressing behavior is important, taking on full responsibility for someone else's behavior creates overload. You can support and work with a team without carrying the entire burden."
        },
        listen: {
          title: "Listen",
          description: "You seek to understand what's behind the behavior, listen to the student's perspective, and work with support staff to address underlying needs. You maintain boundaries while being supportive and addressing the situation appropriately.",
          explanation: "Listening helps you understand the root causes while maintaining appropriate boundaries. You can be supportive and address the situation without absorbing all the emotional weight or avoiding it entirely."
        },
        absorb: {
          title: "Absorb",
          description: "You take their behavior personally, feel guilty and frustrated, and carry their emotional struggles. You lose sleep worrying about them and feel like their behavior is a reflection of your teaching. Their struggles become your struggles.",
          explanation: "Absorbing their emotional state is unhealthy. You're taking on their struggles as your own, which drains your capacity and prevents effective support. This is emotional absorption, not helpful empathy."
        },
        avoid: {
          title: "Avoid",
          description: "You send them out of class frequently, minimize their needs, and create distance. You don't want to deal with their emotional or behavioral challenges and focus on just managing the disruption.",
          explanation: "Avoiding prevents appropriate support. While managing disruption is necessary, complete avoidance of underlying needs doesn't help the student and can make situations worse over time."
        }
      }
    },
    {
      id: 5,
      title: "The Peer Conflict",
      vignette: "Two students come to you upset about a conflict between them. They're both emotional, and the situation is affecting the classroom dynamic. They're asking you to help resolve it and are looking for your guidance.",
      correctAnswer: 'listen', // Listen is the healthiest response
      responses: {
        listen: {
          title: "Listen",
          description: "You listen to both perspectives, help them understand each other's feelings, and guide them toward resolution. You facilitate the conversation while maintaining boundaries and recognizing that they need to work through it together.",
          explanation: "Listening and facilitating helps students resolve conflicts while maintaining your boundaries. You can be helpful without taking on their emotional burden or trying to solve it for them."
        },
        solve: {
          title: "Solve",
          description: "You immediately jump in to fix the conflict, take sides, and try to resolve it for them. You take on responsibility for their relationship and feel stressed about the outcome.",
          explanation: "Trying to solve their conflict for them creates overload. You can facilitate and support, but they need to work through it themselves. Taking on full responsibility prevents their growth."
        },
        absorb: {
          title: "Absorb",
          description: "You take on their conflict emotionally, feel stressed about their relationship, and carry their emotional burden. You lose sleep worrying about them and feel responsible for their friendship.",
          explanation: "Absorbing their conflict is unhealthy emotional absorption. You're taking on emotional weight that isn't yours to carry, which drains your capacity and prevents sustainable support."
        },
        avoid: {
          title: "Avoid",
          description: "You tell them to 'work it out themselves' or 'just get along,' and quickly move on. You don't want to deal with their emotional needs or invest time in helping them resolve the conflict.",
          explanation: "Avoiding prevents appropriate support. While students need to learn conflict resolution, complete avoidance doesn't help them develop these skills and can leave conflicts unresolved."
        }
      }
    },

  ];

  const handleAnswerSelect = (answer) => {
    if (selectedAnswers[currentQuestion]) return; // Already answered

    const isCorrect = answer === scenarios[currentQuestion].correctAnswer;

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
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

  const current = scenarios[currentQuestion];
  const selected = selectedAnswers[currentQuestion];
  const progress = ((currentQuestion + 1) / totalLevels) * 100;
  const isCorrect = selected === current.correctAnswer;
  const feedback = selected ? current.responses[selected] : null;
  const selectedOption = responseOptions.find(opt => opt.id === selected);

  return (
    <TeacherGameShell
      title={gameData?.title || "Empathy vs Overload Quiz"}
      subtitle={gameData?.description || "Distinguish between helpful empathy and unhealthy emotional absorption"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver ? (
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Vignette */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {current.title}
              </h2>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {current.vignette}
                </p>
              </div>
            </div>

            {!showFeedback ? (
              /* Response Options */
              <div className="space-y-4 mb-6">
                {responseOptions.map((option) => {
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
                            {option.id === 'listen' && (
                              current.id === 1 ? 'Listen with empathy and connect to resources' :
                                current.id === 2 ? 'Listen and guide toward self-efficacy' :
                                  current.id === 3 ? 'Listen while connecting to professional support' :
                                    current.id === 4 ? 'Listen to understand underlying causes' :
                                      'Listen and facilitate mutual understanding'
                            )}
                            {option.id === 'solve' && (
                              current.id === 1 ? 'Create detailed study plan and tutor intensively' :
                                current.id === 2 ? 'Develop intensive intervention and take ownership' :
                                  current.id === 3 ? 'Intervene directly in the family situation' :
                                    current.id === 4 ? 'Design behavior plan and manage outcomes' :
                                      'Take sides and resolve the conflict for them'
                            )}
                            {option.id === 'absorb' && (
                              current.id === 1 ? 'Feel their anxiety deeply and lose sleep' :
                                current.id === 2 ? 'Take their failure personally and feel guilty' :
                                  current.id === 3 ? 'Take on their crisis as your own burden' :
                                    current.id === 4 ? 'Take their behavior personally as reflection of your teaching' :
                                      'Take on their emotional burden and relationship stress'
                            )}
                            {option.id === 'avoid' && (
                              current.id === 1 ? 'Minimize concerns and tell them to relax' :
                                current.id === 2 ? 'Tell them to try harder and move on' :
                                  current.id === 3 ? 'Redirect and avoid getting involved' :
                                    current.id === 4 ? 'Send out of class and manage disruption only' :
                                      'Tell them to work it out themselves'
                            )}
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
                          {feedback.title}
                        </h3>
                        {selectedOption && (
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedOption.color} flex items-center justify-center`}>
                            {React.createElement(selectedOption.icon, { className: "w-5 h-5 text-white" })}
                          </div>
                        )}
                      </div>
                      <p className={`text-lg mb-4 ${isCorrect ? 'text-green-700' : 'text-orange-700'
                        }`}>
                        {feedback.description}
                      </p>
                      <div className={`bg-white rounded-lg p-4 border-l-4 ${isCorrect ? 'border-green-500' : 'border-orange-500'
                        }`}>
                        <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-orange-800'
                          }`}>
                          💡 Key Insight:
                        </p>
                        <p className={`${isCorrect ? 'text-green-700' : 'text-orange-700'
                          }`}>
                          {feedback.explanation}
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {currentQuestion < totalLevels - 1 ? 'Next Question' : 'Finish'}
                  </motion.button>
                </div>
              </AnimatePresence>
            )}
          </div>
        ) : (
          /* Game Over Screen */
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
              Quiz Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {score} out of {totalLevels} correctly
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {score === totalLevels
                  ? "Perfect! You have a strong understanding of the difference between helpful empathy and unhealthy emotional absorption. Remember that 'listening without carrying' is the key to sustainable care."
                  : score >= Math.ceil(totalLevels * 0.8)
                    ? "Excellent! You're developing awareness of healthy empathy boundaries. Keep practicing 'listening without carrying' to maintain your capacity while being helpful."
                    : score >= Math.ceil(totalLevels * 0.6)
                      ? "Good effort! Understanding empathy vs overload takes practice. Remember that you can care deeply while maintaining boundaries. 'Listening without carrying' protects your capacity."
                      : "Keep learning! Understanding the difference between helpful empathy and emotional absorption is important. Remember that 'listening without carrying' allows you to be sustainably helpful."}
              </p>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Discuss "listening without carrying" as a group reflection. Organize a staff meeting or professional development session where teachers can share experiences and strategies for maintaining healthy empathy boundaries. Create a safe space to discuss the difference between helpful empathy and emotional absorption. Share examples of "listening without carrying" and explore how to support students while maintaining your own capacity. This group reflection helps normalize healthy boundaries and creates a culture of sustainable care.
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

export default EmpathyVsOverloadQuiz;