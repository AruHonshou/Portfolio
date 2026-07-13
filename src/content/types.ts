export type Locale = "es" | "en";

export interface LinkItem {
  label: string;
  href: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

export interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  summary: string;
  impact?: string;
  technologies: string[];
  links: LinkItem[];
}

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface PortfolioContent {
  locale: Locale;
  name: string;
  shortName: string;
  role: string;
  location: string;
  intro: string;
  about: string[];
  availability: string;
  skills: SkillGroup[];
  projects: Project[];
  experience: TimelineItem[];
  education: TimelineItem[];
  certifications: string[];
  contact: LinkItem[];
}
