import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PenSquare } from 'lucide-react';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfMasculinity = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const prompts = [
    {
      id: 1,
      title: "Healthy Masculinity",
      text: "Being a good man means ___."
    },
    {
      id: 2,
      title: "Emotional Expression",
      text: "I feel masculine when I ___."
    },
    {
      id: 3,
      title: "Respect and Relationships",
      text: "I show respect to others by ___."
    },
    {
      id: 4,
      title: "Strength in Vulnerability",
      text: "A time I showed strength by asking for help was ___."
    },
    {
      id: 5,
      title: "Positive Role Models",
      text: "A man I admire for his character is ___ because ___."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameFinished) return; // Prevent multiple submissions
    
    resetFeedback();
    const answerText = answer.trim();
    
    if (answerText.length >= 10) {
      setResponses([...responses, { prompt: currentPrompt, answer }]);
      showCorrectAnswerFeedback(1, true);
      
      const isLastQuestion = currentPrompt === prompts.length - 1;
      
      setTimeout(() => {
        if (isLastQuestion) {
          setGameFinished(true);
        } else {
          setAnswer("");
          setCurrentPrompt(prev => prev + 1);
        }
      }, 1500);
    }
  };

  // Log when game completes
  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Journal of Masculinity game completed! Score: ${responses.length}/${prompts.length}, gameId: health-male-teen-67`);
    }
  }, [gameFinished, responses.length, prompts.length]);

  const characterCount = answer.trim().length;
  const isLongEnough = characterCount >= 10;

  const handleNext = () => {
    navigate("/student/health-male/teens/respect-women-simulation");
  };

  return (
    <GameShell
      title="Journal of Masculinity"
      subtitle={!gameFinished ? `Prompt ${currentPrompt + 1} of ${prompts.length}` : "Journal Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={responses.length}
      gameId="health-male-teen-67"
      nextGamePathProp="/student/health-male/teens/respect-women-simulation"
      nextGameIdProp="health-male-teen-68"
      gameType="health-male"
      totalLevels={prompts.length}
      currentLevel={currentPrompt + 1}
      maxScore={prompts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center text-center text-white space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 py-4">
        {!gameFinished && prompts[currentPrompt] && (
          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{prompts[currentPrompt].text}</h3>
            <p className="text-white/70 mb-4 text-sm md:text-base">Score: {responses.length}/{prompts.length}</p>
            <p className="text-white/60 text-xs md:text-sm mb-4">
              Write at least 10 characters
            </p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-xl p-4 rounded-xl text-black text-base md:text-lg bg-white/90 min-h-[120px] md:min-h-[150px]"
              disabled={gameFinished}
            />
            <div className="mt-2 text-white/50 text-xs md:text-sm">
              {characterCount}/10 characters
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-transform ${
                isLongEnough && !gameFinished
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={!isLongEnough || gameFinished}
            >
              {currentPrompt === prompts.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfMasculinity;

