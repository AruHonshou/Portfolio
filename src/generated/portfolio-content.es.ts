import type { PortfolioContent } from "../content/types";

export const portfolioEs: PortfolioContent = {
  locale: "es",
  name: "Kendall Valverde Díaz",
  shortName: "Kendall",
  role: "Software Engineer · AI-Augmented Development",
  location: "Costa Rica",
  intro: "Construyo software fullstack con IA aplicada, automatización QA y una obsesión práctica por la calidad.",
  about: [
    "Soy un perfil híbrido entre frontend, backend, QA Automation e inteligencia artificial aplicada. Trabajo con React, TypeScript y Node.js para convertir necesidades complejas en productos mantenibles y demostrables.",
    "Mi experiencia combina liderazgo QA en un entorno bancario, desarrollo independiente para clientes de Costa Rica y Estados Unidos, sistemas RAG, agentes, CI/CD e infraestructura reproducible.",
  ],
  availability: "Disponible para oportunidades fullstack, frontend, QA o IA, remotas o presenciales en Costa Rica.",
  skills: [
    { id: "frontend", title: "Frontend", description: "Interfaces modernas, responsive y orientadas a producto.", technologies: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "TailwindCSS", "Vite", "Zustand"] },
    { id: "backend", title: "Backend & APIs", description: "Servicios por capas, autenticación y contratos claros.", technologies: ["Node.js", "Express", "NestJS", "REST", "GraphQL", "JWT", "Zod"] },
    { id: "ai", title: "IA & Agentes", description: "IA generativa aplicada a flujos reales de software.", technologies: ["OpenAI API", "Anthropic SDK", "RAG", "Embeddings", "Function Calling", "Agentes con skills"] },
    { id: "qa", title: "QA & Testing", description: "Automatización de UI y API integrada al ciclo de entrega.", technologies: ["Playwright", "Selenium", "Jest", "Vitest", "pytest", "Postman"] },
    { id: "data", title: "Datos", description: "Persistencia relacional y recuperación semántica.", technologies: ["MySQL", "SQL Server", "SQLite", "Stored procedures", "Similitud coseno"] },
    { id: "cloud", title: "DevOps & Cloud", description: "Entornos reproducibles y despliegues con controles de calidad.", technologies: ["Docker", "GitHub Actions", "Terraform", "AWS", "Gunicorn"] },
  ],
  projects: [
    { id: "documente", name: "DocuMente", type: "Sistema RAG fullstack", status: "Completado", summary: "Permite cargar documentos PDF/TXT, generar embeddings, recuperar fragmentos relevantes y responder con fuentes citables.", technologies: ["React", "TypeScript", "Node.js", "SQLite", "OpenAI", "Docker"], links: [{ label: "Repositorio", href: "https://github.com/AruHonshou/Documente" }, { label: "Demo", href: "https://aruhonshou.github.io/Documente/#/dashboard" }] },
    { id: "qapilot", name: "QAPilot", type: "Agente de QA con IA", status: "En desarrollo activo", summary: "Transforma requerimientos funcionales en casos de prueba, ejecuta pruebas UI y API, analiza fallos y genera reportes.", technologies: ["React", "TypeScript", "Playwright", "OpenAI", "SQLite", "Docker"], links: [{ label: "Repositorio", href: "https://github.com/AruHonshou/QAPilot/tree/kendall" }] },
    { id: "rrhh", name: "Sistema RRHH", type: "Producto fullstack administrativo", status: "Completado", summary: "Digitalizo procesos de Recursos Humanos para Fundacion Centro VRAI, reemplazando una operacion basada en papel.", impact: "Reduccion aproximada del 80% en tiempo administrativo.", technologies: ["React", "Node.js", "Express", "MySQL", "JWT"], links: [{ label: "Repositorio", href: "https://github.com/AruHonshou/Sistema-Recursos-Humanos" }] },
    { id: "openai-bot", name: "OpenAI Chatbot", type: "Aplicacion fullstack con IA", status: "Completado", summary: "Chatbot con frontend React y API NestJS, comparacion de modelos y capacidades de vision.", technologies: ["React", "TypeScript", "NestJS", "OpenAI API", "TailwindCSS"], links: [{ label: "Frontend", href: "https://github.com/AruHonshou/OpenAIBOTFrontend" }, { label: "Backend", href: "https://github.com/AruHonshou/OpenAIBOTBackend" }] },
    { id: "infra", name: "Infraestructura Automatizada", type: "Terraform + AWS + CI/CD", status: "Completado", summary: "Infraestructura como codigo para una API Flask containerizada, con pipelines de prueba, build y despliegue.", impact: "17 recursos AWS reproducibles y una imagen multi-stage reducida a 140 MB.", technologies: ["Terraform", "AWS", "Docker", "Flask", "GitHub Actions", "pytest"], links: [] },
    { id: "aru", name: "Aru Portfolio", type: "Portfolio interactivo", status: "Activo", summary: "Marca personal tecnica con estetica anime/chibi, navegacion por secciones y una asistente virtual local.", technologies: ["HTML", "CSS", "JavaScript", "Vite", "GitHub Pages"], links: [{ label: "Repositorio", href: "https://github.com/AruHonshou/Aru" }, { label: "Demo", href: "https://aruhonshou.github.io/Aru/portfolio.html" }] },
  ],
  experience: [
    { id: "novacomp", title: "QA Engineer / Líder de QA", organization: "Novacomp · Cliente Davivienda Bank Costa Rica", period: "2025 — 2026", summary: "Automatización y liderazgo QA en un entorno bancario remoto sobre AWS.", highlights: ["Primera estrategia de automatización del equipo con Playwright y TypeScript.", "CI/CD con GitHub Actions y reducción aproximada del 40% en el ciclo de pruebas.", "Dirección del equipo QA a los siete meses y validación de APIs REST en AWS."] },
    { id: "freelance", title: "Desarrollador Fullstack", organization: "Freelance · Costa Rica y Estados Unidos", period: "2023 — Presente", summary: "Productos web, APIs, bases de datos e integraciones de IA para mas de 10 clientes.", highlights: ["Aplicaciones React + TypeScript y APIs REST/GraphQL.", "Backends con Node.js, Express y NestJS.", "Integraciones con OpenAI API, Anthropic SDK, RAG y embeddings."] },
  ],
  education: [
    { id: "cenfotec", title: "IA 360: Ingeniería del Software Aumentada con IA", organization: "Universidad CENFOTEC", period: "2026 — Presente", summary: "SDLC con IA, desarrollo asistido por agentes y aplicación de IA al ciclo de vida del software.", highlights: [] },
    { id: "uia", title: "Bachillerato en Ingeniería en Sistemas de Información", organization: "Universidad Internacional de las Américas", period: "2021 — 2025", summary: "Titulado.", highlights: [] },
    { id: "cccn", title: "Inglés avanzado B2+", organization: "Centro Cultural Costarricense Norteamericano", period: "Completado", summary: "Formación avanzada en inglés.", highlights: [] },
  ],
  certifications: ["TypeScript: Guia completa — DevTalles / Udemy", "React: De cero a experto: Hooks y MERN — DevTalles / Udemy", "Node.js: De cero a experto — DevTalles / Udemy", "NestJS: Microservicios y aplicaciones escalables — DevTalles / Udemy", "Playwright: Automatizacion de pruebas — DevTalles / Udemy", "Docker: Guia practica para desarrolladores — DevTalles / Udemy", "MySQL: Bases de datos relacionales — DevTalles / Udemy"],
  contact: [{ label: "Email", href: "mailto:kendallavd@gmail.com" }, { label: "GitHub", href: "https://github.com/AruHonshou" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/kendall-valverde-diaz-aru/" }],
};
