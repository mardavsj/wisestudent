import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStageTrolling = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-14";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "During an online debate, someone mocks a speaker’s accent instead of responding to their argument. What does this behavior represent?",
    options: [
      
      {
        id: "creative-humor",
        text: "Using creativity to make debates engaging",
        emoji: "🎨",
        isCorrect: false
      },
      {
        id: "strong-opinion",
        text: "Showing a strong personal opinion",
        emoji: "🧭",
        isCorrect: false
      },
      {
        id: "attack-style",
        text: "Attacking the person instead of the idea",
        emoji: "🧱",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "In a comment section, a user keeps posting sarcastic remarks to provoke anger rather than discuss the topic. What is the main goal of such behavior?",
    options: [
      
      {
        id: "add-evidence",
        text: "To strengthen the discussion with facts",
        emoji: "📊",
        isCorrect: false
      },
      {
        id: "gain-attention",
        text: "To trigger reactions and attention",
        emoji: "🔔",
        isCorrect: true
      },
      {
        id: "clarify-views",
        text: "To explain their viewpoint clearly",
        emoji: "🧩",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "A debater shares a misleading meme to embarrass the opposing team instead of responding logically. What risk does this create?",
    options: [
      {
        id: "damages-trust",
        text: "It weakens trust in the discussion",
        emoji: "⚖️",
        isCorrect: true
      },
      {
        id: "wins-argument",
        text: "It guarantees winning the debate",
        emoji: "🏆",
        isCorrect: false
      },
      {
        id: "adds-humor",
        text: "It makes the debate more entertaining",
        emoji: "🎭",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "While watching a live debate, the chat floods with personal jokes about a participant’s appearance. What is the healthiest role for a viewer?",
    options: [
      
      {
        id: "join-chat",
        text: "Participate to stay included",
        emoji: "🪢",
        isCorrect: false
      },
      {
        id: "support-rules",
        text: "Encourage respectful discussion norms",
        emoji: "🪜",
        isCorrect: true
      },
      {
        id: "amplify-jokes",
        text: "Boost popular comments for visibility",
        emoji: "📣",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "A student feels pressured to post a harsh reply during a debate because their friends expect it. What choice best supports digital integrity?",
    options: [
      {
        id: "stay-values",
        text: "Respond in line with personal values",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "match-tone",
        text: "Mirror the group’s aggressive tone",
        emoji: "🪞",
        isCorrect: false
      },
      {
        id: "seek-likes",
        text: "Post what gains the most reactions",
        emoji: "📈",
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Trolling"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/diversity-quiz"
      nextGameIdProp="dcos-teen-15"
      gameType="dcos"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DebateStageTrolling;

