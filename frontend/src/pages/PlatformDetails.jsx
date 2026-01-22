import React, { useState, useEffect } from "react";
import MainNavbar from "../components/MainNavbar";
import MainFooter from "../components/MainFooter";
import InstallPWA from "../components/InstallPWA";

const heroHighlights = [
  "Build life skills, confidence, and readiness for the real world — step by step.",
  "Designed to work alongside your regular school classes without stress.",
  "Focuses on values, emotional resilience, financial awareness, and civic readiness.",
];

const studentGuide = [
  {
    title: "What is WiseStudent?",
    items: [
      "A life-skills learning space that works alongside regular school education.",
      "It helps you develop confidence, responsibility, and real-world understanding — not just academic knowledge.",
      "WiseStudent is about preparing you for life, not just exams.",
    ],
  },
  {
    title: "What will I do on WiseStudent?",
    items: [
      "Take part in short activities, challenges, and missions based on real-life situations.",
      "Think independently, reflect on choices, and learn practical skills you can use every day.",
      "Learning feels engaging and meaningful — not like extra homework.",
    ],
  },
  {
    title: "What will I learn?",
    items: [
      "Handling money wisely and building basic financial habits.",
      "Managing stress and emotions in a healthy way.",
      "Using technology safely and responsibly.",
      "Working with others, communicating clearly, and leading teams.",
      "Taking care of health, hygiene, and well-being.",
      "Planning future careers and long-term goals.",
      "Understanding your role in society and the environment.",
    ],
  },
  {
    title: "How much time will it take?",
    items: [
      "Only a few minutes each week.",
      "Learn at your own pace without disrupting schoolwork, tuition, or rest time.",
      "Consistency matters more than speed.",
    ],
  },
  {
    title: "Is WiseStudent safe?",
    items: [
      "Structured public sharing keeps focus on growth, not exposure.",
      "Healthy rankings and recognition motivate effort without pressure.",
      "Positive competition encourages teamwork and progress.",
      "Age-appropriate design keeps content and interactions responsible.",
      "Clear boundaries avoid unmoderated social behaviour.",
      "The focus remains on dignity, encouragement, and growth.",
    ],
  },
  {
    title: "Why take WiseStudent seriously?",
    items: [
      "Make better decisions every day.",
      "Feel confident about yourself.",
      "Handle challenges calmly and responsibly.",
      "Communicate and work better with others.",
      "Prepare for life beyond exams and classrooms.",
      "Grow not just as a student, but as a person.",
    ],
  },
];

const parentGuide = [
  {
    title: "What is WiseStudent? (Parent Help Guide)",
    items: [
      "A life-skills program that supports your child's growth beyond academics.",
      "Works alongside school education to develop confidence, responsibility, and understanding.",
      "Focuses on who your child becomes, not just what they score.",
    ],
  },
  {
    title: "How does my child use WiseStudent?",
    items: [
      "Short, guided activities and challenges based on real-life situations.",
      "Feels more like reflection than homework: no exams, marks, or academic pressure.",
      "Fits naturally into daily routines.",
    ],
  },
  {
    title: "What does my child learn?",
    items: [
      "Understanding money and healthy financial habits.",
      "Managing emotions and stress in a balanced way.",
      "Respect, values, and responsible behaviour.",
      "Safe, ethical, and healthy use of technology.",
      "Health, hygiene, and self-care practices.",
      "Teamwork, leadership, and future planning.",
      "Environmental responsibility and citizenship.",
    ],
  },
  {
    title: "Is WiseStudent safe for my child?",
    items: [
      "Structured public sharing keeps achievements positive and private.",
      "Healthy recognition and rankings motivate consistency, not comparison anxiety.",
      "Age-appropriate design for every maturity level.",
      "Positive competition that focuses on learning, teamwork, and self-improvement.",
      "Clear boundaries and oversight to keep interactions learning-focused.",
      "Confidence, dignity, and well-being stay at the centre.",
    ],
  },
  {
    title: "How much time does it take?",
    items: [
      "Only a few minutes each week.",
      "Supports learning without affecting schoolwork, tuition, or rest time.",
      "Consistency matters more than total minutes.",
    ],
  },
  {
    title: "What can parents see?",
    items: [
      "Participation.",
      "Consistency.",
      "Overall learning progress.",
      "Simple updates keep you informed without needing constant supervision.",
    ],
  },
  {
    title: "Does this replace school education?",
    items: [
      "No. WiseStudent complements school learning.",
      "Teaches life skills beyond what textbooks or exams cover.",
    ],
  },
  {
    title: "Who runs WiseStudent?",
    items: [
      "Developed by an education-focused team partnered with schools and institutions.",
      "Implemented through schools, CSR/foundation programs, and trusted partners.",
    ],
  },
  {
    title: "How does this help long term?",
    items: [
      "Confident decision-makers.",
      "Emotionally balanced individuals.",
      "Responsible digital citizens.",
      "Respectful, value-driven adults.",
    ],
  },
];

