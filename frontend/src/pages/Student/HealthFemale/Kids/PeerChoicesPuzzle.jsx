import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerChoicesPuzzle = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-64";
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Social Situations (left side) - 5 items
  const situations = [
    { id: 1, name: "Peer Pressure to Skip Class", emoji: "📚",  },
    { id: 2, name: "Someone Teasing You", emoji: "💬",  },
    { id: 3, name: "Excluded from Group Activity", emoji: "👥",  },
    { id: 4, name: "Asked to Cheat on Test", emoji: "📝",  },
    { id: 5, name: "Bullied for Your Looks", emoji: "😔",  }
  ];
  
  // Appropriate Responses (right side) - 5 items (shuffled order)
  const responses = [
    { id: 3, text: "Politely decline and suggest a different activity",  },
    { id: 5, text: "Tell a trusted adult about the situation",  },
    { id: 1, text: "Firmly say 'No' and walk away",  },
    { id: 4, text: "Ignore the teasing and talk to a friend",  },
    { id: 2, text: "Refuse and explain why it's wrong",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { situationId: 1, responseId: 1 }, // Peer Pressure to Skip Class → Firmly say 'No' and walk away
    { situationId: 2, responseId: 4 }, // Someone Teasing You → Ignore the teasing and talk to a friend
    { situationId: 3, responseId: 3 }, // Excluded from Group Activity → Politely decline and suggest a different activity
    { situationId: 4, responseId: 2 }, // Asked to Cheat on Test → Refuse and explain why it's wrong
    { situationId: 5, responseId: 5 }  // Bullied for Your Looks → Tell a trusted adult about the situation
  ];
  
  const handleSituationSelect = (situation) => {
    if (gameFinished) return;
    setSelectedSituation(situation);
  };
  
  const handleResponseSelect = (response) => {
    if (gameFinished) return;
    setSelectedResponse(response);
  };
  
  const handleMatch = () => {
    if (!selectedSituation || !selectedResponse || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      situationId: selectedSituation.id,
      responseId: selectedResponse.id,
      isCorrect: correctMatches.some(
        match => match.situationId === selectedSituation.id && match.responseId === selectedResponse.id
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
    if (newMatches.length === situations.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }
    
    // Reset selections
    setSelectedSituation(null);
    setSelectedResponse(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedSituation(null);
    setSelectedResponse(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/kids");
  };
  
  // Check if a situation is already matched
  const isSituationMatched = (situationId) => {
    return matches.some(match => match.situationId === situationId);
  };
  
  // Check if a response is already matched
  const isResponseMatched = (responseId) => {
    return matches.some(match => match.responseId === responseId);
  };
  
  // Get match result for a situation
  const getMatchResult = (situationId) => {
    const match = matches.find(m => m.situationId === situationId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Peer Choices Puzzle"
      subtitle={gameFinished ? "Game Complete!" : `Match Situations with Responses (${matches.length}/${situations.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={situations.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/bully-story"
      nextGameIdProp="health-female-kids-65">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Situations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Social Situations</h3>
              <div className="space-y-4">
                {situations.map(situation => (
                  <button
                    key={situation.id}
                    onClick={() => handleSituationSelect(situation)}
                    disabled={isSituationMatched(situation.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSituationMatched(situation.id)
                        ? getMatchResult(situation.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSituation?.id === situation.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{situation.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{situation.name}</h4>
                        <p className="text-white/80 text-sm">{situation.hint}</p>
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
                  {selectedSituation 
                    ? `Selected: ${selectedSituation.name}` 
                    : "Select a Situation"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSituation || !selectedResponse}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSituation && selectedResponse
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{situations.length}</p>
                  <p>Matched: {matches.length}/{situations.length}</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Responses */}
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
                      <div>
                        <h4 className="font-bold text-white">{response.text}</h4>
                        <p className="text-white/80 text-sm">{response.hint}</p>
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
                  You correctly matched {score} out of {situations.length} peer situations with appropriate responses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Making good choices in social situations helps you build strong, respectful relationships!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {situations.length} situations correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what the best response would be in each social situation!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerChoicesPuzzle;