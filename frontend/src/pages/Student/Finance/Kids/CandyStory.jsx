import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CandyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-21";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "You have ₹20. Spend all on candy or plan for 2 days?",
      choices: [
        { text: "Spend all on candy 🍬", correct: false },
        { text: "Plan for 2 days 🗓️", correct: true },
        { text: "Give it to a friend 🎁", correct: false },
      ],
    },
    {
      question: "You can buy 1 candy for ₹5. How many can you get with ₹15?",
      choices: [
        { text: "3 candies 🍭", correct: true },
        { text: "2 candies 🍬", correct: false },
        { text: "4 candies 🍫", correct: false },
      ],
    },
    {
      question: "A candy costs ₹10, but you have ₹8. What’s the best choice?",
      choices: [
        { text: "Borrow ₹2 🙈", correct: false },
        { text: "Save ₹2 more 💰", correct: true },
        { text: "Ask for a discount 🎟️", correct: false },
      ],
    },
    {
      question: "You saved ₹10 for candy. A sale offers 2 for ₹15. What do you do?",
      choices: [
        { text: "Buy two candies 🛒", correct: false },
        { text: "Spend all on snacks 🍟", correct: false },
        { text: "Stick to one candy ✅", correct: true },
      ],
    },
    {
      question: "Why is planning your candy budget smart?",
      choices: [
        { text: "Lets you spend everything 🛍️", correct: false },
        { text: "Ensures you enjoy longer 😊", correct: true },
        { text: "Makes you buy more candy 🍬", correct: false },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
  };

  const finalScore = score;

  return (
    <GameShell
      title="Candy Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentStage + 1} of ${stages.length}`}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      gameId="finance-kids-21"
      gameType="finance"
      maxScore={5}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/kids/Budgeting-Quiz"
      nextGameIdProp="finance-kids-22">
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center text-white">
            <div className="text-4xl mb-4">🍬</div>
            <h3 className="text-2xl font-bold mb-4">
              {stages[currentStage].question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
            <div className="mt-6 text-center text-white/80">
              <p>Score: {score}/{stages.length}</p>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CandyStory;