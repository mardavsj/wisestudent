import { Coins, Wallet, Target } from "lucide-react";
import buildIds from "../buildGameIds";

export const financegGameIdsAdults = buildIds("finance", "adults");

export const getFinanceAdultGames = (gameCompletionStatus) => {
  const financeAdultGames = [
    {
      id: "finance-adults-1",
      title: "Income vs Expense Reality",
      description:
        "₹18,000 income versus ₹20,000 expenses—what does this gap teach you?",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/income-vs-expense-reality",
      index: 0,
      scenario: {
        setup:
          "You earned ₹18,000 this month but your expenses total ₹20,000. This gap is a reality check on your budgeting habits.",
        choices: [
          {
            label: "You are saving money",
            outcome: "Consistent surplus builds security over time.",
          },
          {
            label: "You are spending more than you earn",
            outcome: "Recurring deficits will erode savings and stress future paychecks.",
          },
        ],
        reflections: [
          "What adjustments can you make to avoid overspending next month?",
          "Which expenses can wait until after you build a buffer?",
        ],
        skill: "Expense awareness",
      },
    },
    {
      id: "finance-adults-2",
      title: "What Is Financial Literacy?",
      description:
        "Financial literacy means making smart choices when earning, saving, spending, or borrowing.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/what-is-financial-literacy",
      index: 1,
      scenario: {
        setup:
          "Financial literacy helps people understand how to earn, spend, save, and borrow responsibly. Choose the most accurate statement.",
        choices: [
          {
            label: "Earn more money only",
            outcome: "Earning is vital, but literacy extends to managing that income.",
          },
          {
            label: "Manage earning, spending, saving, and borrowing wisely",
            outcome:
              "True financial literacy keeps balancing all aspects of money, not just earning.",
          },
        ],
        reflections: [
          "Why is managing your expenses just as important as earning income?",
          "How does borrowing fit into healthy money habits?",
        ],
        skill: "Holistic money awareness",
      },
    },
  ];

  return financeAdultGames;
};
