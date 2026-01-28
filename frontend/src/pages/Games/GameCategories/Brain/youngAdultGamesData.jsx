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
    {
      id: "brain-young-adult-3",
      title: "Pressure Signals",
      description:
        "A student recognizes physical and emotional stress signs during a busy academic period.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/pressure-signals",
      index: 2,
      scenario: {
        setup:
          "A student notices headaches, irritation, and lack of focus during a busy academic period.",
        choices: [
          {
            label: "Ignore the signs and continue working",
            outcome: "Stress builds silently over time."
          },
          {
            label: "Slow down and acknowledge the pressure",
            outcome: "Awareness increases and pressure stabilises."
          },
          {
            label: "Distract with social media and entertainment",
            outcome: "Temporary relief followed by delayed stress."
          }
        ],
        reflections: [
          "What signs usually appear when stress increases?",
          "What happens when these signs are ignored?"
        ],
        skill: "Stress signal recognition"
      },
    },
    {
      id: "brain-young-adult-4",
      title: "Deadline Collision",
      description:
        "Two important deadlines suddenly fall on the same day - learn to adapt and prioritize.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/deadline-collision",
      index: 3,
      scenario: {
        setup:
          "Two important deadlines suddenly fall on the same day.",
        choices: [
          {
            label: "Rush both tasks without planning",
            outcome: "Quality reduces and stress increases."
          },
          {
            label: "Re-evaluate priorities and adjust effort",
            outcome: "Control improves, though not everything is perfect."
          },
          {
            label: "Avoid deciding until the last moment",
            outcome: "Anxiety increases due to uncertainty."
          }
        ],
        reflections: [
          "How do you react when plans change suddenly?",
          "What helps you regain control?"
        ],
        skill: "Adaptive planning"
      },
    },
    {
      id: "brain-young-adult-5",
      title: "Comparison Pressure",
      description:
        "A young adult sees peers appearing successful and calm online, learning to handle comparison pressure.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/comparison-pressure",
      index: 4,
      scenario: {
        setup:
          "A young adult sees peers appearing successful and calm online.",
        choices: [
          {
            label: "Constantly compare progress with others",
            outcome: "Confidence decreases over time."
          },
          {
            label: "Limit exposure and refocus on personal goals",
            outcome: "Mental clarity improves."
          },
          {
            label: "Dismiss feelings without addressing them",
            outcome: "Emotions resurface later."
          }
        ],
        reflections: [
          "Who do you compare yourself with most?",
          "How does comparison affect your stress?"
        ],
        skill: "Self-comparison awareness"
      },
    },
    {
      id: "brain-young-adult-6",
      title: "No Break Day",
      description:
        "A young adult works continuously without taking breaks to stay productive, learning to manage energy effectively.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/no-break-day",
      index: 5,
      scenario: {
        setup:
          "A young adult works continuously without taking breaks to stay productive.",
        choices: [
          {
            label: "Continue working without breaks",
            outcome: "Energy drops and mistakes increase."
          },
          {
            label: "Take short breaks to reset",
            outcome: "Focus stabilises and stress reduces."
          },
          {
            label: "Stop completely for the day",
            outcome: "Rest improves but guilt appears."
          }
        ],
        reflections: [
          "How do breaks affect your focus?",
          "What happens when rest is ignored?"
        ],
        skill: "Energy management awareness"
      },
    },
    {
      id: "brain-young-adult-7",
      title: "Family Expectations",
      description:
        "Family expectations increase pressure during exams or job search, learning to communicate emotional boundaries.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/family-expectations",
      index: 6,
      scenario: {
        setup:
          "Family expectations increase pressure during exams or job search.",
        choices: [
          {
            label: "Suppress feelings and push harder",
            outcome: "Internal stress builds silently."
          },
          {
            label: "Communicate limits calmly",
            outcome: "Understanding improves gradually."
          },
          {
            label: "React emotionally",
            outcome: "Conflict increases pressure."
          }
        ],
        reflections: [
          "How do expectations affect your stress?",
          "What helps reduce emotional pressure?"
        ],
        skill: "Emotional communication awareness"
      },
    },
    {
      id: "brain-young-adult-8",
      title: "Last-Minute Panic",
      description:
        "Tasks pile up due to repeated delays, learning to break them down into smaller steps.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/last-minute-panic",
      index: 7,
      scenario: {
        setup:
          "Tasks pile up due to repeated delays.",
        choices: [
          {
            label: "Panic and rush through everything",
            outcome: "Errors increase and stress spikes."
          },
          {
            label: "Break tasks into smaller steps",
            outcome: "Control improves gradually."
          },
          {
            label: "Avoid the situation",
            outcome: "Pressure continues to build."
          }
        ],
        reflections: [
          "What causes delays in your work?",
          "How do small steps change pressure?"
        ],
        skill: "Task breakdown awareness"
      },
    },
    {
      id: "brain-young-adult-9",
      title: "Control vs Concern",
      description:
        "A young adult worries about many things beyond control, learning to focus on what can be managed.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/control-vs-concern",
      index: 8,
      scenario: {
        setup:
          "A young adult worries about many things beyond control.",
        choices: [
          {
            label: "Worry about everything",
            outcome: "Anxiety increases."
          },
          {
            label: "Focus on controllable actions",
            outcome: "Mental clarity improves."
          },
          {
            label: "Avoid thinking about it",
            outcome: "Stress returns later."
          }
        ],
        reflections: [
          "What worries are outside your control?",
          "What actions are within your control?"
        ],
        skill: "Cognitive load awareness"
      },
    },
    {
      id: "brain-young-adult-10",
      title: "Reset Point",
      description:
        "Stress peaks after weeks of pressure, learning when and how to reset effectively.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/reset-point",
      index: 9,
      scenario: {
        setup:
          "Stress peaks after weeks of pressure.",
        choices: [
          {
            label: "Push harder without change",
            outcome: "Burnout risk increases."
          },
          {
            label: "Pause and reorganise priorities",
            outcome: "Recovery begins."
          },
          {
            label: "Withdraw completely",
            outcome: "Confidence reduces."
          }
        ],
        reflections: [
          "What signals tell you a reset is needed?",
          "What does a healthy reset look like?"
        ],
        skill: "Resilience awareness"
      },
    },
    {
      id: "brain-young-adult-11",
      title: "The Unknown Result",
      description:
        "A student has completed an important exam but results are pending, learning to handle uncertainty effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/the-unknown-result",
      index: 10,
      scenario: {
        setup:
          "A student has completed an important exam but results are pending.",
        choices: [
          {
            label: "Constantly imagine worst-case outcomes",
            outcome: "Anxiety increases over time."
          },
          {
            label: "Focus on daily routines and tasks",
            outcome: "Mental balance improves."
          },
          {
            label: "Avoid thinking about the result entirely",
            outcome: "Worry resurfaces unexpectedly."
          }
        ],
        reflections: [
          "How do you usually react to uncertainty?",
          "What helps you stay grounded while waiting?"
        ],
        skill: "Uncertainty tolerance awareness"
      },
    },
    {
      id: "brain-young-adult-12",
      title: "Fear Before the Interview",
      description:
        "A young adult prepares for an important interview, learning to manage fear and find balance in preparation.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-before-the-interview",
      index: 11,
      scenario: {
        setup:
          "A young adult prepares for an important interview.",
        choices: [
          {
            label: "Avoid preparing to reduce stress",
            outcome: "Confidence drops."
          },
          {
            label: "Prepare calmly and accept uncertainty",
            outcome: "Confidence stabilises."
          },
          {
            label: "Over-prepare obsessively",
            outcome: "Stress increases despite preparation."
          }
        ],
        reflections: [
          "How does fear affect your preparation?",
          "What balance feels healthy?"
        ],
        skill: "Fear-response awareness"
      },
    },
    {
      id: "brain-young-adult-13",
      title: "What If Thoughts",
      description:
        "A student repeatedly thinks about negative future possibilities, learning to manage anxious thoughts effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/what-if-thoughts",
      index: 12,
      scenario: {
        setup:
          "A student repeatedly thinks about negative future possibilities.",
        choices: [
          {
            label: "Engage with every \"what if.\"",
            outcome: "Anxiety escalates."
          },
          {
            label: "Acknowledge thoughts and refocus.",
            outcome: "Mental calm improves."
          },
          {
            label: "Suppress thoughts forcefully.",
            outcome: "Thoughts return stronger later."
          }
        ],
        reflections: [
          "What thoughts increase your anxiety most?",
          "How do you usually respond to them?"
        ],
        skill: "Thought pattern awareness"
      },
    },
    {
      id: "brain-young-adult-14",
      title: "Fear of Disappointing Others",
      description:
        "Family or mentors expect strong performance, learning to manage the fear of letting others down.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-disappointing-others",
      index: 13,
      scenario: {
        setup:
          "Family or mentors expect strong performance.",
        choices: [
          {
            label: "Internalise pressure silently.",
            outcome: "Internal stress increases."
          },
          {
            label: "Communicate honestly about limits.",
            outcome: "Pressure reduces gradually."
          },
          {
            label: "Avoid conversations.",
            outcome: "Tension builds over time."
          }
        ],
        reflections: [
          "Whose expectations affect you most?",
          "How do expectations influence your anxiety?"
        ],
        skill: "Expectation management awareness"
      },
    },
    {
      id: "brain-young-adult-15",
      title: "Fear of Starting",
      description:
        "A task feels overwhelming before starting, learning to overcome the fear of failure that prevents action.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-starting",
      index: 14,
      scenario: {
        setup:
          "A task feels overwhelming before starting.",
        choices: [
          {
            label: "Delay starting further.",
            outcome: "Anxiety increases."
          },
          {
            label: "Start with a small step.",
            outcome: "Confidence builds gradually."
          },
          {
            label: "Wait for motivation.",
            outcome: "Task remains unfinished."
          }
        ],
        reflections: [
          "What stops you from starting tasks?",
          "How do small steps change fear?"
        ],
        skill: "Action initiation awareness"
      },
    },
    {
      id: "brain-young-adult-16",
      title: "Fear of Being Judged",
      description:
        "A young adult worries about others' opinions, learning to manage the fear of negative judgement.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-being-judged",
      index: 15,
      scenario: {
        setup:
          "A young adult worries about others' opinions.",
        choices: [
          {
            label: "Avoid situations entirely.",
            outcome: "Opportunities reduce."
          },
          {
            label: "Participate despite discomfort.",
            outcome: "Confidence grows slowly."
          },
          {
            label: "Seek constant reassurance.",
            outcome: "Dependence increases."
          }
        ],
        reflections: [
          "How does judgement fear affect you?",
          "What happens when you face it?"
        ],
        skill: "Social confidence awareness"
      },
    },
    {
      id: "brain-young-adult-17",
      title: "Unclear Future Path",
      description:
        "A student feels unsure about career direction, learning to manage the fear of choosing the wrong path.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/unclear-future-path",
      index: 16,
      scenario: {
        setup:
          "A student feels unsure about career direction.",
        choices: [
          {
            label: "Avoid making any decision.",
            outcome: "Uncertainty increases."
          },
          {
            label: "Explore options gradually.",
            outcome: "Clarity improves over time."
          },
          {
            label: "Follow others' choices blindly.",
            outcome: "Dissatisfaction appears later."
          }
        ],
        reflections: [
          "What fears affect your decisions?",
          "How can exploration reduce anxiety?"
        ],
        skill: "Decision confidence awareness"
      },
    },
    {
      id: "brain-young-adult-18",
      title: "After a Mistake",
      description:
        "A mistake occurs in an important task, learning to manage the fear of consequences and choose a healthy response.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-18"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/after-a-mistake",
      index: 17,
      scenario: {
        setup:
          "A mistake occurs in an important task.",
        choices: [
          {
            label: "Hide the mistake.",
            outcome: "Stress increases."
          },
          {
            label: "Acknowledge and learn.",
            outcome: "Confidence rebuilds."
          },
          {
            label: "Blame external factors.",
            outcome: "Learning reduces."
          }
        ],
        reflections: [
          "How do you react to mistakes?",
          "What helps you move forward?"
        ],
        skill: "Failure response awareness"
      },
    },
    {
      id: "brain-young-adult-19",
      title: "Fear of Falling Behind",
      description:
        "Peers seem to progress faster, learning to manage the fear of lagging behind and choose a healthy response.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-falling-behind",
      index: 18,
      scenario: {
        setup:
          "Peers seem to progress faster.",
        choices: [
          {
            label: "Rush decisions.",
            outcome: "Stress increases."
          },
          {
            label: "Focus on personal pace.",
            outcome: "Stability improves."
          },
          {
            label: "Withdraw from comparison.",
            outcome: "Perspective improves."
          }
        ],
        reflections: [
          "How does comparison affect you?",
          "What pace feels sustainable?"
        ],
        skill: "Self-paced growth awareness"
      },
    },
    {
      id: "brain-young-adult-20",
      title: "Facing the Outcome",
      description:
        "An outcome does not match expectations, learning to manage disappointment and fear of future failure.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/facing-the-outcome",
      index: 19,
      scenario: {
        setup:
          "An outcome does not match expectations.",
        choices: [
          {
            label: "Self-criticise harshly.",
            outcome: "Confidence drops."
          },
          {
            label: "Reflect and adjust expectations.",
            outcome: "Resilience increases."
          },
          {
            label: "Avoid future attempts.",
            outcome: "Opportunities reduce."
          }
        ],
        reflections: [
          "How do outcomes affect your self-view?",
          "What helps you recover?"
        ],
        skill: "Resilience awareness"
      },
    },
    {
      id: "brain-young-adult-21",
      title: "Sudden Irritation",
      description:
        "A young adult feels irritated during a normal conversation without knowing why, learning to manage sudden emotional reactions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/sudden-irritation",
      index: 20,
      scenario: {
        setup:
          "A young adult feels irritated during a normal conversation without knowing why.",
        choices: [
          {
            label: "React immediately with frustration.",
            outcome: "Conflict increases."
          },
          {
            label: "Pause and notice the emotion.",
            outcome: "Awareness improves."
          },
          {
            label: "Suppress the feeling.",
            outcome: "Emotion resurfaces later."
          }
        ],
        reflections: [
          "What usually triggers irritation?",
          "How do you notice emotions early?"
        ],
        skill: "Emotional awareness"
      },
    },
    {
      id: "brain-young-adult-22",
      title: "Mixed Emotions",
      description:
        "A young adult feels happy and anxious at the same time about an opportunity, learning to manage conflicting emotions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/mixed-emotions",
      index: 21,
      scenario: {
        setup:
          "A young adult feels happy and anxious at the same time about an opportunity.",
        choices: [
          {
            label: "Ignore uncomfortable feelings.",
            outcome: "Confusion remains."
          },
          {
            label: "Acknowledge both emotions.",
            outcome: "Clarity improves."
          },
          {
            label: "Focus only on anxiety.",
            outcome: "Stress increases."
          }
        ],
        reflections: [
          "What emotions often appear together?",
          "How does acknowledging emotions help?"
        ],
        skill: "Emotional clarity"
      },
    },
    {
      id: "brain-young-adult-23",
      title: "Emotional Build-Up",
      description:
        "Emotions build up after several stressful days, learning to manage emotional accumulation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-build-up",
      index: 22,
      scenario: {
        setup:
          "Emotions build up after several stressful days.",
        choices: [
          {
            label: "Release emotions suddenly.",
            outcome: "Relief followed by guilt."
          },
          {
            label: "Address emotions gradually.",
            outcome: "Balance improves."
          },
          {
            label: "Ignore emotions.",
            outcome: "Emotional overload occurs later."
          }
        ],
        reflections: [
          "How do emotions build up for you?",
          "What helps release emotions safely?"
        ],
        skill: "Emotional regulation awareness"
      },
    },
    {
      id: "brain-young-adult-24",
      title: "Feeling Numb",
      description:
        "A young adult feels emotionally disconnected after prolonged stress, learning to manage emotional disconnection.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/feeling-numb",
      index: 23,
      scenario: {
        setup:
          "A young adult feels emotionally disconnected after prolonged stress.",
        choices: [
          {
            label: "Ignore the numbness.",
            outcome: "Disconnection continues."
          },
          {
            label: "Notice and reflect on it.",
            outcome: "Awareness increases."
          },
          {
            label: "Force emotional reactions.",
            outcome: "Frustration increases."
          }
        ],
        reflections: [
          "When do you feel emotionally distant?",
          "What helps reconnect emotionally?"
        ],
        skill: "Emotional sensitivity awareness"
      },
    },
    {
      id: "brain-young-adult-25",
      title: "Anger Trigger",
      description:
        "A small event triggers unexpected anger, learning to manage anger responses effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/anger-trigger",
      index: 24,
      scenario: {
        setup:
          "A small event triggers unexpected anger.",
        choices: [
          {
            label: "Express anger immediately.",
            outcome: "Conflict increases."
          },
          {
            label: "Pause and reflect.",
            outcome: "Control improves."
          },
          {
            label: "Suppress anger.",
            outcome: "Anger resurfaces later."
          }
        ],
        reflections: [
          "What triggers anger for you?",
          "How do you usually respond?"
        ],
        skill: "Anger awareness"
      },
    },
    {
      id: "brain-young-adult-26",
      title: "Mood Swings",
      description:
        "Mood shifts occur throughout the day, learning to manage unpredictable emotional changes.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-26"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/mood-swings",
      index: 25,
      scenario: {
        setup:
          "Mood shifts occur throughout the day.",
        choices: [
          {
            label: "React to every mood change",
            outcome: "Emotional exhaustion increases."
          },
          {
            label: "Observe mood patterns",
            outcome: "Understanding improves."
          },
          {
            label: "Ignore mood shifts",
            outcome: "Confusion persists."
          }
        ],
        reflections: [
          "What affects your mood most?",
          "How do patterns help awareness?"
        ],
        skill: "Mood pattern awareness"
      },
    },
    {
      id: "brain-young-adult-27",
      title: "Emotional Spillover",
      description:
        "Stress from one area affects another, learning to manage emotional spillover effects.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-27"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-spillover",
      index: 26,
      scenario: {
        setup:
          "Stress from one area affects another.",
        choices: [
          {
            label: "React emotionally in all situations",
            outcome: "Stress spreads."
          },
          {
            label: "Identify the source of stress",
            outcome: "Control improves."
          },
          {
            label: "Blame others",
            outcome: "Relationships strain."
          }
        ],
        reflections: [
          "How does stress spill over?",
          "What helps isolate stress?"
        ],
        skill: "Emotional spillover awareness"
      },
    },
    {
      id: "brain-young-adult-28",
      title: "Emotional Triggers",
      description:
        "Certain situations repeatedly trigger emotions, learning to recognize and manage emotional triggers.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-28"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-triggers",
      index: 27,
      scenario: {
        setup:
          "Certain situations repeatedly trigger emotions.",
        choices: [
          {
            label: "React automatically",
            outcome: "Patterns repeat."
          },
          {
            label: "Notice trigger patterns",
            outcome: "Awareness increases."
          },
          {
            label: "Avoid situations entirely",
            outcome: "Avoidance limits growth."
          }
        ],
        reflections: [
          "What triggers emotions most often?",
          "How does awareness change response?"
        ],
        skill: "Trigger recognition"
      },
    },
    {
      id: "brain-young-adult-29",
      title: "Emotional Expression",
      description:
        "A young adult struggles to express feelings clearly, learning to communicate emotions effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-29"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-expression",
      index: 28,
      scenario: {
        setup:
          "A young adult struggles to express feelings clearly.",
        choices: [
          {
            label: "Keep emotions inside",
            outcome: "Stress builds."
          },
          {
            label: "Express calmly",
            outcome: "Understanding improves."
          },
          {
            label: "Express emotionally",
            outcome: "Miscommunication occurs."
          }
        ],
        reflections: [
          "How do you express emotions?",
          "What helps clarity?"
        ],
        skill: "Emotional expression awareness"
      },
    },
    {
      id: "brain-young-adult-30",
      title: "Emotional Reset",
      description:
        "Emotions feel overwhelming after a long day, learning to reset and manage emotional fatigue.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-30"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-reset",
      index: 29,
      scenario: {
        setup:
          "Emotions feel overwhelming after a long day.",
        choices: [
          {
            label: "Ignore emotions",
            outcome: "Stress remains."
          },
          {
            label: "Pause and reflect",
            outcome: "Relief increases."
          },
          {
            label: "Distract continuously",
            outcome: "Fatigue continues."
          }
        ],
        reflections: [
          "What helps you reset emotionally?",
          "How do you recognise overload?"
        ],
        skill: "Emotional reset awareness"
      },
    },
    {
      id: "brain-young-adult-31",
      title: "Feeling Not Good Enough",
      description:
        "A young adult compares personal progress with peers and feels inadequate, learning to manage self-worth challenges.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-31"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/feeling-not-good-enough",
      index: 30,
      scenario: {
        setup:
          "A young adult compares personal progress with peers and feels inadequate.",
        choices: [
          {
            label: "Criticise self harshly",
            outcome: "Self-esteem reduces."
          },
          {
            label: "Acknowledge personal journey",
            outcome: "Confidence stabilises."
          },
          {
            label: "Withdraw from social interactions",
            outcome: "Isolation increases."
          }
        ],
        reflections: [
          "What situations affect your self-worth most?",
          "How do you define progress for yourself?"
        ],
        skill: "Self-worth awareness"
      },
    },
    {
      id: "brain-young-adult-32",
      title: "Social Media Identity",
      description:
        "A young adult curates an online image different from real life, learning to manage social media identity pressures.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-32"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/social-media-identity",
      index: 31,
      scenario: {
        setup:
          "A young adult curates an online image different from real life.",
        choices: [
          {
            label: "Maintain a perfect image",
            outcome: "Anxiety increases."
          },
          {
            label: "Be more authentic",
            outcome: "Relief and confidence improve."
          },
          {
            label: "Avoid posting altogether",
            outcome: "Disconnection grows."
          }
        ],
        reflections: [
          "How does online identity affect you?",
          "What feels authentic to you?"
        ],
        skill: "Identity awareness"
      },
    },
    {
      id: "brain-young-adult-33",
      title: "Seeking Approval",
      description:
        "Decisions are influenced by others' opinions, learning to balance external approval with personal values.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-33"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/seeking-approval",
      index: 32,
      scenario: {
        setup:
          "Decisions are influenced by others' opinions.",
        choices: [
          {
            label: "Follow others' expectations",
            outcome: "Self-doubt increases."
          },
          {
            label: "Consider personal values",
            outcome: "Self-trust improves."
          },
          {
            label: "Avoid deciding",
            outcome: "Confidence weakens."
          }
        ],
        reflections: [
          "Whose approval matters most to you?",
          "How do values guide decisions?"
        ],
        skill: "Self-trust awareness"
      },
    },
    {
      id: "brain-young-adult-34",
      title: "Labeling Yourself",
      description:
        "A young adult labels themselves based on one failure, learning to separate actions from identity.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-34"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/labeling-yourself",
      index: 33,
      scenario: {
        setup:
          "A young adult labels themselves based on one failure.",
        choices: [
          {
            label: "Accept the negative label",
            outcome: "Confidence drops."
          },
          {
            label: "Separate action from identity",
            outcome: "Perspective improves."
          },
          {
            label: "Avoid reflecting on it",
            outcome: "Learning is delayed."
          }
        ],
        reflections: [
          "What labels do you give yourself?",
          "How do labels affect confidence?"
        ],
        skill: "Identity separation awareness"
      },
    },
    {
      id: "brain-young-adult-35",
      title: "Comparing Life Timelines",
      description:
        "Peers reach milestones at different times, learning to accept personal life timelines.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-35"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/comparing-life-timelines",
      index: 34,
      scenario: {
        setup:
          "Peers reach milestones at different times.",
        choices: [
          {
            label: "Rush decisions",
            outcome: "Stress increases."
          },
          {
            label: "Accept personal timeline",
            outcome: "Peace improves."
          },
          {
            label: "Avoid thinking about future",
            outcome: "Uncertainty continues."
          }
        ],
        reflections: [
          "How do timelines affect you?",
          "What does progress mean to you?"
        ],
        skill: "Timeline acceptance"
      },
    },
    {
      id: "brain-young-adult-36",
      title: "Confidence Drop",
      description:
        "A setback reduces confidence suddenly, learning to recover from unexpected failures.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-36"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/confidence-drop",
      index: 35,
      scenario: {
        setup:
          "A setback reduces confidence suddenly.",
        choices: [
          {
            label: "Avoid future attempts",
            outcome: "Growth slows."
          },
          {
            label: "Reflect and try again",
            outcome: "Confidence rebuilds."
          },
          {
            label: "Blame circumstances",
            outcome: "Learning reduces."
          }
        ],
        reflections: [
          "How do setbacks affect confidence?",
          "What helps you recover?"
        ],
        skill: "Confidence recovery awareness"
      },
    },
    {
      id: "brain-young-adult-37",
      title: "Identity Confusion",
      description:
        "A young adult feels unsure about who they are becoming, learning to navigate identity formation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-37"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/identity-confusion",
      index: 36,
      scenario: {
        setup:
          "A young adult feels unsure about who they are becoming.",
        choices: [
          {
            label: "Copy others' identities",
            outcome: "Dissatisfaction increases."
          },
          {
            label: "Explore interests gradually",
            outcome: "Clarity improves."
          },
          {
            label: "Avoid self-reflection",
            outcome: "Confusion persists."
          }
        ],
        reflections: [
          "What influences your identity most?",
          "How does exploration help clarity?"
        ],
        skill: "Identity exploration awareness"
      },
    },
    {
      id: "brain-young-adult-38",
      title: "External Validation Loop",
      description:
        "Self-worth depends on likes, praise, or recognition, learning to build internal validation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-38"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/external-validation-loop",
      index: 37,
      scenario: {
        setup:
          "Self-worth depends on likes, praise, or recognition.",
        choices: [
          {
            label: "Seek more validation",
            outcome: "Dependence increases."
          },
          {
            label: "Focus on internal satisfaction",
            outcome: "Self-esteem strengthens."
          },
          {
            label: "Withdraw socially",
            outcome: "Loneliness increases."
          }
        ],
        reflections: [
          "What validation affects you most?",
          "How do you build internal confidence?"
        ],
        skill: "Validation awareness"
      },
    },
    {
      id: "brain-young-adult-39",
      title: "Comparing Success",
      description:
        "Success is measured against peers' achievements, learning to define personal success criteria.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-39"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/comparing-success",
      index: 38,
      scenario: {
        setup:
          "Success is measured against peers' achievements.",
        choices: [
          {
            label: "Use others as benchmarks",
            outcome: "Pressure increases."
          },
          {
            label: "Define personal success",
            outcome: "Motivation stabilises."
          },
          {
            label: "Avoid setting goals",
            outcome: "Direction weakens."
          }
        ],
        reflections: [
          "How do you define success?",
          "What goals matter to you?"
        ],
        skill: "Personal success awareness"
      },
    },
    {
      id: "brain-young-adult-40",
      title: "Self-Image Reset",
      description:
        "Negative self-image builds over time, learning to challenge self-critical thoughts.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-40"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/self-image-reset",
      index: 39,
      scenario: {
        setup:
          "Negative self-image builds over time.",
        choices: [
          {
            label: "Continue self-criticism",
            outcome: "Confidence reduces."
          },
          {
            label: "Notice and challenge thoughts",
            outcome: "Self-image improves."
          },
          {
            label: "Ignore self-image concerns",
            outcome: "Issues persist."
          }
        ],
        reflections: [
          "What thoughts affect your self-image?",
          "How can awareness change perception?"
        ],
        skill: "Self-image awareness"
      },
    },
    {
      id: "brain-young-adult-41",
      title: "Pressure to Fit In",
      description:
        "A young adult feels pressure to behave like peers to feel accepted, learning to balance social belonging with authenticity.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-41"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/pressure-to-fit-in",
      index: 40,
      scenario: {
        setup:
          "A young adult feels pressure to behave like peers to feel accepted.",
        choices: [
          {
            label: "Change behaviour to match others",
            outcome: "Internal discomfort increases."
          },
          {
            label: "Stay true to personal comfort",
            outcome: "Self-respect improves."
          },
          {
            label: "Withdraw from social situations",
            outcome: "Loneliness increases."
          }
        ],
        reflections: [
          "When do you feel pressure to fit in?",
          "What helps you stay authentic?"
        ],
        skill: "Authenticity awareness"
      },
    },
    {
      id: "brain-young-adult-42",
      title: "Difficulty Saying No",
      description:
        "Friends frequently request time and favors, learning to set healthy boundaries.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-42"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/difficulty-saying-no",
      index: 41,
      scenario: {
        setup:
          "Friends frequently request time and favors.",
        choices: [
          {
            label: "Agree despite exhaustion",
            outcome: "Burnout risk increases."
          },
          {
            label: "Say no respectfully",
            outcome: "Boundaries strengthen."
          },
          {
            label: "Avoid responding",
            outcome: "Tension builds."
          }
        ],
        reflections: [
          "What makes saying no difficult?",
          "How do boundaries protect energy?"
        ],
        skill: "Boundary setting awareness"
      },
    },
    {
      id: "brain-young-adult-43",
      title: "Relationship Conflict",
      description:
        "A disagreement arises with a close friend, learning to navigate relationship conflicts constructively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-43"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/relationship-conflict",
      index: 42,
      scenario: {
        setup:
          "A disagreement arises with a close friend.",
        choices: [
          {
            label: "Avoid the conflict",
            outcome: "Issues remain unresolved."
          },
          {
            label: "Communicate calmly",
            outcome: "Understanding improves."
          },
          {
            label: "React emotionally",
            outcome: "Conflict escalates."
          }
        ],
        reflections: [
          "How do you handle conflict?",
          "What helps communication?"
        ],
        skill: "Conflict awareness"
      },
    },
    {
      id: "brain-young-adult-44",
      title: "People-Pleasing Pattern",
      description:
        "A young adult often prioritises others' needs over their own, learning to balance personal boundaries.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-44"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/people-pleasing-pattern",
      index: 43,
      scenario: {
        setup:
          "A young adult often prioritises others' needs over their own.",
        choices: [
          {
            label: "Continue pleasing others",
            outcome: "Resentment builds."
          },
          {
            label: "Balance own needs",
            outcome: "Balance improves."
          },
          {
            label: "Withdraw socially",
            outcome: "Connection weakens."
          }
        ],
        reflections: [
          "When do you put others first?",
          "What happens when needs are ignored?"
        ],
        skill: "People-pleasing awareness"
      },
    },
    {
      id: "brain-young-adult-45",
      title: "Social Energy Drain",
      description:
        "Social interactions feel exhausting, learning to manage social energy sustainably.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-45"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/social-energy-drain",
      index: 44,
      scenario: {
        setup:
          "Social interactions feel exhausting.",
        choices: [
          {
            label: "Continue socialising",
            outcome: "Fatigue increases."
          },
          {
            label: "Take personal time",
            outcome: "Energy recovers."
          },
          {
            label: "Avoid all interactions",
            outcome: "Isolation increases."
          }
        ],
        reflections: [
          "How do social situations affect energy?",
          "What balance works for you?"
        ],
        skill: "Social energy awareness"
      },
    },
    {
      id: "brain-young-adult-46",
      title: "Unclear Boundaries",
      description:
        "Boundaries with friends or colleagues are unclear, learning to establish clear personal boundaries.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-46"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/unclear-boundaries",
      index: 45,
      scenario: {
        setup:
          "Boundaries with friends or colleagues are unclear.",
        choices: [
          {
            label: "Ignore discomfort",
            outcome: "Stress increases."
          },
          {
            label: "Clarify boundaries",
            outcome: "Respect improves."
          },
          {
            label: "React abruptly",
            outcome: "Tension increases."
          }
        ],
        reflections: [
          "Where are your boundaries unclear?",
          "How does clarity help relationships?"
        ],
        skill: "Boundary clarity awareness"
      },
    },
    {
      id: "brain-young-adult-47",
      title: "Peer Influence",
      description:
        "Peers influence decisions that feel uncomfortable, learning to make value-based choices.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-47"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/peer-influence",
      index: 46,
      scenario: {
        setup:
          "Peers influence decisions that feel uncomfortable.",
        choices: [
          {
            label: "Follow peers",
            outcome: "Regret may appear."
          },
          {
            label: "Stand by personal values",
            outcome: "Self-respect strengthens."
          },
          {
            label: "Avoid the group",
            outcome: "Connection reduces."
          }
        ],
        reflections: [
          "How do peers influence you?",
          "What values guide your choices?"
        ],
        skill: "Value-based decision awareness"
      },
    },
    {
      id: "brain-young-adult-48",
      title: "Emotional Dependence",
      description:
        "Mood depends heavily on others' reactions, learning to build emotional independence.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-48"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-dependence",
      index: 47,
      scenario: {
        setup:
          "Mood depends heavily on others' reactions.",
        choices: [
          {
            label: "Seek reassurance repeatedly",
            outcome: "Dependence increases."
          },
          {
            label: "Build internal reassurance",
            outcome: "Stability improves."
          },
          {
            label: "Withdraw emotionally",
            outcome: "Disconnection increases."
          }
        ],
        reflections: [
          "When do you seek reassurance?",
          "What builds inner stability?"
        ],
        skill: "Emotional independence awareness"
      },
    },
    {
      id: "brain-young-adult-49",
      title: "Relationship Expectations",
      description:
        "Expectations in a relationship feel heavy, learning to manage relationship expectations healthily.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-49"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/relationship-expectations",
      index: 48,
      scenario: {
        setup:
          "Expectations in a relationship feel heavy.",
        choices: [
          {
            label: "Suppress feelings",
            outcome: "Stress builds."
          },
          {
            label: "Communicate expectations",
            outcome: "Understanding improves."
          },
          {
            label: "Avoid discussion",
            outcome: "Tension continues."
          }
        ],
        reflections: [
          "What expectations feel heavy?",
          "How does communication help?"
        ],
        skill: "Expectation awareness"
      },
    },
    {
      id: "brain-young-adult-50",
      title: "Choosing Distance",
      description:
        "A relationship feels emotionally draining, learning to create healthy boundaries.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["brain-young-adult-50"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/choosing-distance",
      index: 49,
      scenario: {
        setup:
          "A relationship feels emotionally draining.",
        choices: [
          {
            label: "Continue engaging",
            outcome: "Stress continues."
          },
          {
            label: "Create healthy distance",
            outcome: "Emotional balance improves."
          },
          {
            label: "Cut off abruptly",
            outcome: "Guilt and conflict increase."
          }
        ],
        reflections: [
          "Which relationships drain energy?",
          "What does healthy distance mean?"
        ],
        skill: "Relationship boundary awareness"
      },
    },
    {
      id: "brain-young-adult-51",
      title: "Endless Scrolling",
      description:
        "A young adult scrolls social media late into the night, learning to manage digital habits effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-51"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/endless-scrolling",
      index: 50,
      scenario: {
        setup:
          "A young adult scrolls social media late into the night.",
        choices: [
          {
            label: "Continue scrolling",
            outcome: "Mental fatigue increases."
          },
          {
            label: "Set a stopping point",
            outcome: "Rest improves."
          },
          {
            label: "Forcefully quit without reflection",
            outcome: "Restlessness remains."
          }
        ],
        reflections: [
          "How does scrolling affect your energy?",
          "What helps you stop?"
        ],
        skill: "Digital awareness"
      },
    },
    {
      id: "brain-young-adult-52",
      title: "Notification Overload",
      description:
        "Constant notifications interrupt focus, learning to manage digital interruptions effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-52"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/notification-overload",
      index: 51,
      scenario: {
        setup:
          "Constant notifications interrupt focus.",
        choices: [
          {
            label: "Respond to all notifications immediately",
            outcome: "Focus reduces."
          },
          {
            label: "Limit notification access",
            outcome: "Mental clarity improves."
          },
          {
            label: "Ignore all notifications",
            outcome: "Important messages are missed."
          }
        ],
        reflections: [
          "Which notifications distract you most?",
          "How does control help focus?"
        ],
        skill: "Attention control awareness"
      },
    },
    {
      id: "brain-young-adult-53",
      title: "Online Comparison Loop",
      description:
        "A young adult compares life with online content, learning to manage comparison feelings effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-53"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/online-comparison-loop",
      index: 52,
      scenario: {
        setup:
          "A young adult compares life with online content.",
        choices: [
          {
            label: "Compare constantly",
            outcome: "Confidence drops."
          },
          {
            label: "Limit comparison",
            outcome: "Balance improves."
          },
          {
            label: "Avoid social media completely",
            outcome: "Disconnection increases."
          }
        ],
        reflections: [
          "What content triggers comparison?",
          "How can balance be maintained?"
        ],
        skill: "Comparison awareness"
      },
    },
    {
      id: "brain-young-adult-54",
      title: "Digital Multitasking",
      description:
        "Multiple apps are used simultaneously, learning to manage digital focus effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-54"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/digital-multitasking",
      index: 53,
      scenario: {
        setup:
          "Multiple apps are used simultaneously.",
        choices: [
          {
            label: "Continue multitasking",
            outcome: "Mental fatigue increases."
          },
          {
            label: "Focus on one task",
            outcome: "Productivity improves."
          },
          {
            label: "Switch tasks frequently",
            outcome: "Confusion increases."
          }
        ],
        reflections: [
          "How does multitasking affect you?",
          "What helps focus?"
        ],
        skill: "Focus awareness"
      },
    },
    {
      id: "brain-young-adult-55",
      title: "Late-Night Screen Use",
      description:
        "Screen usage continues late at night, learning to manage evening digital habits effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-55"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/late-night-screen-use",
      index: 54,
      scenario: {
        setup:
          "Screen usage continues late at night.",
        choices: [
          {
            label: "Continue screen use",
            outcome: "Sleep quality reduces."
          },
          {
            label: "Reduce screen time gradually",
            outcome: "Rest improves."
          },
          {
            label: "Stop abruptly",
            outcome: "Restlessness appears."
          }
        ],
        reflections: [
          "How do screens affect sleep?",
          "What helps you unwind?"
        ],
        skill: "Sleep hygiene awareness"
      },
    },
    {
      id: "brain-young-adult-56",
      title: "Mental Noise",
      description:
        "Constant digital input creates mental clutter, learning to manage mental clarity effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-56"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/mental-noise",
      index: 55,
      scenario: {
        setup:
          "Constant digital input creates mental clutter.",
        choices: [
          {
            label: "Consume more content",
            outcome: "Overload increases."
          },
          {
            label: "Create quiet time",
            outcome: "Mental calm improves."
          },
          {
            label: "Ignore the feeling",
            outcome: "Distraction continues."
          }
        ],
        reflections: [
          "What creates mental noise for you?",
          "How does quiet help?"
        ],
        skill: "Mental clarity awareness"
      },
    },
    {
      id: "brain-young-adult-57",
      title: "Fear of Missing Out",
      description:
        "Seeing others' activities online creates anxiety, learning to manage FOMO effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-57"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-missing-out",
      index: 56,
      scenario: {
        setup:
          "Seeing others' activities online creates anxiety.",
        choices: [
          {
            label: "Join everything",
            outcome: "Exhaustion increases."
          },
          {
            label: "Choose selectively",
            outcome: "Satisfaction improves."
          },
          {
            label: "Withdraw completely",
            outcome: "Loneliness increases."
          }
        ],
        reflections: [
          "What triggers FOMO for you?",
          "How do choices affect energy?"
        ],
        skill: "Selective engagement awareness"
      },
    },
    {
      id: "brain-young-adult-58",
      title: "Online Arguments",
      description:
        "An online discussion becomes heated, learning to manage digital interactions effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-58"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/online-arguments",
      index: 57,
      scenario: {
        setup:
          "An online discussion becomes heated.",
        choices: [
          {
            label: "Engage aggressively",
            outcome: "Stress increases."
          },
          {
            label: "Disengage calmly",
            outcome: "Emotional balance improves."
          },
          {
            label: "Continue silently reading",
            outcome: "Emotional residue remains."
          }
        ],
        reflections: [
          "How do online arguments affect you?",
          "What helps disengage?"
        ],
        skill: "Digital boundary awareness"
      },
    },
    {
      id: "brain-young-adult-59",
      title: "Constant Availability",
      description:
        "Being reachable at all times feels exhausting, learning to manage availability effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-59"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/constant-availability",
      index: 58,
      scenario: {
        setup:
          "Being reachable at all times feels exhausting.",
        choices: [
          {
            label: "Stay always available",
            outcome: "Burnout risk increases."
          },
          {
            label: "Set availability limits",
            outcome: "Balance improves."
          },
          {
            label: "Disappear without notice",
            outcome: "Misunderstandings occur."
          }
        ],
        reflections: [
          "When do you feel overavailable?",
          "How do limits help?"
        ],
        skill: "Availability awareness"
      },
    },
    {
      id: "brain-young-adult-60",
      title: "Digital Reset",
      description:
        "Digital overload builds over time, learning to manage digital balance effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-60"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/digital-reset",
      index: 59,
      scenario: {
        setup:
          "Digital overload builds over time.",
        choices: [
          {
            label: "Continue usage",
            outcome: "Fatigue increases."
          },
          {
            label: "Schedule digital breaks",
            outcome: "Mental freshness improves."
          },
          {
            label: "Avoid devices completely",
            outcome: "Discomfort appears."
          }
        ],
        reflections: [
          "What signals digital overload?",
          "What reset works for you?"
        ],
        skill: "Digital balance awareness"
      },
    },
    {
      id: "brain-young-adult-61",
      title: "Lost Motivation",
      description:
        "A young adult feels unmotivated despite having important goals, learning to manage motivation effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-61"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/lost-motivation",
      index: 60,
      scenario: {
        setup:
          "A young adult feels unmotivated despite having important goals.",
        choices: [
          {
            label: "Wait for motivation to return",
            outcome: "Progress stalls."
          },
          {
            label: "Take small consistent actions",
            outcome: "Momentum builds slowly."
          },
          {
            label: "Abandon the goal temporarily",
            outcome: "Confidence reduces."
          }
        ],
        reflections: [
          "What affects your motivation most?",
          "How do small actions help?"
        ],
        skill: "Motivation awareness"
      },
    },
    {
      id: "brain-young-adult-62",
      title: "Discipline vs Mood",
      description:
        "Mood fluctuates daily, affecting productivity, learning to manage discipline versus mood effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-62"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/discipline-vs-mood",
      index: 61,
      scenario: {
        setup:
          "Mood fluctuates daily, affecting productivity.",
        choices: [
          {
            label: "Work only when motivated",
            outcome: "Inconsistency increases."
          },
          {
            label: "Follow a simple routine",
            outcome: "Stability improves."
          },
          {
            label: "Avoid tasks altogether",
            outcome: "Stress builds."
          }
        ],
        reflections: [
          "How does mood affect discipline?",
          "What routines help consistency?"
        ],
        skill: "Discipline awareness"
      },
    },
    {
      id: "brain-young-adult-63",
      title: "Early Burnout Signs",
      description:
        "Fatigue appears even after rest, learning to recognize and respond to early burnout signs.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-63"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/early-burnout-signs",
      index: 62,
      scenario: {
        setup:
          "Fatigue appears even after rest.",
        choices: [
          {
            label: "Ignore fatigue",
            outcome: "Burnout risk increases."
          },
          {
            label: "Adjust workload",
            outcome: "Energy stabilises."
          },
          {
            label: "Push harder",
            outcome: "Exhaustion deepens."
          }
        ],
        reflections: [
          "What signs show burnout early?",
          "How do you respond to fatigue?"
        ],
        skill: "Burnout signal awareness"
      },
    },
    {
      id: "brain-young-adult-64",
      title: "Procrastination Loop",
      description:
        "Tasks are repeatedly postponed, learning to break the procrastination cycle effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-64"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/procrastination-loop",
      index: 63,
      scenario: {
        setup:
          "Tasks are repeatedly postponed.",
        choices: [
          {
            label: "Delay further",
            outcome: "Stress increases."
          },
          {
            label: "Start with a small step",
            outcome: "Progress begins."
          },
          {
            label: "Distract with other activities",
            outcome: "Guilt builds."
          }
        ],
        reflections: [
          "What triggers procrastination?",
          "How do small steps help?"
        ],
        skill: "Action initiation awareness"
      },
    },
    {
      id: "brain-young-adult-65",
      title: "Overworking Pattern",
      description:
        "A young adult works excessively without rest, learning to manage work-rest balance effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-65"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/overworking-pattern",
      index: 64,
      scenario: {
        setup:
          "A young adult works excessively without rest.",
        choices: [
          {
            label: "Continue overworking",
            outcome: "Burnout risk rises."
          },
          {
            label: "Schedule rest intentionally",
            outcome: "Sustainability improves."
          },
          {
            label: "Stop working abruptly",
            outcome: "Anxiety increases."
          }
        ],
        reflections: [
          "What beliefs affect rest?",
          "How does rest support performance?"
        ],
        skill: "Work-rest balance awareness"
      },
    },
    {
      id: "brain-young-adult-66",
      title: "Loss of Interest",
      description:
        "Interest in activities suddenly drops, learning to manage interest and engagement effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-66"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/loss-of-interest",
      index: 65,
      scenario: {
        setup:
          "Interest in activities suddenly drops.",
        choices: [
          {
            label: "Force interest",
            outcome: "Frustration increases."
          },
          {
            label: "Reflect and adjust expectations",
            outcome: "Clarity improves."
          },
          {
            label: "Quit all activities",
            outcome: "Disengagement grows."
          }
        ],
        reflections: [
          "What affects your interest levels?",
          "How do adjustments help?"
        ],
        skill: "Interest awareness"
      },
    },
    {
      id: "brain-young-adult-67",
      title: "Discipline Fatigue",
      description:
        "Maintaining routines feels exhausting, learning to manage discipline sustainability effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-67"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/discipline-fatigue",
      index: 66,
      scenario: {
        setup:
          "Maintaining routines feels exhausting.",
        choices: [
          {
            label: "Abandon routines",
            outcome: "Structure collapses."
          },
          {
            label: "Simplify routines",
            outcome: "Consistency returns."
          },
          {
            label: "Push through rigidly",
            outcome: "Resistance increases."
          }
        ],
        reflections: [
          "What makes routines hard?",
          "How can routines be simplified?"
        ],
        skill: "Routine sustainability awareness"
      },
    },
    {
      id: "brain-young-adult-68",
      title: "Productivity Guilt",
      description:
        "Feeling guilty for not being productive, learning to manage self-compassion effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-68"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/productivity-guilt",
      index: 67,
      scenario: {
        setup:
          "Feeling guilty for not being productive.",
        choices: [
          {
            label: "Self-criticise",
            outcome: "Stress increases."
          },
          {
            label: "Acknowledge limits",
            outcome: "Self-compassion improves."
          },
          {
            label: "Avoid thinking about it",
            outcome: "Guilt resurfaces."
          }
        ],
        reflections: [
          "When do you feel productivity guilt?",
          "What helps reduce guilt?"
        ],
        skill: "Self-compassion awareness"
      },
    },
    {
      id: "brain-young-adult-69",
      title: "Energy Mismatch",
      description:
        "Energy levels vary throughout the day, learning to align tasks with energy patterns effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-69"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/energy-mismatch",
      index: 68,
      scenario: {
        setup:
          "Energy levels vary throughout the day.",
        choices: [
          {
            label: "Ignore energy levels",
            outcome: "Fatigue increases."
          },
          {
            label: "Align tasks with energy",
            outcome: "Efficiency improves."
          },
          {
            label: "Avoid tasks",
            outcome: "Tasks pile up."
          }
        ],
        reflections: [
          "When is your energy highest?",
          "How can alignment help?"
        ],
        skill: "Energy alignment awareness"
      },
    },
    {
      id: "brain-young-adult-70",
      title: "Burnout Reset",
      description:
        "Burnout signs become noticeable, learning to manage burnout recovery effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-70"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/burnout-reset",
      index: 69,
      scenario: {
        setup:
          "Burnout signs become noticeable.",
        choices: [
          {
            label: "Ignore signs",
            outcome: "Burnout deepens."
          },
          {
            label: "Pause and reassess",
            outcome: "Recovery begins."
          },
          {
            label: "Quit responsibilities",
            outcome: "Instability increases."
          }
        ],
        reflections: [
          "What signals burnout for you?",
          "What helps recovery?"
        ],
        skill: "Burnout recovery awareness"
      },
    },
    {
      id: "brain-young-adult-71",
      title: "Money Worry",
      description:
        "A young adult worries constantly about expenses and limited income, learning to manage financial stress effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-71"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/money-worry",
      index: 70,
      scenario: {
        setup:
          "A young adult worries constantly about expenses and limited income.",
        choices: [
          {
            label: "Panic and worry constantly",
            outcome: "Anxiety increases."
          },
          {
            label: "Review expenses calmly",
            outcome: "Control improves."
          },
          {
            label: "Ignore the concern",
            outcome: "Stress resurfaces later."
          }
        ],
        reflections: [
          "How do money worries affect you?",
          "What helps you feel more in control?"
        ],
        skill: "Financial stress awareness"
      },
    },
    {
      id: "brain-young-adult-72",
      title: "Emotional Spending",
      description:
        "A young adult shops to feel better emotionally, learning to manage emotional spending effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-72"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-spending",
      index: 71,
      scenario: {
        setup:
          "A young adult shops to feel better emotionally.",
        choices: [
          {
            label: "Spend impulsively",
            outcome: "Temporary relief followed by guilt."
          },
          {
            label: "Pause before spending",
            outcome: "Emotional control improves."
          },
          {
            label: "Suppress the urge",
            outcome: "Urge resurfaces later."
          }
        ],
        reflections: [
          "What triggers emotional spending?",
          "How does pausing help?"
        ],
        skill: "Impulse awareness"
      },
    },
    {
      id: "brain-young-adult-73",
      title: "Comparing Finances",
      description:
        "Peers appear financially better off, learning to manage financial comparison stress effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-73"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/comparing-finances",
      index: 72,
      scenario: {
        setup:
          "Peers appear financially better off.",
        choices: [
          {
            label: "Compare constantly",
            outcome: "Stress increases."
          },
          {
            label: "Focus on personal situation",
            outcome: "Confidence stabilises."
          },
          {
            label: "Avoid thinking about money",
            outcome: "Anxiety persists."
          }
        ],
        reflections: [
          "How does comparison affect money stress?",
          "What defines financial progress for you?"
        ],
        skill: "Financial comparison awareness"
      },
    },
    {
      id: "brain-young-adult-74",
      title: "Fear of Running Out",
      description:
        "Savings feel insufficient, learning to manage financial security concerns effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-74"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-running-out",
      index: 73,
      scenario: {
        setup:
          "Savings feel insufficient.",
        choices: [
          {
            label: "Obsess over money",
            outcome: "Anxiety increases."
          },
          {
            label: "Plan realistically",
            outcome: "Calm improves."
          },
          {
            label: "Avoid thinking about it",
            outcome: "Fear resurfaces."
          }
        ],
        reflections: [
          "What fears do you have about money?",
          "How does planning help?"
        ],
        skill: "Security awareness"
      },
    },
    {
      id: "brain-young-adult-75",
      title: "Income Uncertainty",
      description:
        "Income is irregular or uncertain, learning to manage unpredictable cash flow effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["brain-young-adult-75"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/income-uncertainty",
      index: 74,
      scenario: {
        setup:
          "Income is irregular or uncertain.",
        choices: [
          {
            label: "Worry constantly",
            outcome: "Stress increases."
          },
          {
            label: "Create flexible plans",
            outcome: "Stability improves."
          },
          {
            label: "Ignore uncertainty",
            outcome: "Problems accumulate."
          }
        ],
        reflections: [
          "How does income uncertainty affect you?",
          "What flexibility helps?"
        ],
        skill: "Adaptability awareness"
      },
    },
    {
      id: "brain-young-adult-76",
      title: "Spending Pressure",
      description:
        "Social situations encourage spending beyond comfort, learning to manage FOMO-related spending pressure.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-76"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/spending-pressure",
      index: 75,
      scenario: {
        setup:
          "Social situations encourage spending beyond comfort.",
        choices: [
          {
            label: "Spend to fit in",
            outcome: "Financial stress increases."
          },
          {
            label: "Set spending limits",
            outcome: "Balance improves."
          },
          {
            label: "Avoid social situations",
            outcome: "Isolation increases."
          }
        ],
        reflections: [
          "What pressures affect spending?",
          "How do limits help?"
        ],
        skill: "Spending boundary awareness"
      },
    },
    {
      id: "brain-young-adult-77",
      title: "Debt Anxiety",
      description:
        "Debt feels overwhelming, learning to manage repayment fears and financial stress effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-77"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/debt-anxiety",
      index: 76,
      scenario: {
        setup:
          "Debt feels overwhelming.",
        choices: [
          {
            label: "Avoid thinking about debt",
            outcome: "Stress increases."
          },
          {
            label: "Acknowledge and plan",
            outcome: "Control improves."
          },
          {
            label: "Panic emotionally",
            outcome: "Anxiety escalates."
          }
        ],
        reflections: [
          "How does debt affect emotions?",
          "What helps regain control?"
        ],
        skill: "Debt awareness"
      },
    },
    {
      id: "brain-young-adult-78",
      title: "Saving vs Living",
      description:
        "Balancing saving money and enjoying life feels difficult, learning to find harmony between financial security and present enjoyment.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-78"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/saving-vs-living",
      index: 77,
      scenario: {
        setup:
          "Balancing saving money and enjoying life feels difficult.",
        choices: [
          {
            label: "Spend freely",
            outcome: "Future stress increases."
          },
          {
            label: "Balance saving and spending",
            outcome: "Satisfaction improves."
          },
          {
            label: "Avoid spending entirely",
            outcome: "Resentment builds."
          }
        ],
        reflections: [
          "What balance feels right for you?",
          "How do choices affect peace?"
        ],
        skill: "Balance awareness"
      },
    },
    {
      id: "brain-young-adult-79",
      title: "Financial Mistake",
      description:
        "A poor financial decision causes regret, learning to handle self-blame and transform mistakes into growth opportunities.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-79"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/financial-mistake",
      index: 78,
      scenario: {
        setup:
          "A poor financial decision causes regret.",
        choices: [
          {
            label: "Criticise self harshly",
            outcome: "Confidence drops."
          },
          {
            label: "Learn and adjust",
            outcome: "Growth improves."
          },
          {
            label: "Ignore the mistake",
            outcome: "Mistakes repeat."
          }
        ],
        reflections: [
          "How do you handle money mistakes?",
          "What helps learning?"
        ],
        skill: "Learning mindset awareness"
      },
    },
    {
      id: "brain-young-adult-80",
      title: "Financial Reset",
      description:
        "Money stress accumulates over time, learning to recognize overload signals and reset financial perspective effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-80"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/financial-reset",
      index: 79,
      scenario: {
        setup:
          "Money stress accumulates over time.",
        choices: [
          {
            label: "Ignore stress",
            outcome: "Stress continues."
          },
          {
            label: "Review finances calmly",
            outcome: "Clarity improves."
          },
          {
            label: "Avoid money discussions",
            outcome: "Anxiety persists."
          }
        ],
        reflections: [
          "What signals money overload?",
          "What helps reset financially?"
        ],
        skill: "Financial reset awareness"
      },
    },
    {
      id: "brain-young-adult-81",
      title: "Decision Under Stress",
      description:
        "A young adult must make an important decision while feeling emotionally stressed, learning to manage emotional interference in decision-making.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-81"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/decision-under-stress",
      index: 80,
      scenario: {
        setup:
          "A young adult must make an important decision while feeling emotionally stressed.",
        choices: [
          {
            label: "Decide immediately",
            outcome: "Regret may appear later."
          },
          {
            label: "Pause and reflect",
            outcome: "Clarity improves."
          },
          {
            label: "Avoid deciding",
            outcome: "Pressure increases."
          }
        ],
        reflections: [
          "How do emotions affect decisions?",
          "What helps you pause?"
        ],
        skill: "Decision pause awareness"
      },
    },
    {
      id: "brain-young-adult-82",
      title: "Emotional Reaction Choice",
      description:
        "An emotional reaction arises during a disagreement, learning to manage responses when feeling misunderstood.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-82"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-reaction-choice",
      index: 81,
      scenario: {
        setup:
          "An emotional reaction arises during a disagreement.",
        choices: [
          {
            label: "React emotionally",
            outcome: "Conflict escalates."
          },
          {
            label: "Respond calmly",
            outcome: "Understanding improves."
          },
          {
            label: "Withdraw from discussion",
            outcome: "Issues remain unresolved."
          }
        ],
        reflections: [
          "How do emotions affect responses?",
          "What helps calm reactions?"
        ],
        skill: "Response awareness"
      },
    },
    {
      id: "brain-young-adult-83",
      title: "Impulsive Choice",
      description:
        "Strong emotions push toward quick action, learning to manage urgency and develop better impulse control.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-83"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/impulsive-choice",
      index: 82,
      scenario: {
        setup:
          "Strong emotions push toward quick action.",
        choices: [
          {
            label: "Act impulsively",
            outcome: "Consequences appear quickly."
          },
          {
            label: "Delay action briefly",
            outcome: "Better judgement emerges."
          },
          {
            label: "Avoid action",
            outcome: "Opportunity passes."
          }
        ],
        reflections: [
          "When do you act impulsively?",
          "How does delay help?"
        ],
        skill: "Impulse control awareness"
      },
    },
    {
      id: "brain-young-adult-84",
      title: "Emotional Bias",
      description:
        "Past experiences influence current decisions, learning to recognize emotional biases and make balanced choices.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-84"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-bias",
      index: 83,
      scenario: {
        setup:
          "Past experiences influence current decisions.",
        choices: [
          {
            label: "Let fear decide",
            outcome: "Opportunities reduce."
          },
          {
            label: "Evaluate current situation",
            outcome: "Balanced decision improves."
          },
          {
            label: "Avoid deciding",
            outcome: "Uncertainty continues."
          }
        ],
        reflections: [
          "How does past experience affect you?",
          "How can present awareness help?"
        ],
        skill: "Bias awareness"
      },
    },
    {
      id: "brain-young-adult-85",
      title: "Pressure-Driven Choice",
      description:
        "External pressure pushes for quick decisions, learning to recognize influence and maintain personal boundaries.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-85"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/pressure-driven-choice",
      index: 84,
      scenario: {
        setup:
          "External pressure pushes for quick decisions.",
        choices: [
          {
            label: "Decide to please others",
            outcome: "Regret may follow."
          },
          {
            label: "Consider personal limits",
            outcome: "Self-respect improves."
          },
          {
            label: "Delay decision",
            outcome: "Tension increases."
          }
        ],
        reflections: [
          "Who pressures your decisions?",
          "How do limits protect you?"
        ],
        skill: "Pressure awareness"
      },
    },
    {
      id: "brain-young-adult-86",
      title: "Overthinking Loop",
      description:
        "A decision is delayed due to overthinking, learning to break the cycle and make timely choices.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-86"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/overthinking-loop",
      index: 85,
      scenario: {
        setup:
          "A decision is delayed due to overthinking.",
        choices: [
          {
            label: "Continue overthinking",
            outcome: "Mental fatigue increases."
          },
          {
            label: "Set a decision time",
            outcome: "Relief improves."
          },
          {
            label: "Avoid deciding",
            outcome: "Stress continues."
          }
        ],
        reflections: [
          "When do you overthink decisions?",
          "How does time-boxing help?"
        ],
        skill: "Decision clarity awareness"
      },
    },
    {
      id: "brain-young-adult-87",
      title: "Emotion vs Logic",
      description:
        "Emotion conflicts with logical thinking, learning to balance feelings and rational analysis for better decisions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-87"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotion-vs-logic",
      index: 86,
      scenario: {
        setup:
          "Emotion conflicts with logical thinking.",
        choices: [
          {
            label: "Follow emotion only",
            outcome: "Regret increases."
          },
          {
            label: "Balance emotion and logic",
            outcome: "Balanced outcome improves."
          },
          {
            label: "Suppress emotion",
            outcome: "Emotional tension remains."
          }
        ],
        reflections: [
          "How do you balance emotion and logic?",
          "What helps alignment?"
        ],
        skill: "Balanced decision awareness"
      },
    },
    {
      id: "brain-young-adult-88",
      title: "Avoidance Decision",
      description:
        "Avoiding decisions feels easier, learning to face responsibility and build decision-making confidence.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-88"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/avoidance-decision",
      index: 87,
      scenario: {
        setup:
          "Avoiding decisions feels easier.",
        choices: [
          {
            label: "Avoid decision",
            outcome: "Stress builds."
          },
          {
            label: "Face decision gradually",
            outcome: "Confidence improves."
          },
          {
            label: "Delegate decision",
            outcome: "Control reduces."
          }
        ],
        reflections: [
          "What decisions do you avoid?",
          "How does gradual action help?"
        ],
        skill: "Responsibility awareness"
      },
    },
    {
      id: "brain-young-adult-89",
      title: "Emotional Regret",
      description:
        "A decision leads to regret, learning to handle self-blame constructively and transform mistakes into growth opportunities.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-89"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-regret",
      index: 88,
      scenario: {
        setup:
          "A decision leads to regret.",
        choices: [
          {
            label: "Criticise self",
            outcome: "Confidence drops."
          },
          {
            label: "Reflect and learn",
            outcome: "Growth improves."
          },
          {
            label: "Ignore regret",
            outcome: "Mistakes repeat."
          }
        ],
        reflections: [
          "How do you handle regret?",
          "What helps learning?"
        ],
        skill: "Learning awareness"
      },
    },
    {
      id: "brain-young-adult-90",
      title: "Decision Reset",
      description:
        "Multiple decisions create fatigue, learning to recognize mental exhaustion and reset decision-making capacity.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-90"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/decision-reset",
      index: 89,
      scenario: {
        setup:
          "Multiple decisions create fatigue.",
        choices: [
          {
            label: "Continue deciding",
            outcome: "Fatigue increases."
          },
          {
            label: "Pause and reset",
            outcome: "Clarity improves."
          },
          {
            label: "Avoid decisions",
            outcome: "Backlog grows."
          }
        ],
        reflections: [
          "What signals decision fatigue?",
          "How do you reset?"
        ],
        skill: "Decision fatigue awareness"
      },
    },
    {
      id: "brain-young-adult-91",
      title: "Handling Setbacks",
      description:
        "A planned outcome fails unexpectedly, learning to build resilience and adapt effectively to disappointment.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-91"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/handling-setbacks",
      index: 90,
      scenario: {
        setup:
          "A planned outcome fails unexpectedly.",
        choices: [
          {
            label: "Give up",
            outcome: "Motivation drops."
          },
          {
            label: "Reflect and adapt",
            outcome: "Resilience builds."
          },
          {
            label: "Blame circumstances",
            outcome: "Learning reduces."
          }
        ],
        reflections: [
          "How do setbacks affect you?",
          "What helps adaptation?"
        ],
        skill: "Resilience awareness"
      },
    },
    {
      id: "brain-young-adult-92",
      title: "Emotional Recovery",
      description:
        "Emotional exhaustion follows stress, learning to recognize low energy signals and recover effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-92"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-recovery",
      index: 91,
      scenario: {
        setup:
          "Emotional exhaustion follows stress.",
        choices: [
          {
            label: "Ignore exhaustion",
            outcome: "Burnout risk increases."
          },
          {
            label: "Rest intentionally",
            outcome: "Recovery improves."
          },
          {
            label: "Distract continuously",
            outcome: "Fatigue continues."
          }
        ],
        reflections: [
          "What helps you recover emotionally?",
          "How do you notice exhaustion?"
        ],
        skill: "Recovery awareness"
      },
    },
    {
      id: "brain-young-adult-93",
      title: "Learning from Failure",
      description:
        "Failure occurs despite effort, learning to transform self-doubt into growth opportunities and develop resilience.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-93"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/learning-from-failure",
      index: 92,
      scenario: {
        setup:
          "Failure occurs despite effort.",
        choices: [
          {
            label: "Internalise failure",
            outcome: "Confidence reduces."
          },
          {
            label: "Extract learning",
            outcome: "Growth improves."
          },
          {
            label: "Avoid future attempts",
            outcome: "Opportunities reduce."
          }
        ],
        reflections: [
          "How do you interpret failure?",
          "What helps learning?"
        ],
        skill: "Growth mindset awareness"
      },
    },
    {
      id: "brain-young-adult-94",
      title: "Coping with Change",
      description:
        "Unexpected changes disrupt plans, learning to manage loss of control and develop healthy coping strategies.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-94"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/coping-with-change",
      index: 93,
      scenario: {
        setup:
          "Unexpected changes disrupt plans.",
        choices: [
          {
            label: "Resist change",
            outcome: "Stress increases."
          },
          {
            label: "Adapt gradually",
            outcome: "Stability improves."
          },
          {
            label: "Withdraw",
            outcome: "Disconnection grows."
          }
        ],
        reflections: [
          "How do you handle change?",
          "What helps adaptation?"
        ],
        skill: "Adaptability awareness"
      },
    },
    {
      id: "brain-young-adult-95",
      title: "Emotional Strength",
      description:
        "Repeated challenges test endurance, learning to build mental resilience and emotional coping strategies.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-95"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-strength",
      index: 94,
      scenario: {
        setup:
          "Repeated challenges test endurance.",
        choices: [
          {
            label: "Suppress emotions",
            outcome: "Emotional strain increases."
          },
          {
            label: "Acknowledge and continue",
            outcome: "Strength builds."
          },
          {
            label: "Give up",
            outcome: "Confidence drops."
          }
        ],
        reflections: [
          "What builds emotional strength?",
          "How do you continue despite difficulty?"
        ],
        skill: "Mental strength awareness"
      },
    },
    {
      id: "brain-young-adult-96",
      title: "Recovery After Loss",
      description:
        "Loss of an opportunity affects confidence, learning to process disappointment and rebuild resilience.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-96"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/recovery-after-loss",
      index: 95,
      scenario: {
        setup:
          "Loss of an opportunity affects confidence.",
        choices: [
          {
            label: "Dwell on loss",
            outcome: "Sadness persists."
          },
          {
            label: "Reframe experience",
            outcome: "Perspective improves."
          },
          {
            label: "Avoid future risks",
            outcome: "Growth limits."
          }
        ],
        reflections: [
          "How do you process loss?",
          "What helps recovery?"
        ],
        skill: "Recovery mindset awareness"
      },
    },
    {
      id: "brain-young-adult-97",
      title: "Emotional Endurance",
      description:
        "Long-term pressure tests patience, learning to maintain balance and build sustainable emotional stamina.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-97"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-endurance",
      index: 96,
      scenario: {
        setup:
          "Long-term pressure tests patience.",
        choices: [
          {
            label: "Push without rest",
            outcome: "Burnout increases."
          },
          {
            label: "Balance effort and rest",
            outcome: "Sustainability improves."
          },
          {
            label: "Withdraw completely",
            outcome: "Momentum drops."
          }
        ],
        reflections: [
          "What helps endurance?",
          "How do you pace yourself?"
        ],
        skill: "Endurance awareness"
      },
    },
    {
      id: "brain-young-adult-98",
      title: "Inner Stability",
      description:
        "External situations feel unstable, learning to cultivate internal calm and reduce dependence on external validation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-98"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/inner-stability",
      index: 97,
      scenario: {
        setup:
          "External situations feel unstable.",
        choices: [
          {
            label: "Seek constant reassurance",
            outcome: "Dependence increases."
          },
          {
            label: "Build internal stability",
            outcome: "Calm improves."
          },
          {
            label: "Avoid uncertainty",
            outcome: "Fear persists."
          }
        ],
        reflections: [
          "What creates inner stability?",
          "How do you build it?"
        ],
        skill: "Inner stability awareness"
      },
    },
    {
      id: "brain-young-adult-99",
      title: "Long-Term Perspective",
      description:
        "Short-term setbacks feel overwhelming, learning to shift perspective and reduce stress through long-term thinking.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-99"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/long-term-perspective",
      index: 98,
      scenario: {
        setup:
          "Short-term setbacks feel overwhelming.",
        choices: [
          {
            label: "Focus only on now",
            outcome: "Stress increases."
          },
          {
            label: "Consider long-term view",
            outcome: "Perspective improves."
          },
          {
            label: "Avoid thinking ahead",
            outcome: "Anxiety remains."
          }
        ],
        reflections: [
          "How does perspective change stress?",
          "What helps long-term thinking?"
        ],
        skill: "Perspective awareness"
      },
    },
    {
      id: "brain-young-adult-100",
      title: "Resilience Reset",
      description:
        "After many challenges, energy feels low, learning to recognise accumulated fatigue and rebuild resilience effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["brain-young-adult-100"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/resilience-reset",
      index: 99,
      scenario: {
        setup:
          "After many challenges, energy feels low.",
        choices: [
          {
            label: "Ignore fatigue",
            outcome: "Burnout deepens."
          },
          {
            label: "Pause and rebuild gradually",
            outcome: "Resilience strengthens."
          },
          {
            label: "Quit efforts",
            outcome: "Confidence reduces."
          }
        ],
        reflections: [
          "What signals the need for reset?",
          "What helps rebuild strength?"
        ],
        skill: "Resilience reset awareness"
      },
    },
  ];

  return brainYoungAdultGames;
};
