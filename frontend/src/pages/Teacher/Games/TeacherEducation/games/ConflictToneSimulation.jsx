import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Volume2, VolumeX, Play, Pause, AlertCircle, CheckCircle, Users, MessageCircle, TrendingUp, BookOpen } from "lucide-react";

const ConflictToneSimulation = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-64";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedTone, setSelectedTone] = useState({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const speechSynthRef = useRef(null);
  const currentAudioRef = useRef(null);

  // Conflict scenarios with tone options
  const scenarios = [
    {
      id: 1,
      title: "Disruptive Student",
      situation: "A student is being disruptive in class, talking loudly while you're teaching. You've asked them to stop twice already, but they continue. Other students are getting distracted.",
      conflictLevel: "Medium",
      tones: [
        {
          id: 'sharp',
          label: 'Sharp Tone',
          description: 'Firm, raised voice with urgency',
          text: "I've asked you to stop talking twice already. You need to be quiet right now, or you're going to the principal's office!",
          rate: 1.2, // Faster
          pitch: 1.3, // Higher pitch
          volume: 1.0,
          outcome: {
            title: "Sharp Tone Outcome",
            respect: 40,
            clarity: 75,
            description: "The student stops talking, but looks defensive and angry. Other students seem tense. The sharp tone got attention but created more tension. The classroom atmosphere feels hostile.",
            emoji: "😤",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400"
          },
          feedback: "Sharp tones may get immediate compliance, but they damage relationships and increase tension. The high pitch and fast rate signal threat, making the situation more adversarial."
        },

        {
          id: 'passive',
          label: 'Passive Tone',
          description: 'Weak, uncertain voice',
          text: "Um, could you maybe... try to be a little quieter? If that's okay?",
          rate: 0.9,
          pitch: 1.1,
          volume: 0.7,
          outcome: {
            title: "Passive Tone Outcome",
            respect: 30,
            clarity: 50,
            description: "The student continues talking and ignores the request. Other students notice the lack of authority. The passive tone communicates uncertainty and doesn't enforce boundaries effectively.",
            emoji: "😔",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          feedback: "Passive tones lack authority and don't effectively enforce boundaries. The uncertain pitch and weak volume communicate that you're not confident in your request, so students may not respect it."
        },
        {
          id: 'calm-firm',
          label: 'Calm & Firm Tone',
          description: 'Low, slow, controlled voice with clear boundaries',
          text: "I need you to stop talking now. Please listen while I'm teaching.",
          rate: 0.75, // Slower
          pitch: 0.9, // Lower pitch
          volume: 0.9,
          outcome: {
            title: "Calm & Firm Tone Outcome",
            respect: 90,
            clarity: 95,
            description: "The student stops talking and looks at you. Other students relax slightly. The calm tone maintained your authority while preserving respect. The classroom atmosphere remains controlled.",
            emoji: "✨",
            color: "from-green-400 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            borderColor: "border-green-300"
          },
          feedback: "Excellent! 'Low and slow' voice modulation maintains authority while preserving respect. The lower pitch and slower rate signal confidence and control, not threat. This approach protects relationships while enforcing boundaries."
        },
      ],
      correctTone: 'calm-firm'
    },
    {
      id: 2,
      title: "Parent Disagreement",
      situation: "A parent is upset about a grade and is raising their voice during a parent-teacher conference. They're questioning your judgment and becoming increasingly frustrated.",
      conflictLevel: "High",
      tones: [
        {
          id: 'defensive',
          label: 'Defensive Tone',
          description: 'Matching their energy, raised voice',
          text: "I've been teaching for years, and I know what I'm doing! The grade is fair, and your child needs to work harder!",
          rate: 1.3,
          pitch: 1.4,
          volume: 1.0,
          outcome: {
            title: "Defensive Tone Outcome",
            respect: 25,
            clarity: 60,
            description: "The parent becomes more upset and the conversation escalates into an argument. The defensive tone matched their energy, creating conflict rather than resolving it. The relationship is damaged.",
            emoji: "⚔️",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400"
          },
          feedback: "Matching a parent's raised voice with your own defensive tone escalates conflict. High pitch and fast rate signal that you're also upset, creating an adversarial dynamic."
        },
        {
          id: 'calm-firm',
          label: 'Calm & Firm Tone',
          description: 'Low, slow, steady voice maintaining composure',
          text: "I understand you're concerned about the grade. Let's discuss the specific areas where your child can improve. I'm here to support their learning.",
          rate: 0.7,
          pitch: 0.85,
          volume: 0.85,
          outcome: {
            title: "Calm & Firm Tone Outcome",
            respect: 95,
            clarity: 98,
            description: "The parent's energy begins to lower. They listen as you explain. The calm tone de-escalated the situation while maintaining professionalism. You're able to have a productive conversation about solutions.",
            emoji: "✨",
            color: "from-green-400 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            borderColor: "border-green-300"
          },
          feedback: "Perfect! Using 'low and slow' voice modulation when conflict rises de-escalates tension. Your calm tone influences theirs, creating space for productive dialogue. Lower pitch and slower rate signal confidence and control."
        },
        {
          id: 'avoidant',
          label: 'Avoidant Tone',
          description: 'Quick, rushed response trying to end conversation',
          text: "Okay, okay, I'll change the grade. Let's just move on.",
          rate: 1.1,
          pitch: 1.0,
          volume: 0.8,
          outcome: {
            title: "Avoidant Tone Outcome",
            respect: 40,
            clarity: 45,
            description: "The parent seems satisfied but you feel resentful. The avoidant tone avoided conflict but didn't address the real issue. This may create expectations for future conflicts.",
            emoji: "😐",
            color: "from-yellow-500 to-orange-500",
            bgColor: "from-yellow-50 to-orange-50",
            borderColor: "border-yellow-400"
          },
          feedback: "Avoidant tones prevent addressing real issues and may create patterns of giving in to pressure. The rushed pace signals that you want to escape rather than engage constructively."
        }
      ],
      correctTone: 'calm-firm'
    },
    {
      id: 3,
      title: "Colleague Conflict",
      situation: "A colleague is criticizing your teaching approach in a team meeting. They're speaking harshly and their tone is dismissive. Other team members are listening.",
      conflictLevel: "Medium",
      tones: [
        {
          id: 'calm-firm',
          label: 'Calm & Firm Tone',
          description: 'Low, measured, professional response',
          text: "I appreciate your perspective. I'd like to understand your concerns better. Can we discuss the specific areas where you see challenges?",
          rate: 0.75,
          pitch: 0.9,
          volume: 0.9,
          outcome: {
            title: "Calm & Firm Tone Outcome",
            respect: 92,
            clarity: 96,
            description: "The colleague's tone softens. The conversation shifts to constructive discussion. Other team members respect your professionalism. You're able to address concerns without creating division.",
            emoji: "✨",
            color: "from-green-400 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            borderColor: "border-green-300"
          },
          feedback: "Excellent! 'Low and slow' voice modulation in professional conflicts maintains respect and professionalism. Your calm tone influences the conversation's direction, creating space for constructive dialogue."
        },
        {
          id: 'reactive',
          label: 'Reactive Tone',
          description: 'Immediate, sharp response',
          text: "That's not true at all! You don't know what you're talking about! I've seen great results with my approach!",
          rate: 1.25,
          pitch: 1.35,
          volume: 1.0,
          outcome: {
            title: "Reactive Tone Outcome",
            respect: 35,
            clarity: 65,
            description: "The conversation becomes heated and personal. Other team members feel uncomfortable. The reactive tone created division rather than understanding. The team dynamic is damaged.",
            emoji: "🔥",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400"
          },
          feedback: "Reactive tones in professional settings damage relationships and team cohesion. The high pitch and fast rate signal defensiveness rather than professionalism."
        },

        {
          id: 'silent',
          label: 'Remain Silent',
          description: 'No response, just listening',
          text: "",
          rate: 0,
          pitch: 0,
          volume: 0,
          outcome: {
            title: "Silent Response Outcome",
            respect: 50,
            clarity: 30,
            description: "The colleague continues speaking, and their criticism stands unchallenged. Other team members may interpret silence as agreement or weakness. The issue isn't addressed.",
            emoji: "🤐",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          feedback: "While silence can be strategic, complete silence in response to public criticism may be interpreted as weakness or agreement. A calm, measured response is often more effective."
        }
      ],
      correctTone: 'calm-firm'
    },
    {
      id: 4,
      title: "Administrator Pressure",
      situation: "An administrator is pressuring you to take on additional responsibilities that you're already struggling with. They're being insistent and not taking 'no' for an answer.",
      conflictLevel: "Medium",
      tones: [
        {
          id: 'compliant',
          label: 'Compliant Tone',
          description: 'Quick agreement despite capacity',
          text: "Okay, sure. I can do that. No problem.",
          rate: 1.0,
          pitch: 1.1,
          volume: 0.8,
          outcome: {
            title: "Compliant Tone Outcome",
            respect: 45,
            clarity: 55,
            description: "The administrator seems satisfied, but you feel overwhelmed and resentful. The compliant tone avoided conflict but didn't protect your boundaries. You're now overcommitted.",
            emoji: "😔",
            color: "from-yellow-500 to-orange-500",
            bgColor: "from-yellow-50 to-orange-50",
            borderColor: "border-yellow-400"
          },
          feedback: "Compliant tones in the face of pressure don't protect your boundaries. The higher pitch may signal uncertainty, making it easier for others to override your needs."
        },

        {
          id: 'aggressive',
          label: 'Aggressive Tone',
          description: 'Angry, forceful refusal',
          text: "No! I can't do it! I'm already doing too much! You need to find someone else!",
          rate: 1.4,
          pitch: 1.5,
          volume: 1.0,
          outcome: {
            title: "Aggressive Tone Outcome",
            respect: 40,
            clarity: 80,
            description: "The administrator seems taken aback. Your boundary was clear, but the aggressive tone damaged the relationship. They may respect your limit but may also view you differently professionally.",
            emoji: "😠",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400"
          },
          feedback: "While aggressive tones may communicate boundaries clearly, they damage professional relationships. The very high pitch and fast rate signal anger rather than confident boundary-setting."
        },
        {
          id: 'calm-firm',
          label: 'Calm & Firm Tone',
          description: 'Low, steady, clear boundary-setting',
          text: "I appreciate the opportunity, but I'm at capacity with my current responsibilities. My current commitments are full, and I want to maintain quality in what I'm already doing.",
          rate: 0.7,
          pitch: 0.85,
          volume: 0.9,
          outcome: {
            title: "Calm & Firm Tone Outcome",
            respect: 93,
            clarity: 97,
            description: "The administrator listens and respects your boundary. They understand your capacity. The calm tone maintained professionalism while protecting your limits. You're able to negotiate or decline without conflict.",
            emoji: "✨",
            color: "from-green-400 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            borderColor: "border-green-300"
          },
          feedback: "Perfect! 'Low and slow' voice modulation when setting boundaries communicates confidence and clarity. The lower pitch and slower rate signal that you're certain about your limits, making your boundary more likely to be respected."
        },
      ],
      correctTone: 'calm-firm'
    },
    {
      id: 5,
      title: "Student Backtalk",
      situation: "A student is arguing with you in front of the class after you gave them a consequence. They're raising their voice and questioning your authority in front of other students.",
      conflictLevel: "High",
      tones: [
        {
          id: 'matching-energy',
          label: 'Match Their Energy',
          description: 'Raised voice, fast response',
          text: "That's enough! You're out of line! I don't want to hear another word!",
          rate: 1.3,
          pitch: 1.4,
          volume: 1.0,
          outcome: {
            title: "Matching Energy Outcome",
            respect: 30,
            clarity: 70,
            description: "The situation escalates. The student becomes more defiant. Other students watch the power struggle. Matching their energy created more conflict rather than resolving it.",
            emoji: "⚔️",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400"
          },
          feedback: "Matching a student's raised energy with your own escalates the situation. High pitch and fast rate signal that you're also reactive, reducing your authority and control."
        },
        {
          id: 'calm-firm',
          label: 'Calm & Firm Tone',
          description: 'Low, slow, controlled response maintaining authority',
          text: "I hear your concern, but the consequence stands. We can discuss this after class. Right now, please take your seat.",
          rate: 0.7,
          pitch: 0.85,
          volume: 0.9,
          outcome: {
            title: "Calm & Firm Tone Outcome",
            respect: 94,
            clarity: 98,
            description: "The student's energy begins to lower. They comply, though reluctantly. The calm tone maintained your authority while de-escalating. Other students see you as in control. The situation is resolved.",
            emoji: "✨",
            color: "from-green-400 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            borderColor: "border-green-300"
          },
          feedback: "Excellent! 'Low and slow' voice modulation during student conflicts maintains authority while de-escalating. Your calm tone influences theirs, and the lower pitch signals confidence and control to the entire class."
        },
        {
          id: 'uncertain',
          label: 'Uncertain Tone',
          description: 'Hesitant, questioning voice',
          text: "Um, maybe we could... I don't know, maybe the consequence was too much? What do you think?",
          rate: 0.9,
          pitch: 1.2,
          volume: 0.7,
          outcome: {
            title: "Uncertain Tone Outcome",
            respect: 25,
            clarity: 40,
            description: "The student senses weakness and continues challenging you. Other students notice the lack of authority. The uncertain tone undermines your authority and doesn't enforce boundaries.",
            emoji: "😐",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          feedback: "Uncertain tones in front of the class undermine authority. The higher pitch and questioning tone signal doubt, making students less likely to respect your decisions."
        }
      ],
      correctTone: 'calm-firm'
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

  const playTone = (tone) => {
    if (!speechSynthRef.current || !tone.text) return;

    speechSynthRef.current.cancel();
    setIsPlayingAudio(true);

    const utterance = new SpeechSynthesisUtterance(tone.text);
    utterance.rate = tone.rate;
    utterance.pitch = tone.pitch;
    utterance.volume = tone.volume;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    currentAudioRef.current = utterance;
    speechSynthRef.current.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleToneSelect = (toneId) => {
    if (selectedTone[currentScenario]) return; // Already answered

    const tone = scenarios[currentScenario].tones.find(t => t.id === toneId);
    const isCorrect = toneId === scenarios[currentScenario].correctTone;

    setSelectedTone(prev => ({
      ...prev,
      [currentScenario]: {
        toneId,
        tone,
        isCorrect
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    stopAudio();
    setShowOutcome(true);
  };

  const handleViewFeedback = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowOutcome(false);
    setShowFeedback(false);
    stopAudio();
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = scenarios[currentScenario];
  const selected = selectedTone[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const ScenarioIcon = current.title.includes('Student') ? Users : current.title.includes('Parent') ? MessageCircle : Users;

  return (
    <TeacherGameShell
      title={gameData?.title || "Conflict Tone Simulation"}
      subtitle={gameData?.description || "Choose communication tone during tense situations"}
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

          {!showOutcome && !showFeedback && (
            <>
              {/* Scenario Card */}
              <div className={`bg-gradient-to-br rounded-2xl p-8 mb-8 shadow-xl border-2 ${current.conflictLevel === 'High'
                  ? 'from-red-50 via-orange-50 to-pink-50 border-red-200'
                  : 'from-orange-50 via-yellow-50 to-amber-50 border-orange-200'
                }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center ${current.conflictLevel === 'High'
                      ? 'from-red-400 to-rose-500'
                      : 'from-orange-400 to-amber-500'
                    }`}>
                    <ScenarioIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {current.title}
                    </h2>
                    <p className="text-sm text-gray-600">Conflict Level: <strong>{current.conflictLevel}</strong></p>
                  </div>
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
                  What tone will you use to respond?
                </p>
                <p className="text-sm text-gray-600">
                  Listen to each tone option, then choose the one you'll use
                </p>
              </div>

              {/* Tone Options */}
              <div className="space-y-4 mb-6">
                {current.tones.map((tone, index) => {
                  const isSelected = selected && selected.toneId === tone.id;
                  const isPlaying = isPlayingAudio && currentAudioRef.current?.text === tone.text;

                  return (
                    <motion.div
                      key={tone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-xl p-6 border-2 shadow-md transition-all ${isSelected
                          ? tone.id === 'calm-firm'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                            : 'bg-gray-50 border-gray-300 opacity-60'
                          : 'border-gray-300 hover:border-indigo-400 hover:shadow-lg'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${tone.id === 'calm-firm'
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                            : tone.id === 'sharp' || tone.id === 'defensive' || tone.id === 'reactive' || tone.id === 'aggressive' || tone.id === 'matching-energy'
                              ? 'bg-gradient-to-r from-red-400 to-rose-500'
                              : 'bg-gradient-to-r from-gray-400 to-slate-500'
                          }`}>
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-800">
                              {tone.label}
                            </h3>
                            {tone.id === 'calm-firm' && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{tone.description}</p>
                          <div className="bg-gray-50 rounded-lg p-4 mb-3">
                            <p className="text-gray-700 italic">
                              "{tone.text || 'No verbal response'}"
                            </p>
                          </div>

                          {/* Audio Controls */}
                          {tone.text && (
                            <div className="flex items-center gap-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => isPlaying ? stopAudio() : playTone(tone)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all"
                              >
                                {isPlaying ? (
                                  <>
                                    <Pause className="w-4 h-4" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4" />
                                    Play Tone
                                  </>
                                )}
                              </motion.button>
                              {isPlaying && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                  className="flex items-center gap-2 text-indigo-600"
                                >
                                  <Volume2 className="w-4 h-4" />
                                  <span className="text-xs font-semibold">Playing...</span>
                                </motion.div>
                              )}
                              <div className="text-xs text-gray-500">
                                Rate: {tone.rate}x | Pitch: {tone.pitch.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {!isSelected && tone.text && (
                        <div className="mt-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleToneSelect(tone.id)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-md transition-all"
                          >
                            Choose This Tone
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {/* Outcome */}
          {showOutcome && !showFeedback && selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className={`bg-gradient-to-br ${selected.tone.outcome.bgColor} rounded-xl p-6 border-2 ${selected.tone.outcome.borderColor} mb-6`}>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{selected.tone.outcome.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selected.tone.outcome.title}
                  </h3>
                </div>
                <div className="bg-white/60 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    {selected.tone.outcome.description}
                  </p>

                  {/* Respect and Clarity Meters */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/80 rounded-lg p-3">
                      <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>Respect</span>
                        <span className="font-bold">{selected.tone.outcome.respect}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selected.tone.outcome.respect}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-3 rounded-full ${selected.tone.outcome.respect >= 85
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : selected.tone.outcome.respect >= 60
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                : 'bg-gradient-to-r from-red-400 to-rose-500'
                            }`}
                        />
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3">
                      <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>Clarity</span>
                        <span className="font-bold">{selected.tone.outcome.clarity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selected.tone.outcome.clarity}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-3 rounded-full ${selected.tone.outcome.clarity >= 85
                              ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                              : selected.tone.outcome.clarity >= 60
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                : 'bg-gradient-to-r from-red-400 to-rose-500'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewFeedback}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  View Feedback on Tone
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
              <div className={`bg-gradient-to-br ${selected.tone.outcome.bgColor} rounded-xl p-6 border-2 ${selected.tone.outcome.borderColor} mb-6`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tone Analysis</h3>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {selected.tone.feedback}
                  </p>
                </div>
              </div>

              {/* Voice Modulation Insight */}
              {selected.tone.id === 'calm-firm' && (
                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Volume2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-green-900 mb-2">
                        💡 "Low and Slow" Voice Modulation:
                      </p>
                      <ul className="text-sm text-green-800 space-y-1 list-disc ml-4">
                        <li><strong>Lower pitch (0.7-0.9):</strong> Signals confidence and control, not threat. Creates authority without aggression.</li>
                        <li><strong>Slower rate (0.7-0.75x):</strong> Allows you to think clearly and communicate with intention. Prevents reactive responses.</li>
                        <li><strong>Moderate volume (0.85-0.9):</strong> Maintains presence without escalating. Shows composure under pressure.</li>
                        <li><strong>Impact:</strong> Your calm tone influences others' energy, de-escalating conflict and maintaining respect.</li>
                        <li><strong>Practice:</strong> When conflict rises, consciously lower your pitch and slow your rate. This creates space for productive communication.</li>
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
                {score === totalLevels ? '🎙️✨' : score >= totalLevels / 2 ? '📊👍' : '🌱📚'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Conflict Tone Simulation Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You chose calm & firm tones {score} out of {totalLevels} times
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Tone Score</h3>
                <div className={`text-5xl font-bold mb-2 ${score === totalLevels ? 'text-green-600' :
                    score >= totalLevels / 2 ? 'text-blue-600' :
                      'text-yellow-600'
                  }`}>
                  {Math.round((score / totalLevels) * 100)}%
                </div>
                <p className="text-gray-700">
                  {score === totalLevels
                    ? "Excellent! You consistently chose calm & firm tones. You're building strong conflict communication skills!"
                    : score >= totalLevels / 2
                      ? "Good progress! You're learning to use 'low and slow' voice modulation during conflicts. Keep practicing."
                      : "Keep practicing! Each scenario helps you understand how tone affects conflict outcomes."}
                </p>
              </div>
            </div>

            {/* Tone Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Conflict Tone Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Tone influences conflict outcomes:</strong> Your voice modulation affects how conflicts are resolved, relationships are maintained, and respect is preserved.</li>
                <li>• <strong>"Low and slow" de-escalates:</strong> Lower pitch and slower rate signal confidence and control, reducing tension rather than escalating it.</li>
                <li>• <strong>Calm influences others:</strong> Your calm tone can influence others' energy, creating space for productive communication even during tense situations.</li>
                <li>• <strong>High pitch increases tension:</strong> Higher pitch and faster rate signal threat or reactivity, which can escalate conflict and damage relationships.</li>
                <li>• <strong>Practice makes it natural:</strong> Consciously practicing "low and slow" voice modulation during conflicts makes it more automatic over time.</li>
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
                    Use "low and slow" voice modulation when conflict rises. This technique protects relationships while maintaining authority:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Lower your pitch:</strong> Consciously drop your voice pitch by 10-20%. This signals confidence and control, not threat or reactivity.</li>
                    <li><strong>Slow your rate:</strong> Speak 20-30% slower than normal. This allows you to think clearly, communicate with intention, and prevents reactive responses.</li>
                    <li><strong>Moderate volume:</strong> Keep volume at 85-90% of normal. Maintain presence without escalating. Avoid matching raised voices.</li>
                    <li><strong>Breathe first:</strong> Before responding to conflict, take a breath. This naturally lowers pitch and creates space for measured response.</li>
                    <li><strong>Practice regularly:</strong> Practice "low and slow" in low-stakes situations so it becomes automatic during high-stakes conflicts.</li>
                    <li><strong>Notice the impact:</strong> Pay attention to how your calm tone influences others' energy. Often, they will lower their pitch and rate to match yours.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you use "low and slow" voice modulation when conflict rises, you're protecting relationships while maintaining authority. This technique de-escalates tension, preserves respect, and creates space for productive communication. Your calm tone influences others, helping to resolve conflicts constructively rather than escalating them. Practice this regularly, and it will become your automatic response to conflict situations.
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

export default ConflictToneSimulation;