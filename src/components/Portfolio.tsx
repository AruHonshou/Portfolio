"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Menu, MessageCircle, Minus, X } from "lucide-react";
import { portfolioEs } from "../generated/portfolio-content.es";
import { portfolioEn } from "../content/translations/portfolio.en";
import type { Locale, PortfolioContent, TimelineItem } from "../content/types";
import { labels } from "../i18n/labels";
import { GraphicsBoundary } from "./GraphicsBoundary";
import { MotionTitle, type MotionPreset } from "./MotionTitle";

const FluidBackground = lazy(() => import("../graphics/fluid/FluidBackground"));
const sections = ["about", "skills", "projects", "experience", "education", "certifications", "contact"] as const;
const navigationSections = sections.filter((section) => section !== "contact");
const titlePresets: MotionPreset[] = ["rise", "fall", "scale", "blur", "flip"];
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

function emitFluidImpulse(sectionId: string, index = 1) {
  window.dispatchEvent(new CustomEvent("portfolio-fluid-impulse", { detail: { sectionId, index } }));
}

function projectTitleSize(name: string) {
  const longestWord = Math.max(...name.split(/\s+/).map((word) => word.length));
  return longestWord >= 13 || name.length >= 24 ? "compact" : "normal";
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const stored = window.localStorage.getItem("portfolio-reduced-motion");
      setReduced(stored === "true" || (stored === null && media.matches));
    };
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const toggle = () => setReduced((value) => {
    const next = !value; window.localStorage.setItem("portfolio-reduced-motion", String(next)); return next;
  });
  return [reduced, toggle] as const;
}

function SectionHeading({ id, children, preset, reduced }: { id: string; children: string; preset: MotionPreset; reduced: boolean }) {
  return <header className="section-heading" data-motion-state={reduced ? "static" : "pending"}><MotionTitle as="h2" id={id} text={children} preset={preset} intensity="section" reduced={reduced} syncRule /><div aria-hidden="true" /></header>;
}

function DetailList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return <section className="timeline-detail"><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

