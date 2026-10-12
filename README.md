# sprulight-site

The website for the SpruLight app, served at https://sprulight.com by GitHub Pages.
Plain HTML and CSS: no JavaScript, no analytics, no cookies, no third-party requests.

## Layout

| Path | What it is |
|---|---|
| `docs/` | The published site (GitHub Pages serves this folder). Pages are generated; `assets/`, `CNAME`, `.nojekyll`, `robots.txt` and `favicon.ico` are edited by hand. |
| `src/layout.html` | The shared `<head>`, header and footer. |
| `src/home.html`, `src/not-found.html` | The home page and the 404 page content. |
| `build.mjs` | Builds `docs/index.html`, `docs/privacy/`, `docs/support/`, `docs/404.html` and `docs/sitemap.xml`. |
| `tools/check.mjs` | Checks links, asset paths, third-party hosts, metadata and contrast. Plain links to `docs.github.com` are allowed (the privacy policy links GitHub's statement); anything the page would load from another host fails. |
| `tools/make-images.swift` | Regenerates the icons and the social preview image from the app icon. |

## The privacy and support pages

Their text is **not** written here. It comes from the app repository, which owns it:

- `Reference/privacy-policy.md` becomes `/privacy/`
- `Reference/support.md` becomes `/support/`

Edit those two files in the app repository, then rebuild. The build reads the app repository
from `~/Projects/github/supply-depot/SupplyDepot`; point it elsewhere with `SPRULIGHT_APP_REPO`
(for example, a worktree with unmerged changes). Never edit `docs/privacy/index.html` or
`docs/support/index.html` by hand: the next build overwrites them.

## Everyday commands

Needs Node 20 or later and no packages.

```sh
node build.mjs                        # regenerate the pages
node tools/check.mjs                  # validate the result
python3 -m http.server 8000 -d docs   # preview at http://localhost:8000
```

Run the build and the check before every commit, and commit the generated `docs/` files too:
GitHub Pages serves what is committed.

## Changing things

- **App Store button.** In `src/home.html`, replace the `<span class="soon">…</span>` with
  `<a class="button" href="THE APP STORE URL">Download on the App Store</a>`, then rebuild.
- **Screenshots.** Put PNGs in `docs/assets/screenshots/` (iPhone portrait, 1206 × 2622 so the frame
  keeps its proportions). In `src/home.html`, replace each `<div class="placeholder" …>` with
  `<img src="/assets/screenshots/atelier.png" width="1206" height="2622" alt="What the screenshot shows">`.
  Keep franchise logos and art out of them (see the app repository's `Reference/APP-STORE.md`).
- **Colors and fonts** follow the app's design tokens (`Reference/SPEC.md`, Design tokens). They are
  the CSS variables at the top of `docs/assets/style.css`; `tools/check.mjs` fails if a pair drops
  below WCAG AA contrast.
- **Fonts.** Barlow and Oxanium (SIL Open Font License 1.1, no reserved font names), subset to Latin
  and converted to WOFF2 from the files in the app. Their license texts sit next to them in
  `docs/assets/fonts/` and are linked from the footer.

## Publishing (GitHub Pages)

1. Repository settings → Pages: deploy from the `main` branch, folder `/docs`.
2. Custom domain `sprulight.com` (the `docs/CNAME` file holds it). Tick **Enforce HTTPS** once the
   certificate is ready.
3. DNS at the registrar:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<github-username>.github.io` |
| TXT | `_github-pages-challenge-<github-username>` | the value GitHub shows when verifying the domain |

`www.sprulight.com` redirects to `sprulight.com` by itself. `/privacy` and `/support` redirect to
`/privacy/` and `/support/`; the app's links keep working.
