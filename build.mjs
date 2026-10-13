import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const origin = "https://sprulight.com";
const appRepo =
  process.env.SPRULIGHT_APP_REPO ??
  path.join(os.homedir(), "Projects/github/supply-depot/SupplyDepot");

const pages = [
  {
    out: "index.html",
    path: "/",
    title: "SpruLight: miniature painting tracker for iPad and iPhone",
    description:
      "SpruLight tracks your miniatures collection and the time you spend assembling and painting each model. For iPad and iPhone.",
    source: { html: "src/home.html" },
  },
  {
    out: "features/index.html",
    path: "/features/",
    title: "Features | SpruLight",
    description:
      "How SpruLight fits into the miniature hobby: your collection, the Atelier, timed assembly and painting, a journal, paints and progress, on iPad and iPhone.",
    source: { html: "src/features.html" },
    nav: "navFeatures",
  },
  {
    out: "privacy/index.html",
    path: "/privacy/",
    title: "Privacy policy | SpruLight",
    description:
      "SpruLight doesn't collect or transmit your personal data to the developer. Everything you enter is stored locally on your device.",
    source: { markdown: "Reference/privacy-policy.md" },
    nav: "navPrivacy",
  },
  {
    out: "support/index.html",
    path: "/support/",
    title: "Support | SpruLight",
    description:
      "Contact and answers to common questions about SpruLight, the miniature painting tracker for iPad and iPhone.",
    source: { markdown: "Reference/support.md" },
    nav: "navSupport",
  },
  {
    out: "404.html",
    path: "/404.html",
    title: "Page not found | SpruLight",
    description: "This page doesn't exist.",
    source: {
      html: "src/not-found.html",
    },
    noindex: true,
  },
];

const escapeHTML = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function inline(source) {
  let text = escapeHTML(source);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(
    /(?<![\[(:\w])([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g,
    "[$1](mailto:$1)",
  );
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const local = href.startsWith(origin) ? href.slice(origin.length) || "/" : href;
    return `<a href="${local}">${label}</a>`;
  });
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return text;
}

function markdownToHTML(markdown) {
  const html = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list) {
      html.push(`<ul>\n${list.map((item) => `<li>${inline(item.join(" "))}</li>`).join("\n")}\n</ul>`);
    }
    list = null;
  };

  for (const line of markdown.split("\n")) {
    const heading = line.match(/^(#{1,3}) +(.+)$/);
    const item = line.match(/^- +(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const text = inline(heading[2]);
      html.push(`<h${level} id="${slug(text)}">${text}</h${level}>`);
    } else if (item) {
      flushParagraph();
      list ??= [];
      list.push([item[1]]);
    } else if (/^ +\S/.test(line) && list) {
      list.at(-1).push(line.trim());
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return html.join("\n");
}

function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Template has no value for {{${key}}}`);
    return values[key];
  });
}

const layout = await readFile(path.join(root, "src/layout.html"), "utf8");

for (const page of pages) {
  let content;
  if (page.source.markdown) {
    const file = path.join(appRepo, page.source.markdown);
    const markdown = await readFile(file, "utf8").catch(() => {
      throw new Error(
        `Can't read ${file}. Set SPRULIGHT_APP_REPO to the app repository's folder.`,
      );
    });
    content = `<article class="prose wrap narrow">\n${markdownToHTML(markdown)}\n</article>`;
  } else {
    content = (await readFile(path.join(root, page.source.html), "utf8")).trimEnd();
  }

  const url = origin + page.path;
  const html = fill(layout, {
    title: escapeHTML(page.title),
    description: escapeHTML(page.description),
    url,
    canonicalTag: page.noindex ? "" : `<link rel="canonical" href="${url}">\n`,
    robotsTag: page.noindex ? `<meta name="robots" content="noindex">\n` : "",
    navFeatures: page.nav === "navFeatures" ? ' aria-current="page"' : "",
    navSupport: page.nav === "navSupport" ? ' aria-current="page"' : "",
    navPrivacy: page.nav === "navPrivacy" ? ' aria-current="page"' : "",
    content,
  });

  const target = path.join(root, "docs", page.out);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
  console.log(`wrote docs/${page.out}`);
}

// The guide is a separate VitePress project (guide/) built by CI into docs/guide/.
// Its pages come from the Markdown files, so they can be listed here without a build.
const guideFiles = (await readdir(path.join(root, "guide"), { recursive: true }))
  .filter((file) => file.endsWith(".md") && !/(^|\/)(node_modules|\.vitepress)\//.test(file))
  .sort();
const guideUrls = guideFiles.map(
  (file) => `${origin}/guide/${file.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "")}`,
);

const urls = [...pages.filter((page) => !page.noindex).map((page) => origin + page.path), ...guideUrls];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(root, "docs/sitemap.xml"), sitemap);
console.log("wrote docs/sitemap.xml");
