import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { VolumeX, Wind, Heart, Star, CheckCircle, Clock, BookOpen, Play, Pause, RotateCcw } from "lucide-react";

const SilenceStillnessPractice = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-99";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentPhase, setCurrentPhase] = useState('breathing'); // 'breathing', 'silence', 'rating', 'complete'
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);
  const [silenceTime, setSilenceTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale', 'pause'
  const [calmnessRating, setCalmnessRating] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const intervalRef = useRef(null);
  const silenceIntervalRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  const breathTimings = {
    inhale: 4000, // 4 seconds
    hold: 2000,   // 2 seconds
    exhale: 6000, // 6 seconds
    pause: 1000   // 1 second pause
  };

  const breathingPhases = ['inhale', 'hold', 'exhale', 'pause'];

  const playAudioGuide = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startBreathing = () => {
    setIsPlaying(true);
    setTotalBreaths(0);
    setBreathCount(0);
    setBreathPhase('inhale');

    // Play initial guidance
    playAudioGuide('Follow the breathing rhythm. Breathe in for 4, hold for 2, breathe out for 6. Let us begin.');

    // Start breathing cycle
    let phaseIndex = 0;
    let breathsCompleted = 0;

    const cyclePhase = () => {
      if (!isPlaying || breathsCompleted >= 5) {
        // After 5 breaths, move to silence
        setIsPlaying(false);
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
        window.speechSynthesis.cancel();
        setCurrentPhase('silence');
        startSilence();
        return;
      }

      const phase = breathingPhases[phaseIndex];
      setBreathPhase(phase);

      if (phase === 'inhale') {
        playAudioGuide('Breathe in');
      } else if (phase === 'hold') {
        playAudioGuide('Hold');
      } else if (phase === 'exhale') {
        playAudioGuide('Breathe out');
        breathsCompleted += 1;
        setTotalBreaths(breathsCompleted);
      }

      phaseIndex = (phaseIndex + 1) % breathingPhases.length;
      const delay = breathTimings[phase];

      intervalRef.current = setTimeout(cyclePhase, delay);
    };

    cyclePhase();
  };

  const startSilence = () => {
    setSilenceTime(0);
    playAudioGuide('Now sit in silence. Enjoy this moment without digital input. Be still and present.');

    silenceIntervalRef.current = setInterval(() => {
      setSilenceTime(prev => prev + 1);
    }, 1000);

    // Silence period: 60 seconds (1 minute)
    setTimeout(() => {
      if (silenceIntervalRef.current) {
        clearInterval(silenceIntervalRef.current);
      }
      window.speechSynthesis.cancel();
      playAudioGuide('The silence period is complete. Take a moment to notice how you feel.');
      setTimeout(() => {
        setCurrentPhase('rating');
      }, 2000);
    }, 60000); // 60 seconds
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
    }
    window.speechSynthesis.cancel();
  };

  const handleCalmnessRating = (rating) => {
    setCalmnessRating(rating);
    setScore(rating.value);
    setTimeout(() => {
      setShowGameOver(true);
    }, 1000);
  };

  const calmnessLevels = [
    { id: 'very-calm', label: 'Very Calm', emoji: '😌', value: 5, color: 'from-green-400 to-emerald-500', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300' },
    { id: 'calm', label: 'Calm', emoji: '🙂', value: 4, color: 'from-blue-400 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', borderColor: 'border-blue-300' },
    { id: 'peaceful', label: 'Peaceful', emoji: '😊', value: 3, color: 'from-purple-400 to-indigo-500', bgColor: 'from-purple-50 to-indigo-50', borderColor: 'border-purple-300' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', value: 2, color: 'from-gray-400 to-slate-500', bgColor: 'from-gray-50 to-slate-50', borderColor: 'border-gray-300' },
    { id: 'restless', label: 'Restless', emoji: '😔', value: 1, color: 'from-orange-400 to-amber-500', bgColor: 'from-orange-50 to-amber-50', borderColor: 'border-orange-300' }
  ];

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (silenceIntervalRef.current) {
        clearInterval(silenceIntervalRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  if (showGameOver) {
    const calmnessInfo = calmnessRating ? calmnessLevels.find(l => l.id === calmnessRating.id) : null;

    return (
      <TeacherGameShell
        title={gameData?.title || "Silence & Stillness Practice"}
        subtitle={gameData?.description || "Train mind to enjoy moments without digital input"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={score}
      >
        <div className="w-full max-w-5xl mx-auto px-4">
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
                🤫✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Practice Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've trained your mind to enjoy moments without digital input
              </p>
            </div>

            {/* Calmness Rating Display */}
            {calmnessInfo && (
              <div className={`bg-gradient-to-br ${calmnessInfo.bgColor} rounded-xl p-6 border-2 ${calmnessInfo.borderColor} mb-6`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">{calmnessInfo.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Your Calmness Level
                  </h3>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {calmnessInfo.label}
                  </p>
                  <p className="text-gray-600">
                    After breathing practice and silence, you feel {calmnessInfo.label.toLowerCase()}
                  </p>
                </div>
              </div>
            )}

            {/* Practice Summary */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                Practice Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-1">Breathing Cycles</p>
                  <p className="text-2xl font-bold text-blue-600">{totalBreaths} cycles</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Silence Time</p>
                  <p className="text-2xl font-bold text-purple-600">1 minute</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Benefits of Silence & Stillness
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Reduces digital fatigue:</strong> Time without screens gives your eyes and brain rest</li>
                <li>• <strong>Trains presence:</strong> Silence teaches you to be present without constant stimulation</li>
                <li>• <strong>Reduces stress:</strong> Stillness activates your parasympathetic nervous system</li>
                <li>• <strong>Improves focus:</strong> Regular stillness practice enhances your ability to concentrate</li>
                <li>• <strong>Enhances self-awareness:</strong> Silence allows you to notice your thoughts and feelings</li>
                <li>• <strong>Creates mental space:</strong> Stillness gives your mind room to rest and restore</li>
                <li>• <strong>Supports emotional regulation:</strong> Regular practice helps you manage emotions better</li>
                <li>• <strong>Prevents burnout:</strong> Silence and stillness are essential for long-term sustainability</li>
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
                    <strong>Introduce "Silent Minute" between classes for all staff.</strong> Creating collective silence supports everyone's well-being:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Propose the practice:</strong> Suggest implementing a "Silent Minute" between classes or during transitions. This could be done school-wide or department-wide. Proposal creates buy-in.</li>
                    <li><strong>Choose the timing:</strong> Find a natural transition time—between classes, after announcements, or during a designated break. Timing should be consistent and predictable.</li>
                    <li><strong>Define the practice:</strong> Explain that the Silent Minute is a 60-second period of complete silence. No talking, no devices, no tasks—just stillness. Clarity creates understanding.</li>
                    <li><strong>Set expectations:</strong> Make it clear that everyone participates—students, teachers, and staff. This creates collective responsibility and shared experience.</li>
                    <li><strong>Start with breathing:</strong> Begin each Silent Minute with a few deep breaths together, then sit in silence. This guides people into stillness and creates unity.</li>
                    <li><strong>Create signals:</strong> Use a bell, chime, or gentle sound to begin and end the Silent Minute. Signals create clear boundaries and support the practice.</li>
                    <li><strong>Respect the silence:</strong> During the Silent Minute, everyone honors the silence—no exceptions. This creates safety and trust in the practice.</li>
                    <li><strong>Make it optional but encouraged:</strong> While everyone should try, respect that some may need to step out. Flexibility creates inclusion while maintaining the practice.</li>
                    <li><strong>Explain the benefits:</strong> Share how silence reduces stress, improves focus, and creates mental space. Understanding benefits creates motivation and buy-in.</li>
                    <li><strong>Model the practice:</strong> Leadership should participate actively, modeling the value of silence. Leadership by example encourages participation.</li>
                    <li><strong>Reflect together:</strong> Occasionally, after the Silent Minute, invite brief sharing about the experience. Reflection deepens the practice and creates connection.</li>
                    <li><strong>Build gradually:</strong> Start with 30 seconds, then build to 60 seconds, then 90 seconds over time. Gradual building makes the practice sustainable.</li>
                    <li><strong>Benefits everyone:</strong> Silent Minutes benefit students, teachers, and staff—everyone experiences less stress and more calm. Collective benefit creates support.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you introduce "Silent Minute" between classes for all staff, you're creating a collective practice that reduces stress, improves focus, creates mental space, and supports everyone's well-being. This simple practice transforms school culture toward greater calm and presence.
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
      title={gameData?.title || "Silence & Stillness Practice"}
      subtitle={gameData?.description || "Train mind to enjoy moments without digital input"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={score}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentPhase === 'breathing' && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🧘</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Silence & Stillness Practice
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Follow the breathing rhythm, then sit in silence without digital input
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  Breathing Practice
                </h3>
                <ul className="text-indigo-800 space-y-2 text-sm">
                  <li>• <strong>Breathe in for 4 counts</strong> — Fill your lungs slowly</li>
                  <li>• <strong>Hold for 2 counts</strong> — Keep the breath</li>
                  <li>• <strong>Breathe out for 6 counts</strong> — Release slowly and completely</li>
                  <li>• <strong>Repeat 5 cycles</strong> — Follow the audio guide</li>
                  <li>• <strong>Then silence:</strong> After 5 breaths, you'll sit in silence for 1 minute</li>
                </ul>
              </div>

              {/* Breathing Animation */}
              {isPlaying && (
                <motion.div
                  key={breathPhase}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: breathPhase === 'inhale' ? 1.3 : breathPhase === 'hold' ? 1.3 : 1
                  }}
                  transition={{
                    duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 2 : breathPhase === 'exhale' ? 6 : 1,
                    ease: breathPhase === 'exhale' ? 'easeIn' : 'easeOut'
                  }}
                  className="flex items-center justify-center mb-8"
                >
                  <div className="relative">
                    <div className={`w-64 h-64 rounded-full border-4 flex items-center justify-center ${breathPhase === 'inhale' ? 'border-blue-400 bg-blue-100' :
                        breathPhase === 'hold' ? 'border-purple-400 bg-purple-100' :
                          breathPhase === 'exhale' ? 'border-green-400 bg-green-100' :
                            'border-gray-400 bg-gray-100'
                      }`}>
                      <div className="text-center">
                        <div className="text-5xl mb-2">
                          {breathPhase === 'inhale' ? '⬆️' : breathPhase === 'hold' ? '⏸️' : breathPhase === 'exhale' ? '⬇️' : '•'}
                        </div>
                        <p className="text-2xl font-bold text-gray-800 capitalize mb-1">
                          {breathPhase === 'inhale' ? 'Breathe In' : breathPhase === 'hold' ? 'Hold' : breathPhase === 'exhale' ? 'Breathe Out' : 'Pause'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {breathPhase === 'inhale' ? '4 seconds' : breathPhase === 'hold' ? '2 seconds' : breathPhase === 'exhale' ? '6 seconds' : '1 second'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Breath Counter */}
              {isPlaying && (
                <div className="text-center mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 inline-block">
                    <p className="text-sm font-semibold text-blue-700 mb-1">Breath Cycles Completed</p>
                    <p className="text-3xl font-bold text-blue-600">{totalBreaths} / 5</p>
                  </div>
                </div>
              )}

              {/* Start/Stop Button */}
              <div className="text-center">
                {!isPlaying ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startBreathing}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    Start Breathing Practice
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStop}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                  >
                    <Pause className="w-5 h-5" />
                    Stop Practice
                  </motion.button>
                )}
              </div>
            </>
          )}

          {currentPhase === 'silence' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🤫</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Silence Period
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Sit in silence. Enjoy this moment without digital input. Be still and present.
                </p>
              </div>

              {/* Timer Display */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 60,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-64 h-64 rounded-full border-4 border-purple-300 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🤫</div>
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        {formatTime(silenceTime)}
                      </div>
                      <p className="text-gray-600">Silence Time</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Guidance */}
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <VolumeX className="w-5 h-5" />
                  Being Present
                </h3>
                <ul className="text-purple-800 space-y-2 text-sm">
                  <li>• Notice your breath without controlling it</li>
                  <li>• Observe thoughts and feelings without judgment</li>
                  <li>• Simply be present in this moment</li>
                  <li>• Enjoy the silence and stillness</li>
                  <li>• This is a gift you're giving yourself</li>
                </ul>
              </div>

              {/* Progress */}
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(silenceTime / 60) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((silenceTime / 60) * 100)}% Complete
                </p>
              </div>
            </motion.div>
          )}

          {currentPhase === 'rating' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">😌</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Rate Your Calmness
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  How calm and peaceful do you feel after the breathing practice and silence?
                </p>
              </div>

              {/* Calmness Rating Options */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {calmnessLevels.map((level, index) => (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCalmnessRating(level)}
                    className={`p-6 rounded-xl border-2 transition-all ${calmnessRating?.id === level.id
                        ? `${level.bgColor} ${level.borderColor} shadow-lg`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-5xl mb-2">{level.emoji}</div>
                    <p className={`font-semibold text-sm ${calmnessRating?.id === level.id ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                      {level.label}
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* Encouragement */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 text-center">
                <p className="text-gray-700 leading-relaxed">
                  There's no right or wrong answer. Simply notice how you feel after practicing silence and stillness. 🌿
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default SilenceStillnessPractice;