const schoolGuide = [
  {
    title: "Building Life-Ready Students Without Academic Burden",
    items: [
      "Complements academic education and strengthens holistic development.",
      "Develops confident, responsible, well-rounded learners while teachers focus on academics.",
      "Designed to add value, not workload.",
    ],
  },
  {
    title: "How is WiseStudent used in schools?",
    items: [
      "Low-time, low-burden program with short structured activities.",
      "Fits within school routines without disrupting timetables.",
      "No additional exams, grading, or teacher-led assessments.",
    ],
  },
  {
    title: "What outcomes does WiseStudent support?",
    items: [
      "Student well-being and emotional balance.",
      "Financial and digital awareness.",
      "Values, discipline, and civic sense.",
      "Leadership, teamwork, and responsibility.",
      "Better classroom focus and healthier behaviour.",
      "Stronger parent confidence and school environment.",
    ],
  },
  {
    title: "What visibility do schools get?",
    items: [
      "Participation and engagement summaries across classes or grades.",
      "Life-skills development indicators aligned with holistic education goals.",
      "Consolidated reports that support internal reviews, parent communication, and school documentation.",
      "Supports NEP 2020's emphasis on holistic, competency-based education including life skills, values, financial literacy, digital literacy, student well-being, and responsible citizenship.",
      "All insights presented simply to demonstrate holistic development efforts and showcase innovation.",
      "No new exams, grading, or reporting burdens — works quietly in the background.",
    ],
  },
  {
    title: "Does WiseStudent replace any subject?",
    items: [
      "No. Works alongside existing curricula.",
      "Strengthens areas textbooks and exams do not fully address.",
    ],
  },
  {
    title: "Is WiseStudent scalable?",
    items: [
      "Built for scale and consistency across individual schools, chains, and districts.",
      "Suitable for independent institutions and large systems.",
    ],
  },
  {
    title: "Why schools choose WiseStudent",
    items: [
      "Enhances holistic education without disrupting academics.",
      "Supports NEP-aligned outcomes in a practical way.",
      "Strengthens parent trust and reputation.",
      "Requires minimal operational effort and demonstrates future-ready leadership.",
    ],
  },
];

const csrGuide = [
  {
    title: "Structured, Scalable Impact in Education & Student Well-Being",
    items: [
      "Enables CSR partners to deliver measurable, scalable, responsible impact.",
      "Complements school education while offering clear visibility and reporting.",
      "Designed for long-term human development, not short-term interventions.",
    ],
  },
  {
    title: "How is WiseStudent deployed through CSR?",
    items: [
      "Flexible deployment via partner schools, foundations, and community initiatives.",
      "Supports bulk onboarding with minimal operational burden.",
      "Makes large-scale regional rollouts efficient.",
    ],
  },
  {
    title: "What impact does WiseStudent create?",
    items: [
      "Financial literacy: Helping students develop responsible money habits and basic financial awareness.",
      "Mental well-being: Supporting emotional resilience, self-awareness, and healthy coping skills.",
      "Digital safety: Promoting safe, ethical, and responsible use of technology.",
      "Values and responsible citizenship: Encouraging empathy, integrity, and civic responsibility.",
      "Career and future readiness: Building confidence, goal awareness, and decision-making skills.",
      "These outcomes contribute to long-term social development and align with education-focused CSR objectives.",
    ],
  },
  {
    title: "How is impact tracked?",
    items: [
      "Aggregated, non-personal insights on participation levels across schools or cohorts.",
      "Completion and consistency trends over time.",
      "Engagement patterns at a program level.",
      "Reporting is non-intrusive, privacy-conscious, and audit-friendly.",
      "Supports CSR documentation and disclosures while keeping student data safe.",
      "Demonstrates program reach, engagement, and continuity without exposing individual student data.",
    ],
  },
  {
    title: "Is WiseStudent suitable for diverse regions?",
    items: [
      "Effective across urban, semi-urban, and varied socio-economic contexts.",
      "Delivers consistent quality yet remains adaptable locally.",
    ],
  },
  {
    title: "Why CSR partners choose WiseStudent",
    items: [
      "Structured, scalable education impact.",
      "Supports long-term well-being and societal goals.",
      "Enables privacy-first reporting and reduces complexity.",
    ],
  },
];