function Timeline({ items, locale, preset, reduced }: { items: TimelineItem[]; locale: Locale; preset: MotionPreset; reduced: boolean }) {
  const copy = labels[locale];
  return <div className="timeline">
    <svg className="timeline-line" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0 V1000" /></svg>
    <div className="timeline-items">{items.map((item) => <article className="timeline-item" key={item.id}>
      <span className="timeline-dot" aria-hidden="true" />
      <div className="timeline-content">
        <p className="eyebrow">{item.period}</p><MotionTitle as="h3" text={item.title} preset={preset} intensity="subtle" reduced={reduced} /><p className="organization">{item.organization}</p><p className="timeline-summary">{item.summary}</p>
        {item.highlights.length > 0 && <ul className="timeline-highlights">{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
        {(item.responsibilities?.length || item.results?.length) && <div className="timeline-detail-grid"><DetailList title={copy.responsibilities} items={item.responsibilities} /><DetailList title={copy.results} items={item.results} /></div>}
        {item.technologies?.length && <div className="timeline-tools"><h4>{copy.tools}</h4><ul className="tech-list">{item.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul></div>}
      </div>
    </article>)}</div>
  </div>;
}

function ProjectStory({ content, locale, reduced }: { content: PortfolioContent; locale: Locale; reduced: boolean }) {
  const storyRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const story = storyRef.current; const track = trackRef.current;
    if (!story || !track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth < 900 || reduced) {
        track.style.transform = "none"; story.style.height = "auto"; story.style.removeProperty("--project-progress"); return;
      }
      const maxX = Math.max(track.scrollWidth - window.innerWidth, 0);
      story.style.height = `${window.innerHeight + maxX}px`;
      const rect = story.getBoundingClientRect();
      const distance = Math.max(story.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
      track.style.transform = `translate3d(${-progress * maxX}px,0,0)`;
      story.style.setProperty("--project-progress", `${progress * 100}%`);
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(track); observer.observe(document.documentElement);
    update(); window.addEventListener("scroll", requestUpdate, { passive: true }); window.addEventListener("resize", requestUpdate, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); };
  }, [content.projects.length, reduced]);

  return <section id="projects" className="projects-story" ref={storyRef} aria-labelledby="projects-title">
    <div className="projects-sticky"><div className="projects-header"><SectionHeading id="projects-title" preset="flip" reduced={reduced}>{labels[locale].projects}</SectionHeading><span className="project-progress" aria-hidden="true" /></div>
      <div className="project-track" ref={trackRef}>{content.projects.map((project, index) => { const preset = titlePresets[index % titlePresets.length]; return <article className="project-card" data-title-size={projectTitleSize(project.name)} key={project.id}>
        <div className={`project-cover cover-${(index % 3) + 1}`} aria-hidden="true"><MotionTitle as="strong" text={project.name} preset={preset} intensity="subtle" reduced={reduced} decorative /><i /></div>
        <div className="project-body"><div><p className="eyebrow">{project.type}</p><MotionTitle as="h3" text={project.name} preset={preset} intensity="subtle" reduced={reduced} /></div><p>{project.summary}</p>{project.impact && <p className="project-impact">{project.impact}</p>}
          <ul className="tech-list">{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
          <footer><span>{labels[locale].status}: {project.status}</span><div>{project.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div></footer>
        </div>
      </article>; })}</div>
    </div>
  </section>;
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
  const displayName = useMemo(() => content.name.replace("Díaz", "Diaz"), [content.name]);
  const nameParts = useMemo(() => displayName.split(" "), [displayName]);

  useEffect(() => { document.documentElement.dataset.motion = reduced ? "reduced" : "full"; }, [reduced]);
  useEffect(() => { window.localStorage.setItem("portfolio-language", locale); updateSeo(locale, content); }, [locale, content]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      setActive(entry.target.id);
      emitFluidImpulse(entry.target.id, Math.max(sections.indexOf(entry.target.id as typeof sections[number]), 0) + 1);
    }), { rootMargin: "-35% 0px -55%" });
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
    window.history.pushState({}, "", `/${next}${window.location.hash}`); setLocale(next); setMenuOpen(false);
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
        {navigationSections.map((section) => <a href={`#${section}`} data-active={active === section} onClick={navigate} key={section}>{copy[section]}</a>)}
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
        <MotionTitle as="h1" id="hero-title" text={displayName} lines={nameParts} preset="blur" intensity="hero" reduced={reduced} trigger="load" />
        <div className="hero-bottom"><p>{content.intro}</p><div className="hero-actions"><a className="button primary" href="#projects" onPointerEnter={() => emitFluidImpulse(active, 8)}>{copy.viewProjects}<ArrowDown size={17} aria-hidden="true" /></a><a className="button secondary" href="#contact" onPointerEnter={() => emitFluidImpulse(active, 9)}>{copy.contact}<ArrowUpRight size={17} aria-hidden="true" /></a></div></div>
        <a className="scroll-cue" href="#about"><span>{copy.scroll}</span><ArrowDown size={16} aria-hidden="true" /></a>
      </section>

      <section id="about" className="section about" aria-labelledby="about-title"><SectionHeading id="about-title" preset="rise" reduced={reduced}>{copy.about}</SectionHeading><div className="about-grid"><div><p className="about-lead">{content.about[0]}</p><p>{content.about[1]}</p></div><aside><div className="portrait-system" aria-hidden="true"><span>K</span><i /><b>V</b></div><dl><div><dt>{copy.location}</dt><dd>{content.location}</dd></div><div><dt>{copy.availability}</dt><dd>{content.availability}</dd></div></dl></aside></div></section>

      <section id="skills" className="section skills" aria-labelledby="skills-title"><SectionHeading id="skills-title" preset="scale" reduced={reduced}>{copy.skills}</SectionHeading><div className="skill-grid">{content.skills.map((skill, index) => <article key={skill.id}><MotionTitle as="h3" text={skill.title} preset={titlePresets[index % titlePresets.length]} intensity="subtle" reduced={reduced} /><p>{skill.description}</p><ul>{skill.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul></article>)}</div></section>

      <ProjectStory content={content} locale={locale} reduced={reduced} />

      <section id="experience" className="section experience" aria-labelledby="experience-title"><SectionHeading id="experience-title" preset="fall" reduced={reduced}>{copy.experience}</SectionHeading><Timeline items={content.experience} locale={locale} preset="fall" reduced={reduced} /></section>
      <section id="education" className="section education" aria-labelledby="education-title"><SectionHeading id="education-title" preset="rise" reduced={reduced}>{copy.education}</SectionHeading><Timeline items={content.education} locale={locale} preset="rise" reduced={reduced} /></section>
      <section id="certifications" className="section certifications" aria-labelledby="certifications-title"><SectionHeading id="certifications-title" preset="scale" reduced={reduced}>{copy.certifications}</SectionHeading><ol>{content.certifications.map((certification) => <li key={certification}><p>{certification}</p></li>)}</ol></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="eyebrow">{copy.contact}</p><MotionTitle as="h2" id="contact-title" text={copy.contactLead} preset="blur" intensity="section" reduced={reduced} /><p>{copy.contactCopy}</p><div className="contact-links">{content.contact.map((link) => { const Icon = link.label === "Email" ? Mail : link.label === "GitHub" ? Github : link.label === "WhatsApp" ? MessageCircle : Linkedin; return <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={link.href}><Icon size={20} aria-hidden="true" />{link.label}<ArrowUpRight size={17} aria-hidden="true" /></a>; })}</div><footer><span>© {new Date().getFullYear()} {content.name}</span><a href="#hero">TOP ↑</a></footer></section>
    </main>
    <div className="sr-only" aria-live="polite">{copy.localeChanged}</div>
  </>;
}
