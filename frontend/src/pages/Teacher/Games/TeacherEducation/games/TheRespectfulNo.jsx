import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { MessageCircle, Phone, Users, CheckCircle, TrendingUp, BookOpen, Ban, AlertCircle } from "lucide-react";

const TheRespectfulNo = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-61";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [showToneMeter, setShowToneMeter] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 Scenario cards for saying "no" respectfully
  const scenarios = [
    {
      id: 1,
      title: "Extra Duty Request",
      icon: Ban,
      situation: "Your principal asks you to take on an additional after-school duty. They say it's urgent and really need someone to step up. You're already stretched thin with your current responsibilities.",
      responses: [
        {
          id: 'over-accommodating',
          label: 'Say Yes Immediately',
          text: "Of course! I'll make it work somehow.",
          assertiveness: 20,
          kindness: 85,
          tone: "Over-Accommodating",
          feedback: "While kind, always saying yes can lead to overload. Setting boundaries protects your capacity and prevents burnout.",
          emoji: "😔",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        },
        {
          id: 'too-direct',
          label: 'Say No Abruptly',
          text: "No, I can't. I'm too busy.",
          assertiveness: 95,
          kindness: 30,
          tone: "Too Direct",
          feedback: "While clear, this response lacks kindness and empathy. A respectful 'no' can be both firm and warm.",
          emoji: "😤",
          color: "from-red-400 to-rose-500",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },

        {
          id: 'wishy-washy',
          label: 'Unclear Response',
          text: "I'm not sure... maybe? Let me think about it.",
          assertiveness: 40,
          kindness: 70,
          tone: "Unclear",
          feedback: "This creates uncertainty and doesn't set clear boundaries. A definitive response with kindness is more respectful to everyone.",
          emoji: "🤔",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I wish I could, but my current commitments are full. Could we explore other options?",
          assertiveness: 85,
          kindness: 90,
          tone: "Respectful & Assertive",
          feedback: "Perfect! This is a respectful 'no'—kind yet clear. You acknowledge the request, state your boundary, and offer alternatives. This maintains relationships while protecting your capacity.",
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
      ],
      correctResponse: 'respectful-no'
    },
    {
      id: 2,
      title: "Parent Call After Hours",
      icon: Phone,
      situation: "A parent calls you at 7 PM on a weekday evening to discuss their child's performance. They say it's urgent and hope you don't mind calling so late. You're having dinner with your family.",
      responses: [
        {
          id: 'over-accommodating',
          label: 'Take the Call',
          text: "No problem! Let me step away and talk now.",
          assertiveness: 15,
          kindness: 80,
          tone: "Over-Accommodating",
          feedback: "While helpful, allowing work to intrude on personal time prevents work-life balance. Setting boundaries protects your personal time.",
          emoji: "😔",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        },
        {
          id: 'too-direct',
          label: 'Refuse Abruptly',
          text: "I don't take calls after hours. Call during school hours.",
          assertiveness: 100,
          kindness: 25,
          tone: "Too Direct",
          feedback: "The boundary is clear, but the tone could be more empathetic. A respectful 'no' can acknowledge their concern while setting limits.",
          emoji: "😤",
          color: "from-red-400 to-rose-500",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I appreciate you reaching out, but I'm with my family right now. I'd be happy to schedule a call during school hours tomorrow. Would that work?",
          assertiveness: 90,
          kindness: 95,
          tone: "Respectful & Assertive",
          feedback: "Excellent! This is a respectful 'no'—you acknowledge their concern, state your boundary clearly, and offer a better alternative. This maintains relationships while protecting your personal time.",
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'wishy-washy',
          label: 'Unclear Response',
          text: "Well, it's not really a good time... but I guess we could talk for a minute?",
          assertiveness: 35,
          kindness: 75,
          tone: "Unclear",
          feedback: "This creates confusion about your boundaries. A clear 'no' with an alternative is kinder and more respectful.",
          emoji: "🤔",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctResponse: 'respectful-no'
    },
    {
      id: 3,
      title: "Colleague Request",
      icon: Users,
      situation: "A colleague asks you to swap your planning period with theirs this week so they can attend a personal appointment. They've done this several times before, and it's starting to feel like a pattern.",
      responses: [
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I wish I could help, but my current commitments are full this week. I need to protect my planning time. Perhaps we could find another solution?",
          assertiveness: 85,
          kindness: 88,
          tone: "Respectful & Assertive",
          feedback: "Perfect! This is a respectful 'no'—you acknowledge the request, state your boundary clearly, and offer to explore alternatives. This maintains the relationship while protecting your time.",
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'over-accommodating',
          label: 'Agree Immediately',
          text: "Sure, no problem! I can always make it work.",
          assertiveness: 20,
          kindness: 85,
          tone: "Over-Accommodating",
          feedback: "While generous, always accommodating others' requests can lead to resentment. It's okay to say no when you need your own time.",
          emoji: "😔",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        },
        {
          id: 'too-direct',
          label: 'Refuse Harshly',
          text: "No, I can't keep doing this. You need to handle your own schedule.",
          assertiveness: 95,
          kindness: 35,
          tone: "Too Direct",
          feedback: "While your boundary is important, the tone could be more collaborative. A respectful 'no' acknowledges the relationship while being clear.",
          emoji: "😤",
          color: "from-red-400 to-rose-500",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },

        {
          id: 'wishy-washy',
          label: 'Unclear Response',
          text: "I'm not sure... maybe? Let me check my schedule and see.",
          assertiveness: 40,
          kindness: 70,
          tone: "Unclear",
          feedback: "This creates uncertainty and doesn't set clear boundaries. A definitive, kind response is more helpful for both of you.",
          emoji: "🤔",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctResponse: 'respectful-no'
    },
    {
      id: 4,
      title: "Additional Committee Role",
      icon: Ban,
      situation: "An administrator asks you to join another committee. They emphasize how valuable your input would be and that they really need someone with your expertise. You're already on two committees.",
      responses: [
        {
          id: 'over-accommodating',
          label: 'Say Yes',
          text: "Absolutely! I'd love to help. I'll find a way to make it work.",
          assertiveness: 10,
          kindness: 90,
          tone: "Over-Accommodating",
          feedback: "While enthusiastic, taking on too much can lead to burnout. It's important to honestly assess your capacity before committing.",
          emoji: "😔",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        },
        {
          id: 'too-direct',
          label: 'Refuse Firmly',
          text: "No, I can't. I'm already doing too much as it is.",
          assertiveness: 90,
          kindness: 40,
          tone: "Too Direct",
          feedback: "The boundary is clear, but the tone could be more collaborative. A respectful 'no' acknowledges their request while being clear about your capacity.",
          emoji: "😤",
          color: "from-red-400 to-rose-500",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I appreciate the opportunity, but my current commitments are full. I'm at capacity with my existing responsibilities. Perhaps we could discuss this next semester?",
          assertiveness: 88,
          kindness: 92,
          tone: "Respectful & Assertive",
          feedback: "Excellent! This is a respectful 'no'—you acknowledge their request positively, state your boundary clearly, and leave room for future possibilities. This maintains relationships while protecting your capacity.",
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'wishy-washy',
          label: 'Unclear Response',
          text: "I'm not sure... maybe I could? But I'm pretty busy...",
          assertiveness: 35,
          kindness: 75,
          tone: "Unclear",
          feedback: "This creates uncertainty and doesn't protect your boundaries effectively. A clear, kind response is more respectful to everyone.",
          emoji: "🤔",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctResponse: 'respectful-no'
    },
    {
      id: 5,
      title: "Last-Minute Event Help",
      icon: MessageCircle,
      situation: "A colleague texts you on Friday afternoon asking if you can help set up for an event on Saturday morning. They say they're desperate and would really appreciate your help. You had planned to rest this weekend.",
      responses: [
        {
          id: 'over-accommodating',
          label: 'Agree to Help',
          text: "Of course! I'll be there. No worries at all.",
          assertiveness: 15,
          kindness: 85,
          tone: "Over-Accommodating",
          feedback: "While helpful, always saying yes can prevent you from getting needed rest. It's okay to protect your personal time.",
          emoji: "😔",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        },
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I wish I could help, but I've committed to resting this weekend. I hope you're able to find support elsewhere.",
          assertiveness: 85,
          kindness: 90,
          tone: "Respectful & Assertive",
          feedback: "Perfect! This is a respectful 'no'—you acknowledge their need, state your boundary clearly, and wish them well. This maintains relationships while protecting your rest time.",
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'too-direct',
          label: 'Refuse Abruptly',
          text: "No, I'm not available. You should have planned better.",
          assertiveness: 100,
          kindness: 20,
          tone: "Too Direct",
          feedback: "While your boundary is important, the tone is harsh. A respectful 'no' can be clear without being judgmental.",
          emoji: "😤",
          color: "from-red-400 to-rose-500",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },

        {
          id: 'wishy-washy',
          label: 'Unclear Response',
          text: "I don't know... maybe? But I was planning to rest...",
          assertiveness: 30,
          kindness: 80,
          tone: "Unclear",
          feedback: "This creates confusion about your availability. A clear 'no' with kindness is more helpful and respectful.",
          emoji: "🤔",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctResponse: 'respectful-no'
    }
  ];

  const handleResponseSelect = (responseId) => {
    if (selectedResponse[currentScenario]) return; // Already answered

    const response = scenarios[currentScenario].responses.find(r => r.id === responseId);
    const isCorrect = responseId === scenarios[currentScenario].correctResponse;

    setSelectedResponse(prev => ({
      ...prev,
      [currentScenario]: {
        responseId,
        response,
        isCorrect
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowToneMeter(true);
  };

  const handleViewFeedback = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowToneMeter(false);
    setShowFeedback(false);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = scenarios[currentScenario];
  const selected = selectedResponse[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const ScenarioIcon = current.icon;

  return (
    <TeacherGameShell
      title={gameData?.title || "The Respectful 'No'"}
      subtitle={gameData?.description || "Practice saying 'no' with kindness and clarity"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Scenario {currentScenario + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
              />
            </div>
          </div>

          {!showToneMeter && !showFeedback && (
            <>
              {/* Scenario Card */}
              <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                    <ScenarioIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {current.title}
                  </h2>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {current.situation}
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-6">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  How do you respond?
                </p>
                <p className="text-sm text-gray-600">
                  Choose your response to practice saying "no" respectfully
                </p>
              </div>

              {/* Response Options */}
              <div className="space-y-4 mb-6">
                {current.responses.map((response, index) => {
                  const isSelected = selected && selected.responseId === response.id;

                  return (
                    <motion.button
                      key={response.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleResponseSelect(response.id)}
                      disabled={!!selected}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all ${isSelected
                          ? response.id === 'respectful-no'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                            : 'bg-gray-50 border-gray-300 opacity-60'
                          : 'bg-white border-gray-300 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-yellow-400 to-orange-500`}>
                          <span className="text-white font-bold">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">
                            {response.label}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            "{response.text}"
                          </p>
                        </div>
                        {isSelected && response.id === 'respectful-no' && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {/* Tone Meter */}
          {showToneMeter && !showFeedback && selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Tone Meter</h3>
                <p className="text-gray-600">Your response's assertiveness and kindness levels</p>
              </div>

              {/* Tone Meter Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Assertiveness Meter */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-lg text-gray-800 mb-4 text-center">Assertiveness</h4>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Low</span>
                      <span className="font-bold">{selected.response.assertiveness}%</span>
                      <span>High</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.response.assertiveness}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-6 rounded-full ${selected.response.assertiveness >= 80
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                            : selected.response.assertiveness >= 50
                              ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                              : 'bg-gradient-to-r from-gray-400 to-slate-500'
                          } shadow-md`}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-700">
                    {selected.response.assertiveness >= 80
                      ? "Strong boundary-setting ✓"
                      : selected.response.assertiveness >= 50
                        ? "Moderate assertiveness"
                        : "Could be more assertive"}
                  </p>
                </div>

                {/* Kindness Meter */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                  <h4 className="font-bold text-lg text-gray-800 mb-4 text-center">Kindness</h4>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Low</span>
                      <span className="font-bold">{selected.response.kindness}%</span>
                      <span>High</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.response.kindness}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-6 rounded-full ${selected.response.kindness >= 85
                            ? 'bg-gradient-to-r from-pink-400 to-rose-500'
                            : selected.response.kindness >= 50
                              ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                              : 'bg-gradient-to-r from-gray-400 to-slate-500'
                          } shadow-md`}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-700">
                    {selected.response.kindness >= 85
                      ? "Warm and empathetic ✓"
                      : selected.response.kindness >= 50
                        ? "Moderately kind"
                        : "Could be kinder"}
                  </p>
                </div>
              </div>

              {/* Overall Tone */}
              <div className={`bg-gradient-to-br ${selected.response.bgColor} rounded-xl p-6 border-2 ${selected.response.borderColor} mb-6`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">{selected.response.emoji}</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{selected.response.tone}</h4>
                  <p className="text-gray-700">Assertiveness: {selected.response.assertiveness}% | Kindness: {selected.response.kindness}%</p>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewFeedback}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  View Feedback on Assertiveness
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Feedback */}
          {showFeedback && selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className={`bg-gradient-to-br ${selected.response.bgColor} rounded-xl p-6 border-2 ${selected.response.borderColor} mb-6`}>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{selected.response.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selected.response.tone}
                  </h3>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {selected.response.feedback}
                  </p>
                </div>
              </div>

              {/* Assertiveness Insight */}
              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200 mb-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">
                      💡 Assertiveness Insight:
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      <strong>Respectful "No" = Assertiveness + Kindness</strong>
                    </p>
                    <ul className="text-sm text-blue-800 mt-2 ml-4 space-y-1 list-disc">
                      <li><strong>High Assertiveness (80%+):</strong> Clear boundary-setting protects your capacity and prevents overload.</li>
                      <li><strong>High Kindness (85%+):</strong> Empathetic tone maintains relationships and shows respect for others' needs.</li>
                      <li><strong>Balanced Approach:</strong> The best "no" combines both—firm boundaries with warm delivery.</li>
                      <li><strong>Practice Phrase:</strong> "I wish I could, but my current commitments are full." This phrase balances assertiveness and kindness.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentScenario < totalLevels - 1 ? 'Next Scenario' : 'View Summary'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Game Over Summary */}
        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                {score === totalLevels ? '✨💪' : score >= totalLevels / 2 ? '📊👍' : '🌱📚'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Practice Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've practiced saying "no" respectfully {score} out of {totalLevels} times
              </p>
            </div>

            {/* Score Summary */}
            <div className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${score === totalLevels
                ? 'from-green-50 to-emerald-50 border-green-200'
                : score >= totalLevels / 2
                  ? 'from-blue-50 to-indigo-50 border-blue-200'
                  : 'from-yellow-50 to-orange-50 border-yellow-200'
              }`}>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Assertiveness Score</h3>
                <div className={`text-5xl font-bold mb-2 ${score === totalLevels ? 'text-green-600' :
                    score >= totalLevels / 2 ? 'text-blue-600' :
                      'text-yellow-600'
                  }`}>
                  {Math.round((score / totalLevels) * 100)}%
                </div>
                <p className="text-gray-700">
                  {score === totalLevels
                    ? "Excellent! You consistently chose respectful 'no' responses. You're building strong boundary-setting skills."
                    : score >= totalLevels / 2
                      ? "Good progress! You're learning to balance assertiveness and kindness. Keep practicing."
                      : "Keep practicing! Each scenario helps you understand respectful 'no' responses better."}
                </p>
              </div>
            </div>

            {/* Assertiveness Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Respectful "No" Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Assertiveness protects capacity:</strong> Clear boundaries prevent overload and protect your time and energy.</li>
                <li>• <strong>Kindness maintains relationships:</strong> Warm, empathetic delivery maintains relationships even when saying no.</li>
                <li>• <strong>Balance is key:</strong> The most effective "no" combines firm boundaries (high assertiveness) with warm delivery (high kindness).</li>
                <li>• <strong>Practice makes it natural:</strong> Regular practice of respectful "no" responses makes them more automatic when needed.</li>
                <li>• <strong>Offering alternatives shows care:</strong> When possible, offering alternatives or future possibilities shows you care while maintaining boundaries.</li>
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
                    Use the phrase: "I wish I could, but my current commitments are full." This phrase balances assertiveness and kindness:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>"I wish I could":</strong> Acknowledges the request positively and shows you understand their need. This is the kindness part.</li>
                    <li><strong>"but my current commitments are full":</strong> States your boundary clearly without over-explaining or apologizing. This is the assertiveness part.</li>
                    <li><strong>Optional addition:</strong> You can follow with "Could we explore other options?" or "Perhaps we could discuss this later?" to offer alternatives.</li>
                    <li><strong>Practice variations:</strong> "I appreciate the opportunity, but my plate is full right now" or "I'd love to help, but I'm at capacity" work similarly.</li>
                    <li><strong>Keep it brief:</strong> The most effective "no" is clear and concise. Over-explaining can weaken the boundary.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you use phrases like "I wish I could, but my current commitments are full," you're practicing respectful boundary-setting. This phrase protects your capacity while maintaining relationships, and it becomes more natural with practice. Having this phrase ready makes it easier to say no when you need to, reducing the mental effort in difficult moments.
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

export default TheRespectfulNo;