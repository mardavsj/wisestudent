import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchFeelings2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Emotions (left side) - 5 items
  const emotions = [
    { id: 1, name: "Sadness", emoji: "😢",  },
    { id: 2, name: "Anger", emoji: "😠",  },
    { id: 3, name: "Anxiety", emoji: "😰",  },
    { id: 4, name: "Joy", emoji: "😄",  },
    { id: 5, name: "Frustration", emoji: "😤",  }
  ];

  // Responses (right side) - 5 items
  const responses = [
    { id: 1, name: "Talk to a friend", emoji: "💬" },
    { id: 3, name: "Practice mindfulness", emoji: "🧘" },
    { id: 2, name: "Take deep breaths", emoji: "🌬️" },
    { id: 5, name: "Take a break", emoji: "⏸️" },
    { id: 4, name: "Share with others", emoji: "🤗" },
  ];

  // Correct matches
  const correctMatches = [
    { emotionId: 1, responseId: 1 }, // Sadness → Talk to a friend
    { emotionId: 2, responseId: 2 }, // Anger → Take deep breaths
    { emotionId: 3, responseId: 3 }, // Anxiety → Practice mindfulness
    { emotionId: 4, responseId: 4 }, // Joy → Share with others
    { emotionId: 5, responseId: 5 }  // Frustration → Take a break
  ];

  const handleEmotionSelect = (emotion) => {
    if (gameFinished) return;
    setSelectedEmotion(emotion);
  };

  const handleResponseSelect = (response) => {
    if (gameFinished) return;
    setSelectedResponse(response);
  };

  const handleMatch = () => {
    if (!selectedEmotion || !selectedResponse || gameFinished) return;

    resetFeedback();

    const newMatch = {
      emotionId: selectedEmotion.id,
      responseId: selectedResponse.id,
      isCorrect: correctMatches.some(
        match => match.emotionId === selectedEmotion.id && match.responseId === selectedResponse.id
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
    setSelectedResponse(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedEmotion(null);
    setSelectedResponse(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  // Check if an emotion is already matched
  const isEmotionMatched = (emotionId) => {
    return matches.some(match => match.emotionId === emotionId);
  };

  // Check if a response is already matched
  const isResponseMatched = (responseId) => {
    return matches.some(match => match.responseId === responseId);
  };

  // Get match result for an emotion
  const getMatchResult = (emotionId) => {
    const match = matches.find(m => m.emotionId === emotionId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Feelings"
      subtitle={gameFinished ? "Game Complete!" : `Match Emotions with Healthy Responses (${matches.length}/${emotions.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-kids-44"
      gameType="civic-responsibility"
      totalLevels={emotions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
      maxScore={emotions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
                  disabled={!selectedEmotion || !selectedResponse}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedEmotion && selectedResponse
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

            {/* Right column - Responses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Healthy Responses</h3>
              <div className="space-y-4">
                {responses.map(response => (
                  <button
                    key={response.id}
                    onClick={() => handleResponseSelect(response)}
                    disabled={isResponseMatched(response.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isResponseMatched(response.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedResponse?.id === response.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{response.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{response.name}</h4>
                        <p className="text-white/80 text-sm">{response.description}</p>
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
                  You correctly matched {score} out of {emotions.length} emotions with healthy responses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Recognizing emotions and knowing healthy ways to respond helps with emotional well-being!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {emotions.length} emotions correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what healthy responses work best for each type of emotion!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchFeelings2;