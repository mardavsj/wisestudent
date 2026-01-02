import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ClassChatStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-83";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A classmate posts, 'You're so fat!' in the group chat. Everyone laughs. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Tell to Stop", 
          emoji: "🛑", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Laugh Along", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Stay Silent", 
          emoji: "😶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone sends a funny meme making fun of a classmate's picture. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Forward to Friends", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Tell It's Mean", 
          emoji: "🗑️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Keep It", 
          emoji: "🤷‍♀️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see a mean comment about your best friend online. What should you do?",
      options: [
        { 
          id: "b", 
          text: "Report and Tell", 
          emoji: "📢", 
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Join In", 
          emoji: "😈", 
          isCorrect: false
        },
        
        { 
          id: "c", 
          text: "Scroll Past", 
          emoji: "👀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You accidentally type something rude about a classmate in a group chat. What should you do?",
      options: [
        
        { 
          id: "b", 
          text: "Blame Someone", 
          emoji: "🙄", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Hope No One Saw", 
          emoji: "😬", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Apologize and Delete", 
          emoji: "🙏", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Someone calls another student 'nerd' in chat. Everyone is watching. What should you do?",
      options: [
       
        { 
          id: "b", 
          text: "Join Teasing", 
          emoji: "🤣", 
          isCorrect: false
        },
         { 
          id: "a", 
          text: "Say Stop", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Leave Group", 
          emoji: "🚪", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
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

  const handleNext = () => {
    navigate("/games/digital-citizenship/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Class Chat Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-83"
      gameType="dcos"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default ClassChatStory;
