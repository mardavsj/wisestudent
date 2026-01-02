import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexRightVsEasy = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-93";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      question: "Your friend is being cyberbullied and asks for your help. What do you do?",
      correctAnswer: "Support your friend by reporting the bullying to school authorities",
      options: [
        { text: "Ignore it to avoid getting involved", isCorrect: false, emoji: "🙈" },
        { text: "Join in to fit in with others", isCorrect: false, emoji: "👥" },
        { text: "Support your friend by reporting the bullying to school authorities", isCorrect: true, emoji: "🤝" },
        { text: "Tell your friend to deal with it themselves", isCorrect: false, emoji: "🤷" }
      ]
    },
    {
      id: 2,
      question: "During a test, you notice a classmate cheating. What's your response?",
      correctAnswer: "Focus on your own test and report it to the teacher afterward",
      options: [
        { text: "Ignore it since it's not your problem", isCorrect: false, emoji: "🤷" },
        { text: "Focus on your own test and report it to the teacher afterward", isCorrect: true, emoji: "🙂" },
        { text: "Start cheating too to stay competitive", isCorrect: false, emoji: "📝" },
        { text: "Confront the cheater during the test", isCorrect: false, emoji: "⚔️" }
      ]
    },
    {
      id: 3,
      question: "You find out that your best friend is spreading a harmful rumor about another student. How do you handle it?",
      correctAnswer: "Confront your friend and convince them to stop spreading the rumor",
      options: [
        { text: "Confront your friend and convince them to stop spreading the rumor", isCorrect: true, emoji: "🗣️" },
        { text: "Join in spreading the rumor to stay loyal to your friend", isCorrect: false, emoji: "🗣️" },
        { text: "Ignore it and hope it goes away", isCorrect: false, emoji: "🤞" },
        { text: "Spread an even worse rumor about the other student", isCorrect: false, emoji: "🌪️" }
      ]
    },
    {
      id: 4,
      question: "Your parents are away and your friends want to come over for a party while you're supposed to be babysitting your younger sibling. What do you do?",
      correctAnswer: "Decline the party and stay responsible for your sibling",
      options: [
        { text: "Let your friends come over for the party anyway", isCorrect: false, emoji: "🎉" },
        { text: "Leave your sibling alone to attend the party", isCorrect: false, emoji: "🏃" },
        { text: "Ask your sibling to leave so you can have the party", isCorrect: false, emoji: "🚪" },
        { text: "Decline the party and stay responsible for your sibling", isCorrect: true, emoji: "👶" },
      ]
    },
    {
      id: 5,
      question: "You witness a group of students stealing from a classmate's locker. What is the right action?",
      correctAnswer: "Tell a teacher or school counselor about what you witnessed",
      options: [
        { text: "Tell a teacher or school counselor about what you witnessed", isCorrect: true, emoji: "📢" },
        { text: "Stay quiet to avoid becoming a target", isCorrect: false, emoji: "🤐" },
        { text: "Join the theft to be accepted by the group", isCorrect: false, emoji: "🤝" },
        { text: "Take something too since others are doing it", isCorrect: false, emoji: "😊" }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRoundRef.current < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, []);

  useEffect(() => {
    if (gameState === "playing" && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, answered, timeLeft, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 500);
  };

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Moral Dilemmas: Right vs Wrong"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Make the right choice!` : "Make the right choice!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="moral"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚖️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Make ethical decisions in challenging situations!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} moral dilemmas with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                "{currentQuestion.question}"
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexRightVsEasy;
