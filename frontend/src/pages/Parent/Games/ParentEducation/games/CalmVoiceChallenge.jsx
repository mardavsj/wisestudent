import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Volume2, VolumeX, Mic, CheckCircle, XCircle } from "lucide-react";

const CalmVoiceChallenge = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-15";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios with tone examples
  const scenarios = [
    {
      id: 1,
      title: "Homework Refusal",
      situation: "Your child refuses to do homework, saying 'I don't want to!' and crossing their arms.",
      prompt: "How would you respond to this situation?",
      angryResponse: {
        text: "'You WILL do your homework RIGHT NOW or no TV for a week!'",
        tone: "Loud, sharp, demanding",
        description: "Raised voice, harsh tone, threatening",
        volume: "🔊🔊🔊",
        pitch: "High",
        pace: "Fast",
        energy: "Aggressive",
        impact: "Child feels attacked, becomes defensive, power struggle escalates"
      },
      calmResponse: {
        text: "'I understand you don't want to do homework right now. Let's talk about what's making it hard, and then we can figure out a plan together.'",
        tone: "Firm but gentle, steady",
        description: "Even tone, clear boundaries, empathetic",
        volume: "🔊",
        pitch: "Low to medium",
        pace: "Slow and steady",
        energy: "Calm and supportive",
        impact: "Child feels heard, more likely to cooperate, relationship stays positive"
      },
      goodResponses: [
        "I see you're frustrated. Let's take a break and try again in 5 minutes.",
        "I hear that you don't want to do this right now. Can we find a way to make it easier?",
        "I understand this is difficult. What would help you get started?",
        "You're feeling stuck, and that's okay. Let's work on this together."
      ],
      feedback: "A calm, firm tone shows respect while maintaining boundaries. Your child learns that you listen even when setting limits."
    },
    {
      id: 2,
      title: "Sibling Fighting",
      situation: "Your children are fighting loudly over a toy. Shouts are getting louder, and you're trying to work.",
      prompt: "How would you intervene?",
      angryResponse: {
        text: "'STOP FIGHTING RIGHT NOW! Both of you, go to your rooms!'",
        tone: "Shouting, frustrated, commanding",
        description: "Very loud, sharp edges, dismissive",
        volume: "🔊🔊🔊🔊",
        pitch: "Very high",
        pace: "Very fast",
        energy: "Explosive",
        impact: "Everyone feels worse, children blame each other more, conflict continues later"
      },
      calmResponse: {
        text: "'I hear there's a disagreement. Let's take a breath and find a solution together.'",
        tone: "Calm, authoritative, inclusive",
        description: "Steady volume, low pitch, measured pace",
        volume: "🔊",
        pitch: "Low",
        pace: "Deliberate",
        energy: "Centered and clear",
        impact: "Children calm down faster, learn conflict resolution, relationship stays intact"
      },
      goodResponses: [
        "I see you both want the same toy. Let's find a way to share it fairly.",
        "Take a moment to breathe. We can solve this together.",
        "I hear you're both upset. What do you think would be fair?"
      ],
      feedback: "Your calm tone creates safety. When you speak softly but firmly, children feel secure enough to problem-solve instead of defend."
    },
    {
      id: 3,
      title: "Bedtime Resistance",
      situation: "It's past bedtime. Your child is still playing and refuses to go to bed, saying 'I'm not tired!'",
      prompt: "What would you say?",
      angryResponse: {
        text: "'GET TO BED NOW! I'm tired of this every night!'",
        tone: "Exasperated, loud, dismissive",
        description: "Raised voice, sharp tone, frustrated",
        volume: "🔊🔊🔊",
        pitch: "High",
        pace: "Rushed",
        energy: "Impatient",
        impact: "Child feels dismissed, refuses more, bedtime takes longer, everyone goes to bed angry"
      },
      calmResponse: {
        text: "'I know you want to keep playing. Let's finish this, then we'll do our bedtime routine together.'",
        tone: "Understanding but firm, steady",
        description: "Warm but clear, respectful boundaries",
        volume: "🔊",
        pitch: "Low",
        pace: "Measured",
        energy: "Patient and clear",
        impact: "Child feels respected, cooperates, bedtime is peaceful, everyone feels better"
      },
      goodResponses: [
        "I understand you're having fun. Let's set a timer for 5 more minutes, then bedtime.",
        "You're not feeling tired yet, and that's okay. Our bodies need rest even when we don't feel sleepy.",
        "I hear you want to keep playing. Tomorrow we can play more. Right now, it's time to rest."
      ],
      feedback: "A calm, firm tone respects your child while maintaining boundaries. They learn that limits come with understanding, not anger."
    },
    {
      id: 4,
      title: "Messy Room",
      situation: "You asked your child to clean their room this morning. It's evening, and the room is still a disaster.",
      prompt: "How would you address this?",
      angryResponse: {
        text: "'This room is a pigsty! Why can't you just do what I ask? Clean it NOW!'",
        tone: "Critical, loud, shaming",
        description: "Harsh tone, judgmental, demanding",
        volume: "🔊🔊🔊",
        pitch: "High",
        pace: "Fast and sharp",
        energy: "Frustrated and critical",
        impact: "Child feels shamed, defensive, room may get cleaned but with resentment, trust is damaged"
      },
      calmResponse: {
        text: "'I see the room still needs cleaning. It looks overwhelming. How about we tackle it together? I'll help you get started.'",
        tone: "Supportive, firm, collaborative",
        description: "Empathetic but clear, offering help",
        volume: "🔊",
        pitch: "Low to medium",
        pace: "Steady",
        energy: "Supportive and clear",
        impact: "Child feels supported, learns organization skills, room gets cleaned together, relationship strengthens"
      },
      goodResponses: [
        "I noticed the room hasn't been cleaned yet. What would make it easier for you to get started?",
        "The room needs attention. I'm here to help if you want to tackle it together.",
        "The room is still messy. That's okay - it can feel overwhelming. Let's break it into small steps.",
      ],
      feedback: "When you speak calmly about problems, you avoid shame. Your child learns that mistakes are opportunities to learn and grow."
    },
    {
      id: 5,
      title: "Backtalk/Disrespect",
      situation: "Your child says something disrespectful: 'You can't make me!' after you've asked them to do something reasonable.",
      prompt: "How would you respond?",
      angryResponse: {
        text: "'Don't you dare talk back to me! You're being disrespectful!'",
        tone: "Reactive, loud, confrontational",
        description: "Raised voice, defensive, escalating",
        volume: "🔊🔊🔊🔊",
        pitch: "Very high",
        pace: "Very fast",
        energy: "Defensive and reactive",
        impact: "Power struggle escalates, disrespect continues, relationship becomes adversarial"
      },
      calmResponse: {
        text: "'I hear you're upset. I still need you to [do the thing]. We can talk about your feelings afterward.'",
        tone: "Firm but respectful, unshaken",
        description: "Steady, clear boundaries, not defensive",
        volume: "🔊",
        pitch: "Low",
        pace: "Deliberate",
        energy: "Centered and firm",
        impact: "Boundaries maintained without escalation, child learns respect through modeling, conflict de-escalates"
      },
      goodResponses: [
        "I understand you're frustrated, and I still need you to [do the thing]. Let's discuss your feelings after.",
        "I hear that you don't want to do this. I'm willing to listen, and I still expect respect in how you speak to me.",
        "I see you're upset. My expectation stands, and I'm here to talk about what's bothering you."
      ],
      feedback: "A calm, firm tone teaches respect far faster than loud words. When you stay centered, you model emotional regulation."
    }
  ];

  const handleResponseSelect = (responseText) => {
    setSelectedResponse(responseText);
    setUserResponse(responseText);
  };

  const handleSubmit = () => {
    if (!userResponse.trim()) return;

    const current = scenarios[currentScenario];
    const isCalm = current.goodResponses.some(good =>
      userResponse.toLowerCase().includes(good.toLowerCase().substring(0, 20))
    ) || userResponse.length > 30 && !/[!?]{2,}/.test(userResponse) && !userResponse.toUpperCase() === userResponse;

    // Analyze tone characteristics
    const hasAngryWords = /(stop|now|right|can't|won't|don't|must|have to|demanding)/i.test(userResponse) &&
      !/(understand|feel|hear|help|together|let's|we can)/i.test(userResponse);
    const hasCalmWords = /(understand|feel|hear|help|together|let's|we can|okay|how about)/i.test(userResponse);
    const isAllCaps = userResponse === userResponse.toUpperCase() && userResponse.length > 10;
    const hasManyExclamation = (userResponse.match(/!/g) || []).length > 2;
    const isShortAndHarsh = userResponse.length < 40 && !hasCalmWords;

    const finalScore =
      (hasCalmWords ? 2 : 0) +
      (isAllCaps ? -2 : 0) +
      (hasManyExclamation ? -1 : 0) +
      (isShortAndHarsh && hasAngryWords ? -2 : 0) +
      (userResponse.length > 40 && hasCalmWords ? 1 : 0);

    const toneAnalysis = {
      volume: hasManyExclamation || isAllCaps ? "🔊🔊🔊 (Too loud)" : "🔊 (Good volume)",
      pitch: hasAngryWords ? "High (Anxious/Reactive)" : "Low to Medium (Calm)",
      pace: userResponse.length < 30 ? "Fast (Rushed)" : "Measured (Thoughtful)",
      energy: hasAngryWords || hasManyExclamation ? "Reactive (Defensive)" : "Centered (Calm)",
      overall: finalScore >= 2 ? "calm" : finalScore <= -2 ? "reactive" : "neutral"
    };

    setFeedback({
      isCalm: finalScore >= 1,
      toneAnalysis,
      message: finalScore >= 2
        ? "Excellent! Your response shows calm, firm leadership. This tone builds connection while maintaining boundaries."
        : finalScore >= 1
          ? "Good! Your response is heading in the right direction. Keep focusing on understanding and collaboration."
          : finalScore <= -2
            ? "Your response sounds reactive. Try using 'I understand' or 'I hear you' to show empathy before setting boundaries."
            : "Your response is neutral. Adding empathetic phrases like 'I understand' or 'Let's work together' can make it more calming."
    });

    if (finalScore >= 1) {
      setScore(prev => prev + 1);
    }

    setShowComparison(true);
  };

  const handleNext = () => {
    setShowComparison(false);
    setUserResponse("");
    setSelectedResponse(null);
    setFeedback(null);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setUserResponse("");
    setSelectedResponse(null);
    setFeedback(null);
    setShowComparison(false);
    setScore(0);
    setShowGameOver(false);
  };

  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const current = scenarios[currentScenario];

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Challenge {currentScenario + 1} of {totalLevels}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
            />
          </div>
        </div>

        {!showComparison ? (
          <>
            {/* Scenario */}
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-blue-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                {current.title}
              </h2>
              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  {current.situation}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {current.prompt}
                </p>
              </div>

              {/* Tone comparison example */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Angry tone example */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-600">Angry Tone Example</span>
                  </div>
                  <p className="text-sm text-red-700 italic mb-2">
                    "{current.angryResponse.text}"
                  </p>
                  <div className="text-xs text-red-600 space-y-1">
                    <div>Volume: {current.angryResponse.volume}</div>
                    <div>Tone: {current.angryResponse.tone}</div>
                  </div>
                </div>

                {/* Calm tone example */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <VolumeX className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-600">Calm Tone Example</span>
                  </div>
                  <p className="text-sm text-green-700 italic mb-2">
                    "{current.calmResponse.text}"
                  </p>
                  <div className="text-xs text-green-600 space-y-1">
                    <div>Volume: {current.calmResponse.volume}</div>
                    <div>Tone: {current.calmResponse.tone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response input */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Practice Your Calm Response
                </h3>
              </div>

              <p className="text-gray-600 mb-4">
                Type or select how you would respond using a calm, firm tone:
              </p>

              {/* Suggested responses */}
              <div className="space-y-2 mb-4">
                {current.goodResponses.slice(0, 3).map((response, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResponseSelect(response)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedResponse === response
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <p className="text-gray-700">{response}</p>
                  </motion.button>
                ))}
              </div>

              <textarea
                value={userResponse}
                onChange={(e) => {
                  setUserResponse(e.target.value);
                  setSelectedResponse(null);
                }}
                placeholder="Or type your own response here..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-32 text-lg resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!userResponse.trim()}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze My Tone
              </motion.button>
            </div>
          </>
        ) : (
          /* Feedback display */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Tone analysis */}
              <div className={`bg-gradient-to-br ${feedback.isCalm ? 'from-green-50 to-emerald-50 border-green-200' : 'from-orange-50 to-amber-50 border-orange-200'
                } rounded-2xl p-8 shadow-xl border-2`}>
                <div className="flex items-center gap-3 mb-6">
                  {feedback.isCalm ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-orange-600" />
                  )}
                  <h3 className={`text-3xl font-bold ${feedback.isCalm ? 'text-green-700' : 'text-orange-700'
                    }`}>
                    Your Tone Analysis
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <p className="text-lg text-gray-700 italic mb-4">
                    "{userResponse}"
                  </p>
                </div>

                {/* Tone characteristics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-600 mb-1">Volume</div>
                    <div className="text-lg font-bold text-gray-900">{feedback.toneAnalysis.volume}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-600 mb-1">Pitch</div>
                    <div className="text-lg font-bold text-gray-900">{feedback.toneAnalysis.pitch}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-600 mb-1">Pace</div>
                    <div className="text-lg font-bold text-gray-900">{feedback.toneAnalysis.pace}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-600 mb-1">Energy</div>
                    <div className="text-lg font-bold text-gray-900">{feedback.toneAnalysis.energy}</div>
                  </div>
                </div>

                {/* Feedback message */}
                <div className={`p-6 rounded-xl ${feedback.isCalm ? 'bg-green-100 border-green-300' : 'bg-orange-100 border-orange-300'
                  } border-2`}>
                  <p className={`font-semibold ${feedback.isCalm ? 'text-green-800' : 'text-orange-800'
                    }`}>
                    {feedback.message}
                  </p>
                </div>
              </div>

              {/* Learning insight */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>💡 Learning:</strong> {current.feedback}
                </p>
              </div>

              {/* Parent tip */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-sm text-amber-800 leading-relaxed text-center">
                  <strong>💡 Parent Tip:</strong> A calm tone teaches respect far faster than loud words.
                  When you speak firmly but softly, your child learns that boundaries come with respect, not fear.
                </p>
              </div>

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentScenario < totalLevels - 1 ? 'Next Challenge' : 'View Results'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentScenario + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default CalmVoiceChallenge;