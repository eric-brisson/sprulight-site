import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs");
const origin = "https://sprulight.com";
const problems = [];
const fail = (message) => problems.push(message);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
    ),
  );
  return files.flat();
}

const exists = (file) => access(file).then(() => true, () => false);

function localFile(url, fromPage) {
  const clean = url.split("#")[0].split("?")[0];
  let pathname;
  if (clean.startsWith(origin)) pathname = clean.slice(origin.length) || "/";
  else if (clean.startsWith("/")) pathname = clean;
  else pathname = new URL(clean, origin + fromPage).pathname;
  const file = path.join(root, decodeURIComponent(pathname));
  return pathname.endsWith("/") ? path.join(file, "index.html") : file;
}

function attributeValues(html) {
  const found = [];
  for (const match of html.matchAll(/<(\w+)\b([^>]*)>/g)) {
    const [, tag, attributes] = match;
    for (const attribute of attributes.matchAll(/\b(href|src|srcset|content|action)="([^"]*)"/g)) {
      found.push({ tag, name: attribute[1], value: attribute[2], attributes });
    }
  }
  return found;
}

const files = await walk(root);
const pages = files.filter((file) => file.endsWith(".html"));
const ids = new Map();
const pageHTML = new Map();

for (const page of pages) {
  const html = await readFile(page, "utf8");
  const pagePath = "/" + path.relative(root, page).replace(/index\.html$/, "");
  pageHTML.set(pagePath, html);
  ids.set(pagePath, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])));
}

const thirdPartyHosts = new Set();
const outboundLinks = new Set();
const allowedLinkHosts = new Set(["docs.github.com"]);

for (const [pagePath, html] of pageHTML) {
  const label = `${pagePath || "/"}`;
  for (const { tag, name, value, attributes } of attributeValues(html)) {
    if (name === "content" && !/^(https?:)?\/\//.test(value)) continue;
    if (name === "content" && tag === "meta" && !/property="og:(url|image)"/.test(attributes)) continue;
    if (value === "" || value.startsWith("mailto:")) continue;

    if (/^https?:\/\//.test(value) && !value.startsWith(origin)) {
      const host = new URL(value).host;
      const isPlainLink = tag === "a" && name === "href";
      if (isPlainLink && allowedLinkHosts.has(host)) {
        outboundLinks.add(value);
        continue;
      }
      thirdPartyHosts.add(host);
      fail(`${label}: external URL ${value} in <${tag} ${name}>`);
      continue;
    }

    const hashIndex = value.indexOf("#");
    const fragment = hashIndex >= 0 ? value.slice(hashIndex + 1) : "";
    if (value.startsWith("#")) {
      if (!ids.get(pagePath).has(fragment)) fail(`${label}: missing anchor ${value}`);
      continue;
    }
    const target = localFile(value, pagePath);
    if (!(await exists(target))) {
      fail(`${label}: <${tag} ${name}="${value}"> does not resolve to a file`);
    } else if (fragment && target.endsWith(".html")) {
      const targetPath = "/" + path.relative(root, target).replace(/index\.html$/, "");
      if (!ids.get(targetPath)?.has(fragment)) fail(`${label}: missing anchor #${fragment} in ${value}`);
    }
  }

  if (!/<html lang="en">/.test(html)) fail(`${label}: missing html lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${label}: missing title`);
  if (!/<meta name="description" content="[^"]+">/.test(html)) fail(`${label}: missing description`);
  const noindex = /<meta name="robots" content="noindex">/.test(html);
  if (!noindex) {
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
    const expected = origin + pagePath;
    if (canonical !== expected) fail(`${label}: canonical is ${canonical}, expected ${expected}`);
    for (const property of ["og:title", "og:description", "og:url", "og:image", "og:type"]) {
      if (!html.includes(`property="${property}"`)) fail(`${label}: missing ${property}`);
    }
  }
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  if (h1Count !== 1) fail(`${label}: ${h1Count} h1 elements`);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(image[0])) fail(`${label}: image without alt ${image[0]}`);
  }
  if (/<script\b/i.test(html)) fail(`${label}: contains a script`);
  if (/<(iframe|form|embed|object)\b/i.test(html)) fail(`${label}: contains an iframe, form or embed`);
}

