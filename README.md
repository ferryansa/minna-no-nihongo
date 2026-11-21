# Minna no Nihongo

A study app for Minna no Nihongo I (chapters 1–25) and II (chapters 26–50): Kotoba (table + flashcards),
かず・かつよう (numbers & conjugation, Minna I only), Bunpou, and Kanji.

**How to use:** open `index.html` in a browser. No server and no installation needed.

## Folder structure

```
index.html                 page skeleton (header, dock, settings sheet) + script list
css/
  main.css                 entry point: imports every CSS file in order (import order = cascade order)
  base/
    variables.css          colors & fonts (change the Minna I colors here)
    layout.css             reset, body, content width, [hidden], credit footer
  components/              UI parts shared by many pages
    header.css             title, Mt. Fuji illustration, progress bar, book selector
    buttons.css            buttons, chips, controls, bilingual labels
    table.css              vocabulary table & "memorized" checkbox
    flashcard.css          flashcards & practice cards
    deck-picker.css        chapter picker for the flashcard deck
    sheet.css              settings sheet (panel from the bottom)
    dock.css               menu content: page tabs, mode tabs, chapter selector, ⚙ button
    dock-menu.css          the dock as a collapsible menu (small button bottom left + list)
  pages/                   styles for a single page
    bunpou.css             Bunpou (Material, Summary, Particles)
    kanji.css              Kanji (list, cards, writing)
    kazu-katsuyou.css      かず・かつよう
  themes/
    book2-blue.css         blue theme for Minna II (swaps the color variables)
js/
  core/                    foundation, loaded first / last
    book-theme.js          decides Minna I/II (URL hash or localStorage)
    utils.js               global helpers: $, $$, esc
    mount.js               mounts the template + Bunpou content; setBook() switches books
    finish.js              wrap-up: clears the jump hash from the URL
  components/              shared UI behavior
    book-selector.js       Minna I/II dropdown
    dock-settings.js       the single ⚙ button in the menu
    dock-menu.js           open/close the collapsible menu (Esc, tap outside, closes after a choice)
    dock-autohide.js       the menu button shrinks to an icon while scrolling down
  pages/                   logic for each page
    kotoba.js              Kotoba: table, flashcards, memorization, dock
    kazu-katsuyou.js       かず・かつよう: numbers, time, counters, conjugation, practice
    bunpou.js              Bunpou: material, summary, particles, jump between chapters
    kanji.js               Kanji: list, cards, how to write
  data/                    learning content (edit here to add or correct material)
    kotoba-data.js         vocabulary per chapter, both books
    kanji-data.js          kanji list + stroke data (KanjiVG)
    bunpou-minna-1.js      Bunpou material, chapters 1–25 (HTML stored as text)
    bunpou-minna-2.js      Bunpou material, chapters 26–50 (HTML stored as text)
```

## Naming rules
- File names use English or Japanese romaji: `kotoba`, `bunpou`, `kanji`, `kazu-katsuyou`.
- Folders show the role: `core` (foundation), `components` (UI parts), `pages` (one page),
  `data` (learning content), `themes` (colors per book).
- One page = one CSS file + one JS file with the same name (`pages/bunpou.css` ↔ `pages/bunpou.js`).

## Changing things
| To change… | Edit |
|---|---|
| add/correct vocabulary | `js/data/kotoba-data.js` |
| add/correct kanji | `js/data/kanji-data.js` |
| Bunpou material | `js/data/bunpou-minna-1.js` / `bunpou-minna-2.js` |
| Minna I / Minna II colors | `css/base/variables.css` / `css/themes/book2-blue.css` |
| menu content (tabs, chapter, ⚙) | `css/components/dock.css` |
| menu shape/size | `css/components/dock-menu.css` |
| enable the かず・かつよう tab in Minna II | remove the 2 `html[data-book="2"]` rules in `css/components/dock.css` |

Note for `bunpou-minna-*.js`: the content is HTML stored as text.
Do not use backticks (`` ` ``) or `${ }` inside it.

## Technical notes
- Switching books reloads the page; memorization progress is stored separately per book in localStorage and is not deleted.
- The `@import` order in `css/main.css` and the `<script>` order in `index.html` matter; do not reshuffle them.
- Kanji stroke data: KanjiVG © Ulrich Apel, CC BY-SA 3.0.
