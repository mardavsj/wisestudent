import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchStudies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Professions (left side) - 5 items
  const professions = [
    { id: 1, name: "Doctor", emoji: "👨‍⚕️" },
    { id: 2, name: "Lawyer", emoji: "👨‍⚖️" },
    { id: 3, name: "Artist", emoji: "🎨" },
    { id: 4, name: "Engineer", emoji: "⚙️" },
    { id: 5, name: "Chef", emoji: "👨‍🍳" }
  ];

  // Colleges (right side) - 5 items
  const colleges = [
    { id: 1, name: "Medical College", emoji: "🏥" },
    { id: 5, name: "Culinary School", emoji: "🔪" },
    { id: 3, name: "Design College", emoji: "🎭" },
    { id: 2, name: "Law College", emoji: "⚖️" },
    { id: 4, name: "Engineering College", emoji: "🏗️" },
  ];

  // Correct matches
  const correctMatches = [
    { professionId: 1, collegeId: 1 }, // Doctor → Medical College
    { professionId: 2, collegeId: 2 }, // Lawyer → Law College
    { professionId: 3, collegeId: 3 }, // Artist → Design College
    { professionId: 4, collegeId: 4 }, // Engineer → Engineering College
    { professionId: 5, collegeId: 5 }  // Chef → Culinary School
  ];

  const handleProfessionSelect = (profession) => {
    if (gameFinished) return;
    setSelectedProfession(profession);
  };

  const handleCollegeSelect = (college) => {
    if (gameFinished) return;
    setSelectedCollege(college);
  };

  const handleMatch = () => {
    if (!selectedProfession || !selectedCollege || gameFinished) return;

    resetFeedback();

    const newMatch = {
      professionId: selectedProfession.id,
      collegeId: selectedCollege.id,
      isCorrect: correctMatches.some(
        match => match.professionId === selectedProfession.id && match.collegeId === selectedCollege.id
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
    if (newMatches.length === professions.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedProfession(null);
    setSelectedCollege(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedProfession(null);
    setSelectedCollege(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a profession is already matched
  const isProfessionMatched = (professionId) => {
    return matches.some(match => match.professionId === professionId);
  };

  // Check if a college is already matched
  const isCollegeMatched = (collegeId) => {
    return matches.some(match => match.collegeId === collegeId);
  };

  // Get match result for a profession
  const getMatchResult = (professionId) => {
    const match = matches.find(m => m.professionId === professionId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Studies"
      subtitle={gameFinished ? "Game Complete!" : `Match Professions with Colleges (${matches.length}/${professions.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-64"
      gameType="ehe"
      totalLevels={professions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={professions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/kids/entrance-exam-story"
      nextGameIdProp="ehe-kids-65">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Professions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Professions</h3>
              <div className="space-y-4">
                {professions.map(profession => (
                  <button
                    key={profession.id}
                    onClick={() => handleProfessionSelect(profession)}
                    disabled={isProfessionMatched(profession.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isProfessionMatched(profession.id)
                        ? getMatchResult(profession.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedProfession?.id === profession.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{profession.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{profession.name}</h4>
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
                  {selectedProfession 
                    ? `Selected: ${selectedProfession.name}` 
                    : "Select a Profession"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedProfession || !selectedCollege}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedProfession && selectedCollege
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{professions.length}</p>
                  <p>Matched: {matches.length}/{professions.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Colleges */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Colleges</h3>
              <div className="space-y-4">
                {colleges.map(college => (
                  <button
                    key={college.id}
                    onClick={() => handleCollegeSelect(college)}
                    disabled={isCollegeMatched(college.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCollegeMatched(college.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedCollege?.id === college.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{college.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{college.name}</h4>
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
                  You correctly matched {score} out of {professions.length} professions with their colleges!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different professions require specialized education and training!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {professions.length} professions correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what education each profession would require!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchStudies;