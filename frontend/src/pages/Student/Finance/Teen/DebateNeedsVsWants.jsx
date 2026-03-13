import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GameShell from '../GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const DebateNeedsVsWants = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-16";
  const gameData = getGameDataById(gameId);
  const gameContent = t("financial-literacy.teens.debate-needs-vs-wants", { returnObjects: true });
  
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

  const debateTopics = Array.isArray(gameContent?.debateTopics) ? gameContent.debateTopics : [];

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
    }, 8000); // Same delay as original
  };

  const currentTopic = debateTopics[currentRound];
  const isGameComplete = gameComplete;

  return (
    <GameShell
      title={gameContent?.title || "Debate: Needs vs Wants"}
      subtitle={isGameComplete 
        ? (gameContent?.subtitleComplete || "Debate Complete!")
        : t("financial-literacy.teens.debate-needs-vs-wants.subtitleProgress", {
            current: currentRound + 1,
            total: debateTopics.length,
            defaultValue: "Scenario {{current}} of {{total}}"
          })
      }
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
              <h3 className="text-xl font-bold mb-4 text-white">
                {gameContent?.scenarioLabel || "Scenario:"}
              </h3>
              <p className="mb-6 text-white/90 text-lg">{currentTopic.scenario}</p>
              
              <h4 className="text-lg font-semibold mb-4 text-white">
                {gameContent?.takePositionLabel || "Take a Position:"}
              </h4>
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
                  <h4 className="font-semibold text-yellow-300 mb-2">
                    {gameContent?.reflectionLabel || "Reflection:"}
                  </h4>
                  <p className="text-yellow-200">{currentTopic.reflection}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <span className="text-white/80">
                {t("financial-literacy.teens.debate-needs-vs-wants.roundLabel", {
                  current: currentRound + 1,
                  total: debateTopics.length,
                  defaultValue: "Scenario {{current}} of {{total}}"
                })}
              </span>
              <span className="font-medium text-yellow-400">
                {t("financial-literacy.teens.debate-needs-vs-wants.scoreLabel", {
                  score,
                  total: debateTopics.length,
                  defaultValue: "Score: {{score}}/{{total}}"
                })}
              </span>
            </div>
          </div>
        )}

        {isGameComplete && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">
              {score === debateTopics.length ? "🏆" : score >= 3 ? "🎉" : "💪"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameContent?.subtitleComplete || "Debate Complete!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {t("financial-literacy.teens.debate-needs-vs-wants.result.completionMessage", {
                total: debateTopics.length,
                defaultValue: "You completed all {{total}} scenarios!"
              })}
            </p>
            <div className="mb-6">
              <p className="text-2xl font-bold text-white mb-2">
                {t("financial-literacy.teens.debate-needs-vs-wants.result.finalScoreLabel", {
                  score,
                  total: debateTopics.length,
                  defaultValue: "Final Score: {{score}}/{{total}}"
                })}
              </p>
              <p className="text-white/90 text-lg">
                {score === debateTopics.length 
                  ? (gameContent?.result?.perfectScoreMessage || "Perfect! You've thought through all the scenarios!") 
                  : score >= 3 
                  ? (gameContent?.result?.goodScoreMessage || "Great job! You understand the balance between needs and wants!") 
                  : (gameContent?.result?.lowScoreMessage || "Keep learning about balancing needs and wants!")}
              </p>
            </div>
            {score >= 3 && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
                <span>
                  {t("financial-literacy.teens.debate-needs-vs-wants.result.coinsEarned", {
                    score,
                    defaultValue: "+{{score}} Coins"
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateNeedsVsWants;