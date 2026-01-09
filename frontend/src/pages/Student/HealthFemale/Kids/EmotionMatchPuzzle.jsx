import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionMatchPuzzle = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-54";
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Emotions (left side) - 5 items
  const emotions = [
    { id: 1, name: "Happy", emoji: "😃",  },
    { id: 2, name: "Sad", emoji: "😢",  },
    { id: 3, name: "Angry", emoji: "😠",  },
    { id: 4, name: "Scared", emoji: "😨",  },
    { id: 5, name: "Surprised", emoji: "😲",  }
  ];
  
  // Descriptions (right side) - 5 items (shuffled order)
  const descriptions = [
    { id: 3, text: "Feeling furious or irritated",  },
    { id: 5, text: "Feeling amazed or astonished",  },
    { id: 1, text: "Feeling joyful and pleased",  },
    { id: 4, text: "Feeling afraid or frightened",  },
    { id: 2, text: "Feeling unhappy or sorrowful",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { emotionId: 1, descriptionId: 1 }, // Happy → Feeling joyful and pleased
    { emotionId: 2, descriptionId: 2 }, // Sad → Feeling unhappy or sorrowful
    { emotionId: 3, descriptionId: 3 }, // Angry → Feeling furious or irritated
    { emotionId: 4, descriptionId: 4 }, // Scared → Feeling afraid or frightened
    { emotionId: 5, descriptionId: 5 }  // Surprised → Feeling amazed or astonished
  ];
  
  const handleEmotionSelect = (emotion) => {
    if (gameFinished) return;
    setSelectedEmotion(emotion);
  };
  
  const handleDescriptionSelect = (description) => {
    if (gameFinished) return;
    setSelectedDescription(description);
  };
  
  const handleMatch = () => {
    if (!selectedEmotion || !selectedDescription || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      emotionId: selectedEmotion.id,
      descriptionId: selectedDescription.id,
      isCorrect: correctMatches.some(
        match => match.emotionId === selectedEmotion.id && match.descriptionId === selectedDescription.id
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
    setSelectedDescription(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedEmotion(null);
    setSelectedDescription(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/kids");
  };
  
  // Check if an emotion is already matched
  const isEmotionMatched = (emotionId) => {
    return matches.some(match => match.emotionId === emotionId);
  };
  
  // Check if a description is already matched
  const isDescriptionMatched = (descriptionId) => {
    return matches.some(match => match.descriptionId === descriptionId);
  };
  
  // Get match result for an emotion
  const getMatchResult = (emotionId) => {
    const match = matches.find(m => m.emotionId === emotionId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Emotion Match Puzzle"
      subtitle={gameFinished ? "Game Complete!" : `Match Emotions with Descriptions (${matches.length}/${emotions.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={emotions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/sharing-story"
      nextGameIdProp="health-female-kids-55">
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
                        <p className="text-white/80 text-sm">{emotion.hint}</p>
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
                  disabled={!selectedEmotion || !selectedDescription}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedEmotion && selectedDescription
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
            
            {/* Right column - Descriptions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Descriptions</h3>
              <div className="space-y-4">
                {descriptions.map(description => (
                  <button
                    key={description.id}
                    onClick={() => handleDescriptionSelect(description)}
                    disabled={isDescriptionMatched(description.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isDescriptionMatched(description.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedDescription?.id === description.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{description.text}</h4>
                        <p className="text-white/80 text-sm">{description.hint}</p>
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
                  You correctly matched {score} out of {emotions.length} emotions with their descriptions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding emotions helps us express ourselves better and connect with others!
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
                  Tip: Think about how each emotion feels and what situations might cause that feeling!
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