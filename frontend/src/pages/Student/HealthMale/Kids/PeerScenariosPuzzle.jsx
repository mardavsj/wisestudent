import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerScenariosPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-64";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Peer Pressure Scenarios (left side) - 5 items
  const scenarios = [
    { id: 1, name: "Skip Homework", emoji: "📚",  },
    { id: 2, name: "Try Smoking", emoji: "🚬" },
    { id: 3, name: "Cheat on Test", emoji: "📝" },
    { id: 4, name: "Steal Items", emoji: "🏪" },
    { id: 5, name: "Bully Someone", emoji: "😢" },
  ];

  // Appropriate Responses (right side) - 5 items
  const responses = [
    { id: 1, name: "Say No Firmly", emoji: "🙅" },
    { id: 2, name: "Walk Away", emoji: "🚶" },
    { id: 3, name: "Suggest Alternative", emoji: "💡" },
    { id: 5, name: "Get Help", emoji: "🆘" },
    { id: 4, name: "Explain Why", emoji: "💬" },
  ];

  // Correct matches
  const correctMatches = [
    { scenarioId: 1, responseId: 4 }, // Skip Homework → Explain Why
    { scenarioId: 2, responseId: 1 }, // Try Smoking → Say No Firmly
    { scenarioId: 3, responseId: 3 }, // Cheat on Test → Suggest Alternative
    { scenarioId: 4, responseId: 2 }, // Steal Items → Walk Away
    { scenarioId: 5, responseId: 5 }  // Bully Someone → Get Help
  ];

  const handleScenarioSelect = (scenario) => {
    if (gameFinished) return;
    setSelectedScenario(scenario);
  };

  const handleResponseSelect = (response) => {
    if (gameFinished) return;
    setSelectedResponse(response);
  };

  const handleMatch = () => {
    if (!selectedScenario || !selectedResponse || gameFinished) return;

    resetFeedback();

    const newMatch = {
      scenarioId: selectedScenario.id,
      responseId: selectedResponse.id,
      isCorrect: correctMatches.some(
        match => match.scenarioId === selectedScenario.id && match.responseId === selectedResponse.id
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
    if (newMatches.length === scenarios.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedScenario(null);
    setSelectedResponse(null);
  };

  // Check if a scenario is already matched
  const isScenarioMatched = (scenarioId) => {
    return matches.some(match => match.scenarioId === scenarioId);
  };

  // Check if a response is already matched
  const isResponseMatched = (responseId) => {
    return matches.some(match => match.responseId === responseId);
  };

  // Get match result for a scenario
  const getMatchResult = (scenarioId) => {
    const match = matches.find(m => m.scenarioId === scenarioId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Peer Scenarios Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Scenarios with Responses (${matches.length}/${scenarios.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/bully-story"
      nextGameIdProp="health-male-kids-65"
      gameType="health-male"
      totalLevels={scenarios.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === scenarios.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/kids"
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Peer Pressure Scenarios */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Peer Pressure Scenarios</h3>
              <div className="space-y-4">
                {scenarios.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioSelect(scenario)}
                    disabled={isScenarioMatched(scenario.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isScenarioMatched(scenario.id)
                        ? getMatchResult(scenario.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedScenario?.id === scenario.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{scenario.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{scenario.name}</h4>
                        <p className="text-white/80 text-sm">{scenario.description}</p>
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
                  {selectedScenario 
                    ? `Selected: ${selectedScenario.name}` 
                    : "Select a Scenario"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedScenario || !selectedResponse}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedScenario && selectedResponse
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{scenarios.length}</p>
                  <p>Matched: {matches.length}/{scenarios.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Appropriate Responses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Appropriate Responses</h3>
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
                  You correctly matched {score} out of {scenarios.length} peer pressure scenarios with appropriate responses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Knowing how to respond to peer pressure helps you make good choices and stay true to yourself!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {scenarios.length} scenarios correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what response would keep you safe and true to your values!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerScenariosPuzzle;

