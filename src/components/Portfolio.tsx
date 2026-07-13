"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { animate, stagger } from "animejs";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Menu, Minus, X } from "lucide-react";
import { portfolioEs } from "../generated/portfolio-content.es";
import { portfolioEn } from "../content/translations/portfolio.en";
import type { Locale, PortfolioContent, TimelineItem } from "../content/types";
import { labels } from "../i18n/labels";
import { GraphicsBoundary } from "./GraphicsBoundary";

const FluidBackground = lazy(() => import("../graphics/fluid/FluidBackground"));
const sections = ["about", "skills", "projects", "experience", "education", "certifications", "contact"] as const;
const navigationSections = sections.filter((section) => section !== "contact");
const subscribeToHydration = () => () => {};

function updateSeo(locale: Locale, content: PortfolioContent) {
  document.documentElement.lang = locale;
  document.title = `${content.name} · Software Engineer`;
  const description = locale === "es" ? "Software Engineer especializado en desarrollo fullstack, IA aplicada y QA Automation." : "Software Engineer focused on fullstack development, applied AI, and QA automation.";
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:locale"]')?.setAttribute("content", locale === "es" ? "es_CR" : "en_US");
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", `${window.location.origin}/og.png`);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", `${window.location.origin}/og.png`);
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = `${window.location.origin}/${locale}`;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stored = window.localStorage.getItem("portfolio-reduced-motion");
    const sync = () => setReduced(stored === "true" || (stored === null && media.matches));
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const toggle = () => setReduced((value) => {
    const next = !value; window.localStorage.setItem("portfolio-reduced-motion", String(next)); return next;
  });
  return [reduced, toggle] as const;
}

function SectionHeading({ index, children }: { index: string; children: string }) {
  return <header className="section-heading"><span>{index}</span><h2>{children}</h2><div aria-hidden="true" /></header>;
}

function Timeline({ items }: { items: TimelineItem[] }) {
  return <div className="timeline"><svg className="timeline-line" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0 V1000" /></svg><div className="timeline-items">{items.map((item, index) => <article className="timeline-item" key={item.id}><span className="timeline-dot" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><p className="eyebrow">{item.period}</p><h3>{item.title}</h3><p className="organization">{item.organization}</p><p>{item.summary}</p>{item.highlights.length > 0 && <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}</div></article>)}</div></div>;
}

