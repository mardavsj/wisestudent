import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BuildToolboxPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Emotions/Stressors (left side) - 5 items with hints
  const emotions = [
    { id: 1, name: "Anxiety", emoji: "😰",  },
    { id: 2, name: "Anger", emoji: "😠",  },
    { id: 3, name: "Sadness", emoji: "😢",  },
    { id: 4, name: "Overwhelm", emoji: "😵",  },
    { id: 5, name: "Loneliness", emoji: "😔",  }
  ];

  // Regulation Techniques (right side) - 5 items with descriptions
  const techniques = [
    { id: 6, name: "Deep Breathing", emoji: "💨",  },
    { id: 7, name: "Physical Exercise", emoji: "🏃",  },
    { id: 8, name: "Journal Writing", emoji: "📝",  },
    { id: 9, name: "Mindfulness Meditation", emoji: "🧘",  },
    { id: 10, name: "Social Connection", emoji: "👥",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedTechniques = [
    techniques[2], // Journal Writing (id: 8)
    techniques[4], // Social Connection (id: 10)
    techniques[1], // Physical Exercise (id: 7)
    techniques[0], // Deep Breathing (id: 6)
    techniques[3]  // Mindfulness Meditation (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each emotion has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { emotionId: 1, techniqueId: 6 }, // Anxiety → Deep Breathing
    { emotionId: 2, techniqueId: 7 }, // Anger → Physical Exercise
    { emotionId: 3, techniqueId: 8 }, // Sadness → Journal Writing
    { emotionId: 4, techniqueId: 9 }, // Overwhelm → Mindfulness Meditation
    { emotionId: 5, techniqueId: 10 } // Loneliness → Social Connection
  ];

  const handleEmotionSelect = (emotion) => {
    if (gameFinished) return;
    setSelectedEmotion(emotion);
  };

  const handleTechniqueSelect = (technique) => {
    if (gameFinished) return;
    setSelectedTechnique(technique);
  };

  const handleMatch = () => {
    if (!selectedEmotion || !selectedTechnique || gameFinished) return;

    resetFeedback();

    const newMatch = {
      emotionId: selectedEmotion.id,
      techniqueId: selectedTechnique.id,
      isCorrect: correctMatches.some(
        match => match.emotionId === selectedEmotion.id && match.techniqueId === selectedTechnique.id
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
    setSelectedTechnique(null);
  };

  // Check if an emotion is already matched
  const isEmotionMatched = (emotionId) => {
    return matches.some(match => match.emotionId === emotionId);
  };

  // Check if a technique is already matched
  const isTechniqueMatched = (techniqueId) => {
    return matches.some(match => match.techniqueId === techniqueId);
  };

  // Get match result for an emotion
  const getMatchResult = (emotionId) => {
    const match = matches.find(m => m.emotionId === emotionId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Build Toolbox Puzzle"
      subtitle={gameFinished ? "Toolbox Complete!" : `Match Emotions with Techniques (${matches.length}/${emotions.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-49"
      nextGamePathProp="/student/uvls/teen/emotional-responder-badge"
      nextGameIdProp="uvls-teen-50"
      gameType="uvls"
      totalLevels={emotions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === emotions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={emotions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Emotions/Stressors */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Emotions/Stressors</h3>
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
                    : "Select an Emotion/Stressor"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedEmotion || !selectedTechnique}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedEmotion && selectedTechnique
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

            {/* Right column - Regulation Techniques */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Regulation Techniques</h3>
              <div className="space-y-4">
                {rearrangedTechniques.map(technique => (
                  <button
                    key={technique.id}
                    onClick={() => handleTechniqueSelect(technique)}
                    disabled={isTechniqueMatched(technique.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTechniqueMatched(technique.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedTechnique?.id === technique.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{technique.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{technique.name}</h4>
                        <p className="text-white/80 text-sm">{technique.description}</p>
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
                  You correctly matched {score} out of {emotions.length} emotions with regulation techniques!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Building an emotional regulation toolbox with different techniques helps you manage various feelings!
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
                  Tip: Think about what techniques would help you when experiencing different emotions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BuildToolboxPuzzle;