import { defineConfig } from "vitepress";

export default defineConfig({
  title: "SpruLight Docs",
  description: "How to use SpruLight, the miniature painting tracker for iPad and iPhone.",
  lang: "en",
  cleanUrls: true,
  lastUpdated: false,
  // Served at https://sprulight.com/guide/ next to the static marketing site.
  // The build lands in docs/guide/, which CI publishes together with docs/.
  base: "/guide/",
  outDir: "../docs/guide",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico", sizes: "32x32" }],
    ["link", { rel: "icon", type: "image/png", href: "/assets/icons/icon-192.png", sizes: "192x192" }],
    ["link", { rel: "apple-touch-icon", href: "/assets/icons/apple-touch-icon.png" }],
    ["meta", { property: "og:site_name", content: "SpruLight" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:image", content: "https://sprulight.com/assets/og-image.png" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ],
  transformHead({ pageData }) {
    const route = pageData.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
    const url = `https://sprulight.com/guide/${route}`;
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: `${pageData.title} | SpruLight Docs` }],
      ["meta", { property: "og:description", content: pageData.description || "How to use SpruLight, the miniature painting tracker for iPad and iPhone." }],
    ];
  },
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "SpruLight Docs",
    nav: [
      { text: "sprulight.com", link: "https://sprulight.com/" },
      { text: "Support", link: "https://sprulight.com/support/" },
    ],
    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "What is SpruLight?", link: "/getting-started/what-is-sprulight" },
          { text: "Add your first box", link: "/getting-started/add-your-first-box" },
        ],
      },
      {
        text: "Collection",
        items: [{ text: "Boxes and factions", link: "/collection/boxes-and-factions" }],
      },
      {
        text: "Atelier",
        items: [{ text: "Tiles and progress rings", link: "/atelier/tiles-and-rings" }],
      },
      {
        text: "Assembly",
        items: [
          { text: "Start a session", link: "/assembly/start-a-session" },
          { text: "Stop vs Finish", link: "/assembly/stop-vs-finish" },
        ],
      },
      {
        text: "Journal",
        items: [{ text: "Notes, photos and stages", link: "/journal/notes-and-photos" }],
      },
      {
        text: "Help",
        items: [{ text: "FAQ", link: "/faq" }],
      },
    ],
    outline: { level: [2, 3], label: "On this page" },
    search: { provider: "local" },
    docFooter: { prev: "Previous", next: "Next" },
    footer: { message: "No account. No ads. No tracking.", copyright: "SpruLight" },
  },
});
