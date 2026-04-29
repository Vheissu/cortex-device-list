# Contributing

Thanks for helping improve Cortex Device List. The project is most useful when device data is accurate, searchable and easy to verify.

## Before you start

- Check whether the issue already has context, screenshots or source links.
- Keep changes focused. A small data fix, UI fix or test improvement is easier to review than a mixed pull request.
- Use Australian English in user-facing copy.
- Do not add AI/tooling attribution to commits, comments or docs.

## Development setup

Install dependencies from the repository root:

```sh
npm install
```

Run the app locally:

```sh
npm start
```

Run linting and unit tests:

```sh
npm test
```

Run browser tests:

```sh
npm run test:e2e
```

Build a production bundle:

```sh
npm run build
```

## Code style

- TypeScript, JavaScript, CSS, SCSS and HTML use 4 spaces.
- JSON and YAML use 2 spaces.
- Prefer single quotes in TypeScript and JavaScript.
- Follow the class-based Aurelia component patterns already used in `src/routes/`, `src/views/` and `src/components/`.
- Use Aurelia 2 binding syntax. For example, use `click.trigger`, not Aurelia 1 event syntax.
- Keep public UI copy practical. Avoid implementation details that do not help someone browse or compare devices.

## Data changes

Device data is stored under `src/data/`.

- Use the existing category files for base records.
- Use `src/data/plugins/` for plugin devices.
- Use `details.json` or `details-extra.json` for richer reference information.
- Keep existing IDs stable.
- Prefer factual, source-backed corrections over broad rewrites.
- Check that search, filters and details still behave correctly after changing fields.

If a parser script helps generate data, review the generated output before committing it. The parsers are helpers, not the source of truth.

## Images

- Add useful device images only.
- Place images in `src/images/` or `src/images/large-images/`, matching the current app convention.
- Prefer clear product or device reference images.
- Keep filenames descriptive and lower-case where practical.

## Tests

Use the smallest test that proves the change:

- Data shape or state behaviour: add or update a Jest test in `test/`.
- Route, table, modal, theme or mobile behaviour: add or update a Playwright test in `e2e/`.
- SEO output or generated pages: run `npm run build` and inspect `dist/`.

At minimum, run `npm test` before opening a pull request. Run `npm run test:e2e` when the change affects visible app behaviour.

## Pull request checklist

- The change has a clear reason.
- Data corrections include enough context for reviewers to trust them.
- New UI copy is concise and user-facing.
- `npm test` passes.
- `npm run test:e2e` has been run for route, table, modal or responsive layout changes.
- The pull request description explains what changed and how it was checked.
