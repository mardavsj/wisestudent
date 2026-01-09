import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateLyingForFriend = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-6";
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
      scenario: "Is lying okay to protect a friend?",
      positions: [
        { id: "truth", text: "FOR: Truth matters even in friendship", emoji: "💎", points: ["Builds trust", "Shows integrity", "Long-term respect"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Consider the situation", emoji: "⚖️", points: ["Depends on context", "Weigh consequences", "Choose wisely"], isCorrect: false },
        { id: "lie", text: "AGAINST: Loyalty to friends comes first", emoji: "🤝", points: ["Protect friends", "Friendship matters", "Stand together"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Is cheating in exams ever justified?",
      positions: [
        { id: "balanced", text: "BALANCED: Sometimes pressure is real", emoji: "⚖️", points: ["Understand pressure", "Consider circumstances", "Find alternatives"], isCorrect: false },
        { id: "honesty", text: "FOR: Honesty matters more than grades", emoji: "🎓", points: ["Builds character", "True learning", "Self-respect"], isCorrect: true },
        { id: "cheat", text: "AGAINST: Pressure makes it okay sometimes", emoji: "📚", points: ["High expectations", "Everyone does it", "Just this once"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Should you speak up if your friend bullies someone?",
      positions: [
        { id: "silent", text: "AGAINST: Stay out of it", emoji: "🙊", points: ["Not your problem", "Avoid conflict", "Stay neutral"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Talk to friend privately", emoji: "⚖️", points: ["Address privately", "Help them understand", "Guide gently"], isCorrect: false },
        { id: "speak", text: "FOR: Silence supports wrong", emoji: "🗣️", points: ["Stand for justice", "Protect victims", "Show courage"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Would you return a lost wallet if no one saw you?",
      positions: [
        { id: "return", text: "FOR: Integrity is doing right unseen", emoji: "💼", points: ["True character", "Do what's right", "Build trust"], isCorrect: true },
        { id: "keep", text: "AGAINST: Finders keepers", emoji: "😏", points: ["No one saw", "Your luck", "Free money"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Try to find owner first", emoji: "⚖️", points: ["Make effort", "Then decide", "Be reasonable"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Is it okay to gossip if it's true?",
      positions: [
        { id: "balanced", text: "BALANCED: Depends on intent", emoji: "⚖️", points: ["Context matters", "Consider impact", "Be thoughtful"], isCorrect: false },
        { id: "gossip", text: "AGAINST: Truth isn't gossip", emoji: "🗞️", points: ["Facts are facts", "Sharing information", "Not harmful"], isCorrect: false },
        { id: "respect", text: "FOR: It still harms others' image", emoji: "🤐", points: ["Respect privacy", "Avoid harm", "Show integrity"], isCorrect: true }
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
      title="Debate: Lying for Friend"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/integrity-journal"
      nextGameIdProp="moral-teen-7"
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
                  You understand the importance of integrity and truth!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Truth and integrity build trust and respect, even when it's difficult!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, integrity means doing the right thing even when it's hard!
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
                  Tip: Integrity means being honest and doing what's right, even when no one is watching.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateLyingForFriend;

