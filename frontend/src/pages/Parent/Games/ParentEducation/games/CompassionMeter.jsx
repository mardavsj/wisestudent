import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; //eslint-disable-line
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const CompassionMeter = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-25";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarioResponses, setScenarioResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  // Meaningful compassion scenarios
  const scenarios = [
    {
      id: 1,
      title: "The Tantrum Moment",
      situation: "Your 4-year-old is having a meltdown in the grocery store because you won't buy candy. Other shoppers are staring, and you're feeling embarrassed and frustrated.",
      options: [

        {
          text: "Quickly distract them with pointing out something else interesting in the store",
          compassionScore: 6,
          explanation: "Some compassion in redirecting, but doesn't address the underlying emotion"
        },
        {
          text: "Get stern and tell them to stop crying or we're leaving immediately",
          compassionScore: 2,
          explanation: "Low compassion - dismisses their feelings and uses threats"
        },
        {
          text: "Stay calm, down to their level, and gently explain why we can't have candy right now, validating their feelings",
          compassionScore: 10,
          explanation: "This shows high empathy by acknowledging their feelings while setting boundaries"
        },
      ]
    },
    {
      id: 2,
      title: "Homework Struggles",
      situation: "Your 8-year-old is frustrated with math homework and says 'I'm stupid, I'll never get this!' while tears roll down their cheeks.",
      options: [

        {
          text: "Tell them to keep trying harder and that everyone struggles with math sometimes",
          compassionScore: 5,
          explanation: "Acknowledges difficulty but doesn't fully validate their emotional experience"
        },
        {
          text: "Sit beside them, acknowledge their frustration, and say 'This is challenging, but let's figure it out together'",
          compassionScore: 10,
          explanation: "Shows understanding of their struggle and offers collaborative support"
        },
        {
          text: "Say 'Stop being dramatic, it's just simple math. Try again'",
          compassionScore: 2,
          explanation: "Dismisses their genuine struggle and emotional response"
        }
      ]
    },
    {
      id: 3,
      title: "Sibling Conflict",
      situation: "Your two children (ages 6 and 9) are fighting over who gets to play with the tablet. Both are yelling and neither wants to compromise.",
      options: [
        {
          text: "Help them brainstorm solutions together, asking 'What could work for both of you?' and guiding them to find a fair compromise",
          compassionScore: 10,
          explanation: "Teaches conflict resolution while showing care for both children's needs"
        },
        {
          text: "Take the tablet away and give it to whoever had it first",
          compassionScore: 4,
          explanation: "Solves the immediate problem but misses opportunity to teach compassion and negotiation"
        },
        {
          text: "Yell at both of them to stop fighting and send them to separate rooms",
          compassionScore: 2,
          explanation: "Uses punishment without addressing underlying needs or teaching emotional skills"
        }
      ]
    },
    {
      id: 4,
      title: "Teen Anger",
      situation: "Your 14-year-old slammed their bedroom door after you asked about their failing grades. You can hear them playing loud music inside.",
      options: [

        {
          text: "Wait 30 minutes, then go in and lecture them about responsibility and consequences",
          compassionScore: 5,
          explanation: "Addresses the issue but doesn't acknowledge their emotional state first"
        },
        {
          text: "Bang on the door and demand they come out and explain themselves right now",
          compassionScore: 2,
          explanation: "Escalates the situation and shows little understanding of teenage emotions"
        },
        {
          text: "Give them space to cool down, then knock gently and say 'I'm here when you're ready to talk. I care about you'",
          compassionScore: 9,
          explanation: "Respects their need for space while showing availability and care"
        },
      ]
    },
    {
      id: 5,
      title: "Bedtime Resistance",
      situation: "It's bedtime for your 3-year-old, but they keep getting out of bed asking for water, another story, and their favorite stuffed animal - for the 8th time.",
      options: [
        {
          text: "Patiently walk them back each time with a calm reminder of bedtime rules, offering comfort and understanding their need for security",
          compassionScore: 8,
          explanation: "Balances consistency with empathy for their developmental needs"
        },
        {
          text: "Firmly tell them 'No more getting up' and close the door, ignoring their calls",
          compassionScore: 4,
          explanation: "Maintains boundaries but lacks warmth and understanding of separation anxiety"
        },
        {
          text: "Get frustrated and raise your voice, telling them they're being difficult and selfish",
          compassionScore: 1,
          explanation: "Shows impatience and blames the child for age-appropriate behavior"
        }
      ]
    }
  ];

  // Calculate average compassion score
  const calculateAverageCompassion = () => {
    const responses = Object.values(scenarioResponses);
    if (responses.length === 0) return 0;
    const sum = responses.reduce((acc, response) => acc + (response.compassionScore || 0), 0);
    return (sum / responses.length).toFixed(1);
  };

  // Get reflection based on compassion scores
  const getReflection = () => {
    const avgScore = parseFloat(calculateAverageCompassion());

    if (avgScore >= 8) {
      return {
        title: "Exceptional Compassion",
        message: "Your responses show a deep understanding of compassionate parenting. You consistently choose empathy and understanding over reaction. This creates a nurturing environment for your children.",
        color: "green"
      };
    } else if (avgScore >= 6) {
      return {
        title: "Growing Compassion",
        message: "You're developing strong compassion skills. There are opportunities to practice more empathy in challenging situations, but you're on the right path.",
        color: "blue"
      };
    } else {
      return {
        title: "Opportunities for Growth",
        message: "This exercise highlights areas where compassion can be strengthened. Remember, recognizing these moments is the first step to growth. Every parent faces challenges, and learning to respond with compassion takes practice.",
        color: "orange"
      };
    }
  };

  const handleOptionSelect = (option) => {
    setScenarioResponses(prev => ({
      ...prev,
      [currentScenarioIndex]: option
    }));
  };

  const handleNext = () => {
    if (currentScenarioIndex < totalLevels - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setShowResults(false);
    } else {
      // Show results after completing all scenarios
      setShowResults(true);
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenarioIndex(0);
    setScenarioResponses({});
    setShowResults(false);
    setShowGameOver(false);
  };

  const currentScenario = scenarios[currentScenarioIndex];
  const currentResponse = scenarioResponses[currentScenarioIndex] || null;
  const completedScenariosCount = Object.keys(scenarioResponses).length;
  const progress = ((currentScenarioIndex + 1) / totalLevels) * 100;



  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentScenarioIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Scenario {currentScenarioIndex + 1} of {totalLevels}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {!showResults ? (
          <>
            {/* Scenario information */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentScenario.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentScenario.situation}
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  How would you respond?
                </p>
                <p className="text-sm text-gray-600">
                  Choose the response that reflects the most compassionate approach
                </p>
              </div>
            </div>

            {/* Response options */}
            <div className="space-y-4 mb-6">
              {currentScenario.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(option)}
                  className={`bg-white rounded-xl p-6 shadow-lg border-2 cursor-pointer transition-all ${currentResponse && currentResponse.text === option.text
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{option.text}</p>

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Next button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!currentResponse}
              className={`w-full px-6 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all ${currentResponse
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {currentScenarioIndex < totalLevels - 1 ? 'Continue to Next Scenario' : "See My Compassion Results"}
            </motion.button>
          </>
        ) : (
          /* Results view */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Summary stats */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-indigo-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  Your Compassion Assessment Results
                </h2>

                <div className="bg-white rounded-xl p-6 shadow-lg text-center mb-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {calculateAverageCompassion()} / 10
                  </div>
                  <div className="text-lg text-gray-700">Average Compassion Score</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {Object.values(scenarioResponses).filter(r => r.compassionScore >= 8).length}
                    </div>
                    <div className="text-sm text-gray-600">High Compassion Responses</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {Object.values(scenarioResponses).filter(r => r.compassionScore >= 4 && r.compassionScore < 8).length}
                    </div>
                    <div className="text-sm text-gray-600">Moderate Responses</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {Object.values(scenarioResponses).filter(r => r.compassionScore < 4).length}
                    </div>
                    <div className="text-sm text-gray-600">Growth Opportunities</div>
                  </div>
                </div>
              </div>

              {/* Detailed breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Responses:</h3>
                <div className="space-y-4">
                  {scenarios.map((scenario, index) => {
                    const response = scenarioResponses[index];
                    return (
                      <div key={scenario.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <h4 className="font-semibold text-gray-800 mb-2">{scenario.title}</h4>
                        <p className="text-gray-700 mb-2">Scenario: {scenario.situation}</p>
                        {response ? (
                          <div>
                            <p className="text-gray-800 mb-1"><strong>Your Choice:</strong> {response.text}</p>
                            <p className="text-sm text-gray-600 mb-1">Compassion Score: <span className="font-medium">{response.compassionScore}/10</span></p>
                            <p className="text-sm text-gray-600 italic">{response.explanation}</p>
                          </div>
                        ) : (
                          <p className="text-red-600">No response recorded</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reflection */}
              {(() => {
                const reflection = getReflection();
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    delay={0.3}
                    className={`p-6 rounded-xl border-2 ${reflection.color === 'green' ? 'bg-green-50 border-green-200' :
                        reflection.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                          'bg-orange-50 border-orange-200'
                      }`}
                  >
                    <h3 className={`text-xl font-bold mb-3 ${reflection.color === 'green' ? 'text-green-800' :
                        reflection.color === 'blue' ? 'text-blue-800' :
                          'text-orange-800'
                      }`}>
                      💡 {reflection.title}
                    </h3>
                    <p className={`${reflection.color === 'green' ? 'text-green-700' :
                        reflection.color === 'blue' ? 'text-blue-700' :
                          'text-orange-700'
                      } leading-relaxed`}>
                      {reflection.message}
                    </p>
                  </motion.div>
                );
              })()}

              {/* Parent tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.5}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> Compassionate parenting grows through practice. Recognize that every parent faces these challenges, and responding with empathy takes conscious effort. Each time you pause to consider your child's perspective, you're strengthening your compassion muscle.
                </p>
              </motion.div>
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
      currentLevel={currentScenarioIndex + 1}
      score={completedScenariosCount}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default CompassionMeter;