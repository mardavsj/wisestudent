import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LEFT_ITEMS = [
  { id: "new-customers", text: "New Customers" },
  { id: "repeat-customers", text: "Repeat Customers" },
  { id: "ignoring-feedback", text: "Ignoring Customer Feedback" },
  { id: "excellent-service", text: "Excellent Customer Service" },
  { id: "customer-loyalty", text: "Building Customer Loyalty" },
];

const RIGHT_ITEMS = [
  { id: "organic-growth", text: "Organic Word-of-Mouth Growth" },
  { id: "losing-market-share", text: "Losing Market Share" },
  { id: "longterm-stability", text: "Long-term Stability" },
  { id: "brand-reputation", text: "Positive Brand Reputation" },
  { id: "initial-sales", text: "Initial Sales" },
];

const SOLUTIONS = {
  "new-customers": "initial-sales",
  "repeat-customers": "longterm-stability",
  "ignoring-feedback": "losing-market-share",
  "excellent-service": "brand-reputation",
  "customer-loyalty": "organic-growth",
};

const PuzzleOfCustomers = () => {
  const location = useLocation();
  const totalPairs = LEFT_ITEMS.length;
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [outcomeText, setOutcomeText] = useState("");
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const gameId = "ehe-adults-53";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalPairs));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;

  const remainingLeft = useMemo(
    () => LEFT_ITEMS.filter((l) => !matched[l.id]),
    [matched]
  );
  const remainingRight = useMemo(() => {
    const used = new Set(Object.values(matched));
    return RIGHT_ITEMS.filter((r) => !used.has(r.id));
  }, [matched]);

  const handleLeftSelect = (l) => {
    if (matched[l.id]) return;
    setSelectedLeft(l);
    setOutcomeText("");
  };

  const handleRightSelect = (r) => {
    setSelectedRight(r);
    if (!selectedLeft) return;
    const correctRight = SOLUTIONS[selectedLeft.id];
    if (r.id === correctRight) {
      setMatched((m) => ({ ...m, [selectedLeft.id]: r.id }));
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
      setOutcomeText(`Matched! "${selectedLeft.text}" → "${r.text}"`);
      const doneCount = Object.keys(matched).length + 1;
      if (doneCount === totalPairs) {
        setShowResult(true);
      }
    } else {
      setOutcomeText("Mismatch! Think about how different customer relationships impact business success.");
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const currentLevel = Math.min(score + 1, totalPairs);

  return (
    <GameShell
      title="Puzzle of Customers"
      subtitle={
        showResult
          ? "Well done! You understand the power of a loyal customer base and customer satisfaction."
          : `Match customer relationships to their business impact: ${score}/${totalPairs} matched`
      }
      currentLevel={currentLevel}
      totalLevels={totalPairs}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalPairs}
      flashPoints={flashPoints}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-6">
        {!showResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-700 pb-2">
                Customer Aspect
              </div>
              <div className="space-y-3">
                {LEFT_ITEMS.map((l) => {
                  const isMatched = Boolean(matched[l.id]);
                  const isSelected = selectedLeft?.id === l.id;
                  const base =
                    isMatched
                      ? "from-emerald-900/50 to-emerald-800/50 border-emerald-500/50 opacity-50 text-emerald-200"
                      : isSelected
                      ? "from-blue-600 to-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-[1.02]"
                      : "from-slate-800 to-slate-900 border-slate-600 text-slate-300 hover:border-indigo-500";
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleLeftSelect(l)}
                      disabled={isMatched}
                      className={`w-full text-left rounded-xl bg-gradient-to-r ${base} border-2 p-4 font-semibold transition-all duration-300`}
                    >
                      {l.text}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-700 pb-2">
                Business Impact
              </div>
              <div className="grid grid-cols-1 gap-3">
                {RIGHT_ITEMS.map((r) => {
                  const used = Object.values(matched).includes(r.id);
                  const isActive = selectedRight?.id === r.id;
                  const base =
                    used
                      ? "from-emerald-900/50 to-emerald-800/50 border-emerald-500/50 opacity-50 text-emerald-200"
                      : isActive
                      ? "from-rose-600 to-pink-600 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-[1.02]"
                      : "from-slate-800 to-slate-900 border-slate-600 text-slate-300 hover:border-rose-500";
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRightSelect(r)}
                      disabled={used}
                      className={`w-full text-left rounded-xl bg-gradient-to-r ${base} border-2 p-4 font-semibold transition-all duration-300`}
                    >
                      {r.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {outcomeText && !showResult && (
          <div className="rounded-xl bg-slate-800/80 border border-slate-600 p-4 text-center text-sm text-slate-300 font-medium animate-fade-in-up">
            {outcomeText}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfCustomers;
