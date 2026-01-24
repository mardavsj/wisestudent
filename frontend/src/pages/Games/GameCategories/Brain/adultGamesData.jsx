import { Brain } from "lucide-react";
import buildIds from "../buildGameIds";

export const brainGamesAdultIds = buildIds("brain", "adults");

export const getBrainAdultGames = (gameCompletionStatus) => {
  const brainAdultGames = [
    {
      id: "brain-adults-1",
      title: "Month-End Pressure",
      description:
        "An adult professional juggles bills, EMIs, and daily expenses as month-end approaches.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/month-end-pressure",
      index: 0,
      scenario: {
        setup:
          "Expenses are higher than income near month-end, with bills, EMIs, and daily needs overlapping in one week.",
        choices: [
          {
            label: "Ignore the issue and hope next month improves",
            outcome: "Stress repeats every month",
          },
          {
            label: "Review expenses and identify leaks",
            outcome: "Clarity improves and control increases",
          },
          {
            label: "Use credit to manage the gap",
            outcome: "Temporary relief but future pressure builds",
          },
        ],
        reflections: [
          "Which expenses feel unavoidable?",
          "What patterns repeat every month?",
        ],
        skill: "Cash flow awareness",
      },
    },
  ];

  return brainAdultGames;
};
