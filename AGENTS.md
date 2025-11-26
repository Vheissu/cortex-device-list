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
