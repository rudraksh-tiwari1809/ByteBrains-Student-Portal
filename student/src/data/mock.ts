export const student = {
  name: "",
  firstName: "",
  initials: "",
  branch: "",
  college: "",
  year: "",
  email: "",
  phone: "",
  location: "",
  enrollment: "",
  about: "",
};
export const stats = [
  { label: "Skill Score", value: "78", suffix: "/100", note: "Good — trending up" },
  { label: "Courses Enrolled", value: "4", note: "In progress" },
  { label: "Internship Applications", value: "3", note: "Awaiting response" },
  { label: "Certifications", value: "6", note: "Completed" },
];

export const recommendations = [
  {
    tag: "Py",
    title: "Complete Python Course",
    meta: "Based on your skill gap · Beginner to Advanced",
    action: "Start",
  },
  {
    tag: "Da",
    title: "Data Analyst Internship",
    meta: "ABC Analytics · Remote · Starts 15 June",
    action: "Apply",
  },
  { tag: "So", title: "Soft Skills Workshop", meta: "Live · 2-day program", action: "View" },
];

export const events = [
  { month: "MAY", day: "20", title: "Webinar: Future of AI in Industry", time: "4:00 PM" },
  { month: "MAY", day: "25", title: "Campus Hiring: Tech Giants", time: "10:00 AM" },
  { month: "MAY", day: "30", title: "Industry Mentorship Program", time: "5:00 PM" },
];

export const skillBreakdown = [
  { name: "Python", value: 85 },
  { name: "SQL", value: 75 },
  { name: "Data Analysis", value: 70 },
  { name: "Machine Learning", value: 60 },
  { name: "Communication", value: 55 },
];

export type Internship = {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  mode: string;
  skills: string[];
  match: number;
};

export const internships: Internship[] = [
  {
    id: "int-1",
    role: "Data Science Intern",
    company: "TechSolutions Inc.",
    location: "Bangalore, India",
    duration: "3 months",
    stipend: "₹25,000 / month",
    mode: "On-site",
    skills: ["Python", "Machine Learning"],
    match: 92,
  },
  {
    id: "int-2",
    role: "AI/ML Intern",
    company: "InnovateX",
    location: "Remote",
    duration: "3–6 months",
    stipend: "₹30,000 / month",
    mode: "Remote",
    skills: ["Deep Learning", "TensorFlow"],
    match: 88,
  },
  {
    id: "int-3",
    role: "Software Development Intern",
    company: "CodeCrafters",
    location: "Pune, India",
    duration: "2–4 months",
    stipend: "₹18,000 / month",
    mode: "Hybrid",
    skills: ["Java", "Web Development"],
    match: 85,
  },
  {
    id: "int-4",
    role: "Business Analytics Intern",
    company: "ABC Analytics",
    location: "Remote",
    duration: "6 months",
    stipend: "₹20,000 / month",
    mode: "Remote",
    skills: ["SQL", "Excel", "Power BI"],
    match: 81,
  },
  {
    id: "int-5",
    role: "Cloud Engineering Intern",
    company: "Bharat Cloud Systems",
    location: "Hyderabad, India",
    duration: "4 months",
    stipend: "₹22,000 / month",
    mode: "On-site",
    skills: ["AWS", "Linux", "Docker"],
    match: 74,
  },
  {
    id: "int-6",
    role: "Frontend Intern",
    company: "Sarvatra Digital",
    location: "Mumbai, India",
    duration: "3 months",
    stipend: "₹15,000 / month",
    mode: "Hybrid",
    skills: ["React", "CSS", "TypeScript"],
    match: 69,
  },
];

export type Job = {
  id: string;
  role: string;
  company: string;
  location: string;
  ctc: string;
  type: string;
  eligibility: string;
  skills: string[];
  status: "Not applied" | "Applied" | "Shortlisted" | "Interview scheduled";
  deadline: string;
};

export const jobs: Job[] = [
  {
    id: "job-1",
    role: "Graduate Data Analyst",
    company: "TechSolutions Inc.",
    location: "Bangalore, India",
    ctc: "₹9.5 LPA",
    type: "Campus Placement",
    eligibility: "B.Tech CSE/IT · CGPA ≥ 7.0 · No active backlogs",
    skills: ["Python", "SQL", "Statistics"],
    status: "Shortlisted",
    deadline: "12 June",
  },
  {
    id: "job-2",
    role: "Associate Software Engineer",
    company: "InnovateX",
    location: "Pune, India",
    ctc: "₹8.0 LPA",
    type: "Campus Placement",
    eligibility: "All engineering branches · CGPA ≥ 6.5",
    skills: ["Java", "DSA", "Spring Boot"],
    status: "Applied",
    deadline: "18 June",
  },
  {
    id: "job-3",
    role: "Junior ML Engineer",
    company: "Drishti AI Labs",
    location: "Remote",
    ctc: "₹11.0 LPA",
    type: "Off-campus",
    eligibility: "CSE/AI-ML · Portfolio required",
    skills: ["PyTorch", "NLP", "Python"],
    status: "Not applied",
    deadline: "25 June",
  },
  {
    id: "job-4",
    role: "Trainee Officer — IT Systems",
    company: "National Informatics Division",
    location: "New Delhi, India",
    ctc: "₹7.2 LPA",
    type: "Government",
    eligibility: "B.Tech any branch · Written test + interview",
    skills: ["Networking", "Databases", "Aptitude"],
    status: "Interview scheduled",
    deadline: "30 June",
  },
  {
    id: "job-5",
    role: "Product Support Engineer",
    company: "CodeCrafters",
    location: "Hyderabad, India",
    ctc: "₹6.5 LPA",
    type: "Off-campus",
    eligibility: "CGPA ≥ 6.0 · Strong communication",
    skills: ["SQL", "Communication", "Debugging"],
    status: "Not applied",
    deadline: "05 July",
  },
];

export type Course = {
  id: string;
  title: string;
  provider: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  skills: string[];
  progress: number;
  reason: string;
};

export const courses: Course[] = [
  {
    id: "c1",
    title: "Machine Learning Foundations",
    provider: "AICP Academy · NPTEL partner",
    level: "Intermediate",
    duration: "8 weeks",
    skills: ["Machine Learning", "scikit-learn"],
    progress: 35,
    reason: "Closes your largest gap — Machine Learning at 60%",
  },
  {
    id: "c2",
    title: "Complete Python Programming",
    provider: "AICP Academy",
    level: "Beginner",
    duration: "6 weeks",
    skills: ["Python", "OOP"],
    progress: 70,
    reason: "Strengthens your top technical skill for interviews",
  },
  {
    id: "c3",
    title: "Professional Communication & Interviews",
    provider: "Industry Mentor Series",
    level: "Beginner",
    duration: "2 weeks",
    skills: ["Communication", "Interviewing"],
    progress: 0,
    reason: "Communication at 55% is limiting your placement readiness",
  },
  {
    id: "c4",
    title: "Advanced SQL for Analytics",
    provider: "Data Guild India",
    level: "Advanced",
    duration: "4 weeks",
    skills: ["SQL", "Query Optimisation"],
    progress: 15,
    reason: "Required by 4 of your 6 recommended internships",
  },
  {
    id: "c5",
    title: "Applied Deep Learning with TensorFlow",
    provider: "AICP Academy",
    level: "Advanced",
    duration: "10 weeks",
    skills: ["Deep Learning", "TensorFlow"],
    progress: 0,
    reason: "Unlocks AI/ML Intern roles like InnovateX (88% match)",
  },
  {
    id: "c6",
    title: "Data Visualisation with Power BI",
    provider: "Industry Skill Council",
    level: "Intermediate",
    duration: "3 weeks",
    skills: ["Power BI", "Data Analysis"],
    progress: 100,
    reason: "Completed — certificate added to your portfolio",
  },
];

export const assessmentCategories = [
  { id: "python", name: "Python Programming", questions: 5, minutes: 10, level: "Intermediate" },
  { id: "sql", name: "SQL & Databases", questions: 5, minutes: 10, level: "Intermediate" },
  { id: "ml", name: "Machine Learning", questions: 5, minutes: 12, level: "Advanced" },
  { id: "aptitude", name: "Quantitative Aptitude", questions: 5, minutes: 8, level: "Beginner" },
  { id: "comm", name: "Communication Skills", questions: 5, minutes: 8, level: "Beginner" },
];

export type Question = { q: string; options: string[]; answer: number };

export const questionBank: Record<string, Question[]> = {
  python: [
    {
      q: "Which data structure stores unique, unordered elements in Python?",
      options: ["list", "tuple", "set", "dict"],
      answer: 2,
    },
    {
      q: "What does len(range(2, 10, 2)) return?",
      options: ["3", "4", "5", "8"],
      answer: 1,
    },
    {
      q: "Which keyword creates an anonymous function?",
      options: ["def", "lambda", "func", "auto"],
      answer: 1,
    },
    {
      q: "What is the output of type(5 / 2)?",
      options: ["int", "float", "decimal", "error"],
      answer: 1,
    },
    {
      q: "Which library is most used for tabular data analysis?",
      options: ["pandas", "requests", "flask", "pytest"],
      answer: 0,
    },
  ],
  sql: [
    {
      q: "Which clause filters rows after aggregation?",
      options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
      answer: 1,
    },
    {
      q: "Which join returns only matching rows from both tables?",
      options: ["LEFT JOIN", "FULL JOIN", "INNER JOIN", "CROSS JOIN"],
      answer: 2,
    },
    {
      q: "What does a PRIMARY KEY guarantee?",
      options: ["Sorted rows", "Uniqueness and non-null", "Faster inserts", "Encryption"],
      answer: 1,
    },
    {
      q: "Which function counts distinct values?",
      options: ["COUNT(*)", "COUNT(DISTINCT col)", "SUM(col)", "UNIQUE(col)"],
      answer: 1,
    },
    {
      q: "Normalisation primarily reduces…",
      options: ["Redundancy", "Indexes", "Joins", "Storage cost only"],
      answer: 0,
    },
  ],
  ml: [
    {
      q: "Overfitting means the model…",
      options: [
        "Performs poorly on training data",
        "Memorises training data and generalises badly",
        "Has too few parameters",
        "Cannot converge",
      ],
      answer: 1,
    },
    {
      q: "Which metric suits an imbalanced classification problem?",
      options: ["Accuracy", "F1 score", "MSE", "R²"],
      answer: 1,
    },
    {
      q: "K-means is an example of…",
      options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Ranking"],
      answer: 1,
    },
    {
      q: "Which technique reduces variance by averaging models?",
      options: ["Bagging", "Boosting", "Dropout", "Normalisation"],
      answer: 0,
    },
    {
      q: "Train/validation split exists mainly to…",
      options: [
        "Speed up training",
        "Estimate generalisation performance",
        "Reduce data size",
        "Balance classes",
      ],
      answer: 1,
    },
  ],
  aptitude: [
    { q: "If 5 pens cost ₹75, what do 8 pens cost?", options: ["₹100", "₹110", "₹120", "₹135"], answer: 2 },
    { q: "20% of 250 is…", options: ["40", "45", "50", "55"], answer: 2 },
    { q: "Next in series: 2, 6, 12, 20, …", options: ["28", "30", "32", "36"], answer: 1 },
    { q: "A train covers 180 km in 3 hours. Speed?", options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], answer: 2 },
    { q: "Simple interest on ₹10,000 at 6% for 2 years", options: ["₹600", "₹1,000", "₹1,200", "₹1,600"], answer: 2 },
  ],
  comm: [
    {
      q: "In a group discussion, the strongest opening is to…",
      options: ["Speak loudest", "Frame the problem clearly", "Disagree first", "Summarise at once"],
      answer: 1,
    },
    {
      q: "STAR in interview answers stands for…",
      options: [
        "Skill, Task, Action, Review",
        "Situation, Task, Action, Result",
        "Story, Time, Angle, Result",
        "Setup, Test, Act, Report",
      ],
      answer: 1,
    },
    {
      q: "Best practice in a professional email is to…",
      options: ["Skip the subject", "Use one clear ask", "Write in all caps", "Attach everything"],
      answer: 1,
    },
    {
      q: "Active listening includes…",
      options: ["Interrupting to clarify", "Paraphrasing back", "Taking over", "Staying silent throughout"],
      answer: 1,
    },
    {
      q: "When you do not know an answer in an interview, you should…",
      options: ["Guess confidently", "State your approach honestly", "Change topic", "Stay quiet"],
      answer: 1,
    },
  ],
};

export const technicalSkills = [
  { name: "Python", value: 85, level: "Advanced" },
  { name: "SQL", value: 75, level: "Proficient" },
  { name: "Data Analysis", value: 70, level: "Proficient" },
  { name: "Machine Learning", value: 60, level: "Developing" },
  { name: "Cloud (AWS)", value: 42, level: "Beginner" },
  { name: "Java", value: 55, level: "Developing" },
];

export const softSkills = [
  { name: "Communication", value: 55, level: "Developing" },
  { name: "Teamwork", value: 78, level: "Proficient" },
  { name: "Problem Solving", value: 82, level: "Advanced" },
  { name: "Time Management", value: 68, level: "Proficient" },
];

export const strengths = [
  "Python programming and scripting",
  "Analytical problem solving",
  "Working in project teams",
  "Data cleaning and exploration",
];

export const gaps = [
  { skill: "Machine Learning", current: 60, target: 80 },
  { skill: "Communication", current: 55, target: 75 },
  { skill: "Cloud (AWS)", current: 42, target: 70 },
  { skill: "Deep Learning", current: 30, target: 65 },
];

export const projects = [
  {
    title: "Crop Yield Predictor",
    year: "2026",
    description:
      "Regression model predicting district-level crop yield from rainfall and soil data, served through a Flask dashboard.",
    tech: ["Python", "scikit-learn", "Flask"],
  },
  {
    title: "Campus Placement Analytics",
    year: "2025",
    description:
      "SQL + Power BI dashboard analysing five years of placement records to surface branch-wise hiring trends.",
    tech: ["SQL", "Power BI"],
  },
  {
    title: "Regional Language Sentiment Tool",
    year: "2025",
    description:
      "Fine-tuned transformer classifying Hindi–Marathi product reviews with 87% accuracy.",
    tech: ["PyTorch", "NLP", "Transformers"],
  },
];

export const certifications = [
  { title: "Data Visualisation with Power BI", issuer: "Industry Skill Council", year: "2026" },
  { title: "Python for Data Science", issuer: "NPTEL", year: "2025" },
  { title: "SQL Intermediate Certification", issuer: "Data Guild India", year: "2025" },
  { title: "Cloud Practitioner Essentials", issuer: "AWS Educate", year: "2025" },
  { title: "Design Thinking Workshop", issuer: "AICP Academy", year: "2024" },
  { title: "Effective Technical Writing", issuer: "AICP Academy", year: "2024" },
];

export const achievements = [
  "Winner — Smart India Hackathon internal round, 2026",
  "Top 5% in AICP national skill assessment (Python)",
  "Student coordinator, Departmental Data Science Club",
  "Published paper at institute research symposium, 2025",
];

export const education = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    org: "Government Institute of Technology, Pune",
    period: "2023 – 2027",
    score: "CGPA 8.4 / 10",
  },
  {
    degree: "Senior Secondary (PCM + CS)",
    org: "Kendriya Vidyalaya, Pune",
    period: "2021 – 2023",
    score: "92.4%",
  },
];

export const experience = [
  {
    role: "Data Analytics Trainee",
    org: "ABC Analytics (Winter Internship)",
    period: "Dec 2025 – Jan 2026",
    detail: "Built automated reporting pipelines in SQL and Python, reducing manual effort by 40%.",
  },
  {
    role: "Teaching Assistant — Programming Lab",
    org: "Government Institute of Technology, Pune",
    period: "Aug 2025 – Nov 2025",
    detail: "Mentored 60 second-year students on Python fundamentals and lab assessments.",
  },
];
