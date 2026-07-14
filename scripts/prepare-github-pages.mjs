import { cp, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/client");
const siteRoot = path.join(root, "Portfolio");
await rm(siteRoot, { recursive: true, force: true });
await mkdir(siteRoot, { recursive: true });

for (const entry of ["es", "en", "index.html"]) {
  await rename(path.join(root, entry), path.join(siteRoot, entry));
}

for (const entry of await readdir(root)) {
  if (entry === "Portfolio" || entry === "es" || entry === "en" || entry === "index.html") continue;
  await cp(path.join(root, entry), path.join(siteRoot, entry), { recursive: true });
}

async function prefixHtml(filePath) {
  const source = await readFile(filePath, "utf8");
  const prefixed = source
    .replaceAll('"/_next/', '"/Portfolio/_next/')
    .replaceAll('"/assets/', '"/Portfolio/assets/')
    .replaceAll('"/favicon', '"/Portfolio/favicon')
    .replaceAll('"/og.png', '"/Portfolio/og.png')
    .replaceAll("'/", "'/Portfolio/");
  await writeFile(filePath, prefixed);
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(entryPath);
    else if (entry.name.endsWith(".html")) await prefixHtml(entryPath);
  }
}

await walk(siteRoot);
console.log("GitHub Pages artifact prepared: dist/client/Portfolio");
