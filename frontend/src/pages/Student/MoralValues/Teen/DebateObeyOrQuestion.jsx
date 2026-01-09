import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateObeyOrQuestion = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-11";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const debateTopics = [
    {
      id: 1,
      scenario: "Does respecting elders mean blind obedience?",
      positions: [
        { id: "respect", text: "FOR: Respect with polite questioning", emoji: "🤝", points: ["Respect and question", "Polite disagreement", "Build understanding"], isCorrect: true },
        { id: "balanced", text: "BALANCED: It depends on the situation", emoji: "⚖️", points: ["Consider context", "Weigh importance", "Choose wisely"], isCorrect: false },
        { id: "obey", text: "AGAINST: Never question elders", emoji: "🙇", points: ["Always obey", "No questions", "Complete respect"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Should students always follow rules, even if unfair?",
      positions: [
        { id: "balanced", text: "BALANCED: Question respectfully", emoji: "⚖️", points: ["Address concerns", "Seek understanding", "Find solutions"], isCorrect: false },
        { id: "question", text: "FOR: Question unfair rules respectfully", emoji: "🗣️", points: ["Stand for justice", "Respectful dialogue", "Seek fairness"], isCorrect: true },
        { id: "follow", text: "AGAINST: Rules are rules", emoji: "📜", points: ["Always follow", "No exceptions", "Just obey"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Is it wrong to question teachers in class?",
      positions: [
        { id: "wrong", text: "AGAINST: Questioning shows disrespect", emoji: "🚫", points: ["Stay quiet", "Accept everything", "Don't challenge"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Ask at appropriate times", emoji: "⚖️", points: ["Choose timing", "Be respectful", "Seek clarity"], isCorrect: false },
        { id: "help", text: "FOR: It helps learning", emoji: "💡", points: ["Deepens understanding", "Clarifies concepts", "Active learning"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Should we obey every instruction from authority?",
      positions: [
        { id: "fair", text: "FOR: Follow what's fair and just", emoji: "⚖️", points: ["Use judgment", "Stand for justice", "Do what's right"], isCorrect: true },
        { id: "always", text: "AGAINST: Authority is always right", emoji: "👮‍♂️", points: ["Blind obedience", "No questions", "Just follow"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Evaluate each situation", emoji: "⚖️", points: ["Consider context", "Think critically", "Decide wisely"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Is it disrespectful to express disagreement?",
      positions: [
        { id: "balanced", text: "BALANCED: Depends on how you express it", emoji: "⚖️", points: ["Tone matters", "Be respectful", "Choose words"], isCorrect: false },
        { id: "rude", text: "AGAINST: Disagreement is rude", emoji: "🙊", points: ["Stay silent", "Avoid conflict", "Never disagree"], isCorrect: false },
        { id: "build", text: "FOR: Respectful disagreement builds understanding", emoji: "🕊️", points: ["Open dialogue", "Mutual respect", "Growth"], isCorrect: true }
      ]
    }
  ];

  const handlePositionSelect = (positionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    const topic = debateTopics[currentRound];
    const isCorrect = topic.positions.find(pos => pos.id === positionId)?.isCorrect;

    setSelectedPosition(positionId);
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastRound = currentRound === debateTopics.length - 1;
    
    if (isLastRound) {
      setGameComplete(true);
      setTimeout(() => setShowResult(true), 500);
    } else {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setSelectedPosition(null);
        setAnswered(false);
      }, 500);
    }
  };

  return (
    <GameShell
      title="Debate: Obey or Question"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/gratitude-story"
      nextGameIdProp="moral-teen-12"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="moral"
    >
      <div className="space-y-8">
        {!showResult && debateTopics[currentRound] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Round {currentRound + 1}/{debateTopics.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{debateTopics.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{debateTopics[currentRound].scenario}</h3>
              <h4 className="text-lg font-semibold text-white/90 mb-4">Take a Position:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {debateTopics[currentRound].positions.map((position) => (
                  <button
                    key={position.id}
                    onClick={() => handlePositionSelect(position.id)}
                    disabled={answered}
                    className={`w-full text-left p-6 rounded-2xl transition-all transform hover:scale-105 border ${
                      answered && selectedPosition === position.id
                        ? position.isCorrect
                          ? "bg-green-500/20 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-red-400 ring-4 ring-red-400"
                        : selectedPosition === position.id
                        ? "bg-blue-500/30 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border-white/20"
                    } ${answered ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{position.emoji}</span>
                      <div className="font-bold text-lg text-white">{position.text}</div>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-white/80">
                      {position.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Debate Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}!
                  You understand the balance between respect and critical thinking!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Respect and questioning can coexist — thoughtful dialogue builds understanding!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, respectful questioning shows critical thinking and maturity!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentRound(0);
                    setScore(0);
                    setSelectedPosition(null);
                    setAnswered(false);
                    setGameComplete(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Respectful questioning helps you learn and grow while showing respect to others.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateObeyOrQuestion;

