import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateRespectTeachers = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-17";
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
      scenario: "Should students argue rudely with teachers?",
      positions: [
        { id: "respect", text: "FOR: Disagree respectfully, not rudely", emoji: "🙏", points: ["Show respect", "Polite disagreement", "Build dialogue"], isCorrect: true },
        { id: "balanced", text: "BALANCED: It depends on the situation", emoji: "⚖️", points: ["Consider context", "Choose approach", "Be thoughtful"], isCorrect: false },
        { id: "rude", text: "AGAINST: Students have rights too", emoji: "💪", points: ["Stand your ground", "Express freely", "No filters"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Is it okay to interrupt a teacher while they're explaining?",
      positions: [
        { id: "balanced", text: "BALANCED: Sometimes urgent questions need answers", emoji: "⚖️", points: ["Urgent cases", "Use judgment", "Be considerate"], isCorrect: false },
        { id: "wait", text: "FOR: Wait and share politely later", emoji: "🤝", points: ["Show respect", "Wait your turn", "Better learning"], isCorrect: true },
        { id: "interrupt", text: "AGAINST: If I think they're wrong", emoji: "🗣️", points: ["Correct immediately", "No waiting", "Speak up"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Should students gossip about teachers online?",
      positions: [
        { id: "freedom", text: "AGAINST: It's freedom of speech", emoji: "💬", points: ["Free expression", "Online privacy", "Your right"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Depends on what you say", emoji: "⚖️", points: ["Consider impact", "Be mindful", "Think first"], isCorrect: false },
        { id: "respect", text: "FOR: It spreads disrespect", emoji: "🚫", points: ["Shows disrespect", "Harms reputation", "Unkind behavior"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Is obeying teachers the same as respecting them?",
      positions: [
        { id: "understand", text: "FOR: Respect means understanding, not blind obedience", emoji: "🧠", points: ["True respect", "Critical thinking", "Mutual understanding"], isCorrect: true },
        { id: "obey", text: "AGAINST: You must always obey", emoji: "🙇", points: ["Complete obedience", "No questions", "Just follow"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Both matter in different ways", emoji: "⚖️", points: ["Balance both", "Respect and follow", "Find middle"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Should teachers and students treat each other equally?",
      positions: [
        { id: "balanced", text: "BALANCED: Equal respect, different roles", emoji: "⚖️", points: ["Respect both ways", "Different roles", "Mutual dignity"], isCorrect: false },
        { id: "dominate", text: "AGAINST: Teachers should always dominate", emoji: "👑", points: ["Authority first", "Teachers lead", "Students follow"], isCorrect: false },
        { id: "mutual", text: "FOR: Mutual respect creates better learning", emoji: "🤗", points: ["Better learning", "Open dialogue", "Shared respect"], isCorrect: true }
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
      title="Debate: Respect Teachers"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/roleplay-respect-leader"
      nextGameIdProp="moral-teen-18"
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
                  You understand respectful communication with teachers!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Respectful communication builds trust and creates better learning environments!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, respect and communication go hand in hand!
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
                  Tip: Respectful disagreement shows maturity and helps build positive relationships with teachers.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateRespectTeachers;

