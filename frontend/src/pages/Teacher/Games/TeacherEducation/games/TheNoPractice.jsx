import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Volume2, VolumeX, CheckCircle, AlertCircle, TrendingUp, Ban } from "lucide-react";

const TheNoPractice = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-36";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentRequest, setCurrentRequest] = useState(0);
  const [selectedResponses, setSelectedResponses] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [totalCalmScore, setTotalCalmScore] = useState(0);
  const [speechSynthRef, setSpeechSynthRef] = useState(null);

  const requests = [
    {
      id: 1,
      request: "Can you cover my class? I have an emergency and need to leave early.",
      context: "A colleague asks you to cover their class with short notice",
      responseOptions: [

        {
          id: 'b',
          text: "Sure, I can do that. No problem at all.",
          calmScore: 3,
          type: 'over-accommodating',
          explanation: "While helpful, this response doesn't consider your own capacity. Always saying yes can lead to overload. It's okay to say no when you're already full."
        },
        {
          id: 'c',
          text: "No, I can't. I'm too busy.",
          calmScore: 5,
          type: 'too-direct',
          explanation: "While clear, this response lacks empathy and might damage relationships. A firm 'no' with brief explanation and alternative offer is more effective."
        },
        {
          id: 'a',
          text: "I'd love to help, but I'm full today. Can I support you in another way?",
          calmScore: 9,
          type: 'assertive-empathy',
          explanation: "Excellent! This is assertive empathy—firm yet kind. You clearly state your boundary while offering alternative support. This maintains relationships while protecting your capacity."
        },
        {
          id: 'd',
          text: "I'm not sure... maybe? Let me check my schedule and get back to you.",
          calmScore: 4,
          type: 'wishy-washy',
          explanation: "This creates uncertainty and doesn't set clear boundaries. A clear 'yes' or 'no' with brief explanation is kinder to both of you."
        }
      ]
    },
    {
      id: 2,
      request: "Could you help me prepare materials for tomorrow's event? It won't take long.",
      context: "Administrator asks for help with event preparation outside your responsibilities",
      responseOptions: [
        {
          id: 'a',
          text: "I understand the need, but I'm focused on my classes this week. Could we explore other options?",
          calmScore: 9,
          type: 'assertive-empathy',
          explanation: "Perfect! This is assertive empathy. You acknowledge their need, state your boundary clearly, and suggest alternatives. Firm yet kind."
        },
        {
          id: 'b',
          text: "Of course! I'll find a way to make it work.",
          calmScore: 3,
          type: 'over-accommodating',
          explanation: "While generous, always saying yes can lead to overload. It's important to consider your existing commitments and capacity."
        },
        {
          id: 'c',
          text: "That's not really my job. I can't help with that.",
          calmScore: 6,
          type: 'too-direct',
          explanation: "This is clear but could be more empathetic. Adding a brief explanation or alternative suggestion makes it more relationship-friendly."
        },
        {
          id: 'd',
          text: "Um, I guess I could try, but I'm not sure if I'll have time...",
          calmScore: 4,
          type: 'wishy-washy',
          explanation: "This creates uncertainty and doesn't protect your boundaries effectively. A clear response is kinder to both parties."
        }
      ]
    },
    {
      id: 3,
      request: "Would you mind staying late today to finish this report? It's really important.",
      context: "Supervisor requests you stay late for additional work",
      responseOptions: [

        {
          id: 'b',
          text: "Okay, I'll stay. Family can wait, I guess.",
          calmScore: 2,
          type: 'over-accommodating',
          explanation: "This response prioritizes work over personal commitments and shows resentment. Setting boundaries protects both work quality and personal life."
        },
        {
          id: 'c',
          text: "No, I'm leaving at my regular time. I can't do extra work today.",
          calmScore: 6,
          type: 'too-direct',
          explanation: "Clear boundary, but could be more collaborative. Adding brief context and offering alternatives maintains relationships while protecting your time."
        },
        {
          id: 'd',
          text: "I don't know... maybe I can? Let me see what I can do.",
          calmScore: 4,
          type: 'wishy-washy',
          explanation: "This creates uncertainty and doesn't set clear boundaries. A definitive response with brief explanation is more effective and respectful."
        },
        {
          id: 'a',
          text: "I appreciate the urgency, but I've committed to being home tonight. Could we discuss alternatives tomorrow morning?",
          calmScore: 9,
          type: 'assertive-empathy',
          explanation: "Excellent! You acknowledge the importance while clearly stating your boundary. Offering an alternative solution shows collaborative problem-solving."
        },
      ]
    },
    {
      id: 4,
      request: "Can you take on this extra committee role? We really need someone with your expertise.",
      context: "Administration asks you to join an additional committee",
      responseOptions: [

        {
          id: 'b',
          text: "Yes, absolutely! I'll make it work somehow.",
          calmScore: 3,
          type: 'over-accommodating',
          explanation: "While enthusiastic, taking on too much can lead to burnout. It's important to honestly assess your capacity before committing."
        },
        {
          id: 'a',
          text: "I appreciate the opportunity, but I'm at capacity right now. Perhaps we could discuss this next semester when my workload lightens?",
          calmScore: 9,
          type: 'assertive-empathy',
          explanation: "Perfect! You acknowledge their request positively while setting a clear boundary. Offering a future possibility shows engagement without overcommitting now."
        },
        {
          id: 'c',
          text: "No, I don't want to join any more committees. I'm already doing too much.",
          calmScore: 5,
          type: 'too-direct',
          explanation: "The boundary is clear, but the tone could be more collaborative. A softer approach with brief explanation maintains relationships better."
        },
        {
          id: 'd',
          text: "I'm not sure. Let me think about it and maybe I'll let you know?",
          calmScore: 4,
          type: 'wishy-washy',
          explanation: "This creates uncertainty and delays decision-making. A clear 'no' with brief explanation is more respectful of everyone's time."
        }
      ]
    },
    {
      id: 5,
      request: "Could you help grade papers for my class? I'm way behind.",
      context: "Colleague asks for help with grading their students' work",
      responseOptions: [
        {
          id: 'a',
          text: "I understand you're behind, but I'm focused on my own students' work right now. Have you considered asking administration for support?",
          calmScore: 9,
          type: 'assertive-empathy',
          explanation: "Excellent! You show empathy for their situation while maintaining your boundary. Suggesting alternatives demonstrates support without taking on their work."
        },
        {
          id: 'b',
          text: "Of course! I'll help you get caught up. No worries.",
          calmScore: 2,
          type: 'over-accommodating',
          explanation: "While kind, taking on another teacher's grading responsibilities isn't sustainable and can lead to overload. It's okay to say no."
        },
        {
          id: 'c',
          text: "No, that's your job. I have my own work to do.",
          calmScore: 5,
          type: 'too-direct',
          explanation: "While technically accurate, this response lacks empathy. Adding acknowledgment of their struggle makes the boundary more relationship-friendly."
        },
        {
          id: 'd',
          text: "I'm not sure if I can... maybe? But I'm pretty busy too...",
          calmScore: 3,
          type: 'wishy-washy',
          explanation: "This response creates confusion and doesn't protect your boundaries. A clear, kind 'no' is more helpful for everyone involved."
        }
      ]
    }
  ];

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynthRef(window.speechSynthesis);
    }
  }, []);

  const playRequestAudio = (text) => {
    if (!speechSynthRef) return;

    speechSynthRef.cancel();
    setIsPlayingAudio(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynthRef.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynthRef) {
      speechSynthRef.cancel();
      setIsPlayingAudio(false);
    }
  };

  const currentRequestData = requests[currentRequest];
  const selectedResponse = selectedResponses[currentRequestData?.id];
  const progress = ((currentRequest + 1) / requests.length) * 100;

  const handleResponseSelect = (option) => {
    if (selectedResponse) return; // Already answered

    setSelectedResponses(prev => ({
      ...prev,
      [currentRequestData.id]: option
    }));

    setShowFeedback(true);
    setTotalCalmScore(prev => prev + option.calmScore);

    // Award 1 point for each answered question regardless of calm score
    setScore(prev => prev + 1);
  };

  const handleNext = () => {
    setShowFeedback(false);
    stopAudio();
    if (currentRequest < requests.length - 1) {
      setCurrentRequest(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const getCalmScoreLabel = (score) => {
    if (score >= 8) return { label: 'Excellent', color: 'from-green-500 to-emerald-500', emoji: '🌟' };
    if (score >= 6) return { label: 'Good', color: 'from-green-500 to-emerald-500', emoji: '✨' };
    if (score >= 4) return { label: 'Fair', color: 'from-green-500 to-emerald-500', emoji: '💪' };
    return { label: 'Needs Work', color: 'from-green-500 to-emerald-500', emoji: '📚' };
  };

  // Calculate average calm score from all completed requests
  const completedRequests = Object.keys(selectedResponses).length;
  const calculatedTotal = Object.values(selectedResponses).reduce((sum, resp) => sum + (resp?.calmScore || 0), 0);
  const averageCalmScore = completedRequests > 0
    ? Math.round(calculatedTotal / completedRequests)
    : 0;

  return (
    <TeacherGameShell
      title={gameData?.title || "The \"No\" Practice"}
      subtitle={gameData?.description || "Learn polite, assertive refusal to avoid overload"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentRequest + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && currentRequestData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Request {currentRequest + 1} of {requests.length}</span>
                <span className="font-semibold">
                  {completedRequests > 0 ? `Avg Calm Score: ${averageCalmScore}/10` : 'Select a response to see calm score'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Request */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  You receive this request:
                </h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playRequestAudio(currentRequestData.request)}
                    disabled={isPlayingAudio}
                    className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-all disabled:opacity-50"
                  >
                    {isPlayingAudio ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </motion.button>
                  {isPlayingAudio && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={stopAudio}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                    >
                      <VolumeX className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </div>
              <p className="text-lg text-gray-700 italic mb-2">
                "{currentRequestData.request}"
              </p>
              <p className="text-sm text-gray-600">
                {currentRequestData.context}
              </p>
            </div>

            {/* Response Options */}
            {!showFeedback ? (
              <div className="space-y-3 mb-6">
                {currentRequestData.responseOptions.map((option, index) => {
                  const calmScoreInfo = getCalmScoreLabel(option.calmScore);
                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleResponseSelect(option)}
                      className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white hover:border-purple-400 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${calmScoreInfo.color} text-white font-bold`}>
                          {String.fromCharCode(96 + index + 1).toUpperCase()}
                        </div>
                        <p className="flex-1 text-gray-800 font-medium">
                          {option.text}
                        </p>
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
                  className="mb-6"
                >
                  {/* Calm Score Display */}
                  <div className={`bg-gradient-to-br ${getCalmScoreLabel(selectedResponse.calmScore).color} rounded-xl p-6 border-2 border-white/50 shadow-lg mb-6`}>
                    <div className="text-center text-white">
                      <div className="text-5xl mb-2">{getCalmScoreLabel(selectedResponse.calmScore).emoji}</div>
                      <div className="text-3xl font-bold mb-2">Calm Score: {selectedResponse.calmScore} / 10</div>
                      <div className="text-xl font-semibold">{getCalmScoreLabel(selectedResponse.calmScore).label}</div>
                    </div>
                  </div>

                  {/* Selected Response */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      {selectedResponse.calmScore >= 8 ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-2">Your Response:</h3>
                        <p className="text-gray-700 italic mb-2">
                          "{selectedResponse.text}"
                        </p>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedResponse.type === 'assertive-empathy' ? 'bg-green-100 text-green-800' :
                            selectedResponse.type === 'too-direct' ? 'bg-yellow-100 text-yellow-800' :
                              selectedResponse.type === 'wishy-washy' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                          }`}>
                          {selectedResponse.type === 'assertive-empathy' ? 'Assertive Empathy' :
                            selectedResponse.type === 'too-direct' ? 'Too Direct' :
                              selectedResponse.type === 'wishy-washy' ? 'Wishy-Washy' :
                                'Over-Accommodating'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className={`bg-white rounded-xl p-4 border-l-4 ${selectedResponse.calmScore >= 8 ? 'border-green-500' :
                      selectedResponse.calmScore >= 6 ? 'border-blue-500' :
                        selectedResponse.calmScore >= 4 ? 'border-yellow-500' :
                          'border-red-500'
                    }`}>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedResponse.explanation}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Next Button */}
            {showFeedback && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {currentRequest < requests.length - 1 ? 'Next Request' : 'View Results'}
                </motion.button>
              </div>
            )}
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {averageCalmScore >= 8 ? '🌟' : averageCalmScore >= 6 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Practice Complete!
            </h2>
            {averageCalmScore > 0 && (
              <div className={`bg-gradient-to-br ${getCalmScoreLabel(averageCalmScore).color} rounded-xl p-6 border-2 border-white/50 shadow-lg mb-6 max-w-md mx-auto`}>
                <p className="text-2xl font-bold text-white mb-2">
                  Average Calm Score: {averageCalmScore} / 10
                </p>
                <p className="text-xl text-white/90 font-semibold">
                  {getCalmScoreLabel(averageCalmScore).label}
                </p>
              </div>
            )}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6 max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                {averageCalmScore >= 8
                  ? "Excellent! You demonstrate strong assertive empathy skills. You can say 'no' firmly yet kindly, protecting your boundaries while maintaining relationships."
                  : averageCalmScore >= 6
                    ? "Good job! You're developing assertive communication skills. Continue practicing to refine your ability to say 'no' with empathy and clarity."
                    : "Nice effort! Assertive 'no' skills improve with practice. Review the feedback to learn how to say 'no' firmly yet kindly, protecting your boundaries while maintaining relationships."}
              </p>
            </div>

            {/* Response Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Your Responses:</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {requests.map((request) => {
                  const response = selectedResponses[request.id];
                  if (!response) return null;
                  const calmInfo = getCalmScoreLabel(response.calmScore);
                  return (
                    <div
                      key={request.id}
                      className={`p-3 rounded-lg border ${response.calmScore >= 8
                          ? 'bg-green-50 border-green-200'
                          : response.calmScore >= 6
                            ? 'bg-blue-50 border-blue-200'
                            : response.calmScore >= 4
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-red-50 border-red-200'
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{calmInfo.emoji}</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-700 mb-1">
                            Request: "{request.request.substring(0, 50)}..."
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            Your response: "{response.text.substring(0, 60)}..."
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${response.calmScore >= 8 ? 'bg-green-200 text-green-800' :
                                response.calmScore >= 6 ? 'bg-blue-200 text-blue-800' :
                                  'bg-yellow-200 text-yellow-800'
                              }`}>
                              Calm Score: {response.calmScore}/10
                            </span>
                            <span className="text-xs text-gray-500">
                              {response.type === 'assertive-empathy' ? '✓ Assertive Empathy' : response.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Ban className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Model assertive empathy—firm yet kind "no." The best "no" responses combine clarity with empathy. They acknowledge the other person's need or request while clearly stating your boundary. Phrases like "I'd love to help, but I'm at capacity" or "I appreciate the opportunity, but I'm focused on X right now" show respect for both yourself and the requester. Practice saying "no" with brief explanations and alternative offers when possible. Remember: saying "no" to one thing means saying "yes" to your wellbeing, capacity, and ability to do your existing work well. When you model assertive empathy, you teach others that boundaries are healthy and normal, which helps shift the culture toward better work-life balance.
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

export default TheNoPractice;