import { Brain, Target } from "lucide-react";
import buildIds from "../buildGameIds";

export const brainGamesYoungAdultIds = buildIds("brain", "young-adult");

export const getBrainYoungAdultGames = (gameCompletionStatus) => {
  const brainYoungAdultGames = [
    {
      id: "brain-young-adult-1",
      title: "Too Many Commitments",
      description:
        "A college student faces exams, a part-time job, and family pressure—prioritize to protect focus.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/too-many-commitments",
      index: 0,
      scenario: {
        setup:
          "A student juggling exams, part-time work, and family expectations triggers stress when multiple deadlines collide.",
        choices: [
          {
            label: "Complete everything as planned",
            outcome: "Stress increases and focus decreases."
          },
          {
            label: "Prioritize tasks and postpone others",
            outcome: "Pressure reduces but some work stays pending."
          },
          {
            label: "Avoid planning and hope it works out",
            outcome: "Anxiety rises due to lack of control."
          }
        ],
        reflections: [
          "What signs show that pressure is building?",
          "Which tasks truly need immediate attention?"
        ],
        skill: "Prioritisation awareness"
      },
    },
    {
      id: "brain-young-adult-2",
      title: "Saying Yes Again",
      description:
        "A young adult learns to say no without guilt so the mental load stays manageable.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/saying-yes-again",
      index: 1,
      scenario: {
        setup:
          "A young adult already busy with studies and work receives more requests for help and favors.",
        choices: [
          {
            label: "Agree to help everyone despite feeling exhausted",
            outcome: "Stress increases and energy levels drop."
          },
          {
            label: "Say no politely and explain current limits",
            outcome: "Discomfort appears but mental load reduces."
          },
          {
            label: "Ignore messages to avoid confrontation",
            outcome: "Temporary relief is followed by tension later."
          }
        ],
        reflections: [
          "Why does saying no feel difficult?",
          "What happens when personal limits are ignored?"
        ],
        skill: "Boundary awareness"
      },
    },
  ];

  return brainYoungAdultGames;
};
