# ReactDraw

![npm](https://img.shields.io/npm/v/@jzohdi/react-draw) ![downloads](https://img.shields.io/npm/dm/@jzohdi/react-draw) [![bundlephobia](https://img.shields.io/bundlephobia/minzip/@jzohdi/react-draw)](https://bundlephobia.com/package/@jzohdi/react-draw)

A plugin-architecture drawing area for React. Pick the tools you need (free draw, shapes, text, arrows, selection, erase, undo/redo, etc.), customize the UI, or build your own tools. Written in TypeScript.

- Lightweight and modular — import only the tools you use
- Customizable UI — style via `styles`/`classNames` or bring your own components
- Extensible — implement custom Drawing/Action tools and serialization
- Touch and mouse support

View the full docs and interactive demos in Storybook: [Docs & Demos][2]

Short demo: [video](https://user-images.githubusercontent.com/31998568/183299492-4cf5a7da-e7b8-4418-9b47-d04143db7baa.mp4)

## Installation

```bash
npm install @jzohdi/react-draw
# or
yarn add @jzohdi/react-draw
# or
pnpm add @jzohdi/react-draw
```

## Quickstart (minimal)

The smallest setup: a free-draw canvas with no toolbars.

```tsx
import { ReactDraw, freeDrawTool } from "@jzohdi/react-draw";

export default function MyComponent() {
  return (
    <ReactDraw
      drawingTools={[freeDrawTool]}
      actionTools={[]}
      hideTopBar={true}
      hideBottomBar={true}
    />
  );
}
```

## Full example (all tools + style controls)

```tsx
import {
  ReactDraw,
  // drawing tools
  selectTool,
  freeDrawTool,
  squareTool,
  circleTool,
  diamondTool,
  straightLineTool,
  arrowTool,
  textAreaTool,
  // action tools
  undoTool,
  redoTool,
  trashTool,
  duplicateTool,
  bringBackTool,
  bringForwardTool,
  // style components
  ColorStyle,
  BackgroundStyle,
  LineWidthStyle,
  OpacityStyle,
  FontSizeStyle,
  // menu components
  ClearAllButton,
} from "@jzohdi/react-draw";

const styleComponents = {
  color: { order: 3, component: ColorStyle },
  background: { order: 4, component: BackgroundStyle },
  lineWidth: { order: 1, component: LineWidthStyle },
  opacity: { order: 0, component: OpacityStyle },
  fontSize: { order: 2, component: FontSizeStyle },
}

export default function App() {
  return (
    <ReactDraw
      drawingTools={[
        selectTool,
        freeDrawTool,
        squareTool,
        circleTool,
        diamondTool,
        straightLineTool,
        arrowTool,
        textAreaTool,
      ]}
      actionTools={[
        undoTool,
        redoTool,
        trashTool,
        duplicateTool,
        bringBackTool,
        bringForwardTool,
      ]}
      shouldSelectAfterCreate={true}
      styleComponents={styleComponents}
      menuComponents={[ClearAllButton]}
    >
      {/* Optional children overlay inside the drawing area */}
    </ReactDraw>
  );
}
```

## Save and load (serialization)

```ts
import {
  serializeObjects,
  deserializeData,
  serializeFreeDraw,
  deserializeFreeDraw,
  Serializers,
  Deserializers,
  freeDrawTool,
} from "@jzohdi/react-draw";

const serializers: Serializers = {
  [freeDrawTool.id]: serializeFreeDraw,
};

const deserializers: Deserializers = {
  [freeDrawTool.id]: deserializeFreeDraw,
};

// Save: returns a string you can persist to localStorage or a DB
const saved = serializeObjects(serializers, ctx);

// Load: restore previously saved state
deserializeData(saved, deserializers, ctx);
```

See the Storybook guide: [Serialization (Saving + Loading)][serialization]

## API (overview)

Key props on `ReactDraw`:

- `drawingTools` (required): array of Drawing Tools to enable (e.g., `selectTool`, `freeDrawTool`).
- `actionTools` (required): array of Action Tools for the bottom bar (e.g., `undoTool`, `redoTool`).
- `layout` (optional): `"default" | "fit" | { width: number|string, height: number|string }`.
- `hideTopBar`, `hideBottomBar` (optional): hide toolbars.
- `shouldKeepHistory` (optional, default true): enable undo/redo history.
- `shouldSelectAfterCreate` (optional, default true): auto-select newly created objects.
- `isResponsive` (optional): resizes objects when the container size changes.
- `shouldCornerResizePreserveRatio` (optional): preserve aspect ratio when resizing from corners.
- `styleComponents` (optional): map of style editors to display (color, lineWidth, opacity, fontSize).
- `menuComponents` (optional): custom components rendered in the bottom menu.
- `onLoad` (optional): callback with the `ReactDrawContext` when ready (good for initial load/deserialize).
- `contextGetter` (optional): receive a getter function to access the live `ReactDrawContext` from outside.
- `styles`, `classNames` (optional): customize built-in UI via style/className maps.
- `id` (optional, default "main"): unique identifier for the drawing area.

Types are exported from the package and documented in Storybook. For full definitions, see `src/types.ts` in the repo and the [Type Descriptions][types] page.

### Tools and toolbars

- Drawing tools render in the top toolbar by default; action tools render in the bottom toolbar.
- You can explicitly place and order tools via the `postition` property on a tool:

```ts
postition?: { view: "top" | "bottom"; order?: number };
```

> Note: tools without `postition` default to top (drawing) or bottom (action) based on their type.

## Styling and theming

Use the `styles` and `classNames` props to customize built-in UI elements. The keys correspond to constants exported by the library (e.g., `toolIconWrapper`, `bottomToolButton`, `menuContainer`, etc.).

```tsx
const styles = {
  toolIconWrapper: { "&:hover": { backgroundColor: "#eee" } },
  bottomToolButton: {
    '&[data-disabled="false"]:hover': { backgroundColor: "#000" },
    '&[data-disabled="false"]:hover > svg path': { fill: "#fff", stroke: "#fff" },
  },
}

<ReactDraw
  drawingTools={[selectTool, freeDrawTool]}
  actionTools={[undoTool, redoTool]}
  styles={styles}
/>
```

The bottom bar can also show style editors (`styleComponents`) such as color, line width, opacity, and font size.

## Next.js / SSR

The component is client-side. In Next.js, dynamically import it client-only:

```ts
import dynamic from "next/dynamic";
const ReactDraw = dynamic(() => import("@jzohdi/react-draw").then(m => m.ReactDraw), { ssr: false });
```

See the Next.js example in `examples/`.

## FAQ

- How do I keep bundle size small?
  - Import only the tools you need. The package ships ESM/CJS builds for tree-shaking.
- Can I add my own tools?
  - Yes. Implement a `DrawingTools` or `ActionTools` object. See the Storybook pages: [Drawing Tools][drawing-tools].
- Can I control the canvas from outside ReactDraw?
  - Yes. Use `contextGetter` to get a live `ReactDrawContext`, then call utilities like `createCircle`, `createImage`, `selectAll`, or serialization APIs. See the “External Controls” story.
- Does it support touch?
  - Yes, mouse and touch are supported.
- How do I save and load?
  - Use `serializeObjects` and `deserializeData` with tool-specific (de)serializers. See [Serialization][serialization].
- Can I change default styles for new objects?
  - When nothing is selected, updates via style controls set defaults for future objects. When objects are selected, updates apply only to the selection.

## Contributing

Pull requests and issues are welcome!

## Local Development

We use [Storybook][4] for local development.

```bash
npm run storybook
```

Build the library and docs:

```bash
npm run add
```

## License

ISC — see the [License][1].

[1]: https://github.com/jzohdi/reactdraw/blob/main/LICENSE
[2]: https://jzohdi.github.io/reactdraw/?path=/docs/docs-introduction--docs
[3]: https://jzohdi.github.io/reactdraw/?path=/story/reactdraw--free-draw-only
[4]: https://storybook.js.org/
[drawing-tools]: https://jzohdi.github.io/reactdraw/?path=/story/reactdraw--playground
[serialization]: https://jzohdi.github.io/reactdraw/?path=/story/reactdraw--save-and-load-json
[types]: https://github.com/jzohdi/reactdraw/blob/main/src/types.ts
