import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CaseResponsePuzzle = () => {
  const navigate = useNavigate();

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

  // Social scenarios (left side) - 5 items with hints
  const scenarios = [
    { id: 1, name: "Friend Seems Withdrawn", emoji: "😔",  },
    { id: 2, name: "Classmate Shares Problems", emoji: "💬",  },
    { id: 3, name: "Peer Falling Behind", emoji: "📚",  },
    { id: 4, name: "Someone Feels Isolated", emoji: "😔",  },
    { id: 5, name: "Hesitant About Help", emoji: "🤔",  }
  ];

  // Supportive responses (right side) - 5 items with descriptions
  const responses = [
    { id: 6, name: "Gentle Connection", emoji: "🤝",  },
    { id: 7, name: "Active Listening", emoji: "👂",  },
    { id: 8, name: "Practical Support", emoji: "🛠️",  },
    { id: 9, name: "Honest Support", emoji: "💝",  },
    { id: 10, name: "Encourage Help-Seeking", emoji: "💙",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedResponses = [
    responses[2], // Practical Support (id: 8)
    responses[4], // Encourage Help-Seeking (id: 10)
    responses[1], // Active Listening (id: 7)
    responses[0], // Gentle Connection (id: 6)
    responses[3]  // Honest Support (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each scenario has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { scenarioId: 1, responseId: 6 }, // Friend Seems Withdrawn → Gentle Connection
    { scenarioId: 2, responseId: 7 }, // Classmate Shares Problems → Active Listening
    { scenarioId: 3, responseId: 8 }, // Peer Falling Behind → Practical Support
    { scenarioId: 4, responseId: 9 }, // Someone Feels Isolated → Honest Support
    { scenarioId: 5, responseId: 10 } // Hesitant About Help → Encourage Help-Seeking
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
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Case-Response Puzzle"
      subtitle={gameFinished ? "Case Study Complete!" : `Match Scenarios with Responses (${matches.length}/${scenarios.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-8"
      nextGamePathProp="/student/uvls/teen/spot-distress-reflex"
      nextGameIdProp="uvls-teen-9"
      gameType="uvls"
      totalLevels={scenarios.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === scenarios.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Alex's Story Introduction */}
        <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-6 border-2 border-purple-400/50">
          <h3 className="text-white text-xl font-bold mb-2">Alex's Story</h3>
          <p className="text-white/90">Alex is a talented student who recently lost a parent. They've been withdrawn, missing assignments, and avoiding friends.</p>
        </div>
        
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Social Scenarios */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Social Scenarios</h3>
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
                    : "Select a Social Scenario"}
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

            {/* Right column - Supportive Responses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Supportive Responses</h3>
              <div className="space-y-4">
                {rearrangedResponses.map(response => (
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
                  You correctly matched {score} out of {scenarios.length} social scenarios with appropriate responses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Responding appropriately to others' emotional needs strengthens relationships and builds trust!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {scenarios.length} social scenarios correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what responses would make someone feel heard, supported, and cared for!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CaseResponsePuzzle;