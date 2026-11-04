// Site copy and company facts. Edit, then run `node build/build.mjs`.
import { FINANCE_SERVICES } from "./finance-services.mjs";

export const SITE = {
  name: "Anira Data DevOps",
  legalName: "Anira Data DevOps Pvt Ltd",
  url: "https://www.aniradatadev.com",
  email: "info@aniradatadev.com",
  address: {
    street: "Capital Park Road, Madhapur",
    city: "Hyderabad",
    region: "Telangana",
    country: "India",
    countryCode: "IN",
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Capital+Park+Road+Madhapur+Hyderabad",
  hours: [
    ["Monday – Friday", "9:00 AM – 5:00 PM IST"],
    ["Saturday – Sunday", "Closed"],
  ],
  description:
    "Anira Data DevOps provides finance and accounting operations, global payroll, ERP consulting, finance automation, cloud and DevOps, software development and IT staffing from Hyderabad, India.",
};

export const FACTS = [
  { value: "12+", label: "Years of combined experience across finance, software, DevOps and cloud" },
  { value: "6", label: "Practice areas spanning finance operations, ERP, technology and talent" },
  { value: "Hyderabad", label: "Our delivery center in Madhapur, Hyderabad, India", small: true },
];

// Each practice becomes /services/<slug>/. `blocks` sets the page's unique sections, in order.
export const PRACTICES = [
  {
    slug: "finance-accounting",
    icon: "ledger",
    photo: "analytics",
    photoAlt: "Laptop showing a financial dashboard with charts and KPIs",
    name: "Finance & Accounting Operations",
    short: "Expense, payables, receivables, close, planning, reporting and payroll, run with precision.",
    headline: "Finance operations that run accurately, on time and under control.",
    intro:
      "We take on the transactional and analytical work that keeps a finance function healthy, from processing expenses and invoices to closing the books and reporting to leadership. Your team gains capacity and visibility; your numbers stay reliable.",
    services: FINANCE_SERVICES.map((s) => ({ name: s.name, href: `/services/finance-accounting/${s.slug}/` })),
    blocks: [
      { type: "outcomes", title: "Outcomes that matter to leadership.", items: [
        "Faster, cleaner month-end and year-end close",
        "Stronger controls and clearer audit trails",
        "Better visibility of cash, payables and receivables",
        "Consistent, timely reporting for leadership",
        "Capacity that scales with transaction volumes",
      ] },
      { type: "financeCards" },
      { type: "cycles", title: "Coverage across the finance cycles", text: "Our services map to the three core finance processes, so we can support one area or connect them end to end.", cycles: [
        { name: "Procure-to-Pay", steps: ["Vendor invoices", "Matching & approval", "Payments", "Employee expenses"], links: ["accounts-payable", "travel-expense"] },
        { name: "Order-to-Cash", steps: ["Billing", "Cash application", "Collections", "Disputes & credit"], links: ["accounts-receivable"] },
        { name: "Record-to-Report", steps: ["Journals & accruals", "Reconciliations", "Close", "Reporting & analysis"], links: ["record-to-report", "business-financial-reporting", "financial-planning-analysis"] },
      ] },
      { type: "faq", items: [
        { q: "Can we start with just one process?", a: "Yes. Many clients start with a single process such as accounts payable or reconciliations, and extend once the first one is running smoothly." },
        { q: "Do you work in our systems?", a: "Yes. We work in your ERP and accounting systems under the access and approval rules you define." },
        { q: "How do you hand over work from our team?", a: "Through a structured transition: we document each process, work alongside your team, then take over with agreed checks and reporting. See How We Work for details." },
      ] },
    ],
  },
  {
    slug: "erp",
    icon: "layers",
    photo: "planning-session",
    photoAlt: "Team planning a project around a table with laptops and sticky notes",
    name: "ERP Consulting & Implementation",
    short: "Implement, migrate, customize and support leading ERP systems to fit how you grow.",
    headline: "ERP systems that fit your business, not the other way round.",
    intro:
      "We work with businesses to implement, customize, migrate and support leading ERP systems, adapting them to specific requirements and growth plans. A well-run ERP strengthens financial management with real-time visibility into cash flow, budgeting and performance across the organization.",
    services: [
      { name: "ERP Implementation & Rollout" },
      { name: "ERP Migration & Upgrades" },
      { name: "ERP Customization & Integration" },
      { name: "Post-Go-Live Support" },
      { name: "User Training & Optimization" },
    ],
    blocks: [
      { type: "split", eyebrow: "Why it matters", title: "Your ERP is where finance and operations meet.", paras: [
        "When an ERP is configured around how a business actually works, finance gets real-time visibility of cash, budgets and performance, and operations run on one version of the truth.",
        "When it is not, teams fall back on spreadsheets and workarounds. We bring finance process knowledge and technical capability together, so the system supports the way you close, report and grow.",
      ] },
      { type: "phases", title: "From discovery to steady state", text: "A clear, phased approach that keeps scope, data and people on track.", items: [
        { t: "Discover", d: "Understand processes, pain points, reporting needs and integration points.", out: "Requirements and scope" },
        { t: "Design", d: "Map future-state processes, chart of accounts, roles and controls.", out: "Solution design" },
        { t: "Configure & build", d: "Configure the system, build customizations, integrations and reports.", out: "Configured environment" },
        { t: "Test", d: "Unit, integration and user acceptance testing with real scenarios.", out: "Signed-off test results" },
        { t: "Migrate & go live", d: "Cleanse and load data, reconcile balances and cut over.", out: "Reconciled opening balances" },
        { t: "Support & optimize", d: "Stabilize, train users and refine processes after launch.", out: "Stable, adopted system" },
      ] },
      { type: "serviceGrid", title: "How we help", items: [
        { name: "ERP Implementation & Rollout", text: "Planning, configuration and rollout aligned to your finance and operating processes." },
        { name: "ERP Migration & Upgrades", text: "Moving data and processes to new platforms or versions while protecting continuity." },
        { name: "ERP Customization & Integration", text: "Tailoring workflows and connecting ERP with banking, payroll, CRM and reporting tools." },
        { name: "Post-Go-Live Support", text: "Ongoing support that keeps the system stable and issues resolved after launch." },
        { name: "User Training & Optimization", text: "Role-based training and refinement so teams get full value from the investment." },
      ] },
      { type: "platformCards", title: "Platforms we work with", items: [
        { name: "SAP", text: "Enterprise-scale ERP for complex, multi-entity organizations." },
        { name: "Oracle NetSuite", text: "Cloud ERP widely used by growing and mid-sized businesses." },
        { name: "Microsoft Dynamics 365", text: "Finance and operations applications in the Microsoft ecosystem." },
        { name: "Odoo", text: "Modular, flexible business applications that scale step by step." },
        { name: "QuickBooks Enterprise", text: "Accounting and inventory for small and mid-sized businesses." },
      ] },
      { type: "checklist", title: "Migration readiness checklist", text: "Questions we work through with every client before moving to a new ERP or version.", items: [
        "Which processes will change, and who owns each one?",
        "Is the chart of accounts ready, or does it need a clean-up first?",
        "Which master data needs cleansing before migration?",
        "How much transaction history needs to move?",
        "Which integrations must work on day one?",
        "How will opening balances be reconciled and signed off?",
        "Who will be trained, when, and on what?",
        "What does support look like in the first 90 days?",
      ] },
      { type: "faq", items: [
        { q: "Can you take over an ERP project already in progress?", a: "Yes. We start with a review of scope, configuration and open issues, then agree a plan to stabilize and complete the work." },
        { q: "Do you only implement, or also support?", a: "Both. Many clients engage us for post-go-live support, enhancements and user training after the initial rollout." },
        { q: "Which ERP is right for us?", a: "That depends on your size, complexity, industry and growth plans. We can help you compare options against your requirements." },
      ] },
    ],
  },
  {
    slug: "finance-transformation",
    icon: "workflow",
    photo: "office-towers",
    photoAlt: "Modern glass office towers seen from below",
    name: "Finance Transformation & Automation",
    short: "Simplify R2R, P2P and O2C, automate high-effort work and build a scalable finance model.",
    headline: "A simpler, faster and more scalable finance function.",
    intro:
      "Fragmented systems and spreadsheets slow finance teams down. We simplify processes across record-to-report, procure-to-pay and order-to-cash, introduce practical automation where effort is highest, and help finance shift its focus from transactions to business support.",
    services: [
      { name: "Process Automation & RPA" },
      { name: "Workflow Orchestration" },
      { name: "Intelligent Data Processing" },
      { name: "Advanced Analytics & Dashboards" },
      { name: "Finance Systems Integration" },
      { name: "Operating Model Transformation" },
    ],
    blocks: [
      { type: "compare", title: "What changes", text: "Transformation is measured in how the work feels day to day.", rows: [
        ["Month-end relies on spreadsheets and manual journals", "Standardized close with automated recurring entries"],
        ["Invoices keyed in by hand", "Invoice data captured and validated automatically"],
        ["Approvals chased by email", "Workflow routes and tracks approvals"],
        ["Reports rebuilt every month", "Dashboards refresh from reconciled data"],
        ["Systems that do not talk to each other", "Integrated ERP, banking, payroll and reporting"],
        ["Finance busy processing transactions", "Finance focused on analysis and business support"],
      ] },
      { type: "ladder", title: "A practical path to maturity", text: "We meet you where you are and move one stage at a time.", items: [
        { t: "Manual", d: "Work depends on individuals, spreadsheets and email." },
        { t: "Standardized", d: "Documented processes, clear ownership and consistent controls." },
        { t: "Automated", d: "Repetitive, rules-based work handled by systems and bots." },
        { t: "Insight-led", d: "Finance time spent on analysis, planning and decision support." },
      ] },
      { type: "serviceGrid", title: "Capabilities", items: [
        { name: "Process Automation & RPA", text: "Automating repetitive, rules-based finance tasks to reduce effort and errors." },
        { name: "Workflow Orchestration", text: "Connecting approvals and hand-offs so work moves without delays." },
        { name: "Intelligent Data Processing", text: "Capturing and validating data from documents and systems with less manual entry." },
        { name: "Advanced Analytics & Dashboards", text: "Bringing finance data together into dashboards leadership can act on." },
        { name: "Finance Systems Integration", text: "Linking ERP, banking, payroll and reporting tools into one dependable flow." },
        { name: "Operating Model Transformation", text: "Redesigning roles, controls and processes for a finance function that scales." },
      ] },
      { type: "chips", title: "Where automation pays off first", text: "High-volume, rules-based tasks are usually the best starting point.", items: [
        "Invoice capture and matching", "Bank reconciliations", "Recurring journal entries", "Vendor statement reconciliation",
        "Intercompany matching", "Cash application", "Report data preparation", "Expense audit checks",
      ] },
      { type: "faq", items: [
        { q: "Do we need new software to automate?", a: "Not always. Many improvements come from using existing ERP features better, standardizing processes or adding light workflow. We recommend new tools only where they clearly pay off." },
        { q: "Where should we start?", a: "Usually with one high-volume process that causes visible pain. A quick assessment identifies candidates and the effort involved." },
        { q: "Will automation affect our controls?", a: "It should strengthen them. We design automation with controls, logs and exception handling built in, and document the changes." },
      ] },
    ],
  },
  {
    slug: "technology",
    icon: "code",
    photo: "code-laptop",
    photoAlt: "Laptop showing source code on a clean desk",
    name: "IT Consulting & Software Development",
    short: "Advisory, custom applications, automation, integration and data engineering.",
    headline: "Technology that fits the way your business works.",
    intro:
      "Our consultants and engineers advise on technology choices, build and support custom applications, automate manual processes and connect the systems your teams rely on. Whether you need a defined project or an extended development team, we deliver solutions that are practical and scalable.",
    services: [
      { name: "Software & IT Solutions Consulting" },
      { name: "Custom Software & Application Development" },
      { name: "Software Development Outsourcing" },
      { name: "Application Support" },
      { name: "Data Engineering & Analytics" },
      { name: "Systems Integration & Digital Transformation" },
    ],
    blocks: [
      { type: "serviceGrid", title: "What we do", items: [
        { name: "Software & IT Solutions Consulting", text: "Independent advice on architecture, platforms and roadmaps that support your business goals." },
        { name: "Custom Software & Application Development", text: "Design and development of applications built around your processes and users." },
        { name: "Software Development Outsourcing", text: "Dedicated development capacity delivered from our Hyderabad team." },
        { name: "Application Support", text: "Maintenance, enhancements and support that keep business applications reliable." },
        { name: "Data Engineering & Analytics", text: "Pipelines, models and reporting that turn operational data into insight." },
        { name: "Systems Integration & Digital Transformation", text: "Connecting systems and modernizing processes as part of a wider digital change." },
      ] },
      { type: "models", title: "Ways to work with us", items: [
        { t: "Fixed-scope project", d: "A defined outcome, scope and timeline. Best for new applications, integrations and well-understood changes.", best: "Clear requirements" },
        { t: "Dedicated team", d: "A stable team working on your roadmap, managed by us and aligned to your priorities.", best: "Ongoing product work" },
        { t: "Extended team", d: "Engineers who join your team and work within your processes and tools.", best: "Adding capacity fast" },
      ] },
      { type: "flow", title: "How a build comes together", steps: ["Discover", "Design", "Build", "Test", "Release", "Support"] },
      { type: "stack", title: "Technologies our engineers work with", groups: [
        { t: "Languages", items: ["Java", "C#", "C++", "Python", "Node.js", "Go"] },
        { t: "Databases", items: ["Oracle", "SQL Server"] },
        { t: "Platforms", items: ["Linux", "Windows Server", "Microsoft Azure"] },
        { t: "Application servers", items: ["JBoss", "Tomcat", "Apache", "WebLogic"] },
      ] },
      { type: "faq", items: [
        { q: "Can you work with our existing codebase?", a: "Yes. We start by understanding the architecture and code, then agree how we will contribute, review and release changes." },
        { q: "Who owns the code?", a: "Ownership terms are agreed in the contract. Typically, code written for you belongs to you." },
        { q: "How do you keep us updated?", a: "Through regular demos, progress reports and a named point of contact, at a cadence that suits you." },
      ] },
    ],
  },
  {
    slug: "cloud-devops",
    icon: "cloud",
    photo: "server-cables",
    photoAlt: "Server rack with network cables in a data center",
    name: "Cloud & DevOps",
    short: "Cloud computing solutions, CI/CD automation and database operations.",
    headline: "Faster delivery, reliable operations, secure at scale.",
    intro:
      "We help organizations transform their IT environment with cloud computing services. Our DevOps teams automate processes that have traditionally been manual and slow, increasing speed, delivery and reliability at scale while keeping operations secure.",
    services: [
      { name: "Cloud Computing Solutions" },
      { name: "CI/CD & Release Automation" },
      { name: "Code Quality & Artifact Management" },
      { name: "Database Administration" },
      { name: "Platform Operations & Support" },
    ],
    blocks: [
      { type: "pipeline", title: "An automated path from code to production", text: "We design, build and run delivery pipelines using proven tooling.", stages: [
        { t: "Code", tools: ["Git", "Bitbucket"] },
        { t: "Build", tools: ["Jenkins"] },
        { t: "Quality", tools: ["SonarQube", "Unit tests"] },
        { t: "Package", tools: ["Artifactory"] },
        { t: "Deploy", tools: ["Ansible"] },
        { t: "Database", tools: ["Datical"] },
        { t: "Release", tools: ["XL Release"] },
      ] },
      { type: "serviceGrid", title: "What we do", items: [
        { name: "Cloud Computing Solutions", text: "Planning, migration and management of cloud environments suited to your workloads, including Microsoft Azure." },
        { name: "CI/CD & Release Automation", text: "Continuous integration, deployment and testing pipelines that make releases routine." },
        { name: "Code Quality & Artifact Management", text: "Quality gates, unit testing frameworks and artifact repositories, set up and maintained." },
        { name: "Database Administration", text: "Oracle administration, performance tuning, high availability and migrations." },
        { name: "Platform Operations & Support", text: "Monitoring, troubleshooting and support for applications across Linux and Windows environments." },
      ] },
      { type: "split", eyebrow: "Database operations", title: "Oracle databases that stay fast and available.", list: [
        "Oracle Database administration across platforms",
        "Oracle Exadata and RAC environments",
        "Performance monitoring and tuning",
        "Oracle Enterprise Manager (OEM)",
        "High availability and disaster recovery",
        "Database migration strategies",
      ] },
      { type: "faq", items: [
        { q: "Can you improve the pipeline we already have?", a: "Yes. We review your current tooling and release process, then prioritize changes that remove manual steps and risk." },
        { q: "Do you support production environments?", a: "Yes. We can provide operational support and troubleshooting for applications and databases, with escalation agreed in advance." },
        { q: "Which cloud do you work with?", a: "Our teams work with Microsoft Azure. Talk to us about your environment and requirements." },
      ] },
    ],
  },
  {
    slug: "it-staffing",
    icon: "users",
    photo: "team-laptops",
    photoAlt: "Team of professionals working together on laptops",
    name: "IT & Finance Talent",
    short: "Premium IT staffing and skilled finance professionals for projects and ongoing operations.",
    headline: "The right people for the work that matters.",
    intro:
      "Along with our consulting services, we support clients with skilled finance and IT professionals who contribute to key projects such as system implementations, process improvements and ongoing operations. We take pride in matching the right talent with great companies.",
    services: [
      { name: "Premium IT Staffing", href: "#roles" },
      { name: "Finance Professionals", href: "#roles" },
      { name: "Talent Matching Process", href: "#process" },
      { name: "Placement & Mentoring", href: "#growth" },
      { name: "Advanced Level Programming", href: "#growth" },
    ],
    blocks: [
      { type: "roles", id: "roles", title: "Roles we fill", items: [
        { t: "Software Development Engineers", d: "Engineers experienced in modern languages, design and scalable systems." },
        { t: "DevOps Engineers", d: "CI/CD, build orchestration, code quality and deployment automation." },
        { t: "Database Administrators", d: "Oracle administration, performance tuning, high availability and recovery." },
        { t: "ERP Consultants", d: "Implementation, configuration and support across leading ERP platforms." },
        { t: "Finance & Accounting Specialists", d: "AP, AR, general ledger, close, reporting and payroll professionals." },
        { t: "Data & Analytics Professionals", d: "Data engineering, reporting and dashboard specialists." },
      ] },
      { type: "flow", id: "process", title: "How we match talent", steps: ["Understand the need", "Source", "Screen", "Technical evaluation", "Introduce", "Onboard & support"] },
      { type: "split", id: "growth", eyebrow: "Investing in our people", title: "Professionals who keep growing.", paras: [
        "We are with our people every step of the way. Placement, mentoring and advanced-level programming help each professional grow and perform on demanding client work.",
      ], list: ["Placement with great companies", "Mentoring from experienced colleagues", "Advanced-level programming and skills training"] },
      { type: "faq", items: [
        { q: "Can you provide both IT and finance professionals?", a: "Yes. We support clients with skilled professionals across technology and finance, for projects and ongoing operations." },
        { q: "How do you assess candidates?", a: "Every candidate is screened for experience and fit, and technical roles include a technical evaluation before introduction." },
        { q: "What if a placement is not working out?", a: "Talk to us early. We stay in touch after onboarding so issues can be addressed quickly." },
      ] },
    ],
  },
];

export const REASONS = [
  { title: "Proven expertise", text: "Over 12 years of combined experience across financial consulting, software development, DevOps and cloud technologies, applied to practical, scalable solutions." },
  { title: "Delivery from Hyderabad", text: "Our delivery center in Madhapur, Hyderabad, offers cost-effective, scalable support without compromising on quality." },
  { title: "Finance and technology together", text: "Finance specialists and technologists work side by side, so improvements are commercially sound and technically robust." },
  { title: "Dependable service delivery", text: "Clear ownership, agreed service standards and regular reporting, so you always know where work stands." },
  { title: "Flexible, collaborative model", text: "Begin with a single process or a defined project and expand as confidence grows. We adapt to your systems, teams and pace." },
];

export const STEPS = [
  { title: "Understand", text: "Your processes, priorities and the outcomes that matter most." },
  { title: "Design", text: "A clear scope, service standards and reporting cadence." },
  { title: "Transition", text: "A structured handover with documentation and controls." },
  { title: "Improve", text: "Regular reviews, and automation where it adds value." },
];

export const ENGAGEMENT_MODELS = [
  { t: "Managed operations", d: "We run a defined finance process end to end, such as accounts payable or reconciliations, against agreed service standards.", fit: "Ongoing, repeatable work" },
  { t: "Project", d: "A defined outcome and timeline, such as an ERP rollout, an automation or a reporting build.", fit: "One-off change" },
  { t: "Dedicated team", d: "A stable team that works on your priorities and grows with you.", fit: "Long-term capacity" },
  { t: "Talent", d: "Skilled IT or finance professionals who join your team for a project or ongoing role.", fit: "Specific skills" },
];

export const TRANSITION = [
  { t: "Discovery", d: "Walk through each process with your team. Agree scope, volumes, systems, controls and success measures." },
  { t: "Documentation", d: "Write step-by-step procedures, checklists and escalation paths, and have them signed off by you." },
  { t: "Parallel run", d: "Work alongside your team on live transactions, with every output reviewed until quality is consistent." },
  { t: "Handover", d: "Take ownership against the agreed service standards, with your team reviewing results." },
  { t: "Steady state", d: "Run the process, report against service standards and look for improvements each month." },
];

export const GOVERNANCE = [
  { when: "Daily", what: "Work queues, exceptions and urgent items, handled through an agreed channel." },
  { when: "Weekly", what: "Progress, open issues and upcoming deadlines with your process owner." },
  { when: "Monthly", what: "Service report against agreed standards, plus improvement opportunities." },
  { when: "Quarterly", what: "Business review of scope, priorities and the roadmap for the next quarter." },
];

export const CONTROLS = [
  { t: "Documented procedures", d: "Every process runs from written, approved procedures that are kept up to date." },
  { t: "Maker-checker review", d: "Work that affects your books is prepared by one person and reviewed by another." },
  { t: "Access by role", d: "Team members get only the system access their role needs, as approved by you." },
  { t: "Exception logs", d: "Issues and exceptions are recorded, tracked and reported, never fixed silently." },
  { t: "Named contacts", d: "A named lead and backup for every engagement, so continuity never depends on one person." },
  { t: "Continuous improvement", d: "Regular reviews of errors, delays and effort to find what to fix or automate next." },
];

export const FAQS = [
  { cat: "Working together", items: [
    { q: "What does Anira Data DevOps do?", a: "We provide finance and accounting operations, global payroll support, ERP consulting, finance transformation and automation, software development, cloud and DevOps services, and IT and finance talent." },
    { q: "Where is your team based?", a: "Our delivery center is in Madhapur, Hyderabad, India." },
    { q: "Can we start small?", a: "Yes. Many engagements begin with a single process or a defined project and expand once the first one is running well." },
    { q: "How do engagements usually start?", a: "With a conversation about your priorities, followed by a short discovery to agree scope, approach and service standards." },
  ] },
  { cat: "Finance operations", items: [
    { q: "Which finance processes can you support?", a: "Travel and expense, accounts payable, accounts receivable and order-to-cash, record-to-report, financial planning and analysis, business and financial reporting, and global payroll." },
    { q: "Do you work in our systems?", a: "Yes. We work in your ERP and accounting systems under the access and approval rules you define." },
    { q: "Who approves payments and journals?", a: "You do. We prepare, check and document; approval and release authority stay with your designated approvers." },
  ] },
  { cat: "Technology", items: [
    { q: "Which ERP platforms do you work with?", a: "SAP, Oracle NetSuite, Microsoft Dynamics 365, Odoo and QuickBooks Enterprise." },
    { q: "Do you build custom software?", a: "Yes. We design, build and support custom applications, integrations and automation, as fixed-scope projects or through dedicated teams." },
    { q: "Do you provide DevOps and database support?", a: "Yes. We build and run CI/CD pipelines and support Oracle databases, including performance tuning and high availability." },
  ] },
  { cat: "Careers", items: [
    { q: "How do I apply for a role?", a: "Email your resume to info@aniradatadev.com with the job title in the subject line. Current openings are listed on our Careers page." },
  ] },
];

export const FOCUS = [
  "Accounting & Finance Operations",
  "Finance Transformation & Automation",
  "ERP Consulting & Implementation",
  "DevOps & Application Support",
  "Data Engineering & Analytics",
  "Intelligent Workflow Optimization",
];

export const JOBS = [
  {
    title: "Sr. Software Development Engineer",
    summary:
      "A successful Software Development Engineer will have a broad array of experience, strong design skills, an excellent ability to solve problems, good communication skills and a desire to be a key technical contributor.",
    qualifications: [
      "Programming experience with at least one modern language such as Java, C++ or C#, including object-oriented design",
      "1+ years of experience contributing to the architecture and design (architecture, design patterns, reliability and scaling) of new and current systems",
      "5+ years of professional software development experience with at least one modern language such as Python, Node, Golang, Java, C++ or C#",
      "Bachelor's (BS/BE) or Master's degree in Computer Science or equivalent",
    ],
  },
  {
    title: "Sr. DevOps Developer",
    summary: "Help clients deliver faster and more reliably by building and running CI/CD for complex application architectures.",
    qualifications: [
      "Ability to understand complex application architectures to support Continuous Integration (CI), Continuous Deployment (CD) and Continuous Testing",
      "3–5 years of hands-on DevOps experience with Version Control (Git/Bitbucket), Build Orchestration (Jenkins), Code Quality (SonarQube and unit testing frameworks), Artifact Management (Artifactory) and Deployment (Ansible)",
      "Experience with Database Build & Deployment using Datical and Release Orchestration using XL Release is an advantage",
      "3–5 years of hands-on experience in application development and operating environments including Linux/Windows Server, Java, Python, Oracle/SQL Server, Web UI and JBoss/Tomcat/Apache/WebLogic",
      "Very strong analysis and problem-solving ability",
      "Excellent documentation, software design, build and test skills",
      "Bachelor's (BS/BE) or Master's degree in Computer Science or equivalent",
    ],
  },
  {
    title: "Sr. Oracle DBA",
    summary: "Own the performance, availability and reliability of Oracle databases across platforms.",
    qualifications: [
      "5+ years of Oracle Database Administration experience, including implementing and maintaining Oracle databases across multiple platforms",
      "Experience with Oracle Exadata and VM Cloud is a must",
      "Strong Oracle performance and tuning skills",
      "Experience with Oracle Enterprise Manager (OEM)",
      "In-depth understanding of high availability and disaster recovery requirements and solutions",
      "In-depth understanding of Oracle RAC (12c and 19c)",
      "Database and application server internals, and advanced troubleshooting in support of 24x7 on-call duties",
      "Previous experience implementing migration strategies",
      "Bachelor's (BS/BE) or Master's degree in Computer Science or equivalent",
    ],
  },
];

// ---------- About page ----------
export const ABOUT = {
  mission: "To help businesses run their finance operations and technology with clarity, control and confidence.",
  vision: "To be the partner growing businesses trust for both their finance operations and the technology behind them.",
  apart: [
    { t: "Finance and technology under one roof", d: "Accountants and engineers work side by side, so process fixes and system changes are designed together rather than handed over the wall." },
    { t: "Process discipline", d: "Documented procedures, reviewer checks and exception logs are how we work every day, not extras added for an audit." },
    { t: "Practical over theoretical", d: "We start with your existing systems and people, and recommend new tools only where they clearly pay off." },
    { t: "Flexible engagement", d: "Managed operations, projects, dedicated teams or individual professionals, combined in whatever way suits you." },
  ],
  connect: [
    { t: "Run", d: "Day-to-day operations delivered accurately and on time.", practices: ["finance-accounting", "it-staffing"] },
    { t: "Improve", d: "Better processes, systems and controls.", practices: ["finance-transformation", "erp"] },
    { t: "Build", d: "Software, integrations and platforms.", practices: ["technology", "cloud-devops"] },
  ],
  values: [
    { t: "Value for every stakeholder", d: "Offering valued services to clients, colleagues and partners alike.", practice: ["We measure success by outcomes for the client", "We treat colleagues and partners with the same care"] },
    { t: "Genuine interest and trust", d: "We care about the outcome and earn trust through how we work.", practice: ["We ask questions until we understand the business", "We raise issues early, even when it is uncomfortable"] },
    { t: "Teamwork", d: "Working together towards a common goal, with our clients and each other.", practice: ["Finance and technology teams plan work together", "Knowledge is shared, never held by one person"] },
    { t: "Empowerment and transparency", d: "Openness across the organization, and people trusted to take ownership.", practice: ["Clear ownership for every task and deliverable", "Open reporting on what is working and what is not"] },
  ],
  commitments: [
    "We will document how your work is done, and keep it current",
    "We will tell you early when something is off track",
    "We will respect your controls and approval authority",
    "We will handle your data with care and limit access by role",
    "We will report on performance at an agreed rhythm",
    "We will keep looking for ways to improve",
  ],
};

// ---------- Careers page ----------
export const CAREERS = {
  why: [
    { t: "Varied, meaningful work", d: "Projects across finance operations, ERP, software, cloud and DevOps, so there is always something new to learn." },
    { t: "Learn from experienced colleagues", d: "Mentoring from people who have done the work, and who want to see you succeed." },
    { t: "Skills that keep growing", d: "Advanced-level programming and skills training that prepare you for demanding projects." },
    { t: "Fair and rewarding", d: "We are an equal opportunity employer offering competitive salaries and comprehensive benefits." },
  ],
  areas: [
    { icon: "code", t: "Software development", d: "Design and build applications and integrations in modern languages." },
    { icon: "cloud", t: "DevOps & cloud", d: "Build CI/CD pipelines, automate releases and run cloud environments." },
    { icon: "layers", t: "Database administration", d: "Keep Oracle databases fast, available and recoverable." },
    { icon: "workflow", t: "ERP consulting", d: "Implement, configure and support leading ERP platforms." },
    { icon: "ledger", t: "Finance & accounting", d: "Run AP, AR, close, reporting and payroll processes for clients." },
    { icon: "chart", t: "Data & analytics", d: "Build data pipelines, reports and dashboards that drive decisions." },
  ],
  growth: [
    { t: "Placement", d: "We match you with roles and projects where your skills fit and can grow, with great companies in the IT industry.", points: ["Roles aligned to your experience", "Support through every step of the process"] },
    { t: "Mentoring", d: "Experienced colleagues guide you on client work, technical decisions and professional growth.", points: ["Guidance on real projects", "Regular conversations about your development"] },
    { t: "Advanced Level Programming", d: "Focused training that sharpens your technical skills for demanding projects.", points: ["Deepen your core technologies", "Prepare for more senior responsibilities"] },
  ],
  process: ["Apply by email", "Resume review", "Technical or functional interview", "Final conversation", "Offer & onboarding"],
  faqs: [
    { q: "How do I apply?", a: "Email your resume to info@aniradatadev.com with the job title in the subject line." },
    { q: "What should I include?", a: "An up-to-date resume that shows your experience with the technologies or processes listed in the role. A short note about why the role interests you is welcome." },
    { q: "Can I apply if there is no matching opening?", a: "Yes. Send your resume and the kind of role you are looking for, and we will keep it in mind for future openings." },
    { q: "Can I apply for more than one role?", a: "Yes. Mention each role you are interested in when you email us." },
    { q: "Where is the office?", a: "Our office is on Capital Park Road, Madhapur, Hyderabad, Telangana, India." },
  ],
};
