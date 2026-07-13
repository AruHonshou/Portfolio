import { portfolioEs } from "../src/generated/portfolio-content.es";
import { portfolioEn } from "../src/content/translations/portfolio.en";

const issues: string[] = [];
const compareIds = (label: string, spanish: { id: string }[], english: { id: string }[]) => {
  const expected = spanish.map(({ id }) => id);
  const actual = english.map(({ id }) => id);
  if (expected.join("|") !== actual.join("|")) issues.push(`${label}: las claves no coinciden`);
};

compareIds("skills", portfolioEs.skills, portfolioEn.skills);
compareIds("projects", portfolioEs.projects, portfolioEn.projects);
compareIds("experience", portfolioEs.experience, portfolioEn.experience);
compareIds("education", portfolioEs.education, portfolioEn.education);
if (portfolioEs.certifications.length !== portfolioEn.certifications.length) issues.push("certifications: cantidad diferente");
if (portfolioEs.contact.length !== portfolioEn.contact.length) issues.push("contact: cantidad diferente");

if (issues.length) throw new Error(`Traducciones incompletas:\n${issues.join("\n")}`);
console.log("Traducciones validadas: no faltan claves ES/EN.");
