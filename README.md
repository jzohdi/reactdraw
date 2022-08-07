# reactdraw

A drawing library in react

[view storybook docs/demo here][2]

## Installation

```shell
npm install @jzohdi/react-draw
```

```shell
yarn add @jzohdi/react-draw
```

## Usage

The example below creates a bare free draw area with no other tools or options. See [demo][3]

```jsx
import { ReactDraw, freeDrawTool } from "@jzohdi/react-draw";

export default function MyComponent() {
  <div>
    <h1>Example page title</h1>
    <ReactDraw
      topBarTools={[freeDrawTool]}
      bottomBarTools={[]}
      hideBottomBar={true}
      hideTopBar={true}
    >
      ... any child you want can go inside the drawing area.
    </ReactDraw>
  </div>;
}
```

## Props

See [docs][2] for more info

```typescript
export type ReactDrawProps = {
  children?: ReactChild;
  layout?: LayoutOption;
  topBarTools: DrawingTools[];
  hideTopBar?: boolean;
  bottomBarTools: ActionTools[];
  hideBottomBar?: boolean;
  shouldKeepHistory?: boolean;
  shouldSelectAfterCreate?: boolean;
  id: string;
  styleComponents?: StyleComponents;
  menuComponents?: MenuComponent[];
};
```

## Contributing

Pull requests or issues are welcome!

## Local Development

Local development is done using [storybook][4]. After install dependencies:

```shell
npm run storybook
```

After changes are made create dist and docs:

```shell
npm run add
```

## License

ISC, see [License][1] for details

[1]: https://github.com/jzohdi/reactdraw/blob/main/LICENSE
[3]: https://jzohdi.github.io/reactdraw/?path=/docs/reactdraw--free-draw-only
[2]: https://jzohdi.github.io/reactdraw/?path=/story/introduction--page
[4]: https://storybook.js.org/