const adultGuide = [
  {
    title: "WiseStudent for Young Adults & Adults (CSR Programs)",
    items: [
      "Supports financial well-being, resilience, and mental health for youth and adults.",
      "Focuses on practical financial literacy, stress awareness, and respectful learning.",
      "Suitable for college students, early-career youth, community groups, employees, first-time earners, and gig workers.",
      "Designed for employee-family and community outreach initiatives.",
    ],
  },
  {
    title: "Financial Literacy & Financial Well-Being",
    items: [
      "Managing income and expenses with practical understanding.",
      "Saving habits and basic budgeting skills.",
      "Understanding digital payments and financial safety.",
      "Responsible borrowing and debt awareness.",
      "Long-term financial planning basics focused on everyday decisions, not complex finance.",
    ],
  },
  {
    title: "Mental Well-Being & Emotional Resilience",
    items: [
      "Stress awareness and healthy coping strategies.",
      "Emotional self-regulation and resilience building.",
      "Work-life balance and burnout prevention.",
      "Reducing stigma around mental health conversations.",
      "Encouraging help-seeking and peer support through non-clinical, respectful, and culturally appropriate content.",
    ],
  },
  {
    title: "How these programs are delivered",
    items: [
      "Short, guided modules built around practical scenarios.",
      "Mobile-first access for wider reach.",
      "Low-time, high-relevance design suitable for working adults and community participants.",
    ],
  },
  {
    title: "Impact & reporting",
    items: [
      "Aggregated participation, completion, and engagement trends.",
      "Program-level reach across locations.",
      "Privacy-conscious insights aligned with CSR disclosures.",
      "Maintains the same safeguards used in student programming.",
    ],
  },
  {
    title: "Why this matters for CSR partners",
    items: [
      "Extends impact beyond schools to underserved populations.",
      "Supports financial inclusion and mental well-being goals.",
      "Creates continuity from education to adulthood.",
      "Demonstrates broader human capital development.",
      "Reaches working populations and informal workers effectively.",
    ],
  },
];

