import { Wallet } from "lucide-react";
import buildIds from "../buildGameIds";

export const financegGameIdsYoungAdult = buildIds("finance", "young-adult");

export const getFinanceYoungAdultGames = (gameCompletionStatus) => {
  const financeYoungAdultGames = [
    {
      id: "finance-young-adult-1",
      title: "First Income Reality",
      description:
        "You receive your first stipend or salary—what does this income represent for you?",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-income-reality",
      index: 0,
      scenario: {
        setup:
          "You receive your first stipend or salary. It feels exciting, but you also wonder what this income truly means.",
        choices: [
          {
            label: "Free money to spend however you like",
            outcome:
              "Spending it without a plan gives a momentary high, but you soon run out of fuel for your responsibilities.",
          },
          {
            label: "A responsibility to manage wisely",
            outcome:
              "This income opens the door to freedom, provided you plan for needs, savings, and growth.",
          },
        ],
        reflections: [
          "How can you balance freedom and responsibility when money arrives for the first time?",
          "Which immediate priorities should you handle before splurging?",
        ],
        skill: "Responsible income mindset",
      },
    },
  ];

  return financeYoungAdultGames;
};
