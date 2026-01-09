import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PublicSpeakingPrep = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-68");
  const gameId = gameData?.id || "uvls-teen-68";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PublicSpeakingPrep, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What is the best approach for a 60-second speech opening?",
      options: [
        
        { 
          id: "b", 
          text: "Start with your conclusion", 
          emoji: "🔚", 
          // description: "This is confusing for the audience",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Include a hook, main point, and preview", 
          emoji: "🎤", 
          // description: "This structure captures attention and sets expectations",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Skip the preview", 
          emoji: "❓", 
          // description: "The preview helps the audience follow your speech",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should be included in the main body paragraph?",
      options: [
        { 
          id: "a", 
          text: "Use facts, examples, or personal stories", 
          emoji: "📊", 
          // description: "These provide supporting evidence for your points",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Just state your opinion", 
          emoji: "💭", 
          // description: "Opinions need to be supported with evidence",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Skip supporting details", 
          emoji: "🚫", 
          // description: "Supporting details strengthen your argument",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What makes a compelling closing statement?",
      options: [
        
        { 
          id: "b", 
          text: "Introduce new information", 
          emoji: "🆕", 
          // description: "This confuses the audience at the end",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "End abruptly without summary", 
          emoji: "💨", 
          // description: "The audience needs closure and key takeaways",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Summarize key points and inspire action", 
          emoji: "✨", 
          // description: "This reinforces your message and motivates the audience",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What is the purpose of a transition sentence?",
      options: [
       
        { 
          id: "b", 
          text: "Introduce a completely different topic", 
          emoji: "🔀", 
          // description: "This disrupts the flow of your speech",
          isCorrect: false
        },
         { 
          id: "a", 
          text: "Smoothly connect ideas", 
          emoji: "🔗", 
          // description: "Transitions help the audience follow your logic",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "End the speech", 
          emoji: "⏹️", 
          // description: "Transitions connect, not end, sections",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What makes a memorable conclusion?",
      options: [
        { 
          id: "a", 
          text: "Leave a lasting impression", 
          emoji: "🎯", 
          // description: "A strong conclusion reinforces your message",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Apologize for your mistakes", 
          emoji: "🙇", 
          // description: "This undermines your credibility",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Thank the audience briefly", 
          emoji: "🙏", 
          // description: "While polite, this doesn't reinforce your message",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Public Speaking Prep"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/teen/listening-vs-speaking-debate"
      nextGameIdProp="uvls-teen-69"
      gameType="uvls"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
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

export default PublicSpeakingPrep;

