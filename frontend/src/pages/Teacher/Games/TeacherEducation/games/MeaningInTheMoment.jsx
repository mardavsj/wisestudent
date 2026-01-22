import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Lightbulb, Heart, CheckCircle, BookOpen, Sparkles, Target, TrendingUp, Award } from "lucide-react";

const MeaningInTheMoment = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-85";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedMeaning, setSelectedMeaning] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scenarioChoices, setScenarioChoices] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Classroom moment scenarios
  const scenarios = [
    {
      id: 1,
      title: "Helping a Struggling Student",
      description: "A student is frustrated with a math problem. You sit beside them, break it down into smaller steps, and patiently guide them through it. It takes 10 minutes, but they finally understand.",
      emoji: "🤝",
      meaningStatements: [
        {
          id: 'a',
          text: "I'm just doing my job. This is what teachers do.",
          feedback: "While true, this perspective misses the deeper meaning. Finding purpose in ordinary moments helps sustain motivation and recognize impact.",
          category: "Task-Oriented"
        },

        {
          id: 'c',
          text: "This is just one student out of many. It's a small moment that probably won't matter much.",
          feedback: "It's easy to underestimate small moments, but they often matter most. Finding meaning in ordinary moments helps you recognize their impact.",
          category: "Minimizing"
        },
        {
          id: 'b',
          text: "I'm building this student's confidence and showing them that they can learn. ",
          feedback: "Perfect! You're finding meaning in this moment. Small acts like this create large ripples—building confidence, showing patience, and modeling resilience. This moment matters! ✨",
          category: "Meaning-Focused",
          isBest: true
        },
      ]
    },
    {
      id: 2,
      title: "Calming Classroom Noise",
      description: "Your classroom gets too noisy during group work. Instead of raising your voice, you quietly ask students to lower their voices, model calm breathing, and create a peaceful learning environment.",
      emoji: "🔇",
      meaningStatements: [
        {
          id: 'a',
          text: "I'm just managing classroom behavior. This is routine discipline.",
          feedback: "True, but there's deeper meaning here. Recognizing the purpose in routine moments helps you find satisfaction in daily work.",
          category: "Routine-Focused"
        },
        {
          id: 'b',
          text: "I'm teaching self-regulation and emotional control through modeling. ",
          feedback: "Excellent! You're finding meaning in this moment. Small acts like this create large ripples—teaching self-regulation, modeling calm, and creating a safe learning environment. This moment matters! ✨",
          category: "Meaning-Focused",
          isBest: true
        },
        {
          id: 'c',
          text: "This happens every day. It's not special—just part of managing a classroom.",
          feedback: "While routine, these moments carry meaning. Finding purpose in ordinary moments helps you recognize their significance and impact.",
          category: "Routine-Minimizing"
        }
      ]
    },
    {
      id: 3,
      title: "Explaining a Tough Concept",
      description: "Students are confused about a complex science concept. You try three different explanations, use visual aids, relate it to their lives, and finally see understanding click in their eyes.",
      emoji: "💡",
      meaningStatements: [
        {
          id: 'b',
          text: "I'm teaching persistence, adaptability, and that learning takes different approaches. ",
          feedback: "Perfect! You're finding meaning in this moment. Small acts like this create large ripples—teaching persistence, modeling adaptability, and showing that challenges can be overcome. This moment matters! ✨",
          category: "Meaning-Focused",
          isBest: true
        },
        {
          id: 'a',
          text: "I'm just explaining the curriculum. This is standard teaching practice.",
          feedback: "True, but there's deeper meaning in persistence and adapting to students' needs. Finding purpose in ordinary moments recognizes your impact.",
          category: "Standard-Focused"
        },

        {
          id: 'c',
          text: "It took too long. I should have explained it better the first time.",
          feedback: "It's easy to focus on what didn't work, but your persistence and adaptability are meaningful. Finding purpose in ordinary moments recognizes your effort and impact.",
          category: "Self-Critical"
        }
      ]
    },
    {
      id: 4,
      title: "Listening to a Student's Story",
      description: "A student stays after class to share something personal—they're worried about a family situation. You listen actively for 5 minutes, acknowledge their feelings, and offer support.",
      emoji: "👂",
      meaningStatements: [
        {
          id: 'a',
          text: "I'm just listening. This is what teachers do when students need to talk.",
          feedback: "While listening is part of teaching, finding deeper meaning recognizes the significance of making students feel heard and valued.",
          category: "Task-Oriented"
        },

        {
          id: 'c',
          text: "This is just a small conversation. There are bigger things to focus on.",
          feedback: "Small conversations often carry the most meaning. Finding purpose in ordinary moments helps you recognize that brief connections can have lasting impact.",
          category: "Minimizing"
        },
        {
          id: 'b',
          text: "I'm making this student feel seen, heard, and valued. My presence and attention are showing them that they matter and that they're not alone in their struggles.",
          feedback: "Excellent! You're finding meaning in this moment. Small acts like this create large ripples—making students feel valued, showing they're not alone, and building trust. This moment matters! ✨",
          category: "Meaning-Focused",
          isBest: true
        },
      ]
    },
    {
      id: 5,
      title: "Celebrating a Small Win",
      description: "A student who usually struggles gets one problem right. You notice, celebrate their success, and write a positive note to share with them. They smile and seem proud.",
      emoji: "🎉",
      meaningStatements: [
        {
          id: 'a',
          text: "I'm just acknowledging their work. This is basic positive reinforcement.",
          feedback: "While positive reinforcement is important, finding deeper meaning recognizes how celebration builds confidence and motivation.",
          category: "Reinforcement-Focused"
        },
        {
          id: 'b',
          text: "I'm building this student's self-belief and showing them that their progress matters.",
          feedback: "Perfect! You're finding meaning in this moment. Small acts like this create large ripples—building self-belief, celebrating progress, and teaching students to value their own growth. This moment matters! ✨",
          category: "Meaning-Focused",
          isBest: true
        },
        {
          id: 'c',
          text: "It's just one problem. They should celebrate bigger achievements.",
          feedback: "Small wins matter. Finding purpose in ordinary moments recognizes that celebrating small progress builds momentum for larger achievements.",
          category: "Achievement-Focused"
        }
      ]
    }
  ];

  const handleMeaningSelect = (meaningId) => {
    setSelectedMeaning(meaningId);
    const selectedMeaningData = scenarios[currentScenario].meaningStatements.find(m => m.id === meaningId);

    // Save choice
    setScenarioChoices(prev => ({
      ...prev,
      [currentScenario]: selectedMeaningData
    }));

    setShowFeedback(true);

    // Update score if it's the best choice
    if (selectedMeaningData.isBest) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedMeaning(null);
      setShowFeedback(false);
    } else {
      // All scenarios complete
      setShowGameOver(true);
    }
  };

  const currentScenarioData = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;
  const selectedMeaningData = selectedMeaning
    ? currentScenarioData.meaningStatements.find(m => m.id === selectedMeaning)
    : null;

  return (
    <TeacherGameShell
      title={gameData?.title || "Meaning in the Moment"}
      subtitle={gameData?.description || "Practice finding purpose in ordinary classroom moments"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💡</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Meaning in the Moment
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Practice finding purpose in ordinary classroom moments. Choose the meaning statement that best captures the significance of each moment.
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Current Scenario */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{currentScenarioData.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentScenarioData.title}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentScenarioData.description}
                  </p>
                </div>
              </div>
            </div>

            {!showFeedback ? (
              <>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    What meaning do you find in this moment?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Choose the statement that best captures the deeper purpose or significance of this classroom moment:
                  </p>

                  <div className="space-y-4">
                    {currentScenarioData.meaningStatements.map((meaning) => (
                      <motion.button
                        key={meaning.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMeaningSelect(meaning.id)}
                        className="w-full p-6 rounded-xl border-2 border-gray-300 bg-white hover:border-purple-400 hover:shadow-lg transition-all text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${meaning.isBest
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            {meaning.id.toUpperCase()}
                          </div>
                          <p className="text-gray-800 leading-relaxed flex-1">
                            "{meaning.text}"
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-8 border-2 mb-8 ${selectedMeaningData.isBest
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                  }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  {selectedMeaningData.isBest ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <Target className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${selectedMeaningData.isBest ? 'text-green-900' : 'text-blue-900'
                      }`}>
                      {selectedMeaningData.category}
                    </h3>
                    <p className={`leading-relaxed mb-4 ${selectedMeaningData.isBest ? 'text-green-800' : 'text-blue-800'
                      }`}>
                      {selectedMeaningData.feedback}
                    </p>

                    {selectedMeaningData.isBest && (
                      <div className="bg-white/60 rounded-lg p-4 border border-green-200 mt-4">
                        <p className="text-green-900 font-semibold text-center text-lg">
                          ✨ "Small acts create large ripples." ✨
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextScenario}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'View Summary'}
                  </motion.button>
                </div>
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
                💡✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Meaning in the Moment Complete!
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                You practiced finding purpose in {scenarios.length} classroom moments
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border-2 border-green-300">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">Earned {score} Healcoin{score !== 1 ? 's' : ''}!</span>
              </div>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6 text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {score} / {scenarios.length}
              </div>
              <p className="text-gray-700 text-lg">
                Meaning-focused responses selected
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {score >= scenarios.length * 0.8
                  ? "Excellent! You consistently found meaning in ordinary moments."
                  : score >= scenarios.length * 0.6
                    ? "Good! You're developing the skill of finding purpose in daily moments."
                    : "Keep practicing! Finding meaning in ordinary moments is a skill that grows with reflection."}
              </p>
            </div>

            {/* Key Insight */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Remember:
              </h3>
              <div className="bg-white rounded-lg p-6 border-2 border-green-300 text-center">
                <p className="text-3xl font-bold text-green-700 mb-2">
                  "Small acts create large ripples."
                </p>
                <p className="text-green-800 leading-relaxed">
                  Every ordinary classroom moment carries meaning. Your patience, support, kindness, and presence create ripples that extend far beyond what you can see. Finding purpose in these moments helps sustain motivation, recognize impact, and find satisfaction in daily teaching.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Finding Meaning in the Moment
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Sustains motivation:</strong> Recognizing purpose in ordinary moments helps maintain motivation during challenging times</li>
                <li>• <strong>Builds satisfaction:</strong> Finding meaning in daily work increases job satisfaction and fulfillment</li>
                <li>• <strong>Recognizes impact:</strong> Understanding the significance of small acts helps you see your influence on students</li>
                <li>• <strong>Reduces burnout:</strong> Focusing on meaning and purpose protects against burnout and exhaustion</li>
                <li>• <strong>Creates resilience:</strong> Understanding your purpose builds resilience and helps you navigate difficulties</li>
                <li>• <strong>Guides decisions:</strong> Knowing what matters helps you make decisions aligned with your purpose</li>
                <li>• <strong>Transforms perspective:</strong> Finding meaning reframes ordinary moments as purposeful and significant</li>
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
                    <strong>Pause daily to name one purposeful act before leaving school.</strong> Creating a daily ritual of recognizing meaning transforms how you experience your work:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>End-of-day ritual:</strong> Before leaving school, pause for 1-2 minutes to name one purposeful act from your day. This creates a positive closing ritual.</li>
                    <li><strong>Focus on meaning:</strong> Think about one moment where you found purpose—helping a student, showing patience, creating safety, building confidence. What made it meaningful?</li>
                    <li><strong>Keep it brief:</strong> This shouldn't take long—just a moment to recognize one meaningful act. Brief rituals are more sustainable.</li>
                    <li><strong>Write it down:</strong> Consider writing it in a journal or note. Recording meaningful moments creates a collection of purpose over time.</li>
                    <li><strong>Share sometimes:</strong> Occasionally share your purposeful act with a colleague or partner. Sharing reinforces meaning and creates connection.</li>
                    <li><strong>Notice patterns:</strong> Over time, notice patterns in what feels most meaningful. This helps you understand what matters most to you.</li>
                    <li><strong>Use on tough days:</strong> On difficult days, this ritual helps you find at least one moment of purpose, even when everything feels hard.</li>
                    <li><strong>Build habit:</strong> Make this a consistent practice—daily, if possible. Regular rituals build habits that transform perspective.</li>
                    <li><strong>Connect to values:</strong> Link your purposeful act to your values. How does this moment align with what matters most to you?</li>
                    <li><strong>Celebrate small acts:</strong> Remember that small acts create large ripples. Your one moment of purpose matters, even if it seems small.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you pause daily to name one purposeful act before leaving school, you're creating a ritual that transforms how you experience your work. This daily practice helps you find meaning in ordinary moments, recognize your impact, sustain motivation, build resilience, and end each day with a sense of purpose. Regular recognition of meaningful moments transforms teaching from a series of tasks into a journey of purpose.
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

export default MeaningInTheMoment;