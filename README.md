# Cortex Device List

Browse, search and compare the factory devices available on the Neural DSP Quad Cortex. The app covers amps, cabs, effects, captures and plugin devices, with richer detail records where the project has been able to identify the real-world reference gear.

This is an independent community project. It is not made by, endorsed by, or affiliated with Neural DSP.

## What is in the app

- A searchable device table for all supported Quad Cortex device categories.
- Separate views for amps, cabs, effects, captures and plugin devices.
- Detail modals with descriptions, images and reference links where data exists.
- Light and dark themes.
- Static SEO assets generated during production builds.
- Unit tests for data, state and table behaviour.
- Playwright coverage for the main desktop and mobile browsing flows.

## Tech stack

- Aurelia 2 with TypeScript.
- Webpack for local development and production builds.
- Jest for unit tests.
- Playwright for browser tests.
- HTMLHint and ESLint for linting.

## Requirements

- Node.js 24.x.
- npm.

The Python and Node parser helpers have their own dependencies. You only need them when updating source data from manuals or generated extracts.

## Getting started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm start
```

Webpack will print the local URL. The app normally runs at `http://localhost:8080`.

Run the standard checks:

```sh
npm test
```

Run the Playwright browser tests:

```sh
npm run test:e2e
```

Build the production bundle:

```sh
npm run build
```

The build output is written to `dist/`. The build also runs `scripts/generate-seo-assets.js`, which creates the static sitemap, search index and device/category pages from the JSON data.

## Project layout

```text
src/
    components/       Shared Aurelia components
    data/             Device JSON, enrichment helpers and plugin data
    images/           Device images used by the app and generated pages
    locales/          Translation strings
    routes/           Route-level Aurelia components
    state/            Aurelia state store and actions
    views/            Table and card views
test/                 Jest unit tests
e2e/                  Playwright browser tests
scripts/              Build-time helper scripts
parser_v2/            Node/TypeScript PDF parsing helper
data_source/          Python PDF parsing helper and source manual
```

## Working with device data

Most application data lives in `src/data/`:

- `amps.json`, `cabs.json`, `effects.json` and `captures.json` contain core Quad Cortex device records.
- `plugins/*.json` contains devices provided by Neural DSP plugin integrations.
- `details.json` and `details-extra.json` contain richer descriptions, images and external reference data.
- `enrichment.ts` combines base device records with matching detail records for the app.

When adding or correcting a device:

1. Update the smallest relevant JSON file.
2. Add or update a detail record only when you have concrete supporting information.
3. Keep IDs stable, as table rows, details and generated URLs depend on them.
4. Add or update tests when the change affects filtering, grouping, details or generated content.
5. Run `npm test` before opening a pull request.

Images should go in `src/images/` or `src/images/large-images/`. Prefer images that clearly show the real device being referenced, and only add files that are useful to the app.

## Parser helpers

The parser folders are utility scripts for maintainers. They are not part of the running web app.

`parser_v2/` is a small Node/TypeScript helper for extracting data from PDF content:

```sh
cd parser_v2
npm install
```

`data_source/` contains a Python parser and `requirements.txt`:

```sh
cd data_source
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Treat parser output as a starting point. Review generated data manually before committing it.

## Contributing

Contributions are welcome. Good first contributions include data corrections, missing descriptions, broken image fixes, accessibility improvements and tests for existing behaviours.

Before opening a pull request, please read [CONTRIBUTING.md](CONTRIBUTING.md) and run:

```sh
npm test
```

For UI or route changes, also run:

```sh
npm run test:e2e
```

## Licence

This project is released under the MIT Licence. See [LICENSE](LICENSE).
