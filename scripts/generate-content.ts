import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseMarkdownSections } from "../src/content/parser";
import { sanitizePublicText } from "../src/content/sanitizer";

const root = process.cwd();
const sourcePath = path.join(root, "sobremi.md");
const outputPath = path.join(root, "src", "generated", "source-snapshot.es.json");
const source = await readFile(sourcePath, "utf8");
const sections = parseMarkdownSections(source);

const requiredFacts = ["Kendall", "DocuMente", "QAPilot", "Novacomp", "React", "TypeScript"];
const missing = requiredFacts.filter((fact) => !source.includes(fact));
if (missing.length > 0) throw new Error(`Faltan hechos requeridos en sobremi.md: ${missing.join(", ")}`);

const snapshot = {
  generatedAt: new Date().toISOString(),
  source: "sobremi.md",
  sha256: createHash("sha256").update(source).digest("hex"),
  sectionCount: sections.length,
  headings: sections.map((section) => sanitizePublicText(section.heading)),
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Contenido sincronizado: ${sections.length} encabezados, ${missing.length} hechos requeridos ausentes.`);
