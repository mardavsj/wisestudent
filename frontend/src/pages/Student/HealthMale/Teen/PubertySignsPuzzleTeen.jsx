import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertySignsPuzzleTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-24";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);
  const [selectedChange, setSelectedChange] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Puberty Signs (left side) - 5 items
const signs = [
  { id: 1, name: "Voice Changes", emoji: "🗣️" },
  { id: 2, name: "Skin Changes", emoji: "🧴" },
  { id: 3, name: "Height Growth", emoji: "📈" },
  { id: 4, name: "Hair Growth", emoji: "🧔" },
  { id: 5, name: "Emotion Shifts", emoji: "🎭" },
];

// Body Changes (right side) - 5 items (harder / less obvious)
const changes = [
  { id: 5, name: "Hormonal Mood Fluctuations", emoji: "😵" }, // Emotion
  { id: 3, name: "Sudden Growth Spurt", emoji: "📏" }, // Height
  { id: 1, name: "Pitch Deepening", emoji: "🎤" },   // Voice
  { id: 2, name: "Sebum Increase", emoji: "💧" },     // Skin oily
  { id: 4, name: "Terminal Hair", emoji: "🦰" },     // Hair
];

// Correct matches
const correctMatches = [
  { signId: 1, changeId: 1 }, // Voice Changes → Pitch Deepening
  { signId: 2, changeId: 2 }, // Skin Changes → Sebum Increase
  { signId: 3, changeId: 3 }, // Height Growth → Sudden Growth Spurt
  { signId: 4, changeId: 4 }, // Hair Growth → Terminal Hair
  { signId: 5, changeId: 5 }  // Emotion Shifts → Hormonal Mood Fluctuations
];


  const handleSignSelect = (sign) => {
    if (gameFinished) return;
    setSelectedSign(sign);
  };

  const handleChangeSelect = (change) => {
    if (gameFinished) return;
    setSelectedChange(change);
  };

  const handleMatch = () => {
    if (!selectedSign || !selectedChange || gameFinished) return;

    resetFeedback();

    const newMatch = {
      signId: selectedSign.id,
      changeId: selectedChange.id,
      isCorrect: correctMatches.some(
        match => match.signId === selectedSign.id && match.changeId === selectedChange.id
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
    };

    // Check if all items are matched
    if (newMatches.length === signs.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedSign(null);
    setSelectedChange(null);
  };

  // Check if a sign is already matched
  const isSignMatched = (signId) => {
    return matches.some(match => match.signId === signId);
  };

  // Check if a change is already matched
  const isChangeMatched = (changeId) => {
    return matches.some(match => match.changeId === changeId);
  };

  // Get match result for a sign
  const getMatchResult = (signId) => {
    const match = matches.find(m => m.signId === signId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/acne-story-teen");
  };

  return (
    <GameShell
      title="Puberty Signs Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Signs with Body Changes (${matches.length}/${signs.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={signs.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === signs.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/teens"
      maxScore={signs.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Puberty Signs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Puberty Signs</h3>
              <div className="space-y-4">
                {signs.map(sign => (
                  <button
                    key={sign.id}
                    onClick={() => handleSignSelect(sign)}
                    disabled={isSignMatched(sign.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSignMatched(sign.id)
                        ? getMatchResult(sign.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSign?.id === sign.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{sign.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{sign.name}</h4>
                        <p className="text-white/80 text-sm">{sign.description}</p>
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
                  {selectedSign 
                    ? `Selected: ${selectedSign.name}` 
                    : "Select a Sign"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSign || !selectedChange}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSign && selectedChange
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{signs.length}</p>
                  <p>Matched: {matches.length}/{signs.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Body Changes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Body Changes</h3>
              <div className="space-y-4">
                {changes.map(change => (
                  <button
                    key={change.id}
                    onClick={() => handleChangeSelect(change)}
                    disabled={isChangeMatched(change.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isChangeMatched(change.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedChange?.id === change.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{change.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{change.name}</h4>
                        <p className="text-white/80 text-sm">{change.description}</p>
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
                  You correctly matched {score} out of {signs.length} puberty signs with body changes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Puberty brings many changes to your body - all of them are normal and natural!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {signs.length} signs correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each sign relates to physical changes in your body!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PubertySignsPuzzleTeen;
