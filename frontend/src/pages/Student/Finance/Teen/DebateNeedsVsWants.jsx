import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const DebateNeedsVsWants = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-16";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const debateTopics = [
    {
      id: 1,
      scenario: "Should a teenager buy the latest smartphone or use their current phone that works fine?",
      positions: [
        { id: 'latest', text: "Buy the latest smartphone", points: [
          "Staying connected with friends and family is important",
          "Newer phones have better cameras for documenting memories",
          "Technology skills are important for future careers"
        ], isCorrect: true},
        { id: 'upgrade', text: "Upgrade when truly needed", points: [
          "Wait until current phone has significant limitations",
          "Research if new features justify the cost",
          "Consider refurbished or previous generation models"
        ], isCorrect: false},
        { id: 'keep', text: "Keep using the current phone", points: [
          "The current phone meets basic communication needs",
          "Money could be saved for more important future goals",
          "Frequent upgrades contribute to electronic waste"
        ], isCorrect: false}
      ],
      reflection: "Consider both staying connected AND financial responsibility. A newer phone might help with career preparation, but your current phone likely meets essential needs."
    },
    {
      id: 2,
      scenario: "Is joining an expensive sports team worth the cost if it improves physical fitness and social connections?",
      positions: [
        { id: 'middle', text: "Find middle ground", points: [
          "Look for moderately priced sports programs",
          "Consider seasonal participation instead of year-round",
          "Explore scholarship or financial aid options"
        ], isCorrect: false},
        { id: 'expensive', text: "Join the expensive sports team", points: [
          "Physical fitness is crucial for long-term health",
          "Team participation builds valuable social skills",
          "Sports can lead to college scholarships"
        ], isCorrect: true},
        { id: 'free', text: "Choose free/low-cost fitness activities", points: [
          "Many free activities provide similar fitness benefits",
          "Expensive commitments can strain family finances",
          "Community sports leagues offer social connections too"
        ], isCorrect: false}
      ],
      reflection: "Both physical health and financial stability matter. Consider if the benefits justify the cost compared to alternatives."
    },
    {
      id: 3,
      scenario: "Should teenagers prioritize saving for college or enjoying experiences now?",
      positions: [
        { id: 'enjoy', text: "Enjoy experiences while young", points: [
          "Memories from experiences last longer than material possessions",
          "Learning financial balance includes reasonable enjoyment",
          "Future earning potential may offset current savings"
        ], isCorrect: false},
        { id: 'mix', text: "Save some, enjoy some", points: [
          "Allocate a percentage for savings and experiences",
          "Prioritize meaningful experiences over impulse spending",
          "Build savings while still creating valuable memories"
        ], isCorrect: true},
        { id: 'save', text: "Prioritize saving for college", points: [
          "College costs continue rising and require significant savings",
          "Starting early maximizes compound interest benefits",
          "Financial stress during college affects academic performance"
        ], isCorrect: false}
      ],
      reflection: "Finding balance is key. Both saving for future goals and enjoying present moments contribute to well-being."
    },
    {
      id: 4,
      scenario: "Is eating out regularly a reasonable expense or financial waste?",
      positions: [
        { id: 'home', text: "Cooking at home most of the time", points: [
          "Home-cooked meals are typically much more economical",
          "Cooking develops life skills and promotes healthier eating",
          "Regular restaurant spending can quickly deplete budgets"
        ], isCorrect: true},
        { id: 'out', text: "Eating out regularly", points: [
          "Cooking skills take time to develop and aren't always practical",
          "Social dining strengthens relationships with friends/family",
          "Supporting local businesses contributes to community economy"
        ], isCorrect: false},
        { id: 'both', text: "Mix of both approaches", points: [
          "Cook at home for regular meals, dine out for special occasions",
          "Learn basic cooking skills to reduce restaurant dependency",
          "Set a monthly dining out budget to control spending"
        ], isCorrect: false}
      ],
      reflection: "Balance convenience and social connection with financial responsibility. Occasional dining out can fit in a healthy budget."
    },
    {
      id: 5,
      scenario: "Should teenagers invest in branded clothing or choose affordable alternatives?",
      positions: [
        { id: 'mix', text: "Mix quality and affordability", points: [
          "Invest in key pieces that need durability",
          "Choose affordable options for trendy items",
          "Focus on style and fit rather than brand names"
        ], isCorrect: true},
        { id: 'affordable', text: "Choose affordable clothing", points: [
          "Personal style matters more than brand labels",
          "Money saved can be invested in experiences or education",
          "Brand loyalty often reflects marketing influence rather than value"
        ], isCorrect: false},
        { id: 'branded', text: "Invest in branded clothing", points: [
          "Quality branded items last longer, offering better value over time",
          "Professional appearance can impact job interviews and opportunities",
          "Self-confidence from looking good can improve performance"
        ], isCorrect: false}
      ],
      reflection: "Consider both self-expression and financial prudence. Quality matters, but brand names don't guarantee value."
    }
  ];

  const handlePositionSelect = (positionId) => {
    if (answered) return;
    
    resetFeedback();
    setSelectedPosition(positionId);
    setAnswered(true);
    
    // Check if the selected position is correct
    const currentTopic = debateTopics[currentRound];
    const selectedPositionObj = currentTopic.positions.find(pos => pos.id === positionId);
    const isCorrect = selectedPositionObj && selectedPositionObj.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowReflection(true);

    setTimeout(() => {
      setShowReflection(false);
      const isLastQuestion = currentRound >= debateTopics.length - 1;
      if (isLastQuestion) {
        // Game is complete
        setGameComplete(true);
      } else {
        setCurrentRound(currentRound + 1);
        setSelectedPosition(null);
        setAnswered(false);
      }
    }, 2000);
  };

  const currentTopic = debateTopics[currentRound];
  const isGameComplete = gameComplete;

  return (
    <GameShell
      title="Debate: Needs vs Wants"
      subtitle={isGameComplete ? "Debate Complete!" : `Scenario ${currentRound + 1} of ${debateTopics.length}`}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/journal-of-spending"
      nextGameIdProp="finance-teens-17"
      gameType="finance"
      totalLevels={debateTopics.length}
      currentLevel={currentRound + 1}
      coinsPerLevel={coinsPerLevel}
      score={score}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={isGameComplete}
      showConfetti={isGameComplete && score === debateTopics.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="text-center text-white space-y-8">
        {!isGameComplete && currentTopic && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-white">Scenario:</h3>
              <p className="mb-6 text-white/90 text-lg">{currentTopic.scenario}</p>
              
              <h4 className="text-lg font-semibold mb-4 text-white">Take a Position:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {currentTopic.positions.map((position) => (
                  <button
                    key={position.id}
                    onClick={() => handlePositionSelect(position.id)}
                    disabled={answered}
                    className={`w-full text-left p-4 rounded-lg transition duration-200 border ${
                      answered
                        ? position.isCorrect
                          ? 'bg-green-500/30 border-green-400 ring-4 ring-green-400'
                          : selectedPosition === position.id
                          ? 'bg-red-500/20 border-red-400 ring-4 ring-red-400'
                          : 'bg-white/5 border-white/20 opacity-50'
                        : selectedPosition === position.id
                        ? 'bg-indigo-500/50 border-indigo-300'
                        : 'bg-blue-500/30 hover:bg-blue-500/40 border-blue-300/50 hover:border-blue-300'
                    } ${answered ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-medium mb-2 text-white">{position.text}</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-white/90">
                      {position.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              
              {showReflection && (
                <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-300 mb-2">Reflection:</h4>
                  <p className="text-yellow-200">{currentTopic.reflection}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <span className="text-white/80">
                Scenario {currentRound + 1} of {debateTopics.length}
              </span>
              <span className="font-medium text-yellow-400">
                Score: {score}/{debateTopics.length}
              </span>
            </div>
          </div>
        )}

        {isGameComplete && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">
              {score === debateTopics.length ? "🏆" : score >= 3 ? "🎉" : "💪"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Debate Complete!</h2>
            <p className="text-white/90 text-lg mb-6">
              You completed all {debateTopics.length} scenarios!
            </p>
            <div className="mb-6">
              <p className="text-2xl font-bold text-white mb-2">
                Final Score: {score}/{debateTopics.length}
              </p>
              <p className="text-white/90 text-lg">
                {score === debateTopics.length 
                  ? "Perfect! You've thought through all the scenarios!" 
                  : score >= 3 
                  ? "Great job! You understand the balance between needs and wants!" 
                  : "Keep learning about balancing needs and wants!"}
              </p>
            </div>
            {score >= 3 && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
                <span>+{score} Coins</span>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateNeedsVsWants;