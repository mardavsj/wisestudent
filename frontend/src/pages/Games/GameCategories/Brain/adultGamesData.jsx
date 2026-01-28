import { Brain } from "lucide-react";
import buildIds from "../buildGameIds";

export const brainGamesAdultIds = buildIds("brain", "adults");

export const getBrainAdultGames = (gameCompletionStatus) => {
  const brainAdultGames = [
    {
      id: "brain-adults-1",
      title: "Always On Mode",
      description:
        "An adult professional remains mentally engaged with work even after office hours.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/always-on-mode",
      index: 0,
      scenario: {
        setup:
          "An adult professional remains mentally engaged with work even after office hours.",
        choices: [
          {
            label: "Stay alert and responsive at all times",
            outcome: "Mental fatigue builds steadily",
          },
          {
            label: "Mentally disengage after work hours",
            outcome: "Mental space improves gradually",
          },
          {
            label: "Ignore the discomfort and continue as usual",
            outcome: "Stress accumulates unnoticed",
          },
        ],
        reflections: [
          "When does your mind stop working?",
          "What signals mental overload for you?",
        ],
        skill: "Mental boundary awareness",
      },
    },
    {
      id: "brain-adults-2",
      title: "Responsibility Pile-Up",
      description:
        "An adult manages work, family duties, and personal commitments simultaneously.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/responsibility-pile-up",
      index: 1,
      scenario: {
        setup:
          "An adult manages work, family duties, and personal commitments simultaneously.",
        choices: [
          {
            label: "Try to handle everything without adjustment",
            outcome: "Exhaustion increases",
          },
          {
            label: "Acknowledge limits and prioritise",
            outcome: "Control improves slowly",
          },
          {
            label: "Avoid thinking about the pressure",
            outcome: "Stress resurfaces later",
          },
        ],
        reflections: [
          "Which responsibilities feel heaviest?",
          "What happens when limits are ignored?",
        ],
        skill: "Capacity awareness",
      },
    },
    {
      id: "brain-adults-3",
      title: "Silent Burn",
      description:
        "An adult feels tired and irritable but continues daily routines.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/silent-burn",
      index: 2,
      scenario: {
        setup:
          "An adult feels tired and irritable but continues daily routines.",
        choices: [
          {
            label: "Ignore the feeling and keep going",
            outcome: "Burnout risk increases",
          },
          {
            label: "Notice the change in energy",
            outcome: "Awareness improves",
          },
          {
            label: "Distract with constant activity",
            outcome: "Fatigue deepens",
          },
        ],
        reflections: [
          "What signs show silent exhaustion?",
          "How early do you notice them?",
        ],
        skill: "Burnout signal awareness",
      },
    },
    {
      id: "brain-adults-4",
      title: "Deadline Collision",
      description:
        "Multiple work and personal deadlines fall on the same week.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/deadline-collision",
      index: 3,
      scenario: {
        setup:
          "Multiple work and personal deadlines fall on the same week.",
        choices: [
          {
            label: "Rush through everything",
            outcome: "Errors and stress increase",
          },
          {
            label: "Re-evaluate priorities calmly",
            outcome: "Control improves",
          },
          {
            label: "Delay decisions",
            outcome: "Anxiety builds",
          },
        ],
        reflections: [
          "How do you react to overlapping demands?",
          "What restores control for you?",
        ],
        skill: "Adaptive planning awareness",
      },
    },
    {
      id: "brain-adults-5",
      title: "Carrying It Home",
      description:
        "Work stress affects mood at home.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/carrying-it-home",
      index: 4,
      scenario: {
        setup:
          "Work stress affects mood at home.",
        choices: [
          {
            label: "Release stress at home",
            outcome: "Relationship tension increases",
          },
          {
            label: "Recognise spillover and pause",
            outcome: "Emotional balance improves",
          },
          {
            label: "Suppress emotions",
            outcome: "Stress accumulates internally",
          },
        ],
        reflections: [
          "When does work affect home life?",
          "How do you notice emotional spillover?",
        ],
        skill: "Spillover awareness",
      },
    },
    {
      id: "brain-adults-6",
      title: "Productivity Guilt",
      description:
        "An adult feels guilty when resting or slowing down.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/productivity-guilt",
      index: 5,
      scenario: {
        setup:
          "An adult feels guilty when resting or slowing down.",
        choices: [
          {
            label: "Self-criticise for resting",
            outcome: "Mental pressure increases",
          },
          {
            label: "Accept rest as necessary",
            outcome: "Balance improves",
          },
          {
            label: "Avoid resting completely",
            outcome: "Fatigue deepens",
          },
        ],
        reflections: [
          "What beliefs affect your rest?",
          "How does guilt affect energy?",
        ],
        skill: "Rest perception awareness",
      },
    },
    {
      id: "brain-adults-7",
      title: "Never Enough Time",
      description:
        "An adult feels there is never enough time to complete everything.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/never-enough-time",
      index: 6,
      scenario: {
        setup:
          "An adult feels there is never enough time to complete everything.",
        choices: [
          {
            label: "Rush faster",
            outcome: "Stress intensifies",
          },
          {
            label: "Slow down and reassess",
            outcome: "Clarity improves",
          },
          {
            label: "Ignore the feeling",
            outcome: "Pressure persists",
          },
        ],
        reflections: [
          "What makes time feel insufficient?",
          "How does slowing change perception?",
        ],
        skill: "Time pressure awareness",
      },
    },
    {
      id: "brain-adults-8",
      title: "Holding It Together",
      description:
        "An adult feels pressure to appear strong for others.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/holding-it-together",
      index: 7,
      scenario: {
        setup:
          "An adult feels pressure to appear strong for others.",
        choices: [
          {
            label: "Hide all struggles",
            outcome: "Internal stress builds",
          },
          {
            label: "Acknowledge inner strain",
            outcome: "Self-awareness improves",
          },
          {
            label: "Distract with busyness",
            outcome: "Emotional fatigue increases",
          },
        ],
        reflections: [
          "Who do you feel strong for?",
          "What happens when strain is hidden?",
        ],
        skill: "Emotional honesty awareness",
      },
    },
    {
      id: "brain-adults-9",
      title: "Constant Catch-Up",
      description:
        "An adult feels behind despite continuous effort.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/constant-catch-up",
      index: 8,
      scenario: {
        setup:
          "An adult feels behind despite continuous effort.",
        choices: [
          {
            label: "Push harder",
            outcome: "Exhaustion increases",
          },
          {
            label: "Reassess expectations",
            outcome: "Perspective improves",
          },
          {
            label: "Avoid reflecting",
            outcome: "Frustration grows",
          },
        ],
        reflections: [
          "What makes you feel behind?",
          "How do expectations affect stress?",
        ],
        skill: "Expectation awareness",
      },
    },
    {
      id: "brain-adults-10",
      title: "Mental Reset Point",
      description:
        "After prolonged pressure, energy feels low.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/mental-reset-point",
      index: 9,
      scenario: {
        setup:
          "After prolonged pressure, energy feels low.",
        choices: [
          {
            label: "Ignore fatigue",
            outcome: "Burnout deepens",
          },
          {
            label: "Pause and reflect",
            outcome: "Recovery begins",
          },
          {
            label: "Withdraw completely",
            outcome: "Confidence reduces",
          },
        ],
        reflections: [
          "What signals mental exhaustion?",
          "What helps you reset?",
        ],
        skill: "Mental reset awareness",
      },
    },
    {
      id: "brain-adults-11",
      title: "Waiting for the Outcome",
      description:
        "An adult is waiting for an important work or personal outcome.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/waiting-for-the-outcome",
      index: 10,
      scenario: {
        setup:
          "An adult is waiting for an important work or personal outcome.",
        choices: [
          {
            label: "Constantly imagine negative outcomes",
            outcome: "Anxiety increases steadily",
          },
          {
            label: "Focus on daily routines",
            outcome: "Mental balance improves",
          },
          {
            label: "Avoid thinking about the situation",
            outcome: "Worry returns unexpectedly",
          },
        ],
        reflections: [
          "How do you react to uncertainty?",
          "What helps you stay grounded?",
        ],
        skill: "Uncertainty tolerance awareness",
      },
    },
    {
      id: "brain-adults-12",
      title: "Fear of Making the Wrong Choice",
      description:
        "An adult faces a decision with long-term impact.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-making-the-wrong-choice",
      index: 11,
      scenario: {
        setup:
          "An adult faces a decision with long-term impact.",
        choices: [
          {
            label: "Delay the decision repeatedly",
            outcome: "Stress builds over time",
          },
          {
            label: "Decide with available information",
            outcome: "Confidence stabilises",
          },
          {
            label: "Let others decide",
            outcome: "Self-trust reduces",
          },
        ],
        reflections: [
          "What decisions feel most risky?",
          "How does avoidance affect you?",
        ],
        skill: "Decision confidence awareness",
      },
    },
    {
      id: "brain-adults-13",
      title: "What If Loop",
      description:
        "An adult repeatedly imagines worst-case future scenarios.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/what-if-loop",
      index: 12,
      scenario: {
        setup:
          "An adult repeatedly imagines worst-case future scenarios.",
        choices: [
          {
            label: "Engage with every worry",
            outcome: "Anxiety escalates",
          },
          {
            label: "Notice thoughts and refocus",
            outcome: "Mental calm improves",
          },
          {
            label: "Force thoughts away",
            outcome: "Thoughts return stronger",
          },
        ],
        reflections: [
          "Which thoughts repeat most?",
          "How do you usually respond?",
        ],
        skill: "Thought pattern awareness",
      },
    },
    {
      id: "brain-adults-14",
      title: "Fear of Falling Behind",
      description:
        "Peers appear to progress faster in life or career.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-falling-behind",
      index: 13,
      scenario: {
        setup:
          "Peers appear to progress faster in life or career.",
        choices: [
          {
            label: "Rush decisions",
            outcome: "Stress increases",
          },
          {
            label: "Focus on personal pace",
            outcome: "Stability improves",
          },
          {
            label: "Withdraw from comparison",
            outcome: "Perspective improves",
          },
        ],
        reflections: [
          "Who do you compare yourself with?",
          "What pace feels sustainable?",
        ],
        skill: "Self-paced growth awareness",
      },
    },
    {
      id: "brain-adults-15",
      title: "Fear of Starting Again",
      description:
        "An adult hesitates to restart after a setback.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-starting-again",
      index: 14,
      scenario: {
        setup:
          "An adult hesitates to restart after a setback.",
        choices: [
          {
            label: "Avoid starting again",
            outcome: "Regret increases",
          },
          {
            label: "Begin with a small step",
            outcome: "Confidence builds gradually",
          },
          {
            label: "Wait for confidence",
            outcome: "Momentum remains low",
          },
        ],
        reflections: [
          "What stops you from restarting?",
          "How do small steps change fear?",
        ],
        skill: "Restart awareness",
      },
    },
    {
      id: "brain-adults-16",
      title: "Fear of Judgement",
      description:
        "An adult worries about being judged for choices or lifestyle.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-judgement",
      index: 15,
      scenario: {
        setup:
          "An adult worries about being judged for choices or lifestyle.",
        choices: [
          {
            label: "Avoid situations",
            outcome: "Opportunities reduce",
          },
          {
            label: "Act despite discomfort",
            outcome: "Confidence grows slowly",
          },
          {
            label: "Seek constant reassurance",
            outcome: "Dependence increases",
          },
        ],
        reflections: [
          "Whose judgement affects you most?",
          "What happens when you face it?",
        ],
        skill: "Social confidence awareness",
      },
    },
    {
      id: "brain-adults-17",
      title: "Unclear Future",
      description:
        "An adult feels unsure about long-term direction.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/unclear-future",
      index: 16,
      scenario: {
        setup:
          "An adult feels unsure about long-term direction.",
        choices: [
          {
            label: "Avoid thinking about the future",
            outcome: "Anxiety increases",
          },
          {
            label: "Explore options gradually",
            outcome: "Clarity improves over time",
          },
          {
            label: "Follow others' paths",
            outcome: "Dissatisfaction appears later",
          },
        ],
        reflections: [
          "What makes the future feel unclear?",
          "How does exploration help?",
        ],
        skill: "Future clarity awareness",
      },
    },
    {
      id: "brain-adults-18",
      title: "After the Mistake",
      description:
        "An error occurs at work or in a personal responsibility.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-18"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/after-the-mistake",
      index: 17,
      scenario: {
        setup:
          "An error occurs at work or in a personal responsibility.",
        choices: [
          {
            label: "Hide the mistake",
            outcome: "Stress increases",
          },
          {
            label: "Acknowledge it",
            outcome: "Confidence rebuilds",
          },
          {
            label: "Blame circumstances",
            outcome: "Learning reduces",
          },
        ],
        reflections: [
          "How do you react to mistakes?",
          "What helps you move forward?",
        ],
        skill: "Mistake response awareness",
      },
    },
    {
      id: "brain-adults-19",
      title: "Pressure to Be Stable",
      description:
        "An adult feels expected to always be financially and emotionally stable.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/pressure-to-be-stable",
      index: 18,
      scenario: {
        setup:
          "An adult feels expected to always be financially and emotionally stable.",
        choices: [
          {
            label: "Suppress concerns",
            outcome: "Stress builds silently",
          },
          {
            label: "Acknowledge internal pressure",
            outcome: "Self-awareness improves",
          },
          {
            label: "Overcompensate with effort",
            outcome: "Fatigue increases",
          },
        ],
        reflections: [
          "What expectations feel heavy?",
          "How do they affect you?",
        ],
        skill: "Stability pressure awareness",
      },
    },
    {
      id: "brain-adults-20",
      title: "Facing the Outcome",
      description:
        "An adult receives an outcome different from expectations.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/facing-the-outcome",
      index: 19,
      scenario: {
        setup:
          "An adult receives an outcome different from expectations.",
        choices: [
          {
            label: "Self-criticise harshly",
            outcome: "Confidence drops",
          },
          {
            label: "Reflect and recalibrate",
            outcome: "Resilience increases",
          },
          {
            label: "Avoid future attempts",
            outcome: "Opportunities reduce",
          },
        ],
        reflections: [
          "How do outcomes affect your self-view?",
          "What helps recovery?",
        ],
        skill: "Outcome resilience awareness",
      },
    },
    {
      id: "brain-adults-21",
      title: "Sudden Irritation",
      description:
        "An adult feels irritated during a normal conversation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/sudden-irritation",
      index: 20,
      scenario: {
        setup:
          "An adult feels irritated during a normal conversation.",
        choices: [
          {
            label: "React immediately with frustration",
            outcome: "Conflict increases",
          },
          {
            label: "Pause and notice the emotion",
            outcome: "Awareness improves",
          },
          {
            label: "Suppress the feeling",
            outcome: "Emotion resurfaces later",
          },
        ],
        reflections: [
          "What usually triggers irritation?",
          "How early do you notice it?",
        ],
        skill: "Emotional awareness",
      },
    },
    {
      id: "brain-adults-22",
      title: "Mixed Feelings",
      description:
        "An adult feels excitement and anxiety about the same situation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/mixed-feelings",
      index: 21,
      scenario: {
        setup:
          "An adult feels excitement and anxiety about the same situation.",
        choices: [
          {
            label: "Ignore uncomfortable feelings",
            outcome: "Confusion remains",
          },
          {
            label: "Acknowledge both emotions",
            outcome: "Clarity improves",
          },
          {
            label: "Focus only on anxiety",
            outcome: "Stress increases",
          },
        ],
        reflections: [
          "Which emotions often appear together?",
          "How does acknowledgment help?",
        ],
        skill: "Emotional clarity",
      },
    },
    {
      id: "brain-adults-23",
      title: "Emotional Build-Up",
      description:
        "Stressful days pass without emotional release.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-build-up",
      index: 22,
      scenario: {
        setup:
          "Stressful days pass without emotional release.",
        choices: [
          {
            label: "Release emotions suddenly",
            outcome: "Relief followed by discomfort",
          },
          {
            label: "Address emotions gradually",
            outcome: "Balance improves",
          },
          {
            label: "Ignore emotions",
            outcome: "Emotional overload appears later",
          },
        ],
        reflections: [
          "How do emotions build up for you?",
          "What helps gradual release?",
        ],
        skill: "Emotional regulation awareness",
      },
    },
    {
      id: "brain-adults-24",
      title: "Feeling Disconnected",
      description:
        "An adult feels emotionally distant from daily life.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/feeling-disconnected",
      index: 23,
      scenario: {
        setup:
          "An adult feels emotionally distant from daily life.",
        choices: [
          {
            label: "Ignore the feeling",
            outcome: "Disconnection continues",
          },
          {
            label: "Notice and reflect on it",
            outcome: "Awareness increases",
          },
          {
            label: "Force emotional reactions",
            outcome: "Frustration increases",
          },
        ],
        reflections: [
          "When do you feel disconnected?",
          "What helps reconnection?",
        ],
        skill: "Emotional sensitivity awareness",
      },
    },
    {
      id: "brain-adults-25",
      title: "Anger Without Warning",
      description:
        "A small event triggers unexpected anger.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/anger-without-warning",
      index: 24,
      scenario: {
        setup:
          "A small event triggers unexpected anger.",
        choices: [
          {
            label: "Express anger immediately",
            outcome: "Conflict escalates",
          },
          {
            label: "Pause and reflect",
            outcome: "Control improves",
          },
          {
            label: "Suppress anger",
            outcome: "Anger resurfaces later",
          },
        ],
        reflections: [
          "What triggers anger for you?",
          "How do you usually respond?",
        ],
        skill: "Anger awareness",
      },
    },
    {
      id: "brain-adults-26",
      title: "Mood Shifts",
      description:
        "An adult notices mood changes across the day.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-26"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/mood-shifts",
      index: 25,
      scenario: {
        setup:
          "An adult notices mood changes across the day.",
        choices: [
          {
            label: "React to every mood",
            outcome: "Emotional exhaustion increases",
          },
          {
            label: "Observe mood patterns",
            outcome: "Understanding improves",
          },
          {
            label: "Ignore mood changes",
            outcome: "Confusion continues",
          },
        ],
        reflections: [
          "What affects your mood most?",
          "How do patterns help awareness?",
        ],
        skill: "Mood pattern awareness",
      },
    },
    {
      id: "brain-adults-27",
      title: "Emotional Spillover",
      description:
        "Stress from one role affects another area of life.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-27"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-spillover",
      index: 26,
      scenario: {
        setup:
          "Stress from one role affects another area of life.",
        choices: [
          {
            label: "React emotionally everywhere",
            outcome: "Stress spreads",
          },
          {
            label: "Identify the source of stress",
            outcome: "Control improves",
          },
          {
            label: "Blame others",
            outcome: "Relationships strain",
          },
        ],
        reflections: [
          "Where does stress spill over?",
          "How does awareness help?",
        ],
        skill: "Emotional spillover awareness",
      },
    },
    {
      id: "brain-adults-28",
      title: "Repeating Triggers",
      description:
        "Certain situations repeatedly trigger emotions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-28"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/repeating-triggers",
      index: 27,
      scenario: {
        setup:
          "Certain situations repeatedly trigger emotions.",
        choices: [
          {
            label: "React automatically",
            outcome: "Patterns repeat",
          },
          {
            label: "Notice trigger patterns",
            outcome: "Awareness increases",
          },
          {
            label: "Avoid situations",
            outcome: "Avoidance limits growth",
          },
        ],
        reflections: [
          "What triggers emotions most often?",
          "How does awareness change response?",
        ],
        skill: "Trigger recognition",
      },
    },
    {
      id: "brain-adults-29",
      title: "Expressing Feelings",
      description:
        "An adult struggles to express emotions clearly.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-29"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/expressing-feelings",
      index: 28,
      scenario: {
        setup:
          "An adult struggles to express emotions clearly.",
        choices: [
          {
            label: "Keep emotions inside",
            outcome: "Stress builds",
          },
          {
            label: "Express calmly",
            outcome: "Understanding improves",
          },
          {
            label: "Express emotionally",
            outcome: "Miscommunication occurs",
          },
        ],
        reflections: [
          "How do you express emotions?",
          "What helps clarity?",
        ],
        skill: "Emotional expression awareness",
      },
    },
    {
      id: "brain-adults-30",
      title: "Emotional Reset",
      description:
        "Emotions feel heavy after a long day.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-30"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-reset",
      index: 29,
      scenario: {
        setup:
          "Emotions feel heavy after a long day.",
        choices: [
          {
            label: "Ignore emotions",
            outcome: "Stress remains",
          },
          {
            label: "Pause and reflect",
            outcome: "Relief improves",
          },
          {
            label: "Distract continuously",
            outcome: "Fatigue continues",
          },
        ],
        reflections: [
          "What helps you reset emotionally?",
          "How do you recognise overload?",
        ],
        skill: "Emotional reset awareness",
      },
    },
    {
      id: "brain-adults-31",
      title: "Feeling Behind in Life",
      description:
        "An adult compares life progress with peers and feels inadequate.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-31"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/feeling-behind-in-life",
      index: 30,
      scenario: {
        setup:
          "An adult compares life progress with peers and feels inadequate.",
        choices: [
          {
            label: "Criticise self harshly",
            outcome: "Self-esteem reduces",
          },
          {
            label: "Acknowledge personal journey",
            outcome: "Confidence stabilises",
          },
          {
            label: "Withdraw socially",
            outcome: "Isolation increases",
          },
        ],
        reflections: [
          "What milestones affect your self-worth?",
          "How do you define progress?",
        ],
        skill: "Self-worth awareness",
      },
    },
    {
      id: "brain-adults-32",
      title: "Role Overload",
      description:
        "An adult manages multiple identities such as professional, parent, partner, or caregiver.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-32"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/role-overload",
      index: 31,
      scenario: {
        setup:
          "An adult manages multiple identities such as professional, parent, partner, or caregiver.",
        choices: [
          {
            label: "Try to excel in all roles equally",
            outcome: "Exhaustion increases",
          },
          {
            label: "Accept shifting priorities",
            outcome: "Balance improves",
          },
          {
            label: "Ignore identity conflict",
            outcome: "Inner tension grows",
          },
        ],
        reflections: [
          "Which roles feel heaviest?",
          "How do priorities change over time?",
        ],
        skill: "Role balance awareness",
      },
    },
    {
      id: "brain-adults-33",
      title: "Seeking Validation",
      description:
        "An adult's confidence depends on praise or recognition.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-33"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/seeking-validation",
      index: 32,
      scenario: {
        setup:
          "An adult's confidence depends on praise or recognition.",
        choices: [
          {
            label: "Seek more validation",
            outcome: "Dependence increases",
          },
          {
            label: "Focus on internal satisfaction",
            outcome: "Self-trust improves",
          },
          {
            label: "Withdraw effort",
            outcome: "Motivation drops",
          },
        ],
        reflections: [
          "Where do you seek validation?",
          "What builds internal confidence?",
        ],
        skill: "Validation awareness",
      },
    },
    {
      id: "brain-adults-34",
      title: "Labeling Yourself",
      description:
        "An adult labels themselves based on one failure.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-34"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/labeling-yourself",
      index: 33,
      scenario: {
        setup:
          "An adult labels themselves based on one failure.",
        choices: [
          {
            label: "Accept the negative label",
            outcome: "Confidence drops",
          },
          {
            label: "Separate action from identity",
            outcome: "Perspective improves",
          },
          {
            label: "Avoid reflecting",
            outcome: "Learning slows",
          },
        ],
        reflections: [
          "What labels do you use on yourself?",
          "How do labels affect confidence?",
        ],
        skill: "Identity separation awareness",
      },
    },
    {
      id: "brain-adults-35",
      title: "Comparing Life Timelines",
      description:
        "Friends reach marriage, career, or financial milestones at different times.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-35"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/comparing-life-timelines",
      index: 34,
      scenario: {
        setup:
          "Friends reach marriage, career, or financial milestones at different times.",
        choices: [
          {
            label: "Rush major decisions",
            outcome: "Stress increases",
          },
          {
            label: "Accept personal timeline",
            outcome: "Peace improves",
          },
          {
            label: "Avoid future thinking",
            outcome: "Uncertainty continues",
          },
        ],
        reflections: [
          "Which timelines affect you most?",
          "What does progress mean to you?",
        ],
        skill: "Timeline acceptance",
      },
    },
    {
      id: "brain-adults-36",
      title: "Confidence Drop",
      description:
        "An adult experiences a setback after consistent effort.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-36"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/confidence-drop",
      index: 35,
      scenario: {
        setup:
          "An adult experiences a setback after consistent effort.",
        choices: [
          {
            label: "Avoid future attempts",
            outcome: "Growth slows",
          },
          {
            label: "Reflect and try again",
            outcome: "Confidence rebuilds",
          },
          {
            label: "Blame circumstances",
            outcome: "Learning reduces",
          },
        ],
        reflections: [
          "How do setbacks affect confidence?",
          "What helps recovery?",
        ],
        skill: "Confidence recovery awareness",
      },
    },
    {
      id: "brain-adults-37",
      title: "Identity Drift",
      description:
        "An adult feels unsure about who they are becoming.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-37"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/identity-drift",
      index: 36,
      scenario: {
        setup:
          "An adult feels unsure about who they are becoming.",
        choices: [
          {
            label: "Copy others' identities",
            outcome: "Dissatisfaction increases",
          },
          {
            label: "Explore interests gradually",
            outcome: "Clarity improves",
          },
          {
            label: "Avoid self-reflection",
            outcome: "Confusion persists",
          },
        ],
        reflections: [
          "What influences your identity now?",
          "How does exploration help clarity?",
        ],
        skill: "Identity exploration awareness",
      },
    },
    {
      id: "brain-adults-38",
      title: "External Success Pressure",
      description:
        "Success is measured against societal standards.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-38"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/external-success-pressure",
      index: 37,
      scenario: {
        setup:
          "Success is measured against societal standards.",
        choices: [
          {
            label: "Use others as benchmarks",
            outcome: "Pressure increases",
          },
          {
            label: "Define personal success",
            outcome: "Motivation stabilises",
          },
          {
            label: "Avoid setting goals",
            outcome: "Direction weakens",
          },
        ],
        reflections: [
          "How do you define success?",
          "Whose standards influence you?",
        ],
        skill: "Personal success awareness",
      },
    },
    {
      id: "brain-adults-39",
      title: "Self-Image Erosion",
      description:
        "Repeated self-criticism affects confidence over time.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-39"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/self-image-erosion",
      index: 38,
      scenario: {
        setup:
          "Repeated self-criticism affects confidence over time.",
        choices: [
          {
            label: "Continue self-criticism",
            outcome: "Confidence reduces",
          },
          {
            label: "Notice and question thoughts",
            outcome: "Self-image improves",
          },
          {
            label: "Ignore self-image concerns",
            outcome: "Issues persist",
          },
        ],
        reflections: [
          "What thoughts affect your self-image?",
          "How does awareness change perception?",
        ],
        skill: "Self-image awareness",
      },
    },
    {
      id: "brain-adults-40",
      title: "Identity Reset",
      description:
        "Life changes prompt reassessment of identity.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-40"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/identity-reset",
      index: 39,
      scenario: {
        setup:
          "Life changes prompt reassessment of identity.",
        choices: [
          {
            label: "Resist change",
            outcome: "Stress increases",
          },
          {
            label: "Adapt gradually",
            outcome: "Stability improves",
          },
          {
            label: "Avoid reflection",
            outcome: "Confusion continues",
          },
        ],
        reflections: [
          "What changes affect identity most?",
          "How does adaptation help?",
        ],
        skill: "Identity resilience awareness",
      },
    },
    {
      id: "brain-adults-41",
      title: "Pressure to Keep Peace",
      description:
        "An adult avoids expressing disagreement to maintain harmony in relationships.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-41"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/pressure-to-keep-peace",
      index: 40,
      scenario: {
        setup:
          "An adult avoids expressing disagreement to maintain harmony in relationships.",
        choices: [
          {
            label: "Stay silent to keep peace",
            outcome: "Resentment builds slowly",
          },
          {
            label: "Express feelings calmly",
            outcome: "Understanding improves",
          },
          {
            label: "React emotionally later",
            outcome: "Conflict escalates",
          },
        ],
        reflections: [
          "When do you avoid conflict?",
          "What happens when feelings are unspoken?",
        ],
        skill: "Conflict awareness",
      },
    },
    {
      id: "brain-adults-42",
      title: "Difficulty Saying No",
      description:
        "Requests from family or colleagues feel constant.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-42"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/difficulty-saying-no",
      index: 41,
      scenario: {
        setup:
          "Requests from family or colleagues feel constant.",
        choices: [
          {
            label: "Agree despite exhaustion",
            outcome: "Burnout risk increases",
          },
          {
            label: "Say no respectfully",
            outcome: "Boundaries strengthen",
          },
          {
            label: "Avoid responding",
            outcome: "Tension builds",
          },
        ],
        reflections: [
          "What makes saying no difficult?",
          "How do boundaries protect energy?",
        ],
        skill: "Boundary setting awareness",
      },
    },
    {
      id: "brain-adults-43",
      title: "Emotional Distance",
      description:
        "An adult feels distant in a close relationship.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-43"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-distance",
      index: 42,
      scenario: {
        setup:
          "An adult feels distant in a close relationship.",
        choices: [
          {
            label: "Ignore the distance",
            outcome: "Disconnection grows",
          },
          {
            label: "Acknowledge and reflect",
            outcome: "Clarity improves",
          },
          {
            label: "Withdraw further",
            outcome: "Loneliness increases",
          },
        ],
        reflections: [
          "When do you feel distant?",
          "What signals emotional disconnect?",
        ],
        skill: "Relationship awareness",
      },
    },
    {
      id: "brain-adults-44",
      title: "People-Pleasing Pattern",
      description:
        "An adult prioritises others' needs over personal limits.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-44"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/people-pleasing-pattern",
      index: 43,
      scenario: {
        setup:
          "An adult prioritises others' needs over personal limits.",
        choices: [
          {
            label: "Continue pleasing others",
            outcome: "Resentment increases",
          },
          {
            label: "Balance personal needs",
            outcome: "Balance improves",
          },
          {
            label: "Withdraw socially",
            outcome: "Connection weakens",
          },
        ],
        reflections: [
          "When do you put others first?",
          "What happens when needs are ignored?",
        ],
        skill: "People-pleasing awareness",
      },
    },
    {
      id: "brain-adults-45",
      title: "Social Energy Drain",
      description:
        "Social interactions feel exhausting over time.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-45"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/social-energy-drain",
      index: 44,
      scenario: {
        setup:
          "Social interactions feel exhausting over time.",
        choices: [
          {
            label: "Continue socialising",
            outcome: "Fatigue increases",
          },
          {
            label: "Take personal space",
            outcome: "Energy recovers",
          },
          {
            label: "Avoid all interactions",
            outcome: "Isolation increases",
          },
        ],
        reflections: [
          "How do social situations affect energy?",
          "What balance works for you?",
        ],
        skill: "Social energy awareness",
      },
    },
    {
      id: "brain-adults-46",
      title: "Unclear Boundaries",
      description:
        "Boundaries in work or family are not clearly defined.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-46"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/unclear-boundaries",
      index: 45,
      scenario: {
        setup:
          "Boundaries in work or family are not clearly defined.",
        choices: [
          {
            label: "Ignore discomfort",
            outcome: "Stress increases",
          },
          {
            label: "Clarify boundaries",
            outcome: "Respect improves",
          },
          {
            label: "React abruptly",
            outcome: "Tension increases",
          },
        ],
        reflections: [
          "Where are boundaries unclear?",
          "How does clarity help relationships?",
        ],
        skill: "Boundary clarity awareness",
      },
    },
    {
      id: "brain-adults-47",
      title: "Peer Pressure as an Adult",
      description:
        "Peers influence lifestyle or financial choices.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-47"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/peer-pressure-as-an-adult",
      index: 46,
      scenario: {
        setup:
          "Peers influence lifestyle or financial choices.",
        choices: [
          {
            label: "Follow the group",
            outcome: "Regret may appear",
          },
          {
            label: "Stand by personal comfort",
            outcome: "Self-respect improves",
          },
          {
            label: "Avoid the group",
            outcome: "Connection reduces",
          },
        ],
        reflections: [
          "Where do peers influence you?",
          "What values guide your choices?",
        ],
        skill: "Value-based decision awareness",
      },
    },
    {
      id: "brain-adults-48",
      title: "Emotional Dependence",
      description:
        "Mood depends heavily on others' reactions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-48"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-dependence",
      index: 47,
      scenario: {
        setup:
          "Mood depends heavily on others' reactions.",
        choices: [
          {
            label: "Seek reassurance repeatedly",
            outcome: "Dependence increases",
          },
          {
            label: "Build inner reassurance",
            outcome: "Stability improves",
          },
          {
            label: "Withdraw emotionally",
            outcome: "Disconnection increases",
          },
        ],
        reflections: [
          "When do you seek reassurance?",
          "What builds inner stability?",
        ],
        skill: "Emotional independence awareness",
      },
    },
    {
      id: "brain-adults-49",
      title: "Relationship Expectations",
      description:
        "Expectations in a relationship feel heavy.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-49"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/relationship-expectations",
      index: 48,
      scenario: {
        setup:
          "Expectations in a relationship feel heavy.",
        choices: [
          {
            label: "Suppress feelings",
            outcome: "Stress builds",
          },
          {
            label: "Acknowledge expectations",
            outcome: "Awareness improves",
          },
          {
            label: "Avoid discussion",
            outcome: "Tension continues",
          },
        ],
        reflections: [
          "What expectations feel heavy?",
          "How does awareness help?",
        ],
        skill: "Expectation awareness",
      },
    },
    {
      id: "brain-adults-50",
      title: "Choosing Distance",
      description:
        "A relationship feels emotionally draining.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-adults-50"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/choosing-distance",
      index: 49,
      scenario: {
        setup:
          "A relationship feels emotionally draining.",
        choices: [
          {
            label: "Continue engaging",
            outcome: "Stress continues",
          },
          {
            label: "Create healthy distance",
            outcome: "Emotional balance improves",
          },
          {
            label: "Cut off abruptly",
            outcome: "Guilt and conflict increase",
          },
        ],
        reflections: [
          "Which relationships drain energy?",
          "What does healthy distance mean to you?",
        ],
        skill: "Relationship boundary awareness",
      },
    },
    {
      id: "brain-adults-51",
      title: "Endless Checking",
      description:
        "An adult frequently checks messages and notifications throughout the day.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-51"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/endless-checking",
      index: 50,
      scenario: {
        setup:
          "An adult frequently checks messages and notifications throughout the day.",
        choices: [
          {
            label: "Check notifications constantly",
            outcome: "Mental fatigue increases",
          },
          {
            label: "Create checking boundaries",
            outcome: "Focus improves",
          },
          {
            label: "Ignore discomfort and continue",
            outcome: "Distraction continues",
          },
        ],
        reflections: [
          "What pulls your attention most?",
          "How does constant checking affect focus?",
        ],
        skill: "Attention awareness",
      },
    },
    {
      id: "brain-adults-52",
      title: "Notification Overload",
      description:
        "Multiple alerts interrupt work and personal time.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-52"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/notification-overload",
      index: 51,
      scenario: {
        setup:
          "Multiple alerts interrupt work and personal time.",
        choices: [
          {
            label: "Respond to every alert immediately",
            outcome: "Focus reduces",
          },
          {
            label: "Limit notification access",
            outcome: "Mental clarity improves",
          },
          {
            label: "Ignore all alerts",
            outcome: "Important messages may be missed",
          },
        ],
        reflections: [
          "Which notifications disrupt you most?",
          "How does control help focus?",
        ],
        skill: "Attention control awareness",
      },
    },
    {
      id: "brain-adults-53",
      title: "Comparison Scroll",
      description:
        "An adult compares life with online content.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-53"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/comparison-scroll",
      index: 52,
      scenario: {
        setup:
          "An adult compares life with online content.",
        choices: [
          {
            label: "Continue comparing",
            outcome: "Confidence drops",
          },
          {
            label: "Limit comparison exposure",
            outcome: "Balance improves",
          },
          {
            label: "Avoid social media entirely",
            outcome: "Disconnection increases",
          },
        ],
        reflections: [
          "What content triggers comparison?",
          "How does limiting exposure help?",
        ],
        skill: "Comparison awareness",
      },
    },
    {
      id: "brain-adults-54",
      title: "Digital Multitasking",
      description:
        "Multiple apps and tasks are used simultaneously.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-54"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/digital-multitasking",
      index: 53,
      scenario: {
        setup:
          "Multiple apps and tasks are used simultaneously.",
        choices: [
          {
            label: "Continue multitasking",
            outcome: "Mental fatigue increases",
          },
          {
            label: "Focus on one task",
            outcome: "Productivity improves",
          },
          {
            label: "Switch tasks constantly",
            outcome: "Confusion increases",
          },
        ],
        reflections: [
          "How does multitasking affect you?",
          "What helps you focus?",
        ],
        skill: "Focus awareness",
      },
    },
    {
      id: "brain-adults-55",
      title: "Late-Night Screens",
      description:
        "Screen use continues late into the night.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-55"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/late-night-screens",
      index: 54,
      scenario: {
        setup:
          "Screen use continues late into the night.",
        choices: [
          {
            label: "Continue screen use",
            outcome: "Rest quality reduces",
          },
          {
            label: "Reduce usage gradually",
            outcome: "Rest improves",
          },
          {
            label: "Stop abruptly",
            outcome: "Restlessness appears",
          },
        ],
        reflections: [
          "How do screens affect rest?",
          "What helps you unwind?",
        ],
        skill: "Rest readiness awareness",
      },
    },
    {
      id: "brain-adults-56",
      title: "Mental Noise",
      description:
        "Constant information intake creates mental clutter.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-56"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/mental-noise",
      index: 55,
      scenario: {
        setup:
          "Constant information intake creates mental clutter.",
        choices: [
          {
            label: "Consume more content",
            outcome: "Overload increases",
          },
          {
            label: "Create quiet time",
            outcome: "Mental calm improves",
          },
          {
            label: "Ignore the feeling",
            outcome: "Distraction continues",
          },
        ],
        reflections: [
          "What creates mental noise for you?",
          "How does quiet affect clarity?",
        ],
        skill: "Mental clarity awareness",
      },
    },
    {
      id: "brain-adults-57",
      title: "Fear of Missing Out",
      description:
        "Seeing others' activities online creates anxiety.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-57"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-missing-out",
      index: 56,
      scenario: {
        setup:
          "Seeing others' activities online creates anxiety.",
        choices: [
          {
            label: "Join everything",
            outcome: "Exhaustion increases",
          },
          {
            label: "Choose selectively",
            outcome: "Satisfaction improves",
          },
          {
            label: "Withdraw completely",
            outcome: "Loneliness increases",
          },
        ],
        reflections: [
          "What triggers FOMO for you?",
          "How do choices affect energy?",
        ],
        skill: "Selective engagement awareness",
      },
    },
    {
      id: "brain-adults-58",
      title: "Online Arguments",
      description:
        "An online discussion becomes emotionally charged.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-58"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/online-arguments",
      index: 57,
      scenario: {
        setup:
          "An online discussion becomes emotionally charged.",
        choices: [
          {
            label: "Engage aggressively",
            outcome: "Stress increases",
          },
          {
            label: "Disengage calmly",
            outcome: "Emotional balance improves",
          },
          {
            label: "Continue reading silently",
            outcome: "Emotional residue remains",
          },
        ],
        reflections: [
          "How do online conflicts affect you?",
          "What helps disengagement?",
        ],
        skill: "Digital boundary awareness",
      },
    },
    {
      id: "brain-adults-59",
      title: "Always Available",
      description:
        "Being reachable at all times feels exhausting.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-59"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/always-available",
      index: 58,
      scenario: {
        setup:
          "Being reachable at all times feels exhausting.",
        choices: [
          {
            label: "Stay always available",
            outcome: "Burnout risk increases",
          },
          {
            label: "Set availability limits",
            outcome: "Balance improves",
          },
          {
            label: "Disappear without notice",
            outcome: "Misunderstandings occur",
          },
        ],
        reflections: [
          "When do you feel overavailable?",
          "How do limits help?",
        ],
        skill: "Availability awareness",
      },
    },
    {
      id: "brain-adults-60",
      title: "Digital Reset",
      description:
        "Prolonged digital use causes mental fatigue.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-60"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/digital-reset",
      index: 59,
      scenario: {
        setup:
          "Prolonged digital use causes mental fatigue.",
        choices: [
          {
            label: "Continue usage",
            outcome: "Fatigue increases",
          },
          {
            label: "Take intentional digital breaks",
            outcome: "Mental freshness improves",
          },
          {
            label: "Avoid devices completely",
            outcome: "Discomfort appears",
          },
        ],
        reflections: [
          "What signals digital overload?",
          "What reset works best for you?",
        ],
        skill: "Digital balance awareness",
      },
    },
    {
      id: "brain-adults-61",
      title: "Loss of Motivation",
      description:
        "An adult feels unmotivated despite responsibilities.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-61"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/loss-of-motivation",
      index: 60,
      scenario: {
        setup:
          "An adult feels unmotivated despite responsibilities.",
        choices: [
          {
            label: "Wait for motivation to return",
            outcome: "Progress stalls",
          },
          {
            label: "Take small consistent actions",
            outcome: "Momentum builds gradually",
          },
          {
            label: "Avoid tasks",
            outcome: "Stress increases",
          },
        ],
        reflections: [
          "What affects your motivation most?",
          "How do small actions help?",
        ],
        skill: "Motivation awareness",
      },
    },
    {
      id: "brain-adults-62",
      title: "Discipline vs Mood",
      description:
        "Daily mood shifts affect productivity.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-62"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/discipline-vs-mood",
      index: 61,
      scenario: {
        setup:
          "Daily mood shifts affect productivity.",
        choices: [
          {
            label: "Work only when motivated",
            outcome: "Inconsistency increases",
          },
          {
            label: "Follow a simple routine",
            outcome: "Stability improves",
          },
          {
            label: "Avoid tasks",
            outcome: "Pressure builds",
          },
        ],
        reflections: [
          "How does mood affect discipline?",
          "What routines help consistency?",
        ],
        skill: "Discipline awareness",
      },
    },
    {
      id: "brain-adults-63",
      title: "Early Burnout Signs",
      description:
        "Fatigue appears even after rest.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-63"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/early-burnout-signs",
      index: 62,
      scenario: {
        setup:
          "Fatigue appears even after rest.",
        choices: [
          {
            label: "Ignore fatigue",
            outcome: "Burnout risk increases",
          },
          {
            label: "Adjust workload",
            outcome: "Energy stabilises",
          },
          {
            label: "Push harder",
            outcome: "Exhaustion deepens",
          },
        ],
        reflections: [
          "What signals early burnout?",
          "How do you respond to fatigue?",
        ],
        skill: "Burnout signal awareness",
      },
    },
    {
      id: "brain-adults-64",
      title: "Procrastination Loop",
      description:
        "Tasks are repeatedly postponed.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-64"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/procrastination-loop",
      index: 63,
      scenario: {
        setup:
          "Tasks are repeatedly postponed.",
        choices: [
          {
            label: "Delay further",
            outcome: "Stress increases",
          },
          {
            label: "Start with a small step",
            outcome: "Progress begins",
          },
          {
            label: "Distract with other tasks",
            outcome: "Guilt builds",
          },
        ],
        reflections: [
          "What triggers procrastination?",
          "How do small steps help?",
        ],
        skill: "Action initiation awareness",
      },
    },
    {
      id: "brain-adults-65",
      title: "Overworking Pattern",
      description:
        "An adult works excessively without rest.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-65"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/overworking-pattern",
      index: 64,
      scenario: {
        setup:
          "An adult works excessively without rest.",
        choices: [
          {
            label: "Continue overworking",
            outcome: "Burnout risk rises",
          },
          {
            label: "Schedule rest intentionally",
            outcome: "Sustainability improves",
          },
          {
            label: "Stop abruptly",
            outcome: "Anxiety increases",
          },
        ],
        reflections: [
          "What beliefs affect rest?",
          "How does rest support effort?",
        ],
        skill: "Work-rest balance awareness",
      },
    },
    {
      id: "brain-adults-66",
      title: "Loss of Interest",
      description:
        "Interest in activities declines suddenly.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-66"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/loss-of-interest",
      index: 65,
      scenario: {
        setup:
          "Interest in activities declines suddenly.",
        choices: [
          {
            label: "Force interest",
            outcome: "Frustration increases",
          },
          {
            label: "Reflect and adjust expectations",
            outcome: "Clarity improves",
          },
          {
            label: "Quit activities",
            outcome: "Disengagement grows",
          },
        ],
        reflections: [
          "What affects interest levels?",
          "How do adjustments help?",
        ],
        skill: "Interest awareness",
      },
    },
    {
      id: "brain-adults-67",
      title: "Routine Fatigue",
      description:
        "Maintaining routines feels exhausting.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-67"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/routine-fatigue",
      index: 66,
      scenario: {
        setup:
          "Maintaining routines feels exhausting.",
        choices: [
          {
            label: "Abandon routines",
            outcome: "Structure collapses",
          },
          {
            label: "Simplify routines",
            outcome: "Consistency returns",
          },
          {
            label: "Push rigidly",
            outcome: "Resistance increases",
          },
        ],
        reflections: [
          "What makes routines hard?",
          "How can routines be simplified?",
        ],
        skill: "Routine sustainability awareness",
      },
    },
    {
      id: "brain-adults-68",
      title: "Productivity Guilt",
      description:
        "Feeling guilty for not being productive.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-68"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/productivity-guilt-revisited",
      index: 67,
      scenario: {
        setup:
          "Feeling guilty for not being productive.",
        choices: [
          {
            label: "Self-criticise",
            outcome: "Stress increases",
          },
          {
            label: "Acknowledge limits",
            outcome: "Self-compassion improves",
          },
          {
            label: "Avoid thinking about it",
            outcome: "Guilt resurfaces",
          },
        ],
        reflections: [
          "When do you feel productivity guilt?",
          "What reduces guilt?",
        ],
        skill: "Self-compassion awareness",
      },
    },
    {
      id: "brain-adults-69",
      title: "Energy Mismatch",
      description:
        "Energy levels vary during the day.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-69"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/energy-mismatch",
      index: 68,
      scenario: {
        setup:
          "Energy levels vary during the day.",
        choices: [
          {
            label: "Ignore energy levels",
            outcome: "Fatigue increases",
          },
          {
            label: "Align tasks with energy",
            outcome: "Efficiency improves",
          },
          {
            label: "Avoid tasks",
            outcome: "Tasks accumulate",
          },
        ],
        reflections: [
          "When is your energy highest?",
          "How does alignment help?",
        ],
        skill: "Energy alignment awareness",
      },
    },
    {
      id: "brain-adults-70",
      title: "Burnout Reset",
      description:
        "Burnout signs become noticeable.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-70"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/burnout-reset",
      index: 69,
      scenario: {
        setup:
          "Burnout signs become noticeable.",
        choices: [
          {
            label: "Ignore signs",
            outcome: "Burnout deepens",
          },
          {
            label: "Pause and reassess",
            outcome: "Recovery begins",
          },
          {
            label: "Quit responsibilities",
            outcome: "Instability increases",
          },
        ],
        reflections: [
          "What signals burnout for you?",
          "What helps recovery?",
        ],
        skill: "Burnout recovery awareness",
      },
    },
    {
      id: "brain-adults-71",
      title: "Constant Money Worry",
      description:
        "An adult frequently worries about expenses and financial stability.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-71"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/constant-money-worry",
      index: 70,
      scenario: {
        setup:
          "An adult frequently worries about expenses and financial stability.",
        choices: [
          {
            label: "Worry continuously",
            outcome: "Anxiety increases",
          },
          {
            label: "Review the situation calmly",
            outcome: "Sense of control improves",
          },
          {
            label: "Avoid thinking about money",
            outcome: "Worry resurfaces later",
          },
        ],
        reflections: [
          "How often do money thoughts appear?",
          "What triggers financial worry?",
        ],
        skill: "Financial stress awareness",
      },
    },
    {
      id: "brain-adults-72",
      title: "Emotional Spending",
      description:
        "An adult spends money to cope with stress or low mood.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-72"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-spending",
      index: 71,
      scenario: {
        setup:
          "An adult spends money to cope with stress or low mood.",
        choices: [
          {
            label: "Spend impulsively",
            outcome: "Temporary relief followed by guilt",
          },
          {
            label: "Pause before spending",
            outcome: "Emotional control improves",
          },
          {
            label: "Suppress the urge",
            outcome: "Urge returns later",
          },
        ],
        reflections: [
          "What emotions trigger spending?",
          "How does pausing change the urge?",
        ],
        skill: "Impulse awareness",
      },
    },
    {
      id: "brain-adults-73",
      title: "Comparing Finances",
      description:
        "An adult compares financial progress with peers.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-73"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/comparing-finances",
      index: 72,
      scenario: {
        setup:
          "An adult compares financial progress with peers.",
        choices: [
          {
            label: "Compare constantly",
            outcome: "Stress increases",
          },
          {
            label: "Focus on personal situation",
            outcome: "Confidence stabilises",
          },
          {
            label: "Avoid money thoughts",
            outcome: "Anxiety persists",
          },
        ],
        reflections: [
          "Who do you compare finances with?",
          "How does comparison affect stress?",
        ],
        skill: "Financial comparison awareness",
      },
    },
    {
      id: "brain-adults-74",
      title: "Fear of Running Out",
      description:
        "Savings feel insufficient for future needs.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-74"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-running-out",
      index: 73,
      scenario: {
        setup:
          "Savings feel insufficient for future needs.",
        choices: [
          {
            label: "Obsess over money",
            outcome: "Anxiety increases",
          },
          {
            label: "Plan realistically",
            outcome: "Calm improves",
          },
          {
            label: "Avoid thinking about it",
            outcome: "Fear resurfaces",
          },
        ],
        reflections: [
          "What fears do you have about money?",
          "How does planning affect calm?",
        ],
        skill: "Security awareness",
      },
    },
    {
      id: "brain-adults-75",
      title: "Income Uncertainty",
      description:
        "Income is irregular or unpredictable.",
      icon: <Brain className="w-6 h-6" />, 
      difficulty: "Medium",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-adults-75"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/income-uncertainty",
      index: 74,
      scenario: {
        setup:
          "Income is irregular or unpredictable.",
        choices: [
          {
            label: "Worry constantly",
            outcome: "Stress increases",
          },
          {
            label: "Create flexible expectations",
            outcome: "Stability improves",
          },
          {
            label: "Ignore uncertainty",
            outcome: "Problems accumulate",
          },
        ],
        reflections: [
          "How predictable is your income?",
          "What flexibility helps?",
        ],
        skill: "Adaptability awareness",
      },
    },
    {
      id: "brain-adults-76",
      title: "Spending to Belong",
      description:
        "Social situations encourage spending beyond comfort.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-76"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/spending-to-belong",
      index: 75,
      scenario: {
        setup:
          "Social situations encourage spending beyond comfort.",
        choices: [
          {
            label: "Spend to fit in",
            outcome: "Financial stress increases",
          },
          {
            label: "Respect spending limits",
            outcome: "Balance improves",
          },
          {
            label: "Avoid social events",
            outcome: "Isolation increases",
          },
        ],
        reflections: [
          "When does spending feel pressured?",
          "How do limits protect peace?",
        ],
        skill: "Spending boundary awareness",
      },
    },
    {
      id: "brain-adults-77",
      title: "Debt Anxiety",
      description:
        "Debt feels emotionally overwhelming.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-77"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/debt-anxiety",
      index: 76,
      scenario: {
        setup:
          "Debt feels emotionally overwhelming.",
        choices: [
          {
            label: "Avoid thinking about debt",
            outcome: "Stress increases",
          },
          {
            label: "Acknowledge the situation",
            outcome: "Control improves",
          },
          {
            label: "Panic emotionally",
            outcome: "Anxiety escalates",
          },
        ],
        reflections: [
          "How does debt affect emotions?",
          "What helps regain control?",
        ],
        skill: "Debt awareness",
      },
    },
    {
      id: "brain-adults-78",
      title: "Saving vs Living",
      description:
        "Balancing saving money and enjoying life feels difficult.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-78"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/saving-vs-living",
      index: 77,
      scenario: {
        setup:
          "Balancing saving money and enjoying life feels difficult.",
        choices: [
          {
            label: "Spend freely",
            outcome: "Future stress increases",
          },
          {
            label: "Balance saving and spending",
            outcome: "Satisfaction improves",
          },
          {
            label: "Avoid spending completely",
            outcome: "Resentment builds",
          },
        ],
        reflections: [
          "What balance feels right?",
          "How do choices affect peace?",
        ],
        skill: "Balance awareness",
      },
    },
    {
      id: "brain-adults-79",
      title: "Financial Regret",
      description:
        "A past financial decision causes regret.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-79"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/financial-regret",
      index: 78,
      scenario: {
        setup:
          "A past financial decision causes regret.",
        choices: [
          {
            label: "Criticise self harshly",
            outcome: "Confidence drops",
          },
          {
            label: "Reflect and learn",
            outcome: "Growth improves",
          },
          {
            label: "Ignore the regret",
            outcome: "Mistakes repeat",
          },
        ],
        reflections: [
          "How do you handle money regret?",
          "What supports learning?",
        ],
        skill: "Learning mindset awareness",
      },
    },
    {
      id: "brain-adults-80",
      title: "Financial Reset",
      description:
        "Financial stress builds over time.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-80"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/financial-reset",
      index: 79,
      scenario: {
        setup:
          "Financial stress builds over time.",
        choices: [
          {
            label: "Ignore stress",
            outcome: "Stress continues",
          },
          {
            label: "Review finances calmly",
            outcome: "Clarity improves",
          },
          {
            label: "Avoid money discussions",
            outcome: "Anxiety persists",
          },
        ],
        reflections: [
          "What signals money overload?",
          "What helps reset financially?",
        ],
        skill: "Financial reset awareness",
      },
    },
    {
      id: "brain-adults-81",
      title: "Decision Under Stress",
      description:
        "An adult must make an important decision while feeling emotionally stressed.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-81"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/decision-under-stress",
      index: 80,
      scenario: {
        setup:
          "An adult must make an important decision while feeling emotionally stressed.",
        choices: [
          {
            label: "Decide immediately",
            outcome: "Regret may appear later",
          },
          {
            label: "Pause before deciding",
            outcome: "Clarity improves",
          },
          {
            label: "Avoid deciding",
            outcome: "Pressure increases",
          },
        ],
        reflections: [
          "How do emotions affect decisions?",
          "What helps you pause?",
        ],
        skill: "Decision pause awareness",
      },
    },
    {
      id: "brain-adults-82",
      title: "Emotional Reaction",
      description:
        "An emotional response arises during a disagreement.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-82"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-reaction",
      index: 81,
      scenario: {
        setup:
          "An emotional response arises during a disagreement.",
        choices: [
          {
            label: "React emotionally",
            outcome: "Conflict escalates",
          },
          {
            label: "Respond calmly",
            outcome: "Understanding improves",
          },
          {
            label: "Withdraw from discussion",
            outcome: "Issues remain unresolved",
          },
        ],
        reflections: [
          "How do emotions affect reactions?",
          "What helps calm responses?",
        ],
        skill: "Response awareness",
      },
    },
    {
      id: "brain-adults-83",
      title: "Impulsive Choice",
      description:
        "Strong emotions push toward quick action.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-83"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/impulsive-choice",
      index: 82,
      scenario: {
        setup:
          "Strong emotions push toward quick action.",
        choices: [
          {
            label: "Act impulsively",
            outcome: "Consequences appear quickly",
          },
          {
            label: "Delay action briefly",
            outcome: "Judgement improves",
          },
          {
            label: "Avoid action",
            outcome: "Opportunities pass",
          },
        ],
        reflections: [
          "When do you act impulsively?",
          "How does delay help?",
        ],
        skill: "Impulse control awareness",
      },
    },
    {
      id: "brain-adults-84",
      title: "Past Experience Bias",
      description:
        "Past experiences influence a current decision.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-84"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/past-experience-bias",
      index: 83,
      scenario: {
        setup:
          "Past experiences influence a current decision.",
        choices: [
          {
            label: "Let fear decide",
            outcome: "Opportunities reduce",
          },
          {
            label: "Evaluate the present situation",
            outcome: "Balanced judgement improves",
          },
          {
            label: "Avoid deciding",
            outcome: "Uncertainty continues",
          },
        ],
        reflections: [
          "How does the past affect choices?",
          "How does present awareness help?",
        ],
        skill: "Bias awareness",
      },
    },
    {
      id: "brain-adults-85",
      title: "Pressure-Driven Choice",
      description:
        "External pressure pushes for quick decisions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-85"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/pressure-driven-choice",
      index: 84,
      scenario: {
        setup:
          "External pressure pushes for quick decisions.",
        choices: [
          {
            label: "Decide to please others",
            outcome: "Regret may follow",
          },
          {
            label: "Consider personal limits",
            outcome: "Self-respect improves",
          },
          {
            label: "Delay the decision",
            outcome: "Tension increases",
          },
        ],
        reflections: [
          "Who pressures your decisions?",
          "How do limits protect you?",
        ],
        skill: "Pressure awareness",
      },
    },
    {
      id: "brain-adults-86",
      title: "Overthinking Loop",
      description:
        "A decision is delayed due to overthinking.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-86"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/overthinking-loop",
      index: 85,
      scenario: {
        setup:
          "A decision is delayed due to overthinking.",
        choices: [
          {
            label: "Continue overthinking",
            outcome: "Mental fatigue increases",
          },
          {
            label: "Set a decision point",
            outcome: "Relief improves",
          },
          {
            label: "Avoid deciding",
            outcome: "Stress continues",
          },
        ],
        reflections: [
          "When do you overthink decisions?",
          "How does setting limits help?",
        ],
        skill: "Decision clarity awareness",
      },
    },
    {
      id: "brain-adults-87",
      title: "Emotion vs Logic",
      description:
        "Strong emotions conflict with logical thinking.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-87"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotion-vs-logic",
      index: 86,
      scenario: {
        setup:
          "Strong emotions conflict with logical thinking.",
        choices: [
          {
            label: "Follow emotion only",
            outcome: "Regret increases",
          },
          {
            label: "Balance emotion and logic",
            outcome: "Balanced outcomes improve",
          },
          {
            label: "Suppress emotion",
            outcome: "Emotional tension remains",
          },
        ],
        reflections: [
          "How do you balance emotion and logic?",
          "What supports alignment?",
        ],
        skill: "Balanced decision awareness",
      },
    },
    {
      id: "brain-adults-88",
      title: "Avoidance Decision",
      description:
        "Avoiding decisions feels safer.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-88"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/avoidance-decision",
      index: 87,
      scenario: {
        setup:
          "Avoiding decisions feels safer.",
        choices: [
          {
            label: "Avoid deciding",
            outcome: "Stress builds",
          },
          {
            label: "Face the decision gradually",
            outcome: "Confidence improves",
          },
          {
            label: "Delegate the decision",
            outcome: "Control reduces",
          },
        ],
        reflections: [
          "What decisions do you avoid?",
          "How does gradual action help?",
        ],
        skill: "Responsibility awareness",
      },
    },
    {
      id: "brain-adults-89",
      title: "Emotional Regret",
      description:
        "A past decision creates emotional regret.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-89"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-regret",
      index: 88,
      scenario: {
        setup:
          "A past decision creates emotional regret.",
        choices: [
          {
            label: "Criticise self",
            outcome: "Confidence drops",
          },
          {
            label: "Reflect and learn",
            outcome: "Growth improves",
          },
          {
            label: "Ignore regret",
            outcome: "Mistakes repeat",
          },
        ],
        reflections: [
          "How do you handle regret?",
          "What helps learning?",
        ],
        skill: "Learning awareness",
      },
    },
    {
      id: "brain-adults-90",
      title: "Decision Fatigue",
      description:
        "Too many decisions create mental exhaustion.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-90"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/decision-fatigue",
      index: 89,
      scenario: {
        setup:
          "Too many decisions create mental exhaustion.",
        choices: [
          {
            label: "Continue deciding",
            outcome: "Fatigue increases",
          },
          {
            label: "Pause and reset",
            outcome: "Clarity improves",
          },
          {
            label: "Avoid decisions",
            outcome: "Backlog grows",
          },
        ],
        reflections: [
          "What signals decision fatigue?",
          "How do you reset mentally?",
        ],
        skill: "Decision fatigue awareness",
      },
    },
    {
      id: "brain-adults-91",
      title: "Handling Setbacks",
      description:
        "An adult faces an unexpected setback after planning carefully.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-91"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/handling-setbacks",
      index: 90,
      scenario: {
        setup:
          "An adult faces an unexpected setback after planning carefully.",
        choices: [
          {
            label: "Give up effort",
            outcome: "Motivation drops",
          },
          {
            label: "Reflect and adapt",
            outcome: "Resilience builds",
          },
          {
            label: "Blame circumstances",
            outcome: "Learning reduces",
          },
        ],
        reflections: [
          "How do setbacks affect you?",
          "What helps adaptation?",
        ],
        skill: "Resilience awareness",
      },
    },
    {
      id: "brain-adults-92",
      title: "Emotional Recovery",
      description:
        "Emotional exhaustion follows prolonged stress.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-92"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-recovery",
      index: 91,
      scenario: {
        setup:
          "Emotional exhaustion follows prolonged stress.",
        choices: [
          {
            label: "Ignore exhaustion",
            outcome: "Burnout risk increases",
          },
          {
            label: "Rest intentionally",
            outcome: "Recovery improves",
          },
          {
            label: "Distract continuously",
            outcome: "Fatigue continues",
          },
        ],
        reflections: [
          "What helps emotional recovery?",
          "How do you notice exhaustion?",
        ],
        skill: "Recovery awareness",
      },
    },
    {
      id: "brain-adults-93",
      title: "Learning from Failure",
      description:
        "Failure occurs despite sincere effort.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-93"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/learning-from-failure",
      index: 92,
      scenario: {
        setup:
          "Failure occurs despite sincere effort.",
        choices: [
          {
            label: "Internalise failure",
            outcome: "Confidence reduces",
          },
          {
            label: "Extract learning",
            outcome: "Growth improves",
          },
          {
            label: "Avoid future attempts",
            outcome: "Opportunities reduce",
          },
        ],
        reflections: [
          "How do you interpret failure?",
          "What supports learning?",
        ],
        skill: "Growth mindset awareness",
      },
    },
    {
      id: "brain-adults-94",
      title: "Coping with Change",
      description:
        "Unexpected changes disrupt established routines.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-94"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/coping-with-change",
      index: 93,
      scenario: {
        setup:
          "Unexpected changes disrupt established routines.",
        choices: [
          {
            label: "Resist change",
            outcome: "Stress increases",
          },
          {
            label: "Adapt gradually",
            outcome: "Stability improves",
          },
          {
            label: "Withdraw",
            outcome: "Disconnection grows",
          },
        ],
        reflections: [
          "How do you handle change?",
          "What helps adaptation?",
        ],
        skill: "Adaptability awareness",
      },
    },
    {
      id: "brain-adults-95",
      title: "Emotional Strength",
      description:
        "Repeated challenges test emotional endurance.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-95"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-strength",
      index: 94,
      scenario: {
        setup:
          "Repeated challenges test emotional endurance.",
        choices: [
          {
            label: "Suppress emotions",
            outcome: "Emotional strain increases",
          },
          {
            label: "Acknowledge emotions and continue",
            outcome: "Strength builds",
          },
          {
            label: "Give up",
            outcome: "Confidence drops",
          },
        ],
        reflections: [
          "What builds emotional strength?",
          "How do you continue despite difficulty?",
        ],
        skill: "Mental strength awareness",
      },
    },
    {
      id: "brain-adults-96",
      title: "Recovery After Loss",
      description:
        "Loss of an opportunity affects confidence.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-96"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/recovery-after-loss",
      index: 95,
      scenario: {
        setup:
          "Loss of an opportunity affects confidence.",
        choices: [
          {
            label: "Dwell on loss",
            outcome: "Sadness persists",
          },
          {
            label: "Reframe the experience",
            outcome: "Perspective improves",
          },
          {
            label: "Avoid future risks",
            outcome: "Growth limits",
          },
        ],
        reflections: [
          "How do you process loss?",
          "What helps recovery?",
        ],
        skill: "Recovery mindset awareness",
      },
    },
    {
      id: "brain-adults-97",
      title: "Emotional Endurance",
      description:
        "Long-term pressure tests patience and stamina.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-97"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-endurance",
      index: 96,
      scenario: {
        setup:
          "Long-term pressure tests patience and stamina.",
        choices: [
          {
            label: "Push without rest",
            outcome: "Burnout increases",
          },
          {
            label: "Balance effort and rest",
            outcome: "Sustainability improves",
          },
          {
            label: "Withdraw completely",
            outcome: "Momentum drops",
          },
        ],
        reflections: [
          "What supports endurance?",
          "How do you pace yourself?",
        ],
        skill: "Endurance awareness",
      },
    },
    {
      id: "brain-adults-98",
      title: "Inner Stability",
      description:
        "External situations feel unpredictable.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-98"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/inner-stability",
      index: 97,
      scenario: {
        setup:
          "External situations feel unpredictable.",
        choices: [
          {
            label: "Seek constant reassurance",
            outcome: "Dependence increases",
          },
          {
            label: "Build inner stability",
            outcome: "Calm improves",
          },
          {
            label: "Avoid uncertainty",
            outcome: "Fear persists",
          },
        ],
        reflections: [
          "What creates inner stability for you?",
          "How do you build it?",
        ],
        skill: "Inner stability awareness",
      },
    },
    {
      id: "brain-adults-99",
      title: "Long-Term Perspective",
      description:
        "Short-term setbacks feel overwhelming.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-99"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/long-term-perspective",
      index: 98,
      scenario: {
        setup:
          "Short-term setbacks feel overwhelming.",
        choices: [
          {
            label: "Focus only on now",
            outcome: "Stress increases",
          },
          {
            label: "Consider long-term view",
            outcome: "Perspective improves",
          },
          {
            label: "Avoid future thinking",
            outcome: "Anxiety remains",
          },
        ],
        reflections: [
          "How does perspective affect stress?",
          "What helps long-term thinking?",
        ],
        skill: "Perspective awareness",
      },
    },
    {
      id: "brain-adults-100",
      title: "Resilience Reset",
      description:
        "After prolonged challenges, energy feels low.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-adults-100"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/resilience-reset",
      index: 99,
      scenario: {
        setup:
          "After prolonged challenges, energy feels low.",
        choices: [
          {
            label: "Ignore fatigue",
            outcome: "Burnout deepens",
          },
          {
            label: "Pause and rebuild gradually",
            outcome: "Resilience strengthens",
          },
          {
            label: "Quit efforts",
            outcome: "Confidence reduces",
          },
        ],
        reflections: [
          "What signals the need for reset?",
          "What helps rebuild strength?",
        ],
        skill: "Resilience reset awareness",
      },
    },
  ];

  return brainAdultGames;
};