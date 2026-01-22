import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Headphones, MessageCircle, Users, CheckCircle, Clock, TrendingUp, BookOpen, Star } from "lucide-react";

const ListeningPartnerPractice = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-75";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentRole, setCurrentRole] = useState("talker"); // "talker" or "listener" (maintained for compatibility but primarily determined by roundThemes)
  const [currentRound, setCurrentRound] = useState(1); // Round 1-5
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute = 60 seconds
  const [isActive, setIsActive] = useState(false);
  const [talkerNotes, setTalkerNotes] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(60); // 1 minute audio
  const [speechSynth, setSpeechSynth] = useState(null);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [listenerRatings, setListenerRatings] = useState({
    round1: null,
    round2: null,
    round3: null,
    round4: null,
    round5: null
  });
  const [showScript, setShowScript] = useState(true);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Script cards for Talker and Listener roles
  const scriptCards = {
    talker: {
      title: "Talker Role",
      instructions: [
        "Share something you're experiencing - a challenge, success, or concern from teaching",
        "Speak for up to 1 minute about your topic",
        "Notice how well your listener is listening - eye contact, body language, focus",
        "After your turn, rate how well you felt heard (1-5 stars)"
      ],
      prompts: [
        "A recent challenge in the classroom",
        "A success or win you want to share",
        "Something you're struggling with this week",
        "A concern about a student or situation",
        "An idea or plan you're excited about"
      ],
      tips: [
        "Choose something meaningful to you",
        "Speak naturally - this is practice for real conversations",
        "Notice what helps you feel heard",
        "There's no right or wrong thing to share"
      ]
    },
    listener: {
      title: "Listener Role",
      instructions: [
        "Give your full attention - eye contact, body language, focus",
        "Listen to the audio content for the full 1 minute without interrupting",
        "Avoid problem-solving, advice, or sharing your own experiences",
        "Just listen actively - nod, maintain eye contact, show engagement"
      ],
      tips: [
        "Put away distractions - phone, papers, other thoughts",
        "Make eye contact (comfortable, not staring)",
        "Use body language - nod, lean slightly forward, open posture",
        "Avoid mental rehearsing what you'll say next",
        "Focus on understanding, not responding",
        "Notice when you want to interrupt - resist and keep listening"
      ],
      doNot: [
        "Don't interrupt or finish their sentences",
        "Don't give advice unless asked",
        "Don't share your own similar experiences",
        "Don't problem-solve or fix their issue",
        "Don't check your phone or look around"
      ]
    },
    reflection: {
      title: "Reflection Round",
      instructions: [
        "Share your thoughts on a personal or professional growth topic",
        "Focus on your learning journey and insights gained",
        "Consider how the experience changed your perspective",
        "Rate how well your reflection was received (1-5 stars)"
      ],
      prompts: [
        "A recent lesson you learned from a mistake",
        "A moment when your perspective shifted",
        "A skill you've been developing lately",
        "An experience that taught you something valuable",
        "A change in your approach to teaching"
      ],
      tips: [
        "Be honest about your learning process",
        "Share both successes and challenges",
        "Connect your insights to your growth",
        "Think about how others might relate"
      ]
    },
    collaboration: {
      title: "Collaboration Round",
      instructions: [
        "Listen to the audio content about teamwork and collaboration",
        "Focus on the collaborative experiences and team dynamics discussed",
        "Pay attention to successful partnerships and areas for improvement",
        "Rate how well the collaboration content was presented (1-5 stars)"
      ],
      prompts: [
        "A successful team project you participated in",
        "A challenging collaboration situation and how it was resolved",
        "Ideas for improving team communication",
        "A mentorship or coaching experience",
        "Ways to build better relationships with colleagues"
      ],
      tips: [
        "Focus on mutual benefits and shared goals",
        "Acknowledge different perspectives",
        "Share practical strategies",
        "Be open to feedback and suggestions"
      ]
    },
    innovation: {
      title: "Innovation Round",
      instructions: [
        "Listen to the audio content about innovative teaching approaches",
        "Focus on creative ideas and experimental techniques discussed",
        "Pay attention to future possibilities and educational improvements",
        "Rate how inspiring the innovation content was (1-5 stars)"
      ],
      prompts: [
        "A new teaching method you want to try",
        "Technology tools that enhanced your classroom",
        "Creative solutions to common teaching challenges",
        "Ideas for engaging difficult students",
        "Ways to make learning more interactive"
      ],
      tips: [
        "Embrace experimental and unconventional ideas",
        "Share both successful and unsuccessful innovations",
        "Consider implementation challenges",
        "Think about student impact and outcomes"
      ]
    }
  };

  // Define round roles and themes
  const roundThemes = [
    { number: 1, role: "talker", theme: "talker" },
    { number: 2, role: "listener", theme: "listener" },
    { number: 3, role: "talker", theme: "reflection" },
    { number: 4, role: "listener", theme: "collaboration" },
    { number: 5, role: "talker", theme: "innovation" }
  ];

  const currentRoundData = roundThemes.find(round => round.number === currentRound);
  const currentTheme = currentRoundData?.theme || "talker"; // fallback to talker theme
  const currentScript = scriptCards[currentTheme] || scriptCards.talker; // fallback to talker script

  // Timer countdown
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActive && timeRemaining === 0) {
      // Time's up
      setIsActive(false);
      if (isPlaying) {
        handleStopAudio();
      }
    }
  }, [isActive, timeRemaining, isPlaying]);

  // Audio handling - Generate speech content for listener rounds
  useEffect(() => {
    if (currentRoundData?.role === "listener" && showScript === false && isActive && speechSynth) {
      // Generate theme-specific content
      const themeContent = {
        listener: "Effective teaching requires more than just delivering content. It demands creating meaningful connections with students, understanding their individual needs, and fostering an environment where curiosity thrives. When we truly listen to our students, we discover not just their academic struggles, but their hopes, fears, and dreams. This deeper understanding transforms our approach to education. Building these connections takes time and genuine interest. We must create safe spaces where students feel comfortable sharing their authentic selves. Active listening involves not just hearing words, but understanding the emotions and experiences behind them. When students feel truly heard, they become more engaged learners who take ownership of their education. This foundation of trust and understanding becomes the cornerstone of effective teaching practice.",
        collaboration: "Successful collaboration in education goes beyond simply working together. It requires genuine communication, shared vision, and mutual respect among all stakeholders. When teachers collaborate effectively, they pool their diverse strengths and experiences to create richer learning experiences for students. The key lies in active listening, where each voice is valued and every perspective contributes to better outcomes. True educational partnerships involve regular dialogue, shared planning time, and collective problem-solving. Teachers must learn to appreciate different teaching styles and pedagogical approaches. Collaborative environments foster innovation as educators bounce ideas off each other and refine their practices. The most successful schools cultivate cultures where collaboration is normalized and celebrated. This requires leadership support, dedicated time for professional learning communities, and systems that recognize collaborative achievements. When teachers work together effectively, student outcomes improve dramatically across all subject areas.",
        innovation: "Educational innovation isn't about adopting every new technology or trendy method. True innovation emerges from thoughtful experimentation combined with careful observation of student responses. The most impactful innovations often come from listening deeply to what students actually need, rather than what we assume they want. Sustainable innovation requires patience, reflection, and the wisdom to know when to persist and when to pivot. Effective innovators start small, test their ideas systematically, and gather feedback from all stakeholders. They document their processes, celebrate both successes and failures as learning opportunities, and share their findings with colleagues. Innovation in education must be student-centered, addressing real learning challenges rather than chasing technological novelty. The best innovations often emerge from simple observations about student engagement and understanding. Teachers who innovate successfully create cultures of inquiry where questioning established practices is encouraged and experimentation is supported. These educators understand that lasting change comes from grassroots efforts grounded in deep understanding of their specific student populations."
      };

      const content = themeContent[currentTheme] || themeContent.listener;
      playAudioContent(content);
      setAudioDuration(60);
    }
  }, [currentRound, currentRoundData?.role, showScript, isActive, speechSynth, currentTheme]);

  const handleStartRound = () => {
    setTimeRemaining(60); // Reset to 1 minute
    setIsActive(true);
    setShowScript(false);

    // Clear notes when starting a new talker round
    if (currentRoundData?.role === "talker") {
      setTalkerNotes("");
    }
  };

  const handleStopRound = () => {
    setIsActive(false);
    if (isPlaying) {
      handleStopAudio();
    }
  };

  const playAudioContent = (text) => {
    if (!speechSynth) return;

    // Cancel any ongoing speech to prevent interruption errors
    speechSynth.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      handleAudioEnded();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);

    // Add a small delay to ensure cancellation is processed
    setTimeout(() => {
      if (speechSynth && !speechSynth.speaking) {
        speechSynth.speak(utterance);
      }
    }, 100);
  };

  const handlePlayAudio = () => {
    if (currentUtterance && speechSynth) {
      speechSynth.resume();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (speechSynth) {
      speechSynth.pause();
      setIsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    if (speechSynth) {
      speechSynth.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentUtterance(null);
    // Auto-stop the round when audio ends
    setIsActive(false);
  };

  const handleAudioTimeUpdate = () => {
    // For speech synthesis, we'll estimate progress based on word count
    // This is approximate since speech synthesis doesn't provide real-time position
    if (isPlaying && currentUtterance) {
      // Estimate: average 150 words per minute, so ~2.5 words per second
      const estimatedWordsSpoken = Math.floor((60 - timeRemaining) * 2.5);
      // This is a rough estimation for UI purposes
    }
  };

  const handleRatingChange = (round, rating) => {
    setListenerRatings(prev => ({
      ...prev,
      [round]: rating
    }));
  };

  const handleNextRound = () => {
    if (currentRound < 5) {
      // Move to next round
      setCurrentRound(currentRound + 1);
      setTimeRemaining(60);
      setShowScript(true);
      setIsActive(false);
      setIsPlaying(false);
      setTalkerNotes(""); // Clear notes for fresh start
    } else {
      // All rounds complete
      const ratings = [
        listenerRatings.round1,
        listenerRatings.round2,
        listenerRatings.round3,
        listenerRatings.round4,
        listenerRatings.round5
      ].filter(rating => rating !== null);

      const avgRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
      setScore(Math.round(avgRating || 0));
      setShowGameOver(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }
  }, []);

  const progress = (currentRound / 5) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Listening Partner Practice"}
      subtitle={gameData?.description || "Develop active listening through peer conversations"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentRound}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Round {currentRound} of 5</span>
            <span>{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Role Indicator */}
            <div className="text-center mb-8">
              <div className={`inline-block p-6 rounded-full mb-4 ${currentRoundData?.role === "talker"
                  ? 'bg-gradient-to-r from-pink-100 to-rose-100'
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                }`}>
                <div className="text-5xl mb-2">
                  {currentRoundData?.role === "talker" ? "🎤" : "👂"}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Round {currentRound}: {currentRoundData?.role === "talker" ? "You are the Talker" : "You are the Listener"}
                </h2>
                <p className="text-gray-600">
                  {currentRoundData?.role === "talker"
                    ? "Practice sharing while your partner listens"
                    : "Practice listening while your partner shares"}
                </p>
              </div>
            </div>

            {/* Script Card */}
            {showScript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${currentRoundData?.role === "talker"
                    ? 'from-pink-50 via-rose-50 to-orange-50 border-pink-200'
                    : 'from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
                  }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center ${currentRoundData?.role === "talker"
                      ? 'from-pink-500 to-rose-500'
                      : 'from-blue-500 to-indigo-500'
                    }`}>
                    {currentRoundData?.role === "talker" ? (
                      <MessageCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Headphones className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{currentScript.title}</h3>
                </div>

                <div className="bg-white rounded-lg p-5 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Instructions:</h4>
                  <ul className="space-y-2 text-gray-700">
                    {currentScript.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {currentRoundData?.role === "talker" && currentScript.prompts && (
                  <div className="bg-pink-100 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Talk about:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      {currentScript.prompts.map((prompt, index) => (
                        <li key={index}>• {prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentRoundData?.role === "listener" && currentScript.tips && (
                  <div className="bg-blue-100 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Active Listening Tips:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      {currentScript.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentRoundData?.role === "listener" && currentScript.doNot && (
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Avoid:</h4>
                    <ul className="space-y-1 text-red-800 text-sm">
                      {currentScript.doNot.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartRound}
                    className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${currentRoundData?.role === "talker"
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-xl'
                      }`}>
                    Start {currentRoundData?.role === "talker" ? "Sharing" : "Listening"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Active Practice Session */}
            {!showScript && isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br rounded-xl p-8 border-2 mb-6 ${currentRoundData?.role === "talker"
                    ? 'from-pink-50 via-rose-50 to-orange-50 border-pink-200'
                    : 'from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
                  }`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    {currentRoundData?.role === "talker" ? "🎤" : "👂"}
                  </div>
                  <div className="text-6xl font-bold mb-4 text-gray-800">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-lg text-gray-600">
                    {currentRoundData?.role === "talker"
                      ? "Share your thoughts..."
                      : "Listen actively..."}
                  </p>
                </div>

                {currentRoundData?.role === "talker" && (
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your notes or what you're sharing:
                    </label>
                    <textarea
                      value={talkerNotes}
                      onChange={(e) => setTalkerNotes(e.target.value)}
                      placeholder="Write down what you're sharing or your thoughts..."
                      rows={6}
                      className="w-full p-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none"
                    />
                  </div>
                )}

                {currentRoundData?.role === "listener" && (
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="text-center mb-6">
                      <Headphones className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <p className="text-lg text-gray-700 font-semibold mb-2">
                        Practice Active Listening
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        Listen to the audio content below. Focus on listening without interrupting. Notice your body language, eye contact, and attention.
                      </p>

                      {/* Audio Player */}
                      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mb-4">
                        <div className="flex items-center justify-center gap-4 mb-3">
                          <button
                            onClick={isPlaying ? handlePauseAudio : handlePlayAudio}
                            className={`p-3 rounded-full ${isPlaying
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                              } text-white transition-colors`}
                          >
                            {isPlaying ? (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>

                          <div className="flex-1 max-w-md">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Audio Content</span>
                              <span>{formatTime(60 - timeRemaining)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Audio content is generated via Web Speech API */}

                        <div className="text-center text-sm text-blue-800 bg-blue-100 rounded p-2">
                          <p className="font-medium">Teacher Education Content - Professional Development Topic</p>
                          <p className="text-xs mt-1">Listen carefully and practice active listening skills</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStopRound}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    End Round
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Rating Screen (After Round) */}
            {!showScript && !isActive && timeRemaining < 180 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 border-2 border-gray-200 mb-6"
              >
                {currentRoundData?.role === "talker" ? (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                      Rate How Well You Were Heard
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      On a scale of 1-5, how well did your listener make you feel heard?
                    </p>

                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRatingChange(`round${currentRound}`, rating)}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${listenerRatings[`round${currentRound}`] >= rating
                              ? 'bg-yellow-400 text-gray-900 shadow-lg'
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                        >
                          <Star className={`w-8 h-8 ${listenerRatings[`round${currentRound}`] >= rating
                              ? 'fill-current'
                              : ''
                            }`} />
                        </motion.button>
                      ))}
                    </div>

                    {listenerRatings[`round${currentRound}`] && (
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 mb-6">
                        <p className="text-center text-green-800 font-semibold">
                          You rated: {listenerRatings[`round${currentRound}`]} out of 5 stars
                        </p>
                      </div>
                    )}

                    <div className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextRound}
                        disabled={!listenerRatings[`round${currentRound}`]}
                        className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${listenerRatings[`round${currentRound}`]
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        {currentRound < 5 ? (currentRoundData?.role === 'talker' ? 'Switch to Listener Role' : 'Switch to Talker Role') : 'View Summary'}
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Listening Round Complete
                      </h3>
                      <p className="text-gray-600">
                        You practiced active listening for 1 minute. Well done!
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Reflect on your listening:</h4>
                      <ul className="space-y-2 text-blue-800 text-sm">
                        <li>• Did you maintain eye contact?</li>
                        <li>• Did you avoid interrupting?</li>
                        <li>• Did you avoid giving advice or sharing your own experiences?</li>
                        <li>• Did you focus fully on understanding them?</li>
                        <li>• How did your body language show engagement?</li>
                      </ul>
                    </div>

                    <div className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextRound}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        {currentRound < 5 ? (currentRoundData?.role === 'talker' ? 'Switch to Listener Role' : 'Switch to Talker Role') : 'View Summary'}
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Game Over Summary */}
        {showGameOver && (
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
                👂✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Listening Partner Practice Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You practiced 5 rounds of active listening
              </p>
            </div>

            {/* Rating Summary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Experience Ratings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Round 1</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${listenerRatings.round1 >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {listenerRatings.round1 ? `${listenerRatings.round1} / 5 stars` : 'Not rated'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Round 2</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${listenerRatings.round2 >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {listenerRatings.round2 ? `${listenerRatings.round2} / 5 stars` : 'Not rated'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Round 3</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${listenerRatings.round3 >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {listenerRatings.round3 ? `${listenerRatings.round3} / 5 stars` : 'Not rated'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Round 4</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${listenerRatings.round4 >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {listenerRatings.round4 ? `${listenerRatings.round4} / 5 stars` : 'Not rated'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Round 5</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${listenerRatings.round5 >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {listenerRatings.round5 ? `${listenerRatings.round5} / 5 stars` : 'Not rated'}
                  </p>
                </div>
              </div>
              {listenerRatings.round1 && listenerRatings.round2 && listenerRatings.round3 && listenerRatings.round4 && listenerRatings.round5 && (
                <div className="mt-4 text-center">
                  <p className="text-lg font-bold text-blue-600">
                    Average Rating: {((listenerRatings.round1 + listenerRatings.round2 + listenerRatings.round3 + listenerRatings.round4 + listenerRatings.round5) / 5).toFixed(1)} / 5
                  </p>
                </div>
              )}
            </div>

            {/* Key Learnings */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Active Listening Skills Practiced Across 5 Themes
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Teaching Challenges & Successes:</strong> You practiced sharing and listening to classroom experiences and professional growth</li>
                <li>• <strong>Personal Reflection:</strong> You explored your learning journey and insights gained from professional experiences</li>
                <li>• <strong>Collaboration & Teamwork:</strong> You discussed partnerships and ways to enhance team dynamics</li>
                <li>• <strong>Innovation & Creativity:</strong> You presented educational ideas and experimental approaches in teaching</li>
                <li>• <strong>Full attention:</strong> You practiced giving complete focus to the speaker without distractions</li>
                <li>• <strong>Body language:</strong> You practiced using eye contact and open posture to show engagement</li>
                <li>• <strong>Non-interrupting:</strong> You practiced letting others speak without interrupting or finishing sentences</li>
                <li>• <strong>Non-judgmental:</strong> You practiced listening without immediately problem-solving or giving advice</li>
                <li>• <strong>Empathy:</strong> You practiced focusing on understanding the speaker's experience</li>
                <li>• <strong>Presence:</strong> You practiced being fully present rather than mentally rehearsing responses</li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Benefits of Multi-Themed Active Listening Practice
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Builds trust:</strong> When people feel heard, they trust you more</li>
                <li>• <strong>Reduces misunderstandings:</strong> Full attention helps you understand accurately</li>
                <li>• <strong>Strengthens relationships:</strong> Active listening creates deeper connections</li>
                <li>• <strong>Improves problem-solving:</strong> Better understanding leads to better solutions</li>
                <li>• <strong>Reduces conflict:</strong> Feeling heard reduces defensiveness and conflict</li>
                <li>• <strong>Creates respect:</strong> Active listening shows respect for others' perspectives</li>
                <li>• <strong>Diverse perspectives:</strong> Different themes expose you to various aspects of professional life</li>
                <li>• <strong>Versatile skills:</strong> Practice across multiple contexts strengthens adaptability</li>
                <li>• <strong>Professional growth:</strong> Reflection on various themes enhances self-awareness</li>
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
                    <strong>Use themed listening rounds to build diverse communication skills.</strong> The 5 different themes (Teaching Experiences, Personal Reflection, Collaboration, Innovation, and Professional Growth) help develop well-rounded listening abilities:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Audio-enhanced listening:</strong> During listener rounds, teachers hear professionally recorded audio content on education topics, simulating real listening scenarios with actual spoken content.</li>
                    <li><strong>Themed approach:</strong> Different topics help teachers practice listening across various professional contexts - from classroom challenges to creative ideas.</li>
                    <li><strong>Rotating partnerships:</strong> Pair teachers randomly for each theme so everyone practices with different colleagues. This builds connections across the school and prevents cliques.</li>
                    <li><strong>Regular practice:</strong> Weekly practice makes active listening a habit rather than something that only happens in crisis moments. Consistency builds skills.</li>
                    <li><strong>Structured format:</strong> Use the Talker/Listener role format: 1 minute for talker, then switch. The structure ensures everyone practices both roles.</li>
                    <li><strong>Safe space:</strong> Make it clear this is practice, not therapy. Teachers can share something light or something deeper - their choice.</li>
                    <li><strong>No pressure:</strong> Keep it low-pressure and optional (though encouraged). Teachers can pass or share something brief if preferred.</li>
                    <li><strong>Build culture:</strong> Themed listening practice creates a culture where people feel heard and supported across different aspects of professional life. This strengthens the entire school community.</li>
                    <li><strong>Improve communication:</strong> Practice across multiple themes improves all communication in the school - with colleagues, students, and parents. Better listening skills benefit everyone.</li>
                    <li><strong>Professional growth:</strong> Different themes encourage reflection on various aspects of teaching, promoting continuous professional development.</li>
                    <li><strong>Reduce isolation:</strong> Regular themed listening rounds reduce teacher isolation and create connections across different areas of expertise. Teachers feel more supported and connected to the team.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you implement themed listening rounds with rotating partners, you're creating structured practice that builds versatile active listening skills, strengthens relationships across different professional contexts, promotes professional growth, reduces isolation, and creates a culture where everyone feels heard and supported. Themed listening practice transforms school communication and builds a stronger, more connected teaching community.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default ListeningPartnerPractice;