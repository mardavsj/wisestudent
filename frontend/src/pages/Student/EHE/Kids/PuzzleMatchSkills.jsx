import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchSkills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedMeaning, setSelectedMeaning] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Skills (left side) - 5 items
  const skills = [
    { id: 1, name: "Leader", emoji: "👑",  },
    { id: 2, name: "Innovator", emoji: "🔧",  },
    { id: 3, name: "Team Player", emoji: "🤝",  },
    { id: 4, name: "Problem Solver", emoji: "🧩",  },
    { id: 5, name: "Communicator", emoji: "💬",  }
  ];

  // Meanings (right side) - 5 items
  const meanings = [
    { id: 5, name: "Share", emoji: "📤",  },
    { id: 1, name: "Guide", emoji: "🧭",  },
    { id: 2, name: "Invent", emoji: "💡",  },
    { id: 4, name: "Fix", emoji: "🔧",  },
    { id: 3, name: "Support", emoji: "🤲",  },
  ];

  // Correct matches
  const correctMatches = [
    { skillId: 1, meaningId: 1 }, // Leader → Guide
    { skillId: 2, meaningId: 2 }, // Innovator → Invent
    { skillId: 3, meaningId: 3 }, // Team Player → Support
    { skillId: 4, meaningId: 4 }, // Problem Solver → Fix
    { skillId: 5, meaningId: 5 }  // Communicator → Share
  ];

  const handleSkillSelect = (skill) => {
    if (gameFinished) return;
    setSelectedSkill(skill);
  };

  const handleMeaningSelect = (meaning) => {
    if (gameFinished) return;
    setSelectedMeaning(meaning);
  };

  const handleMatch = () => {
    if (!selectedSkill || !selectedMeaning || gameFinished) return;

    resetFeedback();

    const newMatch = {
      skillId: selectedSkill.id,
      meaningId: selectedMeaning.id,
      isCorrect: correctMatches.some(
        match => match.skillId === selectedSkill.id && match.meaningId === selectedMeaning.id
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
    if (newMatches.length === skills.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedSkill(null);
    setSelectedMeaning(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedSkill(null);
    setSelectedMeaning(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a skill is already matched
  const isSkillMatched = (skillId) => {
    return matches.some(match => match.skillId === skillId);
  };

  // Check if a meaning is already matched
  const isMeaningMatched = (meaningId) => {
    return matches.some(match => match.meaningId === meaningId);
  };

  // Get match result for a skill
  const getMatchResult = (skillId) => {
    const match = matches.find(m => m.skillId === skillId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Skills"
      subtitle={gameFinished ? "Game Complete!" : `Match Skills with Meanings (${matches.length}/${skills.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-14"
      gameType="ehe"
      totalLevels={skills.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={skills.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Skills */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Skills</h3>
              <div className="space-y-4">
                {skills.map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillSelect(skill)}
                    disabled={isSkillMatched(skill.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSkillMatched(skill.id)
                        ? getMatchResult(skill.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSkill?.id === skill.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{skill.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{skill.name}</h4>
                        <p className="text-white/80 text-sm">{skill.description}</p>
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
                  {selectedSkill 
                    ? `Selected: ${selectedSkill.name}` 
                    : "Select a Skill"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSkill || !selectedMeaning}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSkill && selectedMeaning
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{skills.length}</p>
                  <p>Matched: {matches.length}/{skills.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Meanings */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Meanings</h3>
              <div className="space-y-4">
                {meanings.map(meaning => (
                  <button
                    key={meaning.id}
                    onClick={() => handleMeaningSelect(meaning)}
                    disabled={isMeaningMatched(meaning.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMeaningMatched(meaning.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedMeaning?.id === meaning.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{meaning.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{meaning.name}</h4>
                        <p className="text-white/80 text-sm">{meaning.description}</p>
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
                  You correctly matched {score} out of {skills.length} skills with their meanings!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding skills and their meanings helps in personal development!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {skills.length} skills correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each skill actually means in practice!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchSkills;