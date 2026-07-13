import type { PortfolioContent } from "../types";

export const portfolioEn: PortfolioContent = {
  locale: "en",
  name: "Kendall Valverde Díaz",
  shortName: "Kendall",
  role: "Software Engineer · AI-Augmented Development",
  location: "Costa Rica",
  intro: "I build fullstack software with applied AI, QA automation, and a practical obsession with quality.",
  about: [
    "I work across frontend, backend, QA automation, and applied artificial intelligence. I use React, TypeScript, and Node.js to turn complex needs into maintainable, demonstrable products.",
    "My experience spans QA leadership in banking, independent development for clients in Costa Rica and the United States, RAG systems, agents, CI/CD, and reproducible infrastructure.",
  ],
  availability: "Available for fullstack, frontend, QA, or AI opportunities, remote or on-site in Costa Rica.",
  skills: [
    { id: "frontend", title: "Frontend", description: "Modern, responsive interfaces built around real products.", technologies: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "TailwindCSS", "Vite", "Zustand"] },
    { id: "backend", title: "Backend & APIs", description: "Layered services, authentication, and clear contracts.", technologies: ["Node.js", "Express", "NestJS", "REST", "GraphQL", "JWT", "Zod"] },
    { id: "ai", title: "AI & Agents", description: "Generative AI applied to real software workflows.", technologies: ["OpenAI API", "Anthropic SDK", "RAG", "Embeddings", "Function Calling", "Skill-based agents"] },
    { id: "qa", title: "QA & Testing", description: "UI and API automation integrated into delivery.", technologies: ["Playwright", "Selenium", "Jest", "Vitest", "pytest", "Postman"] },
    { id: "data", title: "Data", description: "Relational persistence and semantic retrieval.", technologies: ["MySQL", "SQL Server", "SQLite", "Stored procedures", "Cosine similarity"] },
    { id: "cloud", title: "DevOps & Cloud", description: "Reproducible environments and quality-gated delivery.", technologies: ["Docker", "GitHub Actions", "Terraform", "AWS", "Gunicorn"] },
  ],
  projects: [
    { id: "documente", name: "DocuMente", type: "Fullstack RAG system", status: "Completed", summary: "Upload PDF/TXT documents, generate embeddings, retrieve relevant passages, and answer with citable sources.", technologies: ["React", "TypeScript", "Node.js", "SQLite", "OpenAI", "Docker"], links: [{ label: "Repository", href: "https://github.com/AruHonshou/Documente" }, { label: "Demo", href: "https://aruhonshou.github.io/Documente/#/dashboard" }] },
    { id: "qapilot", name: "QAPilot", type: "AI QA agent", status: "In active development", summary: "Turns functional requirements into test cases, runs UI and API tests, analyzes failures, and generates reports.", technologies: ["React", "TypeScript", "Playwright", "OpenAI", "SQLite", "Docker"], links: [{ label: "Repository", href: "https://github.com/AruHonshou/QAPilot/tree/kendall" }] },
    { id: "rrhh", name: "HR System", type: "Fullstack administrative product", status: "Completed", summary: "Digitized Human Resources processes for Fundacion Centro VRAI, replacing a paper-based operation.", impact: "Approximately 80% less administrative time.", technologies: ["React", "Node.js", "Express", "MySQL", "JWT"], links: [{ label: "Repository", href: "https://github.com/AruHonshou/Sistema-Recursos-Humanos" }] },
    { id: "openai-bot", name: "OpenAI Chatbot", type: "Fullstack AI application", status: "Completed", summary: "React frontend and NestJS API with conversational chat, model comparison, and vision capabilities.", technologies: ["React", "TypeScript", "NestJS", "OpenAI API", "TailwindCSS"], links: [{ label: "Frontend", href: "https://github.com/AruHonshou/OpenAIBOTFrontend" }, { label: "Backend", href: "https://github.com/AruHonshou/OpenAIBOTBackend" }] },
    { id: "infra", name: "Automated Infrastructure", type: "Terraform + AWS + CI/CD", status: "Completed", summary: "Infrastructure as code for a containerized Flask API, with testing, build, and deployment pipelines.", impact: "17 reproducible AWS resources and a multi-stage image reduced to 140 MB.", technologies: ["Terraform", "AWS", "Docker", "Flask", "GitHub Actions", "pytest"], links: [] },
    { id: "aru", name: "Aru Portfolio", type: "Interactive portfolio", status: "Active", summary: "A technical personal brand with anime/chibi styling, section navigation, and a local virtual assistant.", technologies: ["HTML", "CSS", "JavaScript", "Vite", "GitHub Pages"], links: [{ label: "Repository", href: "https://github.com/AruHonshou/Aru" }, { label: "Demo", href: "https://aruhonshou.github.io/Aru/portfolio.html" }] },
  ],
  experience: [
    { id: "novacomp", title: "QA Engineer / QA Lead", organization: "Novacomp · Client: Davivienda Bank Costa Rica", period: "2025 — 2026", summary: "QA automation and leadership in a remote AWS-based banking environment.", highlights: ["Introduced the team's first Playwright and TypeScript automation strategy.", "Integrated GitHub Actions CI/CD and reduced the test cycle by approximately 40%.", "Led the QA team after seven months and validated REST APIs on AWS."] },
    { id: "freelance", title: "Fullstack Developer", organization: "Freelance · Costa Rica and the United States", period: "2023 — Present", summary: "Web products, APIs, databases, and AI integrations for more than 10 clients.", highlights: ["React + TypeScript applications and REST/GraphQL APIs.", "Node.js, Express, and NestJS backends.", "OpenAI API, Anthropic SDK, RAG, and embedding integrations."] },
  ],
  education: [
    { id: "cenfotec", title: "AI 360: AI-Augmented Software Engineering", organization: "CENFOTEC University", period: "2026 — Present", summary: "AI across the SDLC, agent-assisted development, and applied AI in software delivery.", highlights: [] },
    { id: "uia", title: "Bachelor's in Information Systems Engineering", organization: "Universidad Internacional de las Americas", period: "2021 — 2025", summary: "Graduated.", highlights: [] },
    { id: "cccn", title: "Advanced English B2+", organization: "Costa Rican-North American Cultural Center", period: "Completed", summary: "Advanced English studies.", highlights: [] },
  ],
  certifications: ["TypeScript: Complete Guide — DevTalles / Udemy", "React: From Zero to Expert, Hooks and MERN — DevTalles / Udemy", "Node.js: From Zero to Expert — DevTalles / Udemy", "NestJS: Microservices and Scalable Applications — DevTalles / Udemy", "Playwright: Test Automation — DevTalles / Udemy", "Docker: A Practical Guide for Developers — DevTalles / Udemy", "MySQL: Relational Databases — DevTalles / Udemy"],
  contact: [{ label: "Email", href: "mailto:kendallavd@gmail.com" }, { label: "GitHub", href: "https://github.com/AruHonshou" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/kendall-valverde-diaz-aru/" }],
};
