import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmotionMatchPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-54";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedExpression, setSelectedExpression] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Emotions (left side) - 5 items
  const emotions = [
    { id: 1, name: "Happy", emoji: "😊",  },
    { id: 2, name: "Sad", emoji: "😢",  },
    { id: 3, name: "Angry", emoji: "😠",  },
    { id: 4, name: "Scared", emoji: "😨",  },
    { id: 5, name: "Surprised", emoji: "😲",  },
  ];

  // Expressions (right side) - 5 items
  const expressions = [
    { id: 3, name: "Frown", emoji: "😞", description: "Downward mouth curve" },
    { id: 5, name: "Open Mouth", emoji: "😮", description: "Eyes and mouth wide" },
    { id: 1, name: "Big Smile", emoji: "😄", description: "Cheerful facial display" },
    { id: 4, name: "Wide Eyes", emoji: "😱", description: "Fearful eye expression" },
    { id: 2, name: "Tearful", emoji: "😭", description: "Crying with tears" }
  ];

  // Correct matches
  const correctMatches = [
    { emotionId: 1, expressionId: 1 }, // Happy → Big Smile
    { emotionId: 2, expressionId: 2 }, // Sad → Tearful
    { emotionId: 3, expressionId: 3 }, // Angry → Frown
    { emotionId: 4, expressionId: 4 }, // Scared → Wide Eyes
    { emotionId: 5, expressionId: 5 }  // Surprised → Open Mouth
  ];

  const handleEmotionSelect = (emotion) => {
    if (gameFinished) return;
    setSelectedEmotion(emotion);
  };

  const handleExpressionSelect = (expression) => {
    if (gameFinished) return;
    setSelectedExpression(expression);
  };

  const handleMatch = () => {
    if (!selectedEmotion || !selectedExpression || gameFinished) return;

    resetFeedback();

    const newMatch = {
      emotionId: selectedEmotion.id,
      expressionId: selectedExpression.id,
      isCorrect: correctMatches.some(
        match => match.emotionId === selectedEmotion.id && match.expressionId === selectedExpression.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add score and show flash/confetti
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === emotions.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedEmotion(null);
    setSelectedExpression(null);
  };

  // Check if an emotion is already matched
  const isEmotionMatched = (emotionId) => {
    return matches.some(match => match.emotionId === emotionId);
  };

  // Check if an expression is already matched
  const isExpressionMatched = (expressionId) => {
    return matches.some(match => match.expressionId === expressionId);
  };

  // Get match result for an emotion
  const getMatchResult = (emotionId) => {
    const match = matches.find(m => m.emotionId === emotionId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Emotion Match Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Emotions with Expressions (${matches.length}/${emotions.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/sharing-story"
      nextGameIdProp="health-male-kids-55"
      gameType="health-male"
      totalLevels={emotions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === emotions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/kids"
      maxScore={emotions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Emotions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Emotions</h3>
              <div className="space-y-4">
                {emotions.map(emotion => (
                  <button
                    key={emotion.id}
                    onClick={() => handleEmotionSelect(emotion)}
                    disabled={isEmotionMatched(emotion.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isEmotionMatched(emotion.id)
                        ? getMatchResult(emotion.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedEmotion?.id === emotion.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{emotion.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{emotion.name}</h4>
                        <p className="text-white/80 text-sm">{emotion.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedEmotion 
                    ? `Selected: ${selectedEmotion.name}` 
                    : "Select an Emotion"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedEmotion || !selectedExpression}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedEmotion && selectedExpression
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{emotions.length}</p>
                  <p>Matched: {matches.length}/{emotions.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Expressions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Facial Expressions</h3>
              <div className="space-y-4">
                {expressions.map(expression => (
                  <button
                    key={expression.id}
                    onClick={() => handleExpressionSelect(expression)}
                    disabled={isExpressionMatched(expression.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isExpressionMatched(expression.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedExpression?.id === expression.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{expression.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{expression.name}</h4>
                        <p className="text-white/80 text-sm">{expression.description}</p>
                      </div>
                    </div>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {emotions.length} emotions with their expressions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Recognizing emotions in others helps us understand and connect with them better!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {emotions.length} emotions correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Pay attention to facial features like mouth shape and eye expression!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionMatchPuzzle;

