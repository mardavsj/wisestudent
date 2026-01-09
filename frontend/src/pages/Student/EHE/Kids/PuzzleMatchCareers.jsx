import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchCareers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Careers (left side) - 5 items
  const careers = [
    { id: 1, name: "Farmer", emoji: "🌾" },
    { id: 2, name: "Engineer", emoji: "⚙️" },
    { id: 3, name: "Chef", emoji: "👨‍🍳" },
    { id: 4, name: "Doctor", emoji: "👨‍⚕️" },
    { id: 5, name: "Artist", emoji: "🎨" }
  ];

  // Schools (right side) - 5 items
  const schools = [
    { id: 2, name: "College", emoji: "🏛️" },
    { id: 5, name: "Art School", emoji: "🎭" },
    { id: 1, name: "Agriculture School", emoji: "🚜" },
    { id: 3, name: "Culinary School", emoji: "🔪" },
    { id: 4, name: "Medical School", emoji: "🏥" },
  ];

  // Correct matches
  const correctMatches = [
    { careerId: 1, schoolId: 1 }, // Farmer → Agriculture School
    { careerId: 2, schoolId: 2 }, // Engineer → College
    { careerId: 3, schoolId: 3 }, // Chef → Culinary School
    { careerId: 4, schoolId: 4 }, // Doctor → Medical School
    { careerId: 5, schoolId: 5 }  // Artist → Art School
  ];

  const handleCareerSelect = (career) => {
    if (gameFinished) return;
    setSelectedCareer(career);
  };

  const handleSchoolSelect = (school) => {
    if (gameFinished) return;
    setSelectedSchool(school);
  };

  const handleMatch = () => {
    if (!selectedCareer || !selectedSchool || gameFinished) return;

    resetFeedback();

    const newMatch = {
      careerId: selectedCareer.id,
      schoolId: selectedSchool.id,
      isCorrect: correctMatches.some(
        match => match.careerId === selectedCareer.id && match.schoolId === selectedSchool.id
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
    if (newMatches.length === careers.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedCareer(null);
    setSelectedSchool(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedCareer(null);
    setSelectedSchool(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a career is already matched
  const isCareerMatched = (careerId) => {
    return matches.some(match => match.careerId === careerId);
  };

  // Check if a school is already matched
  const isSchoolMatched = (schoolId) => {
    return matches.some(match => match.schoolId === schoolId);
  };

  // Get match result for a career
  const getMatchResult = (careerId) => {
    const match = matches.find(m => m.careerId === careerId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Careers"
      subtitle={gameFinished ? "Game Complete!" : `Match Careers with Schools (${matches.length}/${careers.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-54"
      gameType="ehe"
      totalLevels={careers.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={careers.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/kids/vocational-story"
      nextGameIdProp="ehe-kids-55">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Careers */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Careers</h3>
              <div className="space-y-4">
                {careers.map(career => (
                  <button
                    key={career.id}
                    onClick={() => handleCareerSelect(career)}
                    disabled={isCareerMatched(career.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCareerMatched(career.id)
                        ? getMatchResult(career.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedCareer?.id === career.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{career.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{career.name}</h4>
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
                  {selectedCareer 
                    ? `Selected: ${selectedCareer.name}` 
                    : "Select a Career"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedCareer || !selectedSchool}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedCareer && selectedSchool
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{careers.length}</p>
                  <p>Matched: {matches.length}/{careers.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Schools */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Schools</h3>
              <div className="space-y-4">
                {schools.map(school => (
                  <button
                    key={school.id}
                    onClick={() => handleSchoolSelect(school)}
                    disabled={isSchoolMatched(school.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSchoolMatched(school.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedSchool?.id === school.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{school.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{school.name}</h4>
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
                  You correctly matched {score} out of {careers.length} careers with their schools!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different careers require specialized education and training!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {careers.length} careers correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what education each career would require!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchCareers;