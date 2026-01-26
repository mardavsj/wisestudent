import { Coins, Wallet, Target, Banknote, Shield, Scale, Lock, CreditCard, BarChart3, Landmark, Award, CheckCircle, FileText, Briefcase, Check } from "lucide-react";
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
    {
      id: "finance-adults-3",
      title: "Needs vs Wants - Daily Choices",
      description:
        "Distinguish between needs and wants to protect your monthly budget.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/needs-vs-wants",
      index: 2,
      scenario: {
        setup:
          "Scenario: You need to prioritize spending. Distinguishing needs from wants protects your monthly budget.",
        choices: [
          {
            label: "Select the need, not the want: Rent / Food",
            outcome: "Prioritizing needs protects your monthly budget.",
          },
          {
            label: "Choose a want over a need",
            outcome: "Prioritizing wants over needs can strain your finances.",
          },
        ],
        reflections: [
          "How can distinguishing needs from wants protect your monthly budget?",
          "What strategies will help you prioritize spending on necessities first?",
        ],
        skill: "Prioritizing needs over wants",
      },
    },
    {
      id: "finance-adults-4",
      title: "Fixed vs Variable Expenses",
      description:
        "Learn to distinguish between fixed and variable expenses to plan your budget safely.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/fixed-vs-variable-expenses",
      index: 3,
      scenario: {
        setup:
          "Scenario: Understanding fixed vs variable expenses helps you plan safely.",
        choices: [
          {
            label: "Match correctly: House rent → Fixed expense",
            outcome: "Knowing fixed expenses helps you plan safely.",
          },
          {
            label: "Eating out → Variable expense",
            outcome: "Variable expenses can be adjusted based on your budget.",
          },
        ],
        reflections: [
          "How does knowing fixed expenses help you plan safely?",
          "What strategies will help you manage variable expenses effectively?",
        ],
        skill: "Understanding fixed vs variable expenses",
      },
    },
    {
      id: "finance-adults-5",
      title: "Salary Day Decision",
      description:
        "Learn to plan your salary allocation to reduce the need for borrowing later.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/salary-day-decision",
      index: 4,
      scenario: {
        setup:
          "Scenario: Planning your salary allocation reduces the need for borrowing later.",
        choices: [
          {
            label: "Plan expenses and set aside savings",
            outcome: "Planning first reduces the need for borrowing later.",
          },
          {
            label: "Spend freely without planning",
            outcome: "Spending without planning can lead to financial difficulties.",
          },
        ],
        reflections: [
          "How does planning your salary allocation reduce the need for borrowing later?",
          "What strategies will help you implement the 'pay yourself first' approach?",
        ],
        skill: "Salary planning and borrowing prevention",
      },
    },
    {
      id: "finance-adults-6",
      title: "Spending Adjustment Test",
      description:
        "Learn to adjust spending before resorting to borrowing when facing small financial gaps.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/spending-adjustment-test",
      index: 5,
      scenario: {
        setup:
          "Scenario: When expenses increase slightly, adjusting spending should come before borrowing.",
        choices: [
          {
            label: "Reduce or adjust spending",
            outcome: "Borrowing should never be the first response to small gaps.",
          },
          {
            label: "Take a loan",
            outcome: "Borrowing for small gaps creates unnecessary debt.",
          },
        ],
        reflections: [
          "Why should borrowing never be the first response to small financial gaps?",
          "How can adjusting spending help maintain financial stability?",
        ],
        skill: "Spending adjustment and borrowing avoidance",
      },
    },
    {
      id: "finance-adults-7",
      title: "Tracking Money Habits",
      description:
        "Learn to track your daily spending to reveal hidden money leaks.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/tracking-money-habits",
      index: 6,
      scenario: {
        setup:
          "Scenario: Tracking spending reveals hidden money leaks.",
        choices: [
          {
            label: "Track daily spending",
            outcome: "Tracking spending reveals hidden money leaks.",
          },
          {
            label: "Ignore expenses",
            outcome: "Ignoring expenses means missing opportunities to save.",
          },
        ],
        reflections: [
          "How does tracking spending reveal hidden money leaks?",
          "What strategies will help you maintain consistent expense tracking?",
        ],
        skill: "Expense tracking and leak identification",
      },
    },
    {
      id: "finance-adults-8",
      title: "Savings vs Borrowing",
      description:
        "Learn to use savings instead of borrowing for emergencies to reduce dependence on credit.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/savings-vs-borrowing",
      index: 7,
      scenario: {
        setup:
          "Scenario: Using savings instead of borrowing reduces dependence on credit.",
        choices: [
          {
            label: "Use savings if available",
            outcome: "Savings reduce dependence on credit.",
          },
          {
            label: "Borrow immediately",
            outcome: "Borrowing creates unnecessary debt for small emergencies.",
          },
        ],
        reflections: [
          "How does using savings instead of borrowing reduce dependence on credit?",
          "What strategies will help you maintain adequate emergency savings?",
        ],
        skill: "Savings over borrowing preference",
      },
    },
    {
      id: "finance-adults-9",
      title: "Monthly Budget Balance",
      description:
        "Learn to balance expenses within fixed income to prevent debt cycles.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/monthly-budget-balance",
      index: 8,
      scenario: {
        setup:
          "Scenario: Balancing expenses within fixed income prevents debt cycles.",
        choices: [
          {
            label: "Balance expenses within income",
            outcome: "Balanced budgets prevent debt cycles.",
          },
          {
            label: "Increase spending",
            outcome: "Increasing spending beyond fixed income creates debt risk.",
          },
        ],
        reflections: [
          "How does balancing expenses within income prevent debt cycles?",
          "What strategies will help you maintain a balanced budget with fixed income?",
        ],
        skill: "Balanced budgeting and debt prevention",
      },
    },
    {
      id: "finance-adults-10",
      title: "Financial Discipline Checkpoint",
      description:
        "Complete 7 correct financial decisions to demonstrate basic money discipline.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "10 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/financial-discipline-checkpoint",
      index: 9,
      scenario: {
        setup:
          "Complete 7 correct financial decisions to demonstrate basic money discipline.",
        choices: [
          {
            label: "Complete 7 correct decisions",
            outcome: "You now understand basic money discipline and are ready to learn about banking and credit.",
          },
          {
            label: "Make fewer than 7 correct decisions",
            outcome: "Continue practicing financial discipline.",
          },
        ],
        reflections: [
          "How do these financial decisions demonstrate discipline?",
          "What habits will help you maintain financial discipline going forward?",
        ],
        skill: "Basic financial discipline",
      },
    },
    {
      id: "finance-adults-11",
      title: "Why a Bank Account Matters",
      description:
        "Learn about the importance of bank accounts for securing your income and accessing formal financial services.",
      icon: <Banknote className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/why-a-bank-account-matters",
      index: 10,
      scenario: {
        setup:
          "Learn about the importance of bank accounts for securing your income and accessing formal financial services.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Bank accounts protect money and enable access to formal services.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking benefits.",
          },
        ],
        reflections: [
          "How do bank accounts protect money from theft or loss?",
          "What formal financial services become accessible through banking?",
        ],
        skill: "Banking security and services",
      },
    },
    {
      id: "finance-adults-12",
      title: "KYC Basics",
      description:
        "Learn about Know Your Customer (KYC) procedures and why banks require identity verification.",
      icon: <Shield className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/kyc-basics",
      index: 11,
      scenario: {
        setup:
          "Learn about Know Your Customer (KYC) procedures and why banks require identity verification.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "KYC helps protect both you and the financial system.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about KYC procedures.",
          },
        ],
        reflections: [
          "How does KYC protect both you and the financial system?",
          "What documents should you keep ready for banking procedures?",
        ],
        skill: "KYC procedures and identity verification",
      },
    },
    {
      id: "finance-adults-13",
      title: "Formal vs Informal Finance",
      description:
        "Learn about the differences between formal and informal financial services and why formal finance is safer.",
      icon: <Scale className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/formal-vs-informal-finance",
      index: 12,
      scenario: {
        setup:
          "Learn about the differences between formal and informal financial services and why formal finance is safer.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Formal finance follows rules; informal lending often carries hidden risks.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about formal vs informal finance.",
          },
        ],
        reflections: [
          "How do regulations protect consumers in formal finance?",
          "What risks should you consider with informal lending?",
        ],
        skill: "Understanding of formal vs informal finance",
      },
    },
    {
      id: "finance-adults-14",
      title: "Digital Payments Safety",
      description:
        "Learn about safe practices when using digital payment methods like UPI and protecting your financial information.",
      icon: <Lock className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/digital-payments-safety",
      index: 13,
      scenario: {
        setup:
          "Learn about safe practices when using digital payment methods like UPI and protecting your financial information.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "OTPs protect your money. Sharing them enables fraud.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about digital payment safety.",
          },
        ],
        reflections: [
          "Why is it important to keep OTPs and PINs private?",
          "What steps should you take to protect your digital payments?",
        ],
        skill: "Digital payment safety awareness",
      },
    },
    {
      id: "finance-adults-15",
      title: "Multiple Accounts Confusion",
      description:
        "Learn about the importance of simplifying your banking by managing fewer accounts effectively.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/multiple-accounts-confusion",
      index: 14,
      scenario: {
        setup:
          "Learn about the importance of simplifying your banking by managing fewer accounts effectively.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Simpler banking improves control and reduces errors.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking simplification.",
          },
        ],
        reflections: [
          "How does simplifying your banking accounts improve financial control?",
          "What are the risks of maintaining multiple unused accounts?",
        ],
        skill: "Banking simplification awareness",
      },
    },
    {
      id: "finance-adults-16",
      title: "Digital Wallet vs Bank Account",
      description:
        "Learn about the differences between digital wallets and bank accounts for various financial needs.",
      icon: <CreditCard className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/digital-wallet-vs-bank-account",
      index: 15,
      scenario: {
        setup:
          "Learn about the differences between digital wallets and bank accounts for various financial needs.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Wallets are for spending; banks are for storing money safely.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about financial tools.",
          },
        ],
        reflections: [
          "How do digital wallets and bank accounts serve different financial needs?",
          "Why is it important to use the right tool for savings versus spending?",
        ],
        skill: "Understanding of financial tools",
      },
    },
    {
      id: "finance-adults-17",
      title: "Safe Use of Banking Apps",
      description:
        "Learn about the safe practices for using banking apps and protecting your financial information.",
      icon: <Shield className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/safe-use-of-banking-apps",
      index: 16,
      scenario: {
        setup:
          "Learn about the safe practices for using banking apps and protecting your financial information.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Official apps reduce risk of data theft.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking app security.",
          },
        ],
        reflections: [
          "How can you verify that a banking app is legitimate?",
          "What additional security measures should you implement?",
        ],
        skill: "Banking app security awareness",
      },
    },
    {
      id: "finance-adults-18",
      title: "Cash vs Digital Records",
      description:
        "Learn about the benefits of digital transactions and how records help with budgeting and credit eligibility.",
      icon: <BarChart3 className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-18"] || false,
     isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/cash-vs-digital-records",
      index: 17,
      scenario: {
        setup:
          "Learn about the benefits of digital transactions and how records help with budgeting and credit eligibility.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Records help with budgeting and future credit eligibility.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about digital transaction benefits.",
          },
        ],
        reflections: [
          "How do digital records contribute to better financial planning?",
          "What other benefits do digital transactions offer beyond record-keeping?",
        ],
        skill: "Understanding of digital transaction benefits",
      },
    },
    {
      id: "finance-adults-19",
      title: "Trusting the System",
      description:
        "Learn about the safety and regulation of banking systems and why regulated institutions are safer than informal storage.",
      icon: <Landmark className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/trusting-the-system",
      index: 18,
      scenario: {
        setup:
          "Learn about the safety and regulation of banking systems and why regulated institutions are safer than informal storage.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Regulated institutions are safer than informal storage.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking regulation.",
          },
        ],
        reflections: [
          "How do regulations protect your money in banks?",
          "What should you look for when choosing a financial institution?",
        ],
        skill: "Understanding of banking regulation",
      },
    },
    {
      id: "finance-adults-20",
      title: "Banking Readiness Checkpoint",
      description:
        "Complete 7 correct banking and digital finance decisions to demonstrate readiness for credit and loans.",
      icon: <Award className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "10 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/banking-readiness-checkpoint",
      index: 19,
      scenario: {
        setup:
          "Complete 7 correct banking and digital finance decisions to demonstrate readiness for credit and loans.",
        choices: [
          {
            label: "Complete 7 correct decisions",
            outcome: "You are now ready to understand credit and loans responsibly.",
          },
          {
            label: "Make fewer than 7 correct decisions",
            outcome: "Continue practicing banking fundamentals.",
          },
        ],
        reflections: [
          "How do these banking decisions prepare you for credit and loans?",
          "What habits will help you maintain financial discipline going forward?",
        ],
        skill: "Banking readiness",
      },
    },
    {
      id: "finance-adults-21",
      title: "What Is Credit?",
      description:
        "Learn the fundamental concept of credit and understand when credit is helpful versus harmful.",
      icon: <CreditCard className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/what-is-credit",
      index: 20,
      scenario: {
        setup:
          "Learn the fundamental concept of credit and understand when credit is helpful versus harmful.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Credit helps only when repayment is planned.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about credit fundamentals.",
          },
        ],
        reflections: [
          "How can credit be used as a financial tool rather than a burden?",
          "What steps can you take to build good credit habits?",
        ],
        skill: "Credit fundamentals",
      },
    },
    {
      id: "finance-adults-22",
      title: "When Credit Is Useful",
      description:
        "Learn when borrowing is reasonable and how to evaluate credit decisions that support financial stability.",
      icon: <CheckCircle className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/when-credit-is-useful",
      index: 21,
      scenario: {
        setup:
          "Learn when borrowing is reasonable and how to evaluate credit decisions that support financial stability.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Credit should support stability, not habits.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about responsible borrowing.",
          },
        ],
        reflections: [
          "How can you distinguish between needs and wants when considering credit?",
          "What criteria should you use to evaluate borrowing decisions?",
        ],
        skill: "Responsible borrowing evaluation",
      },
    },
    {
      id: "finance-adults-23",
      title: "Types of Loans",
      description:
        "Learn to distinguish between formal and informal lending options and understand regulated pricing benefits.",
      icon: <FileText className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/types-of-loans",
      index: 22,
      scenario: {
        setup:
          "Learn to distinguish between formal and informal lending options and understand regulated pricing benefits.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Formal loans follow regulated pricing.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about loan types and protections.",
          },
        ],
        reflections: [
          "How can you identify formal vs informal lending opportunities?",
          "What factors should you consider when evaluating loan options?",
        ],
        skill: "Loan type comparison",
      },
    },
    {
      id: "finance-adults-24",
      title: "Personal vs Business Loan",
      description:
        "Learn to distinguish between personal and business loans and understand proper financing selection for business needs.",
      icon: <Briefcase className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/personal-vs-business-loan",
      index: 23,
      scenario: {
        setup:
          "Learn to distinguish between personal and business loans and understand proper financing selection for business needs.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Matching loan type to purpose reduces risk.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about business financing options.",
          },
        ],
        reflections: [
          "How can proper loan type selection impact your business financing costs?",
          "What factors should guide your decision between personal and business financing?",
        ],
        skill: "Business financing selection",
      },
    },
    {
      id: "finance-adults-25",
      title: "Credit Eligibility Basics",
      description:
        "Learn the fundamental factors that improve loan eligibility and how financial discipline opens access to formal credit.",
      icon: <Check className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-eligibility-basics",
      index: 24,
      scenario: {
        setup:
          "Learn the fundamental factors that improve loan eligibility and how financial discipline opens access to formal credit.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Discipline improves access to formal credit.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about credit eligibility factors.",
          },
        ],
        reflections: [
          "How can you build a strong repayment history over time?",
          "What daily financial habits support long-term credit eligibility?",
        ],
        skill: "Credit eligibility fundamentals",
      },
    },
  ];

  return financeAdultGames;
};
