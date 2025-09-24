import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Docs",
          [
            "Introduction",
            "Drawing Tools",
            "Type Descriptions",
            "Serialization (Saving + Loading)",
          ],
          "ReactDraw",
          ["Playground"],
        ],
      },
    },
    layout: "padded",
  },
};

export default preview;
