import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Shield, Zap, EyeOff, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

const TheBounceBackQuiz = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-51";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [classificationCounts, setClassificationCounts] = useState({ resilient: 0, reactive: 0, avoidant: 0 });

  // Reaction type options
  const reactionTypes = [
    {
      id: 'resilient',
      label: 'Resilient',
      icon: Shield,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      description: 'Bounce back quickly, learn from setbacks, maintain perspective'
    },
    {
      id: 'reactive',
      label: 'Reactive',
      icon: Zap,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      description: 'Respond quickly with strong emotions, may take setbacks personally'
    },
    {
      id: 'avoidant',
      label: 'Avoidant',
      icon: EyeOff,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      description: 'Withdraw, avoid addressing issues, may feel overwhelmed'
    }
  ];

  // School setback scenarios
  const scenarios = [
    {
      id: 1,
      title: "Student Misbehavior",
      scenario: "A student disrupts your lesson repeatedly, despite your attempts to redirect. Other students are getting frustrated, and you feel your lesson plan is falling apart. The student seems to be acting out intentionally.",
      reactions: [

        {
          type: 'reactive',
          text: "You feel your frustration building immediately. You raise your voice, send the student out, and feel personally attacked. You replay the incident in your mind and feel angry that your lesson was disrupted.",
          feedback: "Reactive response. Strong emotional reactions are normal, but taking setbacks personally can drain your energy. Consider pausing before reacting to maintain perspective."
        },
        {
          type: 'avoidant',
          text: "You feel overwhelmed and unsure how to handle it. You let the behavior continue, avoid direct confrontation, and hope it resolves itself. You feel powerless and stressed.",
          feedback: "Avoidant response. While feeling overwhelmed is understandable, avoiding the situation can make it worse. Building confidence to address challenges directly is part of resilience."
        },
        {
          type: 'resilient',
          text: "You pause, take a breath, and calmly address the behavior while maintaining class flow. You acknowledge this is challenging but don't take it personally. You reflect on what might be causing the behavior and plan a follow-up conversation.",
          feedback: "Resilient response! You maintained composure, addressed the issue, and didn't take it personally. This shows emotional regulation and problem-solving focus."
        },
      ]
    },
    {
      id: 2,
      title: "Parent Complaint",
      scenario: "A parent emails you expressing frustration about their child's grade and questioning your teaching methods. The email is critical and feels accusatory. They've copied the principal on the message.",
      reactions: [

        {
          type: 'reactive',
          text: "You feel immediately defensive and angry. You draft a sharp response defending yourself, feel attacked, and worry about your reputation. You lose sleep thinking about the complaint.",
          feedback: "Reactive response. Feeling defensive is natural, but strong reactions can escalate situations. Taking time to process before responding helps maintain professionalism and perspective."
        },
        {
          type: 'resilient',
          text: "You read the email carefully, take time to process your feelings, and respond professionally. You acknowledge their concerns, provide context, and suggest a conversation. You don't take it personally and focus on finding solutions.",
          feedback: "Resilient response! You maintained professionalism, didn't take criticism personally, and focused on solutions. This shows emotional regulation and communication skills."
        },
        {
          type: 'avoidant',
          text: "You feel overwhelmed and don't know how to respond. You avoid replying, hope it goes away, and feel anxious every time you check email. You avoid conversations about it.",
          feedback: "Avoidant response. Avoiding difficult conversations can increase anxiety and make situations worse. Developing skills to address concerns directly builds resilience and resolution."
        }
      ]
    },
    {
      id: 3,
      title: "Failed Lesson",
      scenario: "A lesson you've spent hours planning doesn't go well. Students are confused, disengaged, and you can see they're not understanding the concepts. You feel like you've failed as a teacher.",
      reactions: [
        {
          type: 'resilient',
          text: "You recognize the lesson didn't work and reflect on what happened. You adjust in the moment, try a different approach, and plan to revise for next time. You see it as learning, not failure.",
          feedback: "Resilient response! You adapted in the moment, learned from the experience, and didn't see it as personal failure. This growth mindset is key to resilience."
        },
        {
          type: 'reactive',
          text: "You feel like a complete failure and take it personally. You get frustrated with the students for not understanding, blame yourself harshly, and feel like you're not cut out for teaching.",
          feedback: "Reactive response. Taking setbacks as personal failures is draining. Remember that not every lesson works perfectly, and learning from what doesn't work is valuable professional growth."
        },
        {
          type: 'avoidant',
          text: "You feel embarrassed and don't want to acknowledge the lesson failed. You move on quickly without addressing it, avoid discussing it with colleagues, and hope students forget about it.",
          feedback: "Avoidant response. Avoiding reflection on what didn't work prevents learning and growth. Addressing setbacks directly helps you improve and build confidence in your teaching."
        }
      ]
    },
    {
      id: 4,
      title: "Technology Failure",
      scenario: "Right before an important presentation, your technology fails. The projector won't work, your slides are inaccessible, and you have no backup plan. Students are waiting, and you feel unprepared.",
      reactions: [

        {
          type: 'reactive',
          text: "You feel panicked and frustrated. You blame yourself for not having a backup, get flustered in front of students, and feel like the whole lesson is ruined. You're visibly stressed and struggle to recover.",
          feedback: "Reactive response. Technology failures are common and not your fault. Developing backup plans and staying flexible helps you bounce back quickly from unexpected challenges."
        },
        {
          type: 'avoidant',
          text: "You feel overwhelmed and unsure what to do. You cancel the lesson, avoid teaching that day, and feel anxious about teaching without technology going forward.",
          feedback: "Avoidant response. Avoiding teaching due to technical issues prevents learning opportunities. Building confidence to teach flexibly, with or without technology, increases resilience."
        },
        {
          type: 'resilient',
          text: "You stay calm, acknowledge the situation to students, and quickly adapt. You find an alternative way to present the material, maybe using the board or a discussion format. You see it as an opportunity to be flexible.",
          feedback: "Resilient response! You adapted quickly, maintained composure, and found solutions. This flexibility and problem-solving under pressure shows strong resilience."
        },
      ]
    },
    {
      id: 5,
      title: "Negative Observation Feedback",
      scenario: "After an administrative observation, you receive feedback that highlights several areas for improvement. The feedback feels critical, and you're disappointed because you thought the lesson went well.",
      reactions: [
        {
          type: 'resilient',
          text: "You read the feedback carefully, separate helpful insights from areas of disagreement, and create an action plan. You seek clarification on points you don't understand and focus on growth opportunities.",
          feedback: "Resilient response! You processed feedback constructively, focused on growth, and didn't let it shake your confidence. This balanced approach to feedback builds professional resilience."
        },
        {
          type: 'reactive',
          text: "You feel criticized and defensive. You disagree with the feedback, feel personally attacked, and question your abilities as a teacher. You lose confidence and feel demoralized.",
          feedback: "Reactive response. Feeling defensive about feedback is natural, but separating helpful insights from personal feelings helps you grow. Feedback is about professional development, not personal worth."
        },
        {
          type: 'avoidant',
          text: "You read the feedback but don't engage with it. You avoid discussing it, don't make changes, and hope it's forgotten. You feel anxious about future observations.",
          feedback: "Avoidant response. Avoiding feedback prevents professional growth. Engaging constructively with feedback, even when it's difficult, helps you develop and build confidence in your teaching."
        }
      ]
    }
  ];

  const handleAnswerSelect = (reactionType) => {
    const newAnswers = { ...selectedAnswers, [currentQuestion]: reactionType };
    setSelectedAnswers(newAnswers);

    // Update classification counts
    const counts = { resilient: 0, reactive: 0, avoidant: 0 };
    Object.values(newAnswers).forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });
    setClassificationCounts(counts);

    setShowFeedback(true);

    // Increment score if resilient
    if (reactionType === 'resilient') {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setShowGameOver(true);
    }
  };

  const currentScenario = scenarios[currentQuestion];
  const selectedReaction = selectedAnswers[currentQuestion];
  const selectedReactionData = currentScenario?.reactions.find(r => r.type === selectedReaction);

  // Calculate dominant classification
  const getDominantClassification = () => {
    const { resilient, reactive, avoidant } = classificationCounts;
    if (resilient >= reactive && resilient >= avoidant) return 'resilient';
    if (reactive >= avoidant) return 'reactive';
    return 'avoidant';
  };

  const dominantClassification = getDominantClassification();
  const dominantData = reactionTypes.find(r => r.id === dominantClassification);

  return (
    <TeacherGameShell
      title={gameData?.title || "The Bounce-Back Quiz"}
      subtitle={gameData?.description || "Understand how resiliently you respond to common school setbacks"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold">Question {currentQuestion + 1} of {scenarios.length}</span>
                <span className="font-semibold">{Math.round(((currentQuestion + 1) / scenarios.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / scenarios.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentScenario.title}</h2>
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <p className="text-gray-700 text-lg leading-relaxed">{currentScenario.scenario}</p>
              </div>
            </div>

            {/* Answer Options */}
            {!showFeedback && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How would you typically react?</h3>
                {currentScenario.reactions.map((reaction, index) => {
                  const reactionType = reactionTypes.find(rt => rt.id === reaction.type);
                  const Icon = reactionType.icon;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(reaction.type)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${reactionType.borderColor
                        } bg-gradient-to-br ${reactionType.bgColor} hover:shadow-lg`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${reactionType.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold text-lg ${reactionType.textColor}`}>
                              {reactionType.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{reactionType.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Feedback */}
            {showFeedback && selectedReactionData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className={`bg-gradient-to-br ${reactionTypes.find(rt => rt.id === selectedReaction).bgColor} rounded-xl p-6 border-2 ${reactionTypes.find(rt => rt.id === selectedReaction).borderColor}`}>
                  <div className="flex items-start gap-3 mb-4">
                    {selectedReaction === 'resilient' ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${reactionTypes.find(rt => rt.id === selectedReaction).textColor}`}>
                        {reactionTypes.find(rt => rt.id === selectedReaction).label} Response
                      </h3>
                      <p className="text-gray-700 mb-4">{selectedReactionData.text}</p>
                      <div className="bg-white/60 rounded-lg p-4">
                        <p className="text-gray-800 font-medium">{selectedReactionData.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {showFeedback && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentQuestion < scenarios.length - 1 ? 'Next Question' : 'View Results'}
                </motion.button>
              </div>
            )}
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                {dominantClassification === 'resilient' ? '🛡️' : dominantClassification === 'reactive' ? '⚡' : '👁️'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <p className="text-xl text-gray-600">Your Resilience Profile</p>
            </div>

            {/* Classification Summary */}
            <div className={`bg-gradient-to-br ${dominantData.bgColor} rounded-xl p-6 border-2 ${dominantData.borderColor} mb-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${dominantData.color} flex items-center justify-center`}>
                  {React.createElement(dominantData.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${dominantData.textColor}`}>
                    Primary Style: {dominantData.label}
                  </h3>
                  <p className="text-gray-700">{dominantData.description}</p>
                </div>
              </div>

              <div className="bg-white/60 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-3">Your Response Breakdown:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">🛡️ Resilient:</span>
                    <span className="font-bold text-green-800">{classificationCounts.resilient} / 8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-700 font-medium">⚡ Reactive:</span>
                    <span className="font-bold text-orange-800">{classificationCounts.reactive} / 8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">👁️ Avoidant:</span>
                    <span className="font-bold text-gray-800">{classificationCounts.avoidant} / 8</span>
                  </div>
                </div>
              </div>

              {/* Insights based on classification */}
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Insights:</h4>
                {dominantClassification === 'resilient' ? (
                  <p className="text-gray-700">
                    You show strong resilience patterns! You tend to bounce back from setbacks, learn from challenges, and maintain perspective. Continue building on these strengths while staying aware of situations where you might feel reactive or avoidant.
                  </p>
                ) : dominantClassification === 'reactive' ? (
                  <p className="text-gray-700">
                    You tend to respond quickly and emotionally to setbacks. While strong reactions are normal, developing pause-and-reflect practices can help you respond more resiliently. Consider breathing exercises and reflection techniques to build resilience.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    You may tend to avoid or withdraw from challenging situations. Building confidence to address setbacks directly, even when difficult, is key to resilience. Start with small challenges and gradually build your capacity to face setbacks head-on.
                  </p>
                )}
              </div>
            </div>

            {/* Resilience Tips */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Building Resilience
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Pause before reacting:</strong> Take a breath to create space between challenge and response</li>
                <li>• <strong>Reflect and learn:</strong> View setbacks as learning opportunities, not personal failures</li>
                <li>• <strong>Maintain perspective:</strong> Remember that one setback doesn't define your teaching ability</li>
                <li>• <strong>Seek support:</strong> Talk with colleagues, mentors, or friends about challenges</li>
                <li>• <strong>Practice self-compassion:</strong> Be kind to yourself when things don't go as planned</li>
                <li>• <strong>Focus on what you can control:</strong> Identify actionable steps rather than dwelling on what you can't change</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Discuss real resilience moments in group circles weekly. Set aside 10-15 minutes during weekly staff meetings or department gatherings for a "Resilience Circle." Each person shares one moment from the week when they faced a setback and how they responded. This practice normalizes challenges, helps teachers learn from each other's resilience strategies, and builds a supportive culture where setbacks are seen as opportunities for growth. Sharing both successful resilience moments and moments where they felt reactive or avoidant creates authentic connection and collective learning. This regular practice reinforces resilience skills and reminds teachers that everyone faces challenges—it's how we respond that matters.
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

export default TheBounceBackQuiz;