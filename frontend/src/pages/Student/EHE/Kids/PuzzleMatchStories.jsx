import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchStories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Stories (left side) - 5 items
  const stories = [
    { id: 1, name: "Girl Sells Crafts", emoji: "🎨" },
    { id: 2, name: "Boy Runs App", emoji: "💻" },
    { id: 3, name: "Teen Sells Cakes", emoji: "🎂" },
    { id: 4, name: "Kid Repairs Toys", emoji: "🔧" },
    { id: 5, name: "Student Teaches Peers", emoji: "📚" }
  ];

  // Skills (right side) - 5 items
  const skills = [
    { id: 4, name: "Problem-solving", emoji: "🧩" },
    { id: 3, name: "Cooking", emoji: "👩‍🍳" },
    { id: 2, name: "Tech", emoji: "🖥️" },
    { id: 1, name: "Creativity", emoji: "💡" },
    { id: 5, name: "Leadership", emoji: "👑" },
  ];

  // Correct matches
  const correctMatches = [
    { storyId: 1, skillId: 1 }, // Girl Sells Crafts → Creativity
    { storyId: 2, skillId: 2 }, // Boy Runs App → Tech
    { storyId: 3, skillId: 3 }, // Teen Sells Cakes → Cooking
    { storyId: 4, skillId: 4 }, // Kid Repairs Toys → Problem-solving
    { storyId: 5, skillId: 5 }  // Student Teaches Peers → Leadership
  ];

  const handleStorySelect = (story) => {
    if (gameFinished) return;
    setSelectedStory(story);
  };

  const handleSkillSelect = (skill) => {
    if (gameFinished) return;
    setSelectedSkill(skill);
  };

  const handleMatch = () => {
    if (!selectedStory || !selectedSkill || gameFinished) return;

    resetFeedback();

    const newMatch = {
      storyId: selectedStory.id,
      skillId: selectedSkill.id,
      isCorrect: correctMatches.some(
        match => match.storyId === selectedStory.id && match.skillId === selectedSkill.id
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
    if (newMatches.length === stories.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedStory(null);
    setSelectedSkill(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedStory(null);
    setSelectedSkill(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a story is already matched
  const isStoryMatched = (storyId) => {
    return matches.some(match => match.storyId === storyId);
  };

  // Check if a skill is already matched
  const isSkillMatched = (skillId) => {
    return matches.some(match => match.skillId === skillId);
  };

  // Get match result for a story
  const getMatchResult = (storyId) => {
    const match = matches.find(m => m.storyId === storyId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Stories"
      subtitle={gameFinished ? "Game Complete!" : `Match Stories with Skills (${matches.length}/${stories.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-44"
      gameType="ehe"
      totalLevels={stories.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={stories.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/kids/craft-story"
      nextGameIdProp="ehe-kids-45">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Stories */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Stories</h3>
              <div className="space-y-4">
                {stories.map(story => (
                  <button
                    key={story.id}
                    onClick={() => handleStorySelect(story)}
                    disabled={isStoryMatched(story.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isStoryMatched(story.id)
                        ? getMatchResult(story.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedStory?.id === story.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{story.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{story.name}</h4>
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
                  {selectedStory 
                    ? `Selected: ${selectedStory.name}` 
                    : "Select a Story"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedStory || !selectedSkill}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedStory && selectedSkill
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{stories.length}</p>
                  <p>Matched: {matches.length}/{stories.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Skills */}
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
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedSkill?.id === skill.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{skill.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{skill.name}</h4>
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
                  You correctly matched {score} out of {stories.length} stories with their skills!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different life situations require different skills for success!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {stories.length} stories correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what skills each person would need in their situation!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchStories;