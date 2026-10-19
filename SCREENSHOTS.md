# Screenshot inventory

Every placeholder on the home page and on `/features/` carries a `data-asset` name. To replace one, export the
screenshot from the simulator or a device, put it in `docs/assets/screenshots/` with that name,
and swap the placeholder `<div>` in `src/home.html` or `src/features.html` for an `<img>` (see "Swapping a placeholder").
`node tools/check.mjs` fails if the page and this table disagree.

**Status.** All 15 images are in. 13 are screenshots taken on 2026-10-19 from simulators with mock data;
`features-lockscreen-crop` is from a real iPhone, cropped to 923 × 692 from a 923-pixel-wide screenshot, on a plain
wallpaper (a simulator's Lock Screen shows the Live Activity clock as "24:--", so that shot has to come from a real
device). `journal-photo-1` is the owner's own photo of a grey-primed miniature (1086 × 1357, 4:5). It is a real photo:
an AI-coloured version was deliberately not used, because the slot is for a real photograph.

Export screenshots **without** a device frame: the site draws the thin bezel itself for the
"full-device" ones. "Cropped UI" means the file is cut from a screenshot and shown with no
device around it. Capture on light appearance unless noted, and keep franchise logos and art out
of every frame (see the app repository's `Reference/APP-STORE.md`).

## Home page (`/`)

| Filename | Section | Device | Orientation | Size (px) / ratio | What to capture | Treatment |
|---|---|---|---|---|---|---|
| `hero-ipad-atelier` | Hero | iPad | Landscape | 2752 × 2064 (4:3) | The Atelier with a box set open, tiles in several states, and a timer running. | Full-device |
| `hero-iphone-model` | Hero | iPhone | Portrait | 1320 × 2868 | A model's screen with the session area visible (clock running). A different moment from the iPad. | Full-device |
| `journey-atelier-crop` | Atelier | iPad | Landscape | 2752 × 1180 (about 7:3) | A horizontal slice of the Atelier: unit headers with their faction tint and the tile rings in different states (not started, assembled, painting, painted). | Cropped UI, full width |
| `journal-photo-1` | Journal | Photograph | Portrait | 1600 × 2000 (4:5) | A real photo of a half-painted model. | Photo |
| `journal-iphone-entry` | Journal | iPhone | Portrait | 1320 × 2868 | A model's screen scrolled to its Journal: a note, photos and the paints used. | Full-device |
| `journal-model-crop` | Journal | iPhone | Landscape crop | 1320 × 990 (4:3) | The top of a model's screen: its ring, number, status and total time. | Cropped UI |
| `paints-ipad-detail` | Paints | iPad | Landscape | 2752 × 1720 (16:10) | The Paints tab on a wide iPad: the swatch grid with one paint open beside it, "Used on" and "Similar paints" visible. | Cropped UI |
| `progress-ipad-collection` | Progress | iPad | Landscape | 2752 × 2064 (4:3) | Collection, with the summary ring, status bars and time totals (Boxes or Factions view). It runs off the left edge of the page, so the left side may be cut. | Cropped UI, bleeds off the left edge |
| `collection-list-crop` | Collection | iPhone | Portrait crop | 1320 × 1815 (8:11) | The Collection list with several box sets, each with its progress bar. | Cropped UI |
| `collection-boxset-crop` | Collection | iPhone | Portrait crop | 1320 × 1650 (4:5) | A box set's page, or the Catalog sheet with a product. | Cropped UI |

## Features page (`/features/`)

Five images, all small, all cropped UI with no device around them. They are evidence, not structure:
the page reads in full without them. Every name starts with `features-`. A real screenshot may justify
a different crop, so treat these as a design pass: re-crop and re-size around the UI that matters.

| Filename | Section | Device | Crop type | Size (px) / ratio | Exact app screen | What must stay visible |
|---|---|---|---|---|---|---|
| `features-collection-crop` | Collection | iPhone | Landscape crop | 1320 × 990 (4:3) | The Collection tab, **Boxes** view, with a few box sets owned. | The **Boxes \| Factions** control and at least one box card with its progress bar. Crop out the status bar and the tab bar. A secondary visual: keep it small. |
| `features-atelier-wide` | Atelier | iPad | Wide horizontal band | 2752 × 688 (4:1) | The Atelier on iPad with one box set open, ideally while a timer runs. | One unit header (faction tint, name, progress, time) and a single row of tiles with rings in at least three states, including the running tile. A slim band, not a screen. |
| `features-tracking-session` | Tracking | iPhone | Landscape crop | 1320 × 990 (4:3) | The batch screen of a painting batch with the session running (title like "×6", stage "Painting · Running"). | The clock, the stage line, and the Pause, Stop and Finish buttons. The first member rows may show underneath. |
| `features-paints-crop` | Paints (and Journal) | iPad | Portrait crop | 1320 × 1650 (4:5) | The Paints tab on a wide iPad with a paint open: its detail with **Used on** and **Similar paints**. | The swatches, brand and range names, and the closeness labels in the Similar paints list. The colors in the UI are the section's only color. |
| `features-lockscreen-crop` | On iPhone | iPhone | Landscape crop | 1320 × 990 (4:3) | The iPhone Lock Screen with the running timer's Live Activity. | The whole Live Activity card: stage badge, title, the clock and the two round buttons. No device frame and no full Lock Screen: just the card and a little context. |

Journal, Progress and Privacy have no image: the text carries them. Add a sixth image only if a real
screenshot makes a point the text can't.

## What phones crop

On a phone the page cannot show everything at a readable size, so some images are cropped by
the page (`object-fit: cover`), not by you. Keep the important content inside the part that stays:

- `journey-atelier-crop` shows as 5:4 and keeps the **left** side of the strip.
- `paints-ipad-detail` shows as 4:3 and keeps the **top** and the horizontal centre.
- `features-atelier-wide` shows as 2:1 and keeps the **left** side of the band.
- `features-collection-crop`, `features-paints-crop` and `features-lockscreen-crop` show as 3:2 on phones and keep the **top** of the image, so put the key UI in the upper part of each crop.

## The example figure

"Progress" on the home page shows `28h 25m` ("Total hobby time") in Oxanium, the number in the real
`progress-ipad-collection` screenshot. If that screenshot is replaced, update the figure to match it.
The Features page shows no figures.

## Swapping a placeholder

Placeholder (inside its `<figure>`):

```html
<div class="shot ph ratio-ipad" data-asset="hero-ipad-atelier" role="img" aria-label="…">…</div>
```

Replace it with an image of the same name and dimensions. Keep `class="shot"` and `data-asset`,
and write an `alt` that says what the screen shows:

```html
<img class="shot" data-asset="hero-ipad-atelier" src="/assets/screenshots/hero-ipad-atelier.png"
     width="2752" height="2064" alt="The Atelier on iPad: …">
```

Figures that are not framed devices (`crop`) take the same `<img class="shot" …>`; for the wide
strip and the iPad crops, `object-fit` is not needed as long as the file has the ratio in the table.
Photos use `<img data-asset="journal-photo-1" …>` inside `.photo` and need `loading="lazy"` only below
the first screen.
