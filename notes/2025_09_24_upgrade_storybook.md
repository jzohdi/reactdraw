### Storybook Upgrade Plan — 6.5 → 9.0 (2025-09-24)

Scope: Upgrade this repo from Storybook 6.5 (webpack5) to Storybook 9, focusing only on changes relevant to this repository (React, webpack5, MDX docs, addon-essentials, interactions, actions, links). No Nx, Vite, or framework (Vue/Angular) changes are included.

---

### Current state (relevant)

- Storybook 6.5.x packages:
  - `@storybook/react` ^6.5
  - `@storybook/addon-essentials`, `@storybook/addon-docs`, `@storybook/addon-links`, `@storybook/addon-actions`, `@storybook/addon-interactions` ^6.5
  - `@storybook/builder-webpack5` and `@storybook/manager-webpack5`
- Config: classic 6.x configuration (no explicit `framework` field).
- Stories: CSF in TSX (`Template.bind({})`), MDX docs pages using `@storybook/addon-docs` components.
- Builder: webpack 5 (desired to keep webpack).

---

### What changes in v7–v9 that matters here

- Framework configuration required:
  - Use `framework: { name: '@storybook/react-webpack5', options: {} }` in `.storybook/main.(ts|js)`.
  - `@storybook/builder-webpack5` and `@storybook/manager-webpack5` are removed (builder is provided by the framework package).
- Docs/MDX:
  - MDX2 with `@storybook/addon-docs/blocks` (replaces using `@storybook/addon-docs` components directly in imports).
  - `<ArgsTable of={Component} />` is preferred over cross-file `story="id"` in MDX.
  - Autodocs can be enabled globally (`docs: { autodocs: true | 'tag' }`), but is optional.
- CSF and stories:
  - CSF3 is the default style, but CSF2 (Template.bind) remains compatible.
  - `argTypes`, `parameters.docs.source.code` continue to work; some props moved/normalized.
- Addons:
  - All official addons need to be bumped to 9.x (essentials, docs, links, actions, interactions).
  - `@storybook/testing-library` should be bumped to a compatible recent version or replaced by `@storybook/test` where applicable (only if we add interaction tests; safe to bump for compatibility).
- Node:
  - Storybook 9 expects a modern Node (≥18). Ensure CI/dev match.

Not relevant to this repo (skip): Vite framework, Nx generators, builder-vite, other framework migrations (Vue/Angular/Svelte), composition server changes, on-demand story store, etc.

---

### Step-by-step upgrade plan (with time estimates)

1) Pre-flight (15–30 min)
- Create a branch: `feat/storybook-9-upgrade`.
- Ensure Node 18+ locally and in CI.
- Commit a baseline Storybook build (`npm run build-storybook`) so we can compare.

2) Use the official upgrader (30–60 min)
- Run the migration:
  - `npx storybook@latest upgrade`
- Accept relevant automigrations. This bumps packages and applies config scaffolding for v7+.
- If the tool flags breaking changes, follow the prompts; otherwise proceed.

3) Package adjustments (15–30 min)
- Remove builder/manager packages (no longer used):
  - `npm remove @storybook/builder-webpack5 @storybook/manager-webpack5`
- Ensure these are installed at ^9:
  - `@storybook/react-webpack5`
  - `@storybook/addon-essentials`
  - `@storybook/addon-actions`
  - `@storybook/addon-links`
  - `@storybook/addon-interactions`
  - `@storybook/addon-docs` (pulled in by essentials) and `@storybook/addon-docs/blocks`
  - Optionally bump `@storybook/testing-library` to the latest compatible.

4) Configure `.storybook/main.(ts|js)` (15–30 min)
- Add/confirm:
  - `framework: { name: '@storybook/react-webpack5', options: {} }`
  - `addons: ['@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-actions', '@storybook/addon-interactions']`
  - `docs: { autodocs: true }` (or `'tag'`, optional but recommended)
- Keep `stories` glob as-is.

5) MDX updates (45–90 min)
- Switch imports to `@storybook/addon-docs/blocks`:
  - `Introduction.stories.mdx`: replace `import { Meta } from '@storybook/addon-docs'` with `@storybook/addon-docs/blocks`.
  - `TypeDescriptions.stories.mdx`: same.
  - `Playground.stories.mdx`: ensure imports also come from `@storybook/addon-docs/blocks` and prefer `<ArgsTable of={ReactDraw} />` (already done for ArgsTable).
- MDX syntax remains largely the same; verify pages render.

6) Validate stories and docs (30–60 min)
- `npm run storybook` to validate locally.
- Fix any warnings/errors flagged by SB9 (usually MDX imports and addon versions).
- `npm run build-storybook` and open `docs/index.html` to verify static build.

7) Cleanup and docs (15–30 min)
- Remove stale comments/unused deps in `package.json`.
- Update README: mention Storybook 9 and Autodocs.
- Commit and open PR.

Total estimated effort: 4–8 hours (single developer, uninterrupted). If unexpected addon incompatibilities appear, plan for 1–2 days.

---

### Concrete config/example snippets

`.storybook/main.ts`

```ts
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(mdx|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default config;
```

MDX import change (example)

```mdx
import { Meta, Canvas, Story, ArgsTable, Subtitle } from '@storybook/addon-docs/blocks';
```

Args table best practice

```mdx
import ReactDraw from '../src/ReactDraw';

<ArgsTable of={ReactDraw} />
```

---

### Risks & mitigations

- Addon incompatibility: Ensure all official addons are on ^9. Replace deprecated community addons if any.
- MDX drift: Update imports to `@storybook/addon-docs/blocks` and avoid cross-file `story="id"` for ArgsTable.
- Node version: Use Node 18+ to avoid install/runtime issues.
- CI size/time: SB9 static build size may differ; keep `docs/` publish flow the same.

---

### Rollback plan

- Keep the upgrade on a branch. If issues arise, revert to the baseline commit and open issues for blockers.


