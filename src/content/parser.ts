export interface MarkdownSection {
  heading: string;
  level: number;
  body: string;
}

const headingPattern = /^(#{1,6})\s+(.+)$/gm;

export function parseMarkdownSections(markdown: string): MarkdownSection[] {
  const matches = [...markdown.matchAll(headingPattern)];
  return matches.map((match, index) => ({
    heading: match[2].trim(),
    level: match[1].length,
    body: markdown.slice((match.index ?? 0) + match[0].length, matches[index + 1]?.index ?? markdown.length).trim(),
  }));
}

export function findSection(markdown: string, aliases: string[]): MarkdownSection | undefined {
  const normalized = aliases.map((alias) => alias.toLocaleLowerCase("es"));
  return parseMarkdownSections(markdown).find((section) =>
    normalized.some((alias) => section.heading.toLocaleLowerCase("es").includes(alias)),
  );
}

export function markdownBullets(body: string): string[] {
  return body
    .split(/\r?\n/)
    .filter((line) => /^\s*-\s+/.test(line))
    .map((line) => line.replace(/^\s*-\s+/, "").trim())
    .filter(Boolean);
}
