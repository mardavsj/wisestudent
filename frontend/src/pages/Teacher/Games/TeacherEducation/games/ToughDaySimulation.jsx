import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { MessageCircle, Moon, BookOpen, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

const ToughDaySimulation = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-53";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentMoment, setCurrentMoment] = useState(0);
  const [calmLevel, setCalmLevel] = useState(70); // Start at 70% (moderate stress)
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Challenging day moments
  const dayMoments = [
    {
      id: 1,
      time: "8:00 AM - Morning Rush",
      situation: "You arrive at school to find that your lesson materials haven't been printed, a parent is waiting to speak with you, and you have 10 minutes before class starts. Students are already arriving.",
      choices: [
        {
          id: 'panic',
          label: 'Panic and rush to fix everything',
          calmChange: -15,
          description: "You frantically try to do everything at once, feeling overwhelmed and stressed. You rush through the parent conversation and print materials while students wait.",
          feedback: "Panic mode increases stress. Taking a moment to breathe and prioritize would help."
        },

        {
          id: 'delay',
          label: 'Delay everything and feel anxious',
          calmChange: -10,
          description: "You feel frozen, delay addressing anything, and worry about all the tasks. The parent waits, materials aren't ready, and you feel increasingly anxious.",
          feedback: "Avoiding and delaying increases anxiety. Taking action, even small steps, helps reduce stress."
        },
        {
          id: 'prioritize',
          label: 'Take a breath, prioritize, and delegate',
          calmChange: -5,
          description: "You take a deep breath, quickly address the parent's urgent concern, ask a colleague to help with printing, and calmly greet students. You handle it systematically.",
          feedback: "Good prioritization! Taking a breath and handling things systematically reduces stress."
        },
      ]
    },
    {
      id: 2,
      time: "10:30 AM - Disruptive Class",
      situation: "Your third-period class is completely off-task. Despite your attempts to engage them, students are talking, on phones, and not following instructions. You've tried redirecting three times with no success.",
      choices: [
        {
          id: 'yell',
          label: 'Raise your voice and get frustrated',
          calmChange: -20,
          description: "You raise your voice in frustration: 'That's ENOUGH!' The class becomes more disruptive, you feel emotionally drained, and the lesson continues to fall apart.",
          feedback: "Reacting with frustration often escalates situations. A pause and calm redirection would be more effective."
        },
        {
          id: 'pause',
          label: 'Pause, breathe, and try a different approach',
          calmChange: -5,
          description: "You stop, take three deep breaths, and calmly say: 'I see we're having trouble focusing. Let's take a 2-minute break, then try a different activity.' The class settles.",
          feedback: "Excellent! Pausing and trying a new approach shows resilience and reduces stress for both you and students."
        },
        {
          id: 'give-up',
          label: 'Feel defeated and let it continue',
          calmChange: -15,
          description: "You feel defeated and stop trying. The class remains chaotic, you feel powerless, and your stress accumulates. The rest of the period is difficult.",
          feedback: "Feeling defeated increases stress. Remember: one difficult moment doesn't define your day. Try a new strategy."
        }
      ]
    },
    {
      id: 3,
      time: "1:00 PM - Negative Feedback",
      situation: "During lunch, you receive an email from the principal with feedback on a recent observation. The feedback highlights several areas for improvement and feels critical. You thought the lesson went well.",
      choices: [
        {
          id: 'process',
          label: 'Process it, reflect, and plan improvements',
          calmChange: -5,
          description: "You read the feedback carefully, take time to process it, and reflect on what you can learn. You identify actionable steps for improvement and see it as professional growth.",
          feedback: "Great approach! Processing feedback constructively and seeing it as growth reduces stress and helps you improve."
        },
        {
          id: 'defensive',
          label: 'Get defensive and question your abilities',
          calmChange: -18,
          description: "You read the feedback and immediately feel criticized. You question whether you're a good teacher, replay the observation in your mind, and lose confidence. Your stress spikes.",
          feedback: "Taking feedback personally increases stress. Try to see it as growth opportunities rather than personal criticism."
        },

        {
          id: 'avoid',
          label: 'Avoid reading it and feel anxious',
          calmChange: -12,
          description: "You see the email but avoid reading it fully. You feel anxious and worried about what it says, but don't address it. The uncertainty increases your stress.",
          feedback: "Avoiding feedback increases anxiety. Facing it directly, even when difficult, reduces stress and helps you move forward."
        }
      ]
    },
    {
      id: 4,
      time: "3:00 PM - Technology Failure",
      situation: "Right before your last class, your computer crashes and you lose your lesson plan. Your backup drive isn't working, and you have 5 minutes before students arrive. You've spent hours preparing this lesson.",
      choices: [
        {
          id: 'stress',
          label: 'Feel stressed and try to recreate everything',
          calmChange: -16,
          description: "You panic, try to quickly recreate everything, and feel overwhelmed. Students arrive to see you stressed and flustered. The lesson doesn't go well.",
          feedback: "Stressing about what's lost increases tension. Adapting with what you have shows resilience."
        },
        {
          id: 'adapt',
          label: 'Adapt quickly and use what you remember',
          calmChange: -6,
          description: "You take a breath, remember the key points of your lesson, and adapt quickly. You explain to students that you're adapting, and they respond well. The lesson flows naturally.",
          feedback: "Excellent resilience! Adapting to challenges reduces stress and shows flexibility. Sometimes simpler approaches work well."
        },
        {
          id: 'cancel',
          label: 'Feel defeated and give students busy work',
          calmChange: -14,
          description: "You feel defeated and just give students worksheet busy work. You feel like a failure, and students sense your low energy. You leave feeling discouraged.",
          feedback: "Feeling defeated increases stress. Even when plans fall apart, your presence and adaptability matter more than perfect materials."
        }
      ]
    },
    {
      id: 5,
      time: "4:30 PM - End of Day",
      situation: "The bell rings, and you're exhausted. You still have grading to do, emails to respond to, and tomorrow's lesson to plan. You feel drained and stressed, carrying the weight of the challenging day.",
      choices: [
        {
          id: 'continue',
          label: 'Keep working despite exhaustion',
          calmChange: -12,
          description: "You push through, continue working while exhausted, and ignore your need for rest. You work for two more hours, feeling increasingly drained and stressed.",
          feedback: "Pushing through exhaustion increases stress and prevents recovery. Rest is essential for sustainable teaching."
        },

        {
          id: 'ignore',
          label: 'Ignore feelings and carry stress home',
          calmChange: -10,
          description: "You pack up quickly, ignore your feelings, and head home carrying all the stress. You feel tense and don't process the day, carrying it into your evening.",
          feedback: "Ignoring feelings doesn't make them go away. Acknowledging and processing the day helps prevent carrying stress home."
        },
        {
          id: 'pause',
          label: 'Acknowledge the tough day and pause',
          calmChange: -4,
          description: "You acknowledge it was a tough day, pause, and take a moment to breathe. You recognize you're exhausted and that it's okay to rest. You decide to address tasks later.",
          feedback: "Excellent self-awareness! Acknowledging your state and pausing is the first step to recovery. This reduces stress."
        },
      ]
    }
  ];

  const handleMomentChoice = (choiceId) => {
    const moment = dayMoments[currentMoment];
    const choice = moment.choices.find(c => c.id === choiceId);

    setSelectedChoices(prev => ({
      ...prev,
      [currentMoment]: choice
    }));

    // Update calm level
    const newCalmLevel = Math.max(0, Math.min(100, calmLevel + choice.calmChange));
    setCalmLevel(newCalmLevel);

    // Move to next moment
    if (currentMoment < dayMoments.length - 1) {
      setTimeout(() => {
        setCurrentMoment(prev => prev + 1);
      }, 1500);
    } else {
      // End of day - show summary
      setTimeout(() => {
        setShowSummary(true);
        setShowGameOver(true);
      }, 1500);
    }
  };

  const currentMomentData = dayMoments[currentMoment];
  const selectedChoice = selectedChoices[currentMoment];

  // Update score whenever choices change
  useEffect(() => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
  }, [selectedChoices]);

  // Calculate score based on good choices (calmChange >= -6)
  const calculateScore = () => {
    let correctChoices = 0;
    Object.values(selectedChoices).forEach(choice => {
      if (choice.calmChange >= -6) correctChoices += 1; // Good choices
    });
    return correctChoices;
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Tough Day Simulation"}
      subtitle={gameData?.description || "Practice recovering mentally after a challenging classroom day"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentMoment}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showSummary && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Calm Level Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Your Calm Level</span>
                <span className={`text-lg font-bold ${calmLevel >= 60 ? 'text-green-600' :
                    calmLevel >= 40 ? 'text-yellow-600' :
                      'text-red-600'
                  }`}>
                  {Math.round(calmLevel)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  className={`h-4 rounded-full ${calmLevel >= 60 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      calmLevel >= 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gradient-to-r from-red-400 to-rose-500'
                    }`}
                  initial={{ width: `${calmLevel}%` }}
                  animate={{ width: `${calmLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold">Moment {currentMoment + 1} of {dayMoments.length}</span>
                <span className="font-semibold">{Math.round(((currentMoment + 1) / dayMoments.length) * 100)}% of Day</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentMoment + 1) / dayMoments.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Current Situation */}
            {currentMomentData && !selectedChoice && (
              <div className="mb-6">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-900">{currentMomentData.time}</span>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed">{currentMomentData.situation}</p>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">How do you respond?</h3>
                <div className="space-y-3">
                  {currentMomentData.choices.map((choice, index) => (
                    <motion.button
                      key={choice.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMomentChoice(choice.id)}
                      className="w-full p-4 rounded-xl border-2 border-gray-300 hover:border-indigo-400 bg-white hover:bg-indigo-50 text-left transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{choice.label}</span>
                        <span className={`text-sm font-semibold ${choice.calmChange >= -6 ? 'text-green-600' :
                            choice.calmChange >= -10 ? 'text-yellow-600' :
                              'text-red-600'
                          }`}>
                          {choice.calmChange > 0 ? '+' : ''}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Choice Feedback */}
            {selectedChoice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-6 border-2 mb-4 ${selectedChoice.calmChange >= -6
                    ? 'bg-green-50 border-green-300'
                    : selectedChoice.calmChange >= -10
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-red-50 border-red-300'
                  }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {selectedChoice.calmChange >= -6 ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{selectedChoice.label}</h4>
                    <p className="text-gray-700 mb-3">{selectedChoice.description}</p>
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-sm text-gray-800">{selectedChoice.feedback}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-600">Calm Level:</span>
                  <motion.span
                    key={calmLevel}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className={`font-bold ${calmLevel >= 60 ? 'text-green-600' :
                        calmLevel >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                      }`}
                  >
                    {selectedChoice.calmChange > 0 ? '+' : ''}{selectedChoice.calmChange} ({Math.round(calmLevel)}%)
                  </motion.span>
                </div>
              </motion.div>
            )}
          </div>
        )}



        {/* Summary */}
        {showSummary && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                {calmLevel >= 60 ? '✨' : calmLevel >= 40 ? '📊' : '💪'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Recovery Complete!</h2>
              <p className="text-xl text-gray-600">Your Day Summary</p>
            </div>

            {/* Final Score */}
            <div className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${score >= 4
                ? 'from-green-50 to-emerald-50 border-green-200'
                : score >= 3
                  ? 'from-yellow-50 to-orange-50 border-yellow-200'
                  : 'from-red-50 to-rose-50 border-red-200'
              }`}>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Final Score</h3>
                <div className={`text-5xl font-bold mb-2 ${score >= 4 ? 'text-green-600' :
                    score >= 3 ? 'text-yellow-600' :
                      'text-red-600'
                  }`}>
                  {score} / 5
                </div>
                <p className="text-gray-700">
                  {score >= 4
                    ? "Excellent! You made great choices in challenging situations."
                    : score >= 3
                      ? "Good job! You handled most situations well."
                      : "Keep practicing! Every challenging moment is a learning opportunity."}
                </p>
              </div>
            </div>

            {/* Resilience Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Resilience Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Small choices matter:</strong> Making calm, thoughtful responses in challenging moments builds resilience over time.</li>
                <li>• <strong>Prioritization helps:</strong> Taking a breath and focusing on what's most urgent reduces overwhelm.</li>
                <li>• <strong>Flexibility is strength:</strong> Adapting to unexpected challenges shows professional resilience.</li>
                <li>• <strong>Self-awareness pays off:</strong> Recognizing your stress levels helps you make better choices.</li>
                <li>• <strong>Every moment is practice:</strong> Each challenging situation is an opportunity to strengthen your resilience skills.</li>
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
                    Journal or debrief instead of carrying emotions home. At the end of a challenging day, take 5-10 minutes to debrief before leaving school. This could be:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Quick journal entry:</strong> Write down 3 things that were challenging, 2 things you learned, and 1 thing you're grateful for.</li>
                    <li><strong>Debrief with a colleague:</strong> Share the day's challenges and successes with a trusted colleague for 5-10 minutes.</li>
                    <li><strong>Mental closure ritual:</strong> Take a moment to acknowledge the day, breathe, and intentionally leave work stress at work.</li>
                    <li><strong>Reflection walk:</strong> Take a 5-minute walk around the school grounds, reflecting on the day before heading home.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    This practice helps you process emotions and experiences at school rather than carrying them home. When you intentionally debrief and recover at school, you create a boundary between work and home, protecting your personal time and relationships. This small daily practice significantly improves your ability to recover from tough days and maintain work-life balance.
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

export default ToughDaySimulation;