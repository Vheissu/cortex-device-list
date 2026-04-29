# Guidelines for Codex Agents

This repository hosts an **Aurelia 2** application written in **TypeScript**. Webpack is used for bundling and Jest for testing. There are also helper scripts for parsing PDF data in `parser_v2` (Node TypeScript) and `data_source` (Python).

## Directory overview
- `src/` – main application code
- `test/` – Jest tests
- `parser_v2/` – Node/TypeScript script
- `data_source/` – Python script for generating data

## Style conventions
- Follow **`.editorconfig`**:
  - Use 4 spaces for indentation on TypeScript/JavaScript/SCSS/HTML files.
  - Use 2 spaces for JSON/YAML such as `package.json`.
  - Use LF line endings and ensure each file ends with a newline.
- Prefer single quotes in TS/JS code.
- When creating Aurelia components, mirror existing class-based patterns and use `@bindable` decorators where appropriate.
- Lint rules are enforced via ESLint, Sass‑Lint and HTMLHint.

## Tooling
- Use `npm` (or `yarn`) scripts defined in `package.json`.
- **Run `npm test`** before committing. This command runs linting and Jest tests.
- Build the production bundle with `npm run build` when necessary.
- Python code should follow basic PEP8 style.

Keep these conventions in mind for any future contributions.


## Anti-AI-design tropes (banned when decorative)

The tell isn't the shape, it's the function. Pills, chips, badges and cards are part of a real product UI. Codex slop slathers them on as decoration. Use them when they do real work; do not use them when they do not. If this project has a `DESIGN.md` (or equivalent design spec) that opts in to one of these on purpose, the spec wins; otherwise these defaults stand.

### Always banned (no exceptions)
- Inter, Roboto, Geist, Space Grotesk, Plus Jakarta Sans, DM Sans as the default sans. Pick something with character.
- Purple gradients, indigo gradients, blue-to-pink gradients, "VibeCode" purples, any non-photo gradient as background.
- Glassmorphism, frosted glass cards, backdrop blur on translucent panels.
- All-caps section labels with letter-spacing 0.25em–0.4em.
- Three identical icon-topped feature cards in a row.
- Numbered `01 02 03` workflow strips. Stat banner rows (`100+ x • 30+ y • 4 z`).
- Stacked primary CTAs (more than one filled action competing for the same surface).
- Centred long-form headlines.
- Gradient hero backgrounds with radial colour blobs.
- Emojis in navigation, section labels or headings.

### Banned when decorative, fine when functional
- Pill eyebrow tag above a heading (`• PRODUCT TAGLINE`) — banned. A filter chip or rating badge — fine.
- `MVP` / `NEW` / `BETA` badge in a card corner — banned. An award badge tied to a real status — fine.
- Coloured top or left border on a card as decoration — banned. A 1px border around a real card surface — fine.
- Cards with border radius greater than 16px + drop shadow at rest — banned. Cards with ~12px radius and a subtle shadow on hover — fine.

The test before adding any pill, chip, badge or card: if you removed it, would the user lose the ability to do something or understand something concrete? If yes, keep it. If no, delete it.

### Copy tells (always banned)
- Em dashes anywhere in copy. Use a comma, a full stop, or open the sentence.
- Scare quotes anywhere. If a phrase needs hedging, rewrite it.
- American spelling. We write in Australian English: `optimised`, `colour`, `centre`, `behaviour`, `recognise`, `enrol`.
- Hype words: `revolutionary`, `seamless`, `unleash`, `delight`, `magic`, `effortless`, `elevate`, `curated`, `journey`, `ecosystem`.
- Sentences that begin with `In today's world`, `In a world where`, `Imagine`, `It's no secret that`.
- Empty bridging phrases: `As we navigate`, `Whether you're A or B`, `In the realm of`.

### What we use instead
- Whitespace, scale and 1px hairlines for separation, before reaching for borders, cards or shadows.
- Type-led hierarchy. Italic or weight contrast carries display emphasis.
- One primary action per surface, maximum.
- Real photography over stock illustration. No AI-generated photography.
- A small, intentional palette with one accent, not a rainbow of semantic colours.
- Functional chrome (filter chips that filter, rating dots that rate, awards that mark a real status).

### When in doubt
If this project has a `DESIGN.md`, it overrides these defaults. If it does not, these defaults stand. Do not introduce a new font, colour, component variant or motion rule without writing it down somewhere a future agent will read it.
