import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle, Users, MessageCircle, BookOpen, ArrowUp } from "lucide-react";

const AssertivenessLadder = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-65";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [showLadderPosition, setShowLadderPosition] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Assertiveness ladder with 7 rungs
  const assertivenessLevels = [
    {
      id: 'hostile',
      label: 'Hostile',
      level: 7,
      description: 'Aggressive, attacking, disrespectful',
      color: 'from-red-700 to-red-900',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-600',
      emoji: '😡',
      characteristics: 'Attacking, threatening, insulting, aggressive'
    },
    {
      id: 'aggressive',
      label: 'Aggressive',
      level: 6,
      description: 'Forceful, dominating, confrontational',
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      emoji: '😤',
      characteristics: 'Dominating, forceful, dismissive, controlling'
    },
    {
      id: 'confident',
      label: 'Confident',
      level: 5,
      description: 'Clear, direct, sometimes too firm',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-400',
      emoji: '💪',
      characteristics: 'Clear, direct, sometimes lacks empathy'
    },
    {
      id: 'assertive-empathy',
      label: 'Assertive Empathy',
      level: 4,
      description: 'Firm but caring, ideal balance',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      emoji: '✨',
      characteristics: 'Firm boundaries with warm delivery, respectful, clear'
    },
    {
      id: 'submissive',
      label: 'Submissive',
      level: 3,
      description: 'Gives in, avoids conflict, lacks confidence',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      emoji: '😔',
      characteristics: 'Avoids conflict, gives in easily, lacks confidence'
    },
    {
      id: 'passive-aggressive',
      label: 'Passive-Aggressive',
      level: 2,
      description: 'Indirect, sarcastic, resentful',
      color: 'from-gray-500 to-slate-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-400',
      emoji: '😐',
      characteristics: 'Indirect, sarcastic, resentful, manipulative'
    },
    {
      id: 'passive',
      label: 'Passive',
      level: 1,
      description: 'Weak, doesn\'t stand up, gives up easily',
      color: 'from-gray-400 to-slate-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      emoji: '😞',
      characteristics: 'Weak boundaries, gives up easily, doesn\'t advocate'
    }
  ];

  // Conflict scenarios with response options
  const scenarios = [
    {
      id: 1,
      title: "Extra Work Request",
      situation: "Your principal asks you to take on additional responsibilities that you're already struggling with. They say it's urgent and really need someone to step up. You're already stretched thin.",
      responses: [
        {
          id: 'passive',
          text: "Okay, sure. I'll find a way to make it work somehow.",
          assertivenessLevel: 'passive',
          feedback: "This is a passive response. You're giving in without considering your capacity. While accommodating, this doesn't protect your boundaries and can lead to overload."
        },
        {
          id: 'passive-aggressive',
          text: "Fine. I guess I'll just have to work even more hours then.",
          assertivenessLevel: 'passive-aggressive',
          feedback: "This is a passive-aggressive response. There's resentment in your tone, but you're not directly stating your boundary. This creates tension without resolving the issue."
        },
        {
          id: 'submissive',
          text: "I'm not sure if I can, but I'll try my best.",
          assertivenessLevel: 'submissive',
          feedback: "This is a submissive response. You're uncertain and not confident in your boundary. This doesn't protect your capacity effectively and creates confusion."
        },

        {
          id: 'confident',
          text: "I'm at capacity right now. I can't take on additional work.",
          assertivenessLevel: 'confident',
          feedback: "This is a confident response. You're clear and direct, but it could be more empathetic. While effective, adding warmth helps maintain relationships better."
        },
        {
          id: 'aggressive',
          text: "No, I can't! I'm already doing too much! You need to find someone else!",
          assertivenessLevel: 'aggressive',
          feedback: "This is an aggressive response. While clear, the forceful tone may damage relationships. A firm but kind approach is more effective for maintaining professional relationships."
        },
        {
          id: 'hostile',
          text: "Are you serious? I'm already drowning in work! This is ridiculous!",
          assertivenessLevel: 'hostile',
          feedback: "This is a hostile response. The attacking tone damages relationships and creates conflict. Even when feeling overwhelmed, assertive empathy maintains professionalism and respect."
        },
        {
          id: 'assertive-empathy',
          text: "I appreciate the opportunity, but my current commitments are full. I want to maintain quality in what I'm already doing. Could we explore other options?",
          assertivenessLevel: 'assertive-empathy',
          feedback: "Perfect! This is assertive empathy—firm but caring. You acknowledge their request positively, state your boundary clearly, and offer alternatives. This maintains relationships while protecting your capacity."
        },
      ],
      correctResponse: 'assertive-empathy'
    },
    {
      id: 2,
      title: "Parent Complaint",
      situation: "A parent is upset about a grade and is questioning your judgment in front of other parents. They're becoming increasingly frustrated and raising their voice.",
      responses: [
        {
          id: 'passive',
          text: "I'm sorry. Maybe I made a mistake. I can change the grade.",
          assertivenessLevel: 'passive',
          feedback: "This is a passive response. You're giving in to pressure without standing up for your professional judgment. This undermines your authority and sets problematic expectations."
        },
        {
          id: 'passive-aggressive',
          text: "Well, if you think that's what's best, I guess I can adjust it.",
          assertivenessLevel: 'passive-aggressive',
          feedback: "This is a passive-aggressive response. There's resentment but no direct communication. This creates tension without addressing the real issue constructively."
        },
        {
          id: 'submissive',
          text: "I understand. Let me see what I can do about it.",
          assertivenessLevel: 'submissive',
          feedback: "This is a submissive response. You're avoiding conflict but not advocating for your professional judgment. This doesn't build trust or resolve the concern effectively."
        },
        {
          id: 'assertive-empathy',
          text: "I understand you're concerned about the grade. I'd be happy to discuss the specific areas where your child can improve. Can we schedule a private meeting to address this together?",
          assertivenessLevel: 'assertive-empathy',
          feedback: "Excellent! This is assertive empathy—firm but caring. You acknowledge their concern, maintain your professional boundary, and offer constructive dialogue. This builds trust while maintaining respect."
        },
        {
          id: 'confident',
          text: "The grade is fair based on your child's performance. I can explain the criteria if you'd like.",
          assertivenessLevel: 'confident',
          feedback: "This is a confident response. You're clear and professional, but adding empathy for their concern would strengthen the relationship while maintaining your boundary."
        },
        {
          id: 'aggressive',
          text: "I've been teaching for years. I know what I'm doing. The grade stands!",
          assertivenessLevel: 'aggressive',
          feedback: "This is an aggressive response. While defending your position, the forceful tone can damage relationships. A firm but empathetic approach maintains professionalism better."
        },
        {
          id: 'hostile',
          text: "You have no right to question my judgment! The grade is what it is!",
          assertivenessLevel: 'hostile',
          feedback: "This is a hostile response. The attacking tone damages relationships and creates conflict. Even when feeling defensive, assertive empathy maintains respect and professionalism."
        }
      ],
      correctResponse: 'assertive-empathy'
    },
    {
      id: 3,
      title: "Colleague Disagreement",
      situation: "A colleague criticizes your teaching approach during a team meeting. Their tone is dismissive and their comments feel personal. Other team members are listening.",
      responses: [
        {
          id: 'passive',
          text: "You're probably right. I should try it your way.",
          assertivenessLevel: 'passive',
          feedback: "This is a passive response. You're giving in without engaging with the feedback. This doesn't build collaboration or address the concern constructively."
        },
        {
          id: 'passive-aggressive',
          text: "Well, I guess we all have different opinions about what works.",
          assertivenessLevel: 'passive-aggressive',
          feedback: "This is a passive-aggressive response. There's indirect conflict but no direct engagement. This creates tension without resolving differences."
        },
        {
          id: 'submissive',
          text: "I see what you mean. Maybe I should reconsider my approach.",
          assertivenessLevel: 'submissive',
          feedback: "This is a submissive response. You're avoiding conflict but not advocating for your perspective. This doesn't contribute to productive collaboration."
        },

        {
          id: 'confident',
          text: "I understand your concern, but my approach has been effective. Let's agree to disagree.",
          assertivenessLevel: 'confident',
          feedback: "This is a confident response. You're clear about your position, but more engagement and empathy would strengthen collaboration and understanding."
        },
        {
          id: 'aggressive',
          text: "That's not true! You don't know what you're talking about! My approach works!",
          assertivenessLevel: 'aggressive',
          feedback: "This is an aggressive response. While defending your position, the forceful tone damages team relationships. A firm but empathetic approach builds collaboration better."
        },
        {
          id: 'assertive-empathy',
          text: "I appreciate your perspective. I'd like to understand your concerns better. Can we discuss the specific areas where you see challenges? ",
          assertivenessLevel: 'assertive-empathy',
          feedback: "Perfect! This is assertive empathy—firm but caring. You acknowledge their perspective, maintain your position, and invite collaboration. This builds understanding while preserving relationships."
        },
        {
          id: 'hostile',
          text: "You have no idea what you're talking about! Stop criticizing my work!",
          assertivenessLevel: 'hostile',
          feedback: "This is a hostile response. The attacking tone damages team relationships and creates division. Even when feeling criticized, assertive empathy maintains professionalism and collaboration."
        }
      ],
      correctResponse: 'assertive-empathy'
    },
    {
      id: 4,
      title: "Student Misbehavior",
      situation: "A student is being disrespectful and disruptive in class. You've addressed it privately, but their behavior continues and is affecting other students' learning.",
      responses: [
        {
          id: 'assertive-empathy',
          text: "Your behavior is disrupting the class. I know you can do better. Let's work together to make this right. What do you need to be successful?",
          assertivenessLevel: 'assertive-empathy',
          feedback: "Excellent! This is assertive empathy—firm but caring. You state the boundary clearly, express belief in the student, and offer collaboration. This maintains authority while showing care."
        },
        {
          id: 'passive',
          text: "Please try to be better. I know you can do it.",
          assertivenessLevel: 'passive',
          feedback: "This is a passive response. The weak boundary doesn't effectively address the behavior. Students need clear, firm boundaries to feel safe and learn effectively."
        },
        {
          id: 'passive-aggressive',
          text: "I guess some students just don't care about learning.",
          assertivenessLevel: 'passive-aggressive',
          feedback: "This is a passive-aggressive response. The indirect comment doesn't address the behavior directly and may create resentment without resolving the issue."
        },
        {
          id: 'submissive',
          text: "I'm not sure what to do. Maybe we can work something out?",
          assertivenessLevel: 'submissive',
          feedback: "This is a submissive response. The uncertainty doesn't communicate authority or boundaries effectively. Students need clear, confident guidance."
        },

        {
          id: 'confident',
          text: "Your behavior is unacceptable. You need to stop disrupting the class immediately.",
          assertivenessLevel: 'confident',
          feedback: "This is a confident response. You're clear and direct, but adding empathy and support would strengthen the relationship and help the student improve."
        },
        {
          id: 'aggressive',
          text: "Stop it right now! I've had enough of your disruption! You're going to the office!",
          assertivenessLevel: 'aggressive',
          feedback: "This is an aggressive response. While addressing the behavior, the forceful tone may damage the relationship. A firm but empathetic approach maintains authority while preserving connection."
        },
        {
          id: 'hostile',
          text: "That's it! Get out of my class! You're being impossible!",
          assertivenessLevel: 'hostile',
          feedback: "This is a hostile response. The attacking tone damages relationships and may escalate behavior. Even when frustrated, assertive empathy maintains authority while showing care."
        }
      ],
      correctResponse: 'assertive-empathy'
    },
    {
      id: 5,
      title: "Boundary Setting",
      situation: "A colleague keeps asking you to cover their classes during your planning period. They've done this several times, and it's becoming a pattern. You need your planning time.",
      responses: [
        {
          id: 'passive',
          text: "Okay, I can cover it. No problem.",
          assertivenessLevel: 'passive',
          feedback: "This is a passive response. You're giving in without protecting your boundary. Planning time is essential for teaching quality, and consistently giving it away leads to overload."
        },
        {
          id: 'passive-aggressive',
          text: "I guess I can do it again, since you keep asking.",
          assertivenessLevel: 'passive-aggressive',
          feedback: "This is a passive-aggressive response. There's resentment but no direct communication about your boundary. This creates tension without resolving the pattern."
        },
        {
          id: 'submissive',
          text: "I'm not sure... maybe I can? Let me think about it.",
          assertivenessLevel: 'submissive',
          feedback: "This is a submissive response. The uncertainty doesn't protect your boundary effectively. Clear communication is kinder to both of you."
        },
        {
          id: 'assertive-empathy',
          text: "I understand you need coverage, but I need to protect my planning time. I can help occasionally, but I can't make it a regular thing. Perhaps we can explore other solutions?",
          assertivenessLevel: 'assertive-empathy',
          feedback: "Perfect! This is assertive empathy—firm but caring. You acknowledge their need, state your boundary clearly, and offer occasional help with alternatives. This maintains relationships while protecting your time."
        },
        {
          id: 'confident',
          text: "I need my planning time. I can't cover your class.",
          assertivenessLevel: 'confident',
          feedback: "This is a confident response. You're clear about your boundary, but adding empathy and occasional flexibility would strengthen the relationship while maintaining your limit."
        },
        {
          id: 'aggressive',
          text: "No! I'm tired of covering for you! You need to handle your own schedule!",
          assertivenessLevel: 'aggressive',
          feedback: "This is an aggressive response. While setting a boundary, the forceful tone may damage relationships. A firm but empathetic approach maintains connection while protecting your time."
        },
        {
          id: 'hostile',
          text: "Are you kidding me? Again? You're taking advantage of me! Stop asking!",
          assertivenessLevel: 'hostile',
          feedback: "This is a hostile response. The attacking tone damages relationships and creates conflict. Even when frustrated, assertive empathy maintains professionalism while protecting boundaries."
        }
      ],
      correctResponse: 'assertive-empathy'
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

    setShowLadderPosition(true);
  };

  const handleViewFeedback = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowLadderPosition(false);
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
  const selectedLevel = selected ? assertivenessLevels.find(l => l.id === selected.response.assertivenessLevel) : null;
  const ScenarioIcon = current.title.includes('Student') ? Users : current.title.includes('Parent') ? MessageCircle : Users;

  return (
    <TeacherGameShell
      title={gameData?.title || "Assertiveness Ladder"}
      subtitle={gameData?.description || "Identify where you stand between passive and aggressive responses"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario + 1}
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

          {!showLadderPosition && !showFeedback && (
            <>
              {/* Scenario Card */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
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
                  How would you respond?
                </p>
                <p className="text-sm text-gray-600">
                  Choose your response to see where you land on the assertiveness ladder
                </p>
              </div>

              {/* Response Options */}
              <div className="space-y-3 mb-6">
                {current.responses.map((response, index) => {
                  const isSelected = selected && selected.responseId === response.id;

                  return (
                    <motion.button
                      key={response.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleResponseSelect(response.id)}
                      disabled={!!selected}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${isSelected
                          ? response.id === 'assertive-empathy'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                            : 'bg-gray-50 border-gray-300 opacity-60'
                          : 'bg-white border-gray-300 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold bg-gradient-to-r from-pink-400 to-rose-500`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">
                            "{response.text}"
                          </p>
                        </div>
                        {isSelected && response.id === 'assertive-empathy' && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {/* Ladder Position */}
          {showLadderPosition && !showFeedback && selected && selectedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Position on the Assertiveness Ladder</h3>
                <p className="text-gray-600">You landed on rung {selectedLevel.level} of 7</p>
              </div>

              {/* Visual Ladder */}
              <div className="bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl p-8 mb-6 border-2 border-gray-300">
                <div className="relative">
                  {/* Ladder Rungs */}
                  {assertivenessLevels.map((level, index) => {
                    const isSelectedLevel = level.id === selectedLevel.id;
                    const isAssertiveEmpathy = level.id === 'assertive-empathy';
                    const rungPosition = ((7 - index) / 7) * 100;

                    return (
                      <motion.div
                        key={level.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative mb-2 ${isSelectedLevel
                            ? 'transform scale-105 z-10'
                            : isAssertiveEmpathy
                              ? 'transform scale-102 z-5'
                              : ''
                          }`}
                      >
                        <div className={`h-12 rounded-lg border-2 flex items-center justify-between px-4 transition-all ${isSelectedLevel
                            ? `bg-gradient-to-r ${level.color} ${level.borderColor} shadow-lg border-4`
                            : isAssertiveEmpathy
                              ? `${level.bgColor} ${level.borderColor} border-2 shadow-md`
                              : level.id === 'hostile' || level.id === 'aggressive'
                                ? `${level.bgColor} ${level.borderColor} border opacity-70`
                                : level.id === 'passive' || level.id === 'passive-aggressive' || level.id === 'submissive'
                                  ? `${level.bgColor} ${level.borderColor} border opacity-70`
                                  : `${level.bgColor} ${level.borderColor} border opacity-70`
                          }`}>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{level.emoji}</span>
                            <div>
                              <span className="font-bold text-gray-800">Rung {level.level}: {level.label}</span>
                              <p className="text-xs text-gray-600">{level.description}</p>
                            </div>
                          </div>
                          {isSelectedLevel && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-white rounded-full p-2 shadow-lg"
                            >
                              <ArrowUp className="w-5 h-5 text-indigo-600" />
                            </motion.div>
                          )}
                          {isAssertiveEmpathy && !isSelectedLevel && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                              Ideal
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Level Info */}
              <div className={`bg-gradient-to-br ${selectedLevel.bgColor} rounded-xl p-6 border-2 ${selectedLevel.borderColor} mb-6`}>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{selectedLevel.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Rung {selectedLevel.level}: {selectedLevel.label}
                  </h3>
                  <p className="text-gray-700">{selectedLevel.description}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    <strong>Characteristics:</strong> {selectedLevel.characteristics}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewFeedback}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  View Feedback
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Feedback */}
          {showFeedback && selected && selectedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className={`bg-gradient-to-br ${selectedLevel.bgColor} rounded-xl p-6 border-2 ${selectedLevel.borderColor} mb-6`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Response Analysis</h3>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {selected.response.feedback}
                  </p>
                </div>
              </div>

              {/* Assertive Empathy Insight */}
              {selected.response.id === 'assertive-empathy' && (
                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-green-900 mb-2">
                        ✨ Assertive Empathy Characteristics:
                      </p>
                      <ul className="text-sm text-green-800 space-y-1 list-disc ml-4">
                        <li><strong>Firm boundaries:</strong> Clear limits that protect your capacity, time, and values.</li>
                        <li><strong>Warm delivery:</strong> Kind, empathetic tone that maintains relationships.</li>
                        <li><strong>Respectful:</strong> Treats others with dignity while advocating for yourself.</li>
                        <li><strong>Clear communication:</strong> Direct without being aggressive, honest without being hurtful.</li>
                        <li><strong>Collaborative:</strong> Offers alternatives and solutions when possible.</li>
                        <li><strong>Balanced:</strong> Neither too passive (giving in) nor too aggressive (attacking).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Ladder Navigation Tips */}
              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Moving Toward Assertive Empathy
                </h3>
                {selected.response.id !== 'assertive-empathy' && (
                  <div className="space-y-2 text-blue-800">
                    {selected.response.id === 'passive' || selected.response.id === 'submissive' && (
                      <p>• <strong>From Passive/Submissive:</strong> Practice stating boundaries clearly. Remember that setting limits is not selfish—it protects your capacity to serve others well.</p>
                    )}
                    {selected.response.id === 'passive-aggressive' && (
                      <p>• <strong>From Passive-Aggressive:</strong> Express concerns directly and respectfully. Clear communication prevents resentment and builds healthier relationships.</p>
                    )}
                    {(selected.response.id === 'aggressive' || selected.response.id === 'hostile') && (
                      <p>• <strong>From Aggressive/Hostile:</strong> Add empathy and warmth to your firm boundaries. You can be clear and direct while still being kind and respectful.</p>
                    )}
                    {selected.response.id === 'confident' && (
                      <p>• <strong>From Confident:</strong> Add empathy and warmth to your clear communication. Assertive empathy combines confidence with care, strengthening relationships.</p>
                    )}
                    <p>• <strong>Practice phrase:</strong> "I appreciate [their need/concern], but [your boundary]. [Alternative/offer if appropriate]."</p>
                    <p>• <strong>Remember:</strong> Assertive empathy protects relationships while protecting your boundaries. You can be firm but caring.</p>
                  </div>
                )}
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
                {score === totalLevels ? '🎯✨' : score >= totalLevels / 2 ? '📊👍' : '🌱📚'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Assertiveness Ladder Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You chose assertive empathy {score} out of {totalLevels} times
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
                    ? "Excellent! You consistently chose assertive empathy. You're mastering the balance between firm boundaries and warm delivery!"
                    : score >= totalLevels / 2
                      ? "Good progress! You're learning to aim for assertive empathy. Keep practicing the balance between firm and caring."
                      : "Keep practicing! Each scenario helps you understand where you land on the assertiveness ladder."}
                </p>
              </div>
            </div>

            {/* Assertiveness Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Assertiveness Ladder Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>The ladder has 7 rungs:</strong> From passive (rung 1) through assertive empathy (rung 4, ideal) to hostile (rung 7).</li>
                <li>• <strong>Assertive empathy is the sweet spot:</strong> Rung 4 balances firm boundaries with warm delivery, maintaining relationships while protecting your needs.</li>
                <li>• <strong>Too passive (rungs 1-3):</strong> Weak boundaries lead to overload, resentment, and inability to advocate for yourself or your students.</li>
                <li>• <strong>Too aggressive (rungs 5-7):</strong> Forceful approaches may set boundaries but damage relationships and create conflict.</li>
                <li>• <strong>Movement is possible:</strong> You can move toward assertive empathy with practice, awareness, and intentional communication.</li>
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
                    Aim for "assertive empathy"—firm but caring. This balanced approach protects your boundaries while maintaining relationships:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Firm boundaries:</strong> Clearly state your limits, needs, and expectations. This protects your capacity, time, and values.</li>
                    <li><strong>Warm delivery:</strong> Use a kind, empathetic tone that shows you care about the other person even while maintaining your boundary.</li>
                    <li><strong>Formula for assertive empathy:</strong> "I appreciate [their need/concern], but [your boundary]. [Alternative/offer if appropriate]."</li>
                    <li><strong>Example:</strong> "I appreciate you need coverage, but my planning time is essential for my teaching quality. I can help occasionally, but not regularly."</li>
                    <li><strong>Benefits:</strong> Assertive empathy maintains relationships while protecting boundaries, builds respect, and creates space for collaborative solutions.</li>
                    <li><strong>Practice regularly:</strong> Each interaction is an opportunity to practice assertive empathy. Start with low-stakes situations to build confidence.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you aim for "assertive empathy"—firm but caring—you're creating a balance that serves both you and others. This approach protects your emotional health while maintaining professional relationships, builds respect while setting boundaries, and creates space for collaborative solutions. Practice this regularly, and it becomes your natural response to boundary-setting situations.
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

export default AssertivenessLadder;