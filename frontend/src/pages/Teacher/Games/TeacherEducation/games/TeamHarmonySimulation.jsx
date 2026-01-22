import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Users, TrendingUp, Heart, Target, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

const TeamHarmonySimulation = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-79";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [harmonyMeters, setHarmonyMeters] = useState({
    opinions: 50,  // Balance of opinions (0-100)
    workload: 50,  // Balance of workload (0-100)
    empathy: 50    // Balance of empathy (0-100)
  });
  const [scenarioChoices, setScenarioChoices] = useState({});
  const [score, setScore] = useState(0);
  const [scenarioScores, setScenarioScores] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);

  // Initialize scenarioScores when component mounts
  React.useEffect(() => {
    setScenarioScores(Array(scenarios.length).fill(0));
  }, []);

  // Team meeting scenarios
  const scenarios = [
    {
      id: 1,
      title: "Workload Distribution",
      context: "During a department meeting, your team is discussing how to divide additional responsibilities for a new curriculum rollout. Some teachers feel overwhelmed, while others seem eager to take on more.",
      situation: "Sarah says: 'I'm already stretched thin with my current classes. I don't think I can take on more curriculum work right now.'",
      choices: [

        {
          id: 'b',
          phrase: "We all have to pitch in. Everyone should take equal shares regardless of current workload.",
          impact: { opinions: -10, workload: -10, empathy: -15 },
          feedback: "This response doesn't acknowledge Sarah's concerns and may create resentment. It dismisses different opinions and shows less empathy for individual circumstances.",
          category: "Dismissive Response"
        },
        {
          id: 'c',
          phrase: "I'll take on Sarah's share if she can't handle it. No problem.",
          impact: { opinions: -5, workload: -5, empathy: 5 },
          feedback: "While kind, this doesn't address the underlying issue of workload balance. It may create resentment from others or enable unequal distribution.",
          category: "Well-Meaning But Incomplete"
        },
        {
          id: 'a',
          phrase: "I understand Sarah's concern. Let's make sure everyone's workload is fair before we assign anything.",
          impact: { opinions: 10, workload: 15, empathy: 15 },
          feedback: "Excellent! You balanced empathy for Sarah's concern while addressing workload fairness. This shows you're listening to different opinions and considering everyone's capacity.",
          category: "Balanced Response"
        },
      ]
    },
    {
      id: 2,
      title: "Conflicting Teaching Approaches",
      context: "Your team is discussing teaching strategies for struggling students. There are strong opinions about different approaches - some favor more structured methods, others prefer flexible, student-led learning.",
      situation: "Michael strongly advocates for his structured approach, while Emily argues for more flexibility. The discussion is getting heated.",
      choices: [
        {
          id: 'a',
          phrase: "Both approaches have merit. What if we use structured methods for some concepts and flexible approaches for others? Let's find what works best for our students.",
          impact: { opinions: 15, workload: 10, empathy: 10 },
          feedback: "Perfect! You're validating both opinions, finding balance, and keeping focus on what's best for students. This promotes harmony while honoring different perspectives.",
          category: "Harmonious Response"
        },
        {
          id: 'b',
          phrase: "Michael's right - we need more structure. Let's go with that approach.",
          impact: { opinions: -15, workload: 0, empathy: -10 },
          feedback: "Choosing one side dismisses the other opinion, which can create division. This doesn't balance different perspectives or show empathy for Emily's viewpoint.",
          category: "Divisive Response"
        },
        {
          id: 'c',
          phrase: "Can we just move on? This is taking too long and we have other things to discuss.",
          impact: { opinions: -10, workload: 5, empathy: -15 },
          feedback: "Avoiding the discussion doesn't resolve the conflict and shows lack of empathy for the importance of the issue to your colleagues.",
          category: "Avoidant Response"
        }
      ]
    },
    {
      id: 3,
      title: "Parent Complaint Response",
      context: "A parent has complained about a teaching approach used by Lisa, your colleague. The team is discussing how to respond and support Lisa, while also addressing the parent's concerns.",
      situation: "Lisa feels defensive and hurt by the complaint. Some team members want to defend her strongly, while others think the parent might have valid concerns.",
      choices: [

        {
          id: 'b',
          phrase: "We need to address the parent's complaint immediately. Let's figure out what went wrong.",
          impact: { opinions: -5, workload: 10, empathy: -20 },
          feedback: "This prioritizes the complaint over supporting Lisa, which may leave her feeling unsupported. It lacks empathy for her situation.",
          category: "Task-Focused Only"
        },
        {
          id: 'c',
          phrase: "The parent is wrong. We should all stand with Lisa and not give in to unreasonable complaints.",
          impact: { opinions: -10, workload: -5, empathy: 10 },
          feedback: "While showing support for Lisa, this dismisses the parent's perspective entirely. It doesn't balance opinions or show empathy for all parties.",
          category: "Defensive Response"
        },
        {
          id: 'a',
          phrase: "Let's first make sure Lisa feels supported, then we can address the parent's concerns together. Both perspectives matter here.",
          impact: { opinions: 10, workload: 10, empathy: 20 },
          feedback: "Excellent! You're showing empathy for Lisa while also acknowledging the need to address the parent's concerns. This balances support with responsibility.",
          category: "Empathetic & Balanced"
        },
      ]
    },
    {
      id: 4,
      title: "Resource Allocation",
      context: "Your team needs to decide how to allocate limited classroom resources - new technology, supplies, or support materials. Different teachers have different needs and priorities.",
      situation: "David needs new history resources, but Maria needs music equipment. The budget can only cover one major purchase this semester.",
      choices: [

        {
          id: 'b',
          phrase: "We should prioritize based on which department serves more students. Let's count enrollment.",
          impact: { opinions: -10, workload: 5, empathy: -10 },
          feedback: "This purely quantitative approach doesn't consider the importance of different subjects or show empathy for teachers' specific needs.",
          category: "Numbers-Only Approach"
        },
        {
          id: 'a',
          phrase: "Let's hear from everyone about their priorities, then find a solution that addresses the most urgent needs while planning for future purchases.",
          impact: { opinions: 15, workload: 10, empathy: 15 },
          feedback: "Great approach! You're ensuring everyone's opinions are heard, balancing different needs with empathy, and working toward a fair solution.",
          category: "Inclusive & Fair"
        },
        {
          id: 'c',
          phrase: "Let's just split it 50/50. That way no one feels left out.",
          impact: { opinions: 5, workload: -10, empathy: 5 },
          feedback: "While fair on surface, this might not address actual needs effectively. Equal doesn't always mean fair when needs differ.",
          category: "Surface-Level Fairness"
        }
      ]
    },
    {
      id: 5,
      title: "Student Discipline Approach",
      context: "The team is discussing how to handle a recurring discipline issue. Some teachers prefer stricter consequences, while others advocate for more restorative approaches.",
      situation: "James wants stricter discipline, while Emily believes in restorative conversations. The team seems split, and finding consensus is challenging.",
      choices: [
        {
          id: 'a',
          phrase: "Both approaches have value in different situations. What if we create a framework that uses restorative approaches first, with clear consequences as needed? Let's build something that incorporates both perspectives.",
          impact: { opinions: 20, workload: 15, empathy: 15 },
          feedback: "Outstanding! You're integrating both perspectives, creating a balanced approach that respects different opinions while building empathy and practical solutions.",
          category: "Integrative Response"
        },
        {
          id: 'b',
          phrase: "We should vote on it. Majority rules - that's the fairest way.",
          impact: { opinions: -15, workload: 5, empathy: -10 },
          feedback: "Voting can leave some teachers feeling unheard. It doesn't integrate different perspectives or show empathy for minority opinions.",
          category: "Majority-Rules Approach"
        },
        {
          id: 'c',
          phrase: "Let's just use whatever approach each teacher prefers in their own classroom.",
          impact: { opinions: 0, workload: -10, empathy: -5 },
          feedback: "While this avoids conflict, it doesn't create team consistency or address the need for coordinated approaches. It may create confusion.",
          category: "Individual-Only Approach"
        }
      ]
    }
  ];

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);

    // Update harmony meters
    const newMeters = {
      opinions: Math.max(0, Math.min(100, harmonyMeters.opinions + choice.impact.opinions)),
      workload: Math.max(0, Math.min(100, harmonyMeters.workload + choice.impact.workload)),
      empathy: Math.max(0, Math.min(100, harmonyMeters.empathy + choice.impact.empathy))
    };
    setHarmonyMeters(newMeters);

    // Award 1 point for positive-impact choices (best choices in each scenario)
    // The best choice in each scenario has the highest sum of positive impacts
    let scenarioScore = 0;
    const currentScenarioChoices = scenarios[currentScenario].choices;

    // Identify the best choice in the current scenario based on highest positive impact
    const bestChoice = currentScenarioChoices.reduce((best, choice) => {
      const totalImpact = choice.impact.opinions + choice.impact.workload + choice.impact.empathy;
      const bestTotalImpact = best.impact.opinions + best.impact.workload + best.impact.empathy;
      return totalImpact > bestTotalImpact ? choice : best;
    });

    // Give 1 point if the selected choice is the best one for this scenario
    if (choice.id === bestChoice.id) {
      scenarioScore = 1;
    }

    // Ensure scenarioScores is properly initialized
    let newScenarioScores;
    if (scenarioScores.length === 0) {
      newScenarioScores = Array(scenarios.length).fill(0);
    } else {
      newScenarioScores = [...scenarioScores];
    }
    newScenarioScores[currentScenario] = scenarioScore;
    setScenarioScores(newScenarioScores);

    // Save choice
    setScenarioChoices(prev => ({
      ...prev,
      [currentScenario]: choice
    }));

    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      // Ensure scenarioScores is properly initialized before calculating total
      const scores = scenarioScores.length > 0 ? scenarioScores : Array(scenarios.length).fill(0);
      // Calculate final score as number of correct scenarios (1 point per scenario)
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      setScore(totalScore);
      setShowGameOver(true);
    }
  };

  const currentScenarioData = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;
  const overallHarmony = Math.round(
    (harmonyMeters.opinions + harmonyMeters.workload + harmonyMeters.empathy) / 3
  );

  return (
    <TeacherGameShell
      title={gameData?.title || "Team Harmony Simulation"}
      subtitle={gameData?.description || "Balance opinions, workload, and empathy in team meetings"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Team Harmony Simulation
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Practice balancing opinions, workload, and empathy in team meeting scenarios
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
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Harmony Meters */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Team Harmony Meters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Opinions Balance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Opinions Balance
                    </span>
                    <span className="text-sm font-bold text-gray-800">{harmonyMeters.opinions}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${harmonyMeters.opinions}%` }}
                      className={`h-3 rounded-full ${harmonyMeters.opinions >= 70 ? 'bg-green-500' :
                          harmonyMeters.opinions >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}
                    />
                  </div>
                </div>

                {/* Workload Balance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Workload Balance
                    </span>
                    <span className="text-sm font-bold text-gray-800">{harmonyMeters.workload}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${harmonyMeters.workload}%` }}
                      className={`h-3 rounded-full ${harmonyMeters.workload >= 70 ? 'bg-green-500' :
                          harmonyMeters.workload >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}
                    />
                  </div>
                </div>

                {/* Empathy Balance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Empathy Balance
                    </span>
                    <span className="text-sm font-bold text-gray-800">{harmonyMeters.empathy}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${harmonyMeters.empathy}%` }}
                      className={`h-3 rounded-full ${harmonyMeters.empathy >= 70 ? 'bg-green-500' :
                          harmonyMeters.empathy >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Overall Harmony: <span className="font-bold text-lg text-indigo-600">{overallHarmony}/100</span>
                </p>
              </div>
            </div>

            {/* Current Scenario */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {currentScenario + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{currentScenarioData.title}</h3>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mb-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Context:</p>
                <p className="text-gray-700 leading-relaxed">{currentScenarioData.context}</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200 mb-6">
                <p className="text-sm font-semibold text-yellow-900 mb-2">The Situation:</p>
                <p className="text-gray-800 italic leading-relaxed">"{currentScenarioData.situation}"</p>
              </div>

              {!showFeedback ? (
                <>
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    How would you respond?
                  </p>
                  <div className="space-y-3">
                    {currentScenarioData.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoiceSelect(choice)}
                        className="w-full p-5 rounded-xl border-2 border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg transition-all text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {choice.id.toUpperCase()}
                          </div>
                          <p className="text-gray-800 leading-relaxed flex-1">
                            "{choice.phrase}"
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-2">
                        {selectedChoice.category}
                      </h4>
                      <p className="text-green-800 leading-relaxed mb-4">
                        {selectedChoice.feedback}
                      </p>
                      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-2">Impact on Harmony:</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-green-700">Opinions: </span>
                            <span className={`font-bold ${selectedChoice.impact.opinions > 0 ? 'text-green-600' :
                                selectedChoice.impact.opinions < 0 ? 'text-red-600' :
                                  'text-gray-600'
                              }`}>
                              {selectedChoice.impact.opinions > 0 ? '+' : ''}{selectedChoice.impact.opinions}
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700">Workload: </span>
                            <span className={`font-bold ${selectedChoice.impact.workload > 0 ? 'text-green-600' :
                                selectedChoice.impact.workload < 0 ? 'text-red-600' :
                                  'text-gray-600'
                              }`}>
                              {selectedChoice.impact.workload > 0 ? '+' : ''}{selectedChoice.impact.workload}
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700">Empathy: </span>
                            <span className={`font-bold ${selectedChoice.impact.empathy > 0 ? 'text-green-600' :
                                selectedChoice.impact.empathy < 0 ? 'text-red-600' :
                                  'text-gray-600'
                              }`}>
                              {selectedChoice.impact.empathy > 0 ? '+' : ''}{selectedChoice.impact.empathy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextScenario}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'View Summary'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
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
                🤝✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Team Harmony Simulation Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You scored {score} out of {scenarios.length} scenarios
              </p>
            </div>

            {/* Final Harmony Score */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Final Team Harmony Score</h3>
                <div className="text-7xl font-bold mb-2 text-indigo-600">
                  {score}/{scenarios.length}
                </div>
                <p className="text-lg text-gray-700 mb-6">
                  {score === 5 ? 'Perfect score! You consistently chose the best responses for team harmony.' :
                    score >= 4 ? 'Excellent! You made mostly great choices for team harmony.' :
                      score >= 3 ? 'Good job! You made some solid choices for team harmony.' :
                        'Keep practicing! Focus on choosing responses that balance opinions, workload, and empathy.'}
                </p>

                {/* Final Meter Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Opinions Balance</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{harmonyMeters.opinions}/100</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${harmonyMeters.opinions >= 70 ? 'bg-green-500' :
                          harmonyMeters.opinions >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`} style={{ width: `${harmonyMeters.opinions}%` }} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Workload Balance</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{harmonyMeters.workload}/100</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${harmonyMeters.workload >= 70 ? 'bg-green-500' :
                          harmonyMeters.workload >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`} style={{ width: `${harmonyMeters.workload}%` }} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Empathy Balance</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{harmonyMeters.empathy}/100</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${harmonyMeters.empathy >= 70 ? 'bg-green-500' :
                          harmonyMeters.empathy >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`} style={{ width: `${harmonyMeters.empathy}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Key Team Harmony Principles
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Balance opinions:</strong> Honor different perspectives while working toward consensus</li>
                <li>• <strong>Fair workload:</strong> Consider everyone's capacity and distribute tasks equitably</li>
                <li>• <strong>Show empathy:</strong> Acknowledge feelings and concerns while maintaining focus on solutions</li>
                <li>• <strong>Integrate perspectives:</strong> Find solutions that incorporate multiple viewpoints rather than choosing sides</li>
                <li>• <strong>Support colleagues:</strong> Ensure team members feel heard and valued during discussions</li>
                <li>• <strong>Focus on solutions:</strong> Move from problem discussion to collaborative problem-solving</li>
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
                    <strong>Model this in department heads' meetings for consistency.</strong> When leaders demonstrate balanced approaches, it creates a culture of harmony:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Lead by example:</strong> Department heads who model balanced responses (opinions, workload, empathy) set the tone for all team meetings. Others learn from watching leaders.</li>
                    <li><strong>Consistent practice:</strong> Regular use of harmonious approaches in department head meetings normalizes these behaviors. Consistency builds culture.</li>
                    <li><strong>Trickle-down effect:</strong> When department heads practice balance, they bring these skills to their own department meetings. Skills spread organically.</li>
                    <li><strong>Shared language:</strong> Using similar approaches across department head meetings creates shared language and expectations for team interactions.</li>
                    <li><strong>Address conflicts early:</strong> Modeling harmony in department head meetings helps address conflicts before they escalate, preventing larger issues.</li>
                    <li><strong>Build trust:</strong> When leaders consistently balance opinions, workload, and empathy, teams trust that their perspectives will be heard and considered.</li>
                    <li><strong>Create standards:</strong> Department head meetings set standards for how team discussions should be conducted. Model the standards you want.</li>
                    <li><strong>Support each other:</strong> Department heads can support each other in practicing harmony, creating a learning community among leaders.</li>
                    <li><strong>Reflect and improve:</strong> Regular reflection on harmony in department head meetings helps continuously improve team dynamics.</li>
                    <li><strong>Systemic change:</strong> Consistent modeling in department head meetings creates systemic change in school culture, not just individual behavior.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you model team harmony in department heads' meetings for consistency, you're creating a culture where balanced approaches become the norm. This modeling spreads throughout the school, improves team dynamics, builds trust, reduces conflict, and creates a more harmonious work environment for everyone. Leadership modeling is one of the most powerful ways to create cultural change.
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

export default TeamHarmonySimulation;