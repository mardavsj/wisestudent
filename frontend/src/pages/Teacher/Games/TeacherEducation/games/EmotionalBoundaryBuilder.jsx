import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Shield, Heart, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

const EmotionalBoundaryBuilder = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-23";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 6;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedPhrases, setSelectedPhrases] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Roleplay scenarios
  const scenarios = [
    {
      id: 1,
      type: "parent-venting",
      title: "Parent Venting",
      situation: "A parent comes to you after school, visibly upset and frustrated. They're venting about their child's struggles, their own stress, and blaming the school system. They're raising their voice and seem to be unloading a lot of emotional weight on you. You can see they're overwhelmed, but you're also feeling the weight of their emotions.",
      boundaryPhrases: [

        {
          id: 'unhealthy-1',
          phrase: "I'm so sorry you're going through this. Tell me everything.",
          isCorrect: false,
          outcome: {
            title: "You Absorbed Their Emotional Weight",
            description: "The parent continued venting for a long time, and you absorbed all their stress and frustration. You left the conversation feeling drained and overwhelmed. You took on their emotional burden.",
            feedback: "This phrase invites them to unload everything, which can lead to emotional absorption. While it shows care, it doesn't set boundaries. You can be caring while also protecting your emotional space."
          }
        },
        {
          id: 'unhealthy-2',
          phrase: "That's not really my problem. You should talk to the principal.",
          isCorrect: false,
          outcome: {
            title: "You Created Distance",
            description: "The parent felt dismissed and became more upset. They felt like you didn't care, and the relationship was damaged. You avoided the situation but didn't help.",
            feedback: "This phrase creates too much distance and dismisses their feelings. While boundaries are important, this approach is too harsh and doesn't show care. You can set boundaries while still being supportive."
          }
        },
        {
          id: 'unhealthy-3',
          phrase: "I completely understand because I've been through the same thing.",
          isCorrect: false,
          outcome: {
            title: "You Merged Your Experiences",
            description: "The conversation became about your own experiences, and boundaries blurred. You both got caught in an emotional spiral, and neither of you felt better. You lost your professional boundary.",
            feedback: "While sharing can be helpful, this phrase merges your experiences with theirs, which can blur boundaries. You can be empathetic without making it about you."
          }
        },
        {
          id: 'healthy-1',
          phrase: "I hear your concerns and will connect you with the right resources.",
          isCorrect: true,
          outcome: {
            title: "You Set Healthy Boundaries",
            description: "The parent felt heard and respected. You acknowledged their concerns while directing them to appropriate support channels. You maintained your emotional balance while still being helpful.",
            feedback: "This phrase acknowledges their feelings while directing them to appropriate resources. You're showing empathy ('I hear your concerns') while setting boundaries by connecting them with the right support. This keeps you from absorbing their emotional weight while still being helpful."
          }
        },
      ]
    },
    {
      id: 2,
      type: "crying-student",
      title: "Crying Student",
      situation: "A student comes to you during lunch break, crying and upset. They're sharing personal problems and seem overwhelmed. They're looking to you for comfort and support, and you can see they're carrying a lot of emotional weight. You want to help, but you also need to maintain your emotional balance.",
      boundaryPhrases: [

        {
          id: 'unhealthy-4',
          phrase: "Oh, you poor thing. I'm here for you, and I'll take care of everything.",
          isCorrect: false,
          outcome: {
            title: "You Took On Too Much Responsibility",
            description: "You absorbed their emotional burden and took on responsibility for solving their problems. You left feeling overwhelmed and responsible for their wellbeing. You lost your emotional balance.",
            feedback: "This phrase takes on too much responsibility and invites emotional absorption. While it shows care, it doesn't maintain boundaries. You can be supportive without taking on everything."
          }
        },
        {
          id: 'unhealthy-5',
          phrase: "You'll be fine. Just try to relax and not worry so much.",
          isCorrect: false,
          outcome: {
            title: "You Minimized Their Feelings",
            description: "The student felt dismissed and unheard. They didn't feel supported, and you missed an opportunity to help. You avoided the emotional weight but didn't provide real support.",
            feedback: "This phrase minimizes their feelings and creates distance. While you might think you're helping by telling them not to worry, this dismisses their experience. You can acknowledge their feelings while maintaining boundaries."
          }
        },
        {
          id: 'healthy-2',
          phrase: "I'm here to listen, and I can connect you with additional support.",
          isCorrect: true,
          outcome: {
            title: "You Provided Support Within Boundaries",
            description: "The student felt heard and cared for. You listened compassionately while also connecting them with additional resources. You maintained your emotional balance while being supportive.",
            feedback: "This phrase shows presence and willingness to help while maintaining boundaries. You're acknowledging their needs ('I'm here to listen') while directing them to appropriate support. This keeps you from absorbing their emotional burden while still being caring."
          }
        },
        {
          id: 'unhealthy-6',
          phrase: "I know exactly how you feel because I went through something similar.",
          isCorrect: false,
          outcome: {
            title: "You Merged Boundaries",
            description: "The conversation became about your experiences, and professional boundaries blurred. You both got caught in an emotional spiral, and you lost your ability to be a supportive guide.",
            feedback: "While sharing can be helpful, this phrase merges your experiences with theirs, which blurs professional boundaries. You can be empathetic without making it about you."
          }
        }
      ]
    },
    {
      id: 3,
      type: "colleague-stress",
      title: "Colleague Stress",
      situation: "A colleague comes to you during a break, visibly stressed and overwhelmed. They're venting about their workload, personal problems, and feeling unsupported. They're unloading a lot of emotional weight and seem to expect you to carry it with them. You want to be supportive, but you also need to protect your own emotional space.",
      boundaryPhrases: [

        {
          id: 'unhealthy-7',
          phrase: "I'm here for you. Tell me everything, and I'll help you through this.",
          isCorrect: false,
          outcome: {
            title: "You Absorbed Their Stress",
            description: "You absorbed all their stress and took on their emotional burden. You left feeling drained and overwhelmed. You took on responsibility for their wellbeing, which affected your own capacity.",
            feedback: "This phrase invites them to unload everything and takes on too much responsibility. While it shows care, it doesn't set boundaries. You can be supportive without absorbing all their emotional weight."
          }
        },
        {
          id: 'healthy-3',
          phrase: "I can offer brief support, but I also encourage you to reach out to employee assistance.",
          isCorrect: true,
          outcome: {
            title: "You Balanced Colleague Support with Professional Boundaries",
            description: "Your colleague felt supported and was directed to appropriate resources. You offered immediate support while maintaining your own emotional boundaries. Both of you were able to manage your responsibilities.",
            feedback: "This phrase balances colleague support with professional boundaries. You offer some help while directing them to specialized support. This maintains your relationship while protecting your emotional capacity."
          }
        },
        {
          id: 'unhealthy-8',
          phrase: "That sounds tough, but I really don't have time for this right now.",
          isCorrect: false,
          outcome: {
            title: "You Created Distance",
            description: "Your colleague felt dismissed and unsupported. They felt like you didn't care, and the relationship was damaged. You avoided the emotional weight but didn't help.",
            feedback: "This phrase creates too much distance and dismisses their feelings. While boundaries are important, this approach is too harsh. You can set boundaries while still being supportive."
          }
        },
        {
          id: 'unhealthy-9',
          phrase: "I completely understand because I'm going through the same thing.",
          isCorrect: false,
          outcome: {
            title: "You Merged Your Stress",
            description: "The conversation became about both of your problems, and you both got caught in a stress spiral. Neither of you felt better, and boundaries were lost. You both became more overwhelmed.",
            feedback: "While sharing can be helpful, this phrase merges your experiences, which can create a stress spiral. You can be empathetic without making it about you."
          }
        }
      ]
    },
    {
      id: 4,
      type: "parent-venting",
      title: "Parent Venting (Part 2)",
      situation: "A parent calls you after hours, upset about their child's grade. They're frustrated, raising their voice, and questioning your teaching methods. They're venting their frustration and seem to expect you to fix everything. You want to address their concerns, but you also need to maintain boundaries about when and how you engage.",
      boundaryPhrases: [
        {
          id: 'healthy-4',
          phrase: "I appreciate your concern. Let's schedule a proper meeting during school hours to discuss this.",
          isCorrect: true,
          outcome: {
            title: "You Set Appropriate Time Boundaries",
            description: "The parent felt their concerns were acknowledged and valued. By scheduling a formal meeting, you addressed their needs while maintaining appropriate work-life boundaries. You stayed respectful while protecting your personal time.",
            feedback: "This phrase acknowledges their concerns while setting time boundaries. You're showing respect for their concerns while maintaining your personal time. This is crucial for work-life balance and prevents emotional overload."
          }
        },
        {
          id: 'unhealthy-10',
          phrase: "I'm so sorry. I'll do whatever it takes to fix this right now.",
          isCorrect: false,
          outcome: {
            title: "You Took On Too Much",
            description: "You absorbed their frustration and took on full responsibility for fixing everything immediately. You worked beyond your capacity and felt overwhelmed. You lost your emotional balance.",
            feedback: "This phrase takes on too much responsibility and doesn't set boundaries. While it shows care, it invites you to absorb their frustration and work beyond your capacity. You can address concerns without taking on everything."
          }
        },
        {
          id: 'unhealthy-11',
          phrase: "I can't deal with this right now. Call me during school hours.",
          isCorrect: false,
          outcome: {
            title: "You Created Distance",
            description: "The parent felt dismissed and became more upset. They felt like you didn't care about their concerns, and the relationship was damaged. You avoided the situation but didn't help.",
            feedback: "While setting boundaries about time is important, this phrase is too harsh and dismissive. You can acknowledge their concerns while also setting appropriate time boundaries in a more caring way."
          }
        },
        {
          id: 'unhealthy-12',
          phrase: "I know exactly how frustrating this is because I've dealt with similar parents.",
          isCorrect: false,
          outcome: {
            title: "You Merged Experiences",
            description: "The conversation became about your past experiences, and boundaries blurred. You both got caught in frustration, and the situation didn't improve. You lost your professional focus.",
            feedback: "While sharing can be helpful, this phrase merges your experiences with theirs, which can blur professional boundaries. You can be empathetic without making it about you."
          }
        }
      ]
    },
    {
      id: 5,
      type: "crying-student",
      title: "Crying Student (Part 2)",
      situation: "A student approaches you after class, crying and sharing that they're being bullied. They're scared, overwhelmed, and looking to you for protection and support. They're carrying a lot of fear and emotional weight. You want to help and protect them, but you also need to maintain your emotional balance.",
      boundaryPhrases: [

        {
          id: 'unhealthy-13',
          phrase: "Oh, you poor thing. I'll make sure this never happens again, and I'll take care of everything.",
          isCorrect: false,
          outcome: {
            title: "You Took On Too Much Responsibility",
            description: "You absorbed their fear and took on full responsibility for their safety. You felt overwhelmed and responsible for preventing all future harm. You lost your emotional balance and felt the weight of their fear.",
            feedback: "This phrase takes on too much responsibility and invites emotional absorption. While it shows care and protection, it doesn't maintain boundaries. You can be protective and supportive without taking on everything."
          }
        },
        {
          id: 'unhealthy-14',
          phrase: "You'll be okay. Just ignore them and they'll stop.",
          isCorrect: false,
          outcome: {
            title: "You Minimized Their Experience",
            description: "The student felt dismissed and unprotected. They didn't feel like you took their concerns seriously, and you missed an opportunity to help. You avoided the emotional weight but didn't provide real support or protection.",
            feedback: "This phrase minimizes their experience and creates distance. While you might think you're helping by telling them to ignore it, this dismisses their fear and doesn't address the situation. You can acknowledge their feelings while taking appropriate action."
          }
        },
        {
          id: 'healthy-5',
          phrase: "Thank you for trusting me with this. I need to report this immediately to ensure your safety.",
          isCorrect: true,
          outcome: {
            title: "You Prioritized Student Safety",
            description: "The student felt heard and knew their safety was being prioritized. You took immediate action to address the bullying while offering emotional support. You maintained your emotional balance while fulfilling your duty of care.",
            feedback: "This phrase validates their trust while emphasizing immediate action for safety. In bullying situations, reporting is the priority. This ensures student welfare while providing emotional support."
          }
        },
        {
          id: 'unhealthy-15',
          phrase: "I know exactly how you feel because I was bullied too when I was your age.",
          isCorrect: false,
          outcome: {
            title: "You Merged Boundaries",
            description: "The conversation became about your past experiences, and professional boundaries blurred. You both got caught in fear and past trauma, and you lost your ability to be a protective guide in the present moment.",
            feedback: "While sharing can be helpful, this phrase merges your experiences with theirs, which blurs professional boundaries. You can be empathetic and protective without making it about your past experiences."
          }
        }
      ]
    },
    {
      id: 6,
      type: "colleague-stress",
      title: "Colleague Stress (Part 2)",
      situation: "A colleague comes to you during a planning period, visibly exhausted and overwhelmed. They're sharing personal problems, work stress, and feeling like they can't keep up. They're unloading a lot of emotional weight and seem to expect you to carry it with them. You want to be supportive, but you also need to protect your own capacity.",
      boundaryPhrases: [
        {
          id: 'healthy-6',
          phrase: "I recognize you're overwhelmed. Have you considered speaking with our wellness coordinator?",
          isCorrect: true,
          outcome: {
            title: "You Directed to Professional Support",
            description: "Your colleague felt heard and was directed to appropriate professional support. You acknowledged their struggle while guiding them toward specialized help. You maintained your own boundaries while showing care.",
            feedback: "This phrase recognizes their struggle while directing them to professional resources. You're showing empathy while ensuring they get specialized support. This protects your own capacity while promoting their wellbeing."
          }
        },
        {
          id: 'unhealthy-16',
          phrase: "I'm here for you. Tell me everything, and I'll help you through this no matter what.",
          isCorrect: false,
          outcome: {
            title: "You Absorbed Their Stress",
            description: "You absorbed all their stress and took on their emotional burden. You left feeling drained and overwhelmed. You took on responsibility for their wellbeing, which affected your own capacity and ability to help others.",
            feedback: "This phrase invites them to unload everything and takes on too much responsibility. While it shows care, it doesn't set boundaries. You can be supportive without absorbing all their emotional weight and taking on everything."
          }
        },
        {
          id: 'unhealthy-17',
          phrase: "That sounds tough, but I really need to focus on my own work right now.",
          isCorrect: false,
          outcome: {
            title: "You Created Distance",
            description: "Your colleague felt dismissed and unsupported. They felt like you didn't care, and the relationship was damaged. You avoided the emotional weight but didn't help or support them.",
            feedback: "While setting boundaries about time and capacity is important, this phrase is too harsh and dismissive. You can acknowledge their feelings while also setting appropriate boundaries in a more caring way."
          }
        },
        {
          id: 'unhealthy-18',
          phrase: "I completely understand because I'm going through the exact same thing right now.",
          isCorrect: false,
          outcome: {
            title: "You Merged Your Stress",
            description: "The conversation became about both of your problems, and you both got caught in a stress spiral. Neither of you felt better, and boundaries were lost. You both became more overwhelmed and less able to help each other.",
            feedback: "While sharing can be helpful, this phrase merges your experiences, which can create a stress spiral. You can be empathetic without making it about you. Maintaining boundaries allows you to be more helpful."
          }
        }
      ]
    }
  ];

  const handlePhraseSelect = (phraseId) => {
    if (selectedPhrases[currentScenario]) return; // Already answered

    const selectedPhrase = scenarios[currentScenario].boundaryPhrases.find(p => p.id === phraseId);
    const isCorrect = selectedPhrase.isCorrect;

    setSelectedPhrases(prev => ({
      ...prev,
      [currentScenario]: phraseId
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowOutcome(true);
  };

  const handleNext = () => {
    setShowOutcome(false);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = scenarios[currentScenario];
  const selected = selectedPhrases[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const selectedPhrase = selected ? current.boundaryPhrases.find(p => p.id === selected) : null;
  const isCorrect = selectedPhrase?.isCorrect || false;

  return (
    <TeacherGameShell
      title={gameData?.title || "Emotional Boundary Builder"}
      subtitle={gameData?.description || "Learn to maintain emotional balance while helping others"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario + 0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Scenario {currentScenario + 1} of {totalLevels}</span>
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

            {/* Scenario */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {current.title}
                </h2>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {current.situation}
                </p>
              </div>
            </div>

            {!showOutcome ? (
              /* Boundary Phrase Options */
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Choose a boundary phrase to respond:
                </h3>
                {current.boundaryPhrases.map((phrase) => {
                  const Icon = phrase.isCorrect ? Shield : Heart;
                  return (
                    <motion.button
                      key={phrase.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePhraseSelect(phrase.id)}
                      disabled={!!selected}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-gray-400 to-slate-400">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-lg">
                            "{phrase.phrase}"
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* Outcome and Feedback */
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
                      <h3 className={`text-2xl font-bold mb-3 ${isCorrect ? 'text-green-800' : 'text-orange-800'
                        }`}>
                        {selectedPhrase.outcome.title}
                      </h3>
                      <p className={`text-lg mb-4 ${isCorrect ? 'text-green-700' : 'text-orange-700'
                        }`}>
                        {selectedPhrase.outcome.description}
                      </p>
                      <div className={`bg-white rounded-lg p-4 border-l-4 ${isCorrect ? 'border-green-500' : 'border-orange-500'
                        }`}>
                        <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-orange-800'
                          }`}>
                          💡 Key Insight:
                        </p>
                        <p className={`${isCorrect ? 'text-green-700' : 'text-orange-700'
                          }`}>
                          {selectedPhrase.outcome.feedback}
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
                    {currentScenario < totalLevels - 1 ? 'Next Scenario' : 'Finish'}
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
              {score === totalLevels ? '🎉' : score >= totalLevels * 0.75 ? '✨' : score >= totalLevels * 0.5 ? '💪' : '🛡️'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {score} out of {totalLevels} correctly
            </p>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {score === totalLevels
                  ? "Perfect! You have a strong understanding of emotional boundaries. You know how to stay caring yet protected, which is essential for sustainable care and maintaining your emotional balance."
                  : score >= totalLevels * 0.75
                    ? "Excellent! You're developing strong boundary skills. Keep practicing phrases that show empathy while maintaining boundaries. Remember: you can be caring yet protected."
                    : score >= totalLevels * 0.5
                      ? "Good effort! Understanding emotional boundaries takes practice. Remember that you can be caring and supportive while also protecting your emotional space. Keep learning!"
                      : "Keep learning! Understanding emotional boundaries is important for sustainable care. Remember that you can be caring yet protected. Practice phrases that show empathy while maintaining boundaries."}
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
                    Different situations call for different boundary-setting phrases. Practice using phrases that acknowledge others' feelings while maintaining your emotional boundaries. Examples include: "I hear your concerns and will connect you with the right resources," "I'm here to listen, and I can connect you with additional support," and "I appreciate your concern. Let's schedule a proper meeting during school hours." The key is to show empathy while protecting your emotional space in various contexts.
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

export default EmotionalBoundaryBuilder;