const faqSections = [
  {
    question: "What data does WiseStudent collect?",
    answer:
      "WiseStudent collects limited, education-related data required to support learning, participation, and program delivery. This includes basic profile information provided through schools or CSR partners, and participation/activity completion data. WiseStudent follows a data minimisation approach and does not collect unnecessary information or sensitive personal data unrelated to education.",
  },
  {
    question: "Who owns the data created on WiseStudent?",
    answer:
      "All student data remains under the custodianship of the implementing school or authorised CSR partner. WiseStudent acts solely as a technology and service provider, processing data only to deliver the program.",
  },
  {
    question: "Is student data shared with third parties?",
    answer:
      "No. Data is never sold, traded, or used for advertising. Student or participant data is never shared with advertisers, never used for commercial targeting, and never sold to third parties. Data use is strictly limited to educational and reporting purposes.",
  },
  {
    question: "Is WiseStudent aligned with data protection expectations?",
    answer:
      "Yes. WiseStudent is designed to support responsible and ethical data use in education, aligned with school data governance practices, CSR child-safety and beneficiary protection expectations, and ethical use of technology for minors and communities. Privacy and safety are treated as foundational design principles.",
  },
  {
    question: "Where is WiseStudent data stored?",
    answer:
      "WiseStudent data is stored on secure cloud infrastructure with access controls, security monitoring, and industry-standard protection practices. Infrastructure is selected to support reliability, security, and scalability.",
  },
  {
    question: "Can schools or CSR partners control access to their data?",
    answer:
      "Yes. Schools and CSR partners have full control over access to their dashboards and reports. Access is role-based, limited to authorised administrators, and managed at an institutional level.",
  },
  {
    question: "Who can access analytics and reports?",
    answer:
      "Access is role-based and limited to authorised school administrators and CSR representatives. Reports are aggregated and non-personal. Individual student data is not publicly exposed in reports.",
  },
  {
    question: "How long is data retained?",
    answer:
      "Data stays only as long as needed to deliver programs, reporting, or meet institutional agreements. Retention and deletion follow institutional agreements after which data handling follows agreed practices.",
  },
  {
    question: "Can schools or CSR partners export reports?",
    answer:
      "Yes. WiseStudent supports export of aggregated reports for internal reviews, parent or stakeholder communication, and CSR documentation and disclosures. Exports are designed to be audit-friendly and privacy-conscious.",
  },
  {
    question: "Does WiseStudent use AI safely?",
    answer:
      "Yes. AI features are used only to support learning insights and program-level understanding. AI does not profile students for commercial use, publicly label or stigmatise individuals, or make automated high-stakes decisions. AI is used responsibly and in support of education outcomes.",
  },
  {
    question: "Does WiseStudent use cookies?",
    answer:
      "WiseStudent uses basic technical cookies required for platform functionality and security. It does not use third-party advertising cookies or behavioural tracking for marketing purposes.",
  },
  {
    question: "How does WiseStudent protect against misuse?",
    answer:
      "WiseStudent includes multiple safeguards: structured and guided public sharing focused on achievements rather than personal exposure, responsible recognition and rankings designed to motivate without pressure, secure access controls and permissions, and monitoring for misuse or abnormal activity.",
  },
  {
    question: "What happens if a partner stops using WiseStudent?",
    answer:
      "Access is disabled per agreement and data handling follows retention/deletion terms. No unauthorised use of data occurs after discontinuation to prevent unauthorised reuse.",
  },
  {
    question: "Why does WiseStudent take data privacy seriously?",
    answer:
      "WiseStudent works with children, schools, and communities. Protecting trust, dignity, and safety is essential to meaningful education and long-term social impact.",
  },
  {
    question: "Where can schools or CSR administrators get help?",
    answer:
      "Administrators can access support through the WiseStudent Help Center, school or CSR onboarding support, and designated institutional support contacts. Contact the WiseStudent support team through official communication channels for any data or privacy-related queries.",
  },
];

const GuideCard = ({ title, items, accent, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradients = {
    blue: "from-blue-500/10 via-indigo-500/5 to-purple-500/10",
    green: "from-emerald-500/10 via-green-500/5 to-teal-500/10",
    yellow: "from-yellow-500/10 via-amber-500/5 to-orange-500/10",
    pink: "from-pink-500/10 via-rose-500/5 to-red-500/10",
    indigo: "from-indigo-500/10 via-blue-500/5 to-cyan-500/10",
  };

  const borderGradients = {
    blue: "bg-gradient-to-br from-blue-400 to-purple-500",
    green: "bg-gradient-to-br from-emerald-400 to-teal-500",
    yellow: "bg-gradient-to-br from-yellow-400 to-orange-500",
    pink: "bg-gradient-to-br from-pink-400 to-rose-500",
    indigo: "bg-gradient-to-br from-indigo-400 to-cyan-500",
  };

  return (
    <article
      className={`group relative rounded-2xl bg-gradient-to-br ${gradients[accent]} backdrop-blur-sm 
                  border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 
                  transform hover:-translate-y-2 ${isHovered ? 'scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Gradient border effect */}
      <div className={`absolute inset-0 rounded-2xl ${borderGradients[accent]} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-md"></div>
      
      {/* Content */}
      <div className="relative p-8 space-y-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${borderGradients[accent]} flex items-center justify-center 
                          shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
            <span className="text-white text-lg font-bold">✓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1 group-hover:text-transparent 
                         group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 
                         group-hover:to-purple-600 transition-all duration-300">
            {title}
          </h3>
        </div>
        
        <ul className="space-y-3 text-gray-700">
          {items.map((item, idx) => (
            <li
              key={`${title}-${idx}`}
              className="flex gap-3 items-start group/item hover:translate-x-1 transition-transform duration-200"
            >
              <span className={`w-2 h-2 rounded-full ${borderGradients[accent]} mt-2 flex-shrink-0 
                              group-hover/item:scale-150 transition-transform duration-200`}></span>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

const SectionHeader = ({ icon, gradient, title, delay = 0 }) => (
  <div
    className="flex items-center gap-4 mb-8"
    style={{ animation: `fadeInLeft 0.8s ease-out ${delay}s both` }}
  >
    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} 
                    flex items-center justify-center text-white text-3xl font-black 
                    shadow-2xl transform hover:rotate-6 hover:scale-110 transition-all duration-300`}>
      <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm"></div>
      <span className="relative z-10">{icon}</span>
      
      {/* Animated ring */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-ping opacity-75"></div>
    </div>
    
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
        {title}
      </h2>
      <div className={`h-1 w-24 rounded-full bg-gradient-to-r ${gradient} mt-2`}></div>
    </div>
  </div>
);

const FAQCard = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article
      className="group relative rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/50 
                 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                      transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors duration-200"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 
                        flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
            Q
          </div>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{question}</h3>
        </div>
        
        <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center 
                        transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-6 pl-[4.5rem]">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

const PlatformDetails = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToFooter = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <InstallPWA />
      <MainNavbar
        handlePillarsClick={scrollToTop}
        handleWhyChooseClick={scrollToTop}
        handlePricingClick={scrollToTop}
        handleFooterClick={scrollToFooter}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        fixed
      />

      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <header className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md 
                       border border-indigo-200 shadow-lg"
            style={{ animation: 'fadeInUp 0.8s ease-out' }}
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-sm sm:text-base uppercase tracking-[0.3em] text-indigo-600 font-bold">
              How WiseStudent Works
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text 
                       bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 leading-tight"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
          >
            Help Guide
          </h1>

          {/* Subheading */}
          <p
            className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
          >
            Discover how WiseStudent empowers students, supports parents, enables schools, 
            and creates lasting impact through CSR partnerships.
          </p>

          {/* Highlight pills */}
          <div
            className="flex flex-wrap gap-4 justify-center mt-8"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
          >
            {heroHighlights.map((item) => (
              <div
                key={item}
                className="group relative px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md 
                          border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 
                          hover:-translate-y-1 max-w-sm"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 
                              opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <p className="relative text-sm font-semibold text-gray-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-10 rounded-3xl overflow-hidden border border-white/60 shadow-2xl max-w-4xl mx-auto"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.8s both' }}
          >
            <div className="relative pb-[56.25%]">
              <iframe
                title="WiseStudent Overview"
                src="https://www.youtube.com/embed/DkSNWsxFLzQ"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </header>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Students Section */}
        <section className="space-y-8">
          <SectionHeader
            icon="🎓"
            gradient="from-blue-500 to-purple-600"
            title="Student Help Guide"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {studentGuide.map((section, index) => (
              <GuideCard
                key={section.title}
                title={section.title}
                items={section.items}
                accent="blue"
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Parents Section */}
        <section className="space-y-8">
          <SectionHeader
            icon="👨‍👩‍👧‍👦"
            gradient="from-green-500 to-emerald-600"
            title="Parent Help Guide"
            delay={0.2}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {parentGuide.map((section, index) => (
              <GuideCard
                key={section.title}
                title={section.title}
                items={section.items}
                accent="green"
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Schools Section */}
        <section className="space-y-8">
          <SectionHeader
            icon="🏫"
            gradient="from-yellow-500 to-orange-600"
            title="School Help Guide"
            delay={0.4}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {schoolGuide.map((section, index) => (
              <GuideCard
                key={section.title}
                title={section.title}
                items={section.items}
                accent="yellow"
                index={index}
              />
            ))}
          </div>
        </section>

        {/* CSR Section */}
        <section className="space-y-8">
          <SectionHeader
            icon="🤝"
            gradient="from-pink-500 to-rose-600"
            title="CSR & Foundation Guide"
            delay={0.6}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {csrGuide.map((section, index) => (
              <GuideCard
                key={section.title}
                title={section.title}
                items={section.items}
                accent="pink"
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Adults Section */}
        <section className="space-y-8">
          <SectionHeader
            icon="💼"
            gradient="from-indigo-500 to-blue-600"
            title="Adult Programs Guide"
            delay={0.8}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {adultGuide.map((section, index) => (
              <GuideCard
                key={section.title}
                title={section.title}
                items={section.items}
                accent="indigo"
                index={index}
              />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <SectionHeader
            icon="🔒"
            gradient="from-gray-700 to-gray-900"
            title="Data & Privacy FAQs"
            delay={1.0}
          />
          <div className="grid gap-6 grid-cols-1">
            {faqSections.map((faq, index) => (
              <FAQCard
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
};

export default PlatformDetails;