function ProjectStory({ content, locale }: { content: PortfolioContent; locale: Locale }) {
  const storyRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const story = storyRef.current; const track = trackRef.current;
    if (!story || !track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth < 900 || document.documentElement.dataset.motion === "reduced") { track.style.transform = "none"; return; }
      const rect = story.getBoundingClientRect();
      const distance = story.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / Math.max(distance, 1), 0), 1);
      const maxX = Math.max(track.scrollWidth - window.innerWidth + 96, 0);
      track.style.transform = `translate3d(${-progress * maxX}px,0,0)`;
      story.style.setProperty("--project-progress", `${progress * 100}%`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <section id="projects" className="projects-story" ref={storyRef} style={{ "--project-count": content.projects.length } as React.CSSProperties} aria-labelledby="projects-title"><div className="projects-sticky"><div className="projects-header"><SectionHeading index="04">{labels[locale].projects}</SectionHeading><span className="project-progress" aria-hidden="true" /></div><div className="project-track" ref={trackRef}>{content.projects.map((project, index) => <article className="project-card" key={project.id}><div className={`project-cover cover-${(index % 3) + 1}`} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><strong>{project.name}</strong><i /></div><div className="project-body"><div><p className="eyebrow">{project.type}</p><h3>{project.name}</h3></div><p>{project.summary}</p>{project.impact && <p className="project-impact">{project.impact}</p>}<ul className="tech-list">{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul><footer><span>{labels[locale].status}: {project.status}</span><div>{project.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div></footer></div></article>)}</div></div></section>;
}

export function Portfolio({ initialLocale }: { initialLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [reduced, toggleReduced] = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const content = locale === "es" ? portfolioEs : portfolioEn;
  const copy = labels[locale];
  const nameParts = useMemo(() => content.name.split(" "), [content.name]);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);
  useEffect(() => {
    window.localStorage.setItem("portfolio-language", locale);
    updateSeo(locale, content);
    if (!reduced) animate(".hero-word", { translateY: ["110%", "0%"], rotate: [2, 0], filter: ["blur(8px)", "blur(0px)"], delay: stagger(90), duration: 950, ease: "out(4)" });
  }, [locale, content, reduced]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: "-35% 0px -55%" });
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); } };
    document.addEventListener("keydown", close); document.body.classList.toggle("menu-locked", menuOpen);
    return () => { document.removeEventListener("keydown", close); document.body.classList.remove("menu-locked"); };
  }, [menuOpen]);

  const changeLocale = (next: Locale) => {
    if (next === locale) return;
    const hash = window.location.hash;
    window.history.pushState({}, "", `/${next}${hash}`);
    setLocale(next); setMenuOpen(false);
  };
  const navigate = () => setMenuOpen(false);

  return <>
    <a className="skip-link" href="#main">{copy.skip}</a>
    <div className="fallback-bg" aria-hidden="true" />
    <GraphicsBoundary><Suspense fallback={null}><FluidBackground reduced={reduced} /></Suspense></GraphicsBoundary>
    <div className="atmosphere" aria-hidden="true" />
    <header className="site-nav">
      <a className="brand" href="#hero" aria-label={`${content.shortName} — ${copy.scroll}`}>KV<span>.</span></a>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} id="primary-menu" aria-label={copy.nav}>
        {navigationSections.map((section, index) => <a href={`#${section}`} data-active={active === section} onClick={navigate} key={section}><span>{String(index + 2).padStart(2, "0")}</span>{copy[section]}</a>)}
        <a className="nav-contact" href="#contact" onClick={navigate}>{copy.contact}</a>
      </nav>
      <div className="nav-actions">
        <div className="locale-switch" role="group" aria-label="Language / Idioma"><button disabled={!hydrated} aria-pressed={locale === "es"} onClick={() => changeLocale("es")}>ES</button><i aria-hidden="true" /><button disabled={!hydrated} aria-pressed={locale === "en"} onClick={() => changeLocale("en")}>EN</button></div>
        <button disabled={!hydrated} className="icon-button motion-toggle" onClick={toggleReduced} title={reduced ? copy.motionOff : copy.motionOn} aria-label={reduced ? copy.motionOff : copy.motionOn}><Minus size={18} aria-hidden="true" /></button>
        <button disabled={!hydrated} ref={menuButtonRef} className="icon-button menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="primary-menu" aria-label={menuOpen ? copy.close : copy.menu}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
      <span className="nav-progress" style={{ "--active-index": String(Math.max(sections.indexOf(active as typeof sections[number]) + 1, 0)) } as React.CSSProperties} aria-hidden="true" />
    </header>
    <main id="main">
      <section id="hero" className="hero" aria-labelledby="hero-title">
        <div className="hero-meta"><span>CR / 09.93° N</span><span>{content.role}</span></div>
        <h1 id="hero-title" aria-label={content.name}>{nameParts.map((part) => <span className="hero-line" aria-hidden="true" key={part}><span className="hero-word">{part}</span></span>)}</h1>
        <div className="hero-bottom"><p>{content.intro}</p><div className="hero-actions"><a className="button primary" href="#projects">{copy.viewProjects}<ArrowDown size={17} aria-hidden="true" /></a><a className="button secondary" href="#contact">{copy.contact}<ArrowUpRight size={17} aria-hidden="true" /></a></div></div>
        <a className="scroll-cue" href="#about"><span>{copy.scroll}</span><ArrowDown size={16} aria-hidden="true" /></a>
      </section>

      <section id="about" className="section about" aria-labelledby="about-title"><SectionHeading index="02">{copy.about}</SectionHeading><div className="about-grid"><div><p className="about-lead">{content.about[0]}</p><p>{content.about[1]}</p></div><aside><div className="portrait-system" aria-hidden="true"><span>K</span><i /><b>V</b></div><dl><div><dt>{copy.location}</dt><dd>{content.location}</dd></div><div><dt>{copy.availability}</dt><dd>{content.availability}</dd></div></dl></aside></div></section>

      <section id="skills" className="section skills" aria-labelledby="skills-title"><SectionHeading index="03">{copy.skills}</SectionHeading><div className="skill-grid">{content.skills.map((skill, index) => <article key={skill.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{skill.title}</h3><p>{skill.description}</p><ul>{skill.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul></article>)}</div></section>

      <ProjectStory content={content} locale={locale} />

      <section id="experience" className="section experience" aria-labelledby="experience-title"><SectionHeading index="05">{copy.experience}</SectionHeading><Timeline items={content.experience} /></section>
      <section id="education" className="section education" aria-labelledby="education-title"><SectionHeading index="06">{copy.education}</SectionHeading><Timeline items={content.education} /></section>
      <section id="certifications" className="section certifications" aria-labelledby="certifications-title"><SectionHeading index="07">{copy.certifications}</SectionHeading><ol>{content.certifications.map((certification, index) => <li key={certification}><span>{String(index + 1).padStart(2, "0")}</span><p>{certification}</p></li>)}</ol></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="eyebrow">08 / {copy.contact}</p><h2 id="contact-title">{copy.contactLead}</h2><p>{copy.contactCopy}</p><div className="contact-links">{content.contact.map((link) => { const Icon = link.label === "Email" ? Mail : link.label === "GitHub" ? Github : Linkedin; return <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={link.href}><Icon size={20} aria-hidden="true" />{link.label}<ArrowUpRight size={17} aria-hidden="true" /></a>; })}</div><footer><span>© {new Date().getFullYear()} {content.name}</span><a href="#hero">TOP ↑</a></footer></section>
    </main>
    <div className="sr-only" aria-live="polite">{copy.localeChanged}</div>
  </>;
}