const inventory = await readFile(path.join(root, "..", "SCREENSHOTS.md"), "utf8");
const inventoryNames = new Set([...inventory.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((match) => match[1]));
const pageNames = new Set();
for (const html of pageHTML.values()) {
  for (const match of html.matchAll(/data-asset="([^"]+)"/g)) pageNames.add(match[1]);
}
for (const name of pageNames) {
  if (!inventoryNames.has(name)) fail(`screenshot ${name} is on the page but not in SCREENSHOTS.md`);
}
for (const name of inventoryNames) {
  if (!pageNames.has(name)) fail(`screenshot ${name} is in SCREENSHOTS.md but not on the page`);
}

const css = await readFile(path.join(root, "assets/style.css"), "utf8");
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  const value = match[1];
  if (/^(https?:)?\/\//.test(value)) fail(`style.css: external URL ${value}`);
  else if (!(await exists(localFile(value, "/")))) fail(`style.css: ${value} does not exist`);
}
if (/@import/.test(css)) fail("style.css: uses @import");

const fontFiles = [...css.matchAll(/url\("([^"]+\.woff2)"\)/g)].map((match) => match[1]);
for (const font of fontFiles) {
  const family = font.match(/\/(\w+)-/)[1];
  if (!(await exists(path.join(root, `assets/fonts/${family}-OFL.txt`)))) fail(`no license file for ${font}`);
}

function parseVariables(block) {
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
}
const rootBlocks = [
  { condition: "", variables: parseVariables(css.match(/^:root \{([^}]*)\}/m)[1]) },
  ...[...css.matchAll(/@media ([^{]+)\{\s*:root \{([^}]*)\}\s*\}/g)].map((match) => ({
    condition: match[1],
    variables: parseVariables(match[2]),
  })),
];

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const pairs = [
  ["--text", "--bg", 4.5],
  ["--text", "--panel", 4.5],
  ["--text-2", "--bg", 4.5],
  ["--text-2", "--panel", 4.5],
  ["--text-2", "--ph", 4.5],
  ["--muted", "--bg", 4.5],
  ["--muted", "--panel", 4.5],
  ["--muted", "--ph", 4.5],
  ["--link", "--bg", 4.5],
  ["--on-accent", "--accent", 4.5],
  ["--focus", "--bg", 3],
  ["--line", "--bg", 1],
];
const report = [];
for (const dark of [false, true]) {
  for (const more of [false, true]) {
    const variables = {};
    for (const block of rootBlocks) {
      const wantsDark = block.condition.includes("dark");
      const wantsMore = block.condition.includes("more");
      if ((wantsDark && !dark) || (wantsMore && !more)) continue;
      Object.assign(variables, block.variables);
    }
    for (const [foreground, background, minimum] of pairs) {
      const value = ratio(variables[foreground], variables[background]);
      const name = `${dark ? "dark" : "light"}${more ? " + more contrast" : ""}: ${foreground} on ${background}`;
      report.push(`${value.toFixed(2).padStart(5)}:1  ${name}`);
      if (value < minimum) fail(`contrast ${value.toFixed(2)}:1 below ${minimum}:1 for ${name}`);
    }
  }
}

console.log(`${pages.length} pages, ${files.length} files checked`);
console.log(`Third-party hosts loaded from or disallowed: ${thirdPartyHosts.size === 0 ? "none" : [...thirdPartyHosts].join(", ")}`);
console.log(`Outbound links (plain links the visitor can click, never loaded): ${outboundLinks.size === 0 ? "none" : [...outboundLinks].join(", ")}`);
console.log("Contrast:\n" + report.filter((line) => !line.includes("--line")).join("\n"));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("\nAll checks passed.");
