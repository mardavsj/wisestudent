import { getCalmCoinsForGame, getReplayCostForGame } from '../../../../../utils/teacherGameUtils';

/**
 * Teacher Education Game Data
 * Each game has exactly 5 questions
 * CalmCoins are awarded per game (not per question)
 */
export const teacherEducationGameData = [
  {
    id: 'teacher-education-1',
    slug: 'name-your-feeling',
    title: 'Name Your Feeling',
    description: 'Identify personal emotions in typical classroom or staffroom situations',
    gameIndex: 1,
    calmCoins: getCalmCoinsForGame(1),  // 5 CalmCoins
    replayCost: getReplayCostForGame(1), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/name-your-feeling'
  },
  {
    id: 'teacher-education-2',
    slug: 'emotion-wheel-quiz',
    title: 'Emotion Wheel Quiz',
    description: 'Learn to differentiate between primary and secondary emotions',
    gameIndex: 2,
    calmCoins: getCalmCoinsForGame(2),  // 5 CalmCoins
    replayCost: getReplayCostForGame(2), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotion-wheel-quiz'
  },
  {
    id: 'teacher-education-3',
    slug: 'trigger-finder',
    title: 'Trigger Finder',
    description: 'Identify personal emotional triggers and common stress cues',
    gameIndex: 3,
    calmCoins: getCalmCoinsForGame(3),  // 5 CalmCoins
    replayCost: getReplayCostForGame(3), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/trigger-finder'
  },
  {
    id: 'teacher-education-4',
    slug: 'thought-tracker',
    title: 'Thought Tracker',
    description: 'Notice automatic thought patterns and how they affect mood',
    gameIndex: 4,
    calmCoins: getCalmCoinsForGame(4),  // 5 CalmCoins
    replayCost: getReplayCostForGame(4), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/thought-tracker'
  },
  {
    id: 'teacher-education-5',
    slug: 'mood-map',
    title: 'Mood Map',
    description: 'Connect body sensations to emotions',
    gameIndex: 5,
    calmCoins: getCalmCoinsForGame(5),  // 5 CalmCoins
    replayCost: getReplayCostForGame(5), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/mood-map'
  },
  {
    id: 'teacher-education-6',
    slug: 'inner-voice-check',
    title: 'Inner Voice Check',
    description: 'Recognize negative self-talk and replace it with constructive phrasing',
    gameIndex: 6,
    calmCoins: getCalmCoinsForGame(6),  // 5 CalmCoins
    replayCost: getReplayCostForGame(6), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/inner-voice-check'
  },
  {
    id: 'teacher-education-7',
    slug: 'emotion-journal',
    title: 'Emotion Journal',
    description: 'Reflect on daily emotion patterns to build self-awareness',
    gameIndex: 7,
    calmCoins: getCalmCoinsForGame(7),  // 5 CalmCoins
    replayCost: getReplayCostForGame(7), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotion-journal'
  },
  {
    id: 'teacher-education-8',
    slug: 'mirror-moment-simulation',
    title: 'Mirror Moment Simulation',
    description: 'Experience self-dialogue to reduce guilt or shame after a tough day',
    gameIndex: 8,
    calmCoins: getCalmCoinsForGame(8),  // 5 CalmCoins
    replayCost: getReplayCostForGame(8), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/mirror-moment-simulation'
  },
  {
    id: 'teacher-education-9',
    slug: 'emotion-reflex',
    title: 'Emotion Reflex',
    description: 'React to quick emotion cues in images or phrases',
    gameIndex: 9,
    calmCoins: getCalmCoinsForGame(9),  // 5 CalmCoins
    replayCost: getReplayCostForGame(9), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotion-reflex'
  },
  {
    id: 'teacher-education-10',
    slug: 'self-aware-teacher-badge',
    title: 'Self-Aware Teacher Badge',
    description: 'Reward teachers who complete daily emotional awareness tasks',
    gameIndex: 10,
    calmCoins: getCalmCoinsForGame(10),  // 5 CalmCoins
    replayCost: getReplayCostForGame(10), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/self-aware-teacher-badge'
  },
  {
    id: 'teacher-education-11',
    slug: 'identify-your-stressors',
    title: 'Identify Your Stressors',
    description: 'Recognize the top three sources of stress in a school week',
    gameIndex: 11,
    calmCoins: getCalmCoinsForGame(11),  // 5 CalmCoins
    replayCost: getReplayCostForGame(11), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/identify-your-stressors'
  },
  {
    id: 'teacher-education-12',
    slug: 'stress-thermometer',
    title: 'Stress Thermometer',
    description: 'Rate and visualize your stress intensity across situations',
    gameIndex: 12,
    calmCoins: getCalmCoinsForGame(12),  // 5 CalmCoins
    replayCost: getReplayCostForGame(12), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/stress-thermometer'
  },
  {
    id: 'teacher-education-13',
    slug: 'quick-calm-reflex',
    title: 'Quick Calm Reflex',
    description: 'Practice instant de-stressing actions during busy class hours',
    gameIndex: 13,
    calmCoins: getCalmCoinsForGame(13),  // 5 CalmCoins
    replayCost: getReplayCostForGame(13), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/quick-calm-reflex'
  },
  {
    id: 'teacher-education-14',
    slug: 'breathe-with-rhythm',
    title: 'Breathe with Rhythm',
    description: 'Master a 3-step breathing cycle to reduce physical tension',
    gameIndex: 14,
    calmCoins: getCalmCoinsForGame(14),  // 5 CalmCoins
    replayCost: getReplayCostForGame(14), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/breathe-with-rhythm'
  },
  {
    id: 'teacher-education-15',
    slug: 'time-pressure-simulation',
    title: 'Time Pressure Simulation',
    description: 'Learn balanced decision-making under time stress',
    gameIndex: 15,
    calmCoins: getCalmCoinsForGame(15),  // 5 CalmCoins
    replayCost: getReplayCostForGame(15), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/time-pressure-simulation'
  },
  {
    id: 'teacher-education-16',
    slug: 'calm-corner-poster',
    title: 'Calm Corner Poster',
    description: 'Create a personal Calm Corner visual for desk or phone wallpaper',
    gameIndex: 16,
    calmCoins: getCalmCoinsForGame(16),  // 5 CalmCoins
    replayCost: getReplayCostForGame(16), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/calm-corner-poster'
  },
  {
    id: 'teacher-education-17',
    slug: 'workload-journal',
    title: 'Workload Journal',
    description: 'Reflect on tasks that cause strain and identify tasks to delegate or simplify',
    gameIndex: 17,
    calmCoins: getCalmCoinsForGame(17),  // 5 CalmCoins
    replayCost: getReplayCostForGame(17), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/workload-journal'
  },
  {
    id: 'teacher-education-18',
    slug: 'pause-practice-simulation',
    title: 'Pause Practice Simulation',
    description: 'Train the habit of pausing before reacting to stress triggers',
    gameIndex: 18,
    calmCoins: getCalmCoinsForGame(18),  // 5 CalmCoins
    replayCost: getReplayCostForGame(18), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/pause-practice-simulation'
  },
  {
    id: 'teacher-education-19',
    slug: 'stress-release-body-scan',
    title: 'Stress Release Body Scan',
    description: 'Relax through guided visualization and muscle awareness',
    gameIndex: 19,
    calmCoins: getCalmCoinsForGame(19),  // 5 CalmCoins
    replayCost: getReplayCostForGame(19), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/stress-release-body-scan'
  },
  {
    id: 'teacher-education-20',
    slug: 'calm-teacher-badge',
    title: 'Calm Teacher Badge',
    description: 'Reward teachers for consistent daily stress management practice',
    gameIndex: 20,
    calmCoins: getCalmCoinsForGame(20),  // 5 CalmCoins
    replayCost: getReplayCostForGame(20), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/calm-teacher-badge'
  },
  {
    id: 'teacher-education-21',
    slug: 'understanding-compassion-fatigue',
    title: 'Understanding Compassion Fatigue',
    description: 'Recognize the signs of emotional exhaustion from over-caring',
    gameIndex: 21,
    calmCoins: getCalmCoinsForGame(21),  // 5 CalmCoins
    replayCost: getReplayCostForGame(21), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/understanding-compassion-fatigue'
  },
  {
    id: 'teacher-education-22',
    slug: 'empathy-vs-overload-quiz',
    title: 'Empathy vs Overload Quiz',
    description: 'Distinguish between helpful empathy and unhealthy emotional absorption',
    gameIndex: 22,
    calmCoins: getCalmCoinsForGame(22),  // 5 CalmCoins
    replayCost: getReplayCostForGame(22), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathy-vs-overload-quiz'
  },
  {
    id: 'teacher-education-23',
    slug: 'emotional-boundary-builder',
    title: 'Emotional Boundary Builder',
    description: 'Learn to maintain emotional balance while helping others',
    gameIndex: 23,
    calmCoins: getCalmCoinsForGame(23),  // 5 CalmCoins
    replayCost: getReplayCostForGame(23), // 2 CalmCoins
    estimatedTime: '18 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotional-boundary-builder'
  },
  {
    id: 'teacher-education-24',
    slug: 'energy-drain-tracker',
    title: 'Energy Drain Tracker',
    description: 'Identify people and tasks that emotionally drain or uplift',
    gameIndex: 24,
    calmCoins: getCalmCoinsForGame(24),  // 5 CalmCoins
    replayCost: getReplayCostForGame(24), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/energy-drain-tracker'
  },
  {
    id: 'teacher-education-25',
    slug: 'refill-rituals',
    title: 'Refill Rituals',
    description: 'Build small self-care rituals that restore empathy reserves',
    gameIndex: 25,
    calmCoins: getCalmCoinsForGame(25),  // 5 CalmCoins
    replayCost: getReplayCostForGame(25), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/refill-rituals'
  },
  {
    id: 'teacher-education-26',
    slug: 'compassion-reflection-journal',
    title: 'Compassion Reflection Journal',
    description: 'Reflect on a recent moment of deep empathy and its impact',
    gameIndex: 26,
    calmCoins: getCalmCoinsForGame(26),  // 5 CalmCoins
    replayCost: getReplayCostForGame(26), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/compassion-reflection-journal'
  },
  {
    id: 'teacher-education-27',
    slug: 'empathy-rebalance-simulation',
    title: 'Empathy Rebalance Simulation',
    description: 'Manage compassion in real-time classroom stress situations',
    gameIndex: 27,
    calmCoins: getCalmCoinsForGame(27),  // 5 CalmCoins
    replayCost: getReplayCostForGame(27), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathy-rebalance-simulation'
  },
  {
    id: 'teacher-education-28',
    slug: 'inner-recharge-visualization',
    title: 'Inner Recharge Visualization',
    description: 'Mentally recharge empathy reserves using guided imagery',
    gameIndex: 28,
    calmCoins: getCalmCoinsForGame(28),  // 5 CalmCoins
    replayCost: getReplayCostForGame(28), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/inner-recharge-visualization'
  },
  {
    id: 'teacher-education-29',
    slug: 'empathy-reflex',
    title: 'Empathy Reflex',
    description: 'Rapidly identify emotionally supportive vs draining responses',
    gameIndex: 29,
    calmCoins: getCalmCoinsForGame(29),  // 5 CalmCoins
    replayCost: getReplayCostForGame(29), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathy-reflex'
  },
  {
    id: 'teacher-education-30',
    slug: 'compassion-balance-badge',
    title: 'Compassion Balance Badge',
    description: 'Recognize teachers who model healthy empathy in school culture',
    gameIndex: 30,
    calmCoins: getCalmCoinsForGame(30),  // 5 CalmCoins
    replayCost: getReplayCostForGame(30), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/compassion-balance-badge'
  },
  {
    id: 'teacher-education-31',
    slug: 'the-balance-scale',
    title: 'The Balance Scale',
    description: 'Understand the current ratio between personal time and school time',
    gameIndex: 31,
    calmCoins: getCalmCoinsForGame(31),  // 5 CalmCoins
    replayCost: getReplayCostForGame(31), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-balance-scale'
  },
  {
    id: 'teacher-education-32',
    slug: 'boundaries-quiz',
    title: 'Boundaries Quiz',
    description: 'Learn to identify healthy and unhealthy work boundaries',
    gameIndex: 32,
    calmCoins: getCalmCoinsForGame(32),  // 5 CalmCoins
    replayCost: getReplayCostForGame(32), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/boundaries-quiz'
  },
  {
    id: 'teacher-education-33',
    slug: 'after-school-reset',
    title: 'After-School Reset',
    description: 'Practice end-of-day mental separation techniques',
    gameIndex: 33,
    calmCoins: getCalmCoinsForGame(33),  // 5 CalmCoins
    replayCost: getReplayCostForGame(33), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/after-school-reset'
  },
  {
    id: 'teacher-education-34',
    slug: 'task-prioritization-puzzle',
    title: 'Task Prioritization Puzzle',
    description: 'Learn to separate urgent vs important tasks',
    gameIndex: 34,
    calmCoins: getCalmCoinsForGame(34),  // 5 CalmCoins
    replayCost: getReplayCostForGame(34), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/task-prioritization-puzzle'
  },
  {
    id: 'teacher-education-35',
    slug: 'weekend-recharge-plan',
    title: 'Weekend Recharge Plan',
    description: 'Design an achievable personal recharge plan for the week',
    gameIndex: 35,
    calmCoins: getCalmCoinsForGame(35),  // 5 CalmCoins
    replayCost: getReplayCostForGame(35), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/weekend-recharge-plan'
  },
  {
    id: 'teacher-education-36',
    slug: 'the-no-practice',
    title: 'The "No" Practice',
    description: 'Learn polite, assertive refusal to avoid overload',
    gameIndex: 36,
    calmCoins: getCalmCoinsForGame(36),  // 5 CalmCoins
    replayCost: getReplayCostForGame(36), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-no-practice'
  },
  {
    id: 'teacher-education-37',
    slug: 'work-life-tracker-journal',
    title: 'Work–Life Tracker Journal',
    description: 'Track how personal time fluctuates across 5 days',
    gameIndex: 37,
    calmCoins: getCalmCoinsForGame(37),  // 5 CalmCoins
    replayCost: getReplayCostForGame(37), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/work-life-tracker-journal'
  },
  {
    id: 'teacher-education-38',
    slug: 'family-connection-challenge',
    title: 'Family Connection Challenge',
    description: 'Reinforce personal bonds to counter isolation from overwork',
    gameIndex: 38,
    calmCoins: getCalmCoinsForGame(38),  // 5 CalmCoins
    replayCost: getReplayCostForGame(38), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/family-connection-challenge'
  },
  {
    id: 'teacher-education-39',
    slug: 'digital-shutdown-simulation',
    title: 'Digital Shutdown Simulation',
    description: 'Practice structured disconnection from work devices',
    gameIndex: 39,
    calmCoins: getCalmCoinsForGame(39),  // 5 CalmCoins
    replayCost: getReplayCostForGame(39), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/digital-shutdown-simulation'
  },
  {
    id: 'teacher-education-40',
    slug: 'balanced-life-badge',
    title: 'Balanced Life Badge',
    description: 'Reward teachers who maintain consistent rest and self-care routines',
    gameIndex: 40,
    calmCoins: getCalmCoinsForGame(40),  // 5 CalmCoins
    replayCost: getReplayCostForGame(40), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/balanced-life-badge'
  },
  {
    id: 'teacher-education-41',
    slug: 'present-moment-awareness',
    title: 'Present Moment Awareness',
    description: 'Train attention to stay in the present during class or meetings',
    gameIndex: 41,
    calmCoins: getCalmCoinsForGame(41),  // 5 CalmCoins
    replayCost: getReplayCostForGame(41), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/present-moment-awareness'
  },
  {
    id: 'teacher-education-42',
    slug: 'one-minute-pause',
    title: 'One-Minute Pause',
    description: 'Learn micro-meditation for immediate mental reset',
    gameIndex: 42,
    calmCoins: getCalmCoinsForGame(42),  // 5 CalmCoins
    replayCost: getReplayCostForGame(42), // 2 CalmCoins
    estimatedTime: '2 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/one-minute-pause'
  },
  {
    id: 'teacher-education-43',
    slug: 'focus-anchor-exercise',
    title: 'Focus Anchor Exercise',
    description: 'Practice grounding the mind using a sensory focus point',
    gameIndex: 43,
    calmCoins: getCalmCoinsForGame(43),  // 5 CalmCoins
    replayCost: getReplayCostForGame(43), // 2 CalmCoins
    estimatedTime: '3 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/focus-anchor-exercise'
  },
  {
    id: 'teacher-education-44',
    slug: 'mindful-observation-game',
    title: 'Mindful Observation Game',
    description: 'Strengthen awareness by noticing small details in environment',
    gameIndex: 44,
    calmCoins: getCalmCoinsForGame(44),  // 5 CalmCoins
    replayCost: getReplayCostForGame(44), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/mindful-observation-game'
  },
  {
    id: 'teacher-education-45',
    slug: 'guided-meditation-audio',
    title: 'Guided Meditation Audio',
    description: 'Relax the nervous system and improve sustained focus',
    gameIndex: 45,
    calmCoins: getCalmCoinsForGame(45),  // 5 CalmCoins
    replayCost: getReplayCostForGame(45), // 2 CalmCoins
    estimatedTime: '6 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/guided-meditation-audio'
  },
  {
    id: 'teacher-education-46',
    slug: 'distraction-detox',
    title: 'Distraction Detox',
    description: 'Identify and limit daily distractions that reduce focus quality',
    gameIndex: 46,
    calmCoins: getCalmCoinsForGame(46),  // 5 CalmCoins
    replayCost: getReplayCostForGame(46), // 2 CalmCoins
    estimatedTime: '8 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/distraction-detox'
  },
  {
    id: 'teacher-education-47',
    slug: 'mindful-eating-break',
    title: 'Mindful Eating Break',
    description: 'Cultivate awareness during short meal or snack breaks',
    gameIndex: 47,
    calmCoins: getCalmCoinsForGame(47),  // 5 CalmCoins
    replayCost: getReplayCostForGame(47), // 2 CalmCoins
    estimatedTime: '3 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/mindful-eating-break'
  },
  {
    id: 'teacher-education-48',
    slug: 'flow-state-simulation',
    title: 'Flow State Simulation',
    description: 'Learn how focused engagement feels mentally and physically',
    gameIndex: 48,
    calmCoins: getCalmCoinsForGame(48),  // 5 CalmCoins
    replayCost: getReplayCostForGame(48), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/flow-state-simulation'
  },
  {
    id: 'teacher-education-49',
    slug: 'gratitude-in-the-moment',
    title: 'Gratitude in the Moment',
    description: 'Shift attention from pressure to appreciation to restore focus',
    gameIndex: 49,
    calmCoins: getCalmCoinsForGame(49),  // 5 CalmCoins
    replayCost: getReplayCostForGame(49), // 2 CalmCoins
    estimatedTime: '3 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/gratitude-in-the-moment'
  },
  {
    id: 'teacher-education-50',
    slug: 'mindful-mastery-badge',
    title: 'Mindful Mastery Badge',
    description: 'Celebrate teachers who sustain mindful habits daily',
    gameIndex: 50,
    calmCoins: getCalmCoinsForGame(50),  // 5 CalmCoins
    replayCost: getReplayCostForGame(50), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'expert',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/mindful-mastery-badge'
  },
  {
    id: 'teacher-education-51',
    slug: 'the-bounce-back-quiz',
    title: 'The Bounce-Back Quiz',
    description: 'Understand how resiliently you respond to common school setbacks',
    gameIndex: 51,
    calmCoins: getCalmCoinsForGame(51),  // 5 CalmCoins
    replayCost: getReplayCostForGame(51), // 2 CalmCoins
    estimatedTime: '8 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-bounce-back-quiz'
  },
  {
    id: 'teacher-education-52',
    slug: 'growth-mindset-puzzle',
    title: 'Growth Mindset Puzzle',
    description: 'Learn to reframe "failure" as feedback for improvement',
    gameIndex: 52,
    calmCoins: getCalmCoinsForGame(52),  // 5 CalmCoins
    replayCost: getReplayCostForGame(52), // 2 CalmCoins
    estimatedTime: '6 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/growth-mindset-puzzle'
  },
  {
    id: 'teacher-education-53',
    slug: 'tough-day-simulation',
    title: 'Tough Day Simulation',
    description: 'Practice recovering mentally after a challenging classroom day',
    gameIndex: 53,
    calmCoins: getCalmCoinsForGame(53),  // 5 CalmCoins
    replayCost: getReplayCostForGame(53), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/tough-day-simulation'
  },
  {
    id: 'teacher-education-54',
    slug: 'positive-recall-game',
    title: 'Positive Recall Game',
    description: 'Reinforce optimism by recalling moments of past success',
    gameIndex: 54,
    calmCoins: getCalmCoinsForGame(54),  // 5 CalmCoins
    replayCost: getReplayCostForGame(54), // 2 CalmCoins
    estimatedTime: '8 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/positive-recall-game'
  },
  {
    id: 'teacher-education-55',
    slug: 'resilience-roleplay',
    title: 'Resilience Roleplay',
    description: 'Choose adaptive reactions when criticized or corrected',
    gameIndex: 55,
    calmCoins: getCalmCoinsForGame(55),  // 5 CalmCoins
    replayCost: getReplayCostForGame(55), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/resilience-roleplay'
  },
  {
    id: 'teacher-education-56',
    slug: 'challenge-journal',
    title: 'Challenge Journal',
    description: 'Document one recent difficulty and how it was overcome',
    gameIndex: 56,
    calmCoins: getCalmCoinsForGame(56),  // 5 CalmCoins
    replayCost: getReplayCostForGame(56), // 2 CalmCoins
    estimatedTime: '8 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/challenge-journal'
  },
  {
    id: 'teacher-education-57',
    slug: 'emotional-recovery-toolkit',
    title: 'Emotional Recovery Toolkit',
    description: 'Build a personal plan to handle disappointment or failure days',
    gameIndex: 57,
    calmCoins: getCalmCoinsForGame(57),  // 5 CalmCoins
    replayCost: getReplayCostForGame(57), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotional-recovery-toolkit'
  },
  {
    id: 'teacher-education-58',
    slug: 'the-reframe-reflex',
    title: 'The Reframe Reflex',
    description: 'Quickly convert negative thoughts into empowering ones',
    gameIndex: 58,
    calmCoins: getCalmCoinsForGame(58),  // 5 CalmCoins
    replayCost: getReplayCostForGame(58), // 2 CalmCoins
    estimatedTime: '8 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-reframe-reflex'
  },
  {
    id: 'teacher-education-59',
    slug: 'gratitude-ladder',
    title: 'Gratitude Ladder',
    description: 'Increase resilience through appreciation of daily progress',
    gameIndex: 59,
    calmCoins: getCalmCoinsForGame(59),  // 5 CalmCoins
    replayCost: getReplayCostForGame(59), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/gratitude-ladder'
  },
  {
    id: 'teacher-education-60',
    slug: 'resilient-educator-badge',
    title: 'Resilient Educator Badge',
    description: 'Celebrate teachers who display consistent bounce-back behaviors',
    gameIndex: 60,
    calmCoins: getCalmCoinsForGame(60),  // 5 CalmCoins
    replayCost: getReplayCostForGame(60), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/resilient-educator-badge',
    isBadgeGame: true
  },
  {
    id: 'teacher-education-61',
    slug: 'the-respectful-no',
    title: 'The Respectful "No"',
    description: 'Practice saying "no" with kindness and clarity',
    gameIndex: 61,
    calmCoins: getCalmCoinsForGame(61),  // 5 CalmCoins
    replayCost: getReplayCostForGame(61), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-respectful-no'
  },
  {
    id: 'teacher-education-62',
    slug: 'active-listening-quiz',
    title: 'Active Listening Quiz',
    description: 'Strengthen listening skills to reduce misunderstandings',
    gameIndex: 62,
    calmCoins: getCalmCoinsForGame(62),  // 5 CalmCoins
    replayCost: getReplayCostForGame(62), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/active-listening-quiz'
  },
  {
    id: 'teacher-education-63',
    slug: 'boundary-builder-puzzle',
    title: 'Boundary Builder Puzzle',
    description: 'Learn which boundaries protect emotional health',
    gameIndex: 63,
    calmCoins: getCalmCoinsForGame(63),  // 5 CalmCoins
    replayCost: getReplayCostForGame(63), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/boundary-builder-puzzle'
  },
  {
    id: 'teacher-education-64',
    slug: 'conflict-tone-simulation',
    title: 'Conflict Tone Simulation',
    description: 'Choose communication tone during tense situations',
    gameIndex: 64,
    calmCoins: getCalmCoinsForGame(64),  // 5 CalmCoins
    replayCost: getReplayCostForGame(64), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/conflict-tone-simulation'
  },
  {
    id: 'teacher-education-65',
    slug: 'assertiveness-ladder',
    title: 'Assertiveness Ladder',
    description: 'Identify where you stand between passive and aggressive responses',
    gameIndex: 65,
    calmCoins: getCalmCoinsForGame(65),  // 5 CalmCoins
    replayCost: getReplayCostForGame(65), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/assertiveness-ladder'
  },
  {
    id: 'teacher-education-66',
    slug: 'communication-mirror',
    title: 'Communication Mirror',
    description: 'Reflect on personal communication habits',
    gameIndex: 66,
    calmCoins: getCalmCoinsForGame(66),  // 5 CalmCoins
    replayCost: getReplayCostForGame(66), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/communication-mirror'
  },
  {
    id: 'teacher-education-67',
    slug: 'professional-boundaries-journal',
    title: 'Professional Boundaries Journal',
    description: 'Define boundaries around availability and self-respect',
    gameIndex: 67,
    calmCoins: getCalmCoinsForGame(67),  // 5 CalmCoins
    replayCost: getReplayCostForGame(67), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/professional-boundaries-journal'
  },
  {
    id: 'teacher-education-68',
    slug: 'empathetic-dialogue-roleplay',
    title: 'Empathetic Dialogue Roleplay',
    description: 'Balance empathy with firmness in communication',
    gameIndex: 68,
    calmCoins: getCalmCoinsForGame(68),  // 5 CalmCoins
    replayCost: getReplayCostForGame(68), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathetic-dialogue-roleplay'
  },
  {
    id: 'teacher-education-69',
    slug: 'communication-reflex',
    title: 'Communication Reflex',
    description: 'Quickly identify positive vs negative communication cues',
    gameIndex: 69,
    calmCoins: getCalmCoinsForGame(69),  // 5 CalmCoins
    replayCost: getReplayCostForGame(69), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/communication-reflex'
  },
  {
    id: 'teacher-education-70',
    slug: 'clear-communicator-badge',
    title: 'Clear Communicator Badge',
    description: 'Reward consistent use of assertive, empathetic communication',
    gameIndex: 70,
    calmCoins: getCalmCoinsForGame(70),  // 10 CalmCoins
    replayCost: getReplayCostForGame(70), // 0 CalmCoins (badge games can't be replayed)
    estimatedTime: 'N/A',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/clear-communicator-badge',
    isBadgeGame: true,
    icon: '🎯',
    color: 'from-indigo-500 to-purple-500',
    category: 'Communication',
    teacherTip: 'Highlight badge earners during staff communication workshops.'
  },
  {
    id: 'teacher-education-71',
    slug: 'the-support-circle',
    title: 'The Support Circle',
    description: 'Recognize the value of peer emotional support in teaching environments',
    gameIndex: 71,
    calmCoins: getCalmCoinsForGame(71),  // 5 CalmCoins
    replayCost: getReplayCostForGame(71), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-support-circle',
    icon: '💙',
    color: 'from-blue-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Encourage teachers to form 3-member micro support circles per department.'
  },
  {
    id: 'teacher-education-72',
    slug: 'empathy-chain-game',
    title: 'Empathy Chain Game',
    description: 'Learn to pass supportive words forward among peers',
    gameIndex: 72,
    calmCoins: getCalmCoinsForGame(72),  // 5 CalmCoins
    replayCost: getReplayCostForGame(72), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathy-chain-game',
    icon: '💚',
    color: 'from-pink-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Create a real "Empathy Chain" board in the staffroom.'
  },
  {
    id: 'teacher-education-73',
    slug: 'ask-for-help-simulation',
    title: 'Ask for Help Simulation',
    description: 'Practice requesting help without guilt or hesitation',
    gameIndex: 73,
    calmCoins: getCalmCoinsForGame(73),  // 5 CalmCoins
    replayCost: getReplayCostForGame(73), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/ask-for-help-simulation',
    icon: '🤝',
    color: 'from-blue-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Reinforce that asking for help builds—not weakens—professional respect.'
  },
  {
    id: 'teacher-education-74',
    slug: 'team-gratitude-wall',
    title: 'Team Gratitude Wall',
    description: 'Strengthen group morale through appreciation messages',
    gameIndex: 74,
    calmCoins: getCalmCoinsForGame(74),  // 5 CalmCoins
    replayCost: getReplayCostForGame(74), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/team-gratitude-wall',
    icon: '💙',
    color: 'from-pink-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Set a real gratitude wall for end-of-month morale boosts.'
  },
  {
    id: 'teacher-education-75',
    slug: 'listening-partner-practice',
    title: 'Listening Partner Practice',
    description: 'Develop active listening through peer conversations',
    gameIndex: 75,
    calmCoins: getCalmCoinsForGame(75),  // 5 CalmCoins
    replayCost: getReplayCostForGame(75), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/listening-partner-practice',
    icon: '👂',
    color: 'from-blue-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Pair teachers randomly every week for 5-min listening rounds.'
  },
  {
    id: 'teacher-education-76',
    slug: 'encourage-a-colleague-challenge',
    title: 'Encourage-a-Colleague Challenge',
    description: 'Promote verbal appreciation in the workplace',
    gameIndex: 76,
    calmCoins: getCalmCoinsForGame(76),  // 5 CalmCoins
    replayCost: getReplayCostForGame(76), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/encourage-a-colleague-challenge',
    icon: '💙',
    color: 'from-pink-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Build this habit till it becomes daily culture.'
  },
  {
    id: 'teacher-education-77',
    slug: 'mentor-memory-journal',
    title: 'Mentor Memory Journal',
    description: 'Recall moments of being mentored or mentoring others',
    gameIndex: 77,
    calmCoins: getCalmCoinsForGame(77),  // 5 CalmCoins
    replayCost: getReplayCostForGame(77), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/mentor-memory-journal',
    icon: '📖',
    color: 'from-indigo-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Encourage sharing one mentor story per staff meeting.'
  },
  {
    id: 'teacher-education-78',
    slug: 'staffroom-connection-map',
    title: 'Staffroom Connection Map',
    description: 'Visualize support relationships in the workplace',
    gameIndex: 78,
    calmCoins: getCalmCoinsForGame(78),  // 5 CalmCoins
    replayCost: getReplayCostForGame(78), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/staffroom-connection-map',
    icon: '🗺️',
    color: 'from-blue-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Use map to identify isolated colleagues and support them.'
  },
  {
    id: 'teacher-education-79',
    slug: 'team-harmony-simulation',
    title: 'Team Harmony Simulation',
    description: 'Balance opinions, workload, and empathy in team meetings',
    gameIndex: 79,
    calmCoins: getCalmCoinsForGame(79),  // 5 CalmCoins
    replayCost: getReplayCostForGame(79), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/team-harmony-simulation',
    icon: '🤝',
    color: 'from-blue-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Model this in department heads\' meetings for consistency.'
  },
  {
    id: 'teacher-education-80',
    slug: 'connected-teacher-badge',
    title: 'Connected Teacher Badge',
    description: 'Recognize teachers who nurture healthy community culture',
    gameIndex: 80,
    calmCoins: getCalmCoinsForGame(80),  // 10 CalmCoins
    replayCost: getReplayCostForGame(80), // 0 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/connected-teacher-badge',
    icon: '🤝',
    color: 'from-pink-500 to-purple-500',
    category: 'Support',
    isBadgeGame: true,
    teacherTip: 'Display badge earners as peer-support ambassadors.'
  },
  {
    id: 'teacher-education-81',
    slug: 'why-i-teach',
    title: 'Why I Teach',
    description: 'Reconnect with the original reason for becoming a teacher',
    gameIndex: 81,
    calmCoins: getCalmCoinsForGame(81),  // 5 CalmCoins
    replayCost: getReplayCostForGame(81), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/why-i-teach',
    icon: '💡',
    color: 'from-purple-500 to-indigo-500',
    category: 'Support',
    teacherTip: 'Print and place "Why I Teach" notes on a shared wall to inspire others.'
  },
  {
    id: 'teacher-education-82',
    slug: 'the-ripple-effect',
    title: 'The Ripple Effect',
    description: 'Realize the long-term impact teachers have on students\' lives',
    gameIndex: 82,
    calmCoins: getCalmCoinsForGame(82),  // 5 CalmCoins
    replayCost: getReplayCostForGame(82), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-ripple-effect',
    icon: '🌊',
    color: 'from-blue-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Share real success stories during monthly staff circles.'
  },
  {
    id: 'teacher-education-83',
    slug: 'legacy-ladder',
    title: 'Legacy Ladder',
    description: 'Visualize one\'s growth beyond daily struggles',
    gameIndex: 83,
    calmCoins: getCalmCoinsForGame(83),  // 5 CalmCoins
    replayCost: getReplayCostForGame(83), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/legacy-ladder',
    icon: '🪜',
    color: 'from-purple-500 to-pink-500',
    category: 'Support',
    teacherTip: 'Encourage teachers to celebrate personal evolution, not just outcomes.'
  },
  {
    id: 'teacher-education-84',
    slug: 'life-map-puzzle',
    title: 'Life Map Puzzle',
    description: 'Identify personal values aligning with the teaching journey',
    gameIndex: 84,
    calmCoins: getCalmCoinsForGame(84),  // 5 CalmCoins
    replayCost: getReplayCostForGame(84), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/life-map-puzzle',
    icon: '🗺️',
    color: 'from-indigo-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Ask staff to share 1 core value in morning assembly.'
  },
  {
    id: 'teacher-education-85',
    slug: 'meaning-in-the-moment',
    title: 'Meaning in the Moment',
    description: 'Practice finding purpose in ordinary classroom moments',
    gameIndex: 85,
    calmCoins: getCalmCoinsForGame(85),  // 5 CalmCoins
    replayCost: getReplayCostForGame(85), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/meaning-in-the-moment',
    icon: '💡',
    color: 'from-purple-500 to-pink-500',
    category: 'Support',
    teacherTip: 'Pause daily to name one purposeful act before leaving school.'
  },
  {
    id: 'teacher-education-86',
    slug: 'fulfillment-journal',
    title: 'Fulfillment Journal',
    description: 'Reflect on the week\'s most meaningful teaching experience',
    gameIndex: 86,
    calmCoins: getCalmCoinsForGame(86),  // 5 CalmCoins
    replayCost: getReplayCostForGame(86), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/fulfillment-journal',
    icon: '📔',
    color: 'from-purple-500 to-indigo-500',
    category: 'Support',
    teacherTip: 'Use journal reflections for end-of-year gratitude portfolios.'
  },
  {
    id: 'teacher-education-87',
    slug: 'impact-visualization',
    title: 'Impact Visualization',
    description: 'Visualize future student success inspired by your teaching',
    gameIndex: 87,
    calmCoins: getCalmCoinsForGame(87),  // 5 CalmCoins
    replayCost: getReplayCostForGame(87), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/impact-visualization',
    icon: '✨',
    color: 'from-purple-500 to-pink-500',
    category: 'Support',
    teacherTip: 'Repeat before exams or reviews to remember the deeper "why."'
  },
  {
    id: 'teacher-education-88',
    slug: 'mentor-gratitude-challenge',
    title: 'Mentor Gratitude Challenge',
    description: 'Express gratitude toward a mentor or student who inspired growth',
    gameIndex: 88,
    calmCoins: getCalmCoinsForGame(88),  // 5 CalmCoins
    replayCost: getReplayCostForGame(88), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/mentor-gratitude-challenge',
    icon: '💌',
    color: 'from-pink-500 to-rose-500',
    category: 'Support',
    teacherTip: 'Encourage every teacher to complete one gratitude message per term.'
  },
  {
    id: 'teacher-education-89',
    slug: 'inner-alignment-quiz',
    title: 'Inner Alignment Quiz',
    description: 'Check whether daily actions align with core values and goals',
    gameIndex: 89,
    calmCoins: getCalmCoinsForGame(89),  // 5 CalmCoins
    replayCost: getReplayCostForGame(89), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/inner-alignment-quiz',
    icon: '🎯',
    color: 'from-purple-500 to-indigo-500',
    category: 'Support',
    teacherTip: 'Discuss results with mentors during review sessions.'
  },
  {
    id: 'teacher-education-90',
    slug: 'purposeful-teacher-badge',
    title: 'Purposeful Teacher Badge',
    description: 'Reward teachers who sustain joy, gratitude, and meaning in their work',
    gameIndex: 90,
    calmCoins: getCalmCoinsForGame(90),  // 5 CalmCoins
    replayCost: getReplayCostForGame(90), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/purposeful-teacher-badge',
    icon: '✨',
    color: 'from-purple-500 to-pink-500',
    category: 'Support',
    isBadgeGame: true,
    teacherTip: 'Showcase Purpose Badge earners during Teacher Appreciation Week.'
  },
  {
    id: 'teacher-education-91',
    slug: 'screen-time-mirror',
    title: 'Screen-Time Mirror',
    description: 'Become aware of how much daily digital exposure affects focus and rest',
    gameIndex: 91,
    calmCoins: getCalmCoinsForGame(91),  // 5 CalmCoins
    replayCost: getReplayCostForGame(91), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/screen-time-mirror',
    icon: '📱',
    color: 'from-blue-500 to-indigo-500',
    category: 'Support',
    teacherTip: 'Review chart every Sunday and set one small reduction goal.'
  },
  {
    id: 'teacher-education-92',
    slug: 'digital-boundaries-quiz',
    title: 'Digital Boundaries Quiz',
    description: 'Learn healthy screen limits for personal and professional life',
    gameIndex: 92,
    calmCoins: getCalmCoinsForGame(92),  // 5 CalmCoins
    replayCost: getReplayCostForGame(92), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/digital-boundaries-quiz',
    icon: '🛡️',
    color: 'from-indigo-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Add "no-email zones" in staff policy for collective rest.'
  },
  {
    id: 'teacher-education-93',
    slug: 'evening-log-off-ritual',
    title: 'Evening Log-Off Ritual',
    description: 'Create a calm nightly transition away from screens',
    gameIndex: 93,
    calmCoins: getCalmCoinsForGame(93),  // 5 CalmCoins
    replayCost: getReplayCostForGame(93), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/evening-log-off-ritual',
    icon: '🌙',
    color: 'from-indigo-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Keep phone outside bedroom; use analogue alarm.'
  },
  {
    id: 'teacher-education-94',
    slug: 'social-media-reflection',
    title: 'Social-Media Reflection',
    description: 'Observe emotional patterns after social-media scrolling',
    gameIndex: 94,
    calmCoins: getCalmCoinsForGame(94),  // 5 CalmCoins
    replayCost: getReplayCostForGame(94), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/social-media-reflection',
    icon: '📱',
    color: 'from-pink-500 to-rose-500',
    category: 'Support',
    teacherTip: 'Replace 10 min scrolling with mindful breathing break.'
  },
  {
    id: 'teacher-education-95',
    slug: 'morning-nourish-routine',
    title: 'Morning Nourish Routine',
    description: 'Start each day with mindful self-care before digital check-ins',
    gameIndex: 95,
    calmCoins: getCalmCoinsForGame(95),  // 5 CalmCoins
    replayCost: getReplayCostForGame(95), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/morning-nourish-routine',
    icon: '🌅',
    color: 'from-orange-500 to-yellow-500',
    category: 'Support',
    teacherTip: 'Share "#MorningNourish" updates in staff wellness chat weekly.'
  },
  {
    id: 'teacher-education-96',
    slug: 'nature-reconnect-challenge',
    title: 'Nature Reconnect Challenge',
    description: 'Reduce digital fatigue by engaging with nature',
    gameIndex: 96,
    calmCoins: getCalmCoinsForGame(96),  // 5 CalmCoins
    replayCost: getReplayCostForGame(96), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/nature-reconnect-challenge',
    icon: '🌿',
    color: 'from-green-500 to-emerald-500',
    category: 'Support',
    teacherTip: 'Plan monthly "Nature Walk & Talk" meet-ups.'
  },
  {
    id: 'teacher-education-97',
    slug: 'self-care-inventory',
    title: 'Self-Care Inventory',
    description: 'Assess and balance physical, emotional, social, and spiritual care',
    gameIndex: 97,
    calmCoins: getCalmCoinsForGame(97),  // 5 CalmCoins
    replayCost: getReplayCostForGame(97), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/self-care-inventory',
    icon: '📊',
    color: 'from-indigo-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Focus on weakest category for the next week.'
  },
  {
    id: 'teacher-education-98',
    slug: 'rest-recovery-plan',
    title: 'Rest & Recovery Plan',
    description: 'Schedule deliberate rest periods to prevent exhaustion',
    gameIndex: 98,
    calmCoins: getCalmCoinsForGame(98),  // 5 CalmCoins
    replayCost: getReplayCostForGame(98), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/rest-recovery-plan',
    icon: '📅',
    color: 'from-indigo-500 to-purple-500',
    category: 'Support',
    teacherTip: 'Honour rest appointments as strictly as meetings.'
  },
  {
    id: 'teacher-education-99',
    slug: 'silence-stillness-practice',
    title: 'Silence & Stillness Practice',
    description: 'Train mind to enjoy moments without digital input',
    gameIndex: 99,
    calmCoins: getCalmCoinsForGame(99),  // 5 CalmCoins
    replayCost: getReplayCostForGame(99), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/silence-stillness-practice',
    icon: '🤫',
    color: 'from-purple-500 to-indigo-500',
    category: 'Support',
    teacherTip: 'Introduce "Silent Minute" between classes for all staff.'
  },
  {
    id: 'teacher-education-100',
    slug: 'self-care-champion-badge',
    title: 'Self-Care Champion Badge',
    description: 'Honour teachers who maintain consistent self-care and digital balance',
    gameIndex: 100,
    calmCoins: getCalmCoinsForGame(100),  // 20 CalmCoins
    replayCost: getReplayCostForGame(100), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/self-care-champion-badge',
    icon: '🏆',
    color: 'from-amber-500 to-yellow-500',
    category: 'Support',
    isBadgeGame: true,
    teacherTip: 'Celebrate Self-Care Champions publicly each term to normalize rest culture.'
  },
  // More games will be added here later
];

/**
 * Get game data by ID
 */
export const getTeacherEducationGameById = (gameId) => {
  return teacherEducationGameData.find(game => game.id === gameId) || null;
};

/**
 * Get all teacher education games
 */
export const getAllTeacherEducationGames = () => {
  return teacherEducationGameData;
};
