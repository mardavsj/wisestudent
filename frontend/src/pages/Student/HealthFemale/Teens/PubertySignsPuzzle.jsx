import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertySignsPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per correct match
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 matches
  const totalXp = location.state?.totalXp || 10; // Total XP
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);
  const [selectedCause, setSelectedCause] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Puberty Signs (left side) - 5 items
  const signs = [
    { id: 1, name: "Acne", emoji: "🔴",  },
    { id: 2, name: "Periods", emoji: "🩸",  },
    { id: 3, name: "Mood Swings", emoji: "🎭",  },
    { id: 4, name: "Body Hair", emoji: "🦰",  },
    { id: 5, name: "Growth Spurt", emoji: "📏",  }
  ];
  
  // Causes (right side) - 5 items (shuffled order)
  const causes = [
    { id: 3, text: "Hormonal changes affecting emotions",  },
    { id: 5, text: "Hormones stimulating bone growth",  },
    { id: 1, text: "Hormones increasing oil production",  },
    { id: 4, text: "Hormones triggering hair follicles",  },
    { id: 2, text: "Hormones regulating reproductive cycle",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { signId: 1, causeId: 1 }, // Acne → Hormones increasing oil production
    { signId: 2, causeId: 2 }, // Periods → Hormones regulating reproductive cycle
    { signId: 3, causeId: 3 }, // Mood Swings → Hormonal changes affecting emotions
    { signId: 4, causeId: 4 }, // Body Hair → Hormones triggering hair follicles
    { signId: 5, causeId: 5 }  // Growth Spurt → Hormones stimulating bone growth
  ];
  
  const handleSignSelect = (sign) => {
    if (gameFinished) return;
    setSelectedSign(sign);
  };
  
  const handleCauseSelect = (cause) => {
    if (gameFinished) return;
    setSelectedCause(cause);
  };
  
  const handleMatch = () => {
    if (!selectedSign || !selectedCause || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      signId: selectedSign.id,
      causeId: selectedCause.id,
      isCorrect: correctMatches.some(
        match => match.signId === selectedSign.id && match.causeId === selectedCause.id
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
    if (newMatches.length === signs.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }
    
    // Reset selections
    setSelectedSign(null);
    setSelectedCause(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedSign(null);
    setSelectedCause(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/teens");
  };
  
  // Check if a sign is already matched
  const isSignMatched = (signId) => {
    return matches.some(match => match.signId === signId);
  };
  
  // Check if a cause is already matched
  const isCauseMatched = (causeId) => {
    return matches.some(match => match.causeId === causeId);
  };
  
  // Get match result for a sign
  const getMatchResult = (signId) => {
    const match = matches.find(m => m.signId === signId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Puberty Signs"
      subtitle={gameFinished ? "Game Complete!" : `Match Signs with Their Causes (${matches.length}/${signs.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-24"
      gameType="health-female"
      totalLevels={signs.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={signs.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/acne-story"
      nextGameIdProp="health-female-teen-25">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Signs */}
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
                        <p className="text-white/80 text-sm">{sign.hint}</p>
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
                  disabled={!selectedSign || !selectedCause}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSign && selectedCause
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
            
            {/* Right column - Causes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Causes</h3>
              <div className="space-y-4">
                {causes.map(cause => (
                  <button
                    key={cause.id}
                    onClick={() => handleCauseSelect(cause)}
                    disabled={isCauseMatched(cause.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCauseMatched(cause.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedCause?.id === cause.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{cause.text}</h4>
                        <p className="text-white/80 text-sm">{cause.hint}</p>
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
                  You correctly matched {score} out of {signs.length} puberty signs with their causes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding the causes of puberty signs helps normalize these changes and reduces anxiety!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {signs.length} signs correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Remember that hormones are responsible for most physical and emotional changes during puberty!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PubertySignsPuzzle;