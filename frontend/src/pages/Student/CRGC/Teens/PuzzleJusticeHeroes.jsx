import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleJusticeHeroes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Justice Heroes (left side) - 5 items
  const heroes = [
    { id: 1, name: "Mahatma Gandhi", emoji: "🕊️",  },
    { id: 2, name: "Martin Luther King", emoji: "✊",  },
    { id: 3, name: "Malala", emoji: "📖",  },
    { id: 4, name: "Nelson Mandela", emoji: "🔓",  },
    { id: 5, name: "Rosa Parks", emoji: "🚌",  },
  ];

  // Contributions (right side) - 5 items
  const contributions = [
    { id: 3, name: "Education", emoji: "🎓",  },
    { id: 1, name: "Freedom", emoji: "🗽",  },
    { id: 2, name: "Equality", emoji: "⚖️",  },
    { id: 5, name: "Rights", emoji: "✋",  },
    { id: 4, name: "Justice", emoji: "⚔️",  },
  ];

  // Correct matches
  const correctMatches = [
    { heroId: 1, contributionId: 1 }, // Mahatma Gandhi → Freedom
    { heroId: 2, contributionId: 2 }, // Martin Luther King → Equality
    { heroId: 3, contributionId: 3 }, // Malala → Education
    { heroId: 4, contributionId: 4 }, // Nelson Mandela → Justice
    { heroId: 5, contributionId: 5 }  // Rosa Parks → Rights
  ];

  const handleHeroSelect = (hero) => {
    if (gameFinished) return;
    setSelectedHero(hero);
  };

  const handleContributionSelect = (contribution) => {
    if (gameFinished) return;
    setSelectedContribution(contribution);
  };

  const handleMatch = () => {
    if (!selectedHero || !selectedContribution || gameFinished) return;

    resetFeedback();

    const newMatch = {
      heroId: selectedHero.id,
      contributionId: selectedContribution.id,
      isCorrect: correctMatches.some(
        match => match.heroId === selectedHero.id && match.contributionId === selectedContribution.id
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
    if (newMatches.length === heroes.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedHero(null);
    setSelectedContribution(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedHero(null);
    setSelectedContribution(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  // Check if a hero is already matched
  const isHeroMatched = (heroId) => {
    return matches.some(match => match.heroId === heroId);
  };

  // Check if a contribution is already matched
  const isContributionMatched = (contributionId) => {
    return matches.some(match => match.contributionId === contributionId);
  };

  // Get match result for a hero
  const getMatchResult = (heroId) => {
    const match = matches.find(m => m.heroId === heroId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Justice Heroes"
      subtitle={gameFinished ? "Game Complete!" : `Match Justice Heroes with Contributions (${matches.length}/${heroes.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-teens-64"
      gameType="civic-responsibility"
      totalLevels={heroes.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
      maxScore={heroes.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Justice Heroes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Justice Heroes</h3>
              <div className="space-y-4">
                {heroes.map(hero => (
                  <button
                    key={hero.id}
                    onClick={() => handleHeroSelect(hero)}
                    disabled={isHeroMatched(hero.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isHeroMatched(hero.id)
                        ? getMatchResult(hero.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedHero?.id === hero.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{hero.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{hero.name}</h4>
                        <p className="text-white/80 text-sm">{hero.description}</p>
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
                  {selectedHero 
                    ? `Selected: ${selectedHero.name}` 
                    : "Select a Justice Hero"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedHero || !selectedContribution}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedHero && selectedContribution
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{heroes.length}</p>
                  <p>Matched: {matches.length}/{heroes.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Contributions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Their Contributions</h3>
              <div className="space-y-4">
                {contributions.map(contribution => (
                  <button
                    key={contribution.id}
                    onClick={() => handleContributionSelect(contribution)}
                    disabled={isContributionMatched(contribution.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isContributionMatched(contribution.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedContribution?.id === contribution.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{contribution.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{contribution.name}</h4>
                        <p className="text-white/80 text-sm">{contribution.description}</p>
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
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Outstanding Work!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {heroes.length} justice heroes with their contributions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: These inspiring figures show us that individuals can create significant positive change in the world!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {heroes.length} justice heroes correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each justice hero is most famous for and what cause they championed!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleJusticeHeroes;