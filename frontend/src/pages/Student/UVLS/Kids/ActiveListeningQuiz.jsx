import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Headphones, Play, Pause, Volume2, VolumeX, CheckCircle, AlertCircle, Users, MessageCircle, BookOpen } from "lucide-react";

const ActiveListeningQuiz = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-62";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentClip, setCurrentClip] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const speechSynthRef = useRef(null);

  // Audio clips with listening scenarios
  const audioClips = [
    {
      id: 1,
      title: "Colleague Venting",
      type: "colleague",
      audioText: "I'm just so overwhelmed right now. My class is completely out of control, and the principal keeps adding more tasks. I feel like I'm drowning. I don't know how I'm going to get everything done. And my family keeps asking when I'll be home, but I'm here until 6 PM every night. I'm exhausted and I don't know what to do.",
      context: "A colleague is venting about their workload and stress during a lunch break.",
      responses: [
        {
          id: 'problem-solving',
          label: 'Offer Solutions',
          text: "Have you tried time-blocking? Or maybe talking to the principal about your workload?",
          explanation: "While well-intentioned, jumping to solutions before fully listening can make people feel dismissed. Active listening means hearing them out first before offering advice.",
          tone: "Problem-Solving",
          isCorrect: false,
          emoji: "💡",
          color: "from-blue-400 to-cyan-500",
          bgColor: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-300"
        },
        {
          id: 'minimizing',
          label: 'Minimize Their Feelings',
          text: "Oh, we all feel that way sometimes. It'll get better. Just hang in there.",
          explanation: "Minimizing their feelings by saying 'everyone feels that way' invalidates their experience. Active listening means acknowledging their specific feelings without comparison.",
          tone: "Minimizing",
          isCorrect: false,
          emoji: "😐",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        },

        {
          id: 'redirecting',
          label: 'Redirect the Conversation',
          text: "I understand. Hey, did you see that new curriculum change they announced?",
          explanation: "Redirecting the conversation away from their feelings can make them feel dismissed. Active listening means staying present with what they're sharing.",
          tone: "Redirecting",
          isCorrect: false,
          emoji: "🔄",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'active-listening',
          label: 'Active Listening Response',
          text: "It sounds like you're feeling really overwhelmed and exhausted. That must be incredibly difficult, especially when you're trying to balance everything.",
          explanation: "Excellent! This is active listening. You acknowledged their feelings, reflected what you heard, and showed empathy. You're listening to understand, not to solve—which makes people feel heard and supported.",
          tone: "Active Listening",
          isCorrect: true,
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
      ],
      correctResponse: 'active-listening'
    },
    {
      id: 2,
      title: "Student Sharing Personal Struggle",
      type: "student",
      audioText: "I've been having a really hard time at home lately. My parents are fighting a lot, and I can't focus in class. I'm worried about everything, and my grades are dropping. I don't want to tell anyone because I feel like I'm making excuses, but it's really hard. I don't know what to do.",
      context: "A student stays after class to share a personal struggle with you.",
      responses: [
        {
          id: 'active-listening',
          label: 'Active Listening Response',
          text: "Thank you for sharing that with me. It sounds like you're dealing with a lot right now, and it's affecting how you're able to focus. I can hear that you're worried about your grades, and it's brave of you to talk about what's happening.",
          explanation: "Perfect! This is active listening. You acknowledged their courage in sharing, reflected what you heard, and showed empathy without judgment. This makes the student feel heard and supported.",
          tone: "Active Listening",
          isCorrect: true,
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'dismissing',
          label: 'Dismiss Concerns',
          text: "You need to focus harder and stop making excuses. Other students have problems too, but they still do their work.",
          explanation: "Dismissing their concerns and comparing to others invalidates their feelings. Active listening means acknowledging their experience without judgment.",
          tone: "Dismissing",
          isCorrect: false,
          emoji: "😤",
          color: "from-red-400 to-rose-500",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'fixing',
          label: 'Try to Fix Everything',
          text: "Don't worry, I'll call your parents and talk to them. I'll also give you extra time on assignments. Everything will be okay.",
          explanation: "While helpful, immediately trying to fix everything can feel overwhelming. Active listening means hearing them out first, then collaboratively exploring solutions if appropriate.",
          tone: "Fixing",
          isCorrect: false,
          emoji: "🔧",
          color: "from-blue-400 to-cyan-500",
          bgColor: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-300"
        },

        {
          id: 'interrupting',
          label: 'Interrupt and Share Your Own Experience',
          text: "I know exactly how you feel! When I was young, my parents fought too, and I had the same problem...",
          explanation: "Shifting focus to your own experience takes attention away from them. Active listening means staying focused on what they're sharing, not your own experiences.",
          tone: "Interrupting",
          isCorrect: false,
          emoji: "💬",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctResponse: 'active-listening'
    },
    {
      id: 3,
      title: "Parent Expressing Concerns",
      type: "parent",
      audioText: "I'm really worried about my child's progress in your class. They seem to be struggling, and when I ask them about school, they just shut down. I don't know what's happening, and I feel like I'm failing as a parent. I'm trying to help, but nothing seems to work.",
      context: "A parent calls you to express concerns about their child's progress.",
      responses: [
        {
          id: 'defensive',
          label: 'Get Defensive',
          text: "I'm doing everything I can in class. The student needs to participate more and do their homework.",
          explanation: "Getting defensive shifts focus from understanding their concern to defending yourself. Active listening means hearing their concern and collaborating on solutions.",
          tone: "Defensive",
          isCorrect: false,
          emoji: "🛡️",
          color: "from-red-400 to-rose-500",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'reassuring',
          label: 'Reassure Without Listening',
          text: "Don't worry, everything will be fine. They're doing okay. You're doing a great job as a parent.",
          explanation: "Reassuring without fully listening can dismiss their concerns. Active listening means acknowledging their worry and exploring it together.",
          tone: "Reassuring",
          isCorrect: false,
          emoji: "😊",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'active-listening',
          label: 'Active Listening Response',
          text: "I can hear that you're worried about your child's progress and feeling uncertain about how to help. It sounds like it's been frustrating when they shut down. I'd like to understand more about what you're seeing at home, and maybe we can work together to support them.",
          explanation: "Excellent! This is active listening. You acknowledged their feelings, reflected what you heard, and invited collaboration. You're listening to understand their perspective, which builds trust and partnership.",
          tone: "Active Listening",
          isCorrect: true,
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'minimizing',
          label: 'Minimize Their Worry',
          text: "Oh, kids do that sometimes. They'll be fine. You're overthinking it.",
          explanation: "Minimizing their concern can make them feel dismissed. Active listening means taking their concerns seriously and exploring them together.",
          tone: "Minimizing",
          isCorrect: false,
          emoji: "😐",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        }
      ],
      correctResponse: 'active-listening'
    },
    {
      id: 4,
      title: "Colleague Asking for Advice",
      type: "colleague",
      audioText: "I'm really struggling with classroom management in my third-period class. They're constantly talking over me, and I've tried everything—yelling, sending kids out, calling parents. Nothing seems to work. I feel like I'm losing control, and I'm worried the principal is going to notice. What should I do?",
      context: "A colleague comes to you asking for advice on classroom management.",
      responses: [
        {
          id: 'jumping-to-advice',
          label: 'Jump to Advice',
          text: "You need to establish clear rules on day one and be consistent. Have you tried a reward system?",
          explanation: "Offering advice before fully understanding their situation can miss the mark. Active listening means hearing their full story and asking clarifying questions first.",
          tone: "Advice-Giving",
          isCorrect: false,
          emoji: "💡",
          color: "from-blue-400 to-cyan-500",
          bgColor: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-300"
        },
        {
          id: 'active-listening',
          label: 'Active Listening Response',
          text: "It sounds like you're feeling really frustrated and worried about this class. I can hear that you've tried several strategies, and it's been discouraging that they haven't worked. Can you tell me more about what happens specifically when they talk over you?",
          explanation: "Perfect! This is active listening. You acknowledged their feelings, reflected what you heard, and asked open-ended questions to understand better. This helps them feel heard and helps you provide better support.",
          tone: "Active Listening",
          isCorrect: true,
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'sharing-your-story',
          label: 'Share Your Own Story',
          text: "Oh, I had the exact same problem! Here's what I did—it was amazing...",
          explanation: "Sharing your own experience shifts focus away from them. Active listening means staying present with their situation and asking questions to understand better.",
          tone: "Story-Sharing",
          isCorrect: false,
          emoji: "💬",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },

        {
          id: 'dismissing',
          label: 'Dismiss Their Concern',
          text: "It's probably not as bad as you think. Every class has challenges. You'll figure it out.",
          explanation: "Dismissing their concern minimizes their experience. Active listening means taking their challenge seriously and exploring it with them.",
          tone: "Dismissing",
          isCorrect: false,
          emoji: "😐",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        }
      ],
      correctResponse: 'active-listening'
    },
    {
      id: 5,
      title: "Student Expressing Anxiety",
      type: "student",
      audioText: "I'm really nervous about the upcoming test. I've been studying, but I don't think I'm prepared. What if I fail? Everyone else seems to understand the material better than me. I can't sleep because I'm so worried about it. I don't know what to do.",
      context: "A student approaches you before class expressing anxiety about an upcoming test.",
      responses: [
        {
          id: 'active-listening',
          label: 'Active Listening Response',
          text: "It sounds like you're feeling really anxious about this test, and the worry is even affecting your sleep. I can hear that you've been studying, but you're still feeling unprepared. What specific parts of the material are you most worried about?",
          explanation: "Excellent! This is active listening. You acknowledged their anxiety, reflected what you heard about their studying and sleep, and asked an open-ended question to understand better. This makes them feel heard and helps address their specific concerns.",
          tone: "Active Listening",
          isCorrect: true,
          emoji: "✨",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'reassuring-only',
          label: 'Reassure Without Listening',
          text: "You'll be fine! Don't worry about it. You've got this.",
          explanation: "Reassuring without listening to their concerns can feel dismissive. Active listening means hearing their anxiety and acknowledging it before offering support.",
          tone: "Reassuring",
          isCorrect: false,
          emoji: "😊",
          color: "from-yellow-400 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'problem-solving-immediately',
          label: 'Jump to Solutions',
          text: "Here's what you need to do: make flashcards, study for an hour every night, and come see me during office hours.",
          explanation: "Jumping to solutions before fully hearing their concerns can make them feel rushed. Active listening means understanding their anxiety first, then exploring solutions together.",
          tone: "Problem-Solving",
          isCorrect: false,
          emoji: "💡",
          color: "from-blue-400 to-cyan-500",
          bgColor: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-300"
        },

        {
          id: 'comparing',
          label: 'Compare to Others',
          text: "Lots of students feel this way. You're not alone. Just do your best like everyone else.",
          explanation: "Comparing to others can minimize their specific anxiety. Active listening means focusing on their individual experience and concerns.",
          tone: "Comparing",
          isCorrect: false,
          emoji: "👥",
          color: "from-gray-400 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300"
        }
      ],
      correctResponse: 'active-listening'
    }
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  const playAudio = (text) => {
    if (!speechSynthRef.current) return;

    speechSynthRef.current.cancel();
    setIsPlayingAudio(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower for natural speech
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynthRef.current.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleResponseSelect = (responseId) => {
    if (selectedResponse[currentClip]) return; // Already answered

    const response = audioClips[currentClip].responses.find(r => r.id === responseId);
    const isCorrect = responseId === audioClips[currentClip].correctResponse;

    setSelectedResponse(prev => ({
      ...prev,
      [currentClip]: {
        responseId,
        response,
        isCorrect
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowFeedback(true);
    stopAudio();
  };

  const handleNext = () => {
    setShowFeedback(false);
    stopAudio();
    if (currentClip < totalLevels - 1) {
      setCurrentClip(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = audioClips[currentClip];
  const selected = selectedResponse[currentClip];
  const progress = ((currentClip + 1) / totalLevels) * 100;
  const ClipIcon = current.type === 'colleague' ? Users : MessageCircle;

  return (
    <TeacherGameShell
      title={gameData?.title || "Active Listening Quiz"}
      subtitle={gameData?.description || "Strengthen listening skills to reduce misunderstandings"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentClip}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div
          key={currentClip}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Clip {currentClip + 1} of {totalLevels}</span>
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

          {!showFeedback && (
            <>
              {/* Audio Clip Section */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                    <ClipIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {current.title}
                  </h2>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <p className="text-sm text-gray-600 mb-4">{current.context}</p>
                  <div className="flex items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => isPlayingAudio ? stopAudio() : playAudio(current.audioText)}
                      className="flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-xl"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Play Audio Clip
                        </>
                      )}
                    </motion.button>

                    {isPlayingAudio && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex items-center gap-2 text-blue-600"
                      >
                        <Headphones className="w-6 h-6" />
                        <span className="font-semibold">Listening...</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-100 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>💡 Tip:</strong> Listen carefully to what's being shared. Pay attention to both the words and the emotions behind them.
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-6">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  After hearing the clip, what's the best listening response?
                </p>
                <p className="text-sm text-gray-600">
                  Choose the response that demonstrates active listening
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
                          ? response.isCorrect
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                            : 'bg-gray-50 border-gray-300 opacity-60'
                          : 'bg-white border-gray-300 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-400 to-cyan-500`}>
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
                        {isSelected && response.isCorrect && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
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
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {selected.response.explanation}
                  </p>
                </div>
              </div>

              {/* Active Listening Insight */}
              {selected.response.isCorrect && (
                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Headphones className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-green-900 mb-2">
                        💡 Active Listening Elements:
                      </p>
                      <ul className="text-sm text-green-800 space-y-1 list-disc ml-4">
                        <li><strong>Acknowledgment:</strong> You acknowledged what they shared and their feelings.</li>
                        <li><strong>Reflection:</strong> You reflected back what you heard to show understanding.</li>
                        <li><strong>Empathy:</strong> You showed empathy and validation without judgment.</li>
                        <li><strong>Presence:</strong> You stayed focused on what they were sharing, not your own agenda.</li>
                        <li><strong>Open Questions:</strong> When appropriate, you asked questions to understand better rather than jumping to advice.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentClip < totalLevels - 1 ? 'Next Audio Clip' : 'View Summary'}
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
                {score === totalLevels ? '🎧✨' : score >= totalLevels / 2 ? '📊👍' : '🌱📚'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Active Listening Quiz Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You identified active listening responses {score} out of {totalLevels} times
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Listening Score</h3>
                <div className={`text-5xl font-bold mb-2 ${score === totalLevels ? 'text-green-600' :
                    score >= totalLevels / 2 ? 'text-blue-600' :
                      'text-yellow-600'
                  }`}>
                  {Math.round((score / totalLevels) * 100)}%
                </div>
                <p className="text-gray-700">
                  {score === totalLevels
                    ? "Excellent! You consistently identified active listening responses. You're building strong listening skills!"
                    : score >= totalLevels / 2
                      ? "Good progress! You're learning to recognize active listening. Keep practicing."
                      : "Keep practicing! Each clip helps you understand active listening better."}
                </p>
              </div>
            </div>

            {/* Active Listening Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Active Listening Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Active listening reduces misunderstandings:</strong> When you fully listen before responding, you understand others' perspectives better and avoid misinterpretations.</li>
                <li>• <strong>Acknowledgment comes first:</strong> Acknowledging what someone shares and how they feel makes them feel heard and understood.</li>
                <li>• <strong>Reflection shows understanding:</strong> Reflecting back what you heard demonstrates that you're truly listening and helps clarify meaning.</li>
                <li>• <strong>Empathy without judgment:</strong> Active listening means understanding their perspective without judging or minimizing their experience.</li>
                <li>• <strong>Listen to understand, not to respond:</strong> When you focus on understanding rather than preparing your response, you listen more effectively.</li>
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
                    Maintain eye contact and avoid mental rehearsing while others speak. Active listening requires full presence:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Maintain eye contact:</strong> Eye contact shows you're present and focused on what they're saying. It signals respect and attention.</li>
                    <li><strong>Avoid mental rehearsing:</strong> When someone is speaking, don't rehearse what you'll say next. Focus on truly hearing and understanding them first.</li>
                    <li><strong>Notice body language:</strong> Pay attention to both verbal and non-verbal cues. Their tone, facial expressions, and body language communicate as much as their words.</li>
                    <li><strong>Minimize distractions:</strong> Put away devices, close unnecessary tabs, and create space to fully listen without interruptions.</li>
                    <li><strong>Ask clarifying questions:</strong> When appropriate, ask open-ended questions like "Can you tell me more about that?" or "What was that like for you?" to deepen understanding.</li>
                    <li><strong>Reflect before responding:</strong> After they finish speaking, take a brief moment to reflect what you heard before formulating your response.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you maintain eye contact and avoid mental rehearsing while others speak, you're practicing active listening. This full presence helps you understand others better, reduces misunderstandings, and builds stronger relationships with students, colleagues, and parents. Active listening is a skill that improves with practice, and every conversation is an opportunity to strengthen it.
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

export default ActiveListeningQuiz;