# Screenshot inventory

Every placeholder on the home page and on `/features/` carries a `data-asset` name. To replace one, export the
screenshot from the simulator or a device, put it in `docs/assets/screenshots/` with that name,
and swap the placeholder `<div>` in `src/home.html` or `src/features.html` for an `<img>` (see "Swapping a placeholder").
`node tools/check.mjs` fails if the page and this table disagree.

Export screenshots **without** a device frame: the site draws the thin bezel itself for the
"full-device" ones. "Cropped UI" means the file is cut from a screenshot and shown with no
device around it. Capture on light appearance unless noted, and keep franchise logos and art out
of every frame (see the app repository's `Reference/APP-STORE.md`).

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

Every name starts with `features-`. The same rules apply: frameless exports, no franchise logos or
art, real figures only. These are a design pass too: when the real shots arrive, re-crop and re-scale
them around the UI that matters, and add callouts (a box name, "12 models", a faction) only once
they can sit on real UI.

| Filename | Section | Device | Orientation | Size (px) / ratio | What to capture | Treatment |
|---|---|---|---|---|---|---|
| `features-intro-atelier` | Intro | iPad | Landscape | 2752 × 1376 (2:1) | The Atelier, wide: a box set with several units, tiles in different states. The one big picture at the top of the page. | Cropped UI, full width |
| `features-collection-ipad` | Collection | iPad | Landscape | 3:2 (e.g. 2752 × 1835) | The Collection tab: the list of box sets with their progress bars. | Cropped UI |
| `features-collection-boxset` | Collection | iPhone | Portrait crop | 4:5 (1320 × 1650) | One box set's page, or the Catalog product page with **Start building**. Overlaps the iPad crop. | Cropped UI |
| `features-atelier-wide` | Atelier | iPad | Landscape | 2752 × 1500 | The Atelier tile grid with rings in different states (not started, assembling, assembled, painting, painted). The largest image on the page. | Cropped UI, full width |
| `features-assembly-model` | Assembly | iPhone | Portrait | 1320 × 2868 | A model's screen before starting, with **Start assembly**. | Full-device |
| `features-assembly-session` | Assembly | iPhone | Landscape crop | 4:3 (1320 × 990) | The session area while running: the clock, Pause, Stop, Finish. | Cropped UI |
| `features-assembly-done` | Assembly | iPhone | Landscape crop | 4:3 (1320 × 990) | The same model after assembly: its ring and status ("Assembled · ready for painting"). | Cropped UI |
| `features-painting-select` | Painting | iPhone | Portrait | 1320 × 2868 | Batch Paint mode with several models selected and **Start Painting (N)**. | Full-device |
| `features-painting-session` | Painting | iPhone | Portrait | 1320 × 2868 | The batch screen with the shared session running. | Full-device |
| `features-painting-tiles` | Painting | iPad | Landscape crop | 3:2 (e.g. 1600 × 1067) | A close crop of a unit's tiles with several selected (the selected outline). Hidden on phones. | Cropped UI |
| `features-journal-photo` | Journal | Photograph | Landscape | 3:2 (1800 × 1200) | A real photo of a model, ideally half-painted. | Photo |
| `features-journal-entry` | Journal | iPhone | Portrait | 1320 × 2868 | A journal entry: the note, its photos and the stage. | Full-device |
| `features-paints-ipad` | Paints | iPad | Landscape | 16:10 (2752 × 1720) | The Paints tab on a wide iPad: the swatch grid with a paint open beside it and **Similar paints** visible. Bleeds off the right edge, so the right side may be cut. | Cropped UI, bleeds off the right edge |
| `features-paints-model` | Paints | iPhone | Portrait crop | 4:5 (1320 × 1650) | A model's screen scrolled to its **Paints** section. | Cropped UI |
| `features-progress-boxes` | Progress | iPad | Landscape | 4:3 (2752 × 2064) | Collection, Boxes view: the summary ring, status bars and time totals. | Cropped UI |
| `features-progress-factions` | Progress | iPhone | Portrait crop | 4:5 (1320 × 1650) | Collection, Factions view. | Cropped UI |
| `features-island-crop` | On iPhone | iPhone | Wide crop | 22:7 (1320 × 420) | The Dynamic Island with a timer running. | Cropped UI |
| `features-lockscreen-crop` | On iPhone | iPhone | Portrait crop | 33:40 (1320 × 1600) | The Lock Screen with the running timer's Live Activity. | Cropped UI |

The two example figures under "Progress" (`18 painted`, `42h 15m`) are typographic excerpts set
in the page. Replace them with numbers taken from `features-progress-boxes` and
`features-progress-factions` and remove the "Example values" line.

## What phones crop

On a phone the page cannot show everything at a readable size, so two images are cropped by
the page (`object-fit: cover`), not by you. Keep the important content inside the part that stays:

- `journey-atelier-crop`, `features-intro-atelier` and `features-atelier-wide` show as 5:4 and keep the **left** side of the strip.
- `paints-ipad-detail` shows as 4:3 and keeps the **top** and the horizontal centre.

## The example figure

"Progress" shows `42h 15m` in Oxanium with a note saying it is an example. When the real
`progress-ipad-collection` screenshot is in, replace the figure and its label with a number
taken from that screenshot, and delete the "Example value" line.

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
