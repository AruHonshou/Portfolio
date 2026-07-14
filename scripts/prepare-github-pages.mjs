import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/client");

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

await walk(root);
console.log("GitHub Pages artifact prepared: dist/client